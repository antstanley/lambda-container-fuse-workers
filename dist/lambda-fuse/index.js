var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = { exports: {} };
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", { value: module2, enumerable: true }), module2);
};

// src/lambda-fuse/node_modules/jsonparse/jsonparse.js
var require_jsonparse = __commonJS((exports2, module2) => {
  var C = {};
  var LEFT_BRACE = C.LEFT_BRACE = 1;
  var RIGHT_BRACE = C.RIGHT_BRACE = 2;
  var LEFT_BRACKET = C.LEFT_BRACKET = 3;
  var RIGHT_BRACKET = C.RIGHT_BRACKET = 4;
  var COLON = C.COLON = 5;
  var COMMA = C.COMMA = 6;
  var TRUE = C.TRUE = 7;
  var FALSE = C.FALSE = 8;
  var NULL = C.NULL = 9;
  var STRING = C.STRING = 10;
  var NUMBER = C.NUMBER = 11;
  var START = C.START = 17;
  var STOP = C.STOP = 18;
  var TRUE1 = C.TRUE1 = 33;
  var TRUE2 = C.TRUE2 = 34;
  var TRUE3 = C.TRUE3 = 35;
  var FALSE1 = C.FALSE1 = 49;
  var FALSE2 = C.FALSE2 = 50;
  var FALSE3 = C.FALSE3 = 51;
  var FALSE4 = C.FALSE4 = 52;
  var NULL1 = C.NULL1 = 65;
  var NULL2 = C.NULL2 = 66;
  var NULL3 = C.NULL3 = 67;
  var NUMBER1 = C.NUMBER1 = 81;
  var NUMBER3 = C.NUMBER3 = 83;
  var STRING1 = C.STRING1 = 97;
  var STRING2 = C.STRING2 = 98;
  var STRING3 = C.STRING3 = 99;
  var STRING4 = C.STRING4 = 100;
  var STRING5 = C.STRING5 = 101;
  var STRING6 = C.STRING6 = 102;
  var VALUE = C.VALUE = 113;
  var KEY = C.KEY = 114;
  var OBJECT = C.OBJECT = 129;
  var ARRAY = C.ARRAY = 130;
  var BACK_SLASH = "\\".charCodeAt(0);
  var FORWARD_SLASH = "/".charCodeAt(0);
  var BACKSPACE = "\b".charCodeAt(0);
  var FORM_FEED = "\f".charCodeAt(0);
  var NEWLINE = "\n".charCodeAt(0);
  var CARRIAGE_RETURN = "\r".charCodeAt(0);
  var TAB = "	".charCodeAt(0);
  var STRING_BUFFER_SIZE = 64 * 1024;
  function Parser() {
    this.tState = START;
    this.value = void 0;
    this.string = void 0;
    this.stringBuffer = Buffer.alloc ? Buffer.alloc(STRING_BUFFER_SIZE) : new Buffer(STRING_BUFFER_SIZE);
    this.stringBufferOffset = 0;
    this.unicode = void 0;
    this.highSurrogate = void 0;
    this.key = void 0;
    this.mode = void 0;
    this.stack = [];
    this.state = VALUE;
    this.bytes_remaining = 0;
    this.bytes_in_sequence = 0;
    this.temp_buffs = { "2": new Buffer(2), "3": new Buffer(3), "4": new Buffer(4) };
    this.offset = -1;
  }
  Parser.toknam = function (code) {
    var keys = Object.keys(C);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      if (C[key] === code) {
        return key;
      }
    }
    return code && "0x" + code.toString(16);
  };
  var proto = Parser.prototype;
  proto.onError = function (err) {
    throw err;
  };
  proto.charError = function (buffer, i) {
    this.tState = STOP;
    this.onError(new Error("Unexpected " + JSON.stringify(String.fromCharCode(buffer[i])) + " at position " + i + " in state " + Parser.toknam(this.tState)));
  };
  proto.appendStringChar = function (char) {
    if (this.stringBufferOffset >= STRING_BUFFER_SIZE) {
      this.string += this.stringBuffer.toString("utf8");
      this.stringBufferOffset = 0;
    }
    this.stringBuffer[this.stringBufferOffset++] = char;
  };
  proto.appendStringBuf = function (buf, start, end) {
    var size = buf.length;
    if (typeof start === "number") {
      if (typeof end === "number") {
        if (end < 0) {
          size = buf.length - start + end;
        } else {
          size = end - start;
        }
      } else {
        size = buf.length - start;
      }
    }
    if (size < 0) {
      size = 0;
    }
    if (this.stringBufferOffset + size > STRING_BUFFER_SIZE) {
      this.string += this.stringBuffer.toString("utf8", 0, this.stringBufferOffset);
      this.stringBufferOffset = 0;
    }
    buf.copy(this.stringBuffer, this.stringBufferOffset, start, end);
    this.stringBufferOffset += size;
  };
  proto.write = function (buffer) {
    if (typeof buffer === "string")
      buffer = new Buffer(buffer);
    var n;
    for (var i = 0, l = buffer.length; i < l; i++) {
      if (this.tState === START) {
        n = buffer[i];
        this.offset++;
        if (n === 123) {
          this.onToken(LEFT_BRACE, "{");
        } else if (n === 125) {
          this.onToken(RIGHT_BRACE, "}");
        } else if (n === 91) {
          this.onToken(LEFT_BRACKET, "[");
        } else if (n === 93) {
          this.onToken(RIGHT_BRACKET, "]");
        } else if (n === 58) {
          this.onToken(COLON, ":");
        } else if (n === 44) {
          this.onToken(COMMA, ",");
        } else if (n === 116) {
          this.tState = TRUE1;
        } else if (n === 102) {
          this.tState = FALSE1;
        } else if (n === 110) {
          this.tState = NULL1;
        } else if (n === 34) {
          this.string = "";
          this.stringBufferOffset = 0;
          this.tState = STRING1;
        } else if (n === 45) {
          this.string = "-";
          this.tState = NUMBER1;
        } else {
          if (n >= 48 && n < 64) {
            this.string = String.fromCharCode(n);
            this.tState = NUMBER3;
          } else if (n === 32 || n === 9 || n === 10 || n === 13) {
          } else {
            return this.charError(buffer, i);
          }
        }
      } else if (this.tState === STRING1) {
        n = buffer[i];
        if (this.bytes_remaining > 0) {
          for (var j = 0; j < this.bytes_remaining; j++) {
            this.temp_buffs[this.bytes_in_sequence][this.bytes_in_sequence - this.bytes_remaining + j] = buffer[j];
          }
          this.appendStringBuf(this.temp_buffs[this.bytes_in_sequence]);
          this.bytes_in_sequence = this.bytes_remaining = 0;
          i = i + j - 1;
        } else if (this.bytes_remaining === 0 && n >= 128) {
          if (n <= 193 || n > 244) {
            return this.onError(new Error("Invalid UTF-8 character at position " + i + " in state " + Parser.toknam(this.tState)));
          }
          if (n >= 194 && n <= 223)
            this.bytes_in_sequence = 2;
          if (n >= 224 && n <= 239)
            this.bytes_in_sequence = 3;
          if (n >= 240 && n <= 244)
            this.bytes_in_sequence = 4;
          if (this.bytes_in_sequence + i > buffer.length) {
            for (var k = 0; k <= buffer.length - 1 - i; k++) {
              this.temp_buffs[this.bytes_in_sequence][k] = buffer[i + k];
            }
            this.bytes_remaining = i + this.bytes_in_sequence - buffer.length;
            i = buffer.length - 1;
          } else {
            this.appendStringBuf(buffer, i, i + this.bytes_in_sequence);
            i = i + this.bytes_in_sequence - 1;
          }
        } else if (n === 34) {
          this.tState = START;
          this.string += this.stringBuffer.toString("utf8", 0, this.stringBufferOffset);
          this.stringBufferOffset = 0;
          this.onToken(STRING, this.string);
          this.offset += Buffer.byteLength(this.string, "utf8") + 1;
          this.string = void 0;
        } else if (n === 92) {
          this.tState = STRING2;
        } else if (n >= 32) {
          this.appendStringChar(n);
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === STRING2) {
        n = buffer[i];
        if (n === 34) {
          this.appendStringChar(n);
          this.tState = STRING1;
        } else if (n === 92) {
          this.appendStringChar(BACK_SLASH);
          this.tState = STRING1;
        } else if (n === 47) {
          this.appendStringChar(FORWARD_SLASH);
          this.tState = STRING1;
        } else if (n === 98) {
          this.appendStringChar(BACKSPACE);
          this.tState = STRING1;
        } else if (n === 102) {
          this.appendStringChar(FORM_FEED);
          this.tState = STRING1;
        } else if (n === 110) {
          this.appendStringChar(NEWLINE);
          this.tState = STRING1;
        } else if (n === 114) {
          this.appendStringChar(CARRIAGE_RETURN);
          this.tState = STRING1;
        } else if (n === 116) {
          this.appendStringChar(TAB);
          this.tState = STRING1;
        } else if (n === 117) {
          this.unicode = "";
          this.tState = STRING3;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === STRING3 || this.tState === STRING4 || this.tState === STRING5 || this.tState === STRING6) {
        n = buffer[i];
        if (n >= 48 && n < 64 || n > 64 && n <= 70 || n > 96 && n <= 102) {
          this.unicode += String.fromCharCode(n);
          if (this.tState++ === STRING6) {
            var intVal = parseInt(this.unicode, 16);
            this.unicode = void 0;
            if (this.highSurrogate !== void 0 && intVal >= 56320 && intVal < 57343 + 1) {
              this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate, intVal)));
              this.highSurrogate = void 0;
            } else if (this.highSurrogate === void 0 && intVal >= 55296 && intVal < 56319 + 1) {
              this.highSurrogate = intVal;
            } else {
              if (this.highSurrogate !== void 0) {
                this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate)));
                this.highSurrogate = void 0;
              }
              this.appendStringBuf(new Buffer(String.fromCharCode(intVal)));
            }
            this.tState = STRING1;
          }
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === NUMBER1 || this.tState === NUMBER3) {
        n = buffer[i];
        switch (n) {
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
          case 46:
          case 101:
          case 69:
          case 43:
          case 45:
            this.string += String.fromCharCode(n);
            this.tState = NUMBER3;
            break;
          default:
            this.tState = START;
            var result = Number(this.string);
            if (isNaN(result)) {
              return this.charError(buffer, i);
            }
            if (this.string.match(/[0-9]+/) == this.string && result.toString() != this.string) {
              this.onToken(STRING, this.string);
            } else {
              this.onToken(NUMBER, result);
            }
            this.offset += this.string.length - 1;
            this.string = void 0;
            i--;
            break;
        }
      } else if (this.tState === TRUE1) {
        if (buffer[i] === 114) {
          this.tState = TRUE2;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === TRUE2) {
        if (buffer[i] === 117) {
          this.tState = TRUE3;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === TRUE3) {
        if (buffer[i] === 101) {
          this.tState = START;
          this.onToken(TRUE, true);
          this.offset += 3;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === FALSE1) {
        if (buffer[i] === 97) {
          this.tState = FALSE2;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === FALSE2) {
        if (buffer[i] === 108) {
          this.tState = FALSE3;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === FALSE3) {
        if (buffer[i] === 115) {
          this.tState = FALSE4;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === FALSE4) {
        if (buffer[i] === 101) {
          this.tState = START;
          this.onToken(FALSE, false);
          this.offset += 4;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === NULL1) {
        if (buffer[i] === 117) {
          this.tState = NULL2;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === NULL2) {
        if (buffer[i] === 108) {
          this.tState = NULL3;
        } else {
          return this.charError(buffer, i);
        }
      } else if (this.tState === NULL3) {
        if (buffer[i] === 108) {
          this.tState = START;
          this.onToken(NULL, null);
          this.offset += 3;
        } else {
          return this.charError(buffer, i);
        }
      }
    }
  };
  proto.onToken = function (token, value) {
  };
  proto.parseError = function (token, value) {
    this.tState = STOP;
    this.onError(new Error("Unexpected " + Parser.toknam(token) + (value ? "(" + JSON.stringify(value) + ")" : "") + " in state " + Parser.toknam(this.state)));
  };
  proto.push = function () {
    this.stack.push({ value: this.value, key: this.key, mode: this.mode });
  };
  proto.pop = function () {
    var value = this.value;
    var parent = this.stack.pop();
    this.value = parent.value;
    this.key = parent.key;
    this.mode = parent.mode;
    this.emit(value);
    if (!this.mode) {
      this.state = VALUE;
    }
  };
  proto.emit = function (value) {
    if (this.mode) {
      this.state = COMMA;
    }
    this.onValue(value);
  };
  proto.onValue = function (value) {
  };
  proto.onToken = function (token, value) {
    if (this.state === VALUE) {
      if (token === STRING || token === NUMBER || token === TRUE || token === FALSE || token === NULL) {
        if (this.value) {
          this.value[this.key] = value;
        }
        this.emit(value);
      } else if (token === LEFT_BRACE) {
        this.push();
        if (this.value) {
          this.value = this.value[this.key] = {};
        } else {
          this.value = {};
        }
        this.key = void 0;
        this.state = KEY;
        this.mode = OBJECT;
      } else if (token === LEFT_BRACKET) {
        this.push();
        if (this.value) {
          this.value = this.value[this.key] = [];
        } else {
          this.value = [];
        }
        this.key = 0;
        this.mode = ARRAY;
        this.state = VALUE;
      } else if (token === RIGHT_BRACE) {
        if (this.mode === OBJECT) {
          this.pop();
        } else {
          return this.parseError(token, value);
        }
      } else if (token === RIGHT_BRACKET) {
        if (this.mode === ARRAY) {
          this.pop();
        } else {
          return this.parseError(token, value);
        }
      } else {
        return this.parseError(token, value);
      }
    } else if (this.state === KEY) {
      if (token === STRING) {
        this.key = value;
        this.state = COLON;
      } else if (token === RIGHT_BRACE) {
        this.pop();
      } else {
        return this.parseError(token, value);
      }
    } else if (this.state === COLON) {
      if (token === COLON) {
        this.state = VALUE;
      } else {
        return this.parseError(token, value);
      }
    } else if (this.state === COMMA) {
      if (token === COMMA) {
        if (this.mode === ARRAY) {
          this.key++;
          this.state = VALUE;
        } else if (this.mode === OBJECT) {
          this.state = KEY;
        }
      } else if (token === RIGHT_BRACKET && this.mode === ARRAY || token === RIGHT_BRACE && this.mode === OBJECT) {
        this.pop();
      } else {
        return this.parseError(token, value);
      }
    } else {
      return this.parseError(token, value);
    }
  };
  Parser.C = C;
  module2.exports = Parser;
});

// src/lambda-fuse/node_modules/through/index.js
var require_through = __commonJS((exports2, module2) => {
  var Stream = require("stream");
  exports2 = module2.exports = through;
  through.through = through;
  function through(write, end, opts) {
    write = write || function (data) {
      this.queue(data);
    };
    end = end || function () {
      this.queue(null);
    };
    var ended = false, destroyed = false, buffer = [], _ended = false;
    var stream = new Stream();
    stream.readable = stream.writable = true;
    stream.paused = false;
    stream.autoDestroy = !(opts && opts.autoDestroy === false);
    stream.write = function (data) {
      write.call(this, data);
      return !stream.paused;
    };
    function drain() {
      while (buffer.length && !stream.paused) {
        var data = buffer.shift();
        if (data === null)
          return stream.emit("end");
        else
          stream.emit("data", data);
      }
    }
    stream.queue = stream.push = function (data) {
      if (_ended)
        return stream;
      if (data === null)
        _ended = true;
      buffer.push(data);
      drain();
      return stream;
    };
    stream.on("end", function () {
      stream.readable = false;
      if (!stream.writable && stream.autoDestroy)
        process.nextTick(function () {
          stream.destroy();
        });
    });
    function _end() {
      stream.writable = false;
      end.call(stream);
      if (!stream.readable && stream.autoDestroy)
        stream.destroy();
    }
    stream.end = function (data) {
      if (ended)
        return;
      ended = true;
      if (arguments.length)
        stream.write(data);
      _end();
      return stream;
    };
    stream.destroy = function () {
      if (destroyed)
        return;
      destroyed = true;
      ended = true;
      buffer.length = 0;
      stream.writable = stream.readable = false;
      stream.emit("close");
      return stream;
    };
    stream.pause = function () {
      if (stream.paused)
        return;
      stream.paused = true;
      return stream;
    };
    stream.resume = function () {
      if (stream.paused) {
        stream.paused = false;
        stream.emit("resume");
      }
      drain();
      if (!stream.paused)
        stream.emit("drain");
      return stream;
    };
    return stream;
  }
});

// src/lambda-fuse/node_modules/JSONStream/index.js
var require_JSONStream = __commonJS((exports2) => {
  "use strict";
  var Parser = require_jsonparse();
  var through = require_through();
  var bufferFrom = Buffer.from && Buffer.from !== Uint8Array.from;
  exports2.parse = function (path, map) {
    var header, footer;
    var parser = new Parser();
    var stream = through(function (chunk) {
      if (typeof chunk === "string")
        chunk = bufferFrom ? Buffer.from(chunk) : new Buffer(chunk);
      parser.write(chunk);
    }, function (data) {
      if (data)
        stream.write(data);
      if (header)
        stream.emit("header", header);
      if (footer)
        stream.emit("footer", footer);
      stream.queue(null);
    });
    if (typeof path === "string")
      path = path.split(".").map(function (e) {
        if (e === "$*")
          return { emitKey: true };
        else if (e === "*")
          return true;
        else if (e === "")
          return { recurse: true };
        else
          return e;
      });
    var count = 0, _key;
    if (!path || !path.length)
      path = null;
    parser.onValue = function (value) {
      if (!this.root)
        stream.root = value;
      if (!path)
        return;
      var i = 0;
      var j = 0;
      var emitKey = false;
      var emitPath = false;
      while (i < path.length) {
        var key = path[i];
        var c;
        j++;
        if (key && !key.recurse) {
          c = j === this.stack.length ? this : this.stack[j];
          if (!c)
            return;
          if (!check(key, c.key)) {
            setHeaderFooter(c.key, value);
            return;
          }
          emitKey = !!key.emitKey;
          emitPath = !!key.emitPath;
          i++;
        } else {
          i++;
          var nextKey = path[i];
          if (!nextKey)
            return;
          while (true) {
            c = j === this.stack.length ? this : this.stack[j];
            if (!c)
              return;
            if (check(nextKey, c.key)) {
              i++;
              if (!Object.isFrozen(this.stack[j]))
                this.stack[j].value = null;
              break;
            } else {
              setHeaderFooter(c.key, value);
            }
            j++;
          }
        }
      }
      if (header) {
        stream.emit("header", header);
        header = false;
      }
      if (j !== this.stack.length)
        return;
      count++;
      var actualPath = this.stack.slice(1).map(function (element) {
        return element.key;
      }).concat([this.key]);
      var data = value;
      if (data != null) {
        if ((data = map ? map(data, actualPath) : data) != null) {
          if (emitKey || emitPath) {
            data = { value: data };
            if (emitKey)
              data["key"] = this.key;
            if (emitPath)
              data["path"] = actualPath;
          }
          stream.queue(data);
        }
      }
      if (this.value)
        delete this.value[this.key];
      for (var k in this.stack)
        if (!Object.isFrozen(this.stack[k]))
          this.stack[k].value = null;
    };
    parser._onToken = parser.onToken;
    parser.onToken = function (token, value) {
      parser._onToken(token, value);
      if (this.stack.length === 0) {
        if (stream.root) {
          if (!path)
            stream.queue(stream.root);
          count = 0;
          stream.root = null;
        }
      }
    };
    parser.onError = function (err) {
      if (err.message.indexOf("at position") > -1)
        err.message = "Invalid JSON (" + err.message + ")";
      stream.emit("error", err);
    };
    return stream;
    function setHeaderFooter(key, value) {
      if (header !== false) {
        header = header || {};
        header[key] = value;
      }
      if (footer !== false && header === false) {
        footer = footer || {};
        footer[key] = value;
      }
    }
  };
  function check(x, y) {
    if (typeof x === "string")
      return y == x;
    else if (x && typeof x.exec === "function")
      return x.exec(y);
    else if (typeof x === "boolean" || typeof x === "object")
      return x;
    else if (typeof x === "function")
      return x(y);
    return false;
  }
  exports2.stringify = function (op, sep, cl, indent) {
    indent = indent || 0;
    if (op === false) {
      op = "";
      sep = "\n";
      cl = "";
    } else if (op == null) {
      op = "[\n";
      sep = "\n,\n";
      cl = "\n]\n";
    }
    var stream, first = true, anyData = false;
    stream = through(function (data) {
      anyData = true;
      try {
        var json = JSON.stringify(data, null, indent);
      } catch (err) {
        return stream.emit("error", err);
      }
      if (first) {
        first = false;
        stream.queue(op + json);
      } else
        stream.queue(sep + json);
    }, function (data) {
      if (!anyData)
        stream.queue(op);
      stream.queue(cl);
      stream.queue(null);
    });
    return stream;
  };
  exports2.stringifyObject = function (op, sep, cl, indent) {
    indent = indent || 0;
    if (op === false) {
      op = "";
      sep = "\n";
      cl = "";
    } else if (op == null) {
      op = "{\n";
      sep = "\n,\n";
      cl = "\n}\n";
    }
    var first = true;
    var anyData = false;
    var stream = through(function (data) {
      anyData = true;
      var json = JSON.stringify(data[0]) + ":" + JSON.stringify(data[1], null, indent);
      if (first) {
        first = false;
        this.queue(op + json);
      } else
        this.queue(sep + json);
    }, function (data) {
      if (!anyData)
        this.queue(op);
      this.queue(cl);
      this.queue(null);
    });
    return stream;
  };
});

// src/lambda-fuse/post/loadData.js
var require_loadData = __commonJS((exports2, module2) => {
  var { join } = require("path");
  var { createReadStream } = require("fs");
  var JSONStream = require_JSONStream();
  var loadData = (searchFile, chunks, indexes) => {
    const datachunks = [];
    const { dir, namePrefix } = searchFile;
    let verifyCount = 0;
    for (let i = 0; i < chunks; i++) {
      for (const index in indexes) {
        if (indexes.hasOwnProperty(index)) {
          if (datachunks[i]) {
            datachunks[i][index] = [];
          } else {
            const newChunkIndex = {};
            newChunkIndex[index] = [];
            datachunks.push(newChunkIndex);
          }
          verifyCount++;
        }
      }
    }
    return new Promise((resolve, reject) => {
      let processCount = 0;
      for (let i = 0; i < chunks; i++) {
        for (const index in indexes) {
          if (indexes.hasOwnProperty(index)) {
            const chunkFile = join(__dirname, dir, `${namePrefix}-${index}.chunk${i}.json`);
            createReadStream(chunkFile).pipe(JSONStream.parse("*")).on("data", (data) => {
              datachunks[i][index].push(data);
            }).on("end", () => {
              processCount++;
              if (processCount === verifyCount) {
                resolve(datachunks);
              }
            }).on("error", (error) => {
              return { error };
            });
          }
        }
      }
    });
  };
  module2.exports = loadData;
});

// src/lambda-fuse/post/handleWorkers.js
var require_handleWorkers = __commonJS((exports2, module2) => {
  var { Worker } = require("worker_threads");
  var handleWorkers = (cleanSearch, searchData, options, chunks, index, workerScript) => {
    return new Promise((resolve, reject) => {
      let resultArray = [];
      let workerCounter = 0;
      const errors = {
        count: 0,
        messages: []
      };
      for (let i = 0; i < chunks; i++) {
        const workerData = {
          cleanSearch,
          searchData: searchData[i][index],
          options
        };
        const worker = new Worker(workerScript, { workerData });
        worker.on("message", (sortedArray) => {
          resultArray.push(sortedArray);
        });
        worker.on("error", (error) => {
          errors.count++;
          errors.messages.push(error);
          console.error(`error in chunk ${1}`, error);
          if (errors.count == chunks)
            reject(errors);
        });
        worker.on("exit", () => {
          workerCounter++;
          if (workerCounter === chunks) {
            if (resultArray.length === chunks) {
              const searchResults = resultArray.reduce((newArray, workerArray) => {
                return newArray.concat(workerArray);
              }).map((responseItem) => {
                const { item, score } = responseItem;
                const { ...fields } = item;
                return { ...fields, score };
              }).sort((a, b) => {
                if (a.score == b.score) {
                  const aKeys = Object.keys(a);
                  const bKeys = Object.keys(b);
                  if (a[aKeys[0]] > b[bKeys[0]]) {
                    return 1;
                  } else {
                    return -1;
                  }
                } else {
                  if (a.score > b.score) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              });
              resolve(searchResults);
            }
          }
        });
      }
    });
  };
  module2.exports = handleWorkers;
});

// src/lambda-fuse/post/search.js
var require_search = __commonJS((exports2, module2) => {
  var loadData = require_loadData();
  var { join } = require("path");
  var handleWorkers = require_handleWorkers();
  var cleanString = (str) => {
    return str.replace(/\s/g, "").replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "");
  };
  var searchData;
  var search = async ({ searchFile, searchOptions, chunks, indexes, results = 10 }, searchTerm) => {
    const searchResponse = {};
    try {
      if (!searchFile) {
        return "Search file not specified";
      }
      if (!searchData) {
        searchData = await loadData(searchFile, chunks, indexes);
      }
      let options = {};
      const defaultOptions = {
        shouldSort: true,
        includeScore: true,
        threshold: 0.3,
        location: 0,
        distance: 3,
        maxPatternLength: 32,
        minMatchCharLength: 6
      };
      if (!searchOptions) {
        options = defaultOptions;
      } else {
        options = Object.assign({}, defaultOptions, searchOptions);
      }
      const workerScript = join(__dirname, "./worker.js");
      const cleanSearch = cleanString(searchTerm);
      for (const index in indexes) {
        if (indexes.hasOwnProperty(index)) {
          options.keys = indexes[index].keys;
          const workerResponse = await handleWorkers(cleanSearch, searchData, options, chunks, index, workerScript);
          searchResponse[index] = workerResponse.slice(0, results);
        }
      }
    } catch (error) {
      console.log(error);
      searchResponse["error"] = error;
    }
    return searchResponse;
  };
  module2.exports = search;
});

// src/lambda-fuse/post/index.js
var require_post = __commonJS((exports2, module2) => {
  var search = require_search();
  var searchOptions = {
    searchFile: {
      dir: "./data/",
      namePrefix: "ne-address"
    },
    chunks: 6,
    results: 20,
    searchOptions: {
      threshold: 0.5,
      maxPatternLength: 64,
      keys: ["name", "address"]
    },
    indexes: {
      addressIdx: {
        compoundKeys: ["NUMBER", "STREET", "UNIT", "CITY", "source", "POSTCODE"],
        keys: ["addressIdx", "NUMBER", "STREET", "UNIT", "CITY", "source", "POSTCODE"],
        fields: {
          id: "HASH",
          number: "NUMBER",
          street: "STREET",
          unit: "UNIT",
          city: "CITY",
          state: "source",
          zipcode: "POSTCODE",
          lon: "LON",
          lat: "LAT"
        }
      }
    }
  };
  var requestHandler = async (event) => {
    let response = {
      statusCode: 500
    };
    try {
      const body = JSON.parse(event.body);
      const { searchTerm } = body;
      const searchResponse = await search(searchOptions, searchTerm);
      if (!searchResponse.error) {
        response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(searchResponse)
        };
      } else {
        response = {
          statusCode: 500,
          body: `Failed with error ${searchResponse.error}`
        };
      }
    } catch (error) {
      console.log(error);
      console.log(error.stack)
      response = {
        statusCode: 500,
        body: `Failed with error ${error}`
      };
    }
    return response;
  };
  module2.exports = requestHandler;
});

// src/lambda-fuse/get/index.js
var require_get = __commonJS((exports2, module2) => {
  var getResponse = async (event) => {
    const styles = `
        <style>
            .w-100 {
                width: 100%;
            }

            .form-container {
                width: 16rem;
                margin-top: 8rem;
                margin-left: auto;
                margin-right: auto;
                border-radius: 2px;
                border-color: transparent;
                padding: 1.5rem;
                background: #dfdfdf
            }
        </style>
    `;
    const searchForm = `
        <div class="form-container">
            <form id="searchForm">
                <div>
                    <label for="search">Search</label>
                    <input id="search" name="search" type="text" />
                </div>
                <div>
                    <input type="submit"/>
                </div>
            </form>
        </div>
    `;
    const searchResults = ``;
    const html = `
    <html>
        <head>
            ${styles}
        </head>
        <body>
            <div class="w-100">
                ${searchForm}
            </div>
        </body>
    </html>
    `;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: html
    };
  };
  module2.exports = getResponse;
});

// src/lambda-fuse/index.js
__export(exports, {
  lambdaHandler: () => lambdaHandler
});
var import_post = __toModule(require_post());
var import_get = __toModule(require_get());
var lambdaHandler = async (event, context) => {
  let response = {
    statusCode: 500,
    body: "Internal Server Error"
  };
  try {
    switch (event.httpMethod) {
      case "POST":
        console.log('post')
        response = await import_post.default(event);
        break;
      case "GET":
        response = await import_get.default(event);
        break;
      default:
    }
  } catch (err) {
    console.log(err);
  }
  return response;
};
