// Variabel global agar bisa digunakan di fungsi manapun
let cartItems = [];
let totalAmount = 0;

// Fungsi global untuk update cart
function updateCartUI() {
  updateCartItemCount(cartItems.length);
  updateCartItemList();
  updateCartTotal();
}

function updateCartItemCount(count) {
  const cartItemCount = document.querySelector('.cart-icon span');
  cartItemCount.textContent = count;
}

function updateCartItemList() {
  const cartItemList = document.querySelector('.cart-items');
  cartItemList.innerHTML = '';
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

  // Tombol hapus item
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
  const cartTotal = document.querySelector('.cart-total');
  cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
}

// Fungsi kirim data ke Google Sheets
function kirimPesanKeWA() {
  const namaInput = document.getElementById("nama-pemesan").value.trim();
  const nomorInput = document.getElementById("nomor-hp").value.trim();

  if (cartItems.length === 0 || namaInput === "" || nomorInput === "") {
    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      text: 'Silakan isi nama, nomor HP, dan pilih layanan.',
      confirmButtonColor: '#99a98f'
    });
    return;
  }

  let layanan = "";
  cartItems.forEach(item => {
    layanan += `(${item.quantity}x) ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  const url = "https://script.google.com/macros/s/AKfycbxMrQM5ux3uwIciDZAB4Jn6SYDsIgO2FIH19zzVlAiKMCM84l58nsnl2DyDdXcnopVN/exec" +
              `?nama=${encodeURIComponent(namaInput)}&nomor=${encodeURIComponent(nomorInput)}&layanan=${encodeURIComponent(layanan)}&total=${encodeURIComponent(totalAmount.toFixed(2))}`;

  fetch(url)
    .then(response => response.json())
    .then(result => {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil dikirim ke Google Sheets.',
        confirmButtonColor: '#99a98f'
      });

      // Reset keranjang & form
      cartItems = [];
      totalAmount = 0;
      document.getElementById("nama-pemesan").value = "";
      document.getElementById("nomor-hp").value = "";
      updateCartUI();

      // Tutup sidebar
      document.getElementById('sidebar').classList.remove('open');
    })
    .catch(error => {
      console.error("Gagal kirim data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengirim data ke Google Sheets.',
        confirmButtonColor: '#d33'
      });
    });
}

// Inisialisasi setelah dokumen siap
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById("kirim-btn");
  if (btn) {
    btn.addEventListener("click", kirimPesanKeWA);
  }

  const addCartButtons = document.querySelectorAll('.add--to--cart');
  const cartIcon = document.querySelector('.cart-icon');
  const sidebar = document.getElementById('sidebar');
  const closeButton = document.querySelector('.sidebar-close');

  // Event tombol tambah ke keranjang
  addCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const itemName = card.querySelector('.card--title').textContent;
      const itemPriceText = card.querySelector('.price').textContent;
      const itemPrice = parseFloat(itemPriceText.replace('$', ''));

      if (isNaN(itemPrice)) return;

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

  // Sidebar toggle
  cartIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  closeButton.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
});
