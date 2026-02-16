import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { addToCartAPI } from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";
import { RenderStars } from "../components/RenderStarts";
import FullMenu from "../components/FullMenu";

export default function ViewAllHitsPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");
  const { addToCart, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get(`/foods/view-all-hits/${id}`)
      .then((res) => setFood(res.data.product))
      .catch(() =>
        api
          .get(`/foods/sweet/${id}`)
          .then((res) => setFood(res.data.product))
          .catch(() =>
            api
              .get(`/foods/drinks/${id}`)
              .then((res) => setFood(res.data.product))
              .catch((err) =>
                setError(err.response?.data?.message || "Something went wrong"),
              ),
          ),
      );

    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products || []))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!food) return <p className="text-center mt-20">Loading...</p>;

  const recommendations = allFoods.filter(
    (item) =>
      item.variantId &&
      item.category === food.category &&
      item.variantId !== food.variantId,
  );

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      // Use the correct ID property from the food object
      const foodIdToSend = food.id || food._id || food.variantId;
      
      if (!foodIdToSend) {
        toast.error("Food ID not found");
        return;
      }

      await addToCartAPI(foodIdToSend);
      addToCart(food); // keep UI instant
      toast.success(`${food.name} added to cart`);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error || "Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= FOOD DETAILS ================= */}
        <div
          className="bg-white rounded-3xl shadow-lg p-6 md:p-10
                        grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={food.photoURL}
              alt={food.name}
              className="w-full max-w-md rounded-2xl shadow-md
                         hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                {food.name}
              </h1>

              <p className="text-gray-600 mt-3 leading-relaxed">{food.usp}</p>

              {/* Info */}
              <div className="mt-6 space-y-2 text-sm md:text-base">
                <p>
                  <strong>Category:</strong> {food.category}
                </p>
                <p>
                  <strong>Weight:</strong> {food.weight}
                </p>
                <p>
                  <strong>Pieces:</strong> {food.pieces}
                </p>
                <p>
                  <strong>Serves:</strong> {food.serves}
                </p>

                <p className="flex items-center gap-2">
                  <strong>Rating:</strong>
                  {food.rating ? (
                    <>
                      <span className="text-yellow-500">
                        {RenderStars(food.rating.value)}
                      </span>
                      <span className="text-gray-500">
                        ({food.rating.value}/5 · {food.rating.reviews})
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">No ratings yet</span>
                  )}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-green-600">
                  ₹{food.price?.discountedPrice ?? food.discountedPrice ?? 0}
                </span>

                <span className="line-through text-gray-400">
                  ₹{food.price?.mrp ?? food.basePrice ?? 0}
                </span>

                <span className="text-red-500 font-semibold">
                  ({food.price?.discountPercent ?? food.discountPercentage ?? 0}
                  % OFF)
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-8 w-full md:w-fit px-8 py-4
             bg-orange-500 text-white font-semibold
             rounded-xl shadow-md
             hover:bg-orange-600 hover:shadow-lg
             transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* ================= RECOMMENDATIONS ================= */}
        {recommendations.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Recommended {food.category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <Link
                  to={`/foods/view-all-hits/${item.variantId}`}
                  key={item.variantId}
                  className="bg-white rounded-2xl overflow-hidden
                             shadow-sm hover:shadow-xl
                             hover:-translate-y-1
                             transition-all duration-300"
                >
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{item.name}</h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.usp}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 text-sm">
                        {item.rating
                          ? RenderStars(item.rating.value)
                          : "No rating"}
                      </span>

                      <span className="font-bold text-green-600">
                        ₹{item.price?.discountedPrice ?? 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ================= FULL MENU ================= */}
        <div className="mt-24">
          <FullMenu />
        </div>
      </div>
    </div>
  );
}
