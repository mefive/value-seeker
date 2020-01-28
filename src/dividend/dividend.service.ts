import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';
import { tushare } from '../utils/tushare';
import { DividendEntity } from './dividend.entity';

@Injectable()
export class DividendService extends BaseService {
  constructor(
    @InjectRepository(DividendEntity)
    private readonly dividendRepository: Repository<DividendEntity>,

    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }

  async loadData() {
    await this.dividendRepository.clear();

    const allStocks = await this.stockBasicRepository.find();

    const size = 80;

    for (let page = 0; page < Math.ceil(allStocks.length / size); page++) {
      let dividendList: Array<Omit<DividendEntity, 'id'>> = [];

      for (let i = 0; i < size; i++) {
        const stock = allStocks[page * size + i];

        if (stock) {
          const response = await tushare<
            Array<
              DividendEntity & {
                payDate: string | null;
                divListdate: string | null;
                recordDate: string | null;
                impAnnDate: string | null;
                divProc: string;
              }
            >
          >('dividend', {
            tsCode: stock.tsCode,
          });

          Logger.log(`分红送股 ${i} ${stock.name} ${stock.tsCode} 下载成功`);

          dividendList = dividendList.concat(
            response.data
              .filter((d) => d.divProc === '实施')
              .map((d) => {
                const exDate =
                  d.exDate ||
                  d.payDate ||
                  d.divListdate ||
                  d.recordDate ||
                  d.impAnnDate;

                return {
                  tsCode: d.tsCode,
                  endDate: moment(d.endDate).toDate(),
                  stkBoRate: d.stkBoRate === 0e-8 ? undefined : d.stkBoRate,
                  stkCoRate: d.stkCoRate === 0e-8 ? undefined : d.stkCoRate,
                  cashDivTax: d.cashDivTax === 0e-8 ? undefined : d.cashDivTax,
                  exDate: exDate ? moment(exDate).toDate() : undefined,
                };
              }),
          );
        }
      }

      Logger.log(`批量插入第 ${page} 页`);

      await this.dividendRepository.insert(dividendList);

      await delay(60 * 1000);
    }
  }
}
