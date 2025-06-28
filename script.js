// SmartSupply Agri - Enhanced Navigation System with Loading States and Services

// Global state management
const AppState = {
  currentPage: "home",
  isLoading: false,
  loadingTimeout: null,
  pageCache: new Map(),
  navigationHistory: ["home"],
  currentFilters: {
    equipment: { category: "", priceRange: "", availability: "" },
    delivery: { searchTerm: "" },
    farmers: { searchTerm: "" },
  },
}

// Performance optimization variables
let currentSlide = 0
const totalSlides = 5
let slideInterval

// Mock Data for Services
const ServicesData = {
  equipment: [
    {
      id: "eq001",
      name: "John Deere 5075E Tractor",
      category: "tractors",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Versatile utility tractor perfect for farming operations. 75HP engine with 4WD capability.",
      pricePerDay: 150,
      pricePerWeek: 900,
      availability: "available",
      specifications: ["75 HP Engine", "4WD", "Power Steering", "3-Point Hitch"],
      location: "Accra Central",
      owner: "AgriRent Ghana",
    },
    {
      id: "eq002",
      name: "Case IH Axial-Flow 250 Harvester",
      category: "harvesters",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "High-capacity combine harvester for efficient grain harvesting. Advanced cleaning system.",
      pricePerDay: 500,
      pricePerWeek: 3000,
      availability: "rented",
      specifications: ["350 HP", "Advanced Cleaning", "GPS Ready", "Large Grain Tank"],
      location: "Kumasi",
      owner: "Harvest Solutions Ltd",
    },
    {
      id: "eq003",
      name: "Massey Ferguson 3-Furrow Plow",
      category: "plows",
      image:
        "https://images.unsplash.com/photo-1592982736049-97ba5b43e1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Heavy-duty 3-furrow reversible plow for primary tillage operations.",
      pricePerDay: 75,
      pricePerWeek: 450,
      availability: "available",
      specifications: ["3-Furrow", "Reversible", "Heavy Duty", "Adjustable Width"],
      location: "Tamale",
      owner: "Northern Equipment Rental",
    },
    {
      id: "eq004",
      name: "Kubota M7060 Tractor",
      category: "tractors",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Compact utility tractor ideal for small to medium farms. Fuel efficient and reliable.",
      pricePerDay: 120,
      pricePerWeek: 720,
      availability: "available",
      specifications: ["70 HP Engine", "Hydrostatic Transmission", "Compact Design", "Low Fuel Consumption"],
      location: "Cape Coast",
      owner: "Coastal Farm Equipment",
    },
    {
      id: "eq005",
      name: "New Holland BR7060 Baler",
      category: "balers",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Round baler for hay and straw baling. Variable chamber technology for consistent bales.",
      pricePerDay: 200,
      pricePerWeek: 1200,
      availability: "maintenance",
      specifications: ["Variable Chamber", "Net Wrap", "Hydraulic Pickup", "Auto Lubrication"],
      location: "Sunyani",
      owner: "Brong Ahafo Equipment",
    },
  ],

  deliveryServices: [
    {
      id: "del001",
      companyName: "FreshMove Logistics",
      logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      serviceArea: "Greater Accra, Eastern Region",
      description: "Specialized in fresh produce delivery with temperature-controlled vehicles.",
      pricingStructure: "₵2.50 per km + ₵15 base fee",
      services: ["Refrigerated Transport", "Same-Day Delivery", "Bulk Orders", "Temperature Monitoring"],
      contact: {
        phone: "+233 24 123 4567",
        email: "info@freshmove.gh",
        address: "Tema Industrial Area",
      },
      rating: 4.8,
      reviews: 156,
      keywords: ["refrigerated", "fresh produce", "same-day", "temperature controlled"],
    },
    {
      id: "del002",
      companyName: "AgriTransport Solutions",
      logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      serviceArea: "Nationwide Coverage",
      description: "Long-distance agricultural transport services across Ghana.",
      pricingStructure: "₵1.80 per km (minimum 50km)",
      services: ["Long-Distance", "Bulk Transport", "Equipment Delivery", "Inter-Regional"],
      contact: {
        phone: "+233 20 987 6543",
        email: "logistics@agritransport.gh",
        address: "Kumasi Central",
      },
      rating: 4.6,
      reviews: 203,
      keywords: ["long-distance", "bulk", "nationwide", "equipment delivery"],
    },
    {
      id: "del003",
      companyName: "QuickFarm Delivery",
      logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      serviceArea: "Ashanti Region, Brong Ahafo",
      description: "Fast and reliable local delivery services for farmers and buyers.",
      pricingStructure: "Flat rate ₵25 within 20km",
      services: ["Local Delivery", "Express Service", "Scheduled Pickup", "Small Packages"],
      contact: {
        phone: "+233 26 555 7890",
        email: "support@quickfarm.gh",
        address: "Kumasi Tech Junction",
      },
      rating: 4.9,
      reviews: 89,
      keywords: ["local", "express", "fast", "scheduled pickup"],
    },
    {
      id: "del004",
      companyName: "Northern Cargo Express",
      logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      serviceArea: "Northern Region, Upper East, Upper West",
      description: "Specialized transport services for northern Ghana agricultural products.",
      pricingStructure: "₵2.00 per km + ₵20 handling fee",
      services: ["Regional Coverage", "Grain Transport", "Livestock Transport", "Storage Solutions"],
      contact: {
        phone: "+233 37 444 5678",
        email: "info@northerncargo.gh",
        address: "Tamale Central Market",
      },
      rating: 4.5,
      reviews: 134,
      keywords: ["northern", "grain", "livestock", "storage"],
    },
  ],

  farmers: [
    {
      id: "farm001",
      name: "John Mensah",
      farmName: "Golden Harvest Farm",
      location: "Eastern Region - Koforidua",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description:
        "Organic vegetable specialist with 15+ years experience. Certified organic farm producing premium quality vegetables.",
      specialties: ["Organic Vegetables", "Leafy Greens", "Root Vegetables"],
      certifications: ["Organic Certified", "GAP Certified"],
      contact: {
        phone: "+233 24 111 2222",
        email: "john@goldenharvest.gh",
        whatsapp: "+233 24 111 2222",
      },
      rating: 4.9,
      reviews: 127,
      totalProducts: 24,
      featuredProducts: [
        {
          id: "prod001",
          name: "Organic Tomatoes",
          price: 4.99,
          image:
            "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
        {
          id: "prod002",
          name: "Fresh Lettuce",
          price: 2.99,
          image:
            "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
        {
          id: "prod003",
          name: "Organic Carrots",
          price: 3.49,
          image:
            "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: false,
        },
      ],
      keywords: ["organic", "vegetables", "koforidua", "certified", "premium"],
    },
    {
      id: "farm002",
      name: "Sarah Osei",
      farmName: "Green Valley Organics",
      location: "Ashanti Region - Ejisu",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description:
        "Sustainable farming practices with focus on root vegetables and tubers. Family-owned farm for 3 generations.",
      specialties: ["Root Vegetables", "Tubers", "Traditional Crops"],
      certifications: ["Sustainable Farming", "Local Certified"],
      contact: {
        phone: "+233 20 333 4444",
        email: "sarah@greenvalley.gh",
        whatsapp: "+233 20 333 4444",
      },
      rating: 4.8,
      reviews: 89,
      totalProducts: 18,
      featuredProducts: [
        {
          id: "prod004",
          name: "Sweet Potatoes",
          price: 2.5,
          image:
            "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
        {
          id: "prod005",
          name: "Fresh Yam",
          price: 5.99,
          image:
            "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
      ],
      keywords: ["root vegetables", "tubers", "sustainable", "traditional", "ejisu"],
    },
    {
      id: "farm003",
      name: "Kwame Asante",
      farmName: "Sunshine Fruit Gardens",
      location: "Central Region - Cape Coast",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description:
        "Tropical fruit specialist with modern irrigation systems. Export quality fruits and innovative farming techniques.",
      specialties: ["Tropical Fruits", "Citrus", "Export Quality"],
      certifications: ["Export Certified", "HACCP Certified"],
      contact: {
        phone: "+233 33 555 6666",
        email: "kwame@sunshinefruits.gh",
        whatsapp: "+233 33 555 6666",
      },
      rating: 4.7,
      reviews: 156,
      totalProducts: 32,
      featuredProducts: [
        {
          id: "prod006",
          name: "Fresh Pineapples",
          price: 8.99,
          image:
            "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
        {
          id: "prod007",
          name: "Organic Oranges",
          price: 4.5,
          image:
            "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
      ],
      keywords: ["tropical fruits", "citrus", "export", "irrigation", "cape coast"],
    },
    {
      id: "farm004",
      name: "Akosua Boateng",
      farmName: "Northern Grains Cooperative",
      location: "Northern Region - Tamale",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description:
        "Large-scale grain production cooperative serving northern Ghana. Specializing in cereals and legumes.",
      specialties: ["Cereals", "Legumes", "Bulk Production"],
      certifications: ["Cooperative Certified", "Quality Assured"],
      contact: {
        phone: "+233 37 777 8888",
        email: "info@northerngrains.gh",
        whatsapp: "+233 37 777 8888",
      },
      rating: 4.6,
      reviews: 203,
      totalProducts: 15,
      featuredProducts: [
        {
          id: "prod008",
          name: "Premium Rice",
          price: 3.2,
          image:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
        {
          id: "prod009",
          name: "Dried Beans",
          price: 4.8,
          image:
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          inStock: true,
        },
      ],
      keywords: ["grains", "cereals", "legumes", "bulk", "cooperative", "tamale"],
    },
  ],
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 SmartSupply Agri - Application Starting...")
  initializeApp()
})

// Main application initialization
function initializeApp() {
  try {
    console.log("📋 Initializing application components...")

    // Ensure required DOM elements exist
    if (!document.getElementById("home-page") || !document.getElementById("dynamic-page")) {
      console.error("❌ Required page containers not found")
      showErrorMessage("Application containers not found. Please refresh the page.")
      return
    }

    // Initialize core functionality
    initializePage()
    initializeNavigation()
    startCountdown()
    initializeHeroSlider()
    initializeProductTabs()

    // Set initial page state
    updateNavigationState("home")

    // Update cart and wishlist counts
    updateCartAndWishlistCounts()

    console.log("✅ Application initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing application:", error)
    showErrorMessage("Failed to initialize application. Please refresh the page.")
  }
}

// Enhanced navigation system
function initializeNavigation() {
  console.log("🧭 Setting up navigation system...")

  // Add navigation state indicators
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    const page = link.getAttribute("data-page")
    if (page) {
      // Remove any existing event listeners
      link.removeEventListener("click", handleNavClick)
      link.addEventListener("click", handleNavClick)
    }
  })

  // Handle browser back/forward buttons
  window.addEventListener("popstate", (event) => {
    const page = event.state?.page || "home"
    navigateToPage(page, false) // Don't push to history again
  })

  // Set initial browser state
  history.replaceState({ page: "home" }, "", window.location.pathname)
  console.log("✅ Navigation system initialized")
}

// Separate click handler to prevent multiple bindings
function handleNavClick(e) {
  e.preventDefault()
  const page = e.currentTarget.getAttribute("data-page")
  if (page) {
    navigateToPage(page)
  }
}

// Enhanced page navigation with loading states and error handling (FIXED)
function navigateToPage(pageName, pushToHistory = true) {
  console.log(`🔄 Navigating to page: ${pageName}`)

  // Prevent navigation if already loading
  if (AppState.isLoading) {
    console.log("⏳ Navigation blocked - already loading")
    return Promise.resolve(false)
  }

  // Validate page name
  if (!isValidPage(pageName)) {
    console.error(`❌ Invalid page name: ${pageName}`)
    showErrorMessage(`Page "${pageName}" not found`)
    return Promise.resolve(false)
  }

  // Don't navigate if already on the same page
  if (AppState.currentPage === pageName) {
    console.log(`📍 Already on page: ${pageName}`)
    return Promise.resolve(true)
  }

  return new Promise((resolve, reject) => {
    try {
      // Start loading state
      setLoadingState(true)

      // Update browser history
      if (pushToHistory) {
        history.pushState({ page: pageName }, "", `#${pageName}`)
        AppState.navigationHistory.push(pageName)
      }

      // Simulate realistic loading time for better UX
      const loadingDelay = AppState.pageCache.has(pageName) ? 100 : 300

      AppState.loadingTimeout = setTimeout(() => {
        try {
          // Load page content
          const success = loadPageContent(pageName)

          if (!success) {
            throw new Error(`Failed to load page content for ${pageName}`)
          }

          // Update application state
          AppState.currentPage = pageName
          updateNavigationState(pageName)

          // Scroll to top smoothly
          window.scrollTo({ top: 0, behavior: "smooth" })

          // Close mobile menu if open
          closeMobileMenu()

          console.log(`✅ Successfully navigated to: ${pageName}`)

          // End loading state
          setLoadingState(false)

          // Show success feedback for non-home pages
          if (pageName !== "home") {
            showToast(`📄 ${getPageTitle(pageName)} loaded successfully`, "success")
          }

          resolve(true)
        } catch (error) {
          console.error(`❌ Error loading page ${pageName}:`, error)
          setLoadingState(false)
          showErrorMessage(`Failed to load ${pageName} page. Please try again.`)
          reject(error)
        }
      }, loadingDelay)
    } catch (error) {
      console.error(`❌ Navigation error for ${pageName}:`, error)
      setLoadingState(false)
      showErrorMessage("Navigation failed. Please try again.")
      reject(error)
    }
  })
}

// Loading state management (FIXED)
function setLoadingState(isLoading) {
  AppState.isLoading = isLoading

  // Create loading overlay if it doesn't exist
  let loadingOverlay = document.getElementById("loading-overlay")
  if (!loadingOverlay) {
    loadingOverlay = createLoadingOverlay()
  }

  if (isLoading) {
    console.log("⏳ Setting loading state: ON")
    loadingOverlay.classList.remove("hidden")
    document.body.style.overflow = "hidden" // Prevent scrolling during load
  } else {
    console.log("✅ Setting loading state: OFF")
    loadingOverlay.classList.add("hidden")
    document.body.style.overflow = "" // Restore scrolling

    // Clear any existing timeout
    if (AppState.loadingTimeout) {
      clearTimeout(AppState.loadingTimeout)
      AppState.loadingTimeout = null
    }
  }
}

// Create loading overlay if it doesn't exist
function createLoadingOverlay() {
  const overlay = document.createElement("div")
  overlay.id = "loading-overlay"
  overlay.className = "fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 hidden"
  overlay.innerHTML = `
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-deep mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  `
  document.body.appendChild(overlay)
  return overlay
}

// Page validation - Enhanced with new service pages
function isValidPage(pageName) {
  const validPages = [
    "home",
    "about",
    "contact",
    "login",
    "register",
    "faq",
    "blog",
    "privacy",
    "marketplace",
    "coming-soon",
    "farmers",
    "product",
    "cart",
    "wishlist",
    // New service pages
    "equipment-rental",
    "delivery-services",
    "farmer-storefronts",
    "farmer-store",
  ]
  return validPages.includes(pageName)
}

// Get page title for display - Enhanced with new service pages
function getPageTitle(pageName) {
  const titles = {
    home: "Home",
    about: "About Us",
    contact: "Contact",
    login: "Login",
    register: "Register",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacy Policy",
    marketplace: "Marketplace",
    "coming-soon": "Coming Soon",
    farmers: "Farmers",
    product: "Product Details",
    cart: "Shopping Cart",
    wishlist: "My Wishlist",
    // New service pages
    "equipment-rental": "Equipment Rental",
    "delivery-services": "Delivery Services",
    "farmer-storefronts": "Farmer Storefronts",
    "farmer-store": "Farmer Store",
  }
  return titles[pageName] || pageName
}

// Update navigation visual state
function updateNavigationState(currentPage) {
  // Update navigation link states
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    const page = link.getAttribute("data-page")
    if (page === currentPage) {
      link.classList.add("text-agri-deep", "font-bold")
      link.classList.remove("text-gray-700")
    } else {
      link.classList.remove("text-agri-deep", "font-bold")
      link.classList.add("text-gray-700")
    }
  })

  // Update page title
  document.title = `${getPageTitle(currentPage)} - SmartSupply Agri`
}

// Enhanced page content loading with caching (FIXED)
function loadPageContent(pageName) {
  console.log(`📄 Loading content for: ${pageName}`)

  const homePageElement = document.getElementById("home-page")
  const dynamicPageElement = document.getElementById("dynamic-page")

  if (!homePageElement || !dynamicPageElement) {
    console.error("Required page containers not found")
    return false
  }

  try {
    if (pageName === "home") {
      // Show home page, hide dynamic content
      homePageElement.classList.add("active")
      homePageElement.style.display = "block"
      dynamicPageElement.classList.remove("active")
      dynamicPageElement.style.display = "none"

      // Reinitialize home page components
      setTimeout(() => {
        initializeHeroSlider()
        updateCartAndWishlistCounts()
      }, 100)
    } else {
      // Hide home page, show dynamic content
      homePageElement.classList.remove("active")
      homePageElement.style.display = "none"
      dynamicPageElement.classList.add("active")
      dynamicPageElement.style.display = "block"

      // Load page content (with caching)
      let content = AppState.pageCache.get(pageName)
      if (!content) {
        content = generatePageContent(pageName)
        if (!content) {
          throw new Error(`No content generated for page: ${pageName}`)
        }
        AppState.pageCache.set(pageName, content)
        console.log(`💾 Cached content for: ${pageName}`)
      } else {
        console.log(`🔄 Using cached content for: ${pageName}`)
      }

      dynamicPageElement.innerHTML = content

      // Initialize page-specific functionality
      setTimeout(() => {
        initializePageSpecificFeatures(pageName)
      }, 50)
    }
    return true
  } catch (error) {
    console.error(`Error loading page content for ${pageName}:`, error)
    return false
  }
}

// Generate page content based on page name - Enhanced with new service pages and restored original pages
function generatePageContent(pageName) {
  try {
    switch (pageName) {
      case "about":
        return getAboutPageContent()
      case "contact":
        return getContactPageContent()
      case "login":
        return getLoginPageContent()
      case "register":
        return getRegisterPageContent()
      case "faq":
        return getFAQPageContent()
      case "blog":
        return getBlogPageContent()
      case "privacy":
        return getPrivacyPageContent()
      case "marketplace":
        return getMarketplacePageContent()
      case "coming-soon":
        return getComingSoonPageContent()
      case "farmers":
        return getFarmersPageContent()
      case "product":
        return getProductPageContent()
      case "cart":
        return getCartPageContent()
      case "wishlist":
        return getWishlistPageContent()
      // New service pages
      case "equipment-rental":
        return getEquipmentRentalPageContent()
      case "delivery-services":
        return getDeliveryServicesPageContent()
      case "farmer-storefronts":
        return getFarmerStorefrontsPageContent()
      case "farmer-store":
        return getFarmerStorePageContent()
      default:
        return getNotFoundPageContent()
    }
  } catch (error) {
    console.error(`Error generating content for ${pageName}:`, error)
    return getNotFoundPageContent()
  }
}

// Initialize page-specific features after content load - Enhanced with new service pages
function initializePageSpecificFeatures(pageName) {
  console.log(`🔧 Initializing features for: ${pageName}`)

  try {
    switch (pageName) {
      case "faq":
        initializeFAQToggles()
        break
      case "contact":
        initializeContactForm()
        break
      case "login":
        initializeLoginForm()
        break
      case "register":
        initializeRegisterForm()
        break
      case "marketplace":
        initializeMarketplaceFeatures()
        break
      case "product":
        initializeProductPageFeatures()
        break
      case "cart":
        initializeCartPageFeatures()
        break
      case "wishlist":
        initializeWishlistPageFeatures()
        break
      // New service pages
      case "equipment-rental":
        initializeEquipmentRentalFeatures()
        break
      case "delivery-services":
        initializeDeliveryServicesFeatures()
        break
      case "farmer-storefronts":
        initializeFarmerStorefrontsFeatures()
        break
      case "farmer-store":
        initializeFarmerStoreFeatures()
        break
    }
  } catch (error) {
    console.error(`Error initializing features for ${pageName}:`, error)
  }
}

// RESTORED ORIGINAL PAGE CONTENT FUNCTIONS

// About Page Content (Enhanced)
function getAboutPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">About Us</span>
            </nav>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                 alt="Agricultural landscape" 
                 class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-agri-deep/80"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10 text-center text-white">
            <div class="max-w-3xl mx-auto">
                <h1 class="text-5xl font-bold mb-6">We believe we can all make a difference.</h1>
                <p class="text-xl leading-relaxed">
                    Together, we can create positive change by making mindful choices and taking actions that benefit our communities and the world around us. Every effort counts, and your contribution matters.
                </p>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                         alt="Experienced agricultural team" 
                         class="rounded-2xl shadow-lg">
                </div>
                <div>
                    <div class="inline-block bg-agri-orange text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        OUR TEAM
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">Experienced and Hardworking Team</h2>
                    <p class="text-gray-600 leading-relaxed mb-6">
                        Our dedicated team of agricultural experts, technology specialists, and community advocates work tirelessly to connect farmers with buyers across Ghana. With decades of combined experience in agriculture, logistics, and digital platforms, we understand the unique challenges facing our agricultural community.
                    </p>
                    <p class="text-gray-600 leading-relaxed">
                        From farm to table, we ensure quality, freshness, and fair pricing for everyone in our marketplace ecosystem.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20 bg-agri-sage">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div class="text-4xl font-bold text-agri-deep mb-2">100+</div>
                    <div class="text-gray-600 font-medium">FARMS</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-agri-deep mb-2">4,000+</div>
                    <div class="text-gray-600 font-medium">PRODUCTS</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-agri-deep mb-2">14,000+</div>
                    <div class="text-gray-600 font-medium">CUSTOMERS</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-agri-deep mb-2">8</div>
                    <div class="text-gray-600 font-medium">REGIONS</div>
                </div>
            </div>
        </div>
    </section>
  `
}

// Contact Page Content (Fully Restored)
function getContactPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Contact</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Contact Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h1>
                        
                        <form class="space-y-6" id="contact-form">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input type="text" id="name" name="name" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                           placeholder="Your full name" required>
                                </div>
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input type="tel" id="phone" name="phone" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                           placeholder="Your phone number">
                                </div>
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" id="email" name="email" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                       placeholder="your.email@example.com" required>
                            </div>
                            
                            <div>
                                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input type="text" id="subject" name="subject" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                       placeholder="What is this about?" required>
                            </div>
                            
                            <div>
                                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea id="message" name="message" rows="6" 
                                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                          placeholder="Tell us more about your inquiry..." required></textarea>
                            </div>
                            
                            <button type="submit" 
                                    class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                Submit Now
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="space-y-8">
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h2 class="text-xl font-semibold text-gray-800 mb-6">Support Contact</h2>
                        
                        <div class="space-y-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-10 h-10 bg-agri-sage rounded-full flex items-center justify-center">
                                    <i class="fas fa-phone text-agri-deep"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 mb-1">Phone</h3>
                                    <p class="text-gray-600">Mobile: <span class="font-medium">+(233) 872-670-780</span></p>
                                    <p class="text-gray-600">Mobile: <span class="font-medium">+(233) 422-655-793</span></p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4">
                                <div class="w-10 h-10 bg-agri-sage rounded-full flex items-center justify-center">
                                    <i class="fas fa-envelope text-agri-deep"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 mb-1">Email</h3>
                                    <p class="text-gray-600">info@smartsupplyagri.com</p>
                                    <p class="text-gray-600">contact@smartsupplyagri.com</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4">
                                <div class="w-10 h-10 bg-agri-sage rounded-full flex items-center justify-center">
                                    <i class="fas fa-map-marker-alt text-agri-deep"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 mb-1">Location</h3>
                                    <p class="text-gray-600">Accra Central Market,<br>Accra, Ghana - 00233</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Business Hours -->
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h2 class="text-xl font-semibold text-gray-800 mb-6">Business Hours</h2>
                        
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Monday - Friday</span>
                                <span class="font-medium text-gray-800">8:00 AM - 6:00 PM</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Saturday</span>
                                <span class="font-medium text-gray-800">9:00 AM - 4:00 PM</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Sunday</span>
                                <span class="font-medium text-gray-800">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  `
}

// Login Page Content (Fully Restored)
function getLoginPageContent() {
  return `
    <!-- Main Content -->
    <main class="min-h-screen flex items-center justify-center py-16 bg-gray-50">
        <div class="max-w-md w-full mx-4">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-agri-deep rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-leaf text-white text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p class="text-gray-600 mt-2">Sign in to your SmartSupply Agri account</p>
                </div>

                <!-- Login Form -->
                <form class="space-y-6" id="login-form">
                    <div>
                        <label for="login-email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="login-email" name="email" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                               placeholder="smartsupply@user.com"
                               value="smartsupply@user.com" required>
                    </div>
                    
                    <div>
                        <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="login-password" name="password" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent pr-12"
                                   placeholder="••••••" required>
                            <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input type="checkbox" id="remember" name="remember" 
                                   class="w-4 h-4 text-agri-orange border-gray-300 rounded focus:ring-agri-orange">
                            <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
                        </div>
                        <a href="#" class="text-sm text-agri-deep hover:text-agri-light">Forgot password?</a>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                        Login Now
                    </button>
                </form>

                <!-- Divider -->
                <div class="my-8 flex items-center">
                    <div class="flex-1 border-t border-gray-300"></div>
                    <span class="px-4 text-sm text-gray-500">Or continue with</span>
                    <div class="flex-1 border-t border-gray-300"></div>
                </div>

                <!-- Social Login -->
                <div class="grid grid-cols-2 gap-4">
                    <button class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-google text-red-500 mr-2"></i>
                        <span class="text-sm font-medium text-gray-700">Google</span>
                    </button>
                    <button class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-facebook text-blue-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-700">Facebook</span>
                    </button>
                </div>

                <!-- Sign Up Link -->
                <div class="text-center mt-8">
                    <p class="text-gray-600">
                        Not registered? 
                        <a href="#" onclick="navigateToPage('register')" class="text-agri-deep hover:text-agri-light font-medium">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    </main>
  `
}

// Register Page Content (Fully Restored)
function getRegisterPageContent() {
  return `
    <!-- Main Content -->
    <main class="min-h-screen flex items-center justify-center py-16 bg-gray-50">
        <div class="max-w-lg w-full mx-4">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-agri-deep rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-leaf text-white text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p class="text-gray-600 mt-2">Join SmartSupply Agri community today</p>
                </div>

                <!-- Registration Form -->
                <form class="space-y-6" id="register-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input type="text" id="firstName" name="firstName" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                   placeholder="First Name" required>
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input type="text" id="lastName" name="lastName" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                   placeholder="Last Name" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="reg-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="reg-email" name="email" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                   placeholder="Email" required>
                        </div>
                        <div>
                            <label for="reg-phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" id="reg-phone" name="phone" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                                   placeholder="Phone Number" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-2">Password (at least 6 characters)</label>
                            <div class="relative">
                                <input type="password" id="reg-password" name="password" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent pr-12"
                                       placeholder="••••••" required minlength="6">
                                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                            <select id="gender" name="gender" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <!-- User Type Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="userType" value="buyer" class="text-agri-orange focus:ring-agri-orange" required>
                                <div class="ml-3">
                                    <i class="fas fa-shopping-cart text-agri-orange mb-1"></i>
                                    <div class="text-sm font-medium text-gray-700">Buyer</div>
                                </div>
                            </label>
                            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="userType" value="farmer" class="text-agri-orange focus:ring-agri-orange">
                                <div class="ml-3">
                                    <i class="fas fa-seedling text-agri-orange mb-1"></i>
                                    <div class="text-sm font-medium text-gray-700">Farmer</div>
                                </div>
                            </label>
                            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="userType" value="supplier" class="text-agri-orange focus:ring-agri-orange">
                                <div class="ml-3">
                                    <i class="fas fa-truck text-agri-orange mb-1"></i>
                                    <div class="text-sm font-medium text-gray-700">Supplier</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="terms" name="terms" 
                               class="w-4 h-4 text-agri-orange border-gray-300 rounded focus:ring-agri-orange" required>
                        <label for="terms" class="ml-2 text-sm text-gray-600">
                            Accept the terms and 
                            <a href="#" onclick="navigateToPage('privacy')" class="text-agri-deep hover:text-agri-light font-medium underline">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                        Register Now
                    </button>
                </form>

                <!-- Sign In Link -->
                <div class="text-center mt-8">
                    <p class="text-gray-600">
                        Already Have an Account? 
                        <a href="#" onclick="navigateToPage('login')" class="text-agri-deep hover:text-agri-light font-medium">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    </main>
  `
}

// FAQ Page Content (Fully Restored)
function getFAQPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">FAQ</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
                <p class="text-xl text-gray-600">Find answers to common questions about our agricultural marketplace</p>
            </div>

            <!-- FAQ Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- FAQ Item 1 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq1">
                            <span class="font-semibold text-gray-800">How to buy a product?</span>
                            <i class="fas fa-minus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq1" class="px-6 pb-4 faq-content">
                            <p class="text-gray-600 leading-relaxed">
                                Browse our marketplace, select products from local farmers, add them to your cart, and proceed to checkout. We accept various payment methods and offer secure transactions.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 2 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq2">
                            <span class="font-semibold text-gray-800">I am a new user. How should I start?</span>
                            <i class="fas fa-plus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq2" class="px-6 pb-4 faq-content hidden">
                            <p class="text-gray-600 leading-relaxed">
                                Welcome to SmartSupply Agri! Start by creating an account, browse our marketplace, and connect with local farmers. Our onboarding guide will help you get started with your first purchase.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 3 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq3">
                            <span class="font-semibold text-gray-800">Returns and refunds</span>
                            <i class="fas fa-plus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq3" class="px-6 pb-4 faq-content hidden">
                            <p class="text-gray-600 leading-relaxed">
                                We offer a 24-hour return policy for fresh produce. If you're not satisfied with your order, contact us immediately for a full refund or replacement.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                    <!-- FAQ Item 4 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq4">
                            <span class="font-semibold text-gray-800">Delivery and shipping</span>
                            <i class="fas fa-plus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq4" class="px-6 pb-4 faq-content hidden">
                            <p class="text-gray-600 leading-relaxed">
                                We offer same-day delivery within Accra and next-day delivery to surrounding areas. Delivery is free for orders over $50. Track your order in real-time through our app.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 5 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq5">
                            <span class="font-semibold text-gray-800">How to become a farmer seller?</span>
                            <i class="fas fa-plus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq5" class="px-6 pb-4 faq-content hidden">
                            <p class="text-gray-600 leading-relaxed">
                                Register as a farmer, verify your farm credentials, upload product photos, set your prices, and start selling. We provide marketing support and handle payments securely.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 6 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <button class="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none faq-toggle" data-target="faq6">
                            <span class="font-semibold text-gray-800">Payment methods</span>
                            <i class="fas fa-plus text-agri-orange faq-icon"></i>
                        </button>
                        <div id="faq6" class="px-6 pb-4 faq-content hidden">
                            <p class="text-gray-600 leading-relaxed">
                                We accept Mobile Money (MTN, Vodafone, AirtelTigo), bank transfers, credit/debit cards, and cash on delivery for local orders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Section -->
            <div class="bg-agri-sage rounded-2xl p-8 text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h2>
                <p class="text-gray-600 mb-6">Can't find the answer you're looking for? Please chat with our friendly team.</p>
                <button onclick="navigateToPage('contact')" class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Get in Touch
                </button>
            </div>
        </div>
    </main>
  `
}

// Blog Page Content (Fully Restored)
function getBlogPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Blog</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Agricultural Insights & News</h1>
                <p class="text-xl text-gray-600">Stay updated with the latest trends in agriculture and farming</p>
            </div>

            <!-- Featured Article -->
            <div class="mb-16">
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-2">
                        <div class="relative h-64 lg:h-auto">
                            <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                 alt="Sustainable farming practices" 
                                 class="w-full h-full object-cover">
                            <div class="absolute top-4 left-4">
                                <span class="bg-agri-orange text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
                            </div>
                        </div>
                        <div class="p-8">
                            <div class="flex items-center text-sm text-gray-500 mb-4">
                                <span>December 15, 2024</span>
                                <span class="mx-2">•</span>
                                <span>5 min read</span>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">The Future of Sustainable Agriculture in Ghana</h2>
                            <p class="text-gray-600 leading-relaxed mb-6">
                                Discover how Ghanaian farmers are adopting sustainable practices to improve crop yields while protecting the environment. Learn about innovative techniques that are transforming agriculture across the country.
                            </p>
                            <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                                Read More →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Blog Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Blog Post 1 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Organic farming" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Organic</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>December 10, 2024</span>
                            <span class="mx-2">•</span>
                            <span>3 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Benefits of Organic Farming for Small-Scale Farmers</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Explore how organic farming methods can increase profitability and sustainability for small-scale farmers in Ghana.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>

                <!-- Blog Post 2 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1592982736049-97ba5b43e1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Technology in agriculture" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">Technology</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>December 8, 2024</span>
                            <span class="mx-2">•</span>
                            <span>4 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Digital Tools Revolutionizing Farm Management</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Learn about the latest digital tools and apps that are helping farmers optimize their operations and increase yields.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>

                <!-- Blog Post 3 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Market trends" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">Market</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>December 5, 2024</span>
                            <span class="mx-2">•</span>
                            <span>6 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Understanding Agricultural Market Trends in 2024</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Stay ahead of market trends and learn how to position your agricultural products for maximum profitability.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>

                <!-- Blog Post 4 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Climate change" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Climate</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>December 3, 2024</span>
                            <span class="mx-2">•</span>
                            <span>5 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Adapting to Climate Change: Resilient Farming Practices</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Discover strategies to make your farm more resilient to climate change and extreme weather conditions.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>

                <!-- Blog Post 5 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Community farming" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">Community</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>December 1, 2024</span>
                            <span class="mx-2">•</span>
                            <span>4 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Building Strong Farming Communities</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Learn how collaboration and community building can strengthen the agricultural sector and benefit all farmers.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>

                <!-- Blog Post 6 -->
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-48">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Crop rotation" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-indigo-500 text-white px-2 py-1 rounded text-xs font-semibold">Tips</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <span>November 28, 2024</span>
                            <span class="mx-2">•</span>
                            <span>3 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Crop Rotation: Maximizing Soil Health and Yields</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Master the art of crop rotation to improve soil fertility and increase your farm's productivity year after year.
                        </p>
                        <button class="text-agri-deep font-semibold hover:text-agri-light transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>
            </div>

            <!-- Newsletter Signup -->
            <div class="mt-16 bg-agri-deep rounded-2xl p-8 text-center text-white">
                <h2 class="text-2xl font-bold mb-4">Stay Updated</h2>
                <p class="text-agri-sage mb-6">Subscribe to our newsletter for the latest agricultural insights and updates</p>
                <form class="max-w-md mx-auto flex gap-4" onsubmit="handleNewsletter(event)">
                    <input type="email" 
                           placeholder="Enter your email" 
                           class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-agri-orange"
                           required>
                    <button type="submit" 
                            class="bg-agri-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    </main>
  `
}

