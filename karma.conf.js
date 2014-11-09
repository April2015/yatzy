module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-touch.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-mocks.js',
      'http://yoav-zibin.github.io/emulator/angular-dragdrop.1.0.8.min.js',
      'http://yoav-zibin.github.io/emulator/ngDraggable.js',
      '*.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'gameLogic.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
            ]

  });
};
