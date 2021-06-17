exports.isUuid = (str) => /^[0-9a-fA-F]{24}$/.test(str);

exports.isNumber = (str) => Number.isInteger(parseInt(str));