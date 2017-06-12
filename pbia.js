let pbiaWorker = function () {
    let posts = window.pbia = window.pbia || [];
    let logToConsole = window.pbiaLocal || false;

    let item = null;
    while (posts.length > 0 && (item = posts.shift()) != null) {
        if (logToConsole) {
            console.log(`[PBIA*] '${item.category}' '${item.action}' '${item.value == null ? "" : item.value}'`);
        }
    }

    Object.defineProperty(posts, "push", {
    configurable: false,
    enumerable: false, // hide from for...in
    writable: false,
    value: function () {
        for (let i = 0, l = arguments.length; i < l; i++) {
            let item = arguments[i];
            if (logToConsole) {
                console.log(`[PBIA] '${item.category}' '${item.action}' '${item.value == null ? "" : item.value}'`);
            }
        }
        //return n;
    }
    });

}();