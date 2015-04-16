'use strict';

angular.module('mongoCardsApp')
.controller('MainCtrl', function ($scope, $http, socketio) {
  console.log(socketio.socket);
    
    var count=0;
    function nextID() {
      return count++;
    }

    // Max number of rows displayed in each card.
    $scope.rowLimit = 10;
  
    var Card = function (id, queryString, queryResults) {
      this.id = id;
      this.query = queryString;
      this.elements = queryResults;
    };

    // Mapping from card ID to card.
    $scope.cards = {};

   //  $scope.query = function() {
   //    var queryID = nextID();
   //    if ($scope.queryString) {
   //      console.log('Querying: ' + $scope.queryString);
   //      var queryObj = angular.toJson($scope.queryString);
   //     $http
   //     .get('/api/v1/search', {
   //      params: {
   //        json: $scope.queryString,
   //        queryID: queryID
   //      }
   //    })
   //     .success(function (data, status) {
   //      var dataObj = angular.fromJson(data);
   //      var c = new Card(queryID, $scope.queryString, dataObj);
   //      $scope.cards[c.id] = c;
   //    });
   //   }
   // };

    $scope.query = function() {
      var queryID = nextID();
      if ($scope.queryString) {
        console.log('Querying stream: ' + $scope.queryString);
        //var queryObj = angular.toJson($scope.queryString);
       $http
       .get('/api/v1/searchstream', {
        params: {
          json: $scope.queryString,
          queryID: queryID
        }
      })
       .success(function (data, status) {
        console.log(data);
        //var dataObj = angular.fromJson(data);
        var c = new Card(queryID, $scope.queryString, []);
        $scope.cards[c.id] = c;
        var streamID = 'stream' + queryID;
        console.log(streamID);
        socketio.socket.on(streamID, function(streamData){
          console.log(streamData);
          $scope.$apply(function (){
            $scope.cards[c.id].elements.push(streamData);
          });
        });
      });
     }
   };

    // socketio.socket.on('news', function (data) {
    //   console.log('news');
    // });

 });
