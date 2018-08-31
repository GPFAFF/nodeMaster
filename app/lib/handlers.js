/* Request Handlers
 */

const _data = require('./data');
const helpers = require('./helpers');

// Define handlers
let handlers = {};

// Ping Handler
handlers.ping = (data, callback) => {
  callback(200);
}
// 404 Handler
handlers.notFound = (data, callback) => {
  callback(404);
}

handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
}

// Container for user submethods
handlers._users = {};

// Users Post
// Required Fields: firstName, lastName, phone, pwd, t&c
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const terms = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if (firstName && lastName && phone && password && terms) {
    // Make sure user doesn't already exsist.
    _data.read('users', phone, (error, data) => {
      if (error) {
        const hashedPassword = helpers.hash(password);
        // create user object

       if (hashedPassword) {
        const userObject = {
          'firstName': firstName,
          'lastName': lastName,
          'phone': phone,
          'hashedPassword': hashedPassword,
          'terms': true,
        }

        // Store the user
        _data.create('users', phone, userObject, (error) => {
          if (!error) {
            callback(200)
          } else {
            console.log(error);
            callback(500, {'Error': 'Could not create user'});
          }
        });
       } else {
         callback(500, {'Error' : 'Could not hash the password'});
       }
      } else {
        callback(400, {'Error': 'A user with this number already exists'})
      }
    });
  } else {
    callback(400, {'error' : 'Missing required fields - POST'});
  }
};
// Users  Get
// Required data phone
// Optional data none
// Only let auth users access their id's
handlers._users.get = (data, callback) => {
  // Check phone
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    _data.read('users', phone, (error, data) => {
      if (!error && data) {
        // Remove PWD from user object before returning to requester
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    })
  } else {
    callback(400, {'Error' : 'Missing required field GET'});
  }

}
// Users Put
// Required data: phone, user
// Optional data" firstName, lastName, pwd (at least one must be specified)
// only let an auth user update object
handlers._users.put = (data, callback) => {

  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  const firstName =  typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName =  typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if (phone) {
    if (firstName || lastName || password) {
      _data.read('users', phone, (error, userData) => {
        if (!error && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.hashedPassword - helpers.hash(password);
          }
          _data.update('users', phone, userData, (error) => {
            if (!error) {
              callback(200);
            } else {
              callback(500, {'Error' : 'Could not update the user - PUT'});
            }
          })
        } else {
          callback(400, {'Error' : 'Specified user does not exist - PUT'});
        }
      } )
    } else {
      callback(400, {'Error' : 'Missing fields to update - PUT'});
    }

  } else {
    callback(400, {'Error' : 'Missing required field PUT'});
  }

}
// Users Delete
// Only let Auth user delete obj
handlers._users.delete = (data, callback) => {
    // Check phone
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
      _data.read('users', phone, (error, data) => {
        if (!error && data) {
          // Remove PWD from user object before returning to requester
          _data.delete('users', phone, (error) => {
            if (!error) {
              callback(200)
            } else {
              callback(500, {'Error' : 'Could not delete spec user'});
            }
          });

        } else {
          callback(400, {'Error': 'Could not find the specified user - Delete'});
        }
      })
    } else {
      callback(400, {'Error' : 'Missing required field GET'});
    }


}

// Export Handlers
module.exports = handlers;
