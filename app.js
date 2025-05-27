// Global variables
let carsData = [];
let allCars = [];

// Load cars data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCarsData();
    setupEventListeners();
});

// Load cars from JSON file
async function loadCarsData() {
    try {
        const response = await fetch('data/cars.json');
        const data = await response.json();
        carsData = data.cars;
        allCars = [...data.cars]; // Keep original copy for filtering
        displayCars(carsData);
    } catch (error) {
        console.error('Error loading cars data:', error);
        document.getElementById('carsGrid').innerHTML = '<p>Error loading cars. Please try again later.</p>';
    }
}

// Display cars in the grid
function displayCars(cars) {
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = '';

    if (cars.length === 0) {
        carsGrid.innerHTML = '<p>No cars found matching your criteria.</p>';
        return;
    }

    cars.forEach(car => {
        const availableClass = car.available ? '' : 'unavailable';
        const availableText = car.available ? 'Available' : 'Not Available';
        const availableStatus = car.available ? 'available' : 'unavailable';

        const rentButton = car.available 
            ? `<a href="reservation.html?vin=${car.vin}" class="rent-btn">Rent Now</a>`
            : `<button class="rent-btn" disabled>Rent Now</button>`;

        const carCard = `
            <div class="car-card ${availableClass}">
                <img src="${car.image}" alt="${car.brand} ${car.carModel}" loading="lazy">
                <div class="car-details">
                    <h3>${car.brand} ${car.carModel}</h3>
                    <div class="car-badges">
                        <span class="car-type">${car.carType}</span>
                        <span class="status ${availableStatus}">${availableText}</span>
                    </div>
                    <p><strong>Year:</strong> ${car.yearOfManufacture}</p>
                    <p><strong>Mileage:</strong> ${car.mileage}</p>
                    <p><strong>Fuel Type:</strong> ${car.fuelType}</p>
                    <div class="car-price-rent">
                        <span class="price">$${car.pricePerDay}/day</span>
                        ${rentButton}
                    </div>
                </div>
            </div>
        `;

        carsGrid.innerHTML += carCard;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    const carTypeFilter = document.getElementById('carTypeFilter');
    const brandFilter = document.getElementById('brandFilter');
    
    carTypeFilter.addEventListener('change', handleFilters);
    brandFilter.addEventListener('change', handleFilters);
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
        applyFilters();
        return;
    }

    const filteredCars = allCars.filter(car => {
        return car.brand.toLowerCase().includes(searchTerm) ||
               car.carModel.toLowerCase().includes(searchTerm) ||
               car.carType.toLowerCase().includes(searchTerm) ||
               car.description.toLowerCase().includes(searchTerm);
    });
    
    displayCars(filteredCars);
}

// Handle filter functionality
function handleFilters() {
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const carType = document.getElementById('carTypeFilter').value;
    const brand = document.getElementById('brandFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filteredCars = [...allCars];
    
    // Apply search filter
    if (searchTerm.length > 0) {
        filteredCars = filteredCars.filter(car => {
            return car.brand.toLowerCase().includes(searchTerm) ||
                   car.carModel.toLowerCase().includes(searchTerm) ||
                   car.carType.toLowerCase().includes(searchTerm) ||
                   car.description.toLowerCase().includes(searchTerm);
        });
    }
    
    // Apply car type filter
    if (carType) {
        filteredCars = filteredCars.filter(car => {
            return car.carType.includes(carType);
        });
    }
    
    // Apply brand filter
    if (brand) {
        filteredCars = filteredCars.filter(car => {
            return car.brand === brand;
        });
    }
    
    displayCars(filteredCars);
}