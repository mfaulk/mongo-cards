'use strict';

angular.module('mongoCardsApp')
.filter('prettyJSON', function () {
    function syntaxHighlight(json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return syntaxHighlight;
})
.controller('MainCtrl', function ($scope, $http, socketio) {
  console.log(socketio.socket);

    // socketio.socket.on('news', function (data) {
    //   console.log('news');
    // });

    // An array of objects containing a query and array of search results
    //$scope.queryResults = [{query:'a query', elements:[{foo:'bar'}, {baz:'qux'}]}];
    $scope.queryResults = [];

    $scope.queryString = '';

    $scope.query = function() {
      if ($scope.queryString) {
        console.log('Querying: ' + $scope.queryString);
        var queryObj = angular.toJson($scope.queryString);
        console.log(queryObj);
       $http
       .get('/api/v1/search', {
        params: {
          json: $scope.queryString
        }
      })
       .success(function (data, status) {
        console.log(data);
        var dataObj = angular.fromJson(data);
        console.log(dataObj);
        $scope.queryResults.push({query:$scope.queryString, elements:dataObj});
      });

       
     }
   };

 });
