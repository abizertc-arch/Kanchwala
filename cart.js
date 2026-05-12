/* ========================================
   KANCHWALA JEWELLERS — Cart System
   Cart drawer, civil ID gate with image upload, checkout
   ======================================== */

let cart = JSON.parse(localStorage.getItem('kanchwala_cart') || '[]');
let civilIdFiles = [];

function saveCart() {
  localStorage.setItem('kanchwala_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function formatKWD(amount) {
  return 'KWD ' + amount.toFixed(3);
}

const colorClasses = [
  'product-card__image--gold-1',
  'product-card__image--gold-2',
  'product-card__image--gold-3',
  'product-card__image--gold-4',
  'product-card__image--gold-5',
];

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const emptyEl = document.getElementById('cartEmpty');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (footerEl) footerEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    updateCartCount();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  let html = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    const bgClass = item.colorClass || colorClasses[index % colorClasses.length];

    html += `
      <div class="cart-item">
        <div class="cart-item__image ${bgClass}"></div>
        <div class="cart-item__details">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__meta">${item.weight} &bull; ${item.karat} &bull; Size ${item.size} &bull; Qty: ${item.qty}</div>
          <div class="cart-item__pricing">
            Gold Value: ${formatKWD(item.goldValue * item.qty)}<br>
            Making Charge: ${formatKWD(item.makingCharge * item.qty)}<br>
            ${item.stoneCharge > 0 ? 'Stone Setting: ' + formatKWD(item.stoneCharge * item.qty) + '<br>' : ''}
            <strong>${formatKWD(itemTotal)}</strong>
          </div>
          <button class="cart-item__remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  itemsEl.innerHTML = html;

  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = formatKWD(subtotal);
  if (totalEl) totalEl.textContent = formatKWD(subtotal);

  updateCartCount();
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id && item.size === product.size);

  if (existing) {
    existing.qty += product.qty;
    if (existing.qty > 5) existing.qty = 5;
  } else {
    cart.push({ ...product });
  }

  saveCart();
  renderCart();
  openCart();
  animateCartButton();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function animateCartButton() {
  const btn = document.querySelector('.header__cart-btn');
  if (!btn) return;
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => { btn.style.transform = 'scale(1)'; }, 300);
}

function handleCivilIdUpload(input) {
  const files = Array.from(input.files);
  if (files.length === 0) return;

  civilIdFiles = files;
  const placeholder = document.getElementById('civilIdPlaceholder');
  const preview = document.getElementById('civilIdPreview');
  const upload = document.getElementById('civilIdUpload');

  if (upload) upload.classList.remove('error');

  if (placeholder) placeholder.style.display = 'none';
  if (preview) {
    preview.style.display = 'flex';
    preview.innerHTML = '';

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    const changeText = document.createElement('span');
    changeText.className = 'upload-change';
    changeText.textContent = 'Change';
    preview.appendChild(changeText);
  }
}

function validateCivilId() {
  const name = document.getElementById('civilIdName');
  const number = document.getElementById('civilIdNumber');
  const phone = document.getElementById('civilIdPhone');
  const upload = document.getElementById('civilIdUpload');
  const consent = document.getElementById('civilIdConsent');
  const consentCustom = consent?.nextElementSibling;

  let valid = true;

  [name, number, phone].forEach(input => {
    if (input) input.classList.remove('error');
  });
  if (upload) upload.classList.remove('error');
  if (consentCustom) consentCustom.classList.remove('error');

  if (!name || !name.value.trim()) {
    if (name) name.classList.add('error');
    valid = false;
  }

  if (!number || !number.value.trim() || number.value.trim().length < 10) {
    if (number) number.classList.add('error');
    valid = false;
  }

  if (!phone || !phone.value.trim() || phone.value.trim().length < 8) {
    if (phone) phone.classList.add('error');
    valid = false;
  }

  if (civilIdFiles.length === 0) {
    if (upload) upload.classList.add('error');
    valid = false;
  }

  if (!consent || !consent.checked) {
    if (consentCustom) consentCustom.classList.add('error');
    valid = false;
  }

  return valid;
}

function handleCheckout() {
  if (cart.length === 0) return;

  if (!validateCivilId()) {
    const section = document.querySelector('.civil-id-section');
    if (section) {
      section.style.borderColor = '#c0392b';
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { section.style.borderColor = ''; }, 3000);
    }
    return;
  }

  const civilData = {
    name: document.getElementById('civilIdName').value.trim(),
    number: document.getElementById('civilIdNumber').value.trim(),
    phone: document.getElementById('civilIdPhone').value.trim(),
    imagesCount: civilIdFiles.length,
    consentGiven: true
  };

  /*
    Shopify Implementation:

    1. Text fields → cart attributes via /cart/update.js:
    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attributes: {
          'Civil ID Name': civilData.name,
          'Civil ID Number': civilData.number,
          'Phone Number': civilData.phone,
          'Civil ID Consent': 'Yes'
        }
      })
    });

    2. Civil ID images → upload via Shopify file API or
       store as base64 in cart note, or use a third-party
       file upload service (e.g., Uploadcare, Cloudinary)
       and store the URL in cart attributes.

    3. Validate in checkout.liquid or via Shopify Scripts/Flow:
       Block checkout if attributes missing.

    4. Then redirect: window.location.href = '/checkout';
  */

  const btn = document.getElementById('checkoutBtn');
  if (btn) {
    btn.textContent = 'Redirecting to Checkout...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    alert(
      'Demo: Checkout would proceed with:\n\n' +
      'Civil ID Name: ' + civilData.name + '\n' +
      'Civil ID Number: ' + civilData.number + '\n' +
      'Phone: ' + civilData.phone + '\n' +
      'Civil ID Images: ' + civilData.imagesCount + ' uploaded\n' +
      'Consent: Given\n\n' +
      'Cart Total: ' + formatKWD(cart.reduce((s, i) => s + i.price * i.qty, 0)) + '\n\n' +
      'In Shopify, this redirects to /checkout with cart attributes set.'
    );

    if (btn) {
      btn.textContent = 'Proceed to Checkout';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }, 800);
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('active');
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.remove('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});
