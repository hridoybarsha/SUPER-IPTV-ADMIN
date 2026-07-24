"use strict";

/* =========================================================
   SUPER IPTV MANAGEMENT PANEL
   FINAL PROFESSIONAL SCRIPT.JS
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
    portal: "http://geoiptv.one:8880",
    businessName: "SUPER IPTV"
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

🔐 LOGIN CREDENTIALS

Username : {{USERNAME}}
Password : {{PASSWORD}}
Portal URL : {{PORTAL_URL}}

━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION DETAILS

Plan       : {{PLAN}}
Amount     : ₹{{AMOUNT}}
Valid Upto : {{EXPIRY}}

━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT INFORMATION

UPI ID : {{UPI_ID}}
Contact : {{CONTACT}}

━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT

• Complete payment using UPI
• Send payment screenshot after payment
• Account activation after payment confirmation

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
let settings = {};
let messageTemplate = DEFAULT_TEMPLATE;


/* =========================================================
   5. SAFE GET ELEMENT
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   6. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   7. LOAD DATABASE
========================================================= */

function loadDatabase() {

    try {

        const savedUsers =
            localStorage.getItem("SUPER_IPTV_USERS");

        const savedPayments =
            localStorage.getItem("SUPER_IPTV_PAYMENTS");

        const savedSettings =
            localStorage.getItem("SUPER_IPTV_SETTINGS");

        const savedTemplate =
            localStorage.getItem("SUPER_IPTV_TEMPLATE");


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
            "SUPER_IPTV_USERS",
            JSON.stringify(users)
        );


        localStorage.setItem(
            "SUPER_IPTV_PAYMENTS",
            JSON.stringify(payments)
        );


        localStorage.setItem(
            "SUPER_IPTV_SETTINGS",
            JSON.stringify(settings)
        );


        localStorage.setItem(
            "SUPER_IPTV_TEMPLATE",
            messageTemplate
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
   9. DATE FUNCTIONS
========================================================= */

function calculateExpiry(plan) {

    const date = new Date();

    const months = {
        "1 Month": 1,
        "3 Months": 3,
        "6 Months": 6,
        "12 Months": 12
    };


    if (months[plan]) {

        date.setMonth(
            date.getMonth() +
            months[plan]
        );

    }


    return date;

}


/* =========================================================
   10. FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const d =
        new Date(date);


    if (
        isNaN(
            d.getTime()
        )
    ) {

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
   11. USER STATUS
========================================================= */

function isUserActive(user) {

    if (!user.expiry) {
        return false;
    }


    return new Date(
        user.expiry
    ) >= new Date();

}


/* =========================================================
   12. STANDARD UPI QR DATA
========================================================= */

function createUPILink(
    amount,
    plan = ""
) {

    const upi =
        String(
            settings.upi || ""
        ).trim();


    const businessName =
        String(
            settings.businessName ||
            "SUPER IPTV"
        ).trim();


    const numericAmount =
        Number(amount);


    if (!upi) {
        return "";
    }


    if (
        !numericAmount ||
        numericAmount <= 0
    ) {

        return "";

    }


    /*
       Standard UPI deep link.

       Compatible structure for:
       - PhonePe
       - Google Pay
       - Paytm
       - BHIM
       - Other UPI apps

       Note:
       Actual app compatibility depends
       on the receiving UPI ID/account.
    */


    const params = new URLSearchParams({

        pa: upi,

        pn: businessName,

        am:
            numericAmount.toFixed(2),

        cu: "INR",

        tn:
            plan
                ? `${businessName} - ${plan}`
                : businessName

    });


    return (
        "upi://pay?" +
        params.toString()
    );

}


/* =========================================================
   13. GENERATE QR
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


    const upiLink =
        createUPILink(
            amount,
            plan
        );


    if (!upiLink) {

        if (qrPlan) {

            qrPlan.innerHTML =
                "Please configure a valid UPI ID in Settings.";

        }

        return;

    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        if (qrPlan) {

            qrPlan.innerHTML =
                "QR library is not loaded.";

        }

        return;

    }


    try {

        new QRCode(
            qrContainer,
            {

                text:
                    upiLink,

                width:
                    260,

                height:
                    260,

                colorDark:
                    "#000000",

                colorLight:
                    "#ffffff",

                correctLevel:
                    QRCode.CorrectLevel.M

            }
        );


        if (qrPlan) {

            qrPlan.innerHTML = `

                <strong>
                    ${escapeHTML(plan)}
                </strong>

                <br><br>

                Scan & Pay
                ₹${amount}

                <br><br>

                UPI ID:
                ${escapeHTML(settings.upi)}

                <br><br>

                <small>
                    Open with PhonePe,
                    Google Pay,
                    Paytm or any UPI app.
                </small>

            `;

        }


    } catch (error) {

        console.error(
            "QR Error:",
            error
        );

        if (qrPlan) {

            qrPlan.innerHTML =
                "Unable to generate QR.";

        }

    }

}


/* =========================================================
   14. DOWNLOAD CURRENT QR
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


    if (canvas) {

        const link =
            document.createElement(
                "a"
            );


        link.download =
            "SUPER-IPTV-Payment-QR.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

        return;

    }


    if (image) {

        const link =
            document.createElement(
                "a"
            );


        link.download =
            "SUPER-IPTV-Payment-QR.png";


        link.href =
            image.src;


        link.click();

        return;

    }


    alert(
        "Please select a plan first."
    );

}


/* =========================================================
   15. SETUP USER FORM
========================================================= */

function setupUserForm() {

    const form =
        getElement("userForm");


    if (!form) {
        return;
    }


    const planSelect =
        getElement("plan");


    if (planSelect) {

        planSelect.addEventListener(
            "change",
            function() {

                generateQR(
                    this.value
                );

            }
        );

    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                getElement(
                    "customerName"
                )?.value.trim();


            const phone =
                getElement(
                    "phone"
                )?.value.trim();


            const username =
                getElement(
                    "username"
                )?.value.trim();


            const password =
                getElement(
                    "password"
                )?.value.trim();


            const portalUrl =
                getElement(
                    "portalUrl"
                )?.value.trim();


            const plan =
                getElement(
                    "plan"
                )?.value;


            const paymentStatus =
                getElement(
                    "paymentStatus"
                )?.value ||
                "Pending";


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


            const expiry =
                calculateExpiry(
                    plan
                );


            const userId =
                Date.now();


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
                    new Date()
                        .toISOString(),

                expiry:
                    expiry
                        .toISOString()

            };


            users.push(
                user
            );


            payments.push({

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
                    new Date()
                        .toISOString()

            });


            saveDatabase();


            renderUsers();

            renderPayments();

            updateDashboard();

            updatePaymentSummary();

            updateReports();


            alert(
                "Customer added successfully!"
            );


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
   16. RENDER USERS
========================================================= */

function renderUsers() {

    const table =
        getElement(
            "usersTable"
        );


    if (!table) {
        return;
    }


    const search =
        getElement(
            "searchUser"
        )?.value
            .toLowerCase()
            .trim() ||
        "";


    const statusFilter =
        getElement(
            "statusFilter"
        )?.value ||
        "all";


    const planFilter =
        getElement(
            "planFilter"
        )?.value ||
        "all";


    const filtered =
        users.filter(
            function(user) {

                const active =
                    isUserActive(
                        user
                    );


                const searchMatch =

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
                    .includes(search);


                const statusMatch =

                    statusFilter ===
                    "all"

                    ||

                    (
                        statusFilter ===
                        "active" &&
                        active
                    )

                    ||

                    (
                        statusFilter ===
                        "expired" &&
                        !active
                    );


                const planMatch =

                    planFilter ===
                    "all"

                    ||

                    user.plan ===
                    planFilter;


                return (
                    searchMatch &&
                    statusMatch &&
                    planMatch
                );

            }
        );


    if (
        filtered.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="10">
                    No customers found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        filtered
            .slice()
            .reverse()
            .map(
                function(user) {

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
                                user.username
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
                            ${formatDate(
                                user.expiry
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

                            <button
                                class="action-btn whatsapp-btn"
                                onclick="sendWhatsApp('${user.id}')"
                            >
                                WhatsApp
                            </button>

                            <button
                                class="action-btn copy-btn"
                                onclick="copyUserMessage('${user.id}')"
                            >
                                Copy
                            </button>

                            <button
                                class="action-btn delete-btn"
                                onclick="deleteUser('${user.id}')"
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


/* =========================================================
   17. SEARCH EVENTS
========================================================= */

function setupUserFilters() {

    [
        "searchUser",
        "statusFilter",
        "planFilter"
    ]
    .forEach(
        function(id) {

            const element =
                getElement(id);


            if (element) {

                element.addEventListener(
                    "input",
                    renderUsers
                );


                element.addEventListener(
                    "change",
                    renderUsers
                );

            }

        }
    );

}


/* =========================================================
   18. DELETE USER
========================================================= */

function deleteUser(id) {

    const user =
        users.find(
            item =>
                String(item.id) ===
                String(id)
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
                String(item.id) !==
                String(id)
        );


    payments =
        payments.filter(
            item =>
                String(item.userId) !==
                String(id)
        );


    saveDatabase();


    renderUsers();

    renderPayments();

    updateDashboard();

    updatePaymentSummary();

    updateReports();

}


/* =========================================================
   19. CREATE MESSAGE
========================================================= */

function createUserMessage(user) {

    return messageTemplate

        .replace(
            /{{USERNAME}}/g,
            user.username || ""
        )

        .replace(
            /{{PASSWORD}}/g,
            user.password || ""
        )

        .replace(
            /{{PORTAL_URL}}/g,
            user.portalUrl || ""
        )

        .replace(
            /{{PLAN}}/g,
            user.plan || ""
        )

        .replace(
            /{{AMOUNT}}/g,
            user.amount || ""
        )

        .replace(
            /{{EXPIRY}}/g,
            formatDate(
                user.expiry
            )
        )

        .replace(
            /{{UPI_ID}}/g,
            settings.upi || ""
        )

        .replace(
            /{{CONTACT}}/g,
            settings.contact || ""
        );

}


/* =========================================================
   20. WHATSAPP
========================================================= */

function sendWhatsApp(id) {

    const user =
        users.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!user) {

        alert(
            "Customer not found."
        );

        return;

    }


    const message =
        createUserMessage(
            user
        );


    let phone =
        String(
            user.phone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        phone.length ===
        10
    ) {

        phone =
            "91" +
            phone;

    }


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
   21. COPY USER MESSAGE
========================================================= */

async function copyUserMessage(id) {

    const user =
        users.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!user) {
        return;
    }


    const message =
        createUserMessage(
            user
        );


    try {

        await navigator.clipboard.writeText(
            message
        );


        alert(
            "Message copied!"
        );


    } catch (error) {

        alert(
            "Copy failed."
        );

    }

}


/* =========================================================
   22. RENDER PAYMENTS
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
        payments.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="7">
                    No payment records found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        payments
            .slice()
            .reverse()
            .map(
                function(payment) {

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
                            ${escapeHTML(
                                payment.status
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                payment.date
                            )}
                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   23. PAYMENT SUMMARY
========================================================= */

function updatePaymentSummary() {

    const totalPayments =
        payments.length;


    const paidPayments =
        payments.filter(
            payment =>
                String(
                    payment.status
                ).toLowerCase() ===
                "paid"
        );


    const totalRevenue =
        paidPayments.reduce(
            (
                total,
                payment
            ) =>

                total +
                Number(
                    payment.amount || 0
                ),

            0
        );


    const totalElement =
        getElement(
            "totalPayments"
        );


    const revenueElement =
        getElement(
            "totalRevenue"
        );


    if (totalElement) {

        totalElement.textContent =
            totalPayments;

    }


    if (revenueElement) {

        revenueElement.textContent =
            "₹" +
            totalRevenue;

    }

}


/* =========================================================
   24. DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(
            isUserActive
        ).length;


    const expired =
        total -
        active;


    const revenue =
        payments
            .filter(
                payment =>
                    String(
                        payment.status
                    ).toLowerCase() ===
                    "paid"
            )
            .reduce(
                (
                    sum,
                    payment
                ) =>

                    sum +
                    Number(
                        payment.amount || 0
                    ),

                0
            );


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

}


/* =========================================================
   25. REPORTS
========================================================= */

function updateReports() {

    const reportTotal =
        getElement(
            "reportTotalUsers"
        );


    const reportActive =
        getElement(
            "reportActiveUsers"
        );


    const reportExpired =
        getElement(
            "reportExpiredUsers"
        );


    if (reportTotal) {

        reportTotal.textContent =
            users.length;

    }


    if (reportActive) {

        reportActive.textContent =
            users.filter(
                isUserActive
            ).length;

    }


    if (reportExpired) {

        reportExpired.textContent =
            users.filter(
                user =>
                    !isUserActive(
                        user
                    )
            ).length;

    }

}


/* =========================================================
   26. SETTINGS LOAD
========================================================= */

function loadSettings() {

    const upi =
        getElement(
            "settingUPI"
        );


    const contact =
        getElement(
            "settingContact"
        );


    const portal =
        getElement(
            "settingPortal"
        );


    const business =
        getElement(
            "settingBusinessName"
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


    if (business) {

        business.value =
            settings.businessName || "";

    }


    if (template) {

        template.value =
            messageTemplate;

    }

}


/* =========================================================
   27. SETTINGS SAVE
========================================================= */

function setupSettings() {

    const form =
        getElement(
            "settingsForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            settings.upi =
                getElement(
                    "settingUPI"
                )?.value.trim() ||
                "";


            settings.contact =
                getElement(
                    "settingContact"
                )?.value.trim() ||
                "";


            settings.portal =
                getElement(
                    "settingPortal"
                )?.value.trim() ||
                "";


            settings.businessName =
                getElement(
                    "settingBusinessName"
                )?.value.trim() ||
                "SUPER IPTV";


            messageTemplate =
                getElement(
                    "messageTemplate"
                )?.value ||
                DEFAULT_TEMPLATE;


            saveDatabase();


            alert(
                "Settings saved successfully!"
            );

        }
    );

}


/* =========================================================
   28. BACKUP DATA
========================================================= */

function exportBackup() {

    const backup = {

        users:
            users,

        payments:
            payments,

        settings:
            settings,

        messageTemplate:
            messageTemplate,

        exportedAt:
            new Date()
                .toISOString()

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
        "SUPER-IPTV-Backup.json";


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   29. RESTORE BACKUP
========================================================= */

function importBackupFile(
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
        function() {

            try {

                const data =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !confirm(
                        "Restore backup? Existing data will be replaced."
                    )
                ) {

                    return;

                }


                users =
                    Array.isArray(
                        data.users
                    )
                        ? data.users
                        : [];


                payments =
                    Array.isArray(
                        data.payments
                    )
                        ? data.payments
                        : [];


                settings = {

                    ...DEFAULT_SETTINGS,

                    ...(data.settings || {})

                };


                messageTemplate =
                    data.messageTemplate ||
                    DEFAULT_TEMPLATE;


                saveDatabase();


                updateDashboard();

                renderUsers();

                renderPayments();

                updatePaymentSummary();

                updateReports();

                loadSettings();


                alert(
                    "Backup restored successfully!"
                );


            } catch (error) {

                alert(
                    "Invalid backup file."
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   30. CLEAR ALL DATA
========================================================= */

function clearAllData() {

    const confirmClear =
        confirm(
            "WARNING!\n\nThis will permanently delete all users and payment records.\n\nContinue?"
        );


    if (!confirmClear) {
        return;
    }


    users = [];

    payments = [];


    saveDatabase();


    updateDashboard();

    renderUsers();

    renderPayments();

    updatePaymentSummary();

    updateReports();


    alert(
        "All data cleared."
    );

}


/* =========================================================
   31. NAVIGATION
========================================================= */

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".menu-btn"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const page =
                        this.dataset.page;


                    buttons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    pages.forEach(
                        section =>
                            section.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );


                    const target =
                        getElement(
                            page
                        );


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    if (
                        page ===
                        "dashboard"
                    ) {

                        updateDashboard();

                    }


                    if (
                        page ===
                        "users"
                    ) {

                        renderUsers();

                    }


                    if (
                        page ===
                        "payments"
                    ) {

                        renderPayments();

                        updatePaymentSummary();

                    }


                    if (
                        page ===
                        "reports"
                    ) {

                        updateReports();

                    }


                    if (
                        page ===
                        "settings"
                    ) {

                        loadSettings();

                    }

                }
            );

        }
    );

}


/* =========================================================
   32. GLOBAL BUTTON EVENTS
========================================================= */

function setupGlobalEvents() {

    const downloadQR =
        getElement(
            "downloadQR"
        );


    if (downloadQR) {

        downloadQR.addEventListener(
            "click",
            downloadCurrentQR
        );

    }


    const exportBtn =
        getElement(
            "exportBackup"
        );


    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            exportBackup
        );

    }


    const importInput =
        getElement(
            "importBackup"
        );


    if (importInput) {

        importInput.addEventListener(
            "change",
            importBackupFile
        );

    }


    const clearBtn =
        getElement(
            "clearAllData"
        );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearAllData
        );

    }

}


/* =========================================================
   33. INITIALIZE APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDatabase();


        setupNavigation();


        setupUserForm();


        setupUserFilters();


        setupSettings();


        setupGlobalEvents();


        updateDashboard();


        renderUsers();


        renderPayments();


        updatePaymentSummary();


        updateReports();


        loadSettings();


        /*
           Default portal URL
        */

        const portal =
            getElement(
                "portalUrl"
            );


        if (
            portal &&
            !portal.value
        ) {

            portal.value =
                settings.portal;

        }

    }
);


/* =========================================================
   34. GLOBAL FUNCTIONS
========================================================= */

window.generateQR =
    generateQR;


window.downloadCurrentQR =
    downloadCurrentQR;


window.deleteUser =
    deleteUser;


window.sendWhatsApp =
    sendWhatsApp;


window.copyUserMessage =
    copyUserMessage;


window.exportBackup =
    exportBackup;


window.importBackupFile =
    importBackupFile;


window.clearAllData =
    clearAllData;