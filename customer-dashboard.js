// SmartSupply Agri - Customer Dashboard JavaScript

// Global state management
const CustomerDashboard = {
  currentPage: "dashboard",
  orders: [],
  favorites: [],
  watchlist: [],
  addresses: [],
  messages: [],
  notifications: [],
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 SmartSupply Agri Customer Dashboard - Initializing...")
  initializeCustomerDashboard()
})

// Main initialization function
function initializeCustomerDashboard() {
  try {
    console.log("📋 Initializing customer dashboard components...")

    // Initialize navigation
    initializeNavigation()

    // Initialize mobile menu
    initializeMobileMenu()

    // Initialize modals
    initializeModals()

    // Load initial data
    loadDashboardData()

    // Initialize form handlers
    initializeFormHandlers()

    console.log("✅ Customer dashboard initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing customer dashboard:", error)
    showToast("Failed to initialize dashboard. Please refresh the page.", "error")
  }
}

// Navigation system
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const page = item.getAttribute("data-page")
      if (page) {
        navigateToPage(page)
      }
    })
  })
}

// Page navigation
function navigateToPage(pageName) {
  console.log(`🔄 Navigating to page: ${pageName}`)

  // Update navigation state
  updateNavigationState(pageName)

  // Update breadcrumb
  updateBreadcrumb(pageName)

  // Load page content
  loadPageContent(pageName)

  // Update current page
  CustomerDashboard.currentPage = pageName

  // Close mobile menu if open
  closeMobileMenu()
}

// Update navigation visual state
function updateNavigationState(currentPage) {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    const page = item.getAttribute("data-page")
    if (page === currentPage) {
      item.classList.remove("text-gray-700", "hover:bg-gray-100")
      item.classList.add("text-agri-deep", "bg-agri-sage", "font-medium")
    } else {
      item.classList.remove("text-agri-deep", "bg-agri-sage", "font-medium")
      item.classList.add("text-gray-700", "hover:bg-gray-100")
    }
  })
}

// Update breadcrumb
function updateBreadcrumb(pageName) {
  const breadcrumbElement = document.getElementById("breadcrumb-current")
  const pageNames = {
    dashboard: "Dashboard",
    orders: "My Orders",
    favorites: "Favorites",
    watchlist: "Watchlist",
    messages: "Messages",
    addresses: "Saved Addresses",
    settings: "Account Settings",
  }

  if (breadcrumbElement) {
    breadcrumbElement.textContent = pageNames[pageName] || pageName
  }
}

// Load page content
function loadPageContent(pageName) {
  const dashboardContent = document.getElementById("dashboard-content")
  const dynamicContent = document.getElementById("dynamic-content")

  if (pageName === "dashboard") {
    dashboardContent.classList.remove("hidden")
    dynamicContent.classList.add("hidden")
  } else {
    dashboardContent.classList.add("hidden")
    dynamicContent.classList.remove("hidden")

    // Generate content based on page
    const content = generatePageContent(pageName)
    dynamicContent.innerHTML = content

    // Initialize page-specific functionality
    initializePageSpecificFeatures(pageName)
  }
}

// Generate page content
function generatePageContent(pageName) {
  switch (pageName) {
    case "orders":
      return getOrdersPageContent()
    case "favorites":
      return getFavoritesPageContent()
    case "watchlist":
      return getWatchlistPageContent()
    case "messages":
      return getMessagesPageContent()
    case "addresses":
      return getAddressesPageContent()
    case "settings":
      return getSettingsPageContent()
    default:
      return '<div class="p-6"><h1 class="text-2xl font-bold">Page not found</h1></div>'
  }
}

