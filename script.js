const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const submitBtn = document.getElementById("submitBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// Save records
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display student records
function displayStudents(data = students) {

    studentTable.innerHTML = "";

    emptyMessage.style.display =
        data.length === 0 ? "block" : "none";

    data.forEach((student) => {

        const originalIndex = students.indexOf(student);

        const row = document.createElement("tr");

        const values = [
            student.name,
            student.roll,
            student.email,
            student.department,
            student.year
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => {
            editStudent(originalIndex);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteStudent(originalIndex);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        studentTable.appendChild(row);
    });
}

// Add or update student
studentForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        roll: document.getElementById("roll").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        year: document.getElementById("year").value
    };

    // Check duplicate roll number
    const duplicate = students.some((s, index) =>
        s.roll.toLowerCase() === student.roll.toLowerCase()
        && index !== editIndex
    );

    if (duplicate) {
        alert("This Roll Number already exists!");
        return;
    }

    if (editIndex === -1) {

        students.push(student);
        alert("Student added successfully!");

    } else {

        students[editIndex] = student;
        alert("Student updated successfully!");

        editIndex = -1;
        submitBtn.textContent = "Add Student";
    }

    saveStudents();
    displayStudents();
    studentForm.reset();

});

// Edit student
function editStudent(index) {

    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;

    editIndex = index;

    submitBtn.textContent = "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete student
function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {

        students.splice(index, 1);

        saveStudents();
        displayStudents();

        if (editIndex === index) {
            editIndex = -1;
            studentForm.reset();
            submitBtn.textContent = "Add Student";
        } else if (editIndex > index) {
            editIndex--;
        }

        alert("Student deleted successfully!");
    }
}

// Search students
searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredStudents = students.filter(student => {

        return student.name.toLowerCase().includes(searchValue) ||
               student.roll.toLowerCase().includes(searchValue);

    });

    displayStudents(filteredStudents);

});

// Initial display
displayStudents();
