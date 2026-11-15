window.HW_UI = class {
    constructor() {
        this.startTime = null;
        this.timerInterval = null;
        this.isMinimized = false;
        this.init();
    }

    init() {
        if (!document.body) return setTimeout(() => this.init(), 500);
        if (document.getElementById("hw-dashboard")) return;

        const html = `
            <style>
                #hw-dashboard { position: fixed; top: 20px; right: 20px; width: 850px; height: 450px; background: #0F172A; color: #F8FAFC; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 999999; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; overflow: hidden; resize: both; min-width: 300px; min-height: 80px; transition: width 0.2s, height 0.2s; }
                .hw-header { background: #1E293B; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; cursor: move; border-bottom: 1px solid #334155; }
                .hw-title { font-weight: bold; font-size: 14px; color: #3B82F6; }
                .hw-id { font-size: 10px; color: #94A3B8; margin-top: 2px; display: block; }
                .hw-btn-icon { background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 18px; line-height: 1; padding: 0 5px;}
                #hw-mini-view { display: none; flex: 1; align-items: center; justify-content: center; padding: 10px; gap: 15px; font-family: monospace; font-size: 18px; font-weight: bold; color: #F8FAFC; border-top: 1px solid #334155; }
                #mini-timer { color: #3B82F6; font-size: 22px; }
                #mini-status { color: #10B981; font-size: 16px; }
                .hw-body { display: flex; flex: 1; overflow: hidden; }
                .hw-col-left { width: 40%; display: flex; flex-direction: column; border-right: 1px solid #334155; padding: 10px; gap: 10px;}
                .hw-col-right { width: 60%; display: flex; flex-direction: column; padding: 10px; background: #0B1120;}
                .hw-tabs { display: flex; background: #1E293B; margin-bottom: 5px; border-radius: 6px; overflow: hidden;}
                .hw-tab { flex: 1; text-align: center; padding: 8px; cursor: pointer; color: #94A3B8; font-size: 12px; border-bottom: 2px solid transparent; }
                .hw-tab.active { color: #3B82F6; border-bottom: 2px solid #3B82F6; background: #0F172A; font-weight: bold;}
                .hw-panel { display: none; flex-direction: column; gap: 10px; flex: 1; overflow-y: auto; }
                .hw-panel.active { display: flex; }
                .hw-input-group { display: flex; flex-direction: column; gap: 4px; }
                .hw-input { background: #0B1120; border: 1px solid #334155; color: #A3E635; padding: 8px; border-radius: 6px; outline: none; width: 100%; box-sizing: border-box; }
                .hw-label { font-size: 12px; color: #94A3B8; }
                .hw-btn { padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; flex: 1; transition: 0.2s;}
                .hw-btn-start { background: #10B981; } .hw-btn-start:hover { background: #059669; }
                .hw-btn-stop { background: #EF4444; }
                .hw-btn-fetch { background: #3B82F6; padding: 6px; font-size: 12px; margin-top: 5px; } .hw-btn-fetch:hover { background: #2563EB; }
                .hw-timer { text-align: center; font-size: 24px; font-weight: bold; font-family: monospace; color: #F8FAFC; margin: 5px 0;}
                .hw-status { text-align: center; font-size: 12px; color: #94A3B8; margin-bottom: 5px;}
                .hw-log { flex: 1; background: #0B1120; border: 1px solid #334155; border-radius: 6px; padding: 8px; overflow-y: auto; font-family: monospace; font-size: 11px; line-height: 1.4;}
                .hw-log-info { color: #60A5FA; } .hw-log-success { color: #10B981; } .hw-log-error { color: #EF4444; } .hw-log-warn { color: #F59E0B; }
                .hw-detail-title { font-size: 13px; font-weight: bold; color: #94A3B8; margin-bottom: 5px; display: flex; justify-content: space-between;}
                .hw-detail { flex: 1; border: 1px solid #334155; border-radius: 6px; padding: 10px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #A3E635; white-space: pre-wrap; word-break: break-all;}
            </style>
            <div id="hw-dashboard">
                <div class="hw-header" id="hw-header">
                    <div>
                        <div class="hw-title">🚀 ONLUYEN AI PRO (Modular)</div>
                        <span class="hw-id" id="hw-id-display">ID: Đang lấy...</span>
                    </div>
                    <div><button class="hw-btn-icon" id="hw-minimize">_</button></div>
                </div>
                <div id="hw-mini-view">
                    <span id="mini-timer">⏱️ 00:00</span><span>|</span><span id="mini-status">Sẵn sàng</span>
                </div>
                <div class="hw-body" id="hw-body">
                    <div class="hw-col-left">
                        <div class="hw-tabs">
                            <div class="hw-tab active" data-target="hw-tab-solve">Tiến trình</div>
                            <div class="hw-tab" data-target="hw-tab-settings">Cấu hình</div>
                        </div>
                        <div id="hw-tab-solve" class="hw-panel active">
                            <div class="hw-timer" id="hw-timer">00:00</div>
                            <div class="hw-status" id="hw-status">Sẵn sàng</div>
                            <div style="display:flex; gap:10px; margin-bottom:5px;">
                                <button class="hw-btn hw-btn-start" id="hw-start">Bắt đầu</button>
                                <button class="hw-btn hw-btn-stop" id="hw-stop" disabled>Dừng</button>
                            </div>
                            <div class="hw-log" id="hw-log-box"></div>
                        </div>
                        <div id="hw-tab-settings" class="hw-panel">
                            <div class="hw-input-group">
                                <div class="hw-label">Gemini API Key</div>
                                <input type="password" id="hw-cfg-gemini" class="hw-input" placeholder="AIzaSy..." value="${window.HW_Config.GEMINI_KEY}">
                                <button class="hw-btn hw-btn-fetch" id="hw-btn-fetch">🔄 Tải lại danh sách Model</button>
                            </div>
                            <div class="hw-input-group">
                                <div class="hw-label">Chọn Gemini Model</div>
                                <select id="hw-cfg-model" class="hw-input" style="color: #fff; background: #0B1120;">
                                    <option value="${window.HW_Config.GEMINI_MODEL}">${window.HW_Config.GEMINI_MODEL}</option>
                                </select>
                            </div>
                            <div class="hw-input-group">
                                <div class="hw-label">Thời gian chờ mỗi câu (giây)</div>
                                <input type="number" id="hw-cfg-pacing" class="hw-input" value="${window.HW_Config.PACING_DELAY / 1000}">
                            </div>
                            <div>
                                <label class="hw-label" style="display:flex; align-items:center; gap:8px;">
                                    <input type="checkbox" id="hw-cfg-autosubmit" ${window.HW_Config.AUTO_SUBMIT ? 'checked' : ''}> Tự động nộp bài
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="hw-col-right">
                        <div class="hw-detail-title">
                            <span>🤖 Chi tiết gửi AI (Prompt / Response)</span>
                            <button class="hw-btn-icon" onclick="document.getElementById('hw-detail-box').innerText = ''" title="Xóa log chi tiết">🗑️</button>
                        </div>
                        <div class="hw-detail" id="hw-detail-box">Đang chờ dữ liệu...</div>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);

        if(window.HW_Config.ASSIGNMENT_ID) document.getElementById("hw-id-display").innerText = `ID: ${window.HW_Config.ASSIGNMENT_ID}`;
        else document.getElementById("hw-id-display").innerText = `Không tìm thấy ID!`;

        const dash = document.getElementById("hw-dashboard");
        const header = document.getElementById("hw-header");
        let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
        header.addEventListener("mousedown", (e) => { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; isDragging = true; });
        document.addEventListener("mouseup", () => isDragging = false);
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX; currentY = e.clientY - initialY;
                xOffset = currentX; yOffset = currentY;
                dash.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        });

        document.getElementById("hw-minimize").onclick = () => {
            if (!this.isMinimized) {
                dash.style.width = "320px"; dash.style.height = "110px"; dash.style.resize = "none";
                document.getElementById("hw-body").style.display = "none";
                document.getElementById("hw-mini-view").style.display = "flex";
                document.getElementById("hw-minimize").innerText = "□";
                this.isMinimized = true;
            } else {
                dash.style.width = "850px"; dash.style.height = "450px"; dash.style.resize = "both";
                document.getElementById("hw-body").style.display = "flex";
                document.getElementById("hw-mini-view").style.display = "none";
                document.getElementById("hw-minimize").innerText = "_";
                this.isMinimized = false;
            }
        };

        document.querySelectorAll(".hw-tab").forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll(".hw-tab").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".hw-panel").forEach(p => p.classList.remove("active"));
                tab.classList.add("active"); document.getElementById(tab.dataset.target).classList.add("active");
            };
        });

        document.getElementById("hw-start").onclick = () => this.startSolving();
        document.getElementById("hw-stop").onclick = () => this.stopSolving();
        
        document.getElementById("hw-cfg-gemini").onchange = (e) => { 
            window.HW_Config.GEMINI_KEY = e.target.value.trim(); 
            localStorage.setItem("HW_GEMINI_KEY", window.HW_Config.GEMINI_KEY); 
            window.HW_Logger.success("Đã lưu Key.");
            window.hwApiClient.fetchModels(); 
        };
        document.getElementById("hw-cfg-pacing").onchange = (e) => { window.HW_Config.PACING_DELAY = (parseInt(e.target.value) || 2) * 1000; localStorage.setItem("HW_PACING_DELAY", window.HW_Config.PACING_DELAY); };
        document.getElementById("hw-cfg-autosubmit").onchange = (e) => { window.HW_Config.AUTO_SUBMIT = e.target.checked; localStorage.setItem("HW_AUTO_SUBMIT", window.HW_Config.AUTO_SUBMIT); };
        
        document.getElementById("hw-cfg-model").onchange = (e) => { 
            window.HW_Config.GEMINI_MODEL = e.target.value; 
            localStorage.setItem("HW_GEMINI_MODEL", window.HW_Config.GEMINI_MODEL); 
            window.HW_Logger.success(`Đã chọn Model: ${window.HW_Config.GEMINI_MODEL}`); 
        };

        document.getElementById("hw-btn-fetch").onclick = () => window.hwApiClient.fetchModels();

        if (window.HW_Config.GEMINI_KEY) {
            setTimeout(() => window.hwApiClient.fetchModels(), 1000);
        }
    }

    updateStatus(text) { 
        const mainStatus = document.getElementById("hw-status");
        const miniStatus = document.getElementById("mini-status");
        if (mainStatus) mainStatus.innerText = text; 
        if (miniStatus) miniStatus.innerText = text;
    }
    
    updateTimer() {
        if (!this.startTime) return;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        const timeStr = `${m}:${s}`;
        
        const mainTimer = document.getElementById("hw-timer");
        const miniTimer = document.getElementById("mini-timer");
        if (mainTimer) mainTimer.innerText = timeStr;
        if (miniTimer) miniTimer.innerText = `⏱️ ${timeStr}`;
    }

    startSolving() {
        if (!window.HW_Config.ASSIGNMENT_ID) {
            window.HW_Logger.error("Không tìm thấy ID bài học!");
            return;
        }
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        document.getElementById("hw-start").disabled = true;
        document.getElementById("hw-stop").disabled = false;
        window.HW_Logger.success("🚀 Bắt đầu tiến trình API...");
        window.HW_Logger.detail("=== BẮT ĐẦU PHIÊN LÀM BÀI MỚI ===\n");
        window.hwSolver.start();
    }

    stopSolving() {
        clearInterval(this.timerInterval);
        document.getElementById("hw-start").disabled = false;
        document.getElementById("hw-stop").disabled = true;
        this.updateStatus("Đã dừng");
        window.HW_Logger.warn("Đã dừng tiến trình.");
        window.hwSolver.stop();
    }
};
