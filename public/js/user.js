firebaseConfig = {
  apiKey: "AIzaSyBaswFYrRy6dl1JJmS21lRmng2363Rc64Q",
  authDomain: "elpicture-86fb4.firebaseapp.com",
  databaseURL: "https://elpicture-86fb4.firebaseio.com",
  projectId: "elpicture-86fb4",
  storageBucket: "elpicture-86fb4.appspot.com",
  messagingSenderId: "1097886600472"
}

angular
  .module('LearningEnglish', ['firebase'])
  .controller('userController', ['$scope', '$window', '$firebaseObject', '$firebaseArray', '$http', userController]);

const app = new Clarifai.App({
  apiKey: 'e59b033ef81c47de963a93e9cb7e101a'
});

function userController($scope, $window, $firebaseObject, $firebaseArray, $http) {
  firebase.initializeApp(firebaseConfig);
  var databaseRef = firebase.database().ref();

  $scope.isCorrectEmail = ''
  $scope.isCorrectPassword = ''

  $scope.checkLogin = function () {
    var ref = firebase.database().ref("users")

    ref.orderByChild("email").equalTo($scope.email.toString()).on("child_added", function(snapshot) {
      COMMON.setCookie('userId', snapshot.key)

      databaseRef.child('users/' + snapshot.key).on('value',function(snapshot){
        COMMON.setCookie('userName', snapshot.val().name)
        window.location.href = '/'
      });
    });
  }
}
