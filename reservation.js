$(document).ready(function() {
    let selectedCar = null;
    let carsData = [];

    // Load cars data
    $.getJSON('data/cars.json', function(data) {
        carsData = data.cars;
        loadSelectedCar();
    }).fail(function() {
        showCarNotFound();
    });

    // Load selected car from URL parameters
    function loadSelectedCar() {
        const urlParams = new URLSearchParams(window.location.search);
        const carVin = urlParams.get('vin');
        
        if (!carVin) {
            showCarNotFound();
            return;
        }

        selectedCar = carsData.find(car => car.vin === carVin);
        
        if (!selectedCar) {
            showCarNotFound();
            return;
        }

        displaySelectedCar();
        setupFormValidation();
        setupRentalCalculation();
        setMinDate();
    }

    // Display selected car information
    function displaySelectedCar() {
        $('#carImage').attr('src', selectedCar.image);
        $('#carImage').attr('alt', selectedCar.brand + ' ' + selectedCar.carModel);
        $('#carName').text(selectedCar.brand + ' ' + selectedCar.carModel);
        $('#carYear').text(selectedCar.yearOfManufacture);
        $('#carType').text(selectedCar.carType);
        $('#carFuel').text(selectedCar.fuelType);
        $('#carMileage').text(selectedCar.mileage);
        $('#carPrice').text(selectedCar.pricePerDay);
        $('#dailyRate').text(selectedCar.pricePerDay);
        
        calculateTotal();
    }

    // Show car not found message
    function showCarNotFound() {
        $('.reservation-container').html(`
            <div class="car-not-found">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Car Not Found</h3>
                <p>Sorry, the selected car could not be found or is no longer available.</p>
                <a href="index.html" class="back-btn">
                    <i class="fas fa-arrow-left me-2"></i>Back to Car Selection
                </a>
            </div>
        `);
    }

    // Set minimum date to today
    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        $('#startDate').attr('min', today);
        $('#startDate').val(today);
    }

    // Setup rental calculation
    function setupRentalCalculation() {
        $('#rentalDays').on('input', calculateTotal);
        $('#startDate').on('change', calculateTotal);
    }

    // Calculate total rental cost
    function calculateTotal() {
        if (!selectedCar) return;
        
        const days = parseInt($('#rentalDays').val()) || 1;
        const dailyRate = selectedCar.pricePerDay;
        const total = days * dailyRate;
        
        $('#numberOfDays').text(days);
        $('#totalAmount').text(total);
    }

    // Setup form validation
    function setupFormValidation() {
        // Real-time validation
        $('#customerName').on('blur', validateName);
        $('#customerEmail').on('blur', validateEmail);
        $('#customerPhone').on('blur', validatePhone);
        $('#driversLicense').on('blur', validateLicense);
        $('#startDate').on('blur', validateStartDate);
        $('#rentalDays').on('blur', validateRentalDays);

        // Form submission
        $('#reservationForm').on('submit', handleFormSubmission);
    }

    // Validation functions
    function validateName() {
        const name = $('#customerName').val().trim();
        const isValid = name.length >= 2;
        toggleError('nameError', !isValid);
        return isValid;
    }

    function validateEmail() {
        const email = $('#customerEmail').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        toggleError('emailError', !isValid);
        return isValid;
    }

    function validatePhone() {
        const phone = $('#customerPhone').val().trim();
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        const isValid = phoneRegex.test(phone);
        toggleError('phoneError', !isValid);
        return isValid;
    }

    function validateLicense() {
        const license = $('#driversLicense').val().trim();
        const isValid = license.length >= 5;
        toggleError('licenseError', !isValid);
        return isValid;
    }

    function validateStartDate() {
        const startDate = new Date($('#startDate').val());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isValid = startDate >= today;
        toggleError('startDateError', !isValid);
        return isValid;
    }

    function validateRentalDays() {
        const days = parseInt($('#rentalDays').val());
        const isValid = days >= 1 && days <= 30;
        toggleError('daysError', !isValid);
        return isValid;
    }

    // Toggle error message display
    function toggleError(errorId, show) {
        if (show) {
            $(`#${errorId}`).addClass('show');
        } else {
            $(`#${errorId}`).removeClass('show');
        }
    }

    // Handle form submission
    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = validateName() && 
                       validateEmail() && 
                       validatePhone() && 
                       validateLicense() && 
                       validateStartDate() && 
                       validateRentalDays();

        if (!isValid) {
            alert('Please correct the errors in the form before submitting.');
            return;
        }

        // Disable submit button
        $('.submit-btn').prop('disabled', true).text('Processing...');

        // Collect form data
        const reservationData = {
            customer: {
                name: $('#customerName').val().trim(),
                email: $('#customerEmail').val().trim(),
                phoneNumber: $('#customerPhone').val().trim(),
                driversLicenseNumber: $('#driversLicense').val().trim()
            },
            car: {
                vin: selectedCar.vin,
                brand: selectedCar.brand,
                model: selectedCar.carModel,
                pricePerDay: selectedCar.pricePerDay
            },
            rental: {
                startDate: $('#startDate').val(),
                rentalPeriod: parseInt($('#rentalDays').val()),
                totalPrice: parseInt($('#totalAmount').text()),
                orderDate: new Date().toISOString().split('T')[0]
            }
        };

        // Simulate API call
        setTimeout(() => {
            processReservation(reservationData);
        }, 2000);
    }

    // Process reservation (simulate saving to orders.json)
    function processReservation(reservationData) {
        // Generate a random reservation ID
        const reservationId = 'CR' + Date.now().toString().slice(-6);
        
        // Show success modal
        $('#reservationId').text(reservationId);
        $('#successModal').modal('show');
        
        // Reset form
        $('#reservationForm')[0].reset();
        $('.submit-btn').prop('disabled', false).html('<i class="fas fa-check-circle me-2"></i>Complete Reservation');
        
        // Log reservation data (in a real app, this would be sent to the server)
        console.log('New Reservation:', {
            id: reservationId,
            ...reservationData
        });
        
        // Optional: Store in localStorage for demo purposes
        const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        existingReservations.push({
            id: reservationId,
            ...reservationData
        });
        localStorage.setItem('reservations', JSON.stringify(existingReservations));
    }

    // Handle modal close
    $('#successModal').on('hidden.bs.modal', function() {
        // Optionally redirect to home page
        // window.location.href = 'index.html';
    });
});