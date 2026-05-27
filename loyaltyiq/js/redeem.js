const loadRewardBtn =
    document.getElementById(
        "loadRewardBtn"
    );

const rewardResult =
    document.getElementById(
        "rewardResult"
    );

/* =========================================
   LOAD REWARDS
========================================= */

loadRewardBtn.addEventListener(
    "click",
    () => {

        const phone =
            document.getElementById(
                "redeemPhone"
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

            rewardResult.innerHTML = `

        <div class="card">

            <p style="color:#ef4444;">

            Customer not found.

            </p>

        </div>

        `;

            return;
        }

        let totalSpent = 0;

        customerBills.forEach(bill => {

            totalSpent +=
                Number(bill.amount);

        });

        const rewards =
            Math.floor(totalSpent * 0.1);

        rewardResult.innerHTML = `

    <div class="profile-box">

        <div class="profile-head">

            <div class="avatar">

                ${phone.slice(0, 2)}

            </div>

            <div>

                <div class="pname">

                    Customer Rewards

                </div>

                <div class="badge">

                    Redeem Available

                </div>

            </div>

        </div>

        <div class="stat-grid">

            <div class="stat-item">

                <div class="stat-lbl">

                    Total Rewards

                </div>

                <div class="stat-val">

                    ₹${rewards}

                </div>

            </div>

        </div>

        <button
        id="redeemBtn"
        class="btn-primary"
        style="margin-top:24px;">

            <i class="ti ti-check"></i>

            Redeem ₹${rewards}

        </button>

    </div>

    `;

        /* =========================
           REDEEM BUTTON
        ========================= */

        const redeemBtn =
            document.getElementById(
                "redeemBtn"
            );

        redeemBtn.addEventListener(
            "click",
            () => {

                rewardResult.innerHTML = `

        <div class="card">

            <h2 style="
            color:#10b981;
            margin-bottom:12px;
            ">

            Reward Redeemed Successfully 🎉

            </h2>

            <p style="
            color:var(--muted);
            ">

            ₹${rewards} reward redeemed
            for customer ${phone}

            </p>

        </div>

        `;

                showToast(
                    "Reward redeemed",
                    "success"
                );

            });

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