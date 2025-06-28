// Checkout Page Functionality

// Declare necessary variables
let showToast
let navigateToPage
let setLoadingState
let updateCartAndWishlistCounts

// Initialize checkout page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("checkout") || document.getElementById("checkout-items")) {
    initializeCheckout()
  }
})

function initializeCheckout() {
  console.log("🛒 Initializing checkout page...")

  // Load cart items
  loadCheckoutItems()

  // Initialize payment method handlers
  initializePaymentMethods()

  // Initialize delivery option handlers
  initializeDeliveryOptions()

  // Initialize form validation
  initializeFormValidation()

  console.log("✅ Checkout page initialized")
}

function loadCheckoutItems() {
  const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
  const checkoutItemsContainer = document.getElementById("checkout-items")

  if (!checkoutItemsContainer) return

  if (cart.length === 0) {
    // Redirect to cart if empty
    window.showToast("Your cart is empty. Please add items before checkout.", "error")
    setTimeout(() => {
      window.navigateToPage("cart")
    }, 2000)
    return
  }

  // Render cart items
  checkoutItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
            <img src="${item.image}" 
                 alt="${item.name}" 
                 class="w-12 h-12 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
                <p class="text-xs text-gray-600">${item.farmer}</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Qty: ${item.quantity}</span>
                    <span>•</span>
                    <span>$${item.price}/kg</span>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `,
    )
    .join("")

  // Update totals
  updateCheckoutTotals()
}

function updateCheckoutTotals() {
  const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Get selected delivery option
  const selectedDelivery = document.querySelector('input[name="delivery"]:checked')
  let deliveryFee = 5.99 // Default standard delivery

  if (selectedDelivery) {
    switch (selectedDelivery.value) {
      case "standard":
        deliveryFee = 5.99
        break
      case "express":
        deliveryFee = 12.99
        break
      case "same-day":
        deliveryFee = 19.99
        break
    }
  }

  // Free shipping for orders over $50
  if (subtotal >= 50) {
    deliveryFee = 0
  }

  // Get discount
  const discount = Number.parseFloat(localStorage.getItem("checkout-discount") || "0")

  const total = subtotal + deliveryFee - discount

  // Update display
  const subtotalEl = document.getElementById("checkout-subtotal")
  const deliveryEl = document.getElementById("checkout-delivery")
  const discountEl = document.getElementById("checkout-discount")
  const totalEl = document.getElementById("checkout-total")
  const discountRow = document.getElementById("discount-row")

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`

  // Show/hide discount row
  if (discountRow) {
    discountRow.style.display = discount > 0 ? "flex" : "none"
  }
}

function initializePaymentMethods() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]')
  const paymentDetails = document.getElementById("payment-details")

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "card" && radio.checked) {
        paymentDetails?.classList.remove("hidden")
      } else {
        paymentDetails?.classList.add("hidden")
      }
    })
  })
}

function initializeDeliveryOptions() {
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]')

  deliveryRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateCheckoutTotals()
    })
  })
}

function initializeFormValidation() {
  // Add real-time validation for required fields
  const requiredFields = document.querySelectorAll("input[required], select[required]")

  requiredFields.forEach((field) => {
    field.addEventListener("blur", validateField)
    field.addEventListener("input", clearFieldError)
  })
}

function validateField(event) {
  const field = event.target
  const value = field.value.trim()

  // Remove existing error styling
  field.classList.remove("border-red-500")

  // Check if field is empty
  if (!value) {
    field.classList.add("border-red-500")
    return false
  }

  // Email validation
  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      field.classList.add("border-red-500")
      return false
    }
  }

  // Phone validation
  if (field.type === "tel") {
    const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
    if (!phoneRegex.test(value)) {
      field.classList.add("border-red-500")
      return false
    }
  }

  return true
}

function clearFieldError(event) {
  const field = event.target
  field.classList.remove("border-red-500")
}

function applyPromoCode() {
  const promoCodeInput = document.getElementById("promoCode")
  const promoCode = promoCodeInput?.value.trim().toUpperCase()

  if (!promoCode) {
    window.showToast("Please enter a promo code", "error")
    return
  }

  // Mock promo codes
  const validPromoCodes = {
    WELCOME10: 10, // $10 off
    FRESH20: 20, // $20 off
    NEWUSER15: 15, // $15 off
    SAVE5: 5, // $5 off
  }

  if (validPromoCodes[promoCode]) {
    const discount = validPromoCodes[promoCode]
    localStorage.setItem("checkout-discount", discount.toString())
    updateCheckoutTotals()
    window.showToast(`Promo code applied! You saved $${discount}`, "success")

    // Disable the input and button
    if (promoCodeInput) {
      promoCodeInput.disabled = true
      promoCodeInput.classList.add("bg-gray-100")
    }
    const applyButton = promoCodeInput?.nextElementSibling
    if (applyButton) {
      applyButton.disabled = true
      applyButton.textContent = "Applied"
      applyButton.classList.add("bg-green-500", "text-white")
      applyButton.classList.remove("bg-gray-200", "text-gray-700")
    }
  } else {
    window.showToast("Invalid promo code", "error")
    promoCodeInput?.focus()
  }
}

