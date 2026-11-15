window.HW_API = class {
    async fetchModels() {
        const cfg = window.HW_Config;
        const log = window.HW_Logger;
        if (!cfg.GEMINI_KEY) return;
        
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cfg.GEMINI_KEY}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            
            cfg.AVAILABLE_MODELS = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", ""))
                .filter(m => !m.includes("tts") && !m.includes("vision") && !m.includes("image") && !m.includes("embedding"));
                
            cfg.AVAILABLE_MODELS.sort((a, b) => {
                if (a.includes("flash") && !b.includes("flash")) return -1;
                if (!a.includes("flash") && b.includes("flash")) return 1;
                return parseFloat(b.match(/(\d+\.\d+)/)?.[1] || 0) - parseFloat(a.match(/(\d+\.\d+)/)?.[1] || 0);
            });

            if (cfg.AVAILABLE_MODELS.length > 0) {
                if (!cfg.AVAILABLE_MODELS.includes(cfg.GEMINI_MODEL)) {
                    cfg.GEMINI_MODEL = cfg.AVAILABLE_MODELS[0];
                    localStorage.setItem("HW_GEMINI_MODEL", cfg.GEMINI_MODEL);
                }
                this.updateModelUI();
                log.success(`Đã tải ${cfg.AVAILABLE_MODELS.length} Models.`);
                return true;
            }
        } catch (e) {
            log.error(`Lỗi tải Model: ${e.message}`);
        }
        return false;
    }

    updateModelUI() {
        const select = document.getElementById("hw-cfg-model");
        if (!select) return;
        select.innerHTML = "";
        window.HW_Config.AVAILABLE_MODELS.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m;
            opt.innerText = m;
            if (m === window.HW_Config.GEMINI_MODEL) opt.selected = true;
            select.appendChild(opt);
        });
    }

    async callGemini(prompt, attempt = 1) {
        const cfg = window.HW_Config;
        const log = window.HW_Logger;
        if (!cfg.GEMINI_KEY) throw new Error("Chưa nhập Gemini API Key.");

        try {
            const modelName = cfg.GEMINI_MODEL.replace("models/", "");
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cfg.GEMINI_KEY}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1 } };
            
            log.detail(`--- PROMPT GỬI AI ---\n${prompt}\n`);
            const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData.error?.message || `HTTP ${res.status}`;
                
                if ((res.status === 503 || res.status === 429) && attempt <= 3) {
                    const waitTime = attempt * 4000;
                    log.warn(`Google quá tải (${res.status}). Chờ ${waitTime/1000}s...`);
                    await window.HW_Utils.sleep(waitTime);
                    return this.callGemini(prompt, attempt + 1);
                }
                throw new Error(errMsg);
            }
            
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("AI không trả về văn bản.");
            
            log.detail(`--- AI TRẢ LỜI ---\n${text}\n----------------------------------------\n`);
            return text;
        } catch (e) {
            throw e;
        }
    }
};
