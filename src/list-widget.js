const blabber = require("./shared/blabber");

const {
  getIdentifier,
  getTitle,
  getCSSPlural,
  getCSSSingular,
  writeWidget,
  writeCSSList,
} = require("./cms/helpers");

const template = (identifier, _fields) => `import React from 'react';
import { Container, List, TextInput, SelectMenu, LinkSettings, Img } from '@raketa-cms/raketa-cms';
import { ImagePicker } from '@raketa-cms/raketa-image-picker';
import { RichText } from '@raketa-cms/raketa-mce';
import Link from '../frontend/Link';

const Item = ({ title, link, image, description }) => (
  <div className="${getCSSSingular(identifier)}">
    <Link settings={link}>
      <Img src={image} variant="image" className="image" />

      <h3 className="title">{title}</h3>
      {description && <div className="description" dangerouslySetInnerHTML={{ __html: description }} />}
    </Link>
  </div>
);

const ${getIdentifier(identifier)} = ({ variant, list, containerSettings }) => (
  <Container settings={containerSettings}>
    <div className="${getCSSPlural(identifier)}">
      <div className="container">
        <div className="row">
          {list.map((item) =>
            <div key={item.id} className={variant}>
              <Item {...item} />
            </div>
          )}
        </div>
      </div>
    </div>
  </Container>
);

${getIdentifier(identifier)}.title = '${getTitle(identifier)}';
${getIdentifier(identifier)}.category = '_Unspecified';
${getIdentifier(identifier)}.dialogSize = 'large';

${getIdentifier(identifier)}.defaults = {
  variant: 'col-3',
  list: [
    { id: 1, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
    { id: 2, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
    { id: 3, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
  ],
  containerSettings: {},
};

const ListItem = ({ settings, onChangeItem }) => (
  <div>
    <LinkSettings
      label="Link"
      onChange={value => onChangeItem('link', value)}
      value={settings.link}
    />

    <ImagePicker
      label="Image"
      onChange={value => onChangeItem('image', value)}
      value={settings.image}
    />

    <TextInput
      label="Title"
      onChange={value => onChangeItem('title', value)}
      value={settings.title}
    />

    <RichText
      label="Description"
      onChange={value => onChangeItem('description', value)}
      value={settings.description}
    />
  </div>
);

${getIdentifier(identifier)}.adminFields = (items, onChange, settings) => (
  <div>
    <SelectMenu
      label="Variant"
      options={[['col-6', '2 columns'], ['col-4', '3 columns'], ['col-3', '4 columns']]}
      value={settings.variant}
      onChange={value => onChange('variant', value)}
    />

    <List
      listItem={(settings, onChangeItem) =>
        <ListItem settings={settings} onChangeItem={onChangeItem} />}
      items={items}
      template={{ link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' }}
      primaryField="title"
      onChangeList={onChange}
    />
  </div>
);

export default ${getIdentifier(identifier)};
`;

module.exports = (name, fields) => {
  console.log(`${blabber()}\n`);
  console.log(`Generating list widget for ${name}...`.yellow);

  const widgetFile = writeWidget(name, fields, template);
  console.log(widgetFile.green);

  const cssFile = writeCSSList(name);
  console.log(cssFile.green);

  console.log(`\n🚀 Done!`);
};
