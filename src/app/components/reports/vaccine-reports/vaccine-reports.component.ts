import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../http.service";
import {Paging} from "../../../models/Paging";
import {VaccinationRecord} from "../../../models/vaccination-record";
import {Result} from "../../../models/Result";

@Component({
    selector: 'app-vaccine-reports',
    templateUrl: './vaccine-reports.component.html',
    styleUrls: ['./vaccine-reports.component.css']
})
export class VaccineReportsComponent implements OnInit {

    paging: Paging;
    records: VaccinationRecord[];
    single: any[];
    // view: any[] = [550, 300];
    colorScheme = {
        domain: ['#28a745', '#dc3545', '#ffc107', '#cccccc']
    };
    covidTracking: { positive: number, negative: number, inconclusive: number };
    filterOptions: string[];
    sortOptions: string[];

    constructor(private http: HttpService) {
        this.paging = new Paging();
        this.filterOptions = ['Options under development'];
        this.sortOptions = ['Vaccine Product', 'First Dose', 'Second Dose', 'Booster', 'Booster Date'];
    }

    ngOnInit(): void {

        // get covid counts
        this.getCovidResultCounts();

        // get vaccine records
        this.getVaccineRecords();


        this.single = [
            {
                name: "Fully vaccinated",
                value: 0,
                style: 'text-success'
            },
            {
                name: "Not vaccinated",
                value: 0,
                style: 'text-danger'
            },
            {
                name: "Partially vaccinated",
                value: 0,
                style: 'text-warning'
            },
            {
                name: "No vaccine data",
                value: 0,
                style: 'text-secondary'
            }
        ];
    }

    exportData(): void {

    }

    filterRecords(option: string): void {

    }

    sortRecords(option: string): void {

    }

    filterChanged(e): void {
        // console.log(this.paging.filter, e);
        this.paging.start = 0;
        this.getVaccineRecords();
    }

    getCovidResultCounts(): void {
        this.http.get('tests/counts?type=ALL').subscribe((result: any) => {
            this.covidTracking = result;
        });
    }

    getVaccineRecords(): void {
        this.paging.processing = true;

        this.http.get('vaccines', this.paging).subscribe((result: Result<VaccinationRecord>) => {
            this.paging.available = result.available;
            this.records = result.requested;
            this.paging.processing = false;
        }, error => {
            this.paging.processing = false;
        })
    }

    pageVaccines(page): void {
        this.paging.start = ((page - 1) * this.paging.limit);
        // this.getDataFromServer();
    }
}