// Privacy Policy Page Content (Fully Restored)
function getPrivacyPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Privacy Policy</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
                    <p class="text-xl text-gray-600">Last updated: December 15, 2024</p>
                </div>

                <div class="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    <!-- Introduction -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                        <p class="text-gray-600 leading-relaxed">
                            At SmartSupply Agri, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our agricultural marketplace platform.
                        </p>
                    </section>

                    <!-- Information We Collect -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Name, email address, and phone number</li>
                                    <li>Billing and shipping addresses</li>
                                    <li>Payment information (processed securely by third-party providers)</li>
                                    <li>Account credentials and preferences</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Usage Information</h3>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Device information and IP address</li>
                                    <li>Browser type and version</li>
                                    <li>Pages visited and time spent on our platform</li>
                                    <li>Search queries and interaction data</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- How We Use Your Information -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your account and orders</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Improve our platform and services</li>
                            <li>Send marketing communications (with your consent)</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <!-- Information Sharing -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Information Sharing and Disclosure</h2>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                        </p>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>With farmers and suppliers to fulfill your orders</li>
                            <li>With payment processors to handle transactions</li>
                            <li>With delivery partners for order fulfillment</li>
                            <li>When required by law or to protect our rights</li>
                            <li>With your explicit consent</li>
                        </ul>
                    </section>

                    <!-- Data Security -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
                        <p class="text-gray-600 leading-relaxed">
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <!-- Your Rights -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
                        <p class="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>Access and update your personal information</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of your data</li>
                            <li>Lodge a complaint with relevant authorities</li>
                        </ul>
                    </section>

                    <!-- Cookies -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Cookies and Tracking</h2>
                        <p class="text-gray-600 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.
                        </p>
                    </section>

                    <!-- Third-Party Services -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Third-Party Services</h2>
                        <p class="text-gray-600 leading-relaxed">
                            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                        </p>
                    </section>

                    <!-- Children's Privacy -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
                        <p class="text-gray-600 leading-relaxed">
                            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                        </p>
                    </section>

                    <!-- Changes to Policy -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
                        <p class="text-gray-600 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <!-- Contact Information -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-600"><strong>Email:</strong> privacy@smartsupplyagri.com</p>
                            <p class="text-gray-600"><strong>Phone:</strong> +(233) 872-670-780</p>
                            <p class="text-gray-600"><strong>Address:</strong> Accra Central Market, Accra, Ghana</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </main>
  `
}

// Marketplace Page Content (Fully Restored)
function getMarketplacePageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Marketplace</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Fresh Products Marketplace</h1>
                    <p class="text-gray-600">Discover fresh, organic products from local farmers</p>
                </div>
                <div class="mt-4 lg:mt-0">
                    <div class="flex items-center space-x-4">
                        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest First</option>
                            <option>Best Rating</option>
                        </select>
                        <div class="flex border border-gray-300 rounded-lg">
                            <button class="p-2 hover:bg-gray-50">
                                <i class="fas fa-th-large text-gray-600"></i>
                            </button>
                            <button class="p-2 hover:bg-gray-50 border-l border-gray-300">
                                <i class="fas fa-list text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                        
                        <!-- Categories -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Categories</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Vegetables (24)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Fruits (18)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Grains (12)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Herbs (8)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Price Range</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="price" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Under $5</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="price" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">$5 - $15</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="price" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">$15 - $30</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="price" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Over $30</span>
                                </label>
                            </div>
                        </div>

                        <!-- Badges -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Special Features</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Organic</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Local Farm</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="text-agri-orange focus:ring-agri-orange rounded">
                                    <span class="ml-2 text-gray-600">Fresh</span>
                                </label>
                            </div>
                        </div>

                        <button class="w-full bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="lg:col-span-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <!-- Product 1 -->
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow product-card" data-product-id="tom001">
                            <div class="relative">
                                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                     alt="Premium Fresh Tomatoes" 
                                     class="w-full h-48 object-cover">
                                <div class="absolute top-3 left-3">
                                    <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Organic</span>
                                </div>
                                <div class="absolute top-3 right-3">
                                    <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('tom001')">
                                        <i class="far fa-heart text-gray-600"></i>
                                    </button>
                                </div>
                                <div class="absolute bottom-3 left-3">
                                    <span class="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">-30%</span>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-500">Farmer John's Organic Farm</span>
                                    <div class="flex items-center">
                                        <i class="fas fa-star text-yellow-400 text-sm"></i>
                                        <span class="text-sm text-gray-600 ml-1">4.9 (127)</span>
                                    </div>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Premium Fresh Tomatoes</h3>
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xl font-bold text-agri-deep">$4.99</span>
                                        <span class="text-sm text-gray-500 line-through">$6.99</span>
                                    </div>
                                    <span class="text-sm text-green-600 font-medium">In Stock (10)</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="navigateToProductPage('tom001')" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                        View Details
                                    </button>
                                    <button onclick="addToCart()" class="bg-agri-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Product 2 -->
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow product-card" data-product-id="car002">
                            <div class="relative">
                                <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                     alt="Organic Baby Carrots" 
                                     class="w-full h-48 object-cover">
                                <div class="absolute top-3 left-3">
                                    <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Organic</span>
                                </div>
                                <div class="absolute top-3 right-3">
                                    <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('car002')">
                                        <i class="far fa-heart text-gray-600"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-500">Green Valley Farm</span>
                                    <div class="flex items-center">
                                        <i class="fas fa-star text-yellow-400 text-sm"></i>
                                        <span class="text-sm text-gray-600 ml-1">4.8 (89)</span>
                                    </div>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Organic Baby Carrots</h3>
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xl font-bold text-agri-deep">$3.49</span>
                                    </div>
                                    <span class="text-sm text-green-600 font-medium">In Stock (15)</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="navigateToProductPage('car002')" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                        View Details
                                    </button>
                                    <button onclick="addToCart()" class="bg-agri-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Product 3 -->
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow product-card" data-product-id="let003">
                            <div class="relative">
                                <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                     alt="Crisp Butter Lettuce" 
                                     class="w-full h-48 object-cover">
                                <div class="absolute top-3 left-3">
                                    <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">Local Farm</span>
                                </div>
                                <div class="absolute top-3 right-3">
                                    <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('let003')">
                                        <i class="far fa-heart text-gray-600"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-500">Sunshine Organic Farm</span>
                                    <div class="flex items-center">
                                        <i class="fas fa-star text-yellow-400 text-sm"></i>
                                        <span class="text-sm text-gray-600 ml-1">4.7 (156)</span>
                                    </div>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Crisp Butter Lettuce</h3>
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xl font-bold text-agri-deep">$2.99</span>
                                    </div>
                                    <span class="text-sm text-orange-600 font-medium">Low Stock (8)</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="navigateToProductPage('let003')" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                        View Details
                                    </button>
                                    <button onclick="addToCart()" class="bg-agri-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Additional products would go here -->
                        <!-- You can duplicate and modify the above product cards -->
                    </div>

                    <!-- Pagination -->
                    <div class="mt-12 flex justify-center">
                        <nav class="flex items-center space-x-2">
                            <button class="px-3 py-2 text-gray-500 hover:text-gray-700">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="px-3 py-2 bg-agri-deep text-white rounded">1</button>
                            <button class="px-3 py-2 text-gray-700 hover:text-gray-900">2</button>
                            <button class="px-3 py-2 text-gray-700 hover:text-gray-900">3</button>
                            <span class="px-3 py-2 text-gray-500">...</span>
                            <button class="px-3 py-2 text-gray-700 hover:text-gray-900">10</button>
                            <button class="px-3 py-2 text-gray-500 hover:text-gray-700">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </main>
  `
}

