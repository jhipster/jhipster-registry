import {Component, OnInit} from "@angular/core";
import {JhiApplicationsService} from "./applications.service";

@Component({
    selector: 'jhi-applications',
    templateUrl: './applications.component.html',
})
export class JhiApplicationsComponent implements OnInit {
    application: any;
    data: any;
    instances: any;

    constructor(private applicationsService: JhiApplicationsService) {}

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.applicationsService.findAll().toPromise().then((data) => {
            this.data = data;
            if (data.applications.length > 0) {
                this.show(data.applications[ 0 ].name);
            }
        });
    }

    show(app) {
        this.application = app;
        for (let application of this.data.applications) {
            application.active = '';
            if (application.name === this.application) {
                this.instances = application.instances;
                application.active = 'active';
            }
        }
    }

    getLabelClass(statusState) {
        if (statusState && statusState === 'UP') {
            return 'label-success';
        } else {
            return 'label-danger';
        }
    }
}
