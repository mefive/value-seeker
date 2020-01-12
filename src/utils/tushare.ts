import axios from 'axios';
import * as _ from 'lodash';
import { snakeCaseKeys } from './object';

export function tushare<T = any>(apiName: string, params: {}) {
  const instance = axios.create();

  instance.interceptors.response.use((resp) => {
    if (resp.data.code === 0) {
      const { fields, items } = resp.data.data as {
        fields: string[];
        items: Array<string | number>;
      };
      return {
        ...resp,
        data: items.map((item) => {
          return fields.reduce(
            (p, c, index) => ({
              ...p,
              [_.camelCase(fields[index])]: item[index],
            }),
            {},
          );
        }),
      };
    }
    throw Error(resp.data.msg);
  });

  return instance.post<T>('http://api.tushare.pro', {
    token: '11369546d806839387197960d6476f4857ded7654749e9a084e9be37',
    ...snakeCaseKeys({
      apiName,
      params,
    }),
  });
}
