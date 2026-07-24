"use strict";

/* =========================================================
   SUPER IPTV MANAGEMENT PANEL
   FINAL SCRIPT.JS
   Dashboard + Users + Payments + Reports + Settings
   QR + WhatsApp + Copy + Search + LocalStorage
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
    SERVICE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━

Hello {{NAME}} 👋

Your IPTV account details are below.

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

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT

Please complete your payment and send the payment screenshot.

Thank you for choosing SUPER IPTV.

━━━━━━━━━━━━━━━━━━━━━━`;


/* =========================================================
   DATABASE
========================================================= */

let users = [];
let payments = [];

let settings = {
    ...DEFAULT_SETTINGS
};

let messageTemplate = DEFAULT_TEMPLATE;


/* =========================================================
   DOM HELPER
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
            localStorage.getItem("SUPER_IPTV_USERS");

        const savedPayments =
            localStorage.getItem("SUPER_IPTV_PAYMENTS");

        const savedSettings =
            localStorage.getItem("SUPER_IPTV_SETTINGS");

        const savedTemplate =
            localStorage.getItem("SUPER_IPTV_TEMPLATE");


        users = savedUsers
            ? JSON.parse(savedUsers)
            : [];


        payments = savedPayments
            ? JSON.parse(savedPayments)
            : [];


        if (!Array.isArray(users)) {
            users = [];
        }


        if (!Array.isArray(payments)) {
            payments = [];
        }


        if (savedSettings) {

            const parsedSettings =
                JSON.parse(savedSettings);

            settings = {
                ...DEFAULT_SETTINGS,
                ...parsedSettings
            };

        } else {

            settings = {
                ...DEFAULT_SETTINGS
            };

        }


        messageTemplate =
            savedTemplate ||
            DEFAULT_TEMPLATE;


    } catch (error) {

        console.error(
            "Load Error:",
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
            "SUPER_IPTV_USERS",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "SUPER_IPTV_PAYMENTS",
            JSON.stringify(payments)
        );

        localStorage.setItem(
            "SUPER_IPTV_SETTINGS",
            JSON.stringify(settings)
        );

        localStorage.setItem(
            "SUPER_IPTV_TEMPLATE",
            messageTemplate
        );

    } catch (error) {

        console.error(
            "Save Error:",
            error
        );

        alert(
            "Data save failed!"
        );

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   DATE CALCULATOR
========================================================= */

