<template>
    <AdminLayout>
      <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <UsersIcon class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <h2 class="text-gray-600 text-sm">Total Users</h2>
              <div class="flex items-center">
                <span class="text-2xl font-bold">{{ stats.users }}</span>
                <span class="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                  +{{ stats.newUsers }} new
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <PackageIcon class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <h2 class="text-gray-600 text-sm">Total Products</h2>
              <div class="flex items-center">
                <span class="text-2xl font-bold">{{ stats.products }}</span>
                <span v-if="stats.lowStock > 0" class="ml-2 text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                  {{ stats.lowStock }} low stock
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <ShoppingCartIcon class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <h2 class="text-gray-600 text-sm">Total Orders</h2>
              <div class="flex items-center">
                <span class="text-2xl font-bold">{{ stats.orders }}</span>
                <span class="ml-2 text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                  {{ stats.pendingOrders }} pending
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <DollarSignIcon class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <h2 class="text-gray-600 text-sm">Total Revenue</h2>
              <div class="flex items-center">
                <span class="text-2xl font-bold">${{ stats.revenue.toFixed(2) }}</span>
                <span class="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                  +${{ stats.monthlyRevenue.toFixed(2) }} this month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chart and Recent Orders -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium mb-4">Revenue Overview</h2>
          <div class="h-80 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <BarChart4Icon class="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Revenue chart will be displayed here</p>
              <p class="text-sm">Using Chart.js or similar library</p>
            </div>
          </div>
        </div>
        
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Recent Orders</h2>
            <router-link to="/admin/orders" class="text-sm text-green-600 hover:text-green-800">
              View all
            </router-link>
          </div>
          <div class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between border-b pb-3">
              <div>
                <div class="font-medium">Order #{{ order.id }}</div>
                <div class="text-sm text-gray-600">{{ formatDate(order.orderDate) }}</div>
              </div>
              <div class="flex items-center">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                    'bg-blue-100 text-blue-800': order.status === 'Shipping',
                    'bg-red-100 text-red-800': order.status === 'Cancelled',
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Popular Products -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-medium">Popular Products</h2>
          <router-link to="/admin/products" class="text-sm text-green-600 hover:text-green-800">
            View all products
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="product in popularProducts" 
            :key="product.id" 
            class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h3 class="font-medium">{{ product.name }}</h3>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-4 w-4 text-yellow-400" />
                  <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-4 w-4 text-yellow-400" />
                  <StarIcon 
                    v-for="i in (5 - Math.ceil(product.rating))" 
                    :key="`empty-${i}`" 
                    class="h-4 w-4 text-gray-300" 
                  />
                </div>
                <span class="text-sm text-gray-600 ml-1">{{ product.rating.toFixed(1) }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="font-bold text-green-600">${{ product.price.toFixed(2) }}</span>
                <span class="text-sm text-gray-600">Stock: {{ product.stock }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { 
    UsersIcon, PackageIcon, ShoppingCartIcon, DollarSignIcon, 
    BarChart4Icon, StarIcon, StarHalfIcon 
  } from 'lucide-vue-next';
  import AdminLayout from '../../components/admin/AdminLayout.vue';
  
  const stats = ref({
    users: 0,
    newUsers: 0,
    products: 0,
    lowStock: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
    monthlyRevenue: 0
  });
  
  const recentOrders = ref([]);
  const popularProducts = ref([]);
  
  onMounted(() => {
    // Load users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    stats.value.users = users.length;
    stats.value.newUsers = 2; // Mocked new users for demo
    
    // Load products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    stats.value.products = products.length;
    stats.value.lowStock = products.filter(p => p.stock < 10).length;
    
    // Sort products by rating and take top 4
    popularProducts.value = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    stats.value.orders = orders.length;
    stats.value.pendingOrders = orders.filter(o => o.status === 'Pending').length;
    
    // Calculate revenue
    stats.value.revenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate monthly revenue (mocked for demo)
    stats.value.monthlyRevenue = stats.value.revenue * 0.4;
    
    // Get recent orders (latest 5)
    recentOrders.value = [...orders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);
  });
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  </script>