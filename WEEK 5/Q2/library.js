let bookXmlDoc = null;

function loadBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            bookXmlDoc = this.responseXML;
            renderBooks();
        }
    };
    xhr.send();
}

function renderBooks() {
    const tbody = document.getElementById("bookTableBody");
    tbody.innerHTML = "";
    const books = bookXmlDoc.getElementsByTagName("book"); //

    for (let i = 0; i < books.length; i++) {
        let id = books[i].getElementsByTagName("id")[0].textContent;
        let title = books[i].getElementsByTagName("title")[0].textContent;
        let author = books[i].getElementsByTagName("author")[0].textContent;
        let status = books[i].getElementsByTagName("status")[0].textContent;

        tbody.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td style="color: ${status === 'Available' ? 'green' : 'red'}">${status}</td>
                <td>
                    <button onclick="toggleStatus(${i})">Update Status</button>
                    <button onclick="deleteBook(${i})">Delete</button>
                </td>
            </tr>`;
    }
}

function addBook() {
    const id = document.getElementById("bId").value;
    const title = document.getElementById("bTitle").value;
    const author = document.getElementById("bAuthor").value;
    const status = document.getElementById("bStatus").value;

    if (!id || !title || !author) return alert("Please fill all fields"); //

    const newBook = bookXmlDoc.createElement("book"); //
    
    const data = { id, title, author, status };
    for (let key in data) {
        let node = bookXmlDoc.createElement(key);
        node.textContent = data[key];
        newBook.appendChild(node);
    }

    bookXmlDoc.documentElement.appendChild(newBook);
    renderBooks(); //
}

function toggleStatus(index) {
    let statusNode = bookXmlDoc.getElementsByTagName("status")[index]; //
    statusNode.textContent = (statusNode.textContent === "Available") ? "Checked Out" : "Available";
    renderBooks();
}

function deleteBook(index) {
    let book = bookXmlDoc.getElementsByTagName("book")[index];
    book.parentNode.removeChild(book); //
    renderBooks();
}

window.onload = loadBooks;