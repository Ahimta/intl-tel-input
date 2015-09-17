"use strict";

describe("getSelectedCountryData: init plugin to test public method getSelectedCountryData", function() {

  var input;

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
    input.intlTelInput();
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = null;
  });

  it("gets the right default country data", function() {
    expect(input.intlTelInput("getSelectedCountryData").iso2).toEqual("us");
  });

  it("change country by number gets the right country data", function() {
    input[0].value = "+44";
    triggerNativeKeyOnInput(" ", input[0]);
    expect(input.intlTelInput("getSelectedCountryData").iso2).toEqual("gb");
  });

  it("change country by selecting a flag gets the right country data", function() {
    selectFlag("ch", input[0]);
    expect(input.intlTelInput("getSelectedCountryData").iso2).toEqual("ch");
  });

});
