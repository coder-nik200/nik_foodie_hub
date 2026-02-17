// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import CurrentHits from "./models/currentHits.js";

// dotenv.config();

// // Fix __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Read JSON manually
// const foodData = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "data", "currenthits.json"), "utf-8"),
// );

// const seedFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB connected");

//     // Optional: clear existing data
//     await CurrentHits.deleteMany();

//     // await Food.insertMany(
//     //   foodData.products.map((item) => ({
//     //     name: item.title || item.name,
//     //     description: item.description || "Delicious food item",
//     //     price: item.price,
//     //     image: item.image,
//     //     category: "veg", // map properly
//     //     isAvailable: true,
//     //   })),
//     // );

//     await CurrentHits.insertMany(
//       foodData.products.map((item) => ({
//         name: item.name,
//         slug: item.slug,
//         category: item.category,
//         photoURL: item.photoURL,
//         usp: item.usp,
//         weight: item.weight,
//         pieces: item.pieces,
//         serves: item.serves,
//         price: item.price,
//         rating: item.rating,
//         isAvailable: true,
//       })),
//     );

//     console.log("Food data seeded successfully 🌱");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed ❌", error);
//     process.exit(1);
//   }
// };

// seedFoods();

// // const mongoose = require("mongoose");
// // const Food = require("./models/food");
// // const foods = require("./data/currenthits.json"); // your JSON

// // mongoose.connect("mongodb://127.0.0.1:27017/your-db-name");

// // async function seed() {
// //   await Food.deleteMany();
// //   await Food.insertMany(foods.products);
// //   console.log("Foods inserted successfully");
// //   process.exit();
// // }

// // seed();

//Sweets

// require("dotenv").config();
// const mongoose = require("mongoose");
// const Food = require("./models/sweet");

// const sweets = [
//   {
//     name: "Kaju Katli",
//     slug: "kaju-katli",
//     category: "Sweet",
//     photoURL:
//       "https://b.zmtcdn.com/data/dish_photos/651/c28572cdf4b81ec3dad34efae51f8651.jpg?output-format=webp",
//     usp: "Premium cashew fudge with rich silver leaf finish",
//     weight: "500 g",
//     pieces: "20-25",
//     serves: "6",
//     price: {
//       mrp: 899,
//       discountedPrice: 799,
//       discountPercent: 11,
//     },
//     rating: {
//       value: 4.7,
//       reviews: 210,
//     },
//   },
//   {
//     name: "Gulab Jamun",
//     slug: "gulab-jamun",
//     category: "Sweet",
//     photoURL:
//       "https://b.zmtcdn.com/data/dish_photos/e65/be7425be2eb78c17835c55c7765ace65.jpg?output-format=webp",
//     usp: "Soft, juicy jamuns soaked in aromatic sugar syrup",
//     weight: "1 kg",
//     pieces: "18-22",
//     serves: "6",
//     price: {
//       mrp: 499,
//       discountedPrice: 399,
//       discountPercent: 20,
//     },
//     rating: {
//       value: 4.6,
//       reviews: 185,
//     },
//   },
//   {
//     name: "Rasgulla",
//     slug: "rasgulla",
//     category: "Sweet",
//     photoURL:
//       "https://b.zmtcdn.com/data/dish_photos/1af/145fbb7f1251793390c085740a4951af.jpeg?output-format=webp",
//     usp: "Spongy cottage cheese balls in light sugar syrup",
//     weight: "1 kg",
//     pieces: "15-18",
//     serves: "6",
//     price: {
//       mrp: 459,
//       discountedPrice: 389,
//       discountPercent: 15,
//     },
//     rating: {
//       value: 4.5,
//       reviews: 160,
//     },
//   },
//   {
//     name: "Motichoor Ladoo (Small Pack)",
//     slug: "motichoor-ladoo-small-pack",
//     category: "Sweet",
//     photoURL:
//       "https://b.zmtcdn.com/data/dish_photos/da3/bc096ed75047c248607603bcfb1d2da3.jpeg?output-format=webp",
//     usp: "Soft and aromatic ladoos made with fine besan pearls",
//     weight: "250 g",
//     pieces: "6-8",
//     serves: "2-3",
//     price: {
//       mrp: 249,
//       discountedPrice: 249,
//       discountPercent: 0,
//     },
//     rating: {
//       value: 4.3,
//       reviews: 95,
//     },
//   },
//   {
//     name: "Milk Barfi",
//     slug: "milk-barfi",
//     category: "Sweet",
//     photoURL:
//       "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2025/2/11/26cacaae-3140-4821-b61d-d74cdcc8adeb_376cd01b-23dc-4b95-90dc-404c13654421.jpeg",
//     usp: "Classic milk barfi with rich and creamy texture",
//     weight: "500 g",
//     pieces: "12-16",
//     serves: "5",
//     price: {
//       mrp: 399,
//       discountedPrice: 359,
//       discountPercent: 10,
//     },
//     rating: {
//       value: 4.4,
//       reviews: 130,
//     },
//   },
//   {
//     name: "Rasmalai",
//     slug: "rasmalai",
//     category: "Sweet",
//     photoURL:
//       "https://b.zmtcdn.com/data/dish_photos/bf5/cf3bce1549fe45b8af45b93c9ff7cbf5.jpg?output-format=webp",
//     usp: "Soft paneer discs soaked in saffron flavored milk",
//     weight: "500 g",
//     pieces: "8-10",
//     serves: "4",
//     price: {
//       mrp: 549,
//       discountedPrice: 479,
//       discountPercent: 13,
//     },
//     rating: {
//       value: 4.6,
//       reviews: 175,
//     },
//   },
// ];

