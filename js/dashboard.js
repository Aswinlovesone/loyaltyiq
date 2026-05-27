/* =========================================
   LOAD DASHBOARD DATA
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);

function loadDashboard() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-bills"
            )
        ) || [];

    /* =========================
       TOTAL CUSTOMERS
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
       TOTAL REVENUE
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
        Math.floor(
            totalRevenue * 0.1
        );

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
                (repeatCustomers / totalCustomers)
                * 100
            );

    /* =========================
       UPDATE UI
    ========================= */

    updateMetric(
        0,
        totalCustomers
    );

    updateMetric(
        1,
        `₹${totalRevenue}`
    );

    updateMetric(
        2,
        `₹${totalRewards}`
    );

    updateMetric(
        3,
        `${retention}%`
    );

    loadTopCustomers(
        bills
    );

    loadRecentActivity(
        bills
    );

}

/* =========================================
   UPDATE METRICS
========================================= */

function updateMetric(
    index,
    value
) {

    const metrics =
        document.querySelectorAll(
            ".mcard-val"
        );

    if (metrics[index]) {

        metrics[index].innerText =
            value;

    }

}

/* =========================================
   TOP CUSTOMERS
========================================= */

function loadTopCustomers(
    bills
) {

    const table =
        document.querySelector(
            "table"
        );

    if (!table) return;

    const customerTotals = {};

    bills.forEach(bill => {

        if (!customerTotals[bill.phone]) {

            customerTotals[bill.phone] = 0;

        }

        customerTotals[bill.phone] +=
            Number(bill.amount);

    });

    const sorted =
        Object.entries(customerTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    table.innerHTML = `

    <tr>

        <th>Phone</th>

        <th>Spend</th>

    </tr>

    `;

    sorted.forEach(customer => {

        table.innerHTML += `

        <tr>

            <td>${customer[0]}</td>

            <td>₹${customer[1]}</td>

        </tr>

        `;

    });

}

/* =========================================
   RECENT ACTIVITY
========================================= */

function loadRecentActivity(
    bills
) {

    const activityCard =
        document.querySelectorAll(
            ".card"
        )[1];

    if (!activityCard) return;

    const latest =
        bills.slice(-5).reverse();

    activityCard.innerHTML = `

    <div class="card-title">

        Recent Activity

    </div>

    `;

    if (latest.length === 0) {

        activityCard.innerHTML += `

        <p style="color:var(--muted);">

        No recent activity.

        </p>

        `;

        return;
    }

    latest.forEach(bill => {

        activityCard.innerHTML += `

        <div
        class="activity-item"
        style="
        padding:16px;
        border-radius:18px;
        background:rgba(255,255,255,0.04);
        margin-bottom:14px;
        border:1px solid rgba(255,255,255,0.06);
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

/* =========================================
   EXPORT REPORT
========================================= */

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        exportReport
    );

}

function exportReport() {

    const bills =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-bills"
            )
        ) || [];

    /* =========================
       CALCULATIONS
    ========================= */

    const uniqueCustomers =
        [...new Set(
            bills.map(
                bill => bill.phone
            )
        )];

    let revenue = 0;

    bills.forEach(bill => {

        revenue +=
            Number(bill.amount);

    });

    const rewards =
        Math.floor(revenue * 0.1);

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
        uniqueCustomers.length === 0
            ? 0
            : Math.floor(
                (repeatCustomers /
                    uniqueCustomers.length)
                * 100
            );

    /* =========================
       REPORT CONTENT
    ========================= */

    let report = `

======================================
        LOYALTYIQ REPORT
======================================

Total Customers :
${uniqueCustomers.length}

Total Revenue :
₹${revenue}

Total Rewards :
₹${rewards}

Retention Rate :
${retention}%

======================================
          RECENT BILLS
======================================

`;

    bills.forEach(bill => {

        report += `

Phone : ${bill.phone}

Amount : ₹${bill.amount}

Date : ${bill.date}

--------------------------------------

`;

    });

    /* =========================
       DOWNLOAD
    ========================= */

    const blob =
        new Blob(
            [report],
            {
                type: "text/plain"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "LoyaltyIQ-Report.txt";

    a.click();

    URL.revokeObjectURL(url);

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