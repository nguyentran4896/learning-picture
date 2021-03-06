firebaseConfig = {
  apiKey: "AIzaSyBaswFYrRy6dl1JJmS21lRmng2363Rc64Q",
  authDomain: "elpicture-86fb4.firebaseapp.com",
  databaseURL: "https://elpicture-86fb4.firebaseio.com",
  projectId: "elpicture-86fb4",
  storageBucket: "elpicture-86fb4.appspot.com",
  messagingSenderId: "1097886600472"
}

var engApp = angular
  .module('LearningEnglish', ['firebase'])
  .controller('shareController', ['$scope', '$window', '$firebaseObject', '$firebaseArray', '$http', 'Message', shareController]);

const app = new Clarifai.App({
  // apiKey: 'e59b033ef81c47de963a93e9cb7e101a' //Key Nguyen
  apiKey: 'ec1d1ec98ec3403fb91c39bcb7a93f49' //Key luc
});

firebase.initializeApp(firebaseConfig);

function shareController($scope, $window, $firebaseObject, $firebaseArray, $http, Message) {
  
  var storageRef = firebase.storage().ref();
  var databaseRef = firebase.database().ref();

  var wrongDataRef = firebase.database().ref().child('/rooms/-L3Hq7a7tuZZFQK0ex75/-L3Id1Usn6bFi2WJnmFl');
  var dataRef = firebase.database().ref().child('/rooms/-L3Hfgf52LU1R4YjcR-p/images/-L3JYIHFEqCfAFb4BC8-/array');

  $scope.userKey = COMMON.getCookie('userId');

  $scope.series = [];
  $scope.isChoosingImage = false;
  $scope.languageText = COMMON.getCookie('languageText')

  dataRef.on('value', function (snapshot) {
    $scope.array = snapshot.val().splice(0, 10)

    wrongDataRef.on('value', function (snapshot) {
      $scope.array = $scope.array.concat(snapshot.val())
      $scope.$apply()
    });
  });



  $scope.setSelected = function (index, card) {
    if (card.userSelect) return;
    if (card.isWrong) {
      wrongDataRef.child(card.id + '/userSelect').set($scope.userKey);
    }
    firebase.database().ref().child('/rooms/-L3Hfgf52LU1R4YjcR-p/images/-L3JYIHFEqCfAFb4BC8-/array/' + card.id + '/userSelect').set($scope.userKey);
  }

  $("#drop-area").dmUploader({
    onNewFile: function (id, file) {
      console.log('Callback: Plugin initialized');
      console.log(file)
      uploadFileToFirebase(file)
    }
  });

  $scope.uploadImage = function (fileInput) {
    let file = $(fileInput)[0].files[0]

    uploadFileToFirebase(file)

  }

  function uploadFileToFirebase(file) {
    var metadata = {
      contentType: 'image/jpeg',
    };

    // Upload the file and metadata
    var uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);

    uploadTask.on('state_changed', function (snapshot) {
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
    }, function (error) { console.log(error) }, function () {
      var downloadURL = uploadTask.snapshot.downloadURL;
      predict(downloadURL)
      $('img').removeClass('hide');
      $('img').attr('src', downloadURL);
    });
  }

  $('button').on('click', function () {
    let url = $('#input').val()
    if (url) {
      predict($('#input').val())
      $('.review-image img').removeClass('hide');
      $('.review-image img').attr('src', url);
      $('.review-image').addClass('has-image');
    }
  })

  $scope.cardArr = []

  function predict(imageURL) {
    if (!imageURL) return;
    app.models.predict(Clarifai.GENERAL_MODEL, imageURL).then(
      function (response) {
        let results = (response.outputs) ? response.outputs[0].data.concepts : [{ "id": "ai_9c0Hmcx0", "name": "exhibition", "value": 0.9803946, "app_id": "main" }, { "id": "ai_l8TKp2h5", "name": "people", "value": 0.97780854, "app_id": "main" }, { "id": "ai_WBQfVV0p", "name": "city", "value": 0.95966643, "app_id": "main" }, { "id": "ai_7WNVdPhm", "name": "competition", "value": 0.95694584, "app_id": "main" }, { "id": "ai_6lhccv44", "name": "business", "value": 0.9566424, "app_id": "main" }, { "id": "ai_TJ9wFfK5", "name": "portrait", "value": 0.95418936, "app_id": "main" }, { "id": "ai_p9bzR7fH", "name": "education", "value": 0.95136654, "app_id": "main" }, { "id": "ai_VPmHr5bm", "name": "adult", "value": 0.94742644, "app_id": "main" }, { "id": "ai_rRDgzFQs", "name": "school", "value": 0.94527024, "app_id": "main" }, { "id": "ai_dxSG2s86", "name": "man", "value": 0.94030625, "app_id": "main" }, { "id": "ai_H6MK6dlj", "name": "commerce", "value": 0.93880785, "app_id": "main" }, { "id": "ai_13NdwKqz", "name": "festival", "value": 0.9204707, "app_id": "main" }, { "id": "ai_ggQlMG6W", "name": "industry", "value": 0.91724026, "app_id": "main" }, { "id": "ai_86sS08Pw", "name": "wear", "value": 0.9166343, "app_id": "main" }, { "id": "ai_dngMN46t", "name": "fashion", "value": 0.9148294, "app_id": "main" }, { "id": "ai_RQccV41p", "name": "woman", "value": 0.90841854, "app_id": "main" }, { "id": "ai_vTkXGCW9", "name": "International", "value": 0.9045516, "app_id": "main" }, { "id": "ai_G8PC3qNc", "name": "university", "value": 0.8939265, "app_id": "main" }, { "id": "ai_bmls4LpL", "name": "group", "value": 0.8899503, "app_id": "main" }, { "id": "ai_S1qBKn3x", "name": "stock", "value": 0.88925576, "app_id": "main" }];
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
          results[i].id = i
        }

        $scope.cardArr = results.map(x => x.name)
        databaseRef.child('rooms/-L3Hfgf52LU1R4YjcR-p/images').push({
          url: imageURL,
          array: results.map(function (x) {
            x.userSelect = ''
            delete x.app_id
            delete x.value
            return x
          })
        });

        $scope.isChoosingImage = false
        $scope.$apply()
      },
      function (err) {
        console.log(err)

        let results = [{ "id": "ai_9c0Hmcx0", "name": "exhibition", "value": 0.9803946, "app_id": "main" }, { "id": "ai_l8TKp2h5", "name": "people", "value": 0.97780854, "app_id": "main" }, { "id": "ai_WBQfVV0p", "name": "city", "value": 0.95966643, "app_id": "main" }, { "id": "ai_7WNVdPhm", "name": "competition", "value": 0.95694584, "app_id": "main" }, { "id": "ai_6lhccv44", "name": "business", "value": 0.9566424, "app_id": "main" }, { "id": "ai_TJ9wFfK5", "name": "portrait", "value": 0.95418936, "app_id": "main" }, { "id": "ai_p9bzR7fH", "name": "education", "value": 0.95136654, "app_id": "main" }, { "id": "ai_VPmHr5bm", "name": "adult", "value": 0.94742644, "app_id": "main" }, { "id": "ai_rRDgzFQs", "name": "school", "value": 0.94527024, "app_id": "main" }, { "id": "ai_dxSG2s86", "name": "man", "value": 0.94030625, "app_id": "main" }, { "id": "ai_H6MK6dlj", "name": "commerce", "value": 0.93880785, "app_id": "main" }, { "id": "ai_13NdwKqz", "name": "festival", "value": 0.9204707, "app_id": "main" }, { "id": "ai_ggQlMG6W", "name": "industry", "value": 0.91724026, "app_id": "main" }, { "id": "ai_86sS08Pw", "name": "wear", "value": 0.9166343, "app_id": "main" }, { "id": "ai_dngMN46t", "name": "fashion", "value": 0.9148294, "app_id": "main" }, { "id": "ai_RQccV41p", "name": "woman", "value": 0.90841854, "app_id": "main" }, { "id": "ai_vTkXGCW9", "name": "International", "value": 0.9045516, "app_id": "main" }, { "id": "ai_G8PC3qNc", "name": "university", "value": 0.8939265, "app_id": "main" }, { "id": "ai_bmls4LpL", "name": "group", "value": 0.8899503, "app_id": "main" }, { "id": "ai_S1qBKn3x", "name": "stock", "value": 0.88925576, "app_id": "main" }];
        $('.result div').remove();
        for (let i = 0; i < results.length; i++) {
          $('.result').append('<div>' + results[i].name + '</div>')
          results[i].id = i
        }

        $scope.cardArr = results.map(x => x.name)
        databaseRef.child('rooms/-L3Hfgf52LU1R4YjcR-p/images').push({
          url: imageURL,
          array: results.map(function (x) {
            x.userSelect = ''
            delete x.app_id
            delete x.value
            return x
          })
        });

        $scope.isChoosingImage = false
        $scope.$apply()
      }
    );
  }

  /**
   * CHAT
   */

  // live chat
  $scope.isConnect = false;
  $scope.userChatKey = '';
  $scope.totalServerBadge = 0;

  $scope.liveChats = $firebaseArray(Message.getAllChat().orderByChild('timeStamp'));
  $scope.liveChats.$loaded().then(function () {
    console.log($scope.liveChats)
  });


  $scope.timeSince = function (dateTemp) {
    dateTemp = dateTemp[Object.keys(dateTemp)[Object.keys(dateTemp).length - 1]].timeStamp;

    var seconds = Math.floor((new Date() - dateTemp) / 1000);
    var interval = Math.floor(seconds / 31536000);

    interval = Math.floor(seconds / 1296000);
    if (interval >= 1) {
      var date = new Date(dateTemp);
      var month = date.getMonth() + 1 + '';
      var day = date.getDate() + '';
      var str = '';
      if (date.getMonth() < 9) {
        month = '0' + month;
      }
      if (date.getDate() < 10) {
        day = '0' + date.getDate();
      }
      str = day + '/' + month + '/' + date.getFullYear();
      return str;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      if (interval > 1) {
        return interval + ' ngày trước';
      }
      else {
        return '1 ngày trước';
      }
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      if (interval > 1) {
        return interval + ' giờ trước';
      }
      else {
        return '1 giờ trước';
      }
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      if (interval > 1) {
        return interval + ' phút trước';
      }
      else {
        return '1 phút trước';
      }
    }
    return Math.floor(seconds) + ' giây trước';
  }

  $scope.sendNonUserChat = function (nowMessage) {
    if (nowMessage == '') {
      return;
    }
    Message.sendNonUserChat(nowMessage);
    $scope.nowMessage = '';
    $('#btn-textarea-message').attr('style', 'overflow-y:none;');
    $('#btn-textarea-message').trigger('change');
  }
}


