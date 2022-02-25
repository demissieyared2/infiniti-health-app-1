import {Injectable} from '@angular/core';
import {VaccineOption} from "../models/vaccine-option";

@Injectable({
    providedIn: 'root'
})
export class VaccineService {

    private options: VaccineOption[] = [{
        label: 'Pfizer-BioNTech',
        value: 'PFIZER'
    }, {
        label: 'Moderna',
        value: 'MODERNA'
    }, {
        label: 'Johnson & Johnson\'s Janssen',
        value: 'JANSSEN'
    }];

    constructor() {
    }

    getOptions(): VaccineOption[] {
        return this.options;
    }

}
