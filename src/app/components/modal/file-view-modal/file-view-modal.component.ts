import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LabTest} from "../../../models/lab-test";
import {HttpService} from "../../../http.service";
import {UserService} from "../../../user.service";

@Component({
    selector: 'app-file-view-modal',
    templateUrl: './file-view-modal.component.html',
    styleUrls: ['./file-view-modal.component.css']
})
export class FileViewModalComponent implements OnInit {

    @Input() labTest: LabTest;

    constructor(public activeModal: NgbActiveModal, private http: HttpService, private user: UserService) {
    }

    ngOnInit(): void {
        const url = 'files/' + this.labTest.fileId + '?sid=' + this.user.getUser().sessionId;
        window.open('rest/' + url, '_self');
    }
}
