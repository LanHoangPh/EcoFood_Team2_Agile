<template>
  <nav class="bg-green-600 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-white font-bold text-xl">
              🥗 EcoFood
            </router-link>
          </div>

          <div v-if="user && user.role === 'customer'" class="hidden sm:ml-6 sm:flex sm:items-center">
            <router-link v-for="(item, index) in customerNavItems" :key="index" :to="item.to"
              class="px-3 py-2 text-white hover:bg-green-700 rounded-md text-sm font-medium">
              {{ item.text }}
            </router-link>
          </div>

          <div v-if="user && user.role === 'admin'" class="hidden sm:ml-6 sm:flex sm:items-center">
            <router-link v-for="(item, index) in adminNavItems" :key="index" :to="item.to"
              class="px-3 py-2 text-white hover:bg-green-700 rounded-md text-sm font-medium">
              {{ item.text }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <!-- Cart Icon (Customer only) -->
          <router-link v-if="user && user.role === 'customer'" to="/cart"
            class="p-2 text-white hover:bg-green-700 rounded-md relative">
            <ShoppingCartIcon class="h-6 w-6" />
            <span v-if="cartItemCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- User Menu Dropdown -->
          <div class="ml-3 relative">
            <div>
              <button @click="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white">
                <span class="flex items-center text-white">
                  <UserIcon class="h-6 w-6 mr-1" />
                  {{ user ? user.username : 'Guest' }}
                </span>
              </button>
            </div>

            <div v-if="isProfileMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              @click="isProfileMenuOpen = false">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </router-link>
              <router-link v-if="user?.role === 'customer'" to="/orders"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                My Orders
              </router-link>
              <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logoutUser } from '../../utils/auth';
import { ShoppingCartIcon } from 'lucide-vue-next';
import { UserIcon } from 'lucide-vue-next';

const router = useRouter();
const user = ref(null);
const isProfileMenuOpen = ref(false);
const cartItemCount = ref(0);

const customerNavItems = [
  { text: 'Home', to: '/' },
  { text: 'Products', to: '/products' },
  { text: 'Help Center', to: '/help' }
];

const adminNavItems = [
  { text: 'Dashboard', to: '/admin/dashboard' },
  { text: 'Products', to: '/admin/products' },
  { text: 'Categories', to: '/admin/categories' },
  { text: 'Orders', to: '/admin/orders' },
  { text: 'Users', to: '/admin/users' },
  { text: 'Reports', to: '/admin/reports' }
];

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('currentUser'));
  updateCartCount();
  window.addEventListener('storage', handleStorageChange);
});

const handleStorageChange = (event) => {
  if (event.key === 'cart') {
    updateCartCount();
  } else if (event.key === 'currentUser') {
    user.value = JSON.parse(localStorage.getItem('currentUser'));
  }
};

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemCount.value = cart.reduce((total, item) => total + item.quantity, 0);
};

const logout = () => {
  logoutUser();
  router.push('/auth/login');
};
</script>