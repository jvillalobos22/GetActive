myApp.controller('SingleEventController',
    ['$scope', '$rootScope', '$location', '$firebaseObject', '$firebaseAuth', '$firebaseArray', '$routeParams', 'FIREBASE_URL',
    function($scope, $rootScope, $location, $firebaseObject, $firebaseAuth, $firebaseArray, $routeParams, FIREBASE_URL) {

        $scope.whichevent = $routeParams.eId;

        var ref = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent);
        var single_event = $firebaseObject(ref);
        $scope.singleEvent = single_event;

        $scope.updateEvent = function() {
            single_event.$save().then(function(ref) {
                ref.key() === single_event.$id; // true
            }, function(error) {
                console.log("Error:", error);
            });
        }
}]); // controller
