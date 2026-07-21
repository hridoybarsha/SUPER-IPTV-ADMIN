// ============================================================
// SUPER IPTV - PAYMENT MANAGER
// ============================================================


// Load Payments
let payments =
    JSON.parse(
        localStorage.getItem("payments")
    ) || [];


// ============================================================
// ADD PAYMENT
// ============================================================

function addPayment() {

    let username =
        document
        .getElementById("payUser")
        .value
        .trim();


    let phone =
        document
        .getElementById("payPhone")
        .value
        .trim();


    let amount =
        document
        .getElementById("amount")
        .value
        .trim();


    let method =
        document
        .getElementById("method")
        .value;


    let status =
        document
        .getElementById("paymentStatus")
        .value;



    // Validation
    if (
        username === "" ||
        amount === ""
    ) {

        alert(
            "Please enter Username and Amount."
        );

        return;

    }



    // Create Payment
    let payment = {

        id:
            Date.now(),

        user:
            username,

        phone:
            phone,

        amount:
            Number(amount),

        method:
            method,

        status:
            status,

        date:
            new Date()
            .toLocaleDateString()

    };



    // Add Payment
    payments.push(
        payment
    );



    // Save LocalStorage
    localStorage.setItem(
        "payments",
        JSON.stringify(
            payments
        )
    );



    // Clear Form
    document
    .getElementById("payUser")
    .value = "";


    document
    .getElementById("payPhone")
    .value = "";


    document
    .getElementById("amount")
    .value = "";


    document
    .getElementById("qrcode")
    .innerHTML = "";


    document
    .getElementById("qrAmount")
    .innerText = "";



    // Reload
    loadPayments();


    updatePaymentCards();



    alert(
        "Payment Saved Successfully!"
    );

}


// ============================================================
// GENERATE QR CODE
// ============================================================

function generateQR(amount) {

    let qr =
        document
        .getElementById("qrcode");


    let qrAmount =
        document
        .getElementById("qrAmount");



    // Clear Old QR
    qr.innerHTML = "";


    qrAmount.innerText = "";



    // Check Amount
    if (
        amount === "" ||
        Number(amount) <= 0
    ) {

        return;

    }



    // UPI ID
    let upiID =
        "6289033804@ptsbi";


    // Business Name
    let name =
        "SUPER IPTV";



    // Create UPI URL
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



    // Generate QR
    if (
        typeof QRCode !==
        "undefined"
    ) {

        new QRCode(
            qr,
            {

                text:
                    upiURL,

                width:
                    220,

                height:
                    220

            }
        );

    }



    // Show Amount
    qrAmount.innerText =

        "Scan to Pay ₹" +
        amount;

}


// ============================================================
// LOAD PAYMENTS
// ============================================================

function loadPayments() {

    // Reload latest data
    payments =

        JSON.parse(
            localStorage.getItem(
                "payments"
            )
        ) || [];



    let table =
        document
        .getElementById(
            "paymentTable"
        );



    if (!table) {

        return;

    }



    // Clear Table
    table.innerHTML = "";



    // Empty
    if (
        payments.length === 0
    ) {

        table.innerHTML = `

        <tr>

        <td colspan="8">

        No Payments Found

        </td>

        </tr>

        `;

        return;

    }



    // Loop
    payments.forEach(

        function(
            payment,
            index
        ) {


            table.innerHTML += `

            <tr>

            <td>
            ${index + 1}
            </td>


            <td>
            ${payment.user || ""}
            </td>


            <td>
            ${payment.phone || ""}
            </td>


            <td>
            ₹${payment.amount || 0}
            </td>


            <td>
            ${payment.method || ""}
            </td>


            <td>

            <span>

            ${payment.status || "Pending"}

            </span>

            </td>


            <td>
            ${payment.date || ""}
            </td>


            <td>


            <button
            class="action"
            style="background:#16a34a"
            onclick="markPaid(${payment.id})">

            Paid

            </button>


            <button
            class="action delete"
            onclick="deletePayment(${index})">

            Delete

            </button>


            </td>

            </tr>

            `;

        }

    );

}


