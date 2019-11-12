import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { JhiLogfileService } from './logfile.service';
import { JhiRoutesService } from 'app/shared/routes/routes.service';
import { Route } from 'app/shared/routes/route.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['logfile.scss']
})
export class JhiLogfileComponent implements OnInit, OnDestroy {
  activeRoute: Route;
  updatingLogfile: boolean;
  logtxt: string;
  unsubscribe$ = new Subject();

  @ViewChild('logfile', { static: false }) private logFileViewer: ElementRef;

  constructor(private jhiLogfileService: JhiLogfileService, private routesService: JhiRoutesService) {}

  ngOnInit() {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.displayActiveRouteLog();
    });
  }

  displayActiveRouteLog() {
    this.updatingLogfile = true;
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.jhiLogfileService
        .getInstanceLogfile(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          logtxt => {
            this.logtxt = logtxt;
            this.updatingLogfile = false;
          },
          error => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
              this.logtxt =
                'No available logfile. Please note that it is not available by default, you need to set up the Spring Boot properties below! \n' +
                'Please check:\n ' +
                '- if the microservice is up\n ' +
                '- if these properties are set: \n ' +
                '    - logging.path\n ' +
                '    - logging.file (to avoid using the same spring.log)\n\n' +
                'See:\n ' +
                '- https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html\n ' +
                '- https://docs.spring.io/spring-boot/docs/current/reference/html/howto-logging.html';
              this.updatingLogfile = false;
            }
          }
        );
    }
  }

  scrollToBottom() {
    this.logFileViewer.nativeElement.scrollTop = this.logFileViewer.nativeElement.scrollHeight;
  }

  scrollToTop() {
    this.logFileViewer.nativeElement.scrollTop = this.logFileViewer.nativeElement.scrolledUp;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
