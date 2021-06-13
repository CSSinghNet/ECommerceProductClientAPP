import { camelCase } from 'lodash';

export class Utils {

    static isBlank(val: any): boolean {
        return val === undefined || val == null || val === '' || val === ' ';
    }

    static camelizeKeys = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(v => Utils.camelizeKeys(v));
        } else if (obj !== null && obj.constructor === Object) {
            return Object.keys(obj).reduce(
                (result, key) => ({
                    ...result,
                    [camelCase(key)]: Utils.camelizeKeys(obj[key]),
                }),
                {},
            );
        }
        return obj;
    }
}