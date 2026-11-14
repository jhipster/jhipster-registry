import { SecurityContext, Service, Signal, WritableSignal, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface AlertModel {
  id: number;
  type: AlertType;
  message?: string;
  timeout?: number;
  toast?: boolean;
  position?: string;
  close?: () => void;
}

@Service()
export class AlertService {
  timeout = 5000;
  toast = false;
  position = 'top right';

  // unique id for each alert. Starts from 0.
  private alertId = 0;
  private readonly alertsSignal = signal<AlertModel[]>([]);
  private readonly alertsReadonly = this.alertsSignal.asReadonly();

  private readonly sanitizer = inject(DomSanitizer);

  get alerts(): Signal<AlertModel[]> {
    return this.alertsReadonly;
  }

  clear(): void {
    this.alertsSignal.set([]);
  }

  get(): AlertModel[] {
    return this.alertsSignal();
  }

  /**
   * Adds alert to alerts array and returns added alert.
   * @param alertToAdd Alert to add. If `timeout`, `toast` or `position` is missing then applying default value.
   * @param extAlerts  If missing then adding `alert` to `AlertService` internal signal and alerts can be retrieved by `get()`.
   *                   Else adding `alert` to `extAlerts`.
   * @returns  Added alert
   */
  addAlert(alertToAdd: Omit<AlertModel, 'id'>, extAlerts?: WritableSignal<AlertModel[]>): AlertModel {
    const alert: AlertModel = { ...alertToAdd, id: this.alertId++ };

    alert.message = this.sanitizer.sanitize(SecurityContext.HTML, alert.message ?? '') ?? '';
    alert.timeout ??= this.timeout;
    alert.toast ??= this.toast;
    alert.position ??= this.position;
    alert.close = () => this.closeAlert(alert.id, extAlerts);

    (extAlerts ?? this.alertsSignal).update(alerts => [...alerts, alert]);

    if (alert.timeout > 0) {
      setTimeout(() => {
        this.closeAlert(alert.id, extAlerts);
      }, alert.timeout);
    }

    return alert;
  }

  private closeAlert(alertId: number, extAlerts?: WritableSignal<AlertModel[]>): void {
    (extAlerts ?? this.alertsSignal).update(alerts => alerts.filter(alert => alert.id !== alertId));
  }
}
