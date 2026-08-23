const loginButton = document.querySelector("#loginButton");


if (!loginButton) {

    console.error("Login button not found");

} else {

    loginButton.addEventListener("click", async () => {

        const userId =
            document.querySelector("#userId").value.trim();

        const password =
            document.querySelector("#password").value;


        if (!userId || !password) {

            alert(
                "Please enter User ID and password."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/customers/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            userId: userId,

                            password: password

                        })
                    }
                );


            const result =
                await response.json();


            console.log(
                "Login response:",
                result
            );


            if (!response.ok) {

                alert(
                    result.message ||
                    "Login failed."
                );

                return;
            }


            /* =========================
               CUSTOMER INFORMATION
            ========================= */

            const customerId =
                String(result.data.id);

            const customerCode =
                result.data.customerCode;

            const customerName =
                `${result.data.firstName} ${
                    result.data.lastName || ""
                }`.trim();

            const customerEmail =
                result.data.email;


            /* =========================
               SESSION STORAGE
            ========================= */

            sessionStorage.setItem(
                "customerId",
                customerId
            );

            sessionStorage.setItem(
                "customerCode",
                customerCode
            );

            sessionStorage.setItem(
                "customerName",
                customerName
            );

            sessionStorage.setItem(
                "customerEmail",
                customerEmail
            );


            /* =========================
               LOCAL STORAGE
            ========================= */

            localStorage.setItem(
                "customerId",
                customerId
            );

            localStorage.setItem(
                "customerCode",
                customerCode
            );

            localStorage.setItem(
                "customerName",
                customerName
            );

            localStorage.setItem(
                "customerEmail",
                customerEmail
            );


            console.log(
                "Logged in customer ID:",
                customerId
            );


            console.log(
                "Logged in customer:",
                customerName
            );


            alert(
                "Login successful!"
            );


            window.location.href =
                "userdashboard.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to the banking server."
            );

        }

    });

}