window.HW_Logger = class {
    static log(msg, type = 'info') {
        const el = document.getElementById("hw-log-box");
        if (el) {
            const time = new Date().toLocaleTimeString();
            const div = document.createElement('div');
            div.className = `hw-log-line hw-log-${type}`;
            div.innerText = `[${time}] ${msg}`;
            el.appendChild(div);
            el.scrollTop = el.scrollHeight;
        }
        console.log(`[HW-${type.toUpperCase()}] ${msg}`);
    }
    static detail(msg) {
        const el = document.getElementById("hw-detail-box");
        if (el) {
            el.innerText += msg + "\n";
            el.scrollTop = el.scrollHeight;
        }
    }
    static info(m) { this.log(m, 'info'); }
    static warn(m) { this.log(m, 'warn'); }
    static error(m) { this.log(m, 'error'); }
    static success(m) { this.log(m, 'success'); }
    static debug(m) { this.log(m, 'debug'); }
};
