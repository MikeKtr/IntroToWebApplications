let products = [];

async function GetData() {
  const response = await fetch("https://dummyjson.com/products");
  const json = await response.json();
  products = json.products.slice(0, 30);
  displayProducts(products);
}

function displayProducts(products) {
  const tbody = document.querySelector(".tableBody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    let row = document.createElement("tr");
    row.innerHTML = `<td>${product.id}</td><td>${product.title}</td><td>${product.description}</td><td><img src="${product.thumbnail}"></img></td>`;

    tbody.appendChild(row);
  });
}

function filterAndSort() {
  const filterInput = document.querySelector("#sort").value;
  const searchInput = document.querySelector("#search").value;

  let filter = products.filter(
    (p) => p.title.includes(searchInput) || p.description.includes(searchInput)
  );

  if (filterInput === "asc") {
    filter.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filterInput === "desc") {
    filter.sort((a, b) => b.title.localeCompare(a.title));
  }
  displayProducts(filter);
}

document.querySelector("#search").addEventListener("input", filterAndSort);
document.querySelector("#sort").addEventListener("change", filterAndSort);
GetData();
