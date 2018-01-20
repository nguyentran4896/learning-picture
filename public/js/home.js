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
  .controller('homeController', ['$scope', '$window', '$firebaseObject', '$firebaseArray', '$http', homeController]);

const app = new Clarifai.App({
  apiKey: 'e59b033ef81c47de963a93e9cb7e101a'
});

function homeController($scope, $window, $firebaseObject, $firebaseArray, $http) {
  firebase.initializeApp(firebaseConfig);
  var storageRef = firebase.storage().ref();
  var databaseRef = firebase.database().ref();

  $scope.series = [];
  $scope.isChoosingImage = true;

  $scope.array = $firebaseArray(firebase.database().ref());

  $("#drop-area").dmUploader({
    onNewFile: function(id, file){
      uploadFileToFirebase(file)
    }
  })


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
      var bar = $('#drop-area').find('div.progress-bar');

      bar.width(progress + '%').attr('aria-valuenow', progress);

      if (progress === 0){
        bar.html('');
      } else {
        bar.html(parseInt(progress) + '%');
      }

      if (progress == 100){
        $scope.isChoosingImage = false
        $scope.$apply()
      }

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
      $scope.$apply()
      predict(downloadURL)
      $('.review-image img').removeClass('hide');
      $('.review-image').addClass('has-image');
      $('.review-image img').attr('src', downloadURL);
    });
  }

  $('#url-input').keypress(function(event) {
    let url = $(this).val()
    if(url && event.keyCode == 13){
      $scope.isChoosingImage = false
      $scope.$apply()
      predict(url)
      $('.review-image img').removeClass('hide');
      $('.review-image').addClass('has-image');
      $('.review-image img').attr('src', url);
    }
  })

  $scope.cardArr = []

  function predict (imageURL) {
    if(!imageURL) return;
    $('body').addClass('loader');
    app.models.predict(Clarifai.GENERAL_MODEL, imageURL).then(
      function (response) {
        let results = response.outputs[0].data.concepts;
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
        }

        $.post('/translate-arr', {strArr: JSON.stringify(results.map(x=>x.name).splice(0,5))}, function(res){
          $scope.cardArr = res.arr
          $scope.$apply()
          $('body').removeClass('loader');
        })
      },
      function (err) { 
        let results = [{"id":"ai_9c0Hmcx0","name":"exhibition","value":0.9803946,"app_id":"main"},{"id":"ai_l8TKp2h5","name":"people","value":0.97780854,"app_id":"main"},{"id":"ai_WBQfVV0p","name":"city","value":0.95966643,"app_id":"main"},{"id":"ai_7WNVdPhm","name":"competition","value":0.95694584,"app_id":"main"},{"id":"ai_6lhccv44","name":"business","value":0.9566424,"app_id":"main"},{"id":"ai_TJ9wFfK5","name":"portrait","value":0.95418936,"app_id":"main"},{"id":"ai_p9bzR7fH","name":"education","value":0.95136654,"app_id":"main"},{"id":"ai_VPmHr5bm","name":"adult","value":0.94742644,"app_id":"main"},{"id":"ai_rRDgzFQs","name":"school","value":0.94527024,"app_id":"main"},{"id":"ai_dxSG2s86","name":"man","value":0.94030625,"app_id":"main"},{"id":"ai_H6MK6dlj","name":"commerce","value":0.93880785,"app_id":"main"},{"id":"ai_13NdwKqz","name":"festival","value":0.9204707,"app_id":"main"},{"id":"ai_ggQlMG6W","name":"industry","value":0.91724026,"app_id":"main"},{"id":"ai_86sS08Pw","name":"wear","value":0.9166343,"app_id":"main"},{"id":"ai_dngMN46t","name":"fashion","value":0.9148294,"app_id":"main"},{"id":"ai_RQccV41p","name":"woman","value":0.90841854,"app_id":"main"},{"id":"ai_vTkXGCW9","name":"International","value":0.9045516,"app_id":"main"},{"id":"ai_G8PC3qNc","name":"university","value":0.8939265,"app_id":"main"},{"id":"ai_bmls4LpL","name":"group","value":0.8899503,"app_id":"main"},{"id":"ai_S1qBKn3x","name":"stock","value":0.88925576,"app_id":"main"}];
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
        }
        $.post('/translate-arr', {strArr: JSON.stringify(results.map(x=>x.name).splice(0,5))}, function(res){
          $scope.cardArr = res.arr
          $scope.$apply()
          $('body').addClass('loader');
        })
      }
    );
  }

  $scope.indexCardChoosing = -1

  $scope.chooseCard = function (index) {
    if ($scope.indexCardChoosing != -1) {
      $scope.cardArr[$scope.indexCardChoosing].userSelect = false
      $scope.indexCardChoosing = -1
    } else {
      $scope.indexCardChoosing = index
      $scope.cardArr[$scope.indexCardChoosing].userSelect = true
    }
  }
  
}
