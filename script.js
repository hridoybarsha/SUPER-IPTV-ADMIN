/* =========================================================
   SUPER IPTV — PROFESSIONAL MANAGEMENT PANEL
   FINAL SCRIPT.JS
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

    CUSTOMERS: "SUPER_IPTV_CUSTOMERS",

    PAYMENTS: "SUPER_IPTV_PAYMENTS",

    SETTINGS: "SUPER_IPTV_SETTINGS",

    ACTIVITY: "SUPER_IPTV_ACTIVITY"

};


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {

    upiId: "6289033804@ptsbi",

    businessName: "SUPER IPTV",

    contact: "",

    currency: "₹",

    plans: {

        "1 Month": 200,

        "3 Months": 600,

        "6 Months": 1150,

        "12 Months": 2000

    }

};


/* =========================================================
   DATA
========================================================= */

let customers = loadData(
    STORAGE_KEYS.CUSTOMERS,
    []
);


let payments = loadData(
    STORAGE_KEYS.PAYMENTS,
    []
);


let settings = loadData(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
);


let activities = loadData(
    STORAGE_KEYS.ACTIVITY,
    []
);


let revenueChart = null;

let customerStatusChart = null;

let currentCustomerId = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePanel();

    }
);


/* =========================================================
   INITIALIZE PANEL
========================================================= */

function initializePanel() {

    setupNavigation();

    setupMobileMenu();

    setupCustomerForm();

    setupPlanListeners();

    setupDashboardQR();

    setupGlobalSearch();

    setupModal();

    setupHeaderButtons();

    setupBackupRestore();

    setupSettings();

    renderAll();

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadData(
    key,
    fallback
) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {

            return fallback;

        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Storage error:",
            error
        );

        return fallback;

    }

}


function saveData(
    key,
    data
) {

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const page =
                        item.dataset.page;

                    if (!page) {

                        return;

                    }

                    showPage(page);

                }
            );

        }
    );


    const pageLinks =
        document.querySelectorAll(
            "[data-page-link]"
        );


    pageLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    const page =
                        link.dataset.pageLink;

                    if (page) {

                        showPage(page);

                    }

                }
            );

        }
    );

}


/* =========================================================
   SHOW PAGE
========================================================= */

function showPage(
    page
) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        function (section) {

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            "page-" + page
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.page ===
                page
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    updatePageHeader(
        page
    );


    if (page === "customers") {

        renderCustomers();

    }


    if (page === "subscriptions") {

        renderSubscriptions();

    }


    if (page === "payments") {

        renderPayments();

    }


    if (page === "notifications") {

        renderNotifications();

    }


    if (page === "plans") {

        renderPlans();

    }


    if (page === "backup") {

        renderBackup();

    }


    if (page === "settings") {

        renderSettings();

    }


    if (page === "profile") {

        renderProfile();

    }


    if (page === "activity") {

        renderActivity();

    }


    // Close mobile sidebar

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }

}


/* =========================================================
   PAGE HEADER
========================================================= */

function updatePageHeader(
    page
) {

    const titles = {

        dashboard: [
            "Dashboard",
            "Welcome back, Administrator"
        ],

        customers: [
            "Customers",
            "Manage all your IPTV customers"
        ],

        "add-customer": [
            "Add Customer",
            "Create a new IPTV subscription"
        ],

        subscriptions: [
            "Subscriptions",
            "Track and renew subscriptions"
        ],

        payments: [
            "Payments",
            "Track customer payments and revenue"
        ],

        invoices: [
            "Invoices",
            "Create and manage customer invoices"
        ],

        notifications: [
            "Notifications",
            "Important customer and payment alerts"
        ],

        plans: [
            "Plans & Pricing",
            "Manage subscription plans and prices"
        ],

        reports: [
            "Reports & Analytics",
            "Analyze your business performance"
        ],

        backup: [
            "Backup & Restore",
            "Export or restore your panel data"
        ],

        settings: [
            "Settings",
            "Configure your IPTV management panel"
        ],

        profile: [
            "Profile",
            "Administrator profile"
        ],

        activity: [
            "Activity Log",
            "Recent panel activities"
        ]

    };


    const data =
        titles[page] ||
        titles.dashboard;


    const title =
        document.getElementById(
            "pageTitle"
        );


    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    if (title) {

        title.textContent =
            data[0];

    }


    if (subtitle) {

        subtitle.textContent =
            data[1];

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        menuToggle &&
        sidebar
    ) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }

}


/* =========================================================
   CUSTOMER FORM
========================================================= */

function setupCustomerForm() {

    const form =
        document.getElementById(
            "customerForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            saveCustomer();

        }
    );


    const startDate =
        document.getElementById(
            "customerStartDate"
        );


    if (startDate) {

        if (!startDate.value) {

            startDate.value =
                getTodayDate();

        }


        updateCustomerExpiry();

    }

}


/* =========================================================
   PLAN LISTENERS
========================================================= */

function setupPlanListeners() {

    const plan =
        document.getElementById(
            "customerPlan"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            function () {

                updateCustomerAmount();

                updateCustomerExpiry();

                generateCustomerQR();

            }
        );

    }


    const startDate =
        document.getElementById(
            "customerStartDate"
        );


    if (startDate) {

        startDate.addEventListener(
            "change",
            function () {

                updateCustomerExpiry();

            }
        );

    }


    const amount =
        document.getElementById(
            "customerAmount"
        );


    if (amount) {

        amount.addEventListener(
            "input",
            function () {

                generateCustomerQR();

            }
        );

    }

}


/* =========================================================
   PLAN AMOUNT AUTO FILL
========================================================= */