engApp.factory('Message', ['$firebaseArray', '$firebaseObject',
  function ($firebase, $firebaseObject) {

    var chatRef = firebase.database().ref().child('/chats/');

    var Message = {
      sendNonUserChat: function (message) {
        // A post entry.
        var postData = {
          message: message,
          userId: COMMON.getCookie('userId'),
          timeStamp: firebase.database.ServerValue.TIMESTAMP
        };

        var updates = {};
        var newChatKey = chatRef.push().key;

        updates[newChatKey] = postData;
        return chatRef.child(newChatKey).update(postData);
      },
      sendServerChat: function (message) {
        // A post entry.
        var postData = {
          message: message,
          isServer: COMMON.getCookie('userId'),
          timeStamp: firebase.database.ServerValue.TIMESTAMP
        };

        var updates = {};
        var newChatKey = chatRef.push().key;

        updates[newChatKey] = postData;
        return chatRef.update(updates);
      },
      getUserChat: function (key) {
        return chatRef.child(key);
      },
      getAllChat: function () {
        return chatRef;
      },
      getNonUserBadge: function () {
        return chatRef.child('/nonUserBadge/');;
      },
      getServerBadge: function (key) {
        return chatRef.child('/serverBadge/');;
      },
      setNonUserBadge: function (key) {
        chatRef.child('/nonUserBadge/').set(0);
      },
      setServerBadge: function (key) {
        chatRef.child('/serverBadge/').set(0);
      },
      getAllUserChat: function () {
        return chatRef;
      },
      setIsUserTyping: function (key, isTypingStatus) {
        chatRef.child('/isUserTyping').set(isTypingStatus);
      },
      getIsUserTyping: function (key) {
        return chatRef.child('/isUserTyping');
      },
      removeListenerIsUserTyping: function (key) {
        chatRef.child('/isUserTyping').off();
      },
      setIsServerTyping: function (key, isTypingStatus) {
        chatRef.child('/isServerTyping').set(isTypingStatus);
      },
      getIsServerTyping: function (key) {
        return chatRef.child('/isServerTyping');
      }
    };
    return Message;
  }
]);

function randomArray(arra1) {
  var ctr = arra1.length, temp, index;

  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}