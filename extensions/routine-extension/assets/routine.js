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

    // Reminder Channels
    index: [], // Index of selected channels
    userReminderChannels: {
      // User reminder channels
      sms: "",
      whatsapp: "",
    },
    isAddingChannels: false, // Adding channels status

    // User routine start date
    userRoutineStartDate: "",

    //Create Routine Status
    isCreatingRoutine: false,

    // Routine Start Modal
    routineStartModalOpen: false,

    // Initialize routine data on Alpine init
    init() {
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
          `http://localhost:36211/app/routine?id=${id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } },
        );

        const data = await response.json();
        this.isLoading = false;
        this.routine = data.routine;

        this.products = data.routine.productReminders.map(
          ({ variationId, name, image, dosageQty }) => ({
            name,
            image,
            variationId,
            quantity: 1,
            dosageQty,
          }),
        );

        this.weeklyBenefits = data.routine.benefits.weeklyBenefits;

        this.userReminderChannels = data.routine.channel.map((channel) => ({
          id: channel.id,
          name: channel.name,
          checked: false,
        }));

        console.log("Routine data:", data);
      } catch (error) {
        console.error("Error fetching routine:", error);
      } finally {
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

        // Call updateCart to refresh the cart content after adding items
        // await this.updateCart();
        this.refreshCartDrawer();
        // document.getElementsByTagName("cart-drawer")[0].open();
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

        const response = await fetch(`http://localhost:36211/app/channel`, {
          method: "POST",
          body: JSON.stringify(channel),
        });

        const data = await response.json();

        console.log("Channel data:", data);
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
      // this.routineStartModalOpen = true;
    },

    async createRoutine(data) {
      try {
        this.isCreatingRoutine = true;
        const id = new URLSearchParams(window.location.search).get("id");

        const response = await fetch(
          `http://localhost:36211/app/template?id=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        const result = await response.json();

        console.log("Routine Start response:", result);

        this.isCreatingRoutine = false;

        this.routineStartModalOpen = true;
      } catch (error) {
        console.error("Error starting routine:", error);
        this.isCreatingRoutine = false;
      }
    },

    refreshCartDrawer() {
      // Check if cart-drawer-items exists
      let cartDrawerItems = document.querySelector("cart-drawer-items");
      // Find the cart-drawer element
      const cartDrawer = document.querySelector("cart-drawer");
      if (cartDrawer) {
        // Remove the is-empty class from cart-drawer if it exists
        if (cartDrawer.classList.contains("is-empty")) {
          cartDrawer.classList.remove("is-empty");
        }
        // Remove the div with class 'drawer__inner-empty'
        const emptyDrawerElement = cartDrawer.querySelector(
          ".drawer__inner-empty",
        );
        if (emptyDrawerElement) {
          emptyDrawerElement.remove();
        }
        // Make the form tag's class 'cart__contents' display as block
        const cartContentsForm = document.querySelector(".cart__contents");
        if (cartContentsForm) {
          cartContentsForm.style.display = "block";
        }
      }
      // If cart-drawer-items doesn't exist, create it
      if (!cartDrawerItems) {
        cartDrawerItems = document.createElement("cart-drawer-items");
        // Find the drawer__header element
        const drawerHeader = document.querySelector(".drawer__header");
        if (drawerHeader) {
          // Insert the newly created cart-drawer-items after the drawer__header
          drawerHeader.insertAdjacentElement("afterend", cartDrawerItems);
        }
      }
      // Call the onCartUpdate method to refresh the cart drawer contents
      document.querySelector("cart-drawer-items").onCartUpdate();
      document.getElementById("CartDrawer-Checkout").disabled = false;
      // Open the cart drawer and apply necessary classes for animation
      if (cartDrawer) {
        cartDrawer.open();
      }
    },
  }));
});
