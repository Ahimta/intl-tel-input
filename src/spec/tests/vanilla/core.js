"use strict";

describe("vanilla:", function() {

  var input;

  beforeEach(function() {
    intlSetup();
  });


  describe("init plugin on input with prepopulated value", function() {

    beforeEach(function() {
      input = $("<input value='+44 12345'>");
      input.intlTelInput();
    });

    afterEach(function() {
      input.intlTelInput("destroy");
      input = null;
    });

    it("sets the selected flag correctly", function() {
      expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
    });

    it("sets the active list item correctly", function() {
      expect(getActiveListItem(input[0])[0].getAttribute("data-country-code")).toEqual("gb");
    });

  });



  describe("init vanilla plugin on input with invalid prepopulated value", function() {

    beforeEach(function() {
      input = $("<input value='8'>");
      input.intlTelInput();
    });

    afterEach(function() {
      input.intlTelInput("destroy");
      input = null;
    });

    it("sets the selected flag correctly", function() {
      expect(getSelectedFlagElement(input[0])).toHaveClass("us");
    });

    it("sets the active list item correctly", function() {
      expect(getActiveListItem(input[0])[0].getAttribute("data-country-code")).toEqual("us");
    });

  });



  describe("init vanilla plugin with nationalMode = false", function() {

    beforeEach(function() {
      input = $("<input>");
      input.intlTelInput({
        nationalMode: false
      });
    });

    afterEach(function() {
      input.intlTelInput("destroy");
      input = null;
    });


    it("creates a container with the right class", function() {
      expect(input[0].parentNode).toHaveClass("intl-tel-input");
    });

    // preferredCountries defaults to 2 countries
    it("has the right number of list items", function() {
      var defaultPreferredCountries = 2;
      expect(getListLength(input[0])).toEqual(totalCountries + defaultPreferredCountries);
      expect(getPreferredCountriesLength(input[0])).toEqual(defaultPreferredCountries);
      // only 1 active list item
      expect(getActiveListItem(input[0]).length).toEqual(1);
    });

    it("defaults to the right flag", function() {
      expect(getSelectedFlagElement(input[0])).toHaveClass("us");
    });

    it("sets the active list item correctly", function() {
      expect(getActiveListItem(input[0])[0].getAttribute("data-country-code")).toEqual("us");
    });

    // autoHideDialCode defaults to true, which means dont show dial code until focused
    it("doesn't automatically populate the input value on initialisation", function() {
      expect(input[0].value).toEqual("");
    });



    describe("opening the dropdown and clicking on canada", function() {

      beforeEach(function() {
        selectFlag("ca", input[0]);
      });

      it("updates the selected flag", function() {
        expect(getSelectedFlagElement(input[0])).toHaveClass("ca");
      });

      it("adding a space doesnt reset to the default country for that dial code", function() {
        // FIXME: tests still pass when this line is commented out -_-
        triggerNativeKeyOnInput(" ", input[0]);
        expect(getSelectedFlagElement(input[0])).toHaveClass("ca");
      });

    });



    describe("typing a number with a different dial code", function() {

      beforeEach(function() {
        input[0].value = "+44 1234567";
        triggerNativeKeyOnInput(" ", input[0]);
      });

      it("updates the selected flag", function() {
        expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
      });

      it("clearing the input again does not change the selected flag", function() {
        input[0].value = "";
        // FIXME: tests still pass when this line is commented out -_-
        triggerNativeKeyOnInput(" ", input[0]);
        expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
      });

    });



    describe("typing a dial code containing a space", function() {

      var telNo = "98765432",
        key = "1";

      beforeEach(function() {
        input[0].value = "+4 4 " + telNo;
        triggerNativeKeyOnInput(key, input[0]);
      });

      it("still updates the flag correctly", function() {
        expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
      });

      it("then changing the flag updates the number correctly", function() {
        selectFlag("zw", input[0]);
        expect(input[0].value).toEqual("+263 " + telNo + key);
      });

    });



    describe("typing a dial code containing a dot", function() {

      var telNo = "98765432",
        key = "1";

      beforeEach(function() {
        input[0].value = "+4.4 " + telNo;
        triggerNativeKeyOnInput(key, input[0]);
      });

      it("still updates the flag correctly", function() {
        expect(getSelectedFlagElement(input[0])).toHaveClass("gb");
      });

      it("then changing the flag updates the number correctly", function() {
        selectFlag("zw", input[0]);
        expect(input[0].value).toEqual("+263 " + telNo + key);
      });

    });



    // must add to the dom to get focus/click-off-to-close to work
    describe("adding to dom", function() {

      beforeEach(function() {
        document.body.appendChild(input[0].parentNode);
      });

      afterEach(function() {
        var parentElement = input[0].parentNode;
        parentElement.parentNode.removeChild(parentElement);
      });

      // autoHideDialCode defaults to true
      it("focusing the input adds the default dial code, and blur removes it again", function() {
        expect(input[0].value).toEqual("");
        input[0].focus();
        expect(input[0].value).toEqual("+1");
        input[0].blur();
        expect(input[0].value).toEqual("");
      });


      describe("clicking the selected flag to open the dropdown", function() {

        beforeEach(function() {
          dispatchEvent(getSelectedFlagContainer(input[0]), "click", true, false);;
        });

        it("opens the dropdown with the top item marked as active and highlighted", function() {
          expect(getListElement(input[0])).not.toHaveClass("hide");
          var topItem = getListElement(input[0]).querySelector("li.country:first-child");
          expect(topItem).toHaveClass("active highlight");
        });

        it("clicking it again closes the dropdown", function() {
          dispatchEvent(getSelectedFlagContainer(input[0]), "click", true, false);;
          expect(getListElement(input[0])).toHaveClass("hide");
        });

        it("clicking off closes the dropdown", function() {
          dispatchEvent(document, "click", true, true);
          expect(getListElement(input[0])).toHaveClass("hide");
        });



        describe("selecting a new country item", function() {

          var countryCode = "gb";

          beforeEach(function() {
            var element = getListElement(input[0]).querySelector("li[data-country-code='" + countryCode + "']");
            dispatchEvent(element, "click", true, false);
          });

          it("updates the selected flag", function() {
            expect(getSelectedFlagElement(input[0])).toHaveClass(countryCode);
          });

          it("updates the dial code", function() {
            expect(input[0].value).toEqual("+44");
          });

        });

      });

    });



    describe("enabled/disabled tests", function() {

      describe("input enabled", function() {

        // apparently it is impossible to trigger a CSS psuedo selector like :hover
        // http://stackoverflow.com/a/4347249/217866
        /*it("adds the hover class on hover", function() {
          getFlagsContainerElement([0]).mouseover();
          expect(getFlagsContainerElement([0]).css("cursor")).toEqual("pointer");
        });*/

        it("opens the dropdown on click", function() {
          dispatchEvent(getSelectedFlagContainer(input[0]), "click", true, false);;
          expect(getListElement(input[0])).not.toHaveClass("hide");
        });

      });

      describe("input disabled", function() {

        beforeEach(function() {
          input[0].disabled = true;
        });

        // apparently it is impossible to trigger a CSS psuedo selector like :hover
        // http://stackoverflow.com/a/4347249/217866
        /*it("doesn't add the hover class on hover", function() {
          getFlagsContainerElement([0]).mouseover();
          expect(getFlagsContainerElement([0])).toHaveCss({"cursor": "default"});
        });*/

        it("doesn't open the dropdown on click", function() {
          dispatchEvent(getSelectedFlagContainer(input[0]), "click", true, false);;
          expect(getListElement(input[0])).toHaveClass("hide");
        });

      });

    });

  });

});
