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
      setError("Invalid drinks ID");
      return;
    }

    // Get selected drinks
    api
      .get(`/foods/drinks/${id}`)
      .then((res) => setDrinks(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong"),
      );

    // Get all drinks for recommendations
    api
      .get("/foods/drinks")
      .then((res) => setAllDrinks(res.data.products))
      .catch(() => {});

    // Get all foods for recommendations and full menu
    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!drinks) return <p className="text-center mt-10">Loading...</p>;

  const currentId = drinks.variantId || drinks.id;

  const recommendations = allDrinks.filter(
    (item) => (item.variantId || item.id) !== currentId,
  );

  const otherFoods = allFoods.filter(
    (item) => (item.variantId || item.id) !== currentId,
  );

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-6xl mx-auto">
      {/* drinks DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={drinks.image || drinks.photoURL || drinks.photoUrl}
          alt={drinks.name}
          className="w-full max-w-md rounded-xl shadow-lg mx-auto"
        />

        <div>
          <h1 className="text-4xl font-bold">{drinks.name}</h1>
          <p className="text-gray-600 mt-2">{drinks.uspDescription}</p>

          <div className="mt-4 space-y-2">
            {/* <p>
              <strong>Category:</strong> {drinks.category}
            </p> */}
            <p>
              <strong>Weight:</strong> {drinks.weight}
            </p>
            <p>
              <strong>Pieces:</strong> {drinks.pieces}
            </p>
            <p>
              <strong>Serves:</strong> {drinks.serves}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {drinks.rating ? (
                <>
                  <span className="text-yellow-500">
                    {RenderStars(drinks.rating.value)}
                  </span>{" "}
                  ({drinks.rating.value} / 5, {drinks.rating.reviews} reviews)
                </>
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
            </p>
          </div>

          {/* basePrice */}
          <div className="mt-6">
            {drinks.basePrice ? (
              <>
                <span className="text-3xl font-bold text-green-600">
                  ₹{drinks.discountedPrice ?? 0}
                </span>
                <span className="line-through text-gray-500 ml-3">
                  ₹{drinks.basePrice ?? 0}
                </span>
                <span className="ml-3 text-red-500 font-semibold">
                  ({drinks.discountPercentage ?? 0}% OFF)
                </span>
              </>
            ) : (
              <span className="text-gray-500 font-semibold">
                basePrice not available
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login to add items to cart");
                navigate("/login");
                return;
              }

              addToCart(drinks);
              toast.success(`✅ ${drinks.name} added to cart!`);
              navigate("/cart");
            }}
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Recommended {drinks.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/drinks/${item.variantId || item.id}`}
                key={item.variantId || item.id}
                className="group bg-white rounded-2xl overflow-hidden
                          shadow-sm hover:shadow-xl
                          transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.image || item.photoURL || item.photoUrl}
                    alt={item.name}
                    className="h-40 w-full object-cover
                              group-hover:scale-105
                              transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold leading-snug">{item.name}</h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.uspDescription}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-yellow-500 text-sm">
                      {item.rating ? (
                        <>
                          {RenderStars(item.rating.value)}{" "}
                          <span className="text-gray-500">
                            ({item.rating.value})
                          </span>
                        </>
                      ) : (
                        "No rating"
                      )}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-2">
                    {item.basePrice ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-green-600">
                          ₹{item.basePrice ?? 0}
                        </span>

                        <span className="line-through text-gray-400 text-sm">
                          ₹{item.discountedPrice ?? 0}
                        </span>

                        <span className="text-red-500 text-sm font-semibold">
                          ({item.discountPercentage ?? 0}% OFF)
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-semibold text-sm">
                        basePrice not available
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FULL drinksS MENU */}
      <FullMenu />
    </div>
  );
}
