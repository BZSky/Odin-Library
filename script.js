const myLibrary = [
  {
    title: "The Ingenious Gentleman Don Quixote of La Mancha",
    author: "Miguel de Cervantes",
    pages: "422",
    read: false,
  },
  {
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    pages: "328",
    read: "on",
  },
  {
    title: "The Lord of the Rings",
    author: "J. R. R. Tolkien",
    pages: "1077",
    read: "on",
  },
];

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#open-dialog");
const closeButton = document.querySelector(".close-dialog");
const form = document.querySelector("form");
const cards = document.querySelector(".cards-container");
let idCounter = 0;

showButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

function Book(title, author, pages, read = false) {
  this.id = ++idCounter;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.id}: ${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
  };
}

function addBookToLibrary(event) {
  const data = new FormData(form);
  let formData = {};

  for (let pair of data.entries()) {
    formData[pair[0]] = pair[1];
  }
  let book = new Book(
    formData.title,
    formData.author,
    formData.pages,
    formData.read
  );
  myLibrary.push(book);
  createCard(book);
  event.preventDefault();
}

function createCard(obj) {
  let readIcon;
  if (obj.read) {
    readIcon = "images/done.png";
  } else {
    readIcon = "images/todo.png";
  }
  const card = document.createElement("div");
  card.className = "book-card";
  card.dataset.id = obj.id;
  card.innerHTML = `
      <div class="book-img">
          <svg width="64px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-open-blank-variant</title><path d="M6.5 20C8.2 20 10.65 20.65 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C5.33 4.5 4.11 4.65 3 5C2.25 5.25 1.6 5.55 1 6V20.6C1 20.85 1.25 21.1 1.5 21.1C1.6 21.1 1.65 21.1 1.75 21.05C3.15 20.3 4.85 20 6.5 20M12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5Z" /></svg>
      </div>
      <div class="book-title">
          <h4>${obj.title}</h4>
          <p>
              ${obj.author}
          </p>
      </div>
      <div class="book-pages">
          <small>${obj.pages} pages</small>
      </div>
      <div class="book-read">
        <button type="button">  
          <img class="edit" src="${readIcon}" alt="read status icon & button" />
        </button>  
      </div>
      <div class="book-delete">
        <button type="button">  
          <img class="delete" src="images/bin.png" alt="delete book button" />
        </button>  
      </div>
  `;
  cards.appendChild(card);
  dialog.close();
}

function removeBookFromLibrary(bookId) {
  const index = myLibrary.findIndex((card) => card.id === bookId);
  if (index > -1) {
    myLibrary.splice(index, 1);

    const cardElement = document.querySelector(`[data-id="${bookId}"]`);
    if (cardElement) {
      cards.removeChild(cardElement);
    }
  }
}

function changeBookReadStatus(bookId) {
  const index = myLibrary.findIndex((card) => card.id === bookId);
  if (index > -1) {
    let readIcon;

    myLibrary[index].read = !myLibrary[index].read;
    if (myLibrary[index].read) {
      readIcon = "images/done.png";
    } else {
      readIcon = "images/todo.png";
    }
    const buttonElement = document.querySelector(
      `[data-id="${bookId}"] img.edit`
    );
    buttonElement.setAttribute("src", readIcon);
  }
}

form.addEventListener("submit", addBookToLibrary);

cards.addEventListener("click", (event) => {
  const cardElement = event.target.closest(".book-card");
  if (!cardElement) return;
  const bookId = +cardElement.dataset.id;
  const card = myLibrary.find((c) => c.id === bookId);

  if (event.target.matches("img.delete")) {
    removeBookFromLibrary(bookId);
  } else if (event.target.matches("img.edit")) {
    changeBookReadStatus(bookId);
  }
});

myLibrary.forEach(createCard);
