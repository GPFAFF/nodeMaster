/*
*  Create an export config variables
*
*/

//  Container for all the environments
const environments = {};
console.log('yo im loading config');

//  Create staging environment
environments.staging = {
  'port': 3333,
  'envName': 'staging'
};

//  Create production environment
environments.production = {
  'port': '4444',
  'envName': 'production'
};

//  Determine which environment was passed to CLI
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//  Check current environment, if undefined default to staging.
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

//  Export module
module.exports = environmentToExport;

