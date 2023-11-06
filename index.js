const loader = document.getElementById("loader");
const data = document.getElementById("data");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const searchInput = document.getElementById("searchInput");

// Variables to hold file lines and control rendering
let lines = []; // Array to hold all lines from the file
let originalLines = [];
let start = 0; // Start index for visible lines
let visibleLines = 16; // Number of lines to display at a time
let lineHeight = 20; // An estimated height for each line item

// Function to update the total scrollable height based on the lines array
function updateScrollableHeight(totalLines) {
  const totalHeight = totalLines * lineHeight;
  output.style.height = `${totalHeight}px`;
}

// Function to render lines within the output element
function renderLines(startIndex) {
  // Calculate the visible lines based on the scroll position
  const startLine = Math.max(0, startIndex - visibleLines);
  const endLine = Math.min(lines.length, startIndex + visibleLines * 2);
  console.log("startLine", startLine);
  // Clear previous output
  output.innerHTML = "";

  // Set a spacer div to push down the visible elements
  const spacer = document.createElement("div");
  spacer.style.height = `${startLine * lineHeight}px`;
  output.appendChild(spacer);

  // Append lines within the start and end range
  for (let i = startLine; i < endLine; i++) {
    if (i === 0) continue;
    const li = document.createElement("li");
    li.textContent = `${i}) ${lines[i].replace(/,/g, " | ")}`;
    li.setAttribute("key", i);
    output.appendChild(li);
  }

  if (!lines.length > 0) {
    const noDataElement = document.createElement("li");
    noDataElement.textContent = "No data found";
    output.appendChild(noDataElement);
  }
}

// Event listener for file input change
fileInput.addEventListener("change", (e) => {
  loader.classList.remove("hidden"); // Show the loader
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    originalLines = e.target.result.split("\n"); // Store the original lines
    lines = [...originalLines]; // Clone the original lines
    updateScrollableHeight(lines.length);
    renderLines(0); // Render initial set of lines
    loader.classList.add("hidden"); // Hide the loader
    data.classList.remove("hidden"); // Show the data container
    searchInput.classList.remove("hidden"); // Show the search input
  };
  reader.readAsText(file);
});

// Event listener for search input change
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  if (searchTerm) {
    lines = originalLines.filter((item) =>
      item.toLowerCase().includes(searchTerm)
    );
  } else {
    lines = [...originalLines]; // Restore the original lines when search is cleared
  }
  updateScrollableHeight(lines.length);
  renderLines(0); // Render from the first line after filtering or clearing search
});

// Event listener for scrolling within the data element
data.addEventListener("scroll", () => {
  const scrollTop = data.scrollTop;
  const startIndex = Math.floor(scrollTop / lineHeight);
  renderLines(startIndex);
});

// Set the initial height of the output to 0 to prevent unnecessary scrollbar
output.style.height = "0px";
