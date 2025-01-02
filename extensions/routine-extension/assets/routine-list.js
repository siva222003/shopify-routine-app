document.addEventListener("alpine:init", () => {
  Alpine.data("routineList", () => ({
    // Loading
    isLoading: true,

    // Routines Data
    routines: [], // All routines fetched from API
    visibleRoutines: [], // Routines currently displayed

    // Columns
    columnCount: 4, // Number of columns to display

    // Initialize component
    async init() {
      this.updateColumnCount(); // Adjust columns based on screen size
      await this.exploreRoutines(); // Fetch routines from API
    },

    // Fetch Routines and Categories from API
    async exploreRoutines() {
      try {
        this.isLoading = true;

        const [routinesResponse] = await Promise.all([
          fetch(
            "https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/reminderlist/list/templates",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMyMDQ4NjY3LCJleHAiOjE3NjM2MDYyNjd9.DIJmmUM6Kxh234VUKjGXq7SewOZSXS3QL_jEUPmYFw0",
              },
            },
          ),
        ]);

        const routinesData = await routinesResponse.json();

        console.log({ routinesData });

        // Store routines with `loaded` flag for lazy loading
        this.routines = routinesData.data?.map((routine) => ({
          ...routine,
          loaded: false,
        }));

        this.visibleRoutines = this.routines.slice(0, this.columnCount);
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        document.querySelector("#routine-list-skeleton").style.display = "none";
        this.isLoading = false;
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
      const nextRoutines = this.filteredRoutines.slice(
        this.visibleRoutines.length,
        this.visibleRoutines.length + this.columnCount,
      );
      this.visibleRoutines.push(...nextRoutines);
    },

    // Reset to the initial set of routines
    showLess() {
      this.visibleRoutines = this.filteredRoutines.slice(0, this.columnCount);
    },
  }));
});
