/* =========================================================
   SUPER IPTV MANAGEMENT PANEL
   FINAL script.js
   ---------------------------------------------------------
   FEATURES
   - Dashboard
   - Customers
   - Add / Edit / Delete Customer
   - Automatic Expiry Date
   - Automatic Days Left
   - Plan Price
   - UPI QR Generator
   - Payment Status
   - Payments
   - Invoice
   - WhatsApp Message
   - Reports
   - Settings
   - Backup / Restore
   - LocalStorage
========================================================= */

"use strict";

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE = {
    USERS: "SUPER_IPTV_USERS",
    PAYMENTS: "SUPER_IPTV_PAYMENTS",
    SETTINGS: "SUPER_IPTV_SETTINGS"
};


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
    businessName: "SUPER IPTV",
    upiId: "6289033804@ptsbi",
    contact: "",
    portalUrl: "",
    currency: "₹",

    plans: {
        "1 Month": 200,
        "3 Months": 600,
        "6 Months": 1150,
        "12 Months": 2000
    }
};


/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

function loadData(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Storage error:", error);

        return fallback;
    }
}


function saveData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error("Save error:", error);

        showToast(
            "Data save failed",
            "error"
        );
    }
}


/* =========================================================
   GLOBAL DATA
========================================================= */

let users = loadData(
    STORAGE.USERS,
    []
);

let payments = loadData(
    STORAGE.PAYMENTS,
    []
);

let settings = loadData(
    STORAGE.SETTINGS,
    DEFAULT_SETTINGS
);


/* =========================================================
   MERGE DEFAULT SETTINGS
========================================================= */

settings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    plans: {
        ...DEFAULT_SETTINGS.plans,
        ...(settings.plans || {})
    }
};


/* =========================================================
   HELPERS
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}


function $$(selector) {
    return document.querySelectorAll(selector);
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function generateId(prefix = "ID") {

    return (
        prefix +
        "-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()
    );
}


function formatMoney(amount) {

    const number = Number(amount) || 0;

    return (
        settings.currency +
        number.toLocaleString("en-IN")
    );
}


function todayISO() {

    const date = new Date();

    const offset =
        date.getTimezoneOffset() * 60000;

    return new Date(
        date.getTime() - offset
    )
        .toISOString()
        .split("T")[0];
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(
        dateValue + "T00:00:00"
    );

    if (isNaN(date.getTime())) {
        return "-";
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
   PLAN MONTHS
========================================================= */

function getPlanMonths(plan) {

    const match = String(plan)
        .match(/\d+/);

    return match
        ? Number(match[0])
        : 1;
}


/* =========================================================
   CALCULATE EXPIRY DATE
========================================================= */

function calculateExpiryDate(
    startDate,
    plan
) {

    if (!startDate) {
        return "";
    }

    const months =
        getPlanMonths(plan);

    const date = new Date(
        startDate + "T00:00:00"
    );

    if (isNaN(date.getTime())) {
        return "";
    }

    date.setMonth(
        date.getMonth() + months
    );

    return date
        .toISOString()
        .split("T")[0];
}


/* =========================================================
   CALCULATE DAYS LEFT
========================================================= */

function calculateDaysLeft(expiryDate) {

    if (!expiryDate) {
        return 0;
    }

    const today = new Date(
        todayISO() + "T00:00:00"
    );

    const expiry = new Date(
        expiryDate + "T00:00:00"
    );

    const difference =
        expiry.getTime() -
        today.getTime();

    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );
}


/* =========================================================
   CUSTOMER STATUS
========================================================= */

function getCustomerStatus(user) {

    if (
        user.status === "Suspended"
    ) {
        return "Suspended";
    }

    const days =
        calculateDaysLeft(
            user.expiryDate
        );

    if (days < 0) {
        return "Expired";
    }

    if (days <= 7) {
        return "Expiring";
    }

    return "Active";
}


/* =========================================================
   STATUS BADGE
========================================================= */

function statusBadge(status) {

    let className = "active";

    if (status === "Expired") {
        className = "expired";
    }

    if (status === "Expiring") {
        className = "expiring";
    }

    if (status === "Suspended") {
        className = "suspended";
    }

    return `
        <span class="status-badge ${className}">
            ${escapeHTML(status)}
        </span>
    `;
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    let container =
        $("#toastContainer");

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );
    }

    const toast =
        document.createElement("div");

    toast.className =
        "toast";

    if (type === "error") {
        toast.style.borderLeftColor =
            "#ef4444";
    }

    if (type === "warning") {
        toast.style.borderLeftColor =
            "#f59e0b";
    }

    toast.textContent =
        message;

    container.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3500);
}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

function initNavigation() {

    $$(".nav-item").forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const target =
                        this.dataset.page ||
                        this.getAttribute(
                            "data-target"
                        );

                    if (!target) {
                        return;
                    }

                    showPage(target);

                    $$(".nav-item")
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    this.classList.add(
                        "active"
                    );

                    closeMobileSidebar();
                }
            );
        }
    );
}


