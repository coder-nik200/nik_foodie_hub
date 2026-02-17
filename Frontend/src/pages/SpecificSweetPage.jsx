import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import api, { addToCartAPI } from "../api/axios";
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

    api
      .get(`/foods/sweet/${id}`)
      .then((res) => setSweet(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong"),
      );

    api
      .get("/foods/sweet")
      .then((res) => setAllSweets(res.data.products))
      .catch(() => {});

    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!sweet) return <p className="text-center mt-20">Loading...</p>;

  const currentId = sweet._id;
  const recommendations = allSweets.filter((item) => item._id !== currentId);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= SWEET DETAILS ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={sweet.image || sweet.photoURL || sweet.photoUrl}
              alt={sweet.name}
              className="w-full max-w-md rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                {sweet.name}
              </h1>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {sweet.uspDescription}
              </p>

              {/* Info */}
              <div className="mt-6 space-y-2 text-sm md:text-base">
                <p>
                  <strong>Weight:</strong> {sweet.weight}
                </p>
                <p>
                  <strong>Pieces:</strong> {sweet.pieces}
                </p>
                <p>
                  <strong>Serves:</strong> {sweet.serves}
                </p>

                <p className="flex items-center gap-2">
                  <strong>Rating:</strong>
                  {sweet.rating ? (
                    <>
                      <span className="text-yellow-500">
                        {RenderStars(sweet.rating.value)}
                      </span>
                      <span className="text-gray-500">
                        ({sweet.rating.value}/5 · {sweet.rating.reviews})
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
                  ₹{sweet.price.discountedPrice ?? sweet.price.mrp}
                </span>

                {sweet.price.mrp && (
                  <>
                    <span className="line-through text-gray-400">
                      ₹{sweet.price.mrp}
                    </span>
                    <span className="text-red-500 font-semibold">
                      {sweet.price.discountPercent}% OFF
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
                  await addToCartAPI(sweet.id || sweet.variantId || sweet._id);
                  addToCart(sweet);
                  toast.success(`${sweet.name} added to cart`);
                  navigate("/cart");
                } catch (error) {
                  toast.error(error);
                }
              }}
              className="mt-8 w-full md:w-fit px-8 py-4 bg-orange-500 text-white
                         font-semibold rounded-xl shadow-md
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
              Recommended {sweet.category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <Link
                  to={`/foods/sweet/${item._id}`}
                  key={item.variantId || item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-xl hover:-translate-y-1
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
