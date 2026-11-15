window.HW_Utils = {
    sleep: (ms) => new Promise(r => setTimeout(r, ms)),
    
    extractAssignmentId: function() {
        const match = window.location.href.match(/([a-f0-9]{24})/i);
        if (match) window.HW_Config.ASSIGNMENT_ID = match[1];
    },
    
    getToken: function() {
        const keys = ['access_token', 'token', 'persist:root'];
        for (let k of keys) {
            let val = localStorage.getItem(k);
            if (val) {
                if (k === 'persist:root') {
                    try {
                        let parsed = JSON.parse(val);
                        if (parsed.user) {
                            let u = JSON.parse(parsed.user);
                            if (u.token) return u.token;
                        }
                    } catch (e) {}
                } else if (val.split('.').length === 3) {
                    return val;
                }
            }
        }
        return null;
    },
    
    safeParseJSON: function(text) {
        try {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1) return JSON.parse(text.substring(start, end + 1));
        } catch (e) { console.warn("Lỗi Parse JSON:", e); }
        return {};
    }
};