// async function seedFoods() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("✅ Mongo Connected");

//     // Remove old sweets (safe clean insert)
//     await Food.deleteMany({ category: "Sweet" });

//     await Food.insertMany(sweets);

//     console.log("🎉 Sweets seeded successfully!");
//     process.exit();
//   } catch (error) {
//     console.error("❌ Seeding error:", error);
//     process.exit(1);
//   }
// }

// seedFoods();

//Drinks

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Food from "./models/drink.js";

const drinks = [
  {
    name: "Mango Lassi",
    slug: "mango-lassi",
    category: "Drink",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/4ff/7e92e177eb64b857c7651e40fd3cd4ff.jpg",
    usp: "Rich, creamy yogurt blended with sweet mangoes",
    weight: "300 ml",
    pieces: "1 bottle",
    serves: "1",
    price: {
      mrp: 120,
      discountedPrice: 99,
      discountPercent: 18,
    },
    rating: {
      value: 4.6,
      reviews: 95,
    },
  },
  {
    name: "Cold Coffee",
    slug: "cold-coffee",
    category: "Drink",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/79d/28ce00688861423b99ac813b0cd6979d.jpg?output-format=webp",
    usp: "Smooth chilled coffee blended with milk & ice",
    weight: "350 ml",
    pieces: "1 cup",
    serves: "1",
    price: {
      mrp: 150,
      discountedPrice: 119,
      discountPercent: 21,
    },
    rating: {
      value: 4.5,
      reviews: 120,
    },
  },
  {
    name: "Blue Lagoon Mojito",
    slug: "blue-lagoon-mojito",
    category: "Drink",
    photoURL:
      "https://imgs.search.brave.com/3zHs0d4QTcIupdx-5iXGhQeC8SwQwY34ySt5lTFzxGw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9iZXlv/bmQtY2F0ZXJpbmct/Ym91dGlxdWUub2Rv/by5jb20vd2ViL2lt/YWdlL3Byb2R1Y3Qu/cHJvZHVjdC8xOTEv/aW1hZ2VfMTAyNC9N/b2ppdG8lMjBCbHVl/JTIwbGFnb29uP3Vu/aXF1ZT02NThmMWFl",
    usp: "Refreshing citrus drink with a cool blue twist",
    weight: "300 ml",
    pieces: "1 glass",
    serves: "1",
    price: {
      mrp: 180,
      discountedPrice: 149,
      discountPercent: 17,
    },
    rating: {
      value: 4.4,
      reviews: 80,
    },
  },
  {
    name: "Strawberry Milkshake",
    slug: "strawberry-milkshake",
    category: "Drink",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/d9c/5725613d444dcbdc429ea4f90fd27d9c.jpg",
    usp: "Thick milkshake made with real strawberries",
    weight: "400 ml",
    pieces: "1 bottle",
    serves: "1",
    price: {
      mrp: 170,
      discountedPrice: 139,
      discountPercent: 18,
    },
    rating: {
      value: 4.6,
      reviews: 110,
    },
  },
  {
    name: "Fresh Lime Soda",
    slug: "fresh-lime-soda",
    category: "Drink",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/5e5/35aa7bfc9fbd797ca8ee6282b848b5e5.jpg?output-format=webp",
    usp: "Classic lime soda for instant refreshment",
    weight: "300 ml",
    pieces: "1 glass",
    serves: "1",
    price: {
      mrp: 90,
      discountedPrice: 79,
      discountPercent: 12,
    },
    rating: {
      value: 4.3,
      reviews: 70,
    },
  },
  {
    name: "Chocolate Thick Shake",
    slug: "chocolate-thick-shake",
    category: "Drink",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/740/2b809ba4751e1ae9398dff2d18967740.jpg",
    usp: "Rich & creamy chocolate shake topped with cocoa",
    weight: "400 ml",
    pieces: "1 bottle",
    serves: "1",
    price: {
      mrp: 190,
      discountedPrice: 159,
      discountPercent: 16,
    },
    rating: {
      value: 4.7,
      reviews: 140,
    },
  },
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Mongo Connected");

    // Remove old drinks (safe clean insert)
    await Food.deleteMany({ category: "Drink" });

    // Insert new drinks
    await Food.insertMany(drinks);

    console.log("🎉 Drinks seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedFoods();
