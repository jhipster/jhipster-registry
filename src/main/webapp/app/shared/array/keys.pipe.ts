import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: Record<string, any>): { key: string; value: any }[] {
    return Object.keys(value).map(key => ({ key, value: value[key] }));
  }
}
