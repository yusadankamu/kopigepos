import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { MenuItem } from "../types";
import { Coffee, Cookie, Utensils, Plus, Trash2, Pencil } from "lucide-react";
import MenuItemModal from "../components/MenuItemModal";
import DeleteConfirmationModal from "../components/DeleConfirmationModal";
import { seedDatabase } from "../utils/seedData";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "coffee" | "cookies" | "sides"
  >("coffee");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const menuRef = collection(db, "menu");
      const snapshot = await getDocs(menuRef);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
      setMenuItems(items);
      setLoading(false);

      // If no items exist, seed the database
      if (items.length === 0) {
        await seedDatabase();
        // Fetch again after seeding
        const newSnapshot = await getDocs(menuRef);
        const newItems = newSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];
        setMenuItems(newItems);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteDoc(doc(db, "menu", itemToDelete.id));
      setMenuItems((items) =>
        items.filter((item) => item.id !== itemToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSaveItem = async (itemData: Omit<MenuItem, "id">) => {
    try {
      if (selectedItem) {
        // Update existing item
        await updateDoc(doc(db, "menu", selectedItem.id), itemData);
        setMenuItems((items) =>
          items.map((item) =>
            item.id === selectedItem.id
              ? { ...itemData, id: selectedItem.id }
              : item
          )
        );
      } else {
        // Add new item
        const docRef = await addDoc(collection(db, "menu"), itemData);
        setMenuItems((items) => [...items, { ...itemData, id: docRef.id }]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const categories = [
    { id: "coffee", name: "Coffee", icon: Coffee },
    { id: "cookies", name: "Cookies", icon: Cookie },
    { id: "sides", name: "Sides", icon: Utensils },
  ];

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        <button
          onClick={handleAddItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        {categories.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() =>
              setSelectedCategory(id as "coffee" | "cookies" | "sides")
            }
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              selectedCategory === id
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group relative"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatIDR(item.price)}
                </span>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.available ? "Available" : "Sold Out"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={selectedItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name}
      />
    </div>
  );
}
