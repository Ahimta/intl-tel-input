"use strict";

describe("multiple instances: init vanilla plugin (with nationalMode=false) to test multiple instances", function() {

  var input,
    input2,
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

    document.body.appendChild(input[0].parentNode);
    document.body.appendChild(input2[0].parentNode);
  });

  afterEach(function() {
    var parent1 = input[0].parentNode;
    var parent2 = input2[0].parentNode;

    parent1.parentNode.removeChild(parent1);
    parent2.parentNode.removeChild(parent2);

    input.intlTelInput("destroy");
    input2.intlTelInput("destroy");

    input = input2 = null;
  });

  it("instances have different country lists", function() {
    expect(getListLength(input[0])).toEqual(2);
    expect(getListLength(input2[0])).toEqual(4);
  });

  it("instances have different default countries selected", function() {
    expect(getSelectedFlagElement(input[0])).toHaveClass(afghanistanCountryCode);
    expect(getSelectedFlagElement(input2[0])).toHaveClass(albaniaCountryCode);
  });

  it("selecting an item from the first input dropdown only updates the flag on that input", function() {
    selectFlag(chinaCountryCode, input[0]);
    expect(input[0].value).toEqual(chinaDialCode);
    expect(input2[0].value).toEqual("");
  });

  it("updating the number on the first input only updates the flag on that input", function() {
    input[0].value = chinaDialCode + " 123456";

    triggerNativeKeyOnInput(" ", input[0]);

    expect(getSelectedFlagElement(input[0])).toHaveClass(chinaCountryCode);
    expect(getSelectedFlagElement(input2[0])).toHaveClass(albaniaCountryCode);
  });



  describe("clicking open dropdown on the first input", function() {

    beforeEach(function() {
      dispatchEvent(getSelectedFlagContainer(input[0]), "click", true, false);
    });

    it("only opens the dropdown on that input", function() {
      expect(getListElement(input[0])).not.toHaveClass("hide");
      expect(getListElement(input2[0])).toHaveClass("hide");
    });

    it("then clicking open dropdown on the second will close the first and open the second", function() {
      dispatchEvent(getSelectedFlagContainer(input2[0]), "click", true, false);
      expect(getListElement(input[0])).toHaveClass("hide");
      expect(getListElement(input2[0])).not.toHaveClass("hide");
    });

  });

});
