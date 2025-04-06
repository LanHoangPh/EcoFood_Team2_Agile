<template>
    <CustomerLayout>
      <div v-if="order">
        <!-- Order status banner -->
        <div class="mb-6 p-4 rounded-lg" :class="statusClasses">
          <div class="flex items-center">
            <CheckCircleIcon v-if="order.status === 'Delivered'" class="h-6 w-6 mr-2" />
            <TruckIcon v-else-if="order.status === 'Shipping'" class="h-6 w-6 mr-2" />
            <ClockIcon v-else class="h-6 w-6 mr-2" />
            <div>
              <h2 class="text-lg font-medium">Order #{{ order.id }}</h2>
              <p>
                {{ statusMessage }}
                {{ order.status === 'Pending' ? ' - You can still cancel this order.' : '' }}
              </p>
            </div>
            <div class="ml-auto">
              <button 
                v-if="order.status === 'Pending'" 
                @click="cancelOrder" 
                class="btn btn-danger"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
        
        <!-- Order details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Items and shipping details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order items -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-6 border-b">
                <h2 class="text-lg font-medium">Order Items</h2>
              </div>
              <div class="divide-y">
                <div v-for="(item, index) in order.items" :key="index" class="p-6 flex items-start">
                  <img :src="item.image" :alt="item.name" class="h-16 w-16 object-cover rounded" />
                  <div class="ml-4 flex-1">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-sm text-gray-600">Qty: {{ item.quantity }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</div>
                    <div class="text-sm text-gray-600">
                      ${{ item.price.toFixed(2) }} each
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shipping details -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-6 border-b">
                <h2 class="text-lg font-medium">Shipping Information</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <div class="font-medium">Delivery Address</div>
                    <div class="text-gray-600">
                      {{ order.shippingInfo.fullName }}<br>
                      {{ order.shippingInfo.address }}<br>
                      {{ order.shippingInfo.city }}, {{ order.shippingInfo.state }} {{ order.shippingInfo.zipCode }}<br>
                      {{ order.shippingInfo.country }}
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">Contact Information</div>
                    <div class="text-gray-600">
                      Phone: {{ order.shippingInfo.phone }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order summary -->
          <div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-6 border-b">
                <h2 class="text-lg font-medium">Order Summary</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <div class="font-medium">Order Date</div>
                    <div class="text-gray-600">{{ formatDate(order.orderDate) }}</div>
                  </div>
                  <div>
                    <div class="font-medium">Order Status</div>
                    <div :class="statusTextClass">{{ order.status }}</div>
                  </div>
                  
                  <div class="border-t pt-4 mt-4">
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span>${{ order.subtotal.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Shipping</span>
                        <span>${{ order.shipping.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Tax</span>
                        <span>${{ order.tax.toFixed(2) }}</span>
                      </div>
                      <div class="border-t pt-2 mt-2">
                        <div class="flex justify-between font-bold">
                          <span>Total</span>
                          <span>${{ order.total.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6">
              <router-link to="/orders" class="btn btn-secondary block text-center">
                Return to My Orders
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else class="flex justify-center items-center h-64">
        <LoaderIcon class="h-8 w-8 text-green-600 animate-spin" />
        <span class="ml-2">Loading order details...</span>
      </div>
    </CustomerLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { CheckCircleIcon, TruckIcon, ClockIcon, LoaderIcon } from 'lucide-vue-next';
  import CustomerLayout from '../../components/customer/CustomerLayout.vue';
  
  const route = useRoute();
  const router = useRouter();
  const order = ref(null);
  
  const statusClasses = computed(() => {
    switch (order.value?.status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipping':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  });
  
  const statusTextClass = computed(() => {
    switch (order.value?.status) {
      case 'Delivered':
        return 'text-green-600';
      case 'Shipping':
        return 'text-blue-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  });
  
  const statusMessage = computed(() => {
    switch (order.value?.status) {
      case 'Delivered':
        return 'Your order has been delivered.';
      case 'Shipping':
        return 'Your order is on the way!';
      case 'Cancelled':
        return 'This order has been cancelled.';
      default:
        return 'Your order is being processed.';
    }
  });
  
  onMounted(() => {
    loadOrder();
  });
  
  const loadOrder = () => {
    const orderId = parseInt(route.params.id);
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Find order by ID (and make sure it belongs to the current user)
    const foundOrder = orders.find(o => o.id === orderId && o.userId === currentUser.id);
    
    if (foundOrder) {
      order.value = foundOrder;
    } else {
      router.push('/orders');
    }
  };
  
  const cancelOrder = () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === order.value.id);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'Cancelled';
      localStorage.setItem('orders', JSON.stringify(orders));
      order.value.status = 'Cancelled';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  </script>