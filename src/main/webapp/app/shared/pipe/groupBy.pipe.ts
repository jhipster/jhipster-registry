import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

    transform( collection: Object[] , term: string ) {
        const newValue = [];

        for (let i = 0; i < collection.length; i++) {
            const keyVal = this.deepFind(collection[i], term);
            const index = newValue.findIndex( (myObj) => myObj.key === keyVal);
            if (index >= 0) {
                newValue[index].value.push(collection[i]);
            } else {
                newValue.push({key: keyVal, value: [collection[i]]});
            }
        }
        return newValue;
    }

    private deepFind(obj, path) {

        const paths = path.toString().split(/[.\[\]]/);
        let current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (paths[i] !== '') {
                if (!current[paths[i]]) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
        }
        return current;
    }

}
