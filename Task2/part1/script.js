document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear previous errors
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("messageError").textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  let isValid = true;

  // Validate name
  if (name === "") {
    document.getElementById("nameError").textContent =
      "Please enter your name.";
    isValid = false;
  }

  // Validate email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (email === "") {
    document.getElementById("emailError").textContent =
      "Please enter your email.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent =
      "Enter a valid email address.";
    isValid = false;
  }

  // Validate message
  if (message === "") {
    document.getElementById("messageError").textContent =
      "Please enter your message.";
    isValid = false;
  }

  // If all is valid, simulate submission
  if (isValid) {
    alert("Form submitted successfully!");
    document.getElementById("contactForm").reset();
  }
});
