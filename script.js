/* =========================================================
   SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
   FINAL SCRIPT.JS
   ========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE = {

    customers: "SUPER_IPTV_CUSTOMERS",
    payments: "SUPER_IPTV_PAYMENTS",
    invoices: "SUPER_IPTV_INVOICES",
    plans: "SUPER_IPTV_PLANS",
    settings: "SUPER_IPTV_SETTINGS",
    notifications: "SUPER_IPTV_NOTIFICATIONS",
    theme: "SUPER_IPTV_THEME"

};


/* =========================================================
   DEFAULT PLANS
========================================================= */

const DEFAULT_PLANS = [

    {
        id: "plan_1",
        name: "1 Month",
        duration: 1,
        price: 200,
        active: true
    },

    {
        id: "plan_3",
        name: "3 Months",
        duration: 3,
        price: 600,
        active: true
    },

    {
        id: "plan_6",
        name: "6 Months",
        duration: 6,
        price: 1150,
        active: true
    },

    {
        id: "plan_12",
        name: "12 Months",
        duration: 12,
        price: 2000,
        active: true
    }

];


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {

    companyName: "SUPER IPTV",

    defaultPortal: "",

    whatsappNumber: "",

    upiId: "6289033804@ptsbi",

    upiName: "SUPER IPTV",

    gstEnabled: false,

    gstRate: 18,

    businessRegistrationNo: "",

    whatsappTemplate:
`Hello {{NAME}},

Your IPTV subscription is now active.

Username: {{USERNAME}}
Password: {{PASSWORD}}

Plan: {{PLAN}}
Amount: ₹{{AMOUNT}}
Expiry: {{EXPIRY}}

Portal: {{PORTAL_URL}}

Thank you for choosing SUPER IPTV.`

};


/* =========================================================
   DATA LOAD
========================================================= */

let customers =
    JSON.parse(localStorage.getItem(STORAGE.customers)) || [];

let payments =
    JSON.parse(localStorage.getItem(STORAGE.payments)) || [];

let invoices =
    JSON.parse(localStorage.getItem(STORAGE.invoices)) || [];

let plans =
    JSON.parse(localStorage.getItem(STORAGE.plans)) ||
    DEFAULT_PLANS;

let settings =
    JSON.parse(localStorage.getItem(STORAGE.settings)) ||
    DEFAULT_SETTINGS;

let notifications =
    JSON.parse(localStorage.getItem(STORAGE.notifications)) || [];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentCustomerId = null;

let currentRenewCustomerId = null;

let revenueChart = null;

let customerChart = null;

let reportRevenueChart = null;

let planChart = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializePanel();

});


/* =========================================================
   INITIALIZE PANEL
========================================================= */

function initializePanel() {

    loadSettingsIntoForm();

    setupNavigation();

    setupCustomerForm();

    setupEditCustomer();

    setupRenewal();

    setupSearchAndFilters();

    setupQRControls();

    setupBackup();

    setupSettings();

    setupNotifications();

    setupTheme();

    setupGlobalSearch();

    setupModalEvents();

    setupPlanManagement();

    updateAllData();

    setDefaultStartDate();

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const page =
                item.dataset.page;

            showPage(page);

        });

    });


    document
        .querySelectorAll("[data-page-link]")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                showPage(
                    button.dataset.pageLink
                );

            });

        });


    const menuToggle =
        document.getElementById("menuToggle");

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                const sidebar =
                    document.getElementById("sidebar");

                if (sidebar) {

                    sidebar.classList.toggle("open");

                }

            }
        );

    }

}


/* =========================================================
   SHOW PAGE
========================================================= */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(function (page) {

            page.classList.remove("active");

        });


    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(function (item) {

            item.classList.remove("active");

            if (
                item.dataset.page === pageId
            ) {

                item.classList.add("active");

            }

        });


    const titles = {

        dashboard: [
            "Dashboard",
            "Welcome back, Administrator"
        ],

        customers: [
            "Customers",
            "Manage all your IPTV customers"
        ],

        addCustomer: [
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
            "Backup",
            "Export and restore panel data"
        ],

        settings: [
            "Settings",
            "Configure your IPTV management panel"
        ]

    };


    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");


    if (titles[pageId]) {

        if (title) {

            title.textContent =
                titles[pageId][0];

        }

        if (subtitle) {

            subtitle.textContent =
                titles[pageId][1];

        }

    }


    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    if (pageId === "reports") {

        setTimeout(
            renderReportCharts,
            100
        );

    }


    if (pageId === "dashboard") {

        setTimeout(
            renderDashboardCharts,
            100
        );

    }

}


/* =========================================================
   CUSTOMER FORM
========================================================= */

function setupCustomerForm() {

    const form =
        document.getElementById("customerForm");

    if (!form) return;


    const plan =
        document.getElementById("plan");

    const startDate =
        document.getElementById("startDate");


    if (plan) {

        plan.addEventListener(
            "change",
            function () {

                updatePlanAmount();

                calculateExpiry();

                generatePaymentQR();

            }
        );

    }


    if (startDate) {

        startDate.addEventListener(
            "change",
            calculateExpiry
        );

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            saveNewCustomer();

        }
    );

}


/* =========================================================
   SET DEFAULT START DATE
========================================================= */

function setDefaultStartDate() {

    const input =
        document.getElementById("startDate");

    if (!input) return;


    if (!input.value) {

        const today =
            new Date();

        input.value =
            formatDateInput(today);

    }

}


/* =========================================================
   PLAN PRICE
========================================================= */

function getPlanByName(name) {

    return plans.find(
        function (plan) {

            return plan.name === name;

        }
    );

}


/* =========================================================
   UPDATE PLAN AMOUNT
========================================================= */

function updatePlanAmount() {

    const planInput =
        document.getElementById("plan");

    const amountInput =
        document.getElementById("amount");


    if (!planInput || !amountInput) return;


    const selectedPlan =
        getPlanByName(
            planInput.value
        );


    if (selectedPlan) {

        amountInput.value =
            selectedPlan.price;

    } else {

        amountInput.value = "";

    }

}


/* =========================================================
   CALCULATE EXPIRY
========================================================= */

