/* =========================================================
   SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
   FINAL SCRIPT.JS
   ========================================================= */

"use strict";

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
        price: 200
    },
    {
        id: "plan_3",
        name: "3 Months",
        duration: 3,
        price: 600
    },
    {
        id: "plan_6",
        name: "6 Months",
        duration: 6,
        price: 1150
    },
    {
        id: "plan_12",
        name: "12 Months",
        duration: 12,
        price: 2000
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
    taxEnabled: false,
    taxRate: 18,

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
   GLOBAL DATA
========================================================= */

let customers = loadData(STORAGE.customers, []);
let payments = loadData(STORAGE.payments, []);
let invoices = loadData(STORAGE.invoices, []);
let plans = loadData(STORAGE.plans, DEFAULT_PLANS);
let settings = {
    ...DEFAULT_SETTINGS,
    ...loadData(STORAGE.settings, {})
};

let notifications = loadData(STORAGE.notifications, []);

let currentCustomerId = null;
let currentRenewCustomerId = null;

let revenueChart = null;
let customerChart = null;
let reportRevenueChart = null;
let planChart = null;


/* =========================================================
   BASIC HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function loadData(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Storage load error:", error);

        return fallback;
    }
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function generateId(prefix = "ID") {

    return prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8);
}


function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString("en-IN");
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function todayISO() {

    const d = new Date();

    const year = d.getFullYear();

    const month =
        String(d.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(d.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString + "T00:00:00");

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function daysBetween(date1, date2) {

    const a =
        new Date(date1 + "T00:00:00");

    const b =
        new Date(date2 + "T00:00:00");

    return Math.ceil(
        (b - a) /
        (1000 * 60 * 60 * 24)
    );
}


function getPlan(planName) {

    return plans.find(
        p => p.name === planName
    ) || DEFAULT_PLANS.find(
        p => p.name === planName
    );
}


function getPlanPrice(planName) {

    const plan = getPlan(planName);

    return plan ? Number(plan.price) : 0;
}


function getPlanDuration(planName) {

    const plan = getPlan(planName);

    return plan ? Number(plan.duration) : 1;
}


/* =========================================================
   EXPIRY DATE CALCULATION
========================================================= */

function calculateExpiry(startDate, planName) {

    if (!startDate || !planName) {
        return "";
    }

    const duration =
        getPlanDuration(planName);

    const date =
        new Date(startDate + "T00:00:00");

    date.setMonth(
        date.getMonth() + duration
    );

    date.setDate(
        date.getDate() - 1
    );

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   CUSTOMER STATUS
========================================================= */

function getCustomerStatus(customer) {

    if (customer.status === "Suspended") {
        return "Suspended";
    }

    if (!customer.expiryDate) {
        return customer.status || "Active";
    }

    const today = todayISO();

    if (customer.expiryDate < today) {
        return "Expired";
    }

    return "Active";
}


function statusBadge(status) {

    const safeStatus =
        escapeHTML(status);

    return `
        <span class="status-badge ${status.toLowerCase()}">
            ${safeStatus}
        </span>
    `;
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast = $("toast");
    const toastMessage = $("toastMessage");

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* =========================================================
   LOADING
========================================================= */

function showLoading(show = true) {

    const overlay =
        $("loadingOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.toggle(
        "show",
        show
    );
}


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const page =
        $(pageId);

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


    if (titles[pageId]) {

        if ($("pageTitle")) {

            $("pageTitle").textContent =
                titles[pageId][0];

        }

        if ($("pageSubtitle")) {

            $("pageSubtitle").textContent =
                titles[pageId][1];

        }

    }


    const sidebar =
        $("sidebar");

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }


    refreshPageData();
}


function refreshPageData() {

    updateDashboard();

    renderCustomers();

    renderSubscriptions();

    renderPayments();

    renderInvoices();

    renderNotifications();

    renderPlans();

    updateReports();

    updateSubscriptionStats();

    updatePaymentStats();

    updateNotificationCount();

    updateCharts();

}


/* =========================================================
   NAVIGATION EVENTS
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const navItem =
            event.target.closest(
                ".nav-item"
            );

        if (navItem) {

            showPage(
                navItem.dataset.page
            );

            return;
        }


        const pageLink =
            event.target.closest(
                "[data-page-link]"
            );

        if (pageLink) {

            showPage(
                pageLink.dataset.pageLink
            );

            return;
        }


        const closeButton =
            event.target.closest(
                "[data-close-modal]"
            );

        if (closeButton) {

            closeAllModals();

        }

    }
);


/* =========================================================
   SIDEBAR MOBILE
========================================================= */

$("menuToggle")?.addEventListener(
    "click",
    () => {

        $("sidebar")
            ?.classList.toggle(
                "mobile-open"
            );

    }
);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            STORAGE.theme
        );

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    }

}


$("themeToggle")?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        localStorage.setItem(
            STORAGE.theme,
            isDark ? "dark" : "light"
        );

    }
);


/* =========================================================
   ADD CUSTOMER FORM
========================================================= */

$("startDate")?.addEventListener(
    "change",
    updateNewCustomerCalculation
);


$("plan")?.addEventListener(
    "change",
    updateNewCustomerCalculation
);


function updateNewCustomerCalculation() {

    const planName =
        $("plan")?.value;

    const startDate =
        $("startDate")?.value;

    const amount =
        getPlanPrice(planName);

    if ($("amount")) {

        $("amount").value =
            amount || "";

    }


    if ($("expiryDate")) {

        $("expiryDate").value =
            calculateExpiry(
                startDate,
                planName
            );

    }


    updateQR();
}


