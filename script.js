let cart = JSON.parse(localStorage.getItem('vintage_cart')) || [];


// Các phần tử DOM
const cartSidebar = document.getElementById('cart-sidebar');
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsList = document.getElementById('cart-items-list');
const totalPriceEl = document.getElementById('total-price');
const cartCountEl = document.getElementById('cart-count');
function saveToLocalStorage() {
    localStorage.setItem('vintage_cart', JSON.stringify(cart));
renderCart();
}

// --- 4. Lưu ý quan trọng khi Đặt hàng thành công ---
// Trong sự kiện click của nút 'confirm-order', sau khi đặt hàng xong, 
// bạn nhớ phải dọn dẹp LocalStorage để giỏ hàng trống cho lần mua sau:
function clearCartAfterOrder() {
    cart = [];
    localStorage.removeItem('vintage_cart'); // Xóa bộ nhớ
    renderCart();
}

// 1. Mở/Đóng giỏ hàng
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};

cartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);

// 2. Lắng nghe sự kiện thêm vào giỏ
document.removeEventListener('click', handleAddToCart); // Đảm bảo xóa cái cũ trước (nếu có)
document.addEventListener('click', handleAddToCart);

function handleAddToCart(e) {
    // Chỉ xử lý nếu mục tiêu click là nút có class 'add-to-cart'
    if (e.target && e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const productItem = button.closest('.product-item');
        
        const product = {
            id: productItem.dataset.id,
            name: productItem.dataset.name,
            price: parseInt(productItem.dataset.price),
            quantity: 1
        };
        
        // Gọi hàm thêm vào giỏ
        addToCart(product);
        // Thêm vào trong hàm handleAddToCart ở trên, sau dòng addToCart(product);
const originalText = button.innerText;
button.innerText = "Đã thêm vào giỏ !";
button.style.background = "#8b5e3c"; // Đổi sang màu nâu

setTimeout(() => {
    button.innerText = originalText;
    button.style.background = "#333"; // Trở lại màu đen
}, 1500);
    }
};

// 3. Hàm thêm sản phẩm
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(product);
    }
    saveToLocalStorage();
    // Tự động mở giỏ hàng khi thêm thành công (trải nghiệm tốt hơn)
    if(!cartSidebar.classList.contains('active')) toggleCart();
}

// 4. Hàm xóa sản phẩm
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveToLocalStorage();
}

// Hàm cập nhật số lượng (Tăng/Giảm)
function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        
        // Nếu số lượng nhỏ hơn 1, xóa sản phẩm khỏi giỏ
        if (item.quantity < 1) {
            removeFromCart(id);
        } else {
            saveToLocalStorage();
        }
    }
}

