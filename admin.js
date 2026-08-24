const kycContainer =
    document.querySelector("#kycApplications");


async function loadKYC() {

    try {

        kycContainer.innerHTML =
            "<p>Loading KYC applications...</p>";


        const response =
            await fetch(
                "https://sih-project-backend-joar.onrender.com/api/kyc"
            );


        const result =
            await response.json();


        console.log(
            "KYC records:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load KYC"
            );

        }


        const records =
            result.data || [];


        if (records.length === 0) {

            kycContainer.innerHTML =
                "<p>No KYC applications found.</p>";

            return;
        }


        kycContainer.innerHTML = "";


        records.forEach((kyc) => {

            const card =
                document.createElement("div");

            card.className =
                "kyc-admin-card";


            const statusClass =
                kyc.status === "approved"
                    ? "kyc-approved"
                    : kyc.status === "rejected"
                    ? "kyc-rejected"
                    : "kyc-pending";


            card.innerHTML = `

                <div class="kyc-admin-header">

                    <div>

                        <h3>
                            ${kyc.first_name || ""}
                            ${kyc.last_name || ""}
                        </h3>

                        <p>
                            Customer:
                            <strong>
                                ${kyc.customer_code}
                            </strong>
                        </p>

                    </div>


                    <span
                        class="kyc-status ${statusClass}"
                    >
                        ${kyc.status}
                    </span>

                </div>


                <div class="kyc-admin-details">

                    <p>
                        <strong>Document:</strong>
                        ${kyc.document_type}
                    </p>

                    <p>
                        <strong>Document Number:</strong>
                        ${kyc.document_number}
                    </p>

                    <p>
                        <strong>Full Name:</strong>
                        ${kyc.full_name}
                    </p>

                    <p>
                        <strong>Date of Birth:</strong>
                        ${kyc.date_of_birth || "Not provided"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${kyc.address || "Not provided"}
                    </p>

                    <p>
                        <strong>City:</strong>
                        ${kyc.city || "Not provided"}
                    </p>

                    <p>
                        <strong>State:</strong>
                        ${kyc.state || "Not provided"}
                    </p>

                    <p>
                        <strong>Postal Code:</strong>
                        ${kyc.postal_code || "Not provided"}
                    </p>

                </div>


                ${
                    kyc.status === "pending"
                    ? `

                    <div class="kyc-admin-actions">

                        <button
                            class="approve-kyc"
                            data-id="${kyc.id}"
                        >
                            Approve
                        </button>


                        <button
                            class="reject-kyc"
                            data-id="${kyc.id}"
                        >
                            Reject
                        </button>

                    </div>

                    `
                    : ""
                }

            `;


            kycContainer.appendChild(card);

        });


        attachKYCButtons();


    } catch (error) {

        console.error(
            "Load KYC error:",
            error
        );


        kycContainer.innerHTML = `
            <p>
                Unable to load KYC applications.
            </p>
        `;

    }

}


function attachKYCButtons() {


    const approveButtons =
        document.querySelectorAll(
            ".approve-kyc"
        );


    const rejectButtons =
        document.querySelectorAll(
            ".reject-kyc"
        );


    approveButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                async () => {

                    const kycId =
                        button.dataset.id;


                    await updateKYCStatus(
                        kycId,
                        "approved"
                    );

                }
            );

        }
    );


    rejectButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                async () => {

                    const kycId =
                        button.dataset.id;


                    const reason =
                        prompt(
                            "Enter rejection reason:"
                        );


                    if (!reason ||
                        !reason.trim()) {

                        alert(
                            "Rejection reason is required."
                        );

                        return;
                    }


                    await updateKYCStatus(
                        kycId,
                        "rejected",
                        reason.trim()
                    );

                }
            );

        }
    );

}


async function updateKYCStatus(
    kycId,
    status,
    rejectionReason = null
) {

    try {

        const confirmed =
            confirm(
                status === "approved"
                    ? "Approve this KYC?"
                    : "Reject this KYC?"
            );


        if (!confirmed) {

            return;

        }


        const response =
            await fetch(
                `https://sih-project-backend-joar.onrender.com/api/kyc/${kycId}/status`,
                {

                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        status:
                            status,

                        rejectionReason:
                            rejectionReason

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Update KYC response:",
            result
        );


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to update KYC status."
            );

            return;

        }


        alert(
            result.message ||
            `KYC ${status} successfully`
        );


        await loadKYC();


    } catch (error) {

        console.error(
            "Update KYC error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


loadKYC();