/* =========================================================
   QR CODE GENERATOR
========================================================= */

function updateQR() {

    const qrContainer =
        $("qrcode");

    const planName =
        $("plan")?.value;

    const amount =
        Number(
            $("amount")?.value || 0
        );

    const customerName =
        $("name")?.value ||
        "Customer";


    if (!qrContainer) {
        return;
    }


    if (!planName || !amount) {

        qrContainer.innerHTML = `

            <div class="qr-placeholder">

                <span>▣</span>

                <p>
                    Select a plan
                </p>

                <small>
                    QR code will appear here
                </small>

            </div>

        `;

        if ($("qrPlan")) {

            $("qrPlan").textContent =
                "-";

        }

        if ($("qrAmount")) {

            $("qrAmount").textContent =
                "₹0";

        }

        return;
    }


    const upiId =
        settings.upiId ||
        "6289033804@ptsbi";

    const upiName =
        settings.upiName ||
        settings.companyName ||
        "SUPER IPTV";


    if ($("qrPlan")) {

        $("qrPlan").textContent =
            planName;

    }


    if ($("qrAmount")) {

        $("qrAmount").textContent =
            formatCurrency(amount);

    }


    /*
       IMPORTANT:
       This creates a valid UPI payment URI.
    */

    const upiUrl =
        `upi://pay?pa=${encodeURIComponent(upiId)}` +
        `&pn=${encodeURIComponent(upiName)}` +
        `&am=${encodeURIComponent(amount)}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(
            `${settings.companyName} - ${customerName} - ${planName}`
        )}`;


    qrContainer.innerHTML = `

        <div class="qr-payment-box">

            <div class="qr-upi-header">

                <strong>
                    ${escapeHTML(upiName)}
                </strong>

                <span>
                    Scan & Pay
                </span>

            </div>


            <div
                id="generatedQRCode"
                class="generated-qr"
            >
            </div>


            <div class="qr-payment-details">

                <strong>
                    ${escapeHTML(customerName)}
                </strong>

                <span>
                    ${escapeHTML(planName)}
                </span>

                <b>
                    ${formatCurrency(amount)}
                </b>

            </div>

        </div>

    `;


    if (
        typeof QRCode !==
        "undefined"
    ) {

        new QRCode(
            $("generatedQRCode"),
            {
                text: upiUrl,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );

    } else {

        qrContainer.innerHTML += `

            <p class="qr-error">
                QR Library not loaded.
                Please check your internet connection.
            </p>

        `;

    }

}


$("name")?.addEventListener(
    "input",
    updateQR
);


/* =========================================================
   COPY UPI
========================================================= */

$("copyUpi")?.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                settings.upiId
            );

            showToast(
                "UPI ID copied successfully"
            );

        } catch {

            showToast(
                "Unable to copy UPI ID"
            );

        }

    }
);


/* =========================================================
   DOWNLOAD QR
========================================================= */

$("downloadQR")?.addEventListener(
    "click",
    () => {

        const canvas =
            document.querySelector(
                "#generatedQRCode canvas"
            );

        const image =
            document.querySelector(
                "#generatedQRCode img"
            );


        let url = "";


        if (canvas) {

            url =
                canvas.toDataURL(
                    "image/png"
                );

        } else if (image) {

            url =
                image.src;

        }


        if (!url) {

            showToast(
                "Please generate QR first"
            );

            return;
        }


        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `UPI-QR-${Date.now()}.png`;

        link.click();


        showToast(
            "QR code downloaded"
        );

    }
);


/* =========================================================
   SAVE CUSTOMER
========================================================= */

$("customerForm")?.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            $("name").value.trim();

        const phone =
            $("phone").value.trim();

        const username =
            $("username").value.trim();

        const password =
            $("password").value.trim();

        const portalUrl =
            $("portalUrl").value.trim();

        const plan =
            $("plan").value;

        const amount =
            Number(
                $("amount").value || 0
            );

        const startDate =
            $("startDate").value;

        const expiryDate =
            $("expiryDate").value;

        const status =
            $("status").value;


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

        saveData(
            STORAGE.customers,
            customers
        );


        /* Payment */

        const payment = {

            id:
                generateId("PAY"),

            paymentId:
                "PAY-" +
                Date.now(),

            customerId:
                customer.id,

            customerName:
                name,

            plan,

            amount,

            date:
                startDate,

            method:
                "UPI",

            status:
                "Pending"

        };


        payments.unshift(
            payment
        );

        saveData(
            STORAGE.payments,
            payments
        );


        /* Invoice */

        createInvoice(
            customer,
            payment
        );


        addNotification({

            type: "customer",

            title:
                "New Customer Added",

            message:
                `${name} was added successfully.`

        });


        showToast(
            "Customer added successfully"
        );


        $("customerForm").reset();


        $("startDate").value =
            todayISO();


        $("plan").value =
            "";


        $("amount").value =
            "";


        $("expiryDate").value =
            "";


        updateQR();

        refreshPageData();

        showPage(
            "customers"
        );

    }
);


/* =========================================================
   CUSTOMER TABLE
========================================================= */

