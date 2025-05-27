$(document).ready(function(){
    $.getJSON('data/cars.json',function(data){
        displayCars(data.cars)
    })
})

function displayCars(cars){
    const carsGrid = $('#carsGrid')

    carsGrid.empty()

    cars.forEach(function(car){
        const availableClass = car.available ? '' : 'unavailable';
        const availableText = car.available ? 'Available' : 'Not Available';
        const availableStatus = car.available ? 'available' : 'unavailable';

        const rentButton = car.available 
            ? `<a href="reservation.html?vin=${car.vin}" class="rent-btn">Rent Now</a>`
            : `<button class="rent-btn" disabled>Rent Now</button>`;

        const carCard = 
        `
        <div class="car-card ${availableClass}">
                <img src="${car.image}" alt="${car.brand} ${car.carModel}">
                <div class="car-details">
                    <h3>${car.brand} ${car.carModel}</h3>
                    <div class="car-badges">
                        <span class="car-type">${car.carType}</span>
                        <span class="status ${availableStatus}">${availableText}</span>
                    </div>
                    <p>Year: ${car.yearOfManufacture}</p>
                    <p>Mileage: ${car.mileage}</p>
                    <p>Fuel Type: ${car.fuelType}</p>
                    <div class="car-price-rent">
                        <span class="price">$${car.pricePerDay}/day</span>
                        ${rentButton}
                    </div>
                </div>
            </div>
        `;

        carsGrid.append(carCard);

    })
}

// Set up search functionality
function setupSearch(cars) {
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        if (searchTerm.length > 0) {
            // Filter cars by search term
            const filteredCars = cars.filter(car => 
                car.brand.toLowerCase().includes(searchTerm) ||
                car.carModel.toLowerCase().includes(searchTerm) ||
                car.carType.toLowerCase().includes(searchTerm) ||
                car.description.toLowerCase().includes(searchTerm)
            );
            
            displayCars(filteredCars);
        } else {
            // Show all cars if search is empty
            displayCars(cars);
        }
    });
}

// Set up filter functionality
function setupFilters(cars) {
    $('#carTypeFilter, #brandFilter').change(function() {
        const carType = $('#carTypeFilter').val();
        const brand = $('#brandFilter').val();
        
        // Filter cars based on selected options
        let filteredCars = cars;
        
        if (carType) {
            filteredCars = filteredCars.filter(car => 
                car.carType.includes(carType)
            );
        }
        
        if (brand) {
            filteredCars = filteredCars.filter(car => 
                car.brand === brand
            );
        }
        
        displayCars(filteredCars);
    });
}

$(document).ready(function() {
    $.getJSON('data/cars.json', function(data) {
        displayCars(data.cars);
        setupSearch(data.cars);
        setupFilters(data.cars);
    })
    .fail(function(jqxhr, textStatus, error) {
        console.error("Error loading cars.json: " + error);
        $('#carsGrid').html('<p>Error loading cars. Please try again later.</p>');
    });
});