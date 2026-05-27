/* =========================================
   CUSTOMER REWARDS — LOYALTYIQ
========================================= */

/* =========================================
   ELEMENTS
========================================= */

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const resultBox =
    document.getElementById(
        "customerResult"
    );

/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY =
    "loyaltyiq-bills";

/* =========================================
   SEARCH
========================================= */

searchBtn.addEventListener(
    "click",
    searchCustomer
);

/* ENTER KEY */

document.getElementById(
    "searchPhone"
).addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {

            searchCustomer();

        }

    }
);

/* =========================================
   SEARCH FUNCTION
========================================= */

function searchCustomer() {

    const phone =
        document.getElementById(
            "searchPhone"
        ).value.trim();

    /* VALIDATION */

    if (phone === "") {

        showToast(
            "Enter phone number",
            "error"
        );

        return;

    }

    /* GET BILLS */

    const bills =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        ) || [];

    /* FILTER */

    const customerBills =
        bills.filter(
            bill =>
                bill.phone === phone
        );

    /* NOT FOUND */

    if (customerBills.length === 0) {

        resultBox.innerHTML = `

        <div class="card">

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="ti ti-user-off"></i>

                </div>

                <h3>

                    Customer Not Found

                </h3>

                <p>

                    No rewards data available
                    for this customer.

                </p>

            </div>

        </div>

        `;

        showToast(
            "Customer not found",
            "error"
        );

        return;

    }

    /* =====================================
       CALCULATIONS
    ===================================== */

    let totalSpent = 0;

    customerBills.forEach(
        bill => {

            totalSpent +=
                Number(
                    bill.amount
                );

        }
    );

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

    const rewards =
        Math.floor(

            totalSpent *
            (rewardPercent / 100)

        );

    const visits =
        customerBills.length;

    /* MEMBERSHIP */

    let membership =
        "Bronze Member";

    let badgeColor =
        "#cd7f32";

    if (totalSpent > 5000) {

        membership =
            "Silver Member";

        badgeColor =
            "#c0c0c0";

    }

    if (totalSpent > 15000) {

        membership =
            "Gold Member";

        badgeColor =
            "#f59e0b";

    }

    if (totalSpent > 30000) {

        membership =
            "Platinum Member";

        badgeColor =
            "#7dd3fc";

    }

    /* SORT */

    const sortedBills =
        [...customerBills]

            .sort(
                (a, b) =>
                    b.createdAt - a.createdAt
            );

    /* LAST VISIT */

    const lastVisit =
        sortedBills[0]?.date || "-";

    /* =====================================
       RENDER
    ===================================== */

    resultBox.innerHTML = `

    <div class="profile-box">

        <!-- PROFILE -->

        <div class="profile-head">

            <div class="avatar">

                <i class="ti ti-user"></i>

            </div>

            <div>

                <div
                style="
                font-size:24px;
                font-weight:800;
                ">

                    ${phone}

                </div>

                <div
                class="badge"
                style="
                background:${badgeColor}20;
                color:${badgeColor};
                ">

                    ${membership}

                </div>

            </div>

        </div>

        <!-- STATS -->

        <div class="stat-grid">

            <div class="stat-item">

                <div class="stat-lbl">

                    Total Visits

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

                    ₹${totalSpent.toLocaleString()}

                </div>

            </div>

            <div class="stat-item">

                <div class="stat-lbl">

                    Rewards Earned

                </div>

                <div class="stat-val">

                    ₹${rewards.toLocaleString()}

                </div>

            </div>

            <div class="stat-item">

                <div class="stat-lbl">

                    Reward %

                </div>

                <div class="stat-val">

                    ${rewardPercent}%

                </div>

            </div>

        </div>

        <!-- HISTORY -->

        <div
        style="
        margin-top:32px;
        ">

            <div
            style="
            font-size:20px;
            font-weight:700;
            margin-bottom:18px;
            ">

                Recent Visits

            </div>

            ${sortedBills.slice(0, 5).map(bill => `

            <div class="activity-item"
            style="
            margin-bottom:14px;
            ">

                <div class="activity-left">

                    <div class="activity-avatar">

                        <i class="ti ti-receipt"></i>

                    </div>

                    <div>

                        <div class="activity-name">

                            Bill Added

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

                        ₹${Number(
        bill.amount
    ).toLocaleString()}

                    </div>

                    <div class="activity-time">

                        Reward ₹${bill.rewards || 0}

                    </div>

                </div>

            </div>

            `).join("")}

        </div>

        <!-- FOOTER -->

        <div
        style="
        margin-top:28px;
        padding-top:22px;
        border-top:1px solid rgba(255,255,255,0.08);
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:20px;
        flex-wrap:wrap;
        ">

            <div>

                <div
                style="
                color:var(--muted);
                font-size:13px;
                margin-bottom:6px;
                ">

                    Last Visit

                </div>

                <div
                style="
                font-weight:700;
                ">

                    ${lastVisit}

                </div>

            </div>

            <button
            class="btn-primary">

                <i class="ti ti-gift"></i>

                Rewards Active

            </button>

        </div>

    </div>

    `;

    showToast(
        "Customer loaded successfully",
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

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);

}