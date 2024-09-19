const products = [
  {
    title: "Vitamin C Supplement",
    description: "Boost your immune system",
    image_url:
      "https://amrutam.co.in/cdn/shop/products/Poshak-Key-min_60a44bec-58f4-4e16-81e5-2de9ddf9543d.jpg?v=1655352176&width=700",
    price: 24.0,
  },
  {
    title: "Fitness Routine",
    description: "Follow a healthy fitness regime",
    image_url:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: 40.0,
  },
];

async function test() {
  const response = await fetch(
    `https://quickstart-03878ee5.myshopify.com/apps/amrutam-routine/proxy?type=routines`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const { data } = await response.json();

  const productContainer = document.querySelector(".product-list");
  data.forEach((routine) => {
    const routineHTML = `
        <li >
        <a href="/pages/routine" class="group block overflow-hidden">
          <img
            height="100px"
            width="100%"
            src=${products[0].image_url}
            alt=""
            class="h-[350px] w-[80%] object-cover transition duration-500 group-hover:scale-105 sm:h-[150px]"
          >

          <div class="relative bg-white pt-3">
            <h3 class="text-3xl text-gray-700 group-hover:underline group-hover:underline-offset-4">${routine.routineName}</h3>

            <p class="mt-2">
              <span class="tracking-wider text-gray-500 text-xl "> ${routine.description} </span>
            </p>
          </div>
        </a>
      </li>
      `;
    productContainer.innerHTML += routineHTML;
  });

  // console.log(data);
}

test();
