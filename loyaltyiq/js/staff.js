const addBillBtn =
    document.getElementById(
        "addBillBtn"
    );

const recentBills =
    document.getElementById(
        "recentBills"
    );

/* =====================================================
   LOAD SAVED BILLS
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    loadBills
);

/* =====================================================
   ADD BILL
===================================================== */

addBillBtn.addEventListener(
    "click",
    () => {

        const phone =
            document.getElementById(
                "customerPhone"
            ).value;

        const amount =
            document.getElementById(
                "billAmount"
            ).value;

        if (phone === "" || amount === "") {

            showToast(
                "Please fill all fields",
                "error"
            );

            return;
        }

        if (phone.length < 10) {

            showToast(
                "Invalid phone number",
                "error"
            );

            return;
        }

        const bill = {

            id: Date.now(),

            phone,

            amount,

            date: new Date()
                .toLocaleString()

        };

        let bills =
            JSON.parse(
                localStorage.getItem(
                    "loyaltyiq-bills"
                )
            ) || [];

        bills.unshift(bill);

        localStorage.setItem(
            "loyaltyiq-bills",
            JSON.stringify(bills)
        );

        showToast(
            "Bill added successfully",
            "success"
        );

        document.getElementById(
            "customerPhone"
        ).value = "";

        document.getElementById(
            "billAmount"
        ).value = "";

        loadBills();

    });

/* =====================================================
   LOAD BILLS
===================================================== */

function loadBills() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-bills"
            )
        ) || [];

    if (bills.length === 0) {

        recentBills.innerHTML = `

        <p style="color:var(--muted);">

        No bills added yet.

        </p>

        `;

        return;
    }

    recentBills.innerHTML = "";

    bills.slice(0, 5).forEach(bill => {

        recentBills.innerHTML += `

        <div
        style="
        padding:18px;
        border-radius:18px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.06);
        margin-bottom:14px;
        ">

            <div
            style="
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
            ">

                <strong>
                ${bill.phone}
                </strong>

                <strong>
                ₹${bill.amount}
                </strong>

            </div>

            <small
            style="
            color:var(--muted);
            ">

            ${bill.date}

            </small>

        </div>

        `;

    });

}

/* =====================================================
   TOAST
===================================================== */

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
        "600";

    toast.style.zIndex =
        "9999";

    toast.style.boxShadow =
        "0 20px 40px rgba(0,0,0,0.3)";

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);

}