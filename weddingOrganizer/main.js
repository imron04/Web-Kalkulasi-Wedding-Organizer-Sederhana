document.addEventListener('DOMContentLoaded', () => {
    const addCartButtons = document.querySelectorAll('.add--to--cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.getElementById('sidebar');
    const closeButton = document.querySelector('.sidebar-close');

    let cartItems = [];
    let totalAmount = 0;

    // Event: Klik tombol add to cart
    addCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.card'); // cari parent .card terdekat
            const itemName = card.querySelector('.card--title').textContent;
            const itemPriceText = card.querySelector('.price').textContent;

            const itemPrice = parseFloat(itemPriceText.replace('$', ''));
            if (isNaN(itemPrice)) return; // jika gagal baca harga, abaikan

            const existingItem = cartItems.find(cartItem => cartItem.name === itemName);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
            }

            totalAmount += itemPrice;
            updateCartUI();
        });
    });

    // Update seluruh tampilan cart
    function updateCartUI() {
        updateCartItemCount(cartItems.length);
        updateCartItemList();
        updateCartTotal();
    }

    function updateCartItemCount(count) {
        cartItemCount.textContent = count;
    }

    function updateCartItemList() {
        cartItemList.innerHTML = ''; // bersihkan list
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            cartItem.innerHTML = `
                <span>(${item.quantity}x) ${item.name}</span>
                <span class="cart-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </span>
            `;
            cartItemList.appendChild(cartItem);
        });

        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.currentTarget.dataset.index);
                removeItemFromCart(index);
            });
        });
    }

    function removeItemFromCart(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        totalAmount -= removedItem.price * removedItem.quantity;
        updateCartUI();
    }

    function updateCartTotal() {
        cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    }

    // Sidebar toggle
    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
   // Tombol "Kirim" -> SweetAlert
const checkoutBtn = document.querySelector('.checkout-btn');
checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault(); // mencegah reload

    const nama = document.getElementById('nama-pemesan').value.trim();
    const hp = document.getElementById('nomor-hp').value.trim();

    if (cartItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Keranjang kosong!',
            text: 'Silakan pilih item terlebih dahulu.',
            confirmButtonColor: '#99a98f'
        });
        return;
    }

    if (nama === '' || hp === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Data belum lengkap!',
            text: 'Isi nama dan nomor HP terlebih dahulu.',
            confirmButtonColor: '#99a98f'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Data Terkirim!',
        text: `Pesanan atas nama ${nama} telah diproses.`,
        confirmButtonColor: '#99a98f'
    });

    // Reset
    cartItems = [];
    totalAmount = 0;
    document.getElementById('nama-pemesan').value = '';
    document.getElementById('nomor-hp').value = '';
    updateCartUI();
    sidebar.classList.remove('open');
});

});
