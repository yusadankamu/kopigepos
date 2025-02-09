import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MenuItem } from "../types";

const dummyMenuItems: Omit<MenuItem, "id">[] = [
  {
    name: "Cappuccino",
    description:
      "Classic Italian coffee drink with equal parts espresso, steamed milk, and milk foam",
    price: 72000, // $4.50 * 16000
    category: "coffee",
    imageUrl:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800",
    available: true,
  },
  {
    name: "Latte",
    description:
      "Smooth and creamy espresso with steamed milk and a light layer of foam",
    price: 64000, // $4.00 * 16000
    category: "coffee",
    imageUrl:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800",
    available: true,
  },
  {
    name: "Espresso",
    description: "Strong concentrated form of coffee served in shots",
    price: 48000, // $3.00 * 16000
    category: "coffee",
    imageUrl:
      "https://images.unsplash.com/photo-1596952053550-6256cc214cd3?w=800",
    available: true,
  },
  {
    name: "Chocolate Chip Cookie",
    description: "Fresh baked cookie with premium chocolate chips",
    price: 40000, // $2.50 * 16000
    category: "cookies",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800",
    available: true,
  },
  {
    name: "Oatmeal Raisin Cookie",
    description: "Chewy oatmeal cookie filled with plump raisins",
    price: 40000, // $2.50 * 16000
    category: "cookies",
    imageUrl:
      "https://images.unsplash.com/photo-1590080876439-7ac9c41c6984?w=800",
    available: true,
  },
  {
    name: "Croissant",
    description: "Buttery, flaky French pastry",
    price: 56000, // $3.50 * 16000
    category: "sides",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800",
    available: true,
  },
  {
    name: "Avocado Toast",
    description: "Sourdough toast topped with mashed avocado and seeds",
    price: 104000, // $6.50 * 16000
    category: "sides",
    imageUrl:
      "https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?w=800",
    available: true,
  },
];

export const seedDatabase = async () => {
  try {
    const menuRef = collection(db, "menu");

    // Add new items
    for (const item of dummyMenuItems) {
      await addDoc(menuRef, item);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
