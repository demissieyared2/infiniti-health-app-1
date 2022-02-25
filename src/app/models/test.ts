import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Patient} from "./patient";

export class Test {
    id: number;
    patient: Patient; // First name, last name, email ... 
    date: number;
    notified: boolean;
    specimen: string;
    specimenId: string;
    resulted: number;
    jobTitle: string;
    managerName: string;
    primaryDistrict: string;   
    caseNumber: number;
    caseType: string;
    returnDate: NgbDate;
    callDate: NgbDate;
    comment: string;
    schoolCurrentlyWorkingIn: string;
    currentLocation: string;
    drive: string;
    hoursWorkedStartTime: NgbDate;
    hoursWorkedEndTime: NgbDate;
    symptoms: string;
    dateOfInitialContactTracing: NgbDate;
    clinicianPerformingContactTracing: string;
    onGoingCaseNote: string;
    isTestedForCovid: boolean;
    dateOfPcrTest: NgbDate;
    isVaccinated: boolean; // TODO: How to save vaccination record;
    wearsMask: boolean;
    sitsWithOthers: boolean;
    worksiteGuidelinesComments: string;
    hadCloseContactWithSomeoneWhoHasCovid: boolean;
    hasTraveledOutsideTheCountry: boolean;
    closeContacts: string;
    closeContactsDetails: string; 
    worePersonalProtectiveEquipment: boolean;
    hasQuarantined: boolean;
    comments: string;
    quarantineStartDate: NgbDate;
    returnToWorkDate: NgbDate;
    daysquarantined: NgbDate;
    dateOfFollowUpContactTracing: NgbDate;
}
