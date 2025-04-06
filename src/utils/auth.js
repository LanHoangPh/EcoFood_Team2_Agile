// Xác thực người dùng
export const registerUser = (userData) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const checkingUser = users.find((user) => user.email === userData.email);
  if (checkingUser) {
    return { success: false, message: "Email này đã được đăng ký" };
  }

  // Thêm user mới
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
    ...userData,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return { success: true, user: { ...newUser, password: undefined } };
};

export const loginUser = (credentials) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (user) =>
      user.email === credentials.email && user.password === credentials.password
  );

  if (!user) {
    return { success: false, message: "Không đúng email hoặc mật khẩu" };
  }
  // lưu ng dùng htai vào local
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

  return { success: true, user: userWithoutPassword };
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  return { success: true };
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

export const updateUserProfile = (userData) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return { success: false, message: "Không thể đăng nhập" };
  }

  const userIndex = users.findIndex((u) => u.id === currentUser.id);
  if (userIndex === -1) {
    return { success: false, message: "Không tìm thấy user" };
  }

  if (!userData.password) userData.password = users[userIndex].password;
  if (!userData.role) userData.role = users[userIndex].role;

  users[userIndex] = { ...users[userIndex], ...userData };
  localStorage.setItem("users", JSON.stringify(users));

  const updatedUser = { ...users[userIndex] };
  delete updatedUser.password;
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  return { success: true, user: updatedUser };
};
