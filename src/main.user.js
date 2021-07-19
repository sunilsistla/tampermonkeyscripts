// ==UserScript==
// @name         TDS 26QB
// @description  Autofills TDS form 26QB.
// @author       sunilkumar.sistla@gmail.com
// @namespace    sunilsistla/tds
// @version      0.1
// @match        https://onlineservices.tin.egov-nsdl.com/etaxnew/PopServlet*
// @downloadUrl  https://tmscripts-ssk.netlify.app/tds-26qb/main.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/tds-26qb/main.user.js
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	// Your code here...
	var configs;

	function isValidProfile(profile) {
		return !!profile.name;
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
			setTimeout(() => {
				r(true);
			}, ms);
		});
	}

	async function clickElement(element) {
		element.focus();
		element.click();
		await delay(200);
	}

	async function setInputElementValue(element, value) {
		clickElement(element);
		await delay(200);
		element.value = value === undefined || value === null ? '' : value;
		await delay(500);
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

		purchaserPANElement.focus();
		clickElement(purchaserPANElement);
		await delay(500);
		sellerPANElement.focus();
		clickElement(sellerPANElement);
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
			totalAmount: 'input[name="value_entered_user"]',
			basicTax: 'input[name="TDS_amt"]',
			tdsRate: 'input[name="TDS_rate"]',
			interest: 'input[name="interest"]',
			fee: 'input[name="fee"]',
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

		var bd = amountBreakdown(config.payment.amount);
		var prms = [];
		Object.entries(bd).forEach(([k, v]) => {
			prms.push(setInputElementValue(document.querySelector(`select[name="${k}"]`), v));
		});
		await Promise.all(prms);
		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.totalAmount), config.payment.amount);
		var tdsValue = (config.payment.amount * Number(document.querySelector(PAYMENT_SELECTOR.tdsRate).value)) / 100;
		var tdsAmount = Math.floor(tdsValue * 100) / 100;
		var totalTds = parseFloat(Math.round(tdsAmount * 100) / 100).toFixed(2);

		await setInputElementValue(document.querySelector(PAYMENT_SELECTOR.basicTax), totalTds);
	}

	async function fillForm(config) {
		await clickElement(document.querySelector('.steps ul[role="tablist"] li.first[role="tab"]'));
		await fillStep1(config);
		await clickAction('next');
		await fillStep2(config);
		await clickAction('next');
		await fillStep3(config);
		await clickAction('next');
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
				'<div class="alert alert-danger"><b>Invalid profile found</b><div>Profiles should have name, PAN, address</div></div>',
			);
			return;
		}

		// Form
		userInputForm.insertAdjacentHTML(
			'beforeEnd',
			`<form onsubmit="javascript:void(0)">
				<div class="form-group">
					<div class="control-label">Select profile</div>
					<div>
						<select class="form-control" id="${getId('profile')}">
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
						<select class="form-control" id="${getId('type')}">
							<option value="Lumpsum">Lumpsum</option>
							<option value="Installments">Installments</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Total amount paid</div>
					<div>
						<input class="form-control" type="number" value="0" id="${getId('amount')}" />
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Date of Payment</div>
					<div>
						<input class="form-control" type="date" id="${getId('date')}" />
					</div>
				</div>
				<div class="form-group">
					<div class="control-label">Date of Tax<div>
					<input class="form-control" type="date" id="${getId('tax-date')}" />
				</div>
				<div class="form-group">
					<div class="control-label">Payment Mode</div>
					<div class="form-check form-check-inline">
						<label class="form-check-label"><input class="form-check-input" type="radio" name="${getId(
							'mode',
						)}" value="online" checked> Online</label>
						<label class="form-check-label"><input class="form-check-input" type="radio" name="${getId(
							'mode',
						)}" value="offline"> Offline</label>
					</div>
				</div>
				<div class="form-group text-right" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eaeded">
					<input id="${getId('fill-form')}" type="button" class="btn btn-primary" value="Fill form" />
				</div>
			</form>`,
		);

		var profileEle = document.getElementById(getId('profile'));
		var profileEleHelp = document.getElementById(getId('profile-description'));
		profileEle.addEventListener('change', (event) => {
			var profile = configs[parseInt(event.target.value)];
			profileEleHelp.innerHTML = '';
			profileEleHelp.insertAdjacentHTML('beforeEnd', profile.property.name);
		});
		profileEle.dispatchEvent(new Event('change'));
		document.getElementById(getId('fill-form')).addEventListener('click', () => {
			var index = parseInt(document.getElementById('tds_helper_payment_profile').value);
			fillForm(configs[index]);
		});
	}

	setTimeout(() => {
		document.TDSHelper = document.TDSHelper || {};
		document.TDSHelper.Form26QB = document.TDSHelper.Form26QB || {};
		configs = document.TDSHelper.Form26QB.profiles;
		createUserInputForm();
	}, 500);
})();
