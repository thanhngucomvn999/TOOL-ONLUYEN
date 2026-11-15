(function () {
    'use strict';

    // Lấy ID bài tập
    window.HW_Utils.extractAssignmentId();
    
    // Khởi tạo các instance toàn cục
    window.hwApiClient = new window.HW_API();
    window.hwDomController = new window.HW_DOM();
    window.hwUI = new window.HW_UI();
    window.hwSolver = new window.HW_Solver(window.hwApiClient, window.hwDomController);

    console.log("🚀 Onluyen AI Pro (Modular Version) đã khởi tạo thành công!");
})();
