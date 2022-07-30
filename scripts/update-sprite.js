const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const svgPath = resolve(__dirname, '..', 'public', 'icons.svg');

let svg = readFileSync(svgPath).toString();

svg = svg.replace(/ fill="(#?)\w+"/g, '');

writeFileSync(svgPath, svg);
