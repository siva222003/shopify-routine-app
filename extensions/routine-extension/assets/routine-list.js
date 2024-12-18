document.addEventListener("alpine:init", () => {
  Alpine.data("routineList", () => ({
    // Loading
    isLoading: true,

    // Routines Data
    routines: [], // All routines fetched from API
    visibleRoutines: [], // Routines currently displayed
    filteredRoutines: [], // Routines filtered by category or search

    // Columns and Filters
    columnCount: 4, // Number of columns to display
    categories: [], // Categories from API
    currentCategory: "All", // Active category filter
    search: "", // Search query

    // Initialize component
    async init() {
      this.updateColumnCount(); // Adjust columns based on screen size
      await this.exploreRoutines(); // Fetch routines from API
      this.filterRoutines(); // Initialize filtered routines based on category
    },

    // Fetch Routines and Categories from API
    async exploreRoutines() {
      try {
        this.isLoading = true;

        const [routinesResponse, categoriesResponse] = await Promise.all([
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
          fetch(
            "https://amrutam-routine-nodejs-dev.azurewebsites.net/api/v1/patient/category",
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
        const categoriesData = await categoriesResponse.json();

        console.log({ routinesData, categoriesData });

        // Store routines with `loaded` flag for lazy loading
        this.routines = routinesData.data.map((routine) => ({
          ...routine,
          loaded: false,
        }));

        const categories = [{ name: "All" }, ...categoriesData.data];

        this.categories = categories;
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        this.isLoading = false;
        this.filterRoutines(); // Apply initial filtering
      }
    },
    // Update the number of columns based on screen width
    updateColumnCount() {
      const width = window.innerWidth;
      if (width >= 1024) this.columnCount = 4;
      else if (width >= 768) this.columnCount = 3;
      else this.columnCount = 2;
    },

    // Filter routines by category and search
    filterRoutines() {
      // Filter routines by category
      this.filteredRoutines = this.routines.filter((routine) => {
        return (
          this.currentCategory === "All" ||
          routine.category.name === this.currentCategory
        );
      });

      // Apply search filter
      this.filteredRoutines = this.filteredRoutines.filter((routine) => {
        return routine.name.toLowerCase().includes(this.search.toLowerCase());
      });

      // Show initial routines after filtering
      this.visibleRoutines = this.filteredRoutines.slice(0, this.columnCount);
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

    // Set the current category and re-filter routines
    filterByCategory(category) {
      this.currentCategory = category;
      this.filterRoutines(); // Re-apply filtering
    },

    // Apply search filtering in real-time
    filterBySearch() {
      this.filterRoutines(); // Re-apply filtering
    },
  }));
});
