firebaseConfig = {
  apiKey: "AIzaSyBaswFYrRy6dl1JJmS21lRmng2363Rc64Q",
  authDomain: " elpicture-86fb4.firebaseapp.com ",
  databaseURL: " https://elpicture-86fb4.firebaseio.com ",
  projectId: " elpicture-86fb4 ",
  storageBucket: " elpicture-86fb4.appspot.com ",
  messagingSenderId: "1097886600472 "
}


angular
  .module('LearningEnglish', ['firebase'])
  .controller('shareController', ['$scope', '$window', '$firebaseObject', '$firebaseArray', '$http', shareController]);

const app = new Clarifai.App({
  apiKey: 'f02ac3bc8ae24957865d750797e504c5'
});

function shareController($scope, $window, $firebaseObject, $firebaseArray, $http) {
  firebase.initializeApp(firebaseConfig);

  $scope.series = [];

  $scope.array = $firebaseArray(firebase.database().ref());

  $scope.array.$loaded().then(function () {
    for (let i = 0; i < $scope.array.length; i++) {
      $scope.series.push($scope.array[i]);
    }
  })

  $scope.array.$watch(function (event) {
    $scope.series.push($scope.array[$scope.array.length - 1]);
  });


  $('button').on('click', function () {
    $('img').removeClass('hide');
    $('img').attr('src', $('input').val());
    app.models.predict(Clarifai.GENERAL_MODEL, $('input').val()).then(
      function (response) {
        // do something with response
        console.log(response)
        let results = response.outputs[0].data.concepts;
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
        }
      },
      function (err) {
        // there was an error
        console.log(err)
      }
    );
  })
}
