// ==UserScript==
// @name         INIS Helper
// @description  Autofills INIS registration forms
// @author       sunilkumar.sistla@gmail.com
// @namespace    ssk/inis
// @version      1
// @match        https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/*
// @downloadUrl  https://tmscripts-ssk.netlify.app/inis-registration/main.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/inis-registration/main.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    var configs;
    var delayInterval = 50;
    const GM_KEY = 'ssk-inis-registration';

    function isValidProfile(profile) {
        return !!profile.name &&
            !!profile.applicant &&
            !!profile.applicant.givenName &&
            !!profile.applicant.surName &&
            !!profile.applicant.dob &&
            !!profile.applicant.nationality &&
            !!profile.applicant.email &&
            (!!profile.travelDocumentNumber || !!profile.travelDocumentReason) &&
            (profile.isFamilyApplication === 'No' || (profile.isFamilyApplication === 'Yes' && !!profile.familyMembersCount));
    }

    async function delay(ms) {
        await new Promise((r) => {
            setTimeout(() => r(true), ms);
        });
    }

    async function waitForFunction(cb, name) {
        await new Promise((r) => {
            let attempt = 1;
            var handle = setInterval(() => {
                if (cb()) {
                    clearInterval(handle);
                    r(true);
                    return;
                }
                console.log(name, 'failed attempt', attempt++);
            }, 200)
        });
    }

    async function clickElement(element) {
        element.focus();
        element.click();
        await delay(delayInterval);
    }


    async function setInputElementValue(element, value, config = { click: true }) {
        config.click && clickElement(element);
        await delay(delayInterval);
        element.value = value === undefined || value === null ? '' : value;
        await delay(delayInterval);
        element.dispatchEvent(new Event('change'));
        element.blur();
    }

    async function bookAppointment(config) {
        const SELECTOR = {
            lookForAppts: 'btLook4App',
            choice: 'AppSelectChoice',
            findAvailableAppts: 'btSrch4Apps',
            options: 'dvAppOptions',
            appDate: 'Appdate',
            submit: 'Submit',
        };

        await clickElement(document.getElementById(SELECTOR.lookForAppts));
        if (config.custom.preferredDate) {
            await setInputElementValue(document.getElementById(SELECTOR.choice, 'D'));
            const prefDt = config.custom.preferredDate.replaceAll('-', '/');
            await setInputElementValue(document.getElementById(SELECTOR.appDate), prefDt, { click: false });
        } else {
            await setInputElementValue(document.getElementById(SELECTOR.choice), 'S');
        }

        await clickElement(document.getElementById(SELECTOR.findAvailableAppts));
        await waitForFunction(() => {
            return document.getElementById(SELECTOR.options).querySelectorAll('button').length;
        }, 'looking for slots');

        await clickElement(document.getElementById(SELECTOR.options).querySelector('button'));
        await clickElement(document.getElementById(SELECTOR.submit));
    }

    async function fillForm(config) {
        const SELECTOR = {
            category: 'Category',
            subCategory: 'SubCategory',
            gnibNumber: 'GNIBNo',
            confirmTerms: 'UsrDeclaration',
            salutation: 'Salutation',
            givenName: 'GivenName',
            middleName: 'MidName',
            surName: 'SurName',
            dob: 'DOB',
            nationality: 'Nationality',
            email: 'Email',
            confirmEmail: 'EmailConfirm',
            isFamily: 'FamAppYN',
            familyNumber: 'FamAppNo',
            hasDocument: 'PPNoYN',
            documentNumber: 'PPNo',
            noDocumentReason: 'PPReason',
        };

        await setInputElementValue(document.getElementById(SELECTOR.category), config.category);
        await setInputElementValue(document.getElementById(SELECTOR.subCategory), config.subCategory);
        if (config.gnibCardNumber) {
            await setInputElementValue(document.getElementById(SELECTOR.gnibNumber), config.gnibCardNumber);
        }
        const confirmElement = document.getElementById(SELECTOR.confirmTerms);
        if (!confirmElement.checked) {
            await clickElement(document.getElementById(SELECTOR.confirmTerms));
        }
        await setInputElementValue(document.getElementById(SELECTOR.salutation), config.applicant.salutation);
        await setInputElementValue(document.getElementById(SELECTOR.givenName), config.applicant.givenName);
        if (config.applicant.middleName) {
            await setInputElementValue(document.getElementById(SELECTOR.middleName), config.applicant.middleName);
        }
        await setInputElementValue(document.getElementById(SELECTOR.surName), config.applicant.surName);
        await setInputElementValue(document.getElementById(SELECTOR.dob), config.applicant.dob, { click: false });
        await setInputElementValue(document.getElementById(SELECTOR.nationality), config.applicant.nationality);
        await setInputElementValue(document.getElementById(SELECTOR.email), config.applicant.email);
        await setInputElementValue(document.getElementById(SELECTOR.confirmEmail), config.applicant.email);
        await setInputElementValue(document.getElementById(SELECTOR.isFamily), config.isFamilyApplication);
        if (config.isFamilyApplication == 'Yes') {
            await setInputElementValue(document.getElementById(SELECTOR.familyNumber), config.familyMembersCount);
        }

        await setInputElementValue(document.getElementById(SELECTOR.hasDocument), config.travelDocumentNumber ? 'Yes' : 'No');
        if (config.travelDocumentNumber) {
            await setInputElementValue(document.getElementById(SELECTOR.documentNumber), config.travelDocumentNumber);
        } else {
            await setInputElementValue(document.getElementById(SELECTOR.noDocumentReason), config.travelDocumentReason);
        }

        window.scrollTo(0, document.body.getBoundingClientRect().height - 300);
        await delay(100);

        await bookAppointment(config);
    }

    async function createUserInputForm() {
        const getResourceLink = (resourcePath) => `https://tmscripts-ssk.netlify.app/inis-registration/${resourcePath}`;
        var getId = (...id) => ['inis_registration', ...id].filter(Boolean).join('_');

        // Wrapper
        var userInputForm = document.createElement('div');
        userInputForm.classList.add('inis-application-helper');
        userInputForm.id = getId('wrapper');
        Object.assign(userInputForm.style, {
            position: 'fixed',
            backgroundColor: 'white',
            borderTop: '1px solid #eaeded',
            boxShadow: '0 1px 1px 0 rgb(0 28 36 / 30%), 1px 1px 1px 0 rgb(0 28 36 / 15%), -1px 1px 1px 0 rgb(0 28 36 / 15%)',
            right: '40px',
            top: '120px',
            width: '280px',
            padding: '10px',
            zIndex: 99999,
        });
        document.body.append(userInputForm);

        // Header
        userInputForm.insertAdjacentHTML(
            'afterBegin',
            `<h4 class="h4" style="font-size: 18px; border-bottom: 1px solid #eaeded; padding-bottom: 5px;">Application details
			<small><a target="_blank" rel="noreferrer" class="pull-right" href="${getResourceLink('')}">help</a></small>
			</h4>`,
        );

        // Validations
        if (!configs || !Array.isArray(configs)) {
            userInputForm.insertAdjacentHTML(
                'beforeEnd',
                `<div class="alert alert-warning">
					<b>No profiles found.</b>
					<div>
						View <a target="_blank" rel="noreferrer" href="${getResourceLink('#setup')}">setup</a> to get started.
					</div>
				</div>`,
            );
            return;
        }

        if (!configs.every(isValidProfile)) {
            userInputForm.insertAdjacentHTML(
                'beforeEnd',
                '<div class="alert alert-danger"><b>Invalid profile found</b><div>Profiles should have name, applicant details and nationality.</div></div>',
            );
            return;
        }

        // Form
        var today = new Date();
        var todayString = [today.getDate(), today.getMonth() + 1, today.getUTCFullYear()]
            .map(String)
            .map((x) => `00${x}`.substr(-(x.length >= 2 ? x.length : 2)))
            .join('-');
        userInputForm.insertAdjacentHTML(
            'beforeEnd',
            `<form id="${getId('form')}" onsubmit="javascript:void(0)">
				<div class="form-group" style="margin-bottom: 10px">
					<div class="control-label" style="font-size: 13px;">Select profile</div>
					<div>
						<select value="0" required class="form-control" id="${getId('profile')}">
							${configs.map((x, i) => `<option value="${i}">${x.name}</option>`)}
						</select>
					<div style="line-height: 14px; margin-top: 5px;">
						<small id="${getId('profile-description')}" style="font-size: 10px;" class="text-muted"></small>
					</div>
					</div>
				</div>
				<div class="form-group" style="margin-bottom: 10px">
					<div class="control-label" style="font-size: 13px;">Preferred date</div>
					<div>
						<input pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" class="form-control"
						placeholder="${todayString}" id="${getId('preferred-date')}" />
					</div>
				</div>
				<div class="form-group" style="margin-bottom: 10px">
                    <div class="form-check">
                        <label class="form-check-label" style="font-size: 13px; font-weight: normal;">
                            <input class="form-check-input" type="checkbox" value="" id="${getId('retry')}"> Retry until booked
                        </label>
                    </div>
				</div>
				<div class="form-group text-right" style="margin-top: 10px; margin-bottom: 0; padding-top: 10px; border-top: 1px solid #eaeded">
                    <input id="${getId('fill-form')}" type="submit" class="btn btn-primary" value="Book" />
				</div>
			</form>`,
        );

        // elements
        var userForm = document.getElementById(getId('form'));
        var profileSelect = document.getElementById(getId('profile'));
        var dateToSelect = document.getElementById(getId('preferred-date'));
        var profileHelpSpan = document.getElementById(getId('profile-description'));
        var formSubmitBtn = document.getElementById(getId('fill-form'));
        var shouldRetry = document.getElementById(getId('retry'));

        // event handlers
        profileSelect.addEventListener('change', (event) => {
            var profile = configs[parseInt(event.target.value)];
            profileHelpSpan.innerHTML = '';
            profileHelpSpan.insertAdjacentHTML('beforeEnd',
                `${profile.applicant.givenName}, ${profile.applicant.surName} | ${profile.gnibCardNumber} | ${profile.travelDocumentNumber || 'No Travel Document'}`
            );
        });

        formSubmitBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!userForm.checkValidity()) {
                userForm.reportValidity();
                return;
            }
            formSubmitBtn.disabled = true;
            var profile = configs[parseInt(profileSelect.value)];
            profile.custom = {
                preferredDate: dateToSelect.value,
                retry: !!shouldRetry.checked,
            };

            GM_setValue(GM_KEY, {
                retry: !!shouldRetry.checked,
                preferredDate: dateToSelect.value,
                date: new Date().toISOString().substr(0, 10),
                gnibCardNumber: profile.gnibCardNumber,
            });

            await fillForm(profile);
            formSubmitBtn.disabled = false;
        });

        // init
        profileSelect.dispatchEvent(new Event('change'));
    }

    async function redirectToFormOnFailure() {
        const actionResult = document.getElementById('ActionResult');
        if (!actionResult || !actionResult.classList.contains('failureResult')) {
            return false;
        }
        console.log('failed attempt')
        const retryConfig = GM_getValue(GM_KEY);
        GM_getValue(GM_KEY, { ...retryConfig, status: 'failure' });
        await clickElement(document.querySelector('.errButtBack button'));
        return true;
    }

    async function autoFillForm() {
        if (!document.getElementById('Category')) {
            return false;
        }

        console.log('auto fill form and book');
        const config = GM_getValue(GM_KEY);
        GM_setValue(GM_KEY, { ...config, attempt: (config.attempt || 0) + 1 });

        const profile = configs.find(x => x.gnibCardNumber === config.gnibCardNumber);
        if (!profile) {
            console.log(config.gnibCardNumber, 'profile is not found. stopping now.');
            GM_setValue(GM_KEY, null);
            return;
        }
        profile.custom = {
            preferredDate: config.preferredDate,
            retry: config.retry,
        };
        await fillForm(profile);
    }

    setTimeout(async () => {
        document.INIS = document.INIS || {};
        document.INIS.RegistrationForm = document.INIS.RegistrationForm || {};
        configs = document.INIS.RegistrationForm.profiles;
        await createUserInputForm();

        const retryConfig = GM_getValue(GM_KEY);
        // retry only for a day
        if (retryConfig.date !== new Date().toISOString().substr(0, 10)) {
            console.log(retryConfig.date, 'expired. stopping retry now.');
            GM_setValue(GM_KEY, { ...retryConfig, retry: false });
            return;
        }
        if (!retryConfig || !retryConfig.retry) {
            console.log('auto retry is disabled');
            return;
        }
        // act on a page only if the previous page is not recognized
        let isRecognized = false;
        isRecognized || (isRecognized == await redirectToFormOnFailure());
        isRecognized ||(isRecognized == await autoFillForm());
    }, 500);
})();
