const blabber = require("./shared/blabber");

const {
  getIdentifier,
  getTitle,
  getFieldsList,
  getDefaults,
  getAdminFields,
  getCSSSingular,
  writeWidget,
  writeCSS,
} = require("./cms/helpers");

const template = (identifier, fields) => `import React from 'react';
import { Container } from '@raketa-cms/raketa-cms';
import { ImagePicker } from '@raketa-cms/raketa-image-picker';
import { RichText } from '@raketa-cms/raketa-mce';

const ${getIdentifier(identifier)} = ({ ${getFieldsList(fields).join(
  ", "
)}, containerSettings }) => (
  <Container settings={containerSettings}>
    <div className="${getCSSSingular(identifier)}">
      <div className="container">
        ${getTitle(identifier)}
      </div>
    </div>
  </Container>
);

${getIdentifier(identifier)}.title = '${getTitle(identifier)}';
${getIdentifier(identifier)}.category = '_Unspecified';
${getIdentifier(identifier)}.primaryField = '${getFieldsList(fields)[0]}';
${getIdentifier(identifier)}.dialogSize = 'large';

${getIdentifier(identifier)}.defaults = {
${getDefaults(fields).join("\n")}
  containerSettings: {},
};

${getIdentifier(identifier)}.adminFields = {
${getAdminFields(fields).join("\n")}
};

export default ${getIdentifier(identifier)};
`;

module.exports = (name, fields) => {
  console.log(`${blabber()}\n`);
  console.log(`Generating widget for ${name}...`.yellow);

  const widgetFile = writeWidget(name, fields, template);
  console.log(widgetFile.green);

  const cssFile = writeCSS(name);
  console.log(cssFile.green);

  console.log(`\n🚀 Done!`);
};
