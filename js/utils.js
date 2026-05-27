/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(amount) {

    return "₹" +
        Number(amount)
            .toLocaleString("en-IN");

}

/* =========================================================
   RANDOM ID
========================================================= */

function generateId() {

    return Math.random()
        .toString(36)
        .substring(2, 10);

}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {

                day: "numeric",

                month: "short",

                year: "numeric"

            });

}

/* =========================================================
   STORAGE HELPERS
========================================================= */

function saveToStorage(
    key,
    data
) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}

function getFromStorage(
    key
) {

    return JSON.parse(
        localStorage.getItem(key)
    );

}

/* =========================================================
   TOAST GLOBAL
========================================================= */

function globalToast(message) {

    const toast =
        document.createElement("div");

    toast.className =
        "global-toast";

    toast.innerHTML = `
    
        <span>${message}</span>

    `;

    document.body.appendChild(
        toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}