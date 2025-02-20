
let queue   = {};
let delay   = 200;
let thisobj = {
    exec: (id, fnc) => {
        try {
            // check mash
            if (queue[id]) {
                // processing
                return;
            }
            
            // set processing flag
            queue[id] = true;

            // execute event function
            fnc();

            // reset flag
            setTimeout(() => {
                delete queue[id];
            }, delay);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
};
module.exports = thisobj;
