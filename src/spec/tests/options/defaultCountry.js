"use strict";

describe("defaultCountry: init plugin with a default country", function() {

  var defaultCountry = "jp";
  var input;

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
    input.intlTelInput({
      defaultCountry: defaultCountry
    });
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = null;
  });

  it("sets the selected flag correctly", function() {
    expect(getSelectedFlagElement(input[0])).toHaveClass(defaultCountry);
  });

  it("sets the active list item correctly", function() {
    expect(getActiveListItem(input[0])[0].getAttribute("data-country-code")).toEqual(defaultCountry);
  });

});
