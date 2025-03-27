document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("farmerBox").addEventListener("click", function () {
        window.location.href = "/farmer_dashboard/";
    });

    document.getElementById("buyerBox").addEventListener("click", function () {
        window.location.href = "/buyer_dashboard/";
    });
});
