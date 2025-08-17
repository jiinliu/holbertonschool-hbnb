/* 
  HBnB Frontend JavaScript - Login and Core Functionality
  Task 1: Login Implementation with JWT Authentication
*/

// ===== CONFIGURATION =====
const API_BASE_URL = 'http://127.0.0.1:5001/api/v1';

// ===== UTILITY FUNCTIONS =====

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @return {string|null} - Cookie value or null if not found
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if user is authenticated
 * @return {boolean} - True if user has valid token
 */
function isAuthenticated() {
    const token = getCookie('token');
    if (!token) return false;
    
    try {
        // Basic JWT validation - check if token has proper structure
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        // Decode payload to check expiration
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

/**
 * Get authentication headers for API requests
 * @return {Object} - Headers object with authorization
 */
function getAuthHeaders() {
    const token = getCookie('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

/**
 * Show error message in a form
 * @param {HTMLElement} form - Form element
 * @param {string} message - Error message
 */
function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        // Create error div if it doesn't exist
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.display = 'block';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, form.firstChild);
    }
}

/**
 * Hide error message in a form
 * @param {HTMLElement} form - Form element
 */
function hideError(form) {
    const errorDiv = form.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

/**
 * Show loading state for a button
 * @param {HTMLElement} button - Button element
 */
function showLoading(button) {
    const buttonText = button.querySelector('.button-text');
    const loadingSpinner = button.querySelector('.loading-spinner');
    
    if (buttonText) buttonText.style.display = 'none';
    if (loadingSpinner) loadingSpinner.style.display = 'inline-block';
    
    button.disabled = true;
}

/**
 * Hide loading state for a button
 * @param {HTMLElement} button - Button element
 */
function hideLoading(button) {
    const buttonText = button.querySelector('.button-text');
    const loadingSpinner = button.querySelector('.loading-spinner');
    
    if (buttonText) buttonText.style.display = 'inline-block';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    button.disabled = false;
}

// ===== LOGIN FUNCTIONALITY =====

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @return {Object} - Login result with success status and data
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Handle login form submission
 * @param {Event} event - Form submission event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Basic validation
    if (!email || !password) {
        showError(form, 'Please enter both email and password.');
        return;
    }
    
    // Hide any existing errors
    hideError(form);
    
    // Show loading state
    showLoading(submitButton);
    
    try {
        // Attempt login
        const result = await loginUser(email, password);
        
        if (result.success) {
            // Store JWT token in cookie
            setCookie('token', result.data.access_token, 7); // Store for 7 days
            
            // Show success message briefly
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            form.insertBefore(successMessage, form.firstChild);
            
            // Redirect to main page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            // Show error message
            showError(form, result.error);
        }
    } catch (error) {
        console.error('Login handling error:', error);
        showError(form, 'An unexpected error occurred. Please try again.');
    } finally {
        // Always hide loading state
        hideLoading(submitButton);
    }
}

/**
 * Handle logout functionality
 */
function logout() {
    deleteCookie('token');
    window.location.href = 'login.html';
}

/**
 * Update navigation based on authentication status
 */
function updateNavigation() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (isAuthenticated()) {
        // User is logged in - hide login link, show logout link
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (logoutLink) {
            logoutLink.style.display = 'inline-block';
        }
    } else {
        // User is not logged in - show login link, hide logout link
        if (loginLink) {
            loginLink.style.display = 'inline-block';
        }
        if (logoutLink) {
            logoutLink.style.display = 'none';
        }
    }
}

/**
 * Redirect to login if user is not authenticated (for protected pages)
 */
function requireAuthentication() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// ===== PAGE-SPECIFIC FUNCTIONALITY =====

/**
 * Initialize login page functionality
 */
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // If user is already logged in, redirect to main page
        if (isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
}

/**
 * Initialize index page functionality
 */
function initIndexPage() {
    console.log('Index page loaded. Initializing places functionality...');
    
    // Check authentication and update navigation
    checkAuthentication();
    
    // Initialize price filter
    initializePriceFilter();
}

/**
 * Check user authentication and control login/logout link visibility
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (!token || !isAuthenticated()) {
        // User is not authenticated - show login link, hide logout link
        if (loginLink) {
            loginLink.style.display = 'inline-block';
        }
        if (logoutLink) {
            logoutLink.style.display = 'none';
        }
        console.log('User not authenticated. Login link shown.');
    } else {
        // User is authenticated - hide login link, show logout link
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (logoutLink) {
            logoutLink.style.display = 'inline-block';
        }
        console.log('User authenticated. Logout link shown. Fetching places data...');
        // Fetch places data if the user is authenticated
        fetchPlaces();
    }
}

/**
 * Fetch places data from the API
 */
