document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('paymentForm');
    const message = document.getElementById('orderMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop actual submission for demo

        // Optionally: simulate order placement delay
        setTimeout(() => {
            message.style.display = 'block'; // Show message
        }, 500);

        // Uncomment below if you want to submit after message
        // setTimeout(() => form.submit(), 1500);
    });
});