function showPage(pageId) {

    $$(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

            const id =
                section.id;

            if (
                id === pageId ||
                id ===
                `page-${pageId}`
            ) {

                section.classList.add(
                    "active"
                );
            }
        });

    updatePageHeading(
        pageId
    );
}


function updatePageHeading(
    pageId
) {

    const heading =
        $(".page-heading h2");

    const subtitle =
        $(".page-heading p");

    if (!heading) {
        return;
    }

    const titles = {

        dashboard: [
            "Dashboard",
            "SUPER IPTV Management Panel"
        ],

        users: [
            "Customers",
            "Manage your IPTV customers"
        ],

        customers: [
            "Customers",
            "Manage your IPTV customers"
        ],

        addCustomer: [
            "Add Customer",
            "Create a new IPTV customer"
        ],

        payments: [
            "Payments",
            "Manage customer payments"
        ],

        reports: [
            "Reports",
            "View business reports"
        ],

        settings: [
            "Settings",
            "Manage panel settings"
        ],

        backup: [
            "Data Management",
            "Backup or restore your panel data"
        ]
    };

    const data =
        titles[pageId];

    if (data) {

        heading.textContent =
            data[0];

        if (subtitle) {
            subtitle.textContent =
                data[1];
        }
    }
}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initMobileMenu() {

    const menuButton =
        $(".mobile-menu-btn");

    const sidebar =
        $(".sidebar");

    const overlay =
        $(".sidebar-overlay");

    if (
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "mobile-open"
                );

                if (overlay) {
                    overlay.classList.toggle(
                        "active"
                    );
                }
            }
        );
    }

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileSidebar
        );
    }
}


function closeMobileSidebar() {

    const sidebar =
        $(".sidebar");

    const overlay =
        $(".sidebar-overlay");

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );
    }

    if (overlay) {

        overlay.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   SIDEBAR COLLAPSE
========================================================= */

function initSidebarCollapse() {

    const button =
        $(".sidebar-collapse-btn");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "sidebar-collapsed"
            );
        }
    );
}


/* =========================================================
   PLAN SELECT OPTIONS
========================================================= */

function populatePlanSelects() {

    const selectors = [
        "#plan",
        "#customerPlan",
        "#paymentPlan",
        "#qrPlan",
        ".plan-select"
    ];

    selectors.forEach(
        selector => {

            $$(selector)
                .forEach(select => {

                    const current =
                        select.value;

                    select.innerHTML =
                        `<option value="">Select Plan</option>`;

                    Object.entries(
                        settings.plans
                    )
                    .forEach(
                        ([plan, price]) => {

                            const option =
                                document.createElement(
                                    "option"
                                );

                            option.value =
                                plan;

                            option.textContent =
                                `${plan} — ${formatMoney(price)}`;

                            select.appendChild(
                                option
                            );
                        }
                    );

                    if (current) {
                        select.value =
                            current;
                    }
                }
            );
        }
    );
}


/* =========================================================
   CUSTOMER FORM ELEMENTS
========================================================= */

function getCustomerFormElements() {

    return {

        name:
            $("#customerName") ||
            $("#name"),

        phone:
            $("#customerPhone") ||
            $("#phone"),

        username:
            $("#customerUsername") ||
            $("#username"),

        password:
            $("#customerPassword") ||
            $("#password"),

        portalUrl:
            $("#customerPortalUrl") ||
            $("#portalUrl"),

        plan:
            $("#customerPlan") ||
            $("#plan"),

        startDate:
            $("#customerStartDate") ||
            $("#startDate"),

        expiryDate:
            $("#customerExpiryDate") ||
            $("#expiryDate"),

        amount:
            $("#customerAmount") ||
            $("#amount"),

        paymentStatus:
            $("#paymentStatus"),

        notes:
            $("#customerNotes") ||
            $("#notes")
    };
}


/* =========================================================
   AUTO EXPIRY + PRICE
========================================================= */

function updateCustomerForm() {

    const el =
        getCustomerFormElements();

    if (!el.plan) {
        return;
    }

    const plan =
        el.plan.value;

    const startDate =
        el.startDate
            ? el.startDate.value
            : todayISO();

    const price =
        settings.plans[plan] || 0;

    if (
        el.amount &&
        plan
    ) {

        el.amount.value =
            price;
    }

    if (
        el.expiryDate &&
        plan &&
        startDate
    ) {

        el.expiryDate.value =
            calculateExpiryDate(
                startDate,
                plan
            );
    }

    updateCustomerQR();
}


/* =========================================================
   QR GENERATOR
========================================================= */

function buildUPILink(
    amount,
    customerName = ""
) {

    const upiId =
        settings.upiId ||
        "6289033804@ptsbi";

    const businessName =
        settings.businessName ||
        "SUPER IPTV";

    let url =
        `upi://pay?pa=${encodeURIComponent(upiId)}`;

    url +=
        `&pn=${encodeURIComponent(businessName)}`;

    if (amount) {

        url +=
            `&am=${encodeURIComponent(
                Number(amount).toFixed(2)
            )}`;
    }

    url +=
        `&cu=INR`;

    if (customerName) {

        url +=
            `&tn=${encodeURIComponent(
                "IPTV Subscription - " +
                customerName
            )}`;
    }

    return url;
}


