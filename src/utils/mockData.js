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
        name: "Bông cải xanh tươi",
        description:
          "Bông cải xanh hữu cơ tươi từ trang trại, giàu vitamin và khoáng chất.",
        price: 74999.98,
        image:
          "https://images.unsplash.com/photo-1459411621453-7b03977f89d7?w=400&q=80",
        categoryId: 1,
        rating: 4.5,
        reviews: [],
        stock: 50,
      },
      {
        id: 2,
        name: "Táo đỏ",
        description: "Táo đỏ ngọt và mọng nước từ vườn địa phương.",
        price: 32999.89,
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
        categoryId: 2,
        rating: 4.8,
        reviews: [],
        stock: 100,
      },
      {
        id: 3,
        name: "Bánh mì kẹp phô mai",
        description:
          "Bánh mì kẹp ngon với phô mai, rau diếp và nước sốt đặc biệt.",
        price: 129999.89,
        image:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80",
        categoryId: 5,
        rating: 4.2,
        reviews: [],
        stock: 25,
      },
      {
        id: 4,
        name: "Sữa hữu cơ",
        description: "Sữa tươi hữu cơ nguyên chất từ bò ăn cỏ.",
        price: 89999.89,
        image:
          "https://images.unsplash.com/photo-1550583724-2b7d2e90e30d?w=400&q=80",
        categoryId: 4,
        rating: 4.7,
        reviews: [],
        stock: 30,
      },
      {
        id: 5,
        name: "Bánh mì chua",
        description: "Bánh mì chua thủ công nướng tươi mỗi ngày.",
        price: 119999.89,
        image:
          "https://images.unsplash.com/photo-1598373182133-5245f4d670a6?w=400&q=80",
        categoryId: 5,
        rating: 4.6,
        reviews: [],
        stock: 15,
      },
      {
        id: 6,
        name: "Rau chân vịt",
        description:
          "Lá rau chân vịt hữu cơ tươi, hoàn hảo cho salad và nấu ăn.",
        price: 65999.89,
        image:
          "https://images.unsplash.com/photo-1576045056325-1f2b1791b7ae?w=400&q=80",
        categoryId: 1,
        rating: 4.3,
        reviews: [],
        stock: 40,
      },
      {
        id: 7,
        name: "Bánh ngọt socola",
        description: "Bánh socola với lớp kem mịn màng.",
        price: 23999.89,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
        categoryId: 5,
        rating: 4.4,
        reviews: [],
        stock: 75,
      },
      {
        id: 8,
        name: "Súp bí đỏ",
        description: "Bát súp bí đỏ màu cam ấm áp, trang trí với kem.",
        price: 99750.89,
        image:
          "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=80",
        categoryId: 3,
        rating: 4.1,
        reviews: [],
        stock: 20,
      },
      {
        id: 9,
        name: "Cá hồi nướng",
        description: "Miếng cá hồi nướng với chanh và rau thơm.",
        price: 224750.89,
        image:
          "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=400&q=80",
        categoryId: 3,
        rating: 4.9,
        reviews: [],
        stock: 10,
      },
      {
        id: 10,
        name: "Pizza phô mai",
        description: "Pizza phô mai nóng hổi, chụp cận cảnh.",
        price: 82250.89,
        image:
          "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&q=80",
        categoryId: 3,
        rating: 4.6,
        reviews: [],
        stock: 60,
      },
      {
        id: 11,
        name: "Burger bò",
        description: "Burger bò với phô mai tan chảy, rau xà lách và sốt.",
        price: 69750.89,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        categoryId: 3,
        rating: 4.7,
        reviews: [],
        stock: 35,
      },
      {
        id: 12,
        name: "Bánh sừng bò socola",
        description: "Bánh sừng bò giòn rụm với nhân socola đậm đà.",
        price: 87250.89,
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
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
