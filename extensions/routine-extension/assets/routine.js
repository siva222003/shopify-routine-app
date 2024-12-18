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

    // Toast state
    toastMessages: [], // To hold active toast messages
    displayDuration: 3000, // Toast display duration in milliseconds

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
        this.routine = data.data;

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
      // this.routineStartModalOpen = true;
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

    // refreshCartDrawer() {
    //   // Select cart drawer and cart-drawer-items elements
    //   const cartDrawer = document.querySelector("cart-drawer");
    //   let cartDrawerItems = document.querySelector("cart-drawer-items");

    //   if (cartDrawer) {
    //     // Ensure the cart-drawer is not empty
    //     cartDrawer.classList.remove("is-empty");

    //     // Remove any empty drawer content if present
    //     const emptyDrawerElement = cartDrawer.querySelector(
    //       ".drawer__inner-empty",
    //     );
    //     if (emptyDrawerElement) {
    //       emptyDrawerElement.remove();
    //     }

    //     // Display the cart contents if hidden
    //     const cartContentsForm = document.querySelector(".cart__contents");
    //     if (cartContentsForm) {
    //       cartContentsForm.style.display = "block";
    //     }

    //     // If cart-drawer-items doesn't exist, create and append it
    //     if (!cartDrawerItems) {
    //       cartDrawerItems = document.createElement("cart-drawer-items");
    //       const drawerHeader = document.querySelector(".drawer__header");
    //       if (drawerHeader) {
    //         drawerHeader.insertAdjacentElement("afterend", cartDrawerItems);
    //       }
    //     }

    //     // Refresh the cart items using onCartUpdate (assuming this is a custom method)
    //     if (
    //       cartDrawerItems &&
    //       typeof cartDrawerItems.onCartUpdate === "function"
    //     ) {
    //       cartDrawerItems.onCartUpdate();
    //     }

    //     // Enable the checkout button if disabled
    //     const checkoutButton = document.getElementById("CartDrawer-Checkout");
    //     if (checkoutButton) {
    //       checkoutButton.disabled = false;
    //     }

    //     // Open the cart drawer (assumes cartDrawer has an open method)
    //     if (typeof cartDrawer.open === "function") {
    //       cartDrawer.open();
    //     }
    //   } else {
    //     console.error("Cart drawer not found!");
    //   }
    // },

    refreshCartDrawer() {
      const cartLink = document.getElementById("cartLink");
      console.log("Cart link:", cartLink);
      if (cartLink) {
        cartLink.click();
      }
    },
    // Function to handle quantity change
    updateCartQuantity(input) {
      const variantId = input.dataset.variantId;
      const newQuantity = input.value;

      fetch("/cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: variantId,
          quantity: parseInt(newQuantity, 10),
        }),
      })
        .then(() => refreshCart())
        .catch((error) => {
          console.error("Error updating cart quantity:", error);
        });
    },
  }));
});
