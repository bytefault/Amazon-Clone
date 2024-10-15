import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  // to get the price loop through the cart and for each product, price*quantity and add everything together
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    //loop through the cart and add all shipping cost together
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  // calculate 10% tax, 10% = multiply by 10/100 or= (0.1)
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const totalItem = calculateCartQuantity();

  const paymentSummaryHtml = `
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${totalItem}):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
            </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalCents)}
            </div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  `;
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHtml;

  //place order kaa code hum khud se naa likh kar backend se lenge
  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      try {
        //we need to send some data to the backend, send our cart, so we will use post, also we will give second parameter an object, gives backend more info about our request
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", //json means we are sending some js object
          },
          body: JSON.stringify({
            cart: cart, //actual data we are sending, cart property :  cart array, and finally we cant send obj , we need to convert it to json string
          }),
        });
        //to get the data thats attached to the response, we need to use response.json, it is also a promise, so we can use await
        const order = await response.json();
        addOrder(order);
      } catch (error) {
        console.log("error, try again later");
      }
      //it lets us control url at the top of browser, if we change the location object, it will change the url at the top
      window.location.href = "orders.html";
    });
}

//4 types of requests
// get= get something from the backend
// post= create something, let us send data
// put = update something
// delete= delete something
