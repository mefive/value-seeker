import * as program from 'commander';
import logger from './logger';

import basic from './migrations/load-basic';
import dailyBasic from './migrations/load-daily-basic';
import daily from './migrations/load-daily';
import cal from './migrations/load-cal';
import fina from './migrations/load-fina';
import dividend from './migrations/load-dividend';

program
  .command('load <entity>')
  .option('-d, --date <string>', 'date')
  .action(async (entity, cmdObj) => {
    switch (entity) {
      case 'basic': {
        await basic();
        break;
      }

      case 'cal': {
        await cal();
        break;
      }

      case 'daily': {
        await daily(cmdObj.date);
        break;
      }

      case 'fina': {
        await fina();
        break;
      }

      case 'dividend': {
        await dividend();
        break;
      }

      case 'daily-basic': {
        await dailyBasic();
        break;
      }

      default:
        logger.error(`实体 ${entity} 未找到`);
        return;
    }
  });

program.parse(process.argv);
