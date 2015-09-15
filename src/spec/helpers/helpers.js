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
  return i.val();
};

var getParentElement = function(i) {
  i = i || input;
  return i.parent();
};

var getListElement = function(i) {
  i = i || input;
  return i.parent().find(".country-list");
};

var getListLength = function(i) {
  i = i || input;
  return getListElement(i).find("li.country").length;
};

var getActiveListItem = function(i) {
  i = i || input;
  return getListElement(i).find("li.active");
};

var getPreferredCountriesLength = function(i) {
  i = i || input;
  return getListElement(i).find("li.preferred").length;
};

var getSelectedFlagContainer = function(i) {
  i = i || input;
  return i.parent().find(".selected-flag");
};

var getSelectedFlagElement = function(i) {
  i = i || input;
  return getSelectedFlagContainer(i).find(".iti-flag");
};

var getFlagsContainerElement = function(i) {
  i = i || input;
  return i.parent().find(".flag-dropdown");
};

var selectFlag = function(countryCode, i) {
  i = i || input;
  dispatchEvent(getSelectedFlagContainer(i)[0], "click", true, false);

  var element = getListElement(i)[0].querySelector("li[data-country-code='" + countryCode + "']");
  dispatchEvent(element, "click", true, false);
};

var putCursorAtEnd = function() {
  var len = input.val().length;
  selectInputChars(len, len);
};

var selectInputChars = function(start, end) {
  input[0].setSelectionRange(start, end);
};

var getKeyEvent = function(key, type) {
  return $.Event(type, {
    which: (key.length > 1) ? keyCodes[key] : key.charCodeAt(0)
  });
};

var dispatchKeyEvent = function(element, eventName, key) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, true, true);
  event.view = window;
  event.keyCode = key;
  event.which = key;
  element.dispatchEvent(event);
}

// trigger keydown, then keypress, then add the key, then keyup
var triggerKeyOnInput = function(key) {
  input.trigger(getKeyEvent(key, "keydown"));
  var e = getKeyEvent(key, "keypress");
  input.trigger(e);
  // insert char
  if (!e.isDefaultPrevented()) {
    var domInput = input[0],
      val = input.val();
    input.val(val.substr(0, domInput.selectionStart) + key + val.substring(domInput.selectionEnd, val.length));
  }
  input.trigger(getKeyEvent(key, "keyup"));
};

var getKeyCode = function(key) {
  return (key.length > 1) ? keyCodes[key] : key.charCodeAt(0);
};

var triggerKeyOnBody = function(key) {
  dispatchKeyEvent(document, "keydown", getKeyCode(key));
  dispatchKeyEvent(document, "keypress", getKeyCode(key));
  dispatchKeyEvent(document, "keyup", getKeyCode(key));
};

var triggerKeyOnFlagsContainerElement = function(key) {
  getFlagsContainerElement().trigger(getKeyEvent(key, "keydown"));
};

var dispatchEvent = function(element, name, bubbles, cancellable) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(name, bubbles, cancellable);
  element.dispatchEvent(event);
}
