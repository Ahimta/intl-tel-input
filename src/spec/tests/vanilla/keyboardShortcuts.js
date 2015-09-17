"use strict";

describe("keyboard shortcuts: init vanilla plugin (with nationalMode=false) to test keyboard shortcuts", function() {

  beforeEach(function() {
    intlSetup();
    input = $("<input>");
    input.intlTelInput({
      nationalMode: false
    });
  });

  describe("when dropdown is closed", function () {
    beforeEach(function () {
      // FIXME: tests still pass when this line is commented out -_-
      getFlagsContainerElement().focus();
    });

    it("pressing UP opens the dropdown", function () {
      triggerKeyOnFlagsContainerElement("UP");
      expect(getListElement()).not.toHaveClass("hide");
    });

    it("pressing DOWN opens the dropdown", function () {
      triggerKeyOnFlagsContainerElement("DOWN");
      expect(getListElement()).not.toHaveClass("hide");
    });

    it("pressing SPACE opens the dropdown", function () {
      triggerKeyOnFlagsContainerElement("SPACE");
      expect(getListElement()).not.toHaveClass("hide");
    });

    it("pressing ENTER opens the dropdown", function () {
      triggerKeyOnFlagsContainerElement("ENTER");
      expect(getListElement()).not.toHaveClass("hide");
    });
  });

  describe("when dropdown is opened", function () {
    beforeEach(function () {
      dispatchEvent(getSelectedFlagContainer()[0], "click", true, false);;
    });

    it("pressing esc closes the popup", function() {
      triggerKeyOnBody("ESC");
      expect(getListElement()).toHaveClass("hide");
    });

    it("pressing up while on the top item does not change the highlighted item", function() {
      triggerKeyOnBody("UP");
      var topItem = getListElement()[0].querySelector("li.country:first-child");
      expect(topItem).toHaveClass("highlight");
    });

    it("pressing z highlights Zambia", function() {
      triggerKeyOnBody("Z");
      var zambiaListItem = getListElement()[0].querySelector("li[data-country-code='zm']");
      expect(zambiaListItem).toHaveClass("highlight");
    });

    it("pressing z three times also highlights Zambia (no further matches)", function() {
      triggerKeyOnBody("Z");
      triggerKeyOnBody("Z");
      triggerKeyOnBody("Z");
      var zambiaListItem = getListElement()[0].querySelector("li[data-country-code='zm']");
      expect(zambiaListItem).toHaveClass("highlight");
    });

    describe("typing z then i", function() {

      var lastItem;

      beforeEach(function() {
        lastItem = getListElement()[0].querySelector("li.country:last-child");
        triggerKeyOnBody("Z");
        triggerKeyOnBody("I");
      });

      it("highlights the last item, which is Zimbabwe", function() {
        expect(lastItem).toHaveClass("highlight");
        expect(lastItem.getAttribute("data-country-code")).toEqual("zw");
      });

      it("pressing down while on the last item does not change the highlighted item", function() {
        triggerKeyOnBody("DOWN");
        expect(lastItem).toHaveClass("highlight");
      });
    });



    describe("pressing down", function() {

      beforeEach(function() {
        triggerKeyOnBody("DOWN");
      });

      it("changes the highlighted item", function() {
        var listElement = getListElement()[0];
        var topItem = listElement.querySelector("li.country:first-child");
        var secondItem = listElement.querySelector("li.country:nth-child(2)");

        expect(topItem).not.toHaveClass("highlight");
        expect(secondItem).toHaveClass("highlight");
      });



      describe("pressing enter", function() {

        beforeEach(function() {
          triggerKeyOnBody("ENTER");
        });

        it("changes the active item", function() {
          var listElement = getListElement()[0];
          var topItem = listElement.querySelector("li.country:first-child");
          var secondItem = listElement.querySelector("li.country:nth-child(2)");

          expect(topItem).not.toHaveClass("active");
          expect(secondItem).toHaveClass("active");
        });

        it("closes the dropdown", function() {
          expect(getListElement()).toHaveClass("hide");
        });

        it("updates the dial code", function() {
          expect(getInputVal()).toEqual("+44");
        });

      });

    });
  });

  afterEach(function() {
    input.intlTelInput("destroy");
    input = null;
  });

});
