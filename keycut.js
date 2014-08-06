
// Keycut.on('t#${ board }')
+function() {

  var Keycut = window.Keycut || {};

  window._k = {

    argsArray : function(args) {
      return Array.prototype.slice.call(args, 0);
    },

    identity : function() {
      return this.argsArray(arguments);
    },

    length : function(obj) {
      return obj.length;
    },

    charCode : function(ch) {
      return ch.charCodeAt(0);
    },

    last : function(arr) {
      return arr[arr.length-1];
    },

    isNegative : function(num) {
      return num < 0;
    },
    isEmpty : function(obj) {
      return !Object.keys(obj || {}).length;
    }
  };

  var boundPatterns = {};
  var commandTree = {};

  var _commandPattern = /\${\s*(\S+)\s*}/;
  var _patternRegex = /((?:\${\s*\S+\s*})|(?:[^\$\S]*(?:(?!\${).)*))/g;
  var _commandSequence = [];
  var _currentCommand = {};
  var keyCode;

  var keyCode = {
    enter : 13,
    space : 32,
    esc   : 27,
    del   : 8
  };

  document.body.addEventListener('keypress', function(e) {
    keyCode = e.which;
    var userCommand = Object.keys(_currentCommand).some(_k.isNegative);

    if (userCommand) {
      if (_currentCommand[-keyCode]) {
        console.log('found command ', String.fromCharCode.apply(String,_commandSequence));
        _currentCommand = _currentCommand[-keyCode];
        _commandSequence = [];
      }
      else {
        _commandSequence.push(keyCode);
      }
    }
    else {
      _currentCommand = _k.isEmpty(_currentCommand) ? commandTree[keyCode] : _currentCommand[keyCode];

      if ( _currentCommand && _currentCommand.done ) {
        _currentCommand.done.call(null, _currentCommand );
        _commandSequence = [];
      }

      _currentCommand = _currentCommand || {};
    }
  });

  function parseCommand(pattern) {
    var command = pattern.match(_patternRegex);
    if (!command) {
      throw new Error('unable to parse pattern "' + pattern +'"');
    }
    console.log('parsedCommand : ', command);
    return command.filter(_k.length);
  }


  function buildKeySequence(command) {
    var sequence = [];
    var userCommand;
    var userData = [];
    var parsedCommand = parseCommand(command);
    var subSequence;
    var escapeCommand = 1;

    parsedCommand.forEach(function(chars) {
      userCommand = chars.match(_commandPattern);
      if (userCommand) {
        escapeCommand = -1;
        userData.push([userCommand, '']);
      }
      else {
        subSequence = chars.split('').map(_k.charCode);
        subSequence[0] *= escapeCommand;
        escapeCommand  *= escapeCommand;
        sequence = sequence.concat(subSequence);
      }
    });

    sequence[sequence.length-1] *= escapeCommand;
    return {
      command : command,
      sequence : sequence,
      data : userData
    };
  }

  function bindKeyPress(pattern, done, notifiy, error) {
    var keySequence = buildKeySequence(pattern);
    var _level = commandTree;
    var lastCommandIndex = keySequence.sequence.length - 1;

    keySequence.done    = done    || _k.identity;
    keySequence.notifiy = notifiy || _k.identity;

    keySequence.sequence.forEach( function(keyCode,index) {

      if (index === lastCommandIndex) {
        _level[keyCode] = keySequence;
        return;
      }

      if (!_level[keyCode]) {
        _level[keyCode] = {};
      }

      _level = _level[keyCode];
    });
    _level = keySequence;
  }


  Keycut.on = bindKeyPress;

  window.Keycut = Keycut;

}();
