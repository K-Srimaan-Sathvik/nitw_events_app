const { stringify } = require('csv-stringify');

function toCSV(data, columns) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const stringifier = stringify({ header: true, columns });
    stringifier.on('readable', () => {
      let row;
      while ((row = stringifier.read()) !== null) rows.push(row);
    });
    stringifier.on('error', (err) => reject(err));
    stringifier.on('finish', () => resolve(rows.join('')));
    data.forEach((d) => stringifier.write(d));
    stringifier.end();
  });
}

module.exports = { toCSV };
