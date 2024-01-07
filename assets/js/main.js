document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  // Fungsi untuk menyimpan data buku ke localStorage
  function saveToLocalStorage() {
    const incompleteBookshelf = Array.from(
      incompleteBookshelfList.children
    ).map(bookElementToData);
    const completeBookshelf = Array.from(completeBookshelfList.children).map(
      bookElementToData
    );

    localStorage.setItem(
      "incompleteBookshelf",
      JSON.stringify(incompleteBookshelf)
    );
    localStorage.setItem(
      "completeBookshelf",
      JSON.stringify(completeBookshelf)
    );
  }

  // Fungsi untuk memuat data buku dari localStorage
  function loadFromLocalStorage() {
    const incompleteBookshelf =
      JSON.parse(localStorage.getItem("incompleteBookshelf")) || [];
    const completeBookshelf =
      JSON.parse(localStorage.getItem("completeBookshelf")) || [];

    incompleteBookshelf.forEach((book) => {
      incompleteBookshelfList.appendChild(createBookItem(book));
    });

    completeBookshelf.forEach((book) => {
      completeBookshelfList.appendChild(createBookItem(book));
    });

    // Tampilkan hasil pencarian saat halaman dimuat
    searchBooks();
  }

  // Fungsi untuk mengonversi elemen buku ke data buku
  function bookElementToData(bookElement) {
    const title = bookElement.querySelector("h3").textContent;
    const author = bookElement
      .querySelector("p:nth-of-type(1)")
      .textContent.replace("Penulis: ", "");
    const year = parseInt(
      bookElement
        .querySelector("p:nth-of-type(2)")
        .textContent.replace("Tahun: ", "")
    );
    const isComplete = bookElement.parentElement.id === "completeBookshelfList";
    const id = +new Date(); // Menambah properti id dengan nilai timestamp

    return { id, title, author, year, isComplete };
  }

  // Fungsi untuk menambahkan buku
  function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    if (!inputBookTitle || !inputBookAuthor || !inputBookYear) {
      alert("Mohon lengkapi data buku!");
      return;
    }

    const newBook = {
      id: +new Date(), // Menambah properti id dengan nilai timestamp
      title: inputBookTitle,
      author: inputBookAuthor,
      year: parseInt(inputBookYear), // Mengubah nilai year menjadi number
      isComplete: inputBookIsComplete,
    };

    const bookItem = createBookItem(newBook);

    if (inputBookIsComplete) {
      completeBookshelfList.appendChild(bookItem);
      updateSubmitButtonText(
        "Masukkan Buku ke rak <strong>Selesai Dibaca</strong>"
      );
    } else {
      incompleteBookshelfList.appendChild(bookItem);
      updateSubmitButtonText(
        "Masukkan Buku ke rak <strong>Belum Selesai Dibaca</strong>"
      );
    }

    resetForm();
    saveToLocalStorage();
    searchBooks(); // Memanggil fungsi pencarian setelah menambahkan buku
  }

  // Fungsi untuk membuat elemen buku
  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const bookInfo = document.createElement("div");
    bookInfo.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
    `;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    const actionButton = document.createElement("button");
    actionButton.classList.add(book.isComplete ? "green" : "green");
    actionButton.innerHTML = book.isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    actionButton.addEventListener("click", function () {
      toggleBookStatus(book, bookItem);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.textContent = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(book, bookItem);
    });

    bookAction.appendChild(actionButton);
    bookAction.appendChild(deleteButton);

    bookItem.appendChild(bookInfo);
    bookItem.appendChild(bookAction);

    return bookItem;
  }

  // Fungsi untuk memindahkan status buku
  function toggleBookStatus(book, bookItem) {
    const newBook = {
      id: +new Date(), // Menambah properti id dengan nilai timestamp
      title: book.title,
      author: book.author,
      year: book.year,
      isComplete: !book.isComplete,
    };

    const updatedBookItem = createBookItem(newBook);

    if (newBook.isComplete) {
      completeBookshelfList.appendChild(updatedBookItem);
    } else {
      incompleteBookshelfList.appendChild(updatedBookItem);
    }

    deleteBook(book, bookItem);
    saveToLocalStorage();
    searchBooks(); // Memanggil fungsi pencarian setelah mengubah status buku
  }

  // Fungsi untuk menghapus buku
  function deleteBook(book, bookItem) {
    if (bookItem) {
      bookItem.remove();
    }
    saveToLocalStorage();
    searchBooks(); // Memanggil fungsi pencarian setelah menghapus buku
  }

  // Fungsi untuk mereset form
  function resetForm() {
    inputBookForm.reset();
  }

  // Fungsi untuk mengubah teks pada tombol submit
  function updateSubmitButtonText(text) {
    const submitButton = document.getElementById("bookSubmit");
    submitButton.innerHTML = text;
  }

  // Fungsi untuk melakukan pencarian buku
  function searchBooks() {
    const searchTerm = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const allBooks = Array.from(incompleteBookshelfList.children).concat(
      Array.from(completeBookshelfList.children)
    );

    allBooks.forEach((bookItem) => {
      const bookTitle = bookItem.querySelector("h3").textContent.toLowerCase();
      const isMatch = bookTitle.includes(searchTerm);

      // Menampilkan atau menyembunyikan buku berdasarkan hasil pencarian
      bookItem.style.display = isMatch ? "block" : "none";
    });
  }

  // Event listener untuk merubah teks pada tombol submit saat radio button diubah
  document
    .getElementById("inputBookIsComplete")
    .addEventListener("change", function () {
      const submitButton = document.getElementById("bookSubmit");
      const isComplete = this.checked;
      const buttonText = isComplete
        ? "Masukkan Buku ke rak <strong>Selesai Dibaca</strong>"
        : "Masukkan Buku ke rak <strong>Belum Selesai Dibaca</strong>";
      submitButton.innerHTML = buttonText;
    });

  // Menambahkan event listener untuk form submit pencarian
  document
    .getElementById("searchBook")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      searchBooks();
    });

  // Menambahkan event listener untuk form submit penambahan buku
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  // Memuat data buku dari localStorage saat halaman dimuat
  loadFromLocalStorage();
});
