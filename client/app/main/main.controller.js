'use strict';

angular.module('mongoCardsApp')
  .controller('MainCtrl', function ($scope, $http, socketio) {
    console.log(socketio.socket);

    // socketio.socket.on('news', function (data) {
    //   console.log('news');
    // });

    // An array of objects containing a query and array of search results
    $scope.queryResults = [{query:'a query', elements:[{foo:'bar'}, {baz:'qux'}]}];

    $scope.queryString = '';

    $scope.query = function() {
      if ($scope.queryString) {
        console.log('Querying: ' + $scope.queryString);
        $scope.queryResults.push({query:$scope.queryString, elements:[]});
      }
    };

  });
