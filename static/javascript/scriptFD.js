document.addEventListener("DOMContentLoaded", function () {
    // Handle Image Preview
    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById("imagePreview");
                imagePreview.src = e.target.result;
                imagePreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Product Upload
    document.getElementById("productForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form default submission

        const productName = document.getElementById("productName").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = document.getElementById("price").value.trim();
        const quantity = document.getElementById("quantity").value.trim();
        const image = document.getElementById("imageInput").files[0];
        const video = document.getElementById("videoInput").files[0];

        if (!productName || !description || !price || !quantity) {
            alert("Please fill in all required fields.");
            return;
        }

        // Create JSON Data for Product Upload
        const productData = {
            productName: productName,
            description: description,
            price: price,
            quantity: quantity
        };

        // If No Image/Video -> Send JSON via Fetch API
        if (!image && !video) {
            fetch("/farmer/dashboard/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(), // Get CSRF Token
                },
                body: JSON.stringify(productData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("succes " + data.success);
                    window.location.reload();
                } else {
                    alert(" Error: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        } else {
            // If Image/Video Exists -> Send FormData
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("quantity", quantity);
            if (image) formData.append("image", image);
            if (video) formData.append("video", video);

            fetch("/farmer/dashboard/", {
                method: "POST",
                headers: { "X-CSRFToken": getCSRFToken() }, // CSRF Token for Django
                body: formData,
            })
            .then(response => response.text()) // Expecting redirect, not JSON
            .then(() => window.location.reload()) // Reload page after successful upload
            .catch(error => console.error("Error:", error));
        }
    });

    // Function to Get CSRF Token from Cookies
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            document.cookie.split(";").forEach(cookie => {
                const [name, value] = cookie.trim().split("=");
                if (name === "csrftoken") cookieValue = decodeURIComponent(value);
            });
        }
        return cookieValue;
    }
});
