import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import api, { addToCartAPI } from "../api/axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";

const DrinksDetails = () => {
  const navigate = useNavigate();
  const { addToCart, user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/foods/drinks")
      .then((res) => {
        setCategory(res.data);
        setProducts(res.data.products);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  }, []);

  return (
    <section className="w-full min-h-screen py-6 px-4 lg:px-60">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="text-xl md:hidden text-gray-700 hover:text-orange-500 transition"
        >
          <FaArrowLeftLong />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-wide text-gray-900">
          Refreshing Drinks
        </h2>

        {/* Search Icon */}
        <button className="text-xl md:hidden text-gray-700 hover:text-orange-500 transition">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item) => (
          <div
            key={item.variantId}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/foods/drinks/${item.variantId}`} key={item.id}>
              {/* Product Image */}
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 space-y-1">
                {/* Product Name */}
                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                  {item.name.length > 48
                    ? item.name.slice(0, 30) + "..."
                    : item.name}
                </h3>

                {/* USP / Description */}
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                  {item.uspDescription.length > 48
                    ? item.uspDescription.slice(0, 48) + "..."
                    : item.uspDescription}
                </p>

                {/* Weight | Pieces | Serves */}
                <p className="text-xs text-gray-500 mt-1">
                  {item.weight} | {item.pieces} pcs | Serves {item.serves}
                </p>

                {/* Price */}
                <p className="font-semibold text-base mt-2">
                  ₹{item.discountedPrice}
                  <span className="text-gray-400 line-through ml-2">
                    ₹{item.basePrice}
                  </span>
                  <span className="text-green-600 ml-2 text-sm">
                    ({item.discountPercentage}% OFF)
                  </span>
                </p>
              </div>
            </Link>

            {/* CTA */}
            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to add items to cart");
                  navigate("/login");
                  return;
                }

                try {
                  await addToCartAPI(item.id || item.variantId || item._id);
                  addToCart(item);
                  toast.success(`✅ ${item.name} added to cart!`);
                  navigate("/cart");
                } catch (error) {
                  toast.error(error);
                }
              }}
              className="w-full py-3 bg-orange-500 text-white font-semibold
                         hover:bg-orange-600 active:scale-95 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DrinksDetails;
