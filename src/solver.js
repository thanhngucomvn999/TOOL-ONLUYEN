window.HW_Solver = class {
    constructor(apiClient, domController) {
        this.api = apiClient;
        this.dom = domController;
        this.running = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._runHybridTask();
    }

    stop() { this.running = false; }

    async _runHybridTask() {
        const cfg = window.HW_Config;
        const log = window.HW_Logger;
        const utils = window.HW_Utils;
        
        try {
            cfg.AUTH_TOKEN = utils.getToken();
            if (!cfg.AUTH_TOKEN) {
                log.error("Không tìm thấy Token đăng nhập. Hãy F5 tải lại trang!");
                window.hwUI.stopSolving();
                return;
            }

            await fetch(`${cfg.BASE_API}/school-online/assignment/start/${cfg.ASSIGNMENT_ID}`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${cfg.AUTH_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({})
            });
            
            log.info("Đang tải dữ liệu từ Onluyen API...");
            const res = await fetch(`${cfg.BASE_API}/school-online/assignment/doing/${cfg.ASSIGNMENT_ID}`, {
                headers: { 'Authorization': `Bearer ${cfg.AUTH_TOKEN}` }
            });
            
            if (!res.ok) throw new Error(`Lỗi HTTP ${res.status} khi tải đề.`);
            
            const json = await res.json();
            const data = json.data;
            if (!data || !data.data) throw new Error("Không tìm thấy dữ liệu câu hỏi.");

            const putUrl = data.preSignedUrlAnswer;
            const rawQuestions = data.data;
            
            let startNum = 1;
            const selectedEl = document.querySelector('.list-question span.selected, .mobile-bottom-bar .number.active');
            if (selectedEl) {
                const parsed = parseInt(selectedEl.innerText.trim());
                if (!isNaN(parsed)) startNum = parsed;
            }
            
            log.success(`Tự động phát hiện đang ở Câu ${startNum}. Bắt đầu giải...`);
            window.hwUI.updateStatus(`Đang giải: ${startNum}/${rawQuestions.length}`);

            let globalAnswers = {};

            for (let i = startNum - 1; i < rawQuestions.length; i++) {
                if (!this.running) break;
                
                const q = rawQuestions[i];
                if (!q.dataStandard) continue;

                const std = q.dataStandard;
                const vi = std.languagesData?.vi || {};
                const typeCode = std.typeAnswer;
                const content = vi.content?.replace(/<[^>]+>/g, ' ').trim() || "";
                const stepId = std.stepId;

                this.dom.clickQuestionSidebar(i + 1);
                await utils.sleep(1000); 

                let prompt = "";
                let typeStr = "";

                if (typeCode === 1) {
                    typeStr = "TRUE_FALSE";
                    const opts = (vi.options || []).map(o => `- ${o.content?.replace(/<[^>]+>/g, ' ').trim()}`).join('\n');
                    prompt = `Bạn là giáo viên giỏi. Đánh giá các nhận định sau là Đúng (true) hay Sai (false).\nĐề bài: ${content}\nCác nhận định:\n${opts}\n\nCHỈ TRẢ VỀ JSON: {"answers": ["true", "false", ...]}`;
                } else if (typeCode === 3 || typeCode === 5) {
                    typeStr = "TEXT";
                    prompt = `Bạn là một giáo viên giỏi giải bài tập chính xác tuyệt đối. Hãy phân tích cẩn thận.\nĐề bài: ${content}\n\nYÊU CẦU BẮT BUỘC:\n1. Hãy suy luận từng bước để tìm ra đáp số cuối cùng.\n2. Nếu đáp số là số thập phân, BẮT BUỘC sử dụng dấu phẩy (,) thay vì dấu chấm (.). Ví dụ: 3.14 phải viết là 3,14.\n3. Không bao gồm đơn vị đo lường (kg, m, cm...).\n4. Chỉ trả về JSON duy nhất: {"answer": "<đáp_số>"}`;
                } else {
                    typeStr = "MCQ";
                    const opts = (vi.options || []).map((o, idx) => `${String.fromCharCode(65+idx)}. ${o.content?.replace(/<[^>]+>/g, ' ').trim()}`).join('\n');
                    prompt = `Bạn là giáo viên giỏi. Giải câu hỏi sau và CHỈ trả về JSON: {"answer": "<chữ_cái_đáp_án>"}.\nCâu hỏi: ${content}\nCác lựa chọn:\n${opts}`;
                }

                log.info(`[${i+1}/${rawQuestions.length}] Đang giải ${typeStr}...`);
                window.hwUI.updateStatus(`Đang giải: ${i+1}/${rawQuestions.length}`);
                log.detail(`--- PROMPT CÂU ${i+1} ---\n${prompt}\n`);

                let ansRaw = "";
                try {
                    ansRaw = await this.api.callGemini(prompt);
                    log.detail(`--- AI TRẢ LỜI ---\n${ansRaw}\n----------------------------------------\n`);
                } catch (e) {
                    log.error(`Lỗi API ở câu ${i+1}: ${e.message}`);
                    continue;
                }

                const jsonAns = utils.safeParseJSON(ansRaw);
                let item = { id: stepId, isSkip: false, studentDoRight: null, timeUpdate: Math.floor(Date.now() / 1000), lang: "vi" };

                if (typeCode === 1) {
                    let arr = (jsonAns && Array.isArray(jsonAns.answers)) ? jsonAns.answers.map(a => String(a).toLowerCase()) : [];
                    while(arr.length < (vi.options || []).length) arr.push("false");
                    item.optionId = []; item.optionText = arr.slice(0, (vi.options||[]).length);
                    log.success(`  -> Chọn: ${item.optionText.join(", ")}`);
                } else if (typeCode === 3 || typeCode === 5) {
                    let textAns = jsonAns && jsonAns.answer ? String(jsonAns.answer) : "0";
                    textAns = textAns.replace(/(\d)\.(\d)/g, '$1,$2');
                    item.optionId = []; item.optionText = [textAns];
                    log.success(`  -> Điền: ${textAns}`);
                } else {
                    let ansLetter = jsonAns && jsonAns.answer ? jsonAns.answer : "A";
                    if (typeof ansLetter === 'string') ansLetter = ansLetter.toUpperCase();
                    const idx = ansLetter.charCodeAt(0) - 65;
                    const optId = vi.options?.[idx]?.idOption || vi.options?.[0]?.idOption;
                    item.optionId = [optId]; item.optionText = [];
                    log.success(`  -> Chọn đáp án: ${ansLetter}`);
                }

                globalAnswers[stepId] = item;
                this.dom.applyAnswerToDOM(typeCode, jsonAns, vi.options);
                
                try {
                    const currentPayload = Object.values(globalAnswers);
                    await fetch(putUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentPayload) });
                    log.success(`Đã lưu đáp án câu ${i+1} lên S3.`);
                } catch (err) {
                    log.warn(`Không thể PUT S3 cho câu ${i+1}.`);
                }

                await utils.sleep(cfg.PACING_DELAY);
            }

            if (!this.running) return;

            if (cfg.AUTO_SUBMIT) {
                log.info("Đang đợi để đủ thời gian tối thiểu 3 phút...");
                const elapsed = Math.floor((Date.now() - window.hwUI.startTime) / 1000);
                const wait = Math.max(0, 180 - elapsed);
                if (wait > 0) {
                    for (let i = wait; i > 0; i--) {
                        if (!this.running) break;
                        window.hwUI.updateStatus(`Chờ nộp bài: ${i}s`);
                        await utils.sleep(1000);
                    }
                }

                if (this.running) {
                    window.hwUI.updateStatus("Đang nộp bài...");
                    const submitRes = await fetch(`${cfg.BASE_API}/school-online/assignment/submit/${cfg.ASSIGNMENT_ID}`, {
                        method: 'PUT', headers: { 'Authorization': `Bearer ${cfg.AUTH_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({})
                    });
                    if (submitRes.ok) {
                        log.success("🎉 NỘP BÀI THÀNH CÔNG!");
                        window.hwUI.updateStatus("Đã hoàn tất!");
                    } else {
                        log.error(`Lỗi nộp bài: ${submitRes.status}`);
                        window.hwUI.updateStatus("Lỗi nộp bài");
                    }
                }
            } else {
                 log.success("Đã lưu đáp án, không tự động nộp.");
                 window.hwUI.updateStatus("Hoàn tất");
            }

        } catch (e) {
            log.error(`Lỗi hệ thống: ${e.message}`);
        } finally {
            window.hwUI.stopSolving();
            this.running = false;
        }
    }
};
