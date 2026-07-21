/* =========================================================
   SUPER IPTV - COMPLETE script.js
   Dashboard + Users + Payments + Reports + Settings
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

let users = JSON.parse(
    localStorage.getItem("superIptvUsers")
) || [];

let payments = JSON.parse(
    localStorage.getItem("superIptvPayments")
) || [];


/* =========================================================
   PLAN PRICES
========================================================= */

const planPrices = {
    "1 Month": 200,
    "3 Months": 600,
    "6 Months": 1150
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
   PAGE NAVIGATION
========================================================= */

function showSection(section, button) {

    console.log("Opening section:", section);

    /* Hide all sections */

    document.querySelectorAll(
        ".page-section"
    ).forEach(function(page) {

        page.classList.add("hidden");

    });


    /* Show selected section */

    const selectedSection =
        document.getElementById(
            section + "Section"
        );


    if (selectedSection) {

        selectedSection.classList.remove(
            "hidden"
        );

    } else {

        console.error(
            "Section not found:",
            section + "Section"
        );

        return;

    }


    /* Remove active from all menu buttons */

    document.querySelectorAll(
        ".nav-btn"
    ).forEach(function(btn) {

        btn.classList.remove("active");

    });


    /* Add active to clicked button */

    if (button) {

        button.classList.add("active");

    }


    /* Refresh data */

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
   GET USER STATUS
========================================================= */

function getStatus(user) {

    if (!user.expiry) {

        return "Active";

    }


    const expiryDate =
        new Date(user.expiry);


    const today =
        new Date();


    if (expiryDate >= today) {

        return "Active";

    }


    return "Expired";

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "SUPER IPTV script.js loaded successfully"
        );


        updateDashboard();

        renderUsers();

        renderPayments();

        updateReports();


        /* User form */

        const userForm =
            document.getElementById(
                "userForm"
            );


        if (userForm) {

            userForm.addEventListener(
                "submit",
                saveUser
            );

        }


    }
);


/* =========================================================
   ADD / UPDATE USER
========================================================= */

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


    /* Validation */

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
        planPrices[plan] || 0;


    /* =====================================================
       UPDATE USER
    ===================================================== */

    if (editId) {

        const user =
            users.find(function(item) {

                return String(item.id) ===
                    String(editId);

            });


        if (!user) {

            alert(
                "User not found"
            );

            return;

        }


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


        alert(
            "User updated successfully"
        );

    }


    /* =====================================================
       ADD NEW USER
    ===================================================== */

    else {

        const newUser = {

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
            newUser
        );


        /* Create payment record */

        const newPayment = {

            id:
                Date.now() + 1,

            userId:
                newUser.id,

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

        };


        payments.push(
            newPayment
        );


        alert(
            "User added successfully"
        );

    }


    /* Save */

    saveData();


    /* Reset */

    resetUserForm();


    /* Refresh */

    updateDashboard();

    renderUsers();

    renderPayments();

    updateReports();

}


/* =========================================================
   RESET USER FORM
========================================================= */

function resetUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (form) {

        form.reset();

    }


    const editId =
        document.getElementById(
            "editUserId"
        );


    if (editId) {

        editId.value = "";

    }


    const title =
        document.getElementById(
            "userFormTitle"
        );


    if (title) {

        title.innerText =
            "Add New User";

    }


    const saveButton =
        document.getElementById(
            "saveUserBtn"
        );


    if (saveButton) {

        saveButton.innerText =
            "➕ Add User";

    }


    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    if (cancelButton) {

        cancelButton.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   CANCEL EDIT
========================================================= */

function cancelEdit() {

    resetUserForm();

}


/* =========================================================
   EDIT USER
========================================================= */

function editUser(id) {

    const user =
        users.find(function(item) {

            return String(item.id) ===
                String(id);

        });


    if (!user) {

        alert(
            "User not found"
        );

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


    /* Open Users section */

    const usersButton =
        document.querySelectorAll(
            ".nav-btn"
        )[1];


    showSection(
        "users",
        usersButton
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(id) {

    const user =
        users.find(function(item) {

            return String(item.id) ===
                String(id);

        });


    if (!user) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            user.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    /* Delete user */

    users =
        users.filter(function(item) {

            return String(item.id) !==
                String(id);

        });


    /* Delete user's payments */

    payments =
        payments.filter(function(item) {

            return String(item.userId) !==
                String(id);

        });


    saveData();


    updateDashboard();

    renderUsers();

    renderPayments();

    updateReports();


    alert(
        "User deleted successfully"
    );

}


/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers() {

    const table =
        document.getElementById(
            "usersTable"
        );


    if (!table) {

        return;

    }


    const searchInput =
        document.getElementById(
            "userSearch"
        );


    const search =
        searchInput
        ?
        searchInput.value
            .trim()
            .toLowerCase()
        :
        "";


    const filteredUsers =
        users.filter(function(user) {

            return (

                String(
                    user.name || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.phone || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.username || ""
                )
                .toLowerCase()
                .includes(search)

            );

        });


    if (
        filteredUsers.length === 0
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
        filteredUsers
        .map(function(user) {

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
                        ${escapeHTML(
                            user.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.username
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.plan
                        )}
                    </td>

                    <td>
                        ₹${user.price || 0}
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
                        ${formatDate(
                            user.expiry
                        )}
                    </td>

                    <td>

                        <div
                            class="action-buttons"
                        >

                            <button
                                class="btn-whatsapp"
                                onclick="
                                openWhatsApp(
                                    '${escapeAttribute(
                                        user.phone
                                    )}'
                                )
                                "
                            >
                                WhatsApp
                            </button>


                            <button
                                class="btn-call"
                                onclick="
                                callUser(
                                    '${escapeAttribute(
                                        user.phone
                                    )}'
                                )
                                "
                            >
                                Call
                            </button>


                            <button
                                class="btn-warning"
                                onclick="
                                editUser(
                                    ${user.id}
                                )
                                "
                            >
                                Edit
                            </button>


                            <button
                                class="btn-danger"
                                onclick="
                                deleteUser(
                                    ${user.id}
                                )
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        })
        .join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const totalUsers =
        users.length;


    const activeUsers =
        users.filter(function(user) {

            return getStatus(user) ===
                "Active";

        }).length;


    const expiredUsers =
        users.filter(function(user) {

            return getStatus(user) ===
                "Expired";

        }).length;


    const totalRevenue =
        payments
        .filter(function(payment) {

            return payment.status ===
                "Paid";

        })
        .reduce(function(
            total,
            payment
        ) {

            return total +
                Number(
                    payment.amount || 0
                );

        }, 0);


    /* Update cards */

    const totalElement =
        document.getElementById(
            "totalUsers"
        );


    if (totalElement) {

        totalElement.innerText =
            totalUsers;

    }


    const activeElement =
        document.getElementById(
            "activeUsers"
        );


    if (activeElement) {

        activeElement.innerText =
            activeUsers;

    }


    const expiredElement =
        document.getElementById(
            "expiredUsers"
        );


    if (expiredElement) {

        expiredElement.innerText =
            expiredUsers;

    }


    const revenueElement =
        document.getElementById(
            "revenue"
        );


    if (revenueElement) {

        revenueElement.innerText =
            "₹" +
            totalRevenue;

    }


    /* Recent users */

    const table =
        document.getElementById(
            "dashboardTable"
        );


    if (!table) {

        return;

    }


    const recentUsers =
        [...users]
        .sort(function(a, b) {

            return new Date(
                b.createdAt
            ) -
            new Date(
                a.createdAt
            );

        })
        .slice(
            0,
            10
        );


    if (
        recentUsers.length === 0
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
        recentUsers
        .map(function(user) {

            const status =
                getStatus(
                    user
                );


            return `

                <tr>

            