// Orders page content
function getOrdersPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p class="text-gray-600">Track and manage all your orders</p>
                </div>
                <div class="flex items-center space-x-4">
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <option>All Orders</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>
                    <input type="text" placeholder="Search orders..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                </div>
            </div>

            <!-- Orders List -->
            <div class="space-y-6">
                <!-- Order 1 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <h3 class="text-lg font-semibold text-gray-900">Order #ORD-001</h3>
                            <span class="status-badge status-in-transit">In Transit</span>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Placed on Dec 15, 2024</p>
                            <p class="text-lg font-bold text-gray-900">$24.99</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 mb-4">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Organic Tomatoes" class="product-image">
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">Organic Tomatoes</h4>
                            <p class="text-sm text-gray-600">Green Valley Farm</p>
                            <p class="text-sm text-gray-600">Quantity: 5 kg</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">$24.99</p>
                        </div>
                    </div>
                    
                    <div class="bg-agri-sage rounded-lg p-4 mb-4">
                        <div class="flex items-center space-x-3 mb-2">
                            <i class="fas fa-truck text-agri-deep"></i>
                            <span class="text-sm font-medium text-agri-deep">SmartSupply Logistics</span>
                        </div>
                        <p class="text-xs text-gray-600">Expected delivery: Dec 16, 2024 by 2:00 PM</p>
                        <p class="text-xs text-gray-600">Tracking ID: SS-TRK-001234</p>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button class="text-agri-deep hover:text-agri-light font-medium text-sm" onclick="showOrderTracking()">
                                <i class="fas fa-truck mr-1"></i>
                                Track Order
                            </button>
                            <button class="text-gray-600 hover:text-gray-800 font-medium text-sm" onclick="contactFarmer('green-valley-farm')">
                                <i class="fas fa-envelope mr-1"></i>
                                Contact Farmer
                            </button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Reorder
                            </button>
                            <button class="px-4 py-2 bg-agri-deep text-white rounded-lg hover:bg-agri-light transition-colors text-sm">
                                Rate & Review
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Order 2 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <h3 class="text-lg font-semibold text-gray-900">Order #ORD-002</h3>
                            <span class="status-badge status-processing">Processing</span>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Placed on Dec 14, 2024</p>
                            <p class="text-lg font-bold text-gray-900">$18.50</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 mb-4">
                        <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Fresh Carrots" class="product-image">
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">Fresh Carrots</h4>
                            <p class="text-sm text-gray-600">Sunshine Acres</p>
                            <p class="text-sm text-gray-600">Quantity: 3 kg</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">$18.50</p>
                        </div>
                    </div>
                    
                    <div class="bg-agri-sage rounded-lg p-4 mb-4">
                        <div class="flex items-center space-x-3 mb-2">
                            <i class="fas fa-seedling text-agri-deep"></i>
                            <span class="text-sm font-medium text-agri-deep">Being Prepared</span>
                        </div>
                        <p class="text-xs text-gray-600">Your order is being harvested and prepared for pickup</p>
                        <p class="text-xs text-gray-600">Expected pickup: Dec 15, 2024</p>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button class="text-gray-400 cursor-not-allowed font-medium text-sm">
                                <i class="fas fa-truck mr-1"></i>
                                Track Order
                            </button>
                            <button class="text-gray-600 hover:text-gray-800 font-medium text-sm" onclick="contactFarmer('sunshine-acres')">
                                <i class="fas fa-envelope mr-1"></i>
                                Contact Farmer
                            </button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Order 3 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <h3 class="text-lg font-semibold text-gray-900">Order #ORD-003</h3>
                            <span class="status-badge status-delivered">Delivered</span>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Delivered on Dec 13, 2024</p>
                            <p class="text-lg font-bold text-gray-900">$12.75</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 mb-4">
                        <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Butter Lettuce" class="product-image">
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">Butter Lettuce</h4>
                            <p class="text-sm text-gray-600">Organic Gardens Co.</p>
                            <p class="text-sm text-gray-600">Quantity: 2 kg</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">$12.75</p>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 rounded-lg p-4 mb-4">
                        <div class="flex items-center space-x-3 mb-2">
                            <i class="fas fa-check-circle text-green-600"></i>
                            <span class="text-sm font-medium text-green-800">Successfully Delivered</span>
                        </div>
                        <p class="text-xs text-gray-600">Delivered by SmartSupply Logistics on Dec 13, 2024 at 3:45 PM</p>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button class="text-agri-deep hover:text-agri-light font-medium text-sm">
                                <i class="fas fa-star mr-1"></i>
                                Rate & Review
                            </button>
                            <button class="text-gray-600 hover:text-gray-800 font-medium text-sm">
                                <i class="fas fa-download mr-1"></i>
                                Download Invoice
                            </button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Reorder
                            </button>
                            <button class="px-4 py-2 bg-agri-deep text-white rounded-lg hover:bg-agri-light transition-colors text-sm">
                                Buy Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-8">
                <p class="text-sm text-gray-600">Showing 1-3 of 24 orders</p>
                <div class="flex items-center space-x-2">
                    <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Previous
                    </button>
                    <button class="px-3 py-2 bg-agri-deep text-white rounded-lg">1</button>
                    <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">2</button>
                    <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">3</button>
                    <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    `
}

// Favorites page content
function getFavoritesPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
                    <p class="text-gray-600">Products you've saved for easy access</p>
                </div>
                <div class="flex items-center space-x-4">
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <option>All Categories</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Grains</option>
                        <option>Herbs</option>
                    </select>
                    <input type="text" placeholder="Search favorites..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                </div>
            </div>

            <!-- Favorites Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 favorites-grid">
                <!-- Favorite Item 1 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'tomatoes')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Organic Tomatoes" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Organic Tomatoes</h4>
                    <p class="text-sm text-gray-600 mb-2">Green Valley Farm</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$4.99/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.8</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('tomatoes')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 2 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'carrots')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Fresh Carrots" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Fresh Carrots</h4>
                    <p class="text-sm text-gray-600 mb-2">Sunshine Acres</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$3.49/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.6</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('carrots')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 3 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'lettuce')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Butter Lettuce" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Butter Lettuce</h4>
                    <p class="text-sm text-gray-600 mb-2">Organic Gardens Co.</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$2.99/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.9</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('lettuce')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 4 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'apples')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Fresh Apples" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Fresh Apples</h4>
                    <p class="text-sm text-gray-600 mb-2">Mountain View Orchard</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$5.99/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.7</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('apples')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 5 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'spinach')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Baby Spinach" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Baby Spinach</h4>
                    <p class="text-sm text-gray-600 mb-2">Fresh Leaf Farms</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$3.49/bunch</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.5</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('spinach')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 6 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'peppers')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Bell Peppers" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Bell Peppers Mix</h4>
                    <p class="text-sm text-gray-600 mb-2">Rainbow Gardens</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$5.99/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.8</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('peppers')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 7 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'broccoli')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Fresh Broccoli" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Fresh Broccoli</h4>
                    <p class="text-sm text-gray-600 mb-2">Green Fields Farm</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$4.49/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.6</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('broccoli')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Favorite Item 8 -->
                <div class="favorite-card dashboard-card p-4">
                    <div class="favorite-heart active" onclick="toggleFavorite(this, 'bananas')">
                        <i class="fas fa-heart text-sm"></i>
                    </div>
                    <img src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Organic Bananas" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Organic Bananas</h4>
                    <p class="text-sm text-gray-600 mb-2">Tropical Farms</p>
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-lg font-bold text-agri-deep">$2.99/kg</p>
                        <div class="flex items-center text-yellow-500 text-sm">
                            <i class="fas fa-star mr-1"></i>
                            <span>4.7</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg hover:bg-agri-light transition-colors text-sm">
                            Add to Cart
                        </button>
                        <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onclick="addToWatchlist('bananas')">
                            <i class="fas fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State (hidden when there are favorites) -->
            <div class="hidden text-center py-12">
                <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p class="text-gray-600 mb-6">Start browsing and save products you love</p>
                <button class="bg-agri-deep text-white px-6 py-3 rounded-lg hover:bg-agri-light transition-colors" onclick="goToMarketplace()">
                    Browse Products
                </button>
            </div>
        </div>
    `
}

