/* =========================================================
   SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
   FINAL script.js
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE = {
    customers: "SUPER_IPTV_CUSTOMERS",
    payments: "SUPER_IPTV_PAYMENTS",
    invoices: "SUPER_IPTV_INVOICES",
    notifications: "SUPER_IPTV_NOTIFICATIONS",
    plans: "SUPER_IPTV_PLANS",
    settings: "SUPER_IPTV_SETTINGS",
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

    businessRegistrationNo: "",
    gstNumber: "",
    taxEnabled: true,
    taxName: "GST",
    taxRate: 18,

    invoicePrefix: "INV",
    invoiceFooter:
        "Thank you for choosing SUPER IPTV.\n" +
        "This is a computer generated invoice."
};


/* =========================================================
   DATA
========================================================= */

let customers = loadData(STORAGE.customers, []);
let payments = loadData(STORAGE.payments, []);
let invoices = loadData(STORAGE.invoices, []);
let notifications = loadData(STORAGE.notifications, []);
let plans = loadData(STORAGE.plans, DEFAULT_PLANS);
let settings = {
    ...DEFAULT_SETTINGS,
    ...loadData(STORAGE.settings, {})
};

let selectedCustomerId = null;
let selectedRenewCustomerId = null;

let revenueChart = null;
let customerChart = null;
let reportRevenueChart = null;
let planChart = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});


/* =========================================================
   INITIALIZE
========================================================= */

function initializeApplication() {

    loadSettingsToForm();

    initializeNavigation();

    initializeMenu();

    initializeTheme();

    initializeCustomerForm();

    initializeEditForm();

    initializeRenewal();

    initializeQR();

    initializeSearchAndFilters();

    initializeBackup();

    initializeSettings();

    initializeNotifications();

    initializePlans();

    initializeModalEvents();

    initializeGlobalSearch();

    initializeCharts();

    refreshApplication();

}


/* =========================================================
   SAFE DATA LOADER
========================================================= */

function loadData(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : fallback;

    } catch (error) {

        console.error("Storage error:", error);

        return fallback;

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =========================================================
   ID GENERATOR
========================================================= */

function generateId(prefix = "ID") {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/* =========================================================
   NUMBER FORMAT
========================================================= */

function money(amount) {

    return "₹" + Number(amount || 0).toLocaleString("en-IN");

}


/* =========================================================
   DATE HELPERS
========================================================= */

function todayISO() {

    const date = new Date();

    return formatISODate(date);

}


function formatISODate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(
        dateString + "T00:00:00"
    );

    if (isNaN(date.getTime())) {
        return dateString;
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
   ADD MONTHS
========================================================= */

function addMonths(dateString, months) {

    const date = new Date(
        dateString + "T00:00:00"
    );

    date.setMonth(
        date.getMonth() + Number(months)
    );

    return formatISODate(date);

}


/* =========================================================
   GET PLAN
========================================================= */

function getPlan(planName) {

    return plans.find(
        plan => plan.name === planName
    ) || DEFAULT_PLANS.find(
        plan => plan.name === planName
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    showPage(page);

                }
            );

        });


    document
        .querySelectorAll("[data-page-link]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        button.dataset.pageLink
                    );

                }
            );

        });

}


function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const page =
        document.getElementById(pageId);

    if (page) {

        page.classList.add("active");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === pageId
            );

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
            "Track and renew customer subscriptions"
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
            "Reports",
            "Analyze your business performance"
        ],

        backup: [
            "Backup",
            "Export and restore your panel data"
        ],

        settings: [
            "Settings",
            "Configure your IPTV management panel"
        ]

    };


    if (titles[pageId]) {

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
                titles[pageId][0];
        }

        if (subtitle) {
            subtitle.textContent =
                titles[pageId][1];
        }

    }


    const sidebar =
        document.getElementById("sidebar");

    if (
        sidebar &&
        window.innerWidth <= 900
    ) {

        sidebar.classList.remove(
            "open"
        );

    }


    refreshApplication();

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMenu() {

    const menu =
        document.getElementById(
            "menuToggle"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (!menu || !sidebar) {
        return;
    }


    menu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    const button =
        document.getElementById(
            "themeToggle"
        );

    const savedTheme =
        localStorage.getItem(
            STORAGE.theme
        );

    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    if (button) {

        button.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );

                localStorage.setItem(
                    STORAGE.theme,
                    document.body.classList.contains(
                        "dark-mode"
                    )
                        ? "dark"
                        : "light"
                );

            }
        );

    }

}


/* =========================================================
   CUSTOMER FORM
========================================================= */

function initializeCustomerForm() {

    const form =
        document.getElementById(
            "customerForm"
        );

    if (!form) {
        return;
    }


    const plan =
        document.getElementById(
            "plan"
        );

    const startDate =
        document.getElementById(
            "startDate"
        );


    if (startDate) {

        startDate.value =
            todayISO();

    }


    if (plan) {

        plan.addEventListener(
            "change",
            () => {

                updatePlanAmount();

                updateExpiryDate();

                generatePaymentQR();

            }
        );

    }


    if (startDate) {

        startDate.addEventListener(
            "change",
            updateExpiryDate
        );

    }


    form.addEventListener(
        "submit",
        saveCustomer
    );


    form.addEventListener(
        "reset",
        () => {

            setTimeout(
                () => {

                    document
                        .getElementById(
                            "startDate"
                        )
                        .value =
                        todayISO();

                    clearQR();

                },
                0
            );

        }
    );

}


/* =========================================================
   UPDATE PLAN AMOUNT
========================================================= */

function updatePlanAmount() {

    const planSelect =
        document.getElementById(
            "plan"
        );

    const amountInput =
        document.getElementById(
            "amount"
        );

    if (!planSelect || !amountInput) {
        return;
    }


    const selectedPlan =
        getPlan(
            planSelect.value
        );


    amountInput.value =
        selectedPlan
            ? selectedPlan.price
            : "";

}


/* =========================================================
   UPDATE EXPIRY
========================================================= */

function updateExpiryDate() {

    const planSelect =
        document.getElementById(
            "plan"
        );

    const startDate =
        document.getElementById(
            "startDate"
        );

    const expiryDate =
        document.getElementById(
            "expiryDate"
        );


    if (
        !planSelect ||
        !startDate ||
        !expiryDate
    ) {
        return;
    }


    const selectedPlan =
        getPlan(
            planSelect.value
        );


    if (
        selectedPlan &&
        startDate.value
    ) {

        expiryDate.value =
            addMonths(
                startDate.value,
                selectedPlan.duration
            );

    } else {

        expiryDate.value = "";

    }

}


