import {Component, OnInit} from '@angular/core';
import {Paging} from "../../../models/Paging";
import {LabTest} from "../../../models/lab-test";
import {HttpService} from "../../../http.service";
import {Result} from "../../../models/Result";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FileViewModalComponent} from "../../modal/file-view-modal/file-view-modal.component";

@Component({
    selector: 'app-test-results',
    templateUrl: './test-results.component.html',
    styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent implements OnInit {

    paging: Paging;
    tests: LabTest[];

    single: any[];
    view: any[] = [700, 300];

    // options
    gradient: boolean = false;
    showLegend: boolean = false;
    showLabels: boolean = true;
    isDoughnut: boolean = true;
    legendPosition: string = 'below';

    // stacked
    multi: any[];
    // options
    legend: boolean = false;
    showStackedLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = false;
    showXAxisLabel: boolean = false;
    xAxisLabel: string = 'Year';
    yAxisLabel: string = 'Population';
    timeline: boolean = true;

    selectedSingleOption: string;
    singleFilterOptions: string[];

    stackedView: any[] = [700, 400];

    stackedColorScheme = {
        domain: ['#E44D25', '#5AA454', '#CFC0BB']
    };

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#AAAAAA']
    };

    retrievingGraphData: boolean;

    constructor(private http: HttpService, private modalService: NgbModal) {
        this.paging = new Paging();
    }

    ngOnInit(): void {
        this.getDataFromServer();
        this.singleFilterOptions = ['Today', 'Week', 'Month', 'Year'];
        this.selectedSingleOption = this.singleFilterOptions[0];

        // get graph for counts
        this.getSingleCounts();

        // get graph for trend
        this.retrievingGraphData = true;
        this.http.get('tests/graph').subscribe((result: any) => {
            this.multi = result;
            this.retrievingGraphData = false;
        }, error => {
            this.retrievingGraphData = false;
        });
    }

    getSingleCounts(when = 'TODAY'): void {
        this.http.get('tests/counts?type=' + when).subscribe((result: any) => {
            this.single = [
                {
                    "name": "Negative",
                    "value": result.negative
                },
                {
                    "name": "Positive",
                    "value": result.positive
                },
                {
                    "name": "Inconclusive",
                    "value": result.inconclusive
                }
            ];
        });
    }

    pageTests(page): void {
        this.paging.start = ((page - 1) * this.paging.limit);
        this.getDataFromServer();
    }

    private getDataFromServer(): void {
        this.paging.processing = true;
        this.http.get('tests', this.paging).subscribe((result: Result<LabTest>) => {
            this.paging.available = result.available;
            this.tests = result.requested;
            this.paging.processing = false;
        });
    }

    contactTrace(): void {
    }

    viewTestResult(test: LabTest): void {
        const options: NgbModalOptions = {backdrop: 'static', keyboard: false, size: 'lg'};
        const modalRef = this.modalService.open(FileViewModalComponent, options);
        modalRef.componentInstance.labTest = test;

    }

    filterSingleCounts(option: string): void {
        this.selectedSingleOption = option.toUpperCase();
        this.getSingleCounts(this.selectedSingleOption);
    }
}
