/* =========================================================
   SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
   COMPLETE SCRIPT.JS
   =========================================================
   Features:
   ✅ Dashboard
   ✅ User Management
   ✅ Add User
   ✅ Edit User
   ✅ Delete User
   ✅ Renew Subscription
   ✅ Expiry Status
   ✅ Payment Management
   ✅ Reports
   ✅ Search
   ✅ QR Generator
   ✅ QR Download
   ✅ WhatsApp Message
   ✅ Copy Message
   ✅ Settings
   ✅ WhatsApp Template
   ✅ Backup
   ✅ Restore
   ✅ CSV Export
   ✅ LocalStorage
========================================================= */

"use strict";


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

const USERS_KEY = "SUPER_IPTV_USERS";
const PAYMENTS_KEY = "SUPER_IPTV_PAYMENTS";
const SETTINGS_KEY = "SUPER_IPTV_SETTINGS";
const TEMPLATE_KEY = "SUPER_IPTV_TEMPLATE";


/* =========================================================
   DATABASE
========================================================= */

let users = [];
let payments = [];


/* =========================================================
   SETTINGS
========================================================= */

let settings = {
    upi: "6289033804@ptsbi",
    contact: "6289033804",
    portal: "http://geoiptv.one:8880"
};


/* =========================================================
   DEFAULT WHATSAPP TEMPLATE
========================================================= */

const DEFAULT_TEMPLATE = `━━━━━━━━━━━━━━━━━━━━━━
       SUPER IPTV
━━━━━━━━━━━━━━━━━━━━━━

Hello 👋

Your IPTV account details are below.

🔐 LOGIN DETAILS

Username : {{USERNAME}}
Password : {{PASSWORD}}

🌐 Portal URL :
{{PORTAL_URL}}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION

Plan : {{PLAN}}
Amount : ₹{{AMOUNT}}
Valid Upto : {{EXPIRY}}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT

UPI ID : {{UPI_ID}}

Contact :
{{CONTACT}}

📎 Please complete the payment and send the payment screenshot.

━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing SUPER IPTV.
━━━━━━━━━━━━━━━━━━━━━━`;


let messageTemplate = DEFAULT_TEMPLATE;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SUPER IPTV Panel Loaded"
        );

        loadDatabase();

        setupNavigation();

        setupUserForm();

        setupPlanChange();

        setupSearch();

        setupButtons();

        loadSettings();

        renderAll();

    }
);


/* =========================================================
   LOAD DATABASE
========================================================= */

function loadDatabase() {

    try {

        const savedUsers =
            localStorage.getItem(
                USERS_KEY
            );

        const savedPayments =
            localStorage.getItem(
                PAYMENTS_KEY
            );

        const savedSettings =
            localStorage.getItem(
                SETTINGS_KEY
            );

        const savedTemplate =
            localStorage.getItem(
                TEMPLATE_KEY
            );


        users =
            savedUsers
                ? JSON.parse(savedUsers)
                : [];


        payments =
            savedPayments
                ? JSON.parse(savedPayments)
                : [];


        if (
            savedSettings
        ) {

            settings =
                {
                    ...settings,
                    ...JSON.parse(
                        savedSettings
                    )
                };

        }


        if (
            savedTemplate
        ) {

            messageTemplate =
                savedTemplate;

        }


        if (
            !Array.isArray(users)
        ) {

            users = [];

        }


        if (
            !Array.isArray(payments)
        ) {

            payments = [];

        }

    }

    catch (error) {

        console.error(
            "Database Error:",
            error
        );

        users = [];

        payments = [];

    }

}


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveDatabase() {

    try {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

        localStorage.setItem(
            PAYMENTS_KEY,
            JSON.stringify(payments)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Save Error:",
            error
        );

        alert(
            "Unable to save data."
        );

        return false;

    }

}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveSettingsData() {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}


/* =========================================================
   GET ELEMENT
========================================================= */

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
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const page =
                        this.dataset.page;


                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(
                            function (section) {

                                section.classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                    buttons.forEach(
                        function (btn) {

                            btn.classList
                                .remove(
                                    "active"
                                );

                        }
                    );


                    const target =
                        getElement(
                            page
                        );


                    if (
                        target
                    ) {

                        target.classList
                            .add(
                                "active"
                            );

                    }


                    this.classList
                        .add(
                            "active"
                        );


                    renderAll();

                }
            );

        }
    );

}


/* =========================================================
   SETUP BUTTONS
========================================================= */

function setupButtons() {

    const downloadQR =
        getElement(
            "downloadQR"
        );


    if (
        downloadQR
    ) {

        downloadQR.addEventListener(
            "click",
            downloadCurrentQR
        );

    }


    const saveSettingsBtn =
        getElement(
            "saveSettings"
        );


    if (
        saveSettingsBtn
    ) {

        saveSettingsBtn.addEventListener(
            "click",
            saveSettings
        );

    }


    const saveTemplateBtn =
        getElement(
            "saveTemplate"
        );


    if (
        saveTemplateBtn
    ) {

        saveTemplateBtn.addEventListener(
            "click",
            saveTemplate
        );

    }


    const deleteAllBtn =
        getElement(
            "deleteAll"
        );


    if (
        deleteAllBtn
    ) {

        deleteAllBtn.addEventListener(
            "click",
            deleteAllData
        );

    }

}