/* =========================================================
   SAVE CUSTOMER
========================================================= */

function saveCustomer(event) {

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

    const portalUrl =
        document
            .getElementById("portalUrl")
            .value
            .trim();

    const plan =
        document
            .getElementById("plan")
            .value;

    const amount =
        Number(
            document
                .getElementById("amount")
                .value
        );

    const startDate =
        document
            .getElementById("startDate")
            .value;

    const expiryDate =
        document
            .getElementById("expiryDate")
            .value;

    const status =
        document
            .getElementById("status")
            .value;


    if (
        !name ||
        !phone ||
        !username ||
        !password ||
        !plan ||
        !startDate
    ) {

        showToast(
            "Please fill all required fields."
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


    saveData(
        STORAGE.customers,
        customers
    );


    createPayment(
        customer,
        "Paid"
    );


    createInvoice(
        customer
    );


    addNotification(
        "New Customer",
        `${name} was added successfully.`,
        "success"
    );


    showToast(
        "Customer added successfully."
    );


    event.target.reset();


    document
        .getElementById(
            "startDate"
        )
        .value =
        todayISO();


    clearQR();


    refreshApplication();


    showPage(
        "customers"
    );

}


/* =========================================================
   CUSTOMER TABLE
========================================================= */

function renderCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );

    if (!table) {
        return;
    }


    const search =
        (
            document
                .getElementById(
                    "customerSearch"
                )
                ?.value ||
            ""
        )
        .toLowerCase();


    const statusFilter =
        document
            .getElementById(
                "customerStatusFilter"
            )
            ?.value ||
        "all";


    const planFilter =
        document
            .getElementById(
                "customerPlanFilter"
            )
            ?.value ||
        "all";


    const filtered =
        customers.filter(
            customer => {

                const text = [

                    customer.name,

                    customer.phone,

                    customer.username

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    text.includes(
                        search
                    );


                const matchesStatus =
                    statusFilter === "all" ||
                    getCustomerStatus(
                        customer
                    ) === statusFilter;


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

                <td
                    colspan="8"
                    class="empty-state"
                >
                    No customers found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filtered
            .map(
                customer =>
                    customerRowHTML(
                        customer
                    )
            )
            .join("");


    table
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                handleCustomerAction
            );

        });

}


/* =========================================================
   CUSTOMER ROW
========================================================= */

function customerRowHTML(customer) {

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

                <div>
                    ${escapeHTML(
                        customer.username
                    )}
                </div>

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

                ${money(
                    customer.amount
                )}

            </td>


            <td>

                ${formatDate(
                    customer.expiryDate
                )}

            </td>


            <td>

                <span
                    class="badge ${statusClass(
                        status
                    )}"
                >
                    ${status}
                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="icon-action"
                        title="View"
                        data-action="view"
                        data-id="${customer.id}"
                    >
                        👁️
                    </button>

                    <button
                        class="icon-action"
                        title="Edit"
                        data-action="edit"
                        data-id="${customer.id}"
                    >
                        ✏️
                    </button>

                    <button
                        class="icon-action"
                        title="Renew"
                        data-action="renew"
                        data-id="${customer.id}"
                    >
                        🔄
                    </button>

                    <button
                        class="icon-action"
                        title="WhatsApp"
                        data-action="whatsapp"
                        data-id="${customer.id}"
                    >
                        📱
                    </button>

                    <button
                        class="icon-action"
                        title="Delete"
                        data-action="delete"
                        data-id="${customer.id}"
                    >
                        🗑️
                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================================
   CUSTOMER STATUS
========================================================= */

function getCustomerStatus(customer) {

    if (
        customer.status ===
        "Suspended"
    ) {

        return "Suspended";

    }


    if (!customer.expiryDate) {

        return customer.status ||
            "Active";

    }


    const today =
        new Date(
            todayISO() +
            "T00:00:00"
        );

    const expiry =
        new Date(
            customer.expiryDate +
            "T00:00:00"
        );


    if (
        expiry < today
    ) {

        return "Expired";

    }


    return customer.status ||
        "Active";

}


/* =========================================================
   STATUS CLASS
========================================================= */

function statusClass(status) {

    if (
        status === "Active"
    ) {

        return "success";

    }

    if (
        status === "Expired"
    ) {

        return "danger";

    }

    if (
        status === "Suspended"
    ) {

        return "warning";

    }

    return "";

}


/* =========================================================
   CUSTOMER ACTIONS
========================================================= */

