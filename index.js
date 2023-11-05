const loader = document.getElementById("loader");
const data = document.getElementById("data");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

let lines = [];
let start = 0;
let visibleLines = 15;

fileInput.addEventListener("change", (e) => {
  loader.classList.remove("hidden");

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const fileContents = e.target.result;
    lines = fileContents.split("\n");
    renderLines();
    loader.classList.add("hidden");
    data.classList.remove("hidden");
  };
  reader.readAsText(file);
});

function renderLines() {
  // Remove all existing lines
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  // Render the visible lines
  for (let i = start; i < start + visibleLines && i < lines.length; i++) {
    const li = document.createElement("li");
    li.textContent = lines[i].replace(/,/g, " | ");
    output.appendChild(li);
  }
}

output.addEventListener("scroll", () => {
  console.log("first");
  // Calculate the index of the first visible line
  const newStart = Math.floor(output.scrollTop / 30); // Adjust 30 to the height of your lines

  // Only update the start index and render new lines if the new start index is different
  if (newStart !== start) {
    start = newStart;
    renderLines();
  }
});
