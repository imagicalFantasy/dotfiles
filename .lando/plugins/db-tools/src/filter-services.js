const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

// Helper to filter services
function filterServices(service, services = []) {
  return !isEmpty(services) ? services.includes(service) : true;
};

exports.filterServices = filterServices