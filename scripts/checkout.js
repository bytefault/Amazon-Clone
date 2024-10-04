import { cart, removeFromCart, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

//check which product to add inside cart
cart.forEach((cartItem) => {
  const productId = cartItem.productId; // Extracting productId from the cart item
  let machingProduct;

  // Finding the matching product from the product list using the productId
  products.forEach((product) => {
    if (product.id === productId) {
      machingProduct = product;
    }
  });

  // Generating the HTML structure for each cart item
  cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container-${machingProduct.id}">
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${machingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                 ${machingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  machingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary js-update-link"  data-product-id="${
                    machingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input">
                  <span class="save-quantity-link link-primary">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    machingProduct.id
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
                    name="delivery-option-${machingProduct.id}"
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
                    name="delivery-option-${machingProduct.id}"
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
                    name="delivery-option-${machingProduct.id}"
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