function handleCustomerAction(event) {

    const button =
        event.currentTarget;

    const action =
        button.dataset.action;

    const id =
        button.dataset.id;


    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {
        return;
    }


    if (
        action === "view"
    ) {

        openCustomerModal(
            customer
        );

    }


    if (
        action === "edit"
    ) {

        openEditModal(
            customer
        );

    }


    if (
        action === "renew"
    ) {

        openRenewModal(
            customer
        );

    }


    if (
        action === "whatsapp"
    ) {

        openWhatsApp(
            customer
        );

    }


    if (
        action === "delete"
    ) {

        deleteCustomer(
            customer
        );

    }

}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomer(customer) {

    const confirmDelete =
        confirm(
            `Delete customer "${customer.name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    customers =
        customers.filter(
            item =>
                item.id !==
                customer.id
        );


    payments =
        payments.filter(
            payment =>
                payment.customerId !==
                customer.id
        );


    invoices =
        invoices.filter(
            invoice =>
                invoice.customerId !==
                customer.id
        );


    saveData(
        STORAGE.customers,
        customers
    );


    saveData(
        STORAGE.payments,
        payments
    );


    saveData(
        STORAGE.invoices,
        invoices
    );


    showToast(
        "Customer deleted."
    );


    refreshApplication();

}


/* =========================================================
   EDIT CUSTOMER
========================================================= */

function initializeEditForm() {

    const form =
        document.getElementById(
            "editCustomerForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        saveEditedCustomer
    );

}


function openEditModal(customer) {

    document
        .getElementById(
            "editId"
        )
        .value =
        customer.id;


    document
        .getElementById(
            "editName"
        )
        .value =
        customer.name;


    document
        .getElementById(
            "editPhone"
        )
        .value =
        customer.phone;


    document
        .getElementById(
            "editUsername"
        )
        .value =
        customer.username;


    document
        .getElementById(
            "editPassword"
        )
        .value =
        customer.password;


    document
        .getElementById(
            "editPortalUrl"
        )
        .value =
        customer.portalUrl || "";


    document
        .getElementById(
            "editPlan"
        )
        .value =
        customer.plan;


    document
        .getElementById(
            "editAmount"
        )
        .value =
        customer.amount;


    document
        .getElementById(
            "editStartDate"
        )
        .value =
        customer.startDate;


    document
        .getElementById(
            "editExpiryDate"
        )
        .value =
        customer.expiryDate;


    document
        .getElementById(
            "editStatus"
        )
        .value =
        customer.status;


    openModal(
        "editCustomerModal"
    );

}


function saveEditedCustomer(event) {

    event.preventDefault();


    const id =
        document
            .getElementById(
                "editId"
            )
            .value;


    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {
        return;
    }


    customer.name =
        document
            .getElementById(
                "editName"
            )
            .value
            .trim();


    customer.phone =
        document
            .getElementById(
                "editPhone"
            )
            .value
            .trim();


    customer.username =
        document
            .getElementById(
                "editUsername"
            )
            .value
            .trim();


    customer.password =
        document
            .getElementById(
                "editPassword"
            )
            .value
            .trim();


    customer.portalUrl =
        document
            .getElementById(
                "editPortalUrl"
            )
            .value
            .trim();


    customer.plan =
        document
            .getElementById(
                "editPlan"
            )
            .value;


    customer.amount =
        Number(
            document
                .getElementById(
                    "editAmount"
                )
                .value
        );


    customer.startDate =
        document
            .getElementById(
                "editStartDate"
            )
            .value;


    customer.expiryDate =
        document
            .getElementById(
                "editExpiryDate"
            )
            .value;


    customer.status =
        document
            .getElementById(
                "editStatus"
            )
            .value;


    saveData(
        STORAGE.customers,
        customers
    );


    closeAllModals();


    showToast(
        "Customer updated successfully."
    );


    refreshApplication();

}


/* =========================================================
   CUSTOMER DETAILS MODAL
========================================================= */

function openCustomerModal(customer) {

    selectedCustomerId =
        customer.id;


    const container =
        document.getElementById(
            "customerDetails"
        );


    if (!container) {
        return;
    }


    const status =
        getCustomerStatus(
            customer
        );


    container.innerHTML = `

        <div class="detail-grid">

            <div>
                <span>Name</span>
                <strong>
                    ${escapeHTML(
                        customer.name
                    )}
                </strong>
            </div>

            <div>
                <span>Phone</span>
                <strong>
                    ${escapeHTML(
                        customer.phone
                    )}
                </strong>
            </div>

            <div>
                <span>Username</span>
                <strong>
                    ${escapeHTML(
                        customer.username
                    )}
                </strong>
            </div>

            <div>
                <span>Password</span>
                <strong>
                    ${escapeHTML(
                        customer.password
                    )}
                </strong>
            </div>

            <div>
                <span>Plan</span>
                <strong>
                    ${escapeHTML(
                        customer.plan
                    )}
                </strong>
            </div>

            <div>
                <span>Amount</span>
                <strong>
                    ${money(
                        customer.amount
                    )}
                </strong>
            </div>

            <div>
                <span>Start Date</span>
                <strong>
                    ${formatDate(
                        customer.startDate
                    )}
                </strong>
            </div>

            <div>
                <span>Expiry Date</span>
                <strong>
                    ${formatDate(
                        customer.expiryDate
                    )}
                </strong>
            </div>

            <div>
                <span>Status</span>
                <strong>
                    ${status}
                </strong>
            </div>

            <div>
                <span>Portal</span>
                <strong>
                    ${escapeHTML(
                        customer.portalUrl ||
                        "-"
                    )}
                </strong>
            </div>

        </div>

    `;


    openModal(
        "customerModal"
    );

}


/* =========================================================
   MODAL EVENTS
========================================================= */

function initializeModalEvents() {

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeAllModals
            );

        });


    const whatsapp =
        document.getElementById(
            "modalWhatsApp"
        );

    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            () => {

                const customer =
                    customers.find(
                        item =>
                            item.id ===
                            selectedCustomerId
                    );

                if (customer) {

                    openWhatsApp(
                        customer
                    );

                }

            }
        );

    }


    const renew =
        document.getElementById(
            "modalRenew"
        );

    if (renew) {

        renew.addEventListener(
            "click",
            () => {

                const customer =
                    customers.find(
                        item =>
                            item.id ===
                            selectedCustomerId
                    );

                if (customer) {

                    closeAllModals();

                    openRenewModal(
                        customer
                    );

                }

            }
        );

    }

}


function openModal(id) {

    const modal =
        document.getElementById(id);

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
        .forEach(modal => {

            modal.classList.remove(
                "active"
            );

        });

}


/* =========================================================
   RENEWAL
========================================================= */

function initializeRenewal() {

    const plan =
        document.getElementById(
            "renewPlan"
        );


    const confirmButton =
        document.getElementById(
            "confirmRenew"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            updateRenewSummary
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            confirmRenewal
        );

    }

}


function openRenewModal(customer) {

    selectedRenewCustomerId =
        customer.id;


    const plan =
        document.getElementById(
            "renewPlan"
        );


    if (plan) {

        plan.value =
            customer.plan;

    }


    updateRenewSummary();


    openModal(
        "renewModal"
    );

}


function updateRenewSummary() {

    const customer =
        customers.find(
            item =>
                item.id ===
                selectedRenewCustomerId
        );


    if (!customer) {
        return;
    }


    const selectedPlan =
        getPlan(
            document
                .getElementById(
                    "renewPlan"
                )
                .value
        );


    if (!selectedPlan) {
        return;
    }


    const baseDate =
        customer.expiryDate &&
        new Date(
            customer.expiryDate +
            "T00:00:00"
        ) >
        new Date(
            todayISO() +
            "T00:00:00"
        )
            ? customer.expiryDate
            : todayISO();


    const newExpiry =
        addMonths(
            baseDate,
            selectedPlan.duration
        );


    document
        .getElementById(
            "renewExpiry"
        )
        .textContent =
        formatDate(
            newExpiry
        );


    document
        .getElementById(
            "renewAmount"
        )
        .textContent =
        money(
            selectedPlan.price
        );

}


function confirmRenewal() {

    const customer =
        customers.find(
            item =>
                item.id ===
                selectedRenewCustomerId
        );


    if (!customer) {
        return;
    }


    const selectedPlan =
        getPlan(
            document
                .getElementById(
                    "renewPlan"
                )
                .value
        );


    if (!selectedPlan) {
        return;
    }


    const baseDate =
        customer.expiryDate &&
        new Date(
            customer.expiryDate +
            "T00:00:00"
        ) >
        new Date(
            todayISO() +
            "T00:00:00"
        )
            ? customer.expiryDate
            : todayISO();


    customer.plan =
        selectedPlan.name;


    customer.amount =
        selectedPlan.price;


    customer.startDate =
        todayISO();


    customer.expiryDate =
        addMonths(
            baseDate,
            selectedPlan.duration
        );


    customer.status =
        "Active";


    saveData(
        STORAGE.customers,
        customers
    );


    createPayment(
        customer,
        "Paid"
    );


    createInvoice(
        customer
    );


    addNotification(
        "Subscription Renewed",
        `${customer.name}'s subscription was renewed.`,
        "success"
    );


    closeAllModals();


    showToast(
        "Subscription renewed successfully."
    );


    refreshApplication();

}


