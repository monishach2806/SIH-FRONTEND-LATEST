const aiInput = document.querySelector('input[aria-label="Ask AI assistance"]');
const aiButton = document.querySelector('button[aria-label="Send question"]');

if (aiInput && aiButton) {

    const answerBox = document.createElement("div");
    answerBox.id = "ai-answer";
    answerBox.style.marginTop = "15px";
    answerBox.style.padding = "12px";
    answerBox.style.borderRadius = "10px";
    answerBox.style.background = "#ffffff";
    answerBox.style.color = "#163d70";
    answerBox.style.fontSize = "14px";
    answerBox.style.lineHeight = "1.5";
    answerBox.style.display = "none";

    const aiColumn = document.querySelector(".compact-ai-column");

    if (aiColumn) {
        aiColumn.appendChild(answerBox);
    }

    async function askAI() {

        const message = aiInput.value.trim();

        if (!message) {
            answerBox.style.display = "block";
            answerBox.textContent = "Please enter a question.";
            return;
        }

        aiButton.disabled = true;
        aiButton.textContent = "...";

        answerBox.style.display = "block";
        answerBox.textContent = "Thinking...";

        try {

            const response = await fetch(
                "https://sih-project-backend-joar.onrender.com/api/ai/bank-chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message,
                        customerProfile: {},
                        products: [
    {
        name: "Savings Account",
        type: "Savings",
        description: "A standard savings account for personal banking.",
        eligibility: "Available to eligible individual customers."
    },
    {
        name: "Current Account",
        type: "Current",
        description: "A current account designed for regular banking transactions.",
        eligibility: "Available to eligible customers."
    },
    {
        name: "Fixed Deposit",
        type: "Deposit",
        description: "A fixed-term deposit product for customers who want to keep money invested for a defined period.",
        eligibility: "Available to eligible customers."
    }
]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "AI request failed");
            }

            answerBox.textContent =
                data.response ||
                data.message ||
                "Sorry, I could not generate an answer.";

        } catch (error) {

            console.error("AI error:", error);

            answerBox.textContent =
                `ERROR: ${error.message}`;

        } finally {

            aiButton.disabled = false;
            aiButton.textContent = "?";
        }
    }

    aiButton.addEventListener("click", askAI);

    aiInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            askAI();
        }

    });
}





