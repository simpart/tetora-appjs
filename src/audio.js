
let load_table = {};
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
            // get audio id
            let sp_src = audio.src.split('/');
	    sp_src = sp_src[sp_src.length-1];
            sp_src = sp_src.split('.');
            
	    let audio_id = sp_src[0];
	    if (1 < sp_src.length) {
                audio_id = sp_src[sp_src.length-2];
	    }
            
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
        } catch (e) {
            console.error(e.stack);
	    throw e;
        }
    },
    clear: (ign_lst) => {
        try {
            let deleteKeys = [];
            
            for (let tbl_idx in load_table) {
                // check ignore
                if (ign_lst.includes(tbl_idx)) {
                    continue;
                }
                
                // unload
                if (window.plugins && window.plugins.NativeAudio) {
                    window.plugins.NativeAudio.unload(
                        tbl_idx,
                        (m) => {},
                        (m) => {}
                    );
                }
                
                // add delete target
                deleteKeys.push(tbl_idx);
            }
            // clear table
            deleteKeys.forEach(key => delete load_table[key]);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    play: (src, vol=1.0) => {
        try {
            // get audio id
            let sp_src = src.split('/');
            sp_src = sp_src[sp_src.length-1];
            sp_src = sp_src.split('.');
            
            let audio_id = sp_src[0];
            if (1 < sp_src.length) {
                audio_id = sp_src[sp_src.length-2];
            }
            
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
    loop: (src) => {
        try {
            // get audio id
            let sp_src = src.split('/');
            sp_src = sp_src[sp_src.length-1];
            sp_src = sp_src.split('.');
            
            let audio_id = sp_src[0];
            if (1 < sp_src.length) {
                audio_id = sp_src[sp_src.length-2];
            }
            
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
