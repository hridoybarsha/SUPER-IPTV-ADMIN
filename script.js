/* =========================================================
   SUPER IPTV
   COMPLETE SCRIPT.JS

   Features:
   - Dashboard
   - Users
   - Payments
   - Reports
   - Settings
   - UPI QR Generator
   - QR PNG Download
   - QR + Message Download
   - WhatsApp Message
   - Copy Message
   - Search Users
   - Delete User
   - Delete All Data
   - LocalStorage Database
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

const USERS_KEY = "SUPER_IPTV_USERS";
const PAYMENTS_KEY = "SUPER_IPTV_PAYMENTS";
const SETTINGS_KEY = "SUPER_IPTV_SETTINGS";
const TEMPLATE_KEY = "SUPER_IPTV_TEMPLATE";


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

let settings = JSON.parse(
    localStorage.getItem(SETTINGS_KEY) || "null"
);


if (!settings) {

    settings = {

        upi: "6289033804@ptsbi",

        contact: "6289033804",

        portal: "http://geoiptv.one:8880"

    };

}


/* =========================================================
   DATABASE
========================================================= */

let users = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]"
);


let payments = JSON.parse(
    localStorage.getItem(PAYMENTS_KEY) || "[]"
);


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
    localStorage.getItem(TEMPLATE_KEY) ||
    DEFAULT_TEMPLATE;


/* =========================================================
   HELPER
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveDatabase() {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    localStorage.setItem(
        PAYMENTS_KEY,
        JSON.stringify(payments)
    );

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
   CALCULATE EXPIRY
========================================================= */

function calculateExpiry(plan) {

    const date = new Date();


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


    const d = new Date(date);


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

        amountInput.value =
            amount;

    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        if (qrPlan) {

            qrPlan.innerHTML =
                "QR Library loading failed. Please check internet connection.";

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
            "QR Error:",
            error
        );


        if (qrPlan) {

            qrPlan.innerHTML =
                "QR Generate Error";

        }

    }

}


/* =========================================================
   DOWNLOAD BLOB
========================================================= */

function downloadBlob(
    blob,
    filename
) {

    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   GET QR DATA URL
========================================================= */

function getQRDataURL() {

    const qrContainer =
        getElement("qrcode");


    if (!qrContainer) {

        return null;

    }


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    if (canvas) {

        return canvas.toDataURL(
            "image/png"
        );

    }


    const image =
        qrContainer.querySelector(
            "img"
        );


    if (image) {

        return image.src;

    }


    return null;

}


/* =========================================================
   DOWNLOAD CURRENT QR
========================================================= */

function downloadCurrentQR() {

    const dataURL =
        getQRDataURL();


    if (!dataURL) {

        alert(
            "প্রথমে একটি Plan Select করুন এবং QR Code তৈরি করুন।"
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        dataURL;


    link.download =
        "SUPER-IPTV-Payment-QR.png";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


/* =========================================================
   CREATE QR + MESSAGE IMAGE
========================================================= */

function downloadQRWithMessage() {

    const plan =
        getElement("plan").value;


    if (!plan) {

        alert(
            "প্রথমে একটি Plan Select করুন।"
        );

        return;

    }


    const dataURL =
        getQRDataURL();


    if (!dataURL) {

        alert(
            "QR Code তৈরি হয়নি।"
        );

        return;

    }


    const amount =
        PLAN_PRICES[plan];


    const canvas =
        document.createElement(
            "canvas"
        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    canvas.width =
        700;


    canvas.height =
        900;


    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#111827";


    ctx.font =
        "bold 32px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "SUPER IPTV",
        350,
        60
    );


    ctx.font =
        "bold 25px Arial";


    ctx.fillText(
        "PAYMENT QR CODE",
        350,
        105
    );


    const qrImage =
        new Image();


    qrImage.onload =
        function () {


            ctx.drawImage(
                qrImage,
                140,
                140,
                420,
                420
            );


            ctx.font =
                "bold 28px Arial";


            ctx.fillText(
                plan,
                350,
                620
            );


            ctx.font =
                "24px Arial";


            ctx.fillText(
                "Amount: ₹" +
                amount,
                350,
                670
            );


            ctx.fillText(
                "UPI ID: " +
                settings.upi,
                350,
                720
            );


            ctx.font =
                "20px Arial";


            ctx.fillText(
                "Scan QR to complete payment",
                350,
                780
            );


            ctx.fillText(
                "Contact: " +
                settings.contact,
                350,
                830
            );


            canvas.toBlob(
                function (blob) {

                    downloadBlob(
                        blob,
                        "SUPER-IPTV-QR-" +
                        plan.replace(
                            /\s/g,
                            "-"
                        ) +
                        ".png"
                    );

                },
                "image/png"
            );

        };


    qrImage.src =
        dataURL;

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
                        this.getAttribute(
                            "data-page"
                        );


                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(
                            function (
                                section
                            ) {

                                section.classList.remove(
                                    "active"
                                );

                            }
                        );


                    document
                        .querySelectorAll(
                            ".menu-btn"
                        )
                        .forEach(
                            function (
                                btn
                            ) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    const target =
                        getElement(
                            page
                        );


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    this.classList.add(
                        "active"
                    );


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
        function (event) {


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


            renderUsers();

            renderPayments();

            updateDashboard();

            updateReports();


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
            function (user) {


                return (

                    String(
                        user.name
                    )
                    .toLowerCase()
                    .includes(
                        search
                    )

                    ||

                    String(
                        user.phone
                    )
                    .toLowerCase()
                    .includes(
                        search
                    )

                    ||

                    String(
                        user.username
                    )
                    .toLowerCase()
                    .includes(
                        search
                    )

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
                