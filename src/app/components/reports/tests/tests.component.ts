import {Component, Injectable, OnInit} from '@angular/core';
import {District} from '../../../models/district';
import {School} from '../../../models/school';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {SchoolService} from '../../../services/school.service';
import {Router} from '@angular/router';
import {HttpService} from '../../../http.service';
import {Result} from '../../../models/Result';
import {LabTest} from '../../../models/lab-test';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {UserService} from '../../../user.service';
import {environment} from '../../../../environments/environment';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
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
    selector: 'app-tests',
    templateUrl: './tests.component.html',
    styleUrls: ['./tests.component.css'],
    providers: [
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class TestsComponent implements OnInit {

    districts: District[];
    availableSchools: School[];     // available schools by district
    retrievingSchools: boolean;
    test: LabTest;
    searching: boolean;
    departments: string[];
    resultOptions: string[];
    compliance: { display: string, value: boolean }[];
    progress: number;
    submittingReport: boolean;
    errorSubmitting: boolean;
    existingResultAvailable: boolean;
    resultFile: FileStorage;
    loaded: number;

    maxDate: NgbDateStruct;

    validation: { department: boolean, date: boolean, location: boolean, result: boolean, picture: boolean };

    constructor(private http: HttpService, private search: SchoolService, private user: UserService,
                private router: Router, private httpClient: HttpClient) {
        this.test = new LabTest();
        this.departments = ['Operations', 'Nursing'];
        this.resultOptions = ['Positive', 'Negative', 'Inconclusive'];
        const today = new Date();
        this.maxDate = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
        this.progress = 0;
        this.validation = {department: false, date: false, location: false, result: false, picture: false}
        this.resultFile = new FileStorage();
    }

    ngOnInit(): void {
        // check if there is a result available for today
        this.http.get('users/' + this.user.getUser().id + '/tests/today').subscribe((result: any) => {
            console.log(result);
            if (result.length) {
                this.existingResultAvailable = true;
            }
        });

        // retrieve available
        this.http.get('districts').subscribe((result: Result<District>) => {
            this.districts = result.requested;
        });
    }

    // change detection when a district is selected
    districtSelected(): void {
        this.retrievingSchools = true;
        this.test.school = undefined;
        this.errorSubmitting = false;
    }

    schoolSelected($event): void {
        this.test.school = $event.item;
        this.errorSubmitting = false;
    }

    // set the progress value
    modelChange(): void {
        this.errorSubmitting = false;
        this.progress = 0;

        // check department
        if (this.test.department) {
            this.progress += 20;
        }

        // check test date
        if (this.test.date) {
            this.progress += 20;
        }

        // check test location
        if (this.test.location) {
            this.progress += 20;
        }

        // check test result
        if (this.test.result) {
            this.progress += 20;
        }

        // check file id
        if (this.test.fileId) {
            this.progress += 20;
        }
    }

    dateSelected(value: NgbDate): void {
        this.modelChange();
    }

    testResultSelected(): void {
        this.modelChange();
    }

    submitTestResult(): void {
        this.errorSubmitting = false;

        // validate data
        this.validation.department = !this.test.department;

        if (this.test.date) {
            const dataString = this.test.date.year + '-' + ('0' + this.test.date.month).slice(-2) + '-' +
                ('0' + this.test.date.day).slice(-2);
            this.test.dateTime = Date.parse(dataString);
        }
        this.validation.date = !this.test.dateTime;
        this.validation.location = !this.test.location;
        this.validation.result = !this.test.result;
        this.validation.picture = !this.test.fileId;

        // return if validation is not passed
        if (this.validation.result || this.validation.picture || this.validation.location || this.validation.department
            || this.validation.date) {
            return;
        }

        this.test.result = this.test.result.toUpperCase();
        this.submittingReport = true;
        this.http.post('tests', this.test).subscribe((result: LabTest) => {
            this.submittingReport = false;
            this.progress = 100;
            this.router.navigate(['/passes']);
        }, error => {
            this.submittingReport = false;
        });
    }

    formatter = (school: School) => school.name;
    searchDistrictSchools = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term => this.search.searchDistrictSchools(term, this.test.district.id)),
            // catchError(),
            tap(() => this.searching = false));
    }

    onFileSelected(event): void {
        const file: File = event.target.files[0];
        if (!file)
            return;

        this.resultFile.inProgress = true;
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
                this.resultFile = data;
                this.test.fileId = data.identifier;
                this.modelChange();
                this.resultFile.inProgress = false;
            }
        });
    }

    clearTestFile(): void {
        this.resultFile.inProgress = true;
        this.http.delete('files/' + this.resultFile.identifier).subscribe(result => {
            this.resultFile = new FileStorage();
            this.test.fileId = undefined;
            this.modelChange();
        })
    }
}
