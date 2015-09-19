"use strict";

describe("destroy: init plugin to test public method destroy", function() {

  var input;

  beforeEach(function() {
    intlSetup();
    input = new IntlTelInput(document.createElement("input"));
  });

  afterEach(function() {
    input = null;
  });

  it("adds the markup", function() {
    expect(input.inputElement.parentNode).toHaveClass("intl-tel-input");
    expect(getSelectedFlagContainer(input.inputElement)).toExist();
    expect(getListElement(input.inputElement)).toExist();
  });

  // NOTE: we can't get listeners using jQuery, since we are use native DOM API
  it("binds the events listeners", function() {
    // var listeners = $._data(input[0], 'events');

    // expect("blur" in listeners).toBeTruthy();
    // expect("focus" in listeners).toBeTruthy();
    // autoHideDialCode defaults to false now because nationalMode defaults to true
    //expect("mousedown" in listeners).toBeTruthy();
    // normal
    // expect("keyup" in listeners).toBeTruthy();
  });


  describe("calling destroy", function() {

    beforeEach(function() {
      input.destroy();
    });

    it("removes the markup", function() {
      expect(input.inputElement.parentNode).not.toHaveClass("intl-tel-input");
      expect(getSelectedFlagContainer(input.inputElement)).not.toExist();
      expect(getListElement(input.inputElement)).not.toExist();
    });

   // NOTE: we can't get listeners using jQuery, since we are use native DOM API
    it("unbinds the event listeners", function() {
      // var listeners = $._data(input[0], 'events');
      // expect(listeners).toBeUndefined();
    });

  });

});
