/* =========================================================
   SUPER IPTV
   PREMIUM MANAGEMENT PANEL
   PART 3 — script.js

   FEATURES
   ---------------------------------------------------------
   ✓ Sidebar Navigation
   ✓ Mobile Menu
   ✓ Dark / Light Theme
   ✓ Customer Management
   ✓ Auto Expiry Date
   ✓ Plan Based Pricing
   ✓ Payment Management
   ✓ UPI QR Generation
   ✓ WhatsApp Message
   ✓ Search Customer
   ✓ Dashboard Statistics
   ✓ Recent Customers
   ✓ Backup / Restore
   ✓ LocalStorage
   ✓ Toast Notifications
========================================================= */


/* =========================================================
   1. STORAGE KEYS
========================================================= */

const STORAGE = {

    USERS: "SUPER_IPTV_USERS",

    PAYMENTS: "SUPER_IPTV_PAYMENTS",

    SETTINGS: "SUPER_IPTV_SETTINGS",

    THEME: "SUPER_IPTV_THEME"

};


/* =========================================================
   2. DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {

    brandName: "SUPER IPTV",

    upiId: "6289033804@ptsbi",

    contact: "",

    portalUrl: "",

    messageTemplate:
`Hello {{NAME}},

Your IPTV subscription has been activated successfully.

Username: {{USERNAME}}
Password: {{PASSWORD}}
Plan: {{PLAN}}
Amount: ₹{{AMOUNT}}
Start Date: {{START}}
Expiry Date: {{EXPIRY}}

Portal: {{PORTAL_URL}}

Thank you for choosing SUPER IPTV.`

};


/* =========================================================
   3. PLAN PRICES
========================================================= */

const PLAN_PRICES = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,

    "12 Months": 2000

};


/* =========================================================
   4. PLAN DURATIONS
========================================================= */

const PLAN_MONTHS = {

    "1 Month": 1,

    "3 Months": 3,

    "6 Months": 6,

    "12 Months": 12

};


/* =========================================================
   5. GET STORAGE
========================================================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE.USERS)
        ) || [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function getPayments() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE.PAYMENTS)
        ) || [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function getSettings() {

    try {

        return {

            ...DEFAULT_SETTINGS,

            ...(JSON.parse(
                localStorage.getItem(STORAGE.SETTINGS)
            ) || {})

        };

    } catch (error) {

        return {
            ...DEFAULT_SETTINGS
        };

    }

}


function saveUsers(users) {

    localStorage.setItem(

        STORAGE.USERS,

        JSON.stringify(users)

    );

}


function savePayments(payments) {

    localStorage.setItem(

        STORAGE.PAYMENTS,

        JSON.stringify(payments)

    );

}


function saveSettings(settings) {

    localStorage.setItem(

        STORAGE.SETTINGS,

        JSON.stringify(settings)

    );

}


/* =========================================================
   6. GLOBAL VARIABLES
========================================================= */

let editingUserId = null;

let qrInstance = null;


/* =========================================================
   7. DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePanel();

    }
);


/* =========================================================
   8. INITIALIZE PANEL
========================================================= */

function initializePanel() {

    applySavedTheme();

    setupNavigation();

    setupMobileMenu();

    setupThemeToggle();

    setupPlanListeners();

    setupCustomerForm();

    setupSearch();

    setupPaymentForm();

    setupBackupRestore();

    setupSettings();

    setupModal();

    renderAll();

}


/* =========================================================
   9. RENDER ALL
========================================================= */

function renderAll() {

    updateDashboard();

    renderUsers();

    renderPayments();

    renderRecentUsers();

    updateStatusChart();

    updateBrand();

    updateExpiryStatuses();

    updatePlanPrice();

}


