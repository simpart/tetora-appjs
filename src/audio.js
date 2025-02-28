

let getAudioId = (src) => {
    try {
        let sp_src = src.split('/').pop().split('.');
	return sp_src.length > 1 ? sp_src[sp_src.length - 2] : sp_src[0];
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}

let load_table = JSON.parse(sessionStorage.getItem('ttr.audio.load_table') || '{}');
let thisobj = {
    /**
     * {
     *     src:    (path to audio file),
     *     volume: (double),
     *     voices: (number),
     *     delay:  (number)
     * }
     */
    init: (audio, cb) => {
        try {
            if (true === Array.isArray(audio)) {
                for (let aidx in audio) {
                    ttr.audio.init(audio[aidx]);
		}
		return;
	    }

	    let audio_id = getAudioId(audio.src);
            
            // check load
            if (undefined !== load_table[audio_id]) {
                if (window.plugins && window.plugins.NativeAudio) {
                    window.plugins.NativeAudio.unload(audio_id, (m)=>{}, (m)=>{});
                }
            }
            
            // load audio
            if (window.plugins && window.plugins.NativeAudio) {
                window.plugins.NativeAudio.preloadComplex(
                    audio_id,
                    audio.src,
                    audio.volume,
		    audio.voices,
                    audio.delay,
                    () => {
                        if ('function' === typeof cb) {
                            cb();
			}
		    },
                    () => {}
                );
            }
            // add table
            load_table[audio_id] = audio;
            sessionStorage.setItem('ttr.audio.load_table', JSON.stringify(load_table));
        } catch (e) {
            console.error(e.stack);
	    throw e;
        }
    },

    reset: () => {
        try {
	    thisobj.clear();
            sessionStorage.setItem('ttr.audio.load_table', '{}');
        } catch (e) {
            console.error(e.stack);
	    throw e;
	}
    },

    clear: (ign_lst=[]) => {
        try {
            let deleteKeys = [];
            
            for (let audio_id in load_table) {
                // check ignore (srcからIDを取得して比較)
                if (ign_lst.some((ign_src) => getAudioId(ign_src) === audio_id)) {
                    // this is not clear target
                    continue;
                }
                
                // unload
                if (window.plugins && window.plugins.NativeAudio) {
                    window.plugins.NativeAudio.unload(
                        audio_id,
                        (m) => {},
                        (m) => {}
                    );
                }
                
                // add delete target
                deleteKeys.push(audio_id);
            }
            
            // clear table
            deleteKeys.forEach(key => delete load_table[key]);
	    sessionStorage.setItem('ttr.audio.load_table', JSON.stringify(load_table));
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    },

    play: (src, vol=1.0) => {
        try {
            let audio_id = getAudioId(src);
            
            // check load
            if (undefined === load_table[audio_id]) {
                 thisobj.init(
		     { src:src, volume:vol, voices:1, delay:0 },
		     () => {
                         setTimeout(() => {
                             thisobj.play(src);
			 },200);
		     }
		 );
            }
            // play
            if (window.plugins && window.plugins.NativeAudio) {
	        window.plugins.NativeAudio.play(audio_id);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },

    play_once: (src, vol=1.0, delay=1000) => {
        try {
            
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    },

    loop: (src, vol=1.0) => {
        try {
            let audio_id = getAudioId(src);
            
            // check load 
            if (undefined === load_table[audio_id]) {
                 thisobj.init(
                     { src:src, volume:vol, voices:1, delay:0 },
                     () => {
                         setTimeout(() => {
                             thisobj.loop(src);
                         },200);
                     }
                 );
		 return;
            }
            
            // loop play
            if (window.plugins && window.plugins.NativeAudio) {
                window.plugins.NativeAudio.loop(audio_id);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
}
module.exports = thisobj;
