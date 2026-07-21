/* =====================================================
   SUPER IPTV
   COMPLETE SCRIPT
   QR + PNG + WHATSAPP + PAYMENTS
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

        upi:
            "6289033804@ptsbi",

        contact:
            "6289033804",

        portal:
            "http://geoiptv.one:8880"

    };


/* =========================
   MESSAGE TEMPLATE
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
    ) ||
    DEFAULT_TEMPLATE;


/* =========================
   DOM READY
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initNavigation();

        initPlanQR();

        initUserForm();

        initSearch();

        initDownloadQR();

        initSettings();

        initDeleteAll();

        loadSettings();

        renderUsers();

        renderPayments();

        updateDashboard();

        updateReports();

    }
);


/* =========================
   NAVIGATION
========================= */

function initNavigation() {

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
                            function(item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    buttons.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    const target =
                        document.getElementById(
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

                }
            );

        }
    );

}


/* =========================
   PLAN QR
========================= */

function initPlanQR() {

    const plan =
        document.getElementById(
            "plan"
        );


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


        qrPlan.innerText =
            "Select a plan to generate QR";


        return;

    }


    const amount =
        PLAN_PRICES[plan];


    if (!amount) {

        return;

    }


    amountInput.value =
        amount;


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrPlan.innerText =
            "QR Library Load হয়নি";

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
   USER FORM
========================= */

function initUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    form.addEventListener(
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


            if (!PLAN_PRICES[plan]) {

                alert(
                    "Please select a plan"
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


            form.reset();


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

}


/* =========================
   CALCULATE EXPIRY
========================= */

function calculateExpiry(plan) {

    const date =
        new Date();


    const months = {

        "1 Month": 1,

        "3 Months": 3,

        "6 Months": 6,

        "12 Months": 12

    };


    date.setMonth(

        date.getMonth() +
        months[plan]

    );


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
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    );

}


/* =========================
   SAVE DATABASE
========================= */

function saveDatabase() {

    localStorage.setItem(

        "SUPER_IPTV_USERS",

        JSON.stringify(
            users
        )

    );


    localStorage.setItem(

        "SUPER_IPTV_PAYMENTS",

        JSON.stringify(
            payments
        )

    );

}


/* =========================
   RENDER USERS
========================= */

function renderUsers() {

    const table =
        document.getElementById(
            "usersTable"
        );


    const searchInput =
        document.getElementById(
            "searchUser"
        );


    const search =
        (
            searchInput.value ||
            ""
        )
        .toLowerCase();


    const filtered =
        users.filter(
            function(user) {

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

function initSearch() {

    document
        .getElementById(
            "searchUser"
        )
        .addEventListener(
            "input",
            renderUsers
        );

}


/* =========================
   CREATE MESSAGE
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


/* =========================
   WHATSAPP
========================= */

function sendWhatsApp(id) {


    const user =
        users.find(
            function(item) {

                return item.id ===
                    id;

            }
        );


    if (!user) {

        alert(
            "Customer not found"
        );

        return;

    }


    let number =
        user.phone.replace(
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


    const message =
        createMessage(
            user
        );


    /*
       QR PNG Download
    */

    downloadUserQR(
        user
    );


    /*
       WhatsApp Open
    */

    const url =

        "https://wa.me/" +

        number +

        "?text=" +

        encodeURIComponent(
            message
        );


    setTimeout(
        function() {

            window.open(
                url,
                "_blank"
            );

        },
        500
    );

}


/* =========================
   USER QR PNG
========================= */

function downloadUserQR(user) {


    const temp =
        document.createElement(
            "div"
        );


    temp.style.position =
        "fixed";

    temp.style.left =
        "-9999px";


    document.body.appendChild(
        temp
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

        temp,

        {

            text:
                upiLink,

            width:
                500,

            height:
                500,

            correctLevel:
                QRCode.CorrectLevel.H

        }

    );


    setTimeout(
        function() {


            const canvas =
                temp.querySelector(
                    "canvas"
                );


            if (!canvas) {

                document.body.removeChild(
                    temp
                );

                return;

            }


            canvas.toBlob(
                function(blob) {


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =

                        "SUPER-IPTV-" +

                        user.username +

                        "-QR.png";


                    document.body.appendChild(
         