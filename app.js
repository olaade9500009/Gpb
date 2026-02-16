// Global Pilgrim Bank - Comprehensive Banking System
// Owner: Olawale Abdul-Ganiyu Adeshina (Adegan95)

// ============== ADMIN CREDENTIALS ==============
const ADMIN_CREDENTIALS = {
    name: "Olawale Abdul-Ganiyu Adeshina",
    bvn: "198513121985",
    phone: "+2349030277275",
    dob: "1985-12-13",
    gender: "Male",
    email: "adeganglobal@gmail.com",
    country: "Nigeria",
    alias: "Adegan95"
};

// ============== NETWORK SECURITY ==============
let currentNetworkIP = "AUTHORIZED-NETWORK-OWNER";
let networkMonitors = [];
let adminSessions = [];

// ============== BANK CONFIGURATION ==============
const BANK_CONFIG = {
    name: "Global Pilgrim Bank",
    code: "AGB999",
    swift: "GPBNNG999",
    licenses: [
        "Commercial Bank",
        "Microfinance Bank (MFB)",
        "Payment Service Bank (PSB)",
        "Mobile Money Operator (MMO)",
        "Payment Solution Service Provider (PSSP)",
        "Switching & Processing License"
    ],
    switches: [
        "NIBSS",
        "Interswitch",
        "Flutterwave",
        "Paystack",
        "Monnify",
        "Global Pilgrim Bank",
        "Unified Payments",
        "VISA",
        "MasterCard"
    ],
    partnerBanks: [
        "First Bank Nigeria",
        "UBA",
        "GTBank",
        "Access Bank",
        "Zenith Bank",
        "Wema Bank",
        "Fidelity Bank",
        "Union Bank",
        "Opay",
        "Palmpay",
        "Moniepoint",
        "Kuda Bank",
        "Carbon"
    ],
    currencies: {
        USD: { symbol: "$", rate: 1 },
        NGN: { symbol: "₦", rate: 1550 },
        EUR: { symbol: "€", rate: 0.92 },
        GBP: { symbol: "£", rate: 0.78 },
        CNY: { symbol: "¥", rate: 7.2 },
        JPY: { symbol: "¥", rate: 149.5 }
    },
    networks: [
        "6g-001",
        "5g-001",
        "4g-001",
        "3g-001",
        "2g-001"
    ],
    rechargeProviders: ["MTN", "9mobile", "Globacom", "Airtel"]
};

// ============== DATABASE SIMULATION ==============
let customers = JSON.parse(localStorage.getItem("gpb_customers")) || [];
let transactions = JSON.parse(localStorage.getItem("gpb_transactions")) || [];
let auditLogs = JSON.parse(localStorage.getItem("gpb_auditLogs")) || [];
let unauthorizedAttempts = JSON.parse(localStorage.getItem("gpb_attempts")) || [];
let profitBalance = parseFloat(localStorage.getItem("gpb_profit")) || 0;
let mainBalance = parseFloat(localStorage.getItem("gpb_mainBalance")) || 0;
let customerBalances = JSON.parse(localStorage.getItem("gpb_customerBalances")) || {};
let miningWallets = JSON.parse(localStorage.getItem("gpb_miningWallets")) || {};
let robotTrading = JSON.parse(localStorage.getItem("gpb_robotTrading")) || {};
let pilgrimCoinPrice = 0.5;
let globalPilgrimSharePrice = 5;

// ============== HELPER FUNCTIONS ==============

function generateAccountNumber() {
    return "GPB" + Math.floor(Math.random() * 1000000000);
}

function generateTransactionId() {
    return "TX" + Date.now() + Math.floor(Math.random() * 1000);
}

function generateWalletAddress(currency) {
    return currency + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

function formatCurrency(amount, currency = "USD") {
    const config = BANK_CONFIG.currencies[currency];
    return config.symbol + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function saveData() {
    localStorage.setItem("gpb_customers", JSON.stringify(customers));
    localStorage.setItem("gpb_transactions", JSON.stringify(transactions));
    localStorage.setItem("gpb_auditLogs", JSON.stringify(auditLogs));
    localStorage.setItem("gpb_attempts", JSON.stringify(unauthorizedAttempts));
    localStorage.setItem("gpb_profit", profitBalance.toString());
    localStorage.setItem("gpb_mainBalance", mainBalance.toString());
    localStorage.setItem("gpb_customerBalances", JSON.stringify(customerBalances));
    localStorage.setItem("gpb_miningWallets", JSON.stringify(miningWallets));
    localStorage.setItem("gpb_robotTrading", JSON.stringify(robotTrading));
}

function logAudit(action, details, user) {
    const log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        details,
        user,
        network: currentNetworkIP,
        location: "Authorized"
    };
    auditLogs.push(log);
    saveData();
}

function validateBVN(bvn) {
    return bvn.length === 11 && /^\d+$/.test(bvn);
}

function validateNIN(nin) {
    return nin.length === 11 && /^\d+$/.test(nin);
}

function validatePhone(phone) {
    return /^(\+234|0)[789]\d{9}$/.test(phone);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function amlCheck(amount, currency, country) {
    const thresholds = {
        USD: 10000,
        NGN: 15000000,
        EUR: 9200,
        GBP: 7800
    };
    
    if (amount > (thresholds[currency] || 10000)) {
        return { status: "FLAGGED", reason: "Large transaction threshold exceeded" };
    }
    
    if (Math.random() > 0.95) {
        return { status: "REVIEW", reason: "Random compliance check" };
    }
    
    return { status: "APPROVED" };
}

function exchangeRate(from, to, amount) {
    const fromRate = BANK_CONFIG.currencies[from].rate;
    const toRate = BANK_CONFIG.currencies[to].rate;
    return (amount / fromRate) * toRate;
}

// ============== NETWORK MONITORING ==============

function monitorNetwork() {
    const monitor = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        network: currentNetworkIP,
        adminSessions: adminSessions.length,
        unauthorizedAttempts: unauthorizedAttempts.length,
        status: "MONITORING"
    };
    networkMonitors.push(monitor);
    return monitor;
}

function logUnauthorizedAttempt(data) {
    const attempt = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        network: data.network || "UNKNOWN",
        location: data.location || "Unknown",
        bvn: data.bvn || "Not provided",
        phone: data.phone || "Not provided",
        status: "BLOCKED"
    };
    unauthorizedAttempts.push(attempt);
    saveData();
    
    // Alert admin
    alert("🚨 SECURITY ALERT: Unauthorized access attempt detected and logged!");
}

