import { Component, input } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IFilterOptions } from './filter.model';

@Component({
  selector: 'jhi-filter',
  imports: [FontAwesomeModule],
  templateUrl: './filter.html',
})
export default class Filter {
  readonly filters = input.required<IFilterOptions>();

  clearAllFilters(): void {
    this.filters().clear();
  }

  clearFilter(filterName: string, value: string): void {
    this.filters().removeFilter(filterName, value);
  }
}
