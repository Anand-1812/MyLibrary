class Book {
    constructor(serial, title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.serial = serial;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read;
    }
}

class BookManager {
    constructor() {
        this.myLibrary = [];
    }

    addBook(serial, title, author, pages, read) {
        const newBook = new Book(serial, title, author, pages, read);
        this.myLibrary.push(newBook);
    }

    deleteBook(index) {
        this.myLibrary.splice(index, 1);
    }

    toggleRead(index) {
        this.myLibrary[index].toggleRead();
    }

    getBooks() {
        return this.myLibrary;
    }
}

class LibraryUI {
    constructor(addBtn, dialog, form, closeBtn, tableBody, bookManager) {
        this.addBtn = addBtn;
        this.dialog = dialog;
        this.form = form;
        this.closeBtn = closeBtn;
        this.tableBody = tableBody;
        this.bookManager = bookManager;
    }

    init() {
        this.addBtn.addEventListener("click", () => this.dialog.showModal());
        this.closeBtn.addEventListener("click", () => this.dialog.close());
        this.dialog.addEventListener("cancel", (e) => {
            e.preventDefault();
            this.dialog.close();
        });

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        this.renderBooks();
    }

    handleFormSubmit() {
        const title = this.form.title.value.trim();
        const author = this.form.author.value.trim();
        const pages = Number(this.form.pages.value);
        const read = this.form.read.checked;

        if (title && author && pages) {
            this.bookManager.addBook(this.bookManager.getBooks().length + 1, title, author, pages, read);
            this.renderBooks();
            this.dialog.close();
            this.form.reset();
        } else {
            alert("Please fill in all required fields.");
        }
    }

    renderBooks() {
        this.tableBody.innerHTML = "";

        this.bookManager.getBooks().forEach((book, index) => {
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
                    <button class="delete-btn" data-index="${index}">
                        <img src="./images/delete_img.svg" alt="delete">
                    </button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });

        this.attachRowListeners();
    }

    attachRowListeners() {
        this.tableBody.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = +e.currentTarget.dataset.index;
                this.bookManager.deleteBook(index);
                this.renderBooks();
            });
        });

        this.tableBody.querySelectorAll(".toggle-read-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = +e.currentTarget.dataset.index;
                this.bookManager.toggleRead(index);
                this.renderBooks();
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector(".add-btn");
    const dialog = document.getElementById("form-dialog");
    const form = document.getElementById("book-form");
    const closeBtn = document.getElementById("close-btn");
    const tableBody = document.querySelector(".table-body");

    const bookManager = new BookManager();

    // Add initial books
    bookManager.addBook(1, "The Stranger", "Albert Camus", 720, false);
    bookManager.addBook(2, "1984", "George Orwell", 304, false);
    bookManager.addBook(3, "Sapiens", "Yuval Noah Harari", 144, false);

    const ui = new LibraryUI(addBtn, dialog, form, closeBtn, tableBody, bookManager);
    ui.init();
});