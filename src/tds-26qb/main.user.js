// ==UserScript==
// @name         TDS 26QB
// @description  Autofills TDS form 26QB.
// @author       sunilkumar.sistla@gmail.com
// @namespace    ssk/tds
// @version      2
// @match        https://onlineservices.tin.egov-nsdl.com/etaxnew/PopServlet*
// @downloadUrl  https://tmscripts-ssk.netlify.app/tds-26qb/main.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/tds-26qb/main.user.js
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
	'use strict';
	// Your code here...

	GM_registerMenuCommand('Help', function () {
		window.open('https://tmscripts-ssk.netlify.app/tds-26qb/', '_blank');
	});

	if (window.location.href.indexOf('https://onlineservices.tin.egov-nsdl.com/etaxnew/PopServlet') === -1) {
		return;
	}
	var configs;
	var delayInterval = 50;

	function isValidProfile(profile) {
		return !!profile.name && !!profile.purchaser.PAN && !!profile.seller.PAN;
	}

	function formatNumber(num) {
		var format = `${`000${num % 100}`.substr(-3)}`;
		num = Math.floor(num / 1000);
		while (num > 0) {
			format = `${`00${num % 100}`.substr(-2)},${format}`;
			num = Math.floor(num / 100);
		}
		return format;
	}

	function amountBreakdown(v) {
		const result = {
			Crores: 0,
			Lakh: 0,
			Thousands: 0,
			Hundreds: 0,
			Tens: 0,
			Ones: 0,
		};
		result.Ones = v % 10;
		v = parseInt(v / 10);
		result.Tens = v % 10;
		v = parseInt(v / 10);
		result.Hundreds = v % 10;
		v = parseInt(v / 10);
		result.Thousands = v % 100;
		v = parseInt(v / 100);
		result.Lakh = v % 100;
		v = parseInt(v / 100);
		result.Crores = v;
		return result;
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

	async function clickAction(action) {
		var SEL = `.wizard .actions [aria-label="Pagination"] a[role="menuitem"][href="#${action}"]`;
		await clickElement(document.querySelector(SEL));
	}

	async function fillStep1(config) {
		var SELECTOR = {
			taxApplicable: `input[name="MajorHead"][value="${config.taxApplicable}"]`,
			sellerStatus: `input[name="NRICheck"][value="${config.statusOfSeller}"]`,
			purchaserPAN: 'PAN_purchaser',
			purchaserPANConfirmation: 'input[name="PAN_purchaser_confirm"]',
			sellerPAN: 'PAN_seller',
			sellerPANConfirmation: 'input[name="PAN_seller_confirm"]',
		};

		await clickElement(document.querySelector(SELECTOR.taxApplicable));
		await clickElement(document.querySelector(SELECTOR.sellerStatus));

		var purchaserPANElement = document.getElementById(SELECTOR.purchaserPAN);
		await setInputElementValue(purchaserPANElement, config.purchaser.PAN);
		await setInputElementValue(document.querySelector(SELECTOR.purchaserPANConfirmation), config.purchaser.PAN);

		var sellerPANElement = document.getElementById(SELECTOR.sellerPAN);
		await setInputElementValue(sellerPANElement, config.seller.PAN);
		await setInputElementValue(document.querySelector(SELECTOR.sellerPANConfirmation), config.seller.PAN);
	}

	async function fillStep2(config) {
		var BUYER_SELECTOR = {
			line1: 'input[name="Add_Line1"]',
			line2: 'input[name="Add_Line2"]',
			road: 'input[name="Add_Line3"]',
			city: 'input[name="Add_Line5"]',
			state: 'select[name="Add_State"]',
			pin: 'input[name="Add_PIN"]',
			email: 'input[name="Add_EMAIL"]',
			phone: 'input[name="Add_MOBILE"]',
			moreBuyers: 'select[name="Buyer"]',
		};

		var SELLER_SELECTOR = {
			line1: 'input[name="transferer_Add_Line1"]',
			line2: 'input[name="transferer_Add_Line2"]',
			road: 'input[name="transferer_Add_Line3"]',
			city: 'input[name="transferer_Add_Line5"]',
			state: 'select[name="transferer_Add_State"]',
			pin: 'input[name="transferer_Add_PIN"]',
			email: 'input[name="transferer_Add_EMAIL"]',
			phone: 'input[name="transferer_Add_MOBILE"]',
			moreSellers: 'select[name="Seller"]',
		};

		await setInputElementValue(document.querySelector(BUYER_SELECTOR.line2), config.purchaser.address.line2);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.line1), config.purchaser.address.line1);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.road), config.purchaser.address.road);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.city), config.purchaser.address.city);
		await setInputElementValue(
			document.querySelector(BUYER_SELECTOR.state),
			config.purchaser.address.state.toUpperCase(),
		);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.pin), config.purchaser.address.pin);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.email), config.purchaser.email);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.phone), config.purchaser.phone);
		await setInputElementValue(document.querySelector(BUYER_SELECTOR.moreBuyers), config.multiplePurchasers || 'No');

		await setInputElementValue(document.querySelector(SELLER_SELECTOR.line2), config.seller.address.line2);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.line1), config.seller.address.line1);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.road), config.seller.address.road);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.city), config.seller.address.city);
		await setInputElementValue(
			document.querySelector(SELLER_SELECTOR.state),
			config.seller.address.state.toUpperCase(),
		);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.pin), config.seller.address.pin);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.email), config.seller.email);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.phone), config.seller.phone);
		await setInputElementValue(document.querySelector(SELLER_SELECTOR.moreSellers), config.multipleSellers || 'No');
	}

	async function fillStep3(config) {
		var PROPERTY_SELECTOR = {
			type: 'select[name="propertyType"]',
			line1: 'input[name="p_Add_Line1"]',
			line2: 'input[name="p_Add_Line2"]',
			road: 'input[name="p_Add_Line3"]',
			city: 'input[name="p_Add_Line5"]',
			state: 'select[name="p_Add_State"]',
			pin: 'input[name="p_Add_PIN"]',
		};
		var AGREEMENT_SELECTOR = {
			date: 'select[name="agmt_day"]',
			month: 'select[name="agmt_month"]',
			year: 'select[name="agmt_year"]',
			totalValue: 'input[name="totalPropertyValue"]',
		};
		var PAYMENT_SELECTOR = {
			type: 'select[name="paymentType"]',
			date: 'select[name="pymntDay"]',
			month: 'select[name="pymntMonth"]',
			year: 'select[name="pymntYear"]',
			taxDate: 'select[name="deductionDay"]',
			taxMonth: 'select[name="deductionMonth"]',
			taxYear: 'select[name="deductionYear"]',
			taxRate: 'select[name="tds_higher_rate"]',
			totalAmount: 'input[name="value_entered_user"]',
			basicTax: 'input[name="TDS_amt"]',
			tdsRate: 'input[name="TDS_rate"]',
			interest: 'input[name="interest"]',
			fee: 'input[name="fee"]',
            isHigherStampDutyConsideration: '[name="higherstampdutyconsideration"]',
			stampDuty: 'input[name="stampdutyvalue"]',
			isLastInstallment: 'select[name="lastinstallment"]',
            previousPaymentsTotal: 'input[name="totalamountinpreviousinstallment"]',
		};

		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.type), config.property.type);
		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.line2), config.property.address.line2);
		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.line1), config.property.address.line1);
		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.road), config.property.address.road);
		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.city), config.property.address.city);
		await setInputElementValue(
			document.querySelector(PROPERTY_SELECTOR.state),
			config.property.address.state.toUpperCase(),
		);
		await setInputElementValue(document.querySelector(PROPERTY_SELECTOR.pin), config.property.address.pin);

		var [aggD, aggM, aggY] = config.agreement.date.split('-').map(Number);
		await setInputElementValue(document.querySelector(AGREEMENT_SELECTOR.date), aggD);
		await setInputElementValue(document.querySelector(AGREEMENT_SELECTOR.month), aggM - 1);
		await setInputElementValue(document.querySelector(AGREEMENT_SELECTOR.year), aggY);
		await setInputElementValue(document.querySelector(AGREEMENT_SELECTOR.totalValue), config.agreement.totalValue);

		[aggD, aggM, aggY] = config.payment.dateOfPayment.split('-').map(Number);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.type), config.payment.type);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.date), aggD);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.month), aggM - 1);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.year), aggY);

		[aggD, aggM, aggY] = config.payment.dateOfTax.split('-').map(Number);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.taxDate), aggD);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.taxMonth), aggM - 1);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.taxYear), aggY);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.taxRate), config.payment.higherTaxRate ? 'Yes' : 'No');

		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.isLastInstallment), config.agreement.isLastInstallment);
		if (config.agreement.isLastInstallment === 'Yes') {
            await delay(200);
			await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.stampDuty), config.agreement.stampDuty);
			await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.isHigherStampDutyConsideration), config.agreement.isHigherStampDutyConsideration);
		}
        await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.previousPaymentsTotal), config.agreement.previousPaymentsTotal);


		var bd = amountBreakdown(config.payment.amount);
		var prms = [];
		Object.entries(bd).forEach(([k, v]) => {
			prms.push(setInputElementValue(document.querySelector(`select[name="${k}"]`), v));
		});
		await Promise.all(prms);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.totalAmount), config.payment.amount);
		var tdsValue = (config.payment.amount * Number(document.querySelector(PAYMENT_SELECTOR.tdsRate).value)) / 100;
		var tdsAmount = Math.floor(tdsValue * 100) / 100;
		var totalTds = Math.ceil(Math.round(tdsAmount * 100) / 100);

		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.basicTax), totalTds);
	}

	async function fillForm(config) {
		await clickElement(document.querySelector('.steps ul[role="tablist"] li.first[role="tab"] a'));
		await delay(1000);
		await fillStep1(config);
		await clickAction('next');
		await fillStep2(config);
		await clickAction('next');
		await fillStep3(config);
		alert('Form has been flled. Check your details, click "next" and proceed to payment.');
	}

	async function createUserInputForm() {
		const getResourceLink = (resourcePath) => `https://tmscripts-ssk.netlify.app/tds-26qb/${resourcePath}`;
		var getId = (...id) => ['tm_script_tds_payment', ...id].filter(Boolean).join('_');

		// Wrapper
		var userInputForm = document.createElement('div');
		userInputForm.classList.add('tds-filing-helper');
		userInputForm.id = getId('wrapper');
		Object.assign(userInputForm.style, {
			position: 'fixed',
			backgroundColor: 'white',
			borderTop: '1px solid #eaeded',
			boxShadow: '0 1px 1px 0 rgb(0 28 36 / 30%), 1px 1px 1px 0 rgb(0 28 36 / 15%), -1px 1px 1px 0 rgb(0 28 36 / 15%)',
			left: '10px',
			top: '10px',
			width: '280px',
			padding: '10px 10px 0',
		});
		document.body.append(userInputForm);

		// Header
		userInputForm.insertAdjacentHTML(
			'afterBegin',
			`<h4 class="h4" style="border-bottom: 1px solid #eaeded; padding-bottom: 5px; margin-top: 0px;">
			<button id="${getId('expand-collapse-btn')}" style="border: none; margin: 0 -3px; padding: 3px 5px; font-size: 14px;" type="button" class="btn btn-default btn-sm fa fa-chevron-up"></button>
			Payment Details
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
				'<div class="alert alert-danger"><b>Invalid profile found</b><div>Profiles should have name, PAN, address</div></div>',
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
					<div class="control-label">Type of payment</div>
					<div>
						<select required class="form-control" id="${getId('type')}">
							<option value="Installments">Installments</option>
							<option value="Lumpsum">Lumpsum</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Total amount paid <i><small>(excluding GST)</small></i></div>
					<div>
						<input min="1" required class="form-control" type="number" id="${getId('amount')}" />
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Date of Payment</div>
					<div>
						<input required pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" class="form-control"
						placeholder="${todayString}" id="${getId('date')}" value="${todayString}" />
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Date of Tax<div>
					<input required pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" class="form-control" placeholder="${todayString}" id="${getId('tax-date')}" value="${todayString}" />
				</div>
				<!--
				<div class="form-check">
					<input class="form-check-input" type="checkbox" disabled name=${getId('higher-tax-rate')} id="${getId('higher-tax-rate')}">
					<label class="form-check-label" for="${getId('higher-tax-rate')}">Higher Tax rate?</label>
				</div>
				-->
				<div class="form-group text-right" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eaeded">
					<input id="${getId('fill-form')}" type="submit" class="btn btn-primary" value="Fill form" />
				</div>
			</form>`,
		);

		// elements
		var userForm = document.getElementById(getId('form'));
		var profileSelect = document.getElementById(getId('profile'));
		var profileHelpSpan = document.getElementById(getId('profile-description'));
		var paymentTypeSelect = document.getElementById(getId('type'));
		var paymentAmountInput = document.getElementById(getId('amount'));
		var paymentDateInput = document.getElementById(getId('date'));
		var paymentTaxDateInput = document.getElementById(getId('tax-date'));
		var higherTaxRateCheckbox = document.getElementById(getId('higher-tax-rate'));
		var formSubmitBtn = document.getElementById(getId('fill-form'));
		var expandCollapseBtn = document.getElementById(getId('expand-collapse-btn'));

		// event handlers
		profileSelect.addEventListener('change', (event) => {
			var profile = configs[parseInt(event.target.value)];
			profileHelpSpan.innerHTML = '';
			profileHelpSpan.insertAdjacentHTML('beforeEnd', profile.property.name);
			paymentAmountInput.value = profile.installmentAmount;
		});
		paymentDateInput.addEventListener('change', (event) => {
			paymentTaxDateInput.value = event.target.value;
		});
		formSubmitBtn.addEventListener('click', async function () {
			if (!userForm.checkValidity()) {
				userForm.reportValidity();
				return;
			}
			formSubmitBtn.disabled = true;
			var profile = configs[parseInt(profileSelect.value)];
			var payment = {
				type: paymentTypeSelect.value.trim(),
				dateOfPayment: paymentDateInput.value.trim(),
				dateOfTax: paymentTaxDateInput.value.trim(),
				amount: parseFloat(paymentAmountInput.value),
				higherTaxRate: !!(higherTaxRateCheckbox && higherTaxRateCheckbox.checked)
			};
			profile.payment = payment;
			await fillForm(profile);
			formSubmitBtn.disabled = false;
		});
		expandCollapseBtn.addEventListener('click', function() {
			userForm.classList.toggle('hidden');
			expandCollapseBtn.classList.toggle('fa-chevron-down');
			expandCollapseBtn.classList.toggle('fa-chevron-up');
		});


		// init
		profileSelect.dispatchEvent(new Event('change'));
	}

	setTimeout(() => {
		document.TDSHelper = document.TDSHelper || {};
		document.TDSHelper.Form26QB = document.TDSHelper.Form26QB || {};
		configs = document.TDSHelper.Form26QB.profiles;
		createUserInputForm();
	}, 500);
})();
