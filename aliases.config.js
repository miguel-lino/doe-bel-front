const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
 
const aliases = {
  '@': '.',
  '@src': 'src',
  '@components': 'src/components',
  '@views': 'src/views',
  '@router': 'src/router',
  '@store': 'src/store',
  '@services': 'src/services',
  '@helpers': 'src/helpers',
  '@assets': 'src/assets',
};
 
module.exports = {
  webpack: {},
  jsconfig: {},
};
 
for (const alias in aliases) {
  const aliasTo = aliases[alias];
  module.exports.webpack[alias] = resolveSrc(aliasTo);
  module.exports.jsconfig[alias + '/*'] = [aliasTo + '/*'];
  module.exports.jsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        aliasTo + '/index.js',
        aliasTo + '/index.json',
        aliasTo + '/index.vue',
        aliasTo + '/index.scss',
        aliasTo + '/index.css',
      ];
}
 
const jsconfigTemplate = require('./jsconfig.template') || {};
const jsconfigPath = path.resolve(__dirname, 'jsconfig.json');
 
fs.writeFile(
  jsconfigPath,
  prettier.format(
    JSON.stringify({
      ...jsconfigTemplate,
      compilerOptions: {
        ...(jsconfigTemplate.compilerOptions || {}),
        paths: module.exports.jsconfig,
      },
    }),
    {
      ...require('./.prettierrc'),
      parser: 'json',
    }
  ),
  (error) => {
    if (error) {
      console.error('Error while creating jsconfig.json from aliases.config.js.');
      throw error;
    }
  }
);
 
function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}
 