import {Component, Injectable, OnInit} from '@angular/core';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpService} from "../../../http.service";
import {SchoolService} from "../../../services/school.service";
import {UserService} from "../../../user.service";
import {Router} from "@angular/router";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {VaccinationRecord} from "../../../models/vaccination-record";
import {VaccineOption} from "../../../models/vaccine-option";
import {VaccineService} from "../../../services/vaccine.service";
import {FileStorage} from "../../../models/file-storage";

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct | null {
        if (value) {
            let date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10)
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
    }
}

@Component({
    selector: 'app-vaccination',
    templateUrl: './vaccination.component.html',
    styleUrls: ['./vaccination.component.css'],
    providers: [
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class VaccinationComponent implements OnInit {

    record: VaccinationRecord;
    searching: boolean;
    resultOptions: string[];
    compliance: { display: string, value: boolean }[];
    progress: number;
    submitStatus: string;

    loaded: number;
    page: number;
    receivedVaccine: string;
    vaccineFile: FileStorage;
    boosterFile: FileStorage;
    certified: boolean;

    maxDate: NgbDateStruct;
    validation: { vaccineType: boolean, date: boolean, location: boolean, result: boolean, picture: boolean };
    vaccineOptions: VaccineOption[];

    constructor(private http: HttpService, private search: SchoolService, private user: UserService,
                private router: Router, private httpClient: HttpClient, private vaccines: VaccineService) {

        this.validation = {vaccineType: false, date: false, location: false, result: false, picture: false}
        this.vaccineOptions = this.vaccines.getOptions();
        this.page = 0;
        this.certified = false;
        const today = new Date();
        this.maxDate = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
    }

    ngOnInit(): void {
        // retrieve record from server (if any existing)
        this.http.get('users/' + this.user.getUser().id + '/vaccines').subscribe((result: VaccinationRecord) => {
            console.log(result);

            if (result) {
                this.record = result;
                this.receivedVaccine = result.vaccinated ? 'YES' : 'NO';
            } else {
                this.record = new VaccinationRecord();
            }
        })
    }

    modelChange(): void {
    }

    dateSelected(value: NgbDate): void {
        this.modelChange();
    }

    onFileSelected(event, type: string): void {
        const file: File = event.target.files[0];
        if (!file)
            return;

        const formData = new FormData();
        formData.append('file', file);

        const params = new HttpParams();
        const headers = new HttpHeaders({'X-IH-Authentication-SessionId': this.user.getUser().sessionId});
        const options = {
            headers,
            params,
            reportProgress: true
        };

        const request = new HttpRequest('POST', environment.apiUrl + '/files', formData, options);
        this.httpClient.request(request).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.loaded = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
                const data: any = event.body; // {id: number, identifier: string}
                if (type === 'VACCINE')
                    this.vaccineFile = data;
                else
                    this.boosterFile = data;

                this.modelChange();
                console.log('server response', data);
            }
        });
    }

    submit(): void {
        this.submitStatus = "PENDING";

        // first dose date
        if (this.record.firstDoseDate) {
            this.record.firstDose = this.parseDateString(this.record.firstDoseDate);
            console.log(this.record.firstDose);
        }

        // second dose date
        if (this.record.secondDoseDate) {
            this.record.secondDose = this.parseDateString(this.record.secondDoseDate);
            console.log(this.record.secondDose);
        }

        // booster dose date
        if (this.record.boosterDoseDate) {
            this.record.boosterDose = this.parseDateString(this.record.boosterDoseDate);
            console.log(this.record.boosterDose);
        }

        this.http.post('users/' + this.user.getUser().id + '/vaccines', this.record).subscribe((result: VaccinationRecord) => {
            this.submitStatus = "SUCCESS";
        }, error => {
            this.submitStatus = "FAILED";
        })
    }

    private parseDateString(ngbDate: NgbDateStruct): number {
        let dataString = ngbDate.year + '-' + ("0" + ngbDate.month).slice(-2) + '-' +
            ("0" + ngbDate.day).slice(-2)
        dataString += ('T' + ("00").slice(-2) + ':' + ("00").slice(-2));
        return Date.parse(dataString);
    }

    setAnswer(answer: boolean): void {
        this.record.vaccinated = answer;
        if (answer) {
            this.receivedVaccine = "YES";
        } else {
            // no vaccine status and therefore no information to submit. user is done in this case
            this.receivedVaccine = "NO";
        }
    }

    /**
     * Previous button clicked
     */
    previous(): void {
        if (this.page === 0)
            return;

        this.page -= 1;
    }

    /**
     * "Next" button clicked. Validates information for current page before advancing
     */
    next(): void {
        this.page += 1;
    }

    /**
     * Determines whether the submit button should be disabled or not
     */
    disableSubmit(): boolean {
        // vaccinated question answered?
        if (this.receivedVaccine)
            return false;

        return true;
    }

    clearVaccinationFile(): void {
        this.vaccineFile = undefined;
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}