/* =========================================================
   10. NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems = document.querySelectorAll(
        ".nav-item"
    );

    navItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const target =
                        this.dataset.page ||
                        this.getAttribute("data-target");

                    if (!target) {

                        return;

                    }

                    navItems.forEach(
                        function (nav) {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );

                    this.classList.add(
                        "active"
                    );

                    showPage(target);

                    closeMobileSidebar();

                }
            );

        }
    );

}


/* =========================================================
   11. SHOW PAGE
========================================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(
        ".page"
    );

    pages.forEach(
        function (page) {

            page.classList.remove(
                "active"
            );

        }
    );


    const targetPage =
        document.getElementById(pageId) ||
        document.querySelector(
            `[data-page-content="${pageId}"]`
        );


    if (targetPage) {

        targetPage.classList.add(
            "active"
        );

    }


    const titleMap = {

        dashboard:
            ["Dashboard", "SUPER IPTV Management Panel"],

        users:
            ["Customers", "Manage your IPTV customers"],

        customers:
            ["Customers", "Manage your IPTV customers"],

        addCustomer:
            ["Add Customer", "Create a new IPTV customer"],

        payments:
            ["Payments", "Manage customer payments"],

        reports:
            ["Reports", "View your business reports"],

        settings:
            ["Settings", "Manage your panel settings"],

        backup:
            ["Backup & Restore", "Manage your panel data"]

    };


    const heading =
        document.querySelector(
            ".page-heading h1"
        );

    const subtitle =
        document.querySelector(
            ".page-heading p"
        );


    if (
        heading &&
        titleMap[pageId]
    ) {

        heading.textContent =
            titleMap[pageId][0];

        subtitle.textContent =
            titleMap[pageId][1];

    }

}


/* =========================================================
   12. MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    const overlay =
        document.querySelector(
            ".sidebar-overlay"
        );

    const closeButton =
        document.querySelector(
            ".sidebar-close"
        );


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function () {

                sidebar?.classList.add(
                    "open"
                );

                overlay?.classList.add(
                    "active"
                );

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMobileSidebar
        );

    }

}


function closeMobileSidebar() {

    document
        .querySelector(
            ".sidebar"
        )
        ?.classList.remove(
            "open"
        );


    document
        .querySelector(
            ".sidebar-overlay"
        )
        ?.classList.remove(
            "active"
        );

}


/* =========================================================
   13. THEME
========================================================= */

function setupThemeToggle() {

    const buttons =
        document.querySelectorAll(
            "#themeToggle, .theme-toggle, [data-theme-toggle]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                toggleTheme
            );

        }
    );

}


function toggleTheme() {

    const body =
        document.body;

    body.classList.toggle(
        "light-theme"
    );


    const isLight =
        body.classList.contains(
            "light-theme"
        );


    localStorage.setItem(

        STORAGE.THEME,

        isLight
            ? "light"
            : "dark"

    );


    updateThemeIcon();

}


function applySavedTheme() {

    const theme =
        localStorage.getItem(
            STORAGE.THEME
        );


    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    } else {

        document.body.classList.remove(
            "light-theme"
        );

    }


    updateThemeIcon();

}


function updateThemeIcon() {

    const icon =
        document.querySelector(
            "#themeToggle i, .theme-toggle i"
        );


    if (!icon) {

        return;

    }


    if (
        document.body.classList.contains(
            "light-theme"
        )
    ) {

        icon.className =
            "fas fa-moon";

    } else {

        icon.className =
            "fas fa-sun";

    }

}


/* =========================================================
   14. PLAN LISTENERS
========================================================= */

function setupPlanListeners() {

    document.addEventListener(
        "change",
        function (event) {

            if (
                event.target.matches(
                    "#plan, #customerPlan, [name='plan']"
                )
            ) {

                updatePlanPrice();

                calculateExpiry();

            }

        }
    );

}


/* =========================================================
   15. UPDATE PLAN PRICE
========================================================= */

function updatePlanPrice() {

    const plan =
        document.querySelector(
            "#plan"
        ) ||
        document.querySelector(
            "#customerPlan"
        );


    const amount =
        document.querySelector(
            "#amount"
        ) ||
        document.querySelector(
            "#customerAmount"
        );


    if (
        !plan ||
        !amount
    ) {

        return;

    }


    const price =
        PLAN_PRICES[
            plan.value
        ];


    if (
        price !== undefined
    ) {

        amount.value =
            price;

    }

}


