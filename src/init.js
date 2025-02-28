

// // 初回起動かどうかを localStorage に保存
//    if (!localStorage.getItem('app_started_once')) {
//        localStorage.setItem('app_started_once', 'true');
//    }
//
//    // sessionStorage で起動元を判定
//    if (sessionStorage.getItem('session_active')) {
//        console.log('✅ ページ遷移 (同一セッション内)');
//    } else {
//        console.log('🚀 新規起動またはアプリ再起動');
//    }
//
//    // セッション開始フラグをセット
//    sessionStorage.setItem('session_active', 'true');

let device_ready_id = null;
let thisobj = {
    ready: (cb, plugin) => {
        try {
            let check_ready_loop = () => {
                try {
                    if (null === device_ready_id) {
                        device_ready_id = setInterval(() => { thisobj.ready(cb,plugin); }, 100);
                    }
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }

            if ( (!window.cordova) || (!window.plugins) ) {
                // doesn't run device ready
                check_ready_loop();
                return;
            }
            
	    // check plugin
	    let plugins = (Array.isArray(plugin)) ? plugin:[plugin];
            for (let pidx in plugins) {
	        const check_plugin = new Function("return typeof " + plugins[pidx] + " !== 'undefined' && " + plugins[pidx] + " ? true : false;");
                if (!check_plugin()) {
                    check_ready_loop();
		    return;
                }
	    }

            // deviceready event run
            clearInterval(device_ready_id);
	    device_ready_id = null;
            if (typeof cb === 'function') {
                cb();
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },

    is_first: () => {
        try {
            
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
};
module.exports = thisobj;
