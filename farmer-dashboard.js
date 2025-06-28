import { Chart } from "@/components/ui/chart"
// SmartSupply Agri - Farmer Dashboard JavaScript

// Global state management
const DashboardState = {
  currentPage: "dashboard",
  isLoading: false,
  notifications: [],
  messages: [],
  listings: [],
  orders: [],
  earnings: {
    total: 2847,
    thisMonth: 2847,
    lastMonth: 2156,
    growth: 15.3,
  },
}

// Sample data
const sampleListings = [
  {
    id: 1,
    name: "Organic Tomatoes",
    category: "vegetables",
    quantity: 100,
    unit: "kg",
    price: 4.99,
    harvestDate: "2024-12-20",
    status: "active",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop",
    views: 156,
    orders: 8,
  },
  {
    id: 2,
    name: "Fresh Carrots",
    category: "vegetables",
    quantity: 75,
    unit: "kg",
    price: 3.49,
    harvestDate: "2024-12-18",
    status: "active",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop",
    views: 89,
    orders: 5,
  },
  {
    id: 3,
    name: "Organic Lettuce",
    category: "vegetables",
    quantity: 50,
    unit: "kg",
    price: 2.99,
    harvestDate: "2024-12-22",
    status: "pending",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=200&fit=crop",
    views: 34,
    orders: 2,
  },
]

const sampleOrders = [
  {
    id: "ORD-001",
    product: "Organic Tomatoes",
    customer: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    quantity: "5 kg",
    amount: 24.99,
    status: "in_transit",
    date: "2024-12-15",
    deliveryAddress: "123 Main St, Accra",
    logistics: "SmartSupply Logistics",
  },
  {
    id: "ORD-002",
    product: "Fresh Carrots",
    customer: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    quantity: "3 kg",
    amount: 18.5,
    status: "pending_pickup",
    date: "2024-12-15",
    deliveryAddress: "456 Oak Ave, Kumasi",
    logistics: "SmartSupply Logistics",
  },
  {
    id: "ORD-003",
    product: "Organic Lettuce",
    customer: "Emma Davis",
    customerEmail: "emma.davis@email.com",
    quantity: "2 kg",
    amount: 12.75,
    status: "delivered",
    date: "2024-12-14",
    deliveryAddress: "789 Pine Rd, Tamale",
    logistics: "SmartSupply Logistics",
  },
]

const sampleMessages = [
  {
    id: 1,
    customer: "Sarah Johnson",
    orderId: "ORD-001",
    lastMessage: "When will my tomatoes be delivered?",
    timestamp: "2024-12-15T10:30:00Z",
    unread: true,
    avatar: "SJ",
  },
  {
    id: 2,
    customer: "Mike Chen",
    orderId: "ORD-002",
    lastMessage: "Thank you for the fresh carrots!",
    timestamp: "2024-12-15T09:15:00Z",
    unread: false,
    avatar: "MC",
  },
]

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌾 SmartSupply Agri Farmer Dashboard - Initializing...")
  initializeDashboard()
})

// Main dashboard initialization
function initializeDashboard() {
  try {
    // Initialize core functionality
    initializeSidebar()
    initializeNavigation()
    initializeCharts()
    initializeModals()
    initializeFileUpload()

    // Load initial data
    DashboardState.listings = sampleListings
    DashboardState.orders = sampleOrders
    DashboardState.messages = sampleMessages

    console.log("✅ Farmer Dashboard initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing dashboard:", error)
    showToast("Failed to initialize dashboard. Please refresh the page.", "error")
  }
}

// Sidebar functionality
function initializeSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebarClose = document.getElementById("sidebar-close")
  const sidebar = document.getElementById("sidebar")
  const sidebarOverlay = document.getElementById("sidebar-overlay")

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full")
    sidebarOverlay.classList.remove("hidden")
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full")
    sidebarOverlay.classList.add("hidden")
  }

  sidebarToggle?.addEventListener("click", openSidebar)
  sidebarClose?.addEventListener("click", closeSidebar)
  sidebarOverlay?.addEventListener("click", closeSidebar)

  // Navigation items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const page = item.getAttribute("data-page")
      if (page) {
        navigateToPage(page)
        if (window.innerWidth < 1024) {
          closeSidebar()
        }
      }
    })
  })
}

