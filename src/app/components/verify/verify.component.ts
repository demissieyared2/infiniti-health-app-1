import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log(id);
    }

}
