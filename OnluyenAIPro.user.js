// ==UserScript==
// @name         Onluyen AI Pro - Ultimate (Single File Loader)
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  Tự động tải toàn bộ lõi AI từ GitHub (Chỉ cần cài 1 file duy nhất)
// @author       Custom Integration
// @match        https://*.onluyen.vn/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================
    // CẤU HÌNH GITHUB (Đã cập nhật tự động)
    // ========================================================
    const GITHUB_USER = "thanhngucomvn999";
    const GITHUB_REPO = "TOOL-ONLUYEN";
    const BRANCH = "main"; 
    
    // Dùng CDN jsdelivr để tải nhanh và không bị chặn CORS
    const BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${BRANCH}/src/`;
    
    // Danh sách các file cần tải theo đúng thứ tự
    const FILES_TO_LOAD = [
        "config.js",
        "utils.js",
        "logger.js",
        "api.js",
        "dom.js",
        "ui.js",
        "solver.js",
        "main.js"
    ];

    console.log("%c[Onluyen AI Pro] Bắt đầu tải hệ thống Modular...", "color: #3B82F6; font-weight: bold; font-size: 14px;");

    // Hàm tải script tuần tự
    async function loadScripts() {
        for (const file of FILES_TO_LOAD) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = BASE_URL + file;
                script.onload = () => {
                    console.log(`[Onluyen AI Pro] Đã tải thành công: ${file}`);
                    resolve();
                };
                script.onerror = () => {
                    console.error(`[Onluyen AI Pro] LỖI tải file: ${file}. Hãy kiểm tra lại link GitHub!`);
                    reject(new Error(`Failed to load ${file}`));
                };
                document.head.appendChild(script);
            });
        }
        console.log("%c[Onluyen AI Pro] 🚀 Hệ thống đã sẵn sàng hoạt động!", "color: #10B981; font-weight: bold; font-size: 14px;");
    }

    // Bắt đầu tải
    loadScripts().catch(err => {
        alert("Không thể tải lõi Onluyen AI Pro. Vui lòng kiểm tra lại link GitHub trong code!");
    });

})();
