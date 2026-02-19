let students = [];

// Fetch using Fetch API [cite: 57, 58]
async function loadStudents() {
    try {
        const response = await fetch('students.json');
        students = await response.json(); // [cite: 58]
        renderTable();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// Read [cite: 61]
function renderTable() {
    const tbody = document.getElementById("studentBody");
    tbody.innerHTML = "";
    students.forEach((student, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.marks}</td>
                <td><button onclick="deleteStudent(${index})">Delete</button></td>
            </tr>
        `;
    });
}

// Create [cite: 60]
function addStudent() {
    const id = document.getElementById("sId").value;
    const name = document.getElementById("sName").value;
    const course = document.getElementById("sCourse").value;
    const marks = document.getElementById("sMarks").value;

    if(id && name) {
        students.push({ id, name, course, marks: parseInt(marks) });
        renderTable(); // Dynamic UI update [cite: 64]
    }
}

// Delete [cite: 63]
function deleteStudent(index) {
    students.splice(index, 1);
    renderTable();
}

window.onload = loadStudents;