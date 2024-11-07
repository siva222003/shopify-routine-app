document.addEventListener("alpine:init", () => {
  Alpine.data("userRoutineList", () => ({
    //User routines
    routines: [],
    visibleRoutines: [],
    columnCount: 4,

    //Today's Reminders
    reminders: [],
    visibleReminders: [],

    //Loading
    isRoutinesLoading: false,
    isRemindersLoading: false,

    //Modals
    isMarkCompleteModalOpen: false,
    isRemindedCompleteModalOpen: false,

    // Initialize component
    async init() {
      this.updateColumnCount(); // Adjust columns based on screen size
      await this.getUserRoutines();

      // Show initial routines after filtering
      this.visibleRoutines = this.routines.slice(0, this.columnCount);

      // Flatten product and activity reminders
      // const productReminders = this.routines.flatMap(
      //   (routine) => routine.productReminders ?? [],
      // );
      // const activityReminders = this.routines.flatMap(
      //   (routine) => routine.activityReminders ?? [],
      // );

      // // Extract IDs safely using optional chaining
      // const productReminderIds = productReminders.map(
      //   (reminder) => reminder?._id,
      // );
      // const activityReminderIds = activityReminders.map(
      //   (reminder) => reminder?._id,
      // );

      // // Concatenate both sets of reminder IDs
      // const Ids = productReminderIds.concat(activityReminderIds);

      // const date = new Date().toLocaleDateString("en-CA");

      // const body = { date, Ids };

      // Fetch today's reminders

      if (this.routines.length > 0) {
        await this.getReminders();
      }
    },

    // Fetch User Routines from API
    async getUserRoutines() {
      try {
        this.isRoutinesLoading = true;

        const response = await fetch(`http://localhost:36515/user-routines`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        this.routines = data.routines;

        this.isRoutinesLoading = false;

        console.log("User Routines:", data.routines);
      } catch (error) {
        console.error("Error fetching user routines:", error);
      } finally {
        this.isRoutinesLoading = false;
      }
    },

    //Fetch Today's Reminders
    async getReminders() {
      try {
        this.isRemindersLoading = true;

        const response = await fetch(`http://localhost:36515/today-reminders`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        this.reminders = data.reminders;

        this.isRemindersLoading = false;

        this.visibleReminders = this.reminders.slice(0, 2);

        console.log("User Todays Reminders:", data.reminders);
      } catch (error) {
        console.error("Error fetching user Todays Reminder:", error);
      } finally {
        this.isRemindersLoading = false;
      }
    },

    // Update the number of columns based on screen width
    updateColumnCount() {
      const width = window.innerWidth;
      if (width >= 1024) this.columnCount = 4;
      else if (width >= 768) this.columnCount = 3;
      else this.columnCount = 2;
    },

    // Show more routines based on column count
    showMore() {
      const nextRoutines = this.routines.slice(
        this.visibleRoutines.length,
        this.visibleRoutines.length + this.columnCount,
      );
      this.visibleRoutines.push(...nextRoutines);
    },

    // Reset to the initial set of routines
    showLess() {
      this.visibleRoutines = this.routines.slice(0, this.columnCount);
    },

    // Show more Reminders
    showMoreReminders() {
      const nextReminders = this.reminders.slice(2, this.reminders.length);
      this.visibleReminders.push(...nextReminders);
    },

    // Reset to the initial set of routines
    showLessReminders() {
      this.visibleReminders = this.reminders.slice(0, 2);
    },
  }));
});

// async getReminders() {
//   try {
//     // console.log({ body });

//     this.isRemindersLoading = true;

//     const response = await fetch(`http://localhost:36515/slots`, {
//       method: "POST",
//       body: JSON.stringify(body),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await response.json();
//     this.reminders = data.reminders;

//     this.isRemindersLoading = false;

//     this.visibleReminders = this.reminders.slice(0, 1);

//     console.log("User Todays Reminders:", data.reminders);
//   } catch (error) {
//     console.error("Error fetching user Todays Reminder:", error);
//   } finally {
//     this.isRemindersLoading = false;
//   }
// },
