import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: any): any {
    const keys = [];
    const valueKeys = Object.keys(value);
    for (const key of valueKeys) {
      keys.push({ key, value: value[key] });
    }
    return keys;
  }
}
