"use strict";

describe("autoFormat option:", function() {

  var input;

  beforeEach(function() {
    intlSetup(true);
  });

  afterEach(function() {
    var parent = getParentElement(input);

    parent.parentNode.removeChild(parent);

    input.intlTelInput("destroy");
    input = null;
  });


  describe("input containing national number, init plugin with autoFormat and nationalMode enabled", function() {

    var unformattedNumber = "70241812",
      formattedNumber = "(702) 418-12";

    beforeEach(function() {
      input = $("<input value='" + unformattedNumber + "'>");
      // must be in DOM for focus/keys to work
      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(input[0]);

      input.intlTelInput({
        autoFormat: true,
        nationalMode: true
      });
    });

    it("formats the number according to the defaultCountry", function() {
      expect(input[0].value).toEqual(formattedNumber);
    });

    it("changing country still reformats even in nationalMode", function() {
      selectFlag("ar", input);
      expect(input[0].value).toEqual("7024-1812");
    });

    //TODO: this should be in it's own preventInvalidNumbers test file, with more tests
    it("adding too many digits does work even tho it breaks the formatting", function() {
      triggerNativeKeyOnInput("2", input);
      triggerNativeKeyOnInput("2", input);
      triggerNativeKeyOnInput("2", input);
      expect(input[0].value).toEqual(unformattedNumber + "222");
    });

    it("check a previously broken case regarding a UK 0141 number", function() {
      selectFlag("gb", input);
      input[0].value = "0141 534 40";

      // adding a 0 here changes the formatting to "01415 34400", which previously stopped this char from appearing
      triggerNativeKeyOnInput("0", input);
      expect(input[0].value).toEqual("01415 34400");

      // and back again
      triggerNativeKeyOnInput("0", input);
      expect(input[0].value).toEqual("0141 534 4000");
    });

  });



  describe("input with maxlength=6, init plugin with autoFormat enabled", function() {

    beforeEach(function() {
      input = $("<input value='+1 70' maxlength='6'>");
      // must be in DOM for focus/keys to work
      // FIXME: tests still pass when this line is commented out -_-
      document.body.appendChild(input[0]);

      input.intlTelInput({
        autoFormat: true
      });
    });

    it("adding a 6th char doesnt add the normal formatting suffix", function() {
      triggerNativeKeyOnInput("2", input);
      expect(input[0].value).toEqual("+1 702");
    });

    it("typing a 7th char doesnt do anything", function() {
      triggerNativeKeyOnInput("2", input);
      triggerNativeKeyOnInput("4", input);
      expect(input[0].value).toEqual("+1 702");
    });

    it("focusing input (at the maximum length) with cursor in middle, typing char doesnt do anything", function() {
      triggerNativeKeyOnInput("2", input);
      input[0].focus();
      input[0].setSelectionRange(4, 4);
      triggerNativeKeyOnInput("4", input);
      expect(input[0].value).toEqual("+1 702");
    });

  });



  describe("input with no initial value, init plugin with autoFormat enabled and nationalMode disabled", function() {

    beforeEach(function() {
      input = $("<input>");
      // must be in DOM for focus/keys to work
      document.body.appendChild(input[0]);

      input.intlTelInput({
        autoFormat: true,
        nationalMode: false
      });

      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("focusing the input adds the dial code and format suffix", function() {
      input[0].focus();
      expect(input[0].value).toEqual("+1 ");
    });

    it("replacing the val with a number (faking a paste event) re-adds the plus", function() {
      input[0].value = "1";
      dispatchEvent(input[0], "paste", true, false);
      jasmine.clock().tick(1);
      expect(input[0].value).toEqual("+1 ");
    });

    it("replacing the val with an alpha (faking a paste event) re-adds the plus and removes the alpha", function() {
      // FXIME: tests still pass when this line is commented out -_-
      input[0].value = "a";

      dispatchEvent(input[0], "paste", true, false);

      jasmine.clock().tick(1);
      expect(input[0].value).toEqual("+");
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

      beforeEach(function() {
        input.intlTelInput({
          autoFormat: false
        });
      });

      it("initialising the plugin leaves the number the same", function() {
        expect(input[0].value).toEqual(unformattedNumber);
      });

      it("triggering alpha key at end of input adds the alpha char and leaves the rest", function() {
        triggerNativeKeyOnInput("A", input);

        expect(input[0].value).toEqual(unformattedNumber + "A");
      });

    });


    describe("init plugin with autoFormat enabled", function() {

      beforeEach(function() {
        input.intlTelInput({
          autoFormat: true
        });
      });

      it("initialising the plugin formats the number", function() {
        expect(input[0].value).toEqual(formattedNumber);
      });

      it("triggering alpha key at end of input does not add the alpha char", function() {
        // we dont have to manually alter the input val as when autoFormat is enabled this is all done in the event handler
        putCursorAtEnd(input);
        triggerNativeKeyOnInput("A", input);
        expect(input[0].value).toEqual(formattedNumber);
      });



      it("adding a digit automatically adds any formatting suffix", function() {
        input[0].value = "+";

        putCursorAtEnd(input);

        // this is handled by the keypress handler, and so will insert the char for you
        triggerNativeKeyOnInput("1", input);

        expect(input[0].value).toEqual("+1 ");
      });

      it("deleting a digit automatically removes any remaining formatting suffix", function() {
        // backspace key event is handled by the keyup handler, which expects the input val to already be updated, so instead of "+1 7", I have already removed the 7
        input[0].value = "+1 ";

        putCursorAtEnd(input);
        triggerNativeKeyOnInput("BACKSPACE", input);

        expect(input[0].value).toEqual("+1");
      });



      describe("after deleting a char and it removing any format suffix", function() {

        beforeEach(function() {
          // e.g. imagine it was "+1 7" and we deleted the 7 and it auto-removed the rest
          input[0].value = "+1";
          putCursorAtEnd(input);
        });

        it("hitting a number will re-add the formatting in between", function() {
          // this is handled by the keypress handler, and so will insert the char for you
          triggerNativeKeyOnInput("7", input);
          expect(input[0].value).toEqual("+1 7");
        });

        it("hitting any non-number char (e.g. a space) will re-add the formatting suffix", function() {
          // this is handled by the keypress handler, and so will insert the char for you
          triggerNativeKeyOnInput(" ", input);
          expect(input[0].value).toEqual("+1 ");
          // and move the cursor to the end
          expect(input[0].selectionStart).toEqual(input[0].value.length);
        });

      });



      describe("selecting some chars", function() {

        var cursorStart = 3,
          cursorEnd = 6;

        beforeEach(function() {
          // formatted number is "+1 702-418-12" so this will be "702"
          selectInputChars(cursorStart, cursorEnd, input);
        });

        it("hitting a non-number char doesn't do anything", function() {
          triggerNativeKeyOnInput(" ", input);

          expect(input[0].value).toEqual(formattedNumber);

          // check selection remains
          expect(input[0].selectionStart).toEqual(cursorStart);
          expect(input[0].selectionEnd).toEqual(cursorEnd);
        });

        it("hitting a number char will replace the selection, reformat, and put the cursor in the right place", function() {
          triggerNativeKeyOnInput("9", input);
          expect(input[0].value).toEqual("+1 941-812-");
          // cursor
          expect(input[0].selectionStart).toEqual(cursorStart + 1);
        });

      });

    });

  });

});
