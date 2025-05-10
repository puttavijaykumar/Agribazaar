document.getElementById("images").addEventListener("change", function (event) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const files = event.target.files;
    const imagePreview = document.getElementById("imagePreview");

    imagePreview.innerHTML = ""; // Clear old previews/messages

    for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
            const errorMsg = document.createElement("p");
            errorMsg.textContent = `Image "${files[i].name}" is too large. Max size is 2MB.`;
            errorMsg.style.color = "red";
            imagePreview.appendChild(errorMsg);
            this.value = ""; // Clear the input
            break; // Stop previewing if any file is too large
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
