'use strict';
const filterServices = require('../src/filter-services').filterServices;
const dbServiceGet = require('../src/db-services').get;

const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

module.exports = lando => ({
  command: 'heidi',
  describe: 'Opens the database in Heidi GUI',
  level: 'app',
  options: Object.assign({}, lando.cli.formatOptions(), {
    service: {
      describe: 'Specify the database service',
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
      const creds = dbservice.creds

      lando.shell.sh([`heidisql.exe`, `--host=localhost --port=${external} --user=${creds.user} --password${creds.password} --databases=${creds.database}`], { mode: 'exec', detached: false })
	  .catch(err => {
	    lando.log.error(err)
	    lando.shell.exit(1)
	  })
	  .then(results => {
	    console.log(results)
	    lando.shell.exit(1)
	  })
      return
    });
  },
});
