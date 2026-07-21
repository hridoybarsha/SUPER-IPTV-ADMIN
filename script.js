/* =========================================================
   SUPER IPTV - COMPLETE JAVASCRIPT
========================================================= */


/* =========================
   LOGIN
========================= */

function login() {

    const username =
        document.getElementById("user")?.value.trim();

    const password =
        document.getElementById("pass")?.value.trim();

    if (username === "admin" && password === "123456") {

        localStorage.setItem("login", "true");

        window.location.href = "dashboard.html";

    } else {

        alert("Wrong Username or Password");

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("login");

    window.location.href = "index.html";

}


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

    "3 Months": 550,

    "6 Months": 1000

};


/* =========================
   PAGE PROTECTION
========================= */

if (
    window.location.pathname.endsWith("dashboard.html")
) {

    if (
        localStorage.getItem("login") !== "true"
    ) {

        window.location.href = "index.html";

    }

}


/* =========================
   SHOW SECTION
========================= */

function showSection(section) {

    const sections = [

        "dashboard",

        "users",

        "payments",

        "reports",

        "settings"

    ];


    sections.forEach(function(item) {

        const element =
            document.getElementById(
                item + "Section"
            );

        if (element) {

            element.classList.add("hidden");

        }

    });


    const activeSection =
        document.getElementById(
            section + "Section"
        );

    if (activeSection) {

        activeSection.classList.remove("hidden");

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(function(btn) {

            btn.classList.remove("active");

        });


    const buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(function(btn) {

        if (
            btn.innerText
                .toLowerCase()
                .includes(section)
        ) {

            btn.classList.add("active");

        }

    });


    if (section === "dashboard") {

        updateDashboard();

    }


    if (section === "users") {

        renderUsers();

    }


    if (section === "payments") {

        renderPayments();

    }


    if (section === "reports") {

        updateReports();

    }

}


/* =========================
   CALCULATE EXPIRY
========================= */

function calculateExpiry(plan) {

    const date = new Date();

    if (plan === "1 Month") {

        date.setMonth(
            date.getMonth() + 1
        );

    }

    if (plan === "3 Months") {

        date.setMonth(
            date.getMonth() + 3
        );

    }

    if (plan === "6 Months") {

        date.setMonth(
            date.getMonth() + 6
        );

    }

    return date.toISOString();

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date)
        .toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric"

        });

}


/* =========================
   CHECK STATUS
========================= */

function getStatus(user) {

    if (
        new Date(user.expiry) >= new Date()
    ) {

        return "Active";

    }

    return "Expired";

}


/* =========================
   USER FORM
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const form =
            document.getElementById("userForm");


        if (form) {

            form.addEventListener(
                "submit",
                saveUser
            );

        }


        updateDashboard();

        renderUsers();

        renderPayments();

        updateReports();

    }
);


/* =========================
   SAVE USER
========================= */

function saveUser(e) {

    e.preventDefault();


    const editId =
        document.getElementById(
            "editUserId"
        ).value;


    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    const username =
        document.getElementById(
            "customerUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "customerPassword"
        ).value.trim();


    const plan =
        document.getElementById(
            "customerPlan"
        ).value;


    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        ).value;


    if (
        !name ||
        !phone ||
        !username ||
        !password ||
        !plan
    ) {

        alert(
            "Please fill all required fields"
        );

        return;

    }


    const price =
        planPrices[plan];


    if (editId) {

        const user =
            users.find(
                u => u.id == editId
            );


        if (user) {

            user.name = name;

            user.phone = phone;

            user.username = username;

            user.password = password;

            user.plan = plan;

            user.price = price;

            user.paymentStatus =
                paymentStatus;

        }

        alert("User updated successfully");

    } else {

        const user = {

            id: Date.now(),

            name: name,

            phone: phone,

            username: username,

            password: password,

            plan: plan,

            price: price,

            paymentStatus:
                paymentStatus,

            createdAt:
                new Date().toISOString(),

            expiry:
                calculateExpiry(plan)

        };


        users.push(user);


        payments.push({

            id: Date.now(),

            userId: user.id,

            name: name,

            phone: phone,

            plan: plan,

            amount: price,

            status: paymentStatus,

            date:
                new Date().toISOString()

        });


        alert("User added successfully");

    }


    saveData();


    document
        .getElementById("userForm")
        .reset();


    document
        .getElementById("editUserId")
        .value = "";


    document
        .getElementById("userFormTitle")
        .innerText =
        "Add New User";


    document
        .getElementById("saveUserBtn")
        .innerText =
        "➕ Add User";


    document
        .getElementById("cancelEditBtn")
        .classList.add("hidden");


    updateDashboard();

    renderUsers();

    renderPayments();

    updateReports();

}


/* =========================
   SAVE LOCAL STORAGE
========================= */

