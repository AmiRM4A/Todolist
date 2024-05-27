const path = require('path');

module.exports = {
    // Entry point for the application
    entry: './assets/js/app.js',

    // Set the mode to production
    mode: "production",

    // Output configuration
    output: {
        // Resolve the output path to the 'dist' folder
        path: path.resolve(__dirname, 'dist'),

        // Output file name
        filename: 'main.js',
    }
};