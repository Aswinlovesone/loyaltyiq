window.addEventListener(
    "DOMContentLoaded",
    loadAnalytics
);

/* =========================================
   REFRESH BUTTON
========================================= */

const refreshBtn =
    document.getElementById(
        "refreshAnalytics"
    );

refreshBtn.addEventListener(
    "click",
    () => {

        loadAnalytics();

        showToast(
            "Analytics refreshed",
            "success"
        );

    });

/* =========================================
   LOAD ANALYTICS
========================================= */

function loadAnalytics() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-bills"
            )
        ) || [];

    /* =========================
       CUSTOMERS
    ========================= */

    const uniqueCustomers =
        [...new Set(
            bills.map(
                bill => bill.phone
            )
        )];

    const totalCustomers =
        uniqueCustomers.length;

    /* =========================
       REVENUE
    ========================= */

    let totalRevenue = 0;

    bills.forEach(bill => {

        totalRevenue +=
            Number(bill.amount);

    });

    /* =========================
       REWARDS
    ========================= */

    const totalRewards =
        Math.floor(totalRevenue * 0.1);

    /* =========================
       RETENTION
    ========================= */

    let repeatCustomers = 0;

    uniqueCustomers.forEach(phone => {

        const visits =
            bills.filter(
                bill => bill.phone === phone
            );

        if (visits.length > 1) {

            repeatCustomers++;

        }

    });

    const retention =
        totalCustomers === 0
            ? 0
            : Math.floor(
                (repeatCustomers /
                    totalCustomers)
                * 100
            );

    /* =========================
       UPDATE UI
    ========================= */

    document.getElementById(
        "analyticsRevenue"
    ).innerText =
        `₹${totalRevenue}`;

    document.getElementById(
        "analyticsCustomers"
    ).innerText =
        totalCustomers;

    document.getElementById(
        "analyticsRewards"
    ).innerText =
        `₹${totalRewards}`;

    document.getElementById(
        "analyticsRetention"
    ).innerText =
        `${retention}%`;

    /* =========================
       PERFORMANCE
    ========================= */

    const revenueGrowth =
        Math.min(
            Math.floor(totalRevenue / 1000),
            100
        );

    const engagement =
        Math.min(
            retention,
            100
        );

    const rewardUsage =
        Math.min(
            Math.floor(totalRewards / 100),
            100
        );

    document.getElementById(
        "revenueGrowth"
    ).innerText =
        `${revenueGrowth}%`;

    document.getElementById(
        "engagementGrowth"
    ).innerText =
        `${engagement}%`;

    document.getElementById(
        "rewardUsage"
    ).innerText =
        `${rewardUsage}%`;

    document.getElementById(
        "revenueBar"
    ).style.width =
        `${revenueGrowth}%`;

    document.getElementById(
        "engagementBar"
    ).style.width =
        `${engagement}%`;

    document.getElementById(
        "rewardBar"
    ).style.width =
        `${rewardUsage}%`;

    loadTopCustomers(
        bills
    );

    loadTransactions(
        bills
    );

}

/* =========================================
   TOP CUSTOMERS
========================================= */

function loadTopCustomers(
    bills
) {

    const container =
        document.getElementById(
            "analyticsTopCustomers"
        );

    const totals = {};

    bills.forEach(bill => {

        if (!totals[bill.phone]) {

            totals[bill.phone] = 0;

        }

        totals[bill.phone] +=
            Number(bill.amount);

    });

    const sorted =
        Object.entries(totals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    if (sorted.length === 0) {

        container.innerHTML = `

        <p style="color:var(--muted);">

        No customer data.

        </p>

        `;

        return;
    }

    container.innerHTML = "";

    sorted.forEach(customer => {

        container.innerHTML += `

        <div
        style="
        display:flex;
        justify-content:space-between;
        padding:16px;
        border-radius:18px;
        background:rgba(255,255,255,0.04);
        margin-bottom:14px;
        ">

            <strong>

            ${customer[0]}

            </strong>

            <strong>

            ₹${customer[1]}

            </strong>

        </div>

        `;

    });

}

/* =========================================
   TRANSACTIONS
========================================= */

function loadTransactions(
    bills
) {

    const container =
        document.getElementById(
            "recentTransactions"
        );

    if (bills.length === 0) {

        container.innerHTML = `

        <p style="color:var(--muted);">

        No transactions available.

        </p>

        `;

        return;
    }

    container.innerHTML = "";

    bills.slice(-10)
        .reverse()
        .forEach(bill => {

            container.innerHTML += `

        <div
        style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:18px;
        border-radius:18px;
        background:rgba(255,255,255,0.04);
        margin-bottom:14px;
        ">

            <div>

                <strong>

                ${bill.phone}

                </strong>

                <br>

                <small
                style="
                color:var(--muted);
                ">

                ${bill.date}

                </small>

            </div>

            <strong>

            ₹${bill.amount}

            </strong>

        </div>

        `;

        });

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