function updateCustomerAmount() {

    const plan =
        document.getElementById(
            "customerPlan"
        );


    const amount =
        document.getElementById(
            "customerAmount"
        );


    if (
        !plan ||
        !amount
    ) {

        return;

    }


    const price =
        getPlanPrice(
            plan.value
        );


    if (price !== null) {

        amount.value =
            price;

    }


    generateCustomerQR();

}


/* =========================================================
   GET PLAN PRICE
========================================================= */

function getPlanPrice(
    plan
) {

    if (
        settings &&
        settings.plans &&
        Object.prototype.hasOwnProperty.call(
            settings.plans,
            plan
        )
    ) {

        return Number(
            settings.plans[plan]
        );

    }


    return null;

}


/* =========================================================
   EXPIRY DATE AUTO GENERATE
========================================================= */

function updateCustomerExpiry() {

    const startDateInput =
        document.getElementById(
            "customerStartDate"
        );


    const planInput =
        document.getElementById(
            "customerPlan"
        );


    const expiryInput =
        document.getElementById(
            "customerExpiryDate"
        );


    if (
        !startDateInput ||
        !planInput ||
        !expiryInput
    ) {

        return;

    }


    const startDate =
        startDateInput.value;


    const plan =
        planInput.value;


    if (
        !startDate ||
        !plan
    ) {

        expiryInput.value = "";

        return;

    }


    const months =
        getPlanMonths(
            plan
        );


    if (!months) {

        return;

    }


    const date =
        parseLocalDate(
            startDate
        );


    date.setMonth(
        date.getMonth() +
        months
    );


    // Subscription expiry is one day before
    // the same date after the selected period.

    date.setDate(
        date.getDate() - 1
    );


    expiryInput.value =
        formatInputDate(
            date
        );

}


/* =========================================================
   PLAN MONTHS
========================================================= */

function getPlanMonths(
    plan
) {

    const months = {

        "1 Month": 1,

        "3 Months": 3,

        "6 Months": 6,

        "12 Months": 12

    };


    return months[plan] || 0;

}


/* =========================================================
   CUSTOMER QR
========================================================= */

function generateCustomerQR() {

    const qrElement =
        document.getElementById(
            "customerQrCode"
        );


    if (!qrElement) {

        return;

    }


    const amountInput =
        document.getElementById(
            "customerAmount"
        );


    const amount =
        amountInput
            ? Number(
                amountInput.value
            )
            : 0;


    generateUPIQR(

        qrElement,

        amount

    );


    const upiText =
        document.getElementById(
            "customerQrUpiText"
        );


    if (upiText) {

        upiText.textContent =
            settings.upiId;

    }

}


/* =========================================================
   DASHBOARD QR
========================================================= */

function setupDashboardQR() {

    const amount =
        document.getElementById(
            "dashboardAmount"
        );


    const plan =
        document.getElementById(
            "dashboardPlan"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            function () {

                const price =
                    getPlanPrice(
                        plan.value
                    );


                if (
                    amount &&
                    price !== null
                ) {

                    amount.value =
                        price;

                }


                generateDashboardQR();

            }
        );

    }


    if (amount) {

        amount.addEventListener(
            "input",
            function () {

                generateDashboardQR();

            }
        );

    }


    generateDashboardQR();


    const copyBtn =
        document.getElementById(
            "copyUpiBtn"
        );


    if (copyBtn) {

        copyBtn.addEventListener(
            "click",
            copyUPI
        );

    }


    const downloadBtn =
        document.getElementById(
            "downloadDashboardQr"
        );


    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            function () {

                downloadQRCode(
                    "dashboardQrCode",
                    "SUPER-IPTV-Payment-QR"
                );

            }
        );

    }


    const shareBtn =
        document.getElementById(
            "shareDashboardQr"
        );


    if (shareBtn) {

        shareBtn.addEventListener(
            "click",
            shareDashboardWhatsApp
        );

    }

}


/* =========================================================
   GENERATE DASHBOARD QR
========================================================= */

function generateDashboardQR() {

    const qrElement =
        document.getElementById(
            "dashboardQrCode"
        );


    const amountInput =
        document.getElementById(
            "dashboardAmount"
        );


    if (!qrElement) {

        return;

    }


    const amount =
        amountInput
            ? Number(
                amountInput.value
            )
            : 0;


    generateUPIQR(

        qrElement,

        amount

    );


    const upi =
        document.getElementById(
            "dashboardUpiId"
        );


    if (upi) {

        upi.textContent =
            settings.upiId;

    }

}


/* =========================================================
   GENERATE UPI QR
========================================================= */

function generateUPIQR(
    element,
    amount
) {

    if (!element) {

        return;

    }


    element.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        element.innerHTML =

            "<span style='font-size:11px;color:#dc2626;text-align:center'>" +

            "QR Library not loaded" +

            "</span>";

        return;

    }


    let upiURL =

        "upi://pay" +

        "?pa=" +

        encodeURIComponent(
            settings.upiId
        ) +

        "&pn=" +

        encodeURIComponent(
            settings.businessName
        ) +

        "&cu=INR";


    if (
        amount &&
        Number(amount) > 0
    ) {

        upiURL +=

            "&am=" +

            Number(amount).toFixed(2);

    }


    new QRCode(

        element,

        {

            text: upiURL,

            width: 170,

            height: 170,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }

    );

}


/* =========================================================
   SAVE CUSTOMER
========================================================= */

function saveCustomer() {

    const name =
        getValue(
            "customerName"
        );


    const phone =
        getValue(
            "customerPhone"
        );


    const username =
        getValue(
            "customerUsername"
        );


    const password =
        getValue(
            "customerPassword"
        );


    const portal =
        getValue(
            "customerPortal"
        );


    const plan =
        getValue(
            "customerPlan"
        );


    const amount =
        Number(
            getValue(
                "customerAmount"
            ) || 0
        );


    const startDate =
        getValue(
            "customerStartDate"
        );


    const expiryDate =
        getValue(
            "customerExpiryDate"
        );


    const paymentStatus =
        getValue(
            "customerPaymentStatus"
        ) ||
        "Paid";


    if (
        !name ||
        !phone ||
        !username ||
        !password ||
        !plan ||
        !startDate
    ) {

        showToast(

            "Please fill all required fields.",

            "error"

        );

        return;

    }


    const customer = {

        id:
            "CUS-" +
            Date.now(),

        name,

        phone,

        username,

        password,

        portal,

        plan,

        amount,

        startDate,

        expiryDate,

        paymentStatus,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    customers.unshift(
        customer
    );


    saveData(

        STORAGE_KEYS.CUSTOMERS,

        customers

    );


    // Add payment record

    if (
        amount > 0
    ) {

        const payment = {

            id:
                "PAY-" +
                Date.now(),

            customerId:
                customer.id,

            customerName:
                name,

            amount,

            plan,

            date:
                new Date().toISOString(),

            status:
                paymentStatus

        };


        payments.unshift(
            payment
        );


        saveData(

            STORAGE_KEYS.PAYMENTS,

            payments

        );

    }


    addActivity(

        "New customer added: " +
        name

    );


    showToast(

        "Customer added successfully!",

        "success"

    );


    resetCustomerForm();


    renderAll();


    setTimeout(
        function () {

            showPage(
                "customers"
            );

        },
        500
    );

}


/* =========================================================
   RESET CUSTOMER FORM
========================================================= */

function resetCustomerForm() {

    const form =
        document.getElementById(
            "customerForm"
        );


    if (form) {

        form.reset();

    }


    const startDate =
        document.getElementById(
            "customerStartDate"
        );


    if (startDate) {

        startDate.value =
            getTodayDate();

    }


    const expiry =
        document.getElementById(
            "customerExpiryDate"
        );


    if (expiry) {

        expiry.value = "";

    }


    const qr =
        document.getElementById(
            "customerQrCode"
        );


    if (qr) {

        qr.innerHTML = "";

    }


    const qrText =
        document.getElementById(
            "customerQrUpiText"
        );


    if (qrText) {

        qrText.textContent =
            settings.upiId;

    }

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    updateDashboardStats();

    renderCustomers();

    renderRecentCustomers();

    renderRecentPayments();

    renderSubscriptions();

    renderPayments();

    renderNotifications();

    renderPlans();

    renderCharts();

    updateNotificationBadge();

    generateDashboardQR();

}


/* =========================================================
   RENDER CUSTOMERS
========================================================= */

function renderCustomers(
    list = customers
) {

    const table =
        document.getElementById(
            "customersTable"
        );


    if (!table) {

        return;

    }


    if (!list.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-table"
                >

                    No customers yet

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        list.map(

            function (customer) {

                const status =
                    getCustomerStatus(
                        customer
                    );


                return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    customer.name
                                )}
                            </strong>

                        </td>


                        <td>

                            ${escapeHTML(
                                customer.phone
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                customer.username
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                customer.plan
                            )}

                        </td>


                        <td>

                            ${formatDisplayDate(
                                customer.expiryDate
                            )}

                        </td>


                        <td>

                            <span
                                class="status-badge
                                ${status.className}"
                            >

                                ${status.label}

                            </span>

                        </td>


                        <td>

                            <div
                                class="action-buttons"
                            >

                                <button
                                    class="action-btn"
                                    onclick="
                                        viewCustomer(
                                            '${customer.id}'
                                        )
                                    "
                                    title="View"
                                >

                                    <i
                                        class="
                                        fa-solid
                                        fa-eye
                                        "
                                    ></i>

                                </button>


                                <button
                                    class="action-btn"
                                    onclick="
                                        sendCustomerWhatsApp(
                                            '${customer.id}'
                                        )
                                    "
                                    title="WhatsApp"
                                >

                                    <i
                                        class="
                                        fa-brands
                                        fa-whatsapp
                                        "
                                    ></i>

                                </button>


                                <button
                                    class="
                                    action-btn
                                    delete
                                    "
                                    onclick="
                                        deleteCustomer(
                                            '${customer.id}'
                                        )
                                    "
                                    title="Delete"
                                >

                                    <i
                                        class="
                                        fa-solid
                                        fa-trash
                                        "
                                    ></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* =========================================================
   RECENT CUSTOMERS
========================================================= */

function renderRecentCustomers() {

    const table =
        document.getElementById(
            "recentCustomersTable"
        );


    if (!table) {

        return;

    }


    const recent =
        customers.slice(
            0,
            5
        );


    if (!recent.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table"
                >
                    No customers yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        recent.map(

            function (customer) {

                const status =
                    getCustomerStatus(
                        customer
                    );


                return `

                    <tr>

                        <td>

                            ${escapeHTML(
                                customer.name
                            )}

                        </td>

                        <td>

                            ${escapeHTML(
                                customer.username
                            )}

                        </td>

                        <td>

                            ${escapeHTML(
                                customer.plan
                            )}

                        </td>

                        <td>

                            ${formatDisplayDate(
                                customer.expiryDate
                            )}

                        </td>

                        <td>

                            <span
                                class="
                                status-badge
                                ${status.className}
                                "
                            >

                                ${status.label}

                            </span>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* =========================================================
   RECENT PAYMENTS
========================================================= */

function renderRecentPayments() {

    const table =
        document.getElementById(
            "recentPaymentsTable"
        );


    if (!table) {

        return;

    }


    const recent =
        payments.slice(
            0,
            5
        );


    if (!recent.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table"
                >
                    No payments yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        recent.map(

            function (payment) {

                return `

                    <tr>

                        <td>

                            ${escapeHTML(
                                payment.id
                            )}

                        </td>

                        <td>

                            ${escapeHTML(
                                payment.customerName
                            )}

                        </td>

                        <td>

                            ₹${Number(
                                payment.amount
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </td>

                        <td>

                            ${formatDisplayDateTime(
                                payment.date
                            )}

                        </td>

                        <td>

                            <span
                                class="
                                status-badge
                                ${payment.status === "Paid"
                                    ? "active"
                                    : "pending"}
                                "
                            >

                                ${escapeHTML(
                                    payment.status
                                )}

                            </span>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* =========================================================
   SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

    const table =
        document.getElementById(
            "subscriptionsTable"
        );


    if (!table) {

        return;

    }


    if (!customers.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table"
                >
                    No subscriptions yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        customers.map(

            function (customer) {

                const status =
                    getCustomerStatus(
                        customer
                    );


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                customer.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                customer.plan
                            )}
                        </td>

                        <td>
                            ${formatDisplayDate(
                                customer.startDate
                            )}
                        </td>

                        <td>
                            ${formatDisplayDate(
                                customer.expiryDate
                            )}
                        </td>

                        <td>

                            <span
                                class="
                                status-badge
                                ${status.className}
                                "
                            >

                                ${status.label}

                            </span>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* =========================================================
   PAYMENTS
========================================================= */

function renderPayments() {

    const table =
        document.getElementById(
            "paymentsTable"
        );


    if (!table) {

        return;

    }


    if (!payments.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table"
                >
                    No payments yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        payments.map(

            function (payment) {

                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                payment.id
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.customerName
                            )}
                        </td>

                        <td>
                            ₹${Number(
                                payment.amount
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </td>

                        <td>
                            ${formatDisplayDateTime(
                                payment.date
                            )}
                        </td>

                        <td>

                            <span
                                class="
                                status-badge
                                ${payment.status === "Paid"
                                    ? "active"
                                    : "pending"}
                                "
                            >

                                ${escapeHTML(
                                    payment.status
                                )}

                            </span>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function updateDashboardStats() {

    const total =
        customers.length;


    const active =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "active"

        ).length;


    const expired =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expired"

        ).length;


    const expiring =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expiring"

        ).length;


    const pending =
        payments.filter(

            p =>
                p.status !== "Paid"

        ).length;


    const revenue =
        payments.reduce(

            function (
                sum,
                payment
            ) {

                if (
                    payment.status ===
                    "Paid"
                ) {

                    return (
                        sum +
                        Number(
                            payment.amount
                        )
                    );

                }

                return sum;

            },

            0

        );


    const now =
        new Date();


    const monthlyRevenue =
        payments.reduce(

            function (
                sum,
                payment
            ) {

                const date =
                    new Date(
                        payment.date
                    );


                if (

                    payment.status ===
                    "Paid" &&

                    date.getMonth() ===
                    now.getMonth() &&

                    date.getFullYear() ===
                    now.getFullYear()

                ) {

                    return (

                        sum +
                        Number(
                            payment.amount
                        )

                    );

                }


                return sum;

            },

            0

        );


    const newThisMonth =
        customers.filter(

            function (customer) {

                const date =
                    new Date(
                        customer.createdAt
                    );


                return (

                    date.getMonth() ===
                    now.getMonth() &&

                    date.getFullYear() ===
                    now.getFullYear()

                );

            }

        ).length;


    setText(
        "totalCustomers",
        total
    );


    setText(
        "activeCustomers",
        active
    );


    setText(
        "expiredCustomers",
        expired
    );


    setText(
        "expiringCustomers",
        expiring
    );


    setText(
        "totalRevenue",
        "₹" +
        revenue.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "monthlyRevenue",
        "₹" +
        monthlyRevenue.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "pendingPayments",
        pending
    );


    setText(
        "newThisMonth",
        newThisMonth
    );


    setText(
        "statusTotal",
        total
    );


    const activePercent =
        total
            ? Math.round(
                active /
                total *
                100
            )
            : 0;


    const expiredPercent =
        total
            ? Math.round(
                expired /
                total *
                100
            )
            : 0;


    const expiringPercent =
        total
            ? Math.round(
                expiring /
                total *
                100
            )
            : 0;


    setText(
        "activePercent",
        activePercent + "%"
    );


    setText(
        "expiredPercent",
        expiredPercent + "%"
    );


    setText(
        "expiringPercent",
        expiringPercent + "%"
    );


    setText(
        "suspendedPercent",
        "0%"
    );

}


/* =========================================================
   CUSTOMER STATUS
========================================================= */

function getCustomerStatus(
    customer
) {

    if (
        !customer.expiryDate
    ) {

        return {

            key: "active",

            label: "Active",

            className: "active"

        };

    }


    const expiry =
        parseLocalDate(
            customer.expiryDate
        );


    const today =
        parseLocalDate(
            getTodayDate()
        );


    const diff =
        Math.ceil(

            (
                expiry -
                today
            ) /

            (
                1000 *
                60 *
                60 *
                24
            )

        );


    if (
        diff < 0
    ) {

        return {

            key: "expired",

            label: "Expired",

            className: "expired"

        };

    }


    if (
        diff <= 7
    ) {

        return {

            key: "expiring",

            label:
                diff === 0
                    ? "Expires Today"
                    : "Expiring Soon",

            className: "expiring"

        };

    }


    return {

        key: "active",

        label: "Active",

        className: "active"

    };

}


/* =========================================================
   VIEW CUSTOMER
========================================================= */

function viewCustomer(
    id
) {

    const customer =
        customers.find(

            c =>
                c.id === id

        );


    if (!customer) {

        return;

    }


    currentCustomerId =
        id;


    const details =
        document.getElementById(
            "customerDetails"
        );


    if (!details) {

        return;

    }


    const status =
        getCustomerStatus(
            customer
        );


    details.innerHTML = `

        <div
            class="customer-detail-item"
        >

            <span>
                Customer Name
            </span>

            <strong>
                ${escapeHTML(
                    customer.name
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Phone
            </span>

            <strong>
                ${escapeHTML(
                    customer.phone
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Username
            </span>

            <strong>
                ${escapeHTML(
                    customer.username
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Password
            </span>

            <strong>
                ${escapeHTML(
                    customer.password
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Portal URL
            </span>

            <strong>
                ${escapeHTML(
                    customer.portal ||
                    "Not provided"
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Plan
            </span>

            <strong>
                ${escapeHTML(
                    customer.plan
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Start Date
            </span>

            <strong>
                ${formatDisplayDate(
                    customer.startDate
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Expiry Date
            </span>

            <strong>
                ${formatDisplayDate(
                    customer.expiryDate
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Amount
            </span>

            <strong>
                ₹${Number(
                    customer.amount || 0
                ).toLocaleString(
                    "en-IN"
                )}
            </strong>

        </div>


        <div
            class="customer-detail-item"
        >

            <span>
                Status
            </span>

            <strong>

                <span
                    class="
                    status-badge
                    ${status.className}
                    "
                >

                    ${status.label}

                </span>

            </strong>

        </div>

    `;


    const modal =
        document.getElementById(
            "customerModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    const modal =
        document.getElementById(
            "customerModal"
        );


    const close =
        document.getElementById(
            "closeCustomerModal"
        );


    if (close) {

        close.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal();

                }

            }
        );

    }


    const whatsapp =
        document.getElementById(
            "customerWhatsAppBtn"
        );


    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            function () {

                if (
                    currentCustomerId
                ) {

                    sendCustomerWhatsApp(
                        currentCustomerId
                    );

                }

            }
        );

    }


    const renew =
        document.getElementById(
            "customerRenewBtn"
        );


    if (renew) {

        renew.addEventListener(
            "click",
            function () {

                if (
                    currentCustomerId
                ) {

                    renewCustomer(
                        currentCustomerId
                    );

                }

            }
        );

    }

}


function closeModal() {

    const modal =
        document.getElementById(
            "customerModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomer(
    id
) {

    const customer =
        customers.find(

            c =>
                c.id === id

        );


    if (!customer) {

        return;

    }


    const confirmDelete =
        confirm(

            "Delete customer " +
            customer.name +
            "?"

        );


    if (!confirmDelete) {

        return;

    }


    customers =
        customers.filter(

            c =>
                c.id !== id

        );


    payments =
        payments.filter(

            p =>
                p.customerId !== id

        );


    saveData(

        STORAGE_KEYS.CUSTOMERS,

        customers

    );


    saveData(

        STORAGE_KEYS.PAYMENTS,

        payments

    );


    addActivity(

        "Customer deleted: " +
        customer.name

    );


    showToast(

        "Customer deleted.",

        "success"

    );


    renderAll();

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createCustomerMessage(
    customer
) {

    return (

        "Hello " +
        customer.name +
        ",\n\n" +

        "Your SUPER IPTV subscription details:\n\n" +

        "Username: " +
        customer.username +
        "\n" +

        "Password: " +
        customer.password +
        "\n" +

        "Plan: " +
        customer.plan +
        "\n" +

        "Start Date: " +
        formatDisplayDate(
            customer.startDate
        ) +
        "\n" +

        "Expiry Date: " +
        formatDisplayDate(
            customer.expiryDate
        ) +
        "\n" +

        "Amount: ₹" +
        Number(
            customer.amount || 0
        ).toLocaleString(
            "en-IN"
        ) +
        "\n\n" +

        (
            customer.portal
                ? "Portal: " +
                  customer.portal +
                  "\n\n"
                : ""
        ) +

        "Thank you for choosing SUPER IPTV."

    );

}


/* =========================================================
   SEND CUSTOMER WHATSAPP
========================================================= */

function sendCustomerWhatsApp(
    id
) {

    const customer =
        customers.find(

            c =>
                c.id === id

        );


    if (!customer) {

        return;

    }


    const phone =
        customer.phone.replace(
            /\D/g,
            ""
        );


    const message =
        createCustomerMessage(
            customer
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
   DASHBOARD WHATSAPP
========================================================= */

function shareDashboardWhatsApp() {

    const amountInput =
        document.getElementById(
            "dashboardAmount"
        );


    const amount =
        amountInput
            ? Number(
                amountInput.value
            )
            : 0;


    const message =

        "SUPER IPTV Payment\n\n" +

        "UPI ID: " +
        settings.upiId +
        "\n" +

        "Amount: ₹" +
        amount +
        "\n\n" +

        "Please scan the QR code to complete payment.";


    window.open(

        "https://wa.me/?text=" +

        encodeURIComponent(
            message
        ),

        "_blank"

    );

}


/* =========================================================
   COPY UPI
========================================================= */

function copyUPI() {

    if (
        navigator.clipboard
    ) {

        navigator.clipboard.writeText(

            settings.upiId

        ).then(

            function () {

                showToast(

                    "UPI ID copied.",

                    "success"

                );

            }

        );

    } else {

        showToast(

            settings.upiId,

            "success"

        );

    }

}


/* =========================================================
   DOWNLOAD QR
========================================================= */

function downloadQRCode(
    elementId,
    fileName
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    const canvas =
        element.querySelector(
            "canvas"
        );


    const image =
        element.querySelector(
            "img"
        );


    let dataURL = null;


    if (canvas) {

        dataURL =
            canvas.toDataURL(
                "image/png"
            );

    } else if (image) {

        dataURL =
            image.src;

    }


    if (!dataURL) {

        showToast(

            "QR code is not ready.",

            "error"

        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        dataURL;


    link.download =
        fileName +
        ".png";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


/* =========================================================
   SEARCH
========================================================= */

function setupGlobalSearch() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        function () {

            const keyword =
                search.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                renderCustomers();

                return;

            }


            const filtered =
                customers.filter(

                    function (customer) {

                        return (

                            customer.name
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            customer.phone
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            customer.username
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            customer.plan
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                        );

                    }

                );


            showPage(
                "customers"
            );


            renderCustomers(
                filtered
            );

        }
    );

}


/* =========================================================
   CHARTS
========================================================= */

function renderCharts() {

    renderRevenueChart();

    renderCustomerStatusChart();

}


/* =========================================================
   REVENUE CHART
========================================================= */

function renderRevenueChart() {

    const canvas =
        document.getElementById(
            "revenueChart"
        );


    if (!canvas) {

        return;

    }


    if (
        revenueChart
    ) {

        revenueChart.destroy();

    }


    const labels = [];

    const data = [];


    const now =
        new Date();


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date(

                now.getFullYear(),

                now.getMonth() -
                i,

                1

            );


        labels.push(

            date.toLocaleDateString(

                "en-US",

                {

                    month: "short"

                }

            )

        );


        const month =
            date.getMonth();


        const year =
            date.getFullYear();


        const revenue =
            payments.reduce(

                function (
                    sum,
                    payment
                ) {

                    const paymentDate =
                        new Date(
                            payment.date
                        );


                    if (

                        payment.status ===
                        "Paid" &&

                        paymentDate.getMonth() ===
                        month &&

                        paymentDate.getFullYear() ===
                        year

                    ) {

                        return (

                            sum +
                            Number(
                                payment.amount
                            )

                        );

                    }


                    return sum;

                },

                0

            );


        data.push(
            revenue
        );

    }


    revenueChart =
        new Chart(

            canvas,

            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Revenue",

                            data,

                            tension:
                                0.35,

                            fill:
                                true,

                            borderWidth:
                                2

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }

        );

}


/* =========================================================
   CUSTOMER STATUS CHART
========================================================= */

function renderCustomerStatusChart() {

    const canvas =
        document.getElementById(
            "customerStatusChart"
        );


    if (!canvas) {

        return;

    }


    if (
        customerStatusChart
    ) {

        customerStatusChart.destroy();

    }


    const active =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "active"

        ).length;


    const expired =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expired"

        ).length;


    const expiring =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expiring"

        ).length;


    customerStatusChart =

        new Chart(

            canvas,

            {

                type: "doughnut",

                data: {

                    labels: [

                        "Active",

                        "Expired",

                        "Expiring Soon",

                        "Suspended"

                    ],

                    datasets: [

                        {

                            data: [

                                active,

                                expired,

                                expiring,

                                0

                            ],

                            borderWidth:
                                0,

                            cutout:
                                "72%"

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }

        );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsContent"
        );


    if (!container) {

        return;

    }


    const expiring =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expiring"

        );


    const expired =
        customers.filter(

            c =>
                getCustomerStatus(c).key ===
                "expired"

        );


    let html = "";


    if (
        !expiring.length &&
        !expired.length
    ) {

        html = `

            <div class="empty-table">

                No notifications.

            </div>

        `;

    }


    expiring.forEach(

        function (customer) {

            html += `

                <div
                    class="
                    notification-item
                    "
                    style="
                    padding:15px;
                    margin-bottom:10px;
                    background:#fff7ed;
                    border-radius:9px;
                    "
                >

                    <strong>
                        Subscription Expiring
                    </strong>

                    <p style="
                        margin-top:5px;
                        font-size:11px;
                    ">

                        ${escapeHTML(
                            customer.name
                        )}
                        subscription expires on
                        ${formatDisplayDate(
                            customer.expiryDate
                        )}

                    </p>

                </div>

            `;

        }

    );


    expired.forEach(

        function (customer) {

            html += `

                <div
                    style="
                    padding:15px;
                    margin-bottom:10px;
                    background:#fef2f2;
                    border-radius:9px;
                    "
                >

                    <strong>
                        Subscription Expired
                    </strong>

                    <p style="
                        margin-top:5px;
                        font-size:11px;
                    ">

                        ${escapeHTML(
                            customer.name
                        )}
                        subscription expired on
                        ${formatDisplayDate(
                            customer.expiryDate
                        )}

                    </p>

                </div>

            `;

        }

    );


    container.innerHTML =
        html;

}


/* =========================================================
   NOTIFICATION BADGE
========================================================= */

function updateNotificationBadge() {

    const count =
        customers.filter(

            c => {

                const status =
                    getCustomerStatus(
                        c
                    );


                return (

                    status.key ===
                    "expiring" ||

                    status.key ===
                    "expired"

                );

            }

        ).length;


    setText(
        "notificationBadge",
        count
    );


    const dot =
        document.getElementById(
            "headerNotificationDot"
        );


    if (dot) {

        dot.style.display =
            count > 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   PLANS
========================================================= */

function renderPlans() {

    const container =
        document.getElementById(
            "plansContent"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            style="
            display:grid;
            grid-template-columns:
            repeat(auto-fit,minmax(200px,1fr));
            gap:15px;
            "
        >

            ${Object.entries(
                settings.plans
            ).map(

                function (
                    [plan, price]
                ) {

                    return `

                        <div
                            style="
                            padding:20px;
                            border:
                            1px solid #e5e7eb;
                            border-radius:12px;
                            "
                        >

                            <h3>
                                ${escapeHTML(
                                    plan
                                )}
                            </h3>

                            <strong
                                style="
                                display:block;
                                margin-top:10px;
                                font-size:22px;
                                color:#6c5ce7;
                                "
                            >

                                ₹${Number(
                                    price
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>

                    `;

                }

            ).join("")}

        </div>

    `;

}


/* =========================================================
   BACKUP & RESTORE
========================================================= */

function setupBackupRestore() {

    renderBackup();

}


function renderBackup() {

    const container =
        document.getElementById(
            "backupContent"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            style="
            display:flex;
            flex-wrap:wrap;
            gap:12px;
            "
        >

            <button
                class="btn btn-primary"
                id="exportBackupBtn"
            >

                <i
                    class="
                    fa-solid
                    fa-download
                    "
                ></i>

                Export Backup

            </button>


            <label
                class="btn btn-secondary"
                style="cursor:pointer"
            >

                <i
                    class="
                    fa-solid
                    fa-upload
                    "
                ></i>

                Import Backup

                <input
                    type="file"
                    id="importBackupInput"
                    accept=".json"
                    style="display:none"
                >

            </label>

        </div>

    `;


    const exportBtn =
        document.getElementById(
            "exportBackupBtn"
        );


    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            exportBackup
        );

    }


    const importInput =
        document.getElementById(
            "importBackupInput"
        );


    if (importInput) {

        importInput.addEventListener(
            "change",
            importBackup
        );

    }

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

function exportBackup() {

    const backup = {

        customers,

        payments,

        settings,

        activities,

        exportedAt:
            new Date().toISOString()

    };


    const blob =
        new Blob(

            [

                JSON.stringify(
                    backup,
                    null,
                    2
                )

            ],

            {

                type:
                    "application/json"

            }

        );


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

        "SUPER-IPTV-Backup-" +

        getTodayDate() +

        ".json";


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(

        "Backup exported successfully.",

        "success"

    );

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

function importBackup(
    event
) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                if (
                    Array.isArray(
                        backup.customers
                    )
                ) {

                    customers =
                        backup.customers;

                }


                if (
                    Array.isArray(
                        backup.payments
                    )
                ) {

                    payments =
                        backup.payments;

                }


                if (
                    backup.settings
                ) {

                    settings = {

                        ...DEFAULT_SETTINGS,

                        ...backup.settings

                    };

                }


                if (
                    Array.isArray(
                        backup.activities
                    )
                ) {

                    activities =
                        backup.activities;

                }


                saveData(

                    STORAGE_KEYS.CUSTOMERS,

                    customers

                );


                saveData(

                    STORAGE_KEYS.PAYMENTS,

                    payments

                );


                saveData(

                    STORAGE_KEYS.SETTINGS,

                    settings

                );


                saveData(

                    STORAGE_KEYS.ACTIVITY,

                    activities

                );


                renderAll();


                showToast(

                    "Backup restored successfully.",

                    "success"

                );


            } catch (error) {

                showToast(

                    "Invalid backup file.",

                    "error"

                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    renderSettings();

}


function renderSettings() {

    const container =
        document.getElementById(
            "settingsContent"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <form
            id="settingsForm"
        >

            <div
                class="form-grid"
            >

                <div
                    class="form-group"
                >

                    <label>
                        Business Name
                    </label>

                    <input
                        type="text"
                        id="settingBusinessName"
                        value="${escapeAttribute(
                            settings.businessName
                        )}"
                    >

                </div>


                <div
                    class="form-group"
                >

                    <label>
                        UPI ID
                    </label>

                    <input
                        type="text"
                        id="settingUpiId"
                        value="${escapeAttribute(
                            settings.upiId
                        )}"
                    >

                </div>


                <div
                    class="form-group"
                >

                    <label>
                        Contact Number
                    </label>

                    <input
                        type="text"
                        id="settingContact"
                        value="${escapeAttribute(
                            settings.contact || ""
                        )}"
                    >

                </div>

            </div>


            <div
                class="form-actions"
            >

                <button
                    type="submit"
                    class="btn btn-primary"
                >

                    <i
                        class="
                        fa-solid
                        fa-save
                        "
                    ></i>

                    Save Settings

                </button>

            </div>

        </form>

    `;


    const form =
        document.getElementById(
            "settingsForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                settings.businessName =

                    getValue(
                        "settingBusinessName"
                    ) ||

                    DEFAULT_SETTINGS.businessName;


                settings.upiId =

                    getValue(
                        "settingUpiId"
                    ) ||

                    DEFAULT_SETTINGS.upiId;


                settings.contact =

                    getValue(
                        "settingContact"
                    );


                saveData(

                    STORAGE_KEYS.SETTINGS,

                    settings

                );


                updateQRDisplays();


                showToast(

                    "Settings saved successfully.",

                    "success"

                );

            }
        );

    }

}


/* =========================================================
   UPDATE QR DISPLAYS
========================================================= */

function updateQRDisplays() {

    setText(

        "dashboardUpiId",

        settings.upiId

    );


    setText(

        "customerQrUpiText",

        settings.upiId

    );


    generateDashboardQR();


    generateCustomerQR();

}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile() {

    const container =
        document.getElementById(
            "profileContent"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            style="
            display:flex;
            align-items:center;
            gap:15px;
            "
        >

            <div
                class="profile-avatar"
                style="
                width:60px;
                height:60px;
                background:#eeebff;
                color:#6c5ce7;
                "
            >

                <i
                    class="
                    fa-solid
                    fa-user
                    "
                ></i>

            </div>


            <div>

                <h3>
                    Administrator
                </h3>

                <p
                    style="
                    margin-top:5px;
                    color:#6b7280;
                    font-size:12px;
                    "
                >

                    SUPER IPTV Management Panel

                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   ACTIVITY LOG
========================================================= */

function addActivity(
    message
) {

    activities.unshift({

        id:
            Date.now(),

        message,

        date:
            new Date().toISOString()

    });


    activities =
        activities.slice(
            0,
            100
        );


    saveData(

        STORAGE_KEYS.ACTIVITY,

        activities

    );

}


function renderActivity() {

    const container =
        document.getElementById(
            "activityContent"
        );


    if (!container) {

        return;

    }


    if (!activities.length) {

        container.innerHTML = `

            <div
                class="empty-table"
            >

                No activity yet.

            </div>

        `;

        return;

    }


    container.innerHTML =

        activities.map(

            function (activity) {

                return `

                    <div
                        style="
                        padding:15px 0;
                        border-bottom:
                        1px solid #f1f5f9;
                        "
                    >

                        <strong
                            style="
                            font-size:12px;
                            "
                        >

                            ${escapeHTML(
                                activity.message
                            )}

                        </strong>

                        <div
                            style="
                            margin-top:5px;
                            color:#9ca3af;
                            font-size:10px;
                            "
                        >

                            ${formatDisplayDateTime(
                                activity.date
                            )}

                        </div>

                    </div>

                `;

            }

        ).join("");

}


/* =========================================================
   HEADER BUTTONS
========================================================= */

function setupHeaderButtons() {

    const notificationBtn =
        document.getElementById(
            "headerNotificationBtn"
        );


    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            function () {

                showPage(
                    "notifications"
                );

            }
        );

    }


    const profileBtn =
        document.querySelector(
            ".header-profile-btn"
        );


    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            function () {

                showPage(
                    "profile"
                );

            }
        );

    }

}


/* =========================================================
   RENEW CUSTOMER
========================================================= */

function renewCustomer(
    id
) {

    const customer =
        customers.find(

            c =>
                c.id === id

        );


    if (!customer) {

        return;

    }


    const currentExpiry =
        customer.expiryDate
            ? parseLocalDate(
                customer.expiryDate
            )
            : parseLocalDate(
                getTodayDate()
            );


    const today =
        parseLocalDate(
            getTodayDate()
        );


    let baseDate =
        currentExpiry;


    if (
        currentExpiry <
        today
    ) {

        baseDate =
            today;

    }


    const months =
        getPlanMonths(
            customer.plan
        );


    baseDate.setMonth(

        baseDate.getMonth() +
        months

    );


    baseDate.setDate(

        baseDate.getDate() -
        1

    );


    customer.expiryDate =

        formatInputDate(
            baseDate
        );


    customer.updatedAt =

        new Date().toISOString();


    saveData(

        STORAGE_KEYS.CUSTOMERS,

        customers

    );


    addActivity(

        "Subscription renewed: " +
        customer.name

    );


    showToast(

        "Subscription renewed successfully.",

        "success"

    );


    closeModal();


    renderAll();

}


/* =========================================================
   UTILITY — TODAY
========================================================= */

function getTodayDate() {

    const date =
        new Date();


    return formatInputDate(
        date
    );

}


/* =========================================================
   UTILITY — LOCAL DATE PARSER
========================================================= */

function parseLocalDate(
    value
) {

    if (
        value instanceof Date
    ) {

        return new Date(
            value.getTime()
        );

    }


    const parts =
        String(
            value
        ).split(
            "-"
        );


    return new Date(

        Number(
            parts[0]
        ),

        Number(
            parts[1]
        ) - 1,

        Number(
            parts[2]
        )

    );

}


/* =========================================================
   UTILITY — INPUT DATE
========================================================= */

function formatInputDate(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (

        year +
        "-" +
        month +
        "-" +
        day

    );

}


/* =========================================================
   UTILITY — DISPLAY DATE
========================================================= */

function formatDisplayDate(
    dateString
) {

    if (!dateString) {

        return "—";

    }


    const date =
        parseLocalDate(
            dateString
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(

        "en-IN",

        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}


/* =========================================================
   UTILITY — DATE TIME
========================================================= */

function formatDisplayDateTime(
    dateString
) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            dateString
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleString(

        "en-IN",

        {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}


/* =========================================================
   UTILITY — GET VALUE
========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value.trim()
        : "";

}


/* =========================================================
   UTILITY — SET TEXT
========================================================= */

function setText(
    id,
    text
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            text;

    }

}


/* =========================================================
   UTILITY — ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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


/* =========================================================
   UTILITY — ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        alert(
            message
        );

        return;

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =

        "toast " +
        type;


    toast.innerHTML = `

        <i
            class="
            fa-solid
            ${type === "success"
                ? "fa-circle-check"
                : type === "error"
                    ? "fa-circle-xmark"
                    : "fa-triangle-exclamation"}
            "
        ></i>

        <span>
            ${escapeHTML(
                message
            )}
        </span>

    `;


    container.appendChild(
        toast
    );


    setTimeout(

        function () {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(20px)";


            setTimeout(

                function () {

                    toast.remove();

                },

                300

            );

        },

        3000

    );

}


/* =========================================================
   WINDOW FUNCTIONS
   Used by dynamically generated buttons
========================================================= */

window.viewCustomer =
    viewCustomer;


window.deleteCustomer =
    deleteCustomer;


window.sendCustomerWhatsApp =
    sendCustomerWhatsApp;