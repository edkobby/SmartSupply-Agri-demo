// Wishlist Page JavaScript - SmartSupply Agri

// Global state
const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
let wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeWishlistPage()
  updateCartCount()
  updateWishlistCount()
})

function initializeWishlistPage() {
  renderWishlistItems()
  initializeEventListeners()
}

function initializeEventListeners() {
  // Share wishlist button
  document.getElementById("share-wishlist").addEventListener("click", () => {
    if (wishlist.length > 0) {
      document.getElementById("share-modal").classList.remove("hidden")
    } else {
      showToast("Add items to your wishlist first!", "info")
    }
  })

  // Clear wishlist button
  document.getElementById("clear-wishlist").addEventListener("click", () => {
    if (wishlist.length > 0) {
      if (confirm("Are you sure you want to clear your entire wishlist?")) {
        clearWishlist()
      }
    } else {
      showToast("Your wishlist is already empty!", "info")
    }
  })

  // Share modal events
  document.getElementById("close-share-modal").addEventListener("click", () => {
    document.getElementById("share-modal").classList.add("hidden")
  })

  document.getElementById("copy-link").addEventListener("click", () => {
    const linkInput = document.getElementById("wishlist-link")
    linkInput.select()
    document.execCommand("copy")
    showToast("Wishlist link copied to clipboard!", "success")
  })

  // Close modal when clicking outside
  document.getElementById("share-modal").addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.add("hidden")
    }
  })
}

function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById("wishlist-page-container")
  const emptyWishlistMessage = document.getElementById("empty-wishlist")

  if (!wishlistItemsContainer) {
    console.error("Wishlist items container not found")
    return
  }

  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-heart text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
                <p class="text-gray-600">Save items you love to your wishlist and shop them later.</p>
                <button onclick="navigateToPage('marketplace')" class="bg-agri-deep text-white px-6 py-3 rounded-lg hover:bg-agri-light transition-colors mt-4">
                    Start Shopping
                </button>
            </div>
        `
    return
  }

  const wishlistItemsHTML = wishlist
    .map(
      (item) => `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-item-id="${item.id}">
            <div class="relative">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     class="w-full h-48 object-cover cursor-pointer"
                     onclick="navigateToProductPage('${item.id}')">
                <div class="absolute top-4 left-4 flex gap-2">
                    ${
                      item.badges
                        ? item.badges
                            .map(
                              (badge) => `
                        <span class="bg-${badge === "Organic" ? "green-500" : "agri-orange"} text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ${badge}
                        </span>
                    `,
                            )
                            .join("")
                        : ""
                    }
                </div>

                <!-- Remove from Wishlist Button -->
                <button onclick="removeFromWishlist('${item.id}')" class="remove-wishlist absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                    <i class="fas fa-heart text-red-500"></i>
                </button>
            </div>

            <div class="p-6">
                <!-- Rating -->
                <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400 text-sm mr-2">
                        ${generateStars(item.rating || 4.5)}
                    </div>
                    <span class="text-sm text-gray-500">${item.rating || 4.5}</span>
                </div>

                <!-- Product Name -->
                <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${item.name}</h3>
                
                <!-- Farmer Info -->
                <p class="text-sm text-gray-600 mb-3">${item.farmer}</p>

                <!-- Price -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg font-bold text-agri-deep">$${item.price.toFixed(2)}</span>
                        <span class="text-sm text-gray-500">/kg</span>
                        ${
                          item.originalPrice
                            ? `<span class="text-sm text-gray-500 line-through ml-2">$${item.originalPrice.toFixed(2)}</span>`
                            : ""
                        }
                    </div>
                    <span class="text-sm ${item.inStock > 0 ? "text-green-600" : "text-red-600"} font-medium">
                        ${item.inStock > 0 ? `${item.inStock} in stock` : "Out of stock"}
                    </span>
                </div>

                <!-- Add to Cart Button -->
                <button onclick="addToCartFromWishlist('${item.id}')" 
                        class="add-to-cart w-full bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors ${
                          item.inStock === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }"
                        ${item.inStock === 0 ? "disabled" : ""}>
                    <i class="fas fa-shopping-cart mr-2"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  wishlistItemsContainer.innerHTML = `
        <div class="container mx-auto px-4">
            <h1 class="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${wishlistItemsHTML}
            </div>
        </div>
    `
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHtml = ""

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>'
  }

  return starsHtml
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

function animateCartIcon() {
  const cartIcon = document.querySelector(".fa-shopping-cart").parentElement
  cartIcon.classList.add("animate-bounce")

  setTimeout(() => {
    cartIcon.classList.remove("animate-bounce")
  }, 1000)
}

function addToCartFromWishlist(itemId) {
  const item = wishlist.find((item) => item.id === itemId)
  if (item) {
    // Check if product already exists in cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        farmer: item.farmer,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("smartsupply-cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Show toast notification
    showToast(`${item.name} added to cart!`, "success")

    // Add animation to cart icon
    animateCartIcon()
  }
}

function removeFromWishlist(itemId) {
  const itemIndex = wishlist.findIndex((item) => item.id === itemId)
  if (itemIndex > -1) {
    const removedItem = wishlist[itemIndex]
    wishlist.splice(itemIndex, 1)

    // Save to localStorage
    localStorage.setItem("smartsupply-wishlist", JSON.stringify(wishlist))

    // Re-render wishlist
    renderWishlistItems()
    updateWishlistCount()

    showToast(`${removedItem.name} removed from wishlist`, "info")
  }
}

function clearWishlist() {
  wishlist = []
  localStorage.setItem("smartsupply-wishlist", JSON.stringify(wishlist))

  renderWishlistItems()
  updateWishlistCount()

  showToast("Wishlist cleared!", "info")
}

// Export functions for use in other pages
window.SmartSupplyWishlist = {
  getWishlist: () => wishlist,
  removeFromWishlist: removeFromWishlist,
  addToCartFromWishlist: addToCartFromWishlist,
  updateWishlistCount: updateWishlistCount,
  showToast: showToast,
}

// Additional functions for navigation
function navigateToPage(page) {
  window.location.href = `/${page}.html`
}

function navigateToProductPage(productId) {
  window.location.href = `/product.html?id=${productId}`
}
