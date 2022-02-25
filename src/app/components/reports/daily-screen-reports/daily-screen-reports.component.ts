import {Component, OnInit} from '@angular/core';
import {Result} from "../../../models/Result";
import {Survey} from "../../../models/survey";
import {HttpService} from "../../../http.service";
import {Paging} from "../../../models/Paging";
import {SurveyQuestion} from "../../../models/survey-question";
import {ScreeningService} from "../../../services/screening.service";

@Component({
    selector: 'app-daily-screen-reports',
    templateUrl: './daily-screen-reports.component.html',
    styleUrls: ['./daily-screen-reports.component.css']
})
export class DailyScreenReportsComponent implements OnInit {

    paging: Paging;
    reports: Survey[];
    questions: SurveyQuestion[];
    selectedDistrict: string;

    constructor(private http: HttpService, private screenService: ScreeningService) {
        this.paging = new Paging();
        this.paging.type = 'DAILY_HEALTH';
        this.selectedDistrict = 'All';
        this.questions = this.screenService.getQuestions();
    }

    ngOnInit(): void {
        this.getReports();
    }

    pageDailyHealthReports(object?): void {
        if (object) {
            this.paging.start = (object.params.currentPage - 1) * this.paging.limit;
            this.paging.currentPage = object.params.currentPage;
        }

        this.getReports();
    }

    getReports(): void {
        this.paging.processing = true;
        this.http.get("surveys", this.paging).subscribe((result: Result<Survey>) => {
            this.paging.available = result.available;
            this.reports = result.requested;
            this.paging.processing = false;
        }, error => {
            this.paging.processing = false;
        });
    }

    sortQuestions(questions: SurveyQuestion[]): SurveyQuestion[] {
        return questions.sort((a, b) => a.label > b.label ? 1 : a.label === b.label ? 0 : -1);
    }

    filterChanged(event): void {
        this.getReports();
    }

    sortReports(sort: string): void {
        if (this.paging.sort === sort)
            this.paging.asc = !this.paging.asc;

        this.paging.sort = sort;
        this.paging.start = 0;
        this.getReports();
    }

    pageCounts(): string {
        const maxPageCount = this.paging.limit;
        const currentPage = this.paging.currentPage;
        const resultCount = this.paging.available;

        const pageNum = ((currentPage - 1) * maxPageCount) + 1;

        // number on this page
        const pageCount = (currentPage * maxPageCount) > resultCount ? resultCount : (currentPage * maxPageCount);
        return pageNum + ' - ' + (pageCount) + ' of ' + (resultCount);
    }
}
