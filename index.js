require('expose-loader?exposes=ttr!./namesp.js');

ttr.init = require('./src/init.js');
ttr.audio = require('./src/audio.js');
ttr.button = require('./src/button.js');
