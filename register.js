const form = document.querySelector("#registerForm");

if (!form) {
    console.error("registerForm not found");
} else {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const fullName =
            document.querySelector("#fullName").value.trim();

        const dateOfBirth =
            document.querySelector("#dateOfBirth").value;

        const occupation =
            document.querySelector("#occupation").value;

        const mobileNumber =
            document.querySelector("#mobileNumber").value.trim();

        const email =
            document.querySelector("#email").value.trim();

        const address =
            document.querySelector("#address").value.trim();

        const city =
            document.querySelector("#city").value.trim();

        const password =
            document.querySelector("#customerPassword").value;

        const confirmPassword =
            document.querySelector("#confirmPassword").value;


        // Password check
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }


        // Split full name
        const nameParts = fullName.split(/\s+/);

        const firstName = nameParts.shift();

        const lastName =
            nameParts.length > 0
                ? nameParts.join(" ")
                : "";


        try {

            const response = await fetch(
                "http://localhost:3000/api/customers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: mobileNumber,
                        dateOfBirth: dateOfBirth,
                        occupation: occupation,
                        address: address,
                        city: city,
                        state: "",
                        password: password

                    })
                }
            );


            const result = await response.json();

            console.log("Backend response:", result);


            if (!response.ok) {

                alert(
                    result.message ||
                    "Registration failed."
                );

                return;
            }


            // Save customer information
            if (result.data) {

                sessionStorage.setItem(
                    "customerId",
                    result.data.id
                );

                sessionStorage.setItem(
                    "customerCode",
                    result.data.customer_code
                );

                sessionStorage.setItem(
                    "customerName",
                    `${result.data.first_name} ${result.data.last_name || ""}`.trim()
                );
            }


            alert(
                "Registration successful!"
            );


            window.location.href =
                "registereduser.html";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert(
                "Unable to connect to the banking server."
            );
        }

    });
}