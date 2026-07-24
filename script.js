/* =========================================================
   SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
   UPI QR SYSTEM
   Paytm + PhonePe + Google Pay Compatible
   ========================================================= */


/* =========================
   STORAGE KEYS
========================= */

const USERS_KEY = "SUPER_IPTV_USERS";
const PAYMENTS_KEY = "SUPER_IPTV_PAYMENTS";
const SETTINGS_KEY = "SUPER_IPTV_SETTINGS";
const TEMPLATE_KEY = "SUPER_IPTV_TEMPLATE";


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
   DEFAULT WHATSAPP MESSAGE
========================= */

const DEFAULT_TEMPLATE = `📺 SUPER IPTV

Hello 👋

Your IPTV account details:

👤 Username: {{USERNAME}}

🔐 Password: {{PASSWORD}}

🌐 Portal: {{PORTAL_URL}}

📦 Plan: {{PLAN}}

💰 Amount: ₹{{AMOUNT}}

📅 Expiry: {{EXPIRY}}

💳 UPI ID: {{UPI_ID}}

📞 Contact: {{CONTACT}}

Thank you for choosing SUPER IPTV.`;


/* =========================
   DATA
========================= */

let users = [];

let payments = [];

let settings = {};

let messageTemplate = "";


/* =========================
   QR VARIABLES
========================= */

let currentUPILink = "";

let currentQRCode = null;


/* =========================
   LOAD DATABASE
========================= */

function loadDatabase(){

    try{

        users =
        JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || [];


        payments =
        JSON.parse(
            localStorage.getItem(PAYMENTS_KEY)
        ) || [];


        settings =
        JSON.parse(
            localStorage.getItem(SETTINGS_KEY)
        ) ||
        DEFAULT_SETTINGS;


        messageTemplate =
        localStorage.getItem(TEMPLATE_KEY)
        ||
        DEFAULT_TEMPLATE;


    }catch(error){

        console.error(error);

        users = [];

        payments = [];

        settings = DEFAULT_SETTINGS;

        messageTemplate = DEFAULT_TEMPLATE;

    }

}


/* =========================
   SAVE DATABASE
========================= */

function saveDatabase(){

    localStorage.setItem(

        USERS_KEY,

        JSON.stringify(users)

    );


    localStorage.setItem(

        PAYMENTS_KEY,

        JSON.stringify(payments)

    );

}


/* =========================
   SAVE SETTINGS
========================= */

function saveSettingsData(){

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(settings)

    );

}


/* =========================
   NAVIGATION
========================= */

function setupNavigation(){

    const buttons =
    document.querySelectorAll(".nav-btn");


    buttons.forEach(button => {

        button.addEventListener(

            "click",

            function(){

                const page =
                this.dataset.page;


                document
                .querySelectorAll(".page")
                .forEach(section => {

                    section.classList.remove(
                        "active"
                    );

                });


                document
                .querySelectorAll(".nav-btn")
                .forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                const target =
                document.getElementById(page);


                if(target){

                    target.classList.add(
                        "active"
                    );

                }


                this.classList.add(
                    "active"
                );


                updateAll();

            }

        );

    });

}


/* =========================
   CALCULATE EXPIRY
========================= */

function calculateExpiry(plan){

    const date = new Date();


    const months = {

        "1 Month": 1,

        "3 Months": 3,

        "6 Months": 6,

        "12 Months": 12

    };


    if(!months[plan]){

        return "";

    }


    date.setMonth(

        date.getMonth()
        +
        months[plan]

    );


    return date.toISOString()
    .split("T")[0];

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date){

    if(!date){

        return "-";

    }


    const d =
    new Date(date);


    if(
        Number.isNaN(
            d.getTime()
        )
    ){

        return "-";

    }


    return d.toLocaleDateString(
        "en-IN"
    );

}


/* =========================
   GET USER STATUS
========================= */

