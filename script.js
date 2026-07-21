/* ============================================
   SUPER IPTV
   COMPLETE WORKING JAVASCRIPT
============================================ */


/* =========================
   PLAN PRICES
========================= */

const prices = {

    "1 Month": 200,

    "3 Months": 550,

    "6 Months": 1000

};



/* =========================
   LOAD DATA
========================= */

let users =
JSON.parse(
localStorage.getItem(
"superIPTV_users"
)
) || [];


let payments =
JSON.parse(
localStorage.getItem(
"superIPTV_payments"
)
) || [];



/* =========================
   SAVE DATA
========================= */

function saveData() {

localStorage.setItem(
"superIPTV_users",
JSON.stringify(users)
);


localStorage.setItem(
"superIPTV_payments",
JSON.stringify(payments)
);

}



/* =========================
   MENU SYSTEM
========================= */

document
.querySelectorAll(".menu-btn")
.forEach(function(button) {


button.addEventListener(
"click",
function() {


const pageName =
this.getAttribute(
"data-page"
);


console.log(
"Menu clicked:",
pageName
);



/* Hide pages */

document
.querySelectorAll(".page")
.forEach(function(page) {

page.classList.remove(
"active"
);

});



/* Remove active */

document
.querySelectorAll(".menu-btn")
.forEach(function(btn) {

btn.classList.remove(
"active"
);

});



/* Show selected page */

const selectedPage =
document.getElementById(
pageName
);


if(selectedPage) {

selectedPage.classList.add(
"active"
);

}



/* Active button */

this.classList.add(
"active"
);



/* Refresh */

if(pageName === "dashboard") {

updateDashboard();

}


if(pageName === "users") {

renderUsers();

}


if(pageName === "payments") {

renderPayments();

}


if(pageName === "reports") {

updateReports();

}


}

);

});



/* =========================
   ADD USER
========================= */

const userForm =
document.getElementById(
"userForm"
);


userForm.addEventListener(
"submit",
function(event) {


event.preventDefault();



const name =
document
.getElementById("name")
.value
.trim();


const phone =
document
.getElementById("phone")
.value
.trim();


const username =
document
.getElementById("username")
.value
.trim();


const password =
document
.getElementById("password")
.value
.trim();


const plan =
document
.getElementById("plan")
.value;


const paymentStatus =
document
.getElementById(
"paymentStatus"
)
.value;



if(
!name ||
!phone ||
!username ||
!password ||
!plan
) {

alert(
"Please fill all fields"
);

return;

}



const price =
prices[plan];



/* EXPIRY */

const expiry =
new Date();


if(
plan === "1 Month"
) {

expiry.setMonth(
expiry.getMonth() + 1
);

}


if(
plan === "3 Months"
) {

expiry.setMonth(
expiry.getMonth() + 3
);

}


if(
plan === "6 Months"
) {

expiry.setMonth(
expiry.getMonth() + 6
);

}



/* USER */

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

plan:
plan,

price:
price,

status:
"Active",

paymentStatus:
paymentStatus,

expiry:
expiry.toISOString(),

createdAt:
new Date().toISOString()

};



users.push(
user
);



/* PAYMENT */

payments.push({

id:
Date.now(),

userId:
user.id,

name:
name,

phone:
phone,

plan:
plan,

amount:
price,

status:
paymentStatus,

date:
new Date().toISOString()

});



saveData();



userForm.reset();



alert(
"User Added Successfully!"
);



updateDashboard();

renderUsers();

renderPayments();

updateReports();


}

);



/* =========================
   DASHBOARD
========================= */