/* =========================================================
   PAYMENT
========================================================= */

function createPayment(
    customer,
    status = "Paid"
) {

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
            Number(
                customer.amount
            ),

        date:
            todayISO(),

        method:
            "UPI",

        status

    };


    payments.unshift(
        payment
    );


    saveData(
        STORAGE.payments,
        payments
    );

}


function renderPayments() {

    const table =
        document.getElementById(
            "paymentsTable"
        );


    if (!table) {
        return;
    }


    const search =
        (
            document
                .getElementById(
                    "paymentSearch"
                )
                ?.value ||
            ""
        )
        .toLowerCase();


    const filter =
        document
            .getElementById(
                "paymentStatusFilter"
            )
            ?.value ||
        "all";


    const filtered =
        payments.filter(
            payment => {

                const text =
                    [
                        payment.id,
                        payment.customerName,
                        payment.plan
                    ]
                        .join(" ")
                        .toLowerCase();


                return (

                    text.includes(
                        search
                    )

                    &&

                    (
                        filter ===
                        "all" ||

                        payment.status ===
                        filter
                    )

                );

            }
        );


    if (!filtered.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    No payments found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filtered
            .map(
                payment => `

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
                            ${money(
                                payment.amount
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                payment.date
                            )}
                        </td>

                        <td>
                            ${payment.method}
                        </td>

                        <td>

                            <span
                                class="badge ${statusClass(
                                    payment.status ===
                                    "Paid"
                                        ? "Active"
                                        : "Suspended"
                                )}"
                            >
                                ${payment.status}
                            </span>

                        </td>

                    </tr>

                `
            )
            .join("");

}


/* =========================================================
   INVOICE CREATION
========================================================= */

function createInvoice(customer) {

    const existing =
        invoices.find(
            invoice =>

                invoice.customerId ===
                customer.id &&

                invoice.date ===
                todayISO() &&

                invoice.plan ===
                customer.plan

        );


    if (existing) {
        return existing;
    }


    const invoiceNumber =
        generateInvoiceNumber();


    const subtotal =
        Number(
            customer.amount
        );


    const tax =
        calculateTax(
            subtotal
        );


    const total =
        subtotal +
        tax;


    const invoice = {

        id:
            generateId("INV"),

        invoiceNumber,

        customerId:
            customer.id,

        customerName:
            customer.name,

        phone:
            customer.phone,

        username:
            customer.username,

        plan:
            customer.plan,

        amount:
            subtotal,

        taxRate:
            settings.taxEnabled
                ? Number(
                    settings.taxRate
                )
                : 0,

        taxAmount:
            tax,

        total,

        date:
            todayISO(),

        expiryDate:
            customer.expiryDate,

        status:
            "Paid"

    };


    invoices.unshift(
        invoice
    );


    saveData(
        STORAGE.invoices,
        invoices
    );


    return invoice;

}


/* =========================================================
   INVOICE NUMBER
========================================================= */

function generateInvoiceNumber() {

    const year =
        new Date()
            .getFullYear();


    const count =
        invoices.length + 1;


    return (

        settings.invoicePrefix +

        "-" +

        year +

        "-" +

        String(count)
            .padStart(
                5,
                "0"
            )

    );

}


/* =========================================================
   GST / TAX
========================================================= */

function calculateTax(amount) {

    if (
        !settings.taxEnabled
    ) {

        return 0;

    }


    const rate =
        Number(
            settings.taxRate
        ) || 0;


    return (
        Number(amount || 0) *
        rate /
        100
    );

}


/* =========================================================
   INVOICE TABLE
========================================================= */

function renderInvoices() {

    const table =
        document.getElementById(
            "invoicesTable"
        );


    if (!table) {
        return;
    }


    if (!invoices.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    No invoices found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        invoices
            .map(
                invoice => `

                    <tr>

                        <td>
                            <strong>
                                ${invoice.invoiceNumber}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                invoice.customerName
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                invoice.plan
                            )}
                        </td>

                        <td>
                            ${money(
                                invoice.total
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                invoice.date
                            )}
                        </td>

                        <td>

                            <span
                                class="badge success"
                            >
                                ${invoice.status}
                            </span>

                        </td>

                        <td>

                            <button
                                class="secondary-button"
                                data-invoice-id="${invoice.id}"
                            >
                                🖨️ Invoice
                            </button>

                        </td>

                    </tr>

                `
            )
            .join("");


    table
        .querySelectorAll(
            "[data-invoice-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const invoice =
                        invoices.find(
                            item =>
                                item.id ===
                                button.dataset.invoiceId
                        );

                    if (invoice) {

                        printInvoice(
                            invoice
                        );

                    }

                }
            );

        });

}


/* =========================================================
   PROFESSIONAL INVOICE
========================================================= */

