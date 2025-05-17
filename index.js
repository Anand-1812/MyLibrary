let myLibrary = [];

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector(".add-btn");
    const dialog = document.getElementById("form-dialog");
    const form = document.getElementById("book-form");
    const closeButton = document.getElementById("close-btn");

    // Open dialog
    addButton.addEventListener("click", () => {
        dialog.showModal();
    });

    // Close dialog
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    // Escape key closes
    dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        dialog.close();
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = form.title.value.trim();
        const author = form.author.value.trim();
        const pages = Number(form.pages.value);
        const read = form.read.checked;

        if (title && author && pages) {
            addBookToLibrary(myLibrary.length + 1, title, author, pages, read);
            displayBooks();
            dialog.close();
            form.reset();
        } else {
            alert("Please fill in all required fields.");
        }
    });

    // Initial books
    addBookToLibrary(1, "The Stranger", "Albert Camus", 720, false);
    addBookToLibrary(2, "1984", "George Orwell", 304, false);
    addBookToLibrary(3, "Sapiens", "Yuval Noah Harari", 144, false);

    displayBooks();
});

class Book {
    constructor(serial, title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.serial = serial;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    //prototype function for read status
    toggleRead() {
        this.read = !this.read;
    }
}

function addBookToLibrary(serial, title, author, pages, read) {
    let newBook = new Book(serial, title, author, pages, read);
    myLibrary.push(newBook);
}

function displayBooks() {
    const tableBody = document.querySelector(".table-body");
    tableBody.innerHTML = "";

    myLibrary.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages || "-"}</td>
            <td>
                <button class="toggle-read-btn" data-index="${index}">
                    ${book.read ? "Yes" : "No"}
                </button>
            </td>
            <td>
                <button data-index="${index}">
                    <img src="./images/delete_img.svg" alt="delete" class="delete-btn">
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // delete the books
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.getAttribute("data-index"));
            myLibrary.splice(idx, 1);
            displayBooks();
        });
    });

    // toogle for read status
    const toggleButton = document.querySelectorAll(".toggle-read-btn");
    toggleButton.forEach((button) => {
        button.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.getAttribute("data-index"));
            myLibrary[idx].toggleRead(); // call prototype
            displayBooks();
        })
    }) 
}