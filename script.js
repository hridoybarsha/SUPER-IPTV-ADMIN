"use strict";

/* =========================================================
   SUPER IPTV MANAGEMENT PANEL
   COMPLETE SCRIPT.JS
   Works with the provided index.html + style.css
========================================================= */


/* =========================================================
   1. PLAN PRICES
========================================================= */

const PLAN_PRICES = {
    "1 Month": 200,
    "3 Months": 600,
    "6 Months": 1150,
    "12 Months": 2000
};


/* =========================================================
   2. DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
    upi: "6289033804@ptsbi",
    contact: "6289033804",
    portal: "http://geoiptv.one:8880"
};


/* =========================================================
   3. DEFAULT WHATSAPP TEMPLATE
========================================================= */

const DEFAULT_TEMPLATE = `━━━━━━━━━━━━━━━━━━━━━━
        SUPER IPTV
     SERVICE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━

Hello 👋

Your IPTV account has been successfully created.

🔐 LOGIN DETAILS

Username : {{USERNAME}}
Password : {{PASSWORD}}
Portal URL : {{PORTAL_URL}}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION

Plan       : {{PLAN}}
Amount     : ₹{{AMOUNT}}
Valid Upto : {{EXPIRY}}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT

UPI ID : {{UPI_ID}}
Contact : {{CONTACT}}

Please complete your payment and send the payment screenshot.

━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT

WhatsApp / Call : {{CONTACT}}

Thank you for choosing SUPER IPTV.

━━━━━━━━━━━━━━━━━━━━━━`;


/* =========================================================
   4. DATABASE VARIABLES
========================================================= */

let users = [];
let payments = [];

let settings = {
    ...DEFAULT_SETTINGS
};

let messageTemplate = DEFAULT_TEMPLATE;


/* =========================================================
   5. STORAGE KEYS
========================================================= */

const STORAGE = {
    USERS: "SUPER_IPTV_USERS",
    PAYMENTS: "SUPER_IPTV_PAYMENTS",
    SETTINGS: "SUPER_IPTV_SETTINGS",
    TEMPLATE: "SUPER_IPTV_TEMPLATE"
};


/* =========================================================
   6. GET ELEMENT
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   7. LOAD DATABASE
========================================================= */

function loadDatabase() {

    try {

        const savedUsers =
            localStorage.getItem(STORAGE.USERS);

        const savedPayments =
            localStorage.getItem(STORAGE.PAYMENTS);

        const savedSettings =
            localStorage.getItem(STORAGE.SETTINGS);

        const savedTemplate =
            localStorage.getItem(STORAGE.TEMPLATE);


        users = savedUsers
            ? JSON.parse(savedUsers)
            : [];


        payments = savedPayments
            ? JSON.parse(savedPayments)
            : [];


        settings = savedSettings
            ? {
                ...DEFAULT_SETTINGS,
                ...JSON.parse(savedSettings)
            }
            : {
                ...DEFAULT_SETTINGS
            };


        messageTemplate =
            savedTemplate ||
            DEFAULT_TEMPLATE;


        if (!Array.isArray(users)) {
            users = [];
        }


        if (!Array.isArray(payments)) {
            payments = [];
        }

    } catch (error) {

        console.error(
            "Database Load Error:",
            error
        );

        users = [];

        payments = [];

        settings = {
            ...DEFAULT_SETTINGS
        };

        messageTemplate =
            DEFAULT_TEMPLATE;
    }
}


/* =========================================================
   8. SAVE DATABASE
========================================================= */

function saveDatabase() {

    try {

        localStorage.setItem(
            STORAGE.USERS,
            JSON.stringify(users)
        );


        localStorage.setItem(
            STORAGE.PAYMENTS,
            JSON.stringify(payments)
        );

    } catch (error) {

        console.error(
            "Database Save Error:",
            error
        );

        alert(
            "Unable to save data."
        );
    }
}


/* =========================================================
   9. SAVE SETTINGS
========================================================= */

function saveSettingsData() {

    try {

        localStorage.setItem(
            STORAGE.SETTINGS,
            JSON.stringify(settings)
        );

    } catch (error) {

        console.error(
            "Settings Save Error:",
            error
        );
    }
}


/* =========================================================
   10. SAVE MESSAGE TEMPLATE
========================================================= */

function saveMessageTemplate() {

    localStorage.setItem(
        STORAGE.TEMPLATE,
        messageTemplate
    );
}


