function getNextGroup(value) {
  if (!value) {
    return null;
  }

  let openSymbol, closeSymbol;
  if (value[0] == '{') {
    openSymbol = '{';
    closeSymbol = '}';
  } else if (value[0] == '[') {
    openSymbol = '[';
    closeSymbol = ']';
  } else if (value[0] == '(') {
    openSymbol = '(';
    closeSymbol = ')';
  } else {
    for (let i = 0; i < value.length; i++) {
      if (value[i] == ' ' || value[i] == '\t') {
        return value.substring(0, i + 1);
      }
    }

    return value;
  }

  let i = 1;
  let group = value[0];
  let symbolStack = 1;
  while(symbolStack > 0 && i < value.length) {
    group += value[i];
    if (value[i] == openSymbol) {
      symbolStack++;
    } else if (value[i] == closeSymbol) {
      symbolStack--;
    }
    i++;
  }

  return group;
}

function getGroupsAndBody(value, maxFields) {
  let line, body;
  let newLine = value.indexOf('\n');
  if (newLine >= 0) {
    line = value.substring(0, newLine);
    body = value.substring(newLine);
  } else {
    line = value;
    body = null;
  }

  let groups = new Array(maxFields);
  for (let i = 0; i < maxFields; i++) {
    groups[i] = getNextGroup(line);
    if (groups[i] == null) {
      // All done
      line = '';
      break;
    } else {
      // Strip off beginning
      line = line.substring(groups[i].length);
      // And trim the saved group
      groups[i] = groups[i].trim();
    }
  }

  if (line) {
    body = line + '\n' + body;
  }

  return {groups: groups, body: body};
}

/**
 * Process the tag's value into three pieces: name, tag description, and body
 * description. Parsing the value is handled by splitting the string into groups defined
 * by `{}`, `[]`, `()`, and then on spaces or tabs. The first group is the name,
 * the second group is the tag description, and everything else is the body
 * description. The grouping symbols are included in these values.
 *
 * The name and tag description are returned in an object `{name, description}`.
 * The body description, if it is not empty, is added to the doclet in a
 * `tagDescriptions` array.
 *
 * In order to get around JSDoc's somewhat inconsistent parsing of tags within
 * a jsdoc comment, this handles the entire tag value. In order to work correctly,
 * the tag definition should have:
 *
 * + `mustHaveValue: true`
 * + `mustNotHaveDescription: true`
 * + `canHaveName: false`
 * + `canHaveType: false`
 *
 * @param doclet The JSDoc doclet object to attach additional descriptions too
 * @param tag The tag to process
 * @param minFields {Number} Minimum number of fields that must be present
 * @param maxFields {Number} Maximum number of fields that can be present
 * @returns {Array.<String>}
 */
function handleTag(doclet, tag, minFields = 0, maxFields = 2) {
  let parsed = getGroupsAndBody(tag.value, maxFields);

  // Make sure that all groups up to minFields are not null or throw an exception
  for (let i = 0; i < minFields; i++) {
    if (parsed.groups[i] == null) {
      throw new Error(tag.title + ' requires ' + minFields + ' parameters');
    }
  }

  if (parsed.body) {
    if (!doclet.tagDescriptions) {
      doclet.tagDescriptions = [];
    }
    doclet.tagDescriptions.push(parsed.body);
  }

  return parsed.groups;
}

module.exports = handleTag;
