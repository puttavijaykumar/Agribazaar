document.getElementById("images").addEventListener("change", function (event) {
    const maxSize = 1 * 1024 * 1024; // 2MB
    const files = event.target.files;
    const imagePreview = document.getElementById("imagePreview");
    const sizeLimitMessage = document.getElementById("sizeLimitMessage");

    imagePreview.innerHTML = ""; // Clear old previews/messages

    for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
            const errorMsg = document.createElement("p");
            errorMsg.textContent = `Image "${files[i].name}" is too large. Max size is 1MB.`;
            errorMsg.style.color = "red";
            imagePreview.appendChild(errorMsg);
        } else {
            let reader = new FileReader();
            reader.onload = function () {
                let img = document.createElement("img");
                img.src = reader.result;
                img.style.maxWidth = "100px";
                img.style.margin = "5px";
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(files[i]);
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const negotiationType = document.getElementById('negotiation_type');
    const validityHours = document.getElementById('validity_hours');
    const validityDays = document.getElementById('validity_days');

    function updateValidityFields() {
        const selectedValue = negotiationType.value;
        
        if (selectedValue === 'active') {
            validityDays.disabled = true;
            validityDays.value = '';
            validityHours.disabled = false;
        } else if (selectedValue === 'passive') {
            validityHours.disabled = true;
            validityHours.value = '';
            validityDays.disabled = false;
        } else {
            validityHours.disabled = false;
            validityDays.disabled = false;
        }
    }

    // Initial check on page load
    updateValidityFields();

    // Event listener for negotiation type change
    negotiationType.addEventListener('change', updateValidityFields);
});