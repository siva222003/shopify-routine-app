document.addEventListener("alpine:init", () => {
  Alpine.data("userRoutine", () => ({
    tab: 1, //Tab to display

    routine: {}, //Routine data

    // Loading
    isLoading: false,

    // Products
    products: [], // All products fetched from API

    // Description
    expanded: false, // Expanded status

    //Weekly Benefits
    weeklyBenefits: [
      // Weekly benefits data
      {
        duration: "Week 0 - 1",
        benefits: [
          `Improved Hydration: Your body will be better hydrated, which can lead to increased energy levels.`,
          `Healthy Skin: Proper hydration can promote healthier, more radiant skin by helping to flush out toxins.`,
        ],
      },
      {
        duration: "Week 1 - 2",
        benefits: [
          `Improved Hydration: Your body will be better hydrated, which can lead to increased energy levels.`,
          `Healthy Skin: Proper hydration can promote healthier, more radiant skin by helping to flush out toxins.`,
        ],
      },
    ],

    // Reminder Modals
    selectedReminder: null, // Store selected reminder data
    productReminderModalOpen: false,
    activityReminderModalOpen: false,

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

        const response = await fetch(`http://localhost:34217/hey?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        this.routine = data.routine;

        this.products = data.routine.productReminders.map(
          ({ variationId, name, image }) => ({
            name,
            image,
            variationId,
            quantity: 1,
          }),
        );

        this.isLoading = false;

        console.log("Routine data:", data);
      } catch (error) {
        console.error("Error fetching routine:", error);
      } finally {
        this.isLoading = false;
      }
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
  }));
});
