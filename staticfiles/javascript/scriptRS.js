document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("farmerBox").addEventListener("click", function () {
        sendRoleSelection("Farmer");
    });

    document.getElementById("buyerBox").addEventListener("click", function () {
        sendRoleSelection("Buyer");
    });

    function sendRoleSelection(role) {
        let csrfToken = getCSRFToken();

        fetch("/role_selection/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken  //document.querySelector("meta[name='csrf-token']").content
            },
            body: JSON.stringify({ role: role })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;  // Redirect user to dashboard
            } else {
                console.error("Unexpected response:", data);
            }
        })
        .catch(error => console.error("Error:", error));
    }


    function getCSRFToken() {
        let tokenElement = document.querySelector("meta[name='csrf-token']");
        return tokenElement ? tokenElement.getAttribute("content") : "";
    }
});
