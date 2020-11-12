// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["chrome_headless"],
    browserNoActivityTimeout: 30000,
    singleRun: false,
    customLaunchers: {
      chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      },
      chrome_no_sandbox: {
        base: 'Chrome',
        flags: ['--disable-web-security', '--no-sandbox', '--user-data-dir="."']
      },
      chrome_headless: {
        base: 'Chrome',
        flags: ['--headless','--disable-web-security', '--no-sandbox','--remote-debugging-port=9222', '--user-data-dir="."', '--disable-gpu','--enable-logging','--v=1', '--disable-features=VizDisplayCompositor']
      }
    },
    files: [
      { pattern: './node_modules/jquery/dist/jquery.js', watched: false },
      { pattern: './node_modules/jquery-ui-dist/jquery-ui.js', watched: false }
    ]
  });
};
