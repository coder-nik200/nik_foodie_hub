import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";
import FullMenu from "../components/FullMenu";
import { RenderStars } from "../components/RenderStarts";

export default function SpecificSweetPage() {
  const { id } = useParams();
  const [sweet, setSweet] = useState(null);
  const [allSweets, setAllSweets] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");
  const { addToCart, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!id) {
      setError("Invalid sweet ID");
      return;
    }

    // Get selected sweet
    api
      .get(`/foods/sweet/${id}`)
      .then((res) => setSweet(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong"),
      );

    // Get all sweets for recommendations
    api
      .get("/foods/sweet")
      .then((res) => setAllSweets(res.data.products))
      .catch(() => {});

    // Get all foods for recommendations and full menu
    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!sweet) return <p className="text-center mt-10">Loading...</p>;

  const currentId = sweet.variantId || sweet.id;

  const recommendations = allSweets.filter(
    (item) => (item.variantId || item.id) !== currentId,
  );

  const otherFoods = allFoods.filter(
    (item) => (item.variantId || item.id) !== currentId,
  );

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-6xl mx-auto">
      {/* SWEET DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={sweet.image || sweet.photoURL || sweet.photoUrl}
          alt={sweet.name}
          className="w-full max-w-md rounded-xl shadow-lg mx-auto"
        />

        <div>
          <h1 className="text-4xl font-bold">{sweet.name}</h1>
          <p className="text-gray-600 mt-2">{sweet.uspDescription}</p>

          <div className="mt-4 space-y-2">
            {/* <p>
              <strong>Category:</strong> {sweet.category}
            </p> */}
            <p>
              <strong>Weight:</strong> {sweet.weight}
            </p>
            <p>
              <strong>Pieces:</strong> {sweet.pieces}
            </p>
            <p>
              <strong>Serves:</strong> {sweet.serves}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {sweet.rating ? (
                <>
                  <span className="text-yellow-500">
                    {RenderStars(sweet.rating.value)}
                  </span>{" "}
                  ({sweet.rating.value} / 5, {sweet.rating.reviews} reviews)
                </>
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
            </p>
          </div>

          {/* basePrice */}
          <div className="mt-6">
            {sweet.basePrice ? (
              <>
                <span className="text-3xl font-bold text-green-600">
                  ₹{sweet.discountedPrice ?? 0}
                </span>
                <span className="line-through text-gray-500 ml-3">
                  ₹{sweet.basePrice ?? 0}
                </span>
                <span className="ml-3 text-red-500 font-semibold">
                  ({sweet.discountPercentage ?? 0}% OFF)
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

              addToCart(sweet);
              toast.success(`✅ ${sweet.name} added to cart!`);
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
            Recommended {sweet.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/sweet/${item.variantId || item.id}`}
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

      {/* FULL SWEETS MENU */}
      <FullMenu />
    </div>
  );
}
