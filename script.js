"use strict";

/* =========================================================
   SUPER IPTV MANAGEMENT PANEL
   COMPLETE SCRIPT.JS
========================================================= */


/* =========================
   PLAN PRICES
========================= */

const PLAN_PRICES = {
    "1 Month": 200,
    "3 Months": 600,
    "6 Months": 1150,
    "12 Months": 2000
};


/* =========================
   DEFAULT SETTINGS
========================= */

const DEFAULT_SETTINGS = {
    upi: "6289033804@ptsbi",
    contact: "6289033804",
    portal: "http://geoiptv.one:8880"
};


/* =========================
   DEFAULT WHATSAPP TEMPLATE
========================= */

const DEFAULT_TEMPLATE = `━━━━━━━━━━━━━━━━━━━━━━
        SERVICE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━

Hello 👋

Your IPTV account has been successfully created.

🔐 LOGIN CREDENTIALS

Username : {{USERNAME}}
Password : {{PASSWORD}}
Portal URL : {{PORTAL_URL}}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION DETAILS

Plan       : {{PLAN}}
Amount     : ₹{{AMOUNT}}
Valid Upto : {{EXPIRY}}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT INFORMATION

UPI ID : {{UPI_ID}}
Contact Number : {{CONTACT}}

📎 Payment QR code is available in the dashboard.

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT INSTRUCTIONS

• Complete payment via UPI
• Send payment screenshot
• Account will be activated after payment confirmation

━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT

WhatsApp / Call : {{CONTACT}}

Thank you for choosing our service.

━━━━━━━━━━━━━━━━━━━━━━`;


/* =========================
   DATABASE
========================= */

let users = [];
let payments = [];
let settings = {};
let messageTemplate = "";


/* =========================
   LOAD DATA
========================= */

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


/* =========================
   SAVE DATABASE
========================= */

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


/* =========================
   SAVE SETTINGS
========================= */

function saveSettingsData() {

    localStorage.setItem(
        "SUPER_IPTV_SETTINGS",
        JSON.stringify(settings)
    );

}


/* =========================
   GET ELEMENT
========================= */

