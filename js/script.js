const bookList = document.getElementById("bookList");
const quantity = document.getElementById("quantity");
const reamPriceInput = document.getElementById("reamPrice");


/* =========================
   TAMBAH ITEM
========================= */

function addBook() {

    const book = document.createElement("div");

    book.className = "book";

    book.innerHTML = `
        <div class="book-header">

            <input
                type="text"
                class="book-name"
                placeholder="Nama buku / soal / item"
            >

            <button
                type="button"
                class="delete-book"
                onclick="deleteBook(this)"
                aria-label="Hapus item"
            >
                ×
            </button>

        </div>

        <div class="category-list"></div>

        <button
            type="button"
            class="add-category"
            onclick="addCategory(this)"
        >
            + Tambah Kategori
        </button>

        <div class="book-total">

            <span>Total item</span>

            <strong>
                <span class="book-total-number">0</span>
                lembar
            </strong>

        </div>
    `;

    bookList.appendChild(book);

    const list = book.querySelector(".category-list");

    createCategory(list);

    book.querySelector(".book-name").focus();

    calculate();
}


/* =========================
   CATEGORY
========================= */

function createCategory(list, name = "", pages = "") {

    const row = document.createElement("div");

    row.className = "category-row";

    row.innerHTML = `
        <input
            type="text"
            class="category-name"
            placeholder="Kategori"
        >

        <input
            type="number"
            class="page-input"
            placeholder="Hal."
            min="0"
            inputmode="numeric"
        >

        <div class="paper-result">
            0 lbr
        </div>

        <button
            type="button"
            class="delete-category"
            onclick="deleteCategory(this)"
            aria-label="Hapus kategori"
        >
            ×
        </button>
    `;

    row.querySelector(".category-name").value = name;
    row.querySelector(".page-input").value = pages;

    list.appendChild(row);
}


function addCategory(button) {

    const book = button.closest(".book");

    const list = book.querySelector(".category-list");

    createCategory(list);

    const rows = list.querySelectorAll(".category-row");

    rows[rows.length - 1]
        .querySelector(".category-name")
        .focus();

    calculate();
}


/* =========================
   DELETE
========================= */

function deleteBook(button) {

    button.closest(".book").remove();

    calculate();
}


function deleteCategory(button) {

    const book = button.closest(".book");

    const rows = book.querySelectorAll(".category-row");

    if (rows.length === 1) {

        rows[0].querySelector(".category-name").value = "";
        rows[0].querySelector(".page-input").value = "";

    } else {

        button.closest(".category-row").remove();

    }

    calculate();
}


/* =========================
   CALCULATE
========================= */

function calculate() {

    const books = document.querySelectorAll(".book");

    let totalPerCopy = 0;


    books.forEach(book => {

        const rows = book.querySelectorAll(".category-row");

        let bookTotal = 0;


        rows.forEach(row => {

            const pageInput =
                row.querySelector(".page-input");

            const paperResult =
                row.querySelector(".paper-result");

            const pages =
                Number(pageInput.value) || 0;


            // Cetak bolak-balik
            const sheets =
                Math.ceil(pages / 2);


            paperResult.textContent =
                sheets.toLocaleString("id-ID") + " lbr";


            bookTotal += sheets;

        });


        book.querySelector(
            ".book-total-number"
        ).textContent =
            bookTotal.toLocaleString("id-ID");


        totalPerCopy += bookTotal;

    });


    /* JUMLAH RANGKAP */

    const copyCount =
        Math.max(
            Number(quantity.value) || 0,
            0
        );


    /* TOTAL */

    const grandTotal =
        totalPerCopy * copyCount;


    /* RIM */

    const reamNeed =
        grandTotal / 500;

    const reamBuy =
        grandTotal > 0
            ? Math.ceil(reamNeed)
            : 0;

    const paperBuy =
        reamBuy * 500;

    const remaining =
        paperBuy - grandTotal;


    /* HARGA */

    const reamPrice =
        Number(reamPriceInput.value) || 0;

    const totalCost =
        reamBuy * reamPrice;


    /* OUTPUT */

    document.getElementById(
        "grandTotal"
    ).textContent =
        grandTotal.toLocaleString("id-ID");


    document.getElementById(
        "reamNeed"
    ).textContent =
        reamNeed.toLocaleString(
            "id-ID",
            {
                maximumFractionDigits: 2
            }
        ) + " rim";


    document.getElementById(
        "reamBuy"
    ).textContent =
        reamBuy.toLocaleString("id-ID")
        + " rim";


    document.getElementById(
        "remaining"
    ).textContent =
        remaining.toLocaleString("id-ID")
        + " lembar";


    document.getElementById(
        "totalCost"
    ).textContent =
        formatRupiah(totalCost);

}


/* =========================
   RUPIAH
========================= */

function formatRupiah(number) {

    return "Rp" +
        Math.round(number)
            .toLocaleString("id-ID");

}


/* =========================
   AUTO CALCULATE
========================= */

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.matches(
                ".page-input, #quantity, #reamPrice"
            )
        ) {
            calculate();
        }

    }
);


/* =========================
   ENTER
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Enter" ||
            !event.target.classList.contains(
                "page-input"
            )
        ) {
            return;
        }

        event.preventDefault();


        const currentRow =
            event.target.closest(".category-row");

        const nextRow =
            currentRow.nextElementSibling;


        if (
            nextRow &&
            nextRow.classList.contains(
                "category-row"
            )
        ) {

            nextRow
                .querySelector(".page-input")
                .focus();

            return;
        }


        const book =
            currentRow.closest(".book");

        const list =
            book.querySelector(".category-list");


        createCategory(list);


        const rows =
            list.querySelectorAll(".category-row");

        const newRow =
            rows[rows.length - 1];


        newRow
            .querySelector(".category-name")
            .focus();


        calculate();

    }
);


/* =========================
   INITIAL
========================= */

calculate();