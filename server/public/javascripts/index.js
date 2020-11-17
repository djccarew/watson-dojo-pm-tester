(function() {

    $('.answers').hide();
    $('.loading').hide();
    $('#form').submit(onFormSubmit);
    $('#age').val('40');
    $('#gender').val('M');
    $('#familyhistory').val('N');
    $('#smoker').val('N');
    $('#exercise').val('60');
    $('#cholesterol').val('10');
    $('#bmi').val('20');
    $('#heartbeats').val('60');
    $('#palpitations').val('1');

    function onFormSubmit() {
        var age = $('#age').val();
        var gender = $('#gender').val();
        var familyhistory = $('#familyhistory').val();
        var smoker = $('#smoker').val();
        var exercise = $('#exercise').val();
        var cholesterol = $('#cholesterol').val();
        var bmi = $('#bmi').val();
        var heartbeats = $('#heartbeats').val();
        var palpitations = $('#palpitations').val();
        $('.loading').show();
        $('.answers').hide();
        $('.classify-btn').prop('disabled', true);
        $.post("/classify", {age: age,
                             gender: gender,
                             familyhistory: familyhistory,
                             smoker: smoker,
                             exercise: exercise,
                             cholesterol: cholesterol,
                             bmi: bmi,
                             heartbeats: heartbeats,
                             palpitations: palpitations
                            }, function(data) {
            renderAnswer(data)
        }).fail(function(err) {
            renderAnswer(err);
        });
        return false;
    }

    function renderAnswer(parsedResponse) {
        console.log(parsedResponse);

        if (parsedResponse.errors) {
            $('.answer').html('Something went wrong :-( ' + parsedResponse.errors[0].message);
        } else {
            var data = parsedResponse.predictions[0].values[0]
            var risk = data[0]
            var prediction = data[1][0]
            var probability = data[1][1]
            $('.risk').html('Heart Risk: '+risk);
            $('.prediction').html('Prediction: '+Math.floor(prediction*100 ).toFixed(0)+'%');
            $('.probability').html('Probability: '+Math.floor(probability*100 ).toFixed(0)+'%');
        }

        $('.classify-btn').prop('disabled', false);
        $('.answers').show();
        $('.loading').hide();
    }
}());
