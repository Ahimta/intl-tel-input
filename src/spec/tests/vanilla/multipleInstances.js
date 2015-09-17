"use strict";

describe("multiple instances: init vanilla plugin (with nationalMode=false) to test multiple instances", function() {

  var input2,
    afghanistanCountryCode = "af",
    albaniaCountryCode = "al",
    chinaCountryCode = "cn",
    chinaDialCode = "+86";

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
    input2 = $("<input>");
    // japan and china
    input.intlTelInput({
      onlyCountries: [chinaCountryCode, afghanistanCountryCode],
      nationalMode: false
    });
    // korea, china and russia
    input2.intlTelInput({
      onlyCountries: ['kr', chinaCountryCode, 'ru', albaniaCountryCode],
      nationalMode: false
    });

    document.body.appendChild(getParentElement(input));
    document.body.appendChild(getParentElement(input2));
  });

  afterEach(function() {
    var parent1 = getParentElement(input);
    var parent2 = getParentElement(input2);

    parent1.parentNode.removeChild(parent1);
    parent2.parentNode.removeChild(parent2);

    input.intlTelInput("destroy");
    input2.intlTelInput("destroy");

    input = input2 = null;
  });

  it("instances have different country lists", function() {
    expect(getListLength()).toEqual(2);
    expect(getListLength(input2)).toEqual(4);
  });

  it("instances have different default countries selected", function() {
    expect(getSelectedFlagElement()).toHaveClass(afghanistanCountryCode);
    expect(getSelectedFlagElement(input2)).toHaveClass(albaniaCountryCode);
  });

  it("selecting an item from the first input dropdown only updates the flag on that input", function() {
    selectFlag(chinaCountryCode);
    expect(getInputVal()).toEqual(chinaDialCode);
    expect(getInputVal(input2)).toEqual("");
  });

  it("updating the number on the first input only updates the flag on that input", function() {
    input[0].value = chinaDialCode + " 123456";

    triggerNativeKeyOnInput(" ");

    expect(getSelectedFlagElement()).toHaveClass(chinaCountryCode);
    expect(getSelectedFlagElement(input2)).toHaveClass(albaniaCountryCode);
  });



  describe("clicking open dropdown on the first input", function() {

    beforeEach(function() {
      dispatchEvent(getSelectedFlagContainer(), "click", true, false);
    });

    it("only opens the dropdown on that input", function() {
      expect(getListElement()).not.toHaveClass("hide");
      expect(getListElement(input2)).toHaveClass("hide");
    });

    it("then clicking open dropdown on the second will close the first and open the second", function() {
      dispatchEvent(getSelectedFlagContainer(input2), "click", true, false);
      expect(getListElement()).toHaveClass("hide");
      expect(getListElement(input2)).not.toHaveClass("hide");
    });

  });

});
