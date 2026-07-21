/* =========================================================
   SUPER IPTV - COMPLETE FINAL SCRIPT.JS
   Dashboard
   Users
   Payments
   Reports
   Settings
   QR Generator
   QR PNG Download
   WhatsApp
   Copy Message
   LocalStorage Database
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
   DATABASE LOAD
========================================================= */

let users = JSON.parse(
    localStorage.getItem("SUPER_IPTV_USERS") || "[]"
);

let payments = JSON.parse(
    localStorage.getItem("SUPER_IPTV_PAYMENTS") || "[]"
);


/* =========================================================
   SETTINGS LOAD
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
   DEFAULT WHATSAPP MESSAGE
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

📎 Payment QR code is available in the dashboard.

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
   HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


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
   NAVIGATION
========================================================= */

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(function(page) {

            page.classList.remove("active");

        });


    document
        .querySelectorAll(".menu-btn")
        .forEach(function(button) {

            button.classList.remove("active");

        });


    const page =
        $(pageName);


    if (page) {

        page.classList.add("active");

    }


    const button =
        document.querySelector(
            '.menu-btn[data-page="' +
            pageName +
            '"]'
        );


    if (button) {

        button.classList.add("active");

    }


    if (pageName === "dashboard") {

        updateDashboard();

    }


    if (pageName === "users") {

        renderUsers();

    }


    if (pageName === "payments") {

        renderPayments();

        updatePaymentSummary();

    }


    if (pageName === "reports") {

        updateReports();

    }


    if (pageName === "settings") {

        loadSettings();

    }

}


/* =========================================================
   QR GENERATOR
========================================================= */

function generateQR(plan) {

    const qrContainer =
        $("qrcode");

    const qrPlan =
        $("qrPlan");

    const amountInput =
        $("amount");


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
                "QR Library not loaded. Please check your internet connection.";

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
                text: upiLink,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
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
                "QR generation failed";

        }

    }

}


/* =========================================================
   DOWNLOAD QR PNG
========================================================= */

function downloadQRImage(
    qrContainer,
    fileName
) {

    if (!qrContainer) {

        alert(
            "QR Code not found"
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
            fileName;


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        document
            .body
            .appendChild(
                link
            );


        link.click();


        document
            .body
            .removeChild(
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
            fileName;


        link.href =
            image.src;


        document
            .body
            .appendChild(
                link
            );


        link.click();


        document
            .body
            .removeChild(
                link
            );


        return;

    }


    alert(
        "প্রথমে একটি Plan Select করুন এবং QR Code তৈরি করুন"
    );

}


/* =========================================================
   CREATE USER QR
========================================================= */

function createUserQR(user) {

    const container =
        document.createElement(
            "div"
        );


    container.style.position =
        "fixed";


    container.style.left =
        "-9999px";


    container.style.top =
        "0";


    document
        .body
        .appendChild(
            container
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

        document
            .body
            .removeChild(
                container
            );


        alert(
            "QR Library not loaded"
        );


        return;

    }


    new QRCode(
        container,
        {
            text: upiLink,
            width: 500,
            height: 500,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel:
                QRCode.CorrectLevel.H
        }
    );


    setTimeout(
        function() {

            downloadQRImage(
                container,
                "SUPER-IPTV-" +
                user.username +
                "-QR.png"
            );


            document
                .body
                .removeChild(
                    container
                );

        },
        500
    );

}


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
   WHATSAPP NUMBER
========================================================= */

function getWhatsAppNumber(
    phone
) {

    let number =
        String(phone)
        .replace(
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

                return (
                    String(item.id) ===
                    String(id)
                );

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
        number.length < 12
    ) {

        alert(
            "Please enter valid WhatsApp number"
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

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!user) {

        alert(
            "Customer not found"
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
                        "WhatsApp Message Copied!"
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

function fallbackCopy(
    text
) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document
        .body
        .appendChild(
            textarea
        );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "Message Copied!"
        );

    }

    catch (error) {

        alert(
            "Copy failed"
        );

    }


    document
        .body
        .removeChild(
            textarea
        );

}


/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers() {

    const table =
        $("usersTable");


    if (!table) {
        return;
    }


    const searchInput =
        $("searchUser");


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
                            class="action-btn"
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
   DOWNLOAD USER QR
========================================================= */

function downloadUserQR(id) {

    const user =
        users.find(
            function(item) {

                return (
                    String(item.id) ===
                    Strin