document.addEventListener("DOMContentLoaded", () => {
    const alertBox = document.querySelector(".alert");
    if (alertBox) {
        alertBox.classList.add("shake");
        setTimeout(() => {
            alertBox.classList.remove("shake");
        }, 1000);
    }
});
