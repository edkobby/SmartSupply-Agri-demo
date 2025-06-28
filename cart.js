// Cart Page JavaScript - SmartSupply Agri

// Global state
const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
const wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []

// Function declaration for navigateToPage
function navigateToPage(page) {
  window.location.href = `/${page}.html`
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeCartPage()
  updateCartCount()
  updateWishlistCount()
})

function initializeCartPage() {
  renderCartItems()
  updateOrderSummary()
  initializeEventListeners()
}

function initializeEventListeners() {
  // Continue shopping button
  document.getElementById("continue-shopping").addEventListener("click", () => {
    navigateToPage("marketplace")
  })

  // Promo code application
  document.getElementById("apply-promo").addEventListener("click", applyPromoCode)

  // Checkout button
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length > 0) {
      showToast("Redirecting to checkout...", "info")
      // In a real app, this would redirect to checkout page
      setTimeout(() => {
        alert("Checkout functionality would be implemented here")
      }, 1000)
    }
  })
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-page-container")
  const emptyCartMessage = document.getElementById("empty-cart")
  const orderSummary = document.getElementById("order-summary")

  if (!cartItemsContainer) {
    console.error("Cart items container not found")
    return
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                <p class="text-gray-600">Add some fresh produce to your cart and come back!</p>
                <button onclick="navigateToPage('marketplace')" class="bg-agri-deep text-white px-6 py-3 rounded-lg hover:bg-agri-light transition-colors mt-4">
                    Start Shopping
                </button>
            </div>
        `
    return
  }

  const cartItemsHTML = cart
    .map(
      (item) => `
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-4" data-item-id="${item.id}">
            <div class="flex items-center space-x-6">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg">
                </div>

                <!-- Product Details -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800 mb-1">${item.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">${item.farmer}</p>
                    <div class="flex items-center space-x-4">
                        <span class="text-xl font-bold text-agri-deep">$${item.price.toFixed(2)}</span>
                        <span class="text-sm text-gray-500">per kg</span>
                    </div>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-3">
                    <button onclick="updateQuantity('${item.id}', -1)" class="qty-minus w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors" data-item-id="${item.id}">
                        <i class="fas fa-minus text-sm"></i>
                    </button>
                    <span class="w-12 text-center font-semibold">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="qty-plus w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors" data-item-id="${item.id}">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>

                <!-- Item Total -->
                <div class="text-right">
                    <div class="text-lg font-bold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>

                <!-- Remove Button -->
                <button onclick="removeFromCart('${item.id}')" class="remove-item text-red-500 hover:text-red-700 transition-colors" data-item-id="${item.id}">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  cartItemsContainer.innerHTML = cartItemsHTML
}

function updateQuantity(itemId, change) {
  const item = cart.find((item) => item.id === itemId)
  if (item) {
    item.quantity += change

    if (item.quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    // Save to localStorage
    localStorage.setItem("smartsupply-cart", JSON.stringify(cart))

    // Re-render cart
    renderCartItems()
    updateOrderSummary()
    updateCartCount()

    showToast("Cart updated!", "success")
  }
}

function removeFromCart(itemId) {
  const itemIndex = cart.findIndex((item) => item.id === itemId)
  if (itemIndex > -1) {
    const removedItem = cart[itemIndex]
    cart.splice(itemIndex, 1)

    // Save to localStorage
    localStorage.setItem("smartsupply-cart", JSON.stringify(cart))

    // Re-render cart
    renderCartItems()
    updateOrderSummary()
    updateCartCount()

    showToast(`${removedItem.name} removed from cart`, "info")
  }
}

function updateOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + tax + shipping

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`
  document.getElementById("shipping").textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`
  document.getElementById("total").textContent = `$${total.toFixed(2)}`

  // Enable/disable checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (cart.length > 0) {
    checkoutBtn.disabled = false
    checkoutBtn.classList.remove("disabled:bg-gray-300", "disabled:cursor-not-allowed")
  } else {
    checkoutBtn.disabled = true
    checkoutBtn.classList.add("disabled:bg-gray-300", "disabled:cursor-not-allowed")
  }
}

function applyPromoCode() {
  const promoCode = document.getElementById("promo-code").value.trim().toUpperCase()

  // Mock promo codes
  const promoCodes = {
    SAVE10: { discount: 0.1, type: "percentage" },
    FRESH20: { discount: 0.2, type: "percentage" },
    NEWUSER: { discount: 5.0, type: "fixed" },
  }

  if (promoCodes[promoCode]) {
    showToast(`Promo code "${promoCode}" applied!`, "success")
    // In a real app, you would apply the discount to the order summary
  } else if (promoCode) {
    showToast("Invalid promo code", "error")
  } else {
    showToast("Please enter a promo code", "error")
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlist-count")
  wishlistCount.textContent = wishlist.length
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  // Update message
  toastMessage.textContent = message

  // Update toast color based on type
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  } text-white`

  // Show toast
  toast.classList.remove("translate-x-full")

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.add("translate-x-full")
  }, 3000)
}

// Export functions for use in other pages
window.SmartSupplyCart = {
  getCart: () => cart,
  updateQuantity: updateQuantity,
  removeFromCart: removeFromCart,
  updateCartCount: updateCartCount,
  showToast: showToast,
}
