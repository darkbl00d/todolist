const createNotes = document.querySelector(".create_note");
const popup = document.querySelector(".popup");
const popupInput = document.querySelector(".popup__input");
const notes = document.querySelector(".note__list");
const searchInput = document.querySelector(".search");
const dropdown = document.querySelector(".dropdown");
const btn = dropdown.querySelector(".dropdown-btn");
const content = dropdown.querySelector(".dropdown-content");

let darkmode = false;
let currentFilter = "all";
let notesData = JSON.parse(localStorage.getItem("notes")) || [];

// Рендер заметок
renderNotes();

//  Создание заметки
createNotes.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("visible");
});

popup.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("popup__cancel")) {
    closeModal();
  } else if (target.classList.contains("popup__apply")) {
    const inputsave = popupInput.value.trim();
    if (!inputsave) return;

    // Добавляем заметку в массив
    const newNote = {
      id: Date.now(),
      text: inputsave,
      completed: false,
    };

    notesData.push(newNote);
    saveNotes();
    renderNotes();
    closeModal();
  }
});

function closeModal() {
  popup.classList.add("visible");
  popupInput.value = "";
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notesData));
}

// ====== Рендер заметок ======
function renderNotes() {
  notes.innerHTML = "";

  if (notesData.length === 0) {
    notes.classList.add("empty");
    return;
  } else {
    notes.classList.remove("empty");
  }

  notesData.forEach((note) => {
    let html = `
    <div class="note__list-item ${note.completed ? "completed" : ""}">
      <input type="checkbox" class="item-cheakbox" ${
        note.completed ? "checked" : ""
      } />
      <div class="item-text">${note.text}</div>
      <div class="note__active">
        <button class="note__active-btn-edit active">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"
              stroke="#CDCDCD"
            ></path>
          </svg>
        </button>

        <button class="note__active-btn-remove active">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
              stroke="#CDCDCD"
            ></path>
            <path d="M14.625 3.75H3.375" stroke="#CDCDCD"></path>
            <path
              d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
              stroke="#CDCDCD"
            ></path>
            <path d="M10.5 9V12.75" stroke="#CDCDCD"></path>
            <path d="M7.5 9V12.75" stroke="#CDCDCD"></path>
          </svg>
        </button>
      </div>
    </div>
    `;

    notes.insertAdjacentHTML("beforeend", html);
  });

  // добавляем анимацию появления
  requestAnimationFrame(() => {
    document.querySelectorAll(".note__list-item").forEach((el) => {
      el.classList.add("show");
    });
  });

  loadList();
  applyFilterAndSearch();
}

//  Редактирование и удаление
function loadList() {
  const editButtons = document.querySelectorAll(".note__active-btn-edit");
  const removeButtons = document.querySelectorAll(".note__active-btn-remove");

  // Редактирование
  editButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      const noteItem = e.target.closest(".note__list-item");
      const idx = Array.from(notes.children).indexOf(noteItem);
      const oldText = notesData[idx].text;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "note__edit-input";
      input.value = oldText;

      const actions = document.createElement("div");
      actions.className = "note__edit-actions";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "✅";

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "❌";

      actions.append(saveBtn, cancelBtn);

      const textDiv = noteItem.querySelector(".item-text");
      textDiv.replaceWith(input);
      noteItem.querySelector(".note__active").style.display = "none";
      noteItem.append(actions);
      input.focus();

      saveBtn.addEventListener("click", () => {
        const newText = input.value.trim() || oldText;
        notesData[idx].text = newText;
        saveNotes();
        renderNotes();
      });

      cancelBtn.addEventListener("click", () => {
        renderNotes();
      });
    });
  });

  // Удаление
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noteItem = e.target.closest(".note__list-item");
      const index = Array.from(notes.children).indexOf(noteItem);

      // плавное удаление
      noteItem.classList.add("fade-out");
      setTimeout(() => {
        notesData.splice(index, 1);
        saveNotes();
        renderNotes();
      }, 300);
    });
  });
}

// Checkbox (для фильтра) проверка на состояние
notes.addEventListener("change", (e) => {
  if (e.target.classList.contains("item-cheakbox")) {
    const noteItem = e.target.closest(".note__list-item");
    const index = Array.from(notes.children).indexOf(noteItem);
    notesData[index].completed = e.target.checked;
    saveNotes();
    renderNotes();
  }
});

// Dropdown filter / фильтр / и поск с фильтром
const dropdownLinks = document.querySelectorAll(".dropdown-content a");
dropdownLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentFilter = link.textContent.toLowerCase();
    btn.textContent = link.textContent.toUpperCase();
    content.classList.remove("open");
    applyFilterAndSearch();
  });
});

// Search Filter
searchInput.addEventListener("input", applyFilterAndSearch);
function applyFilterAndSearch() {
  const query = searchInput.value.toLowerCase();
  const notesList = document.querySelectorAll(".note__list-item");

  notesList.forEach((note) => {
    const text = note.querySelector(".item-text").textContent.toLowerCase();
    let matchesSearch = text.includes(query);
    let matchesFilter = false;

    if (currentFilter === "all") matchesFilter = true;
    else if (currentFilter === "active")
      matchesFilter = !note.classList.contains("completed");
    else if (currentFilter === "completed")
      matchesFilter = note.classList.contains("completed");

    note.style.display = matchesSearch && matchesFilter ? "flex" : "none";
  });
}

// dropdawn
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  content.classList.toggle("open");
});
document.addEventListener("click", () => {
  content.classList.remove("open");
});

// dark mode button
document
  .querySelector(".header__menu-button")
  .addEventListener("click", nightmode);

function nightmode() {
  darkmode = !darkmode;
  document.body.classList.toggle("dark-mode");
  document.querySelectorAll(".note__list-item").forEach((note) => {
    note.classList.toggle("dark-mode", darkmode);
  });

  document
    .querySelector(".popup__title")
    .classList.toggle("dark-mode", darkmode);
  const popupContent = document.querySelector(".popup__content");
  popupContent.style.backgroundColor = darkmode ? "#1e1e1e" : "white";

  document.querySelector(".search").classList.toggle("dark-mode", darkmode);
  document
    .querySelector(".popup__input")
    .classList.toggle("dark-mode", darkmode);
  document
    .querySelector(".header__menu-search")
    .classList.toggle("dark-mode", darkmode);
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.toggle("dark-mode", darkmode);
  });
}