function getElement(id) {

    return document.getElementById(id);

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


                    /* Hide pages */

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


                    /* Remove active */

                    buttons.forEach(
                        function(btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* Show page */

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


                    /* Refresh */

                    if (
                        page ===
                        "dashboard"
                    ) {

                        updateDashboard();

                    }


                    if (
                        page ===
                        "users"
                    ) {

                        renderUsers();

                    }


                    if (
                        page ===
                        "payments"
                    ) {

                        renderPayments();

                        updatePaymentSummary();

                    }


                    if (
                        page ===
                        "reports"
                    ) {

                        updateReports();

                    }


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
   DATE
========================================================= */

function calculateExpiry(plan) {

    const date =
        new Date();


    if (
        plan ===
        "1 Month"
    ) {

        date.setMonth(
            date.getMonth() + 1
        );

    }


    else if (
        plan ===
        "3 Months"
    ) {

        date.setMonth(
            date.getMonth() + 3
        );

    }


    else if (
        plan ===
        "6 Months"
    ) {

        date.setMonth(
            date.getMonth() + 6
        );

    }


    else if (
        plan ===
        "12 Months"
    ) {

        date.setMonth(
            date.getMonth() + 12
        );

    }


    return date;

}


/* =========================
   FORMAT DATE
========================= */

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
                "QR Library not loaded. Please check internet.";

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
                plan +
                "</strong>" +
                "<br><br>" +
                "Scan to Pay ₹" +
                amount +
                "<br>" +
                "UPI ID: " +
                settings.upi;

        }


    } catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   DOWNLOAD QR
========================================================= */

function downloadCurrentQR() {

    const qrContainer =
        getElement("qrcode");


    if (
        !qrContainer
    ) {

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


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


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


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        return;

    }


    alert(
        "Please select a plan first."
    );

}


/* =========================================================
   DOWNLOAD USER QR
========================================================= */

function downloadUserQR(id) {

    const user =
        users.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!user) {

        alert(
            "Customer not found"
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


    if (
        typeof QRCode ===
        "undefined"
    ) {

        alert(
            "QR Library not loaded."
        );

        qrBox.remove();

        return;

    }


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
                    "Please fill all fields."
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
                    new Date().toISOString(),

                expiry:
                    expiry.toISOString()

            };


            users.push(
                user
            );


            payments.push({

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
                    new Date().toISOString()

            });


            saveDatabase();


            renderUsers();

            renderPayments();

            updateDashboard();

            updatePaymentSummary();

            updateReports();


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
                    new Date(
                        user.expiry
                    ) >=
                    new Date();


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
                            user.amount
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
                            type="button"
                            class="action-btn whatsapp-btn"
                            onclick="sendWhatsApp('${user.id}')"
                        >
                            📱 WhatsApp
                        </button>

                        <button
                            type="button"
                            class="action-btn copy-btn"
                            onclick="copyMessage('${user.id}')"
                        >
                            📋 Copy
                        </button>

                        <button
                            type="button"
                            class="action-btn primary-btn"
                            onclick="downloadUserQR('${user.id}')"
                        >
                            📥 QR
                        </button>

                        <button
                            type="button"
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
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value || ""
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
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        getElement(
            "searchUser"
        );


    if (search) {

        search.addEventListener(
            "input",
            renderUsers
        );

    }

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createMessage(user) {

    let message =
        messageTemplate;


    const values = {

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
            settings.contact

    };


    Object.keys(
        values
    ).forEach(
        function(key) {

            message =
                message.split(
                    key
                ).join(
                    String(
                        values[key]
                    )
                );

        }
    );


    return message;

}


/* =========================================================
   WHATSAPP NUMBER
========================================================= */

function getWhatsAppNumber(
    phone
) {

    let number =
        String(
            phone
        ).replace(
            /\D/g,
            ""
        );


    if (
        number.length ===
        10
    ) {

        number =
            "91" +
            number;

    }


    return number;

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
            "Customer not found"
        );

        return;

    }


    const number =
        getWhatsAppNumber(
            user.phone
        );


    if (
        number.length <
        12
    ) {

        alert(
            "Please enter valid WhatsApp number."
        );

        return;

    }


    const message =
        createMessage(
            user
        );


    const url =
        "https://wa.me/" +
        number +
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
                        "Message Copied!"
                    );

                }
            );

        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        message;


    document.body.appendChild(
        textarea
    );


    textarea.select();


    document.execCommand(
        "copy"
    );


    textarea.remove();


    alert(
        "Message Copied!"
    );

}


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(id) {

    if (
        !confirm(
            "Delete this customer?"
        )
    ) {

        return;

    }


    users =
        users.filter(
            function(user) {

                return String(
                    user.id
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


    renderUsers();

    renderPayments();

    updateDashboard();

    updatePaymentSummary();

    updateReports();


    alert(
        "Customer Deleted!"
    );

}


/* =========================================================
   PAYMENTS
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
                            payment.amount
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.status
                        )}
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
        ).length;


    const pending =
        payments.filter(
            function(payment) {

                return payment.status ===
                    "Pending";

            }
        ).length;


    const revenue =
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
                        payment.amount
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
        ).innerText =
            total;

    }


    if (
        getElement(
            "paidPayments"
        )
    ) {

        getElement(
            "paidPayments"
        ).innerText =
            paid;

    }


    if (
        getElement(
            "pendingPayments"
        )
    ) {

        getElement(
            "pendingPayments"
        ).innerText =
            pending;

    }


    if (
        getElement(
            "paymentRevenue"
        )
    ) {

        getElement(
            "paymentRevenue"
        ).innerText =
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

                return new Date(
                    user.expiry
                ) >=
                new Date();

            }
        ).length;


    const expired =
        total -
        active;


    const revenue =
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
                        payment.amount
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
        ).innerText =
            total;

    }


    if (
        getElement(
            "activeUsers"
        )
    ) {

        getElement(
            "activeUsers"
        ).innerText =
            active;

    }


    if (
        getElement(
            "expiredUsers"
        )
    ) {

        getElement(
            "expiredUsers"
        ).innerText =
            expired;

    }


    if (
        getElement(
            "totalRevenue"
        )
    ) {

        getElement(
            "totalRevenue"
        ).innerText =
            "₹" +
            revenue;

    }


    const table =
        getElement(
            "recentUsers"
        );


    if (!table) {

        return;

    }


    if (
        users.length ===
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

        users
        .slice()
        .reverse()
        .slice(
            0,
            10
        )
        .map(
            function(user) {

                const active =
                    new Date(
                        user.expiry
                    ) >=
                    new Date();


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

    const paidPayments =
        payments.filter(
            function(payment) {

                return payment.status ===
                    "Paid";

            }
        );


    const pendingPayments =
        payments.filter(
            function(payment) {

                return payment.status ===
                    "Pending";

            }
        );


    const revenue =
        paidPayments.reduce(
            function(sum, payment) {

                return sum +
                    Number(
                        payment.amount
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
        ).innerText =
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
        ).innerText =
            paidPayments.length;

    }


    if (
        getElement(
            "pendingCount"
        )
    ) {

        getElement(
            "pendingCount"
        ).innerText =
            pendingPayments.length;

    }

}


/* =========================================================
   SETTINGS LOAD
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
            messageTemplate || "";

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


                alert(
                    "Settings Saved Successfully!"
                );

            }
        );

    }


    const templateButton =
        getElement(
            "saveTemplate"
        );


    if (templateButton) {

        templateButton.addEventListener(
            "click",
            function() {

                messageTemplate =
                    getElement(
                        "messageTemplate"
                    ).value;


                localStorage.setItem(
                    "SUPER_IPTV_TEMPLATE",
                    messageTemplate
                );


                alert(
                    "WhatsApp Template Saved!"
                );

            }
        );

    }

}


/* =========================================================
   DELETE ALL
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

            if (
                !confirm(
                    "Delete ALL Users and Payments?"
                )
            ) {

                return;

            }


            users = [];

            payments = [];


            saveDatabase();


            renderUsers();

            renderPayments();

            updateDashboard();

            updatePaymentSummary();

            updateReports();


            alert(
                "All Data Deleted!"
            );

        }
    );

}


/* =========================================================
   INITIALIZE SYSTEM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "SUPER IPTV: Initializing..."
        );


        /* Load data */

        loadDatabase();


        /* Navigation */

        setupNavigation();


        /* User */

        setupUserForm();


        /* Plan */

        setupPlanChange();


        /* Search */

        setupSearch();


        /* Settings */

        setupSettings();


        /* Delete All */

        setupDeleteAll();


        /* Download QR */

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


        /* Initial render */

        loadSettings();

        updateDashboard();

        renderUsers();

        renderPayments();

        updatePaymentSummary();

        updateReports();


        console.log(
            "SUPER IPTV: System Ready"
        );

    }
);