// Coming Soon Page Content (Fully Restored)
function getComingSoonPageContent() {
  return `
    <!-- Main Content -->
    <main class="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-agri-sage to-white">
        <div class="text-center max-w-2xl mx-4">
            <div class="mb-8">
                <div class="w-32 h-32 bg-agri-deep rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-seedling text-white text-5xl"></i>
                </div>
                <h1 class="text-5xl font-bold text-gray-800 mb-4">Coming Soon</h1>
                <p class="text-xl text-gray-600 leading-relaxed">
                    We're working hard to bring you something amazing. This feature will be available soon!
                </p>
            </div>

            <!-- Countdown Timer -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Launch Countdown</h2>
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-agri-deep" id="days">30</div>
                        <div class="text-sm text-gray-600">Days</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-agri-deep" id="hours">14</div>
                        <div class="text-sm text-gray-600">Hours</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-agri-deep" id="minutes">08</div>
                        <div class="text-sm text-gray-600">Minutes</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-agri-deep" id="seconds">10</div>
                        <div class="text-sm text-gray-600">Seconds</div>
                    </div>
                </div>
            </div>

            <!-- Newsletter Signup -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Get Notified When We Launch</h3>
                <form class="flex flex-col sm:flex-row gap-4" onsubmit="handleNewsletter(event)">
                    <input type="email" 
                           placeholder="Enter your email address" 
                           class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent"
                           required>
                    <button type="submit" 
                            class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                        Notify Me
                    </button>
                </form>
            </div>

            <!-- Back to Home -->
            <button onclick="navigateToPage('home')" 
                    class="inline-flex items-center text-agri-deep hover:text-agri-light font-semibold transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Home
            </button>
        </div>
    </main>
  `
}

