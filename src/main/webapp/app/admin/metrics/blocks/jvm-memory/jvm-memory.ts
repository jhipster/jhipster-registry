import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

import { JvmMetrics } from 'app/admin/metrics/metrics.model';

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.html',
  imports: [NgbProgressbar, KeyValuePipe, DecimalPipe],
})
export class JvmMemory {
  /**
   * Object containing all jvm memory metrics
   */
  readonly jvmMemoryMetrics = input<Record<string, JvmMetrics>>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();
}