function printInvoice(invoice) {

    const customer =
        customers.find(
            item =>
                item.id ===
                invoice.customerId
        );


    const popup =
        window.open(
            "",
            "_blank",
            "width=900,height=800"
        );


    if (!popup) {

        showToast(
            "Please allow popups to print invoice."
        );

        return;

    }


    const taxName =
        settings.taxName ||
        "GST";


    popup.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${invoice.invoiceNumber}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 30px;
                    font-family:
                        Arial,
                        sans-serif;
                    background: #f3f4f6;
                    color: #111827;
                }

                .invoice {
                    max-width: 850px;
                    margin: auto;
                    background: white;
                    padding: 45px;
                    box-shadow:
                        0 10px 30px
                        rgba(
                            0,
                            0,
                            0,
                            .08
                        );
                }

                .header {
                    display: flex;
                    justify-content:
                        space-between;
                    gap: 30px;
                    border-bottom:
                        2px solid
                        #111827;
                    padding-bottom: 25px;
                }

                .brand h1 {
                    margin: 0 0 8px;
                    font-size: 28px;
                }

                .brand p {
                    margin: 4px 0;
                    color: #6b7280;
                }

                .invoice-title {
                    text-align: right;
                }

                .invoice-title h2 {
                    margin: 0;
                    font-size: 32px;
                }

                .invoice-title p {
                    margin: 6px 0;
                }

                .info {
                    display: grid;
                    grid-template-columns:
                        1fr 1fr;
                    gap: 30px;
                    margin: 30px 0;
                }

                .info-box {
                    padding: 20px;
                    background:
                        #f9fafb;
                    border-radius:
                        10px;
                }

                .info-box h4 {
                    margin-top: 0;
                    color:
                        #6b7280;
                    text-transform:
                        uppercase;
                    font-size: 12px;
                }

                .info-box p {
                    margin: 7px 0;
                }

                table {
                    width: 100%;
                    border-collapse:
                        collapse;
                    margin-top: 25px;
                }

                th {
                    background:
                        #111827;
                    color: white;
                    padding: 13px;
                    text-align: left;
                }

                td {
                    padding: 14px;
                    border-bottom:
                        1px solid
                        #e5e7eb;
                }

                .summary {
                    margin-left: auto;
                    width: 330px;
                    margin-top: 25px;
                }

                .summary-row {
                    display: flex;
                    justify-content:
                        space-between;
                    padding: 9px 0;
                }

                .total {
                    border-top:
                        2px solid
                        #111827;
                    font-size: 20px;
                    font-weight:
                        bold;
                    padding-top: 15px;
                }

                .footer {
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top:
                        1px solid
                        #e5e7eb;
                    color:
                        #6b7280;
                    white-space:
                        pre-line;
                    text-align:
                        center;
                }

                @media print {

                    body {
                        background:
                            white;
                        padding: 0;
                    }

                    .invoice {
                        box-shadow:
                            none;
                        max-width:
                            none;
                    }

                }

            </style>

        </head>


        <body>

            <div class="invoice">


                <div class="header">

                    <div class="brand">

                        <h1>
                            ${escapeHTML(
                                settings.companyName
                            )}
                        </h1>

                        ${
                            settings.businessRegistrationNo
                                ? `
                                    <p>
                                        Registration No:
                                        ${escapeHTML(
                                            settings.businessRegistrationNo
                                        )}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            settings.gstNumber
                                ? `
                                    <p>
                                        GST No:
                                        ${escapeHTML(
                                            settings.gstNumber
                                        )}
                                    </p>
                                `
                                : ""
                        }

                        <p>
                            UPI:
                            ${escapeHTML(
                                settings.upiId
                            )}
                        </p>

                    </div>


                    <div class="invoice-title">

                        <h2>
                            INVOICE
                        </h2>

                        <p>
                            <strong>
                                ${invoice.invoiceNumber}
                            </strong>
                        </p>

                        <p>
                            Date:
                            ${formatDate(
                                invoice.date
                            )}
                        </p>

                    </div>

                </div>


                <div class="info">

                    <div class="info-box">

                        <h4>
                            Bill To
                        </h4>

                        <p>
                            <strong>
                                ${escapeHTML(
                                    invoice.customerName
                                )}
                            </strong>
                        </p>

                        <p>
                            Phone:
                            ${escapeHTML(
                                invoice.phone
                            )}
                        </p>

                    </div>


                    <div class="info-box">

                        <h4>
                            Subscription
                        </h4>

                        <p>
                            Plan:
                            ${escapeHTML(
                                invoice.plan
                            )}
                        </p>

                        <p>
                            Expiry:
                            ${formatDate(
                                invoice.expiryDate
                            )}
                        </p>

                        <p>
                            Status:
                            ${invoice.status}
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
                                IPTV Subscription -
                                ${escapeHTML(
                                    invoice.plan
                                )}
                            </td>

                            <td>
                                ${money(
                                    invoice.amount
                                )}
                            </td>

                        </tr>

                    </tbody>

                </table>


                <div class="summary">

                    <div class="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${money(
                                invoice.amount
                            )}
                        </strong>

                    </div>


                    <div class="summary-row">

                        <span>
                            ${taxName}
                            (${invoice.taxRate}%)
                        </span>

                        <strong>
                            ${money(
                                invoice.taxAmount
                            )}
                        </strong>

                    </div>


                    <div class="summary-row total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${money(
                                invoice.total
                            )}
                        </strong>

                    </div>

                </div>


                <div class="footer">

                    ${escapeHTML(
                        settings.invoiceFooter
                    )}

                </div>


            </div>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>

        </body>

        </html>

    `);


    popup.document.close();

}


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(customer) {

    const invoice =
        invoices.find(
            item =>
                item.customerId ===
                customer.id
        );


    let message =
        settings.whatsappTemplate ||
        `Hello {{NAME}},

Your IPTV subscription is now active.

Username: {{USERNAME}}
Password: {{PASSWORD}}
Plan: {{PLAN}}
Amount: ₹{{AMOUNT}}
Expiry: {{EXPIRY}}
Portal: {{PORTAL_URL}}

Thank you for choosing SUPER IPTV.`;


    message =
        replaceTemplate(
            message,
            customer,
            invoice
        );


    const phone =
        normalizePhone(
            customer.phone
        );


    const url =
        `https://wa.me/${phone}?text=` +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   TEMPLATE REPLACER
========================================================= */

function replaceTemplate(
    template,
    customer,
    invoice
) {

    return template

        .replace(
            /{{NAME}}/g,
            customer.name || ""
        )

        .replace(
            /{{USERNAME}}/g,
            customer.username || ""
        )

        .replace(
            /{{PASSWORD}}/g,
            customer.password || ""
        )

        .replace(
            /{{PLAN}}/g,
            customer.plan || ""
        )

        .replace(
            /{{AMOUNT}}/g,
            invoice
                ? invoice.total
                : customer.amount || 0
        )

        .replace(
            /{{EXPIRY}}/g,
            formatDate(
                customer.expiryDate
            )
        )

        .replace(
            /{{PORTAL_URL}}/g,
            customer.portalUrl || ""
        )

        .replace(
            /{{UPI_ID}}/g,
            settings.upiId || ""
        )

        .replace(
            /{{INVOICE}}/g,
            invoice
                ? invoice.invoiceNumber
                : ""
        );

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(phone) {

    let value =
        String(
            phone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        value.length === 10
    ) {

        value =
            "91" +
            value;

    }


    return value;

}


/* =========================================================
   QR CODE
========================================================= */

function initializeQR() {

    const copyButton =
        document.getElementById(
            "copyUpi"
        );


    const downloadButton =
        document.getElementById(
            "downloadQR"
        );


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


function generatePaymentQR() {

    const planSelect =
        document.getElementById(
            "plan"
        );


    const amount =
        Number(
            document
                .getElementById(
                    "amount"
                )
                ?.value ||
            0
        );


    if (
        !planSelect ||
        !planSelect.value ||
        !amount
    ) {

        clearQR();

        return;

    }


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {
        return;
    }


    const planName =
        planSelect.value;


    const qrPlan =
        document.getElementById(
            "qrPlan"
        );


    const qrAmount =
        document.getElementById(
            "qrAmount"
        );


    if (qrPlan) {

        qrPlan.textContent =
            planName;

    }


    if (qrAmount) {

        qrAmount.textContent =
            money(
                amount
            );

    }


    qrContainer.innerHTML = "";


    const upiURL =

        "upi://pay?" +

        "pa=" +
        encodeURIComponent(
            settings.upiId
        ) +

        "&pn=" +
        encodeURIComponent(
            settings.upiName
        ) +

        "&am=" +
        encodeURIComponent(
            amount
        ) +

        "&cu=INR" +

        "&tn=" +
        encodeURIComponent(
            `${settings.companyName} - ${planName}`
        );


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML = `

            <p>
                QR Library not loaded.
            </p>

        `;

        return;

    }


    new QRCode(
        qrContainer,
        {

            text:
                upiURL,

            width:
                220,

            height:
                220,

            correctLevel:
                QRCode.CorrectLevel.H

        }
    );

}


function clearQR() {

    const qr =
        document.getElementById(
            "qrcode"
        );


    if (qr) {

        qr.innerHTML = `

            <div class="qr-placeholder">

                <span>
                    ▣
                </span>

                <p>
                    Select a plan
                </p>

                <small>
                    QR code will appear here
                </small>

            </div>

        `;

    }


    const qrPlan =
        document.getElementById(
            "qrPlan"
        );


    const qrAmount =
        document.getElementById(
            "qrAmount"
        );


    if (qrPlan) {

        qrPlan.textContent =
            "-";

    }


    if (qrAmount) {

        qrAmount.textContent =
            "₹0";

    }

}


function copyUPI() {

    navigator.clipboard
        .writeText(
            settings.upiId
        )
        .then(
            () => {

                showToast(
                    "UPI ID copied."
                );

            }
        )
        .catch(
            () => {

                showToast(
                    "Unable to copy UPI ID."
                );

            }
        );

}


function downloadQR() {

    const qr =
        document
            .querySelector(
                "#qrcode canvas"
            );


    if (!qr) {

        showToast(
            "Please select a plan first."
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "SUPER-IPTV-UPI-QR.png";


    link.href =
        qr.toDataURL(
            "image/png"
        );


    link.click();

}


/* =========================================================
   SEARCH / FILTERS
========================================================= */

function initializeSearchAndFilters() {

    [
        "customerSearch",
        "customerStatusFilter",
        "customerPlanFilter",
        "paymentSearch",
        "paymentStatusFilter"
    ]
        .forEach(id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.addEventListener(
                    "input",
                    refreshApplication
                );

                element.addEventListener(
                    "change",
                    refreshApplication
                );

            }

        });


    const refresh =
        document.getElementById(
            "refreshCustomers"
        );


    if (refresh) {

        refresh.addEventListener(
            "click",
            refreshApplication
        );

    }

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initializeGlobalSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            const value =
                input.value
                    .trim()
                    .toLowerCase();


            if (!value) {
                return;
            }


            const customer =
                customers.find(
                    item =>
                        [
                            item.name,
                            item.phone,
                            item.username
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                value
                            )
                );


            if (customer) {

                showPage(
                    "customers"
                );


                const search =
                    document.getElementById(
                        "customerSearch"
                    );


                if (search) {

                    search.value =
                        value;

                    renderCustomers();

                }

            }

        }
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        customers.length;


    const active =
        customers.filter(
            customer =>
                getCustomerStatus(
                    customer
                ) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            customer =>
                getCustomerStatus(
                    customer
                ) ===
                "Expired"
        ).length;


    const expiring =
        getExpiringCustomers()
            .length;


    const totalRevenue =
        payments
            .filter(
                payment =>
                    payment.status ===
                    "Paid"
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


    const monthlyRevenue =
        getMonthlyPayments()
            .filter(
                payment =>
                    payment.status ===
                    "Paid"
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


    const pending =
        payments.filter(
            payment =>
                payment.status ===
                "Pending"
        ).length;


    const newCustomers =
        customers.filter(
            customer => {

                const date =
                    new Date(
                        customer.createdAt
                    );


                const now =
                    new Date();


                return (

                    date.getMonth() ===
                    now.getMonth()

                    &&

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
        "expiringSoon",
        expiring
    );

    setText(
        "totalRevenue",
        money(
            totalRevenue
        )
    );

    setText(
        "monthlyRevenue",
        money(
            monthlyRevenue
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
        "paymentTotalRevenue",
        money(
            totalRevenue
        )
    );

    setText(
        "paymentMonthlyRevenue",
        money(
            monthlyRevenue
        )
    );

    setText(
        "paymentPending",
        pending
    );


    setText(
        "subscriptionActive",
        active
    );

    setText(
        "subscriptionExpiring",
        expiring
    );

    setText(
        "subscriptionExpired",
        expired
    );


    setText(
        "reportCustomers",
        total
    );

    setText(
        "reportRevenue",
        money(
            totalRevenue
        )
    );


    setText(
        "reportAverage",
        money(
            total
                ? totalRevenue /
                    total
                : 0
        )
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


    if (!table) {
        return;
    }


    const recent =
        customers
            .slice(
                0,
                5
            );


    if (!recent.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    No Customers Yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        recent
            .map(
                customer => `

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
                            ${formatDate(
                                customer.expiryDate
                            )}
                        </td>

                        <td>

                            <span
                                class="badge ${statusClass(
                                    getCustomerStatus(
                                        customer
                                    )
                                )}"
                            >
                                ${getCustomerStatus(
                                    customer
                                )}
                            </span>

                        </td>

                    </tr>

                `
            )
            .join("");

}


/* =========================================================
   EXPIRING CUSTOMERS
========================================================= */

function getExpiringCustomers() {

    const today =
        new Date(
            todayISO() +
            "T00:00:00"
        );


    const next7 =
        new Date(
            today
        );


    next7.setDate(
        next7.getDate() +
        7
    );


    return customers.filter(
        customer => {

            if (
                !customer.expiryDate
            ) {
                return false;
            }


            const expiry =
                new Date(
                    customer.expiryDate +
                    "T00:00:00"
                );


            return (

                expiry >= today &&

                expiry <= next7

            );

        }
    );

}


function renderExpiringCustomers() {

    const list =
        document.getElementById(
            "expiringCustomersList"
        );


    const badge =
        document.getElementById(
            "expiringBadge"
        );


    if (!list) {
        return;
    }


    const expiring =
        getExpiringCustomers();


    if (badge) {

        badge.textContent =
            expiring.length;

    }


    if (!expiring.length) {

        list.innerHTML = `

            <div class="empty-state">

                No customers expiring
                in the next 7 days.

            </div>

        `;

        return;

    }


    list.innerHTML =
        expiring
            .map(
                customer => `

                    <div class="expiring-item">

                        <strong>
                            ${escapeHTML(
                                customer.name
                            )}
                        </strong>

                        <span>
                            ${formatDate(
                                customer.expiryDate
                            )}
                        </span>

                    </div>

                `
            )
            .join("");

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


    table.innerHTML =
        customers
            .map(
                customer => `

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
                            ${formatDate(
                                customer.startDate
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                customer.expiryDate
                            )}
                        </td>

                        <td>

                            <span
                                class="badge ${statusClass(
                                    getCustomerStatus(
                                        customer
                                    )
                                )}"
                            >
                                ${getCustomerStatus(
                                    customer
                                )}
                            </span>

                        </td>

                        <td>

                            <button
                                class="secondary-button"
                                data-sub-renew="${customer.id}"
                            >
                                🔄 Renew
                            </button>

                        </td>

                    </tr>

                `
            )
            .join("");


    table
        .querySelectorAll(
            "[data-sub-renew]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const customer =
                        customers.find(
                            item =>
                                item.id ===
                                button.dataset.subRenew
                        );


                    if (customer) {

                        openRenewModal(
                            customer
                        );

                    }

                }
            );

        });

}


/* =========================================================
   MONTHLY PAYMENTS
========================================================= */

function getMonthlyPayments() {

    const now =
        new Date();


    return payments.filter(
        payment => {

            const date =
                new Date(
                    payment.date +
                    "T00:00:00"
                );


            return (

                date.getMonth() ===
                now.getMonth()

                &&

                date.getFullYear() ===
                now.getFullYear()

            );

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initializeNotifications() {

    const button =
        document.getElementById(
            "notificationButton"
        );


    const clear =
        document.getElementById(
            "clearNotifications"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    "notifications"
                );

            }
        );

    }


    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                notifications =
                    notifications.map(
                        notification => ({

                            ...notification,

                            read: true

                        })
                    );


                saveData(
                    STORAGE.notifications,
                    notifications
                );


                renderNotifications();

                updateNotificationCount();

            }
        );

    }

}


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

        createdAt:
            new Date().toISOString()

    });


    saveData(
        STORAGE.notifications,
        notifications
    );

}