function generateQR(
    element,
    amount,
    customerName = ""
) {

    if (!element) {
        return;
    }

    element.innerHTML = "";

    if (
        typeof QRCode ===
        "undefined"
    ) {

        element.innerHTML = `
            <div style="
                color:#ef4444;
                text-align:center;
                font-size:11px;
                padding:20px;
            ">
                QRCode.js not loaded
            </div>
        `;

        console.error(
            "QRCode.js library is missing."
        );

        return;
    }

    const upiLink =
        buildUPILink(
            amount,
            customerName
        );

    new QRCode(
        element,
        {
            text: upiLink,
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
   CUSTOMER QR AUTO GENERATE
========================================================= */

function updateCustomerQR() {

    const el =
        getCustomerFormElements();

    const qr =
        $("#customerQRCode") ||
        $(".customer-qr-code");

    if (!qr) {
        return;
    }

    const amount =
        el.amount
            ? el.amount.value
            : 0;

    const name =
        el.name
            ? el.name.value
            : "";

    if (!amount) {

        qr.innerHTML = `
            <i class="fas fa-qrcode"
               style="
                 font-size:45px;
                 color:#9ca3af;
               ">
            </i>
        `;

        return;
    }

    generateQR(
        qr,
        amount,
        name
    );

    updateQRDetails();
}


/* =========================================================
   QR DETAILS
========================================================= */

function updateQRDetails() {

    const el =
        getCustomerFormElements();

    const amount =
        el.amount
            ? el.amount.value
            : 0;

    const name =
        el.name
            ? el.name.value
            : "";

    const amountElements = [
        "#qrAmount",
        "#displayQrAmount",
        ".display-qr-amount"
    ];

    amountElements.forEach(
        selector => {

            $$(selector)
                .forEach(element => {

                    element.textContent =
                        formatMoney(
                            amount
                        );
                }
            );
        }
    );

    const nameElements = [
        "#qrCustomerName",
        ".qr-customer-name"
    ];

    nameElements.forEach(
        selector => {

            $$(selector)
                .forEach(element => {

                    element.textContent =
                        name ||
                        "Customer";
                }
            );
        }
    );

    const upiElements = [
        "#displayUpiId",
        "#qrUpiId",
        ".qr-upi-id"
    ];

    upiElements.forEach(
        selector => {

            $$(selector)
                .forEach(element => {

                    element.textContent =
                        settings.upiId;
                }
            );
        }
    );
}


/* =========================================================
   DASHBOARD QR
========================================================= */

function generateDashboardQR() {

    const qr =
        $("#dashboardQRCode") ||
        $(".dashboard-qr-code");

    const amountInput =
        $("#dashboardAmount") ||
        $("#qrAmountInput") ||
        $(".qr-amount-input");

    const planSelect =
        $("#dashboardPlan") ||
        $("#qrPlan") ||
        $(".qr-plan-select");

    if (!qr) {
        return;
    }

    const amount =
        amountInput
            ? amountInput.value
            : 0;

    const plan =
        planSelect
            ? planSelect.value
            : "";

    if (!amount && plan) {

        const price =
            settings.plans[plan] || 0;

        if (amountInput) {
            amountInput.value =
                price;
        }

        generateQR(
            qr,
            price,
            ""
        );

        return;
    }

    if (amount) {

        generateQR(
            qr,
            amount,
            ""
        );

    } else {

        qr.innerHTML = `
            <i class="fas fa-qrcode"
               style="
                font-size:45px;
                color:#9ca3af;
               ">
            </i>
        `;
    }
}


/* =========================================================
   CUSTOMER FORM EVENTS
========================================================= */

function initCustomerFormEvents() {

    const el =
        getCustomerFormElements();

    if (el.plan) {

        el.plan.addEventListener(
            "change",
            updateCustomerForm
        );
    }

    if (el.startDate) {

        el.startDate.addEventListener(
            "change",
            updateCustomerForm
        );
    }

    if (el.amount) {

        el.amount.addEventListener(
            "input",
            updateCustomerQR
        );
    }

    if (el.name) {

        el.name.addEventListener(
            "input",
            updateCustomerQR
        );
    }

    const form =
        $("#customerForm");

    if (form) {

        form.addEventListener(
            "submit",
            handleCustomerSubmit
        );
    }
}


/* =========================================================
   ADD CUSTOMER
========================================================= */

function handleCustomerSubmit(
    event
) {

    event.preventDefault();

    const el =
        getCustomerFormElements();

    const name =
        el.name
            ? el.name.value.trim()
            : "";

    const phone =
        el.phone
            ? el.phone.value.trim()
            : "";

    const username =
        el.username
            ? el.username.value.trim()
            : "";

    const password =
        el.password
            ? el.password.value.trim()
            : "";

    const plan =
        el.plan
            ? el.plan.value
            : "";

    const startDate =
        el.startDate
            ? el.startDate.value
            : todayISO();

    const expiryDate =
        el.expiryDate &&
        el.expiryDate.value
            ? el.expiryDate.value
            : calculateExpiryDate(
                startDate,
                plan
            );

    const amount =
        el.amount &&
        el.amount.value
            ? Number(
                el.amount.value
            )
            : settings.plans[plan] || 0;

    if (!name) {

        showToast(
            "Please enter customer name",
            "error"
        );

        return;
    }

    if (!phone) {

        showToast(
            "Please enter phone number",
            "error"
        );

        return;
    }

    if (!plan) {

        showToast(
            "Please select a plan",
            "error"
        );

        return;
    }

    const duplicate =
        users.find(
            user =>
                user.username &&
                username &&
                user.username ===
                username
        );

    if (duplicate) {

        showToast(
            "Username already exists",
            "error"
        );

        return;
    }

    const user = {

        id:
            generateId("CUS"),

        name,

        phone,

        username,

        password,

        portalUrl:
            el.portalUrl
                ? el.portalUrl.value.trim()
                : settings.portalUrl,

        plan,

        amount,

        startDate,

        expiryDate,

        paymentStatus:
            el.paymentStatus
                ? el.paymentStatus.value ||
                  "PAID"
                : "PAID",

        status: "Active",

        notes:
            el.notes
                ? el.notes.value.trim()
                : "",

        createdAt:
            new Date().toISOString()
    };

    users.push(user);

    saveData(
        STORAGE.USERS,
        users
    );

    /* Create payment record */

    const payment = {

        id:
            generateId("PAY"),

        customerId:
            user.id,

        customerName:
            user.name,

        phone:
            user.phone,

        plan:
            user.plan,

        amount:
            user.amount,

        paymentStatus:
            user.paymentStatus,

        paymentDate:
            todayISO(),

        createdAt:
            new Date().toISOString()
    };

    payments.push(payment);

    saveData(
        STORAGE.PAYMENTS,
        payments
    );

    showToast(
        "Customer added successfully"
    );

    resetCustomerForm();

    renderAll();

    showPage(
        "customers"
    );
}


/* =========================================================
   RESET FORM
========================================================= */

function resetCustomerForm() {

    const form =
        $("#customerForm");

    if (form) {
        form.reset();
    }

    const el =
        getCustomerFormElements();

    if (el.startDate) {

        el.startDate.value =
            todayISO();
    }

    if (el.expiryDate) {

        el.expiryDate.value =
            "";
    }

    if (el.amount) {

        el.amount.value =
            "";
    }

    const qr =
        $("#customerQRCode") ||
        $(".customer-qr-code");

    if (qr) {

        qr.innerHTML = `
            <i class="fas fa-qrcode"
               style="
                font-size:45px;
                color:#9ca3af;
               ">
            </i>
        `;
    }
}


/* =========================================================
   RENDER CUSTOMERS
========================================================= */

function renderCustomers(
    searchTerm = ""
) {

    const tableBody =
        $("#customersTableBody") ||
        $("#usersTableBody") ||
        document.querySelector(
            "#customersTable tbody"
        );

    if (!tableBody) {
        return;
    }

    const search =
        searchTerm
            .toLowerCase()
            .trim();

    const filtered =
        users.filter(
            user => {

                const text =
                    [
                        user.name,
                        user.phone,
                        user.username,
                        user.plan,
                        user.status
                    ]
                    .join(" ")
                    .toLowerCase();

                return text.includes(
                    search
                );
            }
        );

    if (!filtered.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    class="empty-table">
                    No customers found
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML =
        filtered
            .map(
                user => {

                    const status =
                        getCustomerStatus(
                            user
                        );

                    const days =
                        calculateDaysLeft(
                            user.expiryDate
                        );

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        user.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(
                                    user.phone
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    user.username ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    user.plan
                                )}
                            </td>

                            <td>
                                ${formatMoney(
                                    user.amount
                                )}
                            </td>

                            <td>
                                ${formatDate(
                                    user.startDate
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${formatDate(
                                        user.expiryDate
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${
                                    days >= 0
                                    ? days + " Days"
                                    : Math.abs(days) +
                                      " Days Ago"
                                }
                            </td>

                            <td>
                                ${statusBadge(
                                    status
                                )}
                            </td>

                            <td>
                                <div class="table-actions">

                                    <button
                                        class="action-btn view"
                                        onclick="viewCustomer('${user.id}')"
                                        title="View"
                                    >
                                        <i class="fas fa-eye"></i>
                                    </button>

                                    <button
                                        class="action-btn edit"
                                        onclick="editCustomer('${user.id}')"
                                        title="Edit"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>

                                    <button
                                        class="action-btn whatsapp"
                                        onclick="sendCustomerWhatsApp('${user.id}')"
                                        title="WhatsApp"
                                    >
                                        <i class="fab fa-whatsapp"></i>
                                    </button>

                                    <button
                                        class="action-btn delete"
                                        onclick="deleteCustomer('${user.id}')"
                                        title="Delete"
                                    >
                                        <i class="fas fa-trash"></i>
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
   VIEW CUSTOMER
========================================================= */

function viewCustomer(
    id
) {

    const user =
        users.find(
            item =>
                item.id === id
        );

    if (!user) {
        return;
    }

    const status =
        getCustomerStatus(
            user
        );

    const days =
        calculateDaysLeft(
            user.expiryDate
        );

    const message =

        `Customer Details\n\n` +

        `Name: ${user.name}\n` +

        `Phone: ${user.phone}\n` +

        `Username: ${
            user.username || "-"
        }\n` +

        `Password: ${
            user.password || "-"
        }\n` +

        `Plan: ${user.plan}\n` +

        `Amount: ${
            formatMoney(
                user.amount
            )
        }\n` +

        `Start: ${
            formatDate(
                user.startDate
            )
        }\n` +

        `Expiry: ${
            formatDate(
                user.expiryDate
            )
        }\n` +

        `Days Left: ${days}\n` +

        `Status: ${status}`;

    alert(message);
}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomer(
    id
) {

    const user =
        users.find(
            item =>
                item.id === id
        );

    if (!user) {
        return;
    }

    const confirmDelete =
        confirm(
            `Delete customer "${user.name}"?`
        );

    if (!confirmDelete) {
        return;
    }

    users =
        users.filter(
            item =>
                item.id !== id
        );

    payments =
        payments.filter(
            payment =>
                payment.customerId !== id
        );

    saveData(
        STORAGE.USERS,
        users
    );

    saveData(
        STORAGE.PAYMENTS,
        payments
    );

    showToast(
        "Customer deleted"
    );

    renderAll();
}


/* =========================================================
   EDIT CUSTOMER
========================================================= */

function editCustomer(
    id
) {

    const user =
        users.find(
            item =>
                item.id === id
        );

    if (!user) {
        return;
    }

    const el =
        getCustomerFormElements();

    if (el.name)
        el.name.value =
            user.name || "";

    if (el.phone)
        el.phone.value =
            user.phone || "";

    if (el.username)
        el.username.value =
            user.username || "";

    if (el.password)
        el.password.value =
            user.password || "";

    if (el.portalUrl)
        el.portalUrl.value =
            user.portalUrl || "";

    if (el.plan)
        el.plan.value =
            user.plan || "";

    if (el.startDate)
        el.startDate.value =
            user.startDate || "";

    if (el.expiryDate)
        el.expiryDate.value =
            user.expiryDate || "";

    if (el.amount)
        el.amount.value =
            user.amount || "";

    showPage(
        "addCustomer"
    );

    showToast(
        "Customer loaded for editing"
    );

    /* Replace submit behavior */

    const form =
        $("#customerForm");

    if (!form) {
        return;
    }

    form.onsubmit =
        function(event) {

            event.preventDefault();

            user.name =
                el.name.value.trim();

            user.phone =
                el.phone.value.trim();

            user.username =
                el.username.value.trim();

            user.password =
                el.password.value.trim();

            user.portalUrl =
                el.portalUrl.value.trim();

            user.plan =
                el.plan.value;

            user.startDate =
                el.startDate.value;

            user.expiryDate =
                el.expiryDate.value ||
                calculateExpiryDate(
                    user.startDate,
                    user.plan
                );

            user.amount =
                Number(
                    el.amount.value
                ) ||
                settings.plans[
                    user.plan
                ] ||
                0;

            user.updatedAt =
                new Date().toISOString();

            saveData(
                STORAGE.USERS,
                users
            );

            showToast(
                "Customer updated successfully"
            );

            form.onsubmit = null;

            resetCustomerForm();

            renderAll();

            showPage(
                "customers"
            );
        };
}


/* =========================================================
   SEARCH CUSTOMER
========================================================= */

function initCustomerSearch() {

    const searchInputs = [
        "#customerSearch",
        "#userSearch",
        ".customer-search"
    ];

    searchInputs.forEach(
        selector => {

            $$(selector)
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        () => {

                            renderCustomers(
                                input.value
                            );
                        }
                    );
                }
            );
        }
    );
}


/* =========================================================
   RENDER PAYMENTS
========================================================= */

function renderPayments() {

    const body =
        $("#paymentsTableBody") ||
        document.querySelector(
            "#paymentsTable tbody"
        );

    if (!body) {
        return;
    }

    if (!payments.length) {

        body.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty-table">
                    No payments found
                </td>
            </tr>
        `;

        return;
    }

    body.innerHTML =
        payments
            .slice()
            .reverse()
            .map(
                payment => {

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
                                <strong>
                                    ${formatMoney(
                                        payment.amount
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${formatDate(
                                    payment.paymentDate
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    payment.paymentStatus ||
                                    "PAID"
                                )}
                            </td>

                            <td>
                                <button
                                    class="action-btn view"
                                    onclick="openInvoice('${payment.customerId}')"
                                >
                                    <i class="fas fa-file-invoice"></i>
                                </button>
                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   INVOICE
========================================================= */

function openInvoice(
    customerId
) {

    const user =
        users.find(
            item =>
                item.id === customerId
        );

    if (!user) {

        showToast(
            "Customer not found",
            "error"
        );

        return;
    }

    const invoiceNumber =
        "INV-" +
        Date.now()
            .toString()
            .slice(-8);

    const preview =
        $("#invoicePreview");

    if (!preview) {

        alert(
            `Invoice\n\n` +
            `Customer: ${user.name}\n` +
            `Plan: ${user.plan}\n` +
            `Amount: ${formatMoney(
                user.amount
            )}`
        );

        return;
    }

    preview.innerHTML = `

        <div class="invoice-header">

            <div>

                <h1>
                    ${escapeHTML(
                        settings.businessName
                    )}
                </h1>

                <p>
                    IPTV Subscription Service
                </p>

                <p>
                    UPI:
                    ${escapeHTML(
                        settings.upiId
                    )}
                </p>

            </div>

            <div class="invoice-meta">

                <h2>
                    INVOICE
                </h2>

                <p>
                    Invoice No:
                    <strong>
                        ${invoiceNumber}
                    </strong>
                </p>

                <p>
                    Date:
                    ${formatDate(
                        todayISO()
                    )}
                </p>

            </div>

        </div>


        <div class="invoice-customer">

            <h3>
                BILL TO
            </h3>

            <p>
                <strong>
                    ${escapeHTML(
                        user.name
                    )}
                </strong>
            </p>

            <p>
                Phone:
                ${escapeHTML(
                    user.phone
                )}
            </p>

            <p>
                Username:
                ${escapeHTML(
                    user.username ||
                    "-"
                )}
            </p>

        </div>


        <table class="invoice-table">

            <thead>

                <tr>

                    <th>
                        Description
                    </th>

                    <th>
                        Start Date
                    </th>

                    <th>
                        Expiry Date
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
                            user.plan
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            user.startDate
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            user.expiryDate
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            user.amount
                        )}
                    </td>

                </tr>

            </tbody>

        </table>


        <div class="invoice-total-area">

            <div>

                <span>
                    Subtotal
                </span>

                <strong>
                    ${formatMoney(
                        user.amount
                    )}
                </strong>

            </div>

            <div class="invoice-grand-total">

                <span>
                    Total
                </span>

                <strong>
                    ${formatMoney(
                        user.amount
                    )}
                </strong>

            </div>

        </div>


        <div class="invoice-payment-info">

            Payment Status:
            <strong>
                ${escapeHTML(
                    user.paymentStatus ||
                    "PAID"
                )}
            </strong>

            <br><br>

            Thank you for choosing
            ${escapeHTML(
                settings.businessName
            )}.

        </div>
    `;

    const modal =
        $("#invoiceModal");

    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


function initModals() {

    $$(".modal-close")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const modal =
                            button.closest(
                                ".modal"
                            );

                        if (modal) {

                            modal.classList.remove(
                                "active"
                            );
                        }
                    }
                );
            }
        );

    $$(".modal-backdrop")
        .forEach(
            backdrop => {

                backdrop.addEventListener(
                    "click",
                    () => {

                        const modal =
                            backdrop.closest(
                                ".modal"
                            );

                        if (modal) {

                            modal.classList.remove(
                                "active"
                            );
                        }
                    }
                );
            }
        );
}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
    user
) {

    return `Hello ${user.name},

Thank you for choosing ${settings.businessName}.

Your IPTV Subscription Details:

Name: ${user.name}
Username: ${user.username || "-"}
Password: ${user.password || "-"}
Plan: ${user.plan}
Amount: ${formatMoney(user.amount)}

Start Date: ${formatDate(user.startDate)}
Expiry Date: ${formatDate(user.expiryDate)}

Portal URL:
${user.portalUrl || settings.portalUrl || "-"}

Payment Status:
${user.paymentStatus || "PAID"}

UPI ID:
${settings.upiId}

Thank you for using ${settings.businessName}.`;
}


function sendCustomerWhatsApp(
    id
) {

    const user =
        users.find(
            item =>
                item.id === id
        );

    if (!user) {
        return;
    }

    const message =
        createWhatsAppMessage(
            user
        );

    const phone =
        String(
            user.phone || ""
        )
        .replace(
            /\D/g,
            ""
        );

    const url =
        phone
            ? `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`
            : `https://wa.me/?text=${encodeURIComponent(
                message
            )}`;

    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

function updateDashboard() {

    const total =
        users.length;

    let active = 0;

    let expired = 0;

    let expiring = 0;

    let suspended = 0;

    users.forEach(
        user => {

            const status =
                getCustomerStatus(
                    user
                );

            if (
                status ===
                "Active"
            ) {
                active++;
            }

            if (
                status ===
                "Expired"
            ) {
                expired++;
            }

            if (
                status ===
                "Expiring"
            ) {
                expiring++;
            }

            if (
                status ===
                "Suspended"
            ) {
                suspended++;
            }
        }
    );

    const revenue =
        payments
            .filter(
                payment =>
                    payment.paymentStatus ===
                    "PAID"
            )
            .reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount
                    ),
                0
            );

    updateNumber(
        [
            "#totalUsers",
            "#totalCustomers"
        ],
        total
    );

    updateNumber(
        "#activeUsers",
        active
    );

    updateNumber(
        "#expiredUsers",
        expired
    );

    updateNumber(
        "#expiringUsers",
        expiring
    );

    updateNumber(
        "#suspendedUsers",
        suspended
    );

    updateText(
        "#totalRevenue",
        formatMoney(
            revenue
        )
    );

    updateText(
        "#totalPayments",
        payments.length
    );
}


function updateNumber(
    selectors,
    value
) {

    if (
        !Array.isArray(
            selectors
        )
    ) {
        selectors =
            [selectors];
    }

    selectors.forEach(
        selector => {

            const element =
                $(selector);

            if (element) {

                element.textContent =
                    value;
            }
        }
    );
}


function updateText(
    selector,
    value
) {

    const element =
        $(selector);

    if (element) {

        element.textContent =
            value;
    }
}


/* =========================================================
   RECENT CUSTOMERS
========================================================= */

function renderRecentCustomers() {

    const body =
        $("#recentCustomersTableBody") ||
        document.querySelector(
            "#recentCustomersTable tbody"
        );

    if (!body) {
        return;
    }

    const recent =
        users
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            )
            .slice(
                0,
                5
            );

    if (!recent.length) {

        body.innerHTML = `
            <tr>
                <td colspan="5"
                    class="empty-table">
                    No Users Yet
                </td>
            </tr>
        `;

        return;
    }

    body.innerHTML =
        recent
            .map(
                user => {

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
                                ${statusBadge(
                                    getCustomerStatus(
                                        user
                                    )
                                )}
                            </td>

                            <td>
                                ${formatDate(
                                    user.expiryDate
                                )}
                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   SETTINGS
========================================================= */

function loadSettingsForm() {

    const businessName =
        $("#businessName");

    const upiId =
        $("#upiId");

    const contact =
        $("#contact");

    const portalUrl =
        $("#defaultPortalUrl") ||
        $("#settingsPortalUrl");

    if (businessName) {

        businessName.value =
            settings.businessName;
    }

    if (upiId) {

        upiId.value =
            settings.upiId;
    }

    if (contact) {

        contact.value =
            settings.contact;
    }

    if (portalUrl) {

        portalUrl.value =
            settings.portalUrl;
    }
}


function saveSettings() {

    const businessName =
        $("#businessName");

    const upiId =
        $("#upiId");

    const contact =
        $("#contact");

    const portalUrl =
        $("#defaultPortalUrl") ||
        $("#settingsPortalUrl");

    if (businessName) {

        settings.businessName =
            businessName.value.trim();
    }

    if (upiId) {

        settings.upiId =
            upiId.value.trim();
    }

    if (contact) {

        settings.contact =
            contact.value.trim();
    }

    if (portalUrl) {

        settings.portalUrl =
            portalUrl.value.trim();
    }

    saveData(
        STORAGE.SETTINGS,
        settings
    );

    populatePlanSelects();

    showToast(
        "Settings saved successfully"
    );

    renderAll();
}


/* =========================================================
   BACKUP EXPORT
========================================================= */

function exportBackup() {

    const backup = {

        version: 1,

        exportedAt:
            new Date().toISOString(),

        settings,

        users,

        payments
    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href =
        url;

    a.download =
        `SUPER-IPTV-Backup-${todayISO()}.json`;

    document.body.appendChild(
        a
    );

    a.click();

    a.remove();

    URL.revokeObjectURL(
        url
    );

    showToast(
        "Backup exported successfully"
    );
}


/* =========================================================
   BACKUP IMPORT
========================================================= */

function importBackupFile(
    file
) {

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            try {

                const backup =
                    JSON.parse(
                        event.target.result
                    );

                if (
                    !backup ||
                    !Array.isArray(
                        backup.users
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );
                }

                const confirmed =
                    confirm(
                        "Import this backup? Existing panel data will be replaced."
                    );

                if (!confirmed) {
                    return;
                }

                users =
                    backup.users || [];

                payments =
                    backup.payments || [];

                settings = {

                    ...DEFAULT_SETTINGS,

                    ...(backup.settings || {}),

                    plans: {

                        ...DEFAULT_SETTINGS.plans,

                        ...(
                            backup.settings &&
                            backup.settings.plans
                                ? backup.settings.plans
                                : {}
                        )
                    }
                };

                saveData(
                    STORAGE.USERS,
                    users
                );

                saveData(
                    STORAGE.PAYMENTS,
                    payments
                );

                saveData(
                    STORAGE.SETTINGS,
                    settings
                );

                populatePlanSelects();

                loadSettingsForm();

                renderAll();

                showToast(
                    "Backup imported successfully"
                );

            } catch (error) {

                console.error(
                    error
                );

                showToast(
                    "Invalid backup file",
                    "error"
                );
            }
        };

    reader.readAsText(
        file
    );
}


/* =========================================================
   BACKUP EVENTS
========================================================= */

function initBackup() {

    const exportButtons = [
        "#exportBackup",
        "#exportBackupBtn"
    ];

    exportButtons.forEach(
        selector => {

            $$(selector)
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            exportBackup
                        );
                    }
                );
        }
    );

    const importInput =
        $("#importBackupFile");

    if (importInput) {

        importInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                importBackupFile(
                    file
                );

                event.target.value =
                    "";
            }
        );
    }

    const importButtons = [
        "#importBackup",
        "#importBackupBtn"
    ];

    importButtons.forEach(
        selector => {

            $$(selector)
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                if (
                                    importInput
                                ) {

                                    importInput.click();
                                }
                            }
                        );
                    }
                );
        }
    );
}


/* =========================================================
   QR COPY UPI
========================================================= */

function copyUPI() {

    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(
                settings.upiId
            )
            .then(
                () => {

                    showToast(
                        "UPI ID copied"
                    );
                }
            );

    } else {

        showToast(
            settings.upiId
        );
    }
}


/* =========================================================
   QR DOWNLOAD
========================================================= */

function downloadQR(
    elementId = "customerQRCode"
) {

    const container =
        document.getElementById(
            elementId
        );

    if (!container) {
        return;
    }

    const img =
        container.querySelector(
            "img"
        );

    if (!img) {

        showToast(
            "Generate QR first",
            "warning"
        );

        return;
    }

    const a =
        document.createElement(
            "a"
        );

    a.href =
        img.src;

    a.download =
        `SUPER-IPTV-QR-${Date.now()}.png`;

    document.body.appendChild(
        a
    );

    a.click();

    a.remove();
}


/* =========================================================
   GLOBAL CLICK EVENTS
========================================================= */

function initGlobalEvents() {

    document.addEventListener(
        "click",
        function(event) {

            const target =
                event.target.closest(
                    "[data-page]"
                );

            if (
                target &&
                target.classList.contains(
                    "nav-item"
                )
            ) {
                return;
            }

            const copyButton =
                event.target.closest(
                    ".copy-upi-btn"
                );

            if (copyButton) {

                copyUPI();

                return;
            }

            const generateButton =
                event.target.closest(
                    ".generate-qr-btn"
                );

            if (generateButton) {

                generateDashboardQR();

                return;
            }

            const downloadButton =
                event.target.closest(
                    ".download-qr-btn"
                );

            if (downloadButton) {

                downloadQR(
                    downloadButton.dataset.qr ||
                    "customerQRCode"
                );

                return;
            }

            const printButton =
                event.target.closest(
                    ".print-invoice-btn"
                );

            if (printButton) {

                window.print();

                return;
            }

            const closeButton =
                event.target.closest(
                    ".close-modal-btn"
                );

            if (closeButton) {

                closeModal(
                    closeButton.dataset.modal
                );
            }
        }
    );
}


/* =========================================================
   AUTO UPDATE EXPIRY
========================================================= */

function refreshCustomerStatuses() {

    users.forEach(
        user => {

            user.status =
                getCustomerStatus(
                    user
                );
        }
    );

    saveData(
        STORAGE.USERS,
        users
    );
}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    refreshCustomerStatuses();

    renderCustomers();

    renderPayments();

    renderRecentCustomers();

    updateDashboard();

    generateDashboardQR();
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initNavigation();

        initMobileMenu();

        initSidebarCollapse();

        initCustomerFormEvents();

        initCustomerSearch();

        initModals();

        initBackup();

        initGlobalEvents();

        populatePlanSelects();

        loadSettingsForm();

        renderAll();

        const el =
            getCustomerFormElements();

        if (
            el.startDate &&
            !el.startDate.value
        ) {

            el.startDate.value =
                todayISO();
        }

        updateCustomerForm();

        console.log(
            "SUPER IPTV Panel Loaded Successfully"
        );
    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   Required for inline onclick=""
========================================================= */

window.viewCustomer =
    viewCustomer;

window.editCustomer =
    editCustomer;

window.deleteCustomer =
    deleteCustomer;

window.openInvoice =
    openInvoice;

window.sendCustomerWhatsApp =
    sendCustomerWhatsApp;

window.exportBackup =
    exportBackup;

window.importBackupFile =
    importBackupFile;

window.downloadQR =
    downloadQR;

window.copyUPI =
    copyUPI;

window.showPage =
    showPage;

window.closeModal =
    closeModal;

window.saveSettings =
    saveSettings;

window.generateDashboardQR =
    generateDashboardQR;