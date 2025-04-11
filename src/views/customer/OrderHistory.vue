<template>
  <CustomerLayout>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Lịch sử hóa đơn</h1>

      <div v-if="orders.length > 0">
        <div class="space-y-6">
          <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="text-lg font-semibold">Hóa đơn #{{ order.id }}</h2>
                  <p class="text-sm text-gray-500">Đặt vào {{ formatDate(order.orderDate) }}</p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-col md:items-end">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mb-2" :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                    'bg-blue-100 text-blue-800': order.status === 'Shipping',
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                    'bg-red-100 text-red-800': order.status === 'Cancelled'
                  }">
                    {{ order.status }}
                  </span>
                  <span class="text-lg font-bold">₫{{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="p-6 border-b">
              <h3 class="text-md font-medium mb-4">Vật phẩm</h3>
              <div class="space-y-4">
                <div v-for="(item, index) in order.items" :key="index" class="flex items-center">
                  <img :src="item.image" :alt="item.name" class="h-16 w-16 object-cover rounded-md">
                  <div class="ml-4 flex-1">
                    <h4 class="text-sm font-medium">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }} × ₫{{ item.price.toFixed(2) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">₫{{ (item.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 class="text-md font-medium mb-2">Địa chỉ nhận hàng</h3>
                <address class="text-sm text-gray-600 not-italic">
                  {{ order.shippingInfo.fullName }}<br>
                  {{ order.shippingInfo.address }}<br>
                  {{ order.shippingInfo.city }}, {{ order.shippingInfo.state }} {{ order.shippingInfo.zipCode }}<br>
                  {{ order.shippingInfo.country }}<br>
                  Phone: {{ order.shippingInfo.phone }}
                </address>
              </div>

              <div>
                <h3 class="text-md font-medium mb-2">Phương thức thanh toán</h3>
                <div class="text-sm text-gray-600">
                  <div class="flex items-center">
                    <span v-if="order.paymentMethod === 'cash'" class="flex items-center">
                      <DollarSignIcon class="h-4 w-4 mr-1 text-green-600" />
                      Thanh toán khi nhận hàng
                    </span>
                    <span v-else-if="order.paymentMethod === 'online'" class="flex items-center">
                      <CreditCardIcon class="h-4 w-4 mr-1 text-blue-600" />
                      Thanh toán Online
                    </span>
                    <span v-else>
                      Thanh toán thông thường
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-md font-medium mb-2">Thông tin tiền hóa đơn</h3>
                <div class="text-sm">
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Tổng:</span>
                    <span>₫{{ order.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Phí ship:</span>
                    <span>₫{{ order.shipping.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Thuế:</span>
                    <span>₫{{ order.tax.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between font-medium pt-1 border-t mt-1">
                    <span>Tổng phải thanh toán:</span>
                    <span>₫{{ order.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-gray-50 flex justify-between items-center">
              <button @click="viewOrderDetails(order.id)" class="text-green-600 hover:text-green-800 font-medium">
                Xem chi tiết
              </button>

              <div>
                <button v-if="order.status === 'Delivered'" class="btn btn-secondary mr-2">
                  Đánh giá
                </button>
                <button v-if="order.status === 'Pending'" @click="cancelOrder(order.id)" class="btn btn-danger">
                  Hủy hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <ShoppingBagIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Không tìm thấy hóa đơn</h3>
        <p class="mt-1 text-gray-500 mb-6">
          Bạn chưa đặt bất kỳ đơn hàng nào.
        </p>
        <router-link to="/products" class="btn btn-primary">
          Tới trang sản phẩm
        </router-link>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingBagIcon, DollarSignIcon, CreditCardIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const router = useRouter();
const orders = ref([]);
const currentUser = ref({});

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {};

  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.value = allOrders
    .filter(order => order.userId === currentUser.value.id)
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const viewOrderDetails = (orderId) => {
  router.push(`/orders/${orderId}`);
};

const cancelOrder = (orderId) => {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderIndex = allOrders.findIndex(o => o.id === orderId);

  if (orderIndex !== -1) {
    allOrders[orderIndex].status = 'Cancelled';
    localStorage.setItem('orders', JSON.stringify(allOrders));

    const updatedOrder = allOrders[orderIndex];
    const index = orders.value.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }
  }
};
</script>