async function fetchPlaces() {
    try {
        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const places = await response.json();
            console.log(`Fetched ${places.length} places from API`);
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.status, response.statusText);
            // If unauthorized, redirect to login
            if (response.status === 401) {
                deleteCookie('token');
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error('Error fetching places:', error);
        // Show error message to user
        const placesContainer = document.getElementById('places-list');
        if (placesContainer) {
            placesContainer.innerHTML = '<div class="error-message" style="display: block;">Failed to load places. Please try again later.</div>';
        }
    }
}

/**
 * Display places in the places list container
 * @param {Array} places - Array of place objects
 */
function displayPlaces(places) {
    const placesContainer = document.getElementById('places-list');
    if (!placesContainer) {
        console.error('Places container not found');
        return;
    }

    // Clear existing content
    placesContainer.innerHTML = '';

    if (!places || places.length === 0) {
        placesContainer.innerHTML = '<div class="no-places">No places available at the moment.</div>';
        return;
    }

    // Create place cards
    places.forEach(place => {
        const placeCard = createPlaceCard(place);
        placesContainer.appendChild(placeCard);
    });

    console.log(`Displayed ${places.length} places`);
}

/**
 * Create a place card element
 * @param {Object} place - Place object from API
 * @return {HTMLElement} - Place card element
 */
function createPlaceCard(place) {
    const placeCard = document.createElement('div');
    placeCard.className = 'place-card';
    placeCard.setAttribute('data-price', place.price);

    // Create place image
    const placeImage = document.createElement('img');
    placeImage.src = 'images/icon.png'; // Using default icon as placeholder
    placeImage.alt = place.title;
    placeImage.className = 'place-image';

    // Create place info container
    const placeInfo = document.createElement('div');
    placeInfo.className = 'place-info';

    // Place name
    const placeName = document.createElement('h3');
    placeName.className = 'place-name';
    placeName.textContent = place.title;

    // Place price
    const placePrice = document.createElement('p');
    placePrice.className = 'place-price';
    placePrice.innerHTML = `$<span class="price-amount">${place.price}</span> per night`;

    // Place description
    const placeDescription = document.createElement('p');
    placeDescription.className = 'place-description';
    placeDescription.textContent = place.description;
    placeDescription.style.fontSize = '0.9rem';
    placeDescription.style.color = '#666';
    placeDescription.style.marginBottom = '15px';
    placeDescription.style.flexGrow = '1';
    placeDescription.style.overflow = 'hidden';
    placeDescription.style.textOverflow = 'ellipsis';
    placeDescription.style.display = '-webkit-box';
    placeDescription.style.webkitLineClamp = '5';
    placeDescription.style.webkitBoxOrient = 'vertical';

    // Amenities removed from place cards as requested

    // Details button
    const detailsButton = document.createElement('button');
    detailsButton.className = 'details-button';
    detailsButton.textContent = 'View Details';
    detailsButton.onclick = () => {
        // Navigate to place details page with place ID
        window.location.href = `place.html?id=${place.id}`;
    };

    // Assemble the place info
    placeInfo.appendChild(placeName);
    placeInfo.appendChild(placePrice);
    placeInfo.appendChild(placeDescription);
    placeInfo.appendChild(detailsButton);

    // Assemble the place card
    placeCard.appendChild(placeImage);
    placeCard.appendChild(placeInfo);

    return placeCard;
}

/**
 * Initialize price filter functionality
 */
function initializePriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    if (!priceFilter) {
        console.error('Price filter not found');
        return;
    }

    // Populate price filter options as specified in instructions
    priceFilter.innerHTML = `
        <option value="">All</option>
        <option value="10">Under $10</option>
        <option value="50">Under $50</option>
        <option value="100">Under $100</option>
    `;

    // Add event listener for price filtering
    priceFilter.addEventListener('change', (event) => {
        filterPlacesByPrice(event.target.value);
    });

    console.log('Price filter initialized');
}

/**
 * Filter places by price without reloading the page
 * @param {string} maxPrice - Maximum price filter value
 */
function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        const placePrice = parseFloat(card.getAttribute('data-price'));
        
        if (maxPrice === '' || placePrice <= parseFloat(maxPrice)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    const visiblePlaces = document.querySelectorAll('.place-card:not([style*="display: none"])').length;
    console.log(`Price filter applied. Showing ${visiblePlaces} places with max price: ${maxPrice || 'All'}`);
}

