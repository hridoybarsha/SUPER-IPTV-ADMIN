// ============================================================
// SUPER IPTV - USERS MANAGER
// Complete Fixed Version - Part 1
// ============================================================

// Load users from LocalStorage
let users = JSON.parse(localStorage.getItem("users")) || [];


// ============================================================
// PLAN PRICES
// ============================================================

function getAmount(plan) {

    switch (plan) {

        case "1 Month":
            return 200;

        case "3 Months":
            return 550;

        case "6 Months":
            return 1000;

        case "12 Months":
            return 1800;

        default:
            return 0;
    }
}


// ============================================================
// GENERATE RANDOM USERNAME
// ============================================================

function generateUsername() {

    return Math.random()
        .toString(16)
        .substring(2, 10);

}


// ============================================================
// GENERATE RANDOM PASSWORD
// ============================================================

function generatePassword() {

    return Math.random()
        .toString(16)
        .substring(2, 10);

}


// ============================================================
// GET EXPIRY DATE
// ============================================================

function getExpiry(plan) {

    let date = new Date();

    switch (plan) {

        case "1 Month":
            date.setMonth(date.getMonth() + 1);
            break;

        case "3 Months":
            date.setMonth(date.getMonth() + 3);
            break;

        case "6 Months":
            date.setMonth(date.getMonth() + 6);
            break;

        case "12 Months":
            date.setFullYear(date.getFullYear() + 1);
            break;

        default:
            break;
    }

    return date.toISOString().split("T")[0];
}


// ============================================================
// SAVE USER
// ============================================================

function saveUser() {

    // Get form values
    let phone =
        document.getElementById("phone").value.trim();

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();

    let portal =
        document.getElementById("portal").value.trim();

    let plan =
        document.getElementById("plan").value;


    // Validate Phone
    if (phone === "") {

        alert("Please enter phone number.");

        return;
    }


    // Auto Generate Username
    if (username === "") {

        username = generateUsername();

        document.getElementById("username").value =
            username;
    }


    // Auto Generate Password
    if (password === "") {

        password = generatePassword();

        document.getElementById("password").value =
            password;
    }


    // Validate Portal
    if (portal === "") {

        alert("Please enter Portal URL.");

        return;
    }


    // Get Amount
    let amount = getAmount(plan);


    // Get Expiry
    let expiry = getExpiry(plan);


    // Create User Object
    let newUser = {

        id: Date.now(),

        phone: phone,

        username: username,

        password: password,

        portal: portal,

        plan: plan,

        amount: amount,

        expiry: expiry,

        status: "Active",

        createdAt:
            new Date().toISOString()

    };


    // Add User
    users.push(newUser);


    // Save Users
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // ========================================================
    // AUTO SAVE PAYMENT
    // ========================================================

    let payments =
        JSON.parse(
            localStorage.getItem("payments")
        ) || [];


    let newPayment = {

        id: Date.now(),

        user: username,

        phone: phone,

        amount: amount,

        method: "UPI",

        plan: plan,

        date:
            new Date().toLocaleDateString(),

        status: "Pending"

    };


    payments.push(newPayment);


    // Save Payment
    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );


    // ========================================================
    // UPDATE USER TABLE
    // ========================================================

    loadUsers();


    // ========================================================
    // UPDATE DASHBOARD CARDS
    // ========================================================

    updateCards();


    // ========================================================
    // CLEAR FORM
    // ========================================================

    clearForm();


    // ========================================================
    // SHOW SUCCESS MESSAGE
    // ========================================================

    alert(
        "User Added Successfully!\n\n" +
        "Username: " + username + "\n" +
        "Password: " + password + "\n" +
        "Plan: " + plan + "\n" +
        "Amount: ₹" + amount + "\n" +
        "Expiry: " + expiry
    );


    // ========================================================
    // OPEN WHATSAPP
    // ========================================================

    sendWhatsApp(
        newUser
    );

}


// ============================================================
// CLEAR FORM
// ============================================================

