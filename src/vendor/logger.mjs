/*!
 * logger@1.0.0 https://github.com/EvitcaStudio/Logger
 * Compiled Sat, 04 May 2024 15:17:54 UTC
 *
 * logger is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/** 
 * @file A small library to class up log messages.
 * 
 * @author https://github.com/doubleactii
 * @license Logger does not have a license at this time. For licensing contact the author
 */
/**
 * The Logger class  
 * A small library to class up log messages.
 * @example <caption>Example usage of this class</caption>
 * import { Logger } from './logger.min.js';
 * 
 * const logger = new Logger();
 * 
 * logger.registerType('EXAMPLE', logger.FG_BLUE);
 * 
 * logger.prefix('EXAMPLE').log('Logger started');
 * 
 * // Assert example
 * const a = 10, b = 5;
 * 
 * logger.assert(a % b == 1, 'error at a%b==1');
 * logger.assert(a > b, 'error at a>b');
 * logger.assert(b > a, 'error at b>a');
 * 
 * // Counter example
 * for (let i = 0; i < 4; i ++) {
 *   logger.count('Example Label');
 * }
 * logger.countReset('Example Label');
 * logger.count('Example Label');
 * 
 * // Debug example
 * logger.debug('Debug example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').debug('Debug example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * 
 * // Error example
 * logger.error('Error example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').error('Error example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * 
 * // Warn example
 * logger.warn('Warn example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').warn('Warn example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * 
 * // Info example
 * logger.info('Info example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').info('Info example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * 
 * // Log example
 * logger.log('Log example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').log('Log example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * 
 * // Group example
 * // group and groupCollapsed are interchangeable
 * logger.prefix('EXAMPLE').log("This is the outer level");
 * logger.prefix('EXAMPLE').groupCollapsed('Example Label2');
 * logger.prefix('EXAMPLE').prefix('EXAMPLE').log("Level 2");
 * logger.prefix('EXAMPLE').groupCollapsed('Example Label3');
 * logger.prefix('EXAMPLE').log("Level 3");
 * logger.prefix('EXAMPLE').warn("More of level 3");
 * logger.groupEnd('Example Label3');
 * logger.prefix('EXAMPLE').log("Back to level 2");
 * logger.groupEnd('Example Label2');
 * logger.prefix('EXAMPLE').log("Back to the outer level");
 * 
 * // Table example
 * logger.table(["apples", "oranges", "bananas"]);
 * 
 * // Time example
 * logger.time("Time example");
 * // Time passes by
 * logger.timeLog("Time example");
 * 
 * logger.prefix('EXAMPLE').time("Time example");
 * // Time passes by
 * logger.prefix('EXAMPLE').timeLog("Time example");
 * 
 * // Trace example
 * function foo() {
 *   function bar() {
 *     logger.trace();
 *   }
 *   bar();
 * }
 * 
 * foo();
 * 
 * // Clear the console example
 * setTimeout(() => { logger.clear(); }, 5000);
 */