function getUserStatus(user){

    if(

        user.paymentStatus
        ===
        "Pending"

    ){

        return "Pending";

    }


    if(!user.expiry){

        return "Active";

    }


    const expiry =
    new Date(user.expiry);


    const today =
    new Date();


    today.setHours(
        0,0,0,0
    );


    if(expiry < today){

        return "Expired";

    }


    return "Active";

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

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


/* =========================
   GENERATE UPI LINK
========================= */

function createUPILink(){

    const amount =
    Number(
        document.getElementById(
            "amount"
        ).value
    );


    const customerName =
    document.getElementById(
        "customerName"
    ).value.trim();


    const plan =
    document.getElementById(
        "plan"
    ).value;


    const upiID =
    settings.upi.trim();


    if(

        !upiID

        ||

        !amount

        ||

        !plan

    ){

        return "";

    }


    /*
       STANDARD UPI PAYMENT URI

       This is the important part.

       Do NOT use a random QR string.

       The QR must encode:

       upi://pay
       ?pa=UPI_ID
       &pn=MERCHANT_NAME
       &am=AMOUNT
       &cu=INR
    */


    const params =
    new URLSearchParams();


    params.set(
        "pa",
        upiID
    );


    params.set(
        "pn",
        customerName
        ||
        "SUPER IPTV"
    );


    params.set(
        "am",
        amount.toFixed(2)
    );


    params.set(
        "cu",
        "INR"
    );


    params.set(
        "tn",
        `SUPER IPTV ${plan}`
    );


    return (

        "upi://pay?"
        +
        params.toString()

    );

}


/* =========================
   GENERATE QR
========================= */

function generateQR(){

    const qrContainer =
    document.getElementById(
        "qrcode"
    );


    if(!qrContainer){

        return;

    }


    currentUPILink =
    createUPILink();


    qrContainer.innerHTML = "";


    if(!currentUPILink){

        qrContainer.innerHTML = `

            <div class="empty">

                Select a plan and enter
                amount to generate QR

            </div>

        `;

        return;

    }


    try{

        currentQRCode =
        new QRCode(

            qrContainer,

            {

                text:
                currentUPILink,

                width:
                300,

                height:
                300,

                colorDark:
                "#000000",

                colorLight:
                "#ffffff",

                correctLevel:
                QRCode.CorrectLevel.H

            }

        );


        updateQRInfo();


    }catch(error){

        console.error(
            "QR Error:",
            error
        );


        qrContainer.innerHTML = `

            <div class="empty">

                Unable to generate QR

            </div>

        `;

    }

}


/* =========================
   UPDATE QR INFORMATION
========================= */

function updateQRInfo(){

    const name =
    document.getElementById(
        "customerName"
    ).value
    ||
    "-";


    const amount =
    document.getElementById(
        "amount"
    ).value
    ||
    "0";


    const status =
    document.getElementById(
        "paymentStatus"
    ).value
    ||
    "Pending";


    document.getElementById(
        "qrCustomer"
    ).textContent =
    name;


    document.getElementById(
        "qrAmount"
    ).textContent =
    amount;


    document.getElementById(
        "qrUpi"
    ).textContent =
    settings.upi;


    document.getElementById(
        "qrStatus"
    ).textContent =
    status;

}


/* =========================
   PLAN CHANGE
========================= */

function setupPlan(){

    const plan =
    document.getElementById(
        "plan"
    );


    const amount =
    document.getElementById(
        "amount"
    );


    if(!plan){

        return;

    }


    plan.addEventListener(

        "change",

        function(){

            const price =
            PLAN_PRICES[
                this.value
            ];


            amount.value =
            price
            ||
            "";


            generateQR();

            updateQRInfo();

        }

    );

}


/* =========================
   LIVE QR UPDATE
========================= */

function setupLiveQR(){

    [

        "customerName",

        "amount",

        "paymentStatus"

    ].forEach(id => {

        const element =
        document.getElementById(id);


        if(element){

            element.addEventListener(

                "input",

                function(){

                    generateQR();

                    updateQRInfo();

                }

            );


            element.addEventListener(

                "change",

                function(){

                    generateQR();

                    updateQRInfo();

                }

            );

        }

    });

}


/* =========================
   DOWNLOAD QR PNG
========================= */

function downloadCurrentQR(){

    const qrContainer =
    document.getElementById(
        "qrcode"
    );


    if(!currentUPILink){

        alert(
            "Please select a plan first."
        );

        return;

    }


    const canvas =
    qrContainer.querySelector(
        "canvas"
    );


    if(canvas){

        const link =
        document.createElement(
            "a"
        );


        link.download =
        "SUPER-IPTV-UPI-QR.png";


        link.href =
        canvas.toDataURL(
            "image/png"
        );


        link.click();


        return;

    }


    const img =
    qrContainer.querySelector(
        "img"
    );


    if(img){

        const link =
        document.createElement(
            "a"
        );


        link.download =
        "SUPER-IPTV-UPI-QR.png";


        link.href =
        img.src;


        link.click();

    }

}


/* =========================
   COPY UPI ID
========================= */

function copyUPI(){

    navigator.clipboard
    .writeText(
        settings.upi
    )

    .then(() => {

        alert(
            "UPI ID copied successfully."
        );

    })

    .catch(() => {

        alert(
            "Unable to copy UPI ID."
        );

    });

}


/* =========================
   COPY UPI LINK
========================= */

function copyUPILink(){

    if(!currentUPILink){

        alert(
            "Please generate QR first."
        );

        return;

    }


    navigator.clipboard
    .writeText(
        currentUPILink
    )

    .then(() => {

        alert(
            "UPI payment link copied."
        );

    });

}


/* =========================
   ADD USER
========================= */

function setupUserForm(){

    const form =
    document.getElementById(
        "userForm"
    );


    if(!form){

        return;

    }


    form.addEventListener(

        "submit",

        function(event){

            event.preventDefault();


            const name =
            document.getElementById(
                "customerName"
            ).value.trim();


            const phone =
            document.getElementById(
                "phone"
            ).value.trim();


            const username =
            document.getElementById(
                "username"
            ).value.trim();


            const password =
            document.getElementById(
                "password"
            ).value.trim();


            const portal =
            document.getElementById(
                "portalUrl"
            ).value.trim();


            const plan =
            document.getElementById(
                "plan"
            ).value;


            const amount =
            Number(
                document.getElementById(
                    "amount"
                ).value
            );


            const paymentStatus =
            document.getElementById(
                "paymentStatus"
            ).value;


            if(

                !name
                ||
                !phone
                ||
                !username
                ||
                !password
                ||
                !portal
                ||
                !plan
                ||
                !amount

            ){

                alert(
                    "Please fill all required fields."
                );

                return;

            }


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

                portal:
                portal,

                plan:
                plan,

                amount:
                amount,

                paymentStatus:
                paymentStatus,

                expiry:
                expiry,

                createdAt:
                new Date()
                .toISOString()

            };


            users.push(
                user
            );


            const payment = {

                id:
                Date.now()
                +
                1,

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

            };


            payments.push(
                payment
            );


            saveDatabase();


            alert(
                "Customer added successfully!"
            );


            form.reset();


            document.getElementById(
                "portalUrl"
            ).value =
            settings.portal;


            document.getElementById(
                "qrcode"
            ).innerHTML = `

                <div class="empty">

                    Select a plan to generate QR

                </div>

            `;


            currentUPILink =
            "";


            updateAll();

        }

    );

}


