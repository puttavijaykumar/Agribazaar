// document.addEventListener("DOMContentLoaded", function () {
//     const password = document.querySelector("#id_password1");
//     const confirmPassword = document.querySelector("#id_password2");

//     if (password && confirmPassword) {
//         confirmPassword.addEventListener("input", function () {
//             if (confirmPassword.value !== password.value) {
//                 confirmPassword.style.borderColor = "red";
//             } else {
//                 confirmPassword.style.borderColor = "green";
//             }
//         });
//     }
// });
// Smooth Scroll on Page Load
window.onload = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Form Validation
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        const email = document.querySelector("input[name='email']").value;
        const phone = document.querySelector("input[name='phone_number']").value;
        const password = document.querySelector("input[name='password1']").value;
        const confirmPassword = document.querySelector("input[name='password2']").value;

        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            event.preventDefault();
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            event.preventDefault();
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            event.preventDefault();
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            event.preventDefault();
        }
    });
});
