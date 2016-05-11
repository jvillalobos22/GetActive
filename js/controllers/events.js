myApp.controller('EventsController',
    ['$scope', '$rootScope', '$location', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function($scope, $rootScope, $location, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function(authUser) {
            if(authUser) {
                var eventsRef = new Firebase(FIREBASE_URL + '/events');
                var eventsInfo = $firebaseArray(eventsRef);

                $scope.events = eventsInfo;

                eventsInfo.$loaded().then(function(data) {
                    $rootScope.howManyEvents = eventsInfo.length;
                }); // Make sure event data is loaded

                eventsInfo.$watch(function(data) {
                    $rootScope.howManyEvents = eventsInfo.length;
                }); // Watch event data for changes

                $scope.addEvent = function() {
                    if (!$scope.skill) {
                        $scope.skill = '';
                    }
                    eventsInfo.$add({
                        name: $scope.eventname,
                        created_date: Firebase.ServerValue.TIMESTAMP,
                        activity_type: $scope.activitytype,
                        players_required: $scope.playersrequired,
                        location: $scope.location,
                        summary: $scope.summary,
                        skill_level: $scope.skill,
                        players_attending: 1
                    }).then(function() {
                        $scope.eventname = '';
                        $location.path('/events');
                    });// promise
                }; // addEvent

                $scope.deleteEvent = function(key) {
                    eventsInfo.$remove(key);
                }; // deleteEvent
            } // User Authenticated
        }); // onAuth
}]); // controller
