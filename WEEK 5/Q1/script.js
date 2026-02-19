let xmlDoc = null;

// Fetch XML using AJAX [cite: 17, 20]
function loadXML() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML; // [cite: 20]
            displayEmployees();
        } else {
            console.error("Failed to load XML");
        }
    };
    xhr.send();
}

// Read and Display [cite: 24]
function displayEmployees() {
    const tableBody = document.getElementById("empBody");
    tableBody.innerHTML = "";
    const employees = xmlDoc.getElementsByTagName("employee"); // [cite: 21]

    for (let i = 0; i < employees.length; i++) {
        let id = employees[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        let name = employees[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        let dept = employees[i].getElementsByTagName("department")[0].childNodes[0].nodeValue;
        let salary = employees[i].getElementsByTagName("salary")[0].childNodes[0].nodeValue;

        let row = `<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${dept}</td>
            <td>${salary}</td>
            <td>
                <button onclick="deleteEmployee(${i})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    }
}

// Create [cite: 23]
function addEmployee() {
    const id = document.getElementById("empId").value;
    const name = document.getElementById("empName").value;
    const dept = document.getElementById("empDept").value;
    const salary = document.getElementById("empSalary").value;

    if(!id || !name) return alert("Fill all fields");

    let newEmp = xmlDoc.createElement("employee");
    
    let idNode = xmlDoc.createElement("id");
    idNode.appendChild(xmlDoc.createTextNode(id));
    newEmp.appendChild(idNode);

    let nameNode = xmlDoc.createElement("name");
    nameNode.appendChild(xmlDoc.createTextNode(name));
    newEmp.appendChild(nameNode);

    let deptNode = xmlDoc.createElement("department");
    deptNode.appendChild(xmlDoc.createTextNode(dept));
    newEmp.appendChild(deptNode);

    let salNode = xmlDoc.createElement("salary");
    salNode.appendChild(xmlDoc.createTextNode(salary));
    newEmp.appendChild(salNode);

    xmlDoc.documentElement.appendChild(newEmp);
    displayEmployees();
}

// Delete [cite: 26]
function deleteEmployee(index) {
    const nodes = xmlDoc.getElementsByTagName("employee");
    nodes[index].parentNode.removeChild(nodes[index]);
    displayEmployees();
}

window.onload = loadXML;