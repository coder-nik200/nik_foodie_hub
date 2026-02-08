import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";
import { RenderStars } from "../components/RenderStarts";

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

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!food) return <p className="text-center mt-10">Loading...</p>;

  const recommendations = allFoods.filter(
    (item) =>
      item.variantId &&
      item.category === food.category &&
      item.variantId !== food.variantId,
  );

  const otherFoods = allFoods.filter(
    (item) => item.variantId && item.variantId !== food.variantId,
  );

  return (
    <div className="min-h-screen px-3 sm:px-6 md:px-10 py-6 max-w-6xl mx-auto">
      {/* FOOD DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <img
          src={food.photoURL}
          alt={food.name}
          className="w-full max-w-sm sm:max-w-md mx-auto rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {food.name}
          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">{food.usp}</p>

          <div className="mt-4 space-y-1 text-sm sm:text-base">
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

            <p>
              <strong>Rating:</strong>{" "}
              <span className="text-yellow-500">
                {RenderStars(food.rating?.value)}
              </span>{" "}
              {food.rating
                ? `(${food.rating.value} / 5, ${food.rating.reviews} reviews)`
                : "(No ratings yet)"}
            </p>
          </div>

          {/* PRICE */}
          <div className="mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{food.price?.discountedPrice ?? food.discountedPrice ?? 0}
            </span>

            <span className="line-through text-gray-500 ml-3">
              ₹{food.price?.mrp ?? food.basePrice ?? 0}
            </span>

            <span className="ml-3 text-red-500 font-semibold">
              ({food.price?.discountPercent ?? food.discountPercentage ?? 0}%
              OFF)
            </span>
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login to add items to cart");
                navigate("/login");
                return;
              }

              addToCart(food);
              toast.success(`✅ ${food.name} added to cart!`);
              navigate("/cart");
            }}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Recommended {food.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/view-all-hits/${item.variantId}`}
                key={item.variantId}
                className="group bg-white rounded-2xl overflow-hidden
                     shadow-sm hover:shadow-xl
                     transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    className="h-36 sm:h-40 w-full object-cover
                         group-hover:scale-105
                         transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {item.usp}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-yellow-500 text-sm">
                      {RenderStars(item.rating?.value)}{" "}
                      <span className="text-gray-500">
                        ({item.rating?.value || 0})
                      </span>
                    </span>

                    <span className="font-bold text-green-600">
                      ₹{item.price?.discountedPrice || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FULL MENU */}
      {otherFoods.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">All Foods</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherFoods.map((item) => (
              <Link
                to={`/foods/view-all-hits/${item.variantId}`}
                key={item.variantId}
                className="group bg-white rounded-2xl overflow-hidden
                     shadow-sm hover:shadow-xl
                     transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    className="h-36 sm:h-40 w-full object-cover
                         group-hover:scale-105
                         transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {item.usp}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-yellow-500 text-sm">
                      {RenderStars(item.rating?.value)}{" "}
                      <span className="text-gray-500">
                        ({item.rating?.value || 0})
                      </span>
                    </span>

                    <span className="font-bold text-green-600">
                      ₹{item.price?.discountedPrice || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
