document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");

  sections.forEach((section) => {
    section.addEventListener("click", () => {
      const link = section.getAttribute("data-link");
      if (link) {
        window.location.href = link;
      }
    });
  });
});
