const imageInput = document.getElementById("imageInput");
const gallery = document.getElementById("gallery");

imageInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement("img");
      img.src = event.target.result;

      const container = document.createElement("div");
      container.className = "gallery-item";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";

      deleteBtn.addEventListener("click", () => {
        gallery.removeChild(container);
      });

      container.appendChild(img);
      container.appendChild(deleteBtn);
      gallery.appendChild(container);
    };
    reader.readAsDataURL(file);
  });

  // Reset the input so re-selecting the same image works
  imageInput.value = "";
});