function saveData() {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
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


    if (!table) return;


    const search =
        document.getElementById(
            "userSearch"
        )?.value
        .toLowerCase() || "";


    const filteredUsers =
        users.filter(function(user) {

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

        });


    if (filteredUsers.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="8"
                    class="empty-state">

                    No users found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filteredUsers
        .map(function(user) {

            const status =
                getStatus(user);


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
                        ₹${user.price}
                    </td>

                    <td>

                        <span class="
                            status
                            ${status === "Active"
                                ? "status-active"
                                : "status-expired"}
                        ">

                            ${status}

                        </span>

                    </td>

                    <td>
                        ${formatDate(user.expiry)}
                    </td>

                    <td>

                        <div class="
                            action-buttons
                        ">

                            <button
                                class="btn-primary"
                                onclick="editUser(${user.id})"
                            >
                                Edit
                            </button>


                            <button
                                class="btn-danger"
                                onclick="deleteUser(${user.id})"
                            >
                                Delete
                            </button>


                            <button
                                class="btn-whatsapp"
                                onclick="openWhatsApp('${escapeHTML(user.phone)}')"
                            >
                                WhatsApp
                            </button>


                            <button
                                class="btn-call"
                                onclick="callUser('${escapeHTML(user.phone)}')"
                            >
                                Call
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        })
        .join("");

}


/* =========================
   EDIT USER
========================= */

function editUser(id) {

    const user =
        users.find(
            u => u.id == id
        );


    if (!user) return;


    document
        .getElementById(
            "editUserId"
        )
        .value = user.id;


    document
        .getElementById(
            "customerName"
        )
        .value = user.name;


    document
        .getElementById(
            "customerPhone"
        )
        .value = user.phone;


    document
        .getElementById(
            "customerUsername"
        )
        .value = user.username;


    document
        .getElementById(
            "customerPassword"
        )
        .value = user.password;


    document
        .getElementById(
            "customerPlan"
        )
        .value = user.plan;


    document
        .getElementById(
            "paymentStatus"
        )
        .value =
        user.paymentStatus || "Paid";


    document
        .getElementById(
            "userFormTitle"
        )
        .innerText =
        "Edit User";


    document
        .getElementById(
            "saveUserBtn"
        )
        .innerText =
        "💾 Update User";


    document
        .getElementById(
            "cancelEditBtn"
        )
        .classList
        .remove("hidden");


    showSection("users");

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================
   CANCEL EDIT
========================= */

function cancelEdit() {

    document
        .getElementById(
            "userForm"
        )
        .reset();


    document
        .getElementById(
            "editUserId"
        )
        .value = "";


    document
        .getElementById(
            "userFormTitle"
        )
        .innerText =
        "Add New User";


    document
        .getElementById(
            "saveUserBtn"
        )
        .innerText =
        "➕ Add User";


    document
        .getElementById(
            "cancelEditBtn"
        )
        .classList
        .add("hidden");

}


/* =========================
   DELETE USER
========================= */

function deleteUser(id) {

    const user =
        users.find(
            u => u.id == id
        );


    if (!user) return;


    if (
        !confirm(
            `Delete ${user.name}?`
        )
    ) {

        return;

    }


    users =
        users.filter(
            u => u.id != id
        );


    payments =
        payments.filter(
            p => p.userId != id
        );


    saveData();


    renderUsers();

    renderPayments();

    updateDashboard();

    updateReports();

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(
            u => getStatus(u) === "Active"
        ).length;


    const expired =
        users.filter(
            u => getStatus(u) === "Expired"
        ).length;


    const revenue =
        payments
        .filter(
            p => p.status === "Paid"
        )
        .reduce(
            (sum, p) =>
                sum + Number(p.amount || 0),
            0
        );


    const totalElement =
        document.getElementById(
            "totalUsers"
        );


    const activeElement =
        document.getElementById(
            "activeUsers"
        );


    const expiredElement =
        document.getElementById(
            "expiredUsers"
        );


    const revenueElement =
        document.getElementById(
            "revenue"
        );


    if (totalElement)
        totalElement.innerText =
            total;


    if (activeElement)
        activeElement.innerText =
            active;


    if (expiredElement)
        expiredElement.innerText =
            expired;


    if (revenueElement)
        revenueElement.innerText =
            "₹" + revenue;


    const table =
        document.getElementById(
            "dashboardTable"
        );


    if (!table) return;


    const recent =
        [...users]
        .sort(
            (a, b) =>
                new Date(b.createdAt)
                -
                new Date(a.createdAt)
        )
        .slice(0, 10);


    if (recent.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    class="empty-state">

                    No users yet

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        recent
        .map(function(user) {

            const status =
                getStatus(user);


            return `

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

                        <span class="
                            status
                            ${status === "Active"
                                ? "status-active"
                                : "status-expired"}
                        ">

                            ${status}

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
   PAYMENTS
========================= */

function renderPayments() {

    const table =
        document.getElementById(
            "paymentsTable"
        );


    if (!table) return;


    if (payments.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    class="empty-state">

                    No payment records

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        [...payments]
        .reverse()
        .map(function(payment) {

            return `

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

                        <span class="
                            status
                            ${payment.status === "Paid"
                                ? "status-active"
                                : "status-expired"}
                        ">

                            ${payment.status}

                        </span>

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
   REPORTS
========================= */

function updateReports() {

    const paid =
        payments.filter(
            p => p.status === "Paid"
        ).length;


    const pending =
        payments.filter(
            p => p.status === "Pending"
        ).length;


    const revenue =
        payments
        .filter(
            p => p.status === "Paid"
        )
        .reduce(
            (sum, p) =>
                sum + Number(p.amount || 0),
            0
        );


    const revenueElement =
        document.getElementById(
            "reportRevenue"
        );


    const paidElement =
        document.getElementById(
            "paidPayments"
        );


    const pendingElement =
        document.getElementById(
            "pendingPayments"
        );


    if (revenueElement)
        revenueElement.innerText =
            "₹" + revenue;


    if (paidElement)
        paidElement.innerText =
            paid;


    if (pendingElement)
        pendingElement.innerText =
            pending;

}


/* =========================
   WHATSAPP
========================= */

function openWhatsApp(phone) {

    let number =
        phone.replace(/\D/g, "");


    if (
        number.length === 10
    ) {

        number =
            "91" + number;

    }


    window.open(
        "https://wa.me/" + number,
        "_blank"
    );

}


/* =========================
   CALL
========================= */

function callUser(phone) {

    window.location.href =
        "tel:" + phone;

}


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(
   