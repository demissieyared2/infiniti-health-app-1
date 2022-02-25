import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {User} from "./User";

export class VaccinationRecord {

    id: number;
    vaccinated: boolean;
    type: string;

    firstDoseDate: NgbDate;
    secondDoseDate: NgbDate;
    boosterDoseDate: NgbDate;

    cardFileId: string;
    cardFileName: string;
    boosted: boolean;
    secondDoseReceived: boolean;
    boosterCardLost: boolean;
    vaccineCardLost: boolean;

    account: User;
    created: number;
    firstDose: number;
    vaccineFileId: string;
    vaccineFileLost: boolean;
    secondDose: number;
    boosterDose: number;
    boosterType: string;
    boosterFileId: string;
    boosterFileLost: boolean;

    verified: boolean;
}