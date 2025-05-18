document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  body.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
});
