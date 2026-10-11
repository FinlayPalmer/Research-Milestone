
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";
import "../Store.css";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    id: 4,
    name: "Minimalist Backpack",
    category: "Fashion",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
  },
  {
    id: 5,
    name: "Coffee Mug",
    category: "Home",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
  },
];

const categories = ["All", "Electronics", "Fashion", "Home"];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function Store() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const cartItems = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function addToCart(id) {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  }

  function deleteFromCart(id) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function checkout() {
    if (cartCount === 0) return;

    // Demo only: no payment request or order creation
    setCart({});
    setCartOpen(false);
    setOrderComplete(true);
  }

  return (
    <div className="store-page">
      <div className="store-heading">
        <div>
          <h1>Discover Products</h1>
          <p>Browse our collection of products.</p>
        </div>

        <button
          className="store-cart-button"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart size={19} />
          Cart
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>
      </div>

      <div className="store-banner">
        <div>
          <span>WELCOME TO OUR STORE</span>
          <h2>Find something you'll love.</h2>
          <p>Explore our latest collection of products.</p>
        </div>
        <Package size={70} className="store-banner-icon" />
      </div>

      <div className="store-toolbar">
        <div className="store-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="store-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="store-results">
        {filteredProducts.length} products
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-details">
              <span className="product-category">
                {product.category}
              </span>
              <h3>{product.name}</h3>
              <div className="product-bottom">
                <strong>{formatPrice(product.price)}</strong>
                <button onClick={() => addToCart(product.id)}>
                  <Plus size={17} />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="store-empty">
          No products found. Try another search.
        </div>
      )}

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2>Shopping Cart ({cartCount})</h2>
              <button
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={42} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <strong>{formatPrice(item.price)}</strong>

                      <div className="cart-quantity">
                        <button
                          aria-label={`Decrease ${item.name}`}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label={`Increase ${item.name}`}
                          onClick={() => addToCart(item.id)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-remove"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => deleteFromCart(item.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p>Demo checkout. No payment will be collected.</p>
              <button
                className="checkout-button"
                disabled={cartCount === 0}
                onClick={checkout}
              >
                Demo Checkout
              </button>
            </div>
          </aside>
        </div>
      )}

      {orderComplete && (
        <div className="cart-overlay">
          <div className="checkout-success" role="alertdialog" aria-modal="true">
            <CheckCircle2 size={56} color="#16a34a" />
            <h2>Demo Order Complete!</h2>
            <p>
              Your mock purchase was successful.
              No payment was processed.
            </p>
            <button onClick={() => setOrderComplete(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
