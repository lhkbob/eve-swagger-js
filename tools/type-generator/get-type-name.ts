import { ExportableType } from './exportable-type';
import { Namespace } from './namespace';
import { TYPENAME_OVERRIDES } from './type-overrides';

const pluralize = require('pluralize'); // No typings associated

export function getTypeName(namespace: Namespace,
    type: ExportableType): [string, boolean] {
  let namespaceName = namespace.fullName;
  let finalName: [string, boolean] | undefined;
  for (let title of type.titles) {
    let name = titleToTypeName(namespaceName, title);
    if (finalName) {
      if (name[1]) {
        // An explicit type name, so make sure it isn't masking anything
        if (finalName[1] && name[0] !== finalName[0]) {
          // Previous explicit name from another title is different
          console.error(title + '\'s override to ' + name[0]
              + ' shadows explicit name of ' + finalName[0]);
          console.error('Triggered by type:', type);
        }
        // Otherwise take this name since it either is the same, or overrides
        // a non-explicit name
        finalName = name;
      } else if (!finalName[1] && name[0].length < finalName[0].length) {
        // Take the shorter of the generated names
        finalName = name;
      }
    } else {
      // First valid name
      finalName = name;
    }
  }

  if (finalName) {
    return finalName;
  } else {
    throw new Error('Unable to generate typename for ' + type.titles[0]);
  }
}

function makeStem(text: string) :string {
  return pluralize.singular(text).toLowerCase();
}

function capitalize(text: string) :string {
  if (text !== '') {
    return text[0].toUpperCase() + text.substring(1);
  } else {
    return '';
  }
}

function titleToTypeName(namespace: string, title: string): [string, boolean] {
  // First check explicit mapping for title
  if (TYPENAME_OVERRIDES[title]) {
    return [TYPENAME_OVERRIDES[title], true];
  }

  if (title[0].toUpperCase() === title[0]) {
    // Assume this is actually an explicit type name already
    return [title, true];
  }

  let namespaceStems = [];
  for (let n of namespace.split('.')) {
    namespaceStems.push(makeStem(n));
  }

  let tokens = title.split('_');
  let lastIDToken = tokens.length - 1;
  while (lastIDToken >= 0) {
    if (tokens[lastIDToken] === 'id' || tokens[lastIDToken] === 'element') {
      break;
    }
    lastIDToken--;
  }

  let startToken, endToken;
  if (lastIDToken > 0) {
    // Found an ID; if the id was at the end of the token list, then include
    // only the tokens from it to the second ID (or 1st token). Otherwise
    // include tokens from the right of the id to the end.
    if (lastIDToken < tokens.length - 1) {
      startToken = lastIDToken + 1;
      endToken = tokens.length - 1;
    } else {
      lastIDToken--;
      endToken = lastIDToken;
      // Search for second _id
      while (lastIDToken >= 0) {
        if (tokens[lastIDToken] === 'id' || tokens[lastIDToken] === 'element') {
          break;
        }
        lastIDToken--;
      }
      startToken = Math.max(1, lastIDToken + 1);
    }
  } else {
    // Take everything except the first token, which is the HTTP method
    startToken = 1;
    endToken = tokens.length - 1;
  }

  // Now filter the tokens to remove redundancy, and fix pluralization
  // based on the presence of element tags.
  let goodTokens = [];
  let backupToken = startToken > 2 ? capitalize(tokens[startToken - 2])
      : 'Info';

  for (let i = startToken; i <= endToken; i++) {
    if (tokens[i] === 'element' || tokens[i] === '200' || tokens[i] === '201'
        || tokens[i] === 'ok') {
      continue;
    }

    let token;
    if (i < tokens.length - 1 && tokens[i + 1] === 'element') {
      // Make it singular
      token = pluralize.singular(tokens[i]);
    } else {
      token = tokens[i];
    }

    // Now make it capitalized
    token = capitalize(token);
    let newStem = makeStem(token);
    let oldStem;

    if (goodTokens.length > 0) {
      // Check previous token
      oldStem = [makeStem(goodTokens[goodTokens.length - 1])];
    } else {
      // First token of the type name, check against the namespace instead
      oldStem = namespaceStems;
    }

    if (oldStem.indexOf(newStem) >= 0) {
      if (goodTokens.length > 0) {
        // Replace prior token with this as it has higher precedence
        // (and while stems are the same, the actual tokens may differ)
        goodTokens[goodTokens.length - 1] = token;
      } else {
        // Don't include it in the main tokens, but remember in case no
        // good token ever shows up
        backupToken = token;
      }
    } else {
      // Append the new token since it is not redundant
      goodTokens.push(token);
    }
  }

  let generatedName = goodTokens.length > 0 ? goodTokens.join('') : backupToken;
  return [generatedName, false];
}
