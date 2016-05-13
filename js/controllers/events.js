myApp.controller('EventsController',
    ['$scope', '$rootScope', '$location', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$routeParams','FIREBASE_URL',
    function($scope, $rootScope, $location, $firebaseAuth, $firebaseArray, $firebaseObject, $routeParams, FIREBASE_URL) {

        if($routeParams.query) {
            $scope.query = $routeParams.query;
        }
        console.log($scope.query);
        console.log($routeParams.query);

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

                $scope.addEvent = function(myEvent) {
                    if (!$scope.skill) {
                        $scope.skill = '';
                    }

                    if (!$scope.locationaddress) {
                        $scope.locationaddress = '';
                    }

                    if (!$scope.locationzip) {
                        $scope.locationzip = '';
                    }


                    if($scope.starttime.meridian == "PM") {
                        var myStartTime = $scope.starttime.hour;
                        myStartTime += 12;
                    }
                    if($scope.endtime.meridian == "PM") {
                        var myEndTime = $scope.endtime.hour;
                        myEndTime += 12;
                    }

                    var startTime = $scope.eventdate + 'T' + myStartTime + ':' + $scope.starttime.min + ':00';
                    var endTime = $scope.eventdate + 'T' + myEndTime + ':' + $scope.endtime.min + ':00';

                    eventsInfo.$add({
                        name: $scope.eventname,
                        created_date: Firebase.ServerValue.TIMESTAMP,
                        activity_type: $scope.activitytype,
                        players_required: $scope.playersrequired,
                        location: $scope.locationname,
                        location_address: {
                            address: $scope.locationaddress,
                            city: $scope.locationcity,
                            state: $scope.locationstate,
                            zip: $scope.locationzip,
                        },
                        summary: $scope.summary,
                        skill_level: $scope.skill,
                        players_attending: 1,
                        creator_id: $rootScope.currentUser.$id,
                        creator_name: $rootScope.currentUser.firstname,
                        event_date: $scope.eventdate.toString(),
                        event_start_time: startTime,
                        event_end_time: endTime,
                        status: 'pending'
                    }).then(function() {
                        $scope.eventname = '';
                        $location.path('/events');
                    });// promise

                }; // addEvent

                $scope.deleteEvent = function(key) {
                    eventsInfo.$remove(key);
                }; // deleteEvent

                $scope.currentUsersEvent = function(event) {
                    if(event.creator_id === $rootScope.currentUser.$id) {
                        return true;
                    }
                }

                $scope.updateStatus = function(event, id) {
                    endTime = new Date(event.event_end_time);
                    startTime = new Date(event.event_start_time);
                    currentTime = new Date();
                    if ( endTime < currentTime ) {
                        // event is over
                        $scope.eventstatus = 'Completed';
                    } else if ( startTime < currentTime ) {
                        // event is underway
                        $scope.eventstatus = 'In Progress';
                    } else {
                        // event is in the future
                        if ( event.players_attending < event.players_required ) {
                            $scope.eventstatus = 'Pending';
                        } else {
                            $scope.eventstatus = 'On';
                        }
                    }


                    event.eventstatus = $scope.eventstatus;
                    console.log('event id: ' + id);
                    console.log(event.name + $scope.eventstatus);
                };

                $scope.setCardImg = function(activityType) {
                    if(activityType == 'football') {
                        return 'football';
                    } else if (activityType == 'soccer') {
                        return 'soccer';
                    } else {
                        return 'no_img';
                    }
                };

                $scope.enoughPlayers = function(attending, required) {
                    if(attending >= required) {
                        return 'event_on';
                    }
                };

                $scope.statusClass = function(status) {
                    console.log(status);
                    if (status == 'Pending') {
                        return 'event_pending';
                    } else if (status == 'On') {
                        return 'event_on';
                    } else if (status == 'Completed') {
                        return 'event_completed';
                    } else if (status == 'Cancelled') {
                        return 'event_cancelled';
                    }
                };
            } // User Authenticated
        }); // onAuth
}]); // controller