/* =========================================================
   16. CUSTOMER FORM
========================================================= */

function setupCustomerForm() {

    const form =
        document.querySelector(
            "#customerForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            saveCustomerFromForm();

        }
    );


    const resetButton =
        document.querySelector(
            "#resetCustomerForm"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCustomerForm
        );

    }

}


/* =========================================================
   17. SAVE CUSTOMER
========================================================= */

function saveCustomerFromForm() {

    const name =
        getValue(
            "#customerName",
            "#name"
        );


    const phone =
        getValue(
            "#customerPhone",
            "#phone"
        );


    const username =
        getValue(
            "#customerUsername",
            "#username"
        );


    const password =
        getValue(
            "#customerPassword",
            "#password"
        );


    const portal =
        getValue(
            "#customerPortal",
            "#portalUrl"
        );


    const plan =
        getValue(
            "#customerPlan",
            "#plan"
        );


    const amount =
        getValue(
            "#customerAmount",
            "#amount"
        );


    const startDate =
        getValue(
            "#startDate"
        ) ||
        getToday();


    let expiryDate =
        getValue(
            "#expiryDate"
        );


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


    if (!expiryDate) {

        expiryDate =
            calculateExpiryDate(
                startDate,
                plan
            );

    }


    const users =
        getUsers();


    if (editingUserId) {

        const index =
            users.findIndex(
                user =>
                    user.id ===
                    editingUserId
            );


        if (index !== -1) {

            users[index] = {

                ...users[index],

                name,

                phone,

                username,

                password,

                portalUrl:
                    portal,

                plan,

                amount:
                    Number(
                        amount ||
                        PLAN_PRICES[plan] ||
                        0
                    ),

                startDate,

                expiryDate,

                updatedAt:
                    new Date().toISOString()

            };

        }


        editingUserId =
            null;


        showToast(
            "Customer updated successfully",
            "success"
        );

    } else {

        const customer = {

            id:
                generateId(),

            name,

            phone,

            username,

            password,

            portalUrl:
                portal,

            plan,

            amount:
                Number(
                    amount ||
                    PLAN_PRICES[plan] ||
                    0
                ),

            startDate,

            expiryDate,

            status:
                "Active",

            createdAt:
                new Date().toISOString()

        };


        users.push(
            customer
        );


        const payments =
            getPayments();


        payments.push({

            id:
                generateId(),

            customerId:
                customer.id,

            customerName:
                customer.name,

            phone:
                customer.phone,

            plan:
                customer.plan,

            amount:
                customer.amount,

            date:
                getToday(),

            status:
                "Paid"

        });


        savePayments(
            payments
        );


        showToast(
            "Customer added successfully",
            "success"
        );

    }


    saveUsers(
        users
    );


    formReset();

    renderAll();

}


/* =========================================================
   18. EDIT CUSTOMER
========================================================= */

function editCustomer(id) {

    const user =
        getUsers().find(
            item =>
                item.id === id
        );


    if (!user) {

        return;

    }


    editingUserId =
        id;


    setValue(
        "#customerName",
        user.name
    );


    setValue(
        "#customerPhone",
        user.phone
    );


    setValue(
        "#customerUsername",
        user.username
    );


    setValue(
        "#customerPassword",
        user.password
    );


    setValue(
        "#customerPortal",
        user.portalUrl
    );


    setValue(
        "#customerPlan",
        user.plan
    );


    setValue(
        "#customerAmount",
        user.amount
    );


    setValue(
        "#startDate",
        user.startDate
    );


    setValue(
        "#expiryDate",
        user.expiryDate
    );


    showPage(
        "addCustomer"
    );


    document
        .querySelector(
            "#customerName"
        )
        ?.focus();


    showToast(
        "Customer loaded for editing",
        "success"
    );

}


/* =========================================================
   19. DELETE CUSTOMER
========================================================= */

