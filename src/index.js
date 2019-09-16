import { basicSort } from "/src/utils.js";

/**
 * TODO:
 *
 * [x] Get API key, check docs and get some data back from the Bungie API
 * [x] Read up on web components and implement something basic (template)
 * [x] Loop through data and display a table row for each item
 * [x] Add some basic sort function
 * [x] Make th clickable to select sort criteria and toggle sort direction
 * [x] Add some basic styling
 * [x] Display some notification to the user that we are fetching data
 * [ ] Catch error and render something to the user
 *
 * Extra
 * [x] Put items together and render in one go instead of render during iterating
 * [x] Add some fancy styling
 * [x] Add some styling to indicate which column is being sorted
 * [x] Move Utility function to module and import
 * [ ] Create basic discrete web components from templates
 * [ ] Tidy css and class names
 *
 * Notes
 * [1] I am aware of race conditions and the dangers of managing state in this way (side effects)
 * [2] Ideally state manipulation would be managed agnostic of components, they fire events for a state manager and re-render if/when new data is provided to them
 * [3] There are assumptions for things like, having data in the render function and load order
 * [4] Code has been left inplace so it is quick to create discrete components, instead of moving code to individual files prematurely
 *
 */

// API vars
const API_URL = new URL(
  "https://www.bungie.net/Platform/Trending/Categories/Trending/0/"
);
const API_OPTIONS = {
  headers: {
    "X-API-Key": "c98d45d4434546bfaa5ad45464b86230"
  }
};

// Some simple app state
const state = {
  sortField: "creationDate",
  sortReverse: true,
  data: null
};

// Templates
const newsRow = document.getElementById("newsRow");

/**
 * Fetch Data
 */
fetch(API_URL, API_OPTIONS)
  .then(res => res.json())
  .then(res => {
    // Would normally go via some state management
    state.data = res.Response.results;
    SortDataWithFieldName(state.sortField, state.sortReverse);
    // Some setup which would normally live in their respective components
    SetupSortButtons();
    HideLoader();
    // Render results
    return RenderDataFromState();
  });

/**
 * Render Data from State
 */
function RenderDataFromState() {
  const tableBody = document.querySelector(".newsContents");
  const tableContents = document.createDocumentFragment();

  for (const row of state.data) {
    const tableRow = document.importNode(newsRow.content, true);

    tableRow.querySelector(
      ".newsRow"
    ).style.backgroundImage = `url(https://www.bungie.net/${row.image})`;
    tableRow.querySelector(".newsCell__link").textContent = row.displayName;
    tableRow
      .querySelector(".newsCell__link")
      .setAttribute("href", `https://www.bungie.net/${row.link}`);

    tableRow.querySelector(".newsRow__creationDate").textContent = new Date(
      row.creationDate
    ).toLocaleDateString();
    // Append to unrendered document fragment
    tableContents.appendChild(tableRow);
  }

  tableBody.innerHTML = "";
  tableBody.appendChild(tableContents);
}

/**
 * Update state.sortField, state.sortReverse and state.data with provided fieldName
 */
function SortDataWithFieldName(fieldName) {
  if (state.sortField !== fieldName) {
    state.sortField = fieldName;
  } else {
    state.sortReverse = !state.sortReverse;
  }

  SetActiveSortClass(fieldName, state.sortReverse);

  state.data.sort(basicSort(state.sortField, state.sortReverse));
}

/**
 * Set active class on sort nodes for styling
 */
function SetActiveSortClass(fieldName, reverse) {
  const activeSortLink = document.querySelector(
    `.headCell__link[data-fieldName=${fieldName}]`
  );
  const oldSortLink = document.querySelector(".headCell__link.active");
  const direction = reverse ? "asc" : "desc";

  // Remove previous active classes
  if (oldSortLink) {
    oldSortLink.classList.remove("active", "asc", "desc");
  }
  // Set active css class
  activeSortLink.classList.add("active", direction);
}

/**
 * Hide Loader
 */
function HideLoader() {
  const loader = document.querySelector(".loader");
  const table = document.querySelector(".newsTable");
  loader.style.display = "none";
  table.style.display = "table";
}

/**
 * Setup sort button events
 */
function SetupSortButtons() {
  const sortButtons = document.querySelectorAll(".headCell__link");
  for (const button of sortButtons) {
    button.addEventListener("click", e => {
      const fieldName = e.currentTarget.getAttribute("data-fieldName");
      SortDataWithFieldName(fieldName);
      RenderDataFromState();
    });
  }
}
