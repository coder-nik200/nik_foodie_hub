import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";
import FullMenu from "../components/FullMenu";
import { RenderStars } from "../components/RenderStarts";

export default function SpecificDrinkPage() {
  const { id } = useParams();
  const [drinks, setDrinks] = useState(null);
  const [allDrinks, setAllDrinks] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");
  const { addToCart, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!id) {
      setError("Invalid drink ID");
      return;
    }

    api
      .get(`/foods/drinks/${id}`)
      .then((res) => setDrinks(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong"),
      );

    api
      .get("/foods/drinks")
      .then((res) => setAllDrinks(res.data.products))
      .catch(() => {});

    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!drinks) return <p className="text-center mt-20">Loading...</p>;

  const currentId = drinks.variantId || drinks.id;
  const recommendations = allDrinks.filter(
    (item) => (item.variantId || item._id) !== currentId,
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= DRINK DETAILS ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={drinks.image || drinks.photoURL || drinks.photoUrl}
              alt={drinks.name}
              className="w-full max-w-md rounded-2xl shadow-md
                         hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                {drinks.name}
              </h1>

              <p className="text-gray-600 mt-3 leading-relaxed">{drinks.usp}</p>

              {/* Info */}
              <div className="mt-6 space-y-2 text-sm md:text-base">
                <p>
                  <strong>Weight:</strong> {drinks.weight}
                </p>
                <p>
                  <strong>Pieces:</strong> {drinks.pieces}
                </p>
                <p>
                  <strong>Serves:</strong> {drinks.serves}
                </p>

                <p className="flex items-center gap-2">
                  <strong>Rating:</strong>
                  {drinks.rating ? (
                    <>
                      <span className="text-yellow-500">
                        {RenderStars(drinks.rating.value)}
                      </span>
                      <span className="text-gray-500">
                        ({drinks.rating.value}/5 · {drinks.rating.reviews})
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
                  ₹{drinks.price.discountedPrice ?? drinks.price.mrp}
                </span>

                {drinks.price.mrp && (
                  <>
                    <span className="line-through text-gray-400">
                      ₹{drinks.price.mrp}
                    </span>
                    <span className="text-red-500 font-semibold">
                      {drinks.price.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to add items to cart");
                  navigate("/login");
                  return;
                }

                try {
                  const drinkId = drinks.id || drinks.variantId || drinks._id;
                  await addToCart(drinkId);
                  navigate("/cart");
                } catch (error) {
                  toast.error(error);
                }
              }}
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
              Recommended {drinks.category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <Link
                  to={`/foods/drinks/${item.variantId || item._id}`}
                  key={item.variantId || item._id}
                  className="bg-white rounded-2xl overflow-hidden
                             shadow-sm hover:shadow-xl
                             hover:-translate-y-1
                             transition-all duration-300"
                >
                  <img
                    src={item.image || item.photoURL || item.photoUrl}
                    alt={item.name}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{item.name}</h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.usp}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-yellow-500 text-sm">
                        {RenderStars(item.rating?.value || 0)}
                        <span className="text-gray-500">
                          ({item.rating?.value || 0})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="font-bold text-green-600">
                        ₹{item.price.discountedPrice ?? item.price.mrp}
                      </span>

                      {item.price.mrp && (
                        <span className="line-through text-gray-400 text-sm">
                          ₹{item.price.mrp}
                        </span>
                      )}

                      <span className="text-red-500 text-sm font-semibold">
                        ({item.price.discountPercent ?? 0}% OFF)
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
