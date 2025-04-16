const searchForm = document.querySelector("form.d-flex");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", function(event) {
  event.preventDefault(); 
  const query = searchInput.value; 
  if(query){ 
      alert("You searched for: " + query);
   }
  else{
      alert("Please enter a search term.");
  }
});