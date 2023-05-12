const API = (() => {
  const URL = "http://localhost:3000";
  const getCart = () => {
    // define your method to get cart data
  };

  const getInventory = async () => {
    // define your method to get inventory data
    const response = await fetch(URL + "/inventory");

    if (!response.ok) {
      throw new Error("Could not get inventory Data");
    }
    const inventory = await response.json();
    return await inventory;
  };

  const addToCart = async (inventoryItem) => {
    // define your method to add an item to cart
    const response = await fetch(URL + "/cart", {
      method: "POST",
      body: JSON.stringify(inventoryItem),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Could not get cart Data");
    }

    const resData = await response.json();
    return resData;
  };

  const updateCart = async (id, newAmount) => {
    // define your method to update an item in cart
    const response = await fetch(URL + `/cart/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newAmount),
    });
    if (!response.ok) {
      throw new Error("Could not get cart Data");
    }
    const resData = await response.json();

    return resData;
  };

  const deleteFromCart = async (id) => {
    // define your method to delete an item in cart
    const response = await fetch(URL + `/cart/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Could not get cart Data");
    }
    const resData = await response.json();

    return resData;
  };

  const checkout = () => {
    // you don't need to add anything here
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart(item.id)))
    );
  };

  return {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

console.log(API.getInventory().then((item) => console.log(item)));

const Model = (() => {
  // implement your logic for Model
  class State {
    #onChange;
    #inventory;
    #cart;
    constructor() {
      this.#inventory = [];
      this.#cart = [];
    }
    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }

    set cart(newCart) {
      this.#cart = newCart;
      // this.#onChange;
    }
    set inventory(newInventory) {
      this.#inventory = newInventory;
      this.#onChange;
    }

    subscribe(cb) {
      this.#onChange = cb;
    }
  }
  const {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  } = API;
  return {
    State,
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

console.log(Model.getCart);

const View = (() => {
  // implement your logic for View

  const inventoryListEl = document.querySelector(".inventory-container ul");
  const inventoryListContainer = document.querySelector(".inventory-container");
  const checkoutBtnEl = document.querySelector(".checkout-btn");

  const renderInventory = (items) => {
    let itemTemp = "";
    items.forEach((item) => {
      const content = item.content;
      // const liTemp = `<li class="li-content">${content}</li><button class="addBtn">+</button>${counter} <button class="removeBtn" >-</button><button class="addToCart-btn" >add to cart</button>`;
      let liTemp = `<li>${content}</li>`;
      itemTemp += liTemp;
    });
    inventoryListEl.innerHTML = itemTemp;
  };

  return {
    inventoryListEl,
    renderInventory,
    checkoutBtnEl,
    inventoryListContainer,
  };
})();

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {
    model.getInventory().then((data) => {
      state.inventory = data;
    });
  };
  const handleUpdateAmount = () => {};

  const handleAddToCart = (item) => {
    const exisitingCartItemIndex = state.inventory.findIndex(
      (i) => i.id === item.id
    );
    const exisitingItem = state.inventory[exisitingCartItemIndex];
    // if(item){
    //   const updatedItems = {
    //     ...exisitingItem,
    //     amount:
    //     // COMEBACK
    //   }
    // }
  };

  const handleDelete = (id) => {
    view.removeBtn.addEventListener("click", () => {
      state.cart.filter((item) => item.id === id);
    });
  };

  const handleCheckout = () => {
    view.checkoutBtnEl.addEventListener("click", () => {});
  };

  const bootstrap = () => {
    handleUpdateAmount();
    handleAddToCart();
    handleDelete();
    handleCheckout();
    init();
    state.subscribe(() => view.renderInventory(state.inventory));
  };
  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
