// document.addEventListener("alpine:init", () => {
//   Alpine.data("routineList", () => ({
//     routines: [],

//     init() {
//       const test = async () => {
//         console.log("Fetching routines");

//         const response = await fetch(
//           "https://quickstart-03878ee5.myshopify.com/apps/amrutam-routine/proxy/routines?type=all",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           },
//         );

//         const data = await response.json();

//         this.routines = data.routines; // Correctly assign the fetched data to the component's routines array

//         console.log(data);
//       };

//       test();
//     },
//   }));
// });

// async function addProduct() {
//   const items = this.selectedProducts.map((product) => {
//     return {
//       id: product.variants[0].id,
//       quantity: 1,
//     };
//   });

//   let formData = {
//     items: items,
//   };

//   console.log(formData)

//   try {
//     const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await response.json();
//     console.log("Success:", data);
//     window.location.reload();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

document.addEventListener("alpine:init", () => {
  Alpine.data("routineList", () => ({
    routines: ["Routine 1", "Routine 2", "Routine 3"],
    isMarkCompleteModalOpen: false,
    isRemindedCompleteModalOpen: false,

    init() {
      // const fetchRoutines = async () => {
      //   console.log("Fetching routines");
      //   const response = await fetch("http://localhost:44879/bro", {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   const data = await response.json();
      //   this.routines = data.routines;
      //   console.log(data);
      // };
      // fetchRoutines();
      console.log(this.routines);
    },
  }));
});