/**
 * Get place ID from URL query parameters
 * @return {string|null} - Place ID or null if not found
 */
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Initialize place details page functionality
 */
function initPlacePage() {
    updateNavigation();
    
    const placeId = getPlaceIdFromURL();
    if (!placeId) {
        console.error('No place ID found in URL');
        // Redirect to index if no place ID
        window.location.href = 'index.html';
        return;
    }
    
    console.log(`Place details page loaded for place ID: ${placeId}`);
    
    // Check authentication and show/hide review form
    checkPlaceAuthentication(placeId);
}

/**
 * Check user authentication for place page and control review form visibility
 * @param {string} placeId - Place ID to fetch details for
 */
function checkPlaceAuthentication(placeId) {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');
    const reviewLoginPrompt = document.getElementById('review-login-prompt');
    const addReviewLink = document.getElementById('add-review-link');
    
    if (!token || !isAuthenticated()) {
        // User is not authenticated - hide review form and link, show login prompt
        if (addReviewSection) {
            addReviewSection.style.display = 'none';
        }
        if (addReviewLink) {
            addReviewLink.style.display = 'none';
        }
        if (reviewLoginPrompt) {
            reviewLoginPrompt.style.display = 'block';
        }
        console.log('User not authenticated. Review form hidden.');
        
        // Fetch place details without authentication
        fetchPlaceDetails(null, placeId);
    } else {
        // User is authenticated - show review link, hide review form and login prompt
        if (addReviewSection) {
            addReviewSection.style.display = 'none';  // Hide inline form
        }
        if (addReviewLink) {
            addReviewLink.style.display = 'inline-block';
            addReviewLink.href = `add_review.html?id=${placeId}`;
        }
        if (reviewLoginPrompt) {
            reviewLoginPrompt.style.display = 'none';
        }
        console.log('User authenticated. Add review link shown.');
        
        // Fetch place details with authentication
        fetchPlaceDetails(token, placeId);
    }
}

/**
 * Fetch place details from the API
 * @param {string|null} token - JWT token (can be null for unauthenticated requests)
 * @param {string} placeId - Place ID to fetch details for
 */
async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = token ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            console.log('Fetched place details:', place);
            displayPlaceDetails(place);
            
            // Fetch reviews for this place
            fetchPlaceReviews(placeId);
        } else {
            console.error('Failed to fetch place details:', response.status, response.statusText);
            // Show error message
            const placeDetails = document.getElementById('place-details');
            if (placeDetails) {
                placeDetails.innerHTML = '<div class="error-message" style="display: block;">Failed to load place details. Please try again.</div>';
            }
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        const placeDetails = document.getElementById('place-details');
        if (placeDetails) {
            placeDetails.innerHTML = '<div class="error-message" style="display: block;">Failed to load place details. Please try again later.</div>';
        }
    }
}

/**
 * Display place details in the page
 * @param {Object} place - Place object from API
 */
