const fillReminders = () => {
  const remindersGrid = document.querySelector("#reminders-grid");

  remindersGrid.innerHTML = [1, 2, 3, 4, 5, 6]
    .map(() => {
      return `
            <div class="border rounded-xl flex-col p-4 flex gap-[17px]">
            <h1 class="font-[500] text-[15px]">Amrutam Nari Soundarya Malt</h1>

            <div class="p-3 rounded-full bg-[#E9F1E0] w-fit">
              <p class="text-[#A0A0A0] text-[13px]">Consumable</p>
            </div>

            <div class="flex gap-2 items-center text-[#A0A0A0]">
              <img src=${reminderCalendarUrl} class="w-5 h-5" alt="" />

              <p class="text-[12px]">Monday</p>

              <div class="border-r border-[#A0A0A0] h-[80%]"></div>

              <p class="text-[12px]">Wednesday</p>

              <div class="border-r border-[#A0A0A0] h-[80%]"></div>

              <p class="text-[12px]">Friday</p>
            </div>

            <div class="flex gap-2 items-center text-[#A0A0A0]">
              <img src=${reminderClockUrl} class="w-5 h-5" alt="" />

              <p class="text-[12px]">10AM</p>

              <div class="border-r border-[#A0A0A0] h-[80%]"></div>

              <p class="text-[12px]">3PM</p>

              <div class="border-r border-[#A0A0A0] h-[80%]"></div>

              <p class="text-[12px]">9PM</p>
            </div>

          </div>
        `;
    })
    .join("");
};
fillReminders();

const fillBenfits = () => {
  const benfitsGrid = document.querySelector("#benfits-grid");

  benfitsGrid.innerHTML = [1, 2, 3, 4]
    .map(() => {
      return `  
           <div class="flex flex-col gap-4"> 

            <h1 class="font-[500]">Week 0 - 1</h1>

            <div class="border rounded-xl p-4">
              <ul class="flex flex-col gap-8">
                <li class="text-[13px]">
                  <span class="font-[600]">Improved Hydration:</span> Your body will be better
                  hydrated, which can lead to increased energy levels.
                </li>

                <div class="w-full border block"></div>

                <li class="text-[13px]">
                  <span class="font-[600]">Better Digestion:</span> Your digestive system will 
                  function more efficiently, improving your overall well-being.
                </li>
              </ul>
            </div>
          </div>
        `;
    })
    .join("");
};

fillBenfits();

document.addEventListener("alpine:init", () => {
  Alpine.data("routine", () => ({
    tab: 1,
    routine: {},
    products: [],
    tempProducts: [],
    selectedProducts: [],
    cartModalOpen: false,
    cartSelectOption: "",

    //Init function to fetch routine data
    init() {
      const getRoutine = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        console.log("Fetching routine");

        const response = await fetch(
          `https://quickstart-03878ee5.myshopify.com/apps/amrutam-routine/proxy/routines?type=single&id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        this.routine = data.routine;

        this.products = data.routine.productReminders.map(
          (reminder) => reminder.product,
        );

        this.tempProducts = this.products;
      };

      getRoutine();
    },

    changeTab(tab, fromModal = false) {
      if (this.tab === 2 && tab === 3 && !fromModal) {
        if (this.cartSelectOption === "") {
          alert("Please select an option");
          return;
        }

        if (this.cartSelectOption === "I have every product") {
          this.tab = 2;
          return;
        }

        if (this.cartSelectOption === "I have some products") {
          this.cartModalOpen = true;
          return;
        }

        if (this.cartSelectOption === "I have no product") {
          this.cartModalOpen = true;
          return;
        }
      }

      if (fromModal) {
        this.cartModalOpen = false;
      }

      this.tab = tab;
      window.scrollTo({ top: 0 });
    },

    //Function add selected product to array
    addSelectedProduct(product) {
      if (
        this.cartSelectOption === "I have some products" ||
        this.cartSelectOption === "I have no product"
      ) {
        if (this.selectedProducts.includes(product)) {
          this.selectedProducts = this.selectedProducts.filter(
            (selectedProduct) => selectedProduct !== product,
          );
        } else {
          this.selectedProducts.push(product);
        }

        console.log(this.selectedProducts);
      }
    },

    //Function to add selected products to cart
    addToCart() {
      console.log("Adding to cart");

      const cartItems = this.selectedProducts.map((product) => {
        return {
          id: parseInt(product.variants[0].id.split("/").pop(), 10),
          quantity: 1,
        };
      });

      console.log(cartItems);

      fetch(`https://quickstart-03878ee5.myshopify.com/cart/add.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });

      this.products = this.products.filter(
        (product) => !this.selectedProducts.includes(product),
      );
    },

    //Function to handle cart select change
    cartSelectChange(e) {
      this.cartSelectOption = e.target.value;
      if (this.cartSelectOption === "I have every product") {
        this.tab++;
      }
      console.log(this.cartSelectOption);
    },

    //add google calendar event

    async addGoogleAccount() {
      console.log("Adding Account ");

      const response = await fetch(
        `https://quickstart-03878ee5.myshopify.com/apps/amrutam-routine/proxy/calendar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log(data);
    },
  }));
});
