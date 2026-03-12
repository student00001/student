const student = {
    id: 101,
    name: "Priya",
    department: "CSE",
    marks: 92
};

const { id, name, department, marks } = student;
console.log("Extracted Data:", id, name, department, marks); [cite: 41]

const updatedStudent = {
    ...student,
    grade: marks >= 90 ? "A+" : "A", 
    campus: "Amaravati"             
};

console.log("Updated Student Object:");
console.log(updatedStudent); [cite: 48]