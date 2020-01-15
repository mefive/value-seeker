import * as _ from 'lodash';
import { IndexDailyEntity } from '../index-daily/index-daily.entity';

export function rsv(dailyList: IndexDailyEntity[]): number | undefined {
  const list = dailyList.slice(-9).filter((d) => d != null);
  const [last] = list.slice(-1);
  const { close } = last;
  const high = Math.max(...list.map((d) => d.high));
  const low = Math.min(...list.map((d) => d.low));
  return high === low ? undefined : 100 * ((close - low) / (high - low));
}
