/* =========================================================
   SUPER IPTV - COMPLETE SCRIPT.JS
   Dashboard + Users + Payments + Reports + Settings
   QR Generator + QR Download + WhatsApp Message
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
   DATABASE
========================================================= */

let users = JSON.parse(
    localStorage.getItem("SUPER_IPTV_USERS") || "[]"
);

let payments = JSON.parse(
    localStorage.getItem("SUPER_IPTV_PAYMENTS") || "[]"
);


/* =========================================================
   SETTINGS
========================================================= */

let settings = JSON.parse(
    localStorage.getItem("SUPER_IPTV_SETTINGS") || "null"
);

if (!settings) {
    settings = {
        upi: "6289033804@ptsbi",
        contact: "6289033804",
        portal: "http://geoiptv.one:8880"
    };
}


/* =========================================================
   DEFAULT WHATSAPP TEMPLATE
========================================================= */

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

📎 Payment QR code is attached with this message.

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT INSTRUCTIONS

• Complete payment via UPI
• Send payment screenshot
• Account will be activated/renewed after payment confirmation

━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT

WhatsApp / Call : {{CONTACT}}

For any assistance, reply to this message.

Thank you for choosing our service.
━━━━━━━━━━━━━━━━━━━━━━`;


let messageTemplate =
    localStorage.getItem("SUPER_IPTV_TEMPLATE") ||
    DEFAULT_TEMPLATE;


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveDatabase() {

    localStorage.setItem(
        "SUPER_IPTV_USERS",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "SUPER_IPTV_PAYMENTS",
        JSON.stringify(payments)
    );
}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveSettingsData() {

    localStorage.setItem(
        "SUPER_IPTV_SETTINGS",
        JSON.stringify(settings)
    );
}


/* =========================================================
   SAFE ELEMENT
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuButtons =
        document.querySelectorAll(".menu-btn");

    menuButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const page =
                this.getAttribute("data-page");

            document
                .querySelectorAll(".page")
                .forEach(function (section) {

                    section.classList.remove("active");

                });

            document
                .querySelectorAll(".menu-btn")
                .forEach(function (btn) {

                    btn.classList.remove("active");

                });

            const target =
                getElement(page);

            if (target) {

                target.classList.add("active");

            }

            this.classList.add("active");


            if (page === "dashboard") {
                updateDashboard();
            }

            if (page === "users") {
                renderUsers();
            }

            if (page === "payments") {
                renderPayments();
                updatePaymentSummary();
            }

            if (page === "reports") {
                updateReports();
            }

            if (page === "settings") {
                loadSettings();
            }

        });

    });

});


/* =========================================================
   CALCULATE EXPIRY
========================================================= */

function calculateExpiry(plan) {

    const date = new Date();

    if (plan === "1 Month") {
        date.setMonth(date.getMonth() + 1);
    }

    else if (plan === "3 Months") {
        date.setMonth(date.getMonth() + 3);
    }

    else if (plan === "6 Months") {
        date.setMonth(date.getMonth() + 6);
    }

    else if (plan === "12 Months") {
        date.setMonth(date.getMonth() + 12);
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

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


/* =========================================================
   GENERATE QR
========================================================= */

function generateQR(plan) {

    const qrContainer =
        getElement("qrcode");

    const qrPlan =
        getElement("qrPlan");

    const amountInput =
        getElement("amount");


    if (!qrContainer) {
        console.error("QR container not found");
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

        if (qrPlan) {
            qrPlan.innerHTML =
                "Invalid Plan";
        }

        return;
    }


    if (amountInput) {
        amountInput.value = amount;
    }


    const upiLink =
        "upi://pay" +
        "?pa=" +
        encodeURIComponent(settings.upi) +
        "&pn=" +
        encodeURIComponent("SUPER IPTV") +
        "&am=" +
        encodeURIComponent(amount) +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "SUPER IPTV - " + plan
        );


    if (typeof QRCode === "undefined") {

        qrPlan.innerHTML =
            "QR Library not loaded. Check internet connection.";

        console.error(
            "QRCode library not loaded"
        );

        return;
    }


    try {

        new QRCode(
            qrContainer,
            {
                text: upiLink,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );


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


    } catch (error) {

        console.error(
            "QR Error:",
            error
        );

        qrPlan.innerHTML =
            "QR Generate Error";

    }

}


/* =========================================================
   PLAN SELECT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const planSelect =
            getElement("plan");


        if (planSelect) {

            planSelect.addEventListener(
                "change",
                function () {

                    generateQR(
                        this.value
                    );

                }
            );

        }

    }
);


/* =========================================================
   ADD CUSTOMER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const userForm =
            getElement("userForm");


        if (!userForm) {
            return;
        }


        userForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    getElement("customerName")
                    .value
                    .trim();


                const phone =
                    getElement("phone")
                    .value
                    .trim();


                const username =
                    getElement("username")
                    .value
                    .trim();


                const password =
                    getElement("password")
                    .value
                    .trim();


                const portalUrl =
                    getElement("portalUrl")
                    .value
                    .trim();


                const plan =
                    getElement("plan")
                    .value;


                const paymentStatus =
                    getElement("paymentStatus")
                    .value;


                if (!name ||
                    !phone ||
                    !username ||
                    !password ||
                    !portalUrl ||
                    !plan) {

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


                const expiry =
                    calculateExpiry(plan);


                const userId =
                    Date.now();


                const user = {

                    id: userId,

                    name: name,

                    phone: phone,

                    username: username,

                    password: password,

                    portalUrl: portalUrl,

                    plan: plan,

                    amount: amount,

                    paymentStatus:
                        paymentStatus,

                    createdAt:
                        new Date().toISOString(),

                    expiry:
                        expiry.toISOString()

                };


                users.push(user);


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
                        new Date().toISOString()

                });


                saveDatabase();


                renderUsers();

                renderPayments();

                updateDashboard();

                updateReports();


                alert(
                    "Customer Added Successfully!"
                );


                userForm.reset();


                getElement(
                    "portalUrl"
                ).value =
                    settings.portal;


                getElement(
                    "amount"
                ).value = "";


                generateQR("");

            }
        );

    }
);


/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers() {

    const table =
        getElement("usersTable");


    if (!table) {
        return;
    }


    const searchInput =
        getElement("searchUser");


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
        users.filter(function (user) {

            return (

                String(user.name)
                    .toLowerCase()
                    .includes(search)

                ||

                String(user.phone)
                    .toLowerCase()
                    .includes(search)

                ||

                String(user.username)
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filtered.length === 0) {

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
            .map(function (user) {


                const active =
                    new Date(user.expiry) >=
                    new Date();


                return `

                <tr>

                    <td>
                        ${user.name}
                    </td>

                    <td>
                        ${user.phone}
                    </td>

                    <td>
                        ${user.username}
                    </td>

                    <td>
                        ${user.password}
                    </td>

                    <td>
                        ${user.plan}
                    </td>

                    <td>
                        ₹${user.amount}
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
                        ${formatDate(user.expiry)}
                    </td>

                    <td>

                        <button
                            class="action-btn whatsapp-btn"
                            onclick="sendWhatsApp(${user.id})"
                        >
                            📱 WhatsApp
                        </button>

                        <button
                            class="action-btn copy-btn"
                            onclick="copyMessage(${user.id})"
                        >
                            📋 Copy
                        </button>

                        <button
                            class="action-btn"
                            onclick="downloadUserQR(${user.id})"
                        >
                            📥 QR
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteUser(${user.id})"
                        >
                            🗑️ Delete
                        </button>

                    </td>

                </tr>

                `;

            })
            .join("");

}


/* =========================================================
   SEARCH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const search =
            getElement("searchUser");


        if (search) {

            search.addEventListener(
                "input",
                renderUsers
            );

        }

    }
);


/* =========================================================
   CREATE WHATSAPP MESSAGE
========================================================= */

function createMessage(user) {

    let message =
        messageTemplate;


    message =
        message.replaceAll(
            "{{USERNAME}}",
            user.username
        );


    message =
        message.replaceAll(
            "{{PASSWORD}}",
            user.password
        );


    message =
        message.replaceAll(
            "{{PORTAL_URL}}",
            user.portalUrl
        );


    message =
        message.replaceAll(
            "{{PLAN}}",
            user.plan
        );


    message =
        message.replaceAll(
            "{{AMOUNT}}",
            user.amount
        );


    message =
        message.replaceAll(
            "{{EXPIRY}}",
            formatDate(
                user.expiry
            )
        );


    message =
        message.replaceAll(
            "{{UPI_ID}}",
            settings.upi
        );


    message =
        message.replaceAll(
            "{{CONTACT}}",
            settings.contact
        );


    return message;
}


/* =========================================================
   GET WHATSAPP NUMBER
========================================================= */

function getWhatsAppNumber(phone) {

    let number =
        String(phone)
            .replace(/\D/g, "");


    if (
        number.length === 10
    ) {

        number =
            "91" +
            number;

    }


    return number;
}


/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsApp(id) {

    const user =
        users.find(function (item) {

            return item.id === id;

        });


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
        number.length < 12
    ) {

        alert(
            "Please enter valid WhatsApp number"
        );

        return;
    }


    const message =
        createMessage(user);


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
        users.find(function (item) {

            return item.id === id;

        });


    if (!user) {
        return;
    }


    const message =
        createMessage(user);


    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(message)
            .then(function () {

                alert(
                    "WhatsApp Message Copied!"
                );

            })
            .catch(function () {

                alert(
                    "Copy failed"
                );

            });

    }

}


/* =========================================================
   DOWNLOAD CURRENT QR
========================================================= */

function downloadCurrentQR() {

    const qrContainer =
        getElement("qrcode");


    if (!qrContainer) {

        alert(
            "QR container not found"
        );

        return;
    }


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    const image =
