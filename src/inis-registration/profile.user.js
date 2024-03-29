// ==UserScript==
// @name         INIS Profiles
// @namespace    ssk/inis
// @build      	 1
// @description  INIS registration profiles
// @author       sunilkumar.sistla@gmail.com
// @match        https://burghquayregistrationoffice.inis.gov.ie/*
// @downloadUrl  https://tmscripts-ssk.netlify.app/inis-registration/profile.user.js
// @grant        none
// ==/UserScript==

const Category = {
    All: 'All'
};
const SubCategory = {
    All: 'All'
};
const Salutation = {
    Mr: 'Mr',
    Mrs: 'Mrs',
    Miss: 'Miss',
    Ms: 'Ms',
    Dr: 'Dr'
};
const FamilyApplication = {
    No: 'No',
    Yes: 'Yes'
};
const TravelDocumentReason = {
    None: '',
    RefugeeOfIreland: 'I am a recognised refugee in Ireland',
    PassportExpired: 'My passport has expired',
    Other: 'Other',
    NoSupportFromEmbassy: 'My embassy cannot/will not help me get my passport renewed',
};

const PROFILES = [
	{
		name: 'Profile 1', // Unique name to easily identify a profile
        category: Category.All,
        subCategory: SubCategory.All,
        gnibCardNumber: 'xxxxxx',
        travelDocumentNumber: '', // Your travel document number
        travelDocumentReason: TravelDocumentReason.None,
        isFamilyApplication: FamilyApplication.No, // Yes/ No
        familyMembersCount: 1,
        applicant: {
            salutation: Salutation.Mr,
            givenName: '',
            middleName: '',
            surName: '',
            dob: '31/12/2001', // December 31, 2001 DD/MM/YYYY format
            nationality: '', // Pick this from website
            email: '',
        },
	},
];


/* DONOT CHANGE ANYTHING BELOW THIS LIINE */
(function () {
    'use strict';

    document.INIS = document.INIS || {};
    document.INIS.RegistrationForm = document.INIS.RegistrationForm || {};
    document.INIS.RegistrationForm.profiles = PROFILES;
})();


