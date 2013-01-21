var APP = {};

APP.config = {
    places: 'http://places.nlp.nokia.com/places/v1/discover/search?at={LAT}%2C{LON}&q={TERM}&tf=plain&pretty=y&size=10&app_id=SkOMYikReO0lC0n04Iqy&app_code=cilFu9ObuYee4J7ZbaFHAA%3D%3D'
};

APP.supportedCommands = {
    SEARCH: 0
};

APP.SimpleCommandParser = function(){
    this.ruleset = [];
};

APP.SimpleCommandParser.prototype.parse = function(){
    var result = {};
    this.ruleset.forEach(function(fn){
        result = $.extend(true, {}, result, fn(APP.transcript, result));
    });
    return result;
};

APP.SimpleCommandParser.prototype.addRule = function(fn){
    this.ruleset.push(fn);
};

APP.commandParser = new APP.SimpleCommandParser();
APP.commandParser.addRule(function(transcript, result){
    var m = transcript.match(/(?:find|search\s+for|look\s+for)\s+(.+)/i);
    if(m) {
        result.command = APP.supportedCommands.SEARCH;
        result.searchMatchArray = m;
        result.target = m[1];
    }
    return result;
});

APP.commandParser.addRule(function(transcript, result){
    if(!result.target) {
        return result;
    }
    var articles = ['a', 'an', 'the'], target = result.target, notArticles = [];
    target = target.split(' ');
    target.forEach(function(w){
        if(!~articles.indexOf(w)) {
            notArticles.push(w);
        }
    });
    result.target = notArticles.join(' ');
    return result;
});

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
        APP.commandParser.transcript = APP.transcript;
        var result = APP.commandParser.parse();
        $('.searchbox input').val(result.target);
        console.log(result);
        fireSearch(result.target, color);
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
    APP.map = $('.map');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
    }
    else {
        locationNotFound();
    }
});