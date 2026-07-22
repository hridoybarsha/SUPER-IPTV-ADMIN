"use strict";

/* =========================================================
SUPER IPTV MANAGEMENT PANEL
PROFESSIONAL COMPLETE SCRIPT.JS
========================================================= */

/* =========================================================
PLAN PRICES
========================================================= */

const PLAN_PRICES = {
"1 Month": 200,
"3 Months": 600,
"6 Months": 1150,
"12 Months": 2000
};

/* =========================================================
STORAGE KEYS
========================================================= */

const STORAGE = {
USERS: "SUPER_IPTV_USERS",
PAYMENTS: "SUPER_IPTV_PAYMENTS",
SETTINGS: "SUPER_IPTV_SETTINGS",
TEMPLATE: "SUPER_IPTV_TEMPLATE"
};

/* =========================================================
DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
upi: "6289033804@ptsbi",
contact: "6289033804",
portal: "http://geoiptv.one:8880"
};

/* =========================================================
DEFAULT WHATSAPP TEMPLATE
========================================================= */

const DEFAULT_TEMPLATE = `━━━━━━━━━━━━━━━━━━━━━━
SUPER IPTV
ACCOUNT DETAILS
━━━━━━━━━━━━━━━━━━━━━━

Hello {{NAME}} 👋

Your IPTV account has been successfully created.

🔐 LOGIN DETAILS

Username : {{USERNAME}}
Password : {{PASSWORD}}
Portal URL : {{PORTAL_URL}}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION

Plan       : {{PLAN}}
Amount     : ₹{{AMOUNT}}
Valid Upto : {{EXPIRY}}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT

UPI ID : {{UPI_ID}}
Contact : {{CONTACT}}

Payment Status : {{PAYMENT_STATUS}}

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT

Please complete your payment and send the payment screenshot.

Thank you for choosing SUPER IPTV.

━━━━━━━━━━━━━━━━━━━━━━`;

/* =========================================================
GLOBAL DATABASE
========================================================= */

let users = [];
let payments = [];
let settings = {};
let messageTemplate = DEFAULT_TEMPLATE;

/* =========================================================
GET ELEMENT
========================================================= */

function getElement(id) {
return document.getElementById(id);
}

/* =========================================================
LOAD DATABASE
========================================================= */

function loadDatabase() {

try {

    const savedUsers =
        localStorage.getItem(STORAGE.USERS);

    const savedPayments =
        localStorage.getItem(STORAGE.PAYMENTS);

    const savedSettings =
        localStorage.getItem(STORAGE.SETTINGS);

    const savedTemplate =
        localStorage.getItem(STORAGE.TEMPLATE);


    users = savedUsers
        ? JSON.parse(savedUsers)
        : [];


    payments = savedPayments
        ? JSON.parse(savedPayments)
        : [];


    settings = savedSettings
        ? {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(savedSettings)
        }
        : {
            ...DEFAULT_SETTINGS
        };


    messageTemplate =
        savedTemplate ||
        DEFAULT_TEMPLATE;


    if (!Array.isArray(users)) {
        users = [];
    }


    if (!Array.isArray(payments)) {
        payments = [];
    }


} catch (error) {

    console.error(
        "Database Load Error:",
        error
    );


    users = [];

    payments = [];

    settings = {
        ...DEFAULT_SETTINGS
    };

    messageTemplate =
        DEFAULT_TEMPLATE;

}

}

/* =========================================================
SAVE DATABASE
========================================================= */

function saveDatabase() {

try {

    localStorage.setItem(
        STORAGE.USERS,
        JSON.stringify(users)
    );


    localStorage.setItem(
        STORAGE.PAYMENTS,
        JSON.stringify(payments)
    );


} catch (error) {

    console.error(
        "Database Save Error:",
        error
    );

    alert(
        "Data save failed!"
    );

}

}

/* =========================================================
SAVE SETTINGS
========================================================= */

function saveSettingsData() {

try {

    localStorage.setItem(
        STORAGE.SETTINGS,
        JSON.stringify(settings)
    );

} catch (error) {

    console.error(
        "Settings Save Error:",
        error
    );

}

}

/* =========================================================
SAVE MESSAGE TEMPLATE
========================================================= */

function saveTemplateData() {

localStorage.setItem(
    STORAGE.TEMPLATE,
    messageTemplate
);

}

/* =========================================================
NAVIGATION
========================================================= */

