var APP = {};

APP.config = {
    places: 'http://places.nlp.nokia.com/places/v1/discover/search?at={LAT}%2C{LON}&q={TERM}&tf=plain&pretty=y&size=10&app_id=SkOMYikReO0lC0n04Iqy&app_code=cilFu9ObuYee4J7ZbaFHAA%3D%3D',
    maluubaAPIKey: 'mj2ZIbFHSEhHqKs04mpbgKC2dXKvR6JF'
};

APP.supportedCommands = {
    SEARCH: 0
};

APP.MaluubaParser = function(apikey){
    this._ep_interpret = 'http://www.corsproxy.com/napi.maluuba.com/v0/interpret';
    this.apikey = apikey;
};

APP.MaluubaParser.prototype.interpret = function(transcript, callback){
    $.ajax({
        url: this._ep_interpret,
        data: {
            apikey: this.apikey,
            phrase: transcript
        }
    }).done(function(data){
        if(data.action === 'BUSINESS_SEARCH') {
            callback(data.entities && data.entities.searchTerm);
        } else {
            callback([]);
        }
    }).fail(function(){
        callback(null);
    });
};

function checkCompatibility() {
    APP.compatibility = {};
    APP.compatibility.webspeech = 'webkitSpeechRecognition' in window;
}

function locationFound(position){
    APP.map.jHERE({center: position.coords, zoom: 15, type: 'smart', enable: ['zoombar']}).
    jHERE('marker', position.coords, {
        icon: 'images/currentlocation.png',
        anchor: {x: 24, y: 48}
    });
    APP.searchCenter = position.coords;
    bind();
}

function notify(message){
    alert(message);
}

function locationNotFound(){
    notify('Could not find current location or geolocation not supported.');
}

function capture(){
    if(APP.recognizing) {
        return APP.recognition.stop();
    }
    APP.recognition.start();
}

function linebreak(s) {
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
    var first_char = /\S/;
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function fireSearch(term, color) {
    var url = APP.config.places.replace('{LAT}', APP.searchCenter.latitude)
                               .replace('{LON}', APP.searchCenter.longitude)
                               .replace('{TERM}', term);

    $.ajax({url: url}).done(function(response){
        if(response && response.results && response.results.items) {
            response.results.items.forEach(function(i){
                APP.map.jHERE('marker', i.position, {
                    fill: color,
                    click: function(){
                        APP.map.jHERE('bubble', i.position, {
                            content: i.title + '<br>' + i.vicinity,
                            closable: true
                        });
                    }
                });
            });
        }
        $('.searchbox input').val('');
    });
}

function bind(){
    if (!APP.compatibility.webspeech) {
        return notify('Web Speech API not supported');
    }
    APP.recognition = new webkitSpeechRecognition();
    APP.recognition.continuous = true;
    APP.recognition.interimResults = true;
    APP.recognizing = false;

    APP.recognition.onstart = function(){
        APP.recognizing = true;
        APP.transcript = '';
        $('.speak').addClass('recording');
    };

    APP.recognition.onerror = function(e){
        APP.recognizing = false;
        console.log(e.error);
    };

    APP.recognition.onend = function(e){
        APP.recognizing = false;
        $('.speak').removeClass('recording');
        var color = [(Math.random() * 255).toFixed(0), (Math.random() * 255).toFixed(0), (Math.random() * 255).toFixed(0)];
        color = 'rgb(' + color.join(',') + ');';
        $('.log div').append('<p style="color:' + color + '">' + APP.transcript + '</p>');

        APP.commandParser.interpret(APP.transcript, function(terms){
            if(terms === null) {
                //Then there was an error
                alert('Something went wrong with the Webspeech API or with the interpretation API. Please try again.');
                return;
            }
            $('.searchbox input').val(terms.join(' '));
            fireSearch(terms.join(' '), color);
        });
    };

    APP.recognition.onresult = function(event){
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                APP.transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        APP.transcript = capitalize(APP.transcript);
        if (APP.transcript || interim_transcript) {
            //There is stuff
        }
    };

    $('.speak').on('click', capture);
    $(document).on('keypress', function(e){
        if(event.which === 115) {
            capture();
        }
    });
    $('.searchbox input').on('keypress', function(e){
        e.stopPropagation();
        var term, color;
        if(event.which === 13) {
            term = $(this).val();
            color = [(Math.random() * 255).toFixed(0), (Math.random() * 255).toFixed(0), (Math.random() * 255).toFixed(0)];
            color = 'rgb(' + color.join(',') + ');';
            $('.log div').append('<p style="color:' + color + '">' + term + '</p>');
            fireSearch(term, color);
        }
    });
    $('form').on('submit', function(e){
        e.preventDefault();
    });

    $('.searchbox input').focus();
}

$(window).on('load', function(){
    checkCompatibility();
    APP.commandParser = new APP.MaluubaParser(APP.config.maluubaAPIKey);
    APP.map = $('.map');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
    }
    else {
        locationNotFound();
    }
});