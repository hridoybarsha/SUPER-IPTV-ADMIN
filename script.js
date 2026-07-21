/* =====================================================
   SUPER IPTV
   FINAL CUSTOMER DATABASE
   PLAN QR + WHATSAPP + PAYMENTS
===================================================== */


/* =========================
   PLAN PRICES
========================= */

const PLAN_PRICES = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,
   
    "12 Months": 2000,

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

Scan QR code available in dashboard.

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

function saveDatabase(){

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

function saveSettingsData(){

localStorage.setItem(
"SUPER_IPTV_SETTINGS",
JSON.stringify(settings)
);

}



/* =========================
   NAVIGATION
========================= */

document
.querySelectorAll(".menu-btn")
.forEach(function(button){

button.addEventListener(
"click",
function(){

const page =
this.dataset.page;


document
.querySelectorAll(".page")
.forEach(function(item){

item.classList.remove(
"active"
);

});


document
.querySelectorAll(".menu-btn")
.forEach(function(item){

item.classList.remove(
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


if(page === "dashboard"){

updateDashboard();

}


if(page === "users"){

renderUsers();

}


if(page === "payments"){

renderPayments();

}


if(page === "reports"){

updateReports();

}

});

});



/* =========================
   CALCULATE EXPIRY
========================= */

function calculateExpiry(plan){

const date =
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


return date;

}



/* =========================
   FORMAT DATE
========================= */

function formatDate(date){

return new Date(date)
.toLocaleDateString(
"en-IN",
{
day:"2-digit",
month:"2-digit",
year:"numeric"
}
);

}



/* =========================
   GENERATE QR
========================= */

function generateQR(plan){

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


if(!qrContainer){

return;

}


qrContainer.innerHTML =
"";


if(!plan){

if(amountInput){

amountInput.value =
"";

}

qrPlan.innerText =
"Select a plan to generate QR";

return;

}


const amount =
PLAN_PRICES[plan];


if(amountInput){

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


if(typeof QRCode ===
"undefined"){

qrPlan.innerText =
"QR Library not loaded";

return;

}


new QRCode(
qrContainer,
{
text:upiLink,
width:220,
height:220,
colorDark:"#000000",
colorLight:"#ffffff",
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

const planSelect =
document.getElementById(
"plan"
);


if(planSelect){

planSelect.addEventListener(
"change",
function(){

generateQR(
this.value
);

});

}



/* =========================
   ADD CUSTOMER
========================= */

document
.getElementById(
"userForm"
)
.addEventListener(
"submit",
function(event){

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


if(!PLAN_PRICES[plan]){

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

id:Date.now(),

name:name,

phone:phone,

username:username,

password:password,

portalUrl:portalUrl,

plan:plan,

amount:amount,

paymentStatus:
paymentStatus,

createdAt:
new Date()
.toISOString(),

expiry:
expiry.toISOString()

};


users.push(
user
);


payments.push({

id:
Date.now() + 1,

userId:
user.id,

name:name,

phone:phone,

plan:plan,

amount:amount,

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


document
.getElementById(
"amount"
)
.value =
"";


generateQR(
""
);

});



/* =========================
   RENDER USERS
========================= */

function renderUsers(){

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
.value || ""
)
.toLowerCase();


const filtered =
users.filter(function(user){

return(

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


if(filtered.length === 0){

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
.map(function(user){

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

<span class="status
${
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

function createMessage(user){

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



/* =========================
   WHATSAPP
========================= */

function sendWhatsApp(id){

const user =
users.find(function(item){

return item.id === id;

});


if(!user){

alert(
"Customer not found"
);

return;

}


let number =
String(user.phone)
.replace(
(/\D/g),
""
);


if(number.length === 10){

number =
"91" +
number;

}


if(number.length < 10){

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



/* =========================
   COPY MESSAGE
========================= */

function copyMessage(id){

const user =
users.find(function(item){

return item.id === id;

});


if(!user){

return;

}


const message =
createMessage(
user
);


if(
navigator.clipboard
){

navigator.clipboard
.writeText(
message
)
.then(function(){

alert(
"WhatsApp Message Copied!"
);

});

}

}



/* =========================
   DELETE USER
========================= */

function deleteUser(id){

if(!confirm(
"Delete this customer?"
)){

return;

}


users =
users.filter(function(user){

return user.id !== id;

});


payments =
payments.filter(function(payment){

return payment.userId !== id;

});


saveDatabase();


renderUsers();

renderPayments();

updateDashboard();

updateReports();

}



/* =========================
   PAYMENTS
========================= */

function renderPayments(){

const table =
document.getElementById(
"paymentsTable"
);


if(payments.length === 0){

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
.map(function(payment){

return `

<tr>

<td>
${payment.name}
</td>

<td>
${payment.phone}
</td>

<td>
${payment.plan}
</td>

<td>
₹${payment.amount}
</td>

<td>
${payment.status}
</td>

<td>
${formatDate(payment.date)}
</td>

</tr>

`;

})
.join("");

}



/* =========================
   PAYMENT SUMMARY
========================= */

function updatePaymentSummary(){

const total =
payments.length;


const paid =
payments.filter(function(payment){

return payment.status ===
"Paid";

}).length;


const pending =
payments.filter(function(payment){

return payment.status ===
"Pending";

}).length;


const revenue =
payments
.filter(function(payment){

return payment.status ===
"Paid";

})
.reduce(function(total,payment){

return total +
Number(
payment.amount
);

},0);


document
.getElementById(
"totalPayments"
)
.innerText =
total;


document
.getElementById(
"paidPayments"
)
.innerText =
paid;


document
.getElementById(
"pendingPayments"
)
.innerText =
pending;


document
.getElementById(
"paymentRevenue"
)
.innerText =
"₹" +
revenue;

}



/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

const total =
users.length;


const active =
users.filter(function(user){

return new Date(
user.expiry
) >=
new Date();

}).length;


const expired =
total -
active;


const revenue =
payments
.filter(function(payment){

return payment.status ===
"Paid";

})
.reduce(function(total,payment){

return total +
Number(
payment.amount
);

},0);


document
.getElementById(
"totalUsers"
)
.innerText =
total;


document
.getElementById(
"activeUsers"
)
.innerText =
active;


document
.getElementById(
"expiredUsers"
)
.innerText =
expired;


document
.getElementById(
"totalRevenue"
)
.innerText =
"₹" +
revenue;


const table =
document.getElementById(
"recentUsers"
);


if(users.length === 0){

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
.slice(0,10)
.map(function(user){

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
${user.plan}
</td>

<td>

<span class="status
${
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
${formatDate(user.expiry)}
</td>

</tr>

`;

})
.join("");

}



/* =========================
   REPORTS
========================= */

function updateReports(){

const revenue =
payments
.filter(function(payment){

return payment.status ===
"Paid";

})
.reduce(function(total,payment){

return total +
Number(
payment.amount
);

},0);


const paid =
payments.filter(function(payment){

return payment.status ===
"Paid";

}).length;


const pending =
payments.filter(function(payment){

return payment.status ===
"Pending";

}).length;


document
.getElementById(
"reportRevenue"
)
.innerText =
"₹" +
revenue;


document
.getElementById(
"paidCount"
)
.innerText =
paid;


document
.getElementById(
"pendingCount"
)
.innerText =
pending;


updatePaymentSummary();

}

/* =========================
   DOWNLOAD QR CODE
========================= */

document.getElementById("downloadQR").addEventListener("click", function () {

    const qrContainer = document.getElementById("qrcode");

    if (!qrContainer) {
        alert("QR Code container পাওয়া যায়নি");
        return;
    }

    // QR Canvas
    const canvas = qrContainer.querySelector("canvas");

    // QR Image
    const image = qrContainer.querySelector("img");

    if (canvas) {

        const link = document.createElement("a");

        link.download = "SUPER-IPTV-Payment-QR.png";

        link.href = canvas.toDataURL("image/png");

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return;
    }

    if (image) {

        const link = document.createElement("a");

        link.download = "SUPER-IPTV-Payment-QR.png";

        link.href = image.src;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return;
    }

    alert("প্রথমে একটি Plan Select করুন এবং QR Code তৈরি করুন");

});


/* =========================
   SETTINGS LOAD
========================= */

function loadSettings(){

document
.getElementById(
"settingUpi"
)
.value =
settings.upi;


document
.getElementById(
"settingContact"
)
.value =
settings.contact;


document
.getElementById(
"settingPortal"
)
.value =
settings.portal;


document
.getElementById(
"messageTemplate"
)
.value =
messageTemplate;

}



/* =========================
   SAVE SETTINGS
========================= */

document
.getElementById(
"saveSettings"
)
.addEventListener(
"click",
function(){

settings.upi =
document
.getElementById(
"settingUpi"
)
.value
.trim();


settings.contact =
document
.getElementById(
"settingContact"
)
.value
.trim();


settings.portal =
document
.getElementById(
"settingPortal"
)
.value
.trim();


saveSettingsData();


alert(
"Settings Saved Successfully!"
);

});



/* =========================
   SAVE TEMPLATE
========================= */

document
.getElementById(
"saveTemplate"
)
.addEventListener(
"click",
function(){

messageTemplate =
document
.getElementById(
"messageTemplate"
)
.value;


localStorage.setItem(

"SUPER_IPTV_TEMPLATE",

messageTemplate

);


alert(
"WhatsApp Template Saved!"
);

});



/* =========================
   DELETE ALL
========================= */

document
.getElementById(
"deleteAll"
)
.addEventListener(
"click",
function(){

if(!confirm(
"Delete ALL Users and Payments?"
)){

return;

}


users = [];

payments = [];


saveDatabase();


renderUsers();

renderPayments();

updateDashboard();

updateReports();


alert(
"All Data Deleted!"
);

});



/* =========================
   START SYSTEM
========================= */

loadSettings();

updateDashboard();

renderUsers();

renderPayments();

updateReports();


console.log(
"SUPER IPTV FINAL SYSTEM READY"
);
