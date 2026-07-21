/* =====================================================
   SUPER IPTV
   COMPLETE SCRIPT.JS
   QR PNG + WHATSAPP + PAYMENTS
===================================================== */


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
   DATABASE
========================= */

let users =
    JSON.parse(
        localStorage.getItem(
            "SUPER_IPTV_USERS"
        )
    ) || [];


let payments =
    JSON.parse(
        localStorage.getItem(
            "SUPER_IPTV_PAYMENTS"
        )
    ) || [];


/* =========================
   SETTINGS
========================= */

let settings =
    JSON.parse(
        localStorage.getItem(
            "SUPER_IPTV_SETTINGS"
        )
    ) || {

        upi: "6289033804@ptsbi",

        contact: "6289033804",

        portal: "http://geoiptv.one:8880"

    };


/* =========================
   WHATSAPP TEMPLATE
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

QR Payment Code is attached with this message.

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
    ) || DEFAULT_TEMPLATE;


/* =========================
   SAVE DATABASE
========================= */

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
   NAVIGATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const menuButtons =
            document.querySelectorAll(
                ".menu-btn"
            );


        const pages =
            document.querySelectorAll(
                ".page"
            );


        menuButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const pageId =
                            this.dataset.page;


                        pages.forEach(
                            function(page) {

                                page.classList.remove(
                                    "active"
                                );

                            }
                        );


                        menuButtons.forEach(
                            function(menu) {

                                menu.classList.remove(
                                    "active"
                                );

                            }
                        );


                        const target =
                            document.getElementById(
                                pageId
                            );


                        if (target) {

                            target.classList.add(
                                "active"
                            );

                        }


                        this.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

    }
);


/* =========================
   CALCULATE EXPIRY
========================= */

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


    if (
        plan === "3 Months"
    ) {

        date.setMonth(
            date.getMonth() + 3
        );

    }


    if (
        plan === "6 Months"
    ) {

        date.setMonth(
            date.getMonth() + 6
        );

    }


    if (
        plan === "12 Months"
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

    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================
   CREATE UPI QR TEXT
========================= */

function getUPILink(plan) {

    const amount =
        PLAN_PRICES[plan];


    return (

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
        )

    );

}


/* =========================
   GENERATE QR
========================= */

function generateQR(plan) {

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    const qrPlan =
        document.getElementById(
            "qrPlan"
        );


    const amountInput =
        document.getElementById(
            "amount"
        );


    if (!qrContainer) {

        return;

    }


    qrContainer.innerHTML =
        "";


    if (!plan) {

        if (amountInput) {

            amountInput.value =
                "";

        }


        if (qrPlan) {

            qrPlan.innerText =
                "Select a plan to generate QR";

        }


        return;

    }


    const amount =
        PLAN_PRICES[plan];


    if (amountInput) {

        amountInput.value =
            amount;

    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrPlan.innerText =
            "QR Code Library Load হয়নি";

        return;

    }


    const upiLink =
        getUPILink(
            plan
        );


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


    qrPlan.innerHTML =

        "<strong>" +

        plan +

        "</strong>" +

        "<br>" +

        "Scan to Pay ₹" +

        amount +

        "<br>" +

        "UPI ID: " +

        settings.upi;

}


/* =========================
   PLAN CHANGE
========================= */

document
    .getElementById(
        "plan"
    )
    .addEventListener(
        "change",
        function() {

            generateQR(
                this.value
            );

        }
    );


/* =========================
   ADD CUSTOMER
========================= */

document
    .getElementById(
        "userForm"
    )
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value
                    .trim();


            const portalUrl =
                document
                    .getElementById(
                        "portalUrl"
                    )
                    .value
                    .trim();


            const plan =
                document
                    .getElementById(
                        "plan"
                    )
                    .value;


            const paymentStatus =
                document
                    .getElementById(
                        "paymentStatus"
                    )
                    .value;


            if (
                !PLAN_PRICES[plan]
            ) {

                alert(
                    "Please select a valid plan"
                );

                return;

            }


            const amount =
                PLAN_PRICES[plan];


            const expiry =
                calculateExpiry(
                    plan
                );


            const user = {

                id:
                    Date.now(),

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
                    user.id,

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


            this.reset();


            document
                .getElementById(
                    "portalUrl"
                )
                .value =
                settings.portal;


            generateQR(
                ""
            );

        }
    );