function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) {
        return;
    }


    if (!notifications.length) {

        list.innerHTML = `

            <div class="empty-state">

                No notifications.

            </div>

        `;

        return;

    }


    list.innerHTML =
        notifications
            .map(
                notification => `

                    <div class="notification-item
                        ${
                            notification.read
                                ? ""
                                : "unread"
                        }">

                        <div>

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

                        </div>

                    </div>

                `
            )
            .join("");

}


function updateNotificationCount() {

    const unread =
        notifications.filter(
            item =>
                !item.read
        ).length;


    setText(
        "notificationCount",
        unread
    );


    const dot =
        document.getElementById(
            "notificationDot"
        );


    if (dot) {

        dot.style.display =
            unread > 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   PLANS
========================================================= */

function initializePlans() {

    const button =
        document.getElementById(
            "addPlanButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            addNewPlan
        );

    }

}


function renderPlans() {

    const grid =
        document.getElementById(
            "plansGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML =
        plans
            .map(
                plan => `

                    <div class="panel-card">

                        <h3>
                            ${escapeHTML(
                                plan.name
                            )}
                        </h3>

                        <h2>
                            ${money(
                                plan.price
                            )}
                        </h2>

                        <p>
                            ${plan.duration}
                            month(s)
                        </p>

                        <button
                            class="secondary-button"
                            data-delete-plan="${plan.id}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                `
            )
            .join("");


    grid
        .querySelectorAll(
            "[data-delete-plan]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    plans =
                        plans.filter(
                            plan =>
                                plan.id !==
                                button.dataset.deletePlan
                        );


                    saveData(
                        STORAGE.plans,
                        plans
                    );


                    showToast(
                        "Plan deleted."
                    );


                    renderPlans();

                }
            );

        });

}


