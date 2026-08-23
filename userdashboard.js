/* ======================================================
   CURRENT CUSTOMER
====================================================== */

const customerId =
    sessionStorage.getItem("customerId");


if (!customerId) {

    console.error(
        "Customer ID not found in session."
    );

}


/* ======================================================
   AI ASSISTANCE
====================================================== */

const aiInput =
    document.querySelector(
        'input[aria-label="Ask AI assistance"]'
    );


const aiButton =
    document.querySelector(
        'button[aria-label="Send question"]'
    );


if (aiButton && aiInput) {

    aiButton.addEventListener(
        "click",
        async () => {

            const message =
                aiInput.value.trim();


            if (!message) {
                return;
            }


            const aiResponse =
                document.querySelector(
                    "#ai-response"
                );


            if (aiResponse) {

                aiResponse.textContent =
                    "Thinking...";

            }


            if (!customerId) {

                if (aiResponse) {

                    aiResponse.textContent =
                        "Customer session not found. Please login again.";

                }

                return;
            }


            try {

                const response =
                    await fetch(
                        "https://sih-project-w1a6.onrender.com/api/ai/chat",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                customerId:
                                    Number(customerId),

                                message:
                                    message

                            })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "AI Response:",
                    data
                );


                if (data.success) {

                    if (aiResponse) {

                        aiResponse.innerHTML =
                            formatAIResponse(
                                data.response
                            );

                    }

                } else {

                    if (aiResponse) {

                        aiResponse.textContent =
                            "AI service unavailable";

                    }

                }


            } catch (error) {

                console.error(
                    "AI Error:",
                    error
                );


                if (aiResponse) {

                    aiResponse.textContent =
                        "Could not connect to backend";

                }

            }

        }
    );

}


/* ======================================================
   FORMAT AI RESPONSE
====================================================== */

function formatAIResponse(text) {

    let formatted = text;


    /* Escape HTML */

    formatted =
        formatted
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
            );


    /* Bold: **text** */

    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /* Headings: ### Heading */

    formatted =
        formatted.replace(
            /^### (.*)$/gm,
            "<h3>$1</h3>"
        );


    /* Horizontal lines */

    formatted =
        formatted.replace(
            /^---$/gm,
            "<hr>"
        );


    /* Bullet points */

    formatted =
        formatted.replace(
            /^\* (.*)$/gm,
            "<li>$1</li>"
        );


    /* Convert consecutive li into ul */

    formatted =
        formatted.replace(
            /((?:<li>.*?<\/li>\s*)+)/gs,
            "<ul>$1</ul>"
        );


    /* New lines */

    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;
}


/* ======================================================
   LOAD INSIGHTS / NOTIFICATIONS
====================================================== */

async function loadInsights() {

    if (!customerId) {

        console.error(
            "Cannot load insights: customer ID missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `https://sih-project-w1a6.onrender.com/api/customers/${customerId}/insights`
            );


        const result =
            await response.json();


        console.log(
            "Insights response:",
            result
        );


        if (!result.success) {

            console.error(
                "Could not load insights"
            );

            return;
        }


        const notificationsList =
            document.querySelector(
                ".notifications-list"
            );


        if (!notificationsList) {
            return;
        }


        notificationsList.innerHTML = "";


        result.data.forEach(
            insight => {

                const notification =
                    document.createElement(
                        "article"
                    );


                notification.className =
                    `notification-item ${
                        insight.priority === "high"
                            ? "unread"
                            : ""
                    }`;


                notification.innerHTML = `

                    <span
                        class="notification-dot"
                        aria-hidden="true">
                    </span>

                    <div
                        class="notification-body">

                        <strong>
                            ${insight.title}
                        </strong>

                        <p>
                            ${insight.message}
                        </p>

                    </div>

                `;


                notificationsList.appendChild(
                    notification
                );

            }
        );


    } catch (error) {

        console.error(
            "Insights error:",
            error
        );

    }

}


/* ======================================================
   LOAD PRODUCTS
====================================================== */

async function loadProducts() {

    try {

        const response =
            await fetch(
                "https://sih-project-w1a6.onrender.com/api/products"
            );


        const result =
            await response.json();


        console.log(
            "Products response:",
            result
        );


        if (!result.success) {

            console.error(
                "Could not load products"
            );

            return;
        }


        const productsList =
            document.querySelector(
                ".promo-list"
            );


        if (!productsList) {
            return;
        }


        productsList.innerHTML = "";


        result.data.forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "promo-card";


                card.innerHTML = `

                    <strong>
                        ${product.name}
                    </strong>

                    <p>
                        ${product.description}
                    </p>

                    <a
                        href="#"
                        class="promo-action">

                        Click here for details

                    </a>

                `;


                productsList.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Products error:",
            error
        );

    }

}