function deleteCustomer(id) {

    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.id === id
        );


    if (!user) {

        return;

    }


    if (
        !confirm(
            `Delete customer "${user.name}"?`
        )
    ) {

        return;

    }


    const filtered =
        users.filter(
            item =>
                item.id !== id
        );


    saveUsers(
        filtered
    );


    const payments =
        getPayments().filter(
            payment =>
                payment.customerId !== id
        );


    savePayments(
        payments
    );


    renderAll();


    showToast(
        "Customer deleted successfully",
        "success"
    );

}


/* =========================================================
   20. RENDER USERS
========================================================= */

function renderUsers(
    list = getUsers()
) {

    const tbody =
        document.querySelector(
            "#usersTableBody"
        ) ||
        document.querySelector(
            "#customersTableBody"
        );


    if (!tbody) {

        return;

    }


    if (
        list.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:35px;"
                >

                    No Customers Yet

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        list.map(
            function (user) {

                const status =
                    getCustomerStatus(
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
                            user.phone || "-"
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            user.username || "-"
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            user.plan || "-"
                        )}

                    </td>


                    <td>

                        ₹${Number(
                            user.amount || 0
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            user.expiryDate
                        )}

                    </td>


                    <td>

                        <span class="
                            status-badge
                            ${status.className}
                        ">

                            ${status.label}

                        </span>

                    </td>


                    <td>

                        <div class="
                            action-buttons
                        ">

                            <button
                                class="
                                    action-btn
                                "
                                onclick="
                                    editCustomer(
                                        '${user.id}'
                                    )
                                "
                                title="Edit"
                            >

                                <i class="
                                    fas fa-edit
                                "></i>

                            </button>


                            <button
                                class="
                                    action-btn
                                "
                                onclick="
                                    sendWhatsApp(
                                        '${user.id}'
                                    )
                                "
                                title="WhatsApp"
                            >

                                <i class="
                                    fab fa-whatsapp
                                "></i>

                            </button>


                            <button
                                class="
                                    action-btn
                                    delete
                                "
                                onclick="
                                    deleteCustomer(
                                        '${user.id}'
                                    )
                                "
                                title="Delete"
                            >

                                <i class="
                                    fas fa-trash
                                "></i>

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
   21. SEARCH CUSTOMER
========================================================= */

function setupSearch() {

    const searchInputs =
        document.querySelectorAll(
            "#customerSearch, #userSearch, .customer-search"
        );


    searchInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    searchCustomers(
                        this.value
                    );

                }
            );

        }
    );

}


function searchCustomers(
    keyword
) {

    const search =
        String(
            keyword || ""
        )
        .toLowerCase()
        .trim();


    const users =
        getUsers();


    if (!search) {

        renderUsers(
            users
        );

        return;

    }


    const filtered =
        users.filter(
            function (user) {

                return [

                    user.name,

                    user.phone,

                    user.username,

                    user.plan,

                    user.portalUrl

                ]
                .join(" ")
                .toLowerCase()
                .includes(
                    search
                );

            }
        );


    renderUsers(
        filtered
    );

}


/* =========================================================
   22. PAYMENT RENDER
========================================================= */

