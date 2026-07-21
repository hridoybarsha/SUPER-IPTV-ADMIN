/* ==========================================
   SUPER IPTV
   END USER + PAYMENT MANAGER
   ========================================== */


/* =========================
   STORAGE
========================= */

let users =
JSON.parse(localStorage.getItem("users")) || [];

let payments =
JSON.parse(localStorage.getItem("payments")) || [];


/* =========================
   PLAN PRICES
========================= */

const planPrices = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,

    "12 Months": 2000

};


/* =========================
   ELEMENTS
========================= */

const planInput =
document.getElementById("plan");

const amountInput =
document.getElementById("amount");

const upiInput =
document.getElementById("upi");

const qrcode =
document.getElementById("qrcode");


/* =========================
   UPDATE AMOUNT
========================= */

function updateAmount(){

    let plan = planInput.value;

    let amount = planPrices[plan];

    amountInput.value = amount;

    generateQR();

}


/* =========================
   GENERATE QR
========================= */

function generateQR(){

    let amount =
    Number(amountInput.value);

    let upi =
    upiInput.value.trim();


    qrcode.innerHTML = "";


    if(!upi || !amount){

        qrcode.innerHTML =
        "<span style='color:#111'>Enter UPI & Amount</span>";

        return;

    }


    let upiLink =
    "upi://pay?" +

    "pa=" + encodeURIComponent(upi) +

    "&pn=" + encodeURIComponent("SUPER IPTV") +

    "&am=" + encodeURIComponent(amount) +

    "&cu=INR";


    new QRCode(qrcode, {

        text: upiLink,

        width: 160,

        height: 160

    });


    document.getElementById("qrText")
    .innerText =
    "Scan to Pay ₹" + amount;

}


/* =========================
   PLAN CHANGE
========================= */

planInput.addEventListener(
"change",
updateAmount
);


/* =========================
   UPI CHANGE
========================= */

upiInput.addEventListener(
"input",
generateQR
);


/* =========================
   EXPIRY DATE
========================= */

function getExpiry(plan){

    let date =
    new Date();


    if(plan === "1 Month"){

        date.setMonth(
        date.getMonth() + 1
        );

    }


    if(plan === "3 Months"){

        date.setMonth(
        date.getMonth() + 3
        );

    }


    if(plan === "6 Months"){

        date.setMonth(
        date.getMonth() + 6
        );

    }


    if(plan === "12 Months"){

        date.setFullYear(
        date.getFullYear() + 1
        );

    }


    return date
    .toISOString()
    .split("T")[0];

}


/* =========================
   CREATE USER + PAYMENT
========================= */

function createUserAndPayment(){

    let phone =
    document.getElementById("phone")
    .value.trim();


    let username =
    document.getElementById("username")
    .value.trim();


    let password =
    document.getElementById("password")
    .value.trim();


    let portal =
    document.getElementById("portal")
    .value.trim();


    let plan =
    document.getElementById("plan")
    .value;


    let amount =
    Number(
    document.getElementById("amount")
    .value
    );


    let upi =
    document.getElementById("upi")
    .value.trim();


    let support =
    document.getElementById("support")
    .value.trim();


    let status =
    document.getElementById("paymentStatus")
    .value;


    /* =========================
       VALIDATION
    ========================= */

    if(
        !phone ||
        !username ||
        !password ||
        !portal
    ){

        alert(
        "Please fill all required fields."
        );

        return;

    }


    if(!amount){

        alert(
        "Please select a valid plan."
        );

        return;

    }


    /* =========================
       EXPIRY
    ========================= */

    let expiry =
    getExpiry(plan);


    /* =========================
       USER
    ========================= */

    let user = {

        id: Date.now(),

        phone: phone,

        username: username,

        password: password,

        portal: portal,

        plan: plan,

        amount: amount,

        expiry: expiry,

        status:
        status === "Paid"
        ? "Active"
        : "Pending"

    };


    users.push(user);


    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );


    /* =========================
       PAYMENT
    ========================= */

    let payment = {

        id: Date.now(),

        username: username,

        phone: phone,

        amount: amount,

        plan: plan,

        method: "UPI",

        status: status,

        date:
        new Date()
        .toISOString()
        .split("T")[0],

        expiry: expiry

    };


    payments.push(payment);


    localStorage.setItem(

        "payments",

        JSON.stringify(payments)

    );


    /* =========================
       UPDATE UI
    ========================= */

    loadPayments();

    updateStats();


    /* =========================
       WHATSAPP MESSAGE
    ========================= */

    let message =

