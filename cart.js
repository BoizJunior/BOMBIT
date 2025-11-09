// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || []

// Update cart count in header
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElements = document.querySelectorAll('#cart-count')
  cartCountElements.forEach((el) => {
    el.textContent = totalItems
  })
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartCount()
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount()

  // Phone number validation for contact forms
  const phoneInputs = document.querySelectorAll('input[type="tel"]')
  phoneInputs.forEach((input) => {
    input.addEventListener('input', function (e) {
      // Remove all non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '')
    })

    input.addEventListener('keypress', function (e) {
      // Only allow numeric keys
      const charCode = e.which ? e.which : e.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault()
        return false
      }
      return true
    })

    input.addEventListener('paste', function (e) {
      // Handle paste event
      e.preventDefault()
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        'text'
      )
      const numericOnly = pastedText.replace(/[^0-9]/g, '')
      this.value = numericOnly
    })
  })

  // Contact form validation
  const contactForms = document.querySelectorAll('.contact-form')
  contactForms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault()

      const phoneInput = this.querySelector('input[type="tel"]')
      const phoneValue = phoneInput ? phoneInput.value : ''

      // Validate phone number
      if (phoneValue && phoneValue.length < 10) {
        showNotification('Số điện thoại phải có ít nhất 10 chữ số!', 'warning')
        phoneInput.focus()
        return false
      }

      if (phoneValue && !/^[0-9]{10,11}$/.test(phoneValue)) {
        showNotification(
          'Số điện thoại không hợp lệ! Vui lòng chỉ nhập số.',
          'warning'
        )
        phoneInput.focus()
        return false
      }

      // If validation passes
      showNotification(
        'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
        'success'
      )
      this.reset()
    })
  })

  // Product listing page
  const addToCartButtons = document.querySelectorAll('.btn-add-to-cart')
  addToCartButtons.forEach((button) => {
    // Skip if button doesn't have data-id (like "Xem chi tiết" buttons)
    if (!button.dataset.id) return

    const productId = button.dataset.id
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      button.disabled = true
      button.innerHTML = '<i class="fas fa-check"></i> Đã thêm'
      button.classList.add('disabled')
    }

    button.addEventListener('click', function (e) {
      e.preventDefault()

      const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseInt(this.dataset.price),
        image: this.dataset.image,
        quantity: 1,
      }

      const existingItem = cart.find((item) => item.id === product.id)

      if (!existingItem) {
        cart.push(product)
        saveCart()

        this.disabled = true
        this.innerHTML = '<i class="fas fa-check"></i> Đã thêm'
        this.classList.add('disabled')

        showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success')
      }
    })
  })

  // Shopping cart page
  if (document.getElementById('cart-items-container')) {
    renderCart()
  }
})

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div')
  notification.className = `cart-notification ${type}`

  let icon = 'fa-check-circle'
  if (type === 'warning') icon = 'fa-exclamation-triangle'
  if (type === 'info') icon = 'fa-info-circle'
  if (type === 'error') icon = 'fa-times-circle'

  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add('show')
  }, 100)

  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Render cart items
function renderCart() {
  const container = document.getElementById('cart-items-container')
  const emptyMessage = document.getElementById('empty-cart-message')
  const totalItemsEl = document.getElementById('total-items')
  const totalItemsSummaryEl = document.getElementById('total-items-summary')
  const totalPriceEl = document.getElementById('total-price')

  if (cart.length === 0) {
    container.style.display = 'none'
    emptyMessage.style.display = 'block'
    totalItemsEl.textContent = '0'
    if (totalItemsSummaryEl) totalItemsSummaryEl.textContent = '0'
    totalPriceEl.textContent = '0đ'
    return
  }

  container.style.display = 'block'
  emptyMessage.style.display = 'none'

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  totalItemsEl.textContent = totalItems
  if (totalItemsSummaryEl) totalItemsSummaryEl.textContent = totalItems
  totalPriceEl.textContent = formatPrice(totalPrice)

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="quantity-control">
          <button class="btn-quantity" onclick="decreaseQuantity('${item.id}')">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="btn-quantity" onclick="increaseQuantity('${item.id}')">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div class="cart-item-total">
        <p class="cart-item-total-price">${formatPrice(
          item.price * item.quantity
        )}</p>
        <button class="btn-delete" onclick="removeItem('${item.id}')">
          <i class="fas fa-trash"></i> Xóa
        </button>
      </div>
    </div>
  `
    )
    .join('')
}

// Increase quantity
function increaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity++
    saveCart()
    renderCart()
    showNotification('Đã tăng số lượng sản phẩm', 'success')
  }
}

// Decrease quantity
function decreaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId)
  if (item && item.quantity > 1) {
    item.quantity--
    saveCart()
    renderCart()
    showNotification('Đã giảm số lượng sản phẩm', 'success')
  } else if (item && item.quantity === 1) {
    showNotification(
      'Số lượng tối thiểu là 1. Vui lòng xóa sản phẩm nếu không muốn mua.',
      'warning'
    )
  }
}

// Remove item
function removeItem(productId) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    cart = cart.filter((item) => item.id !== productId)
    saveCart()
    renderCart()
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success')
  }
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    showNotification(
      'Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.',
      'warning'
    )
    return
  }
  showNotification(
    'Coming Soon - Tính năng thanh toán đang được phát triển!',
    'info'
  )
}
