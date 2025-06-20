document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart
    let cart = [];
    let cartCount = 0;
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotal = document.querySelector('.total-amount');
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));

            const existingItem = cart.find(item => item.product === product);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    product: product,
                    price: price,
                    quantity: 1
                });
            }

            cartCount += 1;
            updateCart();
            showToast(`${product} added to cart`);
            cartModal.show();
        });
    });

    // Buy Now functionality
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function () {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));

            cart = [{
                product: product,
                price: price,
                quantity: 1
            }];

            cartCount = 1;
            updateCart();
            proceedToCheckout();
        });
    });

    function showToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1100';

        toastContainer.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-primary text-white">
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        document.body.appendChild(toastContainer);

        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            document.querySelector('.cart-items-container').style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            document.querySelector('.cart-items-container').style.display = 'block';

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const li = document.createElement('li');
                li.className = 'list-group-item cart-item';
                li.innerHTML = `
                    <div>
                        <h6>${item.product}</h6>
                        <p class="mb-0">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-product="${item.product}">-</button>
                        <input type="text" class="quantity" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" data-product="${item.product}">+</button>
                        <button class="remove-item" data-product="${item.product}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="ms-3">
                        <strong>$${itemTotal.toFixed(2)}</strong>
                    </div>
                `;
                cartItemsContainer.appendChild(li);
            });

            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', function () {
                    const product = this.getAttribute('data-product');
                    const item = cart.find(item => item.product === product);

                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        cartCount -= 1;
                        updateCart();
                    }
                });
            });

            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', function () {
                    const product = this.getAttribute('data-product');
                    const item = cart.find(item => item.product === product);

                    item.quantity += 1;
                    cartCount += 1;
                    updateCart();
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function () {
                    const product = this.getAttribute('data-product');
                    const itemIndex = cart.findIndex(item => item.product === product);

                    if (itemIndex !== -1) {
                        cartCount -= cart[itemIndex].quantity;
                        cart.splice(itemIndex, 1);
                        updateCart();
                    }
                });
            });
        }

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCountElement.textContent = cartCount;

        document.querySelector('.order-subtotal').textContent = `$${total.toFixed(2)}`;
        const tax = total * 0.1;
        document.querySelector('.order-tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.order-total').textContent = `$${(total + tax + 5.99).toFixed(2)}`;
    }

    function proceedToCheckout() {
        cartModal.hide();
        paymentModal.show();
    }

    document.querySelector('.checkout-btn')?.addEventListener('click', proceedToCheckout);

    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function () {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');

            const methodName = this.getAttribute('data-method');
            document.querySelectorAll('.payment-form').forEach(form => form.style.display = 'none');
            document.getElementById(`${methodName}-form`).style.display = 'block';
        });
    });

    document.querySelector('.confirm-payment')?.addEventListener('click', function () {
        paymentModal.hide();
        const orderId = Math.floor(100000 + Math.random() * 900000);
        document.getElementById('order-id').textContent = orderId;

        cart = [];
        cartCount = 0;
        updateCart();
        confirmationModal.show();
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            document.querySelectorAll('.product-category').forEach(cat => {
                cat.style.display = 'none';
            });
            document.getElementById(category).style.display = 'block';
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelector('.newsletter-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        showToast(`Thank you for subscribing with ${email}!`);
        this.reset();
    });

    // ✅ SIGNUP: Send data to backend
    document.getElementById('signupForm')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.getElementById('name')?.value || "Guest";
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            showToast('Passwords do not match!');
            return;
        }

        fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                eMail: email,
                password: password,
                cpassword: confirmPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Signup failed.");
            }
            return response.json();
        })
        .then(data => {
            showToast('Signup successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch(error => {
            console.error("Signup error:", error);
            showToast('Signup failed. Please try again.');
        });
    });
});
