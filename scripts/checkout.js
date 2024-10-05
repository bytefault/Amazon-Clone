import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; //export default dayjs function, ek hi fn default export ho skta hai
import { deliveryOptions } from "../data/deliveryOptions.js";

hello();
const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

function renderOrderSummary() {
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

    //get deliveryOptionId out of the cart, so that we can put delivery date at the top of each cart
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    // Generating the HTML structure for each cart item
    cartSummaryHTML += `
            <div class="cart-item-container 
            js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">Delivery date: ${dateString}</div>

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
                    ${deliveryOptionsHTML(matchingProduct, cartItem)} 
                  </div>
                </div>
              </div>
    `;
  });

  // Generate HTML for delivery date and update on the page
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    //Use Ecmascript external library dayjs to generate today date
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      // Generate price using ternary operator
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      //we dont want all delivery option to be checked or unchecked, we only want it to be checked if it matches the delivery option id that is saved in cart
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
                  <div class="delivery-option js-delivery-option"
                  data-product-id="${matchingProduct.id}"
                  data-delivery-option-id="${deliveryOption.id}">
                      <input
                        type="radio"
                        ${isChecked ? "checked" : ""}
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}"
                      />
                      <div>
                        <div class="delivery-option-date">${dateString}</div>
                        <div class="delivery-option-price">${priceString} Shipping</div>
                      </div>
                    </div>
        `;
    });

    return html;
  }

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

  //we have to add event listener to each radio button, to save it in the cart
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset; //shorthand property
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary(); //re run the code, it will generate new html again, deleting previous html
    });
  });
}

renderOrderSummary();

/* 
now after updating/saving delivery option id in the cart, we need to update the page, change the html, taaki green color me delivery date dikhai de, lekin refresh karne ke baad delivery date dikhta hai, but we want to change it immediately we select radio button.
so far in this course, we solve this problem is once we click this we are going to use a dom to get this element here and then update the text directly however the problem with this approach is that we need to update the page one by one and later there ,ight be lots of places on the page that we need  to change . for eg- when we change the radio button we also need to change the numbers in order summary accordingly, so there are lot of thing we need to update one by one, but there is a better way to update the page, we have already all of the code that takes our data and generates the html, so now we will re run all this code and regenerate, through function renderOrderSummary()
*/

/* 
Imagine there is an e-commerce website where you are buying a product. You add a beautiful ring to your cart and now you need to choose how fast you want it delivered to your house. The website gives you 3 delivery options:

7 days delivery (free).
3 days delivery (₹499).
1-day delivery (₹999).
When you first add the product, the system automatically chooses the free 7-day delivery option for you because that’s the default option.

Now, you go to the checkout page where you see all your cart items. For each item, you see a list of the delivery options you can choose from. Let’s say your cart looks like this:
cart = [
  {
    productId: "ring123",
    quantity: 1,
    deliveryOptionId: "2" // This means the user previously selected "3-day delivery" for this product.
  }
];
And the available delivery options are like this:
deliveryOptions = [
  { id: "1", deliveryDays: 7, priceCents: 0 },
  { id: "2", deliveryDays: 3, priceCents: 499 },
  { id: "3", deliveryDays: 1, priceCents: 999 }
];
What Happens in the Checkout Page:

Now, the website shows the delivery options for the ring you added to the cart. The radio buttons need to display which delivery option was chosen earlier. In your case, you had chosen 3-day delivery (₹499) for the ring.

In the code, this line is checking which delivery option should be checked (selected) by default:
const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
Here’s what this does:

The code is going through each delivery option (deliveryOption) one by one.

It compares the deliveryOption.id (like "1", "2", "3") with the cartItem.deliveryOptionId (which is the ID of the delivery option the user selected for that product, which is "2" in this case).

When it reaches the delivery option with id: "2" (which is the 3-day delivery option), the condition becomes true because:

deliveryOption.id === cartItem.deliveryOptionId
"2" === "2" is true.
Since it’s true, the isChecked variable becomes true, which tells the system to check the radio button for the 3-day delivery option.

For all other delivery options (like 1-day and 7-day), this comparison returns false and those options won’t be checked. 
*/

/* 
 Where should we use ${matchingProduct.id} as class and where as data-product-id?

when you don't know the product ID, but need a way to identify the product, have the element you need to call hold the data-product-id so you can know which product is linked to that element.

ex: We don't know our product ID, but every item in the cart has a delete link, so we query all of them, so we have every delete link hold a copy of the productID (data-product-id) to tell us which product that button is linked to. Now we can use that product ID to know which product we want to delete from the cart when clicking delete.

When you know the product ID already, but need a way to get the element linked to that productID use ${matchingProduct.id} in the element class.

ex: we get the product ID from the saveLink because the saveLink has the productId saved to it already(data-product-id, because of what I described above), we want to access the js-quantity-input but every item in the cart has this input element so how can we know which one we need? Let's just use the productID that we have already and add ${matchingProduct.id} to the class name and we can directly grab our input element.

Technically yes, you could have the js-quantity-input hold the productID with data-product-id, and we can do a query all and run a foreach to iterate through all these quantity input elements, trying to match the productID we have to the productID that the input element contains but this would be incredibly inefficient because we already have the ID. Why waste time checking every single item in the cart when we can go straight to it.
*/