function validateCheckoutForm() {
  const requiredFields = document.querySelectorAll("input[required], select[required]")
  let isValid = true
  let firstInvalidField = null

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
      if (!firstInvalidField) {
        firstInvalidField = field
      }
    }
  })

  // Scroll to first invalid field
  if (firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" })
    firstInvalidField.focus()
  }

  return isValid
}

function placeOrder() {
  console.log("🛒 Placing order...")

  // Validate form
  if (!validateCheckoutForm()) {
    window.showToast("Please fill in all required fields correctly", "error")
    return
  }

  // Check if cart is not empty
  const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
  if (cart.length === 0) {
    window.showToast("Your cart is empty", "error")
    return
  }

  // Show loading
  window.setLoadingState(true)

  // Simulate order processing
  setTimeout(() => {
    try {
      // Generate order ID
      const orderId = "SA" + Date.now().toString().slice(-8)

      // Get form data
      const orderData = {
        orderId: orderId,
        items: cart,
        customer: {
          firstName: document.getElementById("firstName")?.value,
          lastName: document.getElementById("lastName")?.value,
          email: document.getElementById("email")?.value,
          phone: document.getElementById("phone")?.value,
        },
        shipping: {
          address: document.getElementById("address")?.value,
          city: document.getElementById("city")?.value,
          region: document.getElementById("region")?.value,
          postalCode: document.getElementById("postalCode")?.value,
          country: document.getElementById("country")?.value,
        },
        delivery: document.querySelector('input[name="delivery"]:checked')?.value,
        payment: document.querySelector('input[name="payment"]:checked')?.value,
        notes: document.getElementById("orderNotes")?.value,
        subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        discount: Number.parseFloat(localStorage.getItem("checkout-discount") || "0"),
        total: Number.parseFloat(document.getElementById("checkout-total")?.textContent.replace("$", "") || "0"),
        timestamp: new Date().toISOString(),
      }

      // Save order to localStorage (in real app, this would be sent to server)
      const orders = JSON.parse(localStorage.getItem("smartsupply-orders") || "[]")
      orders.push(orderData)
      localStorage.setItem("smartsupply-orders", JSON.stringify(orders))

      // Clear cart and discount
      localStorage.removeItem("smartsupply-cart")
      localStorage.removeItem("checkout-discount")

      // Update cart count
      window.updateCartAndWishlistCounts()

      window.setLoadingState(false)

      // Show success message
      window.showToast(`Order placed successfully! Order ID: ${orderId}`, "success")

      // Redirect to order confirmation or home
      setTimeout(() => {
        // In a real app, you'd redirect to an order confirmation page
        window.navigateToPage("home")

        // Show order confirmation modal
        showOrderConfirmation(orderData)
      }, 2000)
    } catch (error) {
      console.error("Error placing order:", error)
      window.setLoadingState(false)
      window.showToast("Failed to place order. Please try again.", "error")
    }
  }, 2000)
}

function showOrderConfirmation(orderData) {
  // Create and show order confirmation modal
  const modal = document.createElement("div")
  modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-check text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
            <p class="text-gray-600 mb-6">
                Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="text-sm text-gray-600 mb-1">Order ID</div>
                <div class="font-bold text-agri-deep">${orderData.orderId}</div>
            </div>
            <div class="space-y-2 text-sm text-gray-600 mb-6">
                <div class="flex justify-between">
                    <span>Total Amount:</span>
                    <span class="font-bold">$${orderData.total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span>Payment Method:</span>
                    <span class="capitalize">${orderData.payment.replace("-", " ")}</span>
                </div>
                <div class="flex justify-between">
                    <span>Delivery:</span>
                    <span class="capitalize">${orderData.delivery.replace("-", " ")}</span>
                </div>
            </div>
            <button onclick="window.closeOrderConfirmation()" 
                    class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                Continue Shopping
            </button>
        </div>
    `

  document.body.appendChild(modal)

  // Auto-close after 10 seconds
  setTimeout(() => {
    window.closeOrderConfirmation()
  }, 10000)
}

function closeOrderConfirmation() {
  const modal = document.querySelector(".fixed.inset-0.bg-black.bg-opacity-50")
  if (modal) {
    document.body.removeChild(modal)
  }
}

// Navigation function for checkout page
function navigateToCheckout() {
  const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []

  if (cart.length === 0) {
    window.showToast("Your cart is empty. Please add items before checkout.", "error")
    return
  }

  // In a real app, this would navigate to checkout.html
  // For this demo, we'll load the checkout content
  window.location.href = "checkout.html"
}

// Export functions for use in other scripts
if (typeof window !== "undefined") {
  window.navigateToCheckout = navigateToCheckout
  window.applyPromoCode = applyPromoCode
  window.placeOrder = placeOrder
  window.closeOrderConfirmation = closeOrderConfirmation
}

// Declare functions for use in the code
window.showToast = (message, type) => {
  console.log(`Toast: ${message} (${type})`)
}

window.navigateToPage = (page) => {
  console.log(`Navigating to ${page}`)
}

window.setLoadingState = (state) => {
  console.log(`Loading state set to ${state}`)
}

window.updateCartAndWishlistCounts = () => {
  console.log("Updating cart and wishlist counts")
}