/* =========================
   RENDER USERS
========================= */

function renderUsers(){

    const table =
    document.getElementById(
        "usersTable"
    );


    const search =
    document.getElementById(
        "searchUser"
    );


    if(!table){

        return;

    }


    const query =
    search
    ?
    search.value
    .toLowerCase()
    .trim()
    :
    "";


    const filtered =
    users.filter(
        user => {

            return (

                user.name
                .toLowerCase()
                .includes(query)

                ||

                user.phone
                .toLowerCase()
                .includes(query)

                ||

                user.username
                .toLowerCase()
                .includes(query)

            );

        }

    );


    if(!filtered.length){

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty"
                >

                    No Customers Found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

    filtered.map(
        user => {

            const status =
            getUserStatus(
                user
            );


            return `

            <tr>

                <td>
                    ${escapeHTML(user.name)}
                </td>

                <td>
                    ${escapeHTML(user.phone)}
                </td>

                <td>
                    ${escapeHTML(user.username)}
                </td>

                <td>
                    ${escapeHTML(user.plan)}
                </td>

                <td>
                    ₹${user.amount}
                </td>

                <td>

                    <span class="status
                    ${
                        status === "Paid"
                        ||
                        status === "Active"
                        ?
                        "status-paid"
                        :
                        status === "Pending"
                        ?
                        "status-pending"
                        :
                        "status-expired"
                    }">

                    ${status}

                    </span>

                </td>

                <td>
                    ${formatDate(user.expiry)}
                </td>

                <td>

                    <button
                    class="action-btn btn-danger"
                    onclick="deleteUser(${user.id})">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        }

    ).join("");

}


/* =========================
   DELETE USER
========================= */

function deleteUser(id){

    if(

        !confirm(
            "Delete this customer?"
        )

    ){

        return;

    }


    users =
    users.filter(
        user =>
        user.id !== id
    );


    payments =
    payments.filter(
        payment =>
        payment.userId !== id
    );


    saveDatabase();


    updateAll();

}


/* =========================
   RENDER PAYMENTS
========================= */

function renderPayments(){

    const table =
    document.getElementById(
        "paymentsTable"
    );


    if(!table){

        return;

    }


    if(!payments.length){

        table.innerHTML = `

        <tr>

            <td
            colspan="6"
            class="empty">

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
        payment => `

        <tr>

            <td>
                ${escapeHTML(payment.name)}
            </td>

            <td>
                ${escapeHTML(payment.phone)}
            </td>

            <td>
                ${escapeHTML(payment.plan)}
            </td>

            <td>
                ₹${payment.amount}
            </td>

            <td>
                ${escapeHTML(payment.status)}
            </td>

            <td>
                ${formatDate(payment.date)}
            </td>

        </tr>

        `
    )
    .join("");

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

    const total =
    users.length;


    const active =
    users.filter(
        user =>
        getUserStatus(user)
        ===
        "Active"
    ).length;


    const expired =
    users.filter(
        user =>
        getUserStatus(user)
        ===
        "Expired"
    ).length;


    const revenue =
    payments
    .filter(
        payment =>
        payment.status
        ===
        "Paid"
    )
    .reduce(

        (
            total,
            payment
        ) =>
        total
        +
        Number(
            payment.amount
        ),

        0

    );


    document.getElementById(
        "totalUsers"
    ).textContent =
    total;


    document.getElementById(
        "activeUsers"
    ).textContent =
    active;


    document.getElementById(
        "expiredUsers"
    ).textContent =
    expired;


    document.getElementById(
        "totalRevenue"
    ).textContent =
    "₹" + revenue;


    const recent =
    document.getElementById(
        "recentUsersTable"
    );


    if(!recent){

        return;

    }


    const latest =
    users
    .slice()
    .reverse()
    .slice(
        0,
        5
    );


    if(!latest.length){

        recent.innerHTML = `

        <tr>

            <td
            colspan="5"
            class="empty">

            No Users Yet

            </td>

        </tr>

        `;

        return;

    }


    recent.innerHTML =

    latest.map(
        user => `

        <tr>

            <td>
                ${escapeHTML(user.name)}
            </td>

            <td>
                ${escapeHTML(user.phone)}
            </td>

            <td>
                ${escapeHTML(user.plan)}
            </td>

            <td>
                ${getUserStatus(user)}
            </td>

            <td>
                ${formatDate(user.expiry)}
            </td>

        </tr>

        `
    )
    .join("");

}


/* =========================
   PAYMENT STATS
========================= */

function updatePaymentStats(){

    const total =
    payments.length;


    const paid =
    payments.filter(
        p =>
        p.status
        ===
        "Paid"
    );


    const pending =
    payments.filter(
        p =>
        p.status
        ===
        "Pending"
    );


    const revenue =
    paid.reduce(

        (
            total,
            payment
        ) =>
        total
        +
        Number(
            payment.amount
        ),

        0

    );


    document.getElementById(
        "totalPayments"
    ).textContent =
    total;


    document.getElementById(
        "paidPayments"
    ).textContent =
    paid.length;


    document.getElementById(
        "pendingPayments"
    ).textContent =
    pending.length;


    document.getElementById(
        "paymentRevenue"
    ).textContent =
    "₹" + revenue;


    document.getElementById(
        "reportRevenue"
    ).textContent =
    "₹" + revenue;


    document.getElementById(
        "reportPaid"
    ).textContent =
    paid.length;


    document.getElementById(
        "reportPending"
    ).textContent =
    pending.length;

}


/* =========================
   SETTINGS
========================= */

function loadSettings(){

    document.getElementById(
        "settingsUpi"
    ).value =
    settings.upi;


    document.getElementById(
        "settingsContact"
    ).value =
    settings.contact;


    document.getElementById(
        "settingsPortal"
    ).value =
    settings.portal;


    document.getElementById(
        "messageTemplate"
    ).value =
    messageTemplate;

}


/* =========================
   SAVE SETTINGS
========================= */

function setupSettings(){

    document.getElementById(
        "saveSettings"
    )
    .addEventListener(

        "click",

        function(){

            settings.upi =
            document.getElementById(
                "settingsUpi"
            ).value.trim();


            settings.contact =
            document.getElementById(
                "settingsContact"
            ).value.trim();


            settings.portal =
            document.getElementById(
                "settingsPortal"
            ).value.trim();


            saveSettingsData();


            updateQRInfo();


            alert(
                "Settings saved successfully."
            );

        }

    );


    document.getElementById(
        "saveTemplate"
    )
    .addEventListener(

        "click",

        function(){

            messageTemplate =
            document.getElementById(
                "messageTemplate"
            ).value;


            localStorage.setItem(

                TEMPLATE_KEY,

                messageTemplate

            );


            alert(
                "Message template saved."
            );

        }

    );

}


/* =========================
   DELETE ALL
========================= */

function setupDeleteAll(){

    document.getElementById(
        "deleteAll"
    )
    .addEventListener(

        "click",

        function(){

            if(

                !confirm(
                    "Delete ALL users and payments?"
                )

            ){

                return;

            }


            users = [];

            payments = [];


            saveDatabase();


            updateAll();


            alert(
                "All data deleted."
            );

        }

    );

}


/* =========================
   SEARCH
========================= */

function setupSearch(){

    const search =
    document.getElementById(
        "searchUser"
    );


    if(search){

        search.addEventListener(

            "input",

            renderUsers

        );

    }

}


/* =========================
   UPDATE ALL
========================= */

function updateAll(){

    renderUsers();

    renderPayments();

    updateDashboard();

    updatePaymentStats();

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadDatabase();

        setupNavigation();

        setupPlan();

        setupLiveQR();

        setupUserForm();

        setupSettings();

        setupDeleteAll();

        setupSearch();

        loadSettings();

        updateAll();


        document.getElementById(
            "downloadQR"
        )
        .addEventListener(

            "click",

            downloadCurrentQR

        );


        document.getElementById(
            "copyUPI"
        )
        .addEventListener(

            "click",

            copyUPI

        );


        document.getElementById(
            "copyUPILink"
        )
        .addEventListener(

            "click",

            copyUPILink

        );

    }

);