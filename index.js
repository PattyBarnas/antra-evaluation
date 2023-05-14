const API = (() => {
  const URL = "http://localhost:3000";
  const getCart = async () => {
    // define your method to get cart data
    const response = await fetch(URL + "/cart");

    if (!response.ok) {
      throw new Error("Could not get inventory Data");
    }
    const inventory = await response.json();
    return inventory;
  };

  const getInventory = async () => {
    // define your method to get inventory data
    const response = await fetch(URL + "/inventory");

    if (!response.ok) {
      throw new Error("Could not get inventory Data");
    }
    const inventory = await response.json();
    console.log(inventory, "inventory");
    return inventory;
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
      this.#onChange;
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

const View = (() => {
  // implement your logic for View

  const inventoryListEl = document.querySelector(".inventory-container ul");

  const checkoutBtnEl = document.querySelector(".checkout-btn");

  const renderInventory = (items) => {
    let counter = 0;
    let itemTemp = "";
    items.forEach((item) => {
      const content = item.content;
      console.log(content, "c");
      const liTemp = `<li inventory-id=${item.id}>${content}</li><button class="addBtn">+</button>${counter} <button class="removeBtn" >-</button><button class="addToCart-btn" >add to cart</button>`;
      itemTemp += liTemp;
    });
    inventoryListEl.innerHTML = itemTemp;
  };

  return {
    inventoryListEl,
    renderInventory,
    checkoutBtnEl,
  };
})();

console.log(Model.getInventory);

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {
    model.getInventory().then((data) => {
      const items = data.map((item) => ({ ...item, count: 0 }));
      state.inventory = items;
      view.renderInventory(state.inventory);
    });

    model.getCart().then((data) => {
      const cartItems = data.map((item) => {
        state.cart = item;
      });
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
    view.checkoutBtnEl.addEventListener("click", () => {
      model.checkout().then(() => {
        state.cart = [];
      });
    });
  };

  const bootstrap = () => {
    console.log("1");
    handleUpdateAmount();
    console.log("2");
    handleAddToCart();
    console.log("3");
    init();

    console.log("0");
    handleDelete();
    // console.log("4");
    handleCheckout();
    // console.log("5");

    state.subscribe(
      () => view.renderInventory(state.inventory),
      view.renderCart(state.cart)
    );
  };
  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
