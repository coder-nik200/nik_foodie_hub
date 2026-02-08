// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import Food from "./models/foodModel.js";

// dotenv.config();

// // Fix __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Read JSON manually
// const foodData = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "data", "foodData.json"), "utf-8")
// );

// const seedFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB connected");

//     // Optional: clear existing data
//     await Food.deleteMany();

//     await Food.insertMany(
//       foodData.products.map((item) => ({
//         name: item.title || item.name,
//         description: item.description || "Delicious food item",
//         price: item.price,
//         image: item.image,
//         category: "veg", // map properly
//         isAvailable: true,
//       }))
//     );

//     console.log("Food data seeded successfully 🌱");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed ❌", error);
//     process.exit(1);
//   }
// };

// seedFoods();
