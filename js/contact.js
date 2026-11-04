const STORAGE_KEY = "northStarOrderList";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const closedDays = ["Monday"];

const errorMessages = {
  nameMissing: "Please enter your name.",
  nameShort: "Your name needs at least 2 characters.",
  emailMissing: "Please enter your email.",
  emailInvalid: "Please enter a valid email, like name@example.com.",
  dateMissing: "Please choose a pickup date.",
  datePast: "The pickup date can't be in the past.",
  dateClosed: "We're closed on Mondays. Please pick another day.",
  typeMissing: "Please choose a request type.",
  detailsMissing: "Please tell us what you'd like to order or ask.",
  detailsShort: "Please add a little more detail (at least 10 characters)."
};

function checkName(value) {
  if (value === "") {
    return errorMessages.nameMissing;
  }
  if (value.length < 2) {
    return errorMessages.nameShort;
  }
  return "";
}

function checkEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === "") {
    return errorMessages.emailMissing;
  }
  if (!emailPattern.test(value)) {
    return errorMessages.emailInvalid;
  }
  return "";
}

function checkPickupDate(value) {
  if (value === "") {
    return errorMessages.dateMissing;
  }

  const parts = value.split("-");
  const pickupDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickupDate < today) {
    return errorMessages.datePast;
  }
  if (closedDays.includes(dayNames[pickupDate.getDay()])) {
    return errorMessages.dateClosed;
  }
  return "";
}

function checkRequestType(value) {
  if (value === "") {
    return errorMessages.typeMissing;
  }
  return "";
}

function checkItemDetails(value) {
  if (value === "") {
    return errorMessages.detailsMissing;
  }
  if (value.length < 10) {
    return errorMessages.detailsShort;
  }
  return "";
}

const fieldChecks = {
  "name": checkName,
  "email": checkEmail,
  "pickup-date": checkPickupDate,
  "request-type": checkRequestType,
  "item-details": checkItemDetails
};

function showError(field, message) {
  document.getElementById(field.id + "-error").textContent = message;
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  document.getElementById(field.id + "-error").textContent = "";
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const message = fieldChecks[fieldId](field.value.trim());

  if (message) {
    showError(field, message);
    return false;
  }
  clearError(field);
  return true;
}

function validateForm() {
  let firstInvalid = null;

  Object.keys(fieldChecks).forEach(function (fieldId) {
    if (!validateField(fieldId) && firstInvalid === null) {
      firstInvalid = document.getElementById(fieldId);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function showSuccess(name, email) {
  const success = document.getElementById("form-success");
  success.textContent = "Thanks, " + name + "! We got your request and will email you at " + email + " within one business day.";
  success.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();
  document.getElementById("form-success").hidden = true;

  if (!validateForm()) {
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  showSuccess(name, email);
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("prefill-note").hidden = true;
  event.target.reset();
}

function setUpLiveChecks() {
  Object.keys(fieldChecks).forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) {
        validateField(fieldId);
      }
    });
    field.addEventListener("change", function () {
      if (field.classList.contains("invalid")) {
        validateField(fieldId);
      }
    });
  });
}

function prefillFromOrderList() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return;
  }

  const orderList = JSON.parse(saved);
  const details = document.getElementById("item-details");
  if (orderList.length === 0 || details.value !== "") {
    return;
  }

  const lines = orderList.map(function (item) {
    return item.quantity + " x " + item.name;
  });
  details.value = lines.join("\n");
  document.getElementById("request-type").value = "pre-order";

  const note = document.getElementById("prefill-note");
  note.textContent = "We added the items from your pre order list below. Feel free to change them.";
  note.hidden = false;
}

document.getElementById("contact-form").addEventListener("submit", handleSubmit);
setUpLiveChecks();
prefillFromOrderList();