function checkNetworkAuthorization(networkIP) {
    return networkIP === currentNetworkIP || networkIP === "AUTHORIZED-NETWORK-OWNER";
}

// ============== ADMIN FUNCTIONS ==============

function adminLogin() {
    const name = document.getElementById("adminName") ? document.getElementById("adminName").value : "";
    const bvn = document.getElementById("adminBvn") ? document.getElementById("adminBvn").value : "";
    const phone = document.getElementById("adminPhone") ? document.getElementById("adminPhone").value : "";
    
    // Strict authentication - only owner can login
    if (name === ADMIN_CREDENTIALS.name && 
        bvn === ADMIN_CREDENTIALS.bvn && 
        phone === ADMIN_CREDENTIALS.phone) {
        
        const session = {
            id: Date.now(),
            admin: name,
            network: currentNetworkIP,
            location: "Nigeria",
            loginTime: new Date().toISOString()
        };
        adminSessions.push(session);
        
        localStorage.setItem("gpb_admin", "true");
        localStorage.setItem("gpb_adminSession", JSON.stringify(session));
        
        logAudit("ADMIN_LOGIN", "Successful admin login", name);
        window.location.href = "admin-dashboard.html";
        return true;
    } else {
        logUnauthorizedAttempt({
            network: "DETECTED-IP",
            location: "Unknown",
            bvn: bvn,
            phone: phone
        });
        
        const errorEl = document.getElementById("error");
        if (errorEl) {
            errorEl.innerHTML = "🚨 <strong>UNAUTHORIZED ACCESS</strong><br>This attempt has been logged and reported to security.";
        }
        return false;
    }
}

function checkAdminAuth() {
    if (localStorage.getItem("gpb_admin") !== "true") {
        alert("Access Denied: Only authorized administrator can access this page");
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

function createCustomer() {
    if (!checkAdminAuth()) return;
    
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const email = document.getElementById("custEmail").value;
    const bvn = document.getElementById("custBvn").value;
    const nin = document.getElementById("custNin").value;
    const dob = document.getElementById("custDob").value;
    const address = document.getElementById("custAddress").value;
    
    if (!name || !phone || !email || !bvn) {
        alert("Please fill in all required fields");
        return;
    }
    
    if (!validateBVN(bvn)) {
        alert("Invalid BVN. BVN must be 11 digits.");
        return;
    }
    
    if (!validatePhone(phone)) {
        alert("Invalid phone number format");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }
    
    const accountNumber = generateAccountNumber();
    const walletAddresses = {};
    
    Object.keys(BANK_CONFIG.currencies).forEach(currency => {
        walletAddresses[currency] = generateWalletAddress(currency);
    });
    
    const newCustomer = {
        id: Date.now(),
        name,
        phone,
        email,
        bvn,
        nin,
        dob,
        address,
        account: accountNumber,
        balance: 0,
        balances: {
            USD: 0,
            NGN: 0,
            EUR: 0,
            GBP: 0,
            CNY: 0,
            JPY: 0
        },
        status: "PENDING",
        kyc: "Pending",
        amlScore: Math.floor(Math.random() * 30),
        walletAddresses,
        virtualCards: [],
        ledger: [],
        password: "password123",
        pin: "0000",
        createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    customerBalances[accountNumber] = 0;
    
    logAudit("CUSTOMER_CREATED", `New customer account created: ${accountNumber}`, "Admin");
    saveData();
    
    alert(`Customer created successfully!\n\nAccount Number: ${accountNumber}\nPassword: password123\n\nCustomer must deposit funds to activate account.`);
    clearCustomerForm();
}

function clearCustomerForm() {
    const fields = ["custName", "custPhone", "custEmail", "custBvn", "custNin", "custDob", "custAddress"];
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = "";
    });
}

function searchCustomer() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const result = customers.find(c => 
        c.account.toLowerCase() === input || 
        c.name.toLowerCase() === input ||
        c.phone === input ||
        c.email.toLowerCase() === input
    );
    
    const resultEl = document.getElementById("searchResult");
    
    if (result) {
        resultEl.innerHTML = `
            <div class="customer-result">
                <h4>${result.name}</h4>
                <p><strong>Account:</strong> ${result.account}</p>
                <p><strong>Phone:</strong> ${result.phone}</p>
                <p><strong>Email:</strong> ${result.email}</p>
                <p><strong>BVN:</strong> ${result.bvn}</p>
                <p><strong>Status:</strong> <span class="status-${result.status.toLowerCase()}">${result.status}</span></p>
                <p><strong>KYC:</strong> ${result.kyc}</p>
                <p><strong>Balance:</strong> ${formatCurrency(result.balance)} USD</p>
                <p><strong>Wallet Address:</strong> ${result.walletAddresses.USD}</p>
                <p><strong>AML Score:</strong> ${result.amlScore}</p>
                <p><strong>Created:</strong> ${formatDate(result.createdAt)}</p>
                <div class="actions">
                    <button onclick="editCustomer('${result.account}')" class="btn btn-secondary">Edit Profile</button>
                    <button onclick="approveCustomer('${result.account}')" class="btn">Approve Account</button>
                    <button onclick="creditCustomer('${result.account}')" class="btn">Credit</button>
                    <button onclick="debitCustomer('${result.account}')" class="btn btn-danger">Debit</button>
                    <button onclick="printInvoice('${result.account}')" class="btn btn-secondary">Print Invoice</button>
                </div>
            </div>
        `;
    } else {
        resultEl.innerHTML = "<p class='error'>Customer not found</p>";
    }
}

