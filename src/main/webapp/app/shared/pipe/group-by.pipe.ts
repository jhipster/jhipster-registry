import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

    transform(collection: Object[] , term: string) {
        const newValue = [];

        collection.forEach((col) => {
            const keyVal = this.deepFind(col, term);
            const index = newValue.findIndex( (myObj) => myObj.key === keyVal);
            if (index >= 0) {
                newValue[index].value.push(col);
            } else {
                newValue.push({key: keyVal, value: [col]});
            }
        });
        return newValue;
    }

    private deepFind(obj, path) {
        const paths = path.toString().split(/[.\[\]]/);
        let current = obj;

        paths.forEach((onePath) => {
            if (onePath !== '') {
                if (!current[onePath]) {
                    return undefined;
                } else {
                    current = current[onePath];
                }
            }
        });
        return current;
    }

}