function clearForm() {

    document.getElementById("phone").value = "";

    document.getElementById("username").value = "";

    document.getElementById("password").value = "";

    document.getElementById("portal").value = "";

    document.getElementById("plan").selectedIndex = 0;

}


// ============================================================
// CHECK USER STATUS
// ============================================================

function getUserStatus(expiry) {

    let today =
        new Date()
        .toISOString()
        .split("T")[0];


    if (expiry >= today) {

        return "Active";

    } else {

        return "Expired";

    }

}


// ============================================================
// LOAD USERS
// ============================================================

function loadUsers() {

    // Reload latest data
    users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    let table =
        document.getElementById(
            "userTable"
        );


    // Check table exists
    if (!table) {

        return;

    }


    // Clear table
    table.innerHTML = "";


    // Show Empty Message
    if (users.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="7">

                No Users Found

            </td>

        </tr>

        `;

        return;

    }


    // Loop Users
    users.forEach(
        function (u, index) {


            // Get Status
            let status =
                getUserStatus(
                    u.expiry
                );


            // Update stored status
            u.status = status;


            // Get Amount
            let amount =
                u.amount ||
                getAmount(u.plan);


            // Create Table Row
            table.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${u.phone}
                </td>

                <td>
                    ${u.username}
                </td>

                <td>
                    ${u.plan}
                </td>

                <td>
                    ₹${amount}
                </td>

                <td>
                    ${status}
                </td>

                <td>
                    ${u.expiry}
                </td>

                <td>

                    <button
                    class="action whatsapp"
                    onclick="sendWhatsAppByIndex(${index})">

                    WhatsApp

                    </button>


                    <button
                    class="action call"
                    onclick="callUser(${index})">

                    Call

                    </button>


                    <button
                    class="action edit"
                    onclick="editUser(${index})">

                    Edit

                    </button>


                    <button
                    class="action delete"
                    onclick="deleteUser(${index})">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        }
    );


    // Save updated statuses
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


// ============================================================
// WHATSAPP MESSAGE
// ============================================================

function sendWhatsApp(user) {

    let amount =
        user.amount ||
        getAmount(user.plan);


    let message =

`━━━━━━━━━━━━━━━━━━━━━━
        SERVICE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━

Hello 👋

Your IPTV account has been successfully created and is now ready for use.

━━━━━━━━━━━━━━━━━━━━━━
🔐 LOGIN CREDENTIALS
Username : ${user.username}
Password : ${user.password}
Portal URL : ${user.portal}
━━━━━━━━━━━━━━━━━━━━━━

📦 SUBSCRIPTION DETAILS
Plan       : ${user.plan}
Amount     : ₹${amount}
Valid Upto : ${user.expiry}

━━━━━━━━━━━━━━━━━━━━━━
💳 PAYMENT INFORMATION
UPI ID : 6289033804@ptsbi
Contact Number : 6289033804

Scan QR code available in dashboard
━━━━━━━━━━━━━━━━━━━━━━

📌 IMPORTANT INSTRUCTIONS
• Complete payment via UPI
• Send payment screenshot
• Account will be activated/renewed immediately

━━━━━━━━━━━━━━━━━━━━━━
📞 SUPPORT
WhatsApp / Call : 6289033804

For any assistance, reply to this message.

Thank you for choosing our service.
━━━━━━━━━━━━━━━━━━━━━━`;


    // Remove + from phone
    let phone =
        String(user.phone)
        .replace(/\D/g, "");


    // Add India country code
    if (
        phone.length === 10
    ) {

        phone =
            "91" + phone;

    }


    // WhatsApp URL
    let whatsappURL =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(message);


    // Open WhatsApp
    window.open(
        whatsappURL,
        "_blank"
    );

}


// ============================================================
// SEND WHATSAPP FROM TABLE
// ============================================================

function sendWhatsAppByIndex(index) {

    if (
        !users[index]
    ) {

        alert(
            "User not found."
        );

        return;

    }


    sendWhatsApp(
        users[index]
    );

}


// ============================================================
// CALL USER
// ============================================================

function callUser(index) {

    if (
        !users[index]
    ) {

        return;

    }


    let phone =
        users[index].phone;


    window.location.href =
        "tel:" + phone;

}
// ============================================================
// DELETE USER
// ============================================================

function deleteUser(index) {

    if (!users[index]) {
        alert("User not found.");
        return;
    }

    let username = users[index].username;

    if (confirm("Delete user: " + username + "?")) {

        // Delete User
        users.splice(index, 1);

        // Save Users
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        // Reload
        loadUsers();

        // Update Cards
        updateCards();

        alert("User Deleted Successfully.");

    }

}


// ============================================================
// EDIT USER
// ============================================================

function editUser(index) {

    if (!users[index]) {
        alert("User not found.");
        return;
    }

    let user = users[index];

    // Fill Form
    document.getElementById("phone").value =
        user.phone || "";

    document.getElementById("username").value =
        user.username || "";

    document.getElementById("password").value =
        user.password || "";

    document.getElementById("portal").value =
        user.portal || "";

    document.getElementById("plan").value =
        user.plan || "1 Month";


    // Remove Old User
    users.splice(index, 1);

    // Save
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // Reload
    loadUsers();

    updateCards();


    // Scroll to Form
    let form =
        document.querySelector(".form");

    if (form) {

        form.scrollIntoView({
            behavior: "smooth"
        });

    }


    alert(
        "User details loaded.\n" +
        "Edit the information and click Add User to save."
    );

}


// ============================================================
// RENEW USER
// ============================================================

function renewUser(index) {

    if (!users[index]) {
        alert("User not found.");
        return;
    }

    let user = users[index];


    let plan = prompt(
        "Enter Renew Plan:\n\n" +
        "1 = 1 Month\n" +
        "3 = 3 Months\n" +
        "6 = 6 Months\n" +
        "12 = 12 Months"
    );


    if (!plan) {
        return;
    }


    let months =
        parseInt(plan);


    if (
        months !== 1 &&
        months !== 3 &&
        months !== 6 &&
        months !== 12
    ) {

        alert(
            "Invalid plan."
        );

        return;

    }


    // Current Date
    let today =
        new Date();


    // Current Expiry
    let expiry =
        new Date(
            user.expiry
        );


    // If Already Expired
    if (
        expiry < today
    ) {

        expiry =
            new Date();

    }


    // Add Months
    expiry.setMonth(
        expiry.getMonth() +
        months
    );


    // Plan Name
    let planName;


    if (months === 1) {

        planName =
            "1 Month";

    }

    else if (months === 3) {

        planName =
            "3 Months";

    }

    else if (months === 6) {

        planName =
            "6 Months";

    }

    else {

        planName =
            "12 Months";

    }


    // Update User
    user.plan =
        planName;


    user.amount =
        getAmount(
            planName
        );


    user.expiry =
        expiry
        .toISOString()
        .split("T")[0];


    user.status =
        "Active";


    // Save
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // Add Renewal Payment
    let payments =
        JSON.parse(
            localStorage.getItem(
                "payments"
            )
        ) || [];


    payments.push({

        id: Date.now(),

        user:
            user.username,

        phone:
            user.phone,

        amount:
            user.amount,

        method:
            "UPI",

        plan:
            user.plan,

        date:
            new Date()
            .toLocaleDateString(),

        status:
            "Pending",

        type:
            "Renewal"

    });


    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );


    // Reload
    loadUsers();

    updateCards();


    alert(
        "User Renewed Successfully!\n\n" +
        "Username: " +
        user.username +
        "\nPlan: " +
        user.plan +
        "\nAmount: ₹" +
        user.amount +
        "\nNew Expiry: " +
        user.expiry
    );

}


// ============================================================
// SEARCH USERS
// ============================================================

function searchUsers() {

    let searchInput =
        document.getElementById(
            "search"
        );


    if (!searchInput) {
        return;
    }


    let value =
        searchInput.value
        .toLowerCase()
        .trim();


    let rows =
        document.querySelectorAll(
            "#userTable tr"
        );


    rows.forEach(
        function(row) {

            let text =
                row.innerText
                .toLowerCase();


            if (
                text.includes(value)
            ) {

                row.style.display =
                    "";

            }

            else {

                row.style.display =
                    "none";

            }

        }
    );

}


// ============================================================
// UPDATE DASHBOARD CARDS
// ============================================================

function updateCards() {

    // Reload Users
    users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    let today =
        new Date()
        .toISOString()
        .split("T")[0];


    let total =
        users.length;


    let active =
        0;


    let expired =
        0;


    let revenue =
        0;


    // Calculate Users
    users.forEach(
        function(user) {

            // Status
            if (
                user.expiry >= today
            ) {

                active++;

            }

            else {

                expired++;

            }


            // Revenue
            revenue +=
                Number(
                    user.amount ||
                    getAmount(
                        user.plan
                    )
                );

        }
    );


    // Total Users
    let totalElement =
        document.getElementById(
            "totalUsers"
        );


    if (totalElement) {

        totalElement.innerText =
            total;

    }


    // Active Users
    let activeElement =
        document.getElementById(
            "activeUsers"
        );


    if (activeElement) {

        activeElement.innerText =
            active;

    }


    // Expired Users
    let expiredElement =
        document.getElementById(
            "expiredUsers"
        );


    if (expiredElement) {

        expiredElement.innerText =
            expired;

    }


    // Revenue
    let revenueElement =
        document.getElementById(
            "revenue"
        );


    if (revenueElement) {

        revenueElement.innerText =
            "₹" +
            revenue;

    }

}


// ============================================================
// AUTO CHECK EXPIRED USERS
// ============================================================

function checkExpiredUsers() {

    users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    let today =
        new Date()
        .toISOString()
        .split("T")[0];


    let changed =
        false;


    users.forEach(
        function(user) {

            let newStatus;


            if (
                user.expiry >= today
            ) {

                newStatus =
                    "Active";

            }

            else {

                newStatus =
                    "Expired";

            }


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


    // Save Changes
    if (changed) {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }

}


// ============================================================
// GENERATE UPI QR DATA
// ============================================================

function generateQRData(amount) {

    if (
        !amount ||
        Number(amount) <= 0
    ) {

        return "";

    }


    let upiID =
        "6289033804@ptsbi";


    let name =
        "SUPER IPTV";


    let upiURL =
        "upi://pay" +
        "?pa=" +
        encodeURIComponent(
            upiID
        ) +
        "&pn=" +
        encodeURIComponent(
            name
        ) +
        "&am=" +
        encodeURIComponent(
            amount
        ) +
        "&cu=INR";


    return upiURL;

}


// ============================================================
// GENERATE QR CODE
// ============================================================

function generateQR(amount) {

    let qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {

        return;

    }


    // Clear Old QR
    qrContainer.innerHTML =
        "";


    if (
        !amount ||
        Number(amount) <= 0
    ) {

        return;

    }


    let upiURL =
        generateQRData(
            amount
        );


    // Check QRCode Library
    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.log(
            "QRCode library not loaded."
        );

        return;

    }


    // Generate QR
    new QRCode(
        qrContainer,
        {

            text:
                upiURL,

            width:
                220,

            height:
                220

        }
    );


    // Show Amount
    let amountText =
        document.getElementById(
            "qrAmount"
        );


    if (amountText) {

        amountText.innerText =
            "Scan to Pay ₹" +
            amount;

    }

}


// ============================================================
// AUTO QR WHEN PLAN CHANGES
// ============================================================

function updatePlanQR() {

    let planElement =
        document.getElementById(
            "plan"
        );


    if (!planElement) {

        return;

    }


    let plan =
        planElement.value;


    let amount =
        getAmount(
            plan
        );


    generateQR(
        amount
    );

}


// ============================================================
// INITIALIZE PAGE
// ============================================================

window.addEventListener(
    "load",
    function() {

        // Check Expiry
        checkExpiredUsers();


        // Load Users
        loadUsers();


        // Update Cards
        updateCards();


        // Search
        let searchInput =
            document.getElementById(
                "search"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchUsers
            );

        }


        // Plan Change
        let planElement =
            document.getElementById(
                "plan"
            );


        if (planElement) {

            planElement.addEventListener(
                "change",
                updatePlanQR
            );

        }


        // Generate Default QR
        updatePlanQR();

    }
);
// ============================================================
// COPY LOGIN DETAILS
// ============================================================

function copyLoginDetails(index) {

    if (!users[index]) {
        alert("User not found.");
        return;
    }

    let user = users[index];

    let text =
`SUPER IPTV

Username : ${user.username}
Password : ${user.password}
Portal URL : ${user.portal}

Plan : ${user.plan}
Amount : ₹${user.amount || getAmount(user.plan)}
Valid Upto : ${user.expiry}`;

    navigator.clipboard.writeText(text)
        .then(function() {

            alert(
                "Login Details Copied Successfully!"
            );

        })
        .catch(function() {

            alert(
                "Unable to copy details."
            );

        });

}


// ============================================================
// GET PAYMENT HISTORY FOR USER
// ============================================================

function getUserPayments(username) {

    let payments =
        JSON.parse(
            localStorage.getItem("payments")
        ) || [];

    return payments.filter(
        function(payment) {

            return payment.user === username;

        }
    );

}


// ============================================================
// MARK PAYMENT AS PAID
// ============================================================

function markPaymentPaid(paymentId) {

    let payments =
        JSON.parse(
            localStorage.getItem("payments")
        ) || [];


    let payment =
        payments.find(
            function(p) {

                return p.id === paymentId;

            }
        );


    if (!payment) {

        alert(
            "Payment not found."
        );

        return;

    }


    payment.status =
        "Paid";


    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );


    alert(
        "Payment marked as Paid."
    );

}


// ============================================================
// GET USER BY USERNAME
// ============================================================

function findUser(username) {

    return users.find(
        function(user) {

            return user.username
                .toLowerCase() ===
                username.toLowerCase();

        }
    );

}


// ============================================================
// OPEN PAYMENT PAGE
// ============================================================

function openPaymentPage(index) {

    if (!users[index]) {

        alert(
            "User not found."
        );

        return;

    }


    let user =
        users[index];


    // Save Selected User
    localStorage.setItem(
        "selectedPaymentUser",
        JSON.stringify(user)
    );


    // Open Payments Page
    window.location.href =
        "payments.html";

}


// ============================================================
// SHOW USER DETAILS
// ============================================================

function viewUser(index) {

    if (!users[index]) {

        alert(
            "User not found."
        );

        return;

    }


    let user =
        users[index];


    let amount =
        user.amount ||
        getAmount(
            user.plan
        );


    alert(

`USER DETAILS

Username : ${user.username}
Password : ${user.password}
Phone : ${user.phone}
Portal : ${user.portal}

Plan : ${user.plan}
Amount : ₹${amount}

Status : ${user.status}
Expiry : ${user.expiry}`

    );

}


// ============================================================
// EXPORT USERS AS CSV
// ============================================================

function exportUsersCSV() {

    if (
        users.length === 0
    ) {

        alert(
            "No users available."
        );

        return;

    }


    let csv =

        "ID,Phone,Username,Password,Portal,Plan,Amount,Expiry,Status\n";


    users.forEach(
        function(user) {

            csv +=

                `"${user.id}",` +
                `"${user.phone}",` +
                `"${user.username}",` +
                `"${user.password}",` +
                `"${user.portal}",` +
                `"${user.plan}",` +
                `"${user.amount || getAmount(user.plan)}",` +
                `"${user.expiry}",` +
                `"${user.status}"\n`;

        }
    );


    let blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    let url =
        URL.createObjectURL(
            blob
        );


    let link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "super-iptv-users.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ============================================================
// REFRESH USERS
// ============================================================

function refreshUsers() {

    checkExpiredUsers();

    loadUsers();

    updateCards();

}


// ============================================================
// AUTO REFRESH EVERY 60 SECONDS
// ============================================================

setInterval(
    function() {

        checkExpiredUsers();

        loadUsers();

        updateCards();

    },
    60000
);