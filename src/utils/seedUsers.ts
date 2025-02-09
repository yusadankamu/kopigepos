import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CafeUser } from "../types";

const dummyUsers: Omit<CafeUser, "id">[] = [
  {
    name: "John Smith",
    email: "john.smith@kopige.com",
    role: "admin",
    status: "active",
    phoneNumber: "+62811234567",
    joinDate: new Date("2023-01-15"),
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@kopige.com",
    role: "manager",
    status: "active",
    phoneNumber: "+62811234568",
    joinDate: new Date("2023-02-01"),
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    name: "Michael Lee",
    email: "michael.l@kopige.com",
    role: "cashier",
    status: "active",
    phoneNumber: "+62811234569",
    joinDate: new Date("2023-03-15"),
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    name: "Emily Chen",
    email: "emily.c@kopige.com",
    role: "barista",
    status: "active",
    phoneNumber: "+62811234570",
    joinDate: new Date("2023-04-01"),
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    name: "David Wilson",
    email: "david.w@kopige.com",
    role: "barista",
    status: "inactive",
    phoneNumber: "+62811234571",
    joinDate: new Date("2023-05-01"),
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
];

export const seedUsers = async () => {
  try {
    const usersRef = collection(db, "users");

    // Add new users
    for (const user of dummyUsers) {
      await addDoc(usersRef, {
        ...user,
        joinDate: Timestamp.fromDate(user.joinDate),
      });
    }

    console.log("Users database seeded successfully!");
  } catch (error) {
    console.error("Error seeding users database:", error);
  }
};
