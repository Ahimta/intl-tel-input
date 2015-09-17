"use strict";


describe("nationalMode:", function() {

  var input;

  beforeEach(function() {
    intlSetup();
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = null;
  });



  describe("init plugin with no value", function() {

    beforeEach(function() {
      input = $("<input>");
      input.intlTelInput({
        nationalMode: true
      });
      // must be in DOM for focus to work
      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(input[0].parentNode);
    });

    afterEach(function() {
      var parent = input[0].parentNode;
      parent.parentNode.removeChild(parent);
    });

    it("defaults to no dial code", function() {
      expect(input[0].value).toEqual("");
    });

    it("focusing the input does not insert the dial code", function() {
      input.focus();
      expect(input[0].value).toEqual("");
    });

    it("selecting another country does not insert the dial code", function() {
      selectFlag("gb", input[0]);
      expect(input[0].value).toEqual("");
    });

    it("but typing a dial code does still update the selected country", function() {
      input[0].value = "+";

      triggerNativeKeyOnInput("4", input[0]);
      triggerNativeKeyOnInput("4", input[0]);

      expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
    });

  });



  describe("init plugin with US national number and selectCountry=us", function() {

    var nationalNum = "702 418 1234";

    beforeEach(function() {
      input = $("<input value='" + nationalNum + "'>");
      input.intlTelInput({
        nationalMode: true
      });
      input.intlTelInput("selectCountry", "us");
    });

    it("displays the number and has US flag selected", function() {
      expect(input[0].value).toEqual(nationalNum);
      expect(getSelectedFlagElement(input[0])).toHaveClass("us");
    });

    it("changing to canadian area code updates flag", function() {
      input.val("204 555 555");
      triggerNativeKeyOnInput("5", input[0]); // trigger update flag
      expect(getSelectedFlagElement(input[0])).toHaveClass("ca");
    });

  });



  describe("init plugin with intl number", function() {

    var intlNumber = "+44 7733 123456";

    beforeEach(function() {
      input = $("<input value='" + intlNumber + "'>");
      input.intlTelInput({
        nationalMode: true
      });
    });

    it("displays the number and selects the right flag", function() {
      expect(input[0].value).toEqual(intlNumber);
      expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
    });

    it("changing to another intl number updates the flag", function() {
      input.val("+34 5555555");
      triggerNativeKeyOnInput("5", input[0]); // trigger update flag
      expect(getSelectedFlagElement(input[0])).toHaveClass("es");
    });

  });

});