function editCustomer(account) {
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "block";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Edit Customer: ${customer.name}</h2>
            <input type="text" id="editName" value="${customer.name}" placeholder="Full Name">
            <input type="text" id="editPhone" value="${customer.phone}" placeholder="Phone">
            <input type="text" id="editEmail" value="${customer.email}" placeholder="Email">
            <input type="text" id="editAddress" value="${customer.address || ''}" placeholder="Address">
            <input type="password" id="editPassword" value="${customer.password}" placeholder="Password">
            <input type="text" id="editPin" value="${customer.pin}" placeholder="PIN">
            <select id="editStatus">
                <option value="ACTIVE" ${customer.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                <option value="PENDING" ${customer.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                <option value="SUSPENDED" ${customer.status === 'SUSPENDED' ? 'selected' : ''}>Suspended</option>
                <option value="CLOSED" ${customer.status === 'CLOSED' ? 'selected' : ''}>Closed</option>
            </select>
            <button onclick="saveCustomerEdit('${account}')">Save Changes</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveCustomerEdit(account) {
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    customer.name = document.getElementById("editName").value;
    customer.phone = document.getElementById("editPhone").value;
    customer.email = document.getElementById("editEmail").value;
    customer.address = document.getElementById("editAddress").value;
    customer.password = document.getElementById("editPassword").value;
    customer.pin = document.getElementById("editPin").value;
    customer.status = document.getElementById("editStatus").value;
    
    logAudit("CUSTOMER_UPDATED", `Customer profile updated: ${account}`, "Admin");
    saveData();
    
    alert("Customer profile updated successfully!");
    document.querySelector(".modal").remove();
    searchCustomer();
}

function approveCustomer(account) {
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    customer.status = "ACTIVE";
    customer.kyc = "Verified";
    
    logAudit("CUSTOMER_APPROVED", `Customer account approved: ${account}`, "Admin");
    saveData();
    
    alert(`Customer ${account} has been approved!`);
    searchCustomer();
}

function creditCustomer(account) {
    const amount = prompt("Enter amount to credit (USD):");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Invalid amount");
        return;
    }
    
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    const creditAmount = parseFloat(amount);
    customer.balance += creditAmount;
    customer.balances.USD += creditAmount;
    customerBalances[account] = customer.balance;
    
    // Add to profit (2% fee)
    profitBalance += creditAmount * 0.02;
    
    const transaction = {
        id: generateTransactionId(),
        type: "CREDIT",
        account,
        amount: creditAmount,
        currency: "USD",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: "Admin credit",
        fee: creditAmount * 0.02
    };
    
    customer.ledger.push(transaction);
    transactions.push(transaction);
    
    logAudit("CUSTOMER_CREDITED", `Admin credited ${account} with ${formatCurrency(creditAmount)}`, "Admin");
    saveData();
    
    alert(`Successfully credited ${formatCurrency(creditAmount)} to ${account}`);
    updateAdminDashboard();
}

function debitCustomer(account) {
    const amount = prompt("Enter amount to debit (USD):");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Invalid amount");
        return;
    }
    
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    const debitAmount = parseFloat(amount);
    
    if (customer.balance < debitAmount) {
        alert("Insufficient funds");
        return;
    }
    
    customer.balance -= debitAmount;
    customer.balances.USD -= debitAmount;
    customerBalances[account] = customer.balance;
    
    // Add to profit (1% fee)
    profitBalance += debitAmount * 0.01;
    
    const transaction = {
        id: generateTransactionId(),
        type: "DEBIT",
        account,
        amount: debitAmount,
        currency: "USD",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: "Admin debit",
        fee: debitAmount * 0.01
    };
    
    customer.ledger.push(transaction);
    transactions.push(transaction);
    
    logAudit("CUSTOMER_DEBITED", `Admin debited ${account} with ${formatCurrency(debitAmount)}`, "Admin");
    saveData();
    
    alert(`Successfully debited ${formatCurrency(debitAmount)} from ${account}`);
    updateAdminDashboard();
}

function processTransaction() {
    const account = document.getElementById("transAccount").value;
    const amount = parseFloat(document.getElementById("transAmount").value);
    const type = document.getElementById("transType").value;
    
    if (!account || isNaN(amount) || amount <= 0) {
        alert("Invalid input");
        return;
    }
    
    const customer = customers.find(c => c.account === account);
    if (!customer) {
        alert("Customer not found");
        return;
    }
    
    if (type === "debit") {
        if (customer.balance < amount) {
            alert("Insufficient funds");
            return;
        }
        customer.balance -= amount;
        customer.balances.USD -= amount;
        profitBalance += amount * 0.01;
    } else {
        customer.balance += amount;
        customer.balances.USD += amount;
        profitBalance += amount * 0.02;
    }
    
    customerBalances[account] = customer.balance;
    
    const transaction = {
        id: generateTransactionId(),
        type: type.toUpperCase(),
        account,
        amount,
        currency: "USD",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `Admin ${type}`
    };
    
    customer.ledger.push(transaction);
    transactions.push(transaction);
    
    logAudit(`TRANSACTION_${type.toUpperCase()}`, `${type} ${formatCurrency(amount)} to/from ${account}`, "Admin");
    saveData();
    
    alert("Transaction successful!");
    updateAdminDashboard();
}

function transferProfit() {
    if (profitBalance <= 0) {
        alert("No profit to transfer");
        return;
    }
    
    mainBalance += profitBalance;
    const transferAmount = profitBalance;
    profitBalance = 0;
    
    logAudit("PROFIT_TRANSFERRED", `Transferred ${formatCurrency(transferAmount)} to main balance`, "Admin");
    saveData();
    
    alert(`Successfully transferred ${formatCurrency(transferAmount)} to main balance`);
    updateAdminDashboard();
}

function loadAttempts() {
    const logsEl = document.getElementById("attemptLogs");
    if (!logsEl) return;
    
    let display = "";
    unauthorizedAttempts.slice(-10).reverse().forEach(log => {
        display += `
            <div class="transaction-item" style="border-left-color: #ef5350;">
                <p><strong>Date:</strong> ${formatDate(log.timestamp)}</p>
                <p><strong>Network:</strong> ${log.network}</p>
                <p><strong>Location:</strong> ${log.location}</p>
                <p><strong>BVN:</strong> ${log.bvn}</p>
                <p><strong>Phone:</strong> ${log.phone}</p>
            </div>
        `;
    });
    
    logsEl.innerHTML = display || "<p>No unauthorized attempts logged</p>";
}

function loadAllCustomers() {
    const customersEl = document.getElementById("allCustomers");
    if (!customersEl) return;
    
    let display = `
        <table>
            <thead>
                <tr>
                    <th>Account</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>KYC</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    customers.forEach(customer => {
        display += `
            <tr>
                <td>${customer.account}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${formatCurrency(customer.balance)}</td>
                <td><span class="status-${customer.status.toLowerCase()}">${customer.status}</span></td>
                <td>${customer.kyc}</td>
                <td>
                    <button onclick="editCustomer('${customer.account}')" style="padding: 5px 10px; font-size: 0.8em;">Edit</button>
                    <button onclick="creditCustomer('${customer.account}')" style="padding: 5px 10px; font-size: 0.8em;">Credit</button>
                    <button onclick="debitCustomer('${customer.account}')" style="padding: 5px 10px; font-size: 0.8em;">Debit</button>
                </td>
            </tr>
        `;
    });
    
    display += "</tbody></table>";
    customersEl.innerHTML = display;
}

function loadTransactions() {
    const transEl = document.getElementById("allTransactions");
    if (!transEl) return;
    
    let display = `
        <table>
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    transactions.slice(-20).reverse().forEach(tx => {
        display += `
            <tr>
                <td>${tx.id}</td>
                <td>${tx.account}</td>
                <td><span class="status-${tx.type.toLowerCase()}">${tx.type}</span></td>
                <td>${formatCurrency(tx.amount, tx.currency)}</td>
                <td><span class="status-${tx.status.toLowerCase()}">${tx.status}</span></td>
                <td>${formatDate(tx.timestamp)}</td>
            </tr>
        `;
    });
    
    display += "</tbody></table>";
    transEl.innerHTML = display;
}

function updateAdminDashboard() {
    const profitEl = document.getElementById("profitBalance");
    const mainEl = document.getElementById("mainBalance");
    const customerCountEl = document.getElementById("customerCount");
    const transactionCountEl = document.getElementById("transactionCount");
    
    if (profitEl) profitEl.textContent = formatCurrency(profitBalance);
    if (mainEl) mainEl.textContent = formatCurrency(mainBalance);
    if (customerCountEl) customerCountEl.textContent = customers.length;
    if (transactionCountEl) transactionCountEl.textContent = transactions.length;
    
    loadAttempts();
    loadAllCustomers();
    loadTransactions();
}

// ============== CUSTOMER FUNCTIONS ==============

let currentCustomer = null;

function customerSignup() {
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const email = document.getElementById("custEmail").value;
    const password = document.getElementById("custPassword").value;
    const confirmPassword = document.getElementById("custConfirmPassword").value;
    
    if (!name || !phone || !email || !password) {
        alert("Please fill in all required fields");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    
    if (!validatePhone(phone)) {
        alert("Invalid phone number format");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }
    
    alert("Registration submitted! Please wait for admin approval. You will be able to login after your account is activated with an initial deposit.");
    window.location.href = "index.html";
}

function customerLogin() {
    const account = document.getElementById("custAccountLogin").value;
    const password = document.getElementById("custPasswordLogin").value;
    
    currentCustomer = customers.find(c => c.account === account);
    
    if (!currentCustomer) {
        alert("Invalid account number");
        return;
    }
    
    if (currentCustomer.password !== password) {
        alert("Invalid password");
        logUnauthorizedAttempt({
            network: "CUSTOMER-LOGIN",
            location: "Unknown",
            phone: account
        });
        return;
    }
    
    if (currentCustomer.status !== "ACTIVE") {
        alert(`Account status: ${currentCustomer.status}\n\nPlease contact admin or make an initial deposit to activate your account.`);
        return;
    }
    
    logAudit("CUSTOMER_LOGIN", `Customer login: ${account}`, currentCustomer.name);
    localStorage.setItem("gpb_customerAccount", account);
    
    document.getElementById("custPanel").style.display = "block";
    updateCustomerView();
}

function updateCustomerView() {
    if (!currentCustomer) return;
    
    document.getElementById("custName").textContent = currentCustomer.name;
    document.getElementById("custAccount").textContent = currentCustomer.account;
    document.getElementById("custBalance").textContent = formatCurrency(currentCustomer.balance);
    document.getElementById("custWallet").textContent = currentCustomer.walletAddresses.USD;
    
    // Update currency balances
    Object.keys(BANK_CONFIG.currencies).forEach(currency => {
        const el = document.getElementById(`balance${currency}`);
        if (el) {
            el.textContent = formatCurrency(currentCustomer.balances[currency], currency);
        }
    });
    
    // Update ledger
    let ledgerDisplay = "";
    currentCustomer.ledger.slice(-10).reverse().forEach(tx => {
        ledgerDisplay += `
            <div class="transaction-item ${tx.type.toLowerCase()}">
                <p><strong>${tx.type}</strong> - ${formatCurrency(tx.amount, tx.currency)}</p>
                <p>${formatDate(tx.timestamp)}</p>
                <p>${tx.description || tx.type}</p>
            </div>
        `;
    });
    
    const ledgerEl = document.getElementById("ledgerDisplay");
    if (ledgerEl) {
        ledgerEl.innerHTML = ledgerDisplay || "<p>No transactions yet</p>";
    }
    
    // Update virtual cards
    updateVirtualCardsDisplay();
}

function sendMoney() {
    const recipientAccount = document.getElementById("recipientAccount").value;
    const amount = parseFloat(document.getElementById("sendAmount").value);
    const transferType = document.getElementById("transferType").value;
    const currency = document.getElementById("currency").value;
    
    if (!recipientAccount || isNaN(amount) || amount <= 0) {
        alert("Invalid input");
        return;
    }
    
    if (currentCustomer.balances[currency] < amount) {
        alert(`Insufficient ${currency} balance`);
        return;
    }
    
    const amlResult = amlCheck(amount, currency, currentCustomer.country);
    if (amlResult.status !== "APPROVED") {
        alert(`Transaction Blocked: ${amlResult.reason}`);
        return;
    }
    
    if (transferType === "local") {
        // Bank to Bank transfer (Bank A -> Bank B)
        const recipient = customers.find(c => c.account === recipientAccount);
        
        if (!recipient) {
            // External bank transfer
            processExternalTransfer(recipientAccount, amount, currency);
            return;
        }
        
        // Internal transfer
        currentCustomer.balances[currency] -= amount;
        recipient.balances[currency] += amount;
        
        // Update primary balance if USD
        if (currency === "USD") {
            currentCustomer.balance -= amount;
            recipient.balance += amount;
            customerBalances[currentCustomer.account] = currentCustomer.balance;
            customerBalances[recipient.account] = recipient.balance;
        }
        
        // Add fee to profit
        profitBalance += amount * 0.01;
        
        const fee = amount * 0.01;
        
        const tx = {
            id: generateTransactionId(),
            type: "TRANSFER",
            account: currentCustomer.account,
            recipient: recipient.account,
            amount,
            currency,
            fee,
            status: "SUCCESS",
            timestamp: new Date().toISOString(),
            description: `Transfer to ${recipient.name}`,
            transferType: "internal",
            walletAddress: recipient.walletAddresses[currency]
        };
        
        currentCustomer.ledger.push(tx);
        recipient.ledger.push({
            ...tx,
            type: "RECEIVE",
            account: recipient.account,
            recipient: currentCustomer.account,
            amount: amount - fee
        });
        
        transactions.push(tx);
        
        logAudit("TRANSFER_SENT", `Sent ${formatCurrency(amount, currency)} to ${recipientAccount}`, currentCustomer.name);
        saveData();
        
        alert(`Transfer Successful!\n\nSent ${formatCurrency(amount, currency)} to ${recipient.name}\nFee: ${formatCurrency(fee, currency)}\nTransaction ID: ${tx.id}`);
        
        // Send SMS/Email alert (simulated)
        sendAlert(currentCustomer, `TRANSFER: ${formatCurrency(amount, currency)} sent to ${recipientAccount}`);
        
    } else {
        // International transfer
        processInternationalTransfer(recipientAccount, amount, currency);
    }
    
    updateCustomerView();
}

function processExternalTransfer(accountNumber, amount, currency) {
    // Simulate external bank transfer (Bank A -> Bank B)
    currentCustomer.balances[currency] -= amount;
    
    if (currency === "USD") {
        currentCustomer.balance -= amount;
        customerBalances[currentCustomer.account] = currentCustomer.balance;
    }
    
    const fee = amount * 0.02;
    profitBalance += fee;
    
    const tx = {
        id: generateTransactionId(),
        type: "TRANSFER",
        account: currentCustomer.account,
        recipient: accountNumber,
        amount,
        currency,
        fee,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `External transfer to ${accountNumber}`,
        transferType: "external",
        walletAddress: generateWalletAddress(currency)
    };
    
    currentCustomer.ledger.push(tx);
    transactions.push(tx);
    
    logAudit("EXTERNAL_TRANSFER", `External transfer ${formatCurrency(amount, currency)} to ${accountNumber}`, currentCustomer.name);
    saveData();
    
    alert(`External Transfer Successful!\n\nSent ${formatCurrency(amount, currency)} to ${accountNumber}\nFee: ${formatCurrency(fee, currency)}\n\nNote: This is a simulated transfer to external bank`);
    
    updateCustomerView();
}

function processInternationalTransfer(recipientAccount, amount, currency) {
    // International transfer with SWIFT
    const recipientBank = document.getElementById("recipientBank").value;
    const swiftCode = document.getElementById("swiftCode").value;
    
    currentCustomer.balances[currency] -= amount;
    
    if (currency === "USD") {
        currentCustomer.balance -= amount;
        customerBalances[currentCustomer.account] = currentCustomer.balance;
    }
    
    const fee = amount * 0.05;
    profitBalance += fee;
    
    const tx = {
        id: generateTransactionId(),
        type: "INTERNATIONAL_TRANSFER",
        account: currentCustomer.account,
        recipient: recipientAccount,
        recipientBank,
        swiftCode,
        amount,
        currency,
        fee,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `International transfer to ${recipientBank}`,
        transferType: "international",
        walletAddress: generateWalletAddress(currency)
    };
    
    currentCustomer.ledger.push(tx);
    transactions.push(tx);
    
    logAudit("INTL_TRANSFER", `International transfer ${formatCurrency(amount, currency)} to ${recipientBank}`, currentCustomer.name);
    saveData();
    
    alert(`International Transfer Successful!\n\nSent ${formatCurrency(amount, currency)} to ${recipientBank}\nAccount: ${recipientAccount}\nSWIFT: ${swiftCode}\nFee: ${formatCurrency(fee, currency)}\n\nTransaction ID: ${tx.id}`);
    
    updateCustomerView();
}

function processUSSD() {
    const code = document.getElementById("ussdCode").value;
    const resultEl = document.getElementById("ussdResult");
    
    if (code === "*999#") {
        resultEl.innerHTML = `
            <pre>
Global Pilgrim Bank
1. Balance
2. Transfer
3. Airtime
4. Data
5. Bills
6. Back
            </pre>
        `;
    } else if (code === "*999*1#") {
        resultEl.innerHTML = `
            <pre>
Account: ${currentCustomer.account}
Balance: ${formatCurrency(currentCustomer.balance)}

0. Back
            </pre>
        `;
    } else if (code.startsWith("*999*2")) {
        resultEl.innerHTML = `
            <pre>
Transfer Money
1. To GPB Account
2. To Other Bank
3. Bank Code List
0. Back
            </pre>
        `;
    } else if (code === "*999*3#") {
        resultEl.innerHTML = `
            <pre>
Buy Airtime
Select Network:
1. MTN
2. 9mobile
3. Glo
4. Airtel
0. Back
            </pre>
        `;
    } else {
        resultEl.innerHTML = "<pre>Invalid USSD code. Try *999#</pre>";
    }
}

function buyAirtime() {
    const phone = document.getElementById("airtimePhone").value;
    const amount = parseFloat(document.getElementById("airtimeAmount").value);
    const provider = document.getElementById("airtimeProvider").value;
    
    if (!phone || isNaN(amount) || amount <= 0) {
        alert("Invalid input");
        return;
    }
    
    if (currentCustomer.balances.NGN < amount) {
        alert("Insufficient NGN balance");
        return;
    }
    
    const usdAmount = amount / BANK_CONFIG.currencies.NGN.rate;
    
    currentCustomer.balances.NGN -= amount;
    currentCustomer.balance -= usdAmount;
    customerBalances[currentCustomer.account] = currentCustomer.balance;
    
    const fee = usdAmount * 0.01;
    profitBalance += fee;
    
    const tx = {
        id: generateTransactionId(),
        type: "AIRTIME",
        account: currentCustomer.account,
        recipient: phone,
        amount,
        currency: "NGN",
        fee: usdAmount,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `${provider} Airtime - ${phone}`,
        provider
    };
    
    currentCustomer.ledger.push(tx);
    transactions.push(tx);
    
    logAudit("AIRTIME_PURCHASE", `Bought ${provider} airtime ${amount} NGN for ${phone}`, currentCustomer.name);
    saveData();
    
    alert(`Airtime purchase successful!\n\n${amount} NGN airtime sent to ${phone}\nProvider: ${provider}\n\nYou will receive SMS confirmation shortly.`);
    
    updateCustomerView();
}

function payBill() {
    const billType = document.getElementById("billType").value;
    const account = document.getElementById("billAccount").value;
    const amount = parseFloat(document.getElementById("billAmount").value);
    
    if (!account || isNaN(amount) || amount <= 0) {
        alert("Invalid input");
        return;
    }
    
    if (currentCustomer.balances.NGN < amount) {
        alert("Insufficient NGN balance");
        return;
    }
    
    const usdAmount = amount / BANK_CONFIG.currencies.NGN.rate;
    
    currentCustomer.balances.NGN -= amount;
    currentCustomer.balance -= usdAmount;
    customerBalances[currentCustomer.account] = currentCustomer.balance;
    
    const fee = usdAmount * 0.02;
    profitBalance += fee;
    
    const tx = {
        id: generateTransactionId(),
        type: "BILL_PAYMENT",
        account: currentCustomer.account,
        recipient: account,
        amount,
        currency: "NGN",
        fee: usdAmount,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `${billType} - ${account}`,
        billType
    };
    
    currentCustomer.ledger.push(tx);
    transactions.push(tx);
    
    logAudit("BILL_PAID", `Paid ${billType} ${amount} NGN for ${account}`, currentCustomer.name);
    saveData();
    
    alert(`Bill payment successful!\n\n${billType}: ${account}\nAmount: ${amount} NGN\nTransaction ID: ${tx.id}`);
    
    updateCustomerView();
}

// ============== VIRTUAL CARDS ==============

function createVirtualCard(type) {
    const card = {
        id: Date.now(),
        type, // VISA, MasterCard, Verve
        number: generateCardNumber(),
        cvv: Math.floor(Math.random() * 900) + 100,
        expiry: `${new Date().getFullYear() + 3}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
        balance: 0,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
    };
    
    currentCustomer.virtualCards.push(card);
    
    logAudit("CARD_CREATED", `Virtual ${type} card created for ${currentCustomer.account}`, currentCustomer.name);
    saveData();
    
    alert(`${type} Virtual Card Created!\n\nCard Number: ${card.number}\nCVV: ${card.cvv}\nExpiry: ${card.expiry}\n\nThis card can be used for PayPal, GPay, Western Union, and online payments.`);
    
    updateVirtualCardsDisplay();
}

function generateCardNumber() {
    // Generate realistic-looking card number
    const prefix = type => {
        switch(type) {
            case 'VISA': return '4';
            case 'MasterCard': return '5';
            case 'Verve': return '6';
            default: return '4';
        }
    };
    
    let number = prefix('VISA');
    for (let i = 0; i < 15; i++) {
        number += Math.floor(Math.random() * 10);
    }
    
    return number.match(/.{1,4}/g).join(' ');
}

function updateVirtualCardsDisplay() {
    const cardsEl = document.getElementById("virtualCards");
    if (!cardsEl || !currentCustomer) return;
    
    let display = "<div class='card-grid'>";
    
    if (currentCustomer.virtualCards.length === 0) {
        display += "<p>No virtual cards yet. Create one below.</p>";
    } else {
        currentCustomer.virtualCards.forEach(card => {
            display += `
                <div class="virtual-card">
                    <h4>${card.type}</h4>
                    <div class="card-number">${card.number}</div>
                    <div class="card-details">
                        <span>CVV: ${card.cvv}</span>
                        <span>Exp: ${card.expiry}</span>
                    </div>
                    <p>Status: <span class="status-${card.status.toLowerCase()}">${card.status}</span></p>
                    <p>Balance: ${formatCurrency(card.balance)}</p>
                </div>
            `;
        });
    }
    
    display += "</div>";
    cardsEl.innerHTML = display;
}

// ============== MINING SYSTEM ==============

function createMiningWallet(currency) {
    const wallet = {
        id: Date.now(),
        currency,
        address: generateWalletAddress(currency),
        balance: 0,
        totalMined: 0,
        createdAt: new Date().toISOString()
    };
    
    miningWallets[currency] = wallet;
    saveData();
    
    alert(`${currency} Mining Wallet Created!\n\nWallet Address: ${wallet.address}\n\nThis wallet will mine 50 ${currency} per operation.`);
    
    updateMiningDisplay();
}

function mineCurrency(currency) {
    if (!miningWallets[currency]) {
        alert(`Please create a ${currency} mining wallet first`);
        return;
    }
    
    const mineAmount = 50;
    miningWallets[currency].balance += mineAmount;
    miningWallets[currency].totalMined += mineAmount;
    
    // Transfer to main domicile balance
    const usdAmount = exchangeRate(currency, 'USD', mineAmount);
    mainBalance += usdAmount;
    
    logAudit("MINING", `Mined ${mineAmount} ${currency} (${formatCurrency(usdAmount)} USD)`, "System");
    saveData();
    
    alert(`Mining Successful!\n\nMined: ${mineAmount} ${currency}\nConverted to: ${formatCurrency(usdAmount)} USD\nAdded to main balance`);
    
    updateMiningDisplay();
}

function updateMiningDisplay() {
    const miningEl = document.getElementById("miningWallets");
    if (!miningEl) return;
    
    let display = "<div class='wallet-grid'>";
    
    Object.keys(BANK_CONFIG.currencies).forEach(currency => {
        const wallet = miningWallets[currency];
        display += `
            <div class="wallet-item">
                <h4>${currency} Wallet</h4>
                <p>Address: ${wallet ? wallet.address.substring(0, 20) + '...' : 'Not created'}</p>
                <p>Balance: ${wallet ? wallet.balance + ' ' + currency : '0'}</p>
                <p>Total Mined: ${wallet ? wallet.totalMined + ' ' + currency : '0'}</p>
                ${!wallet ? `<button onclick="createMiningWallet('${currency}')" class="btn" style="margin-top: 10px;">Create Wallet</button>` : 
                `<button onclick="mineCurrency('${currency}')" class="btn" style="margin-top: 10px;">Mine 50 ${currency}</button>`}
            </div>
        `;
    });
    
    display += "</div>";
    miningEl.innerHTML = display;
}

// ============== ROBOT TRADING ==============

function robotTrade() {
    if (!currentCustomer) return;
    
    const coin = document.getElementById("tradeCoin").value;
    const amount = parseFloat(document.getElementById("tradeAmount").value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }
    
    const coinPrice = coin === "PilgrimCoin" ? pilgrimCoinPrice : globalPilgrimSharePrice;
    const coinAmount = amount / coinPrice;
    
    // 5% profit
    const profit = amount * 0.05;
    currentCustomer.balance += profit;
    customerBalances[currentCustomer.account] = currentCustomer.balance;
    
    profitBalance += profit * 0.1;
    
    const tx = {
        id: generateTransactionId(),
        type: "ROBOT_TRADE",
        account: currentCustomer.account,
        amount: profit,
        currency: "USD",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: `Robot Trading - ${coin}`,
        coin,
        coinAmount,
        coinPrice
    };
    
    currentCustomer.ledger.push(tx);
    transactions.push(tx);
    
    logAudit("ROBOT_TRADE", `Robot trading completed for ${currentCustomer.account}`, "System");
    saveData();
    
    alert(`Robot Trading Cycle Completed!\n\n${coin} Trade: ${coinAmount.toFixed(2)} @ $${coinPrice}\nProfit: ${formatCurrency(profit)}\n\nYour balance has been updated.`);
    
    updateCustomerView();
}

// ============== ALERT SYSTEM ==============

function sendAlert(customer, message) {
    // Simulate SMS and Email alerts
    console.log(`SMS sent to ${customer.phone}: ${message}`);
    console.log(`Email sent to ${customer.email}: ${message}`);
    
    const alert = {
        id: Date.now(),
        customer: customer.account,
        type: "SMS/EMAIL",
        message,
        sentAt: new Date().toISOString()
    };
    
    // Store alerts (in real system, would send actual SMS/Email)
    localStorage.setItem("gpb_lastAlert", JSON.stringify(alert));
}

// ============== INVOICE PRINTING ==============

function printInvoice(account) {
    const customer = customers.find(c => c.account === account);
    if (!customer) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - Global Pilgrim Bank</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #1a237e; padding-bottom: 20px; }
                .header h1 { color: #1a237e; margin: 0; }
                .details { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
                .balance { font-size: 24px; color: #1a237e; font-weight: bold; margin: 20px 0; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .table th, .table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                .table th { background: #1a237e; color: white; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>GLOBAL PILGRIM BANK</h1>
                <p>Commercial | Microfinance | Payment Service Bank</p>
                <p>Bank Code: AGB999 | SWIFT: GPBNNG999</p>
            </div>
            
            <div class="details">
                <h2>Account Statement</h2>
                <p><strong>Account Number:</strong> ${customer.account}</p>
                <p><strong>Account Name:</strong> ${customer.name}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="balance">
                Available Balance: ${formatCurrency(customer.balance)} USD
            </div>
            
            <h3>Recent Transactions</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${customer.ledger.slice(-10).reverse().map(tx => `
                        <tr>
                            <td>${formatDate(tx.timestamp)}</td>
                            <td>${tx.type}</td>
                            <td>${formatCurrency(tx.amount, tx.currency)}</td>
                            <td>${tx.description || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Generated by Global Pilgrim Bank System</p>
                <p>Owner: Olawale Abdul-Ganiyu Adeshina (Adegan95)</p>
                <p>Contact: +2349030277275 | Email: adeganglobal@gmail.com</p>
                <p>${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ============== INITIALIZATION ==============

function initializeApp() {
    // Monitor network
    monitorNetwork();
    
    // Check if on admin dashboard
    if (window.location.pathname.includes("admin-dashboard")) {
        checkAdminAuth();
        updateAdminDashboard();
        updateMiningDisplay();
    }
    
    // Check if on customer dashboard
    if (window.location.pathname.includes("customer-dashboard")) {
        const savedAccount = localStorage.getItem("gpb_customerAccount");
        if (savedAccount) {
            currentCustomer = customers.find(c => c.account === savedAccount);
            if (currentCustomer) {
                document.getElementById("custPanel").style.display = "block";
                updateCustomerView();
            }
        }
        updateMiningDisplay();
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for HTML access
window.adminLogin = adminLogin;
window.createCustomer = createCustomer;
window.searchCustomer = searchCustomer;
window.editCustomer = editCustomer;
window.saveCustomerEdit = saveCustomerEdit;
window.approveCustomer = approveCustomer;
window.creditCustomer = creditCustomer;
window.debitCustomer = debitCustomer;
window.processTransaction = processTransaction;
window.transferProfit = transferProfit;
window.customerSignup = customerSignup;
window.customerLogin = customerLogin;
window.sendMoney = sendMoney;
window.processUSSD = processUSSD;
window.buyAirtime = buyAirtime;
window.payBill = payBill;
window.createVirtualCard = createVirtualCard;
window.createMiningWallet = createMiningWallet;
window.mineCurrency = mineCurrency;
window.robotTrade = robotTrade;
window.printInvoice = printInvoice;