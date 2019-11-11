import { Component, OnDestroy } from '@angular/core';
import { JhiEventManager, JhiAlert, JhiAlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-alert-error',
  template: `
    <div class="alerts" role="alert">
      <div *ngFor="let alert of alerts" [ngClass]="setClasses(alert)">
        <ngb-alert *ngIf="alert && alert.type && alert.msg" [type]="alert.type" (close)="alert.close(alerts)">
          <pre [innerHTML]="alert.msg"></pre>
        </ngb-alert>
      </div>
    </div>
  `
})
export class JhiAlertErrorComponent implements OnDestroy {
  alerts: any[];
  cleanHttpErrorListener: Subscription;
  constructor(private alertService: JhiAlertService, private eventManager: JhiEventManager) {
    this.alerts = [];

    this.cleanHttpErrorListener = eventManager.subscribe('jHipsterRegistryApp.httpError', response => {
      let i;
      const httpErrorResponse = response.content;
      switch (httpErrorResponse.status) {
        // connection refused, server not reachable
        case 0:
          this.addErrorAlert('Server not reachable');
          break;

        case 400: {
          const arr = httpErrorResponse.headers.keys();
          let errorHeader = null;
          arr.forEach(entry => {
            if (entry.toLowerCase().endsWith('app-error')) {
              errorHeader = httpErrorResponse.headers.get(entry);
            }
          });
          if (errorHeader) {
            this.addErrorAlert(errorHeader);
          } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
            const fieldErrors = httpErrorResponse.error.fieldErrors;
            for (i = 0; i < fieldErrors.length; i++) {
              const fieldError = fieldErrors[i];
              if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                fieldError.message = 'Size';
              }
              // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
              const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
              const fieldName = convertedField.charAt(0).toUpperCase() + convertedField.slice(1);
              this.addErrorAlert('Error on field "' + fieldName + '"');
            }
          } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
            this.addErrorAlert(httpErrorResponse.error.message);
          } else {
            this.addErrorAlert(httpErrorResponse.error);
          }
          break;
        }
        case 404:
          this.addErrorAlert('Not found');
          break;

        default:
          if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
            this.addErrorAlert(httpErrorResponse.error.message);
          } else {
            this.addErrorAlert(httpErrorResponse.error);
          }
      }
    });
  }

  setClasses(alert) {
    return {
      'jhi-toast': alert.toast,
      [alert.position]: true
    };
  }

  ngOnDestroy() {
    if (this.cleanHttpErrorListener !== undefined && this.cleanHttpErrorListener !== null) {
      this.eventManager.destroy(this.cleanHttpErrorListener);
      this.alerts = [];
    }
  }

  addErrorAlert(message) {
    const newAlert: JhiAlert = {
      type: 'danger',
      msg: message,
      timeout: 5000,
      toast: this.alertService.isToast(),
      scoped: true
    };

    this.alerts.push(this.alertService.addAlert(newAlert, this.alerts));
  }
}
