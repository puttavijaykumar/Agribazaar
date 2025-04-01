document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("productBox").addEventListener("click", function () {
        sendRoleSelection("Product");
    });

    document.getElementById("accountsBox").addEventListener("click", function () {
        sendRoleSelection("Accounts");
    });

    function getCSRFToken() {
        let csrfToken = null;
        document.cookie.split(";").forEach(cookie => {
            let [name, value] = cookie.trim().split("=");
            if (name === "csrftoken") {
                csrfToken = value;
            }
        });
        return csrfToken;
    }

    function sendRoleSelection(role) {
        fetch("/farmer/dashboard/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ role: role })
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.redirect) {
                localStorage.setItem("selectedRole", role);  // Store role in localStorage
                window.location.href = data.redirect;
            } else {
                console.error("Unexpected response:", data);
            }
        })
        .catch(error => console.error("Error:", error));
    }
});