function calculateExpiry(plan) {

    const date =
        new Date();

    const months = {

        "1 Month": 1,

        "3 Months": 3,

        "6 Months": 6,

        "12 Months": 12

    };

    if (months[plan]) {

        date.setMonth(
            date.getMonth() +
            months[plan]
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

    if (
        isNaN(
            d.getTime()
        )
    ) {

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
   USER STATUS
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
                        this.getAttribute(
                            "data-page"
                        );


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


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


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

            const amount =
                PLAN_PRICES[
                    this.value
                ];

            const amountInput =
                getElement("amount");

            if (amountInput) {

                amountInput.value =
                    amount || "";

            }

            generateQR(
                this.value
            );

        }
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

            amountInput.value =
                "";

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


    let url = "";


    if (canvas) {

        url =
            canvas.toDataURL(
                "image/png"
            );

    }

    else if (image) {

        url =
            image.src;

    }


    if (!url) {

        alert(
            "Please select a plan first."
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "SUPER-IPTV-Payment-QR.png";

    link.href =
        url;


    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

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


            const amount =
                PLAN_PRICES[plan];


            if (!amount) {

                alert(
                    "Please select a valid plan."
                );

                return;

            }


            const duplicate =
                users.some(
                    function(user) {

                        return (
                            String(
                                user.username
                            ).toLowerCase()
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


            const now =
                new Date();


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
                    now.toISOString(),

                expiry:
                    expiry.toISOString()

            };


            users.push(
                user
            );


            const payment = {

                id:
                    userId + 1,

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
                    now.toISOString()

            };


            payments.push(
                payment
            );


            saveDatabase();


            refreshAll();


            alert(
                "Customer Added Successfully!"
            );


            form.reset();


            const portalInput =
                getElement(
                    "portalUrl"
                );


            if (portalInput) {

                portalInput.value =
                    settings.portal;

            }


            const amountInput =
                getElement(
                    "amount"
                );


            if (amountInput) {

                amountInput.value =
                    "";

            }


            generateQR(
                ""
            );

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
                                onclick="sendWhatsApp('${user.id}')"
                            >
                                📱 WhatsApp
                            </button>

                            <button
                                class="action-btn copy-btn"
                                onclick="copyMessage('${user.id}')"
                            >
                                📋 Copy
                            </button>

                            <button
                                class="action-btn primary-btn"
                                onclick="downloadUserQR('${user.id}')"
                            >
                                📥 QR
                            </button>

                            <button
                                class="action-btn delete-btn"
                                onclick="deleteUser('${user.id}')"
                            >
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
            user.name || "",

        "{{USERNAME}}":
            user.username || "",

        "{{PASSWORD}}":
            user.password || "",

        "{{PORTAL_URL}}":
            user.portalUrl || "",

        "{{PLAN}}":
            user.plan || "",

        "{{AMOUNT}}":
            user.amount || "",

        "{{EXPIRY}}":
            formatDate(
                user.expiry
            ),

        "{{UPI_ID}}":
            settings.upi || "",

        "{{CONTACT}}":
            settings.contact || ""

    };


    Object.keys(
        replacements
    ).forEach(
        function(key) {

            message =
                message.split(
                    key
                ).join(
                    replacements[key]
                );

        }
    );


    return message;

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
                )
                ===
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
        navigator.clipboard &&
        window.isSecureContext
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


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

        alert(
            "Message copied successfully!"
        );

    } catch (error) {

        alert(
            "Copy failed. Please copy manually."
        );

    }


    textarea.remove();

}


/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsApp(id) {

    const user =
        users.find(
            function(item) {

                return String(
                    item.id
                )
                ===
                String(id);

            }
        );


    if (!user) {

        alert(
            "Customer not found."
        );

        return;

    }


    let phone =
        String(
            user.phone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        phone.length ===
        10
    ) {

        phone =
            "91" +
            phone;

    }


    const message =
        createMessage(
            user
        );


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
   DELETE USER
========================================================= */

function deleteUser(id) {

    const user =
        users.find(
            function(item) {

                return String(
                    item.id
                )
                ===
                String(id);

            }
        );


    if (!user) {

        alert(
            "Customer not found."
        );

        return;

    }


    const confirmed =
        confirm(
            "Delete customer " +
            user.name +
            "?"
        );


    if (!confirmed) {
        return;
    }


    users =
        users.filter(
            function(item) {

                return String(
                    item.id
                )
                !==
                String(id);

            }
        );


    payments =
        payments.filter(
            function(payment) {

                return String(
                    payment.userId
                )
                !==
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
   DOWNLOAD USER QR
========================================================= */

function downloadUserQR(id) {

    const user =
        users.find(
            function(item) {

                return String(
                    item.id
                )
                ===
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
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "SUPER IPTV - " +
            user.plan
        );


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


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();

            }


            qrBox.remove();

        },
        500
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

                const status =
                    payment.status ||
                    "Pending";


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

                            <span class="status ${
                                status === "Paid"
                                ? "active-status"
                                : "expired-status"
                            }">

                                ${escapeHTML(
                                    status
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

                return payment.status
                    ===
                    "Paid";

            }
        ).length;


    const pending =
        payments.filter(
            function(payment) {

                return payment.status
                    ===
                    "Pending";

            }
        ).length;


    const revenue =
        payments
        .filter(
            function(payment) {

                return payment.status
                    ===
                    "Paid";

            }
        )
        .reduce(
            function(total, payment) {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    const totalPayments =
        getElement(
            "totalPayments"
        );


    const paidPayments =
        getElement(
            "paidPayments"
        );


    const pendingPayments =
        getElement(
            "pendingPayments"
        );


    const paymentRevenue =
        getElement(
            "paymentRevenue"
        );


    if (totalPayments) {

        totalPayments.textContent =
            total;

    }


    if (paidPayments) {

        paidPayments.textContent =
            paid;

    }


    if (pendingPayments) {

        pendingPayments.textContent =
            pending;

    }


    if (paymentRevenue) {

        paymentRevenue.textContent =
            "₹" +
            revenue;

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(
            function(user) {

                return isUserActive(
                    user
                );

            }
        ).length;


    const expired =
        total -
        active;


    const revenue =
        payments
        .filter(
            function(payment) {

                return payment.status
                    ===
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


    const totalUsers =
        getElement(
            "totalUsers"
        );


    const activeUsers =
        getElement(
            "activeUsers"
        );


    const expiredUsers =
        getElement(
            "expiredUsers"
        );


    const totalRevenue =
        getElement(
            "totalRevenue"
        );


    if (totalUsers) {

        totalUsers.textContent =
            total;

    }


    if (activeUsers) {

        activeUsers.textContent =
            active;

    }


    if (expiredUsers) {

        expiredUsers.textContent =
            expired;

    }


    if (totalRevenue) {

        totalRevenue.textContent =
            "₹" +
            revenue;

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
            10
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

    const revenue =
        payments
        .filter(
            function(payment) {

                return payment.status
                    ===
                    "Paid";

            }
        )
        .reduce(
            function(total, payment) {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    const paid =
        payments.filter(
            function(payment) {

                return payment.status
                    ===
                    "Paid";

            }
        ).length;


    const pending =
        payments.filter(
            function(payment) {

                return payment.status
                    ===
                    "Pending";

            }
        ).length;


    const reportRevenue =
        getElement(
            "reportRevenue"
        );


    const paidCount =
        getElement(
            "paidCount"
        );


    const pendingCount =
        getElement(
            "pendingCount"
        );


    if (reportRevenue) {

        reportRevenue.textContent =
            "₹" +
            revenue;

    }


    if (paidCount) {

        paidCount.textContent =
            paid;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }

}


/* =========================================================
   SETTINGS LOAD
========================================================= */

function loadSettings() {

    const settingUpi =
        getElement(
            "settingUpi"
        );


    const settingContact =
        getElement(
            "settingContact"
        );


    const settingPortal =
        getElement(
            "settingPortal"
        );


    const template =
        getElement(
            "messageTemplate"
        );


    if (settingUpi) {

        settingUpi.value =
            settings.upi || "";

    }


    if (settingContact) {

        settingContact.value =
            settings.contact || "";

    }


    if (settingPortal) {

        settingPortal.value =
            settings.portal || "";

    }


    if (template) {

        template.value =
            messageTemplate;

    }

}


/* =========================================================
   SAVE SETTINGS
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

                const upi =
                    getElement(
                        "settingUpi"
                    ).value.trim();


                const contact =
                    getElement(
                        "settingContact"
                    ).value.trim();


                const portal =
                    getElement(
                        "settingPortal"
                    ).value.trim();


                settings = {

                    upi:
                        upi ||
                        DEFAULT_SETTINGS.upi,

                    contact:
                        contact ||
                        DEFAULT_SETTINGS.contact,

                    portal:
                        portal ||
                        DEFAULT_SETTINGS.portal

                };


                saveDatabase();


                alert(
                    "Settings saved successfully!"
                );


                generateQR(
                    getElement(
                        "plan"
                    )
                    ? getElement(
                        "plan"
                    ).value
                    : ""
                );

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

                const template =
                    getElement(
                        "messageTemplate"
                    ).value;


                messageTemplate =
                    template ||
                    DEFAULT_TEMPLATE;


                saveDatabase();


                alert(
                    "WhatsApp template saved successfully!"
                );

            }
        );

    }


    const deleteAll =
        getElement(
            "deleteAll"
        );


    if (deleteAll) {

        deleteAll.addEventListener(
            "click",
            function() {

                const confirmed =
                    confirm(
                        "WARNING!\n\nAre you sure you want to delete ALL users and payments?"
                    );


                if (!confirmed) {
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

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

function setupButtons() {

    const downloadQR =
        getElement(
            "downloadQR"
        );


    if (downloadQR) {

        downloadQR.addEventListener(
            "click",
            function() {

                downloadCurrentQR();

            }
        );

    }

}


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp() {

    loadDatabase();

    setupNavigation();

    setupPlanChange();

    setupUserForm();

    setupSearch();

    setupSettings();

    setupButtons();

    loadSettings();

    refreshAll();


    const portalInput =
        getElement(
            "portalUrl"
        );


    if (
        portalInput &&
        !portalInput.value
    ) {

        portalInput.value =
            settings.portal;

    }

}


/* =========================================================
   START
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

window.downloadUserQR =
    downloadUserQR;

window.deleteUser =
    deleteUser;

window.generateQR =
    generateQR;

window.downloadCurrentQR =
    downloadCurrentQR;