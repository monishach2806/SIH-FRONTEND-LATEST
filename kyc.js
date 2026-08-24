const kycForm = document.querySelector("#kycForm");

const statusMessage =
    document.querySelector("#statusMessage");


kycForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    /*
       Try both storages.
       Dashboard/login may store the customer ID
       in either sessionStorage or localStorage.
    */

    let customerId =
        sessionStorage.getItem("customerId");

    if (!customerId) {

        customerId =
            localStorage.getItem("customerId");

    }


    console.log(
        "Customer ID:",
        customerId
    );


    if (!customerId) {

        alert(
            "Customer session not found. Please login again."
        );

        return;
    }


    const documentType =
        document.querySelector("#documentType").value;


    const documentNumber =
        document.querySelector("#documentNumber")
            .value
            .trim();


    const fullName =
        document.querySelector("#fullName")
            .value
            .trim();


    const dateOfBirth =
        document.querySelector("#dateOfBirth").value;


    const address =
        document.querySelector("#address")
            .value
            .trim();


    const city =
        document.querySelector("#city")
            .value
            .trim();


    const state =
        document.querySelector("#state")
            .value
            .trim();


    const postalCode =
        document.querySelector("#postalCode")
            .value
            .trim();


    if (
        !documentType ||
        !documentNumber ||
        !fullName
    ) {

        alert(
            "Please fill all required KYC details."
        );

        return;
    }


    try {

        statusMessage.textContent =
            "Submitting KYC...";


        const response =
            await fetch(
                "https://sih-project-backend-joar.onrender.com/api/kyc",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customerId:
                            Number(customerId),

                        documentType:
                            documentType,

                        documentNumber:
                            documentNumber,

                        fullName:
                            fullName,

                        dateOfBirth:
                            dateOfBirth || null,

                        address:
                            address || null,

                        city:
                            city || null,

                        state:
                            state || null,

                        postalCode:
                            postalCode || null

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "KYC response:",
            result
        );


        if (!response.ok) {

            statusMessage.textContent = "";

            alert(
                result.message ||
                "KYC submission failed."
            );

            return;
        }


        statusMessage.textContent =
            "KYC submitted successfully!";


        alert(
            "KYC submitted successfully!"
        );


        /*
           Keep the customer ID available
           for the dashboard.
        */

        sessionStorage.setItem(
            "customerId",
            String(customerId)
        );


        window.location.href =
            "userdashboard.html";


    } catch (error) {

        console.error(
            "KYC error:",
            error
        );


        statusMessage.textContent = "";


        alert(
            "Unable to connect to the banking server."
        );

    }

});

