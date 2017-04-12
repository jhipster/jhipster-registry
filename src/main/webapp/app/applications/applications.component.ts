import {Component, OnInit} from '@angular/core';
import {JhiApplicationsService} from './applications.service';
import {Observable} from 'rxjs';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
    selector: 'jhi-applications',
    templateUrl: './applications.component.html',
    styles: [`.form-control { width: 300px; }`],
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

    public model: any;

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term.length < 2 ? []
                : states.filter(v => new RegExp(term, 'gi').test(v)).splice(0, 10));
}