// ============================================================
// DELETE PAYMENT
// ============================================================

function deletePayment(index) {

    if (
        !payments[index]
    ) {

        return;

    }


    if (
        confirm(
            "Delete this payment?"
        )
    ) {


        payments.splice(
            index,
            1
        );


        localStorage.setItem(
            "payments",
            JSON.stringify(
                payments
            )
        );


        loadPayments();


        updatePaymentCards();

    }

}


// ============================================================
// MARK PAYMENT AS PAID
// ============================================================

function markPaid(id) {

    let payment =

        payments.find(

            function(p) {

                return p.id === id;

            }

        );



    if (!payment) {

        return;

    }



    payment.status =
        "Paid";



    localStorage.setItem(

        "payments",

        JSON.stringify(
            payments
        )

    );



    loadPayments();


    updatePaymentCards();


    alert(
        "Payment Marked as Paid."
    );

}


// ============================================================
// PAYMENT CARDS
// ============================================================

function updatePaymentCards() {


    let total =
        payments.length;


    let paid =
        0;


    let pending =
        0;


    let revenue =
        0;



    payments.forEach(

        function(payment) {


            if (
                payment.status ===
                "Paid"
            ) {

                paid++;

                revenue +=

                    Number(
                        payment.amount
                    ) || 0;

            }


            else {

                pending++;

            }

        }

    );



    let totalElement =
        document
        .getElementById(
            "totalPayments"
        );


    if (totalElement) {

        totalElement.innerText =
            total;

    }



    let paidElement =
        document
        .getElementById(
            "paidPayments"
        );


    if (paidElement) {

        paidElement.innerText =
            paid;

    }



    let pendingElement =
        document
        .getElementById(
            "pendingPayments"
        );


    if (pendingElement) {

        pendingElement.innerText =
            pending;

    }



    let revenueElement =
        document
        .getElementById(
            "totalRevenue"
        );


    if (revenueElement) {

        revenueElement.innerText =
            "₹" +
            revenue;

    }

}


// ============================================================
// SEARCH PAYMENTS
// ============================================================

function searchPayments() {

    let input =
        document
        .getElementById(
            "paymentSearch"
        );


    if (!input) {

        return;

    }



    let value =

        input.value
        .toLowerCase()
        .trim();



    let rows =

        document
        .querySelectorAll(
            "#paymentTable tr"
        );



    rows.forEach(

        function(row) {


            let text =

                row.innerText
                .toLowerCase();



            if (
                text.includes(
                    value
                )
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
// LOAD SELECTED USER FROM USERS PAGE
// ============================================================

function loadSelectedUser() {

    let selected =

        localStorage.getItem(
            "selectedPaymentUser"
        );



    if (!selected) {

        return;

    }



    try {

        let user =
            JSON.parse(
                selected
            );



        if (
            document
            .getElementById(
                "payUser"
            )
        ) {

            document
            .getElementById(
                "payUser"
            )
            .value =
                user.username || "";

        }



        if (
            document
            .getElementById(
                "payPhone"
            )
        ) {

            document
            .getElementById(
                "payPhone"
            )
            .value =
                user.phone || "";

        }



        if (
            user.amount
        ) {

            document
            .getElementById(
                "amount"
            )
            .value =
                user.amount;


            generateQR(
                user.amount
            );

        }


        // Remove Selected User
        localStorage.removeItem(
            "selectedPaymentUser"
        );


    }

    catch(error) {

        console.log(
            "Selected user error:",
            error
        );

    }

}


// ============================================================
// PAGE START
// ============================================================

window.addEventListener(

    "load",

    function() {


        loadPayments();


        updatePaymentCards();


        loadSelectedUser();



        // Search
        let search =

            document
            .getElementById(
                "paymentSearch"
            );


        if (search) {

            search.addEventListener(

                "input",

                searchPayments

            );

        }


    }

);