function addNewPlan() {

    const name =
        prompt(
            "Enter plan name:"
        );


    if (!name) {
        return;
    }


    const price =
        Number(
            prompt(
                "Enter price:"
            )
        );


    if (!price) {
        return;
    }


    const duration =
        Number(
            prompt(
                "Enter duration in months:"
            )
        );


    if (!duration) {
        return;
    }


    plans.push({

        id:
            generateId("PLAN"),

        name,

        price,

        duration,

        active:
            true

    });


    saveData(
        STORAGE.plans,
        plans
    );


    renderPlans();


    showToast(
        "New plan added."
    );

}


/* =========================================================
   BACKUP
========================================================= */

function initializeBackup() {

    const exportButton =
        document.getElementById(
            "exportBackup"
        );


    const importButton =
        document.getElementById(
            "importBackup"
        );


    const fileInput =
        document.getElementById(
            "importBackupFile"
        );


    const printButton =
        document.getElementById(
            "printCustomers"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportBackup
        );

    }


    if (
        importButton &&
        fileInput
    ) {

        importButton.addEventListener(
            "click",
            () => fileInput.click()
        );


        fileInput.addEventListener(
            "change",
            importBackup
        );

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

    }

}


function exportBackup() {

    const backup = {

        version:
            "1.0",

        exportedAt:
            new Date().toISOString(),

        customers,

        payments,

        invoices,

        notifications,

        plans,

        settings

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
        `SUPER-IPTV-Backup-${todayISO()}.json`;


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Backup exported."
    );

}


