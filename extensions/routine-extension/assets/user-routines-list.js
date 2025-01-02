document.addEventListener("alpine:init", () => {
  Alpine.data("userRoutineList", () => ({
    //User routines
    routines: [],
    visibleRoutines: [],
    columnCount: 4,

    //Loading
    isRoutinesLoading: true,

    // Initialize component
    async init() {
      // const customerId = localStorage.getItem("customer");

      // const isThemeEditor =
      //   typeof Shopify !== "undefined" && Shopify.designMode;

      // if (
      //   (!customerId || customerId === "") &&
      //   (isThemeEditor === undefined || isThemeEditor === false)
      // ) {
      //   window.location.href = "/account/login";
      //   return;
      // }

      this.updateColumnCount(); // Adjust columns based on screen size

      // const token = localStorage.getItem("token");

      await this.getUserRoutines();
    },

    // Fetch User Routines from API
    async getUserRoutines() {
      try {
        const customerId = localStorage.getItem("customer");

        this.isRoutinesLoading = true;

        const response = await fetch(
          "https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/reminderlist",
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

        this.routines = data.data?.map((routine) => ({
          ...routine,
          loaded: false,
        }));

        this.visibleRoutines = this.routines.slice(0, this.columnCount);

        this.isRoutinesLoading = false;

        console.log("User Routines:", data);
      } catch (error) {
        console.error("Error fetching user routines:", error);
      } finally {
        document.querySelector("#routine-list-skeleton").style.display = "none";
        this.isRoutinesLoading = false;
      }
    },

    // Update the number of columns based on screen width
    updateColumnCount() {
      const width = window.innerWidth;
      if (width >= 1024) this.columnCount = 8;
      else if (width >= 768) this.columnCount = 6;
      else this.columnCount = 4;
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
  }));
});
