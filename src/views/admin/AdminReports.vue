<template>
  <AdminLayout>
    <h1 class="text-2xl font-bold mb-6">Reports & Analytics</h1>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center">
          <span class="text-sm font-medium mr-2">Date Range:</span>
          <select v-model="dateRange" class="form-input w-48">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div>
          <button @click="generateReport" class="btn btn-primary">
            <FileTextIcon class="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <DollarSignIcon class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total Revenue</h2>
            <div class="flex items-center">
              <span class="text-2xl font-bold">${{ stats.revenue.toFixed(2) }}</span>
              <span v-if="stats.revenueChange > 0"
                class="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                +{{ stats.revenueChange }}%
              </span>
              <span v-else-if="stats.revenueChange < 0"
                class="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                {{ stats.revenueChange }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShoppingCartIcon class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total Orders</h2>
            <div class="flex items-center">
              <span class="text-2xl font-bold">{{ stats.orders }}</span>
              <span v-if="stats.ordersChange > 0"
                class="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                +{{ stats.ordersChange }}%
              </span>
              <span v-else-if="stats.ordersChange < 0"
                class="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                {{ stats.ordersChange }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <UsersIcon class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">New Customers</h2>
            <div class="flex items-center">
              <span class="text-2xl font-bold">{{ stats.newUsers }}</span>
              <span v-if="stats.usersChange > 0"
                class="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                +{{ stats.usersChange }}%
              </span>
              <span v-else-if="stats.usersChange < 0"
                class="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                {{ stats.usersChange }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <TrendingUpIcon class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Avg. Order Value</h2>
            <div class="flex items-center">
              <span class="text-2xl font-bold">${{ stats.avgOrderValue.toFixed(2) }}</span>
              <span v-if="stats.avgOrderChange > 0"
                class="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                +{{ stats.avgOrderChange }}%
              </span>
              <span v-else-if="stats.avgOrderChange < 0"
                class="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                {{ stats.avgOrderChange }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Revenue Over Time</h2>
        <div class="h-80 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <BarChart4Icon class="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Revenue chart will be displayed here</p>
            <p class="text-sm">Using Chart.js or similar library</p>
          </div>
        </div>
      </div>

      <!-- Orders Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Orders by Status</h2>
        <div class="h-80 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <PieChartIcon class="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Orders by status chart will be displayed here</p>
            <p class="text-sm">Using Chart.js or similar library</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-medium mb-4">Top Selling Products</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units Sold
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in topProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full object-cover" :src="product.image" :alt="product.name" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getCategoryName(product.categoryId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.unitsSold }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ product.revenue.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex">
                    <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-4 w-4 text-yellow-400" />
                    <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-4 w-4 text-yellow-400" />
                    <StarIcon v-for="i in (5 - Math.ceil(product.rating))" :key="`empty-${i}`"
                      class="h-4 w-4 text-gray-300" />
                  </div>
                  <span class="ml-1 text-sm text-gray-500">({{ product.reviews.length }})</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Sales -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-medium mb-4">Recent Sales</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getUserName(order.userId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.items.length }} items</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ order.total.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                  'bg-blue-100 text-blue-800': order.status === 'Shipping',
                  'bg-green-100 text-green-800': order.status === 'Delivered',
                  'bg-red-100 text-red-800': order.status === 'Cancelled'
                }">
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  DollarSignIcon, ShoppingCartIcon, UsersIcon, TrendingUpIcon,
  BarChart4Icon, PieChartIcon, StarIcon, StarHalfIcon, FileTextIcon
} from 'lucide-vue-next';
import AdminLayout from '../../components/admin/AdminLayout.vue';

const dateRange = ref('30');
const orders = ref([]);
const users = ref([]);
const products = ref([]);
const categories = ref([]);
const topProducts = ref([]);
const recentOrders = ref([]);

const stats = ref({
  revenue: 0,
  revenueChange: 0,
  orders: 0,
  ordersChange: 0,
  newUsers: 0,
  usersChange: 0,
  avgOrderValue: 0,
  avgOrderChange: 0
});

onMounted(() => {
  // Load data
  orders.value = JSON.parse(localStorage.getItem('orders')) || [];
  users.value = JSON.parse(localStorage.getItem('users')) || [];
  products.value = JSON.parse(localStorage.getItem('products')) || [];
  categories.value = JSON.parse(localStorage.getItem('categories')) || [];

  // Calculate stats
  calculateStats();

  // Get top products
  calculateTopProducts();

  // Get recent orders
  recentOrders.value = [...orders.value]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 10);
});

const calculateStats = () => {
  const filteredOrders = filterOrdersByDateRange();

  // Calculate revenue
  stats.value.revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  // Calculate order count
  stats.value.orders = filteredOrders.length;

  // Calculate average order value
  stats.value.avgOrderValue = filteredOrders.length > 0
    ? stats.value.revenue / filteredOrders.length
    : 0;

  // Calculate new users (mocked for demo)
  stats.value.newUsers = Math.floor(users.value.length * 0.3);

  // Calculate changes (mocked for demo)
  stats.value.revenueChange = 12;
  stats.value.ordersChange = 8;
  stats.value.usersChange = 15;
  stats.value.avgOrderChange = 5;
};

const calculateTopProducts = () => {
  // Create a map to track product sales
  const productSales = {};

  // Process all orders to calculate product sales
  const filteredOrders = filterOrdersByDateRange();

  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          id: item.productId,
          unitsSold: 0,
          revenue: 0
        };
      }

      productSales[item.productId].unitsSold += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });

  // Combine with product details
  const productsWithSales = products.value.map(product => {
    const sales = productSales[product.id] || { unitsSold: 0, revenue: 0 };
    return {
      ...product,
      unitsSold: sales.unitsSold,
      revenue: sales.revenue
    };
  });

  // Sort by revenue and take top 5
  topProducts.value = productsWithSales
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

const filterOrdersByDateRange = () => {
  if (dateRange.value === 'all') {
    return orders.value;
  }

  const days = parseInt(dateRange.value);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return orders.value.filter(order => new Date(order.orderDate) >= cutoffDate);
};

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.username : 'Unknown User';
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const generateReport = () => {
  alert('Report generation feature would be implemented here. This would typically generate a CSV or PDF report of the current data.');
};
</script>