// Hàm render lại giao diện giỏ hàng (Cập nhật giao diện mới)
function renderCart() {
    cartItemsList.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                <small>${item.price.toLocaleString()}đ</small>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Xóa</button>
        `;
        cartItemsList.appendChild(itemDiv);
    });

    totalPriceEl.innerText = total.toLocaleString() + 'đ';
    cartCountEl.innerText = count;
}

// Đảm bảo Token và ID chuẩn (Không có chữ 'bot' ở đây, mình sẽ thêm phía dưới)
const TELEGRAM_TOKEN = '8638300578:AAEIaKnmGu6JwsUYWHfHHnKIN_r6Hh5oC80'; // <--- Thay Token của bạn
const TELEGRAM_CHAT_ID = '7775484284';              // <--- Thay ID của bạn
//Khai báo giờ trong đơn hảng//
const now = new Date();
    // giờ kiểu Việt nam//
const gio = now.toLocaleTimeString('vi-VN');
const ngay = now.toLocaleDateString('vi-VN');
const thoiGian = ` ${gio} -  ${ngay}`;
// Thêm ID đơn hàng 
const today = new Date();
const datePart = today.toISOString().slice(0,10).replace(/-/g,''); // YYYYMMDD

const confirmBtn = document.getElementById('confirm-order');

if (confirmBtn) {
    confirmBtn.addEventListener('click', async function() {

    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    let dailyCount = parseInt(localStorage.getItem("dailyCount")) || 0;
    dailyCount++;
    localStorage.setItem("dailyCount", dailyCount);
    const orderId = `PRO11--${datePart}-${String(dailyCount).padStart(3, '0')}`; // VD: DH202406150001
    if (cart.length === 0 || !name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin và chọn sản phẩm!");
        return;
    }

    // 🕒 Thời gian
    const now = new Date();
    const thoiGian = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    // 💰 Tính tổng tiền từ giỏ hàng
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    // 📦 Danh sách sản phẩm
    let orderDetails = "'" + cart
    .map(item => `+ ${item.name} (x${item.quantity})`)
    .join(' | ');

    // 🧾 Nội dung Telegram
    const message = `
🌟 ĐƠN HÀNG MỚI 🌟
-------------------------
👤 Khách: ${name}
📞 SĐT: ${phone}
🏠 ĐC: ${address}
-------------------------
🛒 Sản phẩm:
${orderDetails}
-------------------------
🕒 ${thoiGian}
-------------------------
💰 TỔNG: ${total.toLocaleString()}đ
    `.trim();

    try {
        // GỬI TELEGRAM
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });

        // GỬI GOOGLE SHEET
        const sheetURL = "https://script.google.com/macros/s/AKfycbzBv3cB1HZur5JReaIJT_xkldNARbo2pxx-0NbCl_dnWEGHEWTyCnobQqm2DVQI9eHh/exec";

        await fetch(sheetURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            time: thoiGian,
            product: orderDetails,
            name: name,
            phone:"'" + phone,
            address: address,
            total: total,
            status: "Ghi chú"
        
        })
                      
        });

        alert("✅ Đơn đã gửi! Vui lòng quét mã để thanh toán.");

            // 👉 Hiện QR TRƯỚC khi xóa giỏ
            showQRPayment(total, orderId);

            // ❌ TẠM THỜI CHƯA clear cart ở đây

        // Reset form
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-address').value = '';

    } catch (error) {
        alert("❌ Lỗi gửi đơn!");
        console.error(error);
    }
})};

function showQRPayment(total, orderId) {

    const bankCode = "VietcomBank"; // mã ngân hàng
    const accountNumber = "9765932428"; // STK của ông
    const accountName = "NGUYEN TRUNG THONG";

    const qrURL = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(orderId)}&accountName=${encodeURIComponent(accountName)}`;

    const qrHTML = `
        <div class="qr-box">
            <h3>Quét mã để thanh toán</h3>
            <img src="${qrURL}" width="250">
            <p>Số tiền: <strong>${total.toLocaleString()}đ</strong></p>
            <p>Nội dung: <strong>${orderId}</strong></p>
            <button onclick="finishPayment('${orderId}')">Tôi đã thanh toán</button>
        </div>
    `;
    
    document.getElementById("qr-container").style.display = "block";
    document.getElementById("cart-items-list").innerHTML = qrHTML;
}

async function finishPayment(orderId) {

    try {

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `⚠️ Khách báo đã thanh toán - Mã đơn: ${orderId}`
            })
        });

        alert("Shop đã nhận được thông báo. Vui lòng chờ xác nhận.");
        // Xóa giỏ hàng sau khi xác nhận thanh toán
        cart = [];
        localStorage.removeItem('vintage_cart');
        renderCart();

        // Ẩn QR
        document.getElementById("qr-container").style.display = "none";

        // Đóng sidebar
        cartSidebar.classList.remove("active");
        overlay.classList.remove("active");
    } catch (error) {
        console.error(error);
        alert("Lỗi gửi thông báo!");
    }
}

// --- ĐẶT Ở CUỐI FILE SCRIPT.JS ---

// Hàm này để đổ dữ liệu vào Popup và hiện nó lên
function showDetail(productId) {
    // 1. Tìm đúng sản phẩm trong mảng 'products' của bạn
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // 2. Điền thông tin vào các thẻ HTML trong Modal
        document.getElementById('modal-img').src = product.image;
        document.getElementById('modal-name').innerText = product.name;
        document.getElementById('modal-price').innerText = product.price.toLocaleString() + 'đ';
        document.getElementById('modal-desc').innerText = product.description || "Mô tả sản phẩm đang cập nhật...";
        
        // 3. Gán chức năng cho nút "Thêm vào giỏ" bên trong Modal
        document.getElementById('modal-add-btn').onclick = function() {
            addToCart(product); // Gọi lại hàm thêm vào giỏ có sẵn của bạn
            closeModal();         // Đóng popup sau khi thêm
        };

        // 4. Hiển thị Modal lên
        document.getElementById('product-modal').style.display = 'block';
    }
}

// Hàm để đóng Popup
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Nếu bấm chuột ra ngoài vùng trắng của Popup thì cũng đóng lại
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target == modal) {
        closeModal();
    }
}
;

document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});
