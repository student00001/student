const studentName = "Arun";
let mark1 = 85;
let mark2 = 90;
let mark3 = 88;

const getStudentStats = (m1, m2, m3) => {
    const total = m1 + m2 + m3;
    const average = total / 3;
    return { total, average };
};

const { total, average } = getStudentStats(mark1, mark2, mark3);

console.log(`--- Student Report ---`);
console.log(`Student Name  : ${studentName}`);
console.log(`Total Marks   : ${total}`);
console.log(`Average Marks : ${average.toFixed(2)}`); 