class Logger {
    /**
     * @param {Array<object>} [pTypes] - Array of type objects to register
     * @param {string} [pTypes[].type] - The type of 
     * @param {string} [pTypes[].ansi] - The employee's department.
     */
    constructor(pTypes) {
      // Settings
      /**
       * @private
       * @type {string} RESET - RESET code in ANSI code
       */
      this.RESET = "\x1b[0m";
      /**
       * @type {string} BRIGHT - BRIGHT code in ANSI code
       */
      this.BRIGHT = "\x1b[1m";
      /**
       * @type {string} DIM - DIM code in ANSI code
       */
      this.DIM = "\x1b[2m";
      /**
       * @type {string} UNDERSCORE - UNDERSCORE code in ANSI code
       */
      this.UNDERSCORE = "\x1b[4m";
      /**
       * @type {string} BLINK - BLINK code in ANSI code
       */
      this.BLINK = "\x1b[5m";
      /**
       * @type {string} REVERSE - REVERSE code in ANSI code
       */
      this.REVERSE = "\x1b[7m";
      /**
       * @type {string} HIDDEN - HIDDEN code in ANSI code
       */
      this.HIDDEN = "\x1b[8m";
  
      // Foreground
      /**
       * @type {string} FG_BLACK - FG_BLACK code in ANSI code
       */
      this.FG_BLACK = "\x1b[30m";
      /**
       * @type {string} FG_RED - FG_RED code in ANSI code
       */
      this.FG_RED = "\x1b[31m";
      /**
       * @type {string} FG_GREEN - FG_GREEN code in ANSI code
       */
      this.FG_GREEN = "\x1b[32m";
      /**
       * @type {string} FG_YELLOW - FG_YELLOW code in ANSI code
       */
      this.FG_YELLOW = "\x1b[33m";
      /**
       * @type {string} FG_BLUE - FG_BLUE code in ANSI code
       */
      this.FG_BLUE = "\x1b[34m";
      /**
       * @type {string} FG_MAGENTA - FG_MAGENTA code in ANSI code
       */
      this.FG_MAGENTA = "\x1b[35m";
      /**
       * @type {string} FG_CYAN - FG_CYAN code in ANSI code
       */
      this.FG_CYAN = "\x1b[36m";
      /**
       * @type {string} FG_WHITE - FG_WHITE code in ANSI code
       */
      this.FG_WHITE = "\x1b[37m";
      /**
       * @type {string} FG_GRAY - FG_GRAY code in ANSI code
       */
      this.FG_GRAY = "\x1b[90m";
  
      // Background
      /**
       * @type {string} BG_BLACK - BG_BLACK code in ANSI code
       */
      this.BG_BLACK = "\x1b[40m";
      /**
       * @type {string} BG_RED - BG_RED code in ANSI code
       */
      this.BG_RED = "\x1b[41m";
      /**
       * @type {string} BG_GREEN - BG_GREEN code in ANSI code
       */
      this.BG_GREEN = "\x1b[42m";
      /**
       * @type {string} BG_YELLOW - BG_YELLOW code in ANSI code
       */
      this.BG_YELLOW = "\x1b[43m";
      /**
       * @type {string} BG_BLUE - BG_BLUE code in ANSI code
       */
      this.BG_BLUE = "\x1b[44m";
      /**
       * @type {string} BG_MAGENTA - BG_MAGENTA code in ANSI code
       */
      this.BG_MAGENTA = "\x1b[45m";
      /**
       * @type {string} BG_CYAN - BG_CYAN code in ANSI code
       */
      this.BG_CYAN = "\x1b[46m";
      /**
       * @type {string} BG_WHITE - BG_WHITE code in ANSI code
       */
      this.BG_WHITE = "\x1b[47m";
      /**
       * @type {string} BG_GRAY - BG_GRAY code in ANSI code
       */
      this.BG_GRAY = "\x1b[100m";
      /**
       * @private
       * @type {number} TYPE_SPACER_LENGTH - The type's spacing
       */
      this.TYPE_SPACER_LENGTH = 13;
      /**
       * The types of this logger  
       * 
       * @private
       * @type {object} types - The types of this logger  
       * @property {string} default - The FG_WHITE code in ANSI code
       */
      this.types = {
        default: this.FG_WHITE
      };
      /**
       * @private
       * @type {string} currentType - The type of message to display
       */
      this.currentType = '';
      /**
       * @private
       * @type {string} SPACE_CHAR - The space char
       */
      this.SPACE_CHAR = ' ';
      // https://talyian.github.io/ansicolors/
      // \x1b[38;5;[n]m is foreground, \x1b[48;5;[n]m is background
      // The first 16 entries are the basic color table again
      // The next 216 entries are a 6x6x6 cube
      // The final 24 entries are a grayscale ramp
      /**
       * @type {object} FG_COLORS - An object containing all ANSI color codes
       */
      this.FG_COLORS = {};
      for (let i = 0; i <= 255; i++) {
        this.FG_COLORS[i] = '\x1b[38;5;' + i + 'm';
      }
      /**
       * @type {object} BG_COLORS - An object containing all ANSI color codes
       */
      this.BG_COLORS = {};
      for (let i = 0; i <= 255; i++) {
        this.BG_COLORS[i] = '\x1b[48;5;' + i + 'm';
      }
      if (Array.isArray(pTypes)) {
        this.registerTypes(pTypes);
      }
    }
    /**
        * Apply a prefix to the message
     * @param {string} pType - The type of log message
     */
    prefix(pType) {
      if (typeof pType === 'string') this.currentType = pType;
      return this;
    }
    /**
     * Log the message via pMethod
     * 
     * @private
     * @param {string} pMethod - The console method to use
     * @param  {...string} pMessage - string, or array of strings of messages
     */
    message(pMethod = 'log', ...pMessage) {
      const TYPE = this.currentType ? this.currentType : '';
      // If the type is empty then we do not need to add the spacer
      const IS_EMPTY_TYPE = TYPE.length === 0;
      if (IS_EMPTY_TYPE) {
        console[pMethod](...pMessage);
      } else {
        // In the event the type is longer than the spacer, we need to add a padding of one space
        const TYPE_LONGER_THAN_SPACER = TYPE.length >= this.TYPE_SPACER_LENGTH;
        // The color to use for the type
        let TYPE_COLOR = this.types[TYPE.toLowerCase()] ? this.types[TYPE.toLowerCase()] : this.types.default;
        // Check if the color is ANSI or CSS
        const IS_ANSI = TYPE_COLOR.includes('\x1b');
        if (!IS_ANSI) {
          TYPE_COLOR = `color: ${TYPE_COLOR}`;
        }
        if (globalThis.window) {
          if (IS_ANSI) {
            console[pMethod](TYPE_COLOR + TYPE + this.SPACE_CHAR.repeat(Math.max(this.TYPE_SPACER_LENGTH - TYPE.length, TYPE_LONGER_THAN_SPACER ? 1 : 0)) + '|' + this.RESET, ...pMessage);
          } else {
            console[pMethod]('%c' + TYPE + this.SPACE_CHAR.repeat(Math.max(this.TYPE_SPACER_LENGTH - TYPE.length, TYPE_LONGER_THAN_SPACER ? 1 : 0)) + '|', TYPE_COLOR, ...pMessage);
          }
        } else {
          console[pMethod](TYPE_COLOR + TYPE + this.SPACE_CHAR.repeat(Math.max(this.TYPE_SPACER_LENGTH - TYPE.length, TYPE_LONGER_THAN_SPACER ? 1 : 0)) + '|' + this.RESET, ...pMessage);
        }
      }
      // Reset the current type
      this.currentType = '';
    }
    /**
     * @param {Array.<String>} pMessage - The message to log
     */
    log(...pMessage) {
      this.message('log', ...pMessage);
    }
    /**
     * @param {Array.<String>} pMessage - The message to log in info format
     */
    info(...pMessage) {
      this.message('info', ...pMessage);
    }
    /**
     * @param {Array.<String>} pMessage - The message to log in error format
     */
    error(...pMessage) {
      this.message('error', ...pMessage);
    }
    /**
     * @param {Array.<String>} pMessage - The message to log in warning format
     */
    warn(...pMessage) {
      this.message('warn', ...pMessage);
    }
    /**
     * The console.assert() method writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.
     * 
     * @param  {...any} pMessage 
     */
    assert(...pMessage) {
      console.assert(...pMessage);
    }
    /**
     * The console.debug() method outputs a message to the web console at the "debug" log level. The message is only displayed to the user if the console is configured to display debug output. In most cases, the log level is configured within the console UI. This log level might correspond to the Debug or Verbose log level.
     * 
     * @param  {...any} pMessage 
     */
    debug(...pMessage) {
      this.message('debug', ...pMessage);
    }
    /**
     * The console.count() method logs the number of times that this particular call to count() has been called.
     * 
     * @param {string} [pLabel] - A string. If supplied, count() outputs the number of times it has been called with that label. If omitted, count() behaves as though it was called with the "default" label.
     */
    count(pLabel) {
      console.count(pLabel);
    }
    /**
     * The console.countReset() method resets counter used with console.count().
     * 
     * @param {string} [pLabel] - A string. If supplied, countReset() resets the count for that label to 0. If omitted, countReset() resets the default counter to 0.
     */
    countReset(pLabel) {
      console.countReset(pLabel);
    }
    /**
     * The console.table() method displays tabular data as a table.
     * 
     * @param {[]|object} pData - The data to display. This must be either an array or an object.
     * @param {[]} pColumns - An array containing the names of columns to include in the output.
     */
    table(pData, pColumns) {
      console.table(pData, pColumns);
    }
    /**
     * The console.time() method starts a timer you can use to track how long an operation takes. You give each timer a unique name, and may have up to 10,000 timers running on a given page. When you call console.timeEnd() with the same name, the browser will output the time, in milliseconds, that elapsed since the timer was started.
     * @param {string} pLabel - A string representing the name to give the new timer. This will identify the timer; use the same name when calling console.timeEnd() to stop the timer and get the time output to the console.
     */
    time(pLabel) {
      this.message('time', pLabel);
    }
    /**
     * The console.timeLog() method logs the current value of a timer that was previously started by calling console.time().
     * 
     * @param {string} [pLabel] - The name of the timer to log to the console. If this is omitted the label "default" is used.
     */
    timeLog(pLabel) {
      this.message('timeLog', pLabel);
    }
    /**
     * The console.timeEnd() stops a timer that was previously started by calling console.time().
     * @param {string} pLabel - A string representing the name of the timer to stop. Once stopped, the elapsed time is automatically displayed in the Web console along with an indicator that the time has ended.
     */
    timeEnd(pLabel) {
      this.message('timeEnd', pLabel);
    }
    /**
     * The console.trace() method outputs a stack trace to the Web console.
     * 
     * @param  {...any} [pMessage] - Zero or more objects to be output to console along with the trace. These are assembled and formatted the same way they would be if passed to the console.log() method.
     */
    trace(...pMessage) {
      this.message('trace', ...pMessage);
    }
    /**
     * The console.group() method creates a new inline group in the Web console log, causing any subsequent console messages to be indented by an additional level, until console.groupEnd() is called.
     * 
     * @param {string} [pLabel] - Label for the group.
     */
    group(pLabel) {
      this.message('group', pLabel);
    }
    /**
     * The console.groupCollapsed() method creates a new inline group in the Web Console. Unlike console.group(), however, the new group is created collapsed. The user will need to use the disclosure button next to it to expand it, revealing the entries created in the group.
     * 
     * @param {string} [pLabel] - Label for the group. Optional.
     */
    groupCollapsed(pLabel) {
      console.groupCollapsed(pLabel);
    }
    /**
     * The console.groupEnd() method exits the current inline group in the Web console. See Using groups in the console in the console documentation for details and examples.
     */
    groupEnd() {
      console.groupEnd();
    }
    /**
     * Clears the console
     */
    clear() {
      console.clear();
    }
    /**
     * Registers a type to this logger
     * 
     * @param {string} pType - The type to register to this logger
     * @param {string} pAnsiInfo - The color this type will be when logged
     */
    registerType(pType, pAnsiInfo) {
      if (this.types[pType]) return;
      if (typeof pType === 'string' && typeof pAnsiInfo === 'string') {
        this.types[pType.toLowerCase()] = pAnsiInfo;
      }
    }
    /**
     * Registers the types in the pTypes array.
     * @param {*} pTypes - The type array that contains the types to register.
     */
    registerTypes(pTypes) {
      if (Array.isArray(pTypes)) {
        for (let i = 0; i < pTypes.length; i++) {
          this.registerType(pTypes[i].type, pTypes[i].ansi);
        }
      }
    }
    /**
     * Unregisters a type from this logger
     * @param {string} pType - The type to unregister from this logger
     */
    unregisterType(pType) {
      if (this.types[pType]) delete this.types[pType];
    }
  }
  
  export { Logger };
  //# sourceMappingURL=logger.mjs.map
  