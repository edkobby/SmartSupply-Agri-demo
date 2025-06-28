// Product Page JavaScript - SmartSupply Agri

// Global state
const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
const wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []

// Get product data from localStorage or use default
const selectedProductId = localStorage.getItem("selectedProductId") || "tom001"

// Product data
const productData = {
  id: "tom001",
  name: "Tomato",
  image: "https://example.com/tomato.jpg",
  badges: ["Organic", "Fresh"],
  rating: 4.5,
  reviews: 120,
  inStock: 50,
  price: 2.5,
  originalPrice: 3.0,
  farmer: "John Doe",
  category: "Vegetables",
}

// Function to get product data
function getProductData(productId) {
  // This function should fetch product data from a source
  // For now, it returns a static object
  return productData
}

// Function to add to cart
function addToCart(product, quantity) {
  // This function should add the product to the cart
  // For now, it calls addToCartFromProduct
  addToCartFromProduct(product.id, quantity)
}

// Function to navigate to product page
function navigateToProductPage(productId) {
  // This function should handle navigation to the product page
  // For now, it sets the selectedProductId in localStorage and reloads the page
  localStorage.setItem("selectedProductId", productId)
  window.location.reload()
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeProductPage()
  updateCartCount()
  updateWishlistCount()
})

function initializeProductPage() {
  // Render product details
  renderProductDetails()

  // Initialize image gallery
  initializeImageGallery()

  // Initialize quantity controls
  initializeQuantityControls()

  // Initialize add to cart functionality
  initializeAddToCart()

  // Initialize wishlist functionality
  initializeWishlist()

  // Initialize product tabs
  initializeProductTabs()

  // Check if product is in wishlist
  updateWishlistButton()
}

