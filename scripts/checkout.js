import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

//check which product to add inside cart
cart.forEach((cartItem) => {
  const productId = cartItem.productId; // Extracting productId from the cart item
  let matchingProduct;

  // Finding the matching product from the product list using the productId
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  // Generating the HTML structure for each cart item
  cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary js-update-link"  data-product-id="${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${
                    matchingProduct.id
                  }">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${
                    matchingProduct.id
                  }">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Tuesday, June 21</div>
                    <div class="delivery-option-price">FREE Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Wednesday, June 15</div>
                    <div class="delivery-option-price">$4.99 - Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Monday, June 13</div>
                    <div class="delivery-option-price">$9.99 - Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;
});
// Adding the generated cart summary HTML to the DOM
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

// Adding event listeners for the "Delete" button for each cart item
document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId; // Get the product ID from the data attribute
    removeFromCart(productId); // Remove the product from the cart

    const container = document.querySelector(
      `.js-cart-item-container-${productId}` // Select the container for the deleted product
    );
    container.remove(); // Remove the HTML element for the deleted cart item
    updateCartQuantity();
  });
});

// updating html inside checkout brackets
function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = ` ${cartQuantity} items`;
}
updateCartQuantity();

// changes on clicking update button
document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    //get the cart item container for the product
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity"); // show input and save button, hide update button
  });
});

// changes on clicking save button
document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    /* Here's an example of a feature we can add: validation.
    Note: we need to move the quantity-related code up
    because if the new quantity is not valid, we should
    return early and NOT run the rest of the code. This
    technique is called an "early return". */

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert("Quantity must be at least 0 and less than 1000");
      return;
    }

    updateQuantity(productId, newQuantity); //update quantity in cart

    //get the cart item container for the product
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove("is-editing-quantity"); //hide input and save button, only show update button, just opposite what we did above

    //update the quantity in the html
    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;

    updateCartQuantity(); //updating html inside checkout brackets
  });
});