/* =========================================================
   11. NAVIGATION
========================================================= */

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".menu-btn"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const page =
                    this.getAttribute(
                        "data-page"
                    );


                /* Hide all pages */

                document
                    .querySelectorAll(".page")
                    .forEach(function(section) {

                        section.classList.remove(
                            "active"
                        );

                    });


                /* Remove active menu */

                buttons.forEach(function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                });


                /* Show selected page */

                const target =
                    getElement(page);


                if (target) {

                    target.classList.add(
                        "active"
                    );

                }


                /* Active button */

                this.classList.add(
                    "active"
                );


                /* Refresh page */

                refreshAll();


                /* Scroll top */

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });
}


/* =========================================================
   12. REFRESH ALL
========================================================= */

function refreshAll() {

    updateDashboard();

    renderUsers();

    renderPayments();

    updatePaymentSummary();

    updateReports();

}


/* =========================================================
   13. CALCULATE EXPIRY
========================================================= */

function calculateExpiry(plan) {

    const date =
        new Date();


    switch (plan) {

        case "1 Month":
            date.setMonth(
                date.getMonth() + 1
            );
            break;


        case "3 Months":
            date.setMonth(
                date.getMonth() + 3
            );
            break;


        case "6 Months":
            date.setMonth(
                date.getMonth() + 6
            );
            break;


        case "12 Months":
            date.setMonth(
                date.getMonth() + 12
            );
            break;
    }


    return date;
}


/* =========================================================
   14. FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const d =
        new Date(date);


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
   15. CHECK USER ACTIVE
========================================================= */

function isUserActive(user) {

    if (!user || !user.expiry) {
        return false;
    }


    return (
        new Date(user.expiry).getTime()
        >=
        new Date().getTime()
    );
}


/* =========================================================
   16. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   17. GENERATE QR
========================================================= */

function generateQR(plan) {

    const qrContainer =
        getElement("qrcode");

    const qrPlan =
        getElement("qrPlan");

    const amountInput =
        getElement("amount");


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
                "QR library not loaded.";

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
        amount +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "SUPER IPTV " + plan
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
                escapeHTML(plan) +
                "</strong>" +
                "<br><br>" +
                "Scan to Pay ₹" +
                amount +
                "<br>" +
                "UPI ID: " +
                escapeHTML(
                    settings.upi
                );

        }

    } catch (error) {

        console.error(
            "QR Error:",
            error
        );

    }
}


/* =========================================================
   18. DOWNLOAD CURRENT QR
========================================================= */

