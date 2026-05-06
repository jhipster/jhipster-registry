import { Component, OnInit } from '@angular/core';
import { HistoryService, DiscoveryHistory, EurekaHistoryType } from './history.service';

@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.scss'],
})
export class HistoryComponent implements OnInit {
  discoveryHistory?: DiscoveryHistory;
  history?: Array<{ type: EurekaHistoryType; key: string; value: string }>;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.findAll().subscribe(discoveryHistory => {
      this.discoveryHistory = discoveryHistory;
      this.history = [];

      if (discoveryHistory.registered) {
        Object.entries(discoveryHistory.registered).forEach(([key, value]) => {
          this.history!.push({ type: 'registered', key, value });
        });
      }

      if (discoveryHistory.canceled) {
        Object.entries(discoveryHistory.canceled).forEach(([key, value]) => {
          this.history!.push({ type: 'canceled', key, value });
        });
      }
    });
  }
}
