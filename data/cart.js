export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
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
