'use strict';

/* Controllers */
var spotifyListApp = angular.module('spotifyListApp', []);

spotifyListApp.controller('SpotifySongList', ['$scope', '$sce', '$http', function($scope, $sce, $http) {
  $scope.songs = null;
  function refreshSongList(){
    $.get('/songs').then(function(data) {
      $scope.$apply(function() {
        $scope.songs = data;
      });
    });
  }
  refreshSongList();
/*[
      {'name': 'Bad Blood', 'votes': 0},
      {'name': 'Hello', 'votes': 0},
      {'name': 'Payphone', 'votes': 0}
  ];*/
  $scope.sortChoice = '-votes';
  $scope.url = null;
  $scope.searchResults = [];

  $scope.upvote = function(song) {
    // TODO: how are songs' changes reflected from Mongo to frontend?
    $.ajax({
      url: '/songs/up',
      type: 'PUT',
      data: {'songID': song.songID},
      success: function(data){
        //TODO
        console.log(data);
        refreshSongList();
        /*var index = null;
        $scope.songs.find(function callback(el, ind, ary) {
          if (el.songID = song.songID) index = ind;
          return;
        });
        console.log(index);*/
      },
      failure: function() {
        console.log('error');
      }
    }).then(function() {
      refreshSongList();
    })
  }

  $scope.search = function() {
    $.ajax({
      url: "https://api.spotify.com/v1/search?q=" + $scope.songsearch.split(' ').join('%20') + "&type=track",
      type: "GET",
      success: function(data) {
        $scope.$apply(function() {$scope.searchResults = [];});
        var length = data.tracks.items.length;
        for(var i = 0; i < length; i++) {
          $scope.$apply(function() {
            $scope.searchResults.push({
              'name': data.tracks.items[i].name,
              'id': data.tracks.items[i].id,
              'artist': data.tracks.items[i].artists[0].name
            });
         });
        }
      }
    });
  }

  $scope.queue = function(result) {
    $.post('/songs', result, function success(data) {
      console.log('refresh on enqueue');
      refreshSongList();
    });
    // TODO: updating view
  }

  $scope.url = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:track:" + $scope.songsearch /*4th1RQAelzqgY7wL53UGQt"*/);


}]);


/*angular.module('queueServices', ['ngResource']).
  factory('songSchema', function($resource) {
    return $resource('/songs', {}, {
      query: { method: 'GET', isArray: true}
    })
  });
*/


