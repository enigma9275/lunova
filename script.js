document.addEventListener("DOMContentLoaded", function(){

/* ========================= */
/* ===== NAVIGATION ======== */
/* ========================= */

function switchPage(id){
document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});
document.getElementById(id).classList.add("active");
}

window.goHome = () => switchPage("home");

window.goNoctilivre = () => {
switchPage("noctilivre");
};

window.goPokeNote = () => {
switchPage("pokenote");
displayNotes();
};


/* ========================= */
/* ===== NOCTILIVRE ======== */
/* ========================= */

window.showForm = () => {
formSection.style.display = "block";
librarySection.style.display = "none";
};

window.showLibrary = () => {
formSection.style.display = "none";
librarySection.style.display = "block";
displayLibrary();
};

document.getElementById("book-form").addEventListener("submit", function(e){
e.preventDefault();

let books = JSON.parse(localStorage.getItem("books") || "[]");

books.push({
id: Date.now(),
name: bookName.value,
author: author.value,
genre: genre.value,
rating: rating.value,
pages: pages.value,
explicit: explicit.value,
review: review.value,
favorite: false
});

localStorage.setItem("books", JSON.stringify(books));

this.reset();

switchPage("noctilivre");
showLibrary();
});

function displayLibrary(){
let books = JSON.parse(localStorage.getItem("books") || "[]");
books.sort((a,b)=> b.favorite - a.favorite);

library.innerHTML = "";

if(books.length === 0){
library.innerHTML = "<p>Aucun avis enregistré 🌙</p>";
return;
}

books.forEach(book=>{
let card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${book.favorite ? "⭐ " : ""}${book.name}</h3>
<p>${"⭐".repeat(book.rating)}</p>
<p>${book.review || ""}</p>
<button onclick="toggleFav(${book.id})">⭐</button>
<button onclick="editBook(${book.id})">✏</button>
<button onclick="deleteBook(${book.id})">🗑</button>
`;

library.appendChild(card);
});
}

window.deleteBook = id => {
let books = JSON.parse(localStorage.getItem("books") || "[]");
books = books.filter(b => b.id !== id);
localStorage.setItem("books", JSON.stringify(books));
displayLibrary();
};

window.toggleFav = id => {
let books = JSON.parse(localStorage.getItem("books") || "[]");
books.forEach(b=>{
if(b.id === id) b.favorite = !b.favorite;
});
localStorage.setItem("books", JSON.stringify(books));
displayLibrary();
};

window.editBook = id => {
let books = JSON.parse(localStorage.getItem("books") || "[]");
let book = books.find(b=>b.id===id);

book.name = prompt("Titre :", book.name) || book.name;
book.author = prompt("Auteur :", book.author) || book.author;
book.genre = prompt("Genre :", book.genre) || book.genre;
book.rating = prompt("Note 1-5 :", book.rating) || book.rating;
book.pages = prompt("Pages :", book.pages) || book.pages;
book.explicit = prompt("Scènes Oui/Non :", book.explicit) || book.explicit;
book.review = prompt("Avis :", book.review) || book.review;

localStorage.setItem("books", JSON.stringify(books));
displayLibrary();
};


/* ========================= */
/* ===== POKENOTE ========== */
/* ========================= */

const addBtn = document.getElementById("addNoteBtn");

addBtn.addEventListener("click", ()=>{
let notes = JSON.parse(localStorage.getItem("notes") || "[]");

notes.push({
id: Date.now(),
content: ""
});

localStorage.setItem("notes", JSON.stringify(notes));
displayNotes();
});

function displayNotes(){
let notes = JSON.parse(localStorage.getItem("notes") || "[]");

notesContainer.innerHTML = "";

notes.forEach(note=>{

let div = document.createElement("div");
div.className = "note";

div.innerHTML = `
<textarea placeholder="Écris ici...">${note.content}</textarea>
<button class="deleteBtn">🗑 Supprimer</button>
`;

let textarea = div.querySelector("textarea");
let deleteBtn = div.querySelector(".deleteBtn");

/* Sauvegarde automatique */
textarea.addEventListener("input", function(){
note.content = this.value;
localStorage.setItem("notes", JSON.stringify(notes));
});

/* Suppression sécurisée */
deleteBtn.addEventListener("click", function(){

if(deleteBtn.dataset.confirm !== "true"){

deleteBtn.textContent = "CONFIRMER";
deleteBtn.style.background = "#ff0000";
deleteBtn.style.boxShadow = "0 0 15px red, 0 0 30px rgba(255,0,0,0.7)";
deleteBtn.dataset.confirm = "true";

} else {

let updated = notes.filter(n => n.id !== note.id);
localStorage.setItem("notes", JSON.stringify(updated));
displayNotes();

}

});

notesContainer.appendChild(div);

});
}

});