`━━━━━━━━━━━━━━━━━━━━━━
        SERVICE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━

Hello 👋

Your IPTV account has been successfully created.

🔐 LOGIN CREDENTIALS

Username : ${username}
Password : ${password}
Portal URL : ${portal}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION DETAILS

Plan       : ${plan}
Amount     : ₹${amount}
Valid Upto : ${expiry}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT INFORMATION

UPI ID : ${upi}
Contact Number : ${support}

Scan QR code available in dashboard.

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT INSTRUCTIONS

• Complete payment via UPI
• Send payment screenshot
• Account will be activated/renewed after payment confirmation

━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT

WhatsApp / Call : ${support}

For any assistance, reply to this message.

Thank you for choosing our service.
━━━━━━━━━━━━━━━━━━━━━━`;


    /* =========================
       OPEN WHATSAPP
    ========================= */

    let cleanPhone =
    phone.replace(/\D/g, "");


    /*
       If Indian number starts
       with 0, replace with 91
    */

    if(
        cleanPhone.length === 10
    ){

        cleanPhone =
        "91" + cleanPhone;

    }


    let whatsappURL =

    "https://wa.me/" +

    cleanPhone +

    "?text=" +

    encodeURIComponent(message);


    window.open(
    whatsappURL,
    "_blank"
    );


    /* =========================
       CLEAR FORM
    ========================= */

    document.getElementById("phone")
    .value = "";

    document.getElementById("username")
    .value = "";

    document.getElementById("password")
    .value = "";


    alert(
    "User and Payment saved successfully!"
    );

}


/* =========================
   LOAD PAYMENTS
========================= */

function loadPayments(){

    let table =
    document.getElementById(
    "paymentTable"
    );


    let search =
    document.getElementById(
    "searchPayment"
    )
    .value
    .toLowerCase();


    table.innerHTML = "";


    let filtered =
    payments.filter(function(p){

        return (

            p.username
            .toLowerCase()
            .includes(search)

            ||

            p.phone
            .includes(search)

            ||

            p.method
            .toLowerCase()
            .includes(search)

        );

    });


    if(
        filtered.length === 0
    ){

        table.innerHTML = `

        <tr>

        <td colspan="8">

        No Payments Found

        </td>

        </tr>

        `;

        return;

    }


    filtered.forEach(
    function(p,index){

        table.innerHTML += `

        <tr>

        <td>
        ${index + 1}
        </td>

        <td>
        ${p.username}
        </td>

        <td>
        ${p.phone}
        </td>

        <td>
        ₹${p.amount}
        </td>

        <td>
        ${p.plan}
        </td>

        <td>
        ${p.status}
        </td>

        <td>
        ${p.date}
        </td>

        <td>

        <button
        class="action whatsapp"
        onclick="sendWhatsApp(${p.id})">

        WhatsApp

        </button>


        <button
        class="action delete"
        onclick="deletePayment(${p.id})">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}


/* =========================
   SEND WHATSAPP AGAIN
========================= */

function sendWhatsApp(id){

    let payment =
    payments.find(
    p => p.id === id
    );


    if(!payment){

        return;

    }


    let user =
    users.find(
    u =>
    u.username ===
    payment.username
    );


    if(!user){

        alert(
        "User not found."
        );

        return;

    }


    let support =
    document.getElementById(
    "support"
    ).value;


    let upi =
    document.getElementById(
    "upi"
    ).value;


    let message =

`SERVICE ACTIVATION

Username : ${user.username}
Password : ${user.password}
Portal URL : ${user.portal}

Plan : ${user.plan}
Amount : ₹${user.amount}
Valid Upto : ${user.expiry}

UPI ID : ${upi}

Support : ${support}

Thank you for choosing SUPER IPTV.`;


    let phone =
    user.phone
    .replace(/\D/g, "");


    if(
        phone.length === 10
    ){

        phone =
        "91" + phone;

    }


    window.open(

        "https://wa.me/" +

        phone +

        "?text=" +

        encodeURIComponent(message),

        "_blank"

    );

}


/* =========================
   DELETE PAYMENT
========================= */

function deletePayment(id){

    if(
        !confirm(
        "Delete this payment?"
        )
    ){

        return;

    }


    payments =
    payments.filter(
    p => p.id !== id
    );


    localStorage.setItem(

        "payments",

        JSON.stringify(payments)

    );


    loadPayments();

    updateStats();

}


/* =========================
   UPDATE STATS
========================= */

function updateStats(){

    let total =
    payments.length;


    let paid =
    payments.filter(
    p => p.status === "Paid"
    ).length;


    let pending =
    payments.filter(
    p => p.status === "Pending"
    ).length;


    let revenue =
    payments

    .filter(
    p => p.status === "Paid"
    )

    .reduce(

    (sum,p) =>

    sum +
    Number(p.amount),

    0

    );


    document.getElementById(
    "totalPayments"
    )
    .innerText = total;


    document.getElementById(
    "paidPayments"
    )
    .innerText = paid;


    document.getElementById(
    "pendingPayments"
    )
    .innerText = pending;


    document.getElementById(
    "totalRevenue"
    )
    .innerText =
    "₹" + revenue;

}


/* =========================
   INITIAL LOAD
========================= */

window.addEventListener(
"DOMContentLoaded",
function(){

    updateAmount();

    loadPayments();

    updateStats();

});
