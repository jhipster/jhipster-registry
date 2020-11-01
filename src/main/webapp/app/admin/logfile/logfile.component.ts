import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LogfileService } from './logfile.service';
import { RoutesService } from 'app/shared/routes/routes.service';
import { Route } from 'app/shared/routes/route.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['logfile.scss'],
})
export class LogfileComponent implements OnInit, OnDestroy {
  activeRoute?: Route;
  updatingLogfile = true;
  logtxt?: string;
  unsubscribe$ = new Subject();

  @ViewChild('logfile', { static: false }) private logFileViewer?: ElementRef;

  constructor(private jhiLogfileService: LogfileService, private routesService: RoutesService) {}

  ngOnInit(): void {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.displayActiveRouteLog();
    });
  }

  displayActiveRouteLog(): void {
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
                '    - logging.file.path\n ' +
                '    - logging.file.name (to avoid using the same spring.log)\n\n' +
                'See:\n ' +
                '- https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html\n ' +
                '- https://docs.spring.io/spring-boot/docs/current/reference/html/howto-logging.html';
              this.updatingLogfile = false;
            }
          }
        );
    }
  }

  scrollToBottom(): void {
    this.logFileViewer!.nativeElement.scrollTop = this.logFileViewer!.nativeElement.scrollHeight;
  }

  scrollToTop(): void {
    this.logFileViewer!.nativeElement.scrollTop = this.logFileViewer!.nativeElement.scrolledUp;
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
