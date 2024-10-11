import { addToCart, cart, loadFromStorage } from "../../data/cart.js";

describe("test suite: addToCart", () => {
  //test each condition of if statement seperately, test coverage
  it("adds an existing product to the cart", () => {
    spyOn(localStorage, "setItem");

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });

    loadFromStorage();
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(2);
  });

  it("adds a new product to the cart", () => {
    //16:40 par se dekh lo video me
    //addToCart fn doesn't return any value, so cant compare to another value using expect instead we're going to call addToCart to modify the cart and check if this cart looks correct
    //Mocks = lets us replace a method with a fake version
    //this fn is what we want getItem to do so we are essentially overwriting the original get item with our fake, hum hamesha local storage se hi data nikal kar laate the naa, ab hum uss cheez ko overwrite karke keh rahe hai ki tu khali object de, taaki hum length calculate karwa ske.

    spyOn(localStorage, "setItem");

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    });
    // console.log(localStorage.getItem("cart"));
    loadFromStorage();

    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(1);
  });
});
