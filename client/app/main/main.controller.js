'use strict';

angular.module('mongoCardsApp')
  .controller('MainCtrl', function ($scope, $http, socketio) {
    console.log(socketio.socket);
    socketio.socket.on('news', function (data) {
      console.log('news');
    });

    // $scope.queryString = '';

    // $scope.query = function() {
    //   if ($scope.queryString) {
    //     console.log('Querying: ' + $scope.queryString);
    //   }
    // };

  });
