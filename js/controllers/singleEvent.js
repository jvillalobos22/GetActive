myApp.controller('SingleEventController',
    ['$scope', '$rootScope', '$location', '$firebaseObject', '$firebaseAuth', '$firebaseArray', '$routeParams', '$filter', 'FIREBASE_URL',
    function($scope, $rootScope, $location, $firebaseObject, $firebaseAuth, $firebaseArray, $routeParams, $filter, FIREBASE_URL) {

        $scope.whichevent = $routeParams.eId;

        var ref = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent);
        var single_event = $firebaseObject(ref);

        var playersref = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent + '/players');
        var playersList = $firebaseArray(playersref);
        $scope.players = playersList;

        $scope.singleEvent = single_event;

        playersList.$loaded().then(function(data) {
            console.log(playersList.length);
            if(playersList.length > 0) {
                $scope.singleEvent.players_attending = playersList.length + 1;
            } else {
                $scope.singleEvent.players_attending = 1;
            }
        });

        single_event.$loaded().then(function(data) {

        });

        single_event.$watch(function(data) {

        }); // Watch event data for changes

        playersList.$watch(function(data) {
            console.log(playersList.length);
            if(playersList.length > 0) {
                $scope.singleEvent.players_attending = playersList.length + 1;
            } else {
                $scope.singleEvent.players_attending = 1;
            }
            console.log('$scope.singleEvent.players_attending = ' + $scope.singleEvent.players_attending);


        }); // Watch players data for changes



        // Check if current user is already in players array
        $scope.checkPlayers = function(id) {
            if(id === $rootScope.currentUser.$id) {
                return true;
            }
            return false;
        };

        $scope.setBanner = function(activityType) {
            console.log(activityType);
            if(activityType == 'football') {
                return 'football';
            } else if (activityType == 'soccer') {
                return 'soccer';
            } else if (activityType == 'basketball') {
                return 'basketball';
            } else if (activityType == 'baseball') {
                return 'baseball';
            } else if (activityType == 'diskgolf') {
                return 'diskgolf';
            } else if (activityType == 'golf') {
                return 'golf';
            } else if (activityType == 'mountainbiking') {
                return 'mountainbiking';
            } else if (activityType == 'softball') {
                return 'softball';
            } else if (activityType == 'volleyball') {
                return 'volleyball';
            } else if (activityType == 'hiking') {
                return 'hiking';
            } else {
                return 'no_banner';
            }
        };

        $scope.updateEvent = function() {
            console.log('inside updateEvent()');
            if($scope.starttime.meridian == "PM" && $scope.starttime.hour != 12) {
                $scope.starttime.hour += 12;
            }
            if($scope.endtime.meridian == "PM" && $scope.endtime.hour != 12) {
                $scope.endtime.hour += 12;
            }
            if($scope.starttime.hour < 10) {
                var hr = $scope.starttime.hour.toString();
                console.log('hr :' + hr);
                if (hr.length < 2) {
                    //add leading zero
                    hr = '0' + hr;
                }
                console.log('hr :' + hr);
                $scope.starttime.hour = hr;
            }

            $scope.singleEvent.event_start_time = $scope.singleEvent.event_date + 'T' + $scope.starttime.hour + ':' + $scope.starttime.min + ':00';
            $scope.singleEvent.event_end_time = $scope.singleEvent.event_date + 'T' + $scope.endtime.hour + ':' + $scope.endtime.min + ':00';

            console.log('About to save event with new details.');
            console.log('Start time is set to: ' + $scope.singleEvent.event_start_time);
            console.log('End time is set to: ' + $scope.singleEvent.event_end_time);
            
            single_event.$save().then(function(ref) {
                ref.key() === single_event.$id; // true
                $location.path('/events');
            }, function(error) {
                console.log("Error:", error);
            });
        };

        $scope.imGoing = function() {
            var playRef = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent + '/players/');
            var playersInfo = $firebaseArray(playRef);
            var userPlaying = false;
            angular.forEach($scope.players, function(value, key) {
                console.log(value.playerid);
                if(value.playerid === $rootScope.currentUser.$id) {
                    console.log('User is already playing');
                    userPlaying = true;
                }
            });

            // only allow user to add to players list if not currently on it
            if(!userPlaying) {
                var myData = {
                    playerid: $rootScope.currentUser.$id,
                    playername: $rootScope.currentUser.firstname,
                    date_added: Firebase.ServerValue.TIMESTAMP
                };



                playersInfo.$add(myData).then(function() {
                    $scope.players.push($rootScope.currentUser.$id);

                    $scope.singleEvent.players_attending = playersInfo.length + 1;

                    single_event.$save().then(function(ref) {
                        ref.key() === single_event.$id; // true
                    }, function(error) {
                        console.log("Error:", error);
                    });
                });
            } // if !userplaying

        }; // imGoing

        $scope.notGoing = function(id) {
            var playRef = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent + '/players/');
            var playersInfo = $firebaseArray(playRef);
            var userPlaying = false;
            console.log($scope.players);
            var userKey;

            angular.forEach($scope.players, function(value, key) {
                console.log(value.playerid);
                if(value.playerid === $rootScope.currentUser.$id) {
                    console.log('User is already playing');
                    userPlaying = true;
                    userKey = key;
                }
            });

            // only allow user to remove from players list if currently on it
            if(userPlaying) {
                var refDel = new Firebase(FIREBASE_URL + 'events/' + $scope.whichevent + '/players/' + id);
                var record = $firebaseObject(refDel);

                record.$remove(id).then(function() {
                    $scope.players.splice(userKey, 1);

                    $scope.singleEvent.players_attending -= 1;

                    single_event.$save().then(function(ref) {
                        ref.key() === single_event.$id; // true
                    }, function(error) {
                        console.log("Error:", error);
                    });
                });
            } // if userplaying


        }; // notGoing

        $scope.updateStatus = function() {
            $scope.eventstatus = single_event.status;
            console.log(single_event.status);

            endTime = new Date($scope.singleEvent.event_end_time);
            startTime = new Date(single_event.event_start_time);
            currentTime = new Date();
            if ( endTime < currentTime ) {
                // event is over
                $scope.eventstatus = 'Completed';
            } else if ( startTime < currentTime ) {
                // event is underway
                $scope.eventstatus = 'In Progress';
            } else {
                // event is in the future
                if ( single_event.players_attending < single_event.players_required ) {
                    $scope.eventstatus = 'Pending';
                } else {
                    $scope.eventstatus = 'On';
                }
            }

            //single_event.status = $scope.eventstatus;

            single_event.$save().then(function(ref) {
                ref.key() === single_event.$id; // true
            }, function(error) {
                console.log("Error:", error);
            });

            console.log(single_event.name + $scope.eventstatus);
        };




}]); // controller