function setupNavigation() {

const buttons =
    document.querySelectorAll(
        ".menu-btn"
    );


buttons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const page =
                    this.dataset.page;


                document
                    .querySelectorAll(
                        ".page"
                    )
                    .forEach(
                        function(section) {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                buttons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                const target =
                    getElement(page);


                if (!target) {
                    return;
                }


                target.classList.add(
                    "active"
                );


                this.classList.add(
                    "active"
                );


                refreshAll();


                if (
                    page ===
                    "settings"
                ) {

                    loadSettings();

                }

            }
        );

    }
);

}

/* =========================================================
REFRESH ALL
========================================================= */

function refreshAll() {

updateDashboard();

renderUsers();

renderPayments();

updatePaymentSummary();

updateReports();

}

/* =========================================================
CALCULATE EXPIRY
========================================================= */

function calculateExpiry(plan) {

const date =
    new Date();


if (plan === "1 Month") {

    date.setMonth(
        date.getMonth() + 1
    );

}

else if (plan === "3 Months") {

    date.setMonth(
        date.getMonth() + 3
    );

}

else if (plan === "6 Months") {

    date.setMonth(
        date.getMonth() + 6
    );

}

else if (plan === "12 Months") {

    date.setMonth(
        date.getMonth() + 12
    );

}


return date;

}

/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(date) {

if (!date) {
    return "-";
}


const d =
    new Date(date);


if (isNaN(d.getTime())) {
    return "-";
}


return d.toLocaleDateString(
    "en-IN",
    {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }
);

}

/* =========================================================
CHECK ACTIVE USER
========================================================= */