function renderPayments() {

    const tbody =
        document.querySelector(
            "#paymentsTableBody"
        );


    if (!tbody) {

        return;

    }


    const payments =
        getPayments();


    if (
        payments.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;padding:35px;"
                >

                    No Payments Yet

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        payments
        .slice()
        .reverse()
        .map(
            function (payment) {

                return `

                <tr>

                    <td>

                        ${escapeHTML(
                            payment.customerName || "-"
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            payment.phone || "-"
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            payment.plan || "-"
                        )}

                    </td>


                    <td>

                        ₹${Number(
                            payment.amount || 0
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            payment.date
                        )}

                    </td>


                    <td>

                        <span class="
                            status-badge
                            paid
                        ">

                            ${payment.status || "Paid"}

                        </span>

                    </td>

                </tr>

                `;

            }
        )
        .join("");

}


/* =========================================================
   23. RECENT USERS
========================================================= */

function renderRecentUsers() {

    const tbody =
        document.querySelector(
            "#recentUsersTableBody"
        );


    if (!tbody) {

        return;

    }


    const users =
        getUsers()
        .slice()
        .reverse()
        .slice(
            0,
            5
        );


    if (
        users.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;padding:30px;"
                >

                    No Users Yet

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        users
        .map(
            function (user) {

                const status =
                    getCustomerStatus(
                        user.expiryDate
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
                            user.phone || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.plan || "-"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            user.expiryDate
                        )}
                    </td>

                    <td>

                        <span class="
                            status-badge
                            ${status.className}
                        ">

                            ${status.label}

                        </span>

                    </td>

                </tr>

                `;

            }
        )
        .join("");

}


/* =========================================================
   24. DASHBOARD
========================================================= */

function updateDashboard() {

    const users =
        getUsers();


    const payments =
        getPayments();


    const active =
        users.filter(
            user =>
                getCustomerStatus(
                    user.expiryDate
                ).key === "active"
        ).length;


    const expired =
        users.filter(
            user =>
                getCustomerStatus(
                    user.expiryDate
                ).key === "expired"
        ).length;


    const revenue =
        payments.reduce(
            function (
                total,
                payment
            ) {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    setText(
        "#totalUsers",
        users.length
    );


    setText(
        "#activeUsers",
        active
    );


    setText(
        "#expiredUsers",
        expired
    );


    setText(
        "#totalRevenue",
        "₹" +
        revenue
    );


    setText(
        "#totalCustomers",
        users.length
    );


    setText(
        "#totalPayments",
        payments.length
    );


    setText(
        "#revenueAmount",
        "₹" +
        revenue
    );

}


/* =========================================================
   25. STATUS CHART
========================================================= */

function updateStatusChart() {

    const users =
        getUsers();


    const active =
        users.filter(
            user =>
                getCustomerStatus(
                    user.expiryDate
                ).key === "active"
        ).length;


    const expired =
        users.filter(
            user =>
                getCustomerStatus(
                    user.expiryDate
                ).key === "expired"
        ).length;


    const expiring =
        users.filter(
            user =>
                getCustomerStatus(
                    user.expiryDate
                ).key === "expiring"
        ).length;


    setText(
        "#activeCount",
        active
    );


    setText(
        "#expiredCount",
        expired
    );


    setText(
        "#expiringCount",
        expiring
    );


    setText(
        "#totalStatusCount",
        users.length
    );

}


/* =========================================================
   26. EXPIRY STATUS
========================================================= */

function getCustomerStatus(
    expiryDate
) {

    if (!expiryDate) {

        return {

            key:
                "unknown",

            label:
                "Unknown",

            className:
                "pending"

        };

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const expiry =
        new Date(
            expiryDate
        );


    expiry.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        expiry.getTime() -
        today.getTime();


    const daysLeft =
        Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (
        daysLeft < 0
    ) {

        return {

            key:
                "expired",

            label:
                "Expired",

            className:
                "expired"

        };

    }


    if (
        daysLeft <= 7
    ) {

        return {

            key:
                "expiring",

            label:
                daysLeft === 0
                    ? "Expires Today"
                    : `Expiring (${daysLeft}d)`,

            className:
                "expiring"

        };

    }


    return {

        key:
            "active",

        label:
            "Active",

        className:
            "active"

    };

}


/* =========================================================
   27. AUTO UPDATE STATUS
========================================================= */

function updateExpiryStatuses() {

    const users =
        getUsers();


    let changed =
        false;


    users.forEach(
        function (user) {

            const newStatus =
                getCustomerStatus(
                    user.expiryDate
                ).label;


            if (
                user.status !==
                newStatus
            ) {

                user.status =
                    newStatus;

                changed =
                    true;

            }

        }
    );


    if (changed) {

        saveUsers(
            users
        );

    }

}


/* =========================================================
   28. CALCULATE EXPIRY
========================================================= */

function calculateExpiry() {

    const start =
        getValue(
            "#startDate"
        ) ||
        getToday();


    const plan =
        getValue(
            "#customerPlan",
            "#plan"
        );


    if (
        !plan
    ) {

        return;

    }


    const expiry =
        calculateExpiryDate(
            start,
            plan
        );


    setValue(
        "#expiryDate",
        expiry
    );

}


function calculateExpiryDate(
    startDate,
    plan
) {

    const date =
        new Date(
            startDate
        );


    const months =
        PLAN_MONTHS[
            plan
        ] || 1;


    date.setMonth(
        date.getMonth() +
        months
    );


    return formatInputDate(
        date
    );

}


/* =========================================================
   29. PAYMENT FORM
========================================================= */

function setupPaymentForm() {

    const plan =
        document.querySelector(
            "#paymentPlan"
        );


    if (plan) {

        plan.addEventListener(
            "change",
            function () {

                const amount =
                    PLAN_PRICES[
                        this.value
                    ] || 0;


                setValue(
                    "#paymentAmount",
                    amount
                );


                generatePaymentQR();

            }
        );

    }


    const amount =
        document.querySelector(
            "#paymentAmount"
        );


    if (amount) {

        amount.addEventListener(
            "input",
            generatePaymentQR
        );

    }


    const qrButton =
        document.querySelector(
            "#generateQR"
        );


    if (qrButton) {

        qrButton.addEventListener(
            "click",
            generatePaymentQR
        );

    }

}


/* =========================================================
   30. QR GENERATOR
========================================================= */

function generatePaymentQR() {

    const qrContainer =
        document.querySelector(
            "#qrCode"
        ) ||
        document.querySelector(
            ".qr-code"
        );


    if (!qrContainer) {

        return;

    }


    const settings =
        getSettings();


    const amount =
        Number(
            getValue(
                "#paymentAmount",
                "#amount"
            ) || 0
        );


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount",
            "error"
        );

        return;

    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML = `

            <div style="
                text-align:center;
                color:#ff5d73;
                font-size:10px;
                padding:15px;
            ">

                QR library not loaded

            </div>

        `;

        return;

    }


    const upiUrl =
        "upi://pay?" +

        "pa=" +
        encodeURIComponent(
            settings.upiId
        ) +

        "&pn=" +
        encodeURIComponent(
            settings.brandName
        ) +

        "&am=" +
        encodeURIComponent(
            amount
        ) +

        "&cu=INR";


    qrContainer.innerHTML =
        "";


    qrInstance =
        new QRCode(
            qrContainer,
            {

                text:
                    upiUrl,

                width:
                    150,

                height:
                    150,

                colorDark:
                    "#000000",

                colorLight:
                    "#ffffff",

                correctLevel:
                    QRCode.CorrectLevel.H

            }
        );


    const qrData =
        qrContainer.querySelector(
            "canvas"
        );


    if (qrData) {

        qrData.dataset.upi =
            upiUrl;

    }

}


/* =========================================================
   31. DOWNLOAD QR
========================================================= */

function downloadQR() {

    const qrContainer =
        document.querySelector(
            "#qrCode"
        ) ||
        document.querySelector(
            ".qr-code"
        );


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


    let url = null;


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
            "Generate QR first",
            "error"
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
        "SUPER-IPTV-UPI-QR.png";


    link.click();

}


/* =========================================================
   32. WHATSAPP
========================================================= */

function sendWhatsApp(
    userId
) {

    const user =
        getUsers().find(
            item =>
                item.id ===
                userId
        );


    if (!user) {

        return;

    }


    const settings =
        getSettings();


    let message =
        settings.messageTemplate;


    message =
        message
        .replaceAll(
            "{{NAME}}",
            user.name || ""
        )
        .replaceAll(
            "{{USERNAME}}",
            user.username || ""
        )
        .replaceAll(
            "{{PASSWORD}}",
            user.password || ""
        )
        .replaceAll(
            "{{PLAN}}",
            user.plan || ""
        )
        .replaceAll(
            "{{AMOUNT}}",
            user.amount || ""
        )
        .replaceAll(
            "{{START}}",
            formatDate(
                user.startDate
            )
        )
        .replaceAll(
            "{{EXPIRY}}",
            formatDate(
                user.expiryDate
            )
        )
        .replaceAll(
            "{{PORTAL_URL}}",
            user.portalUrl ||
            settings.portalUrl ||
            ""
        )
        .replaceAll(
            "{{UPI_ID}}",
            settings.upiId
        )
        .replaceAll(
            "{{CONTACT}}",
            settings.contact
        );


    const phone =
        String(
            user.phone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    const whatsappUrl =
        phone

            ? "https://wa.me/" +
              phone +
              "?text=" +
              encodeURIComponent(
                  message
              )

            : "https://wa.me/?text=" +
              encodeURIComponent(
                  message
              );


    window.open(
        whatsappUrl,
        "_blank"
    );

}


/* =========================================================
   33. COPY WHATSAPP MESSAGE
========================================================= */

async function copyWhatsAppMessage(
    userId
) {

    const user =
        getUsers().find(
            item =>
                item.id === userId
        );


    if (!user) {

        return;

    }


    const settings =
        getSettings();


    let message =
        settings.messageTemplate;


    message =
        replaceTemplate(
            message,
            user,
            settings
        );


    try {

        await navigator.clipboard.writeText(
            message
        );


        showToast(
            "Message copied",
            "success"
        );

    } catch (error) {

        showToast(
            "Copy failed",
            "error"
        );

    }

}


/* =========================================================
   34. TEMPLATE REPLACER
========================================================= */

function replaceTemplate(
    template,
    user,
    settings
) {

    return template

        .replaceAll(
            "{{NAME}}",
            user.name || ""
        )

        .replaceAll(
            "{{USERNAME}}",
            user.username || ""
        )

        .replaceAll(
            "{{PASSWORD}}",
            user.password || ""
        )

        .replaceAll(
            "{{PLAN}}",
            user.plan || ""
        )

        .replaceAll(
            "{{AMOUNT}}",
            user.amount || ""
        )

        .replaceAll(
            "{{START}}",
            formatDate(
                user.startDate
            )
        )

        .replaceAll(
            "{{EXPIRY}}",
            formatDate(
                user.expiryDate
            )
        )

        .replaceAll(
            "{{PORTAL_URL}}",
            user.portalUrl ||
            settings.portalUrl ||
            ""
        )

        .replaceAll(
            "{{UPI_ID}}",
            settings.upiId
        )

        .replaceAll(
            "{{CONTACT}}",
            settings.contact
        );

}


/* =========================================================
   35. BACKUP / RESTORE
========================================================= */

function setupBackupRestore() {

    const exportButton =
        document.querySelector(
            "#exportBackup"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportBackup
        );

    }


    const importInput =
        document.querySelector(
            "#importBackup"
        );


    if (importInput) {

        importInput.addEventListener(
            "change",
            importBackup
        );

    }

}


function exportBackup() {

    const backup = {

        version:
            1,

        exportedAt:
            new Date().toISOString(),

        users:
            getUsers(),

        payments:
            getPayments(),

        settings:
            getSettings()

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
        getToday() +
        ".json";


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Backup exported successfully",
        "success"
    );

}


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
                    !Array.isArray(
                        backup.users
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                if (
                    !confirm(
                        "Restore backup? Existing data will be replaced."
                    )
                ) {

                    return;

                }


                saveUsers(
                    backup.users || []
                );


                savePayments(
                    backup.payments || []
                );


                saveSettings({

                    ...DEFAULT_SETTINGS,

                    ...(backup.settings || {})

                });


                renderAll();


                showToast(
                    "Backup restored successfully",
                    "success"
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
   36. SETTINGS
========================================================= */

function setupSettings() {

    const settings =
        getSettings();


    setValue(
        "#settingsBrandName",
        settings.brandName
    );


    setValue(
        "#settingsUpiId",
        settings.upiId
    );


    setValue(
        "#settingsContact",
        settings.contact
    );


    setValue(
        "#settingsPortalUrl",
        settings.portalUrl
    );


    setValue(
        "#messageTemplate",
        settings.messageTemplate
    );


    const form =
        document.querySelector(
            "#settingsForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const newSettings = {

                    brandName:
                        getValue(
                            "#settingsBrandName"
                        ) ||
                        DEFAULT_SETTINGS.brandName,

                    upiId:
                        getValue(
                            "#settingsUpiId"
                        ) ||
                        DEFAULT_SETTINGS.upiId,

                    contact:
                        getValue(
                            "#settingsContact"
                        ),

                    portalUrl:
                        getValue(
                            "#settingsPortalUrl"
                        ),

                    messageTemplate:
                        getValue(
                            "#messageTemplate"
                        ) ||
                        DEFAULT_SETTINGS.messageTemplate

                };


                saveSettings(
                    newSettings
                );


                updateBrand();


                generatePaymentQR();


                showToast(
                    "Settings saved successfully",
                    "success"
                );

            }
        );

    }

}


/* =========================================================
   37. UPDATE BRAND
========================================================= */

function updateBrand() {

    const settings =
        getSettings();


    document
        .querySelectorAll(
            "[data-brand-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    settings.brandName;

            }
        );

}


/* =========================================================
   38. MODAL
========================================================= */

function setupModal() {

    document
        .querySelectorAll(
            "[data-modal-open]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.modalOpen;


                        document
                            .getElementById(
                                id
                            )
                            ?.classList.add(
                                "active"
                            );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".modal-close, [data-modal-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        this.closest(
                            ".modal-overlay"
                        )
                        ?.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   39. RESET CUSTOMER FORM
========================================================= */

function resetCustomerForm() {

    editingUserId =
        null;


    formReset();


    showToast(
        "Form cleared",
        "success"
    );

}


function formReset() {

    const form =
        document.querySelector(
            "#customerForm"
        );


    if (form) {

        form.reset();

    }


    setValue(
        "#startDate",
        getToday()
    );


    setValue(
        "#expiryDate",
        ""
    );


    updatePlanPrice();

}


/* =========================================================
   40. UTILITY — GET VALUE
========================================================= */

function getValue(
    ...selectors
) {

    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            return element.value;

        }

    }


    return "";

}


/* =========================================================
   41. UTILITY — SET VALUE
========================================================= */

function setValue(
    selector,
    value
) {

    const element =
        document.querySelector(
            selector
        );


    if (element) {

        element.value =
            value ?? "";

    }

}


/* =========================================================
   42. UTILITY — SET TEXT
========================================================= */

function setText(
    selector,
    value
) {

    const element =
        document.querySelector(
            selector
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   43. TODAY
========================================================= */

function getToday() {

    return formatInputDate(
        new Date()
    );

}


/* =========================================================
   44. DATE FORMAT
========================================================= */

function formatInputDate(
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


    return `${year}-${month}-${day}`;

}


/* =========================================================
   45. DISPLAY DATE
========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";

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

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"

        }
    );

}


/* =========================================================
   46. GENERATE ID
========================================================= */

function generateId() {

    return (

        Date.now()
        .toString(36) +

        Math.random()
        .toString(36)
        .substring(2, 9)

    );

}


/* =========================================================
   47. ESCAPE HTML
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
   48. TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    let toast =
        document.querySelector(
            "#toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        toast.className =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    const icon =
        type === "error"

            ? "fa-circle-exclamation"

            : "fa-circle-check";


    toast.innerHTML = `

        <i class="
            fas
            ${icon}
        "></i>

        <span>
            ${escapeHTML(
                message
            )}
        </span>

    `;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toast._timer
    );


    toast._timer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   49. GLOBAL FUNCTIONS
   Allows HTML onclick="" to work
========================================================= */

window.editCustomer =
    editCustomer;

window.deleteCustomer =
    deleteCustomer;

window.sendWhatsApp =
    sendWhatsApp;

window.copyWhatsAppMessage =
    copyWhatsAppMessage;

window.downloadQR =
    downloadQR;

window.generatePaymentQR =
    generatePaymentQR;

window.toggleTheme =
    toggleTheme;

window.showPage =
    showPage;

window.resetCustomerForm =
    resetCustomerForm;


/* =========================================================
   50. AUTO REFRESH
========================================================= */

setInterval(
    function () {

        updateExpiryStatuses();

        updateDashboard();

        renderUsers();

        renderRecentUsers();

        updateStatusChart();

    },
    60000
);


/* =========================================================
   END OF script.js
========================================================= */