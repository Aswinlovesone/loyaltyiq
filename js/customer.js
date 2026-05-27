const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const resultBox =
    document.getElementById(
        "customerResult"
    );

/* =========================================
   SEARCH CUSTOMER
========================================= */

searchBtn.addEventListener(
    "click",
    () => {

        const phone =
            document.getElementById(
                "searchPhone"
            ).value;

        if (phone === "") {

            showToast(
                "Enter phone number",
                "error"
            );

            return;
        }

        const bills =
            JSON.parse(
                localStorage.getItem(
                    "loyaltyiq-bills"
                )
            ) || [];

        const customerBills =
            bills.filter(
                bill => bill.phone === phone
            );

        if (customerBills.length === 0) {

            resultBox.innerHTML = `

        <div class="card">

            <p style="color:#ef4444;">

            Customer not found.

            </p>

        </div>

        `;

            return;
        }

        /* ===========================
           CALCULATIONS
        =========================== */

        let totalSpent = 0;

        customerBills.forEach(bill => {

            totalSpent +=
                Number(bill.amount);

        });

        const visits =
            customerBills.length;

        const rewards =
            Math.floor(totalSpent * 0.1);

        /* ===========================
           RENDER
        =========================== */

        resultBox.innerHTML = `

    <div class="profile-box">

        <div class="profile-head">

            <div class="avatar">

                ${phone.slice(0, 2)}

            </div>

            <div>

                <div class="pname">

                    Customer

                </div>

                <div class="badge">

                    Gold Member

                </div>

            </div>

        </div>

        <div class="stat-grid">

            <div class="stat-item">

                <div class="stat-lbl">

                    Visits

                </div>

                <div class="stat-val">

                    ${visits}

                </div>

            </div>

            <div class="stat-item">

                <div class="stat-lbl">

                    Total Spent

                </div>

                <div class="stat-val">

                    ₹${totalSpent}

                </div>

            </div>

            <div class="stat-item">

                <div class="stat-lbl">

                    Rewards

                </div>

                <div class="stat-val">

                    ₹${rewards}

                </div>

            </div>

        </div>

    </div>

    `;

        showToast(
            "Customer loaded",
            "success"
        );

    });

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