function renderProductDetails() {
  const productContainer = document.getElementById("product-page-container")

  if (!productContainer) {
    console.error("Product container not found")
    return
  }

  productContainer.innerHTML = `
        <!-- Breadcrumb -->
        <div class="bg-gray-100 py-4">
            <div class="container mx-auto px-4">
                <nav class="text-sm">
                    <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                    <span class="mx-2 text-gray-400">></span>
                    <a href="#" onclick="navigateToPage('marketplace')" class="text-gray-600 hover:text-agri-deep">Marketplace</a>
                    <span class="mx-2 text-gray-400">></span>
                    <span class="text-agri-deep font-medium">${productData.name}</span>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <main class="py-8">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Product Images -->
                    <div class="space-y-4">
                        <div class="relative overflow-hidden rounded-2xl">
                            <img src="${productData.image}" 
                                 alt="${productData.name}" 
                                 class="w-full h-96 object-cover" id="main-image">
                            <div class="absolute top-4 left-4 flex gap-2">
                                ${productData.badges
                                  .map(
                                    (badge) => `
                                    <span class="bg-agri-orange text-white px-3 py-1 rounded-full text-sm font-semibold">${badge}</span>
                                `,
                                  )
                                  .join("")}
                            </div>
                            <button class="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                                    id="wishlist-btn">
                                <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                            </button>
                        </div>
                        
                        <!-- Thumbnail Images -->
                        <div class="grid grid-cols-4 gap-2">
                            <img src="${productData.image}" 
                                 alt="${productData.name}" 
                                 class="w-full h-20 object-cover rounded-lg border-2 border-agri-orange cursor-pointer thumbnail-img active">
                            <img src="${productData.image}" 
                                 alt="${productData.name}" 
                                 class="w-full h-20 object-cover rounded-lg border border-gray-300 cursor-pointer thumbnail-img">
                            <img src="${productData.image}" 
                                 alt="${productData.name}" 
                                 class="w-full h-20 object-cover rounded-lg border border-gray-300 cursor-pointer thumbnail-img">
                            <img src="${productData.image}" 
                                 alt="${productData.name}" 
                                 class="w-full h-20 object-cover rounded-lg border border-gray-300 cursor-pointer thumbnail-img">
                        </div>
                    </div>

                    <!-- Product Details -->
                    <div class="space-y-6">
                        <!-- Product Title and Rating -->
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800 mb-4">${productData.name}</h1>
                            <div class="flex items-center space-x-4 mb-4">
                                <div class="flex items-center">
                                    <div class="flex text-yellow-400 text-sm mr-2">
                                        ${generateStars(productData.rating)}
                                    </div>
                                    <span class="text-sm text-gray-600">${productData.rating} (${productData.reviews} reviews)</span>
                                </div>
                                <span class="text-sm text-gray-600">•</span>
                                <span class="text-sm text-green-600 font-medium">${productData.inStock} in stock</span>
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="border-b border-gray-200 pb-6">
                            <div class="flex items-center space-x-4">
                                <span class="text-4xl font-bold text-agri-deep">$${productData.price}</span>
                                <span class="text-lg text-gray-500">/kg</span>
                                ${
                                  productData.originalPrice
                                    ? `<span class="text-xl text-gray-500 line-through">$${productData.originalPrice}</span>`
                                    : ""
                                }
                                ${
                                  productData.originalPrice
                                    ? `<span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                                    ${Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                                </span>`
                                    : ""
                                }
                            </div>
                        </div>

                        <!-- Farmer Info -->
                        <div class="bg-gray-50 rounded-xl p-6">
                            <h3 class="font-semibold text-gray-800 mb-3">Sold by</h3>
                            <div class="flex items-center space-x-4">
                                <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                     alt="Farmer" 
                                     class="w-12 h-12 rounded-full object-cover">
                                <div>
                                    <h4 class="font-medium text-gray-800">${productData.farmer}</h4>
                                    <p class="text-sm text-gray-600">Verified Farmer • 5km away</p>
                                </div>
                                <button class="ml-auto bg-agri-deep text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-agri-light transition-colors">
                                    View Farm
                                </button>
                            </div>
                        </div>

                        <!-- Quantity and Add to Cart -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center border border-gray-300 rounded-lg">
                                        <button id="qty-minus" class="px-3 py-2 text-gray-600 hover:text-agri-deep">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="number" id="quantity" value="1" min="1" max="${productData.inStock}" 
                                               class="w-16 text-center border-0 focus:ring-0">
                                        <button id="qty-plus" class="px-3 py-2 text-gray-600 hover:text-agri-deep">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <span class="text-sm text-gray-600">Available: ${productData.inStock} kg</span>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex space-x-4">
                                <button id="add-to-cart" class="flex-1 bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors flex items-center justify-center">
                                    <i class="fas fa-shopping-cart mr-2"></i>
                                    Add to Cart
                                </button>
                                <button id="wishlist-btn" class="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-agri-orange transition-colors">
                                    <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                                </button>
                            </div>

                            <!-- Buy Now Button -->
                            <button class="w-full bg-agri-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-orange-mid transition-colors">
                                Buy Now
                            </button>
                        </div>

                        <!-- Product Features -->
                        <div class="border-t border-gray-200 pt-6">
                            <h3 class="font-semibold text-gray-800 mb-4">Product Features</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Fresh from farm
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Organically grown
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Same day delivery available
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Quality guaranteed
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Product Tabs -->
                <div class="mt-16">
                    <div class="border-b border-gray-200">
                        <nav class="flex space-x-8">
                            <button class="py-4 px-1 border-b-2 border-agri-orange text-agri-deep font-medium product-tab active" data-tab="description">
                                Description
                            </button>
                            <button class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 product-tab" data-tab="reviews">
                                Reviews (${productData.reviews})
                            </button>
                            <button class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 product-tab" data-tab="shipping">
                                Shipping Info
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="py-8">
                        <!-- Description Tab -->
                        <div id="description-tab" class="tab-content">
                            <div class="prose max-w-none">
                                <p class="text-gray-600 leading-relaxed mb-4">
                                    Our ${productData.name.toLowerCase()} are carefully grown using sustainable farming practices. 
                                    Each piece is hand-picked at peak ripeness to ensure maximum flavor and nutritional value.
                                </p>
                                <p class="text-gray-600 leading-relaxed mb-4">
                                    Grown without harmful pesticides or chemicals, these ${productData.category} are perfect for 
                                    health-conscious consumers who value quality and taste.
                                </p>
                                <h4 class="font-semibold text-gray-800 mb-2">Nutritional Benefits:</h4>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Rich in vitamins and minerals</li>
                                    <li>High in antioxidants</li>
                                    <li>Good source of fiber</li>
                                    <li>Low in calories</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Reviews Tab -->
                        <div id="reviews-tab" class="tab-content hidden">
                            <div class="space-y-6">
                                <!-- Review Summary -->
                                <div class="bg-gray-50 rounded-xl p-6">
                                    <div class="flex items-center space-x-6">
                                        <div class="text-center">
                                            <div class="text-4xl font-bold text-gray-800">${productData.rating}</div>
                                            <div class="flex text-yellow-400 justify-center mb-1">
                                                ${generateStars(productData.rating)}
                                            </div>
                                            <div class="text-sm text-gray-600">${productData.reviews} reviews</div>
                                        </div>
                                        <div class="flex-1">
                                            <div class="space-y-2">
                                                <div class="flex items-center">
                                                    <span class="text-sm text-gray-600 w-12">5 star</span>
                                                    <div class="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 75%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">75%</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-sm text-gray-600 w-12">4 star</span>
                                                    <div class="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 20%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">20%</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-sm text-gray-600 w-12">3 star</span>
                                                    <div class="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 3%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">3%</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-sm text-gray-600 w-12">2 star</span>
                                                    <div class="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 1%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">1%</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-sm text-gray-600 w-12">1 star</span>
                                                    <div class="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 1%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">1%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Individual Reviews -->
                                    <div class="space-y-4">
                                        <div class="border-b border-gray-200 pb-4">
                                            <div class="flex items-start space-x-4">
                                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" 
                                                     alt="Reviewer" 
                                                     class="w-10 h-10 rounded-full object-cover">
                                                <div class="flex-1">
                                                    <div class="flex items-center space-x-2 mb-1">
                                                        <h5 class="font-medium text-gray-800">John D.</h5>
                                                        <div class="flex text-yellow-400 text-sm">
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                        </div>
                                                        <span class="text-sm text-gray-500">2 days ago</span>
                                                    </div>
                                                    <p class="text-gray-600">
                                                        Excellent quality! The ${productData.name.toLowerCase()} were fresh and delicious. 
                                                        Delivery was quick and packaging was perfect. Will definitely order again.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="border-b border-gray-200 pb-4">
                                            <div class="flex items-start space-x-4">
                                                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" 
                                                     alt="Reviewer" 
                                                     class="w-10 h-10 rounded-full object-cover">
                                                <div class="flex-1">
                                                    <div class="flex items-center space-x-2 mb-1">
                                                        <h5 class="font-medium text-gray-800">Sarah M.</h5>
                                                        <div class="flex text-yellow-400 text-sm">
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="fas fa-star"></i>
                                                            <i class="far fa-star"></i>
                                                        </div>
                                                        <span class="text-sm text-gray-500">1 week ago</span>
                                                    </div>
                                                    <p class="text-gray-600">
                                                        Good quality produce. The farmer was very responsive to questions. 
                                                        Only minor issue was delivery was a day late, but the quality made up for it.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Shipping Tab -->
                            <div id="shipping-tab" class="tab-content hidden">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 class="font-semibold text-gray-800 mb-4">Delivery Options</h4>
                                        <div class="space-y-4">
                                            <div class="flex items-center space-x-3">
                                                <i class="fas fa-truck text-agri-orange"></i>
                                                <div>
                                                    <h5 class="font-medium text-gray-800">Same Day Delivery</h5>
                                                    <p class="text-sm text-gray-600">Order before 2 PM for same day delivery</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <i class="fas fa-clock text-agri-orange"></i>
                                                <div>
                                                    <h5 class="font-medium text-gray-800">Next Day Delivery</h5>
                                                    <p class="text-sm text-gray-600">Standard delivery option</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <i class="fas fa-store text-agri-orange"></i>
                                                <div>
                                                    <h5 class="font-medium text-gray-800">Pickup Available</h5>
                                                    <p class="text-sm text-gray-600">Collect from farm or pickup point</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800 mb-4">Return Policy</h4>
                                        <div class="space-y-2 text-gray-600">
                                            <p>• 24-hour return policy for fresh produce</p>
                                            <p>• Full refund for damaged or unsatisfactory items</p>
                                            <p>• Contact us immediately upon delivery</p>
                                            <p>• Return shipping covered by us</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
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

function initializeProductPageFeatures() {
  // Initialize image gallery
  initializeImageGallery()

  // Initialize quantity controls
  initializeQuantityControls()

  // Initialize add to cart functionality
  initializeAddToCart()

  // Initialize wishlist functionality
  initializeWishlist()

  // Initialize product tabs
  initializeProductTabs()

  // Check if product is in wishlist
  updateWishlistButton()
}

function initializeImageGallery() {
  const mainImage = document.getElementById("main-image")
  const thumbnails = document.querySelectorAll(".thumbnail-img")

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", function () {
      // Remove active class from all thumbnails
      thumbnails.forEach((thumb) => {
        thumb.classList.remove("border-agri-orange", "active")
        thumb.classList.add("border-transparent")
      })

      // Add active class to clicked thumbnail
      this.classList.add("border-agri-orange", "active")
      this.classList.remove("border-transparent")

      // Update main image
      mainImage.src = this.src.replace("w=200", "w=800")
    })
  })
}

function initializeQuantityControls() {
  const qtyMinus = document.getElementById("qty-minus")
  const qtyPlus = document.getElementById("qty-plus")
  const quantityInput = document.getElementById("quantity")

  qtyMinus.addEventListener("click", () => {
    const currentQty = Number.parseInt(quantityInput.value)
    if (currentQty > 1) {
      quantityInput.value = currentQty - 1
    }
  })

  qtyPlus.addEventListener("click", () => {
    const currentQty = Number.parseInt(quantityInput.value)
    if (currentQty < productData.inStock) {
      quantityInput.value = currentQty + 1
    }
  })

  // Validate quantity input
  quantityInput.addEventListener("change", function () {
    const qty = Number.parseInt(this.value)
    if (qty < 1) this.value = 1
    if (qty > productData.inStock) this.value = productData.inStock
  })
}

function initializeAddToCart() {
  const addToCartBtn = document.getElementById("add-to-cart")

  addToCartBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(document.getElementById("quantity").value)
    addToCartFromProduct(productData, quantity)
  })
}

function initializeWishlist() {
  const wishlistBtn = document.getElementById("wishlist-btn")

  wishlistBtn.addEventListener("click", () => {
    toggleWishlist(productData)
  })
}

function toggleWishlist(product) {
  const existingIndex = wishlist.findIndex((item) => item.id === product.id)

  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1)
    showToast(`${product.name} removed from wishlist`, "info")
  } else {
    // Add to wishlist
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      farmer: product.farmer,
      rating: product.rating,
      badges: product.badges,
    })
    showToast(`${product.name} added to wishlist!`, "success")
  }

  // Save to localStorage
  localStorage.setItem("smartsupply-wishlist", JSON.stringify(wishlist))

  // Update wishlist count and button
  updateWishlistCount()
  updateWishlistButton()
}

function updateWishlistButton() {
  const wishlistBtn = document.getElementById("wishlist-btn")
  const icon = wishlistBtn.querySelector("i")
  const isInWishlist = wishlist.some((item) => item.id === productData.id)

  if (isInWishlist) {
    icon.classList.remove("far")
    icon.classList.add("fas", "text-red-500")
  } else {
    icon.classList.remove("fas", "text-red-500")
    icon.classList.add("far")
  }
}

function initializeProductTabs() {
  const tabButtons = document.querySelectorAll(".product-tab")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab")

      // Remove active class from all buttons
      tabButtons.forEach((btn) => {
        btn.classList.remove("border-agri-orange", "text-agri-deep")
        btn.classList.add("border-transparent", "text-gray-500")
      })

      // Add active class to clicked button
      this.classList.add("border-agri-orange", "text-agri-deep")
      this.classList.remove("border-transparent", "text-gray-500")

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.classList.add("hidden")
      })

      // Show target tab content
      document.getElementById(targetTab).classList.remove("hidden")
    })
  })
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

// Utility function to format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity")
  const quantity = Number.parseInt(quantityInput.value)
  if (quantity > 1) {
    quantityInput.value = quantity - 1
  }
}

function increaseQuantity() {
  const quantityInput = document.getElementById("quantity")
  const quantity = Number.parseInt(quantityInput.value)
  if (quantity < productData.inStock) {
    quantityInput.value = quantity + 1
  }
}

function addToCartFromProduct(productId, quantity) {
  const product = getProductData(productId)
  const quantityInput = document.getElementById("quantity")
  const quantityValue = Number.parseInt(quantityInput.value)

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantityValue
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      farmer: product.farmer,
      quantity: quantityValue,
    })
  }

  // Save to localStorage
  localStorage.setItem("smartsupply-cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show toast notification
  showToast(`${product.name} added to cart!`, "success")

  // Add animation to cart icon
  animateCartIcon()
}

function toggleWishlistFromProduct(productId) {
  const product = getProductData(productId)
  toggleWishlist(product)
}

// Export functions for use in other pages
window.SmartSupplyCart = {
  getCart: () => cart,
  addToCart: addToCart,
  updateCartCount: updateCartCount,
  showToast: showToast,
}

window.SmartSupplyWishlist = {
  getWishlist: () => wishlist,
  toggleWishlist: toggleWishlist,
  updateWishlistCount: updateWishlistCount,
}

window.navigateToProductPage = navigateToProductPage

// Function to navigate to other pages
function navigateToPage(page) {
  // This function should handle navigation to other pages
  // For now, it logs the page name to the console
  console.log(`Navigating to ${page} page`)
}
