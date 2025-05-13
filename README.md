#  Aribazaar – Release 1

Welcome to **Aribazaar** – your one-stop destination for dynamic product listings and real-time offers!

This is **Release 1**, showcasing the core functionality to demonstrate the initial stage of the platform.

---

## Features Included in Release 1

-  **User Authentication**  
  - Registration, Login, and Logout functionality using secure sessions or tokens and allows users into the dashboard according to thier role.

-  **Category-Based Product Section**  
  - Products organized into categories for easy navigation.

-  **News API Integration**  
  - Fetches and displays current e-commerce or tech news using a live news API.

- **Live Product Pricing (API Integration)**  
  - Real-time product prices are fetched from an external pricing API.

-  **Top Offers Section**  
  - Displays current top deals and discounts dynamically.

---

## Features Coming in Future Releases

- products searching functionality
- User profile
- farmer dashboards
- Explore crop section
- Negotiation page(chat between farmer and buyer)  
- Add to cart and Buy now of products 
 

---

##  Tech Stack

- **Frontend:** HTML, CSS, JavaScript 
- **Backend:** Django
- **Database:** PostgreSQL
- **APIs Used:** NewsAPI, Product Pricing API

---

##  How to Run Locally

```bash
# Step 1: Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Step 3: Apply database migrations
python manage.py migrate

# Step 4: Run the development server
python manage.py runserver