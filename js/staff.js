/* =========================================
   STAFF PANEL — LOYALTYIQ
========================================= */

/* =========================================
   ELEMENTS
========================================= */

const addBillBtn =
    document.getElementById(
        "addBillBtn"
    );

const recentBills =
    document.getElementById(
        "recentBills"
    );

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const billAmount =
    document.getElementById(
        "billAmount"
    );

/* =========================================
   STORAGE KEY
========================================= */

const STORAGE_KEY =
    "loyaltyiq-bills";

/* =========================================
   LOAD ON START
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadBills();

    }
);

/* =========================================
   ENTER KEY SUPPORT
========================================= */

billAmount.addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {

            addBill();

        }

    }
);

/* =========================================
   BUTTON CLICK
========================================= */

addBillBtn.addEventListener(
    "click",
    addBill
);

/* =========================================
   ADD BILL
========================================= */

function addBill() {

    const phone =
        customerPhone.value.trim();

    const amount =
        billAmount.value.trim();

    /* VALIDATION */

    if (phone === "" || amount === "") {

        showToast(
            "Fill all fields",
            "error"
        );

        return;

    }

    if (phone.length < 10) {

        showToast(
            "Enter valid phone number",
            "error"
        );

        return;

    }

    if (Number(amount) <= 0) {

        showToast(
            "Invalid bill amount",
            "error"
        );

        return;

    }

    /* SETTINGS */

    const settings =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-settings"
            )
        ) || {};

    const rewardPercent =
        Number(
            settings.rewardPercent || 10
        );

    /* GET BILLS */

    const bills =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        ) || [];

    /* NEW BILL */

    const newBill = {

        id: Date.now(),

        phone: phone,

        amount: Number(amount),

        rewards:
            Math.floor(

                Number(amount) *
                (rewardPercent / 100)

            ),

        date:
            new Date()
                .toLocaleString(),

        createdAt:
            Date.now()

    };

    /* SAVE */

    bills.unshift(
        newBill
    );

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            bills
        )

    );

    /* SUCCESS */

    showToast(
        "Bill added successfully",
        "success"
    );

    /* CLEAR */

    customerPhone.value = "";
    billAmount.value = "";

    /* RELOAD */

    loadBills();

}

/* =========================================
   LOAD BILLS
========================================= */

function loadBills() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        ) || [];

    /* EMPTY */

    if (bills.length === 0) {

        recentBills.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <i class="ti ti-receipt-off"></i>

            </div>

            <h3>

                No Bills Added Yet

            </h3>

            <p>

                Added customer bills
                will appear here.

            </p>

        </div>

        `;

        return;

    }

    /* SORT */

    const latestBills =
        [...bills]

            .sort(
                (a, b) =>
                    b.createdAt - a.createdAt
            )

            .slice(0, 10);

    /* CLEAR */

    recentBills.innerHTML = "";

    /* RENDER */

    latestBills.forEach(
        bill => {

            recentBills.innerHTML += `

            <div class="activity-item"
            style="
            margin-bottom:16px;
            ">

                <div class="activity-left">

                    <div class="activity-avatar">

                        ${bill.phone.slice(0, 2)}

                    </div>

                    <div>

                        <div class="activity-name">

                            ${bill.phone}

                        </div>

                        <div class="activity-time">

                            ${bill.date}

                        </div>

                    </div>

                </div>

                <div
                style="
                text-align:right;
                ">

                    <div class="activity-right">

                        ₹${bill.amount}

                    </div>

                    <div class="activity-time">

                        Reward ₹${bill.rewards}

                    </div>

                </div>

            </div>

            `;

        }
    );

}

/* =========================================
   EXPORT REPORT
========================================= */

const exportBtn =
    document.querySelector(
        ".small-btn"
    );

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        exportBills
    );

}

function exportBills() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        ) || [];

    if (bills.length === 0) {

        showToast(
            "No bills to export",
            "error"
        );

        return;

    }

    let content =
        `LOYALTYIQ STAFF REPORT

==============================

`;

    bills.forEach(
        bill => {

            content +=

                `Phone : ${bill.phone}
Amount : ₹${bill.amount}
Reward : ₹${bill.rewards}
Date : ${bill.date}

----------------------------

`;

        }
    );

    const blob =
        new Blob(
            [content],
            {
                type: "text/plain"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "loyaltyiq-bills-report.txt";

    link.click();

    showToast(
        "Report exported successfully",
        "success"
    );

}

/* =========================================
   TOAST
========================================= */

function showToast(
    message,
    type
) {

    const toast =
        document.createElement(
            "div"
        );

    toast.innerText =
        message;

    toast.style.position =
        "fixed";

    toast.style.bottom =
        "30px";

    toast.style.right =
        "30px";

    toast.style.padding =
        "18px 24px";

    toast.style.borderRadius =
        "18px";

    toast.style.background =
        type === "success"
            ? "#10b981"
            : "#ef4444";

    toast.style.color =
        "white";

    toast.style.fontWeight =
        "700";

    toast.style.zIndex =
        "9999";

    toast.style.boxShadow =
        "0 20px 40px rgba(0,0,0,0.35)";

    toast.style.animation =
        "fadeIn 0.3s ease";

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);

}