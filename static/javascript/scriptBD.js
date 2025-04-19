document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchForm = searchInput.closest("form");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();  // ❗ Prevent form from reloading the page

    const query = searchInput.value.trim();

    if (query) {
      fetch(searchProductsURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          search_query: query
        })
      })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        console.log("Search results:", data);
        search_products(data);  // This should render the search result
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("An error occurred while fetching search results. Please try again.");
      });
    } else {
      alert("Please enter a search term.");
    }
  });
});

// CSRF helper function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
