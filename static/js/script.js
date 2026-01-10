document.getElementById("churnForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form elements
    const form = this;
    const submitBtn = document.querySelector('.predict-btn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Collect form data
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = Number(value);
    });

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    resultDiv.className = 'result hidden'; // Reset classes

    try {
        // Make prediction request
        const response = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Hide loading
        loading.classList.add('hidden');

        // Display result with animation
        setTimeout(() => {
            resultDiv.textContent = result.prediction;

            // Add appropriate class based on prediction
            if (result.prediction.includes("Likely to Churn")) {
                resultDiv.classList.add('churn');
            } else {
                resultDiv.classList.add('stay');
            }

            resultDiv.classList.remove('hidden');

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }, 300);

    } catch (error) {
        // Hide loading
        loading.classList.add('hidden');

        // Show error
        resultDiv.textContent = "⚠️ Error: Unable to make prediction. Please try again.";
        resultDiv.classList.add('churn');
        resultDiv.classList.remove('hidden');

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        console.error("Prediction error:", error);
    }
});

// Add input validation visual feedback
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        if (this.validity.valid) {
            this.style.borderColor = 'rgba(46, 204, 113, 0.5)';
        } else {
            this.style.borderColor = 'rgba(231, 76, 60, 0.5)';
        }
    });

    input.addEventListener('blur', function () {
        if (!this.value) {
            this.style.borderColor = '';
        }
    });
});

// Add smooth scroll on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
