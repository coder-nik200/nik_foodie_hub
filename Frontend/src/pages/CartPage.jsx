import { useContext } from "react";
import { UserContext } from "../useContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, decrementQty, removeFromCart, clearCart } =
    useContext(UserContext);
  const navigate = useNavigate();

  const getItemLink = (item) => {
    const id = item.variantId || item.id;
    // Prefer explicit variantId prefix where category may be missing
    if (typeof id === "string") {
      if (id.startsWith("sw_") || id.startsWith("sw"))
        return `/foods/sweet/${id}`;
      if (id.startsWith("dr_") || id.startsWith("dr"))
        return `/foods/drinks/${id}`;
    }
    const cat = (item.category || "").toString().toLowerCase();
    if (cat.includes("sweet")) return `/foods/sweet/${id}`;
    if (cat.includes("drink")) return `/foods/drinks/${id}`;
    return `/foods/view-all-hits/${id}`;
  };

  const total = cart.reduce((sum, item) => {
    const price = item.price?.discountedPrice ?? item.discountedPrice ?? 0;
    return sum + price * (item.qty || 1);
  }, 0);

  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-3">Your Cart is Empty 🛒</h1>

        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet
        </p>

        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-5">
        {cart.map((item) => (
          <div
            key={item.variantId || item.id}
            onClick={() => navigate(getItemLink(item))}
            className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <img
              src={item.image || item.photoURL || item.photoUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>

              <p className="text-sm text-gray-500 mt-1">
                {item.usp || item.uspDescription || ""}
              </p>

              <p className="mt-3 text-lg font-bold text-green-600">
                ₹
                {(item.price?.discountedPrice ?? item.discountedPrice ?? 0) *
                  (item.qty || 1)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    decrementQty(item.variantId || item.id);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                >
                  <Minus size={14} />
                </button>

                <span className="font-semibold">{item.qty}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-lg"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(item.variantId || item.id);
                }}
                className="text-sm text-red-500 hover:text-red-600 transition font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-md">
        <div className="text-xl font-semibold">
          Total: <span className="text-green-600">₹{total}</span>
        </div>

        <button
          onClick={() => {
            toast.success("✅ Order placed successfully!");
            setTimeout(() => {
              clearCart();
              navigate("/cart");
            }, 1000);
          }}
          className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
