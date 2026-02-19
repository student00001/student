let inventory = [];

async function loadInventory() {
    try {
        const response = await fetch('inventory.json'); // [cite: 77]
        inventory = await response.json();
        updateUI(inventory);
    } catch (err) {
        console.error("Failed to parse JSON:", err); // [cite: 65, 85]
    }
}

function updateUI(displayData) {
    const tbody = document.getElementById("inventoryBody");
    tbody.innerHTML = "";
    let totalValue = 0;

    displayData.forEach((item) => {
        // Find actual index in master inventory array for operations
        const masterIndex = inventory.findIndex(p => p.id === item.id);
        const isLowStock = item.stock < 5; // [cite: 86]
        totalValue += (item.price * item.stock); // [cite: 87]

        tbody.innerHTML += `
            <tr style="background-color: ${isLowStock ? '#fff3cd' : 'transparent'}">
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${item.price}</td>
                <td>${item.stock} ${isLowStock ? '⚠️' : ''}</td>
                <td>
                    <button onclick="editStock('${item.id}')">Edit</button>
                    <button onclick="deleteProduct('${item.id}')">Delete</button>
                </td>
            </tr>`;
    });

    document.getElementById("totalValue").innerHTML = `<strong>Total Value: $${totalValue.toFixed(2)}</strong>`;
}

function addProduct() {
    const id = document.getElementById("pId").value;
    const name = document.getElementById("pName").value;
    const category = document.getElementById("pCat").value;
    const price = parseFloat(document.getElementById("pPrice").value);
    const stock = parseInt(document.getElementById("pStock").value);

    if (id && name && !isNaN(price)) { // [cite: 66]
        inventory.push({ id, name, category, price, stock }); // [cite: 79]
        updateUI(inventory);
    } else {
        alert("Invalid input data"); // [cite: 85]
    }
}

function searchCategory() {
    const query = document.getElementById("pSearch").value.toLowerCase();
    const filtered = inventory.filter(item => 
        item.category.toLowerCase().includes(query) // [cite: 82]
    );
    updateUI(filtered);
}

function editStock(id) {
    const index = inventory.findIndex(p => p.id === id);
    const newStock = prompt("Enter new stock quantity:", inventory[index].stock);
    if (newStock !== null) {
        inventory[index].stock = parseInt(newStock); // [cite: 80]
        updateUI(inventory);
    }
}

function deleteProduct(id) {
    inventory = inventory.filter(p => p.id !== id); // [cite: 81]
    updateUI(inventory);
}

window.onload = loadInventory;