// Farmers Page Content (Fully Restored)
function getFarmersPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Our Farmers</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Meet Our Partner Farmers</h1>
                <p class="text-xl text-gray-600">Dedicated farmers bringing fresh, quality produce to your table</p>
            </div>

            <!-- Farmers Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- Farmer 1 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-64">
                        <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Farmer John" 
                             class="w-full h-full object-cover">
                        <div class="absolute bottom-4 left-4">
                            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Organic Certified</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Farmer John Mensah</h3>
                        <p class="text-agri-deep font-medium mb-3">John's Organic Farm</p>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Specializing in organic tomatoes and vegetables for over 20 years. Located in the fertile lands of Eastern Region.
                        </p>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span class="text-gray-600 ml-1">4.9 (127 reviews)</span>
                            </div>
                            <span class="text-sm text-gray-500">15+ Products</span>
                        </div>
                        <div class="flex space-x-2">
                            <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                View Products
                            </button>
                            <button class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Farmer 2 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-64">
                        <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Green Valley Farm" 
                             class="w-full h-full object-cover">
                        <div class="absolute bottom-4 left-4">
                            <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Local Farm</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Sarah Osei</h3>
                        <p class="text-agri-deep font-medium mb-3">Green Valley Farm</p>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Expert in growing organic carrots and root vegetables. Committed to sustainable farming practices.
                        </p>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span class="text-gray-600 ml-1">4.8 (89 reviews)</span>
                            </div>
                            <span class="text-sm text-gray-500">12+ Products</span>
                        </div>
                        <div class="flex space-x-2">
                            <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                View Products
                            </button>
                            <button class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Farmer 3 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative h-64">
                        <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                             alt="Sunshine Organic Farm" 
                             class="w-full h-full object-cover">
                        <div class="absolute bottom-4 left-4">
                            <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Premium</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Kwame Asante</h3>
                        <p class="text-agri-deep font-medium mb-3">Sunshine Organic Farm</p>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Growing premium leafy greens and herbs using innovative hydroponic systems.
                        </p>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span class="text-gray-600 ml-1">4.7 (156 reviews)</span>
                            </div>
                            <span class="text-sm text-gray-500">8+ Products</span>
                        </div>
                        <div class="flex space-x-2">
                            <button class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                View Products
                            </button>
                            <button class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Additional farmers would go here -->
            </div>

            <!-- Statistics Section -->
            <div class="bg-agri-sage rounded-2xl p-8 mb-16">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div class="text-3xl font-bold text-agri-deep mb-2">100+</div>
                        <div class="text-gray-600 font-medium">Partner Farmers</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-agri-deep mb-2">8</div>
                        <div class="text-gray-600 font-medium">Regions Covered</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-agri-deep mb-2">4,000+</div>
                        <div class="text-gray-600 font-medium">Products Available</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-agri-deep mb-2">95%</div>
                        <div class="text-gray-600 font-medium">Customer Satisfaction</div>
                    </div>
                </div>
            </div>

            <!-- Become a Farmer Section -->
            <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Want to Join Our Farmer Network?</h2>
                <p class="text-gray-600 mb-6">
                    Connect with thousands of customers and grow your agricultural business with SmartSupply Agri
                </p>
                <button onclick="navigateToPage('register')" 
                        class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Become a Partner Farmer
                </button>
            </div>
        </div>
    </main>
  `
}

// Product Page Content (Fully Restored)
function getProductPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <a href="#" onclick="navigateToPage('marketplace')" class="text-gray-600 hover:text-agri-deep">Marketplace</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Product Details</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <!-- Product Images -->
                <div>
                    <div class="relative mb-4">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                             alt="Premium Fresh Tomatoes" 
                             class="w-full h-96 object-cover rounded-lg shadow-lg">
                        <div class="absolute top-4 left-4">
                            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Organic</span>
                        </div>
                        <div class="absolute top-4 right-4">
                            <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('tom001')">
                                <i class="far fa-heart text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Thumbnail Images -->
                    <div class="grid grid-cols-4 gap-2">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                             alt="Tomatoes view 1" 
                             class="w-full h-20 object-cover rounded cursor-pointer border-2 border-agri-orange">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                             alt="Tomatoes view 2" 
                             class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-agri-orange">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                             alt="Tomatoes view 3" 
                             class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-agri-orange">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                             alt="Tomatoes view 4" 
                             class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-agri-orange">
                    </div>
                </div>

                <!-- Product Details -->
                <div>
                    <div class="mb-4">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Premium Fresh Tomatoes</h1>
                        <p class="text-agri-deep font-medium">From Farmer John's Organic Farm</p>
                    </div>

                    <!-- Rating and Reviews -->
                    <div class="flex items-center mb-6">
                        <div class="flex items-center mr-4">
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <span class="text-gray-600 ml-2">4.9</span>
                        </div>
                        <span class="text-gray-600">(127 reviews)</span>
                    </div>

                    <!-- Price -->
                    <div class="mb-6">
                        <div class="flex items-center space-x-4 mb-2">
                            <span class="text-3xl font-bold text-agri-deep">$4.99</span>
                            <span class="text-xl text-gray-500 line-through">$6.99</span>
                            <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">30% OFF</span>
                        </div>
                        <p class="text-green-600 font-medium">✓ In Stock (10 units available)</p>
                    </div>

                    <!-- Product Badges -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Organic</span>
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Fresh</span>
                        <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">Local Farm</span>
                    </div>

                    <!-- Quantity Selector -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center border border-gray-300 rounded-lg">
                                <button class="px-3 py-2 text-gray-600 hover:text-gray-800">-</button>
                                <span class="px-4 py-2 border-l border-r border-gray-300">1</span>
                                <button class="px-3 py-2 text-gray-600 hover:text-gray-800">+</button>
                            </div>
                            <span class="text-gray-600">kg</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex space-x-4 mb-8">
                        <button onclick="addToCart()" class="flex-1 bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            <i class="fas fa-shopping-cart mr-2"></i>
                            Add to Cart
                        </button>
                        <button class="bg-agri-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                            Buy Now
                        </button>
                    </div>

                    <!-- Product Information -->
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Category:</span>
                                <span class="font-medium">Vegetables</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Origin:</span>
                                <span class="font-medium">Eastern Region, Ghana</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Harvest Date:</span>
                                <span class="font-medium">December 10, 2024</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Shelf Life:</span>
                                <span class="font-medium">7-10 days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Tabs -->
            <div class="mb-16">
                <div class="border-b border-gray-200 mb-8">
                    <nav class="flex space-x-8">
                        <button class="py-2 px-1 border-b-2 border-agri-orange text-agri-deep font-medium">Description</button>
                        <button class="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">Reviews (127)</button>
                        <button class="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">Farmer Info</button>
                        <button class="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">Shipping</button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="bg-white rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Product Description</h3>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        Our premium fresh tomatoes are grown using organic farming methods in the fertile soils of Eastern Region, Ghana. 
                        These vine-ripened tomatoes are hand-picked at peak freshness to ensure maximum flavor and nutritional value.
                    </p>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        Perfect for salads, cooking, or eating fresh, these tomatoes are rich in vitamins C and K, potassium, and antioxidants. 
                        Our sustainable farming practices ensure that you get the best quality produce while supporting environmental conservation.
                    </p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>100% Organic - No pesticides or chemicals</li>
                        <li>Vine-ripened for maximum flavor</li>
                        <li>Hand-picked and carefully sorted</li>
                        <li>Rich in vitamins and antioxidants</li>
                        <li>Supports local sustainable farming</li>
                    </ul>
                </div>
            </div>

            <!-- Related Products -->
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Related Product 1 -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div class="relative">
                            <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                                 alt="Organic Carrots" 
                                 class="w-full h-48 object-cover">
                            <div class="absolute top-3 right-3">
                                <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                                    <i class="far fa-heart text-gray-600"></i>
                                </button>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Organic Baby Carrots</h3>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xl font-bold text-agri-deep">$3.49</span>
                                <div class="flex items-center">
                                    <i class="fas fa-star text-yellow-400 text-sm"></i>
                                    <span class="text-sm text-gray-600 ml-1">4.8</span>
                                </div>
                            </div>
                            <button onclick="addToCart()" class="w-full bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <!-- Additional related products would go here -->
                </div>
            </div>
        </div>
    </main>
  `
}

