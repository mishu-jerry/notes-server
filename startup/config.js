const config = require('config'); // to access system enviroment variables

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        console.log('FATAL ERROR: jwtPrivateKey is not defined.');
        // Terminate the application (index.js)
        process.exit(1);
    }
}

/**
 * Create an environment variable that is local to the
 * current Windows PowerShell session:
 *
 * >> $env:varName = 'value'
 *
 * See the required Environment Variable name in-
 * @path ./config/custom-environment-variables.json
 */