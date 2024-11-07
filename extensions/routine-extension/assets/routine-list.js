document.addEventListener("alpine:init", () => {
  Alpine.data("routineList", () => ({
    // Loading
    isLoading: false,

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
        const response = await fetch("http://localhost:36515/explore", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        console.log({ data });

        // Store routines with `loaded` flag for lazy loading
        this.routines = data.routines.map((routine) => ({
          ...routine,
          loaded: false,
        }));

        const categories = [{ name: "All" }, ...data.categories];

        this.categories = categories;
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        this.isLoading = false;
        this.filterRoutines(); // Apply initial filtering
      }
    },

    async test() {
      try {
        const rootUrl = window.location.origin;

        console.log({ rootUrl });

        const res = await fetch(`${rootUrl}/apps/routine/app/hello`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Log or handle non-OK responses (like 404 or 500 errors)
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        console.log(data);
      } catch (error) {
        console.error("Error fetching routines:", error);
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