// Cart Page Content (Fully Restored)
function getCartPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Shopping Cart</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <h1 class="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <!-- Cart Header -->
                        <div class="bg-gray-50 px-6 py-4 border-b">
                            <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                <div class="col-span-6">Product</div>
                                <div class="col-span-2 text-center">Price</div>
                                <div class="col-span-2 text-center">Quantity</div>
                                <div class="col-span-2 text-center">Total</div>
                            </div>
                        </div>

                        <!-- Cart Item 1 -->
                        <div class="px-6 py-4 border-b">
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-6">
                                    <div class="flex items-center space-x-4">
                                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                             alt="Premium Fresh Tomatoes" 
                                             class="w-16 h-16 object-cover rounded">
                                        <div>
                                            <h3 class="font-semibold text-gray-800">Premium Fresh Tomatoes</h3>
                                            <p class="text-sm text-gray-600">Farmer John's Organic Farm</p>
                                            <div class="flex items-center mt-1">
                                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Organic</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-span-2 text-center">
                                    <span class="font-semibold text-gray-800">$4.99</span>
                                </div>
                                <div class="col-span-2 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                            <i class="fas fa-minus text-xs"></i>
                                        </button>
                                        <span class="w-8 text-center">2</span>
                                        <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                            <i class="fas fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-span-2 text-center">
                                    <span class="font-semibold text-gray-800">$9.98</span>
                                    <button class="ml-4 text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Cart Item 2 -->
                        <div class="px-6 py-4 border-b">
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-6">
                                    <div class="flex items-center space-x-4">
                                        <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                             alt="Organic Baby Carrots" 
                                             class="w-16 h-16 object-cover rounded">
                                        <div>
                                            <h3 class="font-semibold text-gray-800">Organic Baby Carrots</h3>
                                            <p class="text-sm text-gray-600">Green Valley Farm</p>
                                            <div class="flex items-center mt-1">
                                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Organic</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-span-2 text-center">
                                    <span class="font-semibold text-gray-800">$3.49</span>
                                </div>
                                <div class="col-span-2 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                            <i class="fas fa-minus text-xs"></i>
                                        </button>
                                        <span class="w-8 text-center">1</span>
                                        <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                            <i class="fas fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-span-2 text-center">
                                    <span class="font-semibold text-gray-800">$3.49</span>
                                    <button class="ml-4 text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Continue Shopping -->
                        <div class="px-6 py-4">
                            <button onclick="navigateToPage('marketplace')" class="text-agri-deep hover:text-agri-light font-semibold">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 class="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal (3 items)</span>
                                <span class="font-semibold">$13.47</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Delivery Fee</span>
                                <span class="font-semibold">$2.50</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Service Fee</span>
                                <span class="font-semibold">$1.00</span>
                            </div>
                            <div class="border-t pt-4">
                                <div class="flex justify-between">
                                    <span class="text-lg font-semibold text-gray-800">Total</span>
                                    <span class="text-lg font-bold text-agri-deep">$16.97</span>
                                </div>
                            </div>
                        </div>

                        <!-- Promo Code -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                            <div class="flex space-x-2">
                                <input type="text" 
                                       placeholder="Enter code" 
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                                <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <!-- Checkout Button -->
                        <button class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors mb-4">
                            Proceed to Checkout
                        </button>

                        <!-- Payment Methods -->
                        <div class="text-center">
                            <p class="text-sm text-gray-600 mb-2">We accept:</p>
                            <div class="flex justify-center space-x-2">
                                <i class="fab fa-cc-visa text-2xl text-blue-600"></i>
                                <i class="fab fa-cc-mastercard text-2xl text-red-600"></i>
                                <i class="fas fa-mobile-alt text-2xl text-green-600"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  `
}

// Wishlist Page Content (Fully Restored)
function getWishlistPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">My Wishlist</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-800">My Wishlist</h1>
                <span class="text-gray-600">3 items</span>
            </div>

            <!-- Wishlist Items -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <!-- Wishlist Item 1 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="relative">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                             alt="Premium Fresh Tomatoes" 
                             class="w-full h-48 object-cover">
                        <div class="absolute top-3 left-3">
                            <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Organic</span>
                        </div>
                        <div class="absolute top-3 right-3">
                            <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('tom001')">
                                <i class="fas fa-heart text-red-500"></i>
                            </button>
                        </div>
                        <div class="absolute bottom-3 left-3">
                            <span class="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">-30%</span>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-500">Farmer John's Organic Farm</span>
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400 text-sm"></i>
                                <span class="text-sm text-gray-600 ml-1">4.9</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Premium Fresh Tomatoes</h3>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-xl font-bold text-agri-deep">$4.99</span>
                                <span class="text-sm text-gray-500 line-through">$6.99</span>
                            </div>
                            <span class="text-sm text-green-600 font-medium">In Stock</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="addToCart()" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                Add to Cart
                            </button>
                            <button onclick="navigateToProductPage('tom001')" class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Wishlist Item 2 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="relative">
                        <img src="https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                             alt="Organic Baby Carrots" 
                             class="w-full h-48 object-cover">
                        <div class="absolute top-3 left-3">
                            <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Organic</span>
                        </div>
                        <div class="absolute top-3 right-3">
                            <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('car002')">
                                <i class="fas fa-heart text-red-500"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-500">Green Valley Farm</span>
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400 text-sm"></i>
                                <span class="text-sm text-gray-600 ml-1">4.8</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Organic Baby Carrots</h3>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-xl font-bold text-agri-deep">$3.49</span>
                            </div>
                            <span class="text-sm text-green-600 font-medium">In Stock</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="addToCart()" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                Add to Cart
                            </button>
                            <button onclick="navigateToProductPage('car002')" class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Wishlist Item 3 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="relative">
                        <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                             alt="Crisp Butter Lettuce" 
                             class="w-full h-48 object-cover">
                        <div class="absolute top-3 left-3">
                            <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">Local Farm</span>
                        </div>
                        <div class="absolute top-3 right-3">
                            <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('let003')">
                                <i class="fas fa-heart text-red-500"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-500">Sunshine Organic Farm</span>
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400 text-sm"></i>
                                <span class="text-sm text-gray-600 ml-1">4.7</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Crisp Butter Lettuce</h3>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-xl font-bold text-agri-deep">$2.99</span>
                            </div>
                            <span class="text-sm text-orange-600 font-medium">Low Stock</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="addToCart()" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                                Add to Cart
                            </button>
                            <button onclick="navigateToProductPage('let003')" class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty Wishlist State (Hidden by default) -->
            <div class="text-center py-16 hidden" id="empty-wishlist">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-heart text-3xl text-gray-400"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
                <p class="text-gray-600 mb-8">Save items you love to your wishlist and shop them later</p>
                <button onclick="navigateToPage('marketplace')" class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Start Shopping
                </button>
            </div>

            <!-- Wishlist Actions -->
            <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Add All to Cart
                </button>
                <button class="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Clear Wishlist
                </button>
                <button onclick="navigateToPage('marketplace')" class="bg-agri-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Continue Shopping
                </button>
            </div>
        </div>
    </main>
  `
}

// Not Found Page Content
function getNotFoundPageContent() {
  return `
    <!-- Main Content -->
    <main class="min-h-screen flex items-center justify-center py-16 bg-gray-50">
        <div class="text-center max-w-md mx-4">
            <div class="mb-8">
                <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-exclamation-triangle text-gray-400 text-5xl"></i>
                </div>
                <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p class="text-gray-600 leading-relaxed mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <div class="space-y-4">
                <button onclick="navigateToPage('home')" 
                        class="w-full bg-agri-deep text-white py-3 px-6 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Go Home
                </button>
                <button onclick="navigateToPage('marketplace')" 
                        class="w-full bg-agri-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Browse Marketplace
                </button>
                <button onclick="navigateToPage('contact')" 
                        class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    </main>
  `
}

// SERVICE PAGES CONTENT (Equipment Rental, Delivery Services, Farmer Storefronts)

// Equipment Rental Page Content
function getEquipmentRentalPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Equipment Rental</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Equipment Rental Services</h1>
                    <p class="text-gray-600">Rent high-quality agricultural equipment for your farming needs</p>
                </div>
                <div class="mt-4 lg:mt-0">
                    <div class="flex items-center space-x-4">
                        <select id="equipment-sort" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                            <option value="">Sort by: Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="availability">Available First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                        
                        <!-- Categories -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Equipment Type</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-category" value="" class="text-agri-orange focus:ring-agri-orange" checked>
                                    <span class="ml-2 text-gray-600">All Equipment</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-category" value="tractors" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Tractors</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-category" value="harvesters" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Harvesters</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-category" value="plows" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Plows</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-category" value="balers" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Balers</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Daily Rate</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-price" value="" class="text-agri-orange focus:ring-agri-orange" checked>
                                    <span class="ml-2 text-gray-600">Any Price</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-price" value="0-100" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Under ₵100</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-price" value="100-200" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">₵100 - ₵200</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-price" value="200-500" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">₵200 - ₵500</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-price" value="500+" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Over ₵500</span>
                                </label>
                            </div>
                        </div>

                        <!-- Availability -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-800 mb-3">Availability</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-availability" value="" class="text-agri-orange focus:ring-agri-orange" checked>
                                    <span class="ml-2 text-gray-600">All</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-availability" value="available" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Available Now</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="equipment-availability" value="rented" class="text-agri-orange focus:ring-agri-orange">
                                    <span class="ml-2 text-gray-600">Currently Rented</span>
                                </label>
                            </div>
                        </div>

                        <button id="apply-equipment-filters" class="w-full bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            Apply Filters
                        </button>
                        <button id="clear-equipment-filters" class="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Clear Filters
                        </button>
                    </div>
                </div>

                <!-- Equipment Grid -->
                <div class="lg:col-span-3">
                    <div id="equipment-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Equipment items will be populated by JavaScript -->
                    </div>
                    
                    <!-- No Results Message -->
                    <div id="no-equipment-results" class="text-center py-12 hidden">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-tractor text-3xl text-gray-400"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">No Equipment Found</h3>
                        <p class="text-gray-600">Try adjusting your filters to see more results</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Equipment Rental Modal -->
    <div id="equipment-rental-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">Request Equipment Rental</h3>
                    <button id="close-rental-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="equipment-rental-form" class="space-y-4">
                    <input type="hidden" id="rental-equipment-id">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="rental-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" id="rental-phone" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="rental-email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" id="rental-start-date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" id="rental-end-date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                        <textarea id="rental-notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="Any special requirements or questions..."></textarea>
                    </div>
                    
                    <div class="flex space-x-4 pt-4">
                        <button type="submit" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            Submit Request
                        </button>
                        <button type="button" id="cancel-rental-request" class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `
}

// Delivery Services Page Content
function getDeliveryServicesPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Delivery Services</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Delivery Services</h1>
                    <p class="text-gray-600">Find reliable delivery partners for your agricultural products</p>
                </div>
                <div class="mt-4 lg:mt-0">
                    <div class="relative">
                        <input type="text" id="delivery-search" placeholder="Search delivery services..." 
                               class="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Service Providers Grid -->
            <div id="delivery-services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Delivery service items will be populated by JavaScript -->
            </div>
            
            <!-- No Results Message -->
            <div id="no-delivery-results" class="text-center py-12 hidden">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-truck text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No Delivery Services Found</h3>
                <p class="text-gray-600">Try searching with different keywords</p>
            </div>
        </div>
    </main>

    <!-- Delivery Quote Modal -->
    <div id="delivery-quote-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">Request Delivery Quote</h3>
                    <button id="close-quote-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="delivery-quote-form" class="space-y-4">
                    <input type="hidden" id="quote-service-id">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="quote-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" id="quote-phone" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" id="quote-email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                            <input type="text" id="quote-pickup" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="City, Region">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                            <input type="text" id="quote-delivery" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="City, Region">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Package Weight (kg)</label>
                            <input type="number" id="quote-weight" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                            <input type="date" id="quote-date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
                        <textarea id="quote-description" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent" placeholder="Describe what you're shipping..."></textarea>
                    </div>
                    
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" id="quote-refrigerated" class="text-agri-orange focus:ring-agri-orange rounded">
                            <span class="ml-2 text-sm text-gray-700">Requires refrigerated transport</span>
                        </label>
                    </div>
                    
                    <div class="flex space-x-4 pt-4">
                        <button type="submit" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            Request Quote
                        </button>
                        <button type="button" id="cancel-quote-request" class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `
}

