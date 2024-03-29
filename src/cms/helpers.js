const fs = require("fs");
const inflector = require("inflected");

const getIdentifier = (name) => `${inflector.camelize(name)}Widget`;

const getTitle = (name) => inflector.humanize(inflector.underscore(name));

const getFields = (fields) => {
  return fields
    .map((field) => {
      const [name, type] = field.split(":");

      return [
        name,
        {
          name,
          type,
          json: getJSONDefinition(type),
        },
      ];
    })
    .reduce((acc, current) => {
      acc[current[0]] = current[1];

      return acc;
    }, {});
};

const getFieldsList = (fields) => Object.keys(getFields(fields));

const getJSONSelect = (type) => {
  const options = type
    .replace("select[", "")
    .replace("]", "")
    .split("/")
    .map((o) => [o, inflector.humanize(o)]);

  return {
    type: "select",
    options,
  };
};

const getJSONDefinition = (type = "text") => {
  if (type.indexOf("select[") !== -1) {
    return getJSONSelect(type);
  }

  if (type === "image") {
    return { type: "custom", component: "ImagePicker" };
  }

  if (type === "markdown") {
    return { type: "custom", component: "MarkdownInput" };
  }

  return { type };
};

const getDefaults = (fields) =>
  Object.values(getFields(fields)).map((f) => `  ${f.name}: '',`);

const getAdminFields = (fields) =>
  Object.values(getFields(fields)).map(
    (f) =>
      `  ${f.name}: ${JSON.stringify(f.json)
        .replace('"ImagePicker"', "ImagePicker")
        .replace('"MarkdownInput"', "MarkdownInput")},`
  );

const getCSSPlural = (name) =>
  inflector.dasherize(inflector.pluralize(inflector.underscore(name)));

const getCSSSingular = (name) =>
  inflector.dasherize(inflector.singularize(inflector.underscore(name)));

const writeWidget = (name, fields, template) => {
  const identifier = getIdentifier(name);
  const result = template(name, fields);

  // Write widget file
  const destination = "./components/widgets";
  const widgetFile = `${destination}/${identifier}.js`;
  const libraryFile = `${destination}/index.js`;
  const adminLibraryFile = `${destination}/admin.js`;

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(widgetFile, result, "utf8");

  // Update library file
  const library = fs.readFileSync(libraryFile, { encoding: "utf8" });

  if (library.indexOf(`import { Widget as ${identifier} `) === -1) {
    const [imports, exports] = library
      .replace("};\n", "")
      .split("export default {\n");

    const indexResult = `${imports.slice(
      0,
      -1
    )}import { Widget as ${identifier} } from "./${identifier}";

  export default {
  ${exports}  ${identifier},
  };
  `;
    fs.writeFileSync(libraryFile, indexResult, "utf8");
  }

  // Update admin library file
  const adminLibrary = fs.readFileSync(adminLibraryFile, { encoding: "utf8" });

  if (adminLibrary.indexOf(`import * as ${identifier} `) === -1) {
    const [imports, exports] = adminLibrary
      .replace("};\n", "")
      .split("export default {\n");

    const indexResult = `${imports.slice(
      0,
      -1
    )}import * as ${identifier} from "./${identifier}";

  export default {
  ${exports}  ${identifier},
  };
  `;
    fs.writeFileSync(adminLibraryFile, indexResult, "utf8");
  }

  return widgetFile;
};

const writeCSSFile = (fileName, result) => {
  // Write style file
  const destination = "./sass/frontend/components";
  const widgetFile = `${destination}/_${fileName}.scss`;
  const libraryFile = `${destination}/_module.scss`;

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(widgetFile, result, "utf8");

  // Update library file
  const index = fs.readFileSync(libraryFile, { encoding: "utf8" });

  if (index.indexOf(`@import '${fileName}';`) === -1) {
    const imports = index.slice(0, -1).split("\n");
    const newImports = [...imports, `@import '${fileName}';`];

    const indexResult = newImports.join("\n") + "\n";

    fs.writeFileSync(libraryFile, indexResult, "utf8");
  }

  return widgetFile;
};

const writeCSS = (name) => {
  const singular = getCSSSingular(name);

  const result = `.${singular} {
  // TODO: Add styles for the item
}
`;

  return writeCSSFile(singular, result);
};

const writeCSSList = (name) => {
  const plural = getCSSPlural(name);
  const singular = getCSSSingular(name);

  const result = `.${plural} {
  // TODO: Add styles for the list

  .${singular} {
    // TODO: Add styles for the item
  }
}
`;

  return writeCSSFile(plural, result);
};

module.exports = {
  getIdentifier,
  getTitle,
  getFields,
  getFieldsList,
  getJSONSelect,
  getJSONDefinition,
  getDefaults,
  getAdminFields,
  getCSSPlural,
  getCSSSingular,
  writeWidget,
  writeCSS,
  writeCSSList,
};