function updateDashboard() {


const total =
users.length;


const active =
users.filter(
function(user) {

return new Date(
user.expiry
) >= new Date();

}
).length;


const expired =
users.filter(
function(user) {

return new Date(
user.expiry
) < new Date();

}
).length;


const revenue =
payments
.filter(
function(payment) {

return payment.status ===
"Paid";

}
)
.reduce(
function(total,payment) {

return total +
Number(
payment.amount
);

},
0
);



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



/* RECENT USERS */

const table =
document
.getElementById(
"recentUsers"
);



if(
users.length === 0
) {

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
.slice(-10)
.reverse()
.map(
function(user) {


const isActive =
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

<span class="
status
${
isActive
?
"active-status"
:
"expired-status"
}
">

${
isActive
?
"Active"
:
"Expired"
}

</span>

</td>

<td>

${
new Date(
user.expiry
)
.toLocaleDateString(
"en-IN"
)
}

</td>

</tr>

`;

}
)
.join("");

}



/* =========================
   USERS TABLE
========================= */

function renderUsers() {


const table =
document
.getElementById(
"usersTable"
);


const search =
document
.getElementById(
"searchUser"
)
.value
.toLowerCase();



const filtered =
users.filter(
function(user) {

return (

user.name
.toLowerCase()
.includes(search)

||

user.phone
.toLowerCase()
.includes(search)

||

user.username
.toLowerCase()
.includes(search)

);

}
);



if(
filtered.length === 0
) {

table.innerHTML = `

<tr>

<td colspan="7">

No Users Found

</td>

</tr>

`;

return;

}



table.innerHTML =
filtered
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
${user.plan}
</td>

<td>

<span class="
status
${
active
?
"active-status"
:
"expired-status"
}
">

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

${
new Date(
user.expiry
)
.toLocaleDateString(
"en-IN"
)
}

</td>

<td>


<button
class="action-btn whatsapp-btn"
onclick="
openWhatsApp(
'${user.phone}'
)
"
>

WhatsApp

</button>



<button
class="action-btn delete-btn"
onclick="
deleteUser(
${user.id}
)
"
>

Delete

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
function() {

renderUsers();

}
);



/* =========================
   DELETE USER
========================= */

function deleteUser(id) {


if(
!confirm(
"Delete this user?"
)
) {

return;

}



users =
users.filter(
function(user) {

return user.id !==
id;

}
);



payments =
payments.filter(
function(payment) {

return payment.userId !==
id;

}
);



saveData();



renderUsers();

renderPayments();

updateDashboard();

updateReports();


}



/* =========================
   PAYMENTS
========================= */

function renderPayments() {


const table =
document
.getElementById(
"paymentsTable"
);



if(
payments.length === 0
) {

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
.map(
function(payment) {


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

${
new Date(
payment.date
)
.toLocaleDateString(
"en-IN"
)
}

</td>

</tr>

`;

}
)
.join("");

}



/* =========================
   REPORTS
========================= */

function updateReports() {


const revenue =
payments
.filter(
function(payment) {

return payment.status ===
"Paid";

}
)
.reduce(
function(total,payment) {

return total +
Number(
payment.amount
);

},
0
);



const paid =
payments.filter(
function(payment) {

return payment.status ===
"Paid";

}
).length;



const pending =
payments.filter(
function(payment) {

return payment.status ===
"Pending";

}
).length;



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

}



/* =========================
   WHATSAPP
========================= */

function openWhatsApp(
phone
) {


let number =
phone.replace(
(/\D/g),
""
);



if(
number.length === 10
) {

number =
"91" +
number;

}



window.open(
"https://wa.me/" +
number,
"_blank"
);

}



/* =========================
   DELETE ALL
========================= */

document
.getElementById(
"deleteAll"
)
.addEventListener(
"click",
function() {


if(
!confirm(
"Delete ALL data?"
)
) {

return;

}



users = [];

payments = [];



saveData();



updateDashboard();

renderUsers();

renderPayments();

updateReports();



alert(
"All data deleted"
);

}
);



/* =========================
   START
========================= */

updateDashboard();

renderUsers();

renderPayments();

updateReports();


console.log(
"SUPER IPTV Admin Panel Ready"
);