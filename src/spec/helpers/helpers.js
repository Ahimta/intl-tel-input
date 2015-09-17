var input,
  totalCountries = 233,
  totalDialCodes = 227,
  // don't call this "keys" as it will clash with the plugin
  keyCodes = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    BACKSPACE: 8,
    DELETE: 46,
    CTRL: 17
  };

var intlSetup = function(utilsScript) {
  // by default put us in desktop mode
  window.innerWidth = 1024;

  // this should only run the first time
  if (!window.intlTelInputUtilsBackup) {
    window.intlTelInputUtilsBackup = window.intlTelInputUtils;
  }

  if (utilsScript) {
    window.intlTelInputUtils = window.intlTelInputUtilsBackup;
  } else {
    window.intlTelInputUtils = null;
  }
};

var getInputVal = function(i) {
  i = i || input;
  return i[0].value;
};

var getParentElement = function(i) {
  i = i || input;
  return i[0].parentNode;
};

var getListElement = function(i) {
  i = i || input;

  var listElements = i[0].parentNode.querySelectorAll(".country-list");

  // there should be only one list element, except when the plugin is destroyed, then there will be zero
  if (listElements.length <= 1)  { return listElements[0]; }
  else                           { throw new Error("-_-"); }
};

var getListLength = function(i) {
  i = i || input;
  return getListElement(i).querySelectorAll("li.country").length;
};

var getActiveListItem = function(i) {
  i = i || input;

  var activeListItems = getListElement(i).querySelectorAll("li.active");

  // there should be only one active item
  if (activeListItems.length === 1) { return activeListItems; }
  else                              { throw new Error("-_-"); }
};

var getPreferredCountriesLength = function(i) {
  i = i || input;
  return getListElement(i).querySelectorAll("li.preferred").length;
};

var getSelectedFlagContainer = function(i) {
  i = i || input;

  var selectedFlagContainers = i[0].parentNode.querySelectorAll(".selected-flag");

  // there should be only one selected element, except when the plugin is destroyed, then there will be zero
  if (selectedFlagContainers.length <= 1)  { return selectedFlagContainers[0]; }
  else                                     { throw new Error("-_-");           }
};

var getSelectedFlagElement = function(i) {
  i = i || input;

  var selectedFlagElement = getSelectedFlagContainer(i).querySelectorAll(".iti-flag");

  // there should be only one selected flag element
  if (selectedFlagElement.length === 1) { return selectedFlagElement[0]; }
  else                                  { throw new Error("-_-");        }
};

var getFlagsContainerElement = function(i) {
  i = i || input;
  var flagContainerElement = i[0].parentNode.querySelectorAll(".flag-dropdown");

  // there should be only one flag container element
  if (flagContainerElement.length === 1) { return flagContainerElement[0]; }
  else                                   { throw new Error("-_-");         }
};

var dispatchEvent = function(element, name, bubbles, cancellable) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(name, bubbles, cancellable);
  element.dispatchEvent(event);
}

var selectFlag = function(countryCode, i) {
  i = i || input;
  dispatchEvent(getSelectedFlagContainer(i), "click", true, false);

  var elements = getListElement(i).querySelectorAll("li[data-country-code='" + countryCode + "']");

  // there should be at most 2 list elements for a country code when a country is preferred
  if (elements.length > 2) { throw new Error("-_-"); }

  dispatchEvent(elements[0], "click", true, false);
};

var putCursorAtEnd = function() {
  var len = input[0].value.length;
  selectInputChars(len, len);
};

var selectInputChars = function(start, end) {
  input[0].setSelectionRange(start, end);
};

var getKeyCode = function(key) {
  return (key.length > 1) ? keyCodes[key] : key.charCodeAt(0);
};

var getNativeKeyEvent = function(eventName, key, bubbles, cancellable) {
  var event = document.createEvent("HTMLEvents");
  var code = getKeyCode(key);

  event.keyCode = code;
  event.which = code;
  event.initEvent(eventName, bubbles, cancellable);

  return event;
}

var dispatchKeyEvent = function(element, eventName, key) {
  var event = getNativeKeyEvent(eventName, key, true, true);
  element.dispatchEvent(event);
}

// trigger keydown, then keypress, then add the key, then keyup
var triggerNativeKeyOnInput = function(key) {
  var element = input[0];
  var e = getNativeKeyEvent("keypress", key, true, true);

  element.dispatchEvent(getNativeKeyEvent("keydown", key, true, true));
  element.dispatchEvent(e);

  // insert char
  if (!e.defaultPrevented) {
    var val = element.value;
    element.value = val.substr(0, element.selectionStart) + key + val.substring(element.selectionEnd, val.length);
  }

  element.dispatchEvent(getNativeKeyEvent("keyup", key, true, true));
};

var triggerKeyOnBody = function(key) {
  document.dispatchEvent(getNativeKeyEvent("keydown", key, true, true));
  document.dispatchEvent(getNativeKeyEvent("keypress", key, true, true));
  document.dispatchEvent(getNativeKeyEvent("keyup", key, true, true));
};

var triggerKeyOnFlagsContainerElement = function(key) {
  dispatchKeyEvent(getFlagsContainerElement(), "keydown", key);
};
