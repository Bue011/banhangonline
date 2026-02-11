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
}// --- 3. Cập nhật hàm renderCart (Thêm dòng save vào cuối) ---
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

    // LƯU DỮ LIỆU VÀO TRÌNH DUYỆT TẠI ĐÂY
    saveToLocalStorage();
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
    renderCart();
    // Tự động mở giỏ hàng khi thêm thành công (trải nghiệm tốt hơn)
    if(!cartSidebar.classList.contains('active')) toggleCart();
}

// 4. Hàm xóa sản phẩm
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// 5. Cập nhật giao diện
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
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.price.toLocaleString()}đ x ${item.quantity}</small>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Xóa</button>
        `;
        cartItemsList.appendChild(itemDiv);
    });

    totalPriceEl.innerText = total.toLocaleString() + 'đ';
    cartCountEl.innerText = count;}
// Hàm cập nhật số lượng (Tăng/Giảm)
function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        
        // Nếu số lượng nhỏ hơn 1, xóa sản phẩm khỏi giỏ
        if (item.quantity < 1) {
            removeFromCart(id);
        } else {
            renderCart();
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
const TELEGRAM_TOKEN = '8523187407:AAFouYODyILrIuF3LfaxnPstZwGK2vzu7pA'; // <--- Thay Token của bạn
const TELEGRAM_CHAT_ID = '7775484284';              // <--- Thay ID của bạn

document.getElementById('confirm-order').addEventListener('click', async function() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (cart.length === 0 || !name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin và chọn sản phẩm!");
        return;
    }

    // 1. Tạo nội dung tin nhắn
    let orderDetails = cart.map(item => `+ ${item.name} (x${item.quantity})`).join('\n');
    let totalMoney = document.getElementById('total-price').innerText;
    
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
💰 TỔNG: ${totalMoney}
    `.trim();

    // 2. Gửi đi và CHỜ KẾT QUẢ
    try {
        // Lưu ý: chữ 'bot' nằm ngay trước biến TOKEN
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (result.ok) {
            // CHỈ KHI TELEGRAM XÁC NHẬN OK THÌ MỚI BÁO THÀNH CÔNG
            alert("✅ Đã gửi đơn hàng thành công tới Telegram!");
            
            // Xóa giỏ hàng
            cart = [];
            localStorage.removeItem('vintage_cart');
            renderCart();
            toggleCart();
            
            // Reset form
            document.getElementById('customer-name').value = '';
            document.getElementById('customer-phone').value = '';
            document.getElementById('customer-address').value = '';
        } else {
            // Nếu Telegram từ chối (Sai ID, sai Token, chưa nhấn Start)
            alert("❌ Lỗi Telegram: " + result.description);
        }
    } catch (error) {
        alert("❌ Lỗi mạng: Không thể gửi đơn. Hãy kiểm tra kết nối!");
        console.error(error);
    }
});
