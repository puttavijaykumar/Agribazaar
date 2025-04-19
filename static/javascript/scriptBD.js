document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchForm = searchInput.closest("form");
  
  // Create and insert results container dynamically
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'search-results';
  resultsContainer.className = 'search-results-container mt-3';
  searchForm.parentNode.insertBefore(resultsContainer, searchForm.nextSibling);

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      // Show loading state
      resultsContainer.innerHTML = '<div class="text-center">Searching...</div>';
      
      fetch('/search-products/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({ search_query: query })
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Search results:", data);
        if (data.products && data.products.length > 0) {
          renderProducts(data.products);
        } else {
          resultsContainer.innerHTML = '<div class="alert alert-info">No results found</div>';
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        resultsContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      });
    }
  });

  function renderProducts(products) {
    resultsContainer.innerHTML = products.map(product => `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-3 media-container">
            ${product.video_url ? `
              <video controls class="img-fluid rounded-start" poster="${product.image_url || '/static/images/video-placeholder.png'}">
                <source src="${product.video_url}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            ` : `
              <img src="${product.image_url || '/static/images/placeholder.png'}" 
                   class="img-fluid rounded-start" 
                   alt="${product.productName}">
            `}
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${product.productName}</h5>
              <p class="card-text">₹${product.price}</p>
              <p class="card-text"><small class="text-body-secondary">${product.description}</small></p>
              ${product.video_url ? `
                <button class="btn btn-sm btn-outline-primary mt-2 watch-video" 
                        data-video-url="${product.video_url}">
                  Watch Video
                </button>
              ` : ''}
              <p class="card-text">Quantity: ${product.quantity}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add video modal handlers
    document.querySelectorAll('.watch-video').forEach(button => {
      button.addEventListener('click', () => showVideoModal(button.dataset.videoUrl));
    });
  }

  function showVideoModal(videoUrl) {
    const modalHTML = `
      <div class="modal fade" id="videoModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Product Video</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <video controls class="w-100" id="modalVideoPlayer">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize Bootstrap modal
    const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
    videoModal.show();

    // Cleanup when modal is closed
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('videoModal').remove();
    });
  }

  // CSRF token retrieval function
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});