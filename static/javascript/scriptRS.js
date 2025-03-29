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
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Redirect to the dashboard
            }
        }).catch(error => console.error("Error:", error));
    }

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
});
