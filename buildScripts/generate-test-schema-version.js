#!/usr/bin/env node
// Retrieves the version number.

const fs = require('fs');

const path = 'node_modules/@dvsa/mes-test-schema/package.json';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    return console.console.error(err);
  }

  const packageObj = JSON.parse(data);
  const { version } = packageObj;
  const output = `export const version = \'${version}\';\n`;

  fs.writeFile('src/environments/test-schema-version.ts', output, 'utf8', (error) => {
    if (error) {
      return console.error(error);
    }
    console.log('Schema version file created successfully');
  });
});
