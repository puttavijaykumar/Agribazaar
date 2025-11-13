import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.fetchCart()
      .then(data => setCart(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Cart...</div>;

  return (
    <div>
      <h2>My Cart</h2>
      {cart?.items?.length > 0 ? (
        cart.items.map(item => (
          <div key={item.id}>
            {item.product.name} - Quantity: {item.quantity}
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
