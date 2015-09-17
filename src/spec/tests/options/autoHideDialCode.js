"use strict";

describe("autoHideDialCode option:", function() {

  var defaultDialCode = "+1";

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = null;
  });


  describe("init plugin with autoHideDialCode = true and nationalMode = false", function() {

    beforeEach(function() {
      input.intlTelInput({
        autoHideDialCode: true,
        nationalMode: false
      });
      // must be in DOM for focus to work
      document.body.appendChild(getParentElement()[0]);
    });

    afterEach(function() {
      var parent = getParentElement()[0];
      parent.parentNode.removeChild(parent);
    });

    it("does not automatically insert the default dial code", function() {
      expect(getInputVal()).toEqual("");
    });

    it("focusing the input adds the default dial code and blurring it removes it again", function() {
      input[0].focus();
      expect(getInputVal()).toEqual("+1");

      input[0].blur();
      expect(getInputVal()).toEqual("");
    });



    describe("with a phone number", function() {

      var number = "+1 702 987 2345";

      beforeEach(function() {
        input[0].value = number;
      });

      it("focusing and blurring the input doesn't change it", function() {
        input[0].focus();
        expect(getInputVal()).toEqual(number);

        input[0].blur();
        expect(getInputVal()).toEqual(number);
      });

    });

  });


  describe("init plugin with autoHideDialCode = false and nationalMode = false", function() {

    beforeEach(function() {
      input.intlTelInput({
        autoHideDialCode: false,
        nationalMode: false
      });

      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(getParentElement()[0]);
    });

    // FIXME: tests still pass when this function call is commented out -_-
    afterEach(function() {
      var parent = getParentElement();
      parent.parentNode
    });

    it("automatically inserts the default dial code", function() {
      expect(getInputVal()).toEqual(defaultDialCode);
    });

    it("focusing and bluring the input dont change the val", function() {
      input[0].focus();
      expect(getInputVal()).toEqual(defaultDialCode);

      input[0].blur();
      expect(getInputVal()).toEqual(defaultDialCode);
    });


    describe("with a phone number", function() {

      var number = "+1 702 987 2345";

      beforeEach(function() {
        input[0].value = number;
      });

      it("focusing and blurring the input doesn't change it", function() {
        input[0].focus();
        expect(getInputVal()).toEqual(number);

        input[0].blur();
        expect(getInputVal()).toEqual(number);
      });

    });

  });

});
