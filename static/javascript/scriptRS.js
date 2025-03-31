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
                "X-CSRFToken": document.querySelector("meta[name='csrf-token']").content
            },
            body: JSON.stringify({ role: role })
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.redirect) {
                console.log("Redirecting to:", data.redirect);  // Debugging log
                window.location.href = data.redirect;
            } else {
                console.error("Unexpected response:", data);
            }
        })
        .catch(error => console.error("Error:", error));
    }
});
