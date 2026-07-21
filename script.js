/* =========================================================
   SUPER IPTV - COMPLETE SCRIPT.JS
   VERSION 3.0

   FEATURES:
   - Dashboard
   - Users
   - Add Customer
   - Payments
   - Reports
   - Settings
   - UPI QR Generator
   - QR PNG Download
   - Customer QR Download
   - WhatsApp Message
   - Copy Message
   - Search Customer
   - LocalStorage Database
========================================================= */


/* =========================================================
   1. PLAN PRICES
========================================================= */

const PLAN_PRICES = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,

    "12 Months": 2000

};


/* =========================================================
   2. LOCAL STORAGE DATABASE
========================================================= */

let users = [];

let payments = [];

let settings = {

    upi: "6289033804@ptsbi",

    contact: "6289033804",

    portal: "http://geoiptv.one:8880"

};


/* =========================================================
   3. LOAD DATABASE
========================================================= */

function loadDatabase() {

    try {

        const savedUsers =
            localStorage.getItem(
                "SUPER_IPTV_USERS"
            );

        const savedPayments =
            localStorage.getItem(
                "SUPER_IPTV_PAYMENTS"
            );

        const savedSettings =
            localStorage.getItem(
                "SUPER_IPTV_SETTINGS"
            );


        users =
            savedUsers
                ? JSON.parse(savedUsers)
                : [];


        payments =
            savedPayments
                ? JSON.parse(savedPayments)
                : [];


        if (savedSettings) {

            settings = {

                ...settings,

                ...JSON.parse(
                    savedSettings
                )

            };

        }

    }

    catch (error) {

        console.error(
            "Database Load Error:",
            error
        );

        users = [];

        payments = [];

    }

}


/* =========================================================
   4. SAVE DATABASE
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
   5. SAVE SETTINGS
========================================================= */

function saveSettingsData() {

    localStorage.setItem(

        "SUPER_IPTV_SETTINGS",

        JSON.stringify(settings)

    );

}


/* =========================================================
   6. DEFAULT WHATSAPP TEMPLATE
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

    localStorage.getItem(
        "SUPER_IPTV_TEMPLATE"
    ) ||

    DEFAULT_TEMPLATE;


/* =========================================================
   7. SAFE ELEMENT GETTER
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


/* =========================================================
   8. FORMAT DATE
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
   9. CALCULATE EXPIRY
========================================================= */

function calculateExpiry(plan) {

    const date =
        new Date();


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
   10. NAVIGATION
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


                    /* Hide All Pages */

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


                    /* Remove Active Menu */

                    buttons.forEach(

                        function(btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }

                    );


                    /* Show Selected Page */

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


                    /* Refresh Page Data */

                    if (
                        page === "dashboard"
                    ) {

                        updateDashboard();

                    }


                    if (
                        page === "users"
                    ) {

                        renderUsers();

                    }


                    if (
                        page === "payments"
                    ) {

                        renderPayments();

                        updatePaymentSummary();

                    }


                    if (
                        page === "reports"
                    ) {

                        updateReports();

                    }


                    if (
                        page === "settings"
                    ) {

                        loadSettings();

                    }

                }

            );

        }

    );

}


/* =========================================================
   11. GENERATE UPI QR
========================================================= */

function generateQR(plan) {

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


    if (!qrContainer) {

        console.error(
            "QR container not found"
        );

        return;

    }


    /* Clear Old QR */

    qrContainer.innerHTML = "";


    /* No Plan */

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


    /* Get Price */

    const amount =

        PLAN_PRICES[plan];


    if (!amount) {

        if (qrPlan) {

            qrPlan.innerHTML =

                "Invalid Plan";

        }

        return;

    }


    /* Show Amount */

    if (amountInput) {

        amountInput.value =
            amount;

    }


    /* UPI Payment Link */

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


    /* Check QR Library */

    if (
        typeof QRCode ===
        "undefined"
    ) {

        if (qrPlan) {

            qrPlan.innerHTML =

                "QR Library not loaded. Please check internet connection.";

        }


        console.error(
            "QRCode library missing"
        );

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

    }

    catch (error) {

        console.error(
            "QR Generate Error:",
            error
        );


        if (qrPlan) {

            qrPlan.innerHTML =

                "QR Generate Error";

        }

    }

}


/* =========================================================
   12. DOWNLOAD CURRENT QR PNG
========================================================= */

function downloadCurrentQR() {

    const qrContainer =

        getElement(
            "qrcode"
        );


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


        document.body.removeChild(
            link
        );


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


        document.body.removeChild(
            link
        );


        return;

    }


    alert(

        "প্রথমে একটি Plan Select করুন এবং QR Code তৈরি করুন"

    );

}


/* =========================================================
   13. PLAN CHANGE
========================================================= */

function setupPlanSelector() {

    const planSelect =

        getElement(
            "plan"
        );


    if (!planSelect) {

        return;

    }


    planSelect.addEventListener(

        "change",

        function() {

            generateQR(
                this.value
            );

        }

    );

}


/* =========================================================
   14. ADD CUSTOMER
========================================================= */

function setupUserForm() {

    const form =

        getElement(
            "userForm"
        );


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


            /* Validation */

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


            const expiry =

                calculateExpiry(
                    plan
                );


            const userId =

                Date.now();


            /* Create User */

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


            /* Save User */

            users.push(
                user
            );


            /* Create Payment */

            payments.push(

                {

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

                }

            );


            /* Save */

            saveDatabase();


            /* Refresh */

            renderUsers();

            renderPayments();

            updateDashboard();

            updateReports();


            alert(

                "Customer Added Successfully!"

            );


            /* Reset */

            form.reset();


            const portalInput =

                getElement(
                    "portalUrl"
                );


            if (portalInput) {

                portalInput.value =
                    settings.portal;

            }


            generateQR("");

        }

    );

}


/* =========================================================
   15. RENDER USERS
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

            ?

            searchInput
                .value
                .toLowerCase()
                .trim()

            :

            "";


    const filtered =

        users.filter(

            function(user) {

                return (

                    String(
                        user.name
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        user.phone
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        user.username
                    )
                    .toLowerCase()
                    .includes(search)

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

                function(user) {


                    const active =

                        new Date(
                            user.expiry
                        ) >=
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
                                    ?
                                    "active-status"
                                    :
           