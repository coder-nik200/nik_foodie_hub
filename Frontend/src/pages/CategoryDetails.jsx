import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { categoryType } = useParams(); // Expect route like /foods/:categoryType
  const { addToCart, user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/foods/${categoryType}`)
      .then((res) => {
        setCategory(res.data);
        setProducts(res.data.products);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  }, [categoryType]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!category) return <p className="text-center mt-10">Loading...</p>;

  const displayName =
    categoryType === "sweet" ? "Best of Sweets" : "Refreshing Drinks";

  return (
    <section className="w-full min-h-screen py-6 px-4 lg:px-60">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xl md:hidden text-gray-700 hover:text-orange-500 transition"
        >
          <FaArrowLeftLong />
        </button>

        <h2 className="text-xl font-bold tracking-wide text-gray-900">
          {displayName}
        </h2>

        <button className="text-xl md:hidden text-gray-700 hover:text-orange-500 transition">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item, index) => (
          <div
            key={item._id || index}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/foods/${categoryType}/${item._id}`}>
              <div className="overflow-hidden">
                <img
                  src={item.photoURL || item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1601050690597-df0568f70950")
                  }
                />
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.usp || item.uspDescription || ""}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.weight} | {item.pieces || "-"} | Serves {item.serves}
                </p>
                <p className="font-semibold text-base mt-2">
                  ₹{item.price?.discountedPrice ?? item.discountedPrice ?? 0}
                  {item.price?.mrp && (
                    <>
                      <span className="line-through text-gray-400 ml-2">
                        ₹{item.price.mrp}
                      </span>
                      <span className="text-green-600 ml-2 text-sm">
                        ({item.price.discountPercent ?? 0}% OFF)
                      </span>
                    </>
                  )}
                </p>
              </div>
            </Link>

            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to add items to cart");
                  navigate("/login");
                  return;
                }

                try {
                  await addToCart(item._id);
                  navigate("/cart");
                } catch (error) {
                  toast.error(error);
                }
              }}
              className="w-full py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 active:scale-95 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryDetails;
