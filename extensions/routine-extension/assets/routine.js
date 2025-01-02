document.addEventListener("alpine:init", () => {
  Alpine.data("routine", () => ({
    tab: 1, //Tab to display
    isUserRoutine: false, // User routine status

    routine: {}, //Routine data

    // Loading
    isLoading: true,
    isCartLoading: false,

    // Products
    products: [], // All products fetched from API
    tempProducts: [], // Temporary products for filtering
    selectedProducts: [], // Products selected by user

    // Description
    expanded: false, // Expanded status

    //Weekly Benefits
    weeklyBenefits: [],

    // Reminder Modals
    selectedReminder: null, // Store selected reminder data
    productReminderModalOpen: false,
    activityReminderModalOpen: false,

    whatsapp: "",
    isAddingChannels: false, // Adding channels status

    // User routine start date
    userRoutineStartDate: "",

    //Create Routine Status
    isCreatingRoutine: false,

    // Routine Start Modal
    routineStartModalOpen: false,

    // Initialize routine data on Alpine init
    init() {
      window.scrollTo(0, 0);
      this.getRoutine();
    },

    //Get Routine
    async getRoutine() {
      try {
        const id = new URLSearchParams(window.location.search).get("id");

        if (!id) {
          console.error("Routine ID not found");
          return;
        }

        this.isLoading = true;

        const response = await fetch(
          `https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/reminderlist/list/templates/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMyMDQ4NjY3LCJleHAiOjE3NjM2MDYyNjd9.DIJmmUM6Kxh234VUKjGXq7SewOZSXS3QL_jEUPmYFw0",
            },
          },
        );

        const data = await response.json();
        this.isLoading = false;
        this.routine = { ...data.data, loaded: false };

        this.products = data.data.productReminders.map(
          ({ variationId, name, image, dosageQty }) => ({
            name,
            image,
            variationId,
            quantity: 1,
            dosageQty,
            loaded: false,
          }),
        );

        this.products = [...this.products, ...this.products, ...this.products];

        this.weeklyBenefits = data.data.benefits?.weeklyBenefits;

        this.userReminderChannels = data.data.channel.map((channel) => ({
          id: channel.id,
          name: channel.name,
          checked: false,
        }));

        console.log("Routine data:", data);
      } catch (error) {
        console.error("Error fetching routine:", error);
      } finally {
        document.querySelector("#routine-skeleton").style.display = "none";
        this.isLoading = false;
      }
    },

    //Change Tab
    changeTab(tab) {
      window.scrollTo(0, 0);
      this.tab = tab;
    },

    // Open product reminder modal and set selected reminder
    openProductReminderModal(reminder) {
      this.selectedReminder = reminder;
      this.productReminderModalOpen = true;
    },

    // Open activity reminder modal and set selected reminder
    openActivityReminderModal(reminder) {
      this.selectedReminder = reminder;
      this.activityReminderModalOpen = true;
    },

    //Select Product
    selectProduct(product) {
      const index = this.selectedProducts.findIndex(
        (selectedProduct) =>
          selectedProduct.variationId === product.variationId,
      );

      if (index === -1) {
        this.selectedProducts.push(product);
      } else {
        this.selectedProducts.splice(index, 1);
      }
    },

    //Add To Cart Products
    async addToCart(products = []) {
      console.log("Adding to cart");
      this.isCartLoading = true;

      let cartItems = [];

      // Determine which products to add to cart
      if (products.length > 0 && this.selectedProducts.length === 0) {
        cartItems = products.map((product) => ({
          id: product.variationId,
          quantity: product.quantity,
        }));
      } else if (this.selectedProducts.length > 0) {
        cartItems = this.selectedProducts.map((product) => ({
          id: product.variationId,
          quantity: this.products.find(
            (item) => item.variationId === product.variationId,
          ).quantity,
        }));
      } else {
        console.log("No products selected");
        this.isCartLoading = false;
        return;
      }

      try {
        const response = await fetch(
          window.Shopify.routes.root + `cart/add.js`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems }),
          },
        );

        const data = await response.json();
        console.log("Cart response:", data);
        this.refreshCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        this.isCartLoading = false;
      }
    },

    // Add reminder channels
    async addChannels() {
      try {
        this.isAddingChannels = true;

        const channel = {};

        if (this.index.includes(0)) {
          channel.sms = {
            value: this.userReminderChannels.sms,
            status: true,
          };
        }

        if (this.index.includes(1)) {
          channel.whatsapp = {
            value: this.userReminderChannels.whatsapp,
            status: true,
          };
        }

        const response = await fetch(
          `https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/channel`,
          {
            method: "POST",
            body: JSON.stringify(channel),
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMyMDQ4NjY3LCJleHAiOjE3NjM2MDYyNjd9.DIJmmUM6Kxh234VUKjGXq7SewOZSXS3QL_jEUPmYFw0",
            },
          },
        );

        const data = await response.json();

        console.log("Channel data:", data);

        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });

        this.isAddingChannels = false;
      } catch (error) {
        console.error("Error Adding Channels:", error);
      } finally {
        this.isAddingChannels = false;
      }
    },

    startRoutine() {
      const customerId = localStorage.getItem("customer");

      console.log("Customer ID:", customerId);

      if (customerId === "" || customerId === null) {
        alert("Please login to start routine");
        return;
      }

      const channels = [];

      if (this.index.includes(0)) {
        channels.push("sms");
      }

      if (this.index.includes(1)) {
        channels.push("whatsapp");
      }

      const [day, month, year] = this.userRoutineStartDate.split("-");
      const startDate = `${year}-${month}-${day}`;

      console.log({ channels, startDate });

      this.createRoutine({ startDate, channels });
    },

    async createRoutine(data) {
      try {
        this.isCreatingRoutine = true;
        const id = new URLSearchParams(window.location.search).get("id");

        const response = await fetch(
          `https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/reminderlist/template/clone/${id}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMyMDQ4NjY3LCJleHAiOjE3NjM2MDYyNjd9.DIJmmUM6Kxh234VUKjGXq7SewOZSXS3QL_jEUPmYFw0",
            },
          },
        );

        const result = await response.json();

        console.log("Routine Start response:", result);

        this.isCreatingRoutine = false;

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        this.routineStartModalOpen = true;
      } catch (error) {
        console.error("Error starting routine:", error);
        this.isCreatingRoutine = false;
      }
    },

    refreshCart() {
      fetch("/cart.js")
        .then((response) => response.json())
        .then((data) => {
          // Update cart UI using `data.items`
          console.log("Cart data:", data);
          this.refreshCartDrawer(data);
        })
        .catch((error) => console.error("Error refreshing cart:", error));
    },
    refreshCartDrawer(cartData) {
      const cartDrawer = document.querySelector("[data-cart-items]");
      cartDrawer.innerHTML = "";

      if (!cartData.items.length) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }

      cartData.items.forEach((item) => {
        const itemHTML = `
            <div data-cart-item class="t4s-mini_cart__item cart_item_${item.id} t4s-d-flex t4s-align-items-center t4s-pr t4s-oh${item.gift_pr_id === item.product_id ? " is--gift" : ""}">
              <a href="${item.url}" class="t4s-mini_cart__img t4s-pr t4s-oh t4s_ratio t4s-bg-11" style="background: url(${item.image ? item.image : ""}); --aspect-ratioapt:${item.image ? item.image.aspect_ratio || 1 : 1}">
                ${item.image ? `<img class="lazyloadt4s" width="120" height="${Math.ceil(120 / (item.image.aspect_ratio || 1))}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="${item.image}" alt="${item.alt}">` : ""}
              </a>
              <div class="t4s-mini_cart__info">
                <a href="${item.url}" class="t4s-mini_cart__title t4s-truncate">${item.title}</a>
                <div class="t4s-mini_cart__meta">
                  ${item.variant_title ? `<p class="t4s-cart_meta_variant">${item.variant_title}</p>` : ""}
                  <div class="t4s-cart_meta_price">
                    ${
                      item.original_price !== item.final_price
                        ? `<del>${item.original_price}</del><ins>${item.final_price}</ins>`
                        : `<span>${item.final_price}</span>`
                    }
                  </div>
                </div>
                <div class="t4s-mini_cart__actions">
                  <div data-quantity-wrapper class="t4s-quantity-wrapper t4s-quantity-cart-item"> 
                    <button data-quantity-selector data-decrease-qty type="button" class="t4s-quantity-selector is--minus">
                      ${
                        item.quantity > 1
                          ? '<svg focusable="false" class="icon icon--minus" viewBox="0 0 10 2" role="presentation"><path d="M10 0v2H0V0z" fill="currentColor"></path></svg>'
                          : '<svg viewBox="0 0 24 24" width="17"><use href="#icon-cart-remove"/></svg>'
                      }
                    </button>
                    <input type="number" data-quantity-value id="miniupdates_${item.key}" value="${item.quantity}" class="t4s-quantity-input" />
                    <button data-quantity-selector data-increase-qty type="button" class="t4s-quantity-selector is--plus">
                      <svg focusable="false" class="icon icon--plus" viewBox="0 0 10 10" role="presentation"><path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z" fill="currentColor" fill-rule="evenodd"></path></svg>
                    </button>
                  </div>
                  <a href="${cartData.cart_change_url}?quantity=0&amp;id=${item.key}" class="t4s-mini_cart__remove" data-cart-remove>
                    <svg viewBox="0 0 24 24" width="17"><use href="#icon-cart-remove"/></svg>
                  </a>
                </div>
              </div>
            </div>`;

        cartDrawer.insertAdjacentHTML("beforeend", itemHTML);
      });

      const cartLink = document.getElementById("cartLink");
      if (cartLink) {
        cartLink.click();
      }
    },
  }));
});
