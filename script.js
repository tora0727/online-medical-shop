
const statusList = ["Pending", "Packed", "Delivered", "Cancelled"];

const defaultMedicines = [
  { id: 1, name: "Napa 500mg", category: "Pain relief", price: 2, stock: 250, expiry: "2027-12-31" },
  { id: 2, name: "Seclo 20mg", category: "Digestive", price: 7, stock: 6, expiry: "2027-08-15" },
  { id: 3, name: "Vitamin C 500mg", category: "Vitamins", price: 5, stock: 80, expiry: "2026-12-10" },
  { id: 4, name: "Azithromycin 500mg", category: "Antibiotic", price: 35, stock: 40, expiry: "2027-05-20" }
];
const defaultOrders = [
  { id: 1001, customer: "Rahim Uddin", items: "Napa 500mg x 10", total: 20, status: "Pending" },
  { id: 1002, customer: "Nusrat Jahan", items: "Seclo 20mg x 5", total: 35, status: "Packed" },
  { id: 1003, customer: "Sabbir Hossain", items: "Azithromycin 500mg x 2", total: 70, status: "Delivered" },
  { id: 1004, customer: "Mim Akter", items: "Vitamin C 500mg x 6", total: 30, status: "Pending" }
];

let medicines = JSON.parse(localStorage.getItem("mc_medicines")) || defaultMedicines;
let orders = JSON.parse(localStorage.getItem("mc_orders")) || defaultOrders;

const $ = (id) => document.getElementById(id);

function saveData() {
  localStorage.setItem("mc_medicines", JSON.stringify(medicines));
  localStorage.setItem("mc_orders", JSON.stringify(orders));
}

const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
const cleanText = (t) => String(t).replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toggleHidden = (id, hide) => $(id).classList.toggle("hidden", hide);

function showMessage(text) {
  const box = $("message");
  box.innerHTML = text;
  box.style.display = "block";
  setTimeout(() => (box.style.display = "none"), 2500);
}

function showTab(tabName) {
  ["overview", "medicines", "orders"].forEach((t) => {
    toggleHidden(t, t !== tabName);
    $("btn_" + t).classList.toggle("active", t === tabName);
  });
}

function renderOverview() {
  let alertText = "";
  let low = 0;

  medicines.forEach((m) => {
    const days = daysLeft(m.expiry);
    if (m.stock < 10) {
      low++;
      alertText += `<p><span class="tag low">Low stock</span> ${cleanText(m.name)} has only ${m.stock} left.</p>`;
    }
    if (days < 0) {
      alertText += `<p><span class="tag exp">Expired</span> ${cleanText(m.name)} has expired.</p>`;
    } else if (days <= 30) {
      alertText += `<p><span class="tag exp">Expiry</span> ${cleanText(m.name)} expires in ${days} days.</p>`;
    }
  });

  $("totalMeds").innerHTML = medicines.length;
  $("lowStock").innerHTML = low;
  $("pendingOrders").innerHTML = orders.filter((o) => o.status === "Pending").length;
  $("revenue").innerHTML = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);
  $("alerts").innerHTML = alertText || "<p>Everything looks good.</p>";
}

function renderMedicines() {
  const search = $("search").value.trim().toLowerCase();
  const filter = $("filterCategory").value;

  const list = medicines.filter(
    (m) => m.name.toLowerCase().includes(search) && (filter === "" || m.category === filter)
  );

  $("medBody").innerHTML = list
    .map((m) => {
      const days = daysLeft(m.expiry);
      let status = '<span class="tag good">In stock</span>';
      if (m.stock < 10) status = '<span class="tag low">Low stock</span>';
      if (days < 0) status = '<span class="tag exp">Expired</span>';
      else if (days <= 30) status = '<span class="tag exp">Expiring soon</span>';

      return `<tr>
        <td>${cleanText(m.name)}</td>
        <td>${m.category}</td>
        <td>Tk ${m.price}</td>
        <td>${m.stock}</td>
        <td>${m.expiry}</td>
        <td>${status}</td>
        <td><button class="smallBtn" onclick="editMedicine(${m.id})">Edit</button>
            <button class="smallBtn deleteBtn" onclick="deleteMedicine(${m.id})">Delete</button></td>
      </tr>`;
    })
    .join("");

  toggleHidden("medEmpty", list.length > 0);
}


