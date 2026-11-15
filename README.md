<div align="center">

# 🚀 ONLUYEN AI PRO - ULTIMATE

**Hệ thống tự động hóa giải bài tập Onluyen.vn (Modular Version)**

[![GitHub](https://img.shields.io/badge/GitHub-thanhngucomvn999-blue?style=for-the-badge&logo=github)](https://github.com/thanhngucomvn999/TOOL-ONLUYEN)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Ready-green?style=for-the-badge&logo=greasemonkey)]()

*Công cụ hỗ trợ học tập - Tăng tốc độ làm bài - Tối ưu hóa điểm số*

</div>

---

## 🌟 Giới thiệu

**Onluyen AI Pro** là một Userscript mạnh mẽ được thiết kế để tự động giải bài tập trên hệ thống Onluyen.vn. Với kiến trúc **Modular (chia nhỏ file)**, dự án này đảm bảo tốc độ tải cực nhanh, dễ dàng bảo trì và nâng cấp mà không cần cài lại.

Sử dụng sức mạnh của trí tuệ nhân tạo **Google Gemini**, công cụ có khả năng đọc hiểu đề bài, phân tích từng bước và đưa ra đáp án chính xác nhất cho các dạng: Trắc nghiệm, Đúng/Sai, và Trả lời ngắn.

---

## ✨ Tính năng nổi bật

- 🎨 **Giao diện Dashboard Hiện đại**: Khung điều khiển chia đôi màn hình, theo dõi log AI trực tiếp (Prompt & Response).
- ⏱️ **Đồng hồ Real-time**: Có chế độ thu nhỏ chỉ hiển thị thời gian và tiến độ làm bài cực kỳ gọn gàng.
- ⚡ **Cập nhật DOM tức thì**: Tự động click chọn đáp án hoặc điền số ngay khi AI trả lời.
- 🔄 **Tự động lưu (Auto-Save)**: Đồng bộ đáp án lên S3 của Onluyen ngay lập tức sau mỗi câu.
- 📝 **Xử lý số thực chuẩn xác**: Tự động chuyển dấu chấm (`.`) thành dấu phẩy (`,`) theo chuẩn Việt Nam (VD: `3.14` -> `3,14`).
- 🛡️ **Chống lỗi 503 (Quá tải)**: Tự động thử lại (Retry) khi server Google gặp quá tải.

---

## 🛠️ Hướng dẫn Cài đặt & Sử dụng

### Yêu cầu
- Trình duyệt chạy nhân Chromium (Chrome, Edge, Cốc Cốc, Brave...) hoặc Firefox.
- Đã cài đặt Extension **Tampermonkey**.

### Cách 1: Cài đặt qua Tampermonkey (Khuyên dùng)
1. Cài đặt Extension [Tampermonkey](https://www.tampermonkey.net/).
2. Nhấp vào liên kết dưới đây để cài đặt Script:
   👉 **[TẢI ONLUYEN AI PRO TẠI ĐÂY](https://raw.githubusercontent.com/thanhngucomvn999/TOOL-ONLUYEN/main/OnluyenAIPro.user.js)**
3. Tampermonkey sẽ hiện bảng cài đặt, bấm **Install** (Cài đặt).
4. Mở trang làm bài của Onluyen. Khung điều khiển AI sẽ tự động hiện ra ở góc phải.

### Cách 2: Chạy nhanh qua Console (Dành cho Dev)
Nếu không muốn cài Tampermonkey, bạn có thể mở trang web Onluyen, nhấn `F12` để mở Console và dán dòng code sau:

```javascript
fetch('https://cdn.jsdelivr.net/gh/thanhngucomvn999/TOOL-ONLUYEN@main/OnluyenAIPro.user.js').then(r=>r.text()).then(eval);
```
📖 Hướng dẫn Cấu hình
Lấy API Key: Truy cập Google AI Studio để lấy API Key miễn phí.

Trong giao diện Script, chuyển sang tab Cấu hình.

Dán Key vào ô Gemini API Key.

Bấm 🔄 Tải lại danh sách Model để hệ thống tự động tìm Model AI phù hợp nhất.

Chuyển sang tab Tiến trình và bấm Bắt đầu.

⚠️ Tuyên bố Miễn trừ Trách nhiệm
DỰ ÁN NÀY ĐƯỢC TẠO RA VỚI MỤC ĐÍCH HỌC TẬP VÀ NGHIÊN CỨU CÔNG NGHỆ AI.
Tác giả không chịu trách nhiệm cho bất kỳ hành vi vi phạm quy chế thi cử hoặc các hậu quả pháp lý nào phát sinh từ việc sử dụng công cụ này. Hãy sử dụng một cách có trách nhiệm.

<div align="center"> <b>Phát triển bởi <a href="https://github.com/thanhngucomvn999">thanhngucomvn999</a></b><br> <i>Nếu dự án này giúp ích cho bạn, hãy tặng mình 1 ⭐ (Star) nhé! ❤️</i> </div> ```
