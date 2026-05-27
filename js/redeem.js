/* =========================================
   REDEEM REWARDS — LOYALTYIQ
========================================= */

/* =========================================
   ELEMENTS
========================================= */

const loadRewardBtn =
    document.getElementById(
        "loadRewardBtn"
    );

const rewardResult =
    document.getElementById(
        "rewardResult"
    );

/* =========================================
   STORAGE KEY
========================================= */

const STORAGE_KEY =
    "loyaltyiq-bills";

/* =========================================
   LOAD REWARDS
========================================= */

loadRewardBtn.addEventListener(
    "click",
    () => {

        const phone =
            document.getElementById(
                "redeemPhone"
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

        /* FILTER CUSTOMER */

        const customerBills =
            bills.filter(
                bill =>
                    bill.phone === phone
            );

        /* NOT FOUND */

        if (customerBills.length === 0) {

            rewardResult.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="ti ti-user-off"></i>

                </div>

                <h3>

                    Customer Not Found

                </h3>

                <p>

                    No rewards available
                    for this customer.

                </p>

            </div>

            `;

            showToast(
                "Customer not found",
                "error"
            );

            return;

        }

        /* TOTAL SPENT */

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

        /* REWARDS */

        const rewards =
            Math.floor(

                totalSpent *
                (rewardPercent / 100)

            );

        /* TOTAL VISITS */

        const totalVisits =
            customerBills.length;

        /* RENDER */

        rewardResult.innerHTML = `

        <div class="profile-box">

            <!-- TOP -->

            <div class="profile-head">

                <div class="avatar">

                    ${phone.slice(0, 2)}

                </div>

                <div>

                    <div class="profile-phone">

                        ${phone}

                    </div>

                    <div class="badge">

                        Reward Available

                    </div>

                </div>

            </div>

            <!-- STATS -->

            <div class="stat-grid">

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

                        Visits

                    </div>

                    <div class="stat-val">

                        ${totalVisits}

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

                <div class="stat-item">

                    <div class="stat-lbl">

                        Redeemable

                    </div>

                    <div class="stat-val">

                        ₹${rewards}

                    </div>

                </div>

            </div>

            <!-- BUTTON -->

            <button
            id="redeemBtn"
            class="btn-primary"
            style="margin-top:24px;width:100%;">

                <i class="ti ti-gift"></i>

                Redeem ₹${rewards}

            </button>

        </div>

        `;

        /* BUTTON */

        const redeemBtn =
            document.getElementById(
                "redeemBtn"
            );

        redeemBtn.addEventListener(
            "click",
            () => {

                showToast(
                    `₹${rewards} redeemed successfully`,
                    "success"
                );

            }
        );

    }
);

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