function editMedicine(id) {
  const m = medicines.find((x) => x.id === id);
  if (!m) return;
  $("editId").value = m.id;
  ["name", "category", "price", "stock", "expiry"].forEach((f) => ($(f).value = m[f]));
  $("formTitle").innerHTML = "Edit Medicine";
  $("saveBtn").innerHTML = "Save Changes";
  toggleHidden("cancelBtn", false);
  clearErrors();
  window.scrollTo(0, 0);
}

function deleteMedicine(id) {
  if (!confirm("Are you sure you want to delete this medicine?")) return;
  medicines = medicines.filter((m) => m.id !== id);
  saveData();
  renderAll();
  showMessage("Medicine deleted.");
}

function resetForm() {
  $("medForm").reset();
  $("editId").value = "";
  $("formTitle").innerHTML = "Add a Medicine";
  $("saveBtn").innerHTML = "Add Medicine";
  toggleHidden("cancelBtn", true);
  clearErrors();
}


function showError(input, errorId, message) {
  input.classList.add("errorBorder");
  input.classList.remove("successBorder");
  $(errorId).innerHTML = message;
}

function showSuccess(input) {
  input.classList.remove("errorBorder");
  input.classList.add("successBorder");
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.innerHTML = ""));
  document.querySelectorAll("#medForm input, #medForm select").forEach((f) => {
    f.classList.remove("errorBorder", "successBorder");
  });
}


const rules = {
  name: (v) => (v === "" ? "Medicine name is required." : v.length < 2 ? "Name must be at least 2 characters." : ""),
  category: (v) => (v === "" ? "Please select a category." : ""),
  price: (v) => (v === "" ? "Price is required." : isNaN(v) || Number(v) <= 0 ? "Price must be a number greater than 0." : ""),
  stock: (v) => (v === "" ? "Stock is required." : !/^[0-9]+$/.test(v) ? "Stock must be a whole number (0 or more)." : ""),
  expiry: (v) => (v === "" ? "Expiry date is required." : daysLeft(v) <= 0 ? "Expiry date must be in the future." : "")
};


$("medForm").addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  let valid = true;
  Object.keys(rules).forEach((f) => {
    const input = $(f);
    const error = rules[f](input.value.trim());
    if (error) {
      showError(input, f + "Error", error);
      valid = false;
    } else {
      showSuccess(input);
    }
  });
  if (!valid) return;

  const data = {
    name: $("name").value.trim(),
    category: $("category").value,
    price: Number($("price").value),
    stock: Number($("stock").value),
    expiry: $("expiry").value
  };
  const editId = $("editId").value;

  if (editId !== "") {
    Object.assign(medicines.find((m) => m.id === Number(editId)), data);
    showMessage("Medicine updated.");
  } else {
    const newId = medicines.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    medicines.push({ id: newId, ...data });
    showMessage("Medicine added.");
  }

  saveData();
  resetForm();
  renderAll();
});


function renderOrders() {
  const filter = $("orderFilter").value;
  const list = orders.filter((o) => filter === "" || o.status === filter);

  $("orderBody").innerHTML = list
    .map((o) => {
      const options = statusList
        .map((s) => `<option${s === o.status ? " selected" : ""}>${s}</option>`)
        .join("");
      return `<tr>
        <td>#${o.id}</td>
        <td>${cleanText(o.customer)}</td>
        <td>${cleanText(o.items)}</td>
        <td>Tk ${o.total}</td>
        <td><select onchange="changeStatus(${o.id}, this.value)">${options}</select></td>
      </tr>`;
    })
    .join("");

  toggleHidden("orderEmpty", list.length > 0);
}

function changeStatus(id, newStatus) {
  orders.find((o) => o.id === id).status = newStatus;
  saveData();
  renderOverview();
  showMessage(`Order #${id} is now ${newStatus}.`);
}


function renderAll() {
  renderOverview();
  renderMedicines();
  renderOrders();
}

renderAll();