function displayPlaceDetails(place) {
    // Update page title
    document.title = `HBnB - ${place.title}`;
    
    // Update place title
    const placeTitle = document.getElementById('place-title');
    if (placeTitle) {
        placeTitle.textContent = place.title;
    }
    
    // Update place image
    const placeImage = document.getElementById('place-image');
    if (placeImage) {
        placeImage.src = 'images/icon.png'; // Using default icon
        placeImage.alt = place.title;
    }
    
    // Update host information
    const hostName = document.getElementById('host-name');
    if (hostName && place.owner) {
        hostName.textContent = `${place.owner.first_name} ${place.owner.last_name}`;
    }
    
    // Update price
    const placePrice = document.getElementById('place-price');
    if (placePrice) {
        placePrice.textContent = place.price || '0';
    }
    
    // Update description
    const placeDescriptionText = document.getElementById('place-description-text');
    if (placeDescriptionText) {
        placeDescriptionText.textContent = place.description;
    }
    
    // Update coordinates
    const placeLatitude = document.getElementById('place-latitude');
    const placeLongitude = document.getElementById('place-longitude');
    if (placeLatitude) placeLatitude.textContent = place.latitude;
    if (placeLongitude) placeLongitude.textContent = place.longitude;
    
    // Update amenities
    const amenitiesList = document.getElementById('amenities-list');
    if (amenitiesList && place.amenities) {
        amenitiesList.innerHTML = '';
        
        // Create amenity icon mapping
        const getAmenityIcon = (amenityName) => {
            const iconMap = {
                'WiFi': '📶',
                'Air Conditioning': '❄️',
                'Swimming Pool': '🏊‍♀️',
                'Gym': '🏋️‍♀️',
                'Parking': '🅿️',
                'Kitchen': '🍳',
                'Washing Machine': '🧺',
                'TV': '📺',
                'Balcony': '🪴',
                'Pet Friendly': '🐕',
                'Smoking Allowed': '🚬',
                'Fireplace': '🔥',
                'Pool': '🏊‍♀️',
                'Ocean View': '🌊',
                'Beach Access': '🏖️',
                'Private Beach': '🏖️',
                'Spa': '💆‍♀️',
                'Spa Services': '💆‍♀️',
                'Hot Tub': '🛀',
                'Sauna': '🧖‍♀️',
                'Garden': '🌿',
                'Terrace': '🪴',
                'Deck': '🪵',
                'Grill': '🔥',
                'BBQ': '🔥',
                'Game Room': '🎮',
                'Library': '📚',
                'Office': '💼',
                'Laundry': '🧺',
                'Dryer': '🌪️',
                'Iron': '🔧',
                'Hair Dryer': '💇‍♀️',
                'Safe': '🔒',
                'First Aid Kit': '🩹',
                'Elevator': '🛗',
                'Wheelchair Accessible': '♿',
                'Family Friendly': '👨‍👩‍👧‍👦',
                'Quiet Area': '🤫',
                'No Smoking': '🚭',
                'Adults Only': '🔞',
                'Private Dock': '⚓',
                'Yacht Access': '🛥️',
                'Water Sports Equipment': '🏄‍♀️',
                'Infinity Pool': '🏊‍♀️',
                'Personal Chef': '👨‍🍳'
            };
            return iconMap[amenityName] || '🏠';
        };
        
        if (place.amenities.length > 0) {
            place.amenities.forEach(amenity => {
                const amenityItem = document.createElement('div');
                amenityItem.className = 'amenity-item';
                const icon = getAmenityIcon(amenity.name);
                amenityItem.innerHTML = `
                    <span style="font-size: 20px; margin-right: 8px;">${icon}</span>
                    <span>${amenity.name}</span>
                `;
                amenitiesList.appendChild(amenityItem);
            });
        } else {
            // Show default amenities if none from API
            const defaultAmenities = [
                { name: 'WiFi', emoji: '📶' },
                { name: 'Ocean View', emoji: '🌊' },
                { name: 'Private Beach', emoji: '🏖️' },
                { name: 'Swimming Pool', emoji: '🏊‍♀️' },
                { name: 'Kitchen', emoji: '🍳' },
                { name: 'Air Conditioning', emoji: '❄️' }
            ];
            
            defaultAmenities.forEach(amenity => {
                const amenityItem = document.createElement('div');
                amenityItem.className = 'amenity-item';
                amenityItem.innerHTML = `
                    <span style="font-size: 20px; margin-right: 8px;">${amenity.emoji}</span>
                    <span>${amenity.name}</span>
                `;
                amenitiesList.appendChild(amenityItem);
            });
        }
    }
    
    console.log('Place details displayed successfully');
}

/**
 * Fetch reviews for a specific place
 * @param {string} placeId - Place ID to fetch reviews for
 */
async function fetchPlaceReviews(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const reviews = await response.json();
            console.log(`Fetched ${reviews.length} reviews for place ${placeId}`);
            displayPlaceReviews(reviews);
        } else {
            console.error('Failed to fetch reviews:', response.status);
            // Show no reviews message
            displayPlaceReviews([]);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        displayPlaceReviews([]);
    }
}

/**
 * Display place reviews
 * @param {Array} reviews - Array of review objects
 */
function displayPlaceReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    const noReviews = document.getElementById('no-reviews');
    
    if (!reviewsContainer) return;
    
    // Clear existing reviews
    reviewsContainer.innerHTML = '';
    
    // Update rating and review count based on actual data
    updatePlaceRating(reviews);
    
    if (!reviews || reviews.length === 0) {
        // Show no reviews message
        if (noReviews) {
            noReviews.style.display = 'block';
        }
        return;
    }
    
    // Hide no reviews message
    if (noReviews) {
        noReviews.style.display = 'none';
    }
    
    // Create review cards
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
    
    console.log(`Displayed ${reviews.length} reviews`);
}