function downloadCurrentQR() {

    const qrContainer =
        getElement("qrcode");


    if (!qrContainer) {
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


    let url = "";


    if (canvas) {

        url =
            canvas.toDataURL(
                "image/png"
            );

    }

    else if (image) {

        url =
            image.src;

    }


    if (!url) {

        alert(
            "Please select a plan first."
        );

        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "SUPER-IPTV-Payment-QR.png";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();
}


/* =========================================================
   19. PLAN CHANGE
========================================================= */

function setupPlanChange() {

    const plan =
        getElement("plan");


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


/* =========================================================
   20. ADD CUSTOMER
========================================================= */

function setupUserForm() {

    const form =
        getElement("userForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                getElement(
                    "customerName"
                ).value.trim();


            const phone =
                getElement(
                    "phone"
                ).value.trim();


            const username =
                getElement(
                    "username"
                ).value.trim();


            const password =
                getElement(
                    "password"
                ).value.trim();


            const portalUrl =
                getElement(
                    "portalUrl"
                ).value.trim();


            const plan =
                getElement(
                    "plan"
                ).value;


            const paymentStatus =
                getElement(
                    "paymentStatus"
                ).value;


            /* Validation */

            if (
                !name ||
                !phone ||
                !username ||
                !password ||
                !portalUrl ||
                !plan
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }


            const amount =
                PLAN_PRICES[plan];


            if (!amount) {

                alert(
                    "Please select a valid plan."
                );

                return;
            }


            /* Duplicate Username */

            const duplicate =
                users.some(function(user) {

                    return (
                        String(
                            user.username
                        ).toLowerCase()
                        ===
                        username.toLowerCase()
                    );

                });


            if (duplicate) {

                alert(
                    "Username already exists."
                );

                return;
            }


            const userId =
                Date.now();


            const expiry =
                calculateExpiry(
                    plan
                );


            const now =
                new Date()
                    .toISOString();


            /* User Object */

            const user = {

                id:
                    userId,

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
                    now,

                expiry:
                    expiry.toISOString()

            };


            /* Add User */

            users.push(
                user
            );


            /* Add Payment */

            const payment = {

                id:
                    userId + 1,

                userId:
                    userId,

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
                    now

            };


            payments.push(
                payment
            );


            /* Save */

            saveDatabase();


            /* Refresh */

            refreshAll();


            alert(
                "Customer added successfully!"
            );


            /* Reset Form */

            form.reset();


            const portal =
                getElement(
                    "portalUrl"
                );


            if (portal) {

                portal.value =
                    settings.portal;

            }


            generateQR("");

        }
    );
}


/* =========================================================
   21. RENDER USERS
   21. RENDER USERS
========================================================= */

function renderUsers() {

    const table =
        getElement(
            "usersTable"
        );


    if (!table) {
        return;
    }


    const searchInput =
        getElement(
            "searchUser"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
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
        filtered.length === 0
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
        .map(function(user) {

            const active =
                isUserActive(user);


            return `

                <tr>

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
                            user.password
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.plan
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            user.amount || 0
                        )}
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
                            type="button"
                            class="action-btn whatsapp-btn"
                            onclick="sendWhatsApp('${user.id}')"
                        >
                            📱 WhatsApp
                        </button>


                        <button
                            type="button"
                            class="action-btn copy-btn"
                            onclick="copyMessage('${user.id}')"
                        >
                            📋 Copy
                        </button>


                        <button
                            type="button"
                            class="action-btn primary-btn"
                            onclick="downloadUserQR('${user.id}')"
                        >
                            📥 QR
                        </button>


                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteUser('${user.id}')"
                        >
                            🗑️ Delete
                        </button>

                    </td>

                </tr>

            `;

        })
        .join("");
}


/* =========================================================
   22. SEARCH USER
========================================================= */

function setupSearch() {

    const search =
        getElement(
            "searchUser"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function() {

            renderUsers();

        }
    );
}


/* =========================================================
   23. CREATE WHATSAPP MESSAGE
========================================================= */

function createMessage(user) {

    if (!user) {
        return "";
    }


    let message =
        messageTemplate;


    const replacements = {

        "{{USERNAME}}":
            user.username || "",

        "{{PASSWORD}}":
            user.password || "",

        "{{PORTAL_URL}}":
            user.portalUrl || "",

        "{{PLAN}}":
            user.plan || "",

        "{{AMOUNT}}":
            user.amount || "",

        "{{EXPIRY}}":
            formatDate(
                user.expiry
            ),

        "{{UPI_ID}}":
            settings.upi || "",

        "{{CONTACT}}":
            settings.contact || ""

    };


    Object.keys(
        replacements
    )
    .forEach(function(key) {

        message =
            message.split(key)
                .join(
                    replacements[key]
                );

    });


    return message;
}


/* =========================================================
   24. SEND WHATSAPP
========================================================= */

function sendWhatsApp(id) {

    const user =
        users.find(function(item) {

            return String(
                item.id
            )
            ===
            String(id);

        });


    if (!user) {

        alert(
            "Customer not found."
        );

        return;
    }


    let phone =
        String(
            user.phone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        phone.length === 10
    ) {

        phone =
            "91" +
            phone;

    }


    const message =
        createMessage(
            user
        );


    const url =
        "https://wa.me/" +
        phone +
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
25. COPY MESSAGE
========================================================= */

function copyMessage(id) {

    const user =
        users.find(function(item) {

            return String(
                item.id
            )
            ===
            String(id);

        });


    if (!user) {

        alert(
            "Customer not found."
        );

        return;
    }


    const message =
        createMessage(
            user
        );


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(
                message
            )
            .then(function() {

                alert(
                    "Message copied!"
                );

            })
            .catch(function() {

                fallbackCopy(
                    message
                );

            });

    }

    else {

        fallbackCopy(
            message
        );

    }
}


/* =========================================================
   26. FALLBACK COPY
========================================================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

        alert(
            "Message copied!"
        );

    } catch (error) {

        alert(
            "Copy failed. Please copy manually."
        );

    }


    textarea.remove();
}


/* =========================================================
   27. DELETE USER
========================================================= */

function deleteUser(id) {

    const user =
        users.find(function(item) {

            return String(
                item.id
            )
            ===
            String(id);

        });


    if (!user) {

        alert(
            "Customer not found."
        );

        return;
    }


    const confirmed =
        confirm(
            "Delete customer " +
            user.name +
            "?"
        );


    if (!confirmed) {
        return;
    }


    users =
        users.filter(function(item) {

            return String(
                item.id
            )
            !==
            String(id);

        });


    payments =
        payments.filter(function(item) {

            return String(
                item.userId
            )
            !==
            String(id);

        });


    saveDatabase();


    refreshAll();


    alert(
        "Customer deleted successfully."
    );
}


/* =========================================================
   28. DOWNLOAD USER QR
========================================================= */

function downloadUserQR(id) {

    const user =
        users.find(function(item) {

            return String(
                item.id
            )
            ===
            String(id);

        });


    if (!user) {

        alert(
            "Customer not found."
        );

        return;
    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        alert(
            "QR library not loaded."
        );

        return;
    }


    const box =
        document.createElement(
            "div"
        );


    box.style.position =
        "fixed";


    box.style.left =
        "-9999px";


    document.body.appendChild(
        box
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
        Number(
            user.amount || 0
        ) +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "SUPER IPTV " +
            user.plan
        );


    new QRCode(
        box,
        {
            text:
                upiLink,

            width:
                300,

            height:
                300,

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );


    setTimeout(function() {

        const canvas =
            box.querySelector(
                "canvas"
            );


        if (!canvas) {

            box.remove();

            alert(
                "Unable to generate QR."
            );

            return;
        }


        const link =
            document.createElement(
                "a"
            );


        link.download =
            "SUPER-IPTV-" +
            user.username +
            "-QR.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        box.remove();

    }, 500);
}


/* =========================================================
29. RENDER PAYMENTS
========================================================= */

function renderPayments() {

    const table =
        getElement(
            "paymentsTable"
        );


    if (!table) {
        return;
    }


    if (
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
        .map(function(payment) {

            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            payment.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.plan
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            payment.amount || 0
                        )}
                    </td>

                    <td>

                        <span class="status ${
                            payment.status === "Paid"
                                ? "active-status"
                                : "expired-status"
                        }">

                            ${escapeHTML(
                                payment.status
                            )}

                        </span>

                    </td>

                    <td>
                        ${formatDate(
                            payment.date
                        )}
                    </td>

                </tr>

            `;

        })
        .join("");
}


/* =========================================================
   30. PAYMENT SUMMARY
========================================================= */

function updatePaymentSummary() {

    const total =
        payments.length;


    const paid =
        payments.filter(function(payment) {

            return payment.status ===
                "Paid";

        }).length;


    const pending =
        payments.filter(function(payment) {

            return payment.status ===
                "Pending";

        }).length;


    const revenue =
        payments
        .filter(function(payment) {

            return payment.status ===
                "Paid";

        })
        .reduce(function(total, payment) {

            return total +
                Number(
                    payment.amount || 0
                );

        }, 0);


    const totalPayments =
        getElement(
            "totalPayments"
        );


    const paidPayments =
        getElement(
            "paidPayments"
        );


    const pendingPayments =
        getElement(
            "pendingPayments"
        );


    const paymentRevenue =
        getElement(
            "paymentRevenue"
        );


    if (totalPayments) {
        totalPayments.textContent =
            total;
    }


    if (paidPayments) {
        paidPayments.textContent =
            paid;
    }


    if (pendingPayments) {
        pendingPayments.textContent =
            pending;
    }


    if (paymentRevenue) {

        paymentRevenue.textContent =
            "₹" +
            revenue;

    }
}


/* =========================================================
   31. UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(function(user) {

            return isUserActive(
                user
            );

        }).length;


    const expired =
        total -
        active;


    const revenue =
        payments
        .filter(function(payment) {

            return payment.status ===
                "Paid";

        })
        .reduce(function(total, payment) {

            return total +
                Number(
                    payment.amount || 0
                );

        }, 0);


    const totalUsers =
        getElement(
            "totalUsers"
        );


    const activeUsers =
        getElement(
            "activeUsers"
        );


    const expiredUsers =
        getElement(
            "expiredUsers"
        );


    const totalRevenue =
        getElement(
            "totalRevenue"
        );


    if (totalUsers) {
        totalUsers.textContent =
            total;
    }


    if (activeUsers) {
        activeUsers.textContent =
            active;
    }


    if (expiredUsers) {
        expiredUsers.textContent =
            expired;
    }


    if (totalRevenue) {

        totalRevenue.textContent =
            "₹" +
            revenue;

    }


    updateRecentUsers();
}


/* =========================================================
   32. RECENT USERS
========================================================= */

function updateRecentUsers() {

    const table =
        getElement(
            "recentUsers"
        );


    if (!table) {
        return;
    }


    if (
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
        .slice()
        .reverse()
        .slice(0, 5)
        .map(function(user) {

            const active =
                isUserActive(
                    user
                );


            return `

                <tr>

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
                            user.plan
                        )}
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

                </tr>

            `;

        })
        .join("");
}


/* =========================================================
33. UPDATE REPORTS
========================================================= */

function updateReports() {

    const revenue =
        payments
        .filter(function(payment) {

            return payment.status ===
                "Paid";

        })
        .reduce(function(total, payment) {

            return total +
                Number(
                    payment.amount || 0
                );

        }, 0);


    const paid =
        payments.filter(function(payment) {

            return payment.status ===
                "Paid";

        }).length;


    const pending =
        payments.filter(function(payment) {

            return payment.status ===
                "Pending";

        }).length;


    const reportRevenue =
        getElement(
            "reportRevenue"
        );


    const paidCount =
        getElement(
            "paidCount"
        );


    const pendingCount =
        getElement(
            "pendingCount"
        );


    if (reportRevenue) {

        reportRevenue.textContent =
            "₹" +
            revenue;

    }


    if (paidCount) {

        paidCount.textContent =
            paid;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }
}


/* =========================================================
   34. LOAD SETTINGS
========================================================= */

function loadSettings() {

    const upi =
        getElement(
            "settingUpi"
        );


    const contact =
        getElement(
            "settingContact"
        );


    const portal =
        getElement(
            "settingPortal"
        );


    const template =
        getElement(
            "messageTemplate"
        );


    if (upi) {
        upi.value =
            settings.upi || "";
    }


    if (contact) {
        contact.value =
            settings.contact || "";
    }


    if (portal) {
        portal.value =
            settings.portal || "";
    }


    if (template) {
        template.value =
            messageTemplate || "";
    }
}


/* =========================================================
   35. SAVE SETTINGS BUTTON
========================================================= */

function setupSettings() {

    const saveButton =
        getElement(
            "saveSettings"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function() {

                const upi =
                    getElement(
                        "settingUpi"
                    );


                const contact =
                    getElement(
                        "settingContact"
                    );


                const portal =
                    getElement(
                        "settingPortal"
                    );


                settings = {

                    upi:
                        upi
                            ? upi.value.trim()
                            : "",

                    contact:
                        contact
                            ? contact.value.trim()
                            : "",

                    portal:
                        portal
                            ? portal.value.trim()
                            : ""

                };


                saveSettingsData();


                loadSettings();


                alert(
                    "Settings saved successfully!"
                );


                /* Update QR if plan selected */

                const plan =
                    getElement(
                        "plan"
                    );


                if (
                    plan &&
                    plan.value
                ) {

                    generateQR(
                        plan.value
                    );

                }

            }
        );
    }


    const saveTemplate =
        getElement(
            "saveTemplate"
        );


    if (saveTemplate) {

        saveTemplate.addEventListener(
            "click",
            function() {

                const template =
                    getElement(
                        "messageTemplate"
                    );


                if (template) {

                    messageTemplate =
                        template.value;

                    saveMessageTemplate();

                    alert(
                        "WhatsApp template saved!"
                    );

                }

            }
        );
    }
}


/* =========================================================
   36. DELETE ALL
========================================================= */

function setupDeleteAll() {

    const button =
        getElement(
            "deleteAll"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            if (
                users.length === 0 &&
                payments.length === 0
            ) {

                alert(
                    "There is no data to delete."
                );

                return;
            }


            const confirmed =
                confirm(
                    "WARNING!\n\n" +
                    "This will permanently delete ALL users and payments.\n\n" +
                    "Are you sure?"
                );


            if (!confirmed) {
                return;
            }


            users = [];

            payments = [];


            saveDatabase();


            refreshAll();


            alert(
                "All users and payments deleted."
            );

        }
    );
}


/* =========================================================
   37. DOWNLOAD QR BUTTON
========================================================= */

function setupQRDownload() {

    const button =
        getElement(
            "downloadQR"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            downloadCurrentQR();

        }
    );
}


/* =========================================================
   38. INITIALIZE APPLICATION
========================================================= */

function initializeApp() {

    console.log(
        "SUPER IPTV Panel Starting..."
    );


    /* Load database */

    loadDatabase();


    /* Setup navigation */

    setupNavigation();


    /* Setup user form */

    setupUserForm();


    /* Setup search */

    setupSearch();


    /* Setup plan */

    setupPlanChange();


    /* Setup QR */

    setupQRDownload();


    /* Setup settings */

    setupSettings();


    /* Setup delete */

    setupDeleteAll();


    /* Load settings */

    loadSettings();


    /* Initial refresh */

    refreshAll();


    console.log(
        "SUPER IPTV Panel Ready."
    );
}


/* =========================================================
39. START APPLICATION
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}


/* =========================================================
   40. GLOBAL FUNCTIONS
   Required for inline onclick buttons
========================================================= */

window.sendWhatsApp =
    sendWhatsApp;

window.copyMessage =
    copyMessage;

window.deleteUser =
    deleteUser;

window.downloadUserQR =
    downloadUserQR;

window.downloadCurrentQR =
    downloadCurrentQR;