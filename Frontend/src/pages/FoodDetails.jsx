import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";

export default function FoodDetails() {
  const { id } = useParams();
  const { addToCart, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/foods/category/${id}`)
      .then((res) => {
        setFoods(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/foods/view-all-hits/${item.id}`}>
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={item.photoURL}
                  alt={item.name}
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-1">
                <h3 className="font-semibold line-clamp-1">{item.name}</h3>

                <p className="text-sm text-gray-500 line-clamp-2">{item.usp}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.weight} | {item.pieces || "-"} | Serves {item.serves}
                </p>

                <p className="font-semibold text-base mt-2">
                  ₹{item.price.discountedPrice}
                  <span className="line-through text-gray-400 ml-2">
                    ₹{item.price.mrp}
                  </span>
                  <span className="text-green-600 ml-2 text-sm">
                    ({item.price.discountPercent}% OFF)
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
                  const foodId = item._id || item.id;
                  await addToCart(foodId);
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
    </div>
  );
}
