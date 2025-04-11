<template>
  <CustomerLayout>
    <h1 class="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Thông tin cá nhân</h2>
          </div>
          <form @submit.prevent="updateProfile" class="p-6 space-y-4">
            <div v-if="message.text" class="p-4 rounded-md"
              :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ message.text }}
            </div>

            <div>
              <label for="username" class="form-label">Username</label>
              <input id="username" type="text" v-model="profileData.username" class="form-input" required />
            </div>

            <div>
              <label for="email" class="form-label">Địa chỉ Email</label>
              <input id="email" type="email" v-model="profileData.email" class="form-input" required />
            </div>

            <div>
              <label for="address" class="form-label">Địa chỉ</label>
              <input id="address" type="text" v-model="profileData.address" class="form-input" />
            </div>

            <div>
              <label for="phone" class="form-label">Phone Number</label>
              <input id="phone" type="tel" v-model="profileData.phone" class="form-input" />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isUpdating">
              {{ isUpdating ? 'Đang cập nhật..' : 'Cập nhật hồ sơ' }}
            </button>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Đổi mật khẩu</h2>
          </div>
          <form @submit.prevent="changePassword" class="p-6 space-y-4">
            <div v-if="passwordMessage.text" class="p-4 rounded-md"
              :class="passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ passwordMessage.text }}
            </div>

            <div>
              <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
              <input id="currentPassword" type="password" v-model="passwordData.currentPassword" class="form-input"
                required />
            </div>

            <div>
              <label for="newPassword" class="form-label">Mật khẩu mới</label>
              <input id="newPassword" type="password" v-model="passwordData.newPassword" class="form-input" required />
            </div>

            <div>
              <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới </label>
              <input id="confirmPassword" type="password" v-model="passwordData.confirmPassword" class="form-input"
                required />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isChangingPassword">
              {{ isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
            </button>
          </form>
        </div>
      </div>
      <div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Thông tin tài khoản</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-600">Username</div>
                <div class="font-medium">{{ currentUser.username }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Email</div>
                <div class="font-medium">{{ currentUser.email }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Loại tài khoản</div>
                <div class="font-medium capitalize">{{ currentUser.role }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Số lượng hóa đơn</div>
                <div class="font-medium">{{ orderCount }}</div>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <router-link to="/orders" class="btn btn-secondary w-full flex justify-center items-center">
                <PackageIcon class="h-4 w-4 mr-2" />
                Xem hóa đơn
              </router-link>
              <button @click="logout" class="btn btn-danger w-full flex justify-center items-center">
                <LogOutIcon class="h-4 w-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PackageIcon, LogOutIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';
import { updateUserProfile, logoutUser } from '../../utils/auth';

const router = useRouter();
const currentUser = ref({});
const orderCount = ref(0);
const isUpdating = ref(false);
const isChangingPassword = ref(false);

const message = ref({
  text: '',
  type: 'success'
});

const passwordMessage = ref({
  text: '',
  type: 'success'
});

const profileData = ref({
  username: '',
  email: '',
  address: '',
  phone: ''
});

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    currentUser.value = user;

    profileData.value = {
      username: user.username || '',
      email: user.email || '',
      address: user.address || '',
      phone: user.phone || ''
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderCount.value = orders.filter(order => order.userId === user.id).length;
  } else {
    router.push('/auth/login');
  }
});

const updateProfile = async () => {
  isUpdating.value = true;
  message.value = { text: '', type: 'success' };

  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserFromStorage = users.find(u => u.id === currentUser.value.id);

    const result = await updateUserProfile({
      ...profileData.value,
      id: currentUser.value.id,
      password: currentUserFromStorage.password,
      role: currentUser.value.role
    });

    if (result.success) {
      currentUser.value = result.user;
      message.value = {
        text: 'Hồ sơ của bạn đã được cập nhật thành công',
        type: 'success'
      };
    } else {
      message.value = {
        text: result.message || 'Cập nhật hồ sơ thất bại',
        type: 'error'
      };
    }
  } catch (err) {
    message.value = {
      text: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      type: 'error'
    };
    console.error(err);
  } finally {
    isUpdating.value = false;
  }
};

const changePassword = async () => {
  isChangingPassword.value = true;
  passwordMessage.value = { text: '', type: 'success' };

  try {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
      passwordMessage.value = {
        text: 'Mật khẩu mới không khớp',
        type: 'error'
      };
      isChangingPassword.value = false;
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.value.id);

    if (userIndex === -1) {
      passwordMessage.value = {
        text: 'Không tìm thấy user',
        type: 'error'
      };
      isChangingPassword.value = false;
      return;
    }

    if (users[userIndex].password !== passwordData.value.currentPassword) {
      passwordMessage.value = {
        text: 'Mật khẩu hiện tại không đúng',
        type: 'error'
      };
      isChangingPassword.value = false;
      return;
    }

    users[userIndex].password = passwordData.value.newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    passwordMessage.value = {
      text: 'Mật khẩu đã được thay đổi thành công',
      type: 'success'
    };
  } catch (err) {
    passwordMessage.value = {
      text: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      type: 'error'
    };
    console.error(err);
  } finally {
    isChangingPassword.value = false;
  }
};

const logout = () => {
  logoutUser();
  router.push('/auth/login');
};
</script>