// 'use strict';

// angular.module('myApp.messageService', [])
//   .service('messageService', function($window, $log, $rootScope) {
angular.module('myApp').factory('messageService',
    ["gameLogic",
        function (gameLogic) {
    var $log = log;
    this.sendMessage = function (message) {
      $log.info("Game sent message", message);
      $window.parent.postMessage(message, "*");
    };
    this.addMessageListener = function (listener) {
      $window.addEventListener("message", function (event) {
        $rootScope.$apply(function () {
          var message = event.data;
          $log.info("Game got message", message);
          listener(message);
        });
      }, false);
    };
  });
