// APP-HEADER COMPONENT
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header>
                <div class="logo">📝 Notes App</div>
            </header>
        `;
    }
}

// FOOTER COMPONENT
class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <footer>
                <p>&copy; 2025 Notes App by Suprianto</p>
            </footer>
        `;
    }
}

// NOTE-FORM COMPONENT
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <form id="noteForm">
                <h2>Tambah Catatan</h2>
                
                <input type="text" id="title" placeholder="Judul Catatan">
                <p class="error-message" id="titleError">Judul tidak boleh kosong!</p>

                <textarea id="body" placeholder="Isi Catatan"></textarea>
                <p class="error-message" id="bodyError">Isi catatan tidak boleh kosong!</p>

                <button type="submit">Tambah</button>
            </form>

            <div id="popup" class="popup">Catatan berhasil ditambahkan!</div>
        `;
    }

    connectedCallback() {
        this.querySelector("#noteForm").addEventListener("submit", (event) => {
            event.preventDefault();
            this.validateForm();
        });
    }

    validateForm() {
        const titleInput = this.querySelector("#title");
        const bodyInput = this.querySelector("#body");
        const titleError = this.querySelector("#titleError");
        const bodyError = this.querySelector("#bodyError");

        let isValid = true;
        
        if (titleInput.value.trim() === "") {
            titleError.style.display = "block";
            isValid = false;
        } else {
            titleError.style.display = "none";
        }

        if (bodyInput.value.trim() === "") {
            bodyError.style.display = "block";
            isValid = false;
        } else {
            bodyError.style.display = "none";
        }

        if (isValid) {
            const title = titleInput.value;
            const body = bodyInput.value;
            const createdAt = new Date().toISOString();

            document.dispatchEvent(new CustomEvent("noteAdded", { detail: { title, body, createdAt } }));
            this.querySelector("#noteForm").reset();
            this.showPopup();
        }
    }

    showPopup() {
        const popup = this.querySelector("#popup");
        popup.classList.add("show");
        setTimeout(() => {
            popup.classList.remove("show");
        }, 2000);
    }
}


// NOTE-LIST COMPONENT
class NoteList extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="note-list-container">
                <h2>Daftar Catatan</h2>
                <div class="note-container"></div>
            </div>
        `;
    }

    connectedCallback() {
        document.addEventListener("noteAdded", (event) => {
            notesData.push(event.detail);
            this.render();
        });
        this.render();
    }

    render() {
        const container = this.querySelector(".note-container");
        container.innerHTML = "";
        notesData.forEach((note, index) => {
            const noteCard = document.createElement("note-card");
            noteCard.setAttribute("title", note.title);
            noteCard.setAttribute("body", note.body);
            noteCard.setAttribute("createdAt", note.createdAt);
            noteCard.setAttribute("index", index);
            container.appendChild(noteCard);
        });
    }
}

// NOTE-CARD COMPONENT
class NoteCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute("title") || "Tanpa Judul";
        const body = this.getAttribute("body") || "Tidak ada isi catatan.";
        const createdAt = this.getAttribute("createdAt") || new Date().toISOString(); 

        const formattedDate = new Date(createdAt).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        this.innerHTML = `
            <div class="note-card">
                <h3>${title}</h3>
                <p>${body}</p>
                <small>🕒 ${formattedDate}</small>
            </div>
        `;
    }
}

customElements.define("app-header", AppHeader);
customElements.define("app-footer", AppFooter);
customElements.define("note-form", NoteForm);
customElements.define("note-list", NoteList);
customElements.define("note-card", NoteCard);
