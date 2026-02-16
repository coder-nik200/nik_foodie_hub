import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { RenderStars } from "./RenderStarts";

const FullMenu = () => {
  const { id: currentId } = useParams(); // current food id
  const [allFoods, setAllFoods] = useState([]);

  // Fetch all foods
  useEffect(() => {
    api
      .get("/foods/view-all-hits")
      .then((res) => {
        setAllFoods(res.data.products || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Exclude current food
  const otherFoods = allFoods.filter(
    (item) => (item.variantId || item.id) !== currentId,
  );

  return (
    <>
      {otherFoods.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">All Foods</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {otherFoods.map((item) => (
              <Link
                to={`/foods/view-all-hits/${item.id}`}
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden
                           shadow-sm hover:shadow-xl
                           transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.photoURL}
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
                    {item.usp || ""}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-yellow-500 text-sm">
                      {RenderStars(item.rating?.value || 0)}
                      <span className="text-gray-500">
                        ({item.rating?.value || 0})
                      </span>
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-2">
                    {item.price ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-green-600">
                          ₹{item.price.mrp ?? 0}
                        </span>

                        <span className="line-through text-gray-400 text-sm">
                          ₹{item.price.discountedPrice ?? 0}
                        </span>

                        <span className="text-red-500 text-sm font-semibold">
                          ({item.price.discountPercent ?? 0}% OFF)
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
    </>
  );
};

export default FullMenu;
