class CosmeticWebsite {
  constructor() {
    this.init()
  }

  init() {
    this.setupScrollEffects()
    this.setupNavigation()
    this.setupAnimations()
    this.setupCart()
  }

  // Scroll Effects
  setupScrollEffects() {
    const scrollTopBtn = document.querySelector('.scroll-top')

    window.addEventListener('scroll', () => {
      // Show/hide scroll to top button
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show')
      } else {
        scrollTopBtn.classList.remove('show')
      }

      // Navbar scroll effect
      const navbar = document.querySelector('.navbar')
      if (window.pageYOffset > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
      }
    })
  }

  // Navigation
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link')

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault()
          const targetId = link.getAttribute('href')
          const targetSection = document.querySelector(targetId)

          if (targetSection) {
            navLinks.forEach((l) => l.classList.remove('active'))
            link.classList.add('active')

            const offsetTop = targetSection.offsetTop - 80
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth',
            })
          }
        }
      })
    })

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.pageYOffset + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute('id')

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          navLinks.forEach((link) => {
            link.classList.remove('active')
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active')
            }
          })
        }
      })
    })
  }

  // Animations on scroll
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    // Animate cards
    const cards = document.querySelectorAll(
      '.feature-card, .product-card, .testimonial-card'
    )
    cards.forEach((card, index) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
      card.style.transition = `all 0.6s ease ${index * 0.1}s`
      observer.observe(card)
    })
  }

  // Cart functionality
  setupCart() {
    this.cartItems = []
    this.cartCount = 0

    const addToCartButtons = document.querySelectorAll('.btn-cart')
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        this.addToCart(e.target.closest('.product-card'))
      })
    })

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist')
    wishlistButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        this.toggleWishlist(e.currentTarget)
      })
    })
  }

  addToCart(productCard) {
    const productTitle = productCard.querySelector('.product-title').textContent
    const productPrice = productCard.querySelector('.product-price').textContent

    this.cartCount++
    this.updateCartUI()

    // Show notification
    this.showNotification('Đã thêm vào giỏ hàng!', 'success')
  }

  toggleWishlist(button) {
    const icon = button.querySelector('i')

    if (icon.classList.contains('far')) {
      icon.classList.remove('far')
      icon.classList.add('fas')
      button.style.background = '#ffe5e5'
      button.style.color = '#ff4444'
      this.showNotification('Đã thêm vào yêu thích!', 'success')
    } else {
      icon.classList.remove('fas')
      icon.classList.add('far')
      button.style.background = ''
      button.style.color = ''
      this.showNotification('Đã xóa khỏi yêu thích!', 'info')
    }
  }

  updateCartUI() {
    const cartButton = document.querySelector('.btn-primary-custom')
    if (cartButton && cartButton.innerHTML.includes('Giỏ hàng')) {
      cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Giỏ hàng (${this.cartCount})`
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div')
    notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                `
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
}

// ===== UTILITY FUNCTIONS =====
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value

  // Simulate API call
  setTimeout(() => {
    alert(`Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin đến ${email}`)
    e.target.reset()
  }, 500)
}

// ===== ANIMATION STYLES =====
const style = document.createElement('style')
style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `
document.head.appendChild(style)

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
  new CosmeticWebsite()
})
