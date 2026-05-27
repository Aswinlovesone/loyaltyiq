const saveBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

/* =========================================
   LOAD SETTINGS
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    loadSettings
);

function loadSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                "loyaltyiq-settings"
            )
        );

    if (!settings) return;

    document.getElementById(
        "businessName"
    ).value =
        settings.businessName || "";

    document.getElementById(
        "businessEmail"
    ).value =
        settings.businessEmail || "";

    document.getElementById(
        "businessPhone"
    ).value =
        settings.businessPhone || "";

    document.getElementById(
        "rewardPercent"
    ).value =
        settings.rewardPercent || "";

    document.getElementById(
        "currency"
    ).value =
        settings.currency || "";

    document.getElementById(
        "minRedeem"
    ).value =
        settings.minRedeem || "";

    document.getElementById(
        "emailNotify"
    ).checked =
        settings.emailNotify || false;

    document.getElementById(
        "smsNotify"
    ).checked =
        settings.smsNotify || false;

    document.getElementById(
        "rewardNotify"
    ).checked =
        settings.rewardNotify || false;

}

/* =========================================
   SAVE SETTINGS
========================================= */

saveBtn.addEventListener(
    "click",
    () => {

        const settings = {

            businessName:
                document.getElementById(
                    "businessName"
                ).value,

            businessEmail:
                document.getElementById(
                    "businessEmail"
                ).value,

            businessPhone:
                document.getElementById(
                    "businessPhone"
                ).value,

            rewardPercent:
                document.getElementById(
                    "rewardPercent"
                ).value,

            currency:
                document.getElementById(
                    "currency"
                ).value,

            minRedeem:
                document.getElementById(
                    "minRedeem"
                ).value,

            emailNotify:
                document.getElementById(
                    "emailNotify"
                ).checked,

            smsNotify:
                document.getElementById(
                    "smsNotify"
                ).checked,

            rewardNotify:
                document.getElementById(
                    "rewardNotify"
                ).checked

        };

        localStorage.setItem(
            "loyaltyiq-settings",
            JSON.stringify(settings)
        );

        showToast(
            "Settings saved successfully",
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