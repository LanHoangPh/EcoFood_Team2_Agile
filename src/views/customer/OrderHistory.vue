<template>
    <CustomerLayout>
        <h1 class="text-2xl font-bold mb-6">My Orders</h1>
    
    <div v-if="orders.length > 0" class="space-y-6">
      <!-- Order list -->
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="bg-white rounded-lg shadow overflow-hidden border-l-4"
        :class="{
          'border-green-500': order.status === 'Delivered',
          'border-blue-500': order.status === 'Shipping',
          'border-red-500': order.status === 'Cancelled',
          'border-yellow-500': order.status === 'Pending'
        }"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-medium">
                Order #{{ order.id }}
                <span 
                  class="ml-2 inline-block px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                    'bg-blue-100 text-blue-800': order.status === 'Shipping',
                    'bg-red-100 text-red-800': order.status === 'Cancelled',
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending'
                  }"
                >
                  {{ order.status }}
                </span>
              </h2>
              <p class="text-sm text-gray-600">
                Ordered on {{ formatDate(order.orderDate) }}
              </p>
            </div>
            <div>
              <router-link :to="`/orders/${order.id}`" class="btn btn-primary py-1 px-3 text-sm">
                View Details
              </router-link>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Order items summary -->
            <div class="col-span-2">
              <h3 class="text-sm font-medium mb-2">Items</h3>
              <div class="flex flex-wrap gap-2">
                <div v-for="(item, index) in order.items.slice(0, 3)" :key="index" class="flex items-center">
                  <img :src="item.image" :alt="item.name" class="h-12 w-12 object-cover rounded" />
                  <div class="ml-2">
                    <div class="text-sm font-medium">{{ item.name }}</div>
                    <div class="text-xs text-gray-600">Qty: {{ item.quantity }}</div>
                  </div>
                  <div v-if="index < order.items.length - 1" class="mx-2 text-gray-300">•</div>
                </div>
                <div v-if="order.items.length > 3" class="flex items-center text-sm text-gray-600">
                  +{{ order.items.length - 3 }} more items
                </div>
              </div>
            </div>
            
            <!-- Order total -->
            <div class="text-right">
              <h3 class="text-sm font-medium mb-2">Total</h3>
              <div class="text-lg font-bold">${{ order.total.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <PackageIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-medium mb-2">No orders yet</h2>
      <p class="text-gray-600 mb-6">Looks like you haven't placed any orders yet.</p>
      <router-link to="/products" class="btn btn-primary">
        Start Shopping
      </router-link>
    </div>
    </CustomerLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { PackageIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const orders = ref([]);

onMounted(() => {
  loadOrders();
});

const loadOrders = () => {
  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Filter orders for current user and sort by date (newest first)
  orders.value = allOrders
    .filter(order => order.userId === currentUser.id)
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
