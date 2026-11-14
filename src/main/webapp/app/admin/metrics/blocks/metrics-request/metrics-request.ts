import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.html',
  imports: [NgbProgressbar, KeyValuePipe, DecimalPipe],
})
export class MetricsRequest {
  /**
   * Object containing http request related metrics
   */
  readonly requestMetrics = input<HttpServerRequests>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  filterNaN = filterNaN;
}
