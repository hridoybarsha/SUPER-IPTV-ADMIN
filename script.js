/* ==========================================
   SUPER IPTV MANAGEMENT PANEL
   UPI QR + PAYMENTS + USERS
   ========================================== */


/* =========================
   STORAGE KEYS
========================= */

const USERS_KEY =
    "SUPER_IPTV_USERS";

const PAYMENTS_KEY =
    "SUPER_IPTV_PAYMENTS";

const SETTINGS_KEY =
    "SUPER_IPTV_SETTINGS";

const TEMPLATE_KEY =
    "SUPER_IPTV_TEMPLATE";


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

    upiId: "6289033804@ptsbi",

    contactNumber: "",

    portalUrl:
        "http://geoiptv.one:8880"

};


/* =========================
   DEFAULT WHATSAPP TEMPLATE
========================= */

const DEFAULT_TEMPLATE =

`Hello {{NAME}} 👋

Your IPTV account details:

🔐 Username: {{USERNAME}}

🔑 Password: {{PASSWORD}}

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

let users =
    JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];


let payments =
    JSON.parse(
        localStorage.getItem(PAYMENTS_KEY)
    ) || [];


let settings =
    JSON.parse(
        localStorage.getItem(SETTINGS_KEY)
    ) || DEFAULT_SETTINGS;


let messageTemplate =
    localStorage.getItem(
        TEMPLATE_KEY
    ) || DEFAULT_TEMPLATE;


/* =========================
   DOM READY
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupNavigation();

        setupMobileMenu();

        setupPlanChange();

        setupUserForm();

        setupSearch();

        setupSettings();

        setupDeleteAll();

        setupDashboardButton();

        loadSettings();

        updateAll();

    }
);


/* =========================
   NAVIGATION
========================= */

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".nav-item"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const page =
                        button.dataset.page;

                    showPage(page);

                }
            );

        }
    );

}


function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            pageName
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(
            function (button) {

                button.classList.toggle(

                    "active",

                    button.dataset.page ===
                    pageName

                );

            }
        );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {

    const toggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!toggle || !sidebar) {

        return;

    }


    toggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        sidebar.classList.remove(
                            "open"
                        );

                    }
                );

            }
        );

}


/* =========================
   DASHBOARD BUTTON
========================= */

function setupDashboardButton() {

    const button =
        document.getElementById(
            "goUsersBtn"
        );


    if (button) {

        button.addEventListener(
            "click",
            function () {

                showPage("users");

                document
                    .getElementById(
                        "customerName"
                    )
                    ?.focus();

            }
        );

    }

}


/* =========================
   PLAN CHANGE
========================= */

function setupPlanChange() {

    const plan =
        document.getElementById(
            "plan"
        );


    if (!plan) {

        return;

    }


    plan.addEventListener(
        "change",
        function () {

            generateQR();

        }
    );

}


/* =========================
   GET UPI ID
========================= */

function getUPIId() {

    const upi =
        settings.upiId ||
        DEFAULT_SETTINGS.upiId;


    return upi.trim();

}


/* =========================
   CREATE UPI LINK
========================= */

function createUPILink(
    amount,
    customerName
) {

    const upiId =
        getUPIId();


    const payeeName =
        customerName &&
        customerName.trim()
            ? customerName.trim()
            : "SUPER IPTV";


    const params = new URLSearchParams();


    params.set(
        "pa",
        upiId
    );


    params.set(
        "pn",
        payeeName
    );


    params.set(
        "am",
        Number(amount).toFixed(2)
    );


    params.set(
        "cu",
        "INR"
    );


    return (
        "upi://pay?" +
        params.toString()
    );

}


/* =========================
   GENERATE QR
========================= */

function generateQR() {

    const plan =
        document.getElementById(
            "plan"
        );


    const amountInput =
        document.getElementById(
            "amount"
        );


    const customerName =
        document.getElementById(
            "customerName"
        );


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    const qrDetails =
        document.getElementById(
            "qrDetails"
        );


    const qrPlanText =
        document.getElementById(
            "qrPlanText"
        );


    const qrAmountText =
        document.getElementById(
            "qrAmountText"
        );


    const qrUpiText =
        document.getElementById(
            "qrUpiText"
        );


    if (
        !plan ||
        !amountInput ||
        !qrContainer
    ) {

        return;

    }


    const selectedPlan =
        plan.value;


    if (!selectedPlan) {

        qrContainer.innerHTML =

            "<span>Select a plan to generate QR</span>";


        qrDetails?.classList.add(
            "hidden"
        );


        return;

    }


    const amount =
        PLAN_PRICES[selectedPlan];


    amountInput.value =
        amount;


    const upiLink =
        createUPILink(
            amount,
            customerName?.value
        );


    qrContainer.innerHTML =
        "";


    try {

        new QRCode(

            qrContainer,

            {

                text: upiLink,

                width: 280,

                height: 280,

                colorDark:
                    "#000000",

                colorLight:
                    "#ffffff",

                correctLevel:
                    QRCode.CorrectLevel.H

            }

        );


        qrDetails?.classList.remove(
            "hidden"
        );


        if (qrPlanText) {

            qrPlanText.textContent =
                selectedPlan;

        }


        if (qrAmountText) {

            qrAmountText.textContent =
                "Scan & Pay ₹" +
                amount;

        }


        if (qrUpiText) {

            qrUpiText.textContent =
                getUPIId();

        }

    }

    catch (error) {

        console.error(
            "QR Generation Error:",
            error
        );


        qrContainer.innerHTML =

            "<span>Unable to generate QR</span>";

    }

}


/* =========================
   DOWNLOAD QR
========================= */

function downloadQR() {

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (
        !qrContainer ||
        !qrContainer.querySelector(
            "canvas"
        )
    ) {

        alert(
            "Please select a plan and generate QR first."
        );

        return;

    }


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


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


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


document
    .getElementById(
        "downloadQR"
    )
    ?.addEventListener(
        "click",
        downloadQR
    );


/* =========================
   USER FORM
========================= */

function setupUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

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


            const amount =
                Number(
                    document
                        .getElementById(
                            "amount"
                        )
                        .value
                );


            const paymentStatus =
                document
                    .getElementById(
                        "paymentStatus"
                    )
                    .value;


            if (
                !name ||
                !phone ||
                !username ||
                !password ||
                !portalUrl ||
                !plan ||
                !amount
            ) {

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

                name,

                phone,

                username,

                password,

                portalUrl,

                plan,

                amount,

                paymentStatus,

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
                    Date.now() + 1,

                userId:
                    user.id,

                name,

                phone,

                plan,

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


            updateAll();


            generateQR();


            showToast(
                "Customer Added Successfully"
            );


            form.reset();


            document
                .getElementById(
                    "portalUrl"
                )
                .value =
                settings.portalUrl ||
                DEFAULT_SETTINGS.portalUrl;


            document
                .getElementById(
                    "qrcode"
                )
                .innerHTML =

                "<span>Select a plan to generate QR</span>";


            document
                .getElementById(
                    "qrDetails"
                )
                ?.classList.add(
                    "hidden"
                );

        }
    );

}


/* =========================
   SEARCH
========================= */

function setupSearch() {

    const search =
        document.getElementById(
            "searchUser"
        );


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        function () {

            renderUsers(
                search.value
            );

        }
    );

}


/* =========================
   CALCULATE EXPIRY
========================= */

function calculateExpiry(
    plan
) {

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
        (
            months[plan] ||
            1
        )

    );


    return date
        .toISOString()
        .split("T")[0];

}


/* =========================
   CHECK EXPIRED
========================= */

function isExpired(
    expiry
) {

    if (!expiry) {

        return false;

    }


    return new Date(
        expiry
    ) < new Date();

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(
    date
) {

    if (!date) {

        return "-";

    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-IN"
    );

}


/* =========================
   SAVE DATABASE
========================= */

function saveDatabase() {

    localStorage.setItem(

        USERS_KEY,

        JSON.stringify(
            users
        )

    );


    localStorage.setItem(

        PAYMENTS_KEY,

        JSON.stringify(
            payments
        )

    );

}


/* =========================
   RENDER USERS
========================= */

function renderUsers(
    searchTerm = ""
) {

    const table =
        document.getElementById(
            "usersTable"
        );


    if (!table) {

        return;

    }


    const search =
        searchTerm
            .toLowerCase()
            .trim();


    const filtered =
        users.filter(

            function (user) {

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


    if (
        filtered.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty"
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

                function (user) {

                    const expired =
                        isExpired(
                            user.expiry
                        );


                    const statusClass =
                        user.paymentStatus
                            .toLowerCase();


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

                            <span
                                class="status ${statusClass}"
                            >
                                ${escapeHTML(user.paymentStatus)}
                            </span>

                        </td>

                        <td>

                            <span
                                class="status ${
                                    expired
                                    ? "expired"
                                    : "active"
                                }"
                            >

                                ${
                                    expired
                                    ? "Expired"
                                    : formatDate(
                                        user.expiry
                                    )
                                }

                            </span>

                        </td>

                        <td>

                            <button

                                class="delete-btn"

                                onclick=
                                "deleteUser(${user.id})"

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
   DELETE USER
========================= */

function deleteUser(
    id
) {

    const confirmDelete =
        confirm(
            "Delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    users =
        users.filter(

            function (user) {

                return user.id !== id;

            }

        );


    payments =
        payments.filter(

            function (payment) {

                return payment.userId !== id;

            }

        );


    saveDatabase();


    updateAll();


    showToast(
        "Customer Deleted"
    );

}


/* =========================
   RENDER RECENT USERS
========================= */

function renderRecentUsers() {

    const table =
        document.getElementById(
            "recentUsersTable"
        );


    if (!table) {

        return;

    }


    const recent =
        [...users]
            .reverse()
            .slice(
                0,
                5
            );


    if (
        recent.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty"
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

                function (user) {

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
                                class="status ${
                                    user.paymentStatus
                                        .toLowerCase()
                                }"
                            >
                                ${escapeHTML(user.paymentStatus)}
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


/* =========================
   RENDER PAYMENTS
========================= */

function renderPayments() {

    const table =
        document.getElementById(
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

                <td
                    colspan="6"
                    class="empty"
                >
                    No Payments Yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        [...payments]
            .reverse()
            .map(

                function (payment) {

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
                                class="status ${
                                    payment.status
                                        .toLowerCase()
                                }"
                            >
                                ${escapeHTML(payment.status)}
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


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(

            function (user) {

                return !isExpired(
                    user.expiry
                );

            }

        ).length;


    const expired =
        users.filter(

            function (user) {

                return isExpired(
                    user.expiry
                );

            }

        ).length;


    const paidPayments =
        payments.filter(

            function (payment) {

                return payment.status ===
                    "Paid";

            }

        );


    const revenue =
        paidPayments.reduce(

            function (sum, payment) {

                return (
                    sum +
                    Number(
                        payment.amount
                    )
                );

            },

            0

        );


    setText(
        "totalUsers",
        total
    );


    setText(
        "activeUsers",
        active
    );


    setText(
        "expiredUsers",
        expired
    );


    setText(
        "totalRevenue",
        "₹" + revenue
    );

}


/* =========================
   UPDATE PAYMENTS
========================= */

function updatePayments() {

    const total =
        payments.length;


    const paid =
        payments.filter(

            p =>
                p.status === "Paid"

        ).length;


    const pending =
        payments.filter(

            p =>
                p.status === "Pending"

        ).length;


    const revenue =
        payments

            .filter(
                p =>
                    p.status === "Paid"
            )

            .reduce(

                (
                    sum,
                    p
                ) =>

                    sum +
                    Number(
                        p.amount
                    ),

                0

            );


    setText(
        "totalPayments",
        total
    );


    setText(
        "paidPayments",
        paid
    );


    setText(
        "pendingPayments",
        pending
    );


    setText(
        "paymentRevenue",
        "₹" + revenue
    );


    setText(
        "reportRevenue",
        "₹" + revenue
    );


    setText(
        "reportPaid",
        paid
    );


    setText(
        "reportPending",
        pending
    );

}


/* =========================
   UPDATE ALL
========================= */

function updateAll() {

    renderUsers();

    renderRecentUsers();

    renderPayments();

    updateDashboard();

    updatePayments();

}


/* =========================
   SETTINGS
========================= */

function setupSettings() {

    const save =
        document.getElementById(
            "saveSettings"
        );


    if (save) {

        save.addEventListener(
            "click",
            function () {

                settings = {

                    upiId:
                        document
                            .getElementById(
                                "upiId"
                            )
                            .value
                            .trim(),

                    contactNumber:
                        document
                            .getElementById(
                                "contactNumber"
                            )
                            .value
                            .trim(),

                    portalUrl:
                        document
                            .getElementById(
                                "defaultPortal"
                            )
                            .value
                            .trim()

                };


                localStorage.setItem(

                    SETTINGS_KEY,

                    JSON.stringify(
                        settings
                    )

                );


                showToast(
                    "Settings Saved"
                );


                generateQR();

            }
        );

    }


    const saveTemplate =
        document.getElementById(
            "saveTemplate"
        );


    if (saveTemplate) {

        saveTemplate.addEventListener(
            "click",
            function () {

                messageTemplate =
                    document
                        .getElementById(
                            "messageTemplate"
                        )
                        .value;


                localStorage.setItem(

                    TEMPLATE_KEY,

                    messageTemplate

                );


                showToast(
                    "Template Saved"
                );

            }
        );

    }

}


/* =========================
   LOAD SETTINGS
========================= */

function loadSettings() {

    const upi =
        document.getElementById(
            "upiId"
        );


    const contact =
        document.getElementById(
            "contactNumber"
        );


    const portal =
        document.getElementById(
            "defaultPortal"
        );


    const template =
        document.getElementById(
            "messageTemplate"
        );


    if (upi) {

        upi.value =
            settings.upiId ||
            DEFAULT_SETTINGS.upiId;

    }


    if (contact) {

        contact.value =
            settings.contactNumber ||
            "";

    }


    if (portal) {

        portal.value =
            settings.portalUrl ||
            DEFAULT_SETTINGS.portalUrl;

    }


    if (template) {

        template.value =
            messageTemplate;

    }


    const userPortal =
        document.getElementById(
            "portalUrl"
        );


    if (userPortal) {

        userPortal.value =
            settings.portalUrl ||
            DEFAULT_SETTINGS.portalUrl;

    }

}


/* =========================
   DELETE ALL
========================= */

function setupDeleteAll() {

    const button =
        document.getElementById(
            "deleteAll"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            const confirmDelete =
                confirm(

                    "WARNING!\n\n" +

                    "This will delete ALL users and payments.\n\n" +

                    "Are you sure?"

                );


            if (!confirmDelete) {

                return;

            }


            users = [];

            payments = [];


            saveDatabase();


            updateAll();


            showToast(
                "All Data Deleted"
            );

        }
    );

}


/* =========================
   RESET FORM
========================= */

document
    .getElementById(
        "resetForm"
    )
    ?.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    document
                        .getElementById(
                            "qrcode"
                        )
                        .innerHTML =

                        "<span>Select a plan to generate QR</span>";


                    document
                        .getElementById(
                            "qrDetails"
                        )
                        ?.classList.add(
                            "hidden"
                        );

                },
                50
            );

        }
    );


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(
    value
) {

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
   SET TEXT
========================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================
   TOAST
========================= */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}