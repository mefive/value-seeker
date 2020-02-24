const { generateScheduleApp } = require('./utils');

module.exports = {
  apps: [
    ['load-basic', 'load basic'],
    ['load-cal', 'load cal'],
  ].map((app) => generateScheduleApp(app[0], app[1], app[2])),
};
