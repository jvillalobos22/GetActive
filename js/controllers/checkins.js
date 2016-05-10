myApp.controller('CheckinsController',
    ['$scope', '$rootScope', '$location', '$firebaseObject', '$firebaseArray', '$routeParams', 'FIREBASE_URL',
    function($scope, $rootScope, $location, $firebaseObject, $firebaseArray, $routeParams, FIREBASE_URL) {

        $scope.whichmeeting = $routeParams.mId;
        $scope.whichuser = $routeParams.uId;

        var ref = new Firebase(FIREBASE_URL + 'users/' + $scope.whichuser + '/meetings/' + $scope.whichmeeting + '/checkins');

        var checkinsList = $firebaseArray(ref);
        $scope.checkins = checkinsList;

        $scope.order = "firstname";
        $scope.direction = null;
        $scope.query = '';
        $scope.recordId = '';

        $scope.addCheckin = function() {
            var checkinsInfo = $firebaseArray(ref);
            var myData = { // create mydata object with variable collected from form
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                email: $scope.user.email,
                date: Firebase.ServerValue.TIMESTAMP
            };

            checkinsInfo.$add(myData).then(function() {
                $location.path('/checkins/' + $scope.whichuser + '/' + $scope.whichmeeting + '/checkinsList');
            }); // add collected data to db
        }; // addCheckin

        $scope.deleteCheckin = function(id) {
            var refDel = new Firebase(FIREBASE_URL + 'users/' + $scope.whichuser + '/meetings/' + $scope.whichmeeting + '/checkins/' + id);
            var record = $firebaseObject(refDel);

            record.$remove(id);
        }; // deleteCheckin

        $scope.pickRandom = function() {
            var whichRecord = Math.round(Math.random() * (checkinsList.length - 1));
            $scope.recordId = checkinsList.$keyAt(whichRecord);
        }; // pick winner

        $scope.showLove = function(myCheckin) {
            myCheckin.show = !myCheckin.show;

            if(myCheckin.userState == 'expanded') {
                myCheckin.userState = '';
            } else {
                myCheckin.userState = 'expanded';
            }
        }; // showLove

        $scope.giveLove = function(myCheckin, myGift) {
            var refLove = new Firebase(FIREBASE_URL + 'users/' + $scope.whichuser + '/meetings/' + $scope.whichmeeting + '/checkins/' + myCheckin.$id + '/awards/');
            var checkinsArray = $firebaseArray(refLove);

            var myData = {
                name: myGift,
                date: Firebase.ServerValue.TIMESTAMP
            }; // myData

            checkinsArray.$add(myData);
        }; // giveLove

        $scope.deleteLove = function(checkinId, award) {
            var refLove = new Firebase(FIREBASE_URL + 'users/' + $scope.whichuser + '/meetings/' + $scope.whichmeeting + '/checkins/' + checkinId + '/awards/');
            var record = $firebaseObject(refLove);

            record.$remove(award);
        }; // deleteLove
}]); // controller
