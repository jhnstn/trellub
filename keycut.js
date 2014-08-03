
// Keycut.on('t#${ board }')
+function() {


  var Keycut = window.Keycut || {};

  var boundPatterns = {};

  // var _commandPattern = new RegExp('\${\s*\S+\s*}');
  // var _patternRegex   = new RegExp('((?:' + commandPattern.source + '|(?:[^\$\S]*(?:(?!\${).)*))','g');

  var _patternRegex = /((?:\${\s*\S+\s*})|(?:[^\$\S]*(?:(?!\${).)*))/g;

  var keyCode = {
    enter : 13,
    space : 32,
    esc   : 420
  };
  document.body.addEventListener('keypress', function(e){
    console.log(e);
  });

  var _k = {

    argsArray : function(args) {
      return Array.prototype.slice.call(args, 0);
    },

    identity : function() {
      return this.argsArray(arguments);
    },

    length : function(obj) {
      return obj.length;
    }
  };


  function parseCommand(pattern) {
    var command = pattern.match(_patternRegex);
    if (!command) {
      throw new Error('unable to parse pattern "' + pattern +'"');
    }
    return command
  }


  function buildKeySequence(command) {

    var parsedCommand = parseCommand(command);
    console.log('parsedCommand : ', parsedCommand);
    // return {
    //   command : command,
    //   sequence : [116,35,-1, keyCode.space],
    //   data : {
    //     board : ''
    //   }
    // }

  }

  function bindKeyPress(pattern, done, notify, error) {

    // split on commands
    var keySequence = buildKeySequence(pattern);

    console.log('keySequence : ', keySequence);



  }


  Keycut.on = bindKeyPress;

  window.Keycut = Keycut;

}();