// Farmer Storefronts Page Content
function getFarmerStorefrontsPageContent() {
  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">Farmer Storefronts</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Farmer Storefronts</h1>
                    <p class="text-gray-600">Discover local farmers and their fresh produce</p>
                </div>
                <div class="mt-4 lg:mt-0">
                    <div class="relative">
                        <input type="text" id="farmers-search" placeholder="Search farmers, products, or locations..." 
                               class="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Farmers Grid -->
            <div id="farmers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Farmer items will be populated by JavaScript -->
            </div>
            
            <!-- No Results Message -->
            <div id="no-farmers-results" class="text-center py-12 hidden">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-user-tie text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No Farmers Found</h3>
                <p class="text-gray-600">Try searching with different keywords</p>
            </div>
        </div>
    </main>
  `
}

// Individual Farmer Store Page Content
function getFarmerStorePageContent() {
  const farmerId = localStorage.getItem("selectedFarmerId") || "farm001"
  const farmer = ServicesData.farmers.find((f) => f.id === farmerId) || ServicesData.farmers[0]

  return `
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="#" onclick="navigateToPage('home')" class="text-gray-600 hover:text-agri-deep">Home</a>
                <span class="mx-2 text-gray-400">></span>
                <a href="#" onclick="navigateToPage('farmer-storefronts')" class="text-gray-600 hover:text-agri-deep">Farmer Storefronts</a>
                <span class="mx-2 text-gray-400">></span>
                <span class="text-agri-deep font-medium">${farmer.farmName}</span>
            </nav>
        </div>
    </div>

    <!-- Farmer Header -->
    <section class="bg-white py-8 border-b">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div class="lg:col-span-1">
                    <img src="${farmer.image}" alt="${farmer.name}" class="w-48 h-48 object-cover rounded-full mx-auto shadow-lg">
                </div>
                <div class="lg:col-span-2">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">${farmer.farmName}</h1>
                    <p class="text-xl text-agri-deep font-medium mb-2">by ${farmer.name}</p>
                    <p class="text-gray-600 mb-4"><i class="fas fa-map-marker-alt mr-2"></i>${farmer.location}</p>
                    <p class="text-gray-700 leading-relaxed mb-4">${farmer.description}</p>
                    
                    <div class="flex items-center space-x-6 mb-4">
                        <div class="flex items-center">
                            <div class="flex text-yellow-400 mr-2">
                                ${Array(5)
                                  .fill()
                                  .map(
                                    (_, i) => `<i class="fas fa-star${i < Math.floor(farmer.rating) ? "" : "-o"}"></i>`,
                                  )
                                  .join("")}
                            </div>
                            <span class="text-gray-600">${farmer.rating} (${farmer.reviews} reviews)</span>
                        </div>
                        <span class="text-gray-600">${farmer.totalProducts} Products</span>
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${farmer.specialties.map((specialty) => `<span class="bg-agri-sage text-agri-deep px-3 py-1 rounded-full text-sm font-medium">${specialty}</span>`).join("")}
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${farmer.certifications.map((cert) => `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">${cert}</span>`).join("")}
                    </div>
                    
                    <div class="flex space-x-4">
                        <a href="tel:${farmer.contact.phone}" class="bg-agri-deep text-white px-6 py-2 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                            <i class="fas fa-phone mr-2"></i>Call Now
                        </a>
                        <a href="mailto:${farmer.contact.email}" class="bg-agri-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                            <i class="fas fa-envelope mr-2"></i>Email
                        </a>
                        <a href="https://wa.me/${farmer.contact.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" class="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                            <i class="fab fa-whatsapp mr-2"></i>WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section class="py-8">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold text-gray-800">Available Products</h2>
                <div class="flex items-center space-x-4">
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-orange focus:border-transparent">
                        <option>Sort by: Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Name: A to Z</option>
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${farmer.featuredProducts
                  .map(
                    (product) => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div class="relative">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                            <div class="absolute top-3 right-3">
                                <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50" onclick="addToWishlistFromHome('${product.id}')">
                                    <i class="far fa-heart text-gray-600"></i>
                                </button>
                            </div>
                            ${!product.inStock ? '<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span></div>' : ""}
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xl font-bold text-agri-deep">$${product.price}</span>
                                <span class="text-sm ${product.inStock ? "text-green-600" : "text-red-600"} font-medium">
                                    ${product.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="addToCart()" ${!product.inStock ? "disabled" : ""} class="flex-1 ${product.inStock ? "bg-agri-deep hover:bg-agri-light" : "bg-gray-300 cursor-not-allowed"} text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                                    Add to Cart
                                </button>
                                <button onclick="navigateToProductPage('${product.id}')" class="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <!-- Load More Button -->
            <div class="text-center mt-8">
                <button class="bg-agri-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-agri-light transition-colors">
                    Load More Products
                </button>
            </div>
        </div>
    </section>
  `
}

// SERVICE FEATURES INITIALIZATION FUNCTIONS

// Equipment Rental Features Initialization
function initializeEquipmentRentalFeatures() {
  console.log("🔧 Initializing equipment rental features...")

  // Populate equipment grid
  populateEquipmentGrid()

  // Initialize filters
  initializeEquipmentFilters()

  // Initialize rental modal
  initializeEquipmentRentalModal()

  // Initialize sorting
  initializeEquipmentSorting()
}

function populateEquipmentGrid(filteredData = null) {
  const grid = document.getElementById("equipment-grid")
  const noResults = document.getElementById("no-equipment-results")
  const data = filteredData || ServicesData.equipment

  if (!grid) return

  if (data.length === 0) {
    grid.classList.add("hidden")
    noResults.classList.remove("hidden")
    return
  }

  grid.classList.remove("hidden")
  noResults.classList.add("hidden")

  grid.innerHTML = data
    .map(
      (equipment) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div class="relative">
        <img src="${equipment.image}" alt="${equipment.name}" class="w-full h-48 object-cover">
        <div class="absolute top-3 left-3">
          <span class="bg-${equipment.availability === "available" ? "green" : equipment.availability === "rented" ? "red" : "yellow"}-500 text-white px-2 py-1 rounded text-xs font-semibold">
            ${equipment.availability === "available" ? "Available" : equipment.availability === "rented" ? "Rented" : "Maintenance"}
          </span>
        </div>
        <div class="absolute top-3 right-3">
          <span class="bg-agri-deep text-white px-2 py-1 rounded text-xs font-semibold">${equipment.category}</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${equipment.name}</h3>
        <p class="text-sm text-gray-600 mb-3">${equipment.description}</p>
        
        <div class="mb-3">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Daily Rate:</span>
            <span class="font-semibold text-agri-deep">₵${equipment.pricePerDay}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Weekly Rate:</span>
            <span class="font-semibold text-agri-deep">₵${equipment.pricePerWeek}</span>
          </div>
        </div>
        
        <div class="mb-3">
          <p class="text-sm text-gray-600 mb-2">Specifications:</p>
          <div class="flex flex-wrap gap-1">
            ${equipment.specifications
              .slice(0, 2)
              .map((spec) => `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${spec}</span>`)
              .join("")}
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm text-gray-600">
            <i class="fas fa-map-marker-alt mr-1"></i>${equipment.location}
          </div>
          <div class="text-sm text-gray-600">${equipment.owner}</div>
        </div>
        
        <button onclick="openEquipmentRentalModal('${equipment.id}')" 
                ${equipment.availability !== "available" ? "disabled" : ""} 
                class="w-full ${equipment.availability === "available" ? "bg-agri-deep hover:bg-agri-light" : "bg-gray-300 cursor-not-allowed"} text-white py-2 px-4 rounded-lg font-semibold transition-colors">
          ${equipment.availability === "available" ? "Request Rental" : equipment.availability === "rented" ? "Currently Rented" : "Under Maintenance"}
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function initializeEquipmentFilters() {
  const applyButton = document.getElementById("apply-equipment-filters")
  const clearButton = document.getElementById("clear-equipment-filters")

  if (applyButton) {
    applyButton.addEventListener("click", applyEquipmentFilters)
  }

  if (clearButton) {
    clearButton.addEventListener("click", clearEquipmentFilters)
  }
}

function applyEquipmentFilters() {
  const category = document.querySelector('input[name="equipment-category"]:checked')?.value || ""
  const priceRange = document.querySelector('input[name="equipment-price"]:checked')?.value || ""
  const availability = document.querySelector('input[name="equipment-availability"]:checked')?.value || ""

  let filteredData = ServicesData.equipment

  // Filter by category
  if (category) {
    filteredData = filteredData.filter((equipment) => equipment.category === category)
  }

  // Filter by price range
  if (priceRange) {
    const [min, max] = priceRange.split("-").map((p) => p.replace("+", ""))
    filteredData = filteredData.filter((equipment) => {
      if (priceRange === "500+") {
        return equipment.pricePerDay >= 500
      } else {
        return equipment.pricePerDay >= Number.parseInt(min) && equipment.pricePerDay <= Number.parseInt(max)
      }
    })
  }

  // Filter by availability
  if (availability) {
    filteredData = filteredData.filter((equipment) => equipment.availability === availability)
  }

  populateEquipmentGrid(filteredData)
  showToast(`Found ${filteredData.length} equipment items`, "info")
}

function clearEquipmentFilters() {
  // Reset all radio buttons
  document.querySelectorAll('input[name="equipment-category"]')[0].checked = true
  document.querySelectorAll('input[name="equipment-price"]')[0].checked = true
  document.querySelectorAll('input[name="equipment-availability"]')[0].checked = true

  // Reset grid
  populateEquipmentGrid()
  showToast("Filters cleared", "info")
}

function initializeEquipmentSorting() {
  const sortSelect = document.getElementById("equipment-sort")
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      const sortValue = e.target.value
      const sortedData = [...ServicesData.equipment]

      switch (sortValue) {
        case "price-low":
          sortedData.sort((a, b) => a.pricePerDay - b.pricePerDay)
          break
        case "price-high":
          sortedData.sort((a, b) => b.pricePerDay - a.pricePerDay)
          break
        case "availability":
          sortedData.sort((a, b) => (a.availability === "available" ? -1 : 1))
          break
        default:
          // Keep original order for featured
          break
      }

      populateEquipmentGrid(sortedData)
    })
  }
}

function initializeEquipmentRentalModal() {
  const modal = document.getElementById("equipment-rental-modal")
  const closeBtn = document.getElementById("close-rental-modal")
  const cancelBtn = document.getElementById("cancel-rental-request")
  const form = document.getElementById("equipment-rental-form")

  if (closeBtn) {
    closeBtn.addEventListener("click", closeEquipmentRentalModal)
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeEquipmentRentalModal)
  }

  if (form) {
    form.addEventListener("submit", handleEquipmentRentalSubmission)
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeEquipmentRentalModal()
      }
    })
  }
}

function openEquipmentRentalModal(equipmentId) {
  const equipment = ServicesData.equipment.find((eq) => eq.id === equipmentId)
  if (!equipment) return

  const modal = document.getElementById("equipment-rental-modal")
  const equipmentIdInput = document.getElementById("rental-equipment-id")

  if (equipmentIdInput) {
    equipmentIdInput.value = equipmentId
  }

  if (modal) {
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }
}

function closeEquipmentRentalModal() {
  const modal = document.getElementById("equipment-rental-modal")
  const form = document.getElementById("equipment-rental-form")

  if (modal) {
    modal.classList.add("hidden")
    document.body.style.overflow = ""
  }

  if (form) {
    form.reset()
  }
}

function handleEquipmentRentalSubmission(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const equipmentId = document.getElementById("rental-equipment-id").value
  const equipment = ServicesData.equipment.find((eq) => eq.id === equipmentId)

  // Simulate form submission
  showToast("🚜 Rental request submitted successfully! We'll contact you soon.", "success")

  // Close modal and reset form
  closeEquipmentRentalModal()

  console.log("Equipment rental request:", {
    equipment: equipment?.name,
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    notes: formData.get("notes"),
  })
}

// Delivery Services Features Initialization
function initializeDeliveryServicesFeatures() {
  console.log("🔧 Initializing delivery services features...")

  // Populate delivery services grid
  populateDeliveryServicesGrid()

  // Initialize search
  initializeDeliverySearch()

  // Initialize quote modal
  initializeDeliveryQuoteModal()
}

function populateDeliveryServicesGrid(filteredData = null) {
  const grid = document.getElementById("delivery-services-grid")
  const noResults = document.getElementById("no-delivery-results")
  const data = filteredData || ServicesData.deliveryServices

  if (!grid) return

  if (data.length === 0) {
    grid.classList.add("hidden")
    noResults.classList.remove("hidden")
    return
  }

  grid.classList.remove("hidden")
  noResults.classList.add("hidden")

  grid.innerHTML = data
    .map(
      (service) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <img src="${service.logo}" alt="${service.companyName}" class="w-16 h-16 object-cover rounded-lg mr-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">${service.companyName}</h3>
            <div class="flex items-center">
              <div class="flex text-yellow-400 mr-2">
                ${Array(5)
                  .fill()
                  .map((_, i) => `<i class="fas fa-star${i < Math.floor(service.rating) ? "" : "-o"} text-sm"></i>`)
                  .join("")}
              </div>
              <span class="text-sm text-gray-600">${service.rating} (${service.reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 mb-3">${service.description}</p>
        
        <div class="mb-4">
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-2 text-agri-orange"></i>
            <span>${service.serviceArea}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <i class="fas fa-dollar-sign mr-2 text-agri-orange"></i>
            <span>${service.pricingStructure}</span>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex flex-wrap gap-2">
            ${service.services
              .slice(0, 3)
              .map(
                (serviceType) =>
                  `<span class="bg-agri-sage text-agri-deep px-2 py-1 rounded text-xs font-medium">${serviceType}</span>`,
              )
              .join("")}
            ${service.services.length > 3 ? `<span class="text-xs text-gray-500">+${service.services.length - 3} more</span>` : ""}
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button onclick="openDeliveryQuoteModal('${service.id}')" class="flex-1 bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
            Get Quote
          </button>
          <a href="tel:${service.contact.phone}" class="bg-agri-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            <i class="fas fa-phone"></i>
          </a>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function initializeDeliverySearch() {
  const searchInput = document.getElementById("delivery-search")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      if (searchTerm === "") {
        populateDeliveryServicesGrid()
        return
      }

      const filteredData = ServicesData.deliveryServices.filter((service) => {
        return (
          service.companyName.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm) ||
          service.serviceArea.toLowerCase().includes(searchTerm) ||
          service.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
        )
      })

      populateDeliveryServicesGrid(filteredData)
    })
  }
}

function initializeDeliveryQuoteModal() {
  const modal = document.getElementById("delivery-quote-modal")
  const closeBtn = document.getElementById("close-quote-modal")
  const cancelBtn = document.getElementById("cancel-quote-request")
  const form = document.getElementById("delivery-quote-form")

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDeliveryQuoteModal)
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeDeliveryQuoteModal)
  }

  if (form) {
    form.addEventListener("submit", handleDeliveryQuoteSubmission)
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeDeliveryQuoteModal()
      }
    })
  }
}

function openDeliveryQuoteModal(serviceId) {
  const service = ServicesData.deliveryServices.find((s) => s.id === serviceId)
  if (!service) return

  const modal = document.getElementById("delivery-quote-modal")
  const serviceIdInput = document.getElementById("quote-service-id")

  if (serviceIdInput) {
    serviceIdInput.value = serviceId
  }

  if (modal) {
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }
}

function closeDeliveryQuoteModal() {
  const modal = document.getElementById("delivery-quote-modal")
  const form = document.getElementById("delivery-quote-form")

  if (modal) {
    modal.classList.add("hidden")
    document.body.style.overflow = ""
  }

  if (form) {
    form.reset()
  }
}

function handleDeliveryQuoteSubmission(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const serviceId = document.getElementById("quote-service-id").value
  const service = ServicesData.deliveryServices.find((s) => s.id === serviceId)

  // Simulate form submission
  showToast("🚚 Quote request submitted successfully! The delivery service will contact you soon.", "success")

  // Close modal and reset form
  closeDeliveryQuoteModal()

  console.log("Delivery quote request:", {
    service: service?.companyName,
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    pickup: formData.get("pickup"),
    delivery: formData.get("delivery"),
    weight: formData.get("weight"),
    date: formData.get("date"),
    description: formData.get("description"),
    refrigerated: formData.get("refrigerated") === "on",
  })
}

// Farmer Storefronts Features Initialization
function initializeFarmerStorefrontsFeatures() {
  console.log("🔧 Initializing farmer storefronts features...")

  // Populate farmers grid
  populateFarmersGrid()

  // Initialize search
  initializeFarmersSearch()
}

function populateFarmersGrid(filteredData = null) {
  const grid = document.getElementById("farmers-grid")
  const noResults = document.getElementById("no-farmers-results")
  const data = filteredData || ServicesData.farmers

  if (!grid) return

  if (data.length === 0) {
    grid.classList.add("hidden")
    noResults.classList.remove("hidden")
    return
  }

  grid.classList.remove("hidden")
  noResults.classList.add("hidden")

  grid.innerHTML = data
    .map(
      (farmer) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div class="relative">
        <img src="${farmer.image}" alt="${farmer.name}" class="w-full h-48 object-cover">
        <div class="absolute top-3 right-3">
          <div class="flex items-center bg-white rounded-full px-2 py-1">
            <i class="fas fa-star text-yellow-400 text-sm mr-1"></i>
            <span class="text-sm font-medium">${farmer.rating}</span>
          </div>
        </div>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-1">${farmer.farmName}</h3>
        <p class="text-agri-deep font-medium mb-2">by ${farmer.name}</p>
        <p class="text-sm text-gray-600 mb-3"><i class="fas fa-map-marker-alt mr-1"></i>${farmer.location}</p>
        <p class="text-gray-700 text-sm leading-relaxed mb-4">${farmer.description}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${farmer.specialties
            .slice(0, 2)
            .map(
              (specialty) =>
                `<span class="bg-agri-sage text-agri-deep px-2 py-1 rounded text-xs font-medium">${specialty}</span>`,
            )
            .join("")}
          ${farmer.specialties.length > 2 ? `<span class="text-xs text-gray-500">+${farmer.specialties.length - 2} more</span>` : ""}
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm text-gray-600">
            <span class="font-medium">${farmer.totalProducts}</span> Products
          </div>
          <div class="text-sm text-gray-600">
            <span class="font-medium">${farmer.reviews}</span> Reviews
          </div>
        </div>
        
        <!-- Featured Products Preview -->
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Featured Products:</p>
          <div class="grid grid-cols-3 gap-2">
            ${farmer.featuredProducts
              .slice(0, 3)
              .map(
                (product) => `
              <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-16 object-cover rounded">
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                  $${product.price}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        
        <button onclick="visitFarmerStore('${farmer.id}')" class="w-full bg-agri-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-agri-light transition-colors">
          Visit Store
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function initializeFarmersSearch() {
  const searchInput = document.getElementById("farmers-search")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      if (searchTerm === "") {
        populateFarmersGrid()
        return
      }

      const filteredData = ServicesData.farmers.filter((farmer) => {
        return (
          farmer.name.toLowerCase().includes(searchTerm) ||
          farmer.farmName.toLowerCase().includes(searchTerm) ||
          farmer.location.toLowerCase().includes(searchTerm) ||
          farmer.description.toLowerCase().includes(searchTerm) ||
          farmer.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm)) ||
          farmer.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
        )
      })

      populateFarmersGrid(filteredData)
    })
  }
}

