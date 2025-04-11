<template>
  <CustomerLayout>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center mb-8">
        <router-link to="/orders" class="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeftIcon class="h-5 w-5 mr-1" />
          Trở về trang Hóa Đơn
        </router-link>
      </div>

      <div v-if="order">
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div class="p-6 border-b">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 class="text-2xl font-bold">Hóa đơn #{{ order.id }}</h1>
                <p class="text-sm text-gray-500">Đặt vào {{ formatDate(order.orderDate) }}</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full" :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                  'bg-blue-100 text-blue-800': order.status === 'Shipping',
                  'bg-green-100 text-green-800': order.status === 'Delivered',
                  'bg-red-100 text-red-800': order.status === 'Cancelled'
                }">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="p-6 border-b bg-gray-50">
            <h2 class="text-lg font-semibold mb-4">Order Timeline</h2>
            <div class="relative">
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div class="relative pl-10 pb-8">
                <div class="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="text-md font-medium">Hóa đơn đã được đặt</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(order.orderDate) }}</p>
                </div>
              </div>

              <div class="relative pl-10 pb-8">
                <div class="absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center" :class="{
                  'bg-green-500': ['Shipping', 'Delivered'].includes(order.status),
                  'bg-gray-300': !['Shipping', 'Delivered'].includes(order.status)
                }">
                  <TruckIcon class="h-5 w-5"
                    :class="['Shipping', 'Delivered'].includes(order.status) ? 'text-white' : 'text-gray-500'" />
                </div>
                <div>
                  <h3 class="text-md font-medium">Hóa đơn đang giao</h3>
                  <p class="text-sm text-gray-500">
                    {{ ['Shipping', 'Delivered'].includes(order.status) ? 'Đơn hàng của bạn đang trên đường giao' :
                      'Pending' }}
                  </p>
                </div>
              </div>

              <div class="relative pl-10">
                <div class="absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center" :class="{
                  'bg-green-500': order.status === 'Delivered',
                  'bg-gray-300': order.status !== 'Delivered'
                }">
                  <PackageIcon class="h-5 w-5" :class="order.status === 'Delivered' ? 'text-white' : 'text-gray-500'" />
                </div>
                <div>
                  <h3 class="text-md font-medium">Hóa đơn </h3>
                  <p class="text-sm text-gray-500">
                    {{ order.status === 'Delivered' ? 'Đơn hàng của bạn đã được giao thành công' : 'Pending' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold mb-4">Vật phẩm</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản Phẩm
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in order.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img class="h-10 w-10 rounded-full object-cover" :src="item.image" :alt="item.name" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">₫{{ item.price.toFixed(2) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ item.quantity }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">₫{{ (item.price * item.quantity).toFixed(2) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Shipping, Payment, and Summary -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 class="text-lg font-semibold mb-4">Thông tin địa chỉ nhận</h2>
              <div class="bg-gray-50 p-4 rounded-lg">
                <address class="not-italic">
                  <p class="font-medium">{{ order.shippingInfo.fullName }}</p>
                  <p>{{ order.shippingInfo.address }}</p>
                  <p>{{ order.shippingInfo.city }}, {{ order.shippingInfo.state }} {{ order.shippingInfo.zipCode }}</p>
                  <p>{{ order.shippingInfo.country }}</p>
                  <p class="mt-2">Phone: {{ order.shippingInfo.phone }}</p>
                </address>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold mb-4">Thông tin Thanh toán</h2>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="mb-4">
                  <p class="font-medium">Phương thức thanh toán:</p>
                  <div class="flex items-center mt-1">
                    <span v-if="order.paymentMethod === 'cash'" class="flex items-center">
                      <DollarSignIcon class="h-5 w-5 mr-2 text-green-600" />
                      Thanh toán khi nhận hàng
                    </span>
                    <span v-else-if="order.paymentMethod === 'online'" class="flex items-center">
                      <CreditCardIcon class="h-5 w-5 mr-2 text-blue-600" />
                      Thanh toán Online
                    </span>
                    <span v-else>
                      Thanh toán thông thường
                    </span>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Trang thái thanh toán:</p>
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1" :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                    'bg-green-100 text-green-800': ['Shipping', 'Delivered'].includes(order.status)
                  }">
                    {{ ['Shipping', 'Delivered'].includes(order.status) ? 'Thối lại' : 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold mb-4">Thông tin tiền hóa đơn</h2>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between mb-2">
                  <span>Tổng cộng:</span>
                  <span>₫{{ order.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Phí Ship:</span>
                  <span>₫{{ order.shipping.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Thuế:</span>
                  <span>₫{{ order.tax.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Tổng phải thanh toán:</span>
                  <span>₫{{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50 flex justify-between items-center">
            <div>
              <button v-if="order.status === 'Pending'" @click="cancelOrder" class="btn btn-danger">
                Hủy Hóa đơn
              </button>
            </div>

            <div>
              <button v-if="order.status === 'Delivered'" class="btn btn-primary">
                Đánh giá
              </button>
              <router-link to="/help" class="btn btn-secondary ml-2">
                Liên hệ hỗ trợ
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2">Loading order details...</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <XCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
        <p class="mt-1 text-gray-500 mb-6">
          Đơn hàng bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền xem đơn hàng đó.
        </p>
        <router-link to="/orders" class="btn btn-primary">
          Trở về trang Hóa Đơn
        </router-link>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeftIcon, CheckIcon, TruckIcon, PackageIcon,
  XCircleIcon, DollarSignIcon, CreditCardIcon
} from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true);
const currentUser = ref({});

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {};

  const orderId = parseInt(route.params.id);

  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const foundOrder = allOrders.find(o => o.id === orderId && o.userId === currentUser.value.id);

  if (foundOrder) {
    order.value = foundOrder;
  }

  loading.value = false;
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

const cancelOrder = () => {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderIndex = allOrders.findIndex(o => o.id === order.value.id);

  if (orderIndex !== -1) {
    allOrders[orderIndex].status = 'Cancelled';
    localStorage.setItem('orders', JSON.stringify(allOrders));
    order.value.status = 'Cancelled';
  }
};
</script>