// Navigation system
function initializeNavigation() {
  updateNavigationState("dashboard")
}

function navigateToPage(pageName) {
  console.log(`🔄 Navigating to: ${pageName}`)

  // Update navigation state
  updateNavigationState(pageName)

  // Show/hide content
  const dashboardContent = document.getElementById("dashboard-content")
  const dynamicContent = document.getElementById("dynamic-content")

  if (pageName === "dashboard") {
    dashboardContent.classList.remove("hidden")
    dynamicContent.classList.add("hidden")
  } else {
    dashboardContent.classList.add("hidden")
    dynamicContent.classList.remove("hidden")
    loadPageContent(pageName)
  }

  // Update breadcrumb
  const breadcrumb = document.getElementById("breadcrumb-current")
  if (breadcrumb) {
    breadcrumb.textContent = getPageTitle(pageName)
  }

  DashboardState.currentPage = pageName
}

function updateNavigationState(currentPage) {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    const page = item.getAttribute("data-page")
    if (page === currentPage) {
      item.classList.remove("text-gray-700")
      item.classList.add("text-agri-deep", "bg-agri-sage")
    } else {
      item.classList.remove("text-agri-deep", "bg-agri-sage")
      item.classList.add("text-gray-700")
    }
  })
}

function getPageTitle(pageName) {
  const titles = {
    dashboard: "Dashboard",
    listings: "My Listings",
    orders: "Orders",
    earnings: "Earnings",
    messages: "Messages",
    analytics: "Analytics",
    profile: "Profile Settings",
  }
  return titles[pageName] || pageName
}

// Load page content
function loadPageContent(pageName) {
  const dynamicContent = document.getElementById("dynamic-content")

  switch (pageName) {
    case "listings":
      dynamicContent.innerHTML = getListingsPageContent()
      initializeListingsPage()
      break
    case "orders":
      dynamicContent.innerHTML = getOrdersPageContent()
      initializeOrdersPage()
      break
    case "earnings":
      dynamicContent.innerHTML = getEarningsPageContent()
      initializeEarningsPage()
      break
    case "messages":
      dynamicContent.innerHTML = getMessagesPageContent()
      initializeMessagesPage()
      break
    case "analytics":
      dynamicContent.innerHTML = getAnalyticsPageContent()
      initializeAnalyticsPage()
      break
    case "profile":
      dynamicContent.innerHTML = getProfilePageContent()
      initializeProfilePage()
      break
    default:
      dynamicContent.innerHTML = '<div class="p-6"><h1 class="text-2xl font-bold">Page not found</h1></div>'
  }
}

