// ==UserScript==
// @name         TDS Profiles - Anil
// @namespace    ssk/tds
// @version      0
// @description  TDS 26QB profiles
// @author       anilksistla@gmail.com
// @match        https://onlineservices.tin.egov-nsdl.com/etaxnew*
// @downloadUrl  https://tmscripts-ssk.netlify.app/tds-26qb/profiles/anilsistla.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/tds-26qb/profiles/anilsistla.user.js
// @grant        none
// ==/UserScript==

const PROFILES = [
	{
		name: '',
		taxApplicable: '0021',
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
				city: 'Hyderabad',
				state: 'TELANGANA',
				pin: '500044',
			},
			email: '',
			phone: '',
		},
		seller: {
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
		property: {
			name: '',
			type: 'Building',
			address: {
				line1: '',
				line2: '',
				road: '',
				city: 'Hyderabad',
				state: '',
				pin: '',
			},
		},
		agreement: {
			date: 'DD-MM-YYYY',
			totalValue: '',
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

