//*/js/es5-shim.js*//
// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = _Array_slice_.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(_Array_slice_.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(_Array_slice_.call(arguments))
                );

            }

        };
        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var _Array_slice_ = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if ([1,2].splice(0).length != 2) {
    var array_splice = Array.prototype.splice;

    if (function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = [];
            while (l--) {
                a.unshift(l)
            }
            return a
        }

        var array = []
            , lengthBefore
        ;

        array.splice.bind(array, 0, 0).apply(null, makeArray(20));
        array.splice.bind(array, 0, 0).apply(null, makeArray(26));

        lengthBefore = array.length; //20
        array.splice(5, 0, "XXX"); // add one element

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
        // else {
        //    IE8 bug
        // }
    }()) {//IE 6/7
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(_Array_slice_.call(arguments, 2)))
            }
        };
    }
    else {//IE8
        Array.prototype.splice = function(start, deleteCount) {
            var result
                , args = _Array_slice_.call(arguments, 2)
                , addElementsCount = args.length
            ;

            if (!arguments.length) {
                return [];
            }

            if (start === void 0) { // default
                start = 0;
            }
            if (deleteCount === void 0) { // default
                deleteCount = this.length - start;
            }

            if (addElementsCount > 0) {
                if (deleteCount <= 0) {
                    if (start == this.length) { // tiny optimisation #1
                        this.push.apply(this, args);
                        return [];
                    }

                    if (start == 0) { // tiny optimisation #2
                        this.unshift.apply(this, args);
                        return [];
                    }
                }

                // Array.prototype.splice implementation
                result = _Array_slice_.call(this, start, start + deleteCount);// delete part
                args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));// right part
                args.unshift.apply(args, _Array_slice_.call(this, 0, start));// left part

                // delete all items from this array and replace it to 'left part' + _Array_slice_.call(arguments, 2) + 'right part'
                args.unshift(0, this.length);

                array_splice.apply(this, args);

                return result;
            }

            return array_splice.call(this, start, deleteCount);
        }

    }
}

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) == undefined but should be "1"
if ([].unshift(0) != 1) {
    var array_unshift = Array.prototype.unshift;
    Array.prototype.unshift = function() {
        array_unshift.apply(this, arguments);
        return this.length;
    };
}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000,
    negativeYearString = "-000001";
if (
    !Date.prototype.toISOString ||
    (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
            ("00000" + Math.abs(year))
            .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + "-" + result.slice(0, 2).join("-") +
            "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        );
    };
}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = false;
try {
    dateToJSONIsSupported = (
        Date.prototype.toJSON &&
        new Date(NaN).toJSON() === null &&
        new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
        Date.prototype.toJSON.call({ // generic
            toISOString: function () {
                return true;
            }
        })
    );
} catch (e) {
}
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be toPrimitive(O, hint Number).
        var o = Object(this),
            tv = toPrimitive(o),
            toISO;
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === "number" && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        toISO = o.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof toISO != "function") {
            throw new TypeError("toISOString property is not callable");
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(o);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                                      // 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:(\\.\\d{1,}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var months = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
        ];

        function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        }

        function toUTC(t) {
            return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond;
                    if (isLocalTime) {
                        result = toUTC(result);
                    }
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    // Hide these variables and functions
    (function () {
        var base, size, data, i;

        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];

        function multiply(n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide(n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString() {
            var i = size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += '0000000'.slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        }

        function log(x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;

            // Test for NaN and round fractionDigits down
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            // Test for NaN
            if (x !== x) {
                return "NaN";
            }

            // If it is too big or small, return the string value of the number
            if (x <= -1e21 || x >= 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21 < x < 1e21
                // -70 < log2(x) < 70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000; // Math.pow(2, 52);
                e = 52 - e;

                // -18 < e < 122
                // x = z / 2 ^ e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }

                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        }
    }());
}


//
// String
// ======
//


// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = String.prototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === "t" ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

        String.prototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0)
                return [];

            // If `separator` is not a regex, use native split
            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                return string_split.apply(this, arguments);
            }

            var output = [],
                flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline  ? "m" : "") +
                        (separator.extended   ? "x" : "") + // Proposed for ES6
                        (separator.sticky     ? "y" : ""), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator = new RegExp(separator.source, flags + "g"),
                separator2, match, lastIndex, lastLength;
            string += ""; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                limit >>> 0; // ToUint32(limit)
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        Array.prototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test("")) {
                    output.push("");
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ("0".split(void 0, 0).length) {
    String.prototype.split = function(separator, limit) {
        if (separator === void 0 && limit === 0) return [];
        return string_split.apply(this, arguments);
    }
}


// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
if ("".substr && "0b".substr(-1) !== "b") {
    var string_substr = String.prototype.substr;
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === void 0 || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this)
            .replace(trimBeginRegexp, "")
            .replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}

// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});

;
//*/js/jquery-1.9.1.min.js*//
/*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery.min.map
*/(function(e,t){var n,r,i=typeof t,o=e.document,a=e.location,s=e.jQuery,u=e.$,l={},c=[],p="1.9.1",f=c.concat,d=c.push,h=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,b=function(e,t){return new b.fn.init(e,t,r)},x=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^[\],:{}\s]*$/,E=/(?:^|:|,)(?:\s*\[)+/g,S=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,A=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,j=/^-ms-/,D=/-([\da-z])/gi,L=function(e,t){return t.toUpperCase()},H=function(e){(o.addEventListener||"load"===e.type||"complete"===o.readyState)&&(q(),b.ready())},q=function(){o.addEventListener?(o.removeEventListener("DOMContentLoaded",H,!1),e.removeEventListener("load",H,!1)):(o.detachEvent("onreadystatechange",H),e.detachEvent("onload",H))};b.fn=b.prototype={jquery:p,constructor:b,init:function(e,n,r){var i,a;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof b?n[0]:n,b.merge(this,b.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:o,!0)),C.test(i[1])&&b.isPlainObject(n))for(i in n)b.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(a=o.getElementById(i[2]),a&&a.parentNode){if(a.id!==i[2])return r.find(e);this.length=1,this[0]=a}return this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):b.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),b.makeArray(e,this))},selector:"",length:0,size:function(){return this.length},toArray:function(){return h.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=b.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return b.each(this,e,t)},ready:function(e){return b.ready.promise().done(e),this},slice:function(){return this.pushStack(h.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(b.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:d,sort:[].sort,splice:[].splice},b.fn.init.prototype=b.fn,b.extend=b.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},u=1,l=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},u=2),"object"==typeof s||b.isFunction(s)||(s={}),l===u&&(s=this,--u);l>u;u++)if(null!=(o=arguments[u]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(b.isPlainObject(r)||(n=b.isArray(r)))?(n?(n=!1,a=e&&b.isArray(e)?e:[]):a=e&&b.isPlainObject(e)?e:{},s[i]=b.extend(c,a,r)):r!==t&&(s[i]=r));return s},b.extend({noConflict:function(t){return e.$===b&&(e.$=u),t&&e.jQuery===b&&(e.jQuery=s),b},isReady:!1,readyWait:1,holdReady:function(e){e?b.readyWait++:b.ready(!0)},ready:function(e){if(e===!0?!--b.readyWait:!b.isReady){if(!o.body)return setTimeout(b.ready);b.isReady=!0,e!==!0&&--b.readyWait>0||(n.resolveWith(o,[b]),b.fn.trigger&&b(o).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===b.type(e)},isArray:Array.isArray||function(e){return"array"===b.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if(!e||"object"!==b.type(e)||e.nodeType||b.isWindow(e))return!1;try{if(e.constructor&&!y.call(e,"constructor")&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||y.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=b.buildFragment([e],t,i),i&&b(i).remove(),b.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=b.trim(n),n&&k.test(n.replace(S,"@").replace(A,"]").replace(E,"")))?Function("return "+n)():(b.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||b.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&b.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(j,"ms-").replace(D,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:v&&!v.call("\ufeff\u00a0")?function(e){return null==e?"":v.call(e)}:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?b.merge(n,"string"==typeof e?[e]:e):d.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(g)return g.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return f.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),b.isFunction(e)?(r=h.call(arguments,2),i=function(){return e.apply(n||this,r.concat(h.call(arguments)))},i.guid=e.guid=e.guid||b.guid++,i):t},access:function(e,n,r,i,o,a,s){var u=0,l=e.length,c=null==r;if("object"===b.type(r)){o=!0;for(u in r)b.access(e,n,u,r[u],!0,a,s)}else if(i!==t&&(o=!0,b.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(b(e),n)})),n))for(;l>u;u++)n(e[u],r,s?i:i.call(e[u],u,n(e[u],r)));return o?e:c?n.call(e):l?n(e[0],r):a},now:function(){return(new Date).getTime()}}),b.ready.promise=function(t){if(!n)if(n=b.Deferred(),"complete"===o.readyState)setTimeout(b.ready);else if(o.addEventListener)o.addEventListener("DOMContentLoaded",H,!1),e.addEventListener("load",H,!1);else{o.attachEvent("onreadystatechange",H),e.attachEvent("onload",H);var r=!1;try{r=null==e.frameElement&&o.documentElement}catch(i){}r&&r.doScroll&&function a(){if(!b.isReady){try{r.doScroll("left")}catch(e){return setTimeout(a,50)}q(),b.ready()}}()}return n.promise(t)},b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=b.type(e);return b.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=b(o);var _={};function F(e){var t=_[e]={};return b.each(e.match(w)||[],function(e,n){t[n]=!0}),t}b.Callbacks=function(e){e="string"==typeof e?_[e]||F(e):b.extend({},e);var n,r,i,o,a,s,u=[],l=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=u.length,n=!0;u&&o>a;a++)if(u[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,u&&(l?l.length&&c(l.shift()):r?u=[]:p.disable())},p={add:function(){if(u){var t=u.length;(function i(t){b.each(t,function(t,n){var r=b.type(n);"function"===r?e.unique&&p.has(n)||u.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=u.length:r&&(s=t,c(r))}return this},remove:function(){return u&&b.each(arguments,function(e,t){var r;while((r=b.inArray(t,u,r))>-1)u.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?b.inArray(e,u)>-1:!(!u||!u.length)},empty:function(){return u=[],this},disable:function(){return u=l=r=t,this},disabled:function(){return!u},lock:function(){return l=t,r||p.disable(),this},locked:function(){return!l},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!u||i&&!l||(n?l.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},b.extend({Deferred:function(e){var t=[["resolve","done",b.Callbacks("once memory"),"resolved"],["reject","fail",b.Callbacks("once memory"),"rejected"],["notify","progress",b.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return b.Deferred(function(n){b.each(t,function(t,o){var a=o[0],s=b.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&b.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?b.extend(e,r):r}},i={};return r.pipe=r.then,b.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=h.call(arguments),r=n.length,i=1!==r||e&&b.isFunction(e.promise)?r:0,o=1===i?e:b.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?h.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,u,l;if(r>1)for(s=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&b.isFunction(n[t].promise)?n[t].promise().done(a(t,l,n)).fail(o.reject).progress(a(t,u,s)):--i;return i||o.resolveWith(l,n),o.promise()}}),b.support=function(){var t,n,r,a,s,u,l,c,p,f,d=o.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*"),r=d.getElementsByTagName("a")[0],!n||!r||!n.length)return{};s=o.createElement("select"),l=s.appendChild(o.createElement("option")),a=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={getSetAttribute:"t"!==d.className,leadingWhitespace:3===d.firstChild.nodeType,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:"/a"===r.getAttribute("href"),opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:!!a.value,optSelected:l.selected,enctype:!!o.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==o.createElement("nav").cloneNode(!0).outerHTML,boxModel:"CSS1Compat"===o.compatMode,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},a.checked=!0,t.noCloneChecked=a.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!l.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}a=o.createElement("input"),a.setAttribute("value",""),t.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),t.radioValue="t"===a.value,a.setAttribute("checked","t"),a.setAttribute("name","t"),u=o.createDocumentFragment(),u.appendChild(a),t.appendChecked=a.checked,t.checkClone=u.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;return d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip,b(function(){var n,r,a,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",u=o.getElementsByTagName("body")[0];u&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",u.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",a=d.getElementsByTagName("td"),a[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===a[0].offsetHeight,a[0].style.display="",a[1].style.display="none",t.reliableHiddenOffsets=p&&0===a[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=4===d.offsetWidth,t.doesNotIncludeMarginInBodyOffset=1!==u.offsetTop,e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(o.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(u.style.zoom=1)),u.removeChild(n),n=d=a=r=null)}),n=s=u=l=r=a=null,t}();var O=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,B=/([A-Z])/g;function P(e,n,r,i){if(b.acceptData(e)){var o,a,s=b.expando,u="string"==typeof n,l=e.nodeType,p=l?b.cache:e,f=l?e[s]:e[s]&&s;if(f&&p[f]&&(i||p[f].data)||!u||r!==t)return f||(l?e[s]=f=c.pop()||b.guid++:f=s),p[f]||(p[f]={},l||(p[f].toJSON=b.noop)),("object"==typeof n||"function"==typeof n)&&(i?p[f]=b.extend(p[f],n):p[f].data=b.extend(p[f].data,n)),o=p[f],i||(o.data||(o.data={}),o=o.data),r!==t&&(o[b.camelCase(n)]=r),u?(a=o[n],null==a&&(a=o[b.camelCase(n)])):a=o,a}}function R(e,t,n){if(b.acceptData(e)){var r,i,o,a=e.nodeType,s=a?b.cache:e,u=a?e[b.expando]:b.expando;if(s[u]){if(t&&(o=n?s[u]:s[u].data)){b.isArray(t)?t=t.concat(b.map(t,b.camelCase)):t in o?t=[t]:(t=b.camelCase(t),t=t in o?[t]:t.split(" "));for(r=0,i=t.length;i>r;r++)delete o[t[r]];if(!(n?$:b.isEmptyObject)(o))return}(n||(delete s[u].data,$(s[u])))&&(a?b.cleanData([e],!0):b.support.deleteExpando||s!=s.window?delete s[u]:s[u]=null)}}}b.extend({cache:{},expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?b.cache[e[b.expando]]:e[b.expando],!!e&&!$(e)},data:function(e,t,n){return P(e,t,n)},removeData:function(e,t){return R(e,t)},_data:function(e,t,n){return P(e,t,n,!0)},_removeData:function(e,t){return R(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&b.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),b.fn.extend({data:function(e,n){var r,i,o=this[0],a=0,s=null;if(e===t){if(this.length&&(s=b.data(o),1===o.nodeType&&!b._data(o,"parsedAttrs"))){for(r=o.attributes;r.length>a;a++)i=r[a].name,i.indexOf("data-")||(i=b.camelCase(i.slice(5)),W(o,i,s[i]));b._data(o,"parsedAttrs",!0)}return s}return"object"==typeof e?this.each(function(){b.data(this,e)}):b.access(this,function(n){return n===t?o?W(o,e,b.data(o,e)):null:(this.each(function(){b.data(this,e,n)}),t)},null,n,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){b.removeData(this,e)})}});function W(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(B,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:O.test(r)?b.parseJSON(r):r}catch(o){}b.data(e,n,r)}else r=t}return r}function $(e){var t;for(t in e)if(("data"!==t||!b.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}b.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=b._data(e,n),r&&(!i||b.isArray(r)?i=b._data(e,n,b.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=b.queue(e,t),r=n.length,i=n.shift(),o=b._queueHooks(e,t),a=function(){b.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return b._data(e,n)||b._data(e,n,{empty:b.Callbacks("once memory").add(function(){b._removeData(e,t+"queue"),b._removeData(e,n)})})}}),b.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?b.queue(this[0],e):n===t?this:this.each(function(){var t=b.queue(this,e,n);b._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&b.dequeue(this,e)})},dequeue:function(e){return this.each(function(){b.dequeue(this,e)})},delay:function(e,t){return e=b.fx?b.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=b.Deferred(),a=this,s=this.length,u=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=b._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(u));return u(),o.promise(n)}});var I,z,X=/[\t\r\n]/g,U=/\r/g,V=/^(?:input|select|textarea|button|object)$/i,Y=/^(?:a|area)$/i,J=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,G=/^(?:checked|selected)$/i,Q=b.support.getSetAttribute,K=b.support.input;b.fn.extend({attr:function(e,t){return b.access(this,b.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){b.removeAttr(this,e)})},prop:function(e,t){return b.access(this,b.prop,e,t,arguments.length>1)},removeProp:function(e){return e=b.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,u="string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=b.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,u=0===arguments.length||"string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?b.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return b.isFunction(e)?this.each(function(n){b(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=b(this),u=t,l=e.match(w)||[];while(o=l[a++])u=r?u:!s.hasClass(o),s[u?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&b._data(this,"__className__",this.className),this.className=this.className||e===!1?"":b._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(X," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=b.isFunction(e),this.each(function(n){var o,a=b(this);1===this.nodeType&&(o=i?e.call(this,n,a.val()):e,null==o?o="":"number"==typeof o?o+="":b.isArray(o)&&(o=b.map(o,function(e){return null==e?"":e+""})),r=b.valHooks[this.type]||b.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=b.valHooks[o.type]||b.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(U,""):null==n?"":n)}}}),b.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,u=0>i?s:o?i:0;for(;s>u;u++)if(n=r[u],!(!n.selected&&u!==i||(b.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&b.nodeName(n.parentNode,"optgroup"))){if(t=b(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n=b.makeArray(t);return b(e).find("option").each(function(){this.selected=b.inArray(b(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attr:function(e,n,r){var o,a,s,u=e.nodeType;if(e&&3!==u&&8!==u&&2!==u)return typeof e.getAttribute===i?b.prop(e,n,r):(a=1!==u||!b.isXMLDoc(e),a&&(n=n.toLowerCase(),o=b.attrHooks[n]||(J.test(n)?z:I)),r===t?o&&a&&"get"in o&&null!==(s=o.get(e,n))?s:(typeof e.getAttribute!==i&&(s=e.getAttribute(n)),null==s?t:s):null!==r?o&&a&&"set"in o&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r):(b.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=b.propFix[n]||n,J.test(n)?!Q&&G.test(n)?e[b.camelCase("default-"+n)]=e[r]=!1:e[r]=!1:b.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!b.support.radioValue&&"radio"===t&&b.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!b.isXMLDoc(e),a&&(n=b.propFix[n]||n,o=b.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):V.test(e.nodeName)||Y.test(e.nodeName)&&e.href?0:t}}}}),z={get:function(e,n){var r=b.prop(e,n),i="boolean"==typeof r&&e.getAttribute(n),o="boolean"==typeof r?K&&Q?null!=i:G.test(n)?e[b.camelCase("default-"+n)]:!!i:e.getAttributeNode(n);return o&&o.value!==!1?n.toLowerCase():t},set:function(e,t,n){return t===!1?b.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&b.propFix[n]||n,n):e[b.camelCase("default-"+n)]=e[n]=!0,n}},K&&Q||(b.attrHooks.value={get:function(e,n){var r=e.getAttributeNode(n);return b.nodeName(e,"input")?e.defaultValue:r&&r.specified?r.value:t},set:function(e,n,r){return b.nodeName(e,"input")?(e.defaultValue=n,t):I&&I.set(e,n,r)}}),Q||(I=b.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&("id"===n||"name"===n||"coords"===n?""!==r.value:r.specified)?r.value:t},set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},b.attrHooks.contenteditable={get:I.get,set:function(e,t,n){I.set(e,""===t?!1:t,n)}},b.each(["width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}})})),b.support.hrefNormalized||(b.each(["href","src","width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return null==r?t:r}})}),b.each(["href","src"],function(e,t){b.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}})),b.support.style||(b.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),b.support.optSelected||(b.propHooks.selected=b.extend(b.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),b.support.enctype||(b.propFix.enctype="encoding"),b.support.checkOn||b.each(["radio","checkbox"],function(){b.valHooks[this]={get:function(e){return null===e.getAttribute("value")?"on":e.value}}}),b.each(["radio","checkbox"],function(){b.valHooks[this]=b.extend(b.valHooks[this],{set:function(e,n){return b.isArray(n)?e.checked=b.inArray(b(e).val(),n)>=0:t}})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}b.event={global:{},add:function(e,n,r,o,a){var s,u,l,c,p,f,d,h,g,m,y,v=b._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=b.guid++),(u=v.events)||(u=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof b===i||e&&b.event.triggered===e.type?t:b.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(w)||[""],l=n.length;while(l--)s=rt.exec(n[l])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),p=b.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=b.event.special[g]||{},d=b.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&b.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=u[g])||(h=u[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),b.event.global[g]=!0;e=null}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,p,f,d,h,g,m=b.hasData(e)&&b._data(e);if(m&&(c=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(s=rt.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=b.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),u=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));u&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||b.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)b.event.remove(e,d+t[l],n,r,!0);b.isEmptyObject(c)&&(delete m.handle,b._removeData(e,"events"))}},trigger:function(n,r,i,a){var s,u,l,c,p,f,d,h=[i||o],g=y.call(n,"type")?n.type:n,m=y.call(n,"namespace")?n.namespace.split("."):[];if(l=f=i=i||o,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+b.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),u=0>g.indexOf(":")&&"on"+g,n=n[b.expando]?n:new b.Event(g,"object"==typeof n&&n),n.isTrigger=!0,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:b.makeArray(r,[n]),p=b.event.special[g]||{},a||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!a&&!p.noBubble&&!b.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(l=l.parentNode);l;l=l.parentNode)h.push(l),f=l;f===(i.ownerDocument||o)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((l=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(b._data(l,"events")||{})[n.type]&&b._data(l,"handle"),s&&s.apply(l,r),s=u&&l[u],s&&b.acceptData(l)&&s.apply&&s.apply(l,r)===!1&&n.preventDefault();if(n.type=g,!(a||n.isDefaultPrevented()||p._default&&p._default.apply(i.ownerDocument,r)!==!1||"click"===g&&b.nodeName(i,"a")||!b.acceptData(i)||!u||!i[g]||b.isWindow(i))){f=i[u],f&&(i[u]=null),b.event.triggered=g;try{i[g]()}catch(v){}b.event.triggered=t,f&&(i[u]=f)}return n.result}},dispatch:function(e){e=b.event.fix(e);var n,r,i,o,a,s=[],u=h.call(arguments),l=(b._data(this,"events")||{})[e.type]||[],c=b.event.special[e.type]||{};if(u[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=b.event.handlers.call(this,e,l),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((b.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,u),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],u=n.delegateCount,l=e.target;if(u&&l.nodeType&&(!e.button||"click"!==e.type))for(;l!=this;l=l.parentNode||this)if(1===l.nodeType&&(l.disabled!==!0||"click"!==e.type)){for(o=[],a=0;u>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?b(r,this).index(l)>=0:b.find(r,this,null,[l]).length),o[r]&&o.push(i);o.length&&s.push({elem:l,handlers:o})}return n.length>u&&s.push({elem:this,handlers:n.slice(u)}),s},fix:function(e){if(e[b.expando])return e;var t,n,r,i=e.type,a=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new b.Event(a),t=r.length;while(t--)n=r[t],e[n]=a[n];return e.target||(e.target=a.srcElement||o),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,a):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,a,s=n.button,u=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||o,a=i.documentElement,r=i.body,e.pageX=n.clientX+(a&&a.scrollLeft||r&&r.scrollLeft||0)-(a&&a.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(a&&a.scrollTop||r&&r.scrollTop||0)-(a&&a.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&u&&(e.relatedTarget=u===e.target?n.toElement:u),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},click:{trigger:function(){return b.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t}},focus:{trigger:function(){if(this!==o.activeElement&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===o.activeElement&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=b.extend(new b.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?b.event.trigger(i,null,t):b.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},b.removeEvent=o.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},b.Event=function(e,n){return this instanceof b.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&b.extend(this,n),this.timeStamp=e&&e.timeStamp||b.now(),this[b.expando]=!0,t):new b.Event(e,n)},b.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},b.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){b.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;
return(!i||i!==r&&!b.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),b.support.submitBubbles||(b.event.special.submit={setup:function(){return b.nodeName(this,"form")?!1:(b.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=b.nodeName(n,"input")||b.nodeName(n,"button")?n.form:t;r&&!b._data(r,"submitBubbles")&&(b.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),b._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&b.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return b.nodeName(this,"form")?!1:(b.event.remove(this,"._submit"),t)}}),b.support.changeBubbles||(b.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(b.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),b.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),b.event.simulate("change",this,e,!0)})),!1):(b.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!b._data(t,"changeBubbles")&&(b.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||b.event.simulate("change",this.parentNode,e,!0)}),b._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return b.event.remove(this,"._change"),!Z.test(this.nodeName)}}),b.support.focusinBubbles||b.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){b.event.simulate(t,e.target,b.event.fix(e),!0)};b.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),b.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return b().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=b.guid++)),this.each(function(){b.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,b(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){b.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){b.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?b.event.trigger(e,n,r,!0):t}}),function(e,t){var n,r,i,o,a,s,u,l,c,p,f,d,h,g,m,y,v,x="sizzle"+-new Date,w=e.document,T={},N=0,C=0,k=it(),E=it(),S=it(),A=typeof t,j=1<<31,D=[],L=D.pop,H=D.push,q=D.slice,M=D.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},_="[\\x20\\t\\r\\n\\f]",F="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=F.replace("w","w#"),B="([*^$|!~]?=)",P="\\["+_+"*("+F+")"+_+"*(?:"+B+_+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+O+")|)|)"+_+"*\\]",R=":("+F+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+P.replace(3,8)+")*)|.*)\\)|)",W=RegExp("^"+_+"+|((?:^|[^\\\\])(?:\\\\.)*)"+_+"+$","g"),$=RegExp("^"+_+"*,"+_+"*"),I=RegExp("^"+_+"*([\\x20\\t\\r\\n\\f>+~])"+_+"*"),z=RegExp(R),X=RegExp("^"+O+"$"),U={ID:RegExp("^#("+F+")"),CLASS:RegExp("^\\.("+F+")"),NAME:RegExp("^\\[name=['\"]?("+F+")['\"]?\\]"),TAG:RegExp("^("+F.replace("w","w*")+")"),ATTR:RegExp("^"+P),PSEUDO:RegExp("^"+R),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+_+"*(even|odd|(([+-]|)(\\d*)n|)"+_+"*(?:([+-]|)"+_+"*(\\d+)|))"+_+"*\\)|)","i"),needsContext:RegExp("^"+_+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+_+"*((?:-\\d)?\\d*)"+_+"*\\)|)(?=[^-]|$)","i")},V=/[\x20\t\r\n\f]*[+~]/,Y=/^[^{]+\{\s*\[native code/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,G=/^(?:input|select|textarea|button)$/i,Q=/^h\d$/i,K=/'|\\/g,Z=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,et=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,tt=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{q.call(w.documentElement.childNodes,0)[0].nodeType}catch(nt){q=function(e){var t,n=[];while(t=this[e++])n.push(t);return n}}function rt(e){return Y.test(e+"")}function it(){var e,t=[];return e=function(n,r){return t.push(n+=" ")>i.cacheLength&&delete e[t.shift()],e[n]=r}}function ot(e){return e[x]=!0,e}function at(e){var t=p.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}}function st(e,t,n,r){var i,o,a,s,u,l,f,g,m,v;if((t?t.ownerDocument||t:w)!==p&&c(t),t=t||p,n=n||[],!e||"string"!=typeof e)return n;if(1!==(s=t.nodeType)&&9!==s)return[];if(!d&&!r){if(i=J.exec(e))if(a=i[1]){if(9===s){if(o=t.getElementById(a),!o||!o.parentNode)return n;if(o.id===a)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(a))&&y(t,o)&&o.id===a)return n.push(o),n}else{if(i[2])return H.apply(n,q.call(t.getElementsByTagName(e),0)),n;if((a=i[3])&&T.getByClassName&&t.getElementsByClassName)return H.apply(n,q.call(t.getElementsByClassName(a),0)),n}if(T.qsa&&!h.test(e)){if(f=!0,g=x,m=t,v=9===s&&e,1===s&&"object"!==t.nodeName.toLowerCase()){l=ft(e),(f=t.getAttribute("id"))?g=f.replace(K,"\\$&"):t.setAttribute("id",g),g="[id='"+g+"'] ",u=l.length;while(u--)l[u]=g+dt(l[u]);m=V.test(e)&&t.parentNode||t,v=l.join(",")}if(v)try{return H.apply(n,q.call(m.querySelectorAll(v),0)),n}catch(b){}finally{f||t.removeAttribute("id")}}}return wt(e.replace(W,"$1"),t,n,r)}a=st.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},c=st.setDocument=function(e){var n=e?e.ownerDocument||e:w;return n!==p&&9===n.nodeType&&n.documentElement?(p=n,f=n.documentElement,d=a(n),T.tagNameNoComments=at(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),T.attributes=at(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),T.getByClassName=at(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),T.getByName=at(function(e){e.id=x+0,e.innerHTML="<a name='"+x+"'></a><div name='"+x+"'></div>",f.insertBefore(e,f.firstChild);var t=n.getElementsByName&&n.getElementsByName(x).length===2+n.getElementsByName(x+0).length;return T.getIdNotName=!n.getElementById(x),f.removeChild(e),t}),i.attrHandle=at(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==A&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},T.getIdNotName?(i.find.ID=function(e,t){if(typeof t.getElementById!==A&&!d){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){return e.getAttribute("id")===t}}):(i.find.ID=function(e,n){if(typeof n.getElementById!==A&&!d){var r=n.getElementById(e);return r?r.id===e||typeof r.getAttributeNode!==A&&r.getAttributeNode("id").value===e?[r]:t:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){var n=typeof e.getAttributeNode!==A&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=T.tagNameNoComments?function(e,n){return typeof n.getElementsByTagName!==A?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.NAME=T.getByName&&function(e,n){return typeof n.getElementsByName!==A?n.getElementsByName(name):t},i.find.CLASS=T.getByClassName&&function(e,n){return typeof n.getElementsByClassName===A||d?t:n.getElementsByClassName(e)},g=[],h=[":focus"],(T.qsa=rt(n.querySelectorAll))&&(at(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||h.push("\\["+_+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||h.push(":checked")}),at(function(e){e.innerHTML="<input type='hidden' i=''/>",e.querySelectorAll("[i^='']").length&&h.push("[*^$]="+_+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||h.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),h.push(",.*:")})),(T.matchesSelector=rt(m=f.matchesSelector||f.mozMatchesSelector||f.webkitMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&at(function(e){T.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",R)}),h=RegExp(h.join("|")),g=RegExp(g.join("|")),y=rt(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},v=f.compareDocumentPosition?function(e,t){var r;return e===t?(u=!0,0):(r=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t))?1&r||e.parentNode&&11===e.parentNode.nodeType?e===n||y(w,e)?-1:t===n||y(w,t)?1:0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return u=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:0;if(o===a)return ut(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?ut(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},u=!1,[0,0].sort(v),T.detectDuplicates=u,p):p},st.matches=function(e,t){return st(e,null,null,t)},st.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Z,"='$1']"),!(!T.matchesSelector||d||g&&g.test(t)||h.test(t)))try{var n=m.call(e,t);if(n||T.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return st(t,p,null,[e]).length>0},st.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},st.attr=function(e,t){var n;return(e.ownerDocument||e)!==p&&c(e),d||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):d||T.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},st.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},st.uniqueSort=function(e){var t,n=[],r=1,i=0;if(u=!T.detectDuplicates,e.sort(v),u){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e};function ut(e,t){var n=t&&e,r=n&&(~t.sourceIndex||j)-(~e.sourceIndex||j);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function lt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ct(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function pt(e){return ot(function(t){return t=+t,ot(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}o=st.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=st.selectors={cacheLength:50,createPseudo:ot,match:U,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(et,tt),e[3]=(e[4]||e[5]||"").replace(et,tt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||st.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&st.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return U.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&z.test(n)&&(t=ft(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(et,tt).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[e+" "];return t||(t=RegExp("(^|"+_+")"+e+"("+_+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==A&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=st.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!u&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[x]||(m[x]={}),l=c[e]||[],d=l[0]===N&&l[1],f=l[0]===N&&l[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[N,d,f];break}}else if(v&&(l=(t[x]||(t[x]={}))[e])&&l[0]===N)f=l[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[x]||(p[x]={}))[e]=[N,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||st.error("unsupported pseudo: "+e);return r[x]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?ot(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=M.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ot(function(e){var t=[],n=[],r=s(e.replace(W,"$1"));return r[x]?ot(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ot(function(e){return function(t){return st(e,t).length>0}}),contains:ot(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:ot(function(e){return X.test(e||"")||st.error("unsupported lang: "+e),e=e.replace(et,tt).toLowerCase(),function(t){var n;do if(n=d?t.getAttribute("xml:lang")||t.getAttribute("lang"):t.lang)return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return Q.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:pt(function(){return[0]}),last:pt(function(e,t){return[t-1]}),eq:pt(function(e,t,n){return[0>n?n+t:n]}),even:pt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:pt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:pt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:pt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[n]=lt(n);for(n in{submit:!0,reset:!0})i.pseudos[n]=ct(n);function ft(e,t){var n,r,o,a,s,u,l,c=E[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=i.preFilter;while(s){(!n||(r=$.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),u.push(o=[])),n=!1,(r=I.exec(s))&&(n=r.shift(),o.push({value:n,type:r[0].replace(W," ")}),s=s.slice(n.length));for(a in i.filter)!(r=U[a].exec(s))||l[a]&&!(r=l[a](r))||(n=r.shift(),o.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?st.error(e):E(e,u).slice(0)}function dt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function ht(e,t,n){var i=t.dir,o=n&&"parentNode"===i,a=C++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,s){var u,l,c,p=N+" "+a;if(s){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[x]||(t[x]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,s)||r,l[1]===!0)return!0}}function gt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function mt(e,t,n,r,i){var o,a=[],s=0,u=e.length,l=null!=t;for(;u>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),l&&t.push(s));return a}function yt(e,t,n,r,i,o){return r&&!r[x]&&(r=yt(r)),i&&!i[x]&&(i=yt(i,o)),ot(function(o,a,s,u){var l,c,p,f=[],d=[],h=a.length,g=o||xt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:mt(g,f,e,s,u),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,u),r){l=mt(y,d),r(l,[],s,u),c=l.length;while(c--)(p=l[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?M.call(o,p):f[c])>-1&&(o[l]=!(a[l]=p))}}else y=mt(y===a?y.splice(h,y.length):y),i?i(null,a,y,u):H.apply(a,y)})}function vt(e){var t,n,r,o=e.length,a=i.relative[e[0].type],s=a||i.relative[" "],u=a?1:0,c=ht(function(e){return e===t},s,!0),p=ht(function(e){return M.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>u;u++)if(n=i.relative[e[u].type])f=[ht(gt(f),n)];else{if(n=i.filter[e[u].type].apply(null,e[u].matches),n[x]){for(r=++u;o>r;r++)if(i.relative[e[r].type])break;return yt(u>1&&gt(f),u>1&&dt(e.slice(0,u-1)).replace(W,"$1"),n,r>u&&vt(e.slice(u,r)),o>r&&vt(e=e.slice(r)),o>r&&dt(e))}f.push(n)}return gt(f)}function bt(e,t){var n=0,o=t.length>0,a=e.length>0,s=function(s,u,c,f,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,T=l,C=s||a&&i.find.TAG("*",d&&u.parentNode||u),k=N+=null==T?1:Math.random()||.1;for(w&&(l=u!==p&&u,r=n);null!=(h=C[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,u,c)){f.push(h);break}w&&(N=k,r=++n)}o&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,o&&b!==v){g=0;while(m=t[g++])m(x,y,u,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=L.call(f));y=mt(y)}H.apply(f,y),w&&!s&&y.length>0&&v+t.length>1&&st.uniqueSort(f)}return w&&(N=k,l=T),x};return o?ot(s):s}s=st.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=ft(e)),n=t.length;while(n--)o=vt(t[n]),o[x]?r.push(o):i.push(o);o=S(e,bt(i,r))}return o};function xt(e,t,n){var r=0,i=t.length;for(;i>r;r++)st(e,t[r],n);return n}function wt(e,t,n,r){var o,a,u,l,c,p=ft(e);if(!r&&1===p.length){if(a=p[0]=p[0].slice(0),a.length>2&&"ID"===(u=a[0]).type&&9===t.nodeType&&!d&&i.relative[a[1].type]){if(t=i.find.ID(u.matches[0].replace(et,tt),t)[0],!t)return n;e=e.slice(a.shift().value.length)}o=U.needsContext.test(e)?0:a.length;while(o--){if(u=a[o],i.relative[l=u.type])break;if((c=i.find[l])&&(r=c(u.matches[0].replace(et,tt),V.test(a[0].type)&&t.parentNode||t))){if(a.splice(o,1),e=r.length&&dt(a),!e)return H.apply(n,q.call(r,0)),n;break}}}return s(e,p)(r,t,d,n,V.test(e)),n}i.pseudos.nth=i.pseudos.eq;function Tt(){}i.filters=Tt.prototype=i.pseudos,i.setFilters=new Tt,c(),st.attr=b.attr,b.find=st,b.expr=st.selectors,b.expr[":"]=b.expr.pseudos,b.unique=st.uniqueSort,b.text=st.getText,b.isXMLDoc=st.isXML,b.contains=st.contains}(e);var at=/Until$/,st=/^(?:parents|prev(?:Until|All))/,ut=/^.[^:#\[\.,]*$/,lt=b.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};b.fn.extend({find:function(e){var t,n,r,i=this.length;if("string"!=typeof e)return r=this,this.pushStack(b(e).filter(function(){for(t=0;i>t;t++)if(b.contains(r[t],this))return!0}));for(n=[],t=0;i>t;t++)b.find(e,this[t],n);return n=this.pushStack(i>1?b.unique(n):n),n.selector=(this.selector?this.selector+" ":"")+e,n},has:function(e){var t,n=b(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(b.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1))},filter:function(e){return this.pushStack(ft(this,e,!0))},is:function(e){return!!e&&("string"==typeof e?lt.test(e)?b(e,this.context).index(this[0])>=0:b.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,o=[],a=lt.test(e)||"string"!=typeof e?b(e,t||this.context):0;for(;i>r;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&11!==n.nodeType){if(a?a.index(n)>-1:b.find.matchesSelector(n,e)){o.push(n);break}n=n.parentNode}}return this.pushStack(o.length>1?b.unique(o):o)},index:function(e){return e?"string"==typeof e?b.inArray(this[0],b(e)):b.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?b(e,t):b.makeArray(e&&e.nodeType?[e]:e),r=b.merge(this.get(),n);return this.pushStack(b.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),b.fn.andSelf=b.fn.addBack;function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}b.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return b.dir(e,"parentNode")},parentsUntil:function(e,t,n){return b.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return b.dir(e,"nextSibling")},prevAll:function(e){return b.dir(e,"previousSibling")},nextUntil:function(e,t,n){return b.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return b.dir(e,"previousSibling",n)},siblings:function(e){return b.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return b.sibling(e.firstChild)},contents:function(e){return b.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:b.merge([],e.childNodes)}},function(e,t){b.fn[e]=function(n,r){var i=b.map(this,t,n);return at.test(e)||(r=n),r&&"string"==typeof r&&(i=b.filter(r,i)),i=this.length>1&&!ct[e]?b.unique(i):i,this.length>1&&st.test(e)&&(i=i.reverse()),this.pushStack(i)}}),b.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),1===t.length?b.find.matchesSelector(t[0],e)?[t[0]]:[]:b.find.matches(e,t)},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!b(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(t=t||0,b.isFunction(t))return b.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return b.grep(e,function(e){return e===t===n});if("string"==typeof t){var r=b.grep(e,function(e){return 1===e.nodeType});if(ut.test(t))return b.filter(t,r,!n);t=b.filter(t,r)}return b.grep(e,function(e){return b.inArray(e,t)>=0===n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Nt=/^(?:checkbox|radio)$/i,Ct=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:b.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(o),Dt=jt.appendChild(o.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,b.fn.extend({text:function(e){return b.access(this,function(e){return e===t?b.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(b.isFunction(e))return this.each(function(t){b(this).wrapAll(e.call(this,t))});if(this[0]){var t=b(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return b.isFunction(e)?this.each(function(t){b(this).wrapInner(e.call(this,t))}):this.each(function(){var t=b(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=b.isFunction(e);return this.each(function(n){b(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){b.nodeName(this,"body")||b(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.insertBefore(e,this.firstChild)})},before:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=0;for(;null!=(n=this[r]);r++)(!e||b.filter(e,[n]).length>0)&&(t||1!==n.nodeType||b.cleanData(Ot(n)),n.parentNode&&(t&&b.contains(n.ownerDocument,n)&&Mt(Ot(n,"script")),n.parentNode.removeChild(n)));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&b.cleanData(Ot(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&b.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return b.clone(this,e,t)})},html:function(e){return b.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!b.support.htmlSerialize&&mt.test(e)||!b.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(b.cleanData(Ot(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){var t=b.isFunction(e);return t||"string"==typeof e||(e=b(e).not(this).detach()),this.domManip([e],!0,function(e){var t=this.nextSibling,n=this.parentNode;n&&(b(this).remove(),n.insertBefore(e,t))})},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=f.apply([],e);var i,o,a,s,u,l,c=0,p=this.length,d=this,h=p-1,g=e[0],m=b.isFunction(g);if(m||!(1>=p||"string"!=typeof g||b.support.checkClone)&&Ct.test(g))return this.each(function(i){var o=d.eq(i);m&&(e[0]=g.call(this,i,n?o.html():t)),o.domManip(e,n,r)});if(p&&(l=b.buildFragment(e,this[0].ownerDocument,!1,this),i=l.firstChild,1===l.childNodes.length&&(l=i),i)){for(n=n&&b.nodeName(i,"tr"),s=b.map(Ot(l,"script"),Ht),a=s.length;p>c;c++)o=l,c!==h&&(o=b.clone(o,!0,!0),a&&b.merge(s,Ot(o,"script"))),r.call(n&&b.nodeName(this[c],"table")?Lt(this[c],"tbody"):this[c],o,c);if(a)for(u=s[s.length-1].ownerDocument,b.map(s,qt),c=0;a>c;c++)o=s[c],kt.test(o.type||"")&&!b._data(o,"globalEval")&&b.contains(u,o)&&(o.src?b.ajax({url:o.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):b.globalEval((o.text||o.textContent||o.innerHTML||"").replace(St,"")));l=i=null}return this}});function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function Ht(e){var t=e.getAttributeNode("type");return e.type=(t&&t.specified)+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function Mt(e,t){var n,r=0;for(;null!=(n=e[r]);r++)b._data(n,"globalEval",!t||b._data(t[r],"globalEval"))}function _t(e,t){if(1===t.nodeType&&b.hasData(e)){var n,r,i,o=b._data(e),a=b._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)b.event.add(t,n,s[n][r])}a.data&&(a.data=b.extend({},a.data))}}function Ft(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!b.support.noCloneEvent&&t[b.expando]){i=b._data(t);for(r in i.events)b.removeEvent(t,r,i.handle);t.removeAttribute(b.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),b.support.html5Clone&&e.innerHTML&&!b.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Nt.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}b.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){b.fn[e]=function(e){var n,r=0,i=[],o=b(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),b(o[r])[t](n),d.apply(i,n.get());return this.pushStack(i)}});function Ot(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||b.nodeName(o,n)?s.push(o):b.merge(s,Ot(o,n));return n===t||n&&b.nodeName(e,n)?b.merge([e],s):s}function Bt(e){Nt.test(e.type)&&(e.defaultChecked=e.checked)}b.extend({clone:function(e,t,n){var r,i,o,a,s,u=b.contains(e.ownerDocument,e);if(b.support.html5Clone||b.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(b.support.noCloneEvent&&b.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||b.isXMLDoc(e)))for(r=Ot(o),s=Ot(e),a=0;null!=(i=s[a]);++a)r[a]&&Ft(i,r[a]);if(t)if(n)for(s=s||Ot(e),r=r||Ot(o),a=0;null!=(i=s[a]);a++)_t(i,r[a]);else _t(e,o);return r=Ot(o,"script"),r.length>0&&Mt(r,!u&&Ot(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,u,l,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===b.type(o))b.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),u=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[u]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!b.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!b.support.tbody){o="table"!==u||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)b.nodeName(l=o.childNodes[i],"tbody")&&!l.childNodes.length&&o.removeChild(l)
}b.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),b.support.appendChecked||b.grep(Ot(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===b.inArray(o,r))&&(a=b.contains(o.ownerDocument,o),s=Ot(f.appendChild(o),"script"),a&&Mt(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,u=b.expando,l=b.cache,p=b.support.deleteExpando,f=b.event.special;for(;null!=(n=e[s]);s++)if((t||b.acceptData(n))&&(o=n[u],a=o&&l[o])){if(a.events)for(r in a.events)f[r]?b.event.remove(n,r):b.removeEvent(n,r,a.handle);l[o]&&(delete l[o],p?delete n[u]:typeof n.removeAttribute!==i?n.removeAttribute(u):n[u]=null,c.push(o))}}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+x+")(.*)$","i"),Yt=RegExp("^("+x+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+x+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===b.css(e,"display")||!b.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=b._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=b._data(r,"olddisplay",un(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&b._data(r,"olddisplay",i?n:b.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}b.fn.extend({css:function(e,n){return b.access(this,function(e,n,r){var i,o,a={},s=0;if(b.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=b.css(e,n[s],!1,o);return a}return r!==t?b.style(e,n,r):b.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?b(this).show():b(this).hide()})}}),b.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":b.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,u=b.camelCase(n),l=e.style;if(n=b.cssProps[u]||(b.cssProps[u]=tn(l,u)),s=b.cssHooks[n]||b.cssHooks[u],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:l[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(b.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||b.cssNumber[u]||(r+="px"),b.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(l[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{l[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,u=b.camelCase(n);return n=b.cssProps[u]||(b.cssProps[u]=tn(e.style,u)),s=b.cssHooks[n]||b.cssHooks[u],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||b.isNumeric(o)?o||0:a):a},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s.getPropertyValue(n)||s[n]:t,l=e.style;return s&&(""!==u||b.contains(e.ownerDocument,e)||(u=b.style(e,n)),Yt.test(u)&&Ut.test(n)&&(i=l.width,o=l.minWidth,a=l.maxWidth,l.minWidth=l.maxWidth=l.width=u,u=s.width,l.width=i,l.minWidth=o,l.maxWidth=a)),u}):o.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s[n]:t,l=e.style;return null==u&&l&&l[n]&&(u=l[n]),Yt.test(u)&&!zt.test(n)&&(i=l.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),l.left="fontSize"===n?"1em":u,u=l.pixelLeft+"px",l.left=i,a&&(o.left=a)),""===u?"auto":u});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=b.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=b.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=b.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=b.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=b.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(b.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function un(e){var t=o,n=Gt[e];return n||(n=ln(e,t),"none"!==n&&n||(Pt=(Pt||b("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=ln(e,t),Pt.detach()),Gt[e]=n),n}function ln(e,t){var n=b(t.createElement(e)).appendTo(t.body),r=b.css(n[0],"display");return n.remove(),r}b.each(["height","width"],function(e,n){b.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(b.css(e,"display"))?b.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,i),i):0)}}}),b.support.opacity||(b.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=b.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===b.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),b(function(){b.support.reliableMarginRight||(b.cssHooks.marginRight={get:function(e,n){return n?b.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!b.support.pixelPosition&&b.fn.position&&b.each(["top","left"],function(e,n){b.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?b(e).position()[n]+"px":r):t}}})}),b.expr&&b.expr.filters&&(b.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!b.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||b.css(e,"display"))},b.expr.filters.visible=function(e){return!b.expr.filters.hidden(e)}),b.each({margin:"",padding:"",border:"Width"},function(e,t){b.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(b.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;b.fn.extend({serialize:function(){return b.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=b.prop(this,"elements");return e?b.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!b(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Nt.test(e))}).map(function(e,t){var n=b(this).val();return null==n?null:b.isArray(n)?b.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),b.param=function(e,n){var r,i=[],o=function(e,t){t=b.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=b.ajaxSettings&&b.ajaxSettings.traditional),b.isArray(e)||e.jquery&&!b.isPlainObject(e))b.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(b.isArray(t))b.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==b.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){b.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),b.fn.hover=function(e,t){return this.mouseenter(e).mouseleave(t||e)};var mn,yn,vn=b.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Nn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Cn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=b.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=a.href}catch(Ln){yn=o.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(b.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(u){var l;return o[u]=!0,b.each(e[u]||[],function(e,u){var c=u(n,r,i);return"string"!=typeof c||a||o[c]?a?!(l=c):t:(n.dataTypes.unshift(c),s(c),!1)}),l}return s(n.dataTypes[0])||!o["*"]&&s("*")}function Mn(e,n){var r,i,o=b.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&b.extend(!0,e,r),e}b.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,u=e.indexOf(" ");return u>=0&&(i=e.slice(u,e.length),e=e.slice(0,u)),b.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&b.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?b("<div>").append(b.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},b.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){b.fn[t]=function(e){return this.on(t,e)}}),b.each(["get","post"],function(e,n){b[n]=function(e,r,i,o){return b.isFunction(r)&&(o=o||i,i=r,r=t),b.ajax({url:e,type:n,dataType:o,data:r,success:i})}}),b.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Nn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":b.parseJSON,"text xml":b.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Mn(Mn(e,b.ajaxSettings),t):Mn(b.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,u,l,c,p=b.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?b(f):b.event,h=b.Deferred(),g=b.Callbacks("once memory"),m=p.statusCode||{},y={},v={},x=0,T="canceled",N={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>x)for(t in e)m[t]=[m[t],e[t]];else N.always(e[N.status]);return this},abort:function(e){var t=e||T;return l&&l.abort(t),k(0,t),this}};if(h.promise(N).complete=g.add,N.success=N.done,N.error=N.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=b.trim(p.dataType||"*").toLowerCase().match(w)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?80:443))==(mn[3]||("http:"===mn[1]?80:443)))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=b.param(p.data,p.traditional)),qn(An,p,n,N),2===x)return N;u=p.global,u&&0===b.active++&&b.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Cn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(b.lastModified[o]&&N.setRequestHeader("If-Modified-Since",b.lastModified[o]),b.etag[o]&&N.setRequestHeader("If-None-Match",b.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&N.setRequestHeader("Content-Type",p.contentType),N.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)N.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,N,p)===!1||2===x))return N.abort();T="abort";for(i in{success:1,error:1,complete:1})N[i](p[i]);if(l=qn(jn,p,n,N)){N.readyState=1,u&&d.trigger("ajaxSend",[N,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){N.abort("timeout")},p.timeout));try{x=1,l.send(y,k)}catch(C){if(!(2>x))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,C=n;2!==x&&(x=2,s&&clearTimeout(s),l=t,a=i||"",N.readyState=e>0?4:0,r&&(w=_n(p,N,r)),e>=200&&300>e||304===e?(p.ifModified&&(T=N.getResponseHeader("Last-Modified"),T&&(b.lastModified[o]=T),T=N.getResponseHeader("etag"),T&&(b.etag[o]=T)),204===e?(c=!0,C="nocontent"):304===e?(c=!0,C="notmodified"):(c=Fn(p,w),C=c.state,y=c.data,v=c.error,c=!v)):(v=C,(e||!C)&&(C="error",0>e&&(e=0))),N.status=e,N.statusText=(n||C)+"",c?h.resolveWith(f,[y,C,N]):h.rejectWith(f,[N,C,v]),N.statusCode(m),m=t,u&&d.trigger(c?"ajaxSuccess":"ajaxError",[N,p,c?y:v]),g.fireWith(f,[N,C]),u&&(d.trigger("ajaxComplete",[N,p]),--b.active||b.event.trigger("ajaxStop")))}return N},getScript:function(e,n){return b.get(e,t,n,"script")},getJSON:function(e,t,n){return b.get(e,t,n,"json")}});function _n(e,n,r){var i,o,a,s,u=e.contents,l=e.dataTypes,c=e.responseFields;for(s in c)s in r&&(n[c[s]]=r[s]);while("*"===l[0])l.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in u)if(u[s]&&u[s].test(o)){l.unshift(s);break}if(l[0]in r)a=l[0];else{for(s in r){if(!l[0]||e.converters[s+" "+l[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==l[0]&&l.unshift(a),r[a]):t}function Fn(e,t){var n,r,i,o,a={},s=0,u=e.dataTypes.slice(),l=u[0];if(e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u[1])for(i in e.converters)a[i.toLowerCase()]=e.converters[i];for(;r=u[++s];)if("*"!==r){if("*"!==l&&l!==r){if(i=a[l+" "+r]||a["* "+r],!i)for(n in a)if(o=n.split(" "),o[1]===r&&(i=a[l+" "+o[0]]||a["* "+o[0]])){i===!0?i=a[n]:a[n]!==!0&&(r=o[0],u.splice(s--,0,r));break}if(i!==!0)if(i&&e["throws"])t=i(t);else try{t=i(t)}catch(c){return{state:"parsererror",error:i?c:"No conversion from "+l+" to "+r}}}l=r}return{state:"success",data:t}}b.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return b.globalEval(e),e}}}),b.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),b.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=o.head||b("head")[0]||o.documentElement;return{send:function(t,i){n=o.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var On=[],Bn=/(=)\?(?=&|$)|\?\?/;b.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=On.pop()||b.expando+"_"+vn++;return this[e]=!0,e}}),b.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,u=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return u||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=b.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,u?n[u]=n[u].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||b.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,On.push(o)),s&&b.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}b.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=b.ajaxSettings.xhr(),b.support.cors=!!Rn&&"withCredentials"in Rn,Rn=b.support.ajax=!!Rn,Rn&&b.ajaxTransport(function(n){if(!n.crossDomain||b.support.cors){var r;return{send:function(i,o){var a,s,u=n.xhr();if(n.username?u.open(n.type,n.url,n.async,n.username,n.password):u.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)u[s]=n.xhrFields[s];n.mimeType&&u.overrideMimeType&&u.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)u.setRequestHeader(s,i[s])}catch(l){}u.send(n.hasContent&&n.data||null),r=function(e,i){var s,l,c,p;try{if(r&&(i||4===u.readyState))if(r=t,a&&(u.onreadystatechange=b.noop,$n&&delete Pn[a]),i)4!==u.readyState&&u.abort();else{p={},s=u.status,l=u.getAllResponseHeaders(),"string"==typeof u.responseText&&(p.text=u.responseText);try{c=u.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,l)},n.async?4===u.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},b(e).unload($n)),Pn[a]=r),u.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+x+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n,r,i=this.createTween(e,t),o=Yn.exec(t),a=i.cur(),s=+a||0,u=1,l=20;if(o){if(n=+o[2],r=o[3]||(b.cssNumber[e]?"":"px"),"px"!==r&&s){s=b.css(i.elem,e,!0)||n||1;do u=u||".5",s/=u,b.style(i.elem,e,s+r);while(u!==(u=i.cur()/a)&&1!==u&&--l)}i.unit=r,i.start=s,i.end=o[1]?s+(o[1]+1)*n:n}return i}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=b.now()}function Zn(e,t){b.each(t,function(t,n){var r=(Qn[t]||[]).concat(Qn["*"]),i=0,o=r.length;for(;o>i;i++)if(r[i].call(e,t,n))return})}function er(e,t,n){var r,i,o=0,a=Gn.length,s=b.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;for(;u>a;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),1>o&&u?n:(s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:b.extend({},t),opts:b.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=b.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?s.resolveWith(e,[l,t]):s.rejectWith(e,[l,t]),this}}),c=l.props;for(tr(c,l.opts.specialEasing);a>o;o++)if(r=Gn[o].call(l,e,c,l.opts))return r;return Zn(l,c),b.isFunction(l.opts.start)&&l.opts.start.call(e,l),b.fx.timer(b.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function tr(e,t){var n,r,i,o,a;for(i in e)if(r=b.camelCase(i),o=t[r],n=e[i],b.isArray(n)&&(o=n[1],n=e[i]=n[0]),i!==r&&(e[r]=n,delete e[i]),a=b.cssHooks[r],a&&"expand"in a){n=a.expand(n),delete e[r];for(i in n)i in e||(e[i]=n[i],t[i]=o)}else t[r]=o}b.Animation=b.extend(er,{tweener:function(e,t){b.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,u,l,c,p,f=this,d=e.style,h={},g=[],m=e.nodeType&&nn(e);n.queue||(c=b._queueHooks(e,"fx"),null==c.unqueued&&(c.unqueued=0,p=c.empty.fire,c.empty.fire=function(){c.unqueued||p()}),c.unqueued++,f.always(function(){f.always(function(){c.unqueued--,b.queue(e,"fx").length||c.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],"inline"===b.css(e,"display")&&"none"===b.css(e,"float")&&(b.support.inlineBlockNeedsLayout&&"inline"!==un(e.nodeName)?d.zoom=1:d.display="inline-block")),n.overflow&&(d.overflow="hidden",b.support.shrinkWrapBlocks||f.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}));for(i in t)if(a=t[i],Vn.exec(a)){if(delete t[i],u=u||"toggle"===a,a===(m?"hide":"show"))continue;g.push(i)}if(o=g.length){s=b._data(e,"fxshow")||b._data(e,"fxshow",{}),"hidden"in s&&(m=s.hidden),u&&(s.hidden=!m),m?b(e).show():f.done(function(){b(e).hide()}),f.done(function(){var t;b._removeData(e,"fxshow");for(t in h)b.style(e,t,h[t])});for(i=0;o>i;i++)r=g[i],l=f.createTween(r,m?s[r]:0),h[r]=s[r]||b.style(e,r),r in s||(s[r]=l.start,m&&(l.end=l.start,l.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}b.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(b.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?b.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=b.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){b.fx.step[e.prop]?b.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[b.cssProps[e.prop]]||b.cssHooks[e.prop])?b.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},b.each(["toggle","show","hide"],function(e,t){var n=b.fn[t];b.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),b.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=b.isEmptyObject(e),o=b.speed(t,n,r),a=function(){var t=er(this,b.extend({},e),o);a.finish=function(){t.stop(!0)},(i||b._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=b.timers,a=b._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&b.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=b._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=b.timers,a=r?r.length:0;for(n.finish=!0,b.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}b.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){b.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),b.speed=function(e,t,n){var r=e&&"object"==typeof e?b.extend({},e):{complete:n||!n&&t||b.isFunction(e)&&e,duration:e,easing:n&&t||t&&!b.isFunction(t)&&t};return r.duration=b.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in b.fx.speeds?b.fx.speeds[r.duration]:b.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){b.isFunction(r.old)&&r.old.call(this),r.queue&&b.dequeue(this,r.queue)},r},b.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},b.timers=[],b.fx=rr.prototype.init,b.fx.tick=function(){var e,n=b.timers,r=0;for(Xn=b.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||b.fx.stop(),Xn=t},b.fx.timer=function(e){e()&&b.timers.push(e)&&b.fx.start()},b.fx.interval=13,b.fx.start=function(){Un||(Un=setInterval(b.fx.tick,b.fx.interval))},b.fx.stop=function(){clearInterval(Un),Un=null},b.fx.speeds={slow:600,fast:200,_default:400},b.fx.step={},b.expr&&b.expr.filters&&(b.expr.filters.animated=function(e){return b.grep(b.timers,function(t){return e===t.elem}).length}),b.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){b.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,b.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},b.offset={setOffset:function(e,t,n){var r=b.css(e,"position");"static"===r&&(e.style.position="relative");var i=b(e),o=i.offset(),a=b.css(e,"top"),s=b.css(e,"left"),u=("absolute"===r||"fixed"===r)&&b.inArray("auto",[a,s])>-1,l={},c={},p,f;u?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),b.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(l.top=t.top-o.top+p),null!=t.left&&(l.left=t.left-o.left+f),"using"in t?t.using.call(e,l):i.css(l)}},b.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===b.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),b.nodeName(e[0],"html")||(n=e.offset()),n.top+=b.css(e[0],"borderTopWidth",!0),n.left+=b.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-b.css(r,"marginTop",!0),left:t.left-n.left-b.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||o.documentElement;while(e&&!b.nodeName(e,"html")&&"static"===b.css(e,"position"))e=e.offsetParent;return e||o.documentElement})}}),b.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);b.fn[e]=function(i){return b.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?b(a).scrollLeft():o,r?o:b(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return b.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}b.each({Height:"height",Width:"width"},function(e,n){b.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){b.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return b.access(this,function(n,r,i){var o;return b.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?b.css(n,r,s):b.style(n,r,i,s)},n,a?i:t,a,null)}})}),e.jQuery=e.$=b,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return b})})(window);
;
//*/js/noconsole.js*//
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
;
//*/js/angular-1.1.4/angular.min.js*//
/*
 AngularJS v1.1.4
 (c) 2010-2012 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(M,V,s){'use strict';function gc(){var b=M.angular;M.angular=hc;return b}function o(b,a,c){var d;if(b)if(I(b))for(d in b)d!="prototype"&&d!="length"&&d!="name"&&b.hasOwnProperty(d)&&a.call(c,b[d],d);else if(b.forEach&&b.forEach!==o)b.forEach(a,c);else if(!b||typeof b.length!=="number"?0:typeof b.hasOwnProperty!="function"&&typeof b.constructor!="function"||b instanceof P||ca&&b instanceof ca||Da.call(b)!=="[object Object]"||typeof b.callee==="function")for(d=0;d<b.length;d++)a.call(c,b[d],
d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function rb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function ic(b,a,c){for(var d=rb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function sb(b){return function(a,c){b(c,a)}}function Ea(){for(var b=Z.length,a;b;){b--;a=Z[b].charCodeAt(0);if(a==57)return Z[b]="A",Z.join("");if(a==90)Z[b]="0";else return Z[b]=String.fromCharCode(a+1),Z.join("")}Z.unshift("0");return Z.join("")}function y(b){o(arguments,
function(a){a!==b&&o(a,function(a,d){b[d]=a})});return b}function K(b){return parseInt(b,10)}function Fa(b,a){return y(new (y(function(){},{prototype:b})),a)}function t(){}function pa(b){return b}function Q(b){return function(){return b}}function u(b){return typeof b=="undefined"}function w(b){return typeof b!="undefined"}function L(b){return b!=null&&typeof b=="object"}function x(b){return typeof b=="string"}function Za(b){return typeof b=="number"}function qa(b){return Da.apply(b)=="[object Date]"}
function C(b){return Da.apply(b)=="[object Array]"}function I(b){return typeof b=="function"}function ra(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function S(b){return x(b)?b.replace(/^\s*/,"").replace(/\s*$/,""):b}function jc(b){return b&&(b.nodeName||b.bind&&b.find)}function $a(b,a,c){var d=[];o(b,function(b,f,i){d.push(a.call(c,b,f,i))});return d}function Ga(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function sa(b,a){var c=Ga(b,
a);c>=0&&b.splice(c,1);return a}function W(b,a){if(ra(b)||b&&b.$evalAsync&&b.$watch)throw Error("Can't copy Window or Scope");if(a){if(b===a)throw Error("Can't copy equivalent objects or arrays");if(C(b))for(var c=a.length=0;c<b.length;c++)a.push(W(b[c]));else for(c in o(a,function(b,c){delete a[c]}),b)a[c]=W(b[c])}else(a=b)&&(C(b)?a=W(b,[]):qa(b)?a=new Date(b.getTime()):L(b)&&(a=W(b,{})));return a}function kc(b,a){var a=a||{},c;for(c in b)b.hasOwnProperty(c)&&c.substr(0,2)!=="$$"&&(a[c]=b[c]);return a}
function ja(b,a){if(b===a)return!0;if(b===null||a===null)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&c=="object")if(C(b)){if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ja(b[d],a[d]))return!1;return!0}}else if(qa(b))return qa(a)&&b.getTime()==a.getTime();else{if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||ra(b)||ra(a))return!1;c={};for(d in b)if(!(d.charAt(0)==="$"||I(b[d]))){if(!ja(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c[d]&&d.charAt(0)!=="$"&&a[d]!==s&&!I(a[d]))return!1;
return!0}return!1}function ab(b,a){var c=arguments.length>2?ka.call(arguments,2):[];return I(a)&&!(a instanceof RegExp)?c.length?function(){return arguments.length?a.apply(b,c.concat(ka.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}:a}function lc(b,a){var c=a;/^\$+/.test(b)?c=s:ra(a)?c="$WINDOW":a&&V===a?c="$DOCUMENT":a&&a.$evalAsync&&a.$watch&&(c="$SCOPE");return c}function da(b,a){return JSON.stringify(b,lc,a?"  ":null)}function tb(b){return x(b)?
JSON.parse(b):b}function Ha(b){b&&b.length!==0?(b=J(""+b),b=!(b=="f"||b=="0"||b=="false"||b=="no"||b=="n"||b=="[]")):b=!1;return b}function ta(b){b=v(b).clone();try{b.html("")}catch(a){}var c=v("<div>").append(b).html();try{return b[0].nodeType===3?J(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+J(b)})}catch(d){return J(c)}}function bb(b){var a={},c,d;o((b||"").split("&"),function(b){b&&(c=b.split("="),d=decodeURIComponent(c[0]),a[d]=w(c[1])?decodeURIComponent(c[1]):!0)});
return a}function ub(b){var a=[];o(b,function(b,d){a.push(ua(d,!0)+(b===!0?"":"="+ua(b,!0)))});return a.length?a.join("&"):""}function cb(b){return ua(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function ua(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function mc(b,a){function c(a){a&&d.push(a)}var d=[b],e,f,i=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
o(i,function(a){i[a]=!0;c(V.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(o(b.querySelectorAll("."+a),c),o(b.querySelectorAll("."+a+"\\:"),c),o(b.querySelectorAll("["+a+"]"),c))});o(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):o(a.attributes,function(b){if(!e&&i[b.name])e=a,f=b.value})}});e&&a(e,f?[f]:[])}function vb(b,a){var c=function(){b=v(b);a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");
var c=wb(a);c.invoke(["$rootScope","$rootElement","$compile","$injector",function(a,b,c,d){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(M&&!d.test(M.name))return c();M.name=M.name.replace(d,"");Ia.resumeBootstrap=function(b){o(b,function(b){a.push(b)});c()}}function db(b,a){a=a||"_";return b.replace(nc,function(b,d){return(d?a:"")+b.toLowerCase()})}function eb(b,a,c){if(!b)throw Error("Argument '"+(a||"?")+"' is "+(c||"required"));return b}function va(b,
a,c){c&&C(b)&&(b=b[b.length-1]);eb(I(b),a,"not a function, got "+(b&&typeof b=="object"?b.constructor.name||"Object":typeof b));return b}function oc(b){function a(a,b,e){return a[b]||(a[b]=e())}return a(a(b,"angular",Object),"module",function(){var b={};return function(d,e,f){e&&b.hasOwnProperty(d)&&(b[d]=null);return a(b,d,function(){function a(c,d,e){return function(){b[e||"push"]([c,d,arguments]);return m}}if(!e)throw Error("No module: "+d);var b=[],c=[],g=a("$injector","invoke"),m={_invokeQueue:b,
_runBlocks:c,requires:e,name:d,provider:a("$provide","provider"),factory:a("$provide","factory"),service:a("$provide","service"),value:a("$provide","value"),constant:a("$provide","constant","unshift"),animation:a("$animationProvider","register"),filter:a("$filterProvider","register"),controller:a("$controllerProvider","register"),directive:a("$compileProvider","directive"),config:g,run:function(a){c.push(a);return this}};f&&g(f);return m})}})}function Ja(b){return b.replace(pc,function(a,b,d,e){return e?
d.toUpperCase():d}).replace(qc,"Moz$1")}function fb(b,a){function c(){var e;for(var b=[this],c=a,i,h,j,g,m,k;b.length;){i=b.shift();h=0;for(j=i.length;h<j;h++){g=v(i[h]);c?g.triggerHandler("$destroy"):c=!c;m=0;for(e=(k=g.children()).length,g=e;m<g;m++)b.push(ca(k[m]))}}return d.apply(this,arguments)}var d=ca.fn[b],d=d.$original||d;c.$original=d;ca.fn[b]=c}function P(b){if(b instanceof P)return b;if(!(this instanceof P)){if(x(b)&&b.charAt(0)!="<")throw Error("selectors not implemented");return new P(b)}if(x(b)){var a=
V.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);gb(this,a.childNodes);this.remove()}else gb(this,b)}function hb(b){return b.cloneNode(!0)}function wa(b){xb(b);for(var a=0,b=b.childNodes||[];a<b.length;a++)wa(b[a])}function yb(b,a,c){var d=$(b,"events");$(b,"handle")&&(u(a)?o(d,function(a,c){ib(b,c,a);delete d[c]}):u(c)?(ib(b,a,d[a]),delete d[a]):sa(d[a],c))}function xb(b){var a=b[Ka],c=La[a];c&&(c.handle&&(c.events.$destroy&&c.handle({},"$destroy"),yb(b)),delete La[a],
b[Ka]=s)}function $(b,a,c){var d=b[Ka],d=La[d||-1];if(w(c))d||(b[Ka]=d=++rc,d=La[d]={}),d[a]=c;else return d&&d[a]}function zb(b,a,c){var d=$(b,"data"),e=w(c),f=!e&&w(a),i=f&&!L(a);!d&&!i&&$(b,"data",d={});if(e)d[a]=c;else if(f)if(i)return d&&d[a];else y(d,a);else return d}function Ma(b,a){return(" "+b.className+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" ")>-1}function Ab(b,a){a&&o(a.split(" "),function(a){b.className=S((" "+b.className+" ").replace(/[\n\t]/g," ").replace(" "+S(a)+" "," "))})}function Bb(b,
a){a&&o(a.split(" "),function(a){if(!Ma(b,a))b.className=S(b.className+" "+S(a))})}function gb(b,a){if(a)for(var a=!a.nodeName&&w(a.length)&&!ra(a)?a:[a],c=0;c<a.length;c++)b.push(a[c])}function Cb(b,a){return Na(b,"$"+(a||"ngController")+"Controller")}function Na(b,a,c){b=v(b);for(b[0].nodeType==9&&(b=b.find("html"));b.length;){if(c=b.data(a))return c;b=b.parent()}}function Db(b,a){var c=Oa[a.toLowerCase()];return c&&Eb[b.nodeName]&&c}function sc(b,a){var c=function(c,e){if(!c.preventDefault)c.preventDefault=
function(){c.returnValue=!1};if(!c.stopPropagation)c.stopPropagation=function(){c.cancelBubble=!0};if(!c.target)c.target=c.srcElement||V;if(u(c.defaultPrevented)){var f=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented};o(a[e||c.type],function(a){a.call(b,c)});X<=8?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};
c.elem=b;return c}function la(b){var a=typeof b,c;if(a=="object"&&b!==null)if(typeof(c=b.$$hashKey)=="function")c=b.$$hashKey();else{if(c===s)c=b.$$hashKey=Ea()}else c=b;return a+":"+c}function Pa(b){o(b,this.put,this)}function Fb(b){var a,c;if(typeof b=="function"){if(!(a=b.$inject))a=[],c=b.toString().replace(tc,""),c=c.match(uc),o(c[1].split(vc),function(b){b.replace(wc,function(b,c,d){a.push(d)})}),b.$inject=a}else C(b)?(c=b.length-1,va(b[c],"fn"),a=b.slice(0,c)):va(b,"fn",!0);return a}function wb(b){function a(a){return function(b,
c){if(L(b))o(b,sb(a));else return a(b,c)}}function c(a,b){if(I(b)||C(b))b=k.instantiate(b);if(!b.$get)throw Error("Provider "+a+" must define $get factory method.");return m[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[];o(a,function(a){if(!g.get(a))if(g.put(a,!0),x(a)){var c=xa(a);b=b.concat(e(c.requires)).concat(c._runBlocks);try{for(var d=c._invokeQueue,c=0,h=d.length;c<h;c++){var f=d[c],n=k.get(f[0]);n[f[1]].apply(n,f[2])}}catch(j){throw j.message&&(j.message+=" from "+a),
j;}}else if(I(a))try{b.push(k.invoke(a))}catch(i){throw i.message&&(i.message+=" from "+a),i;}else if(C(a))try{b.push(k.invoke(a))}catch(l){throw l.message&&(l.message+=" from "+String(a[a.length-1])),l;}else va(a,"module")});return b}function f(a,b){function c(d){if(typeof d!=="string")throw Error("Service name expected");if(a.hasOwnProperty(d)){if(a[d]===i)throw Error("Circular dependency: "+j.join(" <- "));return a[d]}else try{return j.unshift(d),a[d]=i,a[d]=b(d)}finally{j.shift()}}function d(a,
b,e){var g=[],h=Fb(a),f,j,n;j=0;for(f=h.length;j<f;j++)n=h[j],g.push(e&&e.hasOwnProperty(n)?e[n]:c(n));a.$inject||(a=a[f]);switch(b?-1:g.length){case 0:return a();case 1:return a(g[0]);case 2:return a(g[0],g[1]);case 3:return a(g[0],g[1],g[2]);case 4:return a(g[0],g[1],g[2],g[3]);case 5:return a(g[0],g[1],g[2],g[3],g[4]);case 6:return a(g[0],g[1],g[2],g[3],g[4],g[5]);case 7:return a(g[0],g[1],g[2],g[3],g[4],g[5],g[6]);case 8:return a(g[0],g[1],g[2],g[3],g[4],g[5],g[6],g[7]);case 9:return a(g[0],g[1],
g[2],g[3],g[4],g[5],g[6],g[7],g[8]);case 10:return a(g[0],g[1],g[2],g[3],g[4],g[5],g[6],g[7],g[8],g[9]);default:return a.apply(b,g)}}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(C(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return L(e)?e:c},get:c,annotate:Fb}}var i={},h="Provider",j=[],g=new Pa,m={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,Q(b))}),
constant:a(function(a,b){m[a]=b;l[a]=b}),decorator:function(a,b){var c=k.get(a+h),d=c.$get;c.$get=function(){var a=q.invoke(d,c);return q.invoke(b,null,{$delegate:a})}}}},k=m.$injector=f(m,function(){throw Error("Unknown provider: "+j.join(" <- "));}),l={},q=l.$injector=f(l,function(a){a=k.get(a+h);return q.invoke(a.$get,a)});o(e(b),function(a){q.invoke(a||t)});return q}function xc(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=
null;o(a,function(a){!b&&J(a.nodeName)==="a"&&(b=a)});return b}function f(){var b=c.hash(),d;b?(d=i.getElementById(b))?d.scrollIntoView():(d=e(i.getElementsByName(b)))?d.scrollIntoView():b==="top"&&a.scrollTo(0,0):a.scrollTo(0,0)}var i=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function Gb(b){this.register=function(a,c){b.factory(Ja(a)+"Animation",c)};this.$get=["$injector",function(a){return function(b){if(b)try{return a.get(Ja(b)+"Animation")}catch(d){}}}]}
function yc(b,a,c,d){function e(a){try{a.apply(null,ka.call(arguments,1))}finally{if(n--,n===0)for(;B.length;)try{B.pop()()}catch(b){c.error(b)}}}function f(a,b){(function z(){o(r,function(a){a()});p=b(z,a)})()}function i(){E!=h.url()&&(E=h.url(),o(G,function(a){a(h.url())}))}var h=this,j=a[0],g=b.location,m=b.history,k=b.setTimeout,l=b.clearTimeout,q={};h.isMock=!1;var n=0,B=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){n++};h.notifyWhenNoOutstandingRequests=function(a){o(r,
function(a){a()});n===0?a():B.push(a)};var r=[],p;h.addPollFn=function(a){u(p)&&f(100,k);r.push(a);return a};var E=g.href,D=a.find("base");h.url=function(a,b){if(a){if(E!=a)return E=a,d.history?b?m.replaceState(null,"",a):(m.pushState(null,"",a),D.attr("href",D.attr("href"))):b?g.replace(a):g.href=a,h}else return g.href.replace(/%27/g,"'")};var G=[],R=!1;h.onUrlChange=function(a){R||(d.history&&v(b).bind("popstate",i),d.hashchange?v(b).bind("hashchange",i):h.addPollFn(i),R=!0);G.push(a);return a};
h.baseHref=function(){var a=D.attr("href");return a?a.replace(/^https?\:\/\/[^\/]*/,""):""};var A={},H="",F=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)if(b===s)j.cookie=escape(a)+"=;path="+F+";expires=Thu, 01 Jan 1970 00:00:00 GMT";else{if(x(b))d=(j.cookie=escape(a)+"="+escape(b)+";path="+F).length+1,d>4096&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!")}else{if(j.cookie!==H){H=j.cookie;d=H.split("; ");A={};for(g=0;g<d.length;g++)e=
d[g],h=e.indexOf("="),h>0&&(A[unescape(e.substring(0,h))]=unescape(e.substring(h+1)))}return A}};h.defer=function(a,b){var c;n++;c=k(function(){delete q[c];e(a)},b||0);q[c]=!0;return c};h.defer.cancel=function(a){return q[a]?(delete q[a],l(a),e(t),!0):!1}}function zc(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new yc(b,d,a,c)}]}function Ac(){this.$get=function(){function b(b,d){function e(a){if(a!=k){if(l){if(l==a)l=a.n}else l=a;f(a.n,a.p);f(a,k);k=a;k.n=null}}function f(a,
b){if(a!=b){if(a)a.p=b;if(b)b.n=a}}if(b in a)throw Error("cacheId "+b+" taken");var i=0,h=y({},d,{id:b}),j={},g=d&&d.capacity||Number.MAX_VALUE,m={},k=null,l=null;return a[b]={put:function(a,b){var c=m[a]||(m[a]={key:a});e(c);if(!u(b))return a in j||i++,j[a]=b,i>g&&this.remove(l.key),b},get:function(a){var b=m[a];if(b)return e(b),j[a]},remove:function(a){var b=m[a];if(b){if(b==k)k=b.p;if(b==l)l=b.n;f(b.n,b.p);delete m[a];delete j[a];i--}},removeAll:function(){j={};i=0;m={};k=l=null},destroy:function(){m=
h=j=null;delete a[b]},info:function(){return y({},h,{size:i})}}}var a={};b.info=function(){var b={};o(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function Bc(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function Hb(b){var a={},c="Directive",d=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,e=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f="Template must have exactly one root element. was: ",i=/^\s*(https?|ftp|mailto|file):/;this.directive=function j(d,e){x(d)?
(eb(e,"directive"),a.hasOwnProperty(d)||(a[d]=[],b.factory(d+c,["$injector","$exceptionHandler",function(b,c){var e=[];o(a[d],function(a){try{var f=b.invoke(a);if(I(f))f={compile:Q(f)};else if(!f.compile&&f.link)f.compile=Q(f.link);f.priority=f.priority||0;f.name=f.name||d;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(j){c(j)}});return e}])),a[d].push(e)):o(d,sb(j));return this};this.urlSanitizationWhitelist=function(a){return w(a)?(i=a,this):i};this.$get=["$injector",
"$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document",function(b,g,m,k,l,q,n,B,r){function p(a,b,c){a instanceof v||(a=v(a));o(a,function(b,c){b.nodeType==3&&b.nodeValue.match(/\S+/)&&(a[c]=v(b).wrap("<span></span>").parent()[0])});var d=D(a,b,a,c);return function(b,c){eb(b,"scope");for(var e=c?za.clone.call(a):a,g=0,f=e.length;g<f;g++){var j=e[g];(j.nodeType==1||j.nodeType==9)&&e.eq(g).data("$scope",b)}E(e,"ng-scope");c&&c(e,b);d&&d(b,e,e);return e}}
function E(a,b){try{a.addClass(b)}catch(c){}}function D(a,b,c,d){function e(a,c,d,f){var j,i,l,m,n,k,q,p=[];n=0;for(k=c.length;n<k;n++)p.push(c[n]);q=n=0;for(k=g.length;n<k;q++)i=p[q],c=g[n++],j=g[n++],c?(c.scope?(l=a.$new(L(c.scope)),v(i).data("$scope",l)):l=a,(m=c.transclude)||!f&&b?c(j,l,i,d,function(b){return function(c){var d=a.$new();d.$$transcluded=!0;return b(d,c).bind("$destroy",ab(d,d.$destroy))}}(m||b)):c(j,l,i,s,f)):j&&j(a,i.childNodes,s,f)}for(var g=[],f,j,i,l=0;l<a.length;l++)j=new ya,
f=G(a[l],[],j,d),j=(f=f.length?R(f,a[l],j,b,c):null)&&f.terminal||!a[l].childNodes||!a[l].childNodes.length?null:D(a[l].childNodes,f?f.transclude:b),g.push(f),g.push(j),i=i||f||j;return i?e:null}function G(a,b,c,g){var f=c.$attr,j;switch(a.nodeType){case 1:A(b,aa(jb(a).toLowerCase()),"E",g);var i,l,n;j=a.attributes;for(var m=0,k=j&&j.length;m<k;m++)if(i=j[m],i.specified)l=i.name,n=aa(l),ha.test(n)&&(l=n.substr(6).toLowerCase()),n=aa(l.toLowerCase()),f[n]=l,c[n]=i=S(X&&l=="href"?decodeURIComponent(a.getAttribute(l,
2)):i.value),Db(a,n)&&(c[n]=!0),z(a,b,i,n),A(b,n,"A",g);a=a.className;if(x(a)&&a!=="")for(;j=e.exec(a);)n=aa(j[2]),A(b,n,"C",g)&&(c[n]=S(j[3])),a=a.substr(j.index+j[0].length);break;case 3:ga(b,a.nodeValue);break;case 8:try{if(j=d.exec(a.nodeValue))n=aa(j[1]),A(b,n,"M",g)&&(c[n]=S(j[2]))}catch(q){}}b.sort(N);return b}function R(a,b,c,d,e){function j(a,b){if(a)a.require=z.require,B.push(a);if(b)b.require=z.require,r.push(b)}function i(a,b){var c,d="data",e=!1;if(x(a)){for(;(c=a.charAt(0))=="^"||c==
"?";)a=a.substr(1),c=="^"&&(d="inheritedData"),e=e||c=="?";c=b[d]("$"+a+"Controller");if(!c&&!e)throw Error("No controller: "+a);}else C(a)&&(c=[],o(a,function(a){c.push(i(a,b))}));return c}function l(a,d,e,f,j){var k,p,D,G,H;k=b===e?c:kc(c,new ya(v(e),c.$attr));p=k.$$element;if(ba){var z=/^\s*([@=&])(\??)\s*(\w*)\s*$/,F=d.$parent||d;o(ba.scope,function(a,b){var c=a.match(z)||[],e=c[3]||b,f=c[2]=="?",c=c[1],j,l,i;d.$$isolateBindings[b]=c+e;switch(c){case "@":k.$observe(e,function(a){d[b]=a});k.$$observers[e].$$scope=
F;k[e]&&(d[b]=g(k[e])(F));break;case "=":if(f&&!k[e])break;l=q(k[e]);i=l.assign||function(){j=d[b]=l(F);throw Error(Ib+k[e]+" (directive: "+ba.name+")");};j=d[b]=l(F);d.$watch(function(){var a=l(F);a!==d[b]&&(a!==j?j=d[b]=a:i(F,a=j=d[b]));return a});break;case "&":l=q(k[e]);d[b]=function(a){return l(F,a)};break;default:throw Error("Invalid isolate scope definition for directive "+ba.name+": "+a);}})}ha&&o(ha,function(a){var b={$scope:d,$element:p,$attrs:k,$transclude:j};H=a.controller;H=="@"&&(H=
k[a.name]);p.data("$"+a.name+"Controller",n(H,b))});f=0;for(D=B.length;f<D;f++)try{G=B[f],G(d,p,k,G.require&&i(G.require,p))}catch(E){m(E,ta(p))}a&&a(d,e.childNodes,s,j);f=0;for(D=r.length;f<D;f++)try{G=r[f],G(d,p,k,G.require&&i(G.require,p))}catch(N){m(N,ta(p))}}for(var k=-Number.MAX_VALUE,B=[],r=[],D=null,ba=null,N=null,A=c.$$element=v(b),z,T,R,ga,ia=d,ha,t,y,w=0,u=a.length;w<u;w++){z=a[w];R=s;if(k>z.priority)break;if(y=z.scope)ea("isolated scope",ba,z,A),L(y)&&(E(A,"ng-isolate-scope"),ba=z),E(A,
"ng-scope"),D=D||z;T=z.name;if(y=z.controller)ha=ha||{},ea("'"+T+"' controller",ha[T],z,A),ha[T]=z;if(y=z.transclude)ea("transclusion",ga,z,A),ga=z,k=z.priority,y=="element"?(R=v(b),A=c.$$element=v(V.createComment(" "+T+": "+c[T]+" ")),b=A[0],fa(e,v(R[0]),b),ia=p(R,d,k)):(R=v(hb(b)).contents(),A.html(""),ia=p(R,d));if(z.template)if(ea("template",N,z,A),N=z,y=I(z.template)?z.template(A,c):z.template,y=Jb(y),z.replace){R=v("<div>"+S(y)+"</div>").contents();b=R[0];if(R.length!=1||b.nodeType!==1)throw Error(f+
y);fa(e,A,b);T={$attr:{}};a=a.concat(G(b,a.splice(w+1,a.length-(w+1)),T));H(c,T);u=a.length}else A.html(y);if(z.templateUrl)ea("template",N,z,A),N=z,l=F(a.splice(w,a.length-w),l,A,c,e,z.replace,ia),u=a.length;else if(z.compile)try{t=z.compile(A,c,ia),I(t)?j(null,t):t&&j(t.pre,t.post)}catch(J){m(J,ta(A))}if(z.terminal)l.terminal=!0,k=Math.max(k,z.priority)}l.scope=D&&D.scope;l.transclude=ga&&ia;return l}function A(d,e,g,f){var l=!1;if(a.hasOwnProperty(e))for(var i,e=b.get(e+c),n=0,k=e.length;n<k;n++)try{if(i=
e[n],(f===s||f>i.priority)&&i.restrict.indexOf(g)!=-1)d.push(i),l=!0}catch(q){m(q)}return l}function H(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;o(a,function(d,e){e.charAt(0)!="$"&&(b[e]&&(d+=(e==="style"?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});o(b,function(b,g){g=="class"?(E(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):g=="style"?e.attr("style",e.attr("style")+";"+b):g.charAt(0)!="$"&&!a.hasOwnProperty(g)&&(a[g]=b,d[g]=c[g])})}function F(a,b,c,d,e,g,j){var i=[],n,m,q=c[0],p=a.shift(),ya=y({},
p,{controller:null,templateUrl:null,transclude:null,scope:null}),p=I(p.templateUrl)?p.templateUrl(c,d):p.templateUrl;c.html("");k.get(p,{cache:l}).success(function(l){var k,p,l=Jb(l);if(g){p=v("<div>"+S(l)+"</div>").contents();k=p[0];if(p.length!=1||k.nodeType!==1)throw Error(f+l);l={$attr:{}};fa(e,c,k);G(k,a,l);H(d,l)}else k=q,c.html(l);a.unshift(ya);n=R(a,k,d,j);for(m=D(c[0].childNodes,j);i.length;){var B=i.shift(),l=i.shift();p=i.shift();var r=i.shift(),F=k;l!==q&&(F=hb(k),fa(p,v(l),F));n(function(){b(m,
B,F,e,r)},B,F,e,r)}i=null}).error(function(a,b,c,d){throw Error("Failed to load template: "+d.url);});return function(a,c,d,e,g){i?(i.push(c),i.push(d),i.push(e),i.push(g)):n(function(){b(m,c,d,e,g)},c,d,e,g)}}function N(a,b){return b.priority-a.priority}function ea(a,b,c,d){if(b)throw Error("Multiple directives ["+b.name+", "+c.name+"] asking for "+a+" on: "+ta(d));}function ga(a,b){var c=g(b,!0);c&&a.push({priority:0,compile:Q(function(a,b){var d=b.parent(),e=d.data("$binding")||[];e.push(c);E(d.data("$binding",
e),"ng-binding");a.$watch(c,function(a){b[0].nodeValue=a})})})}function z(a,b,c,d){var e=g(c,!0);e&&b.push({priority:100,compile:Q(function(a,b,c){b=c.$$observers||(c.$$observers={});if(e=g(c[d],!0))c[d]=e(a),(b[d]||(b[d]=[])).$$inter=!0,(c.$$observers&&c.$$observers[d].$$scope||a).$watch(e,function(a){c.$set(d,a)})})})}function fa(a,b,c){var d=b[0],e=d.parentNode,g,f;if(a){g=0;for(f=a.length;g<f;g++)if(a[g]==d){a[g]=c;break}}e&&e.replaceChild(c,d);c[v.expando]=d[v.expando];b[0]=c}var ya=function(a,
b){this.$$element=a;this.$attr=b||{}};ya.prototype={$normalize:aa,$set:function(a,b,c,d){var e=Db(this.$$element[0],a),g=this.$$observers;e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=db(a,"-"));if(jb(this.$$element[0])==="A"&&a==="href")ba.setAttribute("href",b),e=ba.href,e.match(i)||(this[a]=b="unsafe:"+e);c!==!1&&(b===null||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));g&&o(g[a],function(a){try{a(b)}catch(c){m(c)}})},$observe:function(a,
b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);B.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var ba=r[0].createElement("a"),T=g.startSymbol(),ia=g.endSymbol(),Jb=T=="{{"||ia=="}}"?pa:function(a){return a.replace(/\{\{/g,T).replace(/}}/g,ia)},ha=/^ngAttr[A-Z]/;return p}]}function aa(b){return Ja(b.replace(Cc,""))}function Dc(){var b={};this.register=function(a,c){L(a)?y(b,a):b[a]=c};this.$get=["$injector","$window",function(a,c){return function(d,e){if(x(d)){var f=
d,d=b.hasOwnProperty(f)?b[f]:kb(e.$scope,f,!0)||kb(c,f,!0);va(d,f,!0)}return a.instantiate(d,e)}}]}function Ec(){this.$get=["$window",function(b){return v(b.document)}]}function Fc(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Gc(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler",function(c,d){function e(e,j){for(var g,m,k=0,l=[],q=e.length,n=
!1,B=[];k<q;)(g=e.indexOf(b,k))!=-1&&(m=e.indexOf(a,g+f))!=-1?(k!=g&&l.push(e.substring(k,g)),l.push(k=c(n=e.substring(g+f,m))),k.exp=n,k=m+i,n=!0):(k!=q&&l.push(e.substring(k)),k=q);if(!(q=l.length))l.push(""),q=1;if(!j||n)return B.length=q,k=function(a){try{for(var b=0,c=q,g;b<c;b++){if(typeof(g=l[b])=="function")g=g(a),g==null||g==s?g="":typeof g!="string"&&(g=da(g));B[b]=g}return B.join("")}catch(f){d(Error("Error while interpolating: "+e+"\n"+f.toString()))}},k.exp=e,k.parts=l,k}var f=b.length,
i=a.length;e.startSymbol=function(){return b};e.endSymbol=function(){return a};return e}]}function Kb(b){for(var b=b.split("/"),a=b.length;a--;)b[a]=cb(b[a]);return b.join("/")}function Aa(b,a){var c=lb.exec(b),c={protocol:c[1],host:c[3],port:K(c[5])||Ba[c[1]]||null,path:c[6]||"/",search:c[8],hash:c[10]};if(a)a.$$protocol=c.protocol,a.$$host=c.host,a.$$port=c.port;return c}function ma(b,a,c){return b+"://"+a+(c==Ba[b]?"":":"+c)}function Hc(b,a,c){var d=Aa(b);return decodeURIComponent(d.path)!=a||
u(d.hash)||d.hash.indexOf(c)!==0?b:ma(d.protocol,d.host,d.port)+a.substr(0,a.lastIndexOf("/"))+d.hash.substr(c.length)}function Ic(b,a,c){var d=Aa(b);if(decodeURIComponent(d.path)==a&&!u(d.hash)&&d.hash.indexOf(c)===0)return b;else{var e=d.search&&"?"+d.search||"",f=d.hash&&"#"+d.hash||"",i=a.substr(0,a.lastIndexOf("/")),h=d.path.substr(i.length);if(d.path.indexOf(i)!==0)throw Error('Invalid url "'+b+'", missing path prefix "'+i+'" !');return ma(d.protocol,d.host,d.port)+a+"#"+c+h+e+f}}function mb(b,
a,c){a=a||"";this.$$parse=function(b){var c=Aa(b,this);if(c.path.indexOf(a)!==0)throw Error('Invalid url "'+b+'", missing path prefix "'+a+'" !');this.$$path=decodeURIComponent(c.path.substr(a.length));this.$$search=bb(c.search);this.$$hash=c.hash&&decodeURIComponent(c.hash)||"";this.$$compose()};this.$$compose=function(){var b=ub(this.$$search),c=this.$$hash?"#"+cb(this.$$hash):"";this.$$url=Kb(this.$$path)+(b?"?"+b:"")+c;this.$$absUrl=ma(this.$$protocol,this.$$host,this.$$port)+a+this.$$url};this.$$rewriteAppUrl=
function(a){if(a.indexOf(c)==0)return a};this.$$parse(b)}function Qa(b,a,c){var d;this.$$parse=function(b){var c=Aa(b,this);if(c.hash&&c.hash.indexOf(a)!==0)throw Error('Invalid url "'+b+'", missing hash prefix "'+a+'" !');d=c.path+(c.search?"?"+c.search:"");c=Jc.exec((c.hash||"").substr(a.length));this.$$path=c[1]?(c[1].charAt(0)=="/"?"":"/")+decodeURIComponent(c[1]):"";this.$$search=bb(c[3]);this.$$hash=c[5]&&decodeURIComponent(c[5])||"";this.$$compose()};this.$$compose=function(){var b=ub(this.$$search),
c=this.$$hash?"#"+cb(this.$$hash):"";this.$$url=Kb(this.$$path)+(b?"?"+b:"")+c;this.$$absUrl=ma(this.$$protocol,this.$$host,this.$$port)+d+(this.$$url?"#"+a+this.$$url:"")};this.$$rewriteAppUrl=function(a){if(a.indexOf(c)==0)return a};this.$$parse(b)}function Lb(b,a,c,d){Qa.apply(this,arguments);this.$$rewriteAppUrl=function(b){if(b.indexOf(c)==0)return c+d+"#"+a+b.substr(c.length)}}function Ra(b){return function(){return this[b]}}function Mb(b,a){return function(c){if(u(c))return this[b];this[b]=
a(c);this.$$compose();return this}}function Kc(){var b="",a=!1;this.hashPrefix=function(a){return w(a)?(b=a,this):b};this.html5Mode=function(b){return w(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function i(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,j,g,m=d.url(),k=Aa(m);a?(j=d.baseHref()||"/",g=j.substr(0,j.lastIndexOf("/")),k=ma(k.protocol,k.host,k.port)+g+"/",h=e.history?new mb(Hc(m,j,b),g,k):new Lb(Ic(m,j,b),b,k,j.substr(g.length+
1))):(k=ma(k.protocol,k.host,k.port)+(k.path||"")+(k.search?"?"+k.search:"")+"#"+b+"/",h=new Qa(m,b,k));f.bind("click",function(a){if(!a.ctrlKey&&!(a.metaKey||a.which==2)){for(var b=v(a.target);J(b[0].nodeName)!=="a";)if(b[0]===f[0]||!(b=b.parent())[0])return;var d=b.prop("href"),e=h.$$rewriteAppUrl(d);d&&!b.attr("target")&&e&&(h.$$parse(e),c.$apply(),a.preventDefault(),M.angular["ff-684208-preventDefault"]=!0)}});h.absUrl()!=m&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=
h.absUrl();h.$$parse(a);i(b)}),c.$$phase||c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;if(!l||a!=h.absUrl())l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),i(a))});h.$$replace=!1;return l});return h}]}function Lc(){var b=!0,a=this;this.debugEnabled=function(a){return w(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&a.stack.indexOf(a.message)===
-1?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||t;return e.apply?function(){var a=[];o(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,b)}}return{log:e("log"),warn:e("warn"),info:e("info"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function Mc(b,a){function c(a){return a.indexOf(r)!=-1}function d(a){a=a||
1;return n+a<b.length?b.charAt(n+a):!1}function e(a){return"0"<=a&&a<="9"}function f(a){return a==" "||a=="\r"||a=="\t"||a=="\n"||a=="\u000b"||a=="\u00a0"}function i(a){return"a"<=a&&a<="z"||"A"<=a&&a<="Z"||"_"==a||a=="$"}function h(a){return a=="-"||a=="+"||e(a)}function j(a,c,d){d=d||n;throw Error("Lexer Error: "+a+" at column"+(w(c)?"s "+c+"-"+n+" ["+b.substring(c,d)+"]":" "+d)+" in expression ["+b+"].");}function g(){for(var a="",c=n;n<b.length;){var g=J(b.charAt(n));if(g=="."||e(g))a+=g;else{var f=
d();if(g=="e"&&h(f))a+=g;else if(h(g)&&f&&e(f)&&a.charAt(a.length-1)=="e")a+=g;else if(h(g)&&(!f||!e(f))&&a.charAt(a.length-1)=="e")j("Invalid exponent");else break}n++}a*=1;l.push({index:c,text:a,json:!0,fn:function(){return a}})}function m(){for(var c="",d=n,g,h,j;n<b.length;){var k=b.charAt(n);if(k=="."||i(k)||e(k))k=="."&&(g=n),c+=k;else break;n++}if(g)for(h=n;h<b.length;){k=b.charAt(h);if(k=="("){j=c.substr(g-d+1);c=c.substr(0,g-d);n=h;break}if(f(k))h++;else break}d={index:d,text:c};if(Ca.hasOwnProperty(c))d.fn=
d.json=Ca[c];else{var m=Nb(c,a);d.fn=y(function(a,b){return m(a,b)},{assign:function(a,b){return Ob(a,c,b)}})}l.push(d);j&&(l.push({index:g,text:".",json:!1}),l.push({index:g+1,text:j,json:!1}))}function k(a){var c=n;n++;for(var d="",e=a,g=!1;n<b.length;){var h=b.charAt(n);e+=h;if(g)h=="u"?(h=b.substring(n+1,n+5),h.match(/[\da-f]{4}/i)||j("Invalid unicode escape [\\u"+h+"]"),n+=4,d+=String.fromCharCode(parseInt(h,16))):(g=Nc[h],d+=g?g:h),g=!1;else if(h=="\\")g=!0;else if(h==a){n++;l.push({index:c,
text:e,string:d,json:!0,fn:function(){return d}});return}else d+=h;n++}j("Unterminated quote",c)}for(var l=[],q,n=0,B=[],r,p=":";n<b.length;){r=b.charAt(n);if(c("\"'"))k(r);else if(e(r)||c(".")&&e(d()))g();else if(i(r)){if(m(),"{,".indexOf(p)!=-1&&B[0]=="{"&&(q=l[l.length-1]))q.json=q.text.indexOf(".")==-1}else if(c("(){}[].,;:"))l.push({index:n,text:r,json:":[,".indexOf(p)!=-1&&c("{[")||c("}]:,")}),c("{[")&&B.unshift(r),c("}]")&&B.shift(),n++;else if(f(r)){n++;continue}else{var E=r+d(),D=E+d(2),
G=Ca[r],o=Ca[E],A=Ca[D];A?(l.push({index:n,text:D,fn:A}),n+=3):o?(l.push({index:n,text:E,fn:o}),n+=2):G?(l.push({index:n,text:r,fn:G,json:"[,:".indexOf(p)!=-1&&c("+-")}),n+=1):j("Unexpected next character ",n,n+1)}p=r}return l}function Oc(b,a,c,d){function e(a,c){throw Error("Syntax Error: Token '"+c.text+"' "+a+" at column "+(c.index+1)+" of the expression ["+b+"] starting at ["+b.substring(c.index)+"].");}function f(){if(F.length===0)throw Error("Unexpected end of expression: "+b);return F[0]}function i(a,
b,c,d){if(F.length>0){var e=F[0],g=e.text;if(g==a||g==b||g==c||g==d||!a&&!b&&!c&&!d)return e}return!1}function h(b,c,d,g){return(b=i(b,c,d,g))?(a&&!b.json&&e("is not valid json",b),F.shift(),b):!1}function j(a){h(a)||e("is unexpected, expecting ["+a+"]",i())}function g(a,b){return y(function(c,d){return a(c,d,b)},{constant:b.constant})}function m(a,b,c){return y(function(d,e){return b(d,e,a,c)},{constant:a.constant&&c.constant})}function k(){for(var a=[];;)if(F.length>0&&!i("}",")",";","]")&&a.push(fa()),
!h(";"))return a.length==1?a[0]:function(b,c){for(var d,e=0;e<a.length;e++){var g=a[e];g&&(d=g(b,c))}return d}}function l(){for(var a=h(),b=c(a.text),d=[];;)if(a=h(":"))d.push(N());else{var e=function(a,c,e){for(var e=[e],g=0;g<d.length;g++)e.push(d[g](a,c));return b.apply(a,e)};return function(){return e}}}function q(){for(var a=n(),b;;)if(b=h("||"))a=m(a,b.fn,n());else return a}function n(){var a=B(),b;if(b=h("&&"))a=m(a,b.fn,n());return a}function B(){var a=r(),b;if(b=h("==","!=","===","!=="))a=
m(a,b.fn,B());return a}function r(){var a;a=p();for(var b;b=h("+","-");)a=m(a,b.fn,p());if(b=h("<",">","<=",">="))a=m(a,b.fn,r());return a}function p(){for(var a=E(),b;b=h("*","/","%");)a=m(a,b.fn,E());return a}function E(){var a;return h("+")?D():(a=h("-"))?m(A,a.fn,E()):(a=h("!"))?g(a.fn,E()):D()}function D(){var a;if(h("("))a=fa(),j(")");else if(h("["))a=G();else if(h("{"))a=o();else{var b=h();(a=b.fn)||e("not a primary expression",b);if(b.json)a.constant=a.literal=!0}for(var c;b=h("(","[",".");)b.text===
"("?(a=ea(a,c),c=null):b.text==="["?(c=a,a=z(a)):b.text==="."?(c=a,a=ga(a)):e("IMPOSSIBLE");return a}function G(){var a=[],b=!0;if(f().text!="]"){do{var c=N();a.push(c);c.constant||(b=!1)}while(h(","))}j("]");return y(function(b,c){for(var d=[],e=0;e<a.length;e++)d.push(a[e](b,c));return d},{literal:!0,constant:b})}function o(){var a=[],b=!0;if(f().text!="}"){do{var c=h(),c=c.string||c.text;j(":");var d=N();a.push({key:c,value:d});d.constant||(b=!1)}while(h(","))}j("}");return y(function(b,c){for(var d=
{},e=0;e<a.length;e++){var g=a[e],h=g.value(b,c);d[g.key]=h}return d},{literal:!0,constant:b})}var A=Q(0),H,F=Mc(b,d),N=function(){var a=q(),c,d;return(d=h("="))?(a.assign||e("implies assignment but ["+b.substring(0,d.index)+"] can not be assigned to",d),c=q(),function(b,d){return a.assign(b,c(b,d),d)}):a},ea=function(a,b){var c=[];if(f().text!=")"){do c.push(N());while(h(","))}j(")");return function(d,e){for(var g=[],h=b?b(d,e):d,f=0;f<c.length;f++)g.push(c[f](d,e));f=a(d,e)||t;return f.apply?f.apply(h,
g):f(g[0],g[1],g[2],g[3],g[4])}},ga=function(a){var b=h().text,c=Nb(b,d);return y(function(b,d){return c(a(b,d),d)},{assign:function(c,d,e){return Ob(a(c,e),b,d)}})},z=function(a){var b=N();j("]");return y(function(c,d){var e=a(c,d),g=b(c,d),h;if(!e)return s;if((e=e[g])&&e.then){h=e;if(!("$$v"in e))h.$$v=s,h.then(function(a){h.$$v=a});e=e.$$v}return e},{assign:function(c,d,e){return a(c,e)[b(c,e)]=d}})},fa=function(){for(var a=N(),b;;)if(b=h("|"))a=m(a,b.fn,l());else return a};a?(N=q,ea=ga=z=fa=function(){e("is not valid json",
{text:b,index:0})},H=D()):H=k();F.length!==0&&e("is an unexpected token",F[0]);H.literal=!!H.literal;H.constant=!!H.constant;return H}function Ob(b,a,c){for(var a=a.split("."),d=0;a.length>1;d++){var e=a.shift(),f=b[e];f||(f={},b[e]=f);b=f}return b[a.shift()]=c}function kb(b,a,c){if(!a)return b;for(var a=a.split("."),d,e=b,f=a.length,i=0;i<f;i++)d=a[i],b&&(b=(e=b)[d]);return!c&&I(b)?ab(e,b):b}function Pb(b,a,c,d,e){return function(f,i){var h=i&&i.hasOwnProperty(b)?i:f,j;if(h===null||h===s)return h;
if((h=h[b])&&h.then){if(!("$$v"in h))j=h,j.$$v=s,j.then(function(a){j.$$v=a});h=h.$$v}if(!a||h===null||h===s)return h;if((h=h[a])&&h.then){if(!("$$v"in h))j=h,j.$$v=s,j.then(function(a){j.$$v=a});h=h.$$v}if(!c||h===null||h===s)return h;if((h=h[c])&&h.then){if(!("$$v"in h))j=h,j.$$v=s,j.then(function(a){j.$$v=a});h=h.$$v}if(!d||h===null||h===s)return h;if((h=h[d])&&h.then){if(!("$$v"in h))j=h,j.$$v=s,j.then(function(a){j.$$v=a});h=h.$$v}if(!e||h===null||h===s)return h;if((h=h[e])&&h.then){if(!("$$v"in
h))j=h,j.$$v=s,j.then(function(a){j.$$v=a});h=h.$$v}return h}}function Nb(b,a){if(nb.hasOwnProperty(b))return nb[b];var c=b.split("."),d=c.length,e;if(a)e=d<6?Pb(c[0],c[1],c[2],c[3],c[4]):function(a,b){var e=0,g;do g=Pb(c[e++],c[e++],c[e++],c[e++],c[e++])(a,b),b=s,a=g;while(e<d);return g};else{var f="var l, fn, p;\n";o(c,function(a,b){f+="if(s === null || s === undefined) return s;\nl=s;\ns="+(b?"s":'((k&&k.hasOwnProperty("'+a+'"))?k:s)')+'["'+a+'"];\nif (s && s.then) {\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n'});
f+="return s;";e=Function("s","k",f);e.toString=function(){return f}}return nb[b]=e}function Pc(){var b={};this.$get=["$filter","$sniffer",function(a,c){return function(d){switch(typeof d){case "string":return b.hasOwnProperty(d)?b[d]:b[d]=Oc(d,!1,a,c.csp);case "function":return d;default:return t}}}]}function Qc(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Rc(function(a){b.$evalAsync(a)},a)}]}function Rc(b,a){function c(a){return a}function d(a){return i(a)}var e=function(){var h=
[],j,g;return g={resolve:function(a){if(h){var c=h;h=s;j=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],j.then(a[0],a[1])})}},reject:function(a){g.resolve(i(a))},promise:{then:function(b,g){var f=e(),i=function(d){try{f.resolve((b||c)(d))}catch(e){a(e),f.reject(e)}},n=function(b){try{f.resolve((g||d)(b))}catch(c){a(c),f.reject(c)}};h?h.push([i,n]):j.then(i,n);return f.promise}}}},f=function(a){return a&&a.then?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},
i=function(a){return{then:function(c,g){var f=e();b(function(){f.resolve((g||d)(a))});return f.promise}}};return{defer:e,reject:i,when:function(h,j,g){var m=e(),k,l=function(b){try{return(j||c)(b)}catch(d){return a(d),i(d)}},q=function(b){try{return(g||d)(b)}catch(c){return a(c),i(c)}};b(function(){f(h).then(function(a){k||(k=!0,m.resolve(f(a).then(l,q)))},function(a){k||(k=!0,m.resolve(q(a)))})});return m.promise},all:function(a){var b=e(),c=0,d=C(a)?[]:{};o(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||
(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});c===0&&b.resolve(d);return b.promise}}}function Sc(){var b={};this.when=function(a,c){b[a]=y({reloadOnSearch:!0,caseInsensitiveMatch:!1},c);if(a){var d=a[a.length-1]=="/"?a.substr(0,a.length-1):a+"/";b[d]={redirectTo:a}}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache",function(a,c,d,e,f,i,h){function j(a,b,c){for(var b=
"^"+b.replace(/[-\/\\^$:*+?.()|[\]{}]/g,"\\$&")+"$",d="",e=[],g={},f=/\\([:*])(\w+)/g,h,j=0;(h=f.exec(b))!==null;){d+=b.slice(j,h.index);switch(h[1]){case ":":d+="([^\\/]*)";break;case "*":d+="(.*)"}e.push(h[2]);j=f.lastIndex}d+=b.substr(j);var i=a.match(RegExp(d,c.caseInsensitiveMatch?"i":""));i&&o(e,function(a,b){g[a]=i[b+1]});return i?g:null}function g(){var b=m(),g=q.current;if(b&&g&&b.$$route===g.$$route&&ja(b.pathParams,g.pathParams)&&!b.reloadOnSearch&&!l)g.params=b.params,W(g.params,d),a.$broadcast("$routeUpdate",
g);else if(b||g)l=!1,a.$broadcast("$routeChangeStart",b,g),(q.current=b)&&b.redirectTo&&(x(b.redirectTo)?c.path(k(b.redirectTo,b.params)).search(b.params).replace():c.url(b.redirectTo(b.pathParams,c.path(),c.search())).replace()),e.when(b).then(function(){if(b){var a=y({},b.resolve),c;o(a,function(b,c){a[c]=x(b)?f.get(b):f.invoke(b)});if(w(c=b.template))I(c)&&(c=c(b.params));else if(w(c=b.templateUrl))if(I(c)&&(c=c(b.params)),w(c))b.loadedTemplateUrl=c,c=i.get(c,{cache:h}).then(function(a){return a.data});
w(c)&&(a.$template=c);return e.all(a)}}).then(function(c){if(b==q.current){if(b)b.locals=c,W(b.params,d);a.$broadcast("$routeChangeSuccess",b,g)}},function(c){b==q.current&&a.$broadcast("$routeChangeError",b,g,c)})}function m(){var a,d;o(b,function(b,e){if(!d&&(a=j(c.path(),e,b)))d=Fa(b,{params:y({},c.search(),a),pathParams:a}),d.$$route=b});return d||b[null]&&Fa(b[null],{params:{},pathParams:{}})}function k(a,b){var c=[];o((a||"").split(":"),function(a,d){if(d==0)c.push(a);else{var e=a.match(/(\w+)(.*)/),
g=e[1];c.push(b[g]);c.push(e[2]||"");delete b[g]}});return c.join("")}var l=!1,q={routes:b,reload:function(){l=!0;a.$evalAsync(g)}};a.$on("$locationChangeSuccess",g);return q}]}function Tc(){this.$get=Q({})}function Uc(){var b=10;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse",function(a,c,d){function e(){this.$id=Ea();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;
this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$listeners={};this.$$isolateBindings={}}function f(a){if(j.$$phase)throw Error(j.$$phase+" already in progress");j.$$phase=a}function i(a,b){var c=d(a);va(c,b);return c}function h(){}e.prototype={$new:function(a){if(I(a))throw Error("API-CHANGE: Use $controller to instantiate controllers.");a?(a=new e,a.$root=this.$root):(a=function(){},a.prototype=this,a=new a,a.$id=Ea());a["this"]=a;a.$$listeners={};a.$parent=this;a.$$watchers=
a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,c){var d=i(a,"watch"),e=this.$$watchers,f={fn:b,last:h,get:d,exp:a,eq:!!c};if(!I(b)){var j=i(b||t,"listener");f.fn=function(a,b,c){j(c)}}if(typeof a=="string"&&d.constant){var r=f.fn;f.fn=function(a,b,c){r.call(this,a,b,c);sa(e,f)}}if(!e)e=this.$$watchers=[];e.unshift(f);return function(){sa(e,
f)}},$watchCollection:function(a,b){var c=this,e,f,h=0,j=d(a),i=[],p={},o=0;return this.$watch(function(){f=j(c);var a,b;if(L(f))if(C(f)){if(e!==i)e=i,o=e.length=0,h++;a=f.length;if(o!==a)h++,e.length=o=a;for(b=0;b<a;b++)e[b]!==f[b]&&(h++,e[b]=f[b])}else{e!==p&&(e=p={},o=0,h++);a=0;for(b in f)f.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==f[b]&&(h++,e[b]=f[b]):(o++,e[b]=f[b],h++));if(o>a)for(b in h++,e)e.hasOwnProperty(b)&&!f.hasOwnProperty(b)&&(o--,delete e[b])}else e!==f&&(e=f,h++);return h},
function(){b(f,e,c)})},$digest:function(){var a,d,e,i,q=this.$$asyncQueue,n,o,r=b,p,E=[],D,G;f("$digest");do{o=!1;for(p=this;q.length;)try{p.$eval(q.shift())}catch(s){c(s)}do{if(i=p.$$watchers)for(n=i.length;n--;)try{if(a=i[n],(d=a.get(p))!==(e=a.last)&&!(a.eq?ja(d,e):typeof d=="number"&&typeof e=="number"&&isNaN(d)&&isNaN(e)))o=!0,a.last=a.eq?W(d):d,a.fn(d,e===h?d:e,p),r<5&&(D=4-r,E[D]||(E[D]=[]),G=I(a.exp)?"fn: "+(a.exp.name||a.exp.toString()):a.exp,G+="; newVal: "+da(d)+"; oldVal: "+da(e),E[D].push(G))}catch(A){c(A)}if(!(i=
p.$$childHead||p!==this&&p.$$nextSibling))for(;p!==this&&!(i=p.$$nextSibling);)p=p.$parent}while(p=i);if(o&&!r--)throw j.$$phase=null,Error(b+" $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: "+da(E));}while(o||q.length);j.$$phase=null},$destroy:function(){if(!(j==this||this.$$destroyed)){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;if(a.$$childHead==this)a.$$childHead=this.$$nextSibling;if(a.$$childTail==this)a.$$childTail=this.$$prevSibling;
if(this.$$prevSibling)this.$$prevSibling.$$nextSibling=this.$$nextSibling;if(this.$$nextSibling)this.$$nextSibling.$$prevSibling=this.$$prevSibling;this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null}},$eval:function(a,b){return d(a)(this,b)},$evalAsync:function(a){this.$$asyncQueue.push(a)},$apply:function(a){try{return f("$apply"),this.$eval(a)}catch(b){c(b)}finally{j.$$phase=null;try{j.$digest()}catch(d){throw c(d),d;}}},$on:function(a,b){var c=this.$$listeners[a];
c||(this.$$listeners[a]=c=[]);c.push(b);return function(){c[Ga(c,b)]=null}},$emit:function(a,b){var d=[],e,f=this,h=!1,i={name:a,targetScope:f,stopPropagation:function(){h=!0},preventDefault:function(){i.defaultPrevented=!0},defaultPrevented:!1},j=[i].concat(ka.call(arguments,1)),p,o;do{e=f.$$listeners[a]||d;i.currentScope=f;p=0;for(o=e.length;p<o;p++)if(e[p])try{if(e[p].apply(null,j),h)return i}catch(D){c(D)}else e.splice(p,1),p--,o--;f=f.$parent}while(f);return i},$broadcast:function(a,b){var d=
this,e=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},h=[f].concat(ka.call(arguments,1)),i,j;do{d=e;f.currentScope=d;e=d.$$listeners[a]||[];i=0;for(j=e.length;i<j;i++)if(e[i])try{e[i].apply(null,h)}catch(p){c(p)}else e.splice(i,1),i--,j--;if(!(e=d.$$childHead||d!==this&&d.$$nextSibling))for(;d!==this&&!(e=d.$$nextSibling);)d=d.$parent}while(d=e);return f}};var j=new e;return j}]}function Vc(){this.$get=["$window","$document",function(b,a){var c=
{},d=K((/android (\d+)/.exec(J((b.navigator||{}).userAgent))||[])[1]),e=a[0]||{},f,i=/^(Moz|webkit|O|ms)(?=[A-Z])/,h=e.body&&e.body.style,j=!1;if(h){for(var g in h)if(j=i.exec(g)){f=j[0];f=f.substr(0,1).toUpperCase()+f.substr(1);break}j=!!(f+"Transition"in h)}return{history:!(!b.history||!b.history.pushState||d<4),hashchange:"onhashchange"in b&&(!e.documentMode||e.documentMode>7),hasEvent:function(a){if(a=="input"&&X==9)return!1;if(u(c[a])){var b=e.createElement("div");c[a]="on"+a in b}return c[a]},
csp:e.securityPolicy?e.securityPolicy.isActive:!1,vendorPrefix:f,supportsTransitions:j}}]}function Wc(){this.$get=Q(M)}function Qb(b){var a={},c,d,e;if(!b)return a;o(b.split("\n"),function(b){e=b.indexOf(":");c=J(S(b.substr(0,e)));d=S(b.substr(e+1));c&&(a[c]?a[c]+=", "+d:a[c]=d)});return a}function Xc(b,a){var c=Yc.exec(b);if(c==null)return!0;var d={protocol:c[2],host:c[4],port:K(c[6])||Ba[c[2]]||null,relativeProtocol:c[2]===s||c[2]===""},c=lb.exec(a),c={protocol:c[1],host:c[3],port:K(c[5])||Ba[c[1]]||
null};return(d.protocol==c.protocol||d.relativeProtocol)&&d.host==c.host&&(d.port==c.port||d.relativeProtocol&&c.port==Ba[c.protocol])}function Rb(b){var a=L(b)?b:s;return function(c){a||(a=Qb(b));return c?a[J(c)]||null:a}}function Sb(b,a,c){if(I(c))return c(b,a);o(c,function(c){b=c(b,a)});return b}function Zc(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d=this.defaults={transformResponse:[function(d){x(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=tb(d,!0)));return d}],transformRequest:[function(a){return L(a)&&
Da.apply(a)!=="[object File]"?da(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:{"Content-Type":"application/json;charset=utf-8"},put:{"Content-Type":"application/json;charset=utf-8"}},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},e=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,g,m,k){function l(a){function c(a){var b=y({},a,{data:Sb(a.data,a.headers,e.transformResponse)});
return 200<=a.status&&a.status<300?b:m.reject(b)}var e={transformRequest:d.transformRequest,transformResponse:d.transformResponse},g={};y(e,a);e.headers=g;e.method=na(e.method);y(g,d.headers.common,d.headers[J(e.method)],a.headers);(a=Xc(e.url,b.url())?b.cookies()[e.xsrfCookieName||d.xsrfCookieName]:s)&&(g[e.xsrfHeaderName||d.xsrfHeaderName]=a);var f=[function(a){var b=Sb(a.data,Rb(g),a.transformRequest);u(a.data)&&delete g["Content-Type"];if(u(a.withCredentials)&&!u(d.withCredentials))a.withCredentials=
d.withCredentials;return q(a,b,g).then(c,c)},s],j=m.when(e);for(o(r,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;)var a=f.shift(),i=f.shift(),j=j.then(a,i);j.success=function(a){j.then(function(b){a(b.data,b.status,b.headers,e)});return j};j.error=function(a){j.then(null,function(b){a(b.data,b.status,b.headers,e)});return j};return j}function q(b,c,e){function f(a,b,c){o&&(200<=a&&a<300?o.put(s,
[a,b,Qb(c)]):o.remove(s));h(b,a,c);g.$apply()}function h(a,c,d){c=Math.max(c,0);(200<=c&&c<300?k.resolve:k.reject)({data:a,status:c,headers:Rb(d),config:b})}function j(){var a=Ga(l.pendingRequests,b);a!==-1&&l.pendingRequests.splice(a,1)}var k=m.defer(),q=k.promise,o,r,s=n(b.url,b.params);l.pendingRequests.push(b);q.then(j,j);if((b.cache||d.cache)&&b.cache!==!1&&b.method=="GET")o=L(b.cache)?b.cache:L(d.cache)?d.cache:B;if(o)if(r=o.get(s))if(r.then)return r.then(j,j),r;else C(r)?h(r[1],r[0],W(r[2])):
h(r,200,{});else o.put(s,q);r||a(b.method,s,c,f,e,b.timeout,b.withCredentials,b.responseType);return q}function n(a,b){if(!b)return a;var c=[];ic(b,function(a,b){a==null||a==s||(C(a)||(a=[a]),o(a,function(a){L(a)&&(a=da(a));c.push(ua(b)+"="+ua(a))}))});return a+(a.indexOf("?")==-1?"?":"&")+c.join("&")}var B=c("$http"),r=[];o(e,function(a){r.unshift(x(a)?k.get(a):k.invoke(a))});o(f,function(a,b){var c=x(a)?k.get(a):k.invoke(a);r.splice(b,0,{response:function(a){return c(m.when(a))},responseError:function(a){return c(m.reject(a))}})});
l.pendingRequests=[];(function(a){o(arguments,function(a){l[a]=function(b,c){return l(y(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){o(arguments,function(a){l[a]=function(b,c,d){return l(y(d||{},{method:a,url:b,data:c}))}})})("post","put");l.defaults=d;return l}]}function $c(){this.$get=["$browser","$window","$document",function(b,a,c){return ad(b,bd,b.defer,a.angular.callbacks,c[0],a.location.protocol.replace(":",""))}]}function ad(b,a,c,d,e,f){function i(a,b){var c=
e.createElement("script"),d=function(){e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;X?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=d;e.body.appendChild(c)}return function(e,j,g,m,k,l,q,n){function B(a,c,d,e){c=(j.match(lb)||["",f])[1]=="file"?d?200:404:c;a(c==1223?204:c,d,e);b.$$completeOutstandingRequest(t)}b.$$incOutstandingRequestCount();j=j||b.url();if(J(e)=="jsonp"){var r="_"+(d.counter++).toString(36);d[r]=function(a){d[r].data=
a};i(j.replace("JSON_CALLBACK","angular.callbacks."+r),function(){d[r].data?B(m,200,d[r].data):B(m,-2);delete d[r]})}else{var p=new a;p.open(e,j,!0);o(k,function(a,b){a&&p.setRequestHeader(b,a)});var s;p.onreadystatechange=function(){if(p.readyState==4){var a=p.getAllResponseHeaders(),b=["Cache-Control","Content-Language","Content-Type","Expires","Last-Modified","Pragma"];a||(a="",o(b,function(b){var c=p.getResponseHeader(b);c&&(a+=b+": "+c+"\n")}));B(m,s||p.status,p.responseType?p.response:p.responseText,
a)}};if(q)p.withCredentials=!0;if(n)p.responseType=n;p.send(g||"");l>0&&c(function(){s=-1;p.abort()},l)}}}function cd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),
SHORTMONTH:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),DAY:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),SHORTDAY:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return b===1?"one":"other"}}}}function dd(){this.$get=["$rootScope","$browser","$q",
"$exceptionHandler",function(b,a,c,d){function e(e,h,j){var g=c.defer(),m=g.promise,k=w(j)&&!j,h=a.defer(function(){try{g.resolve(e())}catch(a){g.reject(a),d(a)}k||b.$apply()},h),j=function(){delete f[m.$$timeoutId]};m.$$timeoutId=h;f[h]=g;m.then(j,j);return m}var f={};e.cancel=function(b){return b&&b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),a.defer.cancel(b.$$timeoutId)):!1};return e}]}function Tb(b){function a(a,e){return b.factory(a+c,e)}var c="Filter";this.register=a;this.$get=["$injector",
function(a){return function(b){return a.get(b+c)}}];a("currency",Ub);a("date",Vb);a("filter",ed);a("json",fd);a("limitTo",gd);a("lowercase",hd);a("number",Wb);a("orderBy",Xb);a("uppercase",id)}function ed(){return function(b,a,c){if(!C(b))return b;var d=[];d.check=function(a){for(var b=0;b<d.length;b++)if(!d[b](a))return!1;return!0};switch(typeof c){case "function":break;case "boolean":if(c==!0){c=function(a,b){return Ia.equals(a,b)};break}default:c=function(a,b){b=(""+b).toLowerCase();return(""+
a).toLowerCase().indexOf(b)>-1}}var e=function(a,b){if(typeof b=="string"&&b.charAt(0)==="!")return!e(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if(d.charAt(0)!=="$"&&e(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(e(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)f==
"$"?function(){if(a[f]){var b=f;d.push(function(c){return e(c,a[b])})}}():function(){if(a[f]){var b=f;d.push(function(c){return e(kb(c,b),a[b])})}}();break;case "function":d.push(a);break;default:return b}for(var i=[],h=0;h<b.length;h++){var j=b[h];d.check(j)&&i.push(j)}return i}}function Ub(b){var a=b.NUMBER_FORMATS;return function(b,d){if(u(d))d=a.CURRENCY_SYM;return Yb(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Wb(b){var a=b.NUMBER_FORMATS;return function(b,d){return Yb(b,
a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Yb(b,a,c,d,e){if(isNaN(b)||!isFinite(b))return"";var f=b<0,b=Math.abs(b),i=b+"",h="",j=[],g=!1;if(i.indexOf("e")!==-1){var m=i.match(/([\d\.]+)e(-?)(\d+)/);m&&m[2]=="-"&&m[3]>e+1?i="0":(h=i,g=!0)}if(!g){i=(i.split(Zb)[1]||"").length;u(e)&&(e=Math.min(Math.max(a.minFrac,i),a.maxFrac));var i=Math.pow(10,e),b=Math.round(b*i)/i,b=(""+b).split(Zb),i=b[0],b=b[1]||"",g=0,m=a.lgSize,k=a.gSize;if(i.length>=m+k)for(var g=i.length-m,l=0;l<g;l++)(g-l)%k===
0&&l!==0&&(h+=c),h+=i.charAt(l);for(l=g;l<i.length;l++)(i.length-l)%m===0&&l!==0&&(h+=c),h+=i.charAt(l);for(;b.length<e;)b+="0";e&&e!=="0"&&(h+=d+b.substr(0,e))}j.push(f?a.negPre:a.posPre);j.push(h);j.push(f?a.negSuf:a.posSuf);return j.join("")}function ob(b,a,c){var d="";b<0&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function O(b,a,c,d){return function(e){e=e["get"+b]();if(c>0||e>-c)e+=c;e===0&&c==-12&&(e=12);return ob(e,a,d)}}function Sa(b,a){return function(c,
d){var e=c["get"+b](),f=na(a?"SHORT"+b:b);return d[f][e]}}function Vb(b){function a(a){var b;if(b=a.match(c)){var a=new Date(0),f=0,i=0,h=b[8]?a.setUTCFullYear:a.setFullYear,j=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=K(b[9]+b[10]),i=K(b[9]+b[11]));h.call(a,K(b[1]),K(b[2])-1,K(b[3]));j.call(a,K(b[4]||0)-f,K(b[5]||0)-i,K(b[6]||0),K(b[7]||0))}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var f="",i=[],h,j,e=e||
"mediumDate",e=b.DATETIME_FORMATS[e]||e;x(c)&&(c=jd.test(c)?K(c):a(c));Za(c)&&(c=new Date(c));if(!qa(c))return c;for(;e;)(j=kd.exec(e))?(i=i.concat(ka.call(j,1)),e=i.pop()):(i.push(e),e=null);o(i,function(a){h=ld[a];f+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function fd(){return function(b){return da(b,!0)}}function gd(){return function(b,a){if(!C(b)&&!x(b))return b;a=K(a);if(x(b))return a?a>=0?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=
b.length:a<-b.length&&(a=-b.length);a>0?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Xb(b){return function(a,c,d){function e(a,b){return Ha(b)?function(b,c){return a(c,b)}:a}if(!C(a))return a;if(!c)return a;for(var c=C(c)?c:[c],c=$a(c,function(a){var c=!1,d=a||pa;if(x(a)){if(a.charAt(0)=="+"||a.charAt(0)=="-")c=a.charAt(0)=="-",a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),f=typeof c,h=typeof e;f==h?(f=="string"&&(c=c.toLowerCase()),f==
"string"&&(e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=f<h?-1:1;return c},c)}),f=[],i=0;i<a.length;i++)f.push(a[i]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(e!==0)return e}return 0},d))}}function Y(b){I(b)&&(b={link:b});b.restrict=b.restrict||"AC";return Q(b)}function $b(b,a){function c(a,c){c=c?"-"+db(c,"-"):"";b.removeClass((a?Ta:Ua)+c).addClass((a?Ua:Ta)+c)}var d=this,e=b.parent().controller("form")||Va,f=0,i=d.$error={},h=[];d.$name=a.name;d.$dirty=!1;d.$pristine=
!0;d.$valid=!0;d.$invalid=!1;e.$addControl(d);b.addClass(oa);c(!0);d.$addControl=function(a){h.push(a);a.$name&&!d.hasOwnProperty(a.$name)&&(d[a.$name]=a)};d.$removeControl=function(a){a.$name&&d[a.$name]===a&&delete d[a.$name];o(i,function(b,c){d.$setValidity(c,!0,a)});sa(h,a)};d.$setValidity=function(a,b,h){var k=i[a];if(b){if(k&&(sa(k,h),!k.length)){f--;if(!f)c(b),d.$valid=!0,d.$invalid=!1;i[a]=!1;c(!0,a);e.$setValidity(a,!0,d)}}else{f||c(b);if(k){if(Ga(k,h)!=-1)return}else i[a]=k=[],f++,c(!1,
a),e.$setValidity(a,!1,d);k.push(h);d.$valid=!1;d.$invalid=!0}};d.$setDirty=function(){b.removeClass(oa).addClass(Wa);d.$dirty=!0;d.$pristine=!1;e.$setDirty()};d.$setPristine=function(){b.removeClass(Wa).addClass(oa);d.$dirty=!1;d.$pristine=!0;o(h,function(a){a.$setPristine()})}}function U(b){return u(b)||b===""||b===null||b!==b}function Xa(b,a,c,d,e,f){var i=function(){var e=a.val();if(Ha(c.ngTrim||"T"))e=S(e);d.$viewValue!==e&&b.$apply(function(){d.$setViewValue(e)})};if(e.hasEvent("input"))a.bind("input",
i);else{var h;a.bind("keydown",function(a){a=a.keyCode;a===91||15<a&&a<19||37<=a&&a<=40||h||(h=f.defer(function(){i();h=null}))});a.bind("change",i)}d.$render=function(){a.val(U(d.$viewValue)?"":d.$viewValue)};var j=c.ngPattern,g=function(a,b){return U(b)||a.test(b)?(d.$setValidity("pattern",!0),b):(d.$setValidity("pattern",!1),s)};j&&(j.match(/^\/(.*)\/$/)?(j=RegExp(j.substr(1,j.length-2)),e=function(a){return g(j,a)}):e=function(a){var c=b.$eval(j);if(!c||!c.test)throw Error("Expected "+j+" to be a RegExp but was "+
c);return g(c,a)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var m=K(c.ngMinlength),e=function(a){return!U(a)&&a.length<m?(d.$setValidity("minlength",!1),s):(d.$setValidity("minlength",!0),a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var k=K(c.ngMaxlength),e=function(a){return!U(a)&&a.length>k?(d.$setValidity("maxlength",!1),s):(d.$setValidity("maxlength",!0),a)};d.$parsers.push(e);d.$formatters.push(e)}}function pb(b,a){b="ngClass"+b;return Y(function(c,d,e){function f(b){if(a===
!0||c.$index%2===a)j&&b!==j&&i(j),h(b);j=b}function i(a){L(a)&&!C(a)&&(a=$a(a,function(a,b){if(a)return b}));d.removeClass(C(a)?a.join(" "):a)}function h(a){L(a)&&!C(a)&&(a=$a(a,function(a,b){if(a)return b}));a&&d.addClass(C(a)?a.join(" "):a)}var j=s;c.$watch(e[b],f,!0);e.$observe("class",function(){var a=c.$eval(e[b]);f(a,a)});b!=="ngClass"&&c.$watch("$index",function(d,f){var j=d%2;j!==f%2&&(j==a?h(c.$eval(e[b])):i(c.$eval(e[b])))})})}var J=function(b){return x(b)?b.toLowerCase():b},na=function(b){return x(b)?
b.toUpperCase():b},X=K((/msie (\d+)/.exec(J(navigator.userAgent))||[])[1]),v,ca,ka=[].slice,Ya=[].push,Da=Object.prototype.toString,hc=M.angular,Ia=M.angular||(M.angular={}),xa,jb,Z=["0","0","0"];t.$inject=[];pa.$inject=[];jb=X<9?function(b){b=b.nodeName?b:b[0];return b.scopeName&&b.scopeName!="HTML"?na(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var nc=/[A-Z]/g,md={full:"1.1.4",major:1,minor:1,dot:4,codeName:"quantum-manipulation"},La=P.cache={},
Ka=P.expando="ng-"+(new Date).getTime(),rc=1,ac=M.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},ib=M.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)},pc=/([\:\-\_]+(.))/g,qc=/^moz([A-Z])/,za=P.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;V.readyState==="complete"?setTimeout(a):(this.bind("DOMContentLoaded",a),P(M).bind("load",a))},toString:function(){var b=
[];o(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return b>=0?v(this[b]):v(this[this.length+b])},length:0,push:Ya,sort:[].sort,splice:[].splice},Oa={};o("multiple,selected,checked,disabled,readOnly,required,open".split(","),function(b){Oa[J(b)]=b});var Eb={};o("input,select,option,textarea,button,form,details".split(","),function(b){Eb[na(b)]=!0});o({data:zb,inheritedData:Na,scope:function(b){return Na(b,"$scope")},controller:Cb,injector:function(b){return Na(b,"$injector")},
removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Ma,css:function(b,a,c){a=Ja(a);if(w(c))b.style[a]=c;else{var d;X<=8&&(d=b.currentStyle&&b.currentStyle[a],d===""&&(d="auto"));d=d||b.style[a];X<=8&&(d=d===""?s:d);return d}},attr:function(b,a,c){var d=J(a);if(Oa[d])if(w(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||t).specified?d:s;else if(w(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),b===null?
s:b},prop:function(b,a,c){if(w(c))b[a]=c;else return b[a]},text:y(X<9?function(b,a){if(b.nodeType==1){if(u(a))return b.innerText;b.innerText=a}else{if(u(a))return b.nodeValue;b.nodeValue=a}}:function(b,a){if(u(a))return b.textContent;b.textContent=a},{$dv:""}),val:function(b,a){if(u(a))return b.value;b.value=a},html:function(b,a){if(u(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)wa(d[c]);b.innerHTML=a}},function(b,a){P.prototype[a]=function(a,d){var e,f;if((b.length==2&&b!==Ma&&
b!==Cb?a:d)===s)if(L(a)){for(e=0;e<this.length;e++)if(b===zb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}else{if(this.length)return b(this[0],a,d)}else{for(e=0;e<this.length;e++)b(this[e],a,d);return this}return b.$dv}});o({removeData:xb,dealoc:wa,bind:function a(c,d,e){var f=$(c,"events"),i=$(c,"handle");f||$(c,"events",f={});i||$(c,"handle",i=sc(c,f));o(d.split(" "),function(d){var j=f[d];if(!j){if(d=="mouseenter"||d=="mouseleave"){var g=0;f.mouseenter=[];f.mouseleave=[];a(c,"mouseover",
function(a){g++;g==1&&i(a,"mouseenter")});a(c,"mouseout",function(a){g--;g==0&&i(a,"mouseleave")})}else ac(c,d,i),f[d]=[];j=f[d]}j.push(e)})},unbind:yb,replaceWith:function(a,c){var d,e=a.parentNode;wa(a);o(new P(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];o(a.childNodes,function(a){a.nodeType===1&&c.push(a)});return c},contents:function(a){return a.childNodes||[]},append:function(a,c){o(new P(c),function(c){(a.nodeType===1||a.nodeType===
11)&&a.appendChild(c)})},prepend:function(a,c){if(a.nodeType===1){var d=a.firstChild;o(new P(c),function(c){d?a.insertBefore(c,d):(a.appendChild(c),d=c)})}},wrap:function(a,c){var c=v(c)[0],d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){wa(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;o(new P(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:Bb,removeClass:Ab,toggleClass:function(a,c,d){u(d)&&(d=!Ma(a,c));(d?Bb:Ab)(a,
c)},parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;a!=null&&a.nodeType!==1;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName(c)},clone:hb,triggerHandler:function(a,c){var d=($(a,"events")||{})[c];o(d,function(c){c.call(a,null)})}},function(a,c){P.prototype[c]=function(c,e){for(var f,i=0;i<this.length;i++)f==s?(f=a(this[i],c,e),f!==s&&(f=v(f))):gb(f,a(this[i],c,e));
return f==s?this:f}});Pa.prototype={put:function(a,c){this[la(a)]=c},get:function(a){return this[la(a)]},remove:function(a){var c=this[a=la(a)];delete this[a];return c}};var uc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,vc=/,/,wc=/^\s*(_?)(\S+?)\1\s*$/,tc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;Gb.$inject=["$provide"];var nd=function(){this.$get=["$animation","$window","$sniffer",function(a,c,d){function e(a){a.css("display","")}function f(a){a.css("display","none")}function i(a,c,d){d?d.after(a):c.append(a)}
function h(a){a.remove()}function j(a,c,d){i(a,c,d)}return function(g,m){function k(e,f,h){var i=l&&g.$eval(l),e=l?L(i)?i[e]:i+"-"+e:"",j=(i=a(e))&&i.setup,k=i&&i.start;if(e){var m=e+"-setup",q=e+"-start";return function(a,e,g){function i(){h(a,e,g);a.removeClass(m);a.removeClass(q)}if(!d.supportsTransitions&&!j&&!k)f(a,e,g),h(a,e,g);else{a.addClass(m);f(a,e,g);if(a.length==0)return i();var l=(j||t)(a);c.setTimeout(function(){a.addClass(q);if(k)k(a,i,l);else if(I(c.getComputedStyle)){var e=d.vendorPrefix+
"Transition",f=0;o(a,function(a){a=c.getComputedStyle(a)||{};f=Math.max(parseFloat(a.transitionDuration)||parseFloat(a[e+"Duration"])||0,f)});c.setTimeout(i,f*1E3)}else i()},1)}}}else return function(a,c,d){f(a,c,d);h(a,c,d)}}var l=m.ngAnimate,q={};q.enter=k("enter",i,t);q.leave=k("leave",t,h);q.move=k("move",j,t);q.show=k("show",e,t);q.hide=k("hide",t,f);return q}}]},Ib="Non-assignable model expression: ";Hb.$inject=["$provide"];var Cc=/^(x[\:\-_]|data[\:\-_])/i,lb=/^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
bc=/^([^\?#]*)?(\?([^#]*))?(#(.*))?$/,Jc=bc,Ba={http:80,https:443,ftp:21};mb.prototype={$$replace:!1,absUrl:Ra("$$absUrl"),url:function(a,c){if(u(a))return this.$$url;var d=bc.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));if(d[2]||d[1])this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:Ra("$$protocol"),host:Ra("$$host"),port:Ra("$$port"),path:Mb("$$path",function(a){return a.charAt(0)=="/"?a:"/"+a}),search:function(a,c){if(u(a))return this.$$search;w(c)?c===null?delete this.$$search[a]:
this.$$search[a]=c:this.$$search=x(a)?bb(a):a;this.$$compose();return this},hash:Mb("$$hash",pa),replace:function(){this.$$replace=!0;return this}};Qa.prototype=Fa(mb.prototype);Lb.prototype=Fa(Qa.prototype);var Ca={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:t,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return w(d)?w(e)?d+e:d:w(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(w(d)?d:0)-(w(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},
"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":t,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,
c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Nc={n:"\n",f:"\u000c",r:"\r",t:"\t",v:"\u000b","'":"'",'"':'"'},nb={},Yc=/^(([^:]+):)?\/\/(\w+:{0,1}\w*@)?([\w\.-]*)?(:([0-9]+))?(.*)$/,bd=M.XMLHttpRequest||function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(c){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(d){}throw Error("This browser does not support XMLHttpRequest.");
};Tb.$inject=["$provide"];Ub.$inject=["$locale"];Wb.$inject=["$locale"];var Zb=".",ld={yyyy:O("FullYear",4),yy:O("FullYear",2,0,!0),y:O("FullYear",1),MMMM:Sa("Month"),MMM:Sa("Month",!0),MM:O("Month",2,1),M:O("Month",1,1),dd:O("Date",2),d:O("Date",1),HH:O("Hours",2),H:O("Hours",1),hh:O("Hours",2,-12),h:O("Hours",1,-12),mm:O("Minutes",2),m:O("Minutes",1),ss:O("Seconds",2),s:O("Seconds",1),sss:O("Milliseconds",3),EEEE:Sa("Day"),EEE:Sa("Day",!0),a:function(a,c){return a.getHours()<12?c.AMPMS[0]:c.AMPMS[1]},
Z:function(a){var a=-1*a.getTimezoneOffset(),c=a>=0?"+":"";c+=ob(Math[a>0?"floor":"ceil"](a/60),2)+ob(Math.abs(a%60),2);return c}},kd=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,jd=/^\d+$/;Vb.$inject=["$locale"];var hd=Q(J),id=Q(na);Xb.$inject=["$parse"];var od=Q({restrict:"E",compile:function(a,c){X<=8&&(!c.href&&!c.name&&c.$set("href",""),a.append(V.createComment("IE fix")));return function(a,c){c.bind("click",function(a){c.attr("href")||a.preventDefault()})}}}),
qb={};o(Oa,function(a,c){var d=aa("ng-"+c);qb[d]=function(){return{priority:100,compile:function(){return function(a,f,i){a.$watch(i[d],function(a){i.$set(c,!!a)})}}}}});o(["src","href"],function(a){var c=aa("ng-"+a);qb[c]=function(){return{priority:99,link:function(d,e,f){f.$observe(c,function(c){c&&(f.$set(a,c),X&&e.prop(a,f[a]))})}}}});var Va={$addControl:t,$removeControl:t,$setValidity:t,$setDirty:t,$setPristine:t};$b.$inject=["$element","$attrs","$scope"];var Ya=function(a){return["$timeout",
function(c){var d={name:"form",restrict:"E",controller:$b,compile:function(){return{pre:function(a,d,i,h){if(!i.action){var j=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};ac(d[0],"submit",j);d.bind("$destroy",function(){c(function(){ib(d[0],"submit",j)},0,!1)})}var g=d.parent().controller("form"),m=i.name||i.ngForm;m&&(a[m]=h);g&&d.bind("$destroy",function(){g.$removeControl(h);m&&(a[m]=s);y(h,Va)})}}}};return a?y(W(d),{restrict:"EAC"}):d}]},pd=Ya(),qd=Ya(!0),rd=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
sd=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,td=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,cc={text:Xa,number:function(a,c,d,e,f,i){Xa(a,c,d,e,f,i);e.$parsers.push(function(a){var c=U(a);return c||td.test(a)?(e.$setValidity("number",!0),a===""?null:c?a:parseFloat(a)):(e.$setValidity("number",!1),s)});e.$formatters.push(function(a){return U(a)?"":""+a});if(d.min){var h=parseFloat(d.min),a=function(a){return!U(a)&&a<h?(e.$setValidity("min",!1),s):(e.$setValidity("min",!0),a)};e.$parsers.push(a);
e.$formatters.push(a)}if(d.max){var j=parseFloat(d.max),d=function(a){return!U(a)&&a>j?(e.$setValidity("max",!1),s):(e.$setValidity("max",!0),a)};e.$parsers.push(d);e.$formatters.push(d)}e.$formatters.push(function(a){return U(a)||Za(a)?(e.$setValidity("number",!0),a):(e.$setValidity("number",!1),s)})},url:function(a,c,d,e,f,i){Xa(a,c,d,e,f,i);a=function(a){return U(a)||rd.test(a)?(e.$setValidity("url",!0),a):(e.$setValidity("url",!1),s)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,
c,d,e,f,i){Xa(a,c,d,e,f,i);a=function(a){return U(a)||sd.test(a)?(e.$setValidity("email",!0),a):(e.$setValidity("email",!1),s)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){u(d.name)&&c.attr("name",Ea());c.bind("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var f=d.ngTrueValue,i=d.ngFalseValue;x(f)||(f=!0);x(i)||(i=!1);c.bind("click",
function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:i})},hidden:t,button:t,submit:t,reset:t},dc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,f,i){i&&(cc[J(f.type)]||cc.text)(d,e,f,i,c,a)}}}],Ua="ng-valid",Ta="ng-invalid",oa="ng-pristine",Wa="ng-dirty",ud=["$scope","$exceptionHandler","$attrs","$element","$parse",
function(a,c,d,e,f){function i(a,c){c=c?"-"+db(c,"-"):"";e.removeClass((a?Ta:Ua)+c).addClass((a?Ua:Ta)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var h=f(d.ngModel),j=h.assign;if(!j)throw Error(Ib+d.ngModel+" ("+ta(e)+")");this.$render=t;var g=e.inheritedData("$formController")||Va,m=0,k=this.$error={};e.addClass(oa);i(!0);this.$setValidity=function(a,
c){if(k[a]!==!c){if(c){if(k[a]&&m--,!m)i(!0),this.$valid=!0,this.$invalid=!1}else i(!1),this.$invalid=!0,this.$valid=!1,m++;k[a]=!c;i(c,a);g.$setValidity(a,c,this)}};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;e.removeClass(Wa).addClass(oa)};this.$setViewValue=function(d){this.$viewValue=d;if(this.$pristine)this.$dirty=!0,this.$pristine=!1,e.removeClass(oa).addClass(Wa),g.$setDirty();o(this.$parsers,function(a){d=a(d)});if(this.$modelValue!==d)this.$modelValue=d,j(a,d),o(this.$viewChangeListeners,
function(a){try{a()}catch(d){c(d)}})};var l=this;a.$watch(function(){var c=h(a);if(l.$modelValue!==c){var d=l.$formatters,e=d.length;for(l.$modelValue=c;e--;)c=d[e](c);if(l.$viewValue!==c)l.$viewValue=c,l.$render()}})}],vd=function(){return{require:["ngModel","^?form"],controller:ud,link:function(a,c,d,e){var f=e[0],i=e[1]||Va;i.$addControl(f);c.bind("$destroy",function(){i.$removeControl(f)})}}},wd=Q({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),
ec=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&(U(a)||a===!1))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},xd=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){var c=[];a&&o(a.split(f),function(a){a&&c.push(S(a))});
return c});e.$formatters.push(function(a){return C(a)?a.join(", "):s})}}},yd=/^(true|false|\d+)$/,zd=function(){return{priority:100,compile:function(a,c){return yd.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a,!1)})}}}},Ad=Y(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==s?"":a)})}),Bd=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));
d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],Cd=[function(){return function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBindHtmlUnsafe);a.$watch(d.ngBindHtmlUnsafe,function(a){c.html(a||"")})}}],Dd=pb("",!0),Ed=pb("Odd",0),Fd=pb("Even",1),Gd=Y({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),Hd=[function(){return{scope:!0,controller:"@"}}],Id=["$sniffer",function(a){return{priority:1E3,compile:function(){a.csp=!0}}}],
fc={};o("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress".split(" "),function(a){var c=aa("ng-"+a);fc[c]=["$parse",function(d){return function(e,f,i){var h=d(i[c]);f.bind(J(a),function(a){e.$apply(function(){h(e,{$event:a})})})}}]});var Jd=Y(function(a,c,d){c.bind("submit",function(){a.$apply(d.ngSubmit)})}),Kd=["$http","$templateCache","$anchorScroll","$compile","$animator",function(a,c,d,e,f){return{restrict:"ECA",terminal:!0,compile:function(i,
h){var j=h.ngInclude||h.src,g=h.onload||"",m=h.autoscroll;return function(h,i,o){var n=f(h,o),s=0,r,p=function(){r&&(r.$destroy(),r=null);n.leave(i.contents(),i)};h.$watch(j,function(f){var j=++s;f?a.get(f,{cache:c}).success(function(a){j===s&&(r&&r.$destroy(),r=h.$new(),n.leave(i.contents(),i),a=v("<div/>").html(a).contents(),n.enter(a,i),e(a)(r),w(m)&&(!m||h.$eval(m))&&d(),r.$emit("$includeContentLoaded"),h.$eval(g))}).error(function(){j===s&&p()}):p()})}}}}],Ld=Y({compile:function(){return{pre:function(a,
c,d){a.$eval(d.ngInit)}}}}),Md=Y({terminal:!0,priority:1E3}),Nd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,i){var h=i.count,j=f.attr(i.$attr.when),g=i.offset||0,m=e.$eval(j),k={},l=c.startSymbol(),q=c.endSymbol();o(m,function(a,e){k[e]=c(a.replace(d,l+h+"-"+g+q))});e.$watch(function(){var c=parseFloat(e.$eval(h));return isNaN(c)?"":(m[c]||(c=a.pluralCat(c-g)),k[c](e,f,!0))},function(a){f.text(a)})}}}],Od=["$parse","$animator",function(a,c){return{transclude:"element",
priority:1E3,terminal:!0,compile:function(d,e,f){return function(d,e,j){var g=c(d,j),m=j.ngRepeat,k=m.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),l,q,n,s,r,p={$id:la};if(!k)throw Error("Expected ngRepeat in form of '_item_ in _collection_[ track by _id_]' but got '"+m+"'.");j=k[1];n=k[2];(k=k[4])?(l=a(k),q=function(a,c,e){r&&(p[r]=a);p[s]=c;p.$index=e;return l(d,p)}):q=function(a,c){return la(c)};k=j.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!k)throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '"+
j+"'.");s=k[3]||k[1];r=k[2];var y={};d.$watchCollection(n,function(a){var c,j,k=e,l,n={},p,t,v,z,w,u,x=[];if(C(a))w=a;else{w=[];for(v in a)a.hasOwnProperty(v)&&v.charAt(0)!="$"&&w.push(v);w.sort()}p=w.length;j=x.length=w.length;for(c=0;c<j;c++)if(v=a===w?c:w[c],z=a[v],l=q(v,z,c),u=y[l])delete y[l],n[l]=u,x[c]=u;else if(n.hasOwnProperty(l))throw o(x,function(a){a&&a.element&&(y[a.id]=a)}),Error("Duplicates in a repeater are not allowed. Repeater: "+m);else x[c]={id:l};for(v in y)if(y.hasOwnProperty(v))u=
y[v],g.leave(u.element),u.element[0].$$NG_REMOVED=!0,u.scope.$destroy();c=0;for(j=w.length;c<j;c++){v=a===w?c:w[c];z=a[v];u=x[c];if(u.element){t=u.scope;l=k[0];do l=l.nextSibling;while(l&&l.$$NG_REMOVED);u.element[0]!=l&&g.move(u.element,null,k);k=u.element}else t=d.$new();t[s]=z;r&&(t[r]=v);t.$index=c;t.$first=c===0;t.$last=c===p-1;t.$middle=!(t.$first||t.$last);u.element||f(t,function(a){g.enter(a,null,k);k=a;u.scope=t;u.element=a;n[u.id]=u})}y=n})}}}}],Pd=["$animator",function(a){return function(c,
d,e){var f=a(c,e);c.$watch(e.ngShow,function(a){f[Ha(a)?"show":"hide"](d)})}}],Qd=["$animator",function(a){return function(c,d,e){var f=a(c,e);c.$watch(e.ngHide,function(a){f[Ha(a)?"hide":"show"](d)})}}],Rd=Y(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&o(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Sd=["$animator",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var i=a(c,e),h,j,g=[];c.$watch(e.ngSwitch||
e.on,function(a){for(var d=0,l=g.length;d<l;d++)g[d].$destroy(),i.leave(j[d]);j=[];g=[];if(h=f.cases["!"+a]||f.cases["?"])c.$eval(e.change),o(h,function(a){var d=c.$new();g.push(d);a.transclude(d,function(c){var d=a.element;j.push(c);i.enter(c,d.parent(),d)})})})}}}],Td=Y({transclude:"element",priority:500,require:"^ngSwitch",compile:function(a,c,d){return function(a,f,i,h){h.cases["!"+c.ngSwitchWhen]=h.cases["!"+c.ngSwitchWhen]||[];h.cases["!"+c.ngSwitchWhen].push({transclude:d,element:f})}}}),Ud=
Y({transclude:"element",priority:500,require:"^ngSwitch",compile:function(a,c,d){return function(a,c,i,h){h.cases["?"]=h.cases["?"]||[];h.cases["?"].push({transclude:d,element:c})}}}),Vd=Y({controller:["$transclude","$element",function(a,c){a(function(a){c.append(a)})}]}),Wd=["$http","$templateCache","$route","$anchorScroll","$compile","$controller","$animator",function(a,c,d,e,f,i,h){return{restrict:"ECA",terminal:!0,link:function(a,c,m){function k(){var h=d.current&&d.current.locals,k=h&&h.$template;
if(k){n.leave(c.contents(),c);l&&(l.$destroy(),l=null);n.enter(v("<div></div>").html(k).contents(),c);var k=f(c.contents()),m=d.current;l=m.scope=a.$new();if(m.controller)h.$scope=l,h=i(m.controller,h),c.children().data("$ngControllerController",h);k(l);l.$emit("$viewContentLoaded");l.$eval(o);e()}else n.leave(c.contents(),c),l&&(l.$destroy(),l=null)}var l,o=m.onload||"",n=h(a,m);a.$on("$routeChangeSuccess",k);k()}}}],Xd=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,
d){d.type=="text/ng-template"&&a.put(d.id,c[0].text)}}}],Yd=Q({terminal:!0}),Zd=["$compile","$parse",function(a,c){var d=/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/,e={$setViewValue:t};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var j=this,g={},m=e,k;j.databound=d.ngModel;j.init=function(a,c,d){m=a;k=d};j.addOption=function(c){g[c]=
!0;m.$viewValue==c&&(a.val(c),k.parent()&&k.remove())};j.removeOption=function(a){this.hasOption(a)&&(delete g[a],m.$viewValue==a&&this.renderUnknownOption(a))};j.renderUnknownOption=function(c){c="? "+la(c)+" ?";k.val(c);a.prepend(k);a.val(c);k.prop("selected",!0)};j.hasOption=function(a){return g.hasOwnProperty(a)};c.$on("$destroy",function(){j.renderUnknownOption=t})}],link:function(e,i,h,j){function g(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(x.parent()&&x.remove(),c.val(a),
a===""&&p.prop("selected",!0)):u(a)&&p?c.val(""):e.renderUnknownOption(a)};c.bind("change",function(){a.$apply(function(){x.parent()&&x.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=new Pa(d.$viewValue);o(c.find("option"),function(c){c.selected=w(a.get(c.value))})};a.$watch(function(){ja(e,d.$viewValue)||(e=W(d.$viewValue),d.$render())});c.bind("change",function(){a.$apply(function(){var a=[];o(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}
function k(e,f,h){function g(){var a={"":[]},c=[""],d,i,t,v,u;t=h.$modelValue;v=p(e)||[];var w=l?rb(v):v,z,x,A;x={};u=!1;var B,C;if(n)u=new Pa(t);else if(t===null||r)a[""].push({selected:t===null,id:"",label:""}),u=!0;for(A=0;z=w.length,A<z;A++){x[k]=v[l?x[l]=w[A]:A];d=m(e,x)||"";if(!(i=a[d]))i=a[d]=[],c.push(d);n?d=u.remove(o(e,x))!=s:(d=t===o(e,x),u=u||d);B=j(e,x);B=B===s?"":B;i.push({id:l?w[A]:A,label:B,selected:d})}!n&&!u&&a[""].unshift({id:"?",label:"",selected:!0});x=0;for(w=c.length;x<w;x++){d=
c[x];i=a[d];if(q.length<=x)t={element:D.clone().attr("label",d),label:i.label},v=[t],q.push(v),f.append(t.element);else if(v=q[x],t=v[0],t.label!=d)t.element.attr("label",t.label=d);B=null;A=0;for(z=i.length;A<z;A++)if(d=i[A],u=v[A+1]){B=u.element;if(u.label!==d.label)B.text(u.label=d.label);if(u.id!==d.id)B.val(u.id=d.id);if(u.element.selected!==d.selected)B.prop("selected",u.selected=d.selected)}else d.id===""&&r?C=r:(C=y.clone()).val(d.id).attr("selected",d.selected).text(d.label),v.push({element:C,
label:d.label,id:d.id,selected:d.selected}),B?B.after(C):t.element.append(C),B=C;for(A++;v.length>A;)v.pop().element.remove()}for(;q.length>x;)q.pop()[0].element.remove()}var i;if(!(i=t.match(d)))throw Error("Expected ngOptions in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '"+t+"'.");var j=c(i[2]||i[1]),k=i[4]||i[6],l=i[5],m=c(i[3]||""),o=c(i[2]?i[1]:k),p=c(i[7]),q=[[{element:f,label:""}]];r&&(a(r)(e),r.removeClass("ng-scope"),r.remove());f.html("");f.bind("change",
function(){e.$apply(function(){var a,c=p(e)||[],d={},g,i,j,m,r,t;if(n){i=[];m=0;for(t=q.length;m<t;m++){a=q[m];j=1;for(r=a.length;j<r;j++)if((g=a[j].element)[0].selected)g=g.val(),l&&(d[l]=g),d[k]=c[g],i.push(o(e,d))}}else g=f.val(),g=="?"?i=s:g==""?i=null:(d[k]=c[g],l&&(d[l]=g),i=o(e,d));h.$setViewValue(i)})});h.$render=g;e.$watch(g)}if(j[1]){for(var l=j[0],q=j[1],n=h.multiple,t=h.ngOptions,r=!1,p,y=v(V.createElement("option")),D=v(V.createElement("optgroup")),x=y.clone(),j=0,C=i.children(),A=C.length;j<
A;j++)if(C[j].value==""){p=r=C.eq(j);break}l.init(q,r,x);if(n&&(h.required||h.ngRequired)){var H=function(a){q.$setValidity("required",!h.required||a&&a.length);return a};q.$parsers.push(H);q.$formatters.unshift(H);h.$observe("required",function(){H(q.$viewValue)})}t?k(e,i,q):n?m(e,i,q):g(e,i,q,l)}}}}],$d=["$interpolate",function(a){var c={addOption:t,removeOption:t};return{restrict:"E",priority:100,compile:function(d,e){if(u(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,
d,e){var g=d.parent(),m=g.data("$selectController")||g.parent().data("$selectController");m&&m.databound?d.prop("selected",!1):m=c;f?a.$watch(f,function(a,c){e.$set("value",a);a!==c&&m.removeOption(c);m.addOption(a)}):m.addOption(e.value);d.bind("$destroy",function(){m.removeOption(e.value)})}}}}],ae=Q({restrict:"E",terminal:!0});(ca=M.jQuery)?(v=ca,y(ca.fn,{scope:za.scope,controller:za.controller,injector:za.injector,inheritedData:za.inheritedData}),fb("remove",!0),fb("empty"),fb("html")):v=P;Ia.element=
v;(function(a){y(a,{bootstrap:vb,copy:W,extend:y,equals:ja,element:v,forEach:o,injector:wb,noop:t,bind:ab,toJson:da,fromJson:tb,identity:pa,isUndefined:u,isDefined:w,isString:x,isFunction:I,isObject:L,isNumber:Za,isElement:jc,isArray:C,version:md,isDate:qa,lowercase:J,uppercase:na,callbacks:{counter:0},noConflict:gc});xa=oc(M);try{xa("ngLocale")}catch(c){xa("ngLocale",[]).provider("$locale",cd)}xa("ng",["ngLocale"],["$provide",function(a){a.provider("$compile",Hb).directive({a:od,input:dc,textarea:dc,
form:pd,script:Xd,select:Zd,style:ae,option:$d,ngBind:Ad,ngBindHtmlUnsafe:Cd,ngBindTemplate:Bd,ngClass:Dd,ngClassEven:Fd,ngClassOdd:Ed,ngCsp:Id,ngCloak:Gd,ngController:Hd,ngForm:qd,ngHide:Qd,ngInclude:Kd,ngInit:Ld,ngNonBindable:Md,ngPluralize:Nd,ngRepeat:Od,ngShow:Pd,ngSubmit:Jd,ngStyle:Rd,ngSwitch:Sd,ngSwitchWhen:Td,ngSwitchDefault:Ud,ngOptions:Yd,ngView:Wd,ngTransclude:Vd,ngModel:vd,ngList:xd,ngChange:wd,required:ec,ngRequired:ec,ngValue:zd}).directive(qb).directive(fc);a.provider({$anchorScroll:xc,
$animation:Gb,$animator:nd,$browser:zc,$cacheFactory:Ac,$controller:Dc,$document:Ec,$exceptionHandler:Fc,$filter:Tb,$interpolate:Gc,$http:Zc,$httpBackend:$c,$location:Kc,$log:Lc,$parse:Pc,$route:Sc,$routeParams:Tc,$rootScope:Uc,$q:Qc,$sniffer:Vc,$templateCache:Bc,$timeout:dd,$window:Wc})}])})(Ia);v(V).ready(function(){mc(V,vb)})})(window,document);angular.element(document).find("head").append('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak{display:none;}ng\\:form{display:block;}</style>');

;
//*/js/modernizr.js*//
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https:///")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("http://wbpreview.com/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia=window.matchMedia||(function(e,f){var c,a=e.documentElement,b=a.firstElementChild||a.firstChild,d=e.createElement("body"),g=e.createElement("div");g.id="mq-test-1";g.style.cssText="position:absolute;top:-100em";d.style.background="none";d.appendChild(g);return function(h){g.innerHTML='&shy;<style media="'+h+'"> #mq-test-1 { width: 42px; }</style>';a.insertBefore(d,b);c=g.offsetWidth==42;a.removeChild(d);return{matches:c,media:h}}})(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(e){e.respond={};respond.update=function(){};respond.mediaQueriesSupported=e.matchMedia&&e.matchMedia("only all").matches;if(respond.mediaQueriesSupported){return}var w=e.document,s=w.documentElement,i=[],k=[],q=[],o={},h=30,f=w.getElementsByTagName("head")[0]||s,g=w.getElementsByTagName("base")[0],b=f.getElementsByTagName("link"),d=[],a=function(){var D=b,y=D.length,B=0,A,z,C,x;for(;B<y;B++){A=D[B],z=A.href,C=A.media,x=A.rel&&A.rel.toLowerCase()==="stylesheet";if(!!z&&x&&!o[z]){if(A.styleSheet&&A.styleSheet.rawCssText){m(A.styleSheet.rawCssText,z,C);o[z]=true}else{if((!/^([a-zA-Z:]*\/\/)/.test(z)&&!g)||z.replace(RegExp.$1,"").split("http://wbpreview.com/")[0]===e.location.host){d.push({href:z,media:C})}}}}u()},u=function(){if(d.length){var x=d.shift();n(x.href,function(y){m(y,x.href,x.media);o[x.href]=true;u()})}},m=function(I,x,z){var G=I.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),J=G&&G.length||0,x=x.substring(0,x.lastIndexOf("http://wbpreview.com/")),y=function(K){return K.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+x+"$2$3")},A=!J&&z,D=0,C,E,F,B,H;if(x.length){x+="/"}if(A){J=1}for(;D<J;D++){C=0;if(A){E=z;k.push(y(I))}else{E=G[D].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1;k.push(RegExp.$2&&y(RegExp.$2))}B=E.split(",");H=B.length;for(;C<H;C++){F=B[C];i.push({media:F.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:k.length-1,hasquery:F.indexOf("(")>-1,minw:F.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:F.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}}j()},l,r,v=function(){var z,A=w.createElement("div"),x=w.body,y=false;A.style.cssText="position:absolute;font-size:1em;width:1em";if(!x){x=y=w.createElement("body");x.style.background="none"}x.appendChild(A);s.insertBefore(x,s.firstChild);z=A.offsetWidth;if(y){s.removeChild(x)}else{x.removeChild(A)}z=p=parseFloat(z);return z},p,j=function(I){var x="clientWidth",B=s[x],H=w.compatMode==="CSS1Compat"&&B||w.body[x]||B,D={},G=b[b.length-1],z=(new Date()).getTime();if(I&&l&&z-l<h){clearTimeout(r);r=setTimeout(j,h);return}else{l=z}for(var E in i){var K=i[E],C=K.minw,J=K.maxw,A=C===null,L=J===null,y="em";if(!!C){C=parseFloat(C)*(C.indexOf(y)>-1?(p||v()):1)}if(!!J){J=parseFloat(J)*(J.indexOf(y)>-1?(p||v()):1)}if(!K.hasquery||(!A||!L)&&(A||H>=C)&&(L||H<=J)){if(!D[K.media]){D[K.media]=[]}D[K.media].push(k[K.rules])}}for(var E in q){if(q[E]&&q[E].parentNode===f){f.removeChild(q[E])}}for(var E in D){var M=w.createElement("style"),F=D[E].join("\n");M.type="text/css";M.media=E;f.insertBefore(M,G.nextSibling);if(M.styleSheet){M.styleSheet.cssText=F}else{M.appendChild(w.createTextNode(F))}q.push(M)}},n=function(x,z){var y=c();if(!y){return}y.open("GET",x,true);y.onreadystatechange=function(){if(y.readyState!=4||y.status!=200&&y.status!=304){return}z(y.responseText)};if(y.readyState==4){return}y.send(null)},c=(function(){var x=false;try{x=new XMLHttpRequest()}catch(y){x=new ActiveXObject("Microsoft.XMLHTTP")}return function(){return x}})();a();respond.update=a;function t(){j(true)}if(e.addEventListener){e.addEventListener("resize",t,false)}else{if(e.attachEvent){e.attachEvent("onresize",t)}}})(this);
;
//*/js/selectnav.js*//
/*!
 * SelectNav.js (v. 0.1)
 * Converts your <ul>/<ol> navigation into a dropdown list for small screens
 */

window.selectnav = (function(){
	
    "use strict";
			
    var selectnav = function(element,options){
		
        element = document.getElementById(element);

        // return immediately if element doesn't exist	
        if( ! element) 
            return;

        // return immediately if element is not a list
        if( ! islist(element) )	
            return;

        document.documentElement.className += " js";

        // retreive options and set defaults
        var o = options || {},
			
        activeclass = o.activeclass || 'active',
        autoselect = typeof(o.autoselect) === "boolean" ? o.autoselect : true,
        nested = typeof(o.nested) === "boolean" ? o.nested : true,
        indent = o.indent || "â†’",
        label = o.label || "- Navigation -",
			
        // helper variables
        level = 0,
        selected = " selected ";

        // insert the freshly created dropdown navigation after the existing navigation
        element.insertAdjacentHTML('afterend', parselist(element) );

        var nav = document.getElementById(id());
		
        // autoforward on click
        if (nav.addEventListener) nav.addEventListener('change',goTo);
        if (nav.attachEvent) nav.attachEvent('onchange', goTo);
		
        return nav;
		
        function goTo(e){
			
            // Crossbrowser issues - http://www.quirksmode.org/js/events_properties.html
            var targ;
            if (!e) e = window.event;
            if (e.target) targ = e.target;
            else if (e.srcElement) targ = e.srcElement;
            if (targ.nodeType === 3) // defeat Safari bug
                targ = targ.parentNode;	
		
            if(targ.value) window.location.href = targ.value; 
        }
		
        function islist(list){
            var n = list.nodeName.toLowerCase();
            return (n === 'ul' || n === 'ol');
        }
		
        function id(nextId){
            for(var j=1; document.getElementById('selectnav'+j);j++);
            return (nextId) ? 'selectnav'+j : 'selectnav'+(j-1);
        }

        function parselist(list){

            // go one level down
            level++;
	
            var length = list.children.length,
            html = '',
            prefix = '',
            k = level-1
            ;
	
            // return immediately if has no children
            if (!length) return;
		
            if(k) {
                while(k--){
                    prefix += indent;
                }
                prefix += " ";
            }
			
            for(var i=0; i < length; i++){	
		
                var link = list.children[i].children[0];
                var text = link.innerText || link.textContent;		
                var isselected = '';
		
                if(activeclass){
                    isselected = link.className.search(activeclass) !== -1 || link.parentElement.className.search(activeclass) !== -1 ? selected : '';	
                }
		
                if(autoselect && !isselected){
                    isselected = link.href === document.URL ? selected : '';
                }
				
                html += '<option value="' + link.href + '" ' + isselected + '>' + prefix + text +'</option>';
		
                if(nested){
                    var subElement = list.children[i].children[1];
                    if( subElement && islist(subElement) ){
                        html += parselist(subElement);
                    }
                }
            }
			
            // adds label
            if(level === 1 && label) html = '<option value="">' + label + '</option>' + html;
		
            // add <select> tag to the top level of the list
            if(level === 1) html = '<select class="selectnav span12" id="'+id(true)+'">' + html + '</select>';
	
            // go 1 level up
            level--;
	
            return html;
        }

    };
	
    return function (element,options) { 
        selectnav(element,options);
    };



})();

;
//*/js/bootstrap.js*//
/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
;
//*/js/ui-bootstrap-tpls-0.2.0.js*//
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.collapse","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.popover","ui.bootstrap.tabs","ui.bootstrap.tooltip","ui.bootstrap.transition","ui.bootstrap.typeahead"]);

angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/dialog/message.html","template/pagination/pagination.html","template/popover/popover.html","template/tabs/pane.html","template/tabs/tabs.html","template/tooltip/tooltip-popup.html","template/typeahead/typeahead.html"]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('accordionConfig', {
  closeOthers: true
})

.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {
  
  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          group.isOpen = false;
        }
      });
    }
  };
  
  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function (event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(this.groups.indexOf(group), 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
  return {
    restrict:'EA',
    controller:'AccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', ['$parse', '$transition', '$timeout', function($parse, $transition, $timeout) {
  return {
    require:'^accordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope:{ heading:'@' },        // Create an isolated scope and interpolate the heading attribute onto this scope
    controller: ['$scope', function($scope) {
      this.setHeading = function(element) {
        this.heading = element;
      };
    }],
    link: function(scope, element, attrs, accordionCtrl) {
      var getIsOpen, setIsOpen;

      accordionCtrl.addGroup(scope);

      scope.isOpen = false;
      
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        scope.$watch(
          function watchIsOpen() { return getIsOpen(scope.$parent); },
          function updateOpen(value) { scope.isOpen = value; }
        );
        
        scope.isOpen = getIsOpen ? getIsOpen(scope.$parent) : false;
      }

      scope.$watch('isOpen', function(value) {
        if ( value ) {
          accordionCtrl.closeOthers(scope);
        }
        if ( setIsOpen ) {
          setIsOpen(scope.$parent, value);
        }
      });
    }
  };
}])

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('accordionHeading', function() {
  return {
    restrict: 'E',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^accordionGroup',
    compile: function(element, attr, transclude) {
      return function link(scope, element, attr, accordionGroupCtrl) {
        // Pass the heading to the accordion-group controller
        // so that it can be transcluded into the right place in the template
        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
        accordionGroupCtrl.setHeading(transclude(scope, function() {}));
      };
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('accordionTransclude', function() {
  return {
    require: '^accordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});

angular.module("ui.bootstrap.alert", []).directive('alert', function () {
  return {
    restrict:'EA',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope:{
      type:'=',
      close:'&'
    }
  };
});
angular.module('ui.bootstrap.buttons', [])

  .constant('buttonConfig', {
    activeClass:'active',
    toggleEvent:'click'
  })

  .directive('btnRadio', ['buttonConfig', function (buttonConfig) {
  var activeClass = buttonConfig.activeClass || 'active';
  var toggleEvent = buttonConfig.toggleEvent || 'click';

  return {

    require:'ngModel',
    link:function (scope, element, attrs, ngModelCtrl) {

      var value = scope.$eval(attrs.btnRadio);

      //model -> UI
      scope.$watch(function () {
        return ngModelCtrl.$modelValue;
      }, function (modelValue) {
        if (angular.equals(modelValue, value)){
          element.addClass(activeClass);
        } else {
          element.removeClass(activeClass);
        }
      });

      //ui->model
      element.bind(toggleEvent, function () {
        if (!element.hasClass(activeClass)) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(value);
          });
        }
      });
    }
  };
}])

  .directive('btnCheckbox', ['buttonConfig', function (buttonConfig) {

  var activeClass = buttonConfig.activeClass || 'active';
  var toggleEvent = buttonConfig.toggleEvent || 'click';

  return {
    require:'ngModel',
    link:function (scope, element, attrs, ngModelCtrl) {

      var trueValue = scope.$eval(attrs.btnCheckboxTrue);
      var falseValue = scope.$eval(attrs.btnCheckboxFalse);

      trueValue = angular.isDefined(trueValue) ? trueValue : true;
      falseValue = angular.isDefined(falseValue) ? falseValue : false;

      //model -> UI
      scope.$watch(function () {
        return ngModelCtrl.$modelValue;
      }, function (modelValue) {
        if (angular.equals(modelValue, trueValue)) {
          element.addClass(activeClass);
        } else {
          element.removeClass(activeClass);
        }
      });

      //ui->model
      element.bind(toggleEvent, function () {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(element.hasClass(activeClass) ? falseValue : trueValue);
        });
      });
    }
  };
}]);
/*
*
*    AngularJS Bootstrap Carousel 
*
*      A pure AngularJS carousel.
*      
*      For no interval set the interval to non-number, or milliseconds of desired interval
*      Template: <carousel interval="none"><slide>{{anything}}</slide></carousel>
*      To change the carousel's active slide set the active attribute to true
*      Template: <carousel interval="none"><slide active="someModel">{{anything}}</slide></carousel>
*/
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
.controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
  var self = this,
    slides = self.slides = [],
    currentIndex = -1,
    currentTimeout, isPlaying;
  self.currentSlide = null;

  /* direction: "prev" or "next" */
  self.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? "next" : "prev";
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition.cancel();
        //Timeout so ng-class in template has time to fix classes for finished slide
        $timeout(goNext);
      } else {
        goNext();
      }
    }
    function goNext() {
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) { 
        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
        nextSlide.$element.addClass(direction);
        nextSlide.$element[0].offsetWidth = nextSlide.$element[0].offsetWidth; //force reflow

        //Set all other slides to stop doing their stuff for the new transition
        angular.forEach(slides, function(slide) {
          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
        });
        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

        $scope.$currentTransition = $transition(nextSlide.$element, {});
        //We have to create new pointers inside a closure since next & current will change
        (function(next,current) {
          $scope.$currentTransition.then(
            function(){ transitionDone(next, current); },
            function(){ transitionDone(next, current); }
          );
        }(nextSlide, self.currentSlide));
      } else {
        transitionDone(nextSlide, self.currentSlide);
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
      //every time you change slides, reset the timer
      restartTimer();
    }
    function transitionDone(next, current) {
      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
      $scope.$currentTransition = null;
    }
  };

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (currentIndex + 1) % slides.length;
    return self.select(slides[newIndex], 'next');
  };

  $scope.prev = function() {
    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
    return self.select(slides[newIndex], 'prev');
  };

  $scope.select = function(slide) {
    self.select(slide);
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.slides = function() {
    return slides;
  };

  $scope.$watch('interval', restartTimer);
  function restartTimer() {
    if (currentTimeout) {
      $timeout.cancel(currentTimeout);
    }
    function go() {
      if (isPlaying) {
        $scope.next();
        restartTimer();
      } else {
        $scope.pause();
      }
    }
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval>=0) {
      currentTimeout = $timeout(go, interval);
    }
  }
  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    isPlaying = false;
    if (currentTimeout) {
      $timeout.cancel(currentTimeout);
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index-1]);
      } else {
        self.select(slides[index]);
      }
    }
  };
}])
.directive('carousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselController',
    require: 'carousel',
    templateUrl: 'template/carousel/carousel.html',
    scope: {
      interval: '=',
      noTransition: '='
    }
  };
}])
.directive('slide', [function() {
  return {
    require: '^carousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: 'template/carousel/slide.html',
    scope: {
      active: '='
    },
    link: function (scope, element, attrs, carouselCtrl) {
      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.collapse',['ui.bootstrap.transition'])

// The collapsible directive indicates a block of html that will expand and collapse
.directive('collapse', ['$transition', function($transition) {
  // CSS transitions don't work with height: auto, so we have to manually change the height to a
  // specific value and then once the animation completes, we can reset the height to auto.
  // Unfortunately if you do this while the CSS transitions are specified (i.e. in the CSS class
  // "collapse") then you trigger a change to height 0 in between.
  // The fix is to remove the "collapse" CSS class while changing the height back to auto - phew!
  var fixUpHeight = function(scope, element, height) {
    // We remove the collapse CSS class to prevent a transition when we change to height: auto
    element.removeClass('collapse');
    element.css({ height: height });
    // It appears that  reading offsetWidth makes the browser realise that we have changed the
    // height already :-/
    var x = element[0].offsetWidth;
    element.addClass('collapse');
  };

  return {
    link: function(scope, element, attrs) {

      var isCollapsed;
      var initialAnimSkip = true;
      scope.$watch(function (){ return element[0].scrollHeight; }, function (value) {
        //The listener is called when scollHeight changes
        //It actually does on 2 scenarios: 
        // 1. Parent is set to display none
        // 2. angular bindings inside are resolved
        //When we have a change of scrollHeight we are setting again the correct height if the group is opened
        if (element[0].scrollHeight !== 0) {
          if (!isCollapsed) {
            if (initialAnimSkip) {
              fixUpHeight(scope, element, element[0].scrollHeight + 'px');
            } else {
              fixUpHeight(scope, element, 'auto');
            }
          }
        }
      });
      
      scope.$watch(attrs.collapse, function(value) {
        if (value) {
          collapse();
        } else {
          expand();
        }
      });
      

      var currentTransition;
      var doTransition = function(change) {
        if ( currentTransition ) {
          currentTransition.cancel();
        }
        currentTransition = $transition(element,change);
        currentTransition.then(
          function() { currentTransition = undefined; },
          function() { currentTransition = undefined; }
        );
        return currentTransition;
      };

      var expand = function() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          if ( !isCollapsed ) {
            fixUpHeight(scope, element, 'auto');
          }
        } else {
          doTransition({ height : element[0].scrollHeight + 'px' })
          .then(function() {
            // This check ensures that we don't accidentally update the height if the user has closed
            // the group while the animation was still running
            if ( !isCollapsed ) {
              fixUpHeight(scope, element, 'auto');
            }
          });
        }
        isCollapsed = false;
      };
      
      var collapse = function() {
        isCollapsed = true;
        if (initialAnimSkip) {
          initialAnimSkip = false;
          fixUpHeight(scope, element, 0);
        } else {
          fixUpHeight(scope, element, element[0].scrollHeight + 'px');
          doTransition({'height':'0'});
        }
      };
    }
  };
}]);

// The `$dialogProvider` can be used to configure global defaults for your
// `$dialog` service.
var dialogModule = angular.module('ui.bootstrap.dialog', ['ui.bootstrap.transition']);

dialogModule.controller('MessageBoxController', ['$scope', 'dialog', 'model', function($scope, dialog, model){
  $scope.title = model.title;
  $scope.message = model.message;
  $scope.buttons = model.buttons;
  $scope.close = function(res){
    dialog.close(res);
  };
}]);

dialogModule.provider("$dialog", function(){

  // The default options for all dialogs.
  var defaults = {
    backdrop: true,
    dialogClass: 'modal',
    backdropClass: 'modal-backdrop',
    transitionClass: 'fade',
    triggerClass: 'in',
    dialogOpenClass: 'modal-open',  
    resolve:{},
    backdropFade: false,
    dialogFade:false,
    keyboard: true, // close with esc key
    backdropClick: true // only in conjunction with backdrop=true
    /* other options: template, templateUrl, controller */
	};

	var globalOptions = {};

  var activeBackdrops = {value : 0};

  // The `options({})` allows global configuration of all dialogs in the application.
  //
  //      var app = angular.module('App', ['ui.bootstrap.dialog'], function($dialogProvider){
  //        // don't close dialog when backdrop is clicked by default
  //        $dialogProvider.options({backdropClick: false});
  //      });
	this.options = function(value){
		globalOptions = value;
	};

  // Returns the actual `$dialog` service that is injected in controllers
	this.$get = ["$http", "$document", "$compile", "$rootScope", "$controller", "$templateCache", "$q", "$transition", "$injector",
  function ($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $transition, $injector) {

		var body = $document.find('body');

		function createElement(clazz) {
			var el = angular.element("<div>");
			el.addClass(clazz);
			return el;
		}

    // The `Dialog` class represents a modal dialog. The dialog class can be invoked by providing an options object
    // containing at lest template or templateUrl and controller:
    //
    //     var d = new Dialog({templateUrl: 'foo.html', controller: 'BarController'});
    //
    // Dialogs can also be created using templateUrl and controller as distinct arguments:
    //
    //     var d = new Dialog('path/to/dialog.html', MyDialogController);
		function Dialog(opts) {

      var self = this, options = this.options = angular.extend({}, defaults, globalOptions, opts);

      this.backdropEl = createElement(options.backdropClass);
      if(options.backdropFade){
        this.backdropEl.addClass(options.transitionClass);
        this.backdropEl.removeClass(options.triggerClass);
      }

      this.modalEl = createElement(options.dialogClass);
      if(options.dialogFade){
        this.modalEl.addClass(options.transitionClass);
        this.modalEl.removeClass(options.triggerClass);
      }

      this.handledEscapeKey = function(e) {
        if (e.which === 27) {
          self.close();
          e.preventDefault();
          self.$scope.$apply();
        }
      };

      this.handleBackDropClick = function(e) {
        self.close();
        e.preventDefault();
        self.$scope.$apply();
      };
    }

    // The `isOpen()` method returns wether the dialog is currently visible.
    Dialog.prototype.isOpen = function(){
      return this._open;
    };

    // The `open(templateUrl, controller)` method opens the dialog.
    // Use the `templateUrl` and `controller` arguments if specifying them at dialog creation time is not desired.
    Dialog.prototype.open = function(templateUrl, controller){
      var self = this, options = this.options;

      if(templateUrl){
        options.templateUrl = templateUrl;
      }
      if(controller){
        options.controller = controller;
      }

      if(!(options.template || options.templateUrl)) {
        throw new Error('Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.');
      }

      this._loadResolves().then(function(locals) {
        var $scope = locals.$scope = self.$scope = locals.$scope ? locals.$scope : $rootScope.$new();

        self.modalEl.html(locals.$template);

        if (self.options.controller) {
          var ctrl = $controller(self.options.controller, locals);
          self.modalEl.contents().data('ngControllerController', ctrl);
        }

        $compile(self.modalEl)($scope);
        self._addElementsToDom();
        body.addClass(self.options.dialogOpenClass);

        // trigger tranisitions
        setTimeout(function(){
          if(self.options.dialogFade){ self.modalEl.addClass(self.options.triggerClass); }
          if(self.options.backdropFade){ self.backdropEl.addClass(self.options.triggerClass); }
        });

        self._bindEvents();
      });

      this.deferred = $q.defer();
      return this.deferred.promise;
    };

    // closes the dialog and resolves the promise returned by the `open` method with the specified result.
    Dialog.prototype.close = function(result){
      var self = this;
      var fadingElements = this._getFadingElements();

      body.removeClass(self.options.dialogOpenClass);
      if(fadingElements.length > 0){
        for (var i = fadingElements.length - 1; i >= 0; i--) {
          $transition(fadingElements[i], removeTriggerClass).then(onCloseComplete);
        }
        return;
      }

      this._onCloseComplete(result);

      function removeTriggerClass(el){
        el.removeClass(self.options.triggerClass);
      }

      function onCloseComplete(){
        if(self._open){
          self._onCloseComplete(result);
        }
      }
    };

    Dialog.prototype._getFadingElements = function(){
      var elements = [];
      if(this.options.dialogFade){
        elements.push(this.modalEl);
      }
      if(this.options.backdropFade){
        elements.push(this.backdropEl);
      }

      return elements;
    };

    Dialog.prototype._bindEvents = function() {
      if(this.options.keyboard){ body.bind('keydown', this.handledEscapeKey); }
      if(this.options.backdrop && this.options.backdropClick){ this.backdropEl.bind('click', this.handleBackDropClick); }
    };

    Dialog.prototype._unbindEvents = function() {
      if(this.options.keyboard){ body.unbind('keydown', this.handledEscapeKey); }
      if(this.options.backdrop && this.options.backdropClick){ this.backdropEl.unbind('click', this.handleBackDropClick); }
    };

    Dialog.prototype._onCloseComplete = function(result) {
      this._removeElementsFromDom();
      this._unbindEvents();

      this.deferred.resolve(result);
    };

    Dialog.prototype._addElementsToDom = function(){
      body.append(this.modalEl);

      if(this.options.backdrop) { 
        if (activeBackdrops.value === 0) {
          body.append(this.backdropEl); 
        }
        activeBackdrops.value++;
      }

      this._open = true;
    };

    Dialog.prototype._removeElementsFromDom = function(){
      this.modalEl.remove();

      if(this.options.backdrop) { 
        activeBackdrops.value--;
        if (activeBackdrops.value === 0) {
          this.backdropEl.remove(); 
        }
      }
      this._open = false;
    };

    // Loads all `options.resolve` members to be used as locals for the controller associated with the dialog.
    Dialog.prototype._loadResolves = function(){
      var values = [], keys = [], templatePromise, self = this;

      if (this.options.template) {
        templatePromise = $q.when(this.options.template);
      } else if (this.options.templateUrl) {
        templatePromise = $http.get(this.options.templateUrl, {cache:$templateCache})
        .then(function(response) { return response.data; });
      }

      angular.forEach(this.options.resolve || [], function(value, key) {
        keys.push(key);
        values.push(angular.isString(value) ? $injector.get(value) : $injector.invoke(value));
      });

      keys.push('$template');
      values.push(templatePromise);

      return $q.all(values).then(function(values) {
        var locals = {};
        angular.forEach(values, function(value, index) {
          locals[keys[index]] = value;
        });
        locals.dialog = self;
        return locals;
      });
    };

    // The actual `$dialog` service that is injected in controllers.
    return {
      // Creates a new `Dialog` with the specified options.
      dialog: function(opts){
        return new Dialog(opts);
      },
      // creates a new `Dialog` tied to the default message box template and controller.
      //
      // Arguments `title` and `message` are rendered in the modal header and body sections respectively.
      // The `buttons` array holds an object with the following members for each button to include in the
      // modal footer section:
      //
      // * `result`: the result to pass to the `close` method of the dialog when the button is clicked
      // * `label`: the label of the button
      // * `cssClass`: additional css class(es) to apply to the button for styling
      messageBox: function(title, message, buttons){
        return new Dialog({templateUrl: 'template/dialog/message.html', controller: 'MessageBoxController', resolve:
          {model: function() {
            return {
              title: title,
              message: message,
              buttons: buttons
            };
          }
        }});
      }
    };
  }];
});

/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 * @restrict class or attribute
 * @example:
   <li class="dropdown">
     <a class="dropdown-toggle">My Dropdown Menu</a>
     <ul class="dropdown-menu">
       <li ng-repeat="choice in dropChoices">
         <a ng-href="{{choice.href}}">{{choice.text}}</a>
       </li>
     </ul>
   </li>
 */

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', 
['$document', '$location', '$window', function ($document, $location, $window) {
  var openElement = null, close;
  return {
    restrict: 'CA',
    link: function(scope, element, attrs) {
      scope.$watch(function dropdownTogglePathWatch(){return $location.path();}, function dropdownTogglePathWatchAction() {
        if (close) { close(); }
      });

      element.parent().bind('click', function(event) {
        if (close) { close(); }
      });

      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var iWasOpen = false;

        if (openElement) {
          iWasOpen = openElement === element;
          close();
        }

        if (!iWasOpen){
          element.parent().addClass('open');
          openElement = element;

          close = function (event) {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            $document.unbind('click', close);
            element.parent().removeClass('open');
            close = null;
            openElement = null;
          };

          $document.bind('click', close);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.modal', ['ui.bootstrap.dialog'])
.directive('modal', ['$parse', '$dialog', function($parse, $dialog) {
  var backdropEl;
  var body = angular.element(document.getElementsByTagName('body')[0]);
  return {
    restrict: 'EA',
    terminal: true,
    link: function(scope, elm, attrs) {
      var opts = angular.extend({}, scope.$eval(attrs.uiOptions || attrs.bsOptions || attrs.options));
      var shownExpr = attrs.modal || attrs.show;
      var setClosed;

      // Create a dialog with the template as the contents of the directive
      // Add the current scope as the resolve in order to make the directive scope as a dialog controller scope
      opts = angular.extend(opts, {
        template: elm.html(), 
        resolve: { $scope: function() { return scope; } }
      });
      var dialog = $dialog.dialog(opts);

      elm.remove();

      if (attrs.close) {
        setClosed = function() {
          $parse(attrs.close)(scope);
        };
      } else {
        setClosed = function() {         
          if (angular.isFunction($parse(shownExpr).assign)) {
            $parse(shownExpr).assign(scope, false); 
          }
        };
      }

      scope.$watch(shownExpr, function(isShown, oldShown) {
        if (isShown) {
          dialog.open().then(function(){
            setClosed();
          });
        } else {
          //Make sure it is not opened
          if (dialog.isOpen()){
            dialog.close();
          }
        }
      });
    }
  };
}]);
angular.module('ui.bootstrap.pagination', [])

.constant('paginationConfig', {
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last'
})

.directive('pagination', ['paginationConfig', function(paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      numPages: '=',
      currentPage: '=',
      maxSize: '=',
      onSelectPage: '&'
    },
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs) {

      // Setup configuration parameters
      var boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      var directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$eval(attrs.directionLinks) : paginationConfig.directionLinks;
      var firstText = angular.isDefined(attrs.firstText) ? attrs.firstText : paginationConfig.firstText;
      var previousText = angular.isDefined(attrs.previousText) ? attrs.previousText : paginationConfig.previousText;
      var nextText = angular.isDefined(attrs.nextText) ? attrs.nextText : paginationConfig.nextText;
      var lastText = angular.isDefined(attrs.lastText) ? attrs.lastText : paginationConfig.lastText;

      // Create page object used in template
      function makePage(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }

      scope.$watch('numPages + currentPage + maxSize', function() {
        scope.pages = [];
        
        //set the default maxSize to numPages
        var maxSize = ( scope.maxSize && scope.maxSize < scope.numPages ) ? scope.maxSize : scope.numPages;
        var startPage = scope.currentPage - Math.floor(maxSize/2);
        
        //adjust the startPage within boundary
        if(startPage < 1) {
            startPage = 1;
        }
        if ((startPage + maxSize - 1) > scope.numPages) {
            startPage = startPage - ((startPage + maxSize - 1) - scope.numPages );
        }

        // Add page number links
        for (var number = startPage, max = startPage + maxSize; number < max; number++) {
          var page = makePage(number, number, scope.isActive(number), false);
          scope.pages.push(page);
        }

        // Add previous & next links
        if (directionLinks) {
          var previousPage = makePage(scope.currentPage - 1, previousText, false, scope.noPrevious());
          scope.pages.unshift(previousPage);

          var nextPage = makePage(scope.currentPage + 1, nextText, false, scope.noNext());
          scope.pages.push(nextPage);
        }

        // Add first & last links
        if (boundaryLinks) {
          var firstPage = makePage(1, firstText, false, scope.noPrevious());
          scope.pages.unshift(firstPage);

          var lastPage = makePage(scope.numPages, lastText, false, scope.noNext());
          scope.pages.push(lastPage);
        }


        if ( scope.currentPage > scope.numPages ) {
          scope.selectPage(scope.numPages);
        }
      });
      scope.noPrevious = function() {
        return scope.currentPage === 1;
      };
      scope.noNext = function() {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function(page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function(page) {
        if ( ! scope.isActive(page) && page > 0 && page <= scope.numPages) {
          scope.currentPage = page;
          scope.onSelectPage({ page: page });
        }
      };
    }
  };
}]);
/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'ui.bootstrap.popover', [] )
.directive( 'popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { popoverTitle: '@', popoverContent: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})
.directive( 'popover', [ '$compile', '$timeout', '$parse', '$window', function ( $compile, $timeout, $parse, $window ) {
  
  var template = 
    '<popover-popup '+
      'popover-title="{{tt_title}}" '+
      'popover-content="{{tt_popover}}" '+
      'placement="{{tt_placement}}" '+
      'animation="tt_animation()" '+
      'is-open="tt_isOpen"'+
      '>'+
    '</popover-popup>';
  
  return {
    scope: true,
    link: function ( scope, element, attr ) {
      var popover = $compile( template )( scope ), 
          transitionTimeout;

      attr.$observe( 'popover', function ( val ) {
        scope.tt_popover = val;
      });

      attr.$observe( 'popoverTitle', function ( val ) {
        scope.tt_title = val;
      });

      attr.$observe( 'popoverPlacement', function ( val ) {
        // If no placement was provided, default to 'top'.
        scope.tt_placement = val || 'top';
      });

      attr.$observe( 'popoverAnimation', function ( val ) {
        scope.tt_animation = $parse( val );
      });

      // By default, the popover is not open.
      scope.tt_isOpen = false;
      
      // Calculate the current position and size of the directive element.
      function getPosition() {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: element.prop( 'offsetWidth' ),
          height: element.prop( 'offsetHeight' ),
          top: boundingClientRect.top + $window.pageYOffset,
          left: boundingClientRect.left + $window.pageXOffset
        };
      }

      function show() {
        var position,
            ttWidth,
            ttHeight,
            ttPosition;
          
        // If there is a pending remove transition, we must cancel it, lest the
        // toolip be mysteriously removed.
        if ( transitionTimeout ) {
          $timeout.cancel( transitionTimeout );
        }
        
        // Set the initial positioning.
        popover.css({ top: 0, left: 0, display: 'block' });
        
        // Now we add it to the DOM because need some info about it. But it's not 
        // visible yet anyway.
        element.after( popover );
        
        // Get the position of the directive element.
        position = getPosition();
        
        // Get the height and width of the popover so we can center it.
        ttWidth = popover.prop( 'offsetWidth' );
        ttHeight = popover.prop( 'offsetHeight' );
        
        // Calculate the popover's top and left coordinates to center it with
        // this directive.
        switch ( scope.tt_placement ) {
          case 'right':
            ttPosition = {
              top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
              left: (position.left + position.width) + 'px'
            };
            break;
          case 'bottom':
            ttPosition = {
              top: (position.top + position.height) + 'px',
              left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
            };
            break;
          case 'left':
            ttPosition = {
              top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
              left: (position.left - ttWidth) + 'px'
            };
            break;
          default:
            ttPosition = {
              top: (position.top - ttHeight) + 'px',
              left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
            };
            break;
        }
        
        // Now set the calculated positioning.
        popover.css( ttPosition );
          
        // And show the popover.
        scope.tt_isOpen = true;
      }
      
      // Hide the popover popup element.
      function hide() {
        // First things first: we don't show it anymore.
        //popover.removeClass( 'in' );
        scope.tt_isOpen = false;
        
        // And now we remove it from the DOM. However, if we have animation, we 
        // need to wait for it to expire beforehand.
        // FIXME: this is a placeholder for a port of the transitions library.
        if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {
          transitionTimeout = $timeout( function () { popover.remove(); }, 500 );
        } else {
          popover.remove();
        }
      }
      
      // Register the event listeners.
      element.bind( 'click', function() {
        if(scope.tt_isOpen){
            scope.$apply( hide );
        } else {
            scope.$apply( show );
        }

      });
    }
  };
}]);


angular.module('ui.bootstrap.tabs', [])
.controller('TabsController', ['$scope', '$element', function($scope, $element) {
  var panes = $scope.panes = [];

  this.select = $scope.select = function selectPane(pane) {
    angular.forEach(panes, function(pane) {
      pane.selected = false;
    });
    pane.selected = true;
  };

  this.addPane = function addPane(pane) {
    if (!panes.length) {
      $scope.select(pane);
    }
    panes.push(pane);
  };

  this.removePane = function removePane(pane) { 
    var index = panes.indexOf(pane);
    panes.splice(index, 1);
    //Select a new pane if removed pane was selected 
    if (pane.selected && panes.length > 0) {
      $scope.select(panes[index < panes.length ? index : index-1]);
    }
  };
}])
.directive('tabs', function() {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: 'TabsController',
    templateUrl: 'template/tabs/tabs.html',
    replace: true
  };
})
.directive('pane', ['$parse', function($parse) {
  return {
    require: '^tabs',
    restrict: 'EA',
    transclude: true,
    scope:{
      heading:'@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      var getSelected, setSelected;
      scope.selected = false;
      if (attrs.active) {
        getSelected = $parse(attrs.active);
        setSelected = getSelected.assign;
        scope.$watch(
          function watchSelected() {return getSelected(scope.$parent);},
          function updateSelected(value) {scope.selected = value;}
        );
        scope.selected = getSelected ? getSelected(scope.$parent) : false;
      }
      scope.$watch('selected', function(selected) {
        if(selected) {
          tabsCtrl.select(scope);
        }
        if(setSelected) {
          setSelected(scope.$parent, selected);
        }
      });

      tabsCtrl.addPane(scope);
      scope.$on('$destroy', function() {
        tabsCtrl.removePane(scope);
      });
    },
    templateUrl: 'template/tabs/pane.html',
    replace: true
  };
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegatation.
 */
angular.module( 'ui.bootstrap.tooltip', [] )
.directive( 'tooltipPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { tooltipTitle: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
})
.directive( 'tooltip', [ '$compile', '$timeout', '$parse', '$window', function ( $compile, $timeout, $parse, $window) {
  
  var template = 
    '<tooltip-popup '+
      'tooltip-title="{{tt_tooltip}}" '+
      'placement="{{tt_placement}}" '+
      'animation="tt_animation()" '+
      'is-open="tt_isOpen"'+
      '>'+
    '</tooltip-popup>';
  
  return {
    scope: true,
    link: function ( scope, element, attr ) {
      var tooltip = $compile( template )( scope ), 
          transitionTimeout;

      attr.$observe( 'tooltip', function ( val ) {
        scope.tt_tooltip = val;
      });

      attr.$observe( 'tooltipPlacement', function ( val ) {
        // If no placement was provided, default to 'top'.
        scope.tt_placement = val || 'top';
      });

      attr.$observe( 'tooltipAnimation', function ( val ) {
        scope.tt_animation = $parse( val );
      });

      // By default, the tooltip is not open.
      scope.tt_isOpen = false;
      
      // Calculate the current position and size of the directive element.
      function getPosition() {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: element.prop( 'offsetWidth' ),
          height: element.prop( 'offsetHeight' ),
          top: boundingClientRect.top + $window.pageYOffset,
          left: boundingClientRect.left + $window.pageXOffset
        };
      }
      
      // Show the tooltip popup element.
      function show() {
        var position,
            ttWidth,
            ttHeight,
            ttPosition;

        //don't show empty tooltips
        if (!scope.tt_tooltip) {
          return;
        }

        // If there is a pending remove transition, we must cancel it, lest the
        // toolip be mysteriously removed.
        if ( transitionTimeout ) {
          $timeout.cancel( transitionTimeout );
        }
        
        // Set the initial positioning.
        tooltip.css({ top: 0, left: 0, display: 'block' });
        
        // Now we add it to the DOM because need some info about it. But it's not 
        // visible yet anyway.
        element.after( tooltip );
        
        // Get the position of the directive element.
        position = getPosition();

        // Get the height and width of the tooltip so we can center it.
        ttWidth = tooltip.prop( 'offsetWidth' );
        ttHeight = tooltip.prop( 'offsetHeight' );
        
        // Calculate the tooltip's top and left coordinates to center it with
        // this directive.
        switch ( scope.tt_placement ) {
          case 'right':
            ttPosition = {
              top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
              left: (position.left + position.width) + 'px'
            };
            break;
          case 'bottom':
            ttPosition = {
              top: (position.top + position.height) + 'px',
              left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
            };
            break;
          case 'left':
            ttPosition = {
              top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
              left: (position.left - ttWidth) + 'px'
            };
            break;
          default:
            ttPosition = {
              top: (position.top - ttHeight) + 'px',
              left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
            };
            break;
        }
        
        // Now set the calculated positioning.
        tooltip.css( ttPosition );
          
        // And show the tooltip.
        scope.tt_isOpen = true;
      }
      
      // Hide the tooltip popup element.
      function hide() {
        // First things first: we don't show it anymore.
        //tooltip.removeClass( 'in' );
        scope.tt_isOpen = false;
        
        // And now we remove it from the DOM. However, if we have animation, we 
        // need to wait for it to expire beforehand.
        // FIXME: this is a placeholder for a port of the transitions library.
        if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {
          transitionTimeout = $timeout( function () { tooltip.remove(); }, 500 );
        } else {
          tooltip.remove();
        }
      }
      
      // Register the event listeners.
      element.bind( 'mouseenter', function() {
        scope.$apply( show );
      });
      element.bind( 'mouseleave', function() {
        scope.$apply( hide );
      });
    }
  };
}]);


angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'msTransition': 'MSAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

angular.module('ui.bootstrap.typeahead', [])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
      if (!match) {
        throw new Error(
          "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
            " but got '" + input + "'.");
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  //options - min length
  .directive('typeahead', ['$compile', '$q', 'typeaheadParser', function ($compile, $q, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      var selected = modelCtrl.$modelValue;

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
      };

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        $q.when(parserResult.source(scope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          if (inputValue === modelCtrl.$viewValue) {
            if (matches.length > 0) {

              scope.activeIdx = 0;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;

            } else {
              resetMatches();
            }
          }
        }, resetMatches);
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the vview as well as manually triggered by $setViewValue
      modelCtrl.$parsers.push(function (inputValue) {

        resetMatches();
        if (selected) {
          return inputValue;
        } else {
          if (inputValue && inputValue.length >= minSearch) {
            getMatchesAsync(inputValue);
          }
        }

        return undefined;
      });

      modelCtrl.$render = function () {
        var locals = {};
        locals[parserResult.itemName] = selected;
        element.val(parserResult.viewMapper(scope, locals) || modelCtrl.$viewValue);
        selected = undefined;
      };

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        locals[parserResult.itemName] = selected = scope.matches[activeIdx].model;

        modelCtrl.$setViewValue(parserResult.modelMapper(scope, locals));
        modelCtrl.$render();
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(9)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          scope.matches = [];
          scope.$digest();
        }
      });

      var tplElCompiled = $compile("<typeahead-popup matches='matches' active='activeIdx' select='select(activeIdx)' "+
        "query='query'></typeahead-popup>")(scope);
      element.after(tplElCompiled);
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'E',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead.html',
      link:function (scope, element, attrs) {

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .filter('typeaheadHighlight', function() {
    return function(matchItem, query) {
      return (query) ? matchItem.replace(new RegExp(query, 'gi'), '<strong>$&</strong>') : query;
    };
  });
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"accordion-group\">" +
    "  <div class=\"accordion-heading\" ><a class=\"accordion-toggle\" ng-click=\"isOpen = !isOpen\" accordion-transclude=\"heading\">{{heading}}</a></div>" +
    "  <div class=\"accordion-body\" collapse=\"!isOpen\">" +
    "    <div class=\"accordion-inner\" ng-transclude></div>  </div>" +
    "</div>");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/accordion/accordion.html",
    "<div class=\"accordion\" ng-transclude></div>");
}]);

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/alert/alert.html",
    "<div class='alert' ng-class='type && \"alert-\" + type'>" +
    "    <button type='button' class='close' ng-click='close()'>&times;</button>" +
    "    <div ng-transclude></div>" +
    "</div>");
}]);

angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/carousel/carousel.html",
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\">" +
    "    <ol class=\"carousel-indicators\">" +
    "        <li ng-repeat=\"slide in slides()\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>" +
    "    </ol>" +
    "    <div class=\"carousel-inner\" ng-transclude></div>" +
    "    <a ng-click=\"prev()\" class=\"carousel-control left\">&lsaquo;</a>" +
    "    <a ng-click=\"next()\" class=\"carousel-control right\">&rsaquo;</a>" +
    "</div>" +
    "");
}]);

angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/carousel/slide.html",
    "<div ng-class=\"{" +
    "    'active': leaving || (active && !entering)," +
    "    'prev': (next || active) && direction=='prev'," +
    "    'next': (next || active) && direction=='next'," +
    "    'right': direction=='prev'," +
    "    'left': direction=='next'" +
    "  }\" class=\"item\" ng-transclude></div>" +
    "");
}]);

angular.module("template/dialog/message.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/dialog/message.html",
    "<div class=\"modal-header\">" +
    "	<h1>{{ title }}</h1>" +
    "</div>" +
    "<div class=\"modal-body\">" +
    "	<p>{{ message }}</p>" +
    "</div>" +
    "<div class=\"modal-footer\">" +
    "	<button ng-repeat=\"btn in buttons\" ng-click=\"close(btn.result)\" class=btn ng-class=\"btn.cssClass\">{{ btn.label }}</button>" +
    "</div>" +
    "");
}]);

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/pagination/pagination.html",
    "<div class=\"pagination\"><ul>" +
    "  <li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>" +
    "  </ul>" +
    "</div>" +
    "");
}]);

angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/popover/popover.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">" +
    "  <div class=\"arrow\"></div>" +
    "" +
    "  <div class=\"popover-inner\">" +
    "      <h3 class=\"popover-title\" ng-bind=\"popoverTitle\" ng-show=\"popoverTitle\"></h3>" +
    "      <div class=\"popover-content\" ng-bind=\"popoverContent\"></div>" +
    "  </div>" +
    "</div>" +
    "");
}]);

angular.module("template/tabs/pane.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/tabs/pane.html",
    "<div class=\"tab-pane\" ng-class=\"{active: selected}\" ng-show=\"selected\" ng-transclude></div>" +
    "");
}]);

angular.module("template/tabs/tabs.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/tabs/tabs.html",
    "<div class=\"tabbable\">" +
    "  <ul class=\"nav nav-tabs\">" +
    "    <li ng-repeat=\"pane in panes\" ng-class=\"{active:pane.selected}\">" +
    "      <a href=\"\" ng-click=\"select(pane)\">{{pane.heading}}</a>" +
    "    </li>" +
    "  </ul>" +
    "  <div class=\"tab-content\" ng-transclude></div>" +
    "</div>" +
    "");
}]);

angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">" +
    "  <div class=\"tooltip-arrow\"></div>" +
    "  <div class=\"tooltip-inner\" ng-bind=\"tooltipTitle\"></div>" +
    "</div>" +
    "");
}]);

angular.module("template/typeahead/typeahead.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/typeahead/typeahead.html",
    "<div class=\"dropdown clearfix\" ng-class=\"{open: isOpen()}\">" +
    "    <ul class=\"typeahead dropdown-menu\">" +
    "        <li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\">" +
    "            <a tabindex=\"-1\" ng-click=\"selectMatch($index)\" ng-bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>" +
    "        </li>" +
    "    </ul>" +
    "</div>");
}]);

;
//*/js/epiceditor.min.js*//
/**
 * EpicEditor - An Embeddable JavaScript Markdown Editor (https://github.com/OscarGodson/EpicEditor)
 * Copyright (c) 2011-2012, Oscar Godson. (MIT Licensed)
 */(function(e,t){function n(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}function r(e,t){for(var n in t)t.hasOwnProperty(n)&&(e.style[n]=t[n])}function i(t,n){var r=t,i=null;return e.getComputedStyle?i=document.defaultView.getComputedStyle(r,null).getPropertyValue(n):r.currentStyle&&(i=r.currentStyle[n]),i}function s(e,t,n){var s={},o;if(t==="save"){for(o in n)n.hasOwnProperty(o)&&(s[o]=i(e,o));r(e,n)}else t==="apply"&&r(e,n);return s}function o(e){var t=parseInt(i(e,"border-left-width"),10)+parseInt(i(e,"border-right-width"),10),n=parseInt(i(e,"padding-left"),10)+parseInt(i(e,"padding-right"),10),r=e.offsetWidth,s;return isNaN(t)&&(t=0),s=t+n+r,s}function u(e){var t=parseInt(i(e,"border-top-width"),10)+parseInt(i(e,"border-bottom-width"),10),n=parseInt(i(e,"padding-top"),10)+parseInt(i(e,"padding-bottom"),10),r=e.offsetHeight,s;return isNaN(t)&&(t=0),s=t+n+r,s}function a(e,t,r){r=r||"";var i=t.getElementsByTagName("head")[0],s=t.createElement("link");n(s,{type:"text/css",id:r,rel:"stylesheet",href:e,name:e,media:"screen"}),i.appendChild(s)}function f(e,t,n){e.className=e.className.replace(t,n)}function l(e){return e.contentDocument||e.contentWindow.document}function c(e){var t;return typeof document.body.innerText=="string"?t=e.innerText:(t=e.innerHTML.replace(/<br>/gi,"\n"),t=t.replace(/<(?:.|\n)*?>/gm,""),t=t.replace(/&lt;/gi,"<"),t=t.replace(/&gt;/gi,">")),t}function h(e,t){return typeof document.body.innerText=="string"?(t=t.replace(/ /g," "),e.innerText=t):(t=t.replace(/</g,"&lt;"),t=t.replace(/>/g,"&gt;"),t=t.replace(/\n/g,"<br>"),t=t.replace(/\s\s/g," &nbsp;"),e.innerHTML=t),!0}function p(){var e=-1,t=navigator.userAgent,n;return navigator.appName=="Microsoft Internet Explorer"&&(n=/MSIE ([0-9]{1,}[\.0-9]{0,})/,n.exec(t)!=null&&(e=parseFloat(RegExp.$1,10))),e}function d(){var t=e.navigator;return t.userAgent.indexOf("Safari")>-1&&t.userAgent.indexOf("Chrome")==-1}function v(e){var t={};return e&&t.toString.call(e)==="[object Function]"}function m(){var e=arguments[0]||{},n=1,r=arguments.length,i=!1,s,o,u,a;typeof e=="boolean"&&(i=e,e=arguments[1]||{},n=2),typeof e!="object"&&!v(e)&&(e={}),r===n&&(e=this,--n);for(;n<r;n++)if((s=arguments[n])!=null)for(o in s)if(s.hasOwnProperty(o)){u=e[o],a=s[o];if(e===a)continue;i&&a&&typeof a=="object"&&!a.nodeType?e[o]=m(i,u||(a.length!=null?[]:{}),a):a!==t&&(e[o]=a)}return e}function g(e){var n=this,r=e||{},i,s,o={container:"epiceditor",basePath:"epiceditor",textarea:t,clientSideStorage:!0,localStorageName:"epiceditor",useNativeFullscreen:!0,file:{name:null,defaultContent:"",autoSave:100},theme:{base:"/themes/base/epiceditor.css",preview:"/themes/preview/github.css",editor:"/themes/editor/epic-dark.css"},focusOnLoad:!1,shortcut:{modifier:18,fullscreen:70,preview:80},string:{togglePreview:"Toggle Preview Mode",toggleEdit:"Toggle Edit Mode",toggleFullscreen:"Enter Fullscreen"},parser:typeof marked=="function"?marked:null,button:{fullscreen:!0,preview:!0}},u;n.settings=m(!0,o,r);var a=n.settings.button;n._fullscreenEnabled=typeof a=="object"?typeof a.fullscreen=="undefined"||a.fullscreen:a===!0,n._editEnabled=typeof a=="object"?typeof a.edit=="undefined"||a.edit:a===!0,n._previewEnabled=typeof a=="object"?typeof a.preview=="undefined"||a.preview:a===!0;if(typeof n.settings.parser!="function"||typeof n.settings.parser("TEST")!="string")n.settings.parser=function(e){return e};return n.settings.theme.preview.match(/^https?:\/\//)||(n.settings.theme.preview=n.settings.basePath+n.settings.theme.preview),n.settings.theme.editor.match(/^https?:\/\//)||(n.settings.theme.editor=n.settings.basePath+n.settings.theme.editor),n.settings.theme.base.match(/^https?:\/\//)||(n.settings.theme.base=n.settings.basePath+n.settings.theme.base),typeof n.settings.container=="string"?n.element=document.getElementById(n.settings.container):typeof n.settings.container=="object"&&(n.element=n.settings.container),n.settings.file.name||(typeof n.settings.container=="string"?n.settings.file.name=n.settings.container:typeof n.settings.container=="object"&&(n.element.id?n.settings.file.name=n.element.id:(g._data.unnamedEditors||(g._data.unnamedEditors=[]),g._data.unnamedEditors.push(n),n.settings.file.name="__epiceditor-untitled-"+g._data.unnamedEditors.length))),n._instanceId="epiceditor-"+Math.round(Math.random()*1e5),n._storage={},n._canSave=!0,n._defaultFileSchema=function(){return{content:n.settings.file.defaultContent,created:new Date,modified:new Date}},localStorage&&n.settings.clientSideStorage&&(this._storage=localStorage,this._storage[n.settings.localStorageName]&&n.getFiles(n.settings.file.name)===t&&(s=n.getFiles(n.settings.file.name),s=n._defaultFileSchema(),s.content=n.settings.file.defaultContent)),this._storage[n.settings.localStorageName]||(u={},u[n.settings.file.name]=n._defaultFileSchema(),u=JSON.stringify(u),this._storage[n.settings.localStorageName]=u),n._previewDraftLocation="__draft-",n._storage[n._previewDraftLocation+n.settings.localStorageName]=n._storage[n.settings.localStorageName],n._eeState={fullscreen:!1,preview:!1,edit:!1,loaded:!1,unloaded:!1},n.events||(n.events={}),this}g.prototype.load=function(t){function O(t){if(Math.abs(g.y-t.pageY)>=5||Math.abs(g.x-t.pageX)>=5)h.style.display="block",v&&clearTimeout(v),v=e.setTimeout(function(){h.style.display="none"},1e3);g={y:t.pageY,x:t.pageX}}function M(e){e.keyCode==n.settings.shortcut.modifier&&(N=!0),e.keyCode==17&&(C=!0),N===!0&&e.keyCode==n.settings.shortcut.preview&&!n.is("fullscreen")&&(e.preventDefault(),n.is("edit")&&n._previewEnabled?n.preview():n._editEnabled&&n.edit()),N===!0&&e.keyCode==n.settings.shortcut.fullscreen&&n._fullscreenEnabled&&(e.preventDefault(),n._goFullscreen(T)),N===!0&&e.keyCode!==n.settings.shortcut.modifier&&(N=!1),e.keyCode==27&&n.is("fullscreen")&&n._exitFullscreen(T),C===!0&&e.keyCode==83&&(n.save(),e.preventDefault(),C=!1),e.metaKey&&e.keyCode==83&&(n.save(),e.preventDefault())}function _(e){e.keyCode==n.settings.shortcut.modifier&&(N=!1),e.keyCode==17&&(C=!1)}if(this.is("loaded"))return this;var n=this,o,u,f,c,h,v,m,g={y:-1,x:-1},y,b,w=!1,E=!1,S=!1,x=!1,T,N=!1,C=!1,k,L,A;n.settings.useNativeFullscreen&&(E=document.body.webkitRequestFullScreen?!0:!1,S=document.body.mozRequestFullScreen?!0:!1,x=document.body.requestFullscreen?!0:!1,w=E||S||x),d()&&(w=!1,E=!1),!n.is("edit")&&!n.is("preview")&&(n._eeState.edit=!0),t=t||function(){},o={chrome:'<div id="epiceditor-wrapper" class="epiceditor-edit-mode"><iframe frameborder="0" id="epiceditor-editor-frame"></iframe><iframe frameborder="0" id="epiceditor-previewer-frame"></iframe><div id="epiceditor-utilbar">'+(n._previewEnabled?'<img width="30" src="'+this.settings.basePath+'/images/preview.png" title="'+this.settings.string.togglePreview+'" class="epiceditor-toggle-btn epiceditor-toggle-preview-btn"> ':"")+(n._editEnabled?'<img width="30" src="'+this.settings.basePath+'/images/edit.png" title="'+this.settings.string.toggleEdit+'" class="epiceditor-toggle-btn epiceditor-toggle-edit-btn"> ':"")+(n._fullscreenEnabled?'<img width="30" src="'+this.settings.basePath+'/images/fullscreen.png" title="'+this.settings.string.toggleFullscreen+'" class="epiceditor-fullscreen-btn">':"")+"</div>"+"</div>",previewer:'<div id="epiceditor-preview"></div>'},n.element.innerHTML='<iframe scrolling="no" frameborder="0" id= "'+n._instanceId+'"></iframe>',n.element.style.height=n.element.offsetHeight+"px",u=document.getElementById(n._instanceId),n.iframeElement=u,n.iframe=l(u),n.iframe.open(),n.iframe.write(o.chrome),n.editorIframe=n.iframe.getElementById("epiceditor-editor-frame"),n.previewerIframe=n.iframe.getElementById("epiceditor-previewer-frame"),n.editorIframeDocument=l(n.editorIframe),n.editorIframeDocument.open(),n.editorIframeDocument.write(""),n.editorIframeDocument.close(),n.previewerIframeDocument=l(n.previewerIframe),n.previewerIframeDocument.open(),n.previewerIframeDocument.write(o.previewer),f=n.previewerIframeDocument.createElement("base"),f.target="_blank",n.previewerIframeDocument.getElementsByTagName("head")[0].appendChild(f),n.previewerIframeDocument.close(),n.reflow(),a(n.settings.theme.base,n.iframe,"theme"),a(n.settings.theme.editor,n.editorIframeDocument,"theme"),a(n.settings.theme.preview,n.previewerIframeDocument,"theme"),n.iframe.getElementById("epiceditor-wrapper").style.position="relative",n.editor=n.editorIframeDocument.body,n.previewer=n.previewerIframeDocument.getElementById("epiceditor-preview"),n.editor.contentEditable=!0,n.iframe.body.style.height=this.element.offsetHeight+"px",this.previewerIframe.style.display="none",p()>-1&&(this.previewer.style.height=parseInt(i(this.previewer,"height"),10)+2),this.open(n.settings.file.name),n.settings.focusOnLoad&&n.iframe.addEventListener("readystatechange",function(){n.iframe.readyState=="complete"&&n.editorIframeDocument.body.focus()}),c=n.iframe.getElementById("epiceditor-utilbar"),y={},n._goFullscreen=function(t){if(n.is("fullscreen")){n._exitFullscreen(t);return}w&&(E?t.webkitRequestFullScreen():S?t.mozRequestFullScreen():x&&t.requestFullscreen()),b=n.is("edit"),n._eeState.fullscreen=!0,n._eeState.edit=!0,n._eeState.preview=!0;var r=e.innerWidth,o=e.innerHeight,u=e.outerWidth,a=e.outerHeight;w||(a=e.innerHeight),y.editorIframe=s(n.editorIframe,"save",{width:u/2+"px",height:a+"px","float":"left",cssFloat:"left",styleFloat:"left",display:"block"}),y.previewerIframe=s(n.previewerIframe,"save",{width:u/2+"px",height:a+"px","float":"right",cssFloat:"right",styleFloat:"right",display:"block"}),y.element=s(n.element,"save",{position:"fixed",top:"0",left:"0",width:"100%","z-index":"9999",zIndex:"9999",border:"none",margin:"0",background:i(n.editor,"background-color"),height:o+"px"}),y.iframeElement=s(n.iframeElement,"save",{width:u+"px",height:o+"px"}),c.style.visibility="hidden",w||(document.body.style.overflow="hidden"),n.preview(),n.editorIframeDocument.body.focus(),n.emit("fullscreenenter")},n._exitFullscreen=function(e){s(n.element,"apply",y.element),s(n.iframeElement,"apply",y.iframeElement),s(n.editorIframe,"apply",y.editorIframe),s(n.previewerIframe,"apply",y.previewerIframe),n.element.style.width=n._eeState.reflowWidth?n._eeState.reflowWidth:"",n.element.style.height=n._eeState.reflowHeight?n._eeState.reflowHeight:"",c.style.visibility="visible",n._eeState.fullscreen=!1,w?E?document.webkitCancelFullScreen():S?document.mozCancelFullScreen():x&&document.exitFullscreen():document.body.style.overflow="auto",b?n.edit():n.preview(),n.reflow(),n.emit("fullscreenexit")},n.editor.addEventListener("keyup",function(){m&&e.clearTimeout(m),m=e.setTimeout(function(){n.is("fullscreen")&&n.preview()},250)}),T=n.iframeElement,c.addEventListener("click",function(e){var t=e.target.className;t.indexOf("epiceditor-toggle-preview-btn")>-1?n.preview():t.indexOf("epiceditor-toggle-edit-btn")>-1?n.edit():t.indexOf("epiceditor-fullscreen-btn")>-1&&n._goFullscreen(T)}),E?document.addEventListener("webkitfullscreenchange",function(){!document.webkitIsFullScreen&&n._eeState.fullscreen&&n._exitFullscreen(T)},!1):S?document.addEventListener("mozfullscreenchange",function(){!document.mozFullScreen&&n._eeState.fullscreen&&n._exitFullscreen(T)},!1):x&&document.addEventListener("fullscreenchange",function(){document.fullscreenElement==null&&n._eeState.fullscreen&&n._exitFullscreen(T)},!1),h=n.iframe.getElementById("epiceditor-utilbar"),h.style.display="none",h.addEventListener("mouseover",function(){v&&clearTimeout(v)}),k=[n.previewerIframeDocument,n.editorIframeDocument];for(A=0;A<k.length;A++)k[A].addEventListener("mousemove",function(e){O(e)}),k[A].addEventListener("scroll",function(e){O(e)}),k[A].addEventListener("keyup",function(e){_(e)}),k[A].addEventListener("keydown",function(e){M(e)});return n.settings.file.autoSave&&(n._saveIntervalTimer=e.setInterval(function(){if(!n._canSave)return;n.save()},n.settings.file.autoSave)),n.settings.textarea&&(n._textareaSaveTimer=e.setInterval(function(){if(!n._canSave)return;n.save(!0)},100),L=n.settings.file.name,typeof n.settings.textarea=="string"?n._textareaElement=document.getElementById(n.settings.textarea):typeof n.settings.textarea=="object"&&(n._textareaElement=n.settings.textarea),n._textareaElement.value=n.exportFile(L,"text",!0),n.on("__update",function(){n._textareaElement.value=n.exportFile(L,"text",!0)})),e.addEventListener("resize",function(){n.is("fullscreen")?(r(n.iframeElement,{width:e.outerWidth+"px",height:e.innerHeight+"px"}),r(n.element,{height:e.innerHeight+"px"}),r(n.previewerIframe,{width:e.outerWidth/2+"px",height:e.innerHeight+"px"}),r(n.editorIframe,{width:e.outerWidth/2+"px",height:e.innerHeight+"px"})):n.is("fullscreen")||n.reflow()}),n._eeState.loaded=!0,n._eeState.unloaded=!1,n.is("preview")?n.preview():n.edit(),n.iframe.close(),t.call(this),this.emit("load"),this},g.prototype.unload=function(t){if(this.is("unloaded"))throw new Error("Editor isn't loaded");var n=this,r=e.parent.document.getElementById(n._instanceId);return r.parentNode.removeChild(r),n._eeState.loaded=!1,n._eeState.unloaded=!0,t=t||function(){},n.settings.textarea&&(n._textareaElement.value="",n.removeListener("__update")),n._saveIntervalTimer&&e.clearInterval(n._saveIntervalTimer),n._textareaSaveTimer&&e.clearInterval(n._textareaSaveTimer),t.call(this),n.emit("unload"),n},g.prototype.reflow=function(e,t){var n=this,r=o(n.element)-n.element.offsetWidth,i=u(n.element)-n.element.offsetHeight,s=[n.iframeElement,n.editorIframe,n.previewerIframe],a={},f,l;typeof e=="function"&&(t=e,e=null),t||(t=function(){});for(var c=0;c<s.length;c++){if(!e||e=="width")f=n.element.offsetWidth-r+"px",s[c].style.width=f,n._eeState.reflowWidth=f,a.width=f;if(!e||e=="height")l=n.element.offsetHeight-i+"px",s[c].style.height=l,n._eeState.reflowHeight=l,a.height=l}return n.emit("reflow",a),t.call(this,a),n},g.prototype.preview=function(){var t=this,n,r=t.settings.theme.preview,i;f(t.getElement("wrapper"),"epiceditor-edit-mode","epiceditor-preview-mode"),t.previewerIframeDocument.getElementById("theme")?t.previewerIframeDocument.getElementById("theme").name!==r&&(t.previewerIframeDocument.getElementById("theme").href=r):a(r,t.previewerIframeDocument,"theme"),t.save(!0),t.previewer.innerHTML=t.exportFile(null,"html",!0),i=t.previewer.getElementsByTagName("a");for(n in i)i[n].hash&&i[n].hostname==e.location.hostname&&(i[n].target="_self");return t.is("fullscreen")||(t.editorIframe.style.display="none",t.previewerIframe.style.display="block",t._eeState.preview=!0,t._eeState.edit=!1,t.previewerIframe.focus()),t.emit("preview"),t},g.prototype.enterFullscreen=function(){return this.is("fullscreen")?this:(this._goFullscreen(this.iframeElement),this)},g.prototype.exitFullscreen=function(){return this.is("fullscreen")?(this._exitFullscreen(this.iframeElement),this):this},g.prototype.edit=function(){var e=this;return f(e.getElement("wrapper"),"epiceditor-preview-mode","epiceditor-edit-mode"),e._eeState.preview=!1,e._eeState.edit=!0,e.editorIframe.style.display="block",e.previewerIframe.style.display="none",e.editorIframe.focus(),e.emit("edit"),this},g.prototype.getElement=function(e){var t={container:this.element,wrapper:this.iframe.getElementById("epiceditor-wrapper"),wrapperIframe:this.iframeElement,editor:this.editorIframeDocument,editorIframe:this.editorIframe,previewer:this.previewerIframeDocument,previewerIframe:this.previewerIframe};return!t[e]||this.is("unloaded")?null:t[e]},g.prototype.is=function(e){var t=this;switch(e){case"loaded":return t._eeState.loaded;case"unloaded":return t._eeState.unloaded;case"preview":return t._eeState.preview;case"edit":return t._eeState.edit;case"fullscreen":return t._eeState.fullscreen;default:return!1}},g.prototype.open=function(e){var n=this,r=n.settings.file.defaultContent,i;return e=e||n.settings.file.name,n.settings.file.name=e,this._storage[n.settings.localStorageName]&&(i=n.getFiles(),i[e]!==t?(h(n.editor,i[e].content),n.emit("read")):(h(n.editor,r),n.save(),n.emit("create")),n.previewer.innerHTML=n.exportFile(null,"html"),n.emit("open")),this},g.prototype.save=function(e){var n=this,r,i=!1,s=n.settings.file.name,o="",u=this._storage[o+n.settings.localStorageName],a=c(this.editor);return e&&(o=n._previewDraftLocation),this._canSave=!0,u&&(r=JSON.parse(this._storage[o+n.settings.localStorageName]),r[s]===t?r[s]=n._defaultFileSchema():a!==r[s].content&&(r[s].modified=new Date,i=!0),r[s].content=a,this._storage[o+n.settings.localStorageName]=JSON.stringify(r),i&&(n.emit("update"),n.emit("__update")),this.emit("save")),this},g.prototype.remove=function(e){var t=this,n;return e=e||t.settings.file.name,e==t.settings.file.name&&(t._canSave=!1),n=JSON.parse(this._storage[t.settings.localStorageName]),delete n[e],this._storage[t.settings.localStorageName]=JSON.stringify(n),this.emit("remove"),this},g.prototype.rename=function(e,t){var n=this,r=JSON.parse(this._storage[n.settings.localStorageName]);return r[t]=r[e],delete r[e],this._storage[n.settings.localStorageName]=JSON.stringify(r),n.open(t),this},g.prototype.importFile=function(e,n,r,i){var s=this,o=!1;return e=e||s.settings.file.name,n=n||"",r=r||"md",i=i||{},JSON.parse(this._storage[s.settings.localStorageName])[e]===t&&(o=!0),s.settings.file.name=e,h(s.editor,n),o&&s.emit("create"),s.save(),s.is("fullscreen")&&s.preview(),this},g.prototype.exportFile=function(e,n,r){var i=this,s,o;e=e||i.settings.file.name,n=n||"text",s=i.getFiles(e,r);if(s===t)return;o=s.content;switch(n){case"html":return o=o.replace(/\u00a0/g," ").replace(/&nbsp;/g," "),i.settings.parser(o);case"text":return o=o.replace(/\u00a0/g," ").replace(/&nbsp;/g," "),o;default:return o}},g.prototype.getFiles=function(e,t){var n="";t&&(n=this._previewDraftLocation);var r=JSON.parse(this._storage[n+this.settings.localStorageName]);return e?r[e]:r},g.prototype.on=function(e,t){var n=this;return this.events[e]||(this.events[e]=[]),this.events[e].push(t),n},g.prototype.emit=function(e,t){function i(e){e.call(n,t)}var n=this,r;t=t||n.getFiles(n.settings.file.name);if(!this.events[e])return;for(r=0;r<n.events[e].length;r++)i(n.events[e][r]);return n},g.prototype.removeListener=function(e,t){var n=this;return t?this.events[e]?(this.events[e].splice(this.events[e].indexOf(t),1),n):n:(this.events[e]=[],n)},g.version="0.2.0",g._data={},e.EpicEditor=g})(window),function(){function t(t){this.tokens=[],this.tokens.links={},this.options=t||f.defaults,this.rules=e.normal,this.options.gfm&&(this.options.tables?this.rules=e.tables:this.rules=e.gfm)}function r(e,t){this.options=t||f.defaults,this.links=e,this.rules=n.normal;if(!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.options.breaks?this.rules=n.breaks:this.rules=n.gfm:this.options.pedantic&&(this.rules=n.pedantic)}function i(e){this.tokens=[],this.token=null,this.options=e||f.defaults}function s(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function o(e,t){return e=e.source,t=t||"",function n(r,i){return r?(i=i.source||i,i=i.replace(/(^|[^\[])\^/g,"$1"),e=e.replace(r,i),n):new RegExp(e,t)}}function u(){}function a(e){var t=1,n,r;for(;t<arguments.length;t++){n=arguments[t];for(r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}function f(e,n){try{return i.parse(t.lex(e,n),n)}catch(r){r.message+="\nPlease report this to https://github.com/chjj/marked.";if((n||f.defaults).silent)return"An error occured:\n"+r.message;throw r}}var e={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:u,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:u,lheading:/^([^\n]+)\n *(=|-){3,} *\n*/,blockquote:/^( *>[^\n]+(\n[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *([^\s]+)(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:u,paragraph:/^([^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+\n*/,text:/^[^\n]+/};e.bullet=/(?:[*+-]|\d+\.)/,e.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,e.item=o(e.item,"gm")(/bull/g,e.bullet)(),e.list=o(e.list)(/bull/g,e.bullet)("hr",/\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(),e._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b",e.html=o(e.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,e._tag)(),e.paragraph=o(e.paragraph)("hr",e.hr)("heading",e.heading)("lheading",e.lheading)("blockquote",e.blockquote)("tag","<"+e._tag)("def",e.def)(),e.normal=a({},e),e.gfm=a({},e.normal,{fences:/^ *(`{3,}|~{3,}) *(\w+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/}),e.gfm.paragraph=o(e.paragraph)("(?!","(?!"+e.gfm.fences.source.replace("\\1","\\2")+"|")(),e.tables=a({},e.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),t.rules=e,t.lex=function(e,n){var r=new t(n);return r.lex(e)},t.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},t.prototype.token=function(e,t){var e=e.replace(/^ +$/gm,""),n,r,i,s,o,u,a;while(e){if(i=this.rules.newline.exec(e))e=e.substring(i[0].length),i[0].length>1&&this.tokens.push({type:"space"});if(i=this.rules.code.exec(e)){e=e.substring(i[0].length),i=i[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?i:i.replace(/\n+$/,"")});continue}if(i=this.rules.fences.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"code",lang:i[2],text:i[3]});continue}if(i=this.rules.heading.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"heading",depth:i[1].length,text:i[2]});continue}if(t&&(i=this.rules.nptable.exec(e))){e=e.substring(i[0].length),s={type:"table",header:i[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:i[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:i[3].replace(/\n$/,"").split("\n")};for(u=0;u<s.align.length;u++)/^ *-+: *$/.test(s.align[u])?s.align[u]="right":/^ *:-+: *$/.test(s.align[u])?s.align[u]="center":/^ *:-+ *$/.test(s.align[u])?s.align[u]="left":s.align[u]=null;for(u=0;u<s.cells.length;u++)s.cells[u]=s.cells[u].split(/ *\| */);this.tokens.push(s);continue}if(i=this.rules.lheading.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"heading",depth:i[2]==="="?1:2,text:i[1]});continue}if(i=this.rules.hr.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"hr"});continue}if(i=this.rules.blockquote.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"blockquote_start"}),i=i[0].replace(/^ *> ?/gm,""),this.token(i,t),this.tokens.push({type:"blockquote_end"});continue}if(i=this.rules.list.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"list_start",ordered:isFinite(i[2])}),i=i[0].match(this.rules.item),n=!1,a=i.length,u=0;for(;u<a;u++)s=i[u],o=s.length,s=s.replace(/^ *([*+-]|\d+\.) +/,""),~s.indexOf("\n ")&&(o-=s.length,s=this.options.pedantic?s.replace(/^ {1,4}/gm,""):s.replace(new RegExp("^ {1,"+o+"}","gm"),"")),r=n||/\n\n(?!\s*$)/.test(s),u!==a-1&&(n=s[s.length-1]==="\n",r||(r=n)),this.tokens.push({type:r?"loose_item_start":"list_item_start"}),this.token(s,!1),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"});continue}if(i=this.rules.html.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:i[1]==="pre",text:i[0]});continue}if(t&&(i=this.rules.def.exec(e))){e=e.substring(i[0].length),this.tokens.links[i[1].toLowerCase()]={href:i[2],title:i[3]};continue}if(t&&(i=this.rules.table.exec(e))){e=e.substring(i[0].length),s={type:"table",header:i[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:i[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:i[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(u=0;u<s.align.length;u++)/^ *-+: *$/.test(s.align[u])?s.align[u]="right":/^ *:-+: *$/.test(s.align[u])?s.align[u]="center":/^ *:-+ *$/.test(s.align[u])?s.align[u]="left":s.align[u]=null;for(u=0;u<s.cells.length;u++)s.cells[u]=s.cells[u].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(s);continue}if(t&&(i=this.rules.paragraph.exec(e))){e=e.substring(i[0].length),this.tokens.push({type:"paragraph",text:i[0]});continue}if(i=this.rules.text.exec(e)){e=e.substring(i[0].length),this.tokens.push({type:"text",text:i[0]});continue}if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}return this.tokens};var n={escape:/^\\([\\`*{}\[\]()#+\-.!_>|])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:u,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)([\s\S]*?[^`])\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:u,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};n._inside=/(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/,n._href=/\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,n.link=o(n.link)("inside",n._inside)("href",n._href)(),n.reflink=o(n.reflink)("inside",n._inside)(),n.normal=a({},n),n.pedantic=a({},n.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),n.gfm=a({},n.normal,{escape:o(n.escape)("])","~])")(),url:/^(https?:\/\/[^\s]+[^.,:;"')\]\s])/,del:/^~{2,}([\s\S]+?)~{2,}/,text:o(n.text)("]|","~]|")("|","|https?://|")()}),n.breaks=a({},n.gfm,{br:o(n.br)("{2,}","*")(),text:o(n.gfm.text)("{2,}","*")()}),r.rules=n,r.output=function(e,t,n){var i=new r(t,n);return i.output(e)},r.prototype.output=function(e){var t="",n,r,i,o;while(e){if(o=this.rules.escape.exec(e)){e=e.substring(o[0].length),t+=o[1];continue}if(o=this.rules.autolink.exec(e)){e=e.substring(o[0].length),o[2]==="@"?(r=o[1][6]===":"?this.mangle(o[1].substring(7)):this.mangle(o[1]),i=this.mangle("mailto:")+r):(r=s(o[1]),i=r),t+='<a href="'+i+'">'+r+"</a>";continue}if(o=this.rules.url.exec(e)){e=e.substring(o[0].length),r=s(o[1]),i=r,t+='<a href="'+i+'">'+r+"</a>";continue}if(o=this.rules.tag.exec(e)){e=e.substring(o[0].length),t+=this.options.sanitize?s(o[0]):o[0];continue}if(o=this.rules.link.exec(e)){e=e.substring(o[0].length),t+=this.outputLink(o,{href:o[2],title:o[3]});continue}if((o=this.rules.reflink.exec(e))||(o=this.rules.nolink.exec(e))){e=e.substring(o[0].length),n=(o[2]||o[1]).replace(/\s+/g," "),n=this.links[n.toLowerCase()];if(!n||!n.href){t+=o[0][0],e=o[0].substring(1)+e;continue}t+=this.outputLink(o,n);continue}if(o=this.rules.strong.exec(e)){e=e.substring(o[0].length),t+="<strong>"+this.output(o[2]||o[1])+"</strong>";continue}if(o=this.rules.em.exec(e)){e=e.substring(o[0].length),t+="<em>"+this.output(o[2]||o[1])+"</em>";continue}if(o=this.rules.code.exec(e)){e=e.substring(o[0].length),t+="<code>"+s(o[2],!0)+"</code>";continue}if(o=this.rules.br.exec(e)){e=e.substring(o[0].length),t+="<br>";continue}if(o=this.rules.del.exec(e)){e=e.substring(o[0].length),t+="<del>"+this.output(o[1])+"</del>";continue}if(o=this.rules.text.exec(e)){e=e.substring(o[0].length),t+=s(o[0]);continue}if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}return t},r.prototype.outputLink=function(e,t){return e[0][0]!=="!"?'<a href="'+s(t.href)+'"'+(t.title?' title="'+s(t.title)+'"':"")+">"+this.output(e[1])+"</a>":'<img src="'+s(t.href)+'" alt="'+s(e[1])+'"'+(t.title?' title="'+s(t.title)+'"':"")+">"},r.prototype.mangle=function(e){var t="",n=e.length,r=0,i;for(;r<n;r++)i=e.charCodeAt(r),Math.random()>.5&&(i="x"+i.toString(16)),t+="&#"+i+";";return t},i.parse=function(e,t){var n=new i(t);return n.parse(e)},i.prototype.parse=function(e){this.inline=new r(e.links,this.options),this.tokens=e.reverse();var t="";while(this.next())t+=this.tok();return t},i.prototype.next=function(){return this.token=this.tokens.pop()},i.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},i.prototype.parseText=function(){var e=this.token.text;while(this.peek().type==="text")e+="\n"+this.next().text;return this.inline.output(e)},i.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return"<hr>\n";case"heading":return"<h"+this.token.depth+">"+this.inline.output(this.token.text)+"</h"+this.token.depth+">\n";case"code":if(this.options.highlight){var e=this.options.highlight(this.token.text,this.token.lang);e!=null&&e!==this.token.text&&(this.token.escaped=!0,this.token.text=e)}return this.token.escaped||(this.token.text=s(this.token.text,!0)),"<pre><code"+(this.token.lang?' class="lang-'+this.token.lang+'"':"")+">"+this.token.text+"</code></pre>\n";case"table":var t="",n,r,i,o,u;t+="<thead>\n<tr>\n";for(r=0;r<this.token.header.length;r++)n=this.inline.output(this.token.header[r]),t+=this.token.align[r]?'<th align="'+this.token.align[r]+'">'+n+"</th>\n":"<th>"+n+"</th>\n";t+="</tr>\n</thead>\n",t+="<tbody>\n";for(r=0;r<this.token.cells.length;r++){i=this.token.cells[r],t+="<tr>\n";for(u=0;u<i.length;u++)o=this.inline.output(i[u]),t+=this.token.align[u]?'<td align="'+this.token.align[u]+'">'+o+"</td>\n":"<td>"+o+"</td>\n";t+="</tr>\n"}return t+="</tbody>\n","<table>\n"+t+"</table>\n";case"blockquote_start":var t="";while(this.next().type!=="blockquote_end")t+=this.tok();return"<blockquote>\n"+t+"</blockquote>\n";case"list_start":var a=this.token.ordered?"ol":"ul",t="";while(this.next().type!=="list_end")t+=this.tok();return"<"+a+">\n"+t+"</"+a+">\n";case"list_item_start":var t="";while(this.next().type!=="list_item_end")t+=this.token.type==="text"?this.parseText():this.tok();return"<li>"+t+"</li>\n";case"loose_item_start":var t="";while(this.next().type!=="list_item_end")t+=this.tok();return"<li>"+t+"</li>\n";case"html":return!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;case"paragraph":return"<p>"+this.inline.output(this.token.text)+"</p>\n";case"text":return"<p>"+this.parseText()+"</p>\n"}},u.exec=u,f.options=f.setOptions=function(e){return f.defaults=e,f},f.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,silent:!1,highlight:null},f.Parser=i,f.parser=i.parse,f.Lexer=t,f.lexer=t.lex,f.InlineLexer=r,f.inlineLexer=r.output,f.parse=f,typeof module!="undefined"?module.exports=f:typeof define=="function"&&define.amd?define(function(){return f}):this.marked=f}.call(function(){return this||(typeof window!="undefined"?window:global)}());
;
//*/js/spin.js*//
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
    if(s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: '50%',           // center vertically
    left: '50%',          // center horizontally
    position: 'absolute'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width

      if (target) {
        target.insertBefore(el, target.firstChild||null)
        css(el, {
          left: o.left,
          top: o.top
        })
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));

;
//*/js/jquery.spin.js*//
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

*/

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));

;
//*/js/myjs.js*//
/*global $:false jQuery:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

// initialise Superfish

jQuery(document).ready(function(){
    // jQuery('ul.sf-menu').superfish({
    //     delay:       0,                            // one second delay on mouseout
    //     animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation
    //     speed:       'fast',                          // faster animation speed
    //     speedOut:       'fast',                          // faster animation speed
    //     autoArrows:  false                            // disable generation of arrow mark-up
    // });
    jQuery('#bla').click(function(){
        console.log('clicked scroll to top');
        jQuery("html, body").animate({
            scrollTop: 0
        }, 700);
        return false;
    });

    // $(function(){
    //     console.log('contactable');
    //     $('#contactable').contactable({
    //         subject: 'A Feeback Message'
    //     });
    // });
    
});


/*----------------------------------------------------*/
/*	Back To Top Button
        /*----------------------------------------------------*/
jQuery(window).scroll(function(){
    if (jQuery(this).scrollTop() > 100) {
        jQuery('#scroll-to-top').fadeIn();
    } else {
        jQuery('#scroll-to-top').fadeOut();
    }
}); 

/* Responsive Menu */
(function() {
    selectnav('nav', {
        label: 'Menu',
        nested: true,
        indent: '-'
    });
    
})();

//fixedbar
$(window).scroll(function() {
    if ($(this).scrollTop() > 192) {
        // $('.fixedbar').addClass('fix');
        $('.fixedbar').fadeIn();
    } else {
        $('.fixedbar').fadeOut();
	// $('.fixedbar').removeClass('fix');
    }
});


// var opts = {
//   lines: 13, // The number of lines to draw
//   length: 20, // The length of each line
//   width: 10, // The line thickness
//   radius: 30, // The radius of the inner circle
//   corners: 1, // Corner roundness (0..1)
//   rotate: 29, // The rotation offset
//   direction: 1, // 1: clockwise, -1: counterclockwise
//   color: '#000', // #rgb or #rrggbb or array of colors
//   speed: 1, // Rounds per second
//   trail: 50, // Afterglow percentage
//   shadow: false, // Whether to render a shadow
//   hwaccel: true, // Whether to use hardware acceleration
//   className: 'spinner', // The CSS class to assign to the spinner
//   zIndex: 2e9, // The z-index (defaults to 2000000000)
//   top: 'auto', // Top position relative to parent in px
//   left: 'auto' // Left position relative to parent in px
// };
// var target = document.getElementById('foo');
// var spinner = new Spinner(opts).spin(target);

;
//*/js/module.js*//
/*global Recaptcha:false $:false process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 
//test
// var myAppModule = angular.module('myApp', ['ngView', 'ngSanitize']);

var myAppModule = angular.module('myApp', ['ngView', 'ui.bootstrap'])
    .directive('compile', ['$compile',
                           function($compile) {
                               // directive factory creates a link function
                               return function(scope, element, attrs) {
                                   scope.$watch(
                                       function(scope) {
                                           // watch the 'compile' expression for changes
                                           return scope.$eval(attrs.compile);
                                       },
                                       function(value) {
                                           // when the 'compile' expression changes
                                           // assign it into the current DOM
            
                                           element.html(value);
 
                                           // compile the new DOM and link it to the current
                                           // scope.
                                           // NOTE: we only compile .childNodes so that
                                           // we don't get into infinite loop compiling ourselves
                                           $compile(element.contents())(scope);
                                       }
                                   );
                               };
                               // });
                           }]

              ).value('$anchorScroll', angular.noop);

myAppModule.directive('fixscrollright',
                      ['$window',
                       function($window) {
                           return {
                               restrict: 'E',
                               transclude: true,
                               link: function(scope, el, attrs) {
                                   var window = angular.element($window),
                                   parent = angular.element(el.parent()),
                                   currentOffsetTop = el.offset().top-40;
                                   // console.log('getting offset', currentOffsetTop);
                                   // console.log('getting bottom offset', $('#bottomContainer').offset());
                                   var  origCss = {
                                       position: "static",
                                       width: getParentWidth()
                                   };

                                   handleSnapping();

                                   window.bind('scroll', function() {
                                       handleSnapping();
                                   });

                                   window.bind('resize', function() {
                                       // console.log('resizing');
                                       currentOffsetTop = el.offset().top-40;
                                       el.css({
                                           width: getParentWidth()
                                       });
                                   });

                                   function returnDigit(val) {
                                       var re = /\d+/;
                                       var digit = val.match(re)[0];
                                       return digit;
                                   }

                                   function getParentWidth() {
                                       // return returnDigit(parent.css('width')) - returnDigit(parent.css('padding-left')) - returnDigit(parent.css('padding-right'));
                                       return returnDigit(parent.css('width'));
                                   }

                                   function handleSnapping() {
                                       // console.log(el.offset().top + 450);
                                       var bottom = $('#bottomContainer').offset().top;
                                       var door = el.offset().top + 450;
                                       // var overlapping = door - bottom;
                                       // console.log(overlapping, el.offset().top);
                                       // console.log(bottom, window.height()-450 -40, window.scrollTop() + window.height()-bottom);
          
                                       // console.log(-450 -40 - window.scrollTop() +bottom);
                                       var overlapping = (-450 -60 - window.scrollTop() +bottom);
                                       // console.log(overlapping);
                                       // console.log('getting bottom offset', $('#bottomContainer').offset());
                                       // console.log(window.scrollTop(), currentOffsetTop);
                                       //  if (overlapping >0 || el.offset().top + 450 > 1223) {
                                       //      el.css(origCss);
                                       //      el.css({width: getParentWidth()});
                                       //  }
                                       // else 
                                       //   if (overlapping < 0) {
                                       //       el.css({
                                       //           top: overlapping +40 + "px",
                                       //           position: "fixed",
                                       //           width: getParentWidth()
                                       //           // width: "166px"
                                       //       });
              
                                       //   }
                                       // ese
                                       if (window.scrollTop() > currentOffsetTop ) {
                                           var headerOffsetTop = 40;
                                           el.css({
                                               top: headerOffsetTop + "px",
                                               position: "fixed",
                                               width: getParentWidth()
                                               // width: "166px"
                                           });
                                       } else {
                                           el.css(origCss);
                                           el.css({width: getParentWidth()});
                                       }
                                   }
                               }
                           };
                       }]);

myAppModule.directive('fixscroll',
                      ['$window',
                       function($window) {
                           return {
                               restrict: 'E',
                               transclude: true,
                               link: function(scope, el, attrs) {
                                       var window = angular.element($window),
                                   parent = angular.element(el.parent()),
                                       currentOffsetTop = el.offset().top-40;
                                   // console.log('getting offset', currentOffsetTop);
                                   // console.log('getting bottom offset', $('#bottomContainer').offset());
                                   var  origCss = {
                                       position: "static",
                                       width: getParentWidth()
                                   };

                                   handleSnapping();

                                   window.bind('scroll', function() {
                                       handleSnapping();
                                   });

                                   window.bind('resize', function() {
                                       // console.log('resizing');
                                       currentOffsetTop = el.offset().top-40;
                                       el.css({
                                           width: getParentWidth()
                                       });
                                   });

                                   function returnDigit(val) {
                                       var re = /\d+/;
                                       var digit = val.match(re)[0];
                                       return digit;
                                   }

                                   function getParentWidth() {
                                       // return returnDigit(parent.css('width')) - returnDigit(parent.css('padding-left')) - returnDigit(parent.css('padding-right'));
                                       return returnDigit(parent.css('width'));
                                   }

                                   function handleSnapping() {
                                       // console.log(el.offset().top + 450);
                                       var bottom = $('#bottomContainer').offset().top;
                                       var door = el.offset().top + 450;
                                       // var overlapping = door - bottom;
                                       // console.log(overlapping, el.offset().top);
                                       // console.log(bottom, window.height()-450 -40, window.scrollTop() + window.height()-bottom);
          
                                       // console.log(-450 -40 - window.scrollTop() +bottom);
                                       var overlapping = (-450 -60 - window.scrollTop() +bottom);
                                       // console.log(overlapping);
                                       // console.log('getting bottom offset', $('#bottomContainer').offset());
                                       // console.log(window.scrollTop(), currentOffsetTop);
                                       //  if (overlapping >0 || el.offset().top + 450 > 1223) {
                                       //      el.css(origCss);
                                       //      el.css({width: getParentWidth()});
                                       //  }
                                       // else 
                                       if (overlapping < 0) {
                                           el.css({
                                               top: overlapping +40 + "px",
                                               position: "fixed",
                                               width: getParentWidth()
                                               // width: "166px"
                                           });
              
                                       }
                                       else
                                           if (window.scrollTop() > currentOffsetTop ) {
                                               var headerOffsetTop = 40;
                                               el.css({
                                                   top: headerOffsetTop + "px",
                                                   position: "fixed",
                                                   width: getParentWidth()
                                                   // width: "166px"
                                               });
                                           } else {
                                               el.css(origCss);
                                               el.css({width: getParentWidth()});
                                           }
                                   }
                               }
                           };
                       }]);
// myAppModule.run(function($rootScope, $location, $anchorScroll, $routeParams) {
//   //when the route is changed scroll to the proper element.
//     $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      
//         // $location.hash($routeParams.scrollTo);
//         // $anchorScroll();  
//         var hash = $location.$$hash;
//         var target_offset = angular.element("#" + hash);
            
//         console.log('offset: ', target_offset, target_offset.offset());
    
//         if (target_offset) {
//             var target_top = target_offset.top;
//             //goto that anchor by setting the body scroll top to anchor top
//             console.log("setting scroll top");
//             setTimeout(function() {
//                 $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
//                 // $('html, body').scrollTop(target_top - 30);
//             }, 1);
//         } 
      
//     });
// });

// myAppModule.directive('myscroll', function($location) {
    
//     return function(scope, element, attrs) {
        
//         // angular.element("body").ready(function() {
//         jQuery(document).ready(function(){
//                 var target_offset = element.offset();
//             console.log('In myscroll', target_offset);
//         });
//         // console.log("in myscroll") ;
//         // var hash = $location.$$hash;
//         // console.log(hash);
//         // setTimeout(function() {
//         //     var target_offset = element.offset();
//         //     console.log('offset: ', target_offset);
//         // }, 1000);
//     };
    
// });

myAppModule.directive('scroll',
                      ['$routeParams', '$location',
                       function($routeParams,$location) {
                           return {
                               restrict: 'A',
                               link: function(scope, element, attrs){ 
                                   // console.log('in scroll', $location.hash());
                                   if ($location.hash() === attrs.id) {
                                       var offsetTop = $('.menubar').offset().top;
                                       setTimeout(function() {
                                           // console.log('in scroll directive', element[0].offsetTop-30);
                                           $('html, body').animate({
                                               // scrollTop: element[0].offsetTop-30
                                               // scrollTop:160
                                               // scrollTop: offsetTop
                                               scrollTop:0
                                           }, 1);
                                           // window.scrollTo(0, element[0].offsetTop-30);
                                       },1);        
                                   }
                               }
                           };
                       }]);

// // declare a new module, and inject the $compileProvider

// angular.module('compile', [], function($compileProvider) {
//   // configure new 'compile' directive by passing a directive
//   // factory function. The factory function injects the '$compile'
//   $compileProvider.directive('compile', function($compile) {
//     // directive factory creates a link function
//     return function(scope, element, attrs) {
//       scope.$watch(
//         function(scope) {
//            // watch the 'compile' expression for changes
//           return scope.$eval(attrs.compile);
//         },
//         function(value) {
//           // when the 'compile' expression changes
//           // assign it into the current DOM
//           element.html(value);
 
//           // compile the new DOM and link it to the current
//           // scope.
//           // NOTE: we only compile .childNodes so that
//           // we don't get into infinite loop compiling ourselves
//           $compile(element.contents())(scope);
//         }
//       );
//     };
//   });// });

// function YtCntl($scope, $route, $routeParams, $location) {
//     var yt_videos = ['4r7wHMg5Yjg','txqiwrbYGrs','dMH0bHeiRNg','Z3ZAGBL6UBA','60og9gwKh1o','2K-TICdG1R8','CdD8s0jFJYo','Q5im0Ssyyus','4pXfHLUlZf4'];

//     /*Video height and width*/
//     var yt_height = 419;
//     var yt_width = 766;

//     /*-----DO NOT EDIT BELOW THIS-----*/
//     var yt_html = "";
	
//     for (var num=0, len=yt_videos.length; num<len; ++num){
// 	yt_html = yt_html + "<li><a onclick='change_embeded(\"" + yt_videos[num] + "\")'><img src='http://img.youtube.com/vi/"+yt_videos[num]+"/2.jpg' class='myimage' style='max-height:75px;' /></a></li>";
//     }
	
//     jQuery('#yt_container').html('<div id="yt_videosurround"><div id="yt_embededvideo"><object width="'+ yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+ yt_videos[0] +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+ yt_videos[0] +'?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+ yt_width +'" height="'+ yt_height +'" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object></div></div><ul id="mycarousel" class="jcarousel-skin-tango">'+yt_html+'</ul>');
//     var embeded_cssObj = {
// 	'width' : yt_width,
// 	'height' : yt_height
//     } 
//     jQuery('#yt_embededvideo').css(embeded_cssObj);
//     jQuery('#yt_videosurround').css(embeded_cssObj);
//     jQuery('#mycarousel').jcarousel({
//     	wrap: 'circular'
//     });
    
//     function change_embeded(video_id){
// 	jQuery('#yt_embededvideo').html('<object width="'+ yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+ yt_width +'" height="'+ yt_height +'" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object>');
//     }

// }



;
//*/js/editor.js*//
myAppModule.factory('editor', function() {
    var signedIn;
    var email;
    var editable = false;
    var $scope;
    var $http;
    var signingIn = false;
    
    var api =  {
        signin: function() {
            signedIn = true;
            editable = false;
            api.toggleEditable();
            
        },
        signout: function() {
            console.log('Signing out..');
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].setData(partials[id].data);
            }); 
            editable = true;
            api.toggleEditable();
            signedIn = false;
        },
        setEditable: function(value) { editable = value; },
        setEmail: function(value) { email = value; },
        signedIn: function() { return signedIn; },
        email: function(value) { return email; },
        editable: function() { return editable; },
        set: function(scope, http) {
            $scope = scope;
            $http = http;
            $scope.login = function($event) {
                $event.preventDefault();
                console.log('Logging in');
                navigator.id.request();
            };
    
            $scope.logout = function($event) {
                $event.preventDefault();
                console.log('Logging out');
                navigator.id.logout();
            };
        },
        signingIn : function(value) {
            // console.log('signing in ', value, typeof value);
            if (typeof value !== 'undefined')
                signingIn = value;
           return signingIn;
        }
    };
    
    
    function saveFile(fileName, data) {
        if (!fileName) {
            console.log('no filename, so not saving', data);
        }
        console.log('Saving file ' + fileName);
        $http.post('__api/save?path=' + fileName, data).
            success(function(data, status, headers, config) {
	        console.log(data, status, config);
	        if (!data.success) {
                    console.log('Failed to save on the server ', data.error);
                    alert('Warning: this file did not save to the server!!');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
	        }
	        console.log("Success. Data saved to:", fileName);
                
            }).
            error(function(data, status, headers, config) {
	        console.log('Failed to post data!!', data, status, headers, config);
	        alert('Warning: this file did not save to the server!!\n' +
                      'Reason:' + data.error || status );
	    });
       
    } 
    
    var partials;
    
    var regexp = /<!--partial:([^>]*)-->/;
    api.toggleEditable = function() {
        editable = !editable;
        // console.log('editable?', editable);
        if (editable) {
            setTimeout(function() {
                var editables = $('div[contenteditable=true]');
                editables.each(function(e) {
                    CKEDITOR.inline(editables[e],
                                    { on:
                                      { key:
                                        function() { 
                                                     setTimeout(function() {
                                                         $scope.$apply();
                                                     },100);
                                                   }
                                      }
                                    });
                    
                });
                console.log(CKEDITOR.instances);
                partials = {};
                Object.keys(CKEDITOR.instances).forEach(function(id) {
                    var data = CKEDITOR.instances[id].getData();
                    var fileName = regexp.exec(data);
                    partials[id] = {
                        data: data,
                        fileName: fileName ? fileName[1] : null
                    };
                });
                
            },10);
        }
        else {
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].destroy();
            });
        }
    };
    
    api.printEditable = function() {
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            var data = CKEDITOR.instances[id].getData();
            console.log(data);
        }); 
        console.log(partials);
    };
    
    api.isDirty = function() {
        var dirty = Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            });
        // console.log('isDirty', dirty.length);
        // return dirty.length > 0;
       return true;
        
    };
    
    api.saveEditable = function() {
        var result = confirm('Are your sure?\n\nThis will save your changes to the server.');
        if (!result) return;
        console.log('saving editable');
        var count = 0; 
        Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            })
            .forEach(function(id) {
                console.log('saving ', id);
                count++;
                var data = CKEDITOR.instances[id].getData();
                saveFile(partials[id].fileName, data);
            });
        if (!count) {
            alert("Nothing to save!");
            console.log('Nothing to save!!');
        }
        
    };
    
    api.undoEditable = function() {
        var result = confirm('Are your sure?\n\nThis will undo all your edits. Don\'t forget you can also undo per inline block.');
        if (!result) return;
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            CKEDITOR.instances[id].setData(partials[id].data);
        }); 
            // CKEDITOR.instances['test--'].setData();
    };
    
    api.locationChanged = function(path) {
        console.log('in editor, location is', path);
        editable = false;
        if (signedIn)
            api.toggleEditable();
    };
    return api;
    
});

;
//*/js/controllers.js*//

function BottomCntl($scope, $location, $http, editor) {
    initPersona($scope, $http, editor);
    console.log('In BottomCntl', $scope.signedIn);
    console.log(editor);
    $scope.signedIn = editor.signedIn;
    $scope.email = editor.email;
    
    $scope.login = function($event) {
        $event.preventDefault();
        console.log('Logging in');
        navigator.id.request();
    };
    
    $scope.logout = function($event) {
        $event.preventDefault();
        console.log('Logging out');
        navigator.id.logout();
    };
    
    
}
BottomCntl.$inject = ['$scope', '$location', '$http', 'editor'];

var nrtlogo_allowed = [
    "/courses/intro",
    "/courses/children_ecec",
    "/courses/diploma_management",
    "/courses/certivtraining",
    "/courses/apprenticeship"
    ];

//Controllers
function MainCntl($scope, $location, $http, editor) {
    console.log('Main controller..');
    console.log(editor);
    
    $scope.signedIn = editor.signedIn;
    $scope.email = editor.email;
    $scope.saveEditable = editor.saveEditable;
    $scope.undoEditable = editor.undoEditable;
    $scope.printEditable = editor.printEditable;
    $scope.toggleEditable = editor.toggleEditable;
    $scope.editable = editor.editable;
    editor.set($scope, $http);
    $scope.signingIn = editor.signingIn;
    $scope.isDirty = editor.isDirty;
    
    $scope.getContactUsText = function() {
        
        var path = $location.$$path.split('/').filter(function(e) { return e; });
        var page = path[0] || 'home';
        // console.log('route' ,$location.path);
        var strings = {
            'home':'Request your First Door ' +
                // '<a href="documents/FirstDoor_StudentHandbook.pdf">'+
                'student handbook now, or phone us. We’re here to help.',
            'aboutus':'Contact us, we are here to help you.',
            'pd':'Request forms now to evaluate your Centre’s PD needs, or call us for more information',
            'courses': 'Request a course guide' +
                ' and sample training plan, or phone us. We’re here to help.',
            'resources': 'Fill in your details to receive regular resource updates.'
        };
        return strings[page];
    };
    
    $scope.show_events = function() {
        // console.log('show events', $location.$$url);
         return $location.$$url === "/home/welcome";
        };
    
    
    $scope.hide_nrtlogo = function() {
        var loc = $location.$$url;
        // console.log(loc);
        return nrtlogo_allowed.indexOf(loc) === -1;
        };

    $scope.cachify = function(path) {
        var cs = cachify(path);
        return cs;
    };
    // $anchorScroll();
    
    // console.log('location', $location);
    // console.log('route', $route);
    // console.log('params', $routeParams);
    // $scope.$route = $route;
    // $scope.$location = $location;
    // $scope.$routeParams = $routeParams;
    
    // $(".scroll").click(function(event){
    //     console.log($scope);
        
    //     console.log('click on scroll');
    //     //prevent the default action for the click event
    //     event.preventDefault();
        
    //     //get the full url - like mysitecom/index.htm#home
    //     // var full_url = this.href;
        
    //     // //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
    //     // var parts = full_url.split("#");
    //     // console.log(parts);
    //     // var trgt = parts[parts.length-1];
        
    //     var hash = $scope.$location.$$hash;
    //     //get the top offset of the target anchor
    //     var target_offset = $("#"+hash).offset();
    //     if (target_offset) {
    //         var target_top = target_offset.top;
    //         console.log('scrolling', hash, target_top);
    //         //goto that anchor by setting the body scroll top to anchor top
    //         $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
    //     }
    // });
    
}
MainCntl.$inject = ['$scope', '$location', '$http', 'editor'];

function getPrettyTitle(page, section) {
    var data = greendoor[page];
    if (!page || ! data || (page === 'home' && section === 'welcome'))
        return 'Firstdoor - Leaders in developing capability ';
    var links = data.links;
    if (!section || !links ) return 'Firstdoor - ' + (data.title || page);
    var path = page + '/' + section;
    var title;
    Object.keys(links).some(function(l) {
        if (links[l].route === path)  {
            title = 'Firstdoor - ' + (data.title || page) + ': ' +  links[l].label;   
            return true;
        }
        else return false;
    });
    return title || 'Firstdoor - Leaders in developing capability ';
}

var exists = {
    home : ['welcome', 'specialists', 'mentor', 'constructive', 'asqa','engaging'],
    aboutus : ['vision', 'mission', 'approach', 'values', 'namelogo', 'people', 'policies'],
    pd: ['intro', 'inspired', 'observing', 'environment', 'coop', 'evaluation', 'children', 'risk', 'pdfees', 'customised'],
    courses: ['intro', 'children_ecec', 'diploma_management', 'certivtraining', 'priorlearning', 'trainingplans', 'studentfees', 'apprenticeship']
    
        
};
    
var greendoor = {
    'home':{ heading: '',
             title: 'Home', 
            default_ie8sucks: 'welcome',  //ie8 gives error when using default as property name...
             links:    [
                 { label: 'Welcome', route: '/', scroll: true}
                 // ,{ label: 'Specialists in Early Childhood training and development', route: '/home/specialists', scroll: true}
                 ,{ label: 'Early Childhood Specialists', route: '/home/specialists', scroll: true}
                 ,{ label: 'Engaging resources and environments', route: '/home/engaging', scroll: true}
                 ,{ label: 'Your personal mentor ', route: '/home/mentor', scroll: true}
                 ,{ label: 'Constructive and timely assessment', route: '/home/constructive', scroll: true}
                 // ,{ label: 'Australian Skills Quality Authority audit summary', route: '/home/asqa', scroll: true}
                 ,{ label: 'ASQA Audit Summary', route: '/home/asqa', scroll: true}
                 // ,{ label: 'Quiz: discover your preferred learning style', route: '/home/quiz', scroll: true}
             ]
           }
    ,'pd':{
        title: 'Professional development',
        heading: '',
        default_ie8sucks: 'intro',
        links:    [
            { label: 'Tailored workshops', route: '/pd/intro', scroll: true}
            ,{ label: 'The inspired educator', route: '/pd/inspired', scroll: true}
            // ,{ label: 'Observation, documentation, planning and evaluating', route: '/pd/observing', scroll: true}
            ,{ label: 'Documentation', route: '/pd/observing', scroll: true}
            ,{ label: 'Environment and experiences', route: '/pd/environment', scroll: true}
            ,{ label: 'Developing cooperative behaviour', route: '/pd/coop', scroll: true}
            ,{ label: 'Evaluation and reflective practice', route: '/pd/evaluation', scroll: true}
            ,{ label: 'Children at risk', route: '/pd/children', scroll: true}
            ,{ label: 'Identify and manage risk', route: '/pd/risk', scroll: true}
            ,{ label: 'Customised workshop', route: '/pd/customised', scroll: true}
            ,{ label: 'Fees', route: '/pd/pdfees', scroll: true}
            // ,{ label: 'Fees', route: '/documents/Professional_Development_fees.docx', scroll: true}
        ]
    }
    ,'aboutus': {
        title: 'About us',
        heading: '',
        default_ie8sucks: 'vision'
        ,links: [
            // { label: 'Our company', route: '/aboutus/company', scroll: true
            //  } 
            // ,sub: [
            // { label: 'Markdown editor', route: '/epic'}
            { label: 'Vision', icon: '', route: '/aboutus/vision'}
            ,{ label: 'Mission', route: '/aboutus/mission'}
            ,{ label: 'Our student approach', route: '/aboutus/approach'}
            ,{ label: 'Values', route: '/aboutus/values'}
            // ]
            // }
            ,{ label: 'Our name and logo', route: '/aboutus/namelogo', scroll: true}
            ,{ label: 'Our people', route: '/aboutus/people', scroll: true}
            ,{ label: 'Policies', route: '/aboutus/policies'}
            
           
        ]
    } 
    ,'resources':   {
        title: 'Resources',
        heading: '',
        default_ie8sucks: 'motivation'
        ,links: [
            { label: 'Motivation', route: '/resources/motivation', scroll: true
            }
            ,{ label: 'Early childhood', route: '/resources/earlychildhood', scroll: true
               // ,sub: [
               //     { label: 'Educational leaders', route: '/resources'}
               // ]
             }
            ,{ label: 'Learning organisations', route: '/resources/learningorganisations', scroll:true}
            ,{ label: 'Learning', route: '/resources/learning', scroll:true}
            ,{ label: 'Leadership and Management', route: '/resources/leadership', scroll:true}
            // ,{ label: 'Quiz', route: '/quiz'}
        ]
    }
    ,'courses': {
        title: 'Accredited training',
        heading: '',
        default_ie8sucks: 'intro'
        // ,subtext: "Further information on Accredited Training with First Door will become available following registration as a Registered Training Organisation"
        ,links: [
            { label: 'Accredited training', route: '/courses/intro',
              scroll: true}
            ,{ label: 'Diploma of Early Childhood Education and Care', route: '/courses/children_ecec',
               scroll: true}
            ,{ label: 'Diploma of Management ', route: '/courses/diploma_management', scroll: true}
            // ,{ label: 'Leadership Units', route: '/courses/diploma_management', scroll: true}
            // ,{ label: 'Certificate IV in Training and Assessment', route: '/courses/certivtraining', scroll: true}
            ,{ label: 'Leadership Units', route: '/courses/certivtraining', scroll: true}
            ,{ label: 'Recognised Prior Learning', route: '/courses/priorlearning', scroll: true}
            ,{ label: 'Flexi or structured training plans', route: '/courses/trainingplans', scroll: true}
            ,{ label: 'Student fees', route: '/courses/studentfees', scroll: true}
            // ,{ label: 'Aged care', route: '/courses/agedcare'}
        ]

        
    } 
    ,'enrol': {
        title: 'Enrol',
        heading: '',
        default_ie8sucks: ''
        // ,subtext: "Further information on Accredited Training with First Door will become available following registration as a Registered Training Organisation"
        ,links: [
            { label: 'STUDENT HANDBOOK', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/FirstDoor_StudentHandbook.pdf", scroll: true}
            ,{ label: 'DIPLOMA ECEC COURGUIDE', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Diploma_Early_Childhood_Course_Guide.pdf", scroll: true}
            ,{ label: 'ENROLMENT: DIPLOMA ECEC (paper version)', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Dip%20ECEC%20enrolment%20print%20version.pdf", scroll: true}
            ,{ label: 'ENROLMENT: DIPLOMA ECEC (computer version)', download: "true", file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Dip%20ECEC%20enrolment%20electronic%20version.docx" , scroll: true}
            ,{ label: 'ENROLMENT: LEADERSHIP UNIT/S (paper version)', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Individual%20Units%20enrolment%20print%20version.pdf", scroll: true}
            ,{ label: 'ENROLMENT: LEADERSHIP UNIT/S (computer version)', download: "true", file: true, route:"https://dl.dropboxusercontent.com/u/121993962/Individual%20Units%20enrolment%20electronic%20version.docx" , scroll: true}
        ]

        
    }
    ,'contactus' : {
        title: 'Contact us'
        
        
    }
    ,'404': {
        title: 'Not found'
    }
    
};


function capitalizeDoor(door) {
    // return;
    Object.keys(door).forEach(function(k) {
        var menu = door[k];
        if (menu.title === 'Enrol') return;
        if (!menu.links) return;
        // console.log(menu);
        menu.links.forEach(function(l) {
            l.label = l.label.toUpperCase();
        });
    });
}
    
capitalizeDoor(greendoor);

function setActiveTab(page) {
    // console.log('setting active tab to ' , page);
    // var url = page.$$url;
    // if (!url) url = "whatever";
    var newRoute = page;
    // console.log('newRoute', newRoute);
    $(".menu > li > a[id*='" + newRoute+ "']").attr("class", "active");
    if (lastRoute !== newRoute)
        $(".menu > li > a[id*='" + lastRoute + "']").attr("class", "inactive");
    lastRoute = newRoute;
}


var headerImages = {
    
    "home": {
        "*": "/images/homepage_image.jpg"
        ,specialists: "/images/slides/home_page_Early_Childhood_Education_and_Care_training.jpg"
        ,engaging: "/images/slides/tab_resources.jpg"
        ,quiz: "/images/slides/tab_resources.jpg"
        ,mentor: "/images/slides/home_page_First_Door_mentoring.jpg"
        ,constructive: "/images/slides/home_assessment.jpg"
        // ,asqa: "/images/slides/home_assessment.jpg"
    } 
    ,"resources": {
        "*": "/images/slides/tab_resources.jpg"
        
    }
    ,"aboutus": {
        "*": '/images/slides/tab_about_us.jpg'
        
    }
    ,"sitemap": {
        "*": '/images/slides/tab_about_us.jpg'
        
    }
    ,"pd": {
        "*": "/images/slides/tab_professional_development.jpg"
        ,inspired: "/images/slides/PD_Inspired_educator.jpg"
        ,observing: "/images/slides/PD_Observing_and_documenting.jpg"
        ,environment: "/images/slides/PD_Environment_and_experiences.jpg"
        ,coop: "/images/slides/PD_cooperative_behaviour.jpg"
        ,evaluation: "/images/slides/PD_reflective_practice.jpg"
        ,children: "/images/slides/PD_identifying_at_risk_childen.jpg"
        ,risk: "/images/slides/PD_managing_risk.jpg"
        ,customised: ""
    }            
    ,"courses": {
        "*": "/images/slides/tab_accredited_training.jpg"
        ,children_ecec: "/images/slides/courses_Diploma_Childrens_services.jpg"
        ,diploma_management: "/images/slides/courses_Diploma_Management.jpg"
        ,certivtraining: "/images/slides/tab_professional_development.jpg"
        // ,certivtraining: "/images/slides/courses_certiv.jpg"
    }
    
};

var lastRoute='whatever';
function DefaultCntl($scope, $routeParams, $location, $anchorScroll, editor) {
    console.log('default controller..', $location, $routeParams);
    
    editor.locationChanged($location.$$path);
    var path = $location.$$path.split('/').filter(function(e) { return e; });
    var page = path[0] || '404';
    // console.log('page in default cntl is ', page, path);
    
   
    // if ($location.$$path === '/') $location.$$path = '/home';
    
    // $scope.page = greendoor[$location.$$path] || greendoor['/home'];
    $scope.page = greendoor[page] || greendoor['404'];
    
    // console.log('$scope.page =', $scope.page);
    var section = $routeParams.section || $scope.page.default_ie8sucks; //
    console.log('section in defaultcntl:', section);
    
    // document.title = 'Firstdoor: ' + page + '/' + section;
    document.title = getPrettyTitle(page, section);
    // $scope.name = "BookCntl";
    // $scope.params = $routeParams;
    // console.log($location);
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    // console.log('routeparams', $routeParams);
    setActiveTab(page);
    // console.log($location);
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    
    
    // console.log('course1 tag', $('#course1'));
    if (!$location.$$hash) {
        console.log('scrolling to top');
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        
    }
    // setTimeout(function(){
    //     $anchorScroll(hash);
    // },100);
    
    
    // $(function() {
    //     $('#da-slider').cslider({
    //         autoplay	: true
    //         ,interval: 10000
    //     });
    // });
    $scope.getHeaderImage = function() {
        
        console.log('getheaderimage:', page);
        var images = headerImages[page] || headerImages['home'];
        console.log('getheaderimage:', images);
        if (!images) {
            console.warn("WARNING: DefaultCntl: header images for page " +
                         page + " don't exist");
            return "";
        }
        // var imageSrc = page[$location.$$hash] || page["*"];
        // console.log('section:', $routeParams.section);
        var imageSrc = images[section] || images["*"];
        // var imageSrc = page[$routeParams.section] || page["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            // console.warn("WARNING: header image for " + $location.$$hash + " doesn't exist");
            console.warn("WARNING: header image for " + section + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return cachify(imageSrc);
    };
    
    $scope.isSelected = function(fullPath) {
        // if ($location.$$url === '/' + fullPath) return "selected";
        var loc = $location.$$url;
        var home;
        if (loc === '/' || loc === '/home/welcome')
            home = true;
        if (home && fullPath === '/' || fullPath === '/home/welcome') return "selected";
        
        if (fullPath === '/' || fullPath === '/home/welcome') fullPath = '';
        if ($location.$$url === '/' + fullPath ) return "selected";
        else return "";
    };
    
    $scope.getPageClass = function() {
        // var path = $location.$$path;
        var path = page;
        // if (path) path = path.slice(1);
        console.log(path);
        // return 'doorlinks-' + path;
        return 'doorSpacing';
    };
    
    $scope.isShow = function(id) {
        // console.log('defaultcntl: isshow: id=', id);
        // console.log('hash=', $location.$$hash);
        
        // if ($routeParams.page && $routeParams.page === id) return true;
        // else return $routeParams.section === id;
        return section === id;
        // if ($routeParams.page && $routeParams.page === id) return "selected";
        // else return $location.$$hash === id ? "selected" : "";
    };

    $scope.is404 = function() {
        
        return !exists[page] || exists[page].indexOf(section) === -1;
    };
    
    
    // console.log('contactus controller');
    // $scope.result = "now it is working..";
    $scope.sent = false;
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
    //                 );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
}
DefaultCntl.$inject = ['$scope', '$routeParams', '$location', '$anchorScroll', 'editor'];


function clickSend($event, $scope) {
        $event.preventDefault();
        console.log('clicked on send');
        var username_first=$('#username_first').val()
            ,username_last=$('#username_last').val()
            ,email=$('#email').val();
        var username = username_first + ' ' + username_last;
        var textmessage=$('#textmessage').val();
        
        if (!username_first || !username_last || username.length === 1) {
            $scope.namemissing = 'error';
            $scope.result = "Please add a full name..";
            return;
        }
        else if (!email || email.length === 0) {
            
            $scope.namemissing = '';
            $scope.emailmissing = 'error';
            $scope.result = "Please add an email address..";
            return;
        }
        else if (!textmessage || textmessage.length === 0) {
            $scope.namemissing = '';
            $scope.emailmissing = '';
            $scope.msgmissing = 'error';
            $scope.result = "Please add a message..";
            return;
        }
        else {
            $scope.emailmissing="";
            $scope.namemissing="";
            $scope.msgmissing="";
        }
        
        // console.log("From the form:", username, email, textmessage, Recaptcha.get_response());
        $.ajax({
            url: "/contactus_form",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username:username,
                                   email:email,
                                   textmessage:textmessage
                                   // ,recaptcha_response: Recaptcha.get_response(),
                                   // recaptcha_challenge: Recaptcha.get_challenge()
                                 }),
            success: function (data, textStatus, jqXHR) {
                // Recaptcha.reload();
                data = JSON.parse(data);
                console.log('Form result:', data);
                $scope.result = '';
                if (data.success) $scope.sent = true;
                    // $scope.result = "Message sent!!!";
                else $scope.result = "Message not sent: " + data.error;
                
                $scope.$apply();
                
                // do something with your data here.
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Recaptcha.reload();
                console.log('error', arguments);
                // likewise do something with your error here.
            }
        });
    
}

function contactusCntl($scope, $routeParams, $location, editor) {
    
    $('html, body').animate({
        scrollTop: 0
    }, 1);
    $scope.sent = false;
    console.log('contactus controller');
    // $scope.result = "now it is working..";
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
                    // );
    
    
    // document.title = 'Firstdoor: Contact us';
    document.title = getPrettyTitle('contactus');
    setActiveTab('contactus');
    // console.log($location);
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    
        
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    
    // $(".menu #" + url.slice(1)).attr("class", "active");
    // $(".menu #" + lastRoute.slice(1)).attr("class", "inactive");
    // lastRoute = $location.$$url;
    // $scope.emailmissing="error";
    // $scope.namemissing="error";
    // $scope.msgmissing="error";
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
       }; 
    
}

contactusCntl.$inject = ['$scope', '$routeParams', '$location', 'editor'];

function EpicCntl($scope, $routeParams) {
    console.log('default controller..');
    $scope.name = "BookCntl";
    $scope.params = $routeParams;
    var opts = {
        container: 'epiceditor',
        textarea: null,
        basePath: 'epiceditor',
        clientSideStorage: true,
        localStorageName: 'epiceditor',
        useNativeFullsreen: true,
        // parser: marked,
        file: {
            name: 'epiceditor',
            defaultContent: '',
            autoSave: 100
        },
        theme: {
            base: '/themes/base/epiceditor.css',
            preview: '/themes/preview/bartik.css',
            editor: '/themes/editor/epic-dark.css'
        },
        button: {
            preview: true,
            fullscreen: true
        },
        focusOnLoad: false,
        shortcut: {
            modifier: 18,
            fullscreen: 70,
            preview: 80
        },
        string: {
            togglePreview: 'Toggle Preview Mode',
            toggleEdit: 'Toggle Edit Mode',
            toggleFullscreen: 'Enter Fullscreen'
        }
    };
    var editor = new EpicEditor(opts);
    editor.load();
    window.test = editor;
    
    var str = "Something to play with. I am going to try to hook it up with the markdown files on the server.\
\n\n\
This will not be in the final website as such of course,  there will be secure secret website address with login etc\
\n\n\
Move the mouse over the black area and two icons appear, click them for previews of the markdown text.\
\n\n\
Escape gets you out of full screen mode.\
\n\n\
Following is some text from the welcome page. Any edits are not yet saved back to the server.\
\
\n\n\
\
#Welcome to First Door Training and Development\
\
\n\n\
Choosing a job role to enrich and touch people’s lives is a career choice that has the ability to impact on individuals, communities and our society.\
\
\n\n\
>    “I alone cannot change the world, but I can cast a stone across the waters to create many ripples.” Mother Teresa\
\n\n\
A list:\
\n\n\
* item 1\n\
* item 2\n\
\n\n\
Numbered:\
\n\n\
1. item 1\n\
* item 2\n\
\n\n\
And some examples to make links: [http://www.google.com]() or [google](http://www.google.com)";
    editor.importFile('test',str);
}

EpicCntl.$inject = ['$scope', '$routeParams'];

function HomeCntl($scope, $routeParams, $location, editor) {
    // console.log(' Home controller..', $location);
    console.log(' Home controller..', $routeParams);
    editor.locationChanged($location.$$path);
    // console.log('routeParams:', $routeParams.section, $location);
    if (!$location.$$url || $location.$$url === '/') {
     $location.$$url="/home/welcome";   
        // $location.$$hash = 'welcome';
        $location.$$path = '/home/welcome';
    }
    
    var path = $location.$$path.split('/').filter(function(e) { return e; });
    var page = path[0] || '404';
    // console.log(page);
    $scope.page = greendoor[page] || greendoor['404'];
    // console.log(page, $scope.page);
    var section = $routeParams.section || $scope.page.default_ie8sucks;
    // console.log('page and section in homecntl:', page, section);
    // $scope.page = greendoor[$location.$$path ] || greendoor['/home'];
    
    // document.title = 'Firstdoor: ' + page + '/' + section;
    
    document.title = getPrettyTitle(page, section);
    
    
    
    
    setActiveTab(page);
    // var newRoute = $location.$$path.slice(1);
    // if (!newRoute) newRoute = 'home';
    // console.log('Path is:', $location.$$path);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    // console.log('course1 tag', $('#course1'));
    if (!$location.$$hash) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        
    }
    
    $('.flexslider').flexslider({
        // animation: "slide",
        easing: 'easeInOutQuad',
        slideshow:true,
        controlNav: false,
        directionNav: true,
        slideshowSpeed: 10000,
        animationSpeed: 5000,
        touch: true
    });
    // jQuery(document).ready(function(){
    //     console.log('starting camera');
    //     jQuery('#camera').camera({
    //         pagination: false
    //         ,playPause: false
    //     });
    // });
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    
    $scope.getPageClass = function() {
        // var path = $location.$$path;
        var path = page;
        // if (path) path = path.slice(1);
        // console.log(path);
        // return 'doorlinks-' + path;
        
        return 'doorSpacing';
    };
    
    
    $scope.isSelected = function(fullPath) {
        var loc = $location.$$url;
        var home;
        if (loc === '/' || loc === '/home/welcome')
            home = true;
        if (home && fullPath === '/' || fullPath === '/home/welcome') return "selected";
        if ($location.$$url === '/' + fullPath) return "selected";
        else return "";
    };
    
    $scope.getHeaderImage = function() {
        var images = headerImages[page] || headerImages['home'];
        
        if (!images) {
            console.warn("WARNING: homeCnlt: header images for page " +
                         page + " don't exist");
            return "";
        }
        
        // console.log('section:', $routeParams.section);
        var imageSrc = images[section] || images["*"];
        // var imageSrc = page[$routeParams.section] || page["*"];
        // var imageSrc = page[$location.$$hash] || page["*"];
        // var imageSrc = page[$routeParams.$$hash] || page["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            console.warn("WARNING: header image for " + section + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return cachify(imageSrc);
    };
    
    
    $scope.is404 = function() {
        // console.log (page,section,  !exists[page] || exists[page].indexOf(section) === -1);
        return !exists[page] || exists[page].indexOf(section) === -1;
    };
    
    
    $scope.isShow = function(id) {
        // console.log('is show: id=', id, section);
        // console.log('routeParams=', $routeParams.section);
        // console.log('hash=', $location.$$hash);
        // if ($routeParams.page && $routeParams.page === id) return true;
        if ($routeParams.page && $routeParams.page === id) return true;
        else return section === id;
        // else return $routeParams.section === id;
    };
    
    $scope.sent = false;
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
    //                 );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
    
}

HomeCntl.$inject = ['$scope', '$routeParams', '$location', 'editor'];


function chatCntl($scope, $routeParams) {
    
    "use strict";
    console.log('Chat Controller');
    
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;
    
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // console.log('setting html');
    // content.html('blablabla');
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t ' +
                                'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
        }
    
    // open connection
        var host = window.location.host;
    var connection = new WebSocket('ws://' + host); //127.0.0.1:8080');
    // var connection = new WebSocket('ws://127.0.0.1:8080');
    // var connection = new WebSocket('ws://firstdoor.michieljoris.com');
    
    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Choose name:');
    };
    
    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                + 'connection or the server is down.' } ));
    };
    
    var userName;
    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        var json;
        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        
        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') { // first response from the server with user's color
            userName = json.userName;
            console.log(userName);
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                           json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            console.log(json.data.author, userName);
            if (json.data.author !== userName) {
                var bell = new Audio("soundclips/onechime.ogg");
                // console.log('Trying to play bell..');
                bell.play();
            }
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };
    
    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');
            
            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });
    
    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                   + 'with the WebSocket server.');
        }
    }, 3000);
    
    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
                        + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
                        + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
                        + ': ' + message + '</p>');
    }
    
    
    
    
    
    
    // // if user is running mozilla then use it's built-in WebSocket
    // window.WebSocket = window.WebSocket || window.MozWebSocket;
    // console.log('Opening websocket..');
    // var connection = new WebSocket('ws://127.0.0.1:8081');
    // connection.onopen = function () {
    //     // connection is opened and ready to use
    //     console.log('Websocket connection is open!!!');
    // };

    // connection.onerror = function (error) {
    //     console.log('Websocket error!!');
    //     // an error occurred when sending/receiving data
    // };

    // connection.onmessage = function (message) {
    //     // try to decode json (I assume that each message from server is json)
    //     try {
    //         var json = JSON.parse(message.data);
    //     } catch (e) {
    //         console.log('This doesn\'t look like a valid JSON: ', message.data);
    //         return;
    //     }
    //     // handle incoming message
    // };
} 

chatCntl.$inject = ['$scope', '$routeParams'];



;
//*/js/filebrowserCntl.js*//
/*global $:false jQuery:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function filebrowserCntl($scope, $routeParams, $http) {
    console.log('filebrowser controller');
    
    var path = $scope.path = (function() {
        var api = {};
        var pathArray = [];
        var fileName = '';
        
        api.set = function(aPathArray) {
            pathArray = [];
            aPathArray = aPathArray || [];
            aPathArray.forEach(function(p) {
                api.add(p);
            });
        };
        
        api.full = function () {
            return api.dir() + api.file();
        };
        
        
        api.dir = function() {
            return pathArray.join('');
        };

        api.file = function() {
            return fileName;
        };

        api.getPathToDir = function(index) {
            
            return pathArray[index];
        };
        
        api.add = function(name) {
            if (name[0] === '/')  name = name.slice(1);
            if (name[name.length-1] !== '/') fileName = name;
            else {
                pathArray.push(name);   
                fileName = '';
            }
            return api.full();
        };
        
        // api.setLength = function(length) {
        //     pathArray.length = length;
        // };
        
        api.till = function(n) {
            pathArray.length = n + 1;
            return pathArray.join('');
        };
        
        api.dirs = function() {
            return pathArray;
        };
        
        return api;
    })();
    
    $scope.getRoot = function() {
        console.log('Clicked get root');
        path.set();
        get('/build/');
    };
    
    // var test = '<ol><li><a ng-click="hello($event)" href="markdown/">markdown/</a></li></ol>';
    $scope.request = function(event) {
        event.preventDefault();
        var name = event.target.pathname;
        console.log('path:', event.target.pathname);
        get(name);
    };
    
    function setFileList(data) {
        var startOfList = data.indexOf('<ol>');
        if (startOfList === -1) startOfList = data.indexOf('<ul>');
        if (startOfList !== -1) {
            data = data.slice(startOfList);
            data = data.replace(/<a/g,'<a ng-click="request($event)"');
            $scope.fileList = data;
            return true;
        }
        else {
            alert('No list found in fetched dir listing!!');
            console.log(data);
            return false;
        }
    } 
    
    function endsWith(str, trail) {
        return (str.substr(str.length-trail.length, str.length-1) === trail);
    }

    function setFileContent(fileName, data) {
        console.log(fileName);
        var isMarkdown = endsWith(fileName, '.md') || endsWith(fileName, '.markdown') || endsWith(fileName, '.mdown');
        var isHtml = endsWith(fileName, '.html') || endsWith(fileName, '.htm');
        var isJs = endsWith(fileName, '.js');
        if (isMarkdown || isJs || isHtml ) {
            if (fileName[0] === '/') fileName = fileName.slice(1);
            editor.importFile(fileName,data);
            $scope.fileName = fileName;
        }
    }
    
    $scope.getPathTill = function(index) {
        console.log(index, path.till(index));
        $http({method: 'GET', url: path.till(index)}).
            success(function(data, status, headers, config) {
                // if (setFileList(data)) path.setLength(index);
                setFileList(data);
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed to get listing.');
            });
        
    };
    
    function get(name){
        $http({method: 'GET', url: path.dir() + name}).
            success(function(data, status, headers, config) {
                path.add(name);
                if (path.file()) {
                    $scope.fileContent = data;
                    setFileContent(name, data);
                } else { 
                    setFileList(data);
                }
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed getting listing or file');
            });
        
        
    }

    get('/build/');
    
    
    console.log('epiceditor in fb');
    var opts = {
        container: 'epiceditor',
        textarea: null,
        basePath: 'epiceditor',
        clientSideStorage: true,
        localStorageName: 'epiceditor',
        useNativeFullsreen: true,
        // parser: marked,
        file: {
            name: 'epiceditor',
            defaultContent: '',
            autoSave: 100
        },
        theme: {
            base: '/themes/base/epiceditor.css',
            preview: '/themes/preview/bartik.css',
            editor: '/themes/editor/epic-dark.css'
        },
        button: {
            preview: true,
            fullscreen: true
        },
        focusOnLoad: false,
        shortcut: {
            modifier: 18,
            fullscreen: 70,
            preview: 80
        },
        string: {
            togglePreview: 'Toggle Preview Mode',
            toggleEdit: 'Toggle Edit Mode',
            toggleFullscreen: 'Enter Fullscreen'
        }
        };
    var editor = new EpicEditor(opts);
    editor.load();
    // window.test = editor;
    
    // editor.importFile('test',str);
    
    // function getUrl(id, pathArray) {
    //     var path = pathArray.join('');

    //     $.ajax({
    //         url: path,
    //         type: "GET",
    //         contentType: "text/plain",
    //         success: function (data, status, req) {
    //             console.log('REQ:', req);
    //             $('#' + id).html(data);
    //             if (data.indexOf('<!doctype html>') === 0) {
    //                 console.log('Downloaded html doc');
    //                 data = data.slice(data.indexOf('h1') -1);
    //                 $('#' + id + ' a').click(function(event){
    //                     console.log('link clicked!!!!', event.target.pathname);
    //                     pathArray.push(event.target.pathname);
    //                     console.log(pathArray);
    //                     getUrl(id, pathArray);
    //                     return false;
    //                 });
                
    //             }
    //             // do something with your data here.
    //         },
    //         error: function () {
    //             console.log('error', arguments);
    //             // likewise do something with your error here.
    //         }
    //     });
    // 
    // }
} 
;
//*/js/videos.js*//
var videos = [
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/100languages.html",
    "provider": "youtube",
    "id": "mQtLOu99BfE",
    "title": "<p>The hundred languages of children</p>",
    "blurb": "<p>The Reggio philosophy describes that each child has one hundred languages and can learn in each of these languages. The children plant the seed of interest and then the teacher brings the resources to the child to develop these interests.</p>\n<p><strong>Discussion point:</strong> How do we provide for the learning in the hundred languages?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/NZ_childhood_centre.html",
    "provider": "youtube",
    "id": "NvAMYppiG-k",
    "title": "<p>New Zealand Early Childhood Centre</p>",
    "blurb": "<p style=\"margin-bottom: 0.35cm;\">Sixteen year old Hannah discovers what it takes to be an Early Childhood (EC) teacher in a New Zealand Early Childhood Centre. She learns that EC teachers need the ability to adapt their teaching to the changing interests of the children and relate to them at their level. Key aspects to EC teaching are being enthusiastic to make things fun for the children and creating a positive learning environment. EC teachers provide children with a sense of belonging, and over time encourage children to become confident and believe in themselves as learners.</p>\n<p style=\"margin-bottom: 0.35cm;\"><strong>Discussion point:</strong> How does this information compare with Australia&rsquo;s National Quality Framework?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/articnorway.html",
    "provider": "youtube",
    "id": "mIi1WkFhGvc",
    "title": "<p>Arctic Norway outdoor kindergarten&nbsp;</p>",
    "blurb": "<p style=\"margin-bottom: 0cm;\">Nearly one in ten kindergartens in Norway are Outdoor Kindergartens. Despite freezing weather, the trend is to return young children to nature and outdoor air.&nbsp;</p>\n<p style=\"margin-bottom: 0cm;\"><strong>Discussion point:</strong> How does an Outdoor Kindergarten provide for the learning outcomes such as: developing resilience, creativity, curiosity and physical skills? What implications would an Outdoor Kindergarten have on children&rsquo;s behaviour?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/forestkindergarten.html",
    "provider": "vimeo",
    "id": "59405112",
    "title": "<p>Forest Kindergarten</p>",
    "blurb": "<p style=\"margin-bottom: 0cm;\">In a Forest Kindergarten children have freedom to explore, learn and develop in a natural environment.</p>\n<p style=\"margin-bottom: 0cm;\">&nbsp;</p>\n<p style=\"margin-bottom: 0cm;\"><strong>Discussion point:</strong> What advantages and disadvantages do you believe these children experience?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/montesorri.html",
    "provider": "youtube",
    "id": "rZLq5Uttq8M",
    "title": "<p>Montessori</p>",
    "blurb": "<p>Key concepts shown in this video show the Montessori approach is not to fill the child with facts but to cultivate the child&rsquo;s love of learning. The Montessori key is looking for what grabs the child&rsquo;s interest and enthusiasm, and aims to enable each child to reach their full potential. Montessori believes the child&rsquo;s hands are their first teacher. The materials are self-corrective and are designed for experimentation, The environment is organised and is non-competitive. Children are encouraged to be responsible, learn life skills and care for their environment.</p>\n<p><strong>Discussion point: </strong>How does the Montessori approach relate to the National Quality Framework? How do we provide in some of these approaches?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/reggio_emilio.html",
    "provider": "youtube",
    "id": "m0mvbWEd61M",
    "title": "<p>Italy's Reggio Emilio approach</p>",
    "blurb": "<p style=\"margin-bottom: 0cm;\">Emergent curriculum is based on the children&rsquo;s interests and the environment is considered the third teacher. Teachers observe and act as researchers to develop activities and projects. Collaboration is valued and children use communication to discuss, critique, compare, negotiate and solve problems.</p>\n<p style=\"margin-bottom: 0cm;\"><strong>Discussion point: </strong>What value do we place on the environment as a child&rsquo;s third teacher? How do we invite projects and collaboration?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/rudolfsteiner.html",
    "provider": "vimeo",
    "id": "3211758",
    "title": "<p>Rudolf Steiner</p>",
    "blurb": "<p>This video shows the Rudolph Steiner approach with daily rhythm in routines, open ended play with a focus on using the child&rsquo;s hands/body and provided an atmosphere of real care. The curriculum is rich and structured, it relates to the children&rsquo;s stage of development. It embraces different cultures and understanding of the world. The objective is to provide a great breadth of education to educate the whole child to become free thinking, responsible adults.</p>\n<p><strong>Discussion point:</strong> How does the Steiner approach relate to the National Quality Framework? How do we provide in some of these approaches?</p>"
  },
  {
    "section": "earlychildhood",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/earlychildhood/swedish_preschool.html",
    "provider": "youtube",
    "id": "Z3Vw71RSn1I",
    "title": "<p>Swedish preschool</p>",
    "blurb": "<p style=\"margin-bottom: 0cm;\">In Sweden preschools, the quest is for children to have fun, make friends, feel secure and play. Outdoor play, challenge, discovery and adventure are fundamentals with a focus on teaching children independence and cooperation. Learning is through play and exploration with teachers attuned to children&rsquo;s individual needs and interests. Teachers encourage risk taking, and establish bonding, trust and continuity with the same teacher.</p>\n<p style=\"margin-bottom: 0cm;\"><strong>Discussion point:</strong> Many factors here to consider and discuss relating to: environment and experiences, wholesome foods; continuity, trust and security; communication with children; learning through play; documentation and literacy approaches.</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_Difficult_conversations.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=855\" target=\"_blank\">Difficult conversations</a></p>",
    "blurb": "<p>One of the toughest jobs for a manager is having difficult conversations and most managers are not given the skills to do this successfully.</p>\n<p><strong>Discussion Point</strong>: Putting yourself in the shoes of the person on the receiving end of a difficult conversation is a key to getting the most benefit from it. How do you prepare for difficult conversations?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_conflict_resolution.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=815\" target=\"_blank\">Conflict resolution</a></p>",
    "blurb": "<p>Conflict is often caused by two opposing opinions. Stephen R. Covey introduces a third alternative in which we find a higher and better way to resolve conflict.</p>\n<p><strong>Discussion Point:</strong> Adopting a mutual-gains approach to conflict resolution is becoming the way forward for many managers. Do you believe that using the third alternative to resolve conflict is possible?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_leadership.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=788\" target=\"_blank\">Leadership</a></p>",
    "blurb": "<p>Leadership today is a combination of key traditional strengths and new-era skills. There are seven key leadership skills and they are not exactly what you might expect.</p>\n<p><strong>Discussion Point:</strong> What do you believe are the keys to effective leadership?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_learning_to_lead.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=859\" target=\"_blank\">Learning to lead</a></p>",
    "blurb": "<p>Mentoring is not simply coaching but guiding the mentee through the formative years of a profession or career. For mentoring to be effective it needs to be structured but flexible enough to meet the needs of both mentor and mentee.</p>\n<p><strong>Discussion Point:</strong> Mentoring can be beneficial for both mentor and mentee. Have you ever been mentored successfully and would you pay it forward and become a mentor?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_managing_change.html",
    "provider": "text",
    "id": "",
    "title": "<p>&nbsp;<a href=\"http://www.aim.com.au/DisplayStory.asp?ID=783\" target=\"_blank\">Managing change</a></p>",
    "blurb": "<p>Managing change effectively can be the single most important thing you do for your business. Far too many change program efforts end up consuming valuable time and effort for little gain.</p>\n<p><strong>Discussion Point</strong>: Have you ever experienced a change program? Was it effective, and if not, in your opinion why not?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_managing_people.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=784\" target=\"_blank\">Managing people</a></p>",
    "blurb": "<p>Keeping staff engaged, flexible communication and building trust are some of the keys to managing people effectively.</p>\n<p><strong>Discussion Point:</strong> Every manager has a different management style. Can you identify your style, and is it effective?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_motivation.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=801\" target=\"_blank\">Motivation</a></p>",
    "blurb": "<p>Knowing what behaviours you are trying to motivate will assist you in leading your team more effectively. Balancing company objectives with real priorities is the challenge for managers.</p>\n<p><strong>Discussion Point:</strong> Motivation is catching, how do you motivate your team daily?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_social_media_workplace.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=807\" target=\"_blank\">Social Media in the Workplace</a></p>",
    "blurb": "<p>Using social media in the workplace can create a minefield of problems, from using it when you should be working or discussing your workplace or co-workers on it.</p>\n<p><strong>Discussion Point</strong>: Does your workplace have a clear policy on social media use, and do you agree that policies are necessary?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/article_trust_in_workplace.html",
    "provider": "text",
    "id": "",
    "title": "<p><a href=\"http://www.aim.com.au/DisplayStory.asp?ID=792\" target=\"_blank\">Trust in the Workplace</a></p>",
    "blurb": "<p>Research shows that trust in the workplace has a direct relationship with the company's bottom line. Trust needs to be embedded in all levels of the business.</p>\n<p><strong>Discussion Point:</strong> Trust has to be earned, so how do you earn trust in your workplace?</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/autism.html",
    "provider": "youtube",
    "id": "fn_9f5x0f1Q",
    "title": "<p><a href=\"http://www.ted.com/talks/temple_grandin_the_world_needs_all_kinds_of_minds.html\" target=\"_blank\">The world needs all kinds of minds &ndash; talk about autism (19:44 mins)</a></p>",
    "blurb": "<p>Temple Grandin, diagnosed with autism as a child, talks about how her mind works -- sharing her ability to \"think in pictures,\" which helps her solve problems that neurotypical brains might miss. She makes the case that the world needs people on the autism spectrum: visual thinkers, pattern thinkers, verbal thinkers, and all kinds of smart geeky kids.</p>\n<p><br /><strong>Discussion Point:</strong> Whether you agree with Temple Grandin or not, she makes a good point about how we all learn differently. Do you believe the education system could embrace less traditional learning styles?</p>\n<p>&nbsp;</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/human_connectin.html",
    "provider": "youtube",
    "id": "iCvmsMzlF7o",
    "title": "<p><a href=\"http://www.ted.com/talks/brene_brown_on_vulnerability.html\" target=\"_blank\">Human Connection (20:20 mins) &ndash; brilliant for child care</a></p>",
    "blurb": "<p>Bren&eacute; Brown studies human connection -- our ability to empathize, belong, love. In a poignant, funny talk, she shares a deep insight from her research, one that sent her on a personal quest to know herself as well as to understand humanity.</p>\n<p><strong>Discussion Point:</strong> Knowing ourselves assists us in being better people. How do you connect with others?</p>\n<p>&nbsp;</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/motivation dan pink.html",
    "provider": "youtube",
    "id": "rrkrvAUbU9Y",
    "title": "<p><a href=\"http://www.ted.com/talks/lang/en/dan_pink_on_motivation.html\" target=\"_blank\">Motivation (18:40 mins)</a></p>",
    "blurb": "<p>Career analyst Dan Pink examines the puzzle of motivation, starting with a fact that social scientists know but most managers don't: Traditional rewards aren't always as effective as we think.</p>\n<p><strong>Discussion Point:</strong> What motivates you in your profession?s</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/secrets of success.html",
    "provider": "youtube",
    "id": "ku0xCtgUuUo",
    "title": "<p><a href=\"http://www.ted.com/talks/richard_st_john_s_8_secrets_of_success.html\" target=\"_blank\">Secrets of Success (3:34 mins)</a></p>",
    "blurb": "<p>Why do people succeed? Is it because they're smart? Or are they just lucky? Neither. Analyst Richard St. John condenses years of interviews into an unmissable 3-minute slideshow on the real secrets of success.</p>\n<p><strong>Discussion Point:</strong> Everyone&rsquo;s journey to success is different as well as their measure of success. What is your definition of success?</p>\n<p>&nbsp;</p>"
  },
  {
    "section": "leadership",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/leadership/success_journey.html",
    "provider": "youtube",
    "id": "rqokTY3dNtc",
    "title": "<p><a href=\"http://www.ted.com/talks/richard_st_john_success_is_a_continuous_journey.html\" target=\"_blank\">Success is a continuous journey (3:57 mins)</a></p>",
    "blurb": "<p>In his typically candid style, Richard St. John reminds us that success is not a one-way street, but a constant journey. He uses the story of his business' rise and fall to illustrate a valuable lesson - when we stop trying, we fail.</p>\n<p><strong>Discussion Point:</strong> Constantly pushing ourselves can sometimes seem overwhelming, how do you keep motivating yourself when it all seems too much?</p>\n<p>&nbsp;</p>"
  },
  {
    "section": "learning",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learning/kenrobinsons.html",
    "provider": "youtube",
    "id": "r9LelXa3U_I",
    "title": "<p>Sir Ken Robinson: Learning reform based on people's interests and passion</p>",
    "blurb": ""
  },
  {
    "section": "learning",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learning/multiple_intelligences.html",
    "provider": "youtube",
    "id": "cf6lqfNTmaM",
    "title": "<p>Multiple Intelligences</p>",
    "blurb": ""
  },
  {
    "section": "learning",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learning/teachingandlearning.html",
    "provider": "youtube",
    "id": "oNxCporOofo",
    "title": "<p>Teaching and learning to meet learning styles</p>",
    "blurb": ""
  },
  {
    "section": "learning",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learning/whatdefineslearning.html",
    "provider": "youtube",
    "id": "0iP9W9RxlOg",
    "title": "<p>What defines your learning and training style?</p>",
    "blurb": ""
  },
  {
    "section": "learning",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learning/whatisactivelearning.html",
    "provider": "youtube",
    "id": "UsDI6hDx5uI",
    "title": "<p>What is active learning?</p>",
    "blurb": ""
  },
  {
    "section": "learningorganisations",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/learningorganisations/creating.html",
    "provider": "youtube",
    "id": "t6WX11iqmg0",
    "title": "<p><strong>Creating Learning Organisations</strong></p>",
    "blurb": "<p>A learning organisation is designed for continuous adaptation through problem solving, innovation and learning.&nbsp; It will continually change and improve using the lessons of experiences&nbsp; (Schermerhorn, Davidson, Poole, Simon, Woods &amp; Chau, 2011). This video helps us understand why we need to create leaning organisations to bring &nbsp;learning into context. It shows that the managers and team leaders are required to be involved in the learning processes and facilitate informal learning. Their role is to provide people with the right resources to be most effective in the workplace.</p>\n<p><strong>Discussion point:</strong> Who provides mentoring and&nbsp; connects people to resources in your workplace? Do you consider your workplace functions as a learning organisation, or should this be developed?</p>"
  },
  {
    "section": "motivation",
    "path": "/mnt/mint/home/michieljoris/www/sites/firstdoor/server/../build/editable/resources/motivation/suprising_truth.html",
    "provider": "youtube",
    "id": "u6XAPnuFjJc",
    "title": "<p>The surprising truth about what motivates us by Dan Pink Motiivation</p>",
    "blurb": "<p style=\"margin-bottom: 0.35cm;\">Motivation is not just about the money. Major motivators for people are operating with a sense of autonomy, achieving mastery and having purpose.</p>\n<p style=\"margin-bottom: 0.35cm;\"><br /><strong>Discussion point:</strong> It follows that motivation will be lowered when we are directed by others, feel incapable and lack in purpose. How does your organisation develop a sense of purpose and autonomy in its people? Does it provide opportunities for people to practise and master skills?</p>"
  }
];
;
//*/js/resourcesCntl.js*//
/*global lastRoute:false $:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

    // { section: ''
    //   ,title: ''
    //   ,blurb: ''
    //   ,provider: ''
    //   ,id: ''  }Motivation

var sectionToTitleMap = {
    motivation: 'Motivation'
    ,earlychildhood: 'Early Childhood Education and Care (ECEC)'
    ,learningorganisations: 'Learning Organisations'
    ,learning: 'Learning'
    ,leadership: 'Leadership and Management'
    ,general: 'General'
};


console.log('Running..');
var sections = (function() {
    var sections = {};
    videos.forEach(function(v){
        if (!v.section) v.section = 'general';
        if (!sections[v.section]) sections[v.section] = []; 
        sections[v.section].push(v);
    });
    return sections;
    // console.log(tags);
})();


var requestedVimeoThumbnails = {};
function vimeoLoadThumb(index, video_id){    
    if (requestedVimeoThumbnails[video_id]) return '';
    requestedVimeoThumbnails[video_id] = 'requested!';
    
    console.log(index + ' getting video:', video_id);
    $.ajax({
        type:'GET',
        url: 'http://vimeo.com/api/v2/video/' + video_id + '.json',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(data){
            var thumbnail_src = data[0].thumbnail_small;
            console.log(thumbnail_src);
            // $('#' + video_id).append('<img src="' + thumbnail_src + '"/>');
            $('#' + video_id).append('<img src="' + thumbnail_src + '"/>');
        }
    });
    return '';
}



function ResourcesCntl($scope, $route, $routeParams, $location) {
    console.log('resource controller');
    var path = $location.$$path.split('/').filter(function(e) { return e; });
    var page = path[0] || 'home';
    console.log('page in resources cntl is ', page, path);
    
    $scope.page = greendoor[page] || greendoor['home'];
    
    var section = $routeParams.section || $scope.page.default_ie8sucks;
    console.log('section:', section);
    
    $scope.page = greendoor[page] || greendoor['home'];
    
    document.title = getPrettyTitle(page, section);
    
    // $scope.page = greendoor[$location.$$path];
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    
    var url = $location.$$url;
    if (!url) url = "whatever";
    console.log(url);
    // $(".menu #" + url.slice(1)).attr("class", "active");
    
    // $(".menu #" + lastRoute.slice(1)).attr("class", "inactive");
    // lastRoute = $location.$$url;
    
    setActiveTab(page);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // window.lastRoute = newRoute;
    // console.log('course1 tag', $('#course1'));
    // if (!$location.$$hash)
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 1000);
    
    
    requestedVimeoThumbnails = {};

    // var videos = [];
    // videos.push(aVideo);
    // $scope.videos = videos;
    $scope.getSectionTitle = function(section) {
        return sectionToTitleMap[section];
    };
    $scope.vimeoLoadThumb = vimeoLoadThumb;
    // $scope.selectedVideo = videos[0];
    $scope.sectionsList = Object.keys(sections);
    $scope.sections = sections;
    
    $scope.open = function (event, video) {
        $scope.shouldBeOpen = true;
        event.preventDefault();
        console.log(event, video);
        $scope.selectedVideo = video;
    };

    $scope.close = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.shouldBeOpen = false;
        // event.preventDefault();
    };

    $scope.items = ['item1', 'item2'];

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    
    
    $scope.$on('$viewContentLoaded', function() {
        
        // $("#videolist").ready(function() {
        
        // jQuery(document).ready(function(){
        //     console.log("View loaded!!!");
        //     var hash = $scope.$location.$$hash;
        //         var target_offset = angular.element("#motivation");
            
        //     console.log('offset: ', target_offset, target_offset.offset());
    
        //     if (target_offset) {
        //             var target_top = target_offset.top;
        //         //goto that anchor by setting the body scroll top to anchor top
        //         console.log("setting scroll top");
        //         // $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
        //         $('html, body').scrollTop(target_top - 30);
        //     }
            
            
        // });
    });
    
    
    // $(".scroll").click(function(event){
        
    //     console.log('click on scroll');
    //     //prevent the default action for the click event
    //     event.preventDefault();
        
    //     //get the full url - like mysitecom/index.htm#home
    //     var full_url = this.href;
        
    //     //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
    //     var parts = full_url.split("#");
    //     // console.log(parts);
    //     var trgt = parts[parts.length-1];
        
    //     if (trgt[0] === '!') return;
    //     //get the top offset of the target anchor
    //     var target_offset = $("#"+trgt).offset();
    //     if (target_offset) {
    //         var target_top = target_offset.top-100;
            
    //         //goto that anchor by setting the body scroll top to anchor top
    //         $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
    //     }
    // });
    $scope.getHeaderImage = function() {
        // console.log('get image header for:', $location.$$path, $location.$$hash);
        // var images = headerImages[$location.$$path];
        
        var images = headerImages[page] || headerImages['home'];
        if (!images) {
            console.warn("WARNING: header images for page " +
                         page + " don't exist");
            return "";
        }
        // var imageSrc = page[$location.$$hash] || page["*"];
        var imageSrc = images[section] || images["*"];
        // var imageSrc = images[$routeParams.section] || images["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            console.warn("WARNING: header image for " + section + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return cachify(imageSrc);
    };
    
    $scope.getPageClass = function() {
        var path = page;
        // if (path) path = path.slice(1);
        // console.log(path);
        return 'doorlinks-' + path;
    };
    
    
    $scope.isSelected = function(fullPath) {
        if ($location.$$url === '/' + fullPath || fullPath === page + '/' + section) return "selected";
        else return "";
    };
    
    $scope.isShow = function(id) {
        // console.log('id=', id);
        // console.log('hash=', $location.$$hash);
        if ($routeParams.page && $routeParams.page === id) return true;
        else return section === id;
        // else return $location.$$hash === id;
    };
    
    $scope.sent = false;
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
    //                 );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
    
} 

ResourcesCntl.$inject = ['$scope', '$route', '$routeParams', '$location'];

var ModalDemoCtrl = function ($scope) {
    console.log('In ModalDemoCntl');
  $scope.open = function () {
    $scope.shouldBeOpen = true;
  };

  $scope.close = function () {
    $scope.closeMsg = 'I was closed at: ' + new Date();
    $scope.shouldBeOpen = false;
  };

  $scope.items = ['item1', 'item2'];

  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };

};
function DialogDemoCtrl($scope, $dialog){

    // Inlined template for demo
    var t = '<div class="modal-header">'+
        '<h1>This is the title</h1>'+
        '</div>'+
        '<div class="modal-body">'+
        '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
        '</div>';

    $scope.opts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template:  t, // OR: templateUrl: 'path/to/view.html',
        controller: 'TestDialogController'
    };

    $scope.openDialog = function(){
        var d = $dialog.dialog($scope.opts);
        d.open().then(function(result){
            if(result)
            {
                alert('dialog closed with result: ' + result);
            }
        });
        };

    $scope.openMessageBox = function(){
        var title = 'This is a message box';
        var msg = 'This is the content of the message box';
        var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

        $dialog.messageBox(title, msg, btns)
            .open()
            .then(function(result){
                alert('dialog closed with result: ' + result);
            });
    };
}

// the dialog is injected in the specified controller
function TestDialogController($scope, dialog){
    $scope.close = function(result){
        dialog.close(result);
    };
}


























// function YtCntlb($scope, $route, $routeParams, $location) {
//     console.log('YtController');
//     var yt_videos = ['4r7wHMg5Yjg','txqiwrbYGrs','dMH0bHeiRNg','Z3ZAGBL6UBA','60og9gwKh1o','2K-TICdG1R8','CdD8s0jFJYo','Q5im0Ssyyus','4pXfHLUlZf4'];

//     /*Video height and width*/
//     var yt_height = 419;
//     var yt_width = 766;

//     /*-----DO NOT EDIT BELOW THIS-----*/
//     var yt_html = "";
	
//     for (var num=0, len=yt_videos.length; num<len; ++num){
// 	yt_html = yt_html + "<li><a onclick='change_embeded(\"" + yt_videos[num] + "\")'><img src='http://img.youtube.com/vi/"+yt_videos[num]+"/2.jpg' class='myimage' style='max-height:75px;' /></a></li>";
//     }
	
//     jQuery('#yt_container').html (
//         '<div id="yt_videosurround"><div id="yt_embededvideo"><object width="'+
//             yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+
//             yt_videos[0] +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+
//             yt_videos[0] +
//             '?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+
//             yt_width +'" height="'+ yt_height +
//             '" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object></div></div><ul id="mycarousel" class="jcarousel-skin-tango">'+
//             yt_html+'</ul>');
//     var embeded_cssObj = {
// 	'width' : yt_width,
// 	'height' : yt_height
//     } 
//     jQuery('#yt_embededvideo').css(embeded_cssObj);
//     jQuery('#yt_videosurround').css(embeded_cssObj);
//     jQuery('#mycarousel').jcarousel({
//     	wrap: 'circular'
//     });
    
//     function change_embeded(video_id){
// 	jQuery('#yt_embededvideo').html('<object width="'+ yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+ yt_width +'" height="'+ yt_height +'" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object>');
//     }

// }


;
//*/router.js*//
/*global EpicCntl:false HomeCntl:false DefaultCntl:false EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [],
               ['$routeProvider', '$locationProvider',
                function($routeProvider, $locationProvider) {
    
                    var baseDir = '/built/';
                    var mapping =
                        [
                            ["home", cachify("built/view-home.html"), HomeCntl]
,["aboutus", cachify("built/view-aboutus.html")]
,["pd", cachify("built/view-pd.html")]
,["resources", cachify("built/view-resources.html"), ResourcesCntl]
,["courses", cachify("built/view-courses.html")]
,["quiz", cachify("built/view-quiz.html")]
,["epic", cachify("built/view-epic.html"), EpicCntl]
,["chat", cachify("built/view-chat.html"), chatCntl]
,["filebrowser", cachify("built/view-filebrowser.html"), filebrowserCntl]
,["contactus", cachify("built/view-contactus.html"), contactusCntl]
,["enrol", cachify("built/view-enroll.html")]
,["apprenticeship", cachify("built/view-apprenticeship.html")]
,["sitemap", cachify("sitemap.html")]

                            // ['home', '/built/view-home.html', HomeCntl],
                            // ['aboutus', '/build/markdown/aboutus.md'],
                            // ['pd', '/built/view-pd.html'],
                            // ['resources', '/build/markdown/resources.md'],
                            // ['courses', '/built/view-courses.html'],
                            // ['quiz', '/build/markdown/quiz.md'],
                            // ['blog', '/build/markdown/blog.md'],
                            // ['epic', '/built/view-epic.html', EpicCntl]

                        ];
    
                    mapping.forEach(function(m) {
                        var route ='/' + m[0];
                        if (m[1].indexOf('/') === 0) m[1] = m[1].slice(1);
                        $routeProvider.when(route,
                                            { templateUrl: '//' + document.location.host + '/' + m[1],
                                              controller: m[2] ? m[2] : DefaultCntl });
                        route ='/' + m[0] + '/:section';
                        $routeProvider.when(route,
                                            { templateUrl: '//' + document.location.host + '/' + m[1],
                                              controller: m[2] ? m[2] : DefaultCntl });
                    });
                    
    
                    $routeProvider.otherwise( { 
                        templateUrl: '//' + document.location.host +
                            cachify('/built/view-home.html'), controller: HomeCntl });
    
                    $locationProvider.html5Mode(true);
                    // console.log($locationProvider.hashPrefix());
                    $locationProvider.hashPrefix( '!');
                    // console.log($locationProvider.hashPrefix());
                }]);
 


;
//*/js/jquery.cslider.js*//
(function( $, undefined ) {
		
	/*
	 * Slider object.
	 */
	$.Slider 				= function( options, element ) {
	
		this.$el	= $( element );
		
		this._init( options );
		
	};
	
	$.Slider.defaults 		= {
		current		: 0, 	// index of current slide
		bgincrement	: 50,	// increment the bg position (parallax effect) when sliding
		autoplay	: false,// slideshow on / off
		interval	: 4000  // time between transitions
    };
	
	$.Slider.prototype 	= {
		_init 				: function( options ) {
			
			this.options 		= $.extend( true, {}, $.Slider.defaults, options );
			
			this.$slides		= this.$el.children('div.da-slide');
			this.slidesCount	= this.$slides.length;
			
			this.current		= this.options.current;
			
			if( this.current < 0 || this.current >= this.slidesCount ) {
			
				this.current	= 0;
			
			}
			
			this.$slides.eq( this.current ).addClass( 'da-slide-current' );
			
			var $navigation		= $( '<nav class="da-dots"/>' );
			for( var i = 0; i < this.slidesCount; ++i ) {
			
				$navigation.append( '<span/>' );
			
			}
			$navigation.appendTo( this.$el );
			
			this.$pages			= this.$el.find('nav.da-dots > span');
			this.$navNext		= this.$el.find('span.da-arrows-next');
			this.$navPrev		= this.$el.find('span.da-arrows-prev');
			
			this.isAnimating	= false;
			
			this.bgpositer		= 0;
			
			this.cssAnimations	= Modernizr.cssanimations;
			this.cssTransitions	= Modernizr.csstransitions;
			
			if( !this.cssAnimations || !this.cssAnimations ) {
				
				this.$el.addClass( 'da-slider-fb' );
			
			}
			
			this._updatePage();
			
			// load the events
			this._loadEvents();
			
			// slideshow
			if( this.options.autoplay ) {
			
				this._startSlideshow();
			
			}
			
		},
		_navigate			: function( page, dir ) {
			
			var $current	= this.$slides.eq( this.current ), $next, _self = this;
			
			if( this.current === page || this.isAnimating ) return false;
			
			this.isAnimating	= true;
			
			// check dir
			var classTo, classFrom, d;
			
			if( !dir ) {
			
				( page > this.current ) ? d = 'next' : d = 'prev';
			
			}
			else {
			
				d = dir;
			
			}
				
			if( this.cssAnimations && this.cssAnimations ) {
				
				if( d === 'next' ) {
				
					classTo		= 'da-slide-toleft';
					classFrom	= 'da-slide-fromright';
					++this.bgpositer;
				
				}
				else {
				
					classTo		= 'da-slide-toright';
					classFrom	= 'da-slide-fromleft';
					--this.bgpositer;
				
				}
				
				this.$el.css( 'background-position' , this.bgpositer * this.options.bgincrement + '% 0%' );
			
			}
			
			this.current	= page;
			
			$next			= this.$slides.eq( this.current );
			
			if( this.cssAnimations && this.cssAnimations ) {
			
				var rmClasses	= 'da-slide-toleft da-slide-toright da-slide-fromleft da-slide-fromright';
				$current.removeClass( rmClasses );
				$next.removeClass( rmClasses );
				
				$current.addClass( classTo );
				$next.addClass( classFrom );
				
				$current.removeClass( 'da-slide-current' );
				$next.addClass( 'da-slide-current' );
				
			}
			
			// fallback
			if( !this.cssAnimations || !this.cssAnimations ) {
				
				$next.css( 'left', ( d === 'next' ) ? '100%' : '-100%' ).stop().animate( {
					left : '0%'
				}, 1000, function() { 
					_self.isAnimating = false; 
				});
				
				$current.stop().animate( {
					left : ( d === 'next' ) ? '-100%' : '100%'
				}, 1000, function() { 
					$current.removeClass( 'da-slide-current' ); 
				});
				
			}
			
			this._updatePage();
			
		},
		_updatePage			: function() {
		
			this.$pages.removeClass( 'da-dots-current' );
			this.$pages.eq( this.current ).addClass( 'da-dots-current' );
		
		},
		_startSlideshow		: function() {
		
			var _self	= this;
			
			this.slideshow	= setTimeout( function() {
				
				var page = ( _self.current < _self.slidesCount - 1 ) ? page = _self.current + 1 : page = 0;
				_self._navigate( page, 'next' );
				
				if( _self.options.autoplay ) {
				
					_self._startSlideshow();
				
				}
			
			}, this.options.interval );
		
		},
		page				: function( idx ) {
			
			if( idx >= this.slidesCount || idx < 0 ) {
			
				return false;
			
			}
			
			if( this.options.autoplay ) {
			
				clearTimeout( this.slideshow );
				this.options.autoplay	= false;
			
			}
			
			this._navigate( idx );
			
		},
		_loadEvents			: function() {
			
			var _self = this;
			
			this.$pages.on( 'click.cslider', function( event ) {
				
				_self.page( $(this).index() );
				return false;
				
			});
			
			this.$navNext.on( 'click.cslider', function( event ) {
				
				if( _self.options.autoplay ) {
				
					clearTimeout( _self.slideshow );
					_self.options.autoplay	= false;
				
				}
				
				var page = ( _self.current < _self.slidesCount - 1 ) ? page = _self.current + 1 : page = 0;
				_self._navigate( page, 'next' );
				return false;
				
			});
			
			this.$navPrev.on( 'click.cslider', function( event ) {
				
				if( _self.options.autoplay ) {
				
					clearTimeout( _self.slideshow );
					_self.options.autoplay	= false;
				
				}
				
				var page = ( _self.current > 0 ) ? page = _self.current - 1 : page = _self.slidesCount - 1;
				_self._navigate( page, 'prev' );
				return false;
				
			});
			
			if( this.cssTransitions ) {
			
				if( !this.options.bgincrement ) {
					
					this.$el.on( 'webkitAnimationEnd.cslider animationend.cslider OAnimationEnd.cslider', function( event ) {
						
						if( event.originalEvent.animationName === 'toRightAnim4' || event.originalEvent.animationName === 'toLeftAnim4' ) {
							
							_self.isAnimating	= false;
						
						}	
						
					});
					
				}
				else {
				
					this.$el.on( 'webkitTransitionEnd.cslider transitionend.cslider OTransitionEnd.cslider', function( event ) {
					
						if( event.target.id === _self.$el.attr( 'id' ) )
							_self.isAnimating	= false;
						
					});
				
				}
			
			}
			
		}
	};
	
	var logError 			= function( message ) {
		if ( this.console ) {
			console.error( message );
		}
	};
	
	$.fn.cslider			= function( options ) {
	
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				var instance = $.data( this, 'cslider' );
				
				if ( !instance ) {
					logError( "cannot call methods on cslider prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for cslider instance" );
					return;
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
			
				var instance = $.data( this, 'cslider' );
				if ( !instance ) {
					$.data( this, 'cslider', new $.Slider( options, this ) );
				}
			});
		
		}
		
		return this;
		
	};
	
})( jQuery );
;
//*/js/jquery.tabSlideOut.v1.3.js*//
/*
    tabSlideOUt v1.3
    
    By William Paoli: http://wpaoli.building58.com

    To use you must have an image ready to go as your tab
    Make sure to pass in at minimum the path to the image and its dimensions:
    
    example:
    
        $('.slide-out-div').tabSlideOut({
                tabHandle: '.handle',                         //class of the element that will be your tab -doesnt have to be an anchor
                pathToTabImage: 'images/contact_tab.gif',     //relative path to the image for the tab
                imageHeight: '133px',                         //height of tab image
                imageWidth: '44px',                           //width of tab image   
        });

    or you can leave out these options
    and set the image properties using css
    
*/


(function($){
    $.fn.tabSlideOut = function(callerSettings) {
        var settings = $.extend({
            tabHandle: '.handle',
            speed: 300, 
            action: 'click',
            tabLocation: 'left',
            topPos: '200px',
            leftPos: '20px',
            fixedPosition: false,
            positioning: 'absolute',
            pathToTabImage: null,
            imageHeight: null,
            imageWidth: null,
            onLoadSlideOut: false                       
        }, callerSettings||{});

        settings.tabHandle = $(settings.tabHandle);
        var obj = this;
        if (settings.fixedPosition === true) {
            settings.positioning = 'fixed';
        } else {
            settings.positioning = 'absolute';
        }
        
        //ie6 doesn't do well with the fixed option
        if (document.all && !window.opera && !window.XMLHttpRequest) {
            settings.positioning = 'absolute';
        }
        

        
        //set initial tabHandle css
        
        if (settings.pathToTabImage != null) {
            settings.tabHandle.css({
            'background' : 'url('+settings.pathToTabImage+') no-repeat',
            'width' : settings.imageWidth,
            'height': settings.imageHeight
            });
        }
        
        settings.tabHandle.css({ 
            'display': 'block',
            'textIndent' : '-99999px',
            'outline' : 'none',
            'position' : 'absolute'
        });
        
        obj.css({
            'line-height' : '1',
            'position' : settings.positioning
        });

        
        var properties = {
                    containerWidth: parseInt(obj.outerWidth(), 10) + 'px',
                    containerHeight: parseInt(obj.outerHeight(), 10) + 'px',
                    tabWidth: parseInt(settings.tabHandle.outerWidth(), 10) + 'px',
                    tabHeight: parseInt(settings.tabHandle.outerHeight(), 10) + 'px'
                };

        //set calculated css
        if(settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
            obj.css({'left' : settings.leftPos});
            settings.tabHandle.css({'right' : 0});
        }
        
        if(settings.tabLocation === 'top') {
            obj.css({'top' : '-' + properties.containerHeight});
            settings.tabHandle.css({'bottom' : '-' + properties.tabHeight});
        }

        if(settings.tabLocation === 'bottom') {
            obj.css({'bottom' : '-' + properties.containerHeight, 'position' : 'fixed'});
            settings.tabHandle.css({'top' : '-' + properties.tabHeight});
            
        }
        
        if(settings.tabLocation === 'left' || settings.tabLocation === 'right') {
            obj.css({
                'height' : properties.containerHeight,
                'top' : settings.topPos
            });
            
            settings.tabHandle.css({'top' : 0});
        }
        
        if(settings.tabLocation === 'left') {
            obj.css({ 'left': '-' + properties.containerWidth});
            settings.tabHandle.css({'right' : '-' + properties.tabWidth});
        }

        if(settings.tabLocation === 'right') {
            obj.css({ 'right': '-' + properties.containerWidth});
            settings.tabHandle.css({'left' : '-' + properties.tabWidth});
            
            $('html').css('overflow-x', 'hidden');
        }

        //functions for animation events
        
        settings.tabHandle.click(function(event){
            event.preventDefault();
        });
        
        var slideIn = function() {
            
            if (settings.tabLocation === 'top') {
                obj.animate({top:'-' + properties.containerHeight}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'left') {
                obj.animate({left: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'right') {
                obj.animate({right: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'bottom') {
                obj.animate({bottom: '-' + properties.containerHeight}, settings.speed).removeClass('open');
            }    
            
        };
        
        var slideOut = function() {
            
            if (settings.tabLocation == 'top') {
                obj.animate({top:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'left') {
                obj.animate({left:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'right') {
                obj.animate({right:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'bottom') {
                obj.animate({bottom:'-3px'},  settings.speed).addClass('open');
            }
        };

        var clickScreenToClose = function() {
            obj.click(function(event){
                event.stopPropagation();
            });
            
            $(document).click(function(){
                slideIn();
            });
        };
        
        var clickAction = function(){
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                } else {
                    slideOut();
                }
            });
            
            clickScreenToClose();
        };
        
        var hoverAction = function(){
            obj.hover(
                function(){
                    slideOut();
                },
                
                function(){
                    slideIn();
                });
                
                settings.tabHandle.click(function(event){
                    if (obj.hasClass('open')) {
                        slideIn();
                    }
                });
                clickScreenToClose();
                
        };
        
        var slideOutOnLoad = function(){
            slideIn();
            setTimeout(slideOut, 500);
        };
        
        //choose which type of action to bind
        if (settings.action === 'click') {
            clickAction();
        }
        
        if (settings.action === 'hover') {
            hoverAction();
        }
        
        if (settings.onLoadSlideOut) {
            slideOutOnLoad();
        };
        
    };
})(jQuery);

;
//*/js/feedback.js*//
$(function(){
        $('.slide-out-div').tabSlideOut({
            tabHandle: '.handle',                     //class of the element that will become your tab
            pathToTabImage: 'images/contact_door_green.jpg', //path to the image for the tab //Optionally can be set using css
            imageHeight: '151px',                     //height of tab image           //Optionally can be set using css
            imageWidth: '74px',                       //width of tab image            //Optionally can be set using css
            tabLocation: 'left',                      //side of screen where tab lives, top, right, bottom, or left
            speed: 300,                               //speed of animation
            action: 'click',                          //options: 'click' or 'hover', action to trigger animation
            topPos: '350px',                          //position from the top/ use if tabLocation is left or right
            leftPos: '420px',                          //position from left/ use if tabLocation is bottom or top
            fixedPosition: true                      //options: true makes it stick(fixed position) on scroll
        });

    });

;
//*/js/cookie.js*//
/*global unescape:false escape:false VOW:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

/**
   
 /*\
 |*|
 |*|  :: cookies.js ::
 |*|
 |*|  A complete cookies reader/writer framework with full unicode support.
 |*|
 |*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
 |*|
 |*|  Syntaxes:
 |*|
 // |*|  * Cookie.set(name, value[, end[, path[, domain[, secure]]]])
 // |*|  * Cookie.get(name)
 // |*|  * Cookie.remove(name[, path])
 // |*|  * Cookie.has(name)
 // |*|  * Cookie.keys()
 |*|
 \*/
 
window.cookie = {
    useVows: false,
    get: function (sKey) {
        if (!sKey || !this.has(sKey)) {
            if (this.useVows) {
                return VOW.broken('Cookie does not exist: ' + sKey);
            }
            else return null; }
        var result = unescape(document.cookie.replace(
            new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
                       "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        if (this.useVows)  {
            if (result) return VOW.kept(result); 
	    return VOW.broken('Can not find cookie:' + name);
        }
        else return result;
    },
    set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            if (this.useVows) 
                return VOW.broken('Illegal cookie' + sKey + sValue);
            else return null;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
              case Number:
                sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                break;
              case String:
                sExpires = "; expires=" + vEnd;
                break;
              case Date:
                sExpires = "; expires=" + vEnd.toGMTString();
                break;
            }
        }
        var newCookie = escape(sKey) + "=" + escape(sValue) + sExpires +
            (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") +
            (bSecure ? "; secure" : "");
        // console.log(newCookie);
        document.cookie = newCookie;
        if (this.useVows) {
            return this.get(sKey);
        }
        else return sValue;
    },
    remove: function (sKey, sPath) {
        if (!sKey || !this.has(sKey)) {
            if (this.useVows) {
                VOW.kept("Cookie is already non-existant");
            }
            return null; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
        if (this.useVows) {
            if (this.has(sKey)) return VOW.broken("Can't remove cookie: " + sKey);
            return VOW.kept();
        }
        else return null;
    },
    
    has: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
        return aKeys;
    }
};

;
//*/js/persona.js*//
// global alert:false cookie:false
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function initPersona($scope, $http, editor) {
    // var currentUser = cookie.get('persona');
    // if (currentUser) $scope.signedIn = true;
    console.log('running initPersona');
 
    navigator.id.watch({
        // loggedInUser: currentUser,
        onlogin: function(assertion) {
            console.log('logging in..');
            // $("#sidebar--").spin({left:"140px",top:"730px"});
            editor.signingIn(true);
            // A user has logged in! Here you need to:
            // 1. Send the assertion to your backend for verification and to create a session.
            // 2. Update your UI.
            $http({ 
                method: 'POST',
                url: '/__api/signin', // This is a URL on your website.
                data: {assertion: assertion} })
                .success(function(data, status, headers, config) {
                    // $scope.signedIn = true;
                    editor.signin();
                    cookie.set('persona', data.email);
                    // $scope.email = data.email;
                    editor.setEmail(data.email);
                    console.log('signin post success', data);
                    
                    // $("#sidebar--").spin(false);
                    editor.signingIn(false);
                })
                .error(function(data, status, headers, config) {
                    cookie.remove('persona');
                    navigator.id.logout();
                    // $("#sidebar--").spin(false);
                    console.log("Sign in failure: " + status);
                    editor.signingIn(false);
                });
            $scope.$apply();
        },
        onlogout: function() {
            console.log('in onlogout');
            // A user has logged out! Here you need to:
            // Tear down the user's session by redirecting the user or making a call to your backend.
            // Also, make sure loggedInUser will get set to null on the next page load.
            // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
            $http({
                method: 'POST',
                url: '/__api/signout'})
                .success(function(data, status, headers, config) {
                    cookie.remove('persona');
                    // $scope.signedIn = false;
                    editor.signout();
                    console.log('signout post success', data);
                })
                .error(function(data, status, headers, config) {
                    cookie.remove('persona');
                    navigator.id.logout();
                    // $scope.signedIn = false;
                    editor.signout();
                    console.log("Sign out failure: " + status);
                });
            $scope.$apply();

        }
    });
}

;
//*/js/CKEDITOR_BASEPATH.js*//
var CKEDITOR_BASEPATH = '/ckeditor/';

;
//*/js/jquery.easing.1.3.js*//
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;
//*/js/jquery.flexslider-min.js*//
/*
 * jQuery FlexSlider v2.1
 * http://www.woothemes.com/flexslider/
 *
 * Copyright 2012 WooThemes
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: Tyler Smith (@mbmufffin)
 */
(function(d){d.flexslider=function(j,l){var a=d(j),c=d.extend({},d.flexslider.defaults,l),e=c.namespace,q="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,u=q?"touchend":"click",m="vertical"===c.direction,n=c.reverse,h=0<c.itemWidth,s="fade"===c.animation,t=""!==c.asNavFor,f={};d.data(j,"flexslider",a);f={init:function(){a.animating=!1;a.currentSlide=c.startAt;a.animatingTo=a.currentSlide;a.atEnd=0===a.currentSlide||a.currentSlide===a.last;a.containerSelector=c.selector.substr(0,
c.selector.search(" "));a.slides=d(c.selector,a);a.container=d(a.containerSelector,a);a.count=a.slides.length;a.syncExists=0<d(c.sync).length;"slide"===c.animation&&(c.animation="swing");a.prop=m?"top":"marginLeft";a.args={};a.manualPause=!1;var b=a,g;if(g=!c.video)if(g=!s)if(g=c.useCSS)a:{g=document.createElement("div");var p=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"],e;for(e in p)if(void 0!==g.style[p[e]]){a.pfx=p[e].replace("Perspective","").toLowerCase();
a.prop="-"+a.pfx+"-transform";g=!0;break a}g=!1}b.transitions=g;""!==c.controlsContainer&&(a.controlsContainer=0<d(c.controlsContainer).length&&d(c.controlsContainer));""!==c.manualControls&&(a.manualControls=0<d(c.manualControls).length&&d(c.manualControls));c.randomize&&(a.slides.sort(function(){return Math.round(Math.random())-0.5}),a.container.empty().append(a.slides));a.doMath();t&&f.asNav.setup();a.setup("init");c.controlNav&&f.controlNav.setup();c.directionNav&&f.directionNav.setup();c.keyboard&&
(1===d(a.containerSelector).length||c.multipleKeyboard)&&d(document).bind("keyup",function(b){b=b.keyCode;if(!a.animating&&(39===b||37===b))b=39===b?a.getTarget("next"):37===b?a.getTarget("prev"):!1,a.flexAnimate(b,c.pauseOnAction)});c.mousewheel&&a.bind("mousewheel",function(b,g){b.preventDefault();var d=0>g?a.getTarget("next"):a.getTarget("prev");a.flexAnimate(d,c.pauseOnAction)});c.pausePlay&&f.pausePlay.setup();c.slideshow&&(c.pauseOnHover&&a.hover(function(){!a.manualPlay&&!a.manualPause&&a.pause()},
function(){!a.manualPause&&!a.manualPlay&&a.play()}),0<c.initDelay?setTimeout(a.play,c.initDelay):a.play());q&&c.touch&&f.touch();(!s||s&&c.smoothHeight)&&d(window).bind("resize focus",f.resize);setTimeout(function(){c.start(a)},200)},asNav:{setup:function(){a.asNav=!0;a.animatingTo=Math.floor(a.currentSlide/a.move);a.currentItem=a.currentSlide;a.slides.removeClass(e+"active-slide").eq(a.currentItem).addClass(e+"active-slide");a.slides.click(function(b){b.preventDefault();b=d(this);var g=b.index();
!d(c.asNavFor).data("flexslider").animating&&!b.hasClass("active")&&(a.direction=a.currentItem<g?"next":"prev",a.flexAnimate(g,c.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){a.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()},setupPaging:function(){var b=1,g;a.controlNavScaffold=d('<ol class="'+e+"control-nav "+e+("thumbnails"===c.controlNav?"control-thumbs":"control-paging")+'"></ol>');if(1<a.pagingCount)for(var p=0;p<a.pagingCount;p++)g="thumbnails"===c.controlNav?
'<img src="'+a.slides.eq(p).attr("data-thumb")+'"/>':"<a>"+b+"</a>",a.controlNavScaffold.append("<li>"+g+"</li>"),b++;a.controlsContainer?d(a.controlsContainer).append(a.controlNavScaffold):a.append(a.controlNavScaffold);f.controlNav.set();f.controlNav.active();a.controlNavScaffold.delegate("a, img",u,function(b){b.preventDefault();b=d(this);var g=a.controlNav.index(b);b.hasClass(e+"active")||(a.direction=g>a.currentSlide?"next":"prev",a.flexAnimate(g,c.pauseOnAction))});q&&a.controlNavScaffold.delegate("a",
"click touchstart",function(a){a.preventDefault()})},setupManual:function(){a.controlNav=a.manualControls;f.controlNav.active();a.controlNav.live(u,function(b){b.preventDefault();b=d(this);var g=a.controlNav.index(b);b.hasClass(e+"active")||(g>a.currentSlide?a.direction="next":a.direction="prev",a.flexAnimate(g,c.pauseOnAction))});q&&a.controlNav.live("click touchstart",function(a){a.preventDefault()})},set:function(){a.controlNav=d("."+e+"control-nav li "+("thumbnails"===c.controlNav?"img":"a"),
a.controlsContainer?a.controlsContainer:a)},active:function(){a.controlNav.removeClass(e+"active").eq(a.animatingTo).addClass(e+"active")},update:function(b,c){1<a.pagingCount&&"add"===b?a.controlNavScaffold.append(d("<li><a>"+a.count+"</a></li>")):1===a.pagingCount?a.controlNavScaffold.find("li").remove():a.controlNav.eq(c).closest("li").remove();f.controlNav.set();1<a.pagingCount&&a.pagingCount!==a.controlNav.length?a.update(c,b):f.controlNav.active()}},directionNav:{setup:function(){var b=d('<ul class="'+
e+'direction-nav"><li><a class="'+e+'prev" href="#">'+c.prevText+'</a></li><li><a class="'+e+'next" href="#">'+c.nextText+"</a></li></ul>");a.controlsContainer?(d(a.controlsContainer).append(b),a.directionNav=d("."+e+"direction-nav li a",a.controlsContainer)):(a.append(b),a.directionNav=d("."+e+"direction-nav li a",a));f.directionNav.update();a.directionNav.bind(u,function(b){b.preventDefault();b=d(this).hasClass(e+"next")?a.getTarget("next"):a.getTarget("prev");a.flexAnimate(b,c.pauseOnAction)});
q&&a.directionNav.bind("click touchstart",function(a){a.preventDefault()})},update:function(){var b=e+"disabled";1===a.pagingCount?a.directionNav.addClass(b):c.animationLoop?a.directionNav.removeClass(b):0===a.animatingTo?a.directionNav.removeClass(b).filter("."+e+"prev").addClass(b):a.animatingTo===a.last?a.directionNav.removeClass(b).filter("."+e+"next").addClass(b):a.directionNav.removeClass(b)}},pausePlay:{setup:function(){var b=d('<div class="'+e+'pauseplay"><a></a></div>');a.controlsContainer?
(a.controlsContainer.append(b),a.pausePlay=d("."+e+"pauseplay a",a.controlsContainer)):(a.append(b),a.pausePlay=d("."+e+"pauseplay a",a));f.pausePlay.update(c.slideshow?e+"pause":e+"play");a.pausePlay.bind(u,function(b){b.preventDefault();d(this).hasClass(e+"pause")?(a.manualPause=!0,a.manualPlay=!1,a.pause()):(a.manualPause=!1,a.manualPlay=!0,a.play())});q&&a.pausePlay.bind("click touchstart",function(a){a.preventDefault()})},update:function(b){"play"===b?a.pausePlay.removeClass(e+"pause").addClass(e+
"play").text(c.playText):a.pausePlay.removeClass(e+"play").addClass(e+"pause").text(c.pauseText)}},touch:function(){function b(b){k=m?d-b.touches[0].pageY:d-b.touches[0].pageX;q=m?Math.abs(k)<Math.abs(b.touches[0].pageX-e):Math.abs(k)<Math.abs(b.touches[0].pageY-e);if(!q||500<Number(new Date)-l)b.preventDefault(),!s&&a.transitions&&(c.animationLoop||(k/=0===a.currentSlide&&0>k||a.currentSlide===a.last&&0<k?Math.abs(k)/r+2:1),a.setProps(f+k,"setTouch"))}function g(){j.removeEventListener("touchmove",
b,!1);if(a.animatingTo===a.currentSlide&&!q&&null!==k){var h=n?-k:k,m=0<h?a.getTarget("next"):a.getTarget("prev");a.canAdvance(m)&&(550>Number(new Date)-l&&50<Math.abs(h)||Math.abs(h)>r/2)?a.flexAnimate(m,c.pauseOnAction):s||a.flexAnimate(a.currentSlide,c.pauseOnAction,!0)}j.removeEventListener("touchend",g,!1);f=k=e=d=null}var d,e,f,r,k,l,q=!1;j.addEventListener("touchstart",function(k){a.animating?k.preventDefault():1===k.touches.length&&(a.pause(),r=m?a.h:a.w,l=Number(new Date),f=h&&n&&a.animatingTo===
a.last?0:h&&n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:h&&a.currentSlide===a.last?a.limit:h?(a.itemW+c.itemMargin)*a.move*a.currentSlide:n?(a.last-a.currentSlide+a.cloneOffset)*r:(a.currentSlide+a.cloneOffset)*r,d=m?k.touches[0].pageY:k.touches[0].pageX,e=m?k.touches[0].pageX:k.touches[0].pageY,j.addEventListener("touchmove",b,!1),j.addEventListener("touchend",g,!1))},!1)},resize:function(){!a.animating&&a.is(":visible")&&(h||a.doMath(),s?f.smoothHeight():h?(a.slides.width(a.computedW),
a.update(a.pagingCount),a.setProps()):m?(a.viewport.height(a.h),a.setProps(a.h,"setTotal")):(c.smoothHeight&&f.smoothHeight(),a.newSlides.width(a.computedW),a.setProps(a.computedW,"setTotal")))},smoothHeight:function(b){if(!m||s){var c=s?a:a.viewport;b?c.animate({height:a.slides.eq(a.animatingTo).height()},b):c.height(a.slides.eq(a.animatingTo).height())}},sync:function(b){var g=d(c.sync).data("flexslider"),e=a.animatingTo;switch(b){case "animate":g.flexAnimate(e,c.pauseOnAction,!1,!0);break;case "play":!g.playing&&
!g.asNav&&g.play();break;case "pause":g.pause()}}};a.flexAnimate=function(b,g,p,j,l){t&&1===a.pagingCount&&(a.direction=a.currentItem<b?"next":"prev");if(!a.animating&&(a.canAdvance(b,l)||p)&&a.is(":visible")){if(t&&j)if(p=d(c.asNavFor).data("flexslider"),a.atEnd=0===b||b===a.count-1,p.flexAnimate(b,!0,!1,!0,l),a.direction=a.currentItem<b?"next":"prev",p.direction=a.direction,Math.ceil((b+1)/a.visible)-1!==a.currentSlide&&0!==b)a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+
"active-slide"),b=Math.floor(b/a.visible);else return a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide"),!1;a.animating=!0;a.animatingTo=b;c.before(a);g&&a.pause();a.syncExists&&!l&&f.sync("animate");c.controlNav&&f.controlNav.active();h||a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide");a.atEnd=0===b||b===a.last;c.directionNav&&f.directionNav.update();b===a.last&&(c.end(a),c.animationLoop||a.pause());if(s)q?(a.slides.eq(a.currentSlide).css({opacity:0,
zIndex:1}),a.slides.eq(b).css({opacity:1,zIndex:2}),a.slides.unbind("webkitTransitionEnd transitionend"),a.slides.eq(a.currentSlide).bind("webkitTransitionEnd transitionend",function(){c.after(a)}),a.animating=!1,a.currentSlide=a.animatingTo):(a.slides.eq(a.currentSlide).fadeOut(c.animationSpeed,c.easing),a.slides.eq(b).fadeIn(c.animationSpeed,c.easing,a.wrapup));else{var r=m?a.slides.filter(":first").height():a.computedW;h?(b=c.itemWidth>a.w?2*c.itemMargin:c.itemMargin,b=(a.itemW+b)*a.move*a.animatingTo,
b=b>a.limit&&1!==a.visible?a.limit:b):b=0===a.currentSlide&&b===a.count-1&&c.animationLoop&&"next"!==a.direction?n?(a.count+a.cloneOffset)*r:0:a.currentSlide===a.last&&0===b&&c.animationLoop&&"prev"!==a.direction?n?0:(a.count+1)*r:n?(a.count-1-b+a.cloneOffset)*r:(b+a.cloneOffset)*r;a.setProps(b,"",c.animationSpeed);if(a.transitions){if(!c.animationLoop||!a.atEnd)a.animating=!1,a.currentSlide=a.animatingTo;a.container.unbind("webkitTransitionEnd transitionend");a.container.bind("webkitTransitionEnd transitionend",
function(){a.wrapup(r)})}else a.container.animate(a.args,c.animationSpeed,c.easing,function(){a.wrapup(r)})}c.smoothHeight&&f.smoothHeight(c.animationSpeed)}};a.wrapup=function(b){!s&&!h&&(0===a.currentSlide&&a.animatingTo===a.last&&c.animationLoop?a.setProps(b,"jumpEnd"):a.currentSlide===a.last&&(0===a.animatingTo&&c.animationLoop)&&a.setProps(b,"jumpStart"));a.animating=!1;a.currentSlide=a.animatingTo;c.after(a)};a.animateSlides=function(){a.animating||a.flexAnimate(a.getTarget("next"))};a.pause=
function(){clearInterval(a.animatedSlides);a.playing=!1;c.pausePlay&&f.pausePlay.update("play");a.syncExists&&f.sync("pause")};a.play=function(){a.animatedSlides=setInterval(a.animateSlides,c.slideshowSpeed);a.playing=!0;c.pausePlay&&f.pausePlay.update("pause");a.syncExists&&f.sync("play")};a.canAdvance=function(b,g){var d=t?a.pagingCount-1:a.last;return g?!0:t&&a.currentItem===a.count-1&&0===b&&"prev"===a.direction?!0:t&&0===a.currentItem&&b===a.pagingCount-1&&"next"!==a.direction?!1:b===a.currentSlide&&
!t?!1:c.animationLoop?!0:a.atEnd&&0===a.currentSlide&&b===d&&"next"!==a.direction?!1:a.atEnd&&a.currentSlide===d&&0===b&&"next"===a.direction?!1:!0};a.getTarget=function(b){a.direction=b;return"next"===b?a.currentSlide===a.last?0:a.currentSlide+1:0===a.currentSlide?a.last:a.currentSlide-1};a.setProps=function(b,g,d){var e,f=b?b:(a.itemW+c.itemMargin)*a.move*a.animatingTo;e=-1*function(){if(h)return"setTouch"===g?b:n&&a.animatingTo===a.last?0:n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:a.animatingTo===
a.last?a.limit:f;switch(g){case "setTotal":return n?(a.count-1-a.currentSlide+a.cloneOffset)*b:(a.currentSlide+a.cloneOffset)*b;case "setTouch":return b;case "jumpEnd":return n?b:a.count*b;case "jumpStart":return n?a.count*b:b;default:return b}}()+"px";a.transitions&&(e=m?"translate3d(0,"+e+",0)":"translate3d("+e+",0,0)",d=void 0!==d?d/1E3+"s":"0s",a.container.css("-"+a.pfx+"-transition-duration",d));a.args[a.prop]=e;(a.transitions||void 0===d)&&a.container.css(a.args)};a.setup=function(b){if(s)a.slides.css({width:"100%",
"float":"left",marginRight:"-100%",position:"relative"}),"init"===b&&(q?a.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+c.animationSpeed/1E3+"s ease",zIndex:1}).eq(a.currentSlide).css({opacity:1,zIndex:2}):a.slides.eq(a.currentSlide).fadeIn(c.animationSpeed,c.easing)),c.smoothHeight&&f.smoothHeight();else{var g,p;"init"===b&&(a.viewport=d('<div class="'+e+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(a).append(a.container),a.cloneCount=0,a.cloneOffset=
0,n&&(p=d.makeArray(a.slides).reverse(),a.slides=d(p),a.container.empty().append(a.slides)));c.animationLoop&&!h&&(a.cloneCount=2,a.cloneOffset=1,"init"!==b&&a.container.find(".clone").remove(),a.container.append(a.slides.first().clone().addClass("clone")).prepend(a.slides.last().clone().addClass("clone")));a.newSlides=d(c.selector,a);g=n?a.count-1-a.currentSlide+a.cloneOffset:a.currentSlide+a.cloneOffset;m&&!h?(a.container.height(200*(a.count+a.cloneCount)+"%").css("position","absolute").width("100%"),
setTimeout(function(){a.newSlides.css({display:"block"});a.doMath();a.viewport.height(a.h);a.setProps(g*a.h,"init")},"init"===b?100:0)):(a.container.width(200*(a.count+a.cloneCount)+"%"),a.setProps(g*a.computedW,"init"),setTimeout(function(){a.doMath();a.newSlides.css({width:a.computedW,"float":"left",display:"block"});c.smoothHeight&&f.smoothHeight()},"init"===b?100:0))}h||a.slides.removeClass(e+"active-slide").eq(a.currentSlide).addClass(e+"active-slide")};a.doMath=function(){var b=a.slides.first(),
d=c.itemMargin,e=c.minItems,f=c.maxItems;a.w=a.width();a.h=b.height();a.boxPadding=b.outerWidth()-b.width();h?(a.itemT=c.itemWidth+d,a.minW=e?e*a.itemT:a.w,a.maxW=f?f*a.itemT:a.w,a.itemW=a.minW>a.w?(a.w-d*e)/e:a.maxW<a.w?(a.w-d*f)/f:c.itemWidth>a.w?a.w:c.itemWidth,a.visible=Math.floor(a.w/(a.itemW+d)),a.move=0<c.move&&c.move<a.visible?c.move:a.visible,a.pagingCount=Math.ceil((a.count-a.visible)/a.move+1),a.last=a.pagingCount-1,a.limit=1===a.pagingCount?0:c.itemWidth>a.w?(a.itemW+2*d)*a.count-a.w-
d:(a.itemW+d)*a.count-a.w-d):(a.itemW=a.w,a.pagingCount=a.count,a.last=a.count-1);a.computedW=a.itemW-a.boxPadding};a.update=function(b,d){a.doMath();h||(b<a.currentSlide?a.currentSlide+=1:b<=a.currentSlide&&0!==b&&(a.currentSlide-=1),a.animatingTo=a.currentSlide);if(c.controlNav&&!a.manualControls)if("add"===d&&!h||a.pagingCount>a.controlNav.length)f.controlNav.update("add");else if("remove"===d&&!h||a.pagingCount<a.controlNav.length)h&&a.currentSlide>a.last&&(a.currentSlide-=1,a.animatingTo-=1),
f.controlNav.update("remove",a.last);c.directionNav&&f.directionNav.update()};a.addSlide=function(b,e){var f=d(b);a.count+=1;a.last=a.count-1;m&&n?void 0!==e?a.slides.eq(a.count-e).after(f):a.container.prepend(f):void 0!==e?a.slides.eq(e).before(f):a.container.append(f);a.update(e,"add");a.slides=d(c.selector+":not(.clone)",a);a.setup();c.added(a)};a.removeSlide=function(b){var e=isNaN(b)?a.slides.index(d(b)):b;a.count-=1;a.last=a.count-1;isNaN(b)?d(b,a.slides).remove():m&&n?a.slides.eq(a.last).remove():
a.slides.eq(b).remove();a.doMath();a.update(e,"remove");a.slides=d(c.selector+":not(.clone)",a);a.setup();c.removed(a)};f.init()};d.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7E3,animationSpeed:600,initDelay:0,randomize:!1,pauseOnAction:!0,pauseOnHover:!1,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",
keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:0,maxItems:0,move:0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};d.fn.flexslider=function(j){void 0===j&&(j={});if("object"===typeof j)return this.each(function(){var a=d(this),c=a.find(j.selector?j.selector:".slides > li");1===c.length?(c.fadeIn(400),
j.start&&j.start(a)):void 0==a.data("flexslider")&&new d.flexslider(this,j)});var l=d(this).data("flexslider");switch(j){case "play":l.play();break;case "pause":l.pause();break;case "next":l.flexAnimate(l.getTarget("next"),!0);break;case "prev":case "previous":l.flexAnimate(l.getTarget("prev"),!0);break;default:"number"===typeof j&&l.flexAnimate(j,!0)}}})(jQuery);
;
//*/js/showhide.js*//
function showHide(shID) {
	if (document.getElementById(shID)) {
		if (document.getElementById(shID+'-show').style.display != 'none') {
			document.getElementById(shID+'-show').style.display = 'none';
			document.getElementById(shID).style.display = 'block';
		}
		else {
			document.getElementById(shID+'-show').style.display = 'inline';
			document.getElementById(shID).style.display = 'none';
		}
	}
}
;