function visitFarmerStore(farmerId) {
  localStorage.setItem("selectedFarmerId", farmerId)
  navigateToPage("farmer-store")
}

// Farmer Store Features Initialization
function initializeFarmerStoreFeatures() {
  console.log("🔧 Initializing farmer store features...")

  // Initialize product interactions
  initializeFarmerStoreProducts()
}

function initializeFarmerStoreProducts() {
  // Initialize add to cart buttons
  const addToCartButtons = document.querySelectorAll('button[onclick*="addToCart"]')
  addToCartButtons.forEach((button) => {
    if (!button.disabled) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        addToCart()
      })
    }
  })

  // Initialize wishlist buttons
  const wishlistButtons = document.querySelectorAll('button[onclick*="addToWishlistFromHome"]')
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const productId = button.getAttribute("onclick").match(/'([^']+)'/)[1]
      addToWishlistFromHome(productId)
    })
  })
}

// RESTORED PAGE-SPECIFIC FEATURE INITIALIZATION FUNCTIONS

// FAQ Toggles
function initializeFAQToggles() {
  console.log("🔧 Initializing FAQ toggles...")

  const faqToggles = document.querySelectorAll(".faq-toggle")
  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target")
      const content = document.getElementById(targetId)
      const icon = toggle.querySelector(".faq-icon")

      if (content && icon) {
        if (content.classList.contains("hidden")) {
          // Show content
          content.classList.remove("hidden")
          icon.classList.remove("fa-plus")
          icon.classList.add("fa-minus")
        } else {
          // Hide content
          content.classList.add("hidden")
          icon.classList.remove("fa-minus")
          icon.classList.add("fa-plus")
        }
      }
    })
  })
}

// Contact Form
function initializeContactForm() {
  console.log("🔧 Initializing contact form...")

  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(e.target)
      const name = formData.get("name")
      const email = formData.get("email")
      const subject = formData.get("subject")
      const message = formData.get("message")

      // Simulate form submission
      showToast("📧 Message sent successfully! We'll get back to you soon.", "success")

      // Reset form
      e.target.reset()

      console.log("Contact form submission:", { name, email, subject, message })
    })
  }
}

// Login Form
function initializeLoginForm() {
  console.log("🔧 Initializing login form...")

  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const email = formData.get("email")
      const password = formData.get("password")

      // Simulate login
      showToast("🎉 Login successful! Welcome back.", "success")

      // Redirect to home after successful login
      setTimeout(() => {
        navigateToPage("home")
      }, 1500)

      console.log("Login attempt:", { email, password: "***" })
    })
  }
}

// Register Form
function initializeRegisterForm() {
  console.log("🔧 Initializing register form...")

  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const firstName = formData.get("firstName")
      const lastName = formData.get("lastName")
      const email = formData.get("email")
      const phone = formData.get("phone")
      const userType = formData.get("userType")

      // Simulate registration
      showToast("🎉 Account created successfully! Welcome to SmartSupply Agri.", "success")

      // Redirect to login after successful registration
      setTimeout(() => {
        navigateToPage("login")
      }, 1500)

      console.log("Registration:", { firstName, lastName, email, phone, userType })
    })
  }
}

// Marketplace Features
function initializeMarketplaceFeatures() {
  console.log("🔧 Initializing marketplace features...")

  // Initialize product interactions
  initializeProductInteractions()

  // Initialize filters
  initializeMarketplaceFilters()
}

function initializeProductInteractions() {
  // Initialize add to cart buttons
  const addToCartButtons = document.querySelectorAll('button[onclick*="addToCart"]')
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      addToCart()
    })
  })

  // Initialize wishlist buttons
  const wishlistButtons = document.querySelectorAll('button[onclick*="addToWishlistFromHome"]')
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const productId = button.getAttribute("onclick").match(/'([^']+)'/)[1]
      addToWishlistFromHome(productId)
    })
  })
}

function initializeMarketplaceFilters() {
  // Initialize filter checkboxes and radio buttons
  const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]')
  filterInputs.forEach((input) => {
    input.addEventListener("change", () => {
      // Apply filters logic would go here
      console.log("Filter changed:", input.name, input.value, input.checked)
    })
  })
}

// Product Page Features
function initializeProductPageFeatures() {
  console.log("🔧 Initializing product page features...")

  // Initialize quantity selector
  initializeQuantitySelector()

  // Initialize product tabs
  initializeProductTabs()

  // Initialize image gallery
  initializeProductImageGallery()
}

function initializeQuantitySelector() {
  const minusBtn = document.querySelector(".quantity-minus")
  const plusBtn = document.querySelector(".quantity-plus")
  const quantityDisplay = document.querySelector(".quantity-display")

  if (minusBtn && plusBtn && quantityDisplay) {
    let quantity = 1

    minusBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--
        quantityDisplay.textContent = quantity
      }
    })

    plusBtn.addEventListener("click", () => {
      quantity++
      quantityDisplay.textContent = quantity
    })
  }
}

function initializeProductImageGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail-image")
  const mainImage = document.querySelector(".main-product-image")

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      if (mainImage) {
        mainImage.src = thumbnail.src
      }

      // Update active thumbnail
      thumbnails.forEach((t) => t.classList.remove("border-agri-orange"))
      thumbnail.classList.add("border-agri-orange")
    })
  })
}

// Cart Page Features
function initializeCartPageFeatures() {
  console.log("🔧 Initializing cart page features...")

  // Initialize quantity controls
  initializeCartQuantityControls()

  // Initialize remove item buttons
  initializeCartRemoveButtons()
}

function initializeCartQuantityControls() {
  const quantityControls = document.querySelectorAll(".quantity-control")
  quantityControls.forEach((control) => {
    const minusBtn = control.querySelector(".quantity-minus")
    const plusBtn = control.querySelector(".quantity-plus")
    const display = control.querySelector(".quantity-display")

    if (minusBtn && plusBtn && display) {
      minusBtn.addEventListener("click", () => {
        let quantity = Number.parseInt(display.textContent)
        if (quantity > 1) {
          quantity--
          display.textContent = quantity
          updateCartTotals()
        }
      })

      plusBtn.addEventListener("click", () => {
        let quantity = Number.parseInt(display.textContent)
        quantity++
        display.textContent = quantity
        updateCartTotals()
      })
    }
  })
}

function initializeCartRemoveButtons() {
  const removeButtons = document.querySelectorAll(".remove-item")
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cartItem = button.closest(".cart-item")
      if (cartItem) {
        cartItem.remove()
        updateCartTotals()
        showToast("Item removed from cart", "info")
      }
    })
  })
}

function updateCartTotals() {
  // This would calculate and update cart totals
  console.log("Updating cart totals...")
}

// Wishlist Page Features
function initializeWishlistPageFeatures() {
  console.log("🔧 Initializing wishlist page features...")

  // Initialize wishlist interactions
  initializeWishlistInteractions()
}

function initializeWishlistInteractions() {
  // Initialize add to cart buttons
  const addToCartButtons = document.querySelectorAll('button[onclick*="addToCart"]')
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      addToCart()
    })
  })

  // Initialize remove from wishlist buttons
  const wishlistButtons = document.querySelectorAll('button[onclick*="addToWishlistFromHome"]')
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const productId = button.getAttribute("onclick").match(/'([^']+)'/)[1]
      addToWishlistFromHome(productId)
    })
  })
}

// Close mobile menu helper
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden")

    // Close any open mobile dropdowns
    const openDropdowns = mobileMenu.querySelectorAll(".show")
    openDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show")
    })

    const rotatedArrows = mobileMenu.querySelectorAll(".rotate")
    rotatedArrows.forEach((arrow) => {
      arrow.classList.remove("rotate")
    })
  }
}

// Enhanced error handling
function showErrorMessage(message) {
  console.error(`💥 Error: ${message}`)
  showToast(`❌ ${message}`, "error")
}

// Main initialization function
function initializePage() {
  console.log("🔧 Initializing page components...")

  // Initialize smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Initialize cart functionality
  initializeCart()

  // Initialize wishlist functionality
  initializeWishlist()

  // Initialize intersection observer for animations
  initializeScrollAnimations()

  console.log("✅ Page components initialized")
}

// Hero Slider Functionality (Enhanced with error handling)
function initializeHeroSlider() {
  console.log("🎠 Initializing hero slider...")

  try {
    const slides = document.querySelectorAll(".hero-slide")
    const dots = document.querySelectorAll(".hero-dot")
    const prevBtn = document.querySelector(".hero-prev")
    const nextBtn = document.querySelector(".hero-next")

    if (!slides.length || !dots.length || !prevBtn || !nextBtn) {
      console.log("⚠️ Hero slider elements not found, skipping initialization")
      return
    }

    // Clear any existing interval
    if (slideInterval) {
      clearInterval(slideInterval)
    }

    // Auto-advance slides
    function startSlideshow() {
      slideInterval = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    // Stop slideshow
    function stopSlideshow() {
      if (slideInterval) {
        clearInterval(slideInterval)
      }
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
      // Remove active class from all slides and dots
      slides.forEach((slide) => slide.classList.remove("active"))
      dots.forEach((dot) => dot.classList.remove("active"))

      // Add active class to current slide and dot
      if (slides[slideIndex] && dots[slideIndex]) {
        slides[slideIndex].classList.add("active")
        dots[slideIndex].classList.add("active")
        currentSlide = slideIndex
      }
    }

    // Next slide
    function nextSlide() {
      const nextIndex = (currentSlide + 1) % totalSlides
      goToSlide(nextIndex)
    }

    // Previous slide
    function prevSlide() {
      const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides
      goToSlide(prevIndex)
    }

    // Event listeners for navigation
    nextBtn.addEventListener("click", () => {
      stopSlideshow()
      nextSlide()
      startSlideshow()
    })

    prevBtn.addEventListener("click", () => {
      stopSlideshow()
      prevSlide()
      startSlideshow()
    })

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        stopSlideshow()
        goToSlide(index)
        startSlideshow()
      })
    })

    // Pause on hover
    const heroSection = document.getElementById("heroSection")
    if (heroSection) {
      heroSection.addEventListener("mouseenter", stopSlideshow)
      heroSection.addEventListener("mouseleave", startSlideshow)
    }

    // Start the slideshow
    startSlideshow()

    // Preload images for better performance
    preloadHeroImages()

    console.log("✅ Hero slider initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing hero slider:", error)
  }
}

// Preload hero images
function preloadHeroImages() {
  const imageUrls = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1592982736049-97ba5b43e1a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
  ]

  imageUrls.forEach((url) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => console.log(`✅ Image preloaded: ${url.substring(0, 50)}...`)
    img.onerror = () => console.error(`❌ Failed to preload image: ${url.substring(0, 50)}...`)
    img.src = url
  })
}

// Countdown timer functionality
function startCountdown() {
  let hours = 14,
    minutes = 8,
    seconds = 10

  const updateCountdown = () => {
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
      if (minutes < 0) {
        minutes = 59
        hours--
        if (hours < 0) {
          hours = 23
          minutes = 59
          seconds = 59
        }
      }
    }

    // Update display
    const hoursEl = document.getElementById("hours")
    const minutesEl = document.getElementById("minutes")
    const secondsEl = document.getElementById("seconds")

    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0")
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0")
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0")
  }

  setInterval(updateCountdown, 1000)
}

// Product tabs functionality
function initializeProductTabs() {
  const tabButtons = document.querySelectorAll("section button")

  tabButtons.forEach((button) => {
    if (
      button.textContent.includes("Popular") ||
      button.textContent.includes("On Sale") ||
      button.textContent.includes("Best Sellers")
    ) {
      button.addEventListener("click", () => {
        // Remove active class from all tab buttons in the same section
        const parentSection = button.closest("section")
        const siblingButtons = parentSection.querySelectorAll("button")

        siblingButtons.forEach((btn) => {
          btn.classList.remove("bg-agri-orange", "text-white")
          btn.classList.add("bg-white", "text-gray-700")
        })

        // Add active class to clicked button
        button.classList.remove("bg-white", "text-gray-700")
        button.classList.add("bg-agri-orange", "text-white")

        // Show loading effect
        showToast(`Loading ${button.textContent} products...`, "info")

        // Simulate loading new products
        setTimeout(() => {
          showToast(`${button.textContent} products loaded!`, "success")
        }, 1000)
      })
    }
  })
}

// Cart functionality
function initializeCart() {
  const addToCartButtons = document.querySelectorAll("button")

  addToCartButtons.forEach((button) => {
    if (button.textContent.includes("Add to Cart")) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        addToCart()
      })
    }
  })
}

function addToCart() {
  // Update cart count
  const cartBadge = document.querySelector(".fa-shopping-cart")?.nextElementSibling
  if (cartBadge) {
    const currentCount = Number.parseInt(cartBadge.textContent) || 0
    cartBadge.textContent = currentCount + 1

    // Show success message
    showToast("🛒 Product added to cart successfully!", "success")

    // Add bounce animation to cart icon
    const cartIcon = document.querySelector(".fa-shopping-cart")?.parentElement
    if (cartIcon) {
      cartIcon.classList.add("animate-bounce")
      setTimeout(() => {
        cartIcon.classList.remove("animate-bounce")
      }, 1000)
    }
  }
}

// Wishlist functionality
function initializeWishlist() {
  const wishlistButtons = document.querySelectorAll(".fa-heart")

  wishlistButtons.forEach((icon) => {
    icon.parentElement.addEventListener("click", (e) => {
      e.preventDefault()

      if (icon.classList.contains("far")) {
        icon.classList.remove("far")
        icon.classList.add("fas", "text-red-500")
        showToast("💖 Added to wishlist!", "success")
      } else {
        icon.classList.remove("fas", "text-red-500")
        icon.classList.add("far")
        showToast("💔 Removed from wishlist", "info")
      }
    })
  })
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".product-card, .category-card, h2, p")
  animateElements.forEach((el) => observer.observe(el))
}

// Enhanced toast notification system
function showToast(message, type = "info") {
  console.log(`📢 Toast: ${message} (${type})`)

  // Remove existing toasts
  const existingToasts = document.querySelectorAll(".toast-notification")
  existingToasts.forEach((toast) => toast.remove())

  const toast = document.createElement("div")
  toast.className = `toast-notification fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 transform translate-x-full transition-transform duration-300 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
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

// Newsletter subscription
function handleNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value
  showToast("🌱 Successfully subscribed to our newsletter!", "success")
  event.target.reset()
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  if (mobileMenu) {
    mobileMenu.classList.toggle("hidden")

    // Close any open mobile dropdowns
    if (mobileMenu.classList.contains("hidden")) {
      const openDropdowns = mobileMenu.querySelectorAll(".show")
      openDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show")
      })

      const rotatedArrows = mobileMenu.querySelectorAll(".rotate")
      rotatedArrows.forEach((arrow) => {
        arrow.classList.remove("rotate")
      })
    }
  }
}

// Mobile dropdown toggle functionality
function toggleMobileDropdown(type) {
  const dropdown = document.getElementById(`${type}-dropdown`)
  const arrow = document.getElementById(`${type}-arrow`)

  if (dropdown && arrow) {
    // Close other dropdowns first
    const allDropdowns = document.querySelectorAll('[id$="-dropdown"]')
    const allArrows = document.querySelectorAll('[id$="-arrow"]')

    allDropdowns.forEach((dd) => {
      if (dd.id !== `${type}-dropdown`) {
        dd.classList.remove("show")
      }
    })

    allArrows.forEach((arr) => {
      if (arr.id !== `${type}-arrow`) {
        arr.classList.remove("rotate")
      }
    })

    // Toggle current dropdown
    dropdown.classList.toggle("show")
    arrow.classList.toggle("rotate")
  }
}

// Product navigation functions
function navigateToProductPage(productId) {
  // Store the selected product ID for the product page
  localStorage.setItem("selectedProductId", productId)
  navigateToPage("product")
}

function addToWishlistFromHome(productId) {
  // Get product data (in a real app, this would come from an API)
  const productData = getProductData(productId)

  const wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []
  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1)
    showToast(`${productData.name} removed from wishlist`, "info")
  } else {
    wishlist.push(productData)
    showToast(`${productData.name} added to wishlist!`, "success")
  }

  localStorage.setItem("smartsupply-wishlist", JSON.stringify(wishlist))
  updateWishlistCount()
}

function getProductData(productId) {
  // Mock product data - in a real app, this would come from an API
  const products = {
    tom001: {
      id: "tom001",
      name: "Premium Fresh Tomatoes",
      price: 4.99,
      originalPrice: 6.99,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Farmer John's Organic Farm",
      rating: 4.9,
      reviews: 127,
      inStock: 10,
      category: "vegetables",
      badges: ["Organic", "Fresh"],
    },
    car002: {
      id: "car002",
      name: "Organic Baby Carrots",
      price: 3.49,
      originalPrice: 4.99,
      image:
        "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Green Valley Farm",
      rating: 4.8,
      reviews: 89,
      inStock: 15,
      category: "vegetables",
      badges: ["Organic", "Hosted Shop"],
    },
    let003: {
      id: "let003",
      name: "Crisp Butter Lettuce",
      price: 2.99,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Sunshine Organic Farm",
      rating: 4.7,
      reviews: 156,
      inStock: 8,
      category: "vegetables",
      badges: ["Local Farm"],
    },
  }

  return products[productId] || products["tom001"]
}

// Update cart and wishlist counts on page load
function updateCartAndWishlistCounts() {
  const cart = JSON.parse(localStorage.getItem("smartsupply-cart")) || []
  const wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []

  const cartCount = document.getElementById("cart-count")
  const wishlistCount = document.getElementById("wishlist-count")

  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }

  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length
  }
}

// Update wishlist count specifically
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("smartsupply-wishlist")) || []
  const wishlistCount = document.getElementById("wishlist-count")

  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length
  }
}
