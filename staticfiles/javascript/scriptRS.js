document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("farmerBox").addEventListener("click", function () {
        sendRoleSelection("Farmer");
    });

    document.getElementById("buyerBox").addEventListener("click", function () {
        sendRoleSelection("Buyer");
    });

    function sendRoleSelection(role) {
        fetch("/role_selection/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken() // Include CSRF token
            },
            body: JSON.stringify({ role: role })
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect; // Redirect to dashboard
            } else {
                console.error("Unexpected response:", data);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    function getCSRFToken() {
        return document.querySelector("meta[name='csrf-token']").getAttribute("content");
    }
});
