/* ========================================
   KANCHWALA JEWELLERS — Cart System
   Arabic cart drawer, civil ID gate, checkout demo
   ======================================== */

let cart = JSON.parse(localStorage.getItem('kanchwala_cart') || '[]');
let civilIdFiles = [];

const uiCopy = {
  ar: {
    currencyPrefix: '',
    currencySuffix: ' د.ك',
    cartWeight: 'الوزن',
    cartGoldWeight: 'وزن الذهب',
    cartSize: 'المقاس',
    cartQty: 'العدد',
    cartTotalPrice: 'السعر الإجمالي',
    removeItem: 'شيلها',
    uploadChange: 'غيّر الصور',
    preparingOrder: 'دقيقة... قاعدين نجهز طلبك',
    checkoutButton: 'كمّل الطلب',
    alertIntro: 'نسخة تجريبية:',
    alertCivilName: 'اسم البطاقة المدنية',
    alertCivilNumber: 'رقم البطاقة المدنية',
    alertPhone: 'رقم الهاتف',
    alertImages: 'عدد الصور المرفوعة',
    alertConsent: 'الموافقة',
    alertYes: 'نعم',
    alertCartTotal: 'إجمالي السلة',
    alertCheckoutNote: 'بالمتجر الفعلي راح نوديك صفحة الدفع بعد ما نحفظ هالبيانات.',
    langButton: 'English',
    langAria: 'Switch to English'
  },
  en: {
    currencyPrefix: 'KWD ',
    currencySuffix: '',
    cartWeight: 'Weight',
    cartGoldWeight: 'Gold weight',
    cartSize: 'Size',
    cartQty: 'Qty',
    cartTotalPrice: 'Total price',
    removeItem: 'Remove',
    uploadChange: 'Change images',
    preparingOrder: 'One moment... preparing your order',
    checkoutButton: 'Complete order',
    alertIntro: 'Demo preview:',
    alertCivilName: 'Civil ID name',
    alertCivilNumber: 'Civil ID number',
    alertPhone: 'Phone',
    alertImages: 'Uploaded images',
    alertConsent: 'Consent',
    alertYes: 'Yes',
    alertCartTotal: 'Cart total',
    alertCheckoutNote: 'On the live store, this would continue to checkout after saving these details.',
    langButton: 'العربية',
    langAria: 'التبديل إلى العربية'
  }
};

function getCurrentLanguage() {
  return localStorage.getItem('kanchwala_lang') || 'ar';
}

function t(key) {
  const lang = getCurrentLanguage();
  return uiCopy[lang]?.[key] ?? uiCopy.ar[key] ?? key;
}

function localizedValue(value) {
  if (value && typeof value === 'object') {
    return value[getCurrentLanguage()] || value.ar || value.en || '';
  }
  return value || '';
}

function formatKWD(amount) {
  const value = amount.toFixed(3);
  return getCurrentLanguage() === 'en' ? `KWD ${value}` : `${value} د.ك`;
}

function applyLanguage() {
  const lang = getCurrentLanguage();
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'en' ? 'ltr' : 'rtl';

  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.hasAttribute('data-ar')) {
      el.setAttribute('data-ar', el.textContent);
    }
    el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
  });

  document.querySelectorAll('[data-en-html]').forEach(el => {
    if (!el.hasAttribute('data-ar-html')) {
      el.setAttribute('data-ar-html', el.innerHTML);
    }
    el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-ar-html');
  });

  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    if (!el.hasAttribute('data-ar-placeholder')) {
      el.setAttribute('data-ar-placeholder', el.getAttribute('placeholder') || '');
    }
    el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-ar-placeholder'));
  });

  document.querySelectorAll('[data-en-aria]').forEach(el => {
    if (!el.hasAttribute('data-ar-aria')) {
      el.setAttribute('data-ar-aria', el.getAttribute('aria-label') || '');
    }
    el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-aria') : el.getAttribute('data-ar-aria'));
  });

  document.querySelectorAll('[data-en-title]').forEach(el => {
    if (!el.hasAttribute('data-ar-title')) {
      el.setAttribute('data-ar-title', el.textContent);
    }
    el.textContent = lang === 'en' ? el.getAttribute('data-en-title') : el.getAttribute('data-ar-title');
  });

  document.querySelectorAll('[data-lang-toggle]').forEach(el => {
    el.textContent = t('langButton');
    el.setAttribute('aria-label', t('langAria'));
  });

  const uploadChange = document.querySelector('.upload-change');
  if (uploadChange) uploadChange.textContent = t('uploadChange');

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn && checkoutBtn.style.pointerEvents !== 'none') {
    checkoutBtn.textContent = t('checkoutButton');
  }
}

function toggleLanguage() {
  const next = getCurrentLanguage() === 'ar' ? 'en' : 'ar';
  localStorage.setItem('kanchwala_lang', next);
  applyLanguage();
  renderCart();
}

window.toggleLanguage = toggleLanguage;

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
    const itemName = item.names ? (item.names[getCurrentLanguage()] || item.names.ar || item.name) : item.name;
    const itemKarat = item.karatLabels ? (item.karatLabels[getCurrentLanguage()] || item.karat) : item.karat;
    const itemWeight = localizedValue(item.weight);
    const itemGoldWeight = localizedValue(item.goldWeight);
    const sizeText = item.size ? `&bull; ${t('cartSize')} ${item.size}` : '';
    const goldWeightText = itemGoldWeight ? `&bull; ${t('cartGoldWeight')} ${itemGoldWeight}` : '';

    html += `
      <div class="cart-item">
        <div class="cart-item__image ${bgClass}"></div>
        <div class="cart-item__details">
          <div class="cart-item__name">${itemName}</div>
          <div class="cart-item__meta">${t('cartWeight')} ${itemWeight} ${goldWeightText} &bull; ${itemKarat} ${sizeText} &bull; ${t('cartQty')}: ${item.qty}</div>
          <div class="cart-item__pricing">
            <strong>${t('cartTotalPrice')}: ${formatKWD(itemTotal)}</strong>
          </div>
          <button class="cart-item__remove" onclick="removeFromCart(${index})">${t('removeItem')}</button>
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
    changeText.textContent = t('uploadChange');
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
    const section = document.getElementById('civilIdSection');
    if (section) {
      if (!section.classList.contains('open')) section.classList.add('open');
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

  const btn = document.getElementById('checkoutBtn');
  if (btn) {
    btn.textContent = t('preparingOrder');
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    alert(
      `${t('alertIntro')}\n\n` +
      `${t('alertCivilName')}: ${civilData.name}\n` +
      `${t('alertCivilNumber')}: ${civilData.number}\n` +
      `${t('alertPhone')}: ${civilData.phone}\n` +
      `${t('alertImages')}: ${civilData.imagesCount}\n` +
      `${t('alertConsent')}: ${t('alertYes')}\n\n` +
      `${t('alertCartTotal')}: ${formatKWD(cart.reduce((sum, item) => sum + item.price * item.qty, 0))}\n\n` +
      t('alertCheckoutNote')
    );

    if (btn) {
      btn.textContent = t('checkoutButton');
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }, 800);
}

function toggleCivilId() {
  const section = document.getElementById('civilIdSection');
  if (section) section.classList.toggle('open');
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
  applyLanguage();
  renderCart();
  updateCartCount();
});
