/*
*  Create an export config variables
*
*/

//  Container for all the environments
const environments = {};
console.log('yo im loading config');

//  Create staging environment
environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging',
  'hashingSecret': 'thisIsASecret'
};

//  Create production environment
environments.production = {
  'httpPort': '5000',
  'httpsPort': '5001',
  'envName': 'production',
  'hashingSecret': 'thisIsAlsoASecret'
};

//  Determine which environment was passed to CLI
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//  Check current environment, if undefined default to staging.
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

//  Export module
module.exports = environmentToExport;