/* ======================================================
   LOAD CUSTOMER PROFILE
====================================================== */

async function loadCustomerProfile() {

    if (!customerId) {

        console.error(
            "Cannot load customer profile: customer ID missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `https://sih-project-w1a6.onrender.com/api/customers/${customerId}/profile`
            );


        const result =
            await response.json();


        console.log(
            "Customer profile response:",
            result
        );


        if (!result.success) {

            console.error(
                "Could not load customer profile"
            );

            return;
        }


        const data =
            result.data;


        const customer =
            data.customer;


        const financial =
            data.financialProfile;


        const behavior =
            data.behavior;


        /* ------------------------------------------------
           HEADER
        ------------------------------------------------ */

        const welcomeName =
            document.querySelector(
                ".dash-welcome strong"
            );


        if (welcomeName) {

            welcomeName.textContent =
                customer.name;

        }


        const crn =
            document.querySelector(
                ".dash-crn strong"
            );


        if (crn) {

            crn.textContent =
                customer.customerCode;

        }


        /* ------------------------------------------------
           ASSETS
        ------------------------------------------------ */

        const assets =
            document.querySelector(
                ".assets-amount"
            );


        if (assets) {

            assets.textContent =
                `₹${behavior.totalBalance.toLocaleString("en-IN")}.00`;

        }


        /* ------------------------------------------------
           MONTHLY EXPENSES
        ------------------------------------------------ */

        const expenses =
            document.querySelector(
                ".overview-amount"
            );


        if (expenses) {

            expenses.textContent =
                `₹${financial.monthlyExpenses.toLocaleString("en-IN")}.00`;

        }


        /* ------------------------------------------------
           BANKING ACCOUNT BALANCE
        ------------------------------------------------ */

        const bankingBalance =
            document.querySelector(
                ".sidebar-link.active-sidebar .sidebar-link-balance"
            );


        if (bankingBalance) {

            bankingBalance.textContent =
                `₹${behavior.totalBalance.toLocaleString("en-IN")}.00`;

        }


        /* ------------------------------------------------
           TOTAL SAVINGS
        ------------------------------------------------ */

        const totalSavings =
            document.querySelector(
                ".total-savings .total-amount"
            );


        if (totalSavings) {

            totalSavings.textContent =
                `₹${behavior.totalBalance.toLocaleString("en-IN")}.00`;

        }


        console.log(
            "Customer profile loaded:",
            data
        );


    } catch (error) {

        console.error(
            "Customer profile error:",
            error
        );

    }

}


/* ======================================================
   LOAD ACCOUNTS
====================================================== */

async function loadAccounts() {

    if (!customerId) {

        console.error(
            "Cannot load accounts: customer ID missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `https://sih-project-w1a6.onrender.com/api/customers/${customerId}/profile`
            );


        const result =
            await response.json();


        console.log(
            "Accounts response:",
            result
        );


        if (!result.success) {

            console.error(
                "Could not load accounts"
            );

            return;
        }


        const accounts =
            result.data.accounts;


        const tableBody =
            document.querySelector(
                ".tab-content-savings tbody"
            );


        if (!tableBody) {

            console.error(
                "Savings account table not found"
            );

            return;
        }


        tableBody.innerHTML = "";


        accounts.forEach(
            (account, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const accountNumber =
                    account.accountNumber;


                const lastFour =
                    accountNumber.slice(-4);


                const maskedNumber =
                    `**** ${lastFour}`;


                row.innerHTML = `

                    <td class="col-name">

                        <span class="account-name">
                            ${account.productName}
                        </span>

                        <span
                            class="account-type-badge ${
                                index === 0
                                    ? ""
                                    : "secondary-badge"
                            }">

                            ${
                                index === 0
                                    ? "Primary"
                                    : "Account"
                            }

                        </span>

                    </td>


                    <td class="col-number">

                        ${maskedNumber}

                    </td>


                    <td class="col-available">

                        ₹${account.balance.toLocaleString("en-IN")}.00

                    </td>


                    <td class="col-current">

                        ₹${account.balance.toLocaleString("en-IN")}.00

                    </td>


                    <td class="col-actions">

                        <a
                            href="#"
                            class="action-link">

                            Statement

                        </a>

                        <a
                            href="#"
                            class="action-link">

                            Transfer

                        </a>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Accounts error:",
            error
        );

    }

}


/* ======================================================
   START DASHBOARD
====================================================== */

loadInsights();

loadProducts();

loadCustomerProfile();

loadAccounts();