function renderCustomers() {

    const table =
        $("customersTable");

    if (!table) {
        return;
    }


    const search =
        (
            $("customerSearch")?.value ||
            ""
        ).toLowerCase().trim();


    const statusFilter =
        $("customerStatusFilter")?.value ||
        "all";


    const planFilter =
        $("customerPlanFilter")?.value ||
        "all";


    const filtered =
        customers.filter(
            customer => {

                const status =
                    getCustomerStatus(
                        customer
                    );


                const matchesSearch =

                    !search ||

                    customer.name
                        .toLowerCase()
                        .includes(search) ||

                    customer.phone
                        .toLowerCase()
                        .includes(search) ||

                    customer.username
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    statusFilter === "all" ||

                    status ===
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
        filtered.map(
            customer => {

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

                            ${formatCurrency(
                                customer.amount
                            )}

                        </td>


                        <td>

                            ${formatDate(
                                customer.expiryDate
                            )}

                        </td>


                        <td>

                            ${statusBadge(
                                status
                            )}

                        </td>


                        <td>

                            <div class="action-buttons">

                                <button
                                    class="action-btn view"
                                    onclick="viewCustomer('${customer.id}')"
                                >
                                    👁️
                                </button>

                                <button
                                    class="action-btn edit"
                                    onclick="editCustomer('${customer.id}')"
                                >
                                    ✏️
                                </button>

                                <button
                                    class="action-btn renew"
                                    onclick="openRenewModal('${customer.id}')"
                                >
                                    🔄
                                </button>

                                <button
                                    class="action-btn delete"
                                    onclick="deleteCustomer('${customer.id}')"
                                >
                                    🗑️
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   CUSTOMER SEARCH
========================================================= */

$("customerSearch")?.addEventListener(
    "input",
    renderCustomers
);


$("customerStatusFilter")?.addEventListener(
    "change",
    renderCustomers
);


$("customerPlanFilter")?.addEventListener(
    "change",
    renderCustomers
);


$("refreshCustomers")?.addEventListener(
    "click",
    () => {

        renderCustomers();

        showToast(
            "Customer list refreshed"
        );

    }
);


/* =========================================================
   GLOBAL SEARCH
========================================================= */

$("globalSearch")?.addEventListener(
    "input",
    function () {

        const value =
            this.value.trim();

        if (value.length > 0) {

            showPage(
                "customers"
            );

            if ($("customerSearch")) {

                $("customerSearch").value =
                    value;

            }

            renderCustomers();

        }

    }
);


/* =========================================================
   VIEW CUSTOMER
========================================================= */

window.viewCustomer =
function (id) {

    const customer =
        customers.find(
            c => c.id === id
        );

    if (!customer) {
        return;
    }


    currentCustomerId =
        id;


    const status =
        getCustomerStatus(
            customer
        );


    const details =
        $("customerDetails");


    details.innerHTML = `

        <div class="detail-grid">

            <div>
                <span>Customer Name</span>
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
                    ${formatCurrency(
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
                    ${statusBadge(
                        status
                    )}
                </strong>
            </div>

            <div>
                <span>Portal URL</span>
                <strong>
                    ${
                        customer.portalUrl
                        ? `<a
                            href="${escapeHTML(
                                customer.portalUrl
                            )}"
                            target="_blank"
                           >
                            Open Portal
                           </a>`
                        : "-"
                    }
                </strong>
            </div>

        </div>

    `;


    openModal(
        "customerModal"
    );

};


/* =========================================================
   EDIT CUSTOMER
========================================================= */

window.editCustomer =
function (id) {

    const customer =
        customers.find(
            c => c.id === id
        );

    if (!customer) {
        return;
    }


    $("editId").value =
        customer.id;

    $("editName").value =
        customer.name;

    $("editPhone").value =
        customer.phone;

    $("editUsername").value =
        customer.username;

    $("editPassword").value =
        customer.password;

    $("editPortalUrl").value =
        customer.portalUrl || "";

    $("editPlan").value =
        customer.plan;

    $("editAmount").value =
        customer.amount;

    $("editStartDate").value =
        customer.startDate;

    $("editExpiryDate").value =
        customer.expiryDate;

    $("editStatus").value =
        customer.status;


    openModal(
        "editCustomerModal"
    );

};


/* =========================================================
   UPDATE CUSTOMER
========================================================= */

$("editCustomerForm")?.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const id =
            $("editId").value;


        const index =
            customers.findIndex(
                c => c.id === id
            );


        if (index === -1) {
            return;
        }


        const plan =
            $("editPlan").value;


        customers[index] = {

            ...customers[index],

            name:
                $("editName").value.trim(),

            phone:
                $("editPhone").value.trim(),

            username:
                $("editUsername").value.trim(),

            password:
                $("editPassword").value.trim(),

            portalUrl:
                $("editPortalUrl").value.trim(),

            plan,

            amount:
                Number(
                    $("editAmount").value ||
                    getPlanPrice(plan)
                ),

            startDate:
                $("editStartDate").value,

            expiryDate:
                $("editExpiryDate").value ||
                calculateExpiry(
                    $("editStartDate").value,
                    plan
                ),

            status:
                $("editStatus").value

        };


        saveData(
            STORAGE.customers,
            customers
        );


        closeAllModals();

        refreshPageData();

        showToast(
            "Customer updated successfully"
        );

    }
);


/* =========================================================
   DELETE CUSTOMER
========================================================= */

window.deleteCustomer =
function (id) {

    const customer =
        customers.find(
            c => c.id === id
        );


    if (!customer) {
        return;
    }


    if (
        !confirm(
            `Delete ${customer.name}?`
        )
    ) {
        return;
    }


    customers =
        customers.filter(
            c => c.id !== id
        );


    saveData(
        STORAGE.customers,
        customers
    );


    showToast(
        "Customer deleted"
    );


    refreshPageData();

};


/* =========================================================
   SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

    const table =
        $("subscriptionsTable");

    if (!table) {
        return;
    }


    if (!customers.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    No subscriptions found.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =
        customers.map(
            customer => {

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
                            ${statusBadge(
                                status
                            )}
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
        ).join("");

}


function updateSubscriptionStats() {

    const active =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Expired"
        ).length;


    const expiring =
        customers.filter(
            c => {

                if (
                    getCustomerStatus(c) !==
                    "Active"
                ) {
                    return false;
                }

                const days =
                    daysBetween(
                        todayISO(),
                        c.expiryDate
                    );

                return (
                    days >= 0 &&
                    days <= 7
                );

            }
        ).length;


    if ($("subscriptionActive")) {

        $("subscriptionActive").textContent =
            active;

    }


    if ($("subscriptionExpired")) {

        $("subscriptionExpired").textContent =
            expired;

    }


    if ($("subscriptionExpiring")) {

        $("subscriptionExpiring").textContent =
            expiring;

    }

}


/* =========================================================
   RENEW MODAL
========================================================= */

window.openRenewModal =
function (id) {

    const customer =
        customers.find(
            c => c.id === id
        );

    if (!customer) {
        return;
    }


    currentRenewCustomerId =
        id;


    $("renewPlan").value =
        customer.plan;


    updateRenewCalculation();


    openModal(
        "renewModal"
    );

};


$("renewPlan")?.addEventListener(
    "change",
    updateRenewCalculation
);


function updateRenewCalculation() {

    const customer =
        customers.find(
            c =>
                c.id ===
                currentRenewCustomerId
        );


    if (!customer) {
        return;
    }


    const plan =
        $("renewPlan").value;


    const amount =
        getPlanPrice(plan);


    let baseDate =
        customer.expiryDate;


    if (
        !baseDate ||
        baseDate < todayISO()
    ) {

        baseDate =
            todayISO();

    }


    const newStart =
        baseDate;


    const newExpiry =
        calculateExpiry(
            newStart,
            plan
        );


    if ($("renewExpiry")) {

        $("renewExpiry").textContent =
            formatDate(
                newExpiry
            );

    }


    if ($("renewAmount")) {

        $("renewAmount").textContent =
            formatCurrency(
                amount
            );

    }

}


$("confirmRenew")?.addEventListener(
    "click",
    () => {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    currentRenewCustomerId
            );


        if (!customer) {
            return;
        }


        const plan =
            $("renewPlan").value;


        const amount =
            getPlanPrice(plan);


        let startDate =
            customer.expiryDate;


        if (
            !startDate ||
            startDate < todayISO()
        ) {

            startDate =
                todayISO();

        }


        const expiryDate =
            calculateExpiry(
                startDate,
                plan
            );


        customer.plan =
            plan;

        customer.amount =
            amount;

        customer.startDate =
            startDate;

        customer.expiryDate =
            expiryDate;

        customer.status =
            "Active";


        saveData(
            STORAGE.customers,
            customers
        );


        const payment = {

            id:
                generateId("PAY"),

            paymentId:
                "PAY-" +
                Date.now(),

            customerId:
                customer.id,

            customerName:
                customer.name,

            plan,

            amount,

            date:
                todayISO(),

            method:
                "UPI",

            status:
                "Pending"

        };


        payments.unshift(
            payment
        );


        saveData(
            STORAGE.payments,
            payments
        );


        createInvoice(
            customer,
            payment
        );


        addNotification({

            type: "renewal",

            title:
                "Subscription Renewed",

            message:
                `${customer.name}'s subscription renewed until ${formatDate(expiryDate)}.`

        });


        closeAllModals();


        showToast(
            "Subscription renewed successfully"
        );


        refreshPageData();

    }
);