/**
 * Update place rating display based on review data
 * @param {Array} reviews - Array of review objects
 */
function updatePlaceRating(reviews) {
    const starsElement = document.querySelector('.place-rating .stars');
    const ratingCountElement = document.querySelector('.place-rating .rating-count');
    
    if (!starsElement || !ratingCountElement) return;
    
    if (!reviews || reviews.length === 0) {
        // No reviews - show empty stars and no reviews text
        starsElement.textContent = '☆☆☆☆☆';
        ratingCountElement.textContent = '(No reviews yet)';
        return;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const roundedRating = Math.round(averageRating);
    
    // Generate stars display
    const filledStars = '★'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(5 - roundedRating);
    const starsDisplay = filledStars + emptyStars;
    
    // Update display
    starsElement.textContent = starsDisplay;
    ratingCountElement.textContent = `(${reviews.length} review${reviews.length !== 1 ? 's' : ''})`;
    
    console.log(`Updated rating: ${averageRating.toFixed(1)}/5 (${reviews.length} reviews)`);
}

/**
 * Create a review card element
 * @param {Object} review - Review object from API
 * @return {HTMLElement} - Review card element
 */
function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Generate stars based on rating
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    // Use user information from the API response
    const authorName = review.user
        ? `${review.user.first_name} ${review.user.last_name}`.trim()
        : `User ${review.user_id ? review.user_id.substring(0, 8) : 'Unknown'}`;
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="review-author">
                <strong class="author-name">${authorName}</strong>
            </div>
            <div class="review-rating">
                <span class="stars">${stars}</span>
            </div>
        </div>
        <div class="review-content">
            <p class="review-text">${review.text}</p>
        </div>
        <div class="review-date">
            <small>Review ID: <span class="review-date-text">${review.id}</span></small>
        </div>
    `;
    
    return reviewCard;
}

/**
 * Initialize add review page functionality
 */
function initAddReviewPage() {
    updateNavigation();
    
    // Require authentication for this page
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get place ID from URL
    const placeId = getPlaceIdFromURL();
    if (!placeId) {
        console.error('No place ID found in URL');
        window.location.href = 'index.html';
        return;
    }
    
    console.log(`Add review page loaded for place ID: ${placeId}`);
    
    // Initialize the page with place information
    initReviewPageData(placeId);
    
    // Initialize review form handling
    initReviewForm(placeId);
    
    // Initialize rating preview functionality
    initRatingPreview();
}

/**
 * Initialize review page data - fetch and display place information
 * @param {string} placeId - Place ID to fetch data for
 */
async function initReviewPageData(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const place = await response.json();
            console.log('Fetched place data for review page:', place);
            displayReviewPagePlace(place);
        } else {
            console.error('Failed to fetch place data:', response.status);
            // Redirect to index if place not found
            if (response.status === 404) {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error fetching place data:', error);
        window.location.href = 'index.html';
    }
}

/**
 * Display place information on the add review page
 * @param {Object} place - Place object from API
 */
function displayReviewPagePlace(place) {
    // Update place name
    const placeName = document.getElementById('place-name');
    if (placeName) {
        placeName.textContent = place.title;
    }
    
    // Update host name
    const hostName = document.getElementById('host-name');
    if (hostName && place.owner) {
        hostName.textContent = `${place.owner.first_name} ${place.owner.last_name}`;
    }
    
    // Update price
    const priceAmount = document.getElementById('price-amount');
    if (priceAmount) {
        priceAmount.textContent = place.price || '0';
    }
    
    // Update place thumbnail
    const placeThumbnail = document.getElementById('place-thumbnail');
    if (placeThumbnail) {
        placeThumbnail.src = 'images/icon.png'; // Using default icon
        placeThumbnail.alt = place.title;
    }
    
    console.log('Place information displayed on review page');
}

/**
 * Initialize review form handling
 * @param {string} placeId - Place ID for the review
 */
function initReviewForm(placeId) {
    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) {
        console.error('Review form not found');
        return;
    }
    
    // Add form submission event listener
    reviewForm.addEventListener('submit', (event) => {
        handleReviewSubmission(event, placeId);
    });
    
    console.log('Review form initialized');
}

/**
 * Initialize rating preview functionality
 */
function initRatingPreview() {
    const ratingSelect = document.getElementById('rating');
    const ratingPreview = document.getElementById('rating-preview');
    
    if (!ratingSelect || !ratingPreview) return;
    
    // Add event listener for rating changes
    ratingSelect.addEventListener('change', (event) => {
        const rating = parseInt(event.target.value);
        const starsSpan = ratingPreview.querySelector('.stars');
        
        if (starsSpan && rating >= 1 && rating <= 5) {
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            starsSpan.textContent = stars;
            ratingPreview.style.display = 'block';
        } else {
            ratingPreview.style.display = 'none';
        }
    });
    
    console.log('Rating preview initialized');
}

/**
 * Handle review form submission
 * @param {Event} event - Form submission event
 * @param {string} placeId - Place ID for the review
 */
async function handleReviewSubmission(event, placeId) {
    event.preventDefault();
    
    const form = event.target;
    const ratingSelect = form.querySelector('#rating');
    const reviewTextarea = form.querySelector('#review');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Get form values
    const rating = parseInt(ratingSelect.value);
    const reviewText = reviewTextarea.value.trim();
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
        showReviewError('Please select a rating between 1 and 5 stars.');
        return;
    }
    
    if (!reviewText || reviewText.length < 10) {
        showReviewError('Please write a review with at least 10 characters.');
        return;
    }
    
    // Hide any existing messages
    hideReviewMessages();
    
    // Show loading state
    showLoading(submitButton);
    
    try {
        // Submit review
        const result = await submitReview(placeId, rating, reviewText);
        
        if (result.success) {
            // Show success message
            showReviewSuccess('Thank you! Your review has been submitted successfully.');
            
            // Clear form
            form.reset();
            const ratingPreview = document.getElementById('rating-preview');
            if (ratingPreview) {
                ratingPreview.style.display = 'none';
            }
            
            // Redirect back to place page after a delay
            setTimeout(() => {
                window.location.href = `place.html?id=${placeId}`;
            }, 2000);
            
        } else {
            showReviewError(result.error);
        }
    } catch (error) {
        console.error('Review submission error:', error);
        showReviewError('An unexpected error occurred. Please try again.');
    } finally {
        hideLoading(submitButton);
    }
}

/**
 * Submit review to the API
 * @param {string} placeId - Place ID
 * @param {number} rating - Rating (1-5)
 * @param {string} text - Review text
 * @return {Object} - Submission result
 */
async function submitReview(placeId, rating, text) {
    try {
        console.log('Submitting review with data:', { place_id: placeId, rating, text });
        console.log('Using headers:', getAuthHeaders());
        
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                place_id: placeId,
                rating: rating,
                text: text
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.error || 'Failed to submit review' };
        }
    } catch (error) {
        console.error('Review submission error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Show review success message
 * @param {string} message - Success message
 */
function showReviewSuccess(message) {
    const successDiv = document.getElementById('review-success');
    const errorDiv = document.getElementById('review-error');
    
    // Hide error if shown
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    // Show success
    if (successDiv) {
        const messageP = successDiv.querySelector('p');
        if (messageP) {
            messageP.textContent = message;
        }
        successDiv.style.display = 'block';
    }
}

/**
 * Show review error message
 * @param {string} message - Error message
 */
function showReviewError(message) {
    const errorDiv = document.getElementById('review-error');
    const successDiv = document.getElementById('review-success');
    
    // Hide success if shown
    if (successDiv) {
        successDiv.style.display = 'none';
    }
    
    // Show error
    if (errorDiv) {
        const messageP = errorDiv.querySelector('p');
        if (messageP) {
            messageP.textContent = message;
        }
        errorDiv.style.display = 'block';
    }
}

/**
 * Hide review messages (both success and error)
 */
function hideReviewMessages() {
    const successDiv = document.getElementById('review-success');
    const errorDiv = document.getElementById('review-error');
    
    if (successDiv) {
        successDiv.style.display = 'none';
    }
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// ===== MAIN INITIALIZATION =====

/**
 * Initialize the application based on current page
 */
function initializeApp() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'login.html':
            initLoginPage();
            break;
        case 'index.html':
        case '':
            initIndexPage();
            break;
        case 'place.html':
            initPlacePage();
            break;
        case 'add_review.html':
            initAddReviewPage();
            break;
        default:
            // Default initialization
            updateNavigation();
            break;
    }
}

// ===== EVENT LISTENERS =====

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('HBnB Frontend initialized');
    initializeApp();
});

// Handle page visibility changes (to check token expiration)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isAuthenticated() && window.location.pathname !== '/login.html') {
        // Token expired or invalid, redirect to login
        updateNavigation();
    }
});