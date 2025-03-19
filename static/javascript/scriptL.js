document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const usernameInput = document.querySelector("input[name='username']");
    const passwordInput = document.querySelector("input[name='password']");
    const errorMessage = document.getElementById("error-message");

    if (errorMessage) {
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }

    loginForm.addEventListener("submit", function (event) {
        let isValid = true;

        if (usernameInput.value.trim() === "") {
            isValid = false;
            showError(usernameInput, "Username is required");
        } else {
            clearError(usernameInput);
        }

        if (passwordInput.value.trim() === "") {
            isValid = false;
            showError(passwordInput, "Password is required");
        } else {
            clearError(passwordInput);
        }

        if (!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });

    function showError(input, message) {
        clearError(input);
        const errorElement = document.createElement("small");
        errorElement.className = "error-message";
        errorElement.style.color = "red";
        errorElement.textContent = message;
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    function clearError(input) {
        const existingError = input.parentNode.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }
    }
});
