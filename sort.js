const fs = require('fs');

const jsonData = require('./ro.json');

  jsonData.sort((a, b) => a.city.localeCompare(b.city));

  const sortedJson = JSON.stringify(jsonData, null, 2);

  fs.writeFileSync('sortedData.json', sortedJson);

  console.log('Data sorted and written to "sortedData.json"');