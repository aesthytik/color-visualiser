const path = "/assets/visualiser.json";
let sidebarData = {};

function createSidebarItem(title, items) {
  const itemElement = document.createElement("div");
  itemElement.className = "dropdown-item";

  const itemTitle = document.createElement("div");
  itemTitle.className = "dropdown-item-title";
  itemTitle.textContent = title;
  itemElement.appendChild(itemTitle);

  const itemContentWrapper = document.createElement("div");
  itemContentWrapper.className = "dropdown-item-content-wrapper";

  const itemContent = document.createElement("div");
  itemContent.className = "dropdown-item-content";
  if (Array.isArray(items)) {
    items.forEach((item) => {
      const itemDiv = document.createElement("div");
      const itemImage = document.createElement("img");
      itemDiv.className = "dropdown-item-content-img";
      itemImage.srcset = item.icon;
      // const itemText = document.createElement("span");
      // itemText.textContent = item.name;

      itemImage.addEventListener("click", () => {
        document.getElementById("c-visualiser__canvas--worktop").srcset =
          item.layer;
      });

      itemDiv.appendChild(itemImage);
      // itemDiv.appendChild(itemText);
      itemContent.appendChild(itemDiv);
    });
  } else {
    console.warn(`Expected an array but got ${typeof items}`);
  }

  itemContentWrapper.appendChild(itemContent);
  itemElement.appendChild(itemContentWrapper);

  return itemElement;
}

function populateSidebar(data) {
  const sidebar = document.querySelector(".sidebar");
  sidebar.innerHTML = ""; // Clear any existing content

  if (data && Array.isArray(data.items)) {
    data.items.forEach((category) => {
      const parentDropdown = document.createElement("div");
      parentDropdown.className = "parent-dropdown";

      const dropdownTitle = document.createElement("div");
      dropdownTitle.className = "dropdown-title";
      dropdownTitle.textContent = category.name;
      parentDropdown.appendChild(dropdownTitle);

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";

      if (Array.isArray(category.sub)) {
        category.sub.forEach((subcategory) => {
          const sidebarItem = createSidebarItem(
            subcategory.name,
            subcategory.sub
          );
          dropdown.appendChild(sidebarItem);
        });
      } else {
        console.warn(
          `Expected an array for subcategories but got ${typeof category.sub}`
        );
      }

      parentDropdown.appendChild(dropdown);
      sidebar.appendChild(parentDropdown);
    });

    // Add event listeners for dropdown toggles
    const dropdownTitles = document.querySelectorAll(".dropdown-title");
    const dropdownItemTitles = document.querySelectorAll(
      ".dropdown-item-title"
    );

    console.log("Adding event listeners to dropdown titles:", dropdownTitles);

    dropdownTitles.forEach((dropdownTitle) => {
      console.log("Attaching event to:", dropdownTitle);
      dropdownTitle.addEventListener("click", () => {
        console.log("Dropdown title clicked:", dropdownTitle);
        const dropdown = dropdownTitle.nextElementSibling;
        if (dropdown) {
          dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
        }
      });
    });

    console.log(
      "Adding event listeners to dropdown item titles:",
      dropdownItemTitles
    );

    dropdownItemTitles.forEach((dropdownItemTitle) => {
      console.log("Attaching event to:", dropdownItemTitle);
      dropdownItemTitle.addEventListener("click", () => {
        console.log("Dropdown item title clicked:", dropdownItemTitle);
        const dropdownItemContent = dropdownItemTitle.nextElementSibling;
        if (dropdownItemContent) {
          dropdownItemContent.style.display =
            dropdownItemContent.style.display === "block" ? "none" : "block";
        }
      });
    });
  } else {
    console.error("Data structure is not as expected:", data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired.");
  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched:", data);
      sidebarData = data;
      populateSidebar(sidebarData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
