function normalizeJSON(rawJSON, newJSON) {
  const tmpObj = {};
  for (let key in newJSON) {
    if (key in rawJSON) {
      tmpObj[key] = rawJSON[key];
    } else {
      tmpObj[key] = newJSON[key];
    }
  }

  const target = {
    ...rawJSON,
    ...tmpObj,
  };

  const sortedKeys = Object.keys(target);

  sortedKeys.sort((a, b) => {
    return a.localeCompare(b);
  });
  const result = {};
  sortedKeys.forEach((key) => {
    result[key] = target[key];
  });

  return result;
}

exports.normalizeJSON = normalizeJSON;