// Initialize charts
function initializeCharts() {
  // Earnings Chart
  const earningsCtx = document.getElementById("earningsChart")
  if (earningsCtx) {
    new Chart(earningsCtx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Earnings ($)",
            data: [650, 890, 1200, 1107],
            borderColor: "#17593D",
            backgroundColor: "rgba(23, 89, 61, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }
}

// Modal functionality
function initializeModals() {
  // Add listing form submission
  const addListingForm = document.getElementById("add-listing-form")
  if (addListingForm) {
    addListingForm.addEventListener("submit", handleAddListing)
  }
}

// File upload functionality
function initializeFileUpload() {
  const fileInput = document.getElementById("product-images")
  const uploadArea = document.querySelector(".file-upload-area")
  const imagePreview = document.getElementById("image-preview")

  if (!fileInput || !uploadArea || !imagePreview) return

  // Drag and drop functionality
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const files = e.dataTransfer.files
    handleFileSelection(files)
  })

  fileInput.addEventListener("change", (e) => {
    handleFileSelection(e.target.files)
  })

  function handleFileSelection(files) {
    imagePreview.innerHTML = ""
    imagePreview.classList.remove("hidden")

    Array.from(files)
      .slice(0, 5)
      .forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const imageContainer = document.createElement("div")
            imageContainer.className = "relative"
            imageContainer.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}" class="w-full h-24 object-cover rounded-lg">
                        <button type="button" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600" onclick="removeImage(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    `
            imagePreview.appendChild(imageContainer)
          }
          reader.readAsDataURL(file)
        }
      })
  }
}

// Modal functions
function showAddListing() {
  const modal = document.getElementById("add-listing-modal")
  if (modal) {
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }
}

function hideAddListing() {
  const modal = document.getElementById("add-listing-modal")
  if (modal) {
    modal.classList.add("hidden")
    document.body.style.overflow = ""
    // Reset form
    const form = document.getElementById("add-listing-form")
    if (form) form.reset()
    const imagePreview = document.getElementById("image-preview")
    if (imagePreview) {
      imagePreview.innerHTML = ""
      imagePreview.classList.add("hidden")
    }
  }
}

function handleAddListing(e) {
  e.preventDefault()

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Creating..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    hideAddListing()
    showToast("🌱 Listing created successfully!", "success")

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false

    // Refresh listings if on listings page
    if (DashboardState.currentPage === "listings") {
      navigateToPage("listings")
    }
  }, 2000)
}

function removeImage(button) {
  button.parentElement.remove()
  const imagePreview = document.getElementById("image-preview")
  if (imagePreview && imagePreview.children.length === 0) {
    imagePreview.classList.add("hidden")
  }
}

// Notification and message functions
function showNotifications() {
  showToast("📢 You have 3 new notifications", "info")
}

function showMessages() {
  navigateToPage("messages")
}

function showOrders() {
  navigateToPage("orders")
}

function showProfileMenu() {
  // Toggle profile dropdown menu
  showToast("👤 Profile menu clicked", "info")
}

function showBulkUpload() {
  showToast("📤 Bulk upload feature coming soon!", "info")
}

// Toast notification system
function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 transform translate-x-full transition-transform duration-300 ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : type === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500"
  }`
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.remove("translate-x-full")
  }, 100)

  setTimeout(() => {
    toast.classList.add("translate-x-full")
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

// Page content generators
function getListingsPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
                    <p class="text-gray-600">Manage your product listings and inventory</p>
                </div>
                <button onclick="showAddListing()" class="bg-agri-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-agri-orange-mid transition-colors">
                    <i class="fas fa-plus mr-2"></i>
                    Add New Listing
                </button>
            </div>

            <!-- Listings Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total Listings</p>
                            <p class="text-2xl font-bold text-gray-900">12</p>
                        </div>
                        <div class="w-12 h-12 bg-agri-sage rounded-lg flex items-center justify-center">
                            <i class="fas fa-seedling text-agri-deep"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Active</p>
                            <p class="text-2xl font-bold text-green-600">8</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-check-circle text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Pending</p>
                            <p class="text-2xl font-bold text-yellow-600">3</p>
                        </div>
                        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-clock text-yellow-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total Views</p>
                            <p class="text-2xl font-bold text-blue-600">1,247</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-eye text-blue-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Listings Grid -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-gray-900">Product Listings</h2>
                        <div class="flex items-center space-x-4">
                            <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option>All Categories</option>
                                <option>Vegetables</option>
                                <option>Fruits</option>
                                <option>Grains</option>
                            </select>
                            <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Pending</option>
                                <option>Paused</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        ${DashboardState.listings
                          .map(
                            (listing) => `
                            <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <img src="${listing.image}" alt="${listing.name}" class="w-full h-48 object-cover">
                                <div class="p-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <h3 class="font-semibold text-gray-900">${listing.name}</h3>
                                        <span class="status-badge ${listing.status === "active" ? "status-active" : "status-pending"}">${listing.status}</span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-3">${listing.quantity} ${listing.unit} • $${listing.price}/${listing.unit}</p>
                                    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span><i class="fas fa-eye mr-1"></i>${listing.views} views</span>
                                        <span><i class="fas fa-shopping-cart mr-1"></i>${listing.orders} orders</span>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button class="flex-1 bg-agri-deep text-white py-2 px-3 rounded text-sm hover:bg-agri-light transition-colors">
                                            Edit
                                        </button>
                                        <button class="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                                            ${listing.status === "active" ? "Pause" : "Activate"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </div>
    `
}

function getOrdersPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
                    <p class="text-gray-600">Track and manage your customer orders</p>
                </div>
                <div class="flex space-x-4">
                    <select class="border border-gray-300 rounded-lg px-4 py-2">
                        <option>All Orders</option>
                        <option>Pending Pickup</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                    </select>
                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                        <i class="fas fa-download mr-2"></i>
                        Export
                    </button>
                </div>
            </div>

            <!-- Order Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total Orders</p>
                            <p class="text-2xl font-bold text-gray-900">47</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-shopping-cart text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Pending Pickup</p>
                            <p class="text-2xl font-bold text-yellow-600">8</p>
                        </div>
                        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-clock text-yellow-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">In Transit</p>
                            <p class="text-2xl font-bold text-blue-600">12</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-truck text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Delivered</p>
                            <p class="text-2xl font-bold text-green-600">27</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-check-circle text-green-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Order ID</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Product</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Customer</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Quantity</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Amount</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Logistics</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DashboardState.orders
                              .map(
                                (order) => `
                                <tr class="border-b border-gray-100 hover:bg-gray-50">
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900">${order.id}</td>
                                    <td class="py-4 px-6 text-sm text-gray-700">${order.product}</td>
                                    <td class="py-4 px-6 text-sm text-gray-700">${order.customer}</td>
                                    <td class="py-4 px-6 text-sm text-gray-700">${order.quantity}</td>
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900">$${order.amount}</td>
                                    <td class="py-4 px-6">
                                        <span class="status-badge ${getStatusClass(order.status)}">${formatStatus(order.status)}</span>
                                    </td>
                                    <td class="py-4 px-6 text-sm text-gray-700">
                                        <div class="flex items-center space-x-2">
                                            <i class="fas fa-truck text-agri-deep"></i>
                                            <span>${order.logistics}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-6">
                                        <button onclick="viewOrderDetails('${order.id}')" class="text-agri-deep hover:text-agri-light text-sm font-medium">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getEarningsPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
                    <p class="text-gray-600">Track your income and payment history</p>
                </div>
                <div class="flex space-x-4">
                    <select class="border border-gray-300 rounded-lg px-4 py-2">
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>This year</option>
                    </select>
                    <button class="bg-agri-deep text-white px-6 py-2 rounded-lg hover:bg-agri-light transition-colors">
                        <i class="fas fa-download mr-2"></i>
                        Download Report
                    </button>
                </div>
            </div>

            <!-- Earnings Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Total Earnings</h3>
                        <i class="fas fa-dollar-sign text-2xl text-green-600"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-2">$${DashboardState.earnings.total.toLocaleString()}</p>
                    <p class="text-sm text-green-600">+${DashboardState.earnings.growth}% from last month</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">This Month</h3>
                        <i class="fas fa-calendar text-2xl text-blue-600"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-2">$${DashboardState.earnings.thisMonth.toLocaleString()}</p>
                    <p class="text-sm text-gray-600">15 orders completed</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Pending Payout</h3>
                        <i class="fas fa-clock text-2xl text-yellow-600"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-2">$456.75</p>
                    <p class="text-sm text-gray-600">Next payout: Dec 20, 2024</p>
                </div>
            </div>

            <!-- Earnings Chart -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Earnings Trend</h3>
                <div class="chart-container">
                    <canvas id="earningsDetailChart"></canvas>
                </div>
            </div>

            <!-- Payment History -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Payment History</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Date</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Order ID</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Product</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Gross Amount</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Commission</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Net Amount</th>
                                <th class="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-100">
                                <td class="py-4 px-6 text-sm text-gray-700">Dec 14, 2024</td>
                                <td class="py-4 px-6 text-sm font-medium text-gray-900">ORD-003</td>
                                <td class="py-4 px-6 text-sm text-gray-700">Organic Lettuce</td>
                                <td class="py-4 px-6 text-sm text-gray-900">$12.75</td>
                                <td class="py-4 px-6 text-sm text-gray-600">$1.91 (15%)</td>
                                <td class="py-4 px-6 text-sm font-medium text-green-600">$10.84</td>
                                <td class="py-4 px-6">
                                    <span class="status-badge status-active">Paid</span>
                                </td>
                            </tr>
                            <tr class="border-b border-gray-100">
                                <td class="py-4 px-6 text-sm text-gray-700">Dec 13, 2024</td>
                                <td class="py-4 px-6 text-sm font-medium text-gray-900">ORD-002</td>
                                <td class="py-4 px-6 text-sm text-gray-700">Fresh Carrots</td>
                                <td class="py-4 px-6 text-sm text-gray-900">$18.50</td>
                                <td class="py-4 px-6 text-sm text-gray-600">$2.78 (15%)</td>
                                <td class="py-4 px-6 text-sm font-medium text-green-600">$15.72</td>
                                <td class="py-4 px-6">
                                    <span class="status-badge status-active">Paid</span>
                                </td>
                            </tr>
                            <tr class="border-b border-gray-100">
                                <td class="py-4 px-6 text-sm text-gray-700">Dec 15, 2024</td>
                                <td class="py-4 px-6 text-sm font-medium text-gray-900">ORD-001</td>
                                <td class="py-4 px-6 text-sm text-gray-700">Organic Tomatoes</td>
                                <td class="py-4 px-6 text-sm text-gray-900">$24.99</td>
                                <td class="py-4 px-6 text-sm text-gray-600">$3.75 (15%)</td>
                                <td class="py-4 px-6 text-sm font-medium text-yellow-600">$21.24</td>
                                <td class="py-4 px-6">
                                    <span class="status-badge status-pending">Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getMessagesPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                    <p class="text-gray-600">Communicate with your customers</p>
                </div>
                <button class="bg-agri-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-agri-orange-mid transition-colors">
                    <i class="fas fa-plus mr-2"></i>
                    New Message
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Message List -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-sm">
                        <div class="p-4 border-b border-gray-200">
                            <div class="relative">
                                <input type="text" placeholder="Search messages..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        <div class="divide-y divide-gray-200">
                            ${DashboardState.messages
                              .map(
                                (message) => `
                                <div class="p-4 hover:bg-gray-50 cursor-pointer ${message.unread ? "bg-blue-50" : ""}" onclick="openMessage('${message.id}')">
                                    <div class="flex items-start space-x-3">
                                        <div class="user-avatar">
                                            ${message.avatar}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between">
                                                <p class="text-sm font-medium text-gray-900">${message.customer}</p>
                                                ${message.unread ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ""}
                                            </div>
                                            <p class="text-xs text-gray-500 mb-1">Order: ${message.orderId}</p>
                                            <p class="text-sm text-gray-600 truncate">${message.lastMessage}</p>
                                            <p class="text-xs text-gray-400 mt-1">${formatMessageTime(message.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>

                <!-- Message Detail -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-sm h-96 flex flex-col">
                        <div class="p-4 border-b border-gray-200">
                            <div class="flex items-center space-x-3">
                                <div class="user-avatar">SJ</div>
                                <div>
                                    <h3 class="font-medium text-gray-900">Sarah Johnson</h3>
                                    <p class="text-sm text-gray-500">Order: ORD-001 • Organic Tomatoes</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 p-4 overflow-y-auto">
                            <div class="space-y-4">
                                <div class="message-bubble message-received">
                                    <p class="text-sm">Hi! I placed an order for organic tomatoes. When will they be delivered?</p>
                                    <p class="text-xs opacity-70 mt-1">10:30 AM</p>
                                </div>
                                <div class="message-bubble message-sent">
                                    <p class="text-sm">Hello Sarah! Thank you for your order. SmartSupply Logistics will pick up your tomatoes today and deliver them tomorrow by 2 PM.</p>
                                    <p class="text-xs opacity-70 mt-1">10:45 AM</p>
                                </div>
                                <div class="message-bubble message-received">
                                    <p class="text-sm">Perfect! Thank you for the quick response. Looking forward to receiving them.</p>
                                    <p class="text-xs opacity-70 mt-1">10:47 AM</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 border-t border-gray-200">
                            <div class="flex space-x-3">
                                <input type="text" placeholder="Type your message..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                <button class="bg-agri-deep text-white px-4 py-2 rounded-lg hover:bg-agri-light transition-colors">
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

function getAnalyticsPageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                    <p class="text-gray-600">Insights into your farm's performance</p>
                </div>
                <select class="border border-gray-300 rounded-lg px-4 py-2">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                </select>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">Total Revenue</h3>
                        <i class="fas fa-dollar-sign text-green-600"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">$12,847</p>
                    <p class="text-sm text-green-600 mt-1">+23.5% vs last period</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">Orders Completed</h3>
                        <i class="fas fa-check-circle text-blue-600"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">127</p>
                    <p class="text-sm text-blue-600 mt-1">+18.2% vs last period</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">Average Order Value</h3>
                        <i class="fas fa-chart-line text-purple-600"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">$101.15</p>
                    <p class="text-sm text-purple-600 mt-1">+4.8% vs last period</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">Customer Rating</h3>
                        <i class="fas fa-star text-yellow-600"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">4.8</p>
                    <p class="text-sm text-yellow-600 mt-1">Based on 89 reviews</p>
                </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Sales Performance</h3>
                    <div class="chart-container">
                        <canvas id="salesPerformanceChart"></canvas>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=50&h=50&fit=crop" alt="Tomatoes" class="w-10 h-10 rounded-lg object-cover">
                                <div>
                                    <p class="font-medium text-gray-900">Organic Tomatoes</p>
                                    <p class="text-sm text-gray-500">23 orders</p>
                                </div>
                            </div>
                            <span class="text-sm font-medium text-green-600">$574.77</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?w=50&h=50&fit=crop" alt="Carrots" class="w-10 h-10 rounded-lg object-cover">
                                <div>
                                    <p class="font-medium text-gray-900">Fresh Carrots</p>
                                    <p class="text-sm text-gray-500">18 orders</p>
                                </div>
                            </div>
                            <span class="text-sm font-medium text-green-600">$348.50</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=50&h=50&fit=crop" alt="Lettuce" class="w-10 h-10 rounded-lg object-cover">
                                <div>
                                    <p class="font-medium text-gray-900">Organic Lettuce</p>
                                    <p class="text-sm text-gray-500">15 orders</p>
                                </div>
                            </div>
                            <span class="text-sm font-medium text-green-600">$191.25</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Insights -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-2xl text-blue-600"></i>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">89</p>
                        <p class="text-sm text-gray-600">Total Customers</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-redo text-2xl text-green-600"></i>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">67%</p>
                        <p class="text-sm text-gray-600">Repeat Customers</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-heart text-2xl text-purple-600"></i>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">4.8</p>
                        <p class="text-sm text-gray-600">Avg. Rating</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function getProfilePageContent() {
  return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                    <p class="text-gray-600">Manage your farm profile and account settings</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <!-- Profile Form -->
                <div class="xl:col-span-2 space-y-6">
                    <!-- Basic Information -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
                        <form class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" value="John" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" value="Doe" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" value="john.doe@email.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input type="tel" value="+233 24 123 4567" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Farm Information -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Farm Information</h3>
                        <form class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                                <input type="text" value="Green Valley Farm" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Description</label>
                                <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">We are a family-owned organic farm specializing in fresh vegetables and fruits. Our commitment to sustainable farming practices ensures the highest quality produce for our customers.</textarea>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres)</label>
                                    <input type="number" value="25" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                                    <input type="number" value="12" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
                                <input type="text" value="Ashanti Region, Ghana" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                            </div>
                        </form>
                    </div>

                    <!-- Payment Settings -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h3>
                        <form class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Method</label>
                                <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    <option>Mobile Money (MTN)</option>
                                    <option>Mobile Money (Vodafone)</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Money Number</label>
                                <input type="tel" value="+233 24 123 4567" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                                <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                    <option>Weekly (Fridays)</option>
                                    <option>Bi-weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <!-- Security Settings -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                        <form class="space-y-6">
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
                        </form>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end space-x-4">
                        <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button class="px-6 py-3 bg-agri-deep text-white rounded-lg hover:bg-agri-light transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>

                <!-- Profile Sidebar -->
                <div class="space-y-6">
                    <!-- Profile Picture -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h3>
                        <div class="text-center">
                            <div class="w-32 h-32 bg-agri-deep rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-4xl font-bold text-white">JD</span>
                            </div>
                            <button class="bg-agri-orange text-white px-4 py-2 rounded-lg hover:bg-agri-orange-mid transition-colors">
                                Upload New Photo
                            </button>
                            <p class="text-xs text-gray-500 mt-2">JPG, PNG up to 2MB</p>
                        </div>
                    </div>

                    <!-- Account Status -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Account Status</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Email Verified</span>
                                <span class="status-badge status-active">Verified</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Phone Verified</span>
                                <span class="status-badge status-active">Verified</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Farm Verified</span>
                                <span class="status-badge status-active">Verified</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Payment Setup</span>
                                <span class="status-badge status-active">Complete</span>
                            </div>
                        </div>
                    </div>

                    <!-- Notification Preferences -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Notifications</h3>
                        <div class="space-y-4">
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-3 text-agri-orange focus:ring-agri-orange">
                                <span class="text-sm text-gray-700">New orders</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-3 text-agri-orange focus:ring-agri-orange">
                                <span class="text-sm text-gray-700">Payment notifications</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-3 text-agri-orange focus:ring-agri-orange">
                                <span class="text-sm text-gray-700">Marketing emails</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-3 text-agri-orange focus:ring-agri-orange">
                                <span class="text-sm text-gray-700">SMS notifications</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Helper functions
function getStatusClass(status) {
  switch (status) {
    case "pending_pickup":
      return "status-pending"
    case "in_transit":
      return "status-processing"
    case "delivered":
      return "status-delivered"
    case "cancelled":
      return "status-cancelled"
    default:
      return "status-pending"
  }
}

function formatStatus(status) {
  switch (status) {
    case "pending_pickup":
      return "Pending Pickup"
    case "in_transit":
      return "In Transit"
    case "delivered":
      return "Delivered"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

function formatMessageTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

function viewOrderDetails(orderId) {
  showToast(`📋 Viewing details for order ${orderId}`, "info")
}

function openMessage(messageId) {
  showToast(`💬 Opening message ${messageId}`, "info")
}

// Page-specific initialization functions
function initializeListingsPage() {
  console.log("📋 Initializing listings page...")
}

function initializeOrdersPage() {
  console.log("📦 Initializing orders page...")
}

function initializeEarningsPage() {
  console.log("💰 Initializing earnings page...")

  // Initialize earnings detail chart
  setTimeout(() => {
    const ctx = document.getElementById("earningsDetailChart")
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Monthly Earnings",
              data: [1200, 1900, 3000, 2500, 2000, 2847],
              backgroundColor: "#17593D",
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      })
    }
  }, 100)
}

function initializeMessagesPage() {
  console.log("💬 Initializing messages page...")
}

function initializeAnalyticsPage() {
  console.log("📊 Initializing analytics page...")

  // Initialize analytics charts
  setTimeout(() => {
    const ctx = document.getElementById("salesPerformanceChart")
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Sales",
              data: [3200, 4100, 3800, 4500],
              borderColor: "#17593D",
              backgroundColor: "rgba(23, 89, 61, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      })
    }
  }, 100)
}

function initializeProfilePage() {
  console.log("👤 Initializing profile page...")
}

console.log("🌾 SmartSupply Agri Farmer Dashboard - JavaScript Loaded")
