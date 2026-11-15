window.HW_Config = {
    GEMINI_KEY: localStorage.getItem("HW_GEMINI_KEY") || "",
    GEMINI_MODEL: localStorage.getItem("HW_GEMINI_MODEL") || "gemini-1.5-flash", 
    PACING_DELAY: parseInt(localStorage.getItem("HW_PACING_DELAY")) || 2000,
    AUTO_SUBMIT: localStorage.getItem("HW_AUTO_SUBMIT") !== "false",
    BASE_API: "https://api-elb.onluyen.vn/api",
    ASSIGNMENT_ID: null,
    AUTH_TOKEN: null,
    AVAILABLE_MODELS: []
};