function importBackup(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function() {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !confirm(
                        "Import backup and replace current data?"
                    )
                ) {
                    return;
                }


                customers =
                    backup.customers ||
                    [];


                payments =
                    backup.payments ||
                    [];


                invoices =
                    backup.invoices ||
                    [];


                notifications =
                    backup.notifications ||
                    [];


                plans =
                    backup.plans ||
                    DEFAULT_PLANS;


                settings = {

                    ...DEFAULT_SETTINGS,

                    ...(backup.settings ||
                        {})

                };


                saveData(
                    STORAGE.customers,
                    customers
                );


                saveData(
                    STORAGE.payments,
                    payments
                );


                saveData(
                    STORAGE.invoices,
                    invoices
                );


                saveData(
                    STORAGE.notifications,
                    notifications
                );


                saveData(
                    STORAGE.plans,
                    plans
                );


                saveData(
                    STORAGE.settings,
                    settings
                );


                loadSettingsToForm();


                refreshApplication();


                showToast(
                    "Backup imported successfully."
                );


            } catch (error) {

                showToast(
                    "Invalid backup file."
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

function initializeSettings() {

    const general =
        document.getElementById(
            "saveGeneralSettings"
        );


    const payment =
        document.getElementById(
            "savePaymentSettings"
        );


    const whatsapp =
        document.getElementById(
            "saveWhatsappTemplate"
        );


    if (general) {

        general.addEventListener(
            "click",
            saveGeneralSettings
        );

    }


    if (payment) {

        payment.addEventListener(
            "click",
            savePaymentSettings
        );

    }


    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            saveWhatsappSettings
        );

    }

}


function loadSettingsToForm() {

    setInputValue(
        "companyName",
        settings.companyName
    );


    setInputValue(
        "defaultPortal",
        settings.defaultPortal
    );


    setInputValue(
        "whatsappNumber",
        settings.whatsappNumber
    );


    setInputValue(
        "upiId",
        settings.upiId
    );


    setInputValue(
        "upiName",
        settings.upiName
    );


    setInputValue(
        "whatsappTemplate",
        settings.whatsappTemplate ||
        `Hello {{NAME}},

Your IPTV subscription is now active.

Username: {{USERNAME}}
Password: {{PASSWORD}}
Plan: {{PLAN}}
Amount: ₹{{AMOUNT}}
Expiry: {{EXPIRY}}
Portal: {{PORTAL_URL}}

Thank you for choosing SUPER IPTV.`
    );

}


function saveGeneralSettings() {

    settings.companyName =
        document
            .getElementById(
                "companyName"
            )
            .value
            .trim();


    settings.defaultPortal =
        document
            .getElementById(
                "defaultPortal"
            )
            .value
            .trim();


    settings.whatsappNumber =
        document
            .getElementById(
                "whatsappNumber"
            )
            .value
            .trim();


    saveData(
        STORAGE.settings,
        settings
    );


    showToast(
        "General settings saved."
    );

}


function savePaymentSettings() {

    settings.upiId =
        document
            .getElementById(
                "upiId"
            )
            .value
            .trim();


    settings.upiName =
        document
            .getElementById(
                "upiName"
            )
            .value
            .trim();


    saveData(
        STORAGE.settings,
        settings
    );


    showToast(
        "Payment settings saved."
    );

}


function saveWhatsappSettings() {

    settings.whatsappTemplate =
        document
            .getElementById(
                "whatsappTemplate"
            )
            .value;


    saveData(
        STORAGE.settings,
        settings
    );


    showToast(
        "WhatsApp template saved."
    );

}


/* =========================================================
   CHARTS
========================================================= */

function initializeCharts() {

    setTimeout(
        renderCharts,
        200
    );

}


function renderCharts() {

    renderRevenueChart();

    renderCustomerChart();

    renderReportRevenueChart();

    renderPlanChart();

}


function renderRevenueChart() {

    const canvas =
        document.getElementById(
            "revenueChart"
        );


    if (!canvas) {
        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    if (revenueChart) {

        revenueChart.destroy();

    }


    const labels = [];

    const data = [];


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setMonth(
            date.getMonth() -
            i
        );


        labels.push(
            date.toLocaleDateString(
                "en-IN",
                {
                    month:
                        "short",
                    year:
                        "numeric"
                }
            )
        );


        const month =
            date.getMonth();


        const year =
            date.getFullYear();


        const total =
            payments
                .filter(
                    payment => {

                        const paymentDate =
                            new Date(
                                payment.date +
                                "T00:00:00"
                            );


                        return (

                            payment.status ===
                            "Paid"

                            &&

                            paymentDate.getMonth() ===
                            month

                            &&

                            paymentDate.getFullYear() ===
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


        data.push(
            total
        );

    }


    revenueChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Revenue",

                            data,

                            tension:
                                0.4,

                            fill:
                                true

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


function renderCustomerChart() {

    const canvas =
        document.getElementById(
            "customerChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    if (customerChart) {

        customerChart.destroy();

    }


    const active =
        customers.filter(
            customer =>
                getCustomerStatus(
                    customer
                ) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            customer =>
                getCustomerStatus(
                    customer
                ) ===
                "Expired"
        ).length;


    const suspended =
        customers.filter(
            customer =>
                getCustomerStatus(
                    customer
                ) ===
                "Suspended"
        ).length;


    customerChart =
        new Chart(
            canvas,
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


function renderReportRevenueChart() {

    const canvas =
        document.getElementById(
            "reportRevenueChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    if (reportRevenueChart) {

        reportRevenueChart.destroy();

    }


    reportRevenueChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels: [

                        "Revenue"

                    ],

                    datasets: [

                        {

                            label:
                                "Total Revenue",

                            data: [

                                payments
                                    .filter(
                                        payment =>
                                            payment.status ===
                                            "Paid"
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
                                    )

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


function renderPlanChart() {

    const canvas =
        document.getElementById(
            "planChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    if (planChart) {

        planChart.destroy();

    }


    const labels =
        plans.map(
            plan =>
                plan.name
        );


    const data =
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
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Customers",

                            data

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


/* =========================================================
   REFRESH EVERYTHING
========================================================= */

function refreshApplication() {

    updateDashboard();

    renderCustomers();

    renderRecentCustomers();

    renderExpiringCustomers();

    renderSubscriptions();

    renderPayments();

    renderInvoices();

    renderNotifications();

    updateNotificationCount();

    renderPlans();

    renderCharts();

}


/* =========================================================
   UI HELPERS
========================================================= */

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


function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value || "";

    }

}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const text =
        document.getElementById(
            "toastMessage"
        );


    if (!toast || !text) {
        return;
    }


    text.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

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
   WINDOW EVENTS
========================================================= */

window.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            closeAllModals();

        }

    }
);


/* =========================================================
   EXPORT FUNCTIONS
   Optional global access
========================================================= */

window.SUPER_IPTV = {

    customers,

    payments,

    invoices,

    plans,

    settings,

    refresh:
        refreshApplication,

    showPage,

    printInvoice,

    openWhatsApp,

    generatePaymentQR

};