// Watchlist page content
function getWatchlistPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
                    <p class="text-gray-600">Track price changes and availability for products you're interested in</p>
                </div>
                <div class="flex items-center space-x-4">
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <option>All Items</option>
                        <option>Price Dropped</option>
                        <option>Back in Stock</option>
                        <option>New Harvest</option>
                    </select>
                    <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors">
                        <i class="fas fa-bell mr-2"></i>
                        Manage Alerts
                    </button>
                </div>
            </div>

            <!-- Watchlist Items -->
            <div class="space-y-4">
                <!-- Watchlist Item 1 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center space-x-6">
                        <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Fresh Apples" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-lg font-semibold text-gray-900">Fresh Apples</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-arrow-down mr-1"></i>
                                        Price Drop
                                    </span>
                                    <button class="text-gray-400 hover:text-red-500" onclick="removeFromWatchlist('apples')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 mb-3">Mountain View Orchard</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <span class="text-2xl font-bold text-agri-deep">$5.99</span>
                                        <span class="text-lg text-gray-500 line-through ml-2">$6.99</span>
                                        <span class="text-sm text-gray-600">/kg</span>
                                    </div>
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                        Save $1.00
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button class="text-red-500 hover:text-red-700" onclick="toggleFavorite(this, 'apples')">
                                        <i class="far fa-heart text-lg"></i>
                                    </button>
                                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Watchlist Item 2 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center space-x-6">
                        <img src="https://images.unsplash.com/photo-1518842335899-2c99781902a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Organic Rice" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-lg font-semibold text-gray-900">Organic Rice</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-seedling mr-1"></i>
                                        New Harvest
                                    </span>
                                    <button class="text-gray-400 hover:text-red-500" onclick="removeFromWatchlist('rice')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 mb-3">Golden Fields Farm</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <span class="text-2xl font-bold text-agri-deep">$3.49</span>
                                        <span class="text-sm text-gray-600">/kg</span>
                                    </div>
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                        Fresh Harvest
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button class="text-red-500 hover:text-red-700" onclick="toggleFavorite(this, 'rice')">
                                        <i class="far fa-heart text-lg"></i>
                                    </button>
                                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Watchlist Item 3 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center space-x-6">
                        <img src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sweet Potatoes" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-lg font-semibold text-gray-900">Sweet Potatoes</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-box mr-1"></i>
                                        Back in Stock
                                    </span>
                                    <button class="text-gray-400 hover:text-red-500" onclick="removeFromWatchlist('sweet-potatoes')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 mb-3">Harvest Moon Farm</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <span class="text-2xl font-bold text-agri-deep">$2.99</span>
                                        <span class="text-sm text-gray-600">/kg</span>
                                    </div>
                                    <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                        Available Now
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button class="text-red-500 hover:text-red-700" onclick="toggleFavorite(this, 'sweet-potatoes')">
                                        <i class="far fa-heart text-lg"></i>
                                    </button>
                                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Watchlist Item 4 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center space-x-6">
                        <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Organic Corn" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-lg font-semibold text-gray-900">Organic Corn</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-clock mr-1"></i>
                                        Watching
                                    </span>
                                    <button class="text-gray-400 hover:text-red-500" onclick="removeFromWatchlist('corn')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 mb-3">Sunny Acres Farm</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <span class="text-2xl font-bold text-agri-deep">$4.99</span>
                                        <span class="text-sm text-gray-600">/kg</span>
                                    </div>
                                    <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                        No Change
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button class="text-red-500 hover:text-red-700" onclick="toggleFavorite(this, 'corn')">
                                        <i class="far fa-heart text-lg"></i>
                                    </button>
                                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Watchlist Item 5 -->
                <div class="dashboard-card p-6">
                    <div class="flex items-center space-x-6">
                        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Fresh Herbs" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-lg font-semibold text-gray-900">Fresh Herbs Mix</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-exclamation-triangle mr-1"></i>
                                        Out of Stock
                                    </span>
                                    <button class="text-gray-400 hover:text-red-500" onclick="removeFromWatchlist('herbs')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 mb-3">Herb Garden Co.</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <span class="text-2xl font-bold text-gray-400">$6.99</span>
                                        <span class="text-sm text-gray-600">/bunch</span>
                                    </div>
                                    <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                        Unavailable
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button class="text-red-500 hover:text-red-700" onclick="toggleFavorite(this, 'herbs')">
                                        <i class="far fa-heart text-lg"></i>
                                    </button>
                                    <button class="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed" disabled>
                                        Out of Stock
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Price Alert Settings -->
            <div class="dashboard-card p-6 mt-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Price Alert Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="price-drop" class="text-agri-orange focus:ring-agri-orange" checked>
                        <label for="price-drop" class="text-sm text-gray-700">Notify me of price drops</label>
                    </div>
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="back-in-stock" class="text-agri-orange focus:ring-agri-orange" checked>
                        <label for="back-in-stock" class="text-sm text-gray-700">Notify when back in stock</label>
                    </div>
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="new-harvest" class="text-agri-orange focus:ring-agri-orange" checked>
                        <label for="new-harvest" class="text-sm text-gray-700">Notify of new harvests</label>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Messages page content
function getMessagesPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                    <p class="text-gray-600">Communicate with farmers and customer support</p>
                </div>
                <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors" onclick="startNewConversation()">
                    <i class="fas fa-plus mr-2"></i>
                    New Message
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Conversations List -->
                <div class="lg:col-span-1">
                    <div class="dashboard-card">
                        <div class="p-4 border-b border-gray-200">
                            <input type="text" placeholder="Search conversations..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                        <div class="max-h-96 overflow-y-auto">
                            <!-- Conversation 1 -->
                            <div class="conversation-item p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active" onclick="selectConversation('green-valley-farm')">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-agri-deep rounded-full flex items-center justify-center text-white font-semibold">
                                        GV
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4 class="font-medium text-gray-900">Green Valley Farm</h4>
                                            <span class="text-xs text-gray-500">2h ago</span>
                                        </div>
                                        <p class="text-sm text-gray-600 truncate">Your tomatoes are ready for pickup...</p>
                                        <div class="flex items-center mt-1">
                                            <span class="w-2 h-2 bg-agri-orange rounded-full mr-2"></span>
                                            <span class="text-xs text-agri-orange font-medium">New message</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Conversation 2 -->
                            <div class="conversation-item p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onclick="selectConversation('smartsupply-support')">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        SS
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4 class="font-medium text-gray-900">SmartSupply Support</h4>
                                            <span class="text-xs text-gray-500">1d ago</span>
                                        </div>
                                        <p class="text-sm text-gray-600 truncate">Thank you for contacting us. Your order...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Conversation 3 -->
                            <div class="conversation-item p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onclick="selectConversation('sunshine-acres')">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        SA
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4 class="font-medium text-gray-900">Sunshine Acres</h4>
                                            <span class="text-xs text-gray-500">2d ago</span>
                                        </div>
                                        <p class="text-sm text-gray-600 truncate">The carrots will be harvested tomorrow...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Conversation 4 -->
                            <div class="conversation-item p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onclick="selectConversation('organic-gardens')">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        OG
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4 class="font-medium text-gray-900">Organic Gardens Co.</h4>
                                            <span class="text-xs text-gray-500">3d ago</span>
                                        </div>
                                        <p class="text-sm text-gray-600 truncate">Thank you for your order! The lettuce...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="lg:col-span-2">
                    <div class="dashboard-card h-96 flex flex-col">
                        <!-- Chat Header -->
                        <div class="p-4 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-agri-deep rounded-full flex items-center justify-center text-white font-semibold">
                                        GV
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-gray-900">Green Valley Farm</h4>
                                        <p class="text-sm text-gray-600">John Doe • Online</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-gray-600 hover:text-gray-800">
                                        <i class="fas fa-phone"></i>
                                    </button>
                                    <button class="text-gray-600 hover:text-gray-800">
                                        <i class="fas fa-video"></i>
                                    </button>
                                    <button class="text-gray-600 hover:text-gray-800">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Messages -->
                        <div class="flex-1 p-4 overflow-y-auto" id="chat-messages">
                            <div class="space-y-4">
                                <!-- Received Message -->
                                <div class="flex items-start space-x-3">
                                    <div class="w-8 h-8 bg-agri-deep rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        GV
                                    </div>
                                    <div class="message-bubble message-received">
                                        <p class="text-sm">Hello Sarah! Thank you for your order. Your organic tomatoes are ready for pickup.</p>
                                        <p class="text-xs text-gray-500 mt-1">2:30 PM</p>
                                    </div>
                                </div>

                                <!-- Sent Message -->
                                <div class="flex justify-end">
                                    <div class="message-bubble message-sent">
                                        <p class="text-sm">Great! What time can I expect the SmartSupply pickup?</p>
                                        <p class="text-xs text-white opacity-75 mt-1">2:32 PM</p>
                                    </div>
                                </div>

                                <!-- Received Message -->
                                <div class="flex items-start space-x-3">
                                    <div class="w-8 h-8 bg-agri-deep rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        GV
                                    </div>
                                    <div class="message-bubble message-received">
                                        <p class="text-sm">SmartSupply will pick up between 3-5 PM today. You should receive a tracking notification once they collect the order.</p>
                                        <p class="text-xs text-gray-500 mt-1">2:35 PM</p>
                                    </div>
                                </div>

                                <!-- Sent Message -->
                                <div class="flex justify-end">
                                    <div class="message-bubble message-sent">
                                        <p class="text-sm">Perfect! Thank you for the update. Looking forward to receiving them.</p>
                                        <p class="text-xs text-white opacity-75 mt-1">2:36 PM</p>
                                    </div>
                                </div>

                                <!-- System Message -->
                                <div class="flex justify-center">
                                    <div class="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                                        Order #ORD-001 was picked up by SmartSupply at 4:15 PM
                                    </div>
                                </div>

                                <!-- Received Message -->
                                <div class="flex items-start space-x-3">
                                    <div class="w-8 h-8 bg-agri-deep rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        GV
                                    </div>
                                    <div class="message-bubble message-received">
                                        <p class="text-sm">Your order is now on its way! SmartSupply has collected it and it should arrive tomorrow by 2 PM.</p>
                                        <p class="text-xs text-gray-500 mt-1">4:20 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Message Input -->
                        <div class="p-4 border-t border-gray-200">
                            <div class="flex items-center space-x-3">
                                <button class="text-gray-600 hover:text-gray-800">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <input type="text" placeholder="Type your message..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" id="message-input">
                                <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors" onclick="sendMessage()">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Addresses page content
function getAddressesPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
                    <p class="text-gray-600">Manage your delivery addresses for faster checkout</p>
                </div>
                <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors" onclick="showAddAddress()">
                    <i class="fas fa-plus mr-2"></i>
                    Add New Address
                </button>
            </div>

            <!-- Addresses Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Default Address -->
                <div class="address-card default">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="bg-agri-deep text-white px-3 py-1 rounded-full text-sm font-medium">Default</span>
                            <span class="text-sm font-medium text-gray-900">Home</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="text-gray-600 hover:text-gray-800" onclick="editAddress('home')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteAddress('home')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <p class="font-medium text-gray-900">Sarah Johnson</p>
                        <p class="text-sm text-gray-600">+233 24 123 4567</p>
                        <p class="text-sm text-gray-600">123 Maple Street<br>East Legon, Accra<br>Greater Accra Region</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <button class="text-agri-deep hover:text-agri-light font-medium text-sm">
                            <i class="fas fa-check mr-1"></i>
                            Default Address
                        </button>
                    </div>
                </div>

                <!-- Office Address -->
                <div class="address-card">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-sm font-medium text-gray-900">Office</span>
                        <div class="flex items-center space-x-2">
                            <button class="text-gray-600 hover:text-gray-800" onclick="editAddress('office')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteAddress('office')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <p class="font-medium text-gray-900">Sarah Johnson</p>
                        <p class="text-sm text-gray-600">+233 24 123 4567</p>
                        <p class="text-sm text-gray-600">456 Business Avenue<br>Airport Residential Area<br>Greater Accra Region</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <button class="text-gray-600 hover:text-agri-deep font-medium text-sm" onclick="setDefaultAddress('office')">
                            <i class="fas fa-star mr-1"></i>
                            Set as Default
                        </button>
                    </div>
                </div>

                <!-- Parents' House -->
                <div class="address-card">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-sm font-medium text-gray-900">Parents' House</span>
                        <div class="flex items-center space-x-2">
                            <button class="text-gray-600 hover:text-gray-800" onclick="editAddress('parents')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteAddress('parents')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <p class="font-medium text-gray-900">Mr. & Mrs. Johnson</p>
                        <p class="text-sm text-gray-600">+233 20 987 6543</p>
                        <p class="text-sm text-gray-600">789 Family Lane<br>Tema, Greater Accra<br>Greater Accra Region</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <button class="text-gray-600 hover:text-agri-deep font-medium text-sm" onclick="setDefaultAddress('parents')">
                            <i class="fas fa-star mr-1"></i>
                            Set as Default
                        </button>
                    </div>
                </div>
            </div>

            <!-- Delivery Instructions -->
            <div class="dashboard-card p-6 mt-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Default Delivery Instructions</h3>
                <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="Add any special delivery instructions that apply to all orders...">Please call when you arrive. Leave packages with the security guard if I'm not available.</textarea>
                <div class="flex justify-end mt-4">
                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                        Save Instructions
                    </button>
                </div>
            </div>
        </div>
    `
}

// Settings page content
function getSettingsPageContent() {
    return `
        <div class="p-6">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
                <p class="text-gray-600">Manage your profile information and account preferences</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Settings Navigation -->
                <div class="lg:col-span-1">
                    <div class="dashboard-card p-4">
                        <nav class="space-y-2">
                            <a href="#" class="settings-nav-item flex items-center space-x-3 px-4 py-3 text-agri-deep bg-agri-sage rounded-lg font-medium" data-section="profile">
                                <i class="fas fa-user w-5"></i>
                                <span>Profile Information</span>
                            </a>
                            <a href="#" class="settings-nav-item flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" data-section="security">
                                <i class="fas fa-lock w-5"></i>
                                <span>Security</span>
                            </a>
                            <a href="#" class="settings-nav-item flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" data-section="notifications">
                                <i class="fas fa-bell w-5"></i>
                                <span>Notifications</span>
                            </a>
                            <a href="#" class="settings-nav-item flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" data-section="preferences">
                                <i class="fas fa-cog w-5"></i>
                                <span>Preferences</span>
                            </a>
                            <a href="#" class="settings-nav-item flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" data-section="privacy">
                                <i class="fas fa-shield-alt w-5"></i>
                                <span>Privacy</span>
                            </a>
                        </nav>
                    </div>
                </div>

                <!-- Settings Content -->
                <div class="lg:col-span-2">
                    <!-- Profile Information Section -->
                    <div id="profile-section" class="settings-section">
                        <div class="dashboard-card p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                            
                            <!-- Profile Picture -->
                            <div class="flex items-center space-x-6 mb-8">
                                <div class="w-24 h-24 bg-gradient-to-br from-agri-deep to-agri-light rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    SJ
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-900 mb-2">Profile Picture</h4>
                                    <div class="flex items-center space-x-3">
                                        <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors text-sm">
                                            Upload New
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-800 text-sm">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Profile Form -->
                            <form class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" value="Sarah" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" value="Johnson" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" value="sarah.johnson@email.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" value="+233 24 123 4567" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input type="date" value="1990-05-15" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="Tell us a bit about yourself...">I'm passionate about supporting local farmers and eating fresh, organic produce. I love cooking with seasonal ingredients and trying new recipes.</textarea>
                                </div>
                                
                                <div class="flex justify-end">
                                    <button type="submit" class="bg-agri-deep text-white px-6 py-3 rounded-lg hover:bg-agri-light transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div id="security-section" class="settings-section hidden">
                        <div class="dashboard-card p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                            
                            <!-- Change Password -->
                            <div class="mb-8">
                                <h4 class="font-medium text-gray-900 mb-4">Change Password</h4>
                                <form class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <input type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <input type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <input type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    </div>
                                    <button type="submit" class="bg-agri-deep text-white px-6 py-3 rounded-lg hover:bg-agri-light transition-colors">
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            <!-- Two-Factor Authentication -->
                            <div class="mb-8">
                                <h4 class="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p class="font-medium text-gray-900">SMS Authentication</p>
                                        <p class="text-sm text-gray-600">Receive verification codes via SMS</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" class="sr-only peer">
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-agri-orange/25 rounded-full peer peer-checked:after:
