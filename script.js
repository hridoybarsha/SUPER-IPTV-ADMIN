/* =========================================================
   SUPER IPTV - COMPLETE SCRIPT
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

let users =
JSON.parse(
localStorage.getItem("superIptvUsers")
) || [];


let payments =
JSON.parse(
localStorage.getItem("superIptvPayments")
) || [];



/* =========================================================
   PLAN PRICES
========================================================= */

const planPrices = {

    "1 Month": 200,

    "3 Months": 550,

    "6 Months": 1000

};



/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {

    localStorage.setItem(
        "superIptvUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "superIptvPayments",
        JSON.stringify(payments)
    );

}



/* =========================================================
   SECTION NAVIGATION
========================================================= */

function showSection(
    section,
    button
) {


    const sections = [

        "dashboard",

        "users",

        "payments",

        "reports",

        "settings"

    ];


    sections.forEach(
        function(name) {


            const element =
            document.getElementById(
                name + "Section"
            );


            if(element) {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );



    const activeSection =
    document.getElementById(
        section + "Section"
    );


    if(activeSection) {

        activeSection.classList.remove(
            "hidden"
        );

    }



    document
    .querySelectorAll(
        ".nav-btn"
    )
    .forEach(
        function(btn) {

            btn.classList.remove(
                "active"
            );

        }
    );



    if(button) {

        button.classList.add(
            "active"
        );

    }



    if(section === "dashboard") {

        updateDashboard();

    }


    if(section === "users") {

        renderUsers();

    }


    if(section === "payments") {

        renderPayments();

    }


    if(section === "reports") {

        updateReports();

    }

}



/* =========================================================
   EXPIRY DATE
========================================================= */

function calculateExpiry(plan) {


    const date =
    new Date();


    if(plan === "1 Month") {

        date.setMonth(
            date.getMonth() + 1
        );

    }


    if(plan === "3 Months") {

        date.setMonth(
            date.getMonth() + 3
        );

    }


    if(plan === "6 Months") {

        date.setMonth(
            date.getMonth() + 6
        );

    }


    return date.toISOString();

}



/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {


    if(!date) {

        return "-";

    }


    return new Date(date)
    .toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric"

        }
    );

}



/* =========================================================
   STATUS
========================================================= */

function getStatus(user) {


    if(
        new Date(user.expiry)
        >=
        new Date()
    ) {

        return "Active";

    }


    return "Expired";

}



/* =========================================================
   ADD / UPDATE USER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        const form =
        document.getElementById(
            "userForm"
        );


        if(form) {

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



function saveUser(event) {


    event.preventDefault();



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
    planPrices[plan];



    /* UPDATE */

    if(editId) {


        const user =
        users.find(
            function(item) {

                return item.id == editId;

            }
        );


        if(user) {


            user.name =
            name;


            user.phone =
            phone;


            user.username =
            username;


            user.password =
            password;


            user.plan =
            plan;


            user.price =
            price;


            user.paymentStatus =
            paymentStatus;


        }


        alert(
            "User updated successfully"
        );


    }



    /* ADD */

    else {


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


            paymentStatus:
            paymentStatus,


            createdAt:
            new Date()
            .toISOString(),


            expiry:
            calculateExpiry(
                plan
            )


        };



        users.push(
            user
        );



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
            new Date()
            .toISOString()


        });



        alert(
            "User added successfully"
        );

    }



    saveData();


    resetUserForm();


    updateDashboard();


    renderUsers();


    renderPayments();


    updateReports();

}



/* =========================================================
   RESET FORM
========================================================= */

function resetUserForm() {


    const form =
    document.getElementById(
        "userForm"
    );


    if(form) {

        form.reset();

    }



    document.getElementById(
        "editUserId"
    ).value =
    "";



    document.getElementById(
        "userFormTitle"
    ).innerText =
    "Add New User";



    document.getElementById(
        "saveUserBtn"
    ).innerText =
    "➕ Add User";



    document.getElementById(
        "cancelEditBtn"
    ).classList.add(
        "hidden"
    );

}



/* =========================================================
   EDIT USER
========================================================= */

function editUser(id) {


    const user =
    users.find(
        function(item) {

            return item.id == id;

        }
    );


    if(!user) {

        return;

    }



    document.getElementById(
        "editUserId"
    ).value =
    user.id;



    document.getElementById(
        "customerName"
    ).value =
    user.name;



    document.getElementById(
        "customerPhone"
    ).value =
    user.phone;



    document.getElementById(
        "customerUsername"
    ).value =
    user.username;



    document.getElementById(
        "customerPassword"
    ).value =
    user.password;



    document.getElementById(
        "customerPlan"
    ).value =
    user.plan;



    document.getElementById(
        "paymentStatus"
    ).value =
    user.paymentStatus ||
    "Paid";



    document.getElementById(
        "userFormTitle"
    ).innerText =
    "Edit User";



    document.getElementById(
        "saveUserBtn"
    ).innerText =
    "💾 Update User";



    document.getElementById(
        "cancelEditBtn"
    ).classList.remove(
        "hidden"
    );



    showSection(
        "users",
        document.querySelectorAll(
            ".nav-btn"
        )[1]
    );



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



/* =========================================================
   CANCEL EDIT
========================================================= */

function cancelEdit() {

    resetUserForm();

}



/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(id) {


    const user =
    users.find(
        function(item) {

            return item.id == id;

        }
    );


    if(!user) {

        return;

    }



    const confirmDelete =
    confirm(
        "Delete " +
        user.name +
        "?"
    );


    if(!confirmDelete) {

        return;

    }



    users =
    users.filter(
        function(item) {

            return item.id != id;

        }
    );



    payments =
    payments.filter(
        function(item) {

            return item.userId != id;

        }
    );



    saveData();


    renderUsers();


    renderPayments();


    updateDashboard();


    updateReports();

}



/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers() {


    const table =
    document.getElementById(
        "usersTable"
    );


    if(!table) {

        return;

    }



    const search =
    (
        document.getElementById(
            "userSearch"
        ).value ||
        ""
    )
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

        <td
        colspan="9"
        class="empty-state"
        >

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


            const status =
            getStatus(
                user
            );


            return `

            <tr>

            <td>
            ${user.id}
            </td>


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

            <span
            class="
            status
            ${
            status === "Active"
            ?
            "status-active"
            :
            "status-expired"
            }
            "
            >

            ${status}

            </span>

            </td>


            <td>
            ${formatDate(user.expiry)}
            </td>


            <td>


            <div
            class="action-buttons"
            >


            <button
            class="btn-whatsapp"
            onclick="openWhatsApp('${user.phone}')"
            >

            WhatsApp

            </button>


            <button
            class="btn-call"
            onclick="callUser('${user.phone}')"
            >

            Call

            </button>


            <button
            class="btn-warning"
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


            </div>


            </td>


            </tr>

            `;

        }
    )
    .join("");

}



/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {


    const total =
    users.length;



    const active =
    users.filter(
        function(user) {

            return (
                getStatus(user)
                ===
                "Active"
            );

        }
    ).length;



    const expired =
    users.filter(
        function(user) {

            return (
                getStatus(user)
                ===
                "Expired"
            );

        }
    ).length;



    const revenue =
    payments
    .filter(
        function(payment) {

            return (
                payment.status
                ===
                "Paid"
            );

        }
    )
    .reduce(
        function(total, payment) {

            return (
                total +
                Number(
                    payment.amount
                )
            );

        },
        0
    );



    document.getElementById(
        "totalUsers"
    ).innerText =
    total;



    document.getElementById(
        "activeUsers"
    ).innerText =
    active;



    document.getElementById(
        "expiredUsers"
    ).innerText =
    expired;



    document.getElementById(
        "revenue"
    ).innerText =
    "₹" +
    revenue;



    const table =
    document.getElementById(
        "dashboardTable"
    );



    if(!table) {

        return;

    }



    const recent =
    [...users]
    .sort(
        function(a,b) {

            return (
                new Date(
                    b.createdAt
                )
                -
                new Date(
                    a.createdAt
                )
            );

        }
    )
    .slice(
        0,
        10
    );



    if(
        recent.length === 0
    ) {


        table.innerHTML = `

        <tr>

        <td
        colspan="5"
        class="empty-state"
        >

        No Users Yet

        </td>

        </tr>

        `;


        return;

    }



    table.innerHTML =
    recent
    .map(
        function(user) {


            const status =
            getStatus(
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
            ${escapeHTML(user.plan)}
            </td>


            <td>

            <span
            class="
            status
            ${
            status === "Active"
            ?
            "status-active"
            :
            "status-expired"
            }
            "
            >

            ${status}

            </span>

            </td>


            <td>
            ${formatDate(user.expiry)}
            </td>


            </tr>

            `;

        }
    )
    .join("");

}



/* =========================================================
   PAYMENTS
========================================================= */

function renderPayments() {


    const table =
    document.getElementById(
        "paymentsTable"
    );


    if(!table) {

        return;

    }



    if(
        payments.length === 0
    ) {


        table.innerHTML = `

        <tr>

        <td
        colspan="6"
        class="empty-state"
        >

        No Payments Found

        </td>

        </tr>

        `;


        return;

    }



    table.innerHTML =
    [...payments]
    .reverse()
    .map(
        function(payment) {


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

            <span
            class="
            status
            ${
            payment.status === "Paid"
            ?
            "status-active"
            :
            "status-expired"
            }
            "
            >

            ${payment.status}

            </span>

            </td>


            <td>
            ${formatDate(payment.date)}
            </td>


            </tr>

            `;

        }
    )
    .join("");

}



/* =========================================================
   REPORTS
========================================================= */

function updateReports() {


    const paid =
    payments.filter(
        function(payment) {

            return (
                payment.status
                ===
                "Paid"
            );

        }
    ).length;



    const pending =
    payments.filter(
        function(payment) {

            return (
                payment.status
                ===
                "Pending"
            );

        }
    ).length;



    const revenue =
    payments
    .filter(
        function(payment) {

            return (
                payment.status
                ===
                "Paid"
            );

        }
    )
    .reduce(
        function(total, payment) {

            return (
                total +
                Number(
                    payment.amount
                )
            );

        },
        0
    );



    document.getElementById(
        "reportRevenue"
    ).innerText =
    "₹" +
    revenue;



    document.getElementById(
        "paidPayments"
    ).innerText =
    paid;



    document.getElementById(
        "pendingPayments"
    ).innerText =
    pending;

}



/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(
    phone
) {


    let number =
    String(phone)
    .replace(
        /\D/g,
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



/* =========================================================
   CALL
========================================================= */

function callUser(
    phone
) {


    window.location.href =
    "tel:" +
    phone;

}



/* =========================================================
   CLEAR ALL DATA
========================================================= */

function clearAllData() {


    const confirmClear =
    confirm(
        "Are you sure you want to delete ALL users and payment data?"
    );


    if(!confirmClear) {

        return;

    }



    users = [];


    payments = [];


    saveData();


    updateDashboard();


    renderUsers();


    renderPayments();


    update