/* =========================
   RENDER USERS
========================= */

function renderUsers() {

    const table =
        document.getElementById(
            "usersTable"
        );


    const search =
        (
            document
                .getElementById(
                    "searchUser"
                )
                .value ||
            ""
        )
        .toLowerCase();


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
                                ?
                                "active-status"
                                :
                                "expired-status"
                            }">

                                ${
                                    active
                                    ?
                                    "Active"
                                    :
                                    "Expired"
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
                                onclick="
                                    sendWhatsApp(
                                        ${user.id}
                                    )
                                "
                            >
                                📱 WhatsApp
                            </button>


                            <button
                                class="action-btn copy-btn"
                                onclick="
                                    copyMessage(
                                        ${user.id}
                                    )
                                "
                            >
                                📋 Copy
                            </button>


                            <button
                                class="action-btn delete-btn"
                                onclick="
                                    deleteUser(
                                        ${user.id}
                                    )
                                "
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


/* =========================
   SEARCH
========================= */

document
    .getElementById(
        "searchUser"
    )
    .addEventListener(
        "input",
        renderUsers
    );


/* =========================
   CREATE WHATSAPP MESSAGE
========================= */

function createMessage(user) {

    return messageTemplate

        .replaceAll(
            "{{USERNAME}}",
            user.username
        )

        .replaceAll(
            "{{PASSWORD}}",
            user.password
        )

        .replaceAll(
            "{{PORTAL_URL}}",
            user.portalUrl
        )

        .replaceAll(
            "{{PLAN}}",
            user.plan
        )

        .replaceAll(
            "{{AMOUNT}}",
            user.amount
        )

        .replaceAll(
            "{{EXPIRY}}",
            formatDate(
                user.expiry
            )
        )

        .replaceAll(
            "{{UPI_ID}}",
            settings.upi
        )

        .replaceAll(
            "{{CONTACT}}",
            settings.contact
        );

}


/* =====================================================
   CREATE QR PNG
   This creates a PNG image from QR canvas
===================================================== */

function createQRPNG(user) {

    return new Promise(
        function(resolve, reject) {


            const qrCanvas =
                document
                    .querySelector(
                        "#qrcode canvas"
                    );


            if (
                qrCanvas
            ) {

                qrCanvas.toBlob(
                    function(blob) {

                        if (blob) {

                            resolve(
                                blob
                            );

                        } else {

                            reject(
                                "QR PNG তৈরি করা যায়নি"
                            );

                        }

                    },
                    "image/png"
                );

                return;

            }


            /*
               যদি বর্তমানে QR না থাকে,
               তাহলে নতুন QR তৈরি হবে
            */

            const tempDiv =
                document.createElement(
                    "div"
                );


            tempDiv.style.position =
                "fixed";

            tempDiv.style.left =
                "-99999px";


            document.body.appendChild(
                tempDiv
            );


            new QRCode(

                tempDiv,

                {

                    text:
                        getUPILink(
                            user.plan
                        ),

                    width:
                        500,

                    height:
                        500,

                    colorDark:
                        "#000000",

                    colorLight:
                        "#ffffff",

                    correctLevel:
                        QRCode.CorrectLevel.H

                }

            );


            setTimeout(
                function() {


                    const canvas =
                        tempDiv.querySelector(
                            "canvas"
                        );


                    if (!canvas) {

                        document.body.removeChild(
                            tempDiv
                        );

                        reject(
                            "QR তৈরি করা যায়নি"
                        );

                        return;

                    }


                    canvas.toBlob(
                        function(blob) {


                            document.body.removeChild(
                                tempDiv
          