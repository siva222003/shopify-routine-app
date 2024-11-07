document.addEventListener("alpine:init", () => {
  Alpine.data("userRoutine", () => ({
    tab: 1, //Tab to display
    isUserRoutine: true, //Flag to check if user routine

    routine: {}, //Routine data

    // Loading
    isLoading: false,
    isFetchingSlots: false,
    isUpdatingSlot: false,

    //User routine start date
    currentSlotDate: new Date().toLocaleDateString("en-CA"),

    //Reminder Id's
    reminderIds: [],
    reminderSlots: [],
    currentSlot: null,

    // Products
    products: [], // All products fetched from API

    // Description
    expanded: false, // Expanded status

    //Weekly Benefits
    weeklyBenefits: [],

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

        const response = await fetch(`http://localhost:36515/hey?id=${id}`, {
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

        this.weeklyBenefits = data.routine.benefits.weeklyBenefits;

        const productReminderIds = data.routine.productReminders.map(
          (reminder) => reminder?._id,
        );
        const activityReminderIds = data.routine.activityReminders.map(
          (reminder) => reminder?._id,
        );

        // Concatenate both sets of reminder IDs
        this.reminderIds = productReminderIds.concat(activityReminderIds);

        // Fetch today's reminders

        await this.getSlots();

        this.isLoading = false;

        console.log("Routine data:", data);
      } catch (error) {
        console.error("Error fetching routine:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getSlots() {
      try {
        const body = {
          date: this.currentSlotDate,
          Ids: this.reminderIds,
        };

        this.isFetchingSlots = true;

        const response = await fetch(`http://localhost:36515/slots`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        this.reminderSlots = data.reminders;

        this.isFetchingSlots = false;

        console.log("Reminder Slots:", data.reminders);
      } catch (error) {
        console.error("Error while fetching reminder slots:", error);
      } finally {
        this.isFetchingSlots = false;
      }
    },

    async markSlot(slot, reminderId) {
      try {
        this.currentSlot = slot;
        this.isUpdatingSlot = true;
        const body = {
          reminderId,
          slotId: slot._id,
          status: !slot.marked,
        };

        const response = await fetch(`http://localhost:36515/mark-slot`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        const { response: updatedSlot } = data;

        console.log("Reminder updated:", data);

        // Update slot status

        this.reminderSlots = this.reminderSlots.map((reminder) => ({
          ...reminder,
          slots: reminder.slots.map((s) =>
            s._id === updatedSlot._id
              ? { ...s, marked: updatedSlot.marked }
              : s,
          ),
        }));

        this.isUpdatingSlot = false;
      } catch (error) {
        console.error("Error while marking reminder:", error);

        this.isUpdatingSlot = false;
      }

      console.log({ slot });
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
