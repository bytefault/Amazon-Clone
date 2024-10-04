//dummy data
export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let machingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      machingItem = cartItem;
    }
  });

  if (machingItem) {
    machingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

// update quantity when click on update and save
export function updateQuantity(productId, newQuantity) {
  let machingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      machingItem = cartItem;
    }
  });
  machingItem.quantity = newQuantity;
  saveToStorage();
}

// when we click on delete, remove from cart
export function removeFromCart(productId) {
  const newCart = []; //make new cart

  //push all items expect the same product id
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}
