const blabber = require("./shared/blabber");

const {
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
import { ImagePicker, imagePlaceholder } from '@raketa-cms/raketa-image-picker';
import { MarkdownInput, toHTML } from "@raketa-cms/raketa-markdown-input";

const Widget = ({ ${getFieldsList(fields).join(", ")}, containerSettings }) => (
  <Container settings={containerSettings}>
    <div className="${getCSSSingular(identifier)}">
      <div className="container">
        ${getTitle(identifier)}
      </div>
    </div>
  </Container>
);

const Config = {
  title: '${getTitle(identifier)}',
  category: '_Unspecified',
  primaryField: '${getFieldsList(fields)[0]}',
};

const Defaults = {
${getDefaults(fields).join("\n")}
  containerSettings: {},
};

const Admin = {
${getAdminFields(fields).join("\n")}
};

export { Widget, Admin, Config, Defaults };
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
