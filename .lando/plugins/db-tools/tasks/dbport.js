'use strict';

const filterServices = require('../src/filter-services').filterServices;
const dbServiceGet = require('../src/db-services').get;

const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

module.exports = lando => ({
  command: 'dbport',
  describe: 'Displays the current external database port',
  level: 'app',
  options: Object.assign({}, lando.cli.formatOptions(), {
    service: {
      describe: 'Get port info for only the specified service',
      alias: ['s'],
      array: false,
    },
  }),
  run: options => {
    const app = lando.getApp(options._app.root);
    // Get services
    app.opts = (!isEmpty(options.service)) ? { services: options.service } : {};
    return app.init().then(() => {
      const info = app.info.filter(service => filterServices(service.service, options.service))
      const dbservice = dbServiceGet(app, info)

      const external = dbservice.external_connection.port
      const service = dbservice.service
      console.log(external)
      console.log(`Port number ${external} for service '${service}'`)
    });
  },
});
