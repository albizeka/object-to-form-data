'use strict'

function isObject (value) {
  return value === Object(value)
}

function isArray (value) {
  return Array.isArray(value)
}

function isFile (value) {
  return value instanceof File
}

function isString (value) {

  var a = value.toString();

  if (typeof a === 'string' || a instanceof String) { 
    return value;
  }
}

function isDate (value) {

  if (value instanceof Date) {
    return Date.parse(value);
  }
}

function makeArrayKey (key) {
  if (key.length > 2 && key.lastIndexOf('[]') === key.length - 2) {
    return key
  } else {
    return key + '[]'
  }
}

function objectToFormData (obj, fd, pre) {
  fd = fd || new FormData()

  Object.keys(obj).forEach(function (prop) {
  
    var key = pre ? (pre + '[' + prop + ']') : prop

    if (isObject(obj[prop]) && !isArray(obj[prop]) && !isFile(obj[prop]) && !isDate(obj[prop])) {
      objectToFormData(obj[prop], fd, key)
    } else if (isArray(obj[prop]) && !isDate(obj[prop])) {
      obj[prop].forEach(function (value) {
        var arrayKey = makeArrayKey(key)

        if (isObject(value) && !isFile(value)) {
          objectToFormData(value, fd, arrayKey)
        } else {
          fd.append(arrayKey, value)
        }
      })
    } else if (isDate(obj[prop])) {
       // var parseDate = Date.parse(obj[prop]);
       fd.append(key, obj[prop]);
    } else {
      fd.append(key, obj[prop])
    }
  })

  return fd
}

module.exports = objectToFormData
