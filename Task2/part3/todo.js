const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const dateValue = taskDate.value; // format: "YYYY-MM-DD"

  if (!taskText) return;

  // Format date nicely or show empty if no date selected
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString()
    : "";

  const li = document.createElement("li");

  // Create a span for the date on left
  const dateSpan = document.createElement("span");
  dateSpan.textContent = formattedDate;
  dateSpan.style.marginRight = "1rem";
  dateSpan.style.fontWeight = "600";
  dateSpan.style.color = "#2980b9";

  // Create a span for task text
  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;
  textSpan.style.flex = "1";

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";

  delBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  // Make li a flex container
  li.style.display = "flex";
  li.style.alignItems = "center";

  // Append date, text, delete button to li
  li.appendChild(dateSpan);
  li.appendChild(textSpan);
  li.appendChild(delBtn);

  taskList.appendChild(li);

  // Reset inputs
  taskInput.value = "";
  taskDate.value = "";
  taskInput.focus();
});