/* =========================================================
   PLAN CHANGE
========================================================= */

function setupPlanChange() {

    const plan =
        getElement(
            "plan"
        );


    if (
        !plan
    ) {

        return;

    }


    plan.addEventListener(
        "change",
        function () {

            generateQR(
                this.value
            );

        }
    );

}


/* =========================================================
   CALCULATE EXPIRY
========================================================= */

function calculateExpiry(
    plan,
    startDate = new Date()
) {

    const date =
        new Date(
            startDate
        );


    if (
        plan === "1 Month"
    ) {

        date.setMonth(
            date.getMonth() + 1
        );

    }

    else if (
        plan === "3 Months"
    ) {

        date.setMonth(
            date.getMonth() + 3
        );

    }

    else if (
        plan === "6 Months"
    ) {

        date.setMonth(
            date.getMonth() + 6
        );

    }

    else if (
        plan === "12 Months"
    ) {

        date.setMonth(
            date.getMonth() + 12
        );

    }


    return date;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    date
) {

    if (
        !date
    ) {

        return "-";

    }


    const d =
        new Date(
            date
        );


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
   DAYS LEFT
========================================================= */

function getDaysLeft(
    expiry
) {

    const today =
        new Date();


    const end =
        new Date(
            expiry
        );


    const difference =
        end.getTime() -
        today.getTime();


    return Math.ceil(
        difference /
        (
            1000 *
            60 *
            60 *
            24
        )
    );

}


/* =========================================================
   USER STATUS
========================================================= */

function getUserStatus(
    user
) {

    const days =
        getDaysLeft(
            user.expiry
        );


    if (
        days < 0
    ) {

        return {
            text: "Expired",
            className: "expired-status"
        };

    }


    if (
        days <= 7
    ) {

        return {
            text:
                "Expiring (" +
                days +
                "d)",
            className:
                "expired-status"
        };

    }


    return {
        text: "Active",
        className:
            "active-status"
    };

}


/* =========================================================
   GENERATE QR
========================================================= */

function generateQR(
    plan
) {

    const qrContainer =
        getElement(
            "qrcode"
        );


    const qrPlan =
        getElement(
            "qrPlan"
        );


    const amountInput =
        getElement(
            "amount"
        );


    if (
        !qrContainer
    ) {

        return;

    }


    qrContainer.innerHTML =
        "";


    if (
        !plan
    ) {

        if (
            amountInput
        ) {

            amountInput.value =
                "";

        }


        if (
            qrPlan
        ) {

            qrPlan.innerHTML =
                "Select a plan to generate QR";

        }

        return;

    }


    const amount =
        PLAN_PRICES[
            plan
        ];


    if (
        !amount
    ) {

        return;

    }


    if (
        amountInput
    ) {

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
        amount +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "SUPER IPTV " +
            plan
        );


    if (
        typeof QRCode ===
        "undefined"
    ) {

        if (
            qrPlan
        ) {

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
                    QRCode
                        .CorrectLevel
                        .H

            }
        );


        if (
            qrPlan
        ) {

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

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   ADD CUSTOMER
========================================================= */

function setupUserForm() {

    const form =
        getElement(
            "userForm"
        );


    if (
        !form
    ) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                getElement(
                    "customerName"
                )
                .value
                .trim();


            const phone =
                getElement(
                    "phone"
                )
                .value
                .trim();


            const username =
                getElement(
                    "username"
                )
                .value
                .trim();


            const password =
                getElement(
                    "password"
                )
                .value
                .trim();


            const portalUrl =
                getElement(
                    "portalUrl"
                )
                .value
                .trim();


            const plan =
                getElement(
                    "plan"
                )
                .value;


            const paymentStatus =
                getElement(
                    "paymentStatus"
                )
                .value;


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
                PLAN_PRICES[
                    plan
                ];


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
                    Date.now() +
                    1,

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


            renderAll();


            alert(
                "Customer Added Successfully!"
            );


            form.reset();


            getElement(
                "portalUrl"
            ).value =
                settings.portal;


            getElement(
                "amount"
            ).value =
                "";


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


    if (
        !table
    ) {

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
            function (user) {

                return (

                    user.name
                        .toLowerCase()
                        .includes(
                            search
                        )

                    ||

                    user.phone
                        .toLowerCase()
                        .includes(
                            search
                        )

                    ||

                    user.username
                        .toLowerCase()
                        .includes(
                            search
                        )

                );

            }
        );


    if (
        filtered.length === 0
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
                function (user) {

                    const status =
                        getUserStatus(
                            user
                        );


                    return `

<tr>

<td>${escapeHTML(user.name)}</td>

<td>${escapeHTML(user.phone)}</td>

<td>${escapeHTML(user.username)}</td>

<td>${escapeHTML(user.password)}</td>

<td>${escapeHTML(user.plan)}</td>

<td>₹${user.amount}</td>

<td>
<span class="status ${status.className}">
${status.text}
</span>
</td>

<td>
${formatDate(user.expiry)}
<br>
<small>
${Math.max(
    0,
    getDaysLeft(
        user.expiry
    )
)} days
</small>
</td>

<td