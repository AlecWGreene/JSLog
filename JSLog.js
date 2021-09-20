const colors = require("colors");
const config = require("./JSLogConfig.json");

/**
* Applies the log data to the format to output a string 
*
* @param {String} category 
* @param {String} verbosity 
* @param {String} message 
* @param {Date} timestamp 
* @param {String} format 
* @returns {String} Formatted string to use in a log
*/
function generateLogMessage(category, verbosity, message, timestamp = new Date(), format = "[<<timestamp>>] <<category>>: <<message>>") {
   let output = format;

   // Format timestamp
   let timeString = "<<year>>.<<month>>.<<day>>-<<hours>>:<<minutes>>:<<seconds>>";
   if (timestamp){
       timeString = timeString.replace(/<<year>>/g, timestamp.getFullYear());
       timeString = timeString.replace(/<<month>>/g, timestamp.getMonth());
       timeString = timeString.replace(/<<day>>/g, timestamp.getDate());
       timeString = timeString.replace(/<<hours>>/g, timestamp.getHours());
       timeString = timeString.replace(/<<minutes>>/g, timestamp.getMinutes());
       timeString = timeString.replace(/<<seconds>>/g, timestamp.getSeconds());
   }

   // Fill in format template
   output = output.replace(/<<timestamp>>/g, timeString);
   output = output.replace(/<<message>>/g, message);
   output = output.replace(/<<category>>/g, category);
   output = output.replace(/<<verbosity>>/g, verbosity);

   return output;
}

module.exports = {
    categories: config.categories,
    verbosities: config.verbosities,
    format: config.format,
    /** 
     * This object has methods for automatically format log messages, primarily for non-console logs 
     */
    logGenerator: {
        display: (category, message, timestamp = new Date(), bWithColor = false) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            return output;
        },
        verbose: (category, message, timestamp = new Date(), bWithColor = false) => {
            const output = generateLogMessage(category, config.verbosities.verbose, message, timestamp, config.settings.format);
            return bWithColor ? output.grey : output;
        },
        warn: (category, message, timestamp = new Date(), bWithColor = false) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            return bWithColor ? output.yellow : output;
        },
        error: (category, message, timestamp = new Date(), bWithColor = false) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            return bWithColor ? output.red : output;
        },
        log: generateLogMessage
    },
    /** 
     * This object has methods which will format a message, and display it in the console log. 
     */
    logger: {
        /**
         * Logs a message in a generic way
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} message A message dictating why the log is being output
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         * @param {Boolean} bWithColor optional flag to toggle the color on warn/error/verbose messages.
         */
        display: (category, message, timestamp = new Date(), logFunction = undefined, bWithColor = true) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            const func = logFunction ? logFunction : console.log;
            func(output);
        },
        /**
         * Logs a message in a generic way
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} message A message dictating why the log is being output
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         * @param {Boolean} bWithColor optional flag to toggle the color on warn/error/verbose messages.
         */
        verbose: (category, message, timestamp = new Date(), logFunction = undefined, bWithColor = true) => {
            const output = generateLogMessage(category, config.verbosities.verbose, message, timestamp, config.settings.format);
            const func = logFunction ? logFunction : console.log;
            func((!logFunction && bWithColor) ? output.grey : output);
        },
        /**
         * Logs a message in a generic way
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} message A message dictating why the log is being output
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         * @param {Boolean} bWithColor optional flag to toggle the color on warn/error/verbose messages.
         */
        warn: (category, message, timestamp = new Date(), logFunction = undefined, bWithColor = true) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            const func = logFunction ? logFunction : console.log;
            func((!logFunction && bWithColor) ? output.yellow : output);
        },
        /**
         * Logs a message in a generic way
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} message A message dictating why the log is being output
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         * @param {Boolean} bWithColor optional flag to toggle the color on warn/error/verbose messages.
         */
        error: (category, message, timestamp = new Date(), logFunction = undefined, bWithColor = true) => {
            const output = generateLogMessage(category, config.verbosities.display, message, timestamp, config.settings.format);
            const func = logFunction ? logFunction : console.log;
            func((!logFunction && bWithColor) ? output.red : output);
        },
        /**
         * Logs a repeated character to use for indicating a section header
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} verbosity The importance of the log
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Number} width Number of repitions, defaults to settings
         * @param {String} character Character to repeat, defaults to settings
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         */
        header: (category, verbosity, timestamp = new Date(), width = undefined, character = undefined, logFunction = undefined, format = undefined) => {
            const headerCharacter = character ? character : config.settings.cosmetics.header.character;
            const headerWidth = width ? width : config.settings.cosmetics.header.width;
            const func = logFunction ? logFunction : console.log;

            // Apply color
            let output = generateLogMessage(category, verbosity, headerCharacter.repeat(headerWidth), timestamp, format ? format : config.settings.format);
            if (!logFunction){
                switch(verbosity){
                    case config.verbosities.verbose:
                        output = output.grey;
                        break;
                    case config.verbosities.warning:
                        output = output.yellow;
                        break;
                    case config.verbosities.error:
                        output = output.red;
                        break;
                }
            }

            func(output);
        },
        /**
         * Logs a repeated character to use for indicating a section header
         * 
         * @param {String} category The category or section of the code which the log pertains to
         * @param {String} verbosity The importance of the log
         * @param {Date} timestamp Time at which the log is being output, defaults to current time
         * @param {Number} width Number of repitions, defaults to settings
         * @param {String} character Character to repeat, defaults to settings
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         */
        divider: (category, verbosity, timestamp = new Date(), width = undefined, character = undefined, logFunction = undefined) => {
            const headerCharacter = character ? character : config.settings.cosmetics.divider.character;
            const headerWidth = width ? width : config.settings.cosmetics.divider.width;
            const func = logFunction ? logFunction : console.log;

            // Apply color
            let output = generateLogMessage(category, verbosity, headerCharacter.repeat(headerWidth), timestamp, config.settings.format);
            switch(verbosity){
                case config.verbosities.verbose:
                    output = output.grey;
                    break;
                case config.verbosities.warning:
                    output = output.yellow;
                    break;
                case config.verbosities.error:
                    output = output.red;
                    break;
            }

            func(output);
        },
        /**
         * Logs \n to make an empty line in the stream
         * 
         * @param {Function} logFunction The function to handle outputting the formatted log message. If undefined, console.log will be used.
         */
        linebreak: (logFunction = undefined)=>{
            const func = logFunction ? logFunction : console.log;
            func("\n");
        }
    }
};