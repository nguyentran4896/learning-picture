// var Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'f02ac3bc8ae24957865d750797e504c5'
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