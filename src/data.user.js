// ==UserScript==
// @name         TDS 26QB Profiles
// @namespace    sunilsistla/tds
// @version      0.1
// @description  TDS 26QB profiles
// @author       sunilkumar.sistla@gmail.com
// @match        https://onlineservices.tin.egov-nsdl.com/etaxnew*
// @downloadUrl  https://tampermonkey.z13.web.core.windows.net/tds-26qb/data.user.js
// @grant        none
// ==/UserScript==

const PROFILES = [
	{
		name: 'Profile 1',
		taxApplicable: '0021', // Individual
		statusOfSeller: 'Indian',
		multiplePurchasers: 'No',
		multipleSellers: 'No',
		purchaser: {
			name: '',
			PAN: '',
			address: {
				line1: '',
				line2: '',
				road: '',
				city: '',
				state: '',
				pin: '',
			},
			email: '',
			phone: '',
		},
		seller: {
			name: 'Builder',
			PAN: '',
			address: {
				line1: '',
				line2: '',
				road: '',
				city: '',
				state: '',
				pin: '',
			},
			email: '',
			phone: '',
		},
		property: {
			name: '',
			type: '',
			address: {
				line1: '',
				line2: '',
				road: '',
				city: '',
				state: '',
				pin: '',
			},
		},
		agreement: {
			date: '31-01-2021', // January 31, 2021
			totalValue: '6000000', // 60 Lakhs
		},
		payment: {
			type: 'Installments',
			dateOfPayment: '15-03-2021',
			dateOfTax: '15-03-2021',
			amount: 1000000,
		},
	},
];

/* DONOT CHANGE ANYTHING BELOW THIS LIINE */
(function () {
	'use strict';

	document.TDSHelper = document.TDSHelper || {};
	document.TDSHelper.Form26QB = document.TDSHelper.Form26QB || {};
	document.TDSHelper.Form26QB = {
		profiles: PROFILES,
	};
})();
