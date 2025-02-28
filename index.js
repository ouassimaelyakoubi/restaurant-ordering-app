import { menuArray } from './data.js';
const orderPrice = document.getElementById('order-price')
const paymentModal = document.getElementById("payment-modal");

const orderSection = document.querySelector("section.order-summary"); // Target the order summary section
const orderList = document.getElementById("order-list");

let orders = [];

function renderMenu() {
    const menuHtml = menuArray.map(menuItem => {
        return `
        <div class="menu-item">
            <div class="food-icon">
                <img src=${menuItem.emoji} alt="moroccan ${menuItem.name}">
            </div>
            <div class="food-description">
                <h2 class="food-title">${menuItem.name}</h2>
                <p class="food-ingredient">${menuItem.ingredients.join(', ')}</p>
                <p class="item-price">$${menuItem.price}</p>
            </div>
            <button class="order-btn" data-order="${menuItem.id}">+</button>
        </div>
        `;
    });
    document.getElementById("menu-list").innerHTML = menuHtml.join('');
}



function handleOrderClick(orderId) {
    const targetOrderObj = menuArray.filter(function(menuItem){
        return menuItem.id === Number(orderId)
    })[0]
           // Check if the item is already in the orders array
    const existingOrder = orders.find(order => order.id === targetOrderObj.id);
    if (existingOrder) {
        existingOrder.quantity += 1; // Increase quantity if item already exists
    } else {
        // Add a new order object with quantity 1
        orders.push({ ...targetOrderObj, quantity: 1 });
    }
        renderOrders()
}
function handleRemoveClick(orderId) {
    const orderIndex = orders.findIndex(order => order.id === Number(orderId));

    if (orderIndex !== -1) {
        const order = orders[orderIndex];
        if (order.quantity > 1) {
            // Decrease the quantity if greater than 1
            order.quantity--;
        } else {
            // Remove the item completely if quantity is 1
            orders.splice(orderIndex, 1);
        }
        renderOrders();
    }
}

document.addEventListener('click', function (e) {
    if (e.target.dataset.order) {
        handleOrderClick(e.target.dataset.order);
    } else if (e.target.dataset.remove) {
        handleRemoveClick(Number(e.target.dataset.remove));
    }
    else if(e.target.id === "complete-order-btn" ){
        paymentModal.style.display = "flex";
    }
    else if(e.target.id === "payment-modal"){
        paymentModal.style.display = "none";

    }else if (e.target.id === "pay-btn") {
        e.preventDefault(); // Prevent form submission
        let isValid = true; // Track if all fields are valid

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach(msg => msg.textContent = "");

    // Validate Name
    const nameInput = document.getElementById("name");
    if (nameInput.value.trim() === "") {
        document.getElementById("name-error").textContent = "Please enter your name.";
        isValid = false;
    }

    // Validate Card Number
    const cardInput = document.getElementById("card-number");
    if (cardInput.value.trim().length !== 16 || isNaN(cardInput.value.trim())) {
        document.getElementById("card-error").textContent = "Enter a valid 16-digit card number.";
        isValid = false;
    }

    // Validate CVV
    const cvvInput = document.getElementById("cvv");
    if (cvvInput.value.trim().length !== 3 || isNaN(cvvInput.value.trim())) {
        document.getElementById("cvv-error").textContent = "Enter a valid 3-digit CVV.";
        isValid = false;
    }

    // If all fields are valid, process the payment
    if (isValid) {
        handlePaymentSubmission();
    }
    }
});

renderMenu();
function renderOrders() {
    const orderPrice = document.getElementById('order-price')
    const totalPrice = orders.reduce((total, item) => total + item.price * item.quantity, 0);


    if (orders.length === 0) {
        orderList.innerHTML = "<p>No items in order</p>";
        orderSection.style.display = "none"; // Hide the section if no orders
    } else {
        orderList.innerHTML = orders
        .map(order => {
            // Show quantity only if greater than 1
            const quantityText = order.quantity > 1 ? ` x${order.quantity}` : '';
            return `
            <div class="order-item">
                <h2>${order.name}${quantityText}</h2>
                <button class="remove-btn" data-remove='${order.id}'>Remove</button>
                <p class="item-price price-order">$${order.price * order.quantity}</p>
            </div>
            `;
        })
            .join('')
            orderPrice.textContent = `$${totalPrice}`
        orderSection.style.display = "block"; // Show the section if there are orders
    }
}
function handlePaymentSubmission() {
    // Get the user's name from the input field
    const name = document.getElementById("name").value;

    // Display the thank-you message
    const orderMessage = document.getElementById("order-message");
    orderMessage.textContent = `Thanks, ${name}! Your order is on its way!`;
    orderMessage.style.display = "block";
    // Show the rating section
    const ratingContainer = document.getElementById("rating-container");
    ratingContainer.style.display = "block";
    document.getElementById("payment-form").reset(); // Clears all inputs
    orders = []; // Clear the orders array
    orderList.innerHTML = ""; // Clear the order list UI
    orderPrice.textContent = "$0"; // Reset the total price
    // Hide the modal
    paymentModal.style.display = "none";
    orderSection.style.display = "none";
    // Automatically hide the thank-you message after 3 seconds
    setTimeout(() => {
        orderMessage.style.display = "none";
        ratingContainer.style.display = "none";

    }, 7000);
}
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#stars .star");

    stars.forEach(star => {
        star.addEventListener("click", function() {
            const rating = this.getAttribute("data-value");
            updateStars(rating);
        });
    });
});

function updateStars(rating) {
    const stars = document.querySelectorAll("#stars .star");
    stars.forEach(star => {
        star.textContent = star.getAttribute("data-value") <= rating ? "★" : "☆";
    });
}
