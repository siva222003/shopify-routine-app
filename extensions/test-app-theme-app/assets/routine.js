async function test() {
  const response = await fetch(
    `https://quickstart-03878ee5.myshopify.com/apps/amrutam-routine/proxy?type=routine&id=66e740c20e2773641ebd55fd`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const { data } = await response.json();

  console.log(data);
}

test();
