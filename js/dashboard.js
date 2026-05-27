/* =========================================
   DASHBOARD — LOYALTYIQ
========================================= */

/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY = "loyaltyiq-bills";

/* =========================================
   LOAD DASHBOARD
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);

/* =========================================
   MAIN DASHBOARD
========================================= */

function loadDashboard() {

    /* GET BILLS */

    const bills =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        ) || [];

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

    /* =====================================
       CALCULATIONS
    ===================================== */

    const uniqueCustomers =
        [...new Set(
            bills.map(
                bill => bill.phone
            )
        )];

    const totalCustomers =
        uniqueCustomers.length;

    let totalRevenue = 0;

    let totalRewards = 0;

    bills.forEach(
        bill => {

            totalRevenue +=
                Number(
                    bill.amount
                );

            totalRewards +=
                Math.floor(

                    Number(bill.amount) *
                    (rewardPercent / 100)

                );

        }
    );

    /* =====================================
       RETENTION
    ===================================== */

    let repeatCustomers = 0;

    uniqueCustomers.forEach(
        phone => {

            const visits =
                bills.filter(
                    bill =>
                        bill.phone === phone
                );

            if (visits.length > 1) {

                repeatCustomers++;

            }

        }
    );

    const retention =
        totalCustomers === 0
            ? 0
            : Math.floor(

                (repeatCustomers /
                    totalCustomers) * 100

            );

    /* =====================================
       UPDATE UI
    ===================================== */

    document.getElementById(
        "customerCount"
    ).innerText =
        totalCustomers;

    document.getElementById(
        "revenueCount"
    ).innerText =
        `₹${totalRevenue.toLocaleString()}`;

    document.getElementById(
        "rewardCount"
    ).innerText =
        `₹${totalRewards.toLocaleString()}`;

    document.getElementById(
        "retentionCount"
    ).innerText =
        `${retention}%`;

    document.getElementById(
        "todayRevenue"
    ).innerText =
        `₹${totalRevenue.toLocaleString()}`;

    /* =====================================
       LOAD SECTIONS
    ===================================== */

    loadTopCustomers(
        bills,
        rewardPercent
    );

    loadRecentActivity(
        bills,
        rewardPercent
    );

}

/* =========================================
   TOP CUSTOMERS
========================================= */

function loadTopCustomers(
    bills,
    rewardPercent
) {

    const table =
        document.querySelector(
            "#topCustomersTable tbody"
        );

    /* EMPTY */

    if (bills.length === 0) {

        table.innerHTML = `

        <tr>

            <td
            colspan="3"
            style="
            text-align:center;
            padding:30px;
            color:var(--muted);
            ">

                No customer data available

            </td>

        </tr>

        `;

        return;

    }

    /* TOTALS */

    const customerTotals = {};

    bills.forEach(
        bill => {

            if (!customerTotals[bill.phone]) {

                customerTotals[bill.phone] = {

                    spend: 0,
                    rewards: 0

                };

            }

            customerTotals[bill.phone].spend +=
                Number(
                    bill.amount
                );

            customerTotals[bill.phone].rewards +=
                Math.floor(

                    Number(bill.amount) *
                    (rewardPercent / 100)

                );

        }
    );

    /* SORT */

    const sortedCustomers =
        Object.entries(
            customerTotals
        )

            .sort(
                (a, b) =>
                    b[1].spend -
                    a[1].spend
            )

            .slice(0, 5);

    /* RENDER */

    table.innerHTML = "";

    sortedCustomers.forEach(
        customer => {

            table.innerHTML += `

            <tr>

                <td>

                    ${customer[0]}

                </td>

                <td>

                    ₹${customer[1].spend.toLocaleString()}

                </td>

                <td>

                    ₹${customer[1].rewards.toLocaleString()}

                </td>

            </tr>

            `;

        }
    );

}

/* =========================================
   RECENT ACTIVITY
========================================= */

function loadRecentActivity(
    bills,
    rewardPercent
) {

    const container =
        document.getElementById(
            "recentActivity"
        );

    /* EMPTY */

    if (bills.length === 0) {

        container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <i class="ti ti-activity"></i>

            </div>

            <h3>

                No Recent Activity

            </h3>

            <p>

                Customer activity
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
                    b.createdAt -
                    a.createdAt
            )

            .slice(0, 6);

    /* RENDER */

    container.innerHTML = "";

    latestBills.forEach(
        bill => {

            const reward =
                Math.floor(

                    Number(bill.amount) *
                    (rewardPercent / 100)

                );

            container.innerHTML += `

            <div class="activity-item">

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

                        ₹${Number(
                bill.amount
            ).toLocaleString()}

                    </div>

                    <div class="activity-time">

                        Reward ₹${reward}

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
                STORAGE_KEY
            )
        ) || [];

    if (bills.length === 0) {

        showToast(
            "No data to export",
            "error"
        );

        return;

    }

    let report =

        `LOYALTYIQ REPORT

==============================

`;

    bills.forEach(
        bill => {

            report +=

                `Phone : ${bill.phone}
Amount : ₹${bill.amount}
Date : ${bill.date}

--------------------------

`;

        }
    );

    const blob =
        new Blob(
            [report],
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
        "loyaltyiq-report.txt";

    link.click();

    showToast(
        "Report exported successfully",
        "success"
    );

}

/* =========================================
   REFRESH
========================================= */

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        () => {

            loadDashboard();

            showToast(
                "Dashboard refreshed",
                "success"
            );

        }
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