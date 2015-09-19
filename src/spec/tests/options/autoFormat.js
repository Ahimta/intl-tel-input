"use strict";

describe("autoFormat option:", function() {

  var input;

  beforeEach(function() {
    intlSetup(true);
  });

  afterEach(function() {
    var parent = input[0].parentNode;

    parent.parentNode.removeChild(parent);

    input.intlTelInput("destroy");
    input = null;
  });


  describe("input containing national number, init plugin with autoFormat and nationalMode enabled", function() {

    var unformattedNumber = "70241812",
      formattedNumber = "(702) 418-12";

    var input2;

    beforeEach(function() {
      input = $("<input value='" + unformattedNumber + "'>");

      var element = document.createElement("input");
      element.value = unformattedNumber;

      // must be in DOM for focus/keys to work
      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(element);
      document.body.appendChild(input[0]);

      input2 = new IntlTelInput(element, {
        autoFormat: true,
        nationalMode: true
      });

      input.intlTelInput({
        autoFormat: true,
        nationalMode: true
      });
    });

    afterEach(function() {
      var parent = input2.inputElement.parentNode;

      parent.parentNode.removeChild(parent);

      input2.destroy();
      input2 = null;
    });

    it("formats the number according to the defaultCountry", function() {
      expect(input2.inputElement.value).toEqual(formattedNumber);
    });

    it("changing country still reformats even in nationalMode", function() {
      selectFlag("ar", input2.inputElement);
      expect(input2.inputElement.value).toEqual("7024-1812");
    });

    //TODO: this should be in it's own preventInvalidNumbers test file, with more tests
    it("adding too many digits does work even tho it breaks the formatting", function() {
      triggerNativeKeyOnInput("2", input2.inputElement);
      triggerNativeKeyOnInput("2", input2.inputElement);
      triggerNativeKeyOnInput("2", input2.inputElement);

      expect(input2.inputElement.value).toEqual(unformattedNumber + "222");
    });

    it("check a previously broken case regarding a UK 0141 number", function() {
      selectFlag("gb", input2.inputElement);
      input2.inputElement.value = "0141 534 40";

      // adding a 0 here changes the formatting to "01415 34400", which previously stopped this char from appearing
      triggerNativeKeyOnInput("0", input2.inputElement);
      expect(input2.inputElement.value).toEqual("01415 34400");

      // and back again
      triggerNativeKeyOnInput("0", input2.inputElement);
      expect(input2.inputElement.value).toEqual("0141 534 4000");
    });

  });



  describe("input with maxlength=6, init plugin with autoFormat enabled", function() {

    var input2;

    beforeEach(function() {
      input = $("<input value='+1 70' maxlength='6'>");
      // must be in DOM for focus/keys to work
      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(input[0]);

      input.intlTelInput({
        autoFormat: true
      });

      var element = document.createElement("input");
      element.setAttribute("maxlength", "6");
      element.value = "+1 70";

      document.body.appendChild(element);

      input2 = new IntlTelInput(element, {
        autoFormat: true
      });
    });

    afterEach(function() {
      var parent = input2.inputElement.parentNode;

      parent.parentNode.removeChild(parent);

      input2.destroy();
      input2 = null;
    });

    it("adding a 6th char doesnt add the normal formatting suffix", function() {
      triggerNativeKeyOnInput("2", input2.inputElement);
      expect(input2.inputElement.value).toEqual("+1 702");
    });

    it("typing a 7th char doesnt do anything", function() {
      triggerNativeKeyOnInput("2", input2.inputElement);
      triggerNativeKeyOnInput("4", input2.inputElement);

      expect(input2.inputElement.value).toEqual("+1 702");
    });

    it("focusing input (at the maximum length) with cursor in middle, typing char doesnt do anything", function() {
      triggerNativeKeyOnInput("2", input2.inputElement);
      input2.inputElement.focus();
      input2.inputElement.setSelectionRange(4, 4);
      triggerNativeKeyOnInput("4", input2.inputElement);

      expect(input2.inputElement.value).toEqual("+1 702");
    });

  });



  describe("input with no initial value, init plugin with autoFormat enabled and nationalMode disabled", function() {

    var input2;

    beforeEach(function() {
      input = $("<input>");
      // must be in DOM for focus/keys to work
      document.body.appendChild(input[0]);

      input.intlTelInput({
        autoFormat: true,
        nationalMode: false
      });

      var element = document.createElement("input");

      document.body.appendChild(element);

      input2 = new IntlTelInput(element, {
        autoFormat: true,
        nationalMode: false
      });

      jasmine.clock().install();
    });

    afterEach(function() {
      var parent = input2.inputElement.parentNode;

      parent.parentNode.removeChild(parent);

      input2.destroy();
      input2 = null;
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("focusing the input adds the dial code and format suffix", function() {
      input2.inputElement.focus();
      expect(input2.inputElement.value).toEqual("+1 ");
    });

    it("replacing the val with a number (faking a paste event) re-adds the plus", function() {
      input2.inputElement.value = "1";

      dispatchEvent(input2.inputElement, "paste", true, false);
      jasmine.clock().tick(1);

      expect(input2.inputElement.value).toEqual("+1 ");
    });

    it("replacing the val with an alpha (faking a paste event) re-adds the plus and removes the alpha", function() {
      // FXIME: tests still pass when this line is commented out -_-
      input2.inputElement.value = "a";

      dispatchEvent(input2.inputElement, "paste", true, false);
      jasmine.clock().tick(1);

      expect(input2.inputElement.value).toEqual("+");
    });

  });



  describe("input with bad initial value", function() {

    // use an incomplete number else pointless to test adding digits as they would be ignored anyway
    var unformattedNumber = "+1 702 418 12 B",
      formattedNumber = "+1 702-418-12";

    beforeEach(function() {
      input = $("<input value='" + unformattedNumber + "'>");
      // must be in DOM for focus/keys to work
      document.body.appendChild(input[0]);
    });


    describe("init plugin with autoFormat disabled", function() {

      var input2;

      beforeEach(function() {
        input.intlTelInput({
          autoFormat: false
        });

        var element = document.createElement("input");
        element.value = unformattedNumber;

        document.body.appendChild(element);

        input2 = new IntlTelInput(element, {
          autoFormat: false
        });
      });

      afterEach(function() {
        var parent = input2.inputElement.parentNode;

        parent.parentNode.removeChild(parent);

        input2.destroy();
        input2 = null;
      });

      it("initialising the plugin leaves the number the same", function() {
        expect(input2.inputElement.value).toEqual(unformattedNumber);
      });

      it("triggering alpha key at end of input adds the alpha char and leaves the rest", function() {
        triggerNativeKeyOnInput("A", input2.inputElement);
        expect(input2.inputElement.value).toEqual(unformattedNumber + "A");
      });

    });


    describe("init plugin with autoFormat enabled", function() {

      var input2;

      beforeEach(function() {
        input.intlTelInput({
          autoFormat: true
        });

        var element = document.createElement("input");
        element.value = unformattedNumber;

        document.body.appendChild(element);

        input2 = new IntlTelInput(element, {
          autoFormat: true
        });
      });

      afterEach(function() {
        var parent = input2.inputElement.parentNode;

        parent.parentNode.removeChild(parent);

        input2.destroy();
        input2 = null;
      });

      it("initialising the plugin formats the number", function() {
        expect(input2.inputElement.value).toEqual(formattedNumber);
      });

      it("triggering alpha key at end of input does not add the alpha char", function() {
        // we dont have to manually alter the input val as when autoFormat is enabled this is all done in the event handler
        putCursorAtEnd(input2.inputElement);
        triggerNativeKeyOnInput("A", input2.inputElement);

        expect(input2.inputElement.value).toEqual(formattedNumber);
      });



      it("adding a digit automatically adds any formatting suffix", function() {
        input2.inputElement.value = "+";
        putCursorAtEnd(input2.inputElement);

        // this is handled by the keypress handler, and so will insert the char for you
        triggerNativeKeyOnInput("1", input2.inputElement);
        expect(input2.inputElement.value).toEqual("+1 ");
      });

      it("deleting a digit automatically removes any remaining formatting suffix", function() {
        // backspace key event is handled by the keyup handler, which expects the input val to already be updated, so instead of "+1 7", I have already removed the 7
        input2.inputElement.value = "+1 ";
        putCursorAtEnd(input2.inputElement);
        triggerNativeKeyOnInput("BACKSPACE", input2.inputElement);

        expect(input2.inputElement.value).toEqual("+1");
      });



      describe("after deleting a char and it removing any format suffix", function() {

        beforeEach(function() {
          // e.g. imagine it was "+1 7" and we deleted the 7 and it auto-removed the rest
          input2.inputElement.value = "+1";
          putCursorAtEnd(input2.inputElement);
        });

        it("hitting a number will re-add the formatting in between", function() {
          // this is handled by the keypress handler, and so will insert the char for you
          triggerNativeKeyOnInput("7", input2.inputElement);
          expect(input2.inputElement.value).toEqual("+1 7");
        });

        it("hitting any non-number char (e.g. a space) will re-add the formatting suffix", function() {
          // this is handled by the keypress handler, and so will insert the char for you
          triggerNativeKeyOnInput(" ", input2.inputElement);
          expect(input2.inputElement.value).toEqual("+1 ");

          // and move the cursor to the end
          expect(input2.inputElement.selectionStart).toEqual(input2.inputElement.value.length);
        });

      });



      describe("selecting some chars", function() {

        var cursorStart = 3,
          cursorEnd = 6;

        beforeEach(function() {
          // formatted number is "+1 702-418-12" so this will be "702"
          input2.inputElement.setSelectionRange(cursorStart, cursorEnd);
        });

        it("hitting a non-number char doesn't do anything", function() {
          triggerNativeKeyOnInput(" ", input2.inputElement);
          expect(input2.inputElement.value).toEqual(formattedNumber);

          // check selection remains
          expect(input2.inputElement.selectionStart).toEqual(cursorStart);
          expect(input2.inputElement.selectionEnd).toEqual(cursorEnd);
        });

        it("hitting a number char will replace the selection, reformat, and put the cursor in the right place", function() {
          triggerNativeKeyOnInput("9", input2.inputElement);
          expect(input2.inputElement.value).toEqual("+1 941-812-");

          // cursor
          expect(input2.inputElement.selectionStart).toEqual(cursorStart + 1);
        });

      });

    });

  });

});