function isUserActive(user) {

if (!user.expiry) {
    return false;
}


return (
    new Date(
        user.expiry
    ).getTime()
    >=
    new Date().getTime()
);

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(value) {

return String(
    value ?? ""
)
.replace(
    /&/g,
    "&amp;"
)
.replace(
    /</g,
    "&lt;"
)
.replace(
    />/g,
    "&gt;"
)
.replace(
    /"/g,
    "&quot;"
)
.replace(
    /'/g,
    "&#039;"
);

}

/* =========================================================
QR GENERATOR
========================================================= */

function generateQR(plan) {

const qrContainer =
    getElement("qrcode");

const qrPlan =
    getElement("qrPlan");

const amountInput =
    getElement("amount");


if (!qrContainer) {
    return;
}


qrContainer.innerHTML = "";


if (!plan) {

    if (amountInput) {
        amountInput.value = "";
    }


    if (qrPlan) {

        qrPlan.innerHTML =
            "Select a plan to generate QR";

    }

    return;

}


const amount =
    PLAN_PRICES[plan];


if (!amount) {
    return;
}


if (amountInput) {

    amountInput.value =
        amount;

}


const upiLink =
    "upi://pay" +
    "?pa=" +
    encodeURIComponent(
        settings.upi
    ) +
    "&pn=" +
    encodeURIComponent(
        "SUPER IPTV"
    ) +
    "&am=" +
    encodeURIComponent(
        amount
    ) +
    "&cu=INR" +
    "&tn=" +
    encodeURIComponent(
        "SUPER IPTV - " +
        plan
    );


if (
    typeof QRCode ===
    "undefined"
) {

    if (qrPlan) {

        qrPlan.innerHTML =
            "QR Library not loaded.";

    }

    return;

}


try {

    new QRCode(
        qrContainer,
        {
            text:
                upiLink,

            width:
                220,

            height:
                220,

            colorDark:
                "#000000",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );


    if (qrPlan) {

        qrPlan.innerHTML =
            "<strong>" +
            escapeHTML(plan) +
            "</strong>" +
            "<br><br>" +
            "Scan to Pay ₹" +
            amount +
            "<br>" +
            "UPI ID: " +
            escapeHTML(
                settings.upi
            );

    }


} catch (error) {

    console.error(
        "QR Error:",
        error
    );

}

}

/* =========================================================
DOWNLOAD CURRENT QR
========================================================= */

function downloadCurrentQR() {

const qrContainer =
    getElement("qrcode");


if (!qrContainer) {
    return;
}


const canvas =
    qrContainer.querySelector(
        "canvas"
    );


const image =
    qrContainer.querySelector(
        "img"
    );


if (canvas) {

    const link =
        document.createElement(
            "a"
        );


    link.download =
        "SUPER-IPTV-Payment-QR.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

    return;

}


if (image) {

    const link =
        document.createElement(
            "a"
        );


    link.download =
        "SUPER-IPTV-Payment-QR.png";


    link.href =
        image.src;


    link.click();

    return;

}


alert(
    "Please select a plan first."
);

}

/* =========================================================
PLAN CHANGE
========================================================= */

function setupPlanChange() {

const plan =
    getElement("plan");


if (!plan) {
    return;
}


plan.addEventListener(
    "change",
    function() {

        generateQR(
            this.value
        );

    }
);

}

/* =========================================================
ADD CUSTOMER
========================================================= */

function setupUserForm() {

const form =
    getElement("userForm");


if (!form) {
    return;
}


form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            getElement(
                "customerName"
            ).value.trim();


        const phone =
            getElement(
                "phone"
            ).value.trim();


        const username =
            getElement(
                "username"
            ).value.trim();


        const password =
            getElement(
                "password"
            ).value.trim();


        const portalUrl =
            getElement(
                "portalUrl"
            ).value.trim();


        const plan =
            getElement(
                "plan"
            ).value;


        const paymentStatus =
            getElement(
                "paymentStatus"
            ).value;


        if (
            !name ||
            !phone ||
            !username ||
            !password ||
            !portalUrl ||
            !plan
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        const duplicate =
            users.some(
                function(user) {

                    return (
                        String(
                            user.username
                        )
                        .toLowerCase()
                        ===
                        username.toLowerCase()
                    );

                }
            );


        if (duplicate) {

            alert(
                "This username already exists."
            );

            return;

        }


        const amount =
            PLAN_PRICES[plan];


        const expiry =
            calculateExpiry(
                plan
            );


        const userId =
            Date.now();


        const user = {

            id:
                userId,

            name:
                name,

            phone:
                phone,

            username:
                username,

            password:
                password,

            portalUrl:
                portalUrl,

            plan:
                plan,

            amount:
                amount,

            paymentStatus:
                paymentStatus,

            createdAt:
                new Date()
                .toISOString(),

            expiry:
                expiry
                .toISOString()

        };


        users.push(
            user
        );


        payments.push({

            id:
                Date.now() + 1,

            userId:
                userId,

            name:
                name,

            phone:
                phone,

            plan:
                plan,

            amount:
                amount,

            status:
                paymentStatus,

            date:
                new Date()
                .toISOString()

        });


        saveDatabase();


        refreshAll();


        alert(
            "Customer Added Successfully!"
        );


        form.reset();


        getElement(
            "portalUrl"
        ).value =
            settings.portal;


        generateQR("");

    }
);

}

/* =========================================================
RENDER USERS
========================================================= */

function renderUsers() {

const table =
    getElement(
        "usersTable"
    );


if (!table) {
    return;
}


const searchInput =
    getElement(
        "searchUser"
    );


const search =
    searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


const filtered =
    users.filter(
        function(user) {

            return (

                String(
                    user.name || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.phone || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.username || ""
                )
                .toLowerCase()
                .includes(search)

            );

        }
    );


if (
    filtered.length ===
    0
) {

    table.innerHTML = `

    <tr>

        <td colspan="9">
            No Customers Found
        </td>

    </tr>

    `;

    return;

}


table.innerHTML =

    filtered
    .slice()
    .reverse()
    .map(
        function(user) {

            const active =
                isUserActive(
                    user
                );


            return `

            <tr>

                <td>
                    ${escapeHTML(
                        user.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.phone
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.username
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.password
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.plan
                    )}
                </td>

                <td>
                    ₹${Number(
                        user.amount || 0
                    )}
                </td>

                <td>

                    <span class="status ${
                        active
                        ? "active-status"
                        : "expired-status"
                    }">

                        ${
                            active
                            ? "Active"
                            : "Expired"
                        }

                    </span>

                </td>

                <td>
                    ${formatDate(
                        user.expiry
                    )}
                </td>

                <td>

                    <button
                        class="action-btn whatsapp-btn"
                        onclick="sendWhatsApp(${user.id})">

                        📱 WhatsApp

                    </button>


                    <button
                        class="action-btn copy-btn"
                        onclick="copyMessage(${user.id})">

                        📋 Copy

                    </button>


                    <button
                        class="action-btn primary-btn"
                        onclick="downloadUserQR(${user.id})">

                        📥 QR

                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteUser(${user.id})">

                        🗑️ Delete

                    </button>

                </td>

            </tr>

            `;

        }
    )
    .join("");

}

/* =========================================================
SEARCH
========================================================= */

function setupSearch() {

const search =
    getElement(
        "searchUser"
    );


if (!search) {
    return;
}


search.addEventListener(
    "input",
    function() {

        renderUsers();

    }
);

}

/* =========================================================
CREATE WHATSAPP MESSAGE
========================================================= */

function createMessage(user) {

let message =
    messageTemplate;


const replacements = {

    "{{NAME}}":
        user.name,

    "{{USERNAME}}":
        user.username,

    "{{PASSWORD}}":
        user.password,

    "{{PORTAL_URL}}":
        user.portalUrl,

    "{{PLAN}}":
        user.plan,

    "{{AMOUNT}}":
        user.amount,

    "{{EXPIRY}}":
        formatDate(
            user.expiry
        ),

    "{{UPI_ID}}":
        settings.upi,

    "{{CONTACT}}":
        settings.contact,

    "{{PAYMENT_STATUS}}":
        user.paymentStatus

};


Object.keys(
    replacements
).forEach(
    function(key) {

        message =
            message.replaceAll(
                key,
                String(
                    replacements[key]
                )
            );

    }
);


return message;

}

/* =========================================================
SEND WHATSAPP
========================================================= */

function sendWhatsApp(id) {

const user =
    users.find(
        function(item) {

            return String(
                item.id
            ) ===
            String(id);

        }
    );


if (!user) {

    alert(
        "Customer not found."
    );

    return;

}


const message =
    createMessage(
        user
    );


const phone =
    String(
        user.phone
    )
    .replace(
        /\D/g,
        ""
    );


if (!phone) {

    alert(
        "Invalid phone number."
    );

    return;

}


const url =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(
        message
    );


window.open(
    url,
    "_blank"
);

}

/* =========================================================
COPY MESSAGE
========================================================= */

function copyMessage(id) {

const user =
    users.find(
        function(item) {

            return String(
                item.id
            ) ===
            String(id);

        }
    );


if (!user) {

    alert(
        "Customer not found."
    );

    return;

}


const message =
    createMessage(
        user
    );


if (
    navigator.clipboard
) {

    navigator.clipboard
        .writeText(
            message
        )
        .then(
            function() {

                alert(
                    "Message copied successfully!"
                );

            }
        )
        .catch(
            function() {

                fallbackCopy(
                    message
                );

            }
        );

}

else {

    fallbackCopy(
        message
    );

}

}

/* =========================================================
FALLBACK COPY
========================================================= */

function fallbackCopy(text) {

const textarea =
    document.createElement(
        "textarea"
    );


textarea.value =
    text;


document.body.appendChild(
    textarea
);


textarea.select();


try {

    document.execCommand(
        "copy"
    );

    alert(
        "Message copied!"
    );

} catch (error) {

    alert(
        "Copy failed."
    );

}


textarea.remove();

}

/* =========================================================
DELETE USER
========================================================= */

function deleteUser(id) {

const user =
    users.find(
        function(item) {

            return String(
                item.id
            ) ===
            String(id);

        }
    );


if (!user) {
    return;
}


const confirmDelete =
    confirm(
        "Delete customer " +
        user.name +
        "?"
    );


if (!confirmDelete) {
    return;
}


users =
    users.filter(
        function(item) {

            return String(
                item.id
            ) !==
            String(id);

        }
    );


payments =
    payments.filter(
        function(payment) {

            return String(
                payment.userId
            ) !==
            String(id);

        }
    );


saveDatabase();


refreshAll();


alert(
    "Customer deleted successfully."
);

}

/* =========================================================
RENDER PAYMENTS
========================================================= */

function renderPayments() {

const table =
    getElement(
        "paymentsTable"
    );


if (!table) {
    return;
}


if (
    payments.length ===
    0
) {

    table.innerHTML = `

    <tr>

        <td colspan="6">
            No Payments Yet
        </td>

    </tr>

    `;

    return;

}


table.innerHTML =

    payments
    .slice()
    .reverse()
    .map(
        function(payment) {

            const statusClass =
                payment.status ===
                "Paid"
                ? "payment-paid"
                : "payment-pending";


            return `

            <tr>

                <td>
                    ${escapeHTML(
                        payment.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        payment.phone
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        payment.plan
                    )}
                </td>

                <td>
                    ₹${Number(
                        payment.amount || 0
                    )}
                </td>

                <td>

                    <span class="${statusClass}">

                        ${escapeHTML(
                            payment.status
                        )}

                    </span>

                </td>

                <td>
                    ${formatDate(
                        payment.date
                    )}
                </td>

            </tr>

            `;

        }
    )
    .join("");

}

/* =========================================================
PAYMENT SUMMARY
========================================================= */

function updatePaymentSummary() {

const total =
    payments.length;


const paid =
    payments.filter(
        function(payment) {

            return payment.status ===
                "Paid";

        }
    );


const pending =
    payments.filter(
        function(payment) {

            return payment.status ===
                "Pending";

        }
    );


const revenue =
    paid.reduce(
        function(sum, payment) {

            return sum +
                Number(
                    payment.amount || 0
                );

        },
        0
    );


if (
    getElement(
        "totalPayments"
    )
) {

    getElement(
        "totalPayments"
    ).textContent =
        total;

}


if (
    getElement(
        "paidPayments"
    )
) {

    getElement(
        "paidPayments"
    ).textContent =
        paid.length;

}


if (
    getElement(
        "pendingPayments"
    )
) {

    getElement(
        "pendingPayments"
    ).textContent =
        pending.length;

}


if (
    getElement(
        "paymentRevenue"
    )
) {

    getElement(
        "paymentRevenue"
    ).textContent =
        "₹" +
        revenue;

}

}

/* =========================================================
DASHBOARD
========================================================= */

function updateDashboard() {

const totalUsers =
    users.length;


const activeUsers =
    users.filter(
        isUserActive
    ).length;


const expiredUsers =
    totalUsers -
    activeUsers;


const totalRevenue =
    payments
    .filter(
        function(payment) {

            return payment.status ===
                "Paid";

        }
    )
    .reduce(
        function(sum, payment) {

            return sum +
                Number(
                    payment.amount || 0
                );

        },
        0
    );


if (
    getElement(
        "totalUsers"
    )
) {

    getElement(
        "totalUsers"
    ).textContent =
        totalUsers;

}


if (
    getElement(
        "activeUsers"
    )
) {

    getElement(
        "activeUsers"
    ).textContent =
        activeUsers;

}


if (
    getElement(
        "expiredUsers"
    )
) {

    getElement(
        "expiredUsers"
    ).textContent =
        expiredUsers;

}


if (
    getElement(
        "totalRevenue"
    )
) {

    getElement(
        "totalRevenue"
    ).textContent =
        "₹" +
        totalRevenue;

}


renderRecentUsers();

}

/* =========================================================
RECENT USERS
========================================================= */

function renderRecentUsers() {

const table =
    getElement(
        "recentUsers"
    );


if (!table) {
    return;
}


const recent =
    users
    .slice()
    .reverse()
    .slice(
        0,
        5
    );


if (
    recent.length ===
    0
) {

    table.innerHTML = `

    <tr>

        <td colspan="5">
            No Users Yet
        </td>

    </tr>

    `;

    return;

}


table.innerHTML =

    recent
    .map(
        function(user) {

            const active =
                isUserActive(
                    user
                );


            return `

            <tr>

                <td>
                    ${escapeHTML(
                        user.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.phone
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.plan
                    )}
                </td>

                <td>

                    <span class="status ${
                        active
                        ? "active-status"
                        : "expired-status"
                    }">

                        ${
                            active
                            ? "Active"
                            : "Expired"
                        }

                    </span>

                </td>

                <td>
                    ${formatDate(
                        user.expiry
                    )}
                </td>

            </tr>

            `;

        }
    )
    .join("");

}

/* =========================================================
REPORTS
========================================================= */

function updateReports() {

const paid =
    payments.filter(
        function(payment) {

            return payment.status ===
                "Paid";

        }
    );


const pending =
    payments.filter(
        function(payment) {

            return payment.status ===
                "Pending";

        }
    );


const revenue =
    paid.reduce(
        function(sum, payment) {

            return sum +
                Number(
                    payment.amount || 0
                );

        },
        0
    );


if (
    getElement(
        "reportRevenue"
    )
) {

    getElement(
        "reportRevenue"
    ).textContent =
        "₹" +
        revenue;

}


if (
    getElement(
        "paidCount"
    )
) {

    getElement(
        "paidCount"
    ).textContent =
        paid.length;

}


if (
    getElement(
        "pendingCount"
    )
) {

    getElement(
        "pendingCount"
    ).textContent =
        pending.length;

}

}

/* =========================================================
LOAD SETTINGS
========================================================= */

function loadSettings() {

const upi =
    getElement(
        "settingUpi"
    );


const contact =
    getElement(
        "settingContact"
    );


const portal =
    getElement(
        "settingPortal"
    );


const template =
    getElement(
        "messageTemplate"
    );


if (upi) {
    upi.value =
        settings.upi || "";
}


if (contact) {
    contact.value =
        settings.contact || "";
}


if (portal) {
    portal.value =
        settings.portal || "";
}


if (template) {
    template.value =
        messageTemplate;
}

}

/* =========================================================
SAVE SETTINGS BUTTON
========================================================= */

function setupSettings() {

const saveButton =
    getElement(
        "saveSettings"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        function() {

            settings.upi =
                getElement(
                    "settingUpi"
                ).value.trim();


            settings.contact =
                getElement(
                    "settingContact"
                ).value.trim();


            settings.portal =
                getElement(
                    "settingPortal"
                ).value.trim();


            saveSettingsData();


            const portalInput =
                getElement(
                    "portalUrl"
                );


            if (portalInput) {

                portalInput.value =
                    settings.portal;

            }


            alert(
                "Settings saved successfully!"
            );


            const plan =
                getElement(
                    "plan"
                );


            if (
                plan &&
                plan.value
            ) {

                generateQR(
                    plan.value
                );

            }

        }
    );

}


const saveTemplate =
    getElement(
        "saveTemplate"
    );


if (saveTemplate) {

    saveTemplate.addEventListener(
        "click",
        function() {

            messageTemplate =
                getElement(
                    "messageTemplate"
                ).value;


            saveTemplateData();


            alert(
                "WhatsApp template saved successfully!"
            );

        }
    );

}

}

