//oops has a feature called class, A Class is specifically designed for generating object, (object generator), we learn how to use a fn to generate objects in oop in cart-oop.js, so now we are going to switch this to using a class to generate these objects instead, bcoz classes are cleaner and have more features than using a fn.
//naming convention - PascalCase

/* object-oriented programming 
= organsing our code into objects
  (tries to represent the real world)

class
= help us generate these objects/ object generator 

Benefits of classes 
when we generate object, it has properties and methods, a class looks like the object that we generates, it is cleaner than using a fn that we using before in cart-oop.
another benefit is constructor , it lets us run setup code
*/

class Cart {
  //cartItems = undefined;
  //localStorageKey = undefined;

  //shortcut
  cartItems;
  localStorageKey;

  //we generate an object, it will run constructor automatically
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [
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
    }
  }

  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: "1",
      });
    }

    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = []; //make new cart

    //push all items expect the same product id
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }
}

const cart = new Cart("cart-oop");
const businessCart = new Cart("cart-business");

/* turn this code into constructor
cart.localStorageKey = "cart-oop";
businessCart.localStorageKey = "cart-business";

cart.loadFromStorage();
businessCart.loadFromStorage();*/

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart); //businessCart generated from Cart
