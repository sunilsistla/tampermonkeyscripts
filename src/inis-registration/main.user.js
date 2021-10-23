// ==UserScript==
// @name         INIS Helper
// @description  Autofills INIS registration forms
// @author       sunilkumar.sistla@gmail.com
// @namespace    ssk/inis
// @version      1
// @include      /.*/
// @downloadUrl  https://tmscripts-ssk.netlify.app/inis-registration/main.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/inis-registration/main.user.js
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    GM_registerMenuCommand('Help', function () {
        window.open('https://tmscripts-ssk.netlify.app/inis-registration/', '_blank');
    });

    const domain = 'burghquayregistrationoffice.inis.gov.ie';

    if (window.location.href.indexOf(domain) === -1) {
        return;
    }
    var configs;
    var delayInterval = 50;

    function isValidProfile(profile) {
        return !!profile.name &&
            !!profile.nationality &&
            !!profile.applicant &&
            !!profile.applicant.givenName &&
            !!profile.applicant.surName &&
            !!profile.applicant.dob &&
            !!profile.applicant.email &&
            !!(profile.travelDocumentNumber || profile.travelDocumentReason);
    }

    async function delay(ms) {
        await new Promise((r) => {
            setTimeout(() => r(true), ms);
        });
    }

    async function clickElement(element) {
        element.focus();
        element.click();
        await delay(delayInterval);
    }

    async function setInputElementValue(element, value) {
        clickElement(element);
        await delay(delayInterval);
        element.value = value === undefined || value === null ? '' : value;
        await delay(delayInterval);
        element.dispatchEvent(new Event('change'));
        element.blur();
    }

    async function lookForAppointment() {
        await clickElement(document.querySelector('#btLook4App'));
    }

    async function fillForm(config) {
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
            right: '20px',
            top: '120px',
            width: '280px',
            padding: '10px',
        });
        document.body.append(userInputForm);

        // Header
        userInputForm.insertAdjacentHTML(
            'afterBegin',
            `<h4 class="h4" style="border-bottom: 1px solid #eaeded; padding-bottom: 5px;">Payment Details
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
				<div class="form-group">
					<div class="control-label">Select profile</div>
					<div>
						<select value="0" required class="form-control" id="${getId('profile')}">
							${configs.map((x, i) => `<option value="${i}">${x.name}</option>`)}
						</select>
					<div>
						<small id="${getId('profile-description')}" class="text-muted"></small>
					</div>
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Preferred date</div>
					<div>
						<input required pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" class="form-control"
						placeholder="${todayString}" id="${getId('date')}" />
					</div>
				</div>
				<div class="form-group text-right" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eaeded">
					<input id="${getId('fill-form')}" type="submit" class="btn btn-primary" value="Fill form" />
				</div>
			</form>`,
        );

        // elements
        var userForm = document.getElementById(getId('form'));
        var profileSelect = document.getElementById(getId('profile'));
        var profileHelpSpan = document.getElementById(getId('profile-description'));
        var formSubmitBtn = document.getElementById(getId('fill-form'));

        // event handlers
        profileSelect.addEventListener('change', (event) => {
            var profile = configs[parseInt(event.target.value)];
            profileHelpSpan.innerHTML = '';
            profileHelpSpan.insertAdjacentHTML('beforeEnd', `${profile.applicant.givenName}, ${profile.applicant.surName}`);
        });
        formSubmitBtn.addEventListener('click', async function () {
            if (!userForm.checkValidity()) {
                userForm.reportValidity();
                return;
            }
            formSubmitBtn.disabled = true;
            var profile = configs[parseInt(profileSelect.value)];
            await fillForm(profile);
            formSubmitBtn.disabled = false;
        });

        // init
        profileSelect.dispatchEvent(new Event('change'));
    }

    setTimeout(() => {
        document.INIS = document.INIS || {};
        document.INIS.RegistrationForm = document.INIS.RegistrationForm || {};
        configs = document.INIS.RegistrationForm.profiles;
        createUserInputForm();
    }, 500);
})();