/* =========================================================
DELETE ALL DATA
========================================================= */

function setupDeleteAll() {

const button =
    getElement(
        "deleteAll"
    );


if (!button) {
    return;
}


button.addEventListener(
    "click",
    function() {

        const confirmation =
            confirm(
                "WARNING!\n\nThis will permanently delete ALL users and payments.\n\nContinue?"
            );


        if (!confirmation) {
            return;
        }


        users = [];

        payments = [];


        saveDatabase();


        refreshAll();


        alert(
            "All users and payments deleted."
        );

    }
);

}

/* =========================================================
DOWNLOAD USER QR
========================================================= */

function downloadUserQR(id) {

const user =
    users.find(
        function(item) {

            return String(
                item.id
            ) ===
            String(id);

        }
    );


if (!user) {

    alert(
        "Customer not found."
    );

    return;

}


if (
    typeof QRCode ===
    "undefined"
) {

    alert(
        "QR Library not loaded."
    );

    return;

}


const qrBox =
    document.createElement(
        "div"
    );


qrBox.style.position =
    "fixed";

qrBox.style.left =
    "-9999px";


document.body.appendChild(
    qrBox
);


const upiLink =
    "upi://pay" +
    "?pa=" +
    encodeURIComponent(
        settings.upi
    ) +
    "&pn=" +
    encodeURIComponent(
        "SUPER IPTV"
    ) +
    "&am=" +
    encodeURIComponent(
        user.amount
    ) +
    "&cu=INR";


new QRCode(
    qrBox,
    {
        text:
            upiLink,

        width:
            300,

        height:
            300,

        correctLevel:
            QRCode.CorrectLevel.H
    }
);


setTimeout(
    function() {

        const canvas =
            qrBox.querySelector(
                "canvas"
            );


        if (canvas) {

            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "SUPER-IPTV-" +
                user.username +
                "-QR.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }


        qrBox.remove();

    },
    500
);

}

/* =========================================================
INITIALIZE APPLICATION
========================================================= */

function initializeApp() {

loadDatabase();

setupNavigation();

setupPlanChange();

setupUserForm();

setupSearch();

setupSettings();

setupDeleteAll();

refreshAll();

loadSettings();


const downloadQR =
    getElement(
        "downloadQR"
    );


if (downloadQR) {

    downloadQR.addEventListener(
        "click",
        downloadCurrentQR
    );

}

}

/* =========================================================
START APP
========================================================= */

if (
document.readyState ===
"loading"
) {

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

} else {

initializeApp();

}

/* =========================================================
GLOBAL FUNCTIONS
Required for inline onclick buttons
========================================================= */

window.sendWhatsApp =
sendWhatsApp;

window.copyMessage =
copyMessage;

window.deleteUser =
deleteUser;

window.downloadUserQR =
downloadUserQR;