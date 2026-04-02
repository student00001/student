const students = [
  { id: 1, name: "Alice", dept: "CS", marks: 92 },
  { id: 2, name: "Bob", dept: "ME", marks: 85 }
];

{students.map(student => (
  <StudentCard 
    key={student.id} 
    name={student.name} 
    dept={student.dept} 
    marks={student.marks} 
  />
))}