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
  .controller('shareController', ['$scope', '$window', '$firebaseObject', '$firebaseArray', '$http', shareController]);

const app = new Clarifai.App({
  apiKey: 'e59b033ef81c47de963a93e9cb7e101a'
});

function shareController($scope, $window, $firebaseObject, $firebaseArray, $http) {
  firebase.initializeApp(firebaseConfig);
  var storageRef = firebase.storage().ref();
  var databaseRef = firebase.database().ref();

  $scope.series = [];
  $scope.isChoosingImage = true;

  $scope.array = $firebaseArray(firebase.database().ref());

  // $scope.array.$loaded().then(function () {
  //   for (let i = 0; i < $scope.array.length; i++) {
  //     $scope.series.push($scope.array[i]);
  //   }
  // })

  // $scope.array.$watch(function (event) {
  //   $scope.series.push($scope.array[$scope.array.length - 1]);
  // });

  $("#drop-area").dmUploader({
    onNewFile: function(id, file){
      console.log('Callback: Plugin initialized');
      console.log(file)
      uploadFileToFirebase(file)
    }
  });

  $scope.uploadImage = function (fileInput) {
    let file = $(fileInput)[0].files[0]

    uploadFileToFirebase(file)
    
  }

  function uploadFileToFirebase (file) {
    var metadata = {
      contentType: 'image/jpeg',
    };
    
    // Upload the file and metadata
    var uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) { console.log(error) }, function() {
      var downloadURL = uploadTask.snapshot.downloadURL;
      predict(downloadURL)
      $('.review-image img').removeClass('hide');
      $('.review-image img').attr('src', downloadURL);
    });
  }

  $('button').on('click', function () {
    let url = $('#input').val()
    console.log(url)
    if(url){
      predict($('#input').val())
      $('img').removeClass('hide');
      $('img').attr('src', url);
    }
  })

  $scope.cardArr = []

  function predict (imageURL) {
    if(!imageURL) return;
    app.models.predict(Clarifai.GENERAL_MODEL, imageURL).then(
      function (response) {
        let results = response.outputs[0].data.concepts;
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
        }

        $.post('/translate-arr', {strArr: JSON.stringify(results.map(x=>x.name).splice(0,10))}, function(res){
          $scope.cardArr = res.arr
          console.log($scope.cardArr)

          $scope.isChoosingImage = false
          $scope.$apply()
        })
      },
      function (err) { console.log(err) }
    );
  }
  
}
