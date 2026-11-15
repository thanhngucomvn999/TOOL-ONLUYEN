window.HW_DOM = class {
    _simulateClick(el) {
        if (!el) return;
        ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click'].forEach(evt => el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window })));
        el.focus?.(); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    clickQuestionSidebar(num) {
        const items = document.querySelectorAll(".list-question span, .mobile-bottom-bar .number");
        const target = Array.from(items).find(el => el.innerText.trim() === String(num));
        if (target) {
            this._simulateClick(target);
            return true;
        }
        return false;
    }

    applyAnswerToDOM(typeCode, aiJson, viOptions) {
        if (typeCode === 1) {
            const trueAnswers = Array.from(document.querySelectorAll(".item-answer, .text-block")).filter(el => el.innerText.trim() === "Đúng" && el.offsetParent !== null);
            if (trueAnswers.length === 0) return;
            
            const answers = aiJson && Array.isArray(aiJson.answers) ? aiJson.answers : [];
            for (let i = 0; i < trueAnswers.length && i < viOptions.length; i++) {
                const parentRow = trueAnswers[i].closest('.row, .question-child, tr, .d-flex') || trueAnswers[i].parentElement;
                const falseEl = Array.from(parentRow.querySelectorAll(".item-answer, .text-block")).find(el => el.innerText.trim() === "Sai");
                
                const isTrue = String(answers[i]).toLowerCase() === 'true';
                this._simulateClick(isTrue ? trueAnswers[i] : falseEl);
            }
        } 
        else if (typeCode === 3 || typeCode === 5) {
            const inputs = Array.from(document.querySelectorAll("input[type='text'], textarea, .tox-tinymce, app-tinymce-textarea")).filter(el => el.offsetParent !== null);
            if (inputs.length > 0) {
                const el = inputs[0];
                let text = aiJson ? String(aiJson.answer) : "0";
                text = text.replace(/(\d)\.(\d)/g, '$1,$2');
                
                const isTinyMce = (el.id && el.id.includes('tiny')) || el.closest('app-tinymce-textarea, editor, .tox-tinymce');
                if (isTinyMce) {
                    const wrapper = el.closest('app-tinymce-textarea') || el.closest('editor') || el.closest('.tox-tinymce') || el.parentElement;
                    if (wrapper) {
                        const iframe = wrapper.querySelector('iframe.tox-edit-area__iframe') || wrapper.querySelector('iframe');
                        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
                            iframe.contentDocument.body.innerHTML = `<p>${text}</p>`;
                            iframe.contentDocument.body.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
                        }
                    }
                }
                el.value = text;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
            }
        } 
        else {
            const nodes = Array.from(document.querySelectorAll(".question-option, .select-item, .item-answer, .option")).filter(el => el.offsetParent !== null);
            let ansLetter = aiJson && aiJson.answer ? aiJson.answer : "A";
            if (typeof ansLetter === 'string') ansLetter = ansLetter.toUpperCase();
            const targetIndex = ansLetter.charCodeAt(0) - 65;

            if (nodes.length > targetIndex && targetIndex >= 0) {
                this._simulateClick(nodes[targetIndex]);
            }
        }
    }
};
