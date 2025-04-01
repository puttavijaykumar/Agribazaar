document.addEventListener("DOMContentLoaded", function () {
    console.log("Account Dashboard Loaded");

    // Example: Alert when downloading PDF
    document.querySelector(".btn").addEventListener("click", function () {
        alert("Your transaction statement is being downloaded.");
    });
});
