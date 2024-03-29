// ==UserScript==
// @name         TDS - Sunil
// @namespace    ssk/tds
// @version      4
// @description  TDS 26QB profiles
// @author       sunilkumar.sistla@gmail.com
// @match        https://onlineservices.tin.egov-nsdl.com/etaxnew*
// @downloadUrl  https://tmscripts-ssk.netlify.app/tds-26qb/profiles/sunilsistla.user.js
// @updateUrl    https://tmscripts-ssk.netlify.app/tds-26qb/profiles/sunilsistla.user.js
// @grant        none
// ==/UserScript==

const PROFILES = [
	{
		name: 'Eden C-1617',
		taxApplicable: '0021',
		statusOfSeller: 'Indian',
		multiplePurchasers: 'No',
		multipleSellers: 'No',
		installmentAmount: 803000,
		purchaser: {
			name: 'Sunil Kumar Sistla',
			PAN: 'DSYPS6938A',
			address: {
				line1: '1-9-485/98, 1 Floor',
				line2: 'Lalitha Nagar',
				road: 'Vidya Nagar',
				city: 'Hyderabad',
				state: 'TELANGANA',
				pin: '500044',
			},
			email: 'sunilkumar.sistla@gmail.com',
			phone: '9000219735',
		},
		seller: {
			name: 'Mysore Projects',
			PAN: 'AAGCM7611Q',
			address: {
				line1: 'World Trade Center',
				line2: '29, 30 Floor',
				road: 'Malleswaram',
				city: 'Bengaluru',
				state: 'Karnataka',
				pin: '560055',
			},
			email: 'enquiry@brigadegroup.com',
			phone: '8041379200',
		},
		property: {
			name: 'Brigade Cornerstone Utopia, C-1617',
			type: 'Building',
			address: {
				line1: 'BrigadeCornerstone Utopia',
				line2: 'Eden C-1617',
				road: 'Varthur Whitefield',
				city: 'Bengaluru',
				state: 'Karnataka',
				pin: '560087',
			},
		},
		agreement: {
			date: '29-03-2021',
			totalValue: '7468802',
			stampDuty: '311065',
			isLastInstallment: 'Yes',
			isHigherStampDutyConsideration: 'No',
			previousPaymentsTotal: '6441753',
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

