

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
    ready: (cb) => {
        try {
            if (!window.cordova) {
                // doesn't run deviceready
                device_ready_id = setInterval(() => { thisobj.device_ready(cb); }, 100);
                return;
            }
            
            // deviceready event run
            clearInterval(device_ready_id);
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
