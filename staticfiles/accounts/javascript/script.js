document.addEventListener("DOMContentLoaded", function () {
    const password = document.querySelector("#id_password1");
    const confirmPassword = document.querySelector("#id_password2");

    if (password && confirmPassword) {
        confirmPassword.addEventListener("input", function () {
            if (confirmPassword.value !== password.value) {
                confirmPassword.style.borderColor = "red";
            } else {
                confirmPassword.style.borderColor = "green";
            }
        });
    }
});
