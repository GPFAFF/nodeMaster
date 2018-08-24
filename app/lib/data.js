// Library for storing and editing data

// C -- create
// R -- read
// U -- update
// D -- delete

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for module
const lib = {};
// base directory of data folder
lib.baseDir = path.join(__dirname, '/.././.data/');
// Write data to file
lib.create = function(dir, file, data, callback) {
  // console.log(dir, file, data, callback);
  // open the file for writing.
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (error, fileDescriptor) => {

    if (!error && fileDescriptor) {
      // Convert data to string.
      const stringData = JSON.stringify(data);
      // Write to the file and close it
      fs.writeFile(fileDescriptor, stringData, (error) => {
        if (!error) {
          fs.close(fileDescriptor, (error) => {
            if (!error) {
              callback(false)
            } else {
              callback('Error creating new file')
            }
          });
        } else {
          callback('Error writing to new file')
        }
      })
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
}

// Read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (error, data) => {
    callback(error, data);
  })
}
// Update a file
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      const stringData = JSON.stringify(data);
      // truncate data
      fs.truncate(fileDescriptor, (error) => {
        if (!error) {
          fs.writeFile(fileDescriptor, stringData, (error => {
            if (!error) {
              fs.close(fileDescriptor, (error => {
                if (!error) {
                  callback(false);
                } else {
                  callback('Error closing file!');
                }
              }))
            } else {
              callback('Error writing to existing file');
            }
          }))
        } else {
          callback('Error truncating file');
        }
      })
    } else {
      callback('Could not open the file for updating and it may not exist yet')
    }
  });
}

// Delete file

lib.delete = (dir, file, callback) => {
  // Unlink the file from fs
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (error) => {
    if (!error) {
      callback(false)
    } else {
      callback('Error deleting file');
    }
  })
}
module.exports = lib;
