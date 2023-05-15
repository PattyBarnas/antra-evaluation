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

const Model = (() => {
  // implement your logic for Model
  class State {
    #onChange;
    #inventory;
    #cart;
    #quantity = 0;

    constructor() {
      this.#inventory = [];
      this.#cart = [];
      this.#quantity = 0;
    }
    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }
    get quantity() {
      return this.#quantity;
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

  const renderInventory = (items) => {
    let itemTemp = "";
    items.forEach((item) => {
      const content = item.content;

      const liTemp = `<div class='item-container'><li class='list-item' inventory-id=${item.id}>${content}</li><button class="addBtn">+</button><span>${Model.State.quantity} </span><button class="removeBtn">-</button><button class="addToCart-btn">add to cart</button></div>`;
      itemTemp += liTemp;
    });
    inventoryListEl.innerHTML = itemTemp;
  };

  return {
    inventoryListEl,
    renderInventory,
  };
})();

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
  const handleUpdateAmount = () => {
    view.inventoryListEl.addEventListener("click", function (e) {
      if (e.target.className === "addBtn") {
        state.quantity++;
        console.log(typeof state.quantity);
      } else if (e.target.className === "removeBtn") {
      } else {
        return;
      }
    });
  };

  const handleAddToCart = (item) => {
    view.inventoryListEl.addEventListener("click", function (e) {
      e.preventDefault();
      let item = state.inventory.find((item) => item.id === item.id);

      console.log("clicked", e.target);
      if (e.target.className !== "addToCart-btn") return;

      const id = e.target.parentNode.getAttribute("inventory-id");

      model.addToCart(id).then((data) => {
        state.cart = [data, ...state.inventory];
      });
    });
  };

  const handleDelete = (id) => {
    // view.removeBtn.addEventListener("click", () => {
    //   state.cart.filter((item) => item.id === id);
    // });
  };

  const handleCheckout = () => {
    view.checkoutBtnEl.addEventListener("click", () => {
      model.checkout().then(() => {
        state.cart = [];
      });
    });
  };

  const bootstrap = () => {
    handleUpdateAmount();

    handleAddToCart();

    init();

    handleDelete();

    handleCheckout();

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
