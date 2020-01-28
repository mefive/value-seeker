import * as _ from 'lodash';

export function snakeCaseKeys(object: any) {
  return _.transform(
    object,
    (r, v, k: string) => {
      if (typeof v === 'object' && !Array.isArray(v)) {
        r[_.snakeCase(k)] = snakeCaseKeys(v);
      } else {
        r[_.snakeCase(k)] = v;
      }
    },
    {} as any,
  );
}

export function camelCaseKeys(object: any) {
  return _.transform(
    object,
    (r, v, k: string) => {
      if (typeof v === 'object' && !Array.isArray(v)) {
        r[_.camelCase(k)] = camelCaseKeys(v);
      } else {
        r[_.camelCase(k)] = v;
      }
    },
    {} as any,
  );
}
