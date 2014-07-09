!function (root) {

  'use strict';

  var Query = function () {

    /*=========================================
    =            Private Variables            =
    =========================================*/

    var selectorRegex = /^(?:#([\w-]+)|(\w+)|\.([\w-]+)|([\[][\w\-\=\"\']+[\]]))$/
    var selectorTypeRegex = /^(?:(#)[\w-]+|()\w+|(\.)[\w-]+|([\[])[\w\-\=\"\']+[\]])$/
    var matchesSelectorName = (function () {
      var el = newElement('fakeelement')
      return /\W*function\s+([\w\$]+)\(/.exec(
            (el.matchesSelector ||
             el.webkitMatchesSelector ||
             el.mozMatchesSelector ||
             el.msMatchesSelector ||
             el.oMatchesSelector ||
             el.getAttribute)
            )[1]
    })()

    /*-----  End of Private Variables  ------*/


    /*========================================
    =            Public Variables            =
    ========================================*/

    var transitionEnd = (function(){
      var el = newElement('fakeelement')
      var transitions = {
        'transition': 'transitionend'
      , 'OTransition': 'oTransitionEnd'
      , 'MozTransition': 'transitionend'
      , 'WebkitTransition': 'webkitTransitionEnd'
      }

      for(var t in transitions){
        if ( el.style[t] !== undefined ) {
          return transitions[t]
        }
      }
    })()

    /*-----  End of Public Variables  ------*/


    /*=======================================
    =            Private Methods            =
    =======================================*/

    function _matchesSelector(element, scope) {
      if (element[matchesSelectorName]) {
        return element[matchesSelectorName](scope)
      }
    }

    function _filterSelector(selector) {
      var matches = selector.match(selectorRegex)
      var types = selector.match(selectorTypeRegex)

      while (matches.length) {
        selector = matches.pop()
        if (selector) {
          return {
            selector: selector,
            type: types[matches.length]
          }
        }
      }
    }

    function _inScopeChain(element, parentElement) {
      if (_matchesSelector(element, parentElement)) {
        return element
      } else {
        while (element.parentNode) {
          element = element.parentNode
          if (_matchesSelector(element, parentElement)) {
            return element
          }
        }
      }
    }

    /*-----  End of Private Methods  ------*/


    /*======================================
    =            Public Methods            =
    ======================================*/

    function getElement(selector) {
      var element

      if ('string' === typeof selector) {
        var filtered = _filterSelector(selector)
        var selector = filtered.selector
        var type = filtered.type
      }
      else {
        return selector
      }

      switch (type) {
        case '#':
          element = document.getElementById(selector)
          break
        case '.':
          element = document.getElementsByClassName(selector)[0]
          break
        default:
          element = document.querySelector(selector)
      }

      return element
    }

    function getAllElements(selector) {
      var element

      if ('string' === typeof selector) {
        var filtered = _filterSelector(selector)
        var selector = filtered.selector
        var type = filtered.type
      }
      else {
        return selector
      }

      switch (type) {
        case '.':
          element = document.getElementsByClassName(selector)
          break
        default:
          element = document.querySelectorAll(selector)
      }

      return element
    }

    function newElement(tagName, contents) {
      var element = document.createElement(tagName)
      if ('string' === typeof contents) {
        element.innerHTML = contents
      }
      else if ('object' === typeof contents) {
        element.appendChild(contents)
      }
      return element
    }

    function triggerEvent(target, eventType) {
      var eventConstructor

      switch (eventType) {
        case 'click':
        case 'mousedown':
        case 'mouseup':
        case 'mousemove':
          eventConstructor = 'MouseEvent'
          break
        case 'keydown':
        case 'keypress':
        case 'keyup':
          eventConstructor = 'KeyboardEvent'
          break
        case 'touchenter':
        case 'touchstart':
        case 'touchend':
        case 'touchcancel':
        case 'touchleave':
        case 'touchmove':
          eventConstructor = 'TouchEvent'
          break
        case 'dragstart':
        case 'drag':
        case 'dragenter':
        case 'dragleave':
        case 'dragover':
        case 'drop':
        case 'dragend':
          eventConstructor = 'DragEvent'
        default:
          eventConstructor = 'CustomEvent'
      }

      if (!target.length || target.length === 1) {
        target.dispatchEvent(new root[eventConstructor](eventType, { bubbles: true, cancelable: true}))
      }
      else {
        Array.prototype.slice.call(target).forEach(function (t) {
          t.dispatchEvent(new root[eventConstructor](eventType, { bubbles: true, cancelable: true}))
        })
      }

      return this
    }

    function eventHandler(eventList, scope, callback) {
      if ('function' === typeof scope) {
        document.addEventListener(eventList, scope, false)
      }
      else {
        eventList.split(' ').forEach(function (eventString) {
          document.addEventListener(eventString, function (evt) {
            var target = _inScopeChain(evt.target, scope)
            if (target) {
              evt.oTarget = target
              callback(evt)
            }
          }, false)
        })
      }
      return this
    }

    function setAttribute(element, attribute, value) {
      if (element.length === 1) {
        element.setAttribute(attribute, value)
      }
      else {
        Array.prototype.slice.call(element).forEach(function (el) {
          el.setAttribute(attribute, value)
        })
      }
      return this
    }

    function getParent(childElement, parentSelector) {
      return _inScopeChain(childElement, parentSelector)
    }

    function toArray(obj) {
      var array = [];
      if ('[Object HTMLCollection]' === Object.prototype.toString.call(obj)) {
        array = Array.prototype.slice.call(obj)
      }
      else {
        // iterate backwards ensuring that length is an UInt32
        for (var i = obj.length >>> 0; i--;) {
          array[i] = obj[i];
        }
      }
      return array;
    }

    function isArray(obj) {
      if (Array.isArray) {
        return Array.isArray(obj)
      }
      else {
        return '[Object Array]' === Object.prototype.toString.call(obj)
      }
    }

    /*-----  End of Public Methods  ------*/


    /*==============================
    =            Export            =
    ==============================*/

    return {
      get: getElement
    , getAll: getAllElements
    , 'new': newElement
    , trigger: triggerEvent
    , on: eventHandler
    , set: setAttribute
    , parent: getParent
    , toArray: toArray
    , isArray: isArray

    , transitionend: transitionEnd
    }

    /*-----  End of Export  ------*/

  }


  root._q = new Query()


  var xDown
  var yDown
  root._q
  .on('touchstart', function (evt) {
    xDown = evt.touches[0].clientX
    yDown = evt.touches[0].clientY
  })
  .on('touchend', function (evt) {
    /* reset values */
    xDown = null
    yDown = null
  })
  .on('touchmove', function (evt) {
    if (!xDown || !yDown) {
      return
    }

    var xUp = evt.touches[0].clientX
    var yUp = evt.touches[0].clientY
    var xDiff = xDown - xUp
    var yDiff = yDown - yUp

    /* most significant */
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      _q.trigger(evt.target, xDiff > 0 ? 'swipe-left' : 'swipe-right')
    } else {
      _q.trigger(evt.target, yDiff > 0 ? 'swipe-up' : 'swipe-down')
    }
  })
  .on(root._q.transitionend, function (evt) {
    _q.trigger(evt.target, 'transitionComplete')
  })


  /*=================================
  =            Polyfills            =
  =================================*/

  /*==========  CustomEvent polyfill for IE9/10  ==========*/
  /*==========  https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent  ==========*/

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent( 'CustomEvent' )
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
    return evt
  }
  CustomEvent.prototype = root.Event.prototype
  root.CustomEvent = CustomEvent

  /*
   * classList.js: Cross-browser full element.classList implementation.
   * 2014-01-31
   *
   * By Eli Grey, http://eligrey.com
   * Public Domain.
   * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
   */

  /*global self, document, DOMException */

  /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

  if ('document' in self && !('classList' in document.createElement('_'))) {
    (function (view) {
      if (!('Element' in view)) return;

      var classListProp = "classList";
      var protoProp = "prototype";
      var elemCtrProto = view.Element[protoProp];
      var objCtr = Object;
      var strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, "");
        }
      var arrIndexOf = Array[protoProp].indexOf || function (item) {
        var i = 0;
        var len = this.length;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      var DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      var checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      var ClassList = function (elem) {
        var trimmedClasses = strTrim.call(elem.getAttribute("class") || "");
        var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
        var i = 0;
        var len = classes.length;

        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        }
      }
      var classListProto = ClassList[protoProp] = []
      var classListGetter = function () {
        return new ClassList(this);
      }
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments;
        var i = 0;
        var l = tokens.length;
        var token;
        var updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var tokens = arguments;
        var i = 0;
        var l = tokens.length;
        var token;
        var updated = false;
        do {
          token = tokens[i] + "";
          var index = checkTokenAndGetIndex(this, token);
          if (index !== -1) {
            this.splice(index, 1);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";

        var result = this.contains(token);
        var method = result ?
            force !== true && "remove" :
            force !== false && "add";

        if (method) {
          this[method](token);
        }

        return !result;
      };
      classListProto.toString = function () {
        return this.join(" ");
      };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
            get: classListGetter
          , enumerable: true
          , configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }

    }(self));
  }

    /*-----  End of Polyfills  ------*/
}(window)
