const STORAGE_KEY = "northStarOrderList";

let orderList = [];

function loadList() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    orderList = JSON.parse(saved);
  }
}

function saveList() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderList));
}

function findItem(name) {
  return orderList.find(function (item) {
    return item.name === name;
  });
}

function countItems() {
  let total = 0;
  orderList.forEach(function (item) {
    total += item.quantity;
  });
  return total;
}

function addItem(name, price) {
  const existing = findItem(name);
  if (existing) {
    existing.quantity += 1;
  } else {
    orderList.push({ name: name, price: price, quantity: 1 });
  }
  saveList();
  renderList();
}

function removeItem(name) {
  orderList = orderList.filter(function (item) {
    return item.name !== name;
  });
  saveList();
  renderList();
}

function clearList() {
  orderList = [];
  saveList();
  renderList();
}

function createListItem(item) {
  const listItem = document.createElement("li");
  listItem.textContent = item.quantity + " x " + item.name + " (" + item.price + ") ";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "secondary-btn";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    removeItem(item.name);
  });

  listItem.appendChild(removeButton);
  return listItem;
}

function updateAddButtons() {
  const buttons = document.querySelectorAll(".add-btn");
  buttons.forEach(function (button) {
    const item = findItem(button.dataset.item);
    if (item) {
      button.textContent = "Add another (" + item.quantity + " on list)";
    } else {
      button.textContent = "Add to list";
    }
  });
}

function renderList() {
  const listElement = document.getElementById("order-list");
  const countElement = document.getElementById("order-count");
  const actions = document.getElementById("order-actions");
  const total = countItems();

  listElement.innerHTML = "";
  orderList.forEach(function (item) {
    listElement.appendChild(createListItem(item));
  });

  if (total === 0) {
    countElement.textContent = 'Your list is empty. Click "Add to list" next to any item to start.';
    actions.hidden = true;
  } else {
    countElement.textContent = "You have " + total + (total === 1 ? " item" : " items") + " on your list.";
    actions.hidden = false;
  }

  updateAddButtons();
}

function setUpButtons() {
  const buttons = document.querySelectorAll(".add-btn");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      addItem(button.dataset.item, button.dataset.price);
    });
  });

  document.getElementById("clear-list").addEventListener("click", clearList);
}

loadList();
setUpButtons();
renderList();
