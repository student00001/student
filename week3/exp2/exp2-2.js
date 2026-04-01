const products = [
    { id: 1, name: "Wireless Mouse", price: 25.00, category: "Electronics" },
    { id: 2, name: "Gaming Keyboard", price: 80.00, category: "Electronics" },
    { id: 3, name: "Cotton T-Shirt", price: 15.00, category: "Fashion" },
    { id: 4, name: "Running Shoes", price: 60.00, category: "Fashion" },
    { id: 5, name: "Coffee Mug", price: 10.00, category: "Home" }
];

let cart = []; 
let appliedCoupon = null;

function init() {
    const listContainer = document.getElementById('product-list');
    
    products.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <div>
                <strong>${prod.name}</strong> <br>
                <span style="color:gray; font-size:0.9em">$${prod.price.toFixed(2)} | ${prod.category}</span>
            </div>
            <button class="btn-add" onclick="addToCart(${prod.id})">Add to Cart</button>
        `;
        listContainer.appendChild(div);
    });

    updateCartDisplay();
}

function addToCart(id) {
    const existingItem = cart.find(item => item.productId === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ productId: id, quantity: 1 });
    }
    updateCartDisplay();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.productId !== id);
    updateCartDisplay();
}

function changeQuantity(id, change) {
    const item = cart.find(item => item.productId === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
        }
    }
}

function applyCoupon() {
    const input = document.getElementById('coupon-code').value;
    const msg = document.getElementById('coupon-msg');

    const cleanCode = input.trim().toUpperCase();

    if (cleanCode === "") {
        appliedCoupon = null;
        msg.textContent = "Coupon removed.";
        msg.style.color = "black";
    } else if (cleanCode === "SAVE10") {
        appliedCoupon = { code: "SAVE10", type: "percent", value: 0.10 };
        msg.textContent = "10% Discount Applied!";
        msg.style.color = "green";
    } else if (cleanCode === "MINUS5") {
        appliedCoupon = { code: "MINUS5", type: "flat", value: 5.00 };
        msg.textContent = "$5 Flat Discount Applied!";
        msg.style.color = "green";
    } else {
        appliedCoupon = null;
        msg.textContent = "Invalid Code.";
        msg.style.color = "red";
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    
    cartContainer.innerHTML = "";
    
    let subtotal = 0;
    let bulkDiscountTotal = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        
        let linePrice = product.price * cartItem.quantity;
        let lineDiscountNote = "";

        if (cartItem.quantity >= 5) {
            const discountAmount = linePrice * 0.10;
            linePrice -= discountAmount;
            bulkDiscountTotal += discountAmount;
            lineDiscountNote = `<span class="tag tag-bulk">Bulk -10%</span>`;
        }

        subtotal += linePrice;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${product.name}</strong> ${lineDiscountNote}<br>
                <small>$${product.price} x ${cartItem.quantity}</small>
            </div>
            <div>
                <strong style="margin-right:10px;">$${linePrice.toFixed(2)}</strong>
                <button class="btn-qty" onclick="changeQuantity(${product.id}, -1)">-</button>
                <button class="btn-qty" onclick="changeQuantity(${product.id}, 1)">+</button>
                <button class="btn-remove" onclick="removeFromCart(${product.id})">&times;</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        summaryContainer.innerHTML = "";
        return;
    }

    
    const currentHour = new Date().getHours();
    let timeDiscount = 0;
    const isNightOwl = currentHour >= 18 || currentHour < 6;
    
    if (isNightOwl) {
        timeDiscount = subtotal * 0.05; 
        document.getElementById('time-indicator').innerHTML = "<small class='tag-time'>(🌙 Night Owl Active)</small>";
    } else {
        document.getElementById('time-indicator').innerHTML = "";
    }

    // Logic: Coupon Application
    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === "percent") {
            couponDiscount = subtotal * appliedCoupon.value;
        } else if (appliedCoupon.type === "flat") {
            couponDiscount = appliedCoupon.value;
        }
    }

    const finalTotal = subtotal - timeDiscount - couponDiscount;

    summaryContainer.innerHTML = `
        <div class="total-line"><span>Subtotal (after bulk items):</span> <span>$${subtotal.toFixed(2)}</span></div>
        ${bulkDiscountTotal > 0 ? `<div class="total-line" style="color:green; font-size:0.9em">Included Bulk Savings: $${bulkDiscountTotal.toFixed(2)}</div>` : ''}
        
        ${timeDiscount > 0 ? `<div class="total-line" style="color:purple;"><span>Night Owl Discount (5%):</span> <span>-$${timeDiscount.toFixed(2)}</span></div>` : ''}
        
        ${couponDiscount > 0 ? `<div class="total-line" style="color:green;"><span>Coupon (${appliedCoupon.code}):</span> <span>-$${couponDiscount.toFixed(2)}</span></div>` : ''}
        
        <div class="total-line final-price">
            <span>Total to Pay:</span>
            <span>$${Math.max(0, finalTotal).toFixed(2)}</span>
        </div>
    `;
}

init();