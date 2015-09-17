"use strict";

describe("onlyCountries option:", function() {

  var onlyCountries;

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = onlyCountries = null;
  });



  describe("init plugin with onlyCountries", function() {

    var chinaCountryCode = "cn";

    beforeEach(function() {
      // China and Japan (note that none of the default preferredCountries are included here, so wont be in the list)
      onlyCountries = ['jp', chinaCountryCode, 'kr'];
      input.intlTelInput({
        onlyCountries: onlyCountries
      });
    });

    it("defaults to the first onlyCountries alphabetically", function() {
      expect(getSelectedFlagElement()).toHaveClass(chinaCountryCode);
    });

    it("has the right number of list items", function() {
      expect(getListLength()).toEqual(onlyCountries.length);
    });

  });


  describe("init plugin with onlyCountries for Afghanistan, Kazakhstan and Russia", function() {

    beforeEach(function() {
      input.intlTelInput({
        preferredCountries: [],
        onlyCountries: ["af", "kz", "ru"]
      });
    });

    it("entering +7 defaults to the top priority country (Russia)", function() {
      input[0].value = "+7";
      triggerNativeKeyOnInput(" ");
      expect(getSelectedFlagElement()).toHaveClass("ru");
    });

  });



  describe("init plugin on 2 different inputs with different onlyCountries and nationalMode = false", function() {

    var input2;

    beforeEach(function() {
      input2 = $("<input>");
      // japan
      input.intlTelInput({
        onlyCountries: ['jp'],
        nationalMode: false
      });
      // korea
      input2.intlTelInput({
        onlyCountries: ['kr'],
        nationalMode: false
      });

      document.body.appendChild(getParentElement(input)[0]);
      document.body.appendChild(getParentElement(input2)[0]);
    });

    afterEach(function() {
      var parent1 = getParentElement(input)[0];
      var parent2 = getParentElement(input2)[0];

      parent1.parentNode.removeChild(parent1);
      parent2.parentNode.removeChild(parent2);

      input2 = null;
    });

    it("first instance still works", function() {
      input[0].focus();
      expect(input[0].value).toEqual("+81");
    });

  });

});
