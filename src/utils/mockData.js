export const setupMockData = () => {
  if (!localStorage.getItem("categories")) {
    const categories = [
      { id: 1, name: "Rau xanh", icon: "🥦" },
      { id: 2, name: "Trái cây", icon: "🍎" },
      { id: 3, name: "Đồ ăn nhanh", icon: "🍔" },
      { id: 4, name: "Sữa", icon: "🥛" },
      { id: 5, name: "Bánh mì", icon: "🥖" },
      { id: 6, name: "Pizza", icon: "🍕" },
    ];
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  if (!localStorage.getItem("products")) {
    const products = [
      {
        id: 1,
        name: "Fresh Broccoli",
        description:
          "Organic farm-fresh broccoli, rich in vitamins and minerals.",
        price: 2.99,
        image:
          "https://images.unsplash.com/photo-1628773820330-6f8f84ae6e67?w=400&q=80", // URL mới
        categoryId: 1,
        rating: 4.5,
        reviews: [],
        stock: 50,
      },
      {
        id: 2,
        name: "Red Apples",
        description: "Sweet and juicy red apples from local orchards.",
        price: 1.49,
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80", // Giữ nguyên (hoạt động)
        categoryId: 2,
        rating: 4.8,
        reviews: [],
        stock: 100,
      },
      {
        id: 3,
        name: "Cheeseburger",
        description:
          "Delicious burger with cheese, lettuce, and our special sauce.",
        price: 5.99,
        image:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80", // Giữ nguyên (hoạt động)
        categoryId: 3,
        rating: 4.2,
        reviews: [],
        stock: 25,
      },
      {
        id: 4,
        name: "Organic Milk",
        description: "Fresh organic whole milk from grass-fed cows.",
        price: 3.49,
        image:
          "https://images.unsplash.com/photo-1550583724-2b7d2e90e30d?w=400&q=80", // URL mới
        categoryId: 4,
        rating: 4.7,
        reviews: [],
        stock: 30,
      },
      {
        id: 5,
        name: "Sourdough Bread",
        description: "Artisanal sourdough bread baked fresh daily.",
        price: 4.99,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", // URL mới
        categoryId: 5,
        rating: 4.6,
        reviews: [],
        stock: 15,
      },
      {
        id: 6,
        name: "Spinach",
        description:
          "Fresh organic spinach leaves, perfect for salads and cooking.",
        price: 2.49,
        image:
          "https://images.unsplash.com/photo-1576045056325-1f2b1791b7ae?w=400&q=80", // URL mới
        categoryId: 1,
        rating: 4.3,
        reviews: [],
        stock: 40,
      },
      {
        id: 7,
        name: "Bananas",
        description: "Ripe and sweet bananas, rich in potassium.",
        price: 0.99,
        image:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c202b99?w=400&q=80", // URL mới
        categoryId: 2,
        rating: 4.4,
        reviews: [],
        stock: 75,
      },
      {
        id: 8,
        name: "Pizza Slice",
        description:
          "Delicious cheese pizza slice with our homemade tomato sauce.",
        price: 3.99,
        image:
          "https://images.unsplash.com/photo-1541745537411-b3d2d5e86368?w=400&q=80", // URL mới
        categoryId: 3,
        rating: 4.1,
        reviews: [],
        stock: 20,
      },
      {
        id: 9,
        name: "Grilled Salmon",
        description: "Freshly grilled salmon fillet with herbs and lemon.",
        price: 8.99,
        image:
          "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=400&q=80", // URL mới
        categoryId: 3,
        rating: 4.9,
        reviews: [],
        stock: 10,
      },
      {
        id: 10,
        name: "Cherry Tomatoes",
        description: "Sweet and juicy cherry tomatoes, perfect for salads.",
        price: 3.29,
        image:
          "https://images.unsplash.com/photo-1592836957119-eeb138ed6c49?w=400&q=80", // URL mới
        categoryId: 1,
        rating: 4.6,
        reviews: [],
        stock: 60,
      },
      {
        id: 11,
        name: "Orange Juice",
        description: "Freshly squeezed orange juice, rich in vitamin C.",
        price: 2.79,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", // URL mới
        categoryId: 4,
        rating: 4.7,
        reviews: [],
        stock: 35,
      },
      {
        id: 12,
        name: "Chocolate Croissant",
        description: "Flaky croissant filled with rich chocolate.",
        price: 3.49,
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80", // URL mới
        categoryId: 5,
        rating: 4.8,
        reviews: [],
        stock: 20,
      },
    ];
    localStorage.setItem("products", JSON.stringify(products));
  }

  // thiết lập thêm user nếu chưa có
  if (!localStorage.getItem("users")) {
    const users = [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        address: "123 Admin St, Admin City",
        phone: "555-1234",
      },
      {
        id: 2,
        username: "customer",
        email: "customer@example.com",
        password: "customer123",
        role: "customer",
        address: "456 Customer Ave, Customer Town",
        phone: "555-5678",
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (!localStorage.getItem("orders")) {
    const orders = [];
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  if (!localStorage.getItem("cart")) {
    const cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const generateId = (collection) => {
  const items = JSON.parse(localStorage.getItem(collection)) || [];
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
};