/* =========================================================
   PAYMENTS
========================================================= */

function renderPayments() {

    const table =
        $("paymentsTable");

    if (!table) {
        return;
    }


    const search =
        (
            $("paymentSearch")?.value ||
            ""
        ).toLowerCase();


    const statusFilter =
        $("paymentStatusFilter")?.value ||
        "all";


    const filtered =
        payments.filter(
            payment => {

                const matchesSearch =

                    !search ||

                    payment.paymentId
                        .toLowerCase()
                        .includes(search) ||

                    payment.customerName
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    statusFilter === "all" ||

                    payment.status ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
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
        filtered.map(
            payment => `

                <tr>

                    <td>
                        ${escapeHTML(
                            payment.paymentId
                        )}
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
                        ${formatCurrency(
                            payment.amount
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            payment.date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.method
                        )}
                    </td>

                    <td>

                        <select
                            onchange="updatePaymentStatus('${payment.id}', this.value)"
                        >

                            <option
                                value="Pending"
                                ${payment.status === "Pending" ? "selected" : ""}
                            >
                                Pending
                            </option>

                            <option
                                value="Paid"
                                ${payment.status === "Paid" ? "selected" : ""}
                            >
                                Paid
                            </option>

                        </select>

                    </td>

                </tr>

            `
        ).join("");

}


window.updatePaymentStatus =
function (id, status) {

    const payment =
        payments.find(
            p => p.id === id
        );


    if (!payment) {
        return;
    }


    payment.status =
        status;


    saveData(
        STORAGE.payments,
        payments
    );


    showToast(
        "Payment status updated"
    );


    refreshPageData();

};


$("paymentSearch")?.addEventListener(
    "input",
    renderPayments
);


$("paymentStatusFilter")?.addEventListener(
    "change",
    renderPayments
);


/* =========================================================
   INVOICES
========================================================= */

function createInvoice(
    customer,
    payment
) {

    const invoice = {

        id:
            generateId("INV"),

        invoiceNumber:
            "INV-" +
            new Date()
                .getFullYear() +
            "-" +
            String(
                invoices.length + 1
            ).padStart(
                5,
                "0"
            ),

        customerId:
            customer.id,

        customerName:
            customer.name,

        phone:
            customer.phone,

        plan:
            customer.plan,

        amount:
            Number(
                customer.amount || 0
            ),

        taxRate:
            settings.taxEnabled
                ? Number(
                    settings.taxRate || 0
                )
                : 0,

        date:
            payment?.date ||
            todayISO(),

        status:
            payment?.status ||
            "Pending"

    };


    invoice.taxAmount =
        invoice.amount *
        invoice.taxRate /
        100;


    invoice.total =
        invoice.amount +
        invoice.taxAmount;


    invoices.unshift(
        invoice
    );


    saveData(
        STORAGE.invoices,
        invoices
    );

}


function renderInvoices() {

    const table =
        $("invoicesTable");

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
        invoices.map(
            invoice => `

                <tr>

                    <td>
                        ${escapeHTML(
                            invoice.invoiceNumber
                        )}
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
                        ${formatCurrency(
                            invoice.total
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            invoice.date
                        )}
                    </td>

                    <td>
                        ${statusBadge(
                            invoice.status
                        )}
                    </td>

                    <td>

                        <button
                            class="secondary-button"
                            onclick="printInvoice('${invoice.id}')"
                        >
                            🖨️ Print
                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   PROFESSIONAL INVOICE
========================================================= */

window.printInvoice =
function (invoiceId) {

    const invoice =
        invoices.find(
            i => i.id === invoiceId
        );


    if (!invoice) {
        return;
    }


    const invoiceHTML = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Invoice ${escapeHTML(
    invoice.invoiceNumber
)}
</title>

<style>

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 40px;
    color: #222;
}

.invoice {
    max-width: 800px;
    margin: auto;
    border: 1px solid #ddd;
    padding: 40px;
}

.header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #222;
    padding-bottom: 20px;
}

.company h1 {
    margin: 0;
}

.invoice-title {
    text-align: right;
}

.info {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.total {
    text-align: right;
    margin-top: 20px;
}

.total h2 {
    font-size: 24px;
}

.footer {
    margin-top: 50px;
    text-align: center;
    border-top: 1px solid #ddd;
    padding-top: 20px;
}

@media print {

    body {
        padding: 0;
    }

    .invoice {
        border: none;
    }

}

</style>

</head>

<body>

<div class="invoice">

<div class="header">

<div class="company">

<h1>
${escapeHTML(
    settings.companyName
)}
</h1>

<p>
Professional IPTV Service
</p>

${
    settings.businessRegistrationNo
    ? `<p>
        Registration No:
        ${escapeHTML(
            settings.businessRegistrationNo
        )}
       </p>`
    : ""
}

${
    settings.gstNumber
    ? `<p>
        GST No:
        ${escapeHTML(
            settings.gstNumber
        )}
       </p>`
    : ""
}

</div>


<div class="invoice-title">

<h2>
INVOICE
</h2>

<p>
${escapeHTML(
    invoice.invoiceNumber
)}
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

<div>

<strong>
Bill To
</strong>

<p>
${escapeHTML(
    invoice.customerName
)}
</p>

<p>
${escapeHTML(
    invoice.phone
)}
</p>

</div>


<div>

<strong>
Payment Status
</strong>

<p>
${escapeHTML(
    invoice.status
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
IPTV Subscription -
${escapeHTML(
    invoice.plan
)}
</td>

<td>
${formatCurrency(
    invoice.amount
)}
</td>

</tr>

<tr>

<td>
Tax
${invoice.taxRate}%
</td>

<td>
${formatCurrency(
    invoice.taxAmount
)}
</td>

</tr>

</tbody>

</table>


<div class="total">

<p>
Subtotal:
${formatCurrency(
    invoice.amount
)}
</p>

<p>
Tax:
${formatCurrency(
    invoice.taxAmount
)}
</p>

<h2>
Total:
${formatCurrency(
    invoice.total
)}
</h2>

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

window.onload = function() {

    window.print();

};

</script>

</body>

</html>

`;


    const invoiceWindow =
        window.open(
            "",
            "_blank"
        );


    invoiceWindow.document.write(
        invoiceHTML
    );


    invoiceWindow.document.close();

};


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function generateWhatsAppMessage(
    customer
) {

    let message =
        settings.whatsappTemplate ||
        DEFAULT_SETTINGS.whatsappTemplate;


    const replacements = {

        "{{NAME}}":
            customer.name,

        "{{USERNAME}}":
            customer.username,

        "{{PASSWORD}}":
            customer.password,

        "{{PLAN}}":
            customer.plan,

        "{{AMOUNT}}":
            customer.amount,

        "{{EXPIRY}}":
            formatDate(
                customer.expiryDate
            ),

        "{{PORTAL_URL}}":
            customer.portalUrl ||
            settings.defaultPortal,

        "{{UPI_ID}}":
            settings.upiId,

        "{{COMPANY}}":
            settings.companyName

    };


    Object.keys(
        replacements
    ).forEach(
        key => {

            message =
                message.replaceAll(
                    key,
                    replacements[key] ?? ""
                );

        }
    );


    return message;

}


function openWhatsApp(
    customer
) {

    const message =
        generateWhatsAppMessage(
            customer
        );


    const phone =
        String(
            customer.phone || ""
        ).replace(
            /\D/g,
            ""
        );


    const url =
        phone

        ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

        : `https://wa.me/?text=${encodeURIComponent(message)}`;


    window.open(
        url,
        "_blank"
    );

}


$("modalWhatsApp")?.addEventListener(
    "click",
    () => {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    currentCustomerId
            );


        if (customer) {

            openWhatsApp(
                customer
            );

        }

    }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

function addNotification(
    notification
) {

    notifications.unshift({

        id:
            generateId("NOT"),

        ...notification,

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
        $("notificationList");

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
        notifications.map(
            notification => `

                <div class="notification-item ${
                    notification.read
                        ? "read"
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
        ).join("");

}


function updateNotificationCount() {

    const count =
        notifications.filter(
            n => !n.read
        ).length;


    if ($("notificationCount")) {

        $("notificationCount")
            .textContent =
            count;

    }


    if ($("notificationDot")) {

        $("notificationDot")
            .style.display =
            count
                ? "block"
                : "none";

    }

}


$("clearNotifications")?.addEventListener(
    "click",
    () => {

        notifications =
            notifications.map(
                n => ({
                    ...n,
                    read: true
                })
            );


        saveData(
            STORAGE.notifications,
            notifications
        );


        renderNotifications();

        updateNotificationCount();

        showToast(
            "All notifications marked as read"
        );

    }
);


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        customers.length;


    const active =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Expired"
        ).length;


    const expiring =
        customers.filter(
            c => {

                if (
                    getCustomerStatus(c) !==
                    "Active"
                ) {
                    return false;
                }

                const days =
                    daysBetween(
                        todayISO(),
                        c.expiryDate
                    );

                return (
                    days >= 0 &&
                    days <= 7
                );

            }
        );


    const paidPayments =
        payments.filter(
            p =>
                p.status === "Paid"
        );


    const totalRevenue =
        paidPayments.reduce(
            (sum, p) =>
                sum +
                Number(
                    p.amount || 0
                ),
            0
        );


    const currentMonth =
        new Date()
            .toISOString()
            .slice(
                0,
                7
            );


    const monthlyRevenue =
        paidPayments
            .filter(
                p =>
                    p.date &&
                    p.date.startsWith(
                        currentMonth
                    )
            )
            .reduce(
                (sum, p) =>
                    sum +
                    Number(
                        p.amount || 0
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
            c =>
                c.createdAt &&
                c.createdAt
                    .startsWith(
                        currentMonth
                    )
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
        expiring.length
    );

    setText(
        "totalRevenue",
        formatCurrency(
            totalRevenue
        )
    );

    setText(
        "monthlyRevenue",
        formatCurrency(
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


    if ($("expiringBadge")) {

        $("expiringBadge")
            .textContent =
            expiring.length;

    }


    renderRecentCustomers();

    renderExpiringCustomers();

}


function setText(
    id,
    value
) {

    if ($(id)) {

        $(id).textContent =
            value;

    }

}


/* =========================================================
   RECENT CUSTOMERS
========================================================= */

function renderRecentCustomers() {

    const table =
        $("recentCustomersTable");

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
                    class="empty-state"
                >
                    No customers yet.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =
        recent.map(
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
                        ${statusBadge(
                            getCustomerStatus(
                                customer
                            )
                        )}
                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   EXPIRING CUSTOMERS
========================================================= */

function renderExpiringCustomers() {

    const list =
        $("expiringCustomersList");

    if (!list) {
        return;
    }


    const expiring =
        customers.filter(
            customer => {

                if (
                    getCustomerStatus(
                        customer
                    ) !==
                    "Active"
                ) {
                    return false;
                }


                const days =
                    daysBetween(
                        todayISO(),
                        customer.expiryDate
                    );


                return (
                    days >= 0 &&
                    days <= 7
                );

            }
        );


    if (!expiring.length) {

        list.innerHTML = `

            <div class="empty-state">

                No customers expiring soon.

            </div>

        `;

        return;
    }


    list.innerHTML =
        expiring.map(
            customer => {

                const days =
                    daysBetween(
                        todayISO(),
                        customer.expiryDate
                    );


                return `

                    <div class="expiring-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    customer.name
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    customer.plan
                                )}
                            </small>

                        </div>

                        <span>
                            ${days} day${
                                days === 1
                                    ? ""
                                    : "s"
                            }
                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   PAYMENT STATS
========================================================= */

function updatePaymentStats() {

    const paid =
        payments.filter(
            p =>
                p.status === "Paid"
        );


    const revenue =
        paid.reduce(
            (sum, p) =>
                sum +
                Number(
                    p.amount || 0
                ),
            0
        );


    const month =
        new Date()
            .toISOString()
            .slice(
                0,
                7
            );


    const monthly =
        paid
            .filter(
                p =>
                    p.date &&
                    p.date.startsWith(
                        month
                    )
            )
            .reduce(
                (sum, p) =>
                    sum +
                    Number(
                        p.amount || 0
                    ),
                0
            );


    const pending =
        payments.filter(
            p =>
                p.status ===
                "Pending"
        ).length;


    setText(
        "paymentTotalRevenue",
        formatCurrency(
            revenue
        )
    );


    setText(
        "paymentMonthlyRevenue",
        formatCurrency(
            monthly
        )
    );


    setText(
        "paymentPending",
        pending
    );

}


/* =========================================================
   PLANS
========================================================= */

function renderPlans() {

    const grid =
        $("plansGrid");

    if (!grid) {
        return;
    }


    grid.innerHTML =
        plans.map(
            plan => `

                <div class="plan-card">

                    <div class="plan-icon">
                        📦
                    </div>

                    <h3>
                        ${escapeHTML(
                            plan.name
                        )}
                    </h3>

                    <strong>
                        ${formatCurrency(
                            plan.price
                        )}
                    </strong>

                    <p>
                        ${plan.duration}
                        month subscription
                    </p>

                    <button
                        class="secondary-button"
                        onclick="deletePlan('${plan.id}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `
        ).join("");

}


$("addPlanButton")?.addEventListener(
    "click",
    () => {

        const name =
            prompt(
                "Enter plan name"
            );


        if (!name) {
            return;
        }


        const price =
            Number(
                prompt(
                    "Enter plan price"
                )
            );


        if (!price) {
            return;
        }


        const duration =
            Number(
                prompt(
                    "Enter duration in months"
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

            duration

        });


        saveData(
            STORAGE.plans,
            plans
        );


        renderPlans();


        showToast(
            "Plan added successfully"
        );

    }
);


window.deletePlan =
function (id) {

    if (
        !confirm(
            "Delete this plan?"
        )
    ) {
        return;
    }


    plans =
        plans.filter(
            p => p.id !== id
        );


    saveData(
        STORAGE.plans,
        plans
    );


    renderPlans();

};


/* =========================================================
   REPORTS
========================================================= */

function updateReports() {

    const totalCustomers =
        customers.length;


    const paid =
        payments.filter(
            p =>
                p.status === "Paid"
        );


    const revenue =
        paid.reduce(
            (sum, p) =>
                sum +
                Number(
                    p.amount || 0
                ),
            0
        );


    const average =
        paid.length
            ? revenue / paid.length
            : 0;


    setText(
        "reportCustomers",
        totalCustomers
    );


    setText(
        "reportRevenue",
        formatCurrency(
            revenue
        )
    );


    setText(
        "reportAverage",
        formatCurrency(
            average
        )
    );

}


/* =========================================================
   CHARTS
========================================================= */

function updateCharts() {

    if (
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    updateRevenueChart();

    updateCustomerChart();

    updateReportRevenueChart();

    updatePlanChart();

}


function updateRevenueChart() {

    const canvas =
        $("revenueChart");

    if (!canvas) {
        return;
    }


    const months = [];

    const values = [];


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date();

        date.setMonth(
            date.getMonth() - i
        );


        const key =
            date.toISOString()
                .slice(
                    0,
                    7
                );


        months.push(
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            )
        );


        const total =
            payments
                .filter(
                    p =>
                        p.status ===
                        "Paid" &&
                        p.date &&
                        p.date.startsWith(
                            key
                        )
                )
                .reduce(
                    (sum, p) =>
                        sum +
                        Number(
                            p.amount || 0
                        ),
                    0
                );


        values.push(
            total
        );

    }


    if (revenueChart) {

        revenueChart.destroy();

    }


    revenueChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        months,

                    datasets: [

                        {

                            label:
                                "Revenue",

                            data:
                                values,

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


function updateCustomerChart() {

    const canvas =
        $("customerChart");

    if (!canvas) {
        return;
    }


    const active =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            c =>
                getCustomerStatus(c) ===
                "Expired"
        ).length;


    const suspended =
        customers.filter(
            c =>
                c.status ===
                "Suspended"
        ).length;


    if (customerChart) {

        customerChart.destroy();

    }


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


function updateReportRevenueChart() {

    const canvas =
        $("reportRevenueChart");

    if (!canvas) {
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

                    labels:
                        [
                            "Paid",
                            "Pending"
                        ],

                    datasets: [

                        {

                            label:
                                "Payments",

                            data: [

                                payments
                                    .filter(
                                        p =>
                                            p.status ===
                                            "Paid"
                                    )
                                    .reduce(
                                        (
                                            s,
                                            p
                                        ) =>
                                            s +
                                            Number(
                                                p.amount ||
                                                0
                                            ),
                                        0
                                    ),

                                payments
                                    .filter(
                                        p =>
                                            p.status ===
                                            "Pending"
                                    )
                                    .reduce(
                                        (
                                            s,
                                            p
                                        ) =>
                                            s +
                                            Number(
                                                p.amount ||
                                                0
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


function updatePlanChart() {

    const canvas =
        $("planChart");

    if (!canvas) {
        return;
    }


    if (planChart) {

        planChart.destroy();

    }


    const labels =
        plans.map(
            p => p.name
        );


    const data =
        plans.map(
            plan =>
                customers.filter(
                    c =>
                        c.plan ===
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
   BACKUP EXPORT
========================================================= */

$("exportBackup")?.addEventListener(
    "click",
    () => {

        const backup = {

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
            `SUPER-IPTV-Backup-${todayISO()}.json`;


        link.click();


        URL.revokeObjectURL(
            url
        );


        showToast(
            "Backup exported successfully"
        );

    }
);


/* =========================================================
   BACKUP IMPORT
========================================================= */

$("importBackup")?.addEventListener(
    "click",
    () => {

        $("importBackupFile")?.click();

    }
);


$("importBackupFile")?.addEventListener(
    "change",
    function () {

        const file =
            this.files?.[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                try {

                    const backup =
                        JSON.parse(
                            event.target.result
                        );


                    if (
                        !confirm(
                            "Import backup? Current data may be replaced."
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


                    plans =
                        backup.plans ||
                        DEFAULT_PLANS;


                    settings = {

                        ...DEFAULT_SETTINGS,

                        ...(backup.settings ||
                            {})

                    };


                    notifications =
                        backup.notifications ||
                        [];


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
                        STORAGE.plans,
                        plans
                    );


                    saveData(
                        STORAGE.settings,
                        settings
                    );


                    saveData(
                        STORAGE.notifications,
                        notifications
                    );


                    loadSettingsIntoForm();


                    refreshPageData();


                    showToast(
                        "Backup imported successfully"
                    );


                } catch {

                    showToast(
                        "Invalid backup file"
                    );

                }

            };


        reader.readAsText(
            file
        );

    }
);


/* =========================================================
   PRINT CUSTOMERS
========================================================= */

$("printCustomers")?.addEventListener(
    "click",
    () => {

        window.print();

    }
);


/* =========================================================
   SETTINGS
========================================================= */

function loadSettingsIntoForm() {

    if ($("companyName")) {

        $("companyName").value =
            settings.companyName;

    }


    if ($("defaultPortal")) {

        $("defaultPortal").value =
            settings.defaultPortal;

    }


    if ($("whatsappNumber")) {

        $("whatsappNumber").value =
            settings.whatsappNumber;

    }


    if ($("upiId")) {

        $("upiId").value =
            settings.upiId;

    }


    if ($("upiName")) {

        $("upiName").value =
            settings.upiName;

    }


    if ($("whatsappTemplate")) {

        $("whatsappTemplate").value =
            settings.whatsappTemplate;

    }


    if ($("businessRegistrationNo")) {

        $("businessRegistrationNo").value =
            settings.businessRegistrationNo;

    }


    if ($("gstNumber")) {

        $("gstNumber").value =
            settings.gstNumber;

    }


    if ($("taxRate")) {

        $("taxRate").value =
            settings.taxRate;

    }


    if ($("taxEnabled")) {

        $("taxEnabled").checked =
            settings.taxEnabled;

    }

}


$("saveGeneralSettings")?.addEventListener(
    "click",
    () => {

        settings.companyName =
            $("companyName")?.value.trim() ||
            "SUPER IPTV";


        settings.defaultPortal =
            $("defaultPortal")?.value.trim() ||
            "";


        settings.whatsappNumber =
            $("whatsappNumber")?.value.trim() ||
            "";


        saveData(
            STORAGE.settings,
            settings
        );


        showToast(
            "General settings saved"
        );

    }
);


$("savePaymentSettings")?.addEventListener(
    "click",
    () => {

        settings.upiId =
            $("upiId")?.value.trim() ||
            "";


        settings.upiName =
            $("upiName")?.value.trim() ||
            settings.companyName;


        saveData(
            STORAGE.settings,
            settings
        );


        updateQR();


        showToast(
            "Payment settings saved"
        );

    }
);


$("saveWhatsappTemplate")?.addEventListener(
    "click",
    () => {

        settings.whatsappTemplate =
            $("whatsappTemplate")?.value ||
            DEFAULT_SETTINGS.whatsappTemplate;


        saveData(
            STORAGE.settings,
            settings
        );


        showToast(
            "WhatsApp template saved"
        );

    }
);


/* =========================================================
   OPTIONAL GST / BUSINESS SETTINGS
========================================================= */

function saveBusinessSettings() {

    if ($("businessRegistrationNo")) {

        settings.businessRegistrationNo =
            $("businessRegistrationNo")
                .value
                .trim();

    }


    if ($("gstNumber")) {

        settings.gstNumber =
            $("gstNumber")
                .value
                .trim();

    }


    if ($("taxRate")) {

        settings.taxRate =
            Number(
                $("taxRate").value || 0
            );

    }


    if ($("taxEnabled")) {

        settings.taxEnabled =
            $("taxEnabled").checked;

    }


    saveData(
        STORAGE.settings,
        settings
    );

}


/* =========================================================
   MODAL FUNCTIONS
========================================================= */

function openModal(
    id
) {

    const modal =
        $(id);

    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            modal => {

                modal.classList.remove(
                    "show"
                );

            }
        );

}


document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   NOTIFICATION BUTTON
========================================================= */

$("notificationButton")?.addEventListener(
    "click",
    () => {

        showPage(
            "notifications"
        );

    }
);


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        loadSettingsIntoForm();


        if ($("startDate")) {

            $("startDate").value =
                todayISO();

        }


        refreshPageData();


        updateNewCustomerCalculation();


        /*
          Auto-check expiry notifications
        */

        customers.forEach(
            customer => {

                if (
                    !customer.expiryDate
                ) {
                    return;
                }


                const days =
                    daysBetween(
                        todayISO(),
                        customer.expiryDate
                    );


                if (
                    days >= 0 &&
                    days <= 3
                ) {

                    const alreadyExists =
                        notifications.some(
                            n =>
                                n.type ===
                                "expiry" &&

                                n.message.includes(
                                    customer.id
                                )
                        );


                    if (!alreadyExists) {

                        addNotification({

                            type:
                                "expiry",

                            title:
                                "Subscription Expiring Soon",

                            message:
                                `${customer.name}'s subscription expires in ${days} day(s). Customer ID: ${customer.id}`

                        });

                    }

                }

            }
        );


        updateNotificationCount();

    }
);


/* =========================================================
   AUTO SAVE BUSINESS SETTINGS
========================================================= */

[
    "businessRegistrationNo",
    "gstNumber",
    "taxRate",
    "taxEnabled"
].forEach(
    id => {

        $(id)?.addEventListener(
            "change",
            saveBusinessSettings
        );

    }
);


/* =========================================================
   GLOBAL EXPORTS
========================================================= */

window.showPage =
    showPage;

window.openWhatsApp =
    openWhatsApp;

window.printInvoice =
    printInvoice;

console.log(
    "SUPER IPTV Professional Panel loaded successfully."
);