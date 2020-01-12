import * as _ from 'lodash';

export function snakeCaseKeys(object) {
  return _.transform(
    object,
    (r, v, k: string) => {
      if (typeof v === 'object' && !Array.isArray(v)) {
        r[_.snakeCase(k)] = snakeCaseKeys(v);
      } else {
        r[_.snakeCase(k)] = v;
      }
    },
    {},
  );
}

export function camelCaseKeys(object) {
  return _.transform(
    object,
    (r, v, k: string) => {
      if (typeof v === 'object' && !Array.isArray(v)) {
        r[_.camelCase(k)] = camelCaseKeys(v);
      } else {
        r[_.snakeCase(k)] = v;
      }
    },
    {},
  );
}
