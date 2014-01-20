/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

 /*!
  * Portions copyright (c) 2010, 2011, 2012 Wojciech Zawistowski, Travis Jeffery
  * From the jasmine-jquery project under the MIT License.
  */

var util = require('../util');

module.exports = function(should, Assertion) {
  var $ = this.jQuery || this.$;

  /* Otherwise, node's util.inspect loops hangs */
  if (typeof HTMLElement === 'function' && !HTMLElement.prototype.inspect) {
    HTMLElement.prototype.inspect = function () {
      return this.outerHTML;
    };
  }

  jQuery.fn.inspect = function () {
    var elementList = this.toArray().map(function (e) {
      return util.inspect(e);
    }).join(", ");
    if (this.selector) {
      return "SELECTOR(" + this.selector + ") matching " + this.length + " elements" + (elementList.length ? ": " + elementList : "");
    } else {
      return elementList;
    }
  }

  var hasProperty = function (actualValue, expectedValue) {
    if (expectedValue === undefined) {
      return actualValue !== undefined;
    }

    return actualValue === expectedValue;
  };

  var browserTagCaseIndependentHtml = function (html) {
    return $('<div/>').append(html).html();
  };

  Assertion.add('haveClass', function(className) {
    this.params = { operator: 'to have class ' + className };
    this.assert($(this.obj).hasClass(className));
  });

  Assertion.add('haveCss', function(css) {
    this.params = { operator: 'to have css ' + JSON.stringify(css) };
    for (var prop in css) {
      var value = css[prop];
      if (value === 'auto' && $(this.obj).get(0).style[prop] === 'auto') {
        continue;
      }
      if ($(this.obj).css(prop) !== value) {
        this.assert(false);
      }
    }
    this.assert(true);
  });

  Assertion.add('visible', function() {
    this.params = { operator: 'to be visible' };
    this.assert($(this.obj).is(':visible'));
  }, true);

  Assertion.add('hidden', function() {
    this.params = { operator: 'to be hidden' };
    this.assert($(this.obj).is(':hidden'));
  }, true);

  Assertion.add('selected', function() {
    this.params = { operator: 'to be selected' };
    this.assert($(this.obj).is(':selected'));
  }, true);

  Assertion.add('checked', function() {
    this.params = { operator: 'to be checked' };
    this.assert($(this.obj).is(':checked'));
  }, true);

  Assertion.add('emptyJq', function() {
    this.params = { operator: 'to be empty' };
    this.assert($(this.obj).is(':empty'));
  }, true);

  Assertion.add('inDOM', function() {
    this.params = { operator: 'to be in the DOM' };
    this.assert($.contains(document.documentElement, $(this.obj)[0]));
  }, true);

  Assertion.add('exist', function() {
    this.params = { operator: 'to exist' };
    this.assert($(this.obj).length);
  }, true);

  Assertion.add('haveLength', function(length) {
    this.params = { operator: 'to have length ' + length };
    this.assert($(this.obj).length === length);
  });

  Assertion.add('haveAttr', function(attributeName, expectedAttributeValue) {
    this.params = { operator: 'to have attribute ' + attributeName + ' with value ' + expectedAttributeValue };
    this.assert(hasProperty($(this.obj).attr(attributeName), expectedAttributeValue));
  });

  Assertion.add('haveProp', function(propertyName, expectedPropertyValue) {
    this.params = { operator: 'to have property ' + propertyName + ' with value ' + expectedPropertyValue };
    this.assert(hasProperty($(this.obj).prop(propertyName), expectedPropertyValue));
  });

  Assertion.add('haveId', function(id) {
    this.params = { operator: 'to have ID ' + id };
    this.assert($(this.obj).attr('id') === id);
  });

  Assertion.add('haveHtml', function(html) {
    this.params = { operator: 'to have HTML ' + html };
    this.assert($(this.obj).html() == browserTagCaseIndependentHtml(html));
  });

  Assertion.add('containHtml', function(html) {
    this.params = { operator: 'to contain HTML ' + html };
    this.assert($(this.obj).html().indexOf(browserTagCaseIndependentHtml(html)) >= 0);
  });

  Assertion.add('haveText', function(text) {
    this.params = { operator: 'to have text ' + text };
    var trimmedText = $.trim($(this.obj).text());

    if (text && $.isFunction(text.test)) {
      this.assert(text.test(trimmedText));
    } else {
      this.assert(trimmedText === text);
    }
  });

  Assertion.add('containText', function(text) {
    this.params = { operator: 'to contain text ' + text };
    var trimmedText = $.trim($(this.obj).text());

    if (text && $.isFunction(text.test)) {
      this.assert(text.test(trimmedText));
    } else {
      this.assert(trimmedText.indexOf(text) !== -1);
    }
  });

  Assertion.add('haveValue', function(val) {
    this.params = { operator: 'to have value ' + val };
    this.assert($(this.obj).val() === val);
  });

  Assertion.add('haveData', function(key, expectedValue) {
    this.params = { operator: 'to have data ' + key + ' with value ' + expectedValue };
    this.assert(hasProperty($(this.obj).data(key), expectedValue));
  });

  Assertion.add('containElement', function(target) {
    this.params = { operator: 'to contain ' + $(target).inspect() };
    this.assert($(this.obj).find(target).length);
  });

  Assertion.add('matchedBy', function(selector) {
    this.params = { operator: 'to be matched by selector ' + selector };
    this.assert($(this.obj).filter(selector).length);
  });

  Assertion.add('disabled', function() {
    this.params = { operator: 'to be disabled' };
    this.assert($(this.obj).is(':disabled'));
  }, true);

  Assertion.add('focused', function() {
    this.params = { operator: 'to be focused' };
    this.assert($(this.obj)[0] === $(this.obj)[0].ownerDocument.activeElement);
  }, true);

  Assertion.add('handle', function(event) {
    this.params = { operator: 'to handle ' + event };

    var events = $._data($(this.obj).get(0), "events");

    if (!events || !event || typeof event !== "string") {
      return this.assert(false);
    }

    var namespaces = event.split("."),
        eventType = namespaces.shift(),
        sortedNamespaces = namespaces.slice(0).sort(),
        namespaceRegExp = new RegExp("(^|\\.)" + sortedNamespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");

    if (events[eventType] && namespaces.length) {
      for (var i = 0; i < events[eventType].length; i++) {
        var namespace = events[eventType][i].namespace;

        if (namespaceRegExp.test(namespace)) {
          return this.assert(true);
        }
      }
    } else {
      return this.assert(events[eventType] && events[eventType].length > 0);
    }

    return this.assert(false);
  });

  Assertion.add('handleWith', function(eventName, eventHandler) {
    this.params = { operator: 'to handle ' + eventName + ' with ' + eventHandler };

    var normalizedEventName = eventName.split('.')[0],
        stack = $._data($(this.obj).get(0), "events")[normalizedEventName];

    for (var i = 0; i < stack.length; i++) {
      if (stack[i].handler == eventHandler) {
        return this.assert(true);
      }
    }

    return this.assert(false);
  });
};