function calculateExpiry() {

    const planInput =
        document.getElementById("plan");

    const startInput =
        document.getElementById("startDate");

    const expiryInput =
        document.getElementById("expiryDate");


    if (
        !planInput ||
        !startInput ||
        !expiryInput
    ) return;


    if (
        !planInput.value ||
        !startInput.value
    ) {

        expiryInput.value = "";

        return;

    }


    const selectedPlan =
        getPlanByName(
            planInput.value
        );


    if (!selectedPlan) return;


    const start =
        new Date(
            startInput.value +
            "T00:00:00"
        );


    start.setMonth(
        start.getMonth() +
        selectedPlan.duration
    );


    start.setDate(
        start.getDate() - 1
    );


    expiryInput.value =
        formatDateInput(start);

}


/* =========================================================
   SAVE CUSTOMER
========================================================= */

function saveNewCustomer() {

    const name =
        getValue("name");

    const phone =
        getValue("phone");

    const username =
        getValue("username");

    const password =
        getValue("password");

    const portalUrl =
        getValue("portalUrl");

    const plan =
        getValue("plan");

    const amount =
        Number(
            getValue("amount")
        ) || 0;

    const startDate =
        getValue("startDate");

    const expiryDate =
        getValue("expiryDate");

    const status =
        getValue("status") ||
        "Active";


    if (
        !name ||
        !phone ||
        !username ||
        !password ||
        !plan ||
        !startDate
    ) {

        showToast(
            "Please fill all required fields"
        );

        return;

    }


    const customer = {

        id:
            generateId("CUS"),

        name,

        phone,

        username,

        password,

        portalUrl:
            portalUrl ||
            settings.defaultPortal,

        plan,

        amount,

        startDate,

        expiryDate,

        status,

        createdAt:
            new Date().toISOString()

    };


    customers.unshift(
        customer
    );


    saveCustomers();


    /* PAYMENT */

    const payment = {

        id:
            generateId("PAY"),

        customerId:
            customer.id,

        customerName:
            customer.name,

        plan:
            customer.plan,

        amount:
            customer.amount,

        date:
            new Date().toISOString(),

        method:
            "UPI",

        status:
            "Pending"

    };


    payments.unshift(
        payment
    );


    savePayments();


    /* INVOICE */

    createInvoice(
        customer,
        payment
    );


    addNotification(

        "New Customer",

        `${customer.name} was added successfully.`,

        "success"

    );


    showToast(
        "Customer saved successfully"
    );


    clearCustomerForm();


    updateAllData();


    setTimeout(
        function () {

            showPage("customers");

        },
        700
    );

}


/* =========================================================
   CLEAR CUSTOMER FORM
========================================================= */

function clearCustomerForm() {

    const form =
        document.getElementById("customerForm");

    if (form) {

        form.reset();

    }


    setDefaultStartDate();

    const qr =
        document.getElementById("qrcode");

    if (qr) {

        qr.innerHTML = `

            <div class="qr-placeholder">

                <span>▣</span>

                <p>Select a plan</p>

                <small>
                    QR code will appear here
                </small>

            </div>

        `;

    }


    setText(
        "qrPlan",
        "-"
    );


    setText(
        "qrAmount",
        "₹0"
    );

}


/* =========================================================
   QR CODE GENERATOR
========================================================= */

function generatePaymentQR() {

    const qrContainer =
        document.getElementById("qrcode");

    const planInput =
        document.getElementById("plan");

    const amountInput =
        document.getElementById("amount");


    if (
        !qrContainer ||
        !planInput ||
        !amountInput
    ) return;


    const plan =
        planInput.value;

    const amount =
        Number(
            amountInput.value
        ) || 0;


    if (
        !plan ||
        !amount
    ) {

        qrContainer.innerHTML = `

            <div class="qr-placeholder">

                <span>▣</span>

                <p>Select a plan</p>

                <small>
                    QR code will appear here
                </small>

            </div>

        `;

        setText(
            "qrPlan",
            "-"
        );

        setText(
            "qrAmount",
            "₹0"
        );

        return;

    }


    const upiId =
        settings.upiId ||
        "6289033804@ptsbi";

    const upiName =
        settings.upiName ||
        "SUPER IPTV";


    const upiUrl =

        "upi://pay" +

        "?pa=" +
        encodeURIComponent(
            upiId
        ) +

        "&pn=" +
        encodeURIComponent(
            upiName
        ) +

        "&am=" +
        encodeURIComponent(
            amount
        ) +

        "&cu=INR" +

        "&tn=" +
        encodeURIComponent(
            `${plan} Subscription`
        );


    qrContainer.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML = `

            <div class="qr-placeholder">

                <p>
                    QR library not loaded
                </p>

                <small>
                    Please check internet connection
                </small>

            </div>

        `;

        return;

    }


    new QRCode(

        qrContainer,

        {

            text:
                upiUrl,

            width:
                220,

            height:
                220,

            colorDark:
                "#000000",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }

    );


    setText(
        "qrPlan",
        plan
    );


    setText(
        "qrAmount",
        "₹" +
        amount.toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   QR CONTROLS
========================================================= */

function setupQRControls() {

    const copyButton =
        document.getElementById("copyUpi");

    const downloadButton =
        document.getElementById("downloadQR");


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copyUPI
        );

    }


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            downloadQR
        );

    }

}


function copyUPI() {

    const upi =
        settings.upiId;


    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(upi)
            .then(
                function () {

                    showToast(
                        "UPI ID copied"
                    );

                }
            );

    }

}


function downloadQR() {

    const qrContainer =
        document.getElementById("qrcode");


    if (!qrContainer) return;


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    const image =
        qrContainer.querySelector(
            "img"
        );


    let dataUrl = null;


    if (canvas) {

        dataUrl =
            canvas.toDataURL(
                "image/png"
            );

    } else if (image) {

        dataUrl =
            image.src;

    }


    if (!dataUrl) {

        showToast(
            "Generate QR first"
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        dataUrl;

    link.download =
        "SUPER-IPTV-Payment-QR.png";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


/* =========================================================
   CUSTOMER TABLE
========================================================= */

function renderCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );


    if (!table) return;


    const search =
        (
            document.getElementById(
                "customerSearch"
            )?.value ||
            ""
        )
        .toLowerCase();


    const statusFilter =
        document.getElementById(
            "customerStatusFilter"
        )?.value ||
        "all";


    const planFilter =
        document.getElementById(
            "customerPlanFilter"
        )?.value ||
        "all";


    const filtered =
        customers.filter(
            function (customer) {

                const matchesSearch =

                    customer.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    customer.phone
                        .toLowerCase()
                        .includes(search)

                    ||

                    customer.username
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    statusFilter === "all" ||

                    customer.status ===
                    statusFilter;


                const matchesPlan =

                    planFilter === "all" ||

                    customer.plan ===
                    planFilter;


                return (

                    matchesSearch &&

                    matchesStatus &&

                    matchesPlan

                );

            }
        );


    if (!filtered.length) {

        table.innerHTML = `

            <tr>

                <td colspan="8"
                    style="text-align:center">

                    No customers found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        filtered
            .map(
                customerRow
            )
            .join("");

}


/* =========================================================
   CUSTOMER ROW
========================================================= */

function customerRow(customer) {

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

                <strong>
                    ${escapeHTML(
                        customer.username
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        customer.password
                    )}
                </small>

            </td>


            <td>

                ${escapeHTML(
                    customer.plan
                )}

            </td>


            <td>

                ₹${Number(
                    customer.amount || 0
                ).toLocaleString(
                    "en-IN"
                )}

            </td>


            <td>

                ${formatDisplayDate(
                    customer.expiryDate
                )}

            </td>


            <td>

                <span class="badge ${statusClass(
                    customer.status
                )}">

                    ${customer.status}

                </span>

            </td>


            <td>

                <button
                    class="action-button"
                    onclick="viewCustomer('${customer.id}')"
                >
                    👁️
                </button>


                <button
                    class="action-button"
                    onclick="editCustomer('${customer.id}')"
                >
                    ✏️
                </button>


                <button
                    class="action-button"
                    onclick="deleteCustomer('${customer.id}')"
                >
                    🗑️
                </button>

            </td>

        </tr>

    `;

}


/* =========================================================
   VIEW CUSTOMER
========================================================= */

function viewCustomer(id) {

    const customer =
        customers.find(
            c => c.id === id
        );


    if (!customer) return;


    currentCustomerId =
        id;


    const details =
        document.getElementById(
            "customerDetails"
        );


    if (details) {

        details.innerHTML = `

            <div class="detail-row">

                <span>Name</span>

                <strong>
                    ${escapeHTML(
                        customer.name
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Phone</span>

                <strong>
                    ${escapeHTML(
                        customer.phone
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Username</span>

                <strong>
                    ${escapeHTML(
                        customer.username
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Password</span>

                <strong>
                    ${escapeHTML(
                        customer.password
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Plan</span>

                <strong>
                    ${escapeHTML(
                        customer.plan
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Amount</span>

                <strong>
                    ₹${Number(
                        customer.amount || 0
                    ).toLocaleString(
                        "en-IN"
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Start Date</span>

                <strong>
                    ${formatDisplayDate(
                        customer.startDate
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Expiry Date</span>

                <strong>
                    ${formatDisplayDate(
                        customer.expiryDate
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>Status</span>

                <strong>
                    ${customer.status}
                </strong>

            </div>


            <div class="detail-row">

                <span>Portal</span>

                <strong>
                    ${escapeHTML(
                        customer.portalUrl ||
                        "-"
                    )}
                </strong>

            </div>

        `;

    }


    openModal(
        "customerModal"
    );

}


/* =========================================================
   EDIT CUSTOMER
========================================================= */

function setupEditCustomer() {

    const form =
        document.getElementById(
            "editCustomerForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            updateCustomer();

        }
    );


    const plan =
        document.getElementById(
            "editPlan"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            function () {

                const selected =
                    getPlanByName(
                        plan.value
                    );


                if (selected) {

                    setValue(
                        "editAmount",
                        selected.price
                    );

                }

            }
        );

    }

}


/* =========================================================
   EDIT CUSTOMER OPEN
========================================================= */

function editCustomer(id) {

    const customer =
        customers.find(
            c => c.id === id
        );


    if (!customer) return;


    setValue(
        "editId",
        customer.id
    );

    setValue(
        "editName",
        customer.name
    );

    setValue(
        "editPhone",
        customer.phone
    );

    setValue(
        "editUsername",
        customer.username
    );

    setValue(
        "editPassword",
        customer.password
    );

    setValue(
        "editPortalUrl",
        customer.portalUrl
    );

    setValue(
        "editPlan",
        customer.plan
    );

    setValue(
        "editAmount",
        customer.amount
    );

    setValue(
        "editStartDate",
        customer.startDate
    );

    setValue(
        "editExpiryDate",
        customer.expiryDate
    );

    setValue(
        "editStatus",
        customer.status
    );


    openModal(
        "editCustomerModal"
    );

}


/* =========================================================
   UPDATE CUSTOMER
========================================================= */

function updateCustomer() {

    const id =
        getValue("editId");


    const customer =
        customers.find(
            c => c.id === id
        );


    if (!customer) return;


    customer.name =
        getValue("editName");

    customer.phone =
        getValue("editPhone");

    customer.username =
        getValue("editUsername");

    customer.password =
        getValue("editPassword");

    customer.portalUrl =
        getValue("editPortalUrl");

    customer.plan =
        getValue("editPlan");

    customer.amount =
        Number(
            getValue("editAmount")
        ) || 0;

    customer.startDate =
        getValue("editStartDate");

    customer.expiryDate =
        getValue("editExpiryDate");

    customer.status =
        getValue("editStatus");


    saveCustomers();


    closeAllModals();


    showToast(
        "Customer updated"
    );


    updateAllData();

}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomer(id) {

    const customer =
        customers.find(
            c => c.id === id
        );


    if (!customer) return;


    if (
        !confirm(
            `Delete ${customer.name}?`
        )
    ) return;


    customers =
        customers.filter(
            c => c.id !== id
        );


    payments =
        payments.filter(
            p => p.customerId !== id
        );


    saveCustomers();

    savePayments();


    showToast(
        "Customer deleted"
    );


    updateAllData();

}


/* =========================================================
   SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

    const table =
        document.getElementById(
            "subscriptionsTable"
        );


    if (!table) return;


    if (!customers.length) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center">

                    No subscriptions found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        customers
            .map(
                function (customer) {

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
                                    class="badge ${statusClass(
                                        customer.status
                                    )}"
                                >

                                    ${customer.status}

                                </span>

                            </td>

                            <td>

                                <button
                                    class="secondary-button"
                                    onclick="openRenewModal('${customer.id}')"
                                >

                                    🔄 Renew

                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   RENEWAL
========================================================= */

function setupRenewal() {

    const plan =
        document.getElementById(
            "renewPlan"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            updateRenewSummary
        );

    }


    const confirmButton =
        document.getElementById(
            "confirmRenew"
        );


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            confirmRenewal
        );

    }

}


function openRenewModal(id) {

    currentRenewCustomerId =
        id;


    updateRenewSummary();


    openModal(
        "renewModal"
    );

}


function updateRenewSummary() {

    const customer =
        customers.find(
            c =>
                c.id ===
                currentRenewCustomerId
        );


    const planName =
        getValue("renewPlan");


    if (!customer) return;


    const plan =
        getPlanByName(
            planName
        );


    if (!plan) return;


    let baseDate =
        new Date();


    if (
        customer.expiryDate
    ) {

        const expiry =
            new Date(
                customer.expiryDate +
                "T00:00:00"
            );


        if (
            expiry >
            new Date()
        ) {

            baseDate =
                expiry;

        }

    }


    baseDate.setMonth(

        baseDate.getMonth() +

        plan.duration

    );


    const newExpiry =
        formatDateInput(
            baseDate
        );


    setText(
        "renewExpiry",
        formatDisplayDate(
            newExpiry
        )
    );


    setText(
        "renewAmount",
        "₹" +
        plan.price.toLocaleString(
            "en-IN"
        )
    );

}


function confirmRenewal() {

    const customer =
        customers.find(
            c =>
                c.id ===
                currentRenewCustomerId
        );


    if (!customer) return;


    const planName =
        getValue("renewPlan");


    const plan =
        getPlanByName(
            planName
        );


    if (!plan) return;


    let baseDate =
        new Date();


    if (
        customer.expiryDate
    ) {

        const expiry =
            new Date(
                customer.expiryDate +
                "T00:00:00"
            );


        if (
            expiry >
            new Date()
        ) {

            baseDate =
                expiry;

        }

    }


    baseDate.setMonth(

        baseDate.getMonth() +

        plan.duration

    );


    customer.plan =
        plan.name;

    customer.amount =
        plan.price;

    customer.startDate =
        formatDateInput(
            new Date()
        );

    customer.expiryDate =
        formatDateInput(
            baseDate
        );

    customer.status =
        "Active";


    saveCustomers();


    const payment = {

        id:
            generateId("PAY"),

        customerId:
            customer.id,

        customerName:
            customer.name,

        plan:
            plan.name,

        amount:
            plan.price,

        date:
            new Date().toISOString(),

        method:
            "UPI",

        status:
            "Pending"

    };


    payments.unshift(
        payment
    );


    savePayments();


    createInvoice(
        customer,
        payment
    );


    closeAllModals();


    showToast(
        "Subscription renewed"
    );


    updateAllData();

}


/* =========================================================
   PAYMENTS
========================================================= */

function renderPayments() {

    const table =
        document.getElementById(
            "paymentsTable"
        );


    if (!table) return;


    const search =
        (
            document.getElementById(
                "paymentSearch"
            )?.value ||
            ""
        )
        .toLowerCase();


    const status =
        document.getElementById(
            "paymentStatusFilter"
        )?.value ||
        "all";


    const filtered =
        payments.filter(
            function (payment) {

                const matchesSearch =

                    payment.id
                        .toLowerCase()
                        .includes(search)

                    ||

                    payment.customerName
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    status === "all" ||

                    payment.status ===
                    status;


                return (

                    matchesSearch &&

                    matchesStatus

                );

            }
        );


    if (!filtered.length) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center">

                    No payments found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        filtered
            .map(
                function (payment) {

                    return `

                        <tr>

                            <td>
                                ${payment.id}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.customerName
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.plan
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
                                ${payment.method}
                            </td>

                            <td>

                                <span
                                    class="badge ${payment.status === "Paid"
                                        ? "success"
                                        : "warning"}"
                                >

                                    ${payment.status}

                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   INVOICE CREATION
========================================================= */

function createInvoice(
    customer,
    payment
) {

    const invoice = {

        id:
            generateId("INV"),

        customerId:
            customer.id,

        customerName:
            customer.name,

        plan:
            customer.plan,

        amount:
            Number(
                customer.amount
            ) || 0,

        date:
            new Date().toISOString(),

        status:
            "Pending",

        paymentId:
            payment.id

    };


    invoices.unshift(
        invoice
    );


    saveInvoices();

}


/* =========================================================
   INVOICE TABLE
========================================================= */

function renderInvoices() {

    const table =
        document.getElementById(
            "invoicesTable"
        );


    if (!table) return;


    if (!invoices.length) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center">

                    No invoices found

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        invoices
            .map(
                function (invoice) {

                    return `

                        <tr>

                            <td>
                                ${invoice.id}
                            </td>

                            <td>
                                ${escapeHTML(
                                    invoice.customerName
                                )}
                            </td>

                            <td>
                                ${invoice.plan}
                            </td>

                            <td>
                                ₹${Number(
                                    invoice.amount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </td>

                            <td>
                                ${formatDisplayDateTime(
                                    invoice.date
                                )}
                            </td>

                            <td>

                                <span
                                    class="badge ${invoice.status === "Paid"
                                        ? "success"
                                        : "warning"}"
                                >

                                    ${invoice.status}

                                </span>

                            </td>

                            <td>

                                <button
                                    class="action-button"
                                    onclick="printInvoice('${invoice.id}')"
                                >

                                    🖨️

                                </button>


                                <button
                                    class="action-button"
                                    onclick="whatsappInvoice('${invoice.id}')"
                                >

                                    📱

                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   PROFESSIONAL INVOICE PRINT
========================================================= */

function printInvoice(id) {

    const invoice =
        invoices.find(
            i => i.id === id
        );


    if (!invoice) return;


    const customer =
        customers.find(
            c =>
                c.id ===
                invoice.customerId
        );


    const subtotal =
        Number(
            invoice.amount
        ) || 0;


    let gst =
        0;


    if (
        settings.gstEnabled
    ) {

        gst =
            subtotal *
            (
                Number(
                    settings.gstRate
                ) / 100
            );

    }


    const total =
        subtotal +
        gst;


    const popup =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    if (!popup) {

        showToast(
            "Please allow popups"
        );

        return;

    }


    popup.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Invoice ${invoice.id}
            </title>

            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    margin:
                        0;

                    padding:
                        40px;

                    color:
                        #222;

                    background:
                        #f5f7fb;

                }


                .invoice {

                    max-width:
                        800px;

                    margin:
                        auto;

                    background:
                        white;

                    padding:
                        40px;

                    border-radius:
                        12px;

                }


                .header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    border-bottom:
                        2px solid #eee;

                    padding-bottom:
                        20px;

                }


                h1 {

                    margin:
                        0;

                }


                .invoice-title {

                    text-align:
                        right;

                }


                .info {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    margin:
                        30px 0;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                }


                th,
                td {

                    padding:
                        14px;

                    border-bottom:
                        1px solid #eee;

                    text-align:
                        left;

                }


                .total {

                    margin-top:
                        25px;

                    margin-left:
                        auto;

                    width:
                        300px;

                }


                .total-row {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    padding:
                        8px;

                }


                .grand {

                    font-size:
                        20px;

                    font-weight:
                        bold;

                    border-top:
                        2px solid #222;

                }


                .footer {

                    margin-top:
                        40px;

                    text-align:
                        center;

                    color:
                        #777;

                }


                @media print {

                    body {

                        background:
                            white;

                        padding:
                            0;

                    }

                    .invoice {

                        box-shadow:
                            none;

                    }

                }

            </style>

        </head>


        <body>


            <div class="invoice">


                <div class="header">


                    <div>

                        <h1>
                            ${escapeHTML(
                                settings.companyName
                            )}
                        </h1>

                        <p>
                            IPTV Subscription Service
                        </p>

                        ${
                            settings.businessRegistrationNo
                            ?

                            `<p>
                                Registration No:
                                ${escapeHTML(
                                    settings.businessRegistrationNo
                                )}
                            </p>`

                            :

                            ""

                        }

                    </div>


                    <div class="invoice-title">

                        <h2>
                            INVOICE
                        </h2>

                        <p>
                            ${invoice.id}
                        </p>

                        <p>
                            ${formatDisplayDateTime(
                                invoice.date
                            )}
                        </p>

                    </div>


                </div>


                <div class="info">


                    <div>

                        <strong>
                            Bill To
                        </strong>

                        <p>
                            ${escapeHTML(
                                customer?.name ||
                                invoice.customerName
                            )}
                        </p>

                        <p>
                            ${escapeHTML(
                                customer?.phone ||
                                ""
                            )}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Subscription
                        </strong>

                        <p>
                            ${escapeHTML(
                                invoice.plan
                            )}
                        </p>

                        <p>
                            Expiry:
                            ${formatDisplayDate(
                                customer?.expiryDate
                            )}
                        </p>

                    </div>


                </div>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Description
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                ${escapeHTML(
                                    invoice.plan
                                )}
                                IPTV Subscription
                            </td>

                            <td>
                                ₹${subtotal.toLocaleString(
                                    "en-IN"
                                )}
                            </td>

                        </tr>

                    </tbody>

                </table>


                <div class="total">


                    <div class="total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹${subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    ${
                        settings.gstEnabled

                        ?

                        `

                        <div class="total-row">

                            <span>
                                GST (${settings.gstRate}%)
                            </span>

                            <strong>
                                ₹${gst.toLocaleString(
                                    "en-IN",
                                    {
                                        maximumFractionDigits:
                                            2
                                    }
                                )}
                            </strong>

                        </div>

                        `

                        :

                        ""

                    }


                    <div class="total-row grand">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹${total.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits:
                                        2
                                }
                            )}
                        </strong>

                    </div>


                </div>


                <div class="footer">

                    <p>
                        Thank you for choosing
                        ${escapeHTML(
                            settings.companyName
                        )}
                    </p>

                    <p>
                        This is a computer-generated invoice.
                    </p>

                </div>


            </div>


            <script>

                window.onload = function () {

                    window.print();

                };

            <\/script>


        </body>

        </html>

    `);


    popup.document.close();

}


/* =========================================================
   WHATSAPP INVOICE
========================================================= */

function whatsappInvoice(id) {

    const invoice =
        invoices.find(
            i => i.id === id
        );


    if (!invoice) return;


    const customer =
        customers.find(
            c =>
                c.id ===
                invoice.customerId
        );


    const subtotal =
        Number(
            invoice.amount
        ) || 0;


    const gst =
        settings.gstEnabled

            ?

            subtotal *
            (
                Number(
                    settings.gstRate
                ) / 100
            )

            :

            0;


    const total =
        subtotal +
        gst;


    const message =

`*${settings.companyName}*

🧾 *INVOICE*

Invoice No: ${invoice.id}

Customer: ${customer?.name || invoice.customerName}

Plan: ${invoice.plan}

Amount: ₹${subtotal}

${settings.gstEnabled
    ? `GST (${settings.gstRate}%): ₹${gst.toFixed(2)}\n`
    : ""
}

*Total: ₹${total.toFixed(2)}*

Expiry: ${customer?.expiryDate || "-"}

Thank you for choosing ${settings.companyName}.`;


    const phone =
        customer?.phone ||
        "";


    const cleanPhone =
        phone.replace(
            /\D/g,
            ""
        );


    const url =

        cleanPhone

        ?

        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            message
        )}`

        :

        `https://wa.me/?text=${encodeURIComponent(
            message
        )}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function addNotification(
    title,
    message,
    type = "info"
) {

    notifications.unshift({

        id:
            generateId("NOT"),

        title,

        message,

        type,

        read:
            false,

        date:
            new Date().toISOString()

    });


    notifications =
        notifications.slice(
            0,
            100
        );


    localStorage.setItem(

        STORAGE.notifications,

        JSON.stringify(
            notifications
        )

    );

}


function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) return;


    if (!notifications.length) {

        list.innerHTML = `

            <div class="panel-card">

                <p>
                    No notifications
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =

        notifications
            .map(
                function (notification) {

                    return `

                        <div class="notification-item">

                            <strong>
                                ${escapeHTML(
                                    notification.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    notification.message
                                )}
                            </p>

                            <small>
                                ${formatDisplayDateTime(
                                    notification.date
                                )}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");


    const unread =
        notifications.filter(
            n => !n.read
        ).length;


    setText(
        "notificationCount",
        unread
    );

}


function setupNotifications() {

    const clear =
        document.getElementById(
            "clearNotifications"
        );


    if (clear) {

        clear.addEventListener(
            "click",
            function () {

                notifications =
                    notifications.map(
                        n => {

                            n.read = true;

                            return n;

                        }
                    );


                localStorage.setItem(

                    STORAGE.notifications,

                    JSON.stringify(
                        notifications
                    )

                );


                renderNotifications();

                showToast(
                    "All notifications marked as read"
                );

            }
        );

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        customers.length;


    const active =
        customers.filter(
            c =>
                getCurrentStatus(c) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            c =>
                getCurrentStatus(c) ===
                "Expired"
        ).length;


    const expiring =
        customers.filter(
            isExpiringSoon
        ).length;


    const revenue =
        payments
            .filter(
                p =>
                    p.status ===
                    "Paid"
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


    const currentMonth =
        new Date()
            .getMonth();


    const currentYear =
        new Date()
            .getFullYear();


    const monthlyRevenue =
        payments
            .filter(
                p => {

                    const date =
                        new Date(
                            p.date
                        );


                    return (

                        p.status ===
                        "Paid"

                        &&

                        date.getMonth() ===
                        currentMonth

                        &&

                        date.getFullYear() ===
                        currentYear

                    );

                }
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


    const pending =
        payments.filter(
            p =>
                p.status ===
                "Pending"
        ).length;


    const newCustomers =
        customers.filter(
            c => {

                const date =
                    new Date(
                        c.createdAt
                    );


                return (

                    date.getMonth() ===
                    currentMonth

                    &&

                    date.getFullYear() ===
                    currentYear

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
        "expiringSoon",
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
        "newCustomers",
        newCustomers
    );


    setText(
        "subscriptionActive",
        active
    );

    setText(
        "subscriptionExpired",
        expired
    );

    setText(
        "subscriptionExpiring",
        expiring
    );


    setText(
        "paymentTotalRevenue",
        "₹" +
        revenue.toLocaleString(
            "en-IN"
        )
    );

    setText(
        "paymentMonthlyRevenue",
        "₹" +
        monthlyRevenue.toLocaleString(
            "en-IN"
        )
    );

    setText(
        "paymentPending",
        pending
    );


    setText(
        "reportCustomers",
        total
    );

    setText(
        "reportRevenue",
        "₹" +
        revenue.toLocaleString(
            "en-IN"
        )
    );


    const average =
        total
            ? revenue / total
            : 0;


    setText(
        "reportAverage",
        "₹" +
        average.toFixed(2)
    );


    setText(
        "expiringBadge",
        expiring
    );

}


/* =========================================================
   RECENT CUSTOMERS
========================================================= */

function renderRecentCustomers() {

    const table =
        document.getElementById(
            "recentCustomersTable"
        );


    if (!table) return;


    const recent =
        customers.slice(
            0,
            5
        );


    if (!recent.length) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center">

                    No Customers Yet

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        recent
            .map(
                function (customer) {

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
                                ${customer.plan}
                            </td>

                            <td>
                                ${formatDisplayDate(
                                    customer.expiryDate
                                )}
                            </td>

                            <td>

                                <span class="badge ${statusClass(
                                    getCurrentStatus(
                                        customer
                                    )
                                )}">

                                    ${getCurrentStatus(
                                        customer
                                    )}

                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   EXPIRING LIST
========================================================= */

function renderExpiringCustomers() {

    const list =
        document.getElementById(
            "expiringCustomersList"
        );


    if (!list) return;


    const expiring =
        customers.filter(
            isExpiringSoon
        );


    if (!expiring.length) {

        list.innerHTML = `

            <p>
                No customers expiring soon.
            </p>

        `;

        return;

    }


    list.innerHTML =

        expiring
            .map(
                function (customer) {

                    return `

                        <div class="expiring-item">

                            <strong>
                                ${escapeHTML(
                                    customer.name
                                )}
                            </strong>

                            <span>
                                Expires:
                                ${formatDisplayDate(
                                    customer.expiryDate
                                )}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   PLANS
========================================================= */

function setupPlanManagement() {

    const addButton =
        document.getElementById(
            "addPlanButton"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                const name =
                    prompt(
                        "Plan name:"
                    );


                if (!name) return;


                const duration =
                    Number(
                        prompt(
                            "Duration in months:"
                        )
                    );


                const price =
                    Number(
                        prompt(
                            "Price:"
                        )
                    );


                if (
                    !duration ||
                    !price
                ) return;


                plans.push({

                    id:
                        generateId(
                            "PLAN"
                        ),

                    name,

                    duration,

                    price,

                    active:
                        true

                });


                savePlans();

                renderPlans();

                showToast(
                    "Plan added"
                );

            }
        );

    }

}


function renderPlans() {

    const grid =
        document.getElementById(
            "plansGrid"
        );


    if (!grid) return;


    grid.innerHTML =

        plans
            .map(
                function (plan) {

                    return `

                        <div class="panel-card">

                            <h3>
                                ${escapeHTML(
                                    plan.name
                                )}
                            </h3>

                            <h2>
                                ₹${Number(
                                    plan.price
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </h2>

                            <p>
                                ${plan.duration}
                                month(s)
                            </p>

                            <span class="badge success">
                                Active
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   SEARCH & FILTERS
========================================================= */

function setupSearchAndFilters() {

    [

        "customerSearch",

        "customerStatusFilter",

        "customerPlanFilter",

        "paymentSearch",

        "paymentStatusFilter"

    ]
    .forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.addEventListener(

                    "input",

                    function () {

                        renderCustomers();

                        renderPayments();

                    }

                );

                element.addEventListener(

                    "change",

                    function () {

                        renderCustomers();

                        renderPayments();

                    }

                );

            }

        }
    );


    const refresh =
        document.getElementById(
            "refreshCustomers"
        );


    if (refresh) {

        refresh.addEventListener(
            "click",
            function () {

                updateAllData();

                showToast(
                    "Customer list refreshed"
                );

            }
        );

    }

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function setupGlobalSearch() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        function () {

            const value =
                search.value
                    .toLowerCase()
                    .trim();


            if (!value) return;


            const found =
                customers.find(
                    customer =>

                        customer.name
                            .toLowerCase()
                            .includes(value)

                        ||

                        customer.username
                            .toLowerCase()
                            .includes(value)

                        ||

                        customer.phone
                            .includes(value)

                );


            if (found) {

                showPage(
                    "customers"
                );


                const customerSearch =
                    document.getElementById(
                        "customerSearch"
                    );


                if (customerSearch) {

                    customerSearch.value =
                        value;

                }


                renderCustomers();

            }

        }
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    const general =
        document.getElementById(
            "saveGeneralSettings"
        );


    if (general) {

        general.addEventListener(
            "click",
            function () {

                settings.companyName =
                    getValue(
                        "companyName"
                    );

                settings.defaultPortal =
                    getValue(
                        "defaultPortal"
                    );

                settings.whatsappNumber =
                    getValue(
                        "whatsappNumber"
                    );


                saveSettings();


                showToast(
                    "General settings saved"
                );

            }
        );

    }


    const payment =
        document.getElementById(
            "savePaymentSettings"
        );


    if (payment) {

        payment.addEventListener(
            "click",
            function () {

                settings.upiId =
                    getValue(
                        "upiId"
                    );

                settings.upiName =
                    getValue(
                        "upiName"
                    );


                saveSettings();


                generatePaymentQR();


                showToast(
                    "Payment settings saved"
                );

            }
        );

    }


    const whatsapp =
        document.getElementById(
            "saveWhatsappTemplate"
        );


    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            function () {

                settings.whatsappTemplate =
                    getValue(
                        "whatsappTemplate"
                    );


                saveSettings();


                showToast(
                    "WhatsApp template saved"
                );

            }
        );

    }

}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettingsIntoForm() {

    setValue(
        "companyName",
        settings.companyName
    );

    setValue(
        "defaultPortal",
        settings.defaultPortal
    );

    setValue(
        "whatsappNumber",
        settings.whatsappNumber
    );

    setValue(
        "upiId",
        settings.upiId
    );

    setValue(
        "upiName",
        settings.upiName
    );

    setValue(
        "whatsappTemplate",
        settings.whatsappTemplate
    );

}


/* =========================================================
   GST SETTINGS
========================================================= */

function calculateGST(amount) {

    if (
        !settings.gstEnabled
    ) {

        return 0;

    }


    return (

        Number(amount) *

        Number(
            settings.gstRate
        )

        /

        100

    );

}


/* =========================================================
   BACKUP
========================================================= */

function setupBackup() {

    const exportButton =
        document.getElementById(
            "exportBackup"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportBackup
        );

    }


    const importButton =
        document.getElementById(
            "importBackup"
        );


    const fileInput =
        document.getElementById(
            "importBackupFile"
        );


    if (
        importButton &&
        fileInput
    ) {

        importButton.addEventListener(
            "click",
            function () {

                fileInput.click();

            }
        );


        fileInput.addEventListener(
            "change",
            importBackup
        );

    }


    const print =
        document.getElementById(
            "printCustomers"
        );


    if (print) {

        print.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

function exportBackup() {

    const backup = {

        version:
            "1.0",

        exportedAt:
            new Date().toISOString(),

        customers,

        payments,

        invoices,

        plans,

        settings,

        notifications

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
        `SUPER-IPTV-Backup-${formatDateInput(
            new Date()
        )}.json`;


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Backup exported"
    );

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

function importBackup(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const data =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !confirm(
                        "Import backup? Existing data may be replaced."
                    )
                ) return;


                customers =
                    data.customers ||
                    [];

                payments =
                    data.payments ||
                    [];

                invoices =
                    data.invoices ||
                    [];

                plans =
                    data.plans ||
                    DEFAULT_PLANS;

                settings =
                    data.settings ||
                    DEFAULT_SETTINGS;

                notifications =
                    data.notifications ||
                    [];


                saveCustomers();

                savePayments();

                saveInvoices();

                savePlans();

                saveSettings();


                localStorage.setItem(

                    STORAGE.notifications,

                    JSON.stringify(
                        notifications
                    )

                );


                updateAllData();


                showToast(
                    "Backup imported successfully"
                );


            } catch (error) {

                showToast(
                    "Invalid backup file"
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   THEME
========================================================= */

function setupTheme() {

    const button =
        document.getElementById(
            "themeToggle"
        );


    const savedTheme =
        localStorage.getItem(
            STORAGE.theme
        );


    if (
        savedTheme ===
        "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    if (button) {

        button.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const dark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(

                    STORAGE.theme,

                    dark
                        ? "dark"
                        : "light"

                );

            }
        );

    }

}


/* =========================================================
   MODAL
========================================================= */

function setupModalEvents() {

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    closeAllModals
                );

            }
        );


    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            function (modal) {

                modal.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            modal
                        ) {

                            modal.classList.remove(
                                "active"
                            );

                        }

                    }
                );

            }
        );

}


function openModal(id) {

    const modal =
        document.getElementById(
            id
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            function (modal) {

                modal.classList.remove(
                    "active"
                );

            }
        );

}


/* =========================================================
   CHARTS
========================================================= */

function renderDashboardCharts() {

    if (
        typeof Chart ===
        "undefined"
    ) return;


    const revenueCanvas =
        document.getElementById(
            "revenueChart"
        );


    const customerCanvas =
        document.getElementById(
            "customerChart"
        );


    if (
        revenueCanvas
    ) {

        if (
            revenueChart
        ) {

            revenueChart.destroy();

        }


        const monthlyData =
            getLastSixMonthsRevenue();


        revenueChart =
            new Chart(

                revenueCanvas,

                {

                    type:
                        "line",

                    data: {

                        labels:
                            monthlyData.labels,

                        datasets: [

                            {

                                label:
                                    "Revenue",

                                data:
                                    monthlyData.values,

                                tension:
                                    0.4

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false

                    }

                }

            );

    }


    if (
        customerCanvas
    ) {

        if (
            customerChart
        ) {

            customerChart.destroy();

        }


        const active =
            customers.filter(
                c =>
                    getCurrentStatus(c) ===
                    "Active"
            ).length;


        const expired =
            customers.filter(
                c =>
                    getCurrentStatus(c) ===
                    "Expired"
            ).length;


        const suspended =
            customers.filter(
                c =>
                    c.status ===
                    "Suspended"
            ).length;


        customerChart =
            new Chart(

                customerCanvas,

                {

                    type:
                        "doughnut",

                    data: {

                        labels: [

                            "Active",

                            "Expired",

                            "Suspended"

                        ],

                        datasets: [

                            {

                                data: [

                                    active,

                                    expired,

                                    suspended

                                ]

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false

                    }

                }

            );

    }

}


function renderReportCharts() {

    if (
        typeof Chart ===
        "undefined"
    ) return;


    const revenueCanvas =
        document.getElementById(
            "reportRevenueChart"
        );


    if (
        revenueCanvas
    ) {

        if (
            reportRevenueChart
        ) {

            reportRevenueChart.destroy();

        }


        const data =
            getLastSixMonthsRevenue();


        reportRevenueChart =
            new Chart(

                revenueCanvas,

                {

                    type:
                        "bar",

                    data: {

                        labels:
                            data.labels,

                        datasets: [

                            {

                                label:
                                    "Revenue",

                                data:
                                    data.values

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false

                    }

                }

            );

    }


    const planCanvas =
        document.getElementById(
            "planChart"
        );


    if (
        planCanvas
    ) {

        if (
            planChart
        ) {

            planChart.destroy();

        }


        const planCounts =
            plans.map(
                plan =>

                    customers.filter(
                        customer =>
                            customer.plan ===
                            plan.name
                    ).length

            );


        planChart =
            new Chart(

                planCanvas,

                {

                    type:
                        "bar",

                    data: {

                        labels:
                            plans.map(
                                p =>
                                    p.name
                            ),

                        datasets: [

                            {

                                label:
                                    "Customers",

                                data:
                                    planCounts

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false

                    }

                }

            );

    }

}


/* =========================================================
   REVENUE DATA
========================================================= */

function getLastSixMonthsRevenue() {

    const labels = [];

    const values = [];


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

                now.getMonth() - i,

                1

            );


        const month =
            date.getMonth();


        const year =
            date.getFullYear();


        const label =
            date.toLocaleString(

                "en-US",

                {

                    month:
                        "short"

                }

            );


        const revenue =
            payments
                .filter(
                    payment => {

                        const pDate =
                            new Date(
                                payment.date
                            );


                        return (

                            payment.status ===
                            "Paid"

                            &&

                            pDate.getMonth() ===
                            month

                            &&

                            pDate.getFullYear() ===
                            year

                        );

                    }
                )
                .reduce(
                    (
                        sum,
                        payment
                    ) =>

                        sum +
                        Number(
                            payment.amount
                        ),

                    0

                );


        labels.push(
            label
        );


        values.push(
            revenue
        );

    }


    return {

        labels,

        values

    };

}


/* =========================================================
   UPDATE ALL DATA
========================================================= */

function updateAllData() {

    updateCustomerStatuses();

    updateDashboard();

    renderCustomers();

    renderRecentCustomers();

    renderExpiringCustomers();

    renderSubscriptions();

    renderPayments();

    renderInvoices();

    renderNotifications();

    renderPlans();

    setTimeout(
        renderDashboardCharts,
        100
    );

}


/* =========================================================
   AUTO STATUS
========================================================= */

function updateCustomerStatuses() {

    customers.forEach(
        function (customer) {

            if (
                customer.status ===
                "Suspended"
            ) return;


            if (
                !customer.expiryDate
            ) return;


            const expiry =
                new Date(
                    customer.expiryDate +
                    "T23:59:59"
                );


            if (
                expiry <
                new Date()
            ) {

                customer.status =
                    "Expired";

            } else {

                customer.status =
                    "Active";

            }

        }
    );


    saveCustomers();

}


/* =========================================================
   STATUS
========================================================= */

function getCurrentStatus(
    customer
) {

    if (
        customer.status ===
        "Suspended"
    ) {

        return "Suspended";

    }


    if (
        customer.expiryDate
    ) {

        const expiry =
            new Date(
                customer.expiryDate +
                "T23:59:59"
            );


        if (
            expiry <
            new Date()
        ) {

            return "Expired";

        }

    }


    return "Active";

}


/* =========================================================
   EXPIRING SOON
========================================================= */

function isExpiringSoon(
    customer
) {

    if (
        !customer.expiryDate ||
        customer.status ===
        "Expired" ||
        customer.status ===
        "Suspended"
    ) {

        return false;

    }


    const expiry =
        new Date(
            customer.expiryDate +
            "T23:59:59"
        );


    const now =
        new Date();


    const diff =
        expiry.getTime() -
        now.getTime();


    const days =
        diff /
        (
            1000 *
            60 *
            60 *
            24
        );


    return (

        days >= 0 &&

        days <= 7

    );

}


/* =========================================================
   STORAGE SAVE FUNCTIONS
========================================================= */

function saveCustomers() {

    localStorage.setItem(

        STORAGE.customers,

        JSON.stringify(
            customers
        )

    );

}


function savePayments() {

    localStorage.setItem(

        STORAGE.payments,

        JSON.stringify(
            payments
        )

    );

}


function saveInvoices() {

    localStorage.setItem(

        STORAGE.invoices,

        JSON.stringify(
            invoices
        )

    );

}


function savePlans() {

    localStorage.setItem(

        STORAGE.plans,

        JSON.stringify(
            plans
        )

    );

}


function saveSettings() {

    localStorage.setItem(

        STORAGE.settings,

        JSON.stringify(
            settings
        )

    );

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function generateId(
    prefix
) {

    return (

        prefix +

        "-" +

        Date.now().toString(
            36
        ).toUpperCase() +

        "-" +

        Math.random()
            .toString(
                36
            )
            .substring(
                2,
                7
            )
            .toUpperCase()

    );

}


function formatDateInput(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        )
        .padStart(
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


function formatDisplayDate(
    date
) {

    if (!date) {

        return "-";

    }


    const d =
        new Date(
            date +
            (
                date.length === 10
                    ? "T00:00:00"
                    : ""
            )
        );


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return date;

    }


    return d.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


function formatDisplayDateTime(
    date
) {

    if (!date) {

        return "-";

    }


    const d =
        new Date(
            date
        );


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return date;

    }


    return d.toLocaleString(
        "en-IN"
    );

}


function statusClass(
    status
) {

    if (
        status ===
        "Active"
    ) {

        return "success";

    }


    if (
        status ===
        "Expired"
    ) {

        return "danger";

    }


    if (
        status ===
        "Suspended"
    ) {

        return "warning";

    }


    return "";

}


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


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ??
            "";

    }

}


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
   TOAST
========================================================= */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast
    ) return;


    if (
        toastMessage
    ) {

        toastMessage.textContent =
            message;

    }


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


/* =========================================================
   GLOBAL FUNCTIONS
   Required by inline onclick
========================================================= */

window.viewCustomer =
    viewCustomer;

window.editCustomer =
    editCustomer;

window.deleteCustomer =
    deleteCustomer;

window.openRenewModal =
    openRenewModal;

window.printInvoice =
    printInvoice;

window.whatsappInvoice =
    whatsappInvoice;


/* =========================================================
   END OF SCRIPT
========================================================= */