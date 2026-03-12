
class Course {
    constructor(courseName, instructor) { [cite: 59]
        this.courseName = courseName; [cite: 61]
        this.instructor = instructor; [cite: 62]
    }

    displayCourse() {
        console.log(`Course: ${this.courseName} | Instructor: ${this.instructor}`);
    }
}

const myCourse = new Course("Web Technologies", "Dr. Kumar");
myCourse.displayCourse(); [cite: 67]

const checkEnrollment = (seatsAvailable) => {
    return new Promise((resolve, reject) => {
        if (seatsAvailable > 0) { [cite: 71]
            resolve("Enrollment Successful! Seat reserved."); [cite: 72]
        } else {
            reject("Enrollment Failed: Course Full."); [cite: 74]
        }
    });
};

checkEnrollment(5) 
    .then(msg => console.log(msg))
    .catch(err => console.error(err));