const { generateScheduleApp } = require('./utils');
const moment = require('moment');

module.exports = {
  apps: [
    ['load-daily', 'load daily', `-d ${moment().format('YYYY-MM-DD')}`],
    ['load-fina', 'load fina'],
    ['load-dividend', 'load dividend'],
    [
      'load-daily-basic',
      'load daily-basic',
      `-d ${moment().format('YYYY-MM-DD')}`,
    ],
  ].map((app) => generateScheduleApp(app[0], app[1], app[2])),
};
