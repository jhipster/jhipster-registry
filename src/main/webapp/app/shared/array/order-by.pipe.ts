import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
  transform(values: any[], predicate = '', reverse = false): any[] {
    if (predicate === '') {
      return reverse ? values.sort().reverse() : values.sort();
    }
    return values.sort((a, b) => {
      if (a[predicate] < b[predicate]) {
        return reverse ? 1 : -1;
      } else if (b[predicate] < a[predicate]) {
        return reverse ? -1 : 1;
      }
      return 0;
    });
  }
}
