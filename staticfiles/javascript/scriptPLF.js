document.getElementById("images").addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
        let imgPreview = document.getElementById("imgPreview");
        imgPreview.src = reader.result;
        imgPreview.style.display = "block";
    };
    reader.readAsDataURL(event.target.files[0]);
});
