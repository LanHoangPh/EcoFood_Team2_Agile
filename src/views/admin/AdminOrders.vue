<template>
  <AdminLayout>
    <h1 class="text-2xl font-bold mb-6">Order Management</h1>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 flex items-center">
          <div class="relative flex-1">
            <input type="text" v-model="filters.search" placeholder="Search orders..."
              class="form-input pl-10 pr-4 py-2" />
            <SearchIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select v-model="filters.status" class="form-input ml-4 w-40">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipping">Shipping</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filters.sort" class="form-input w-48">
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="total-desc">Total (High to Low)</option>
            <option value="total-asc">Total (Low to High)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
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
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ getUserName(order.userId) }}</div>
              <div class="text-sm text-gray-500">{{ getUserEmail(order.userId) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">₫{{ order.total.toFixed(2) }}</div>
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
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openOrderModal(order)" class="text-green-600 hover:text-green-900 mr-3">
                View
              </button>
              <button @click="openStatusModal(order)" class="text-blue-600 hover:text-blue-900">
                Update Status
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredOrders.length === 0" class="p-6 text-center">
        <ShoppingCartIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <h3 class="text-lg font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-gray-500">
          Try adjusting your search or filters.
        </p>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showOrderModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">
                Order #{{ selectedOrder.id }} Details
              </h3>
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                'bg-yellow-100 text-yellow-800': selectedOrder.status === 'Pending',
                'bg-blue-100 text-blue-800': selectedOrder.status === 'Shipping',
                'bg-green-100 text-green-800': selectedOrder.status === 'Delivered',
                'bg-red-100 text-red-800': selectedOrder.status === 'Cancelled'
              }">
                {{ selectedOrder.status }}
              </span>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
              <div class="bg-gray-50 p-3 rounded">
                <p><strong>Name:</strong> {{ selectedOrder.shippingInfo?.fullName }}</p>
                <p><strong>Email:</strong> {{ getUserEmail(selectedOrder.userId) }}</p>
                <p><strong>Phone:</strong> {{ selectedOrder.shippingInfo?.phone }}</p>
                <p><strong>Address:</strong> {{ formatAddress(selectedOrder.shippingInfo) }}</p>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
              <div class="bg-gray-50 p-3 rounded">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in selectedOrder.items" :key="index">
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <img :src="item.image" :alt="item.name" class="h-8 w-8 rounded-full object-cover mr-2" />
                          <span class="text-sm">{{ item.name }}</span>
                        </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm">₫{{ item.price.toFixed(2) }}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm">{{ item.quantity }}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm">₫{{ (item.price * item.quantity).toFixed(2) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Order Summary</h4>
              <div class="bg-gray-50 p-3 rounded">
                <div class="flex justify-between mb-1">
                  <span class="text-sm">Subtotal:</span>
                  <span class="text-sm">₫{{ selectedOrder.subtotal?.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm">Shipping:</span>
                  <span class="text-sm">₫{{ selectedOrder.shipping?.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm">Tax:</span>
                  <span class="text-sm">₫{{ selectedOrder.tax?.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>₫{{ selectedOrder.total?.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="openStatusModal(selectedOrder)" class="btn btn-primary sm:ml-3">
              Update Status
            </button>
            <button type="button" @click="showOrderModal = false" class="btn btn-secondary mt-3 sm:mt-0">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showStatusModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showStatusModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Update Trạng Thái Hóa Đơn
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Hóa đơn #{{ selectedOrder.id }} for {{ getUserName(selectedOrder.userId) }}
              </p>
            </div>

            <div class="mb-4">
              <label for="status" class="form-label">Status</label>
              <select id="status" v-model="newStatus" class="form-input" required>
                <option value="Pending">Pending</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="updateOrderStatus" class="btn btn-primary sm:ml-3">
              Update Status
            </button>
            <button type="button" @click="showStatusModal = false" class="btn btn-secondary mt-3 sm:mt-0">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { SearchIcon, ShoppingCartIcon } from 'lucide-vue-next';
import AdminLayout from '../../components/admin/AdminLayout.vue';

const orders = ref([]);
const users = ref([]);
const showOrderModal = ref(false);
const showStatusModal = ref(false);
const selectedOrder = ref({});
const newStatus = ref('');

const filters = ref({
  search: '',
  status: '',
  sort: 'date-desc'
});

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem('orders')) || [];
  users.value = JSON.parse(localStorage.getItem('users')) || [];
});

const filteredOrders = computed(() => {
  let result = [...orders.value];

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(order => {
      const user = users.value.find(u => u.id === order.userId);
      return (
        order.id.toString().includes(searchTerm) ||
        (user && user.username.toLowerCase().includes(searchTerm)) ||
        (user && user.email.toLowerCase().includes(searchTerm)) ||
        (order.shippingInfo && order.shippingInfo.fullName.toLowerCase().includes(searchTerm))
      );
    });
  }

  if (filters.value.status) {
    result = result.filter(order => order.status === filters.value.status);
  }

  const [sortField, sortDirection] = filters.value.sort.split('-');
  result.sort((a, b) => {
    let comparison = 0;

    if (sortField === 'date') {
      comparison = new Date(a.orderDate) - new Date(b.orderDate);
    } else if (sortField === 'total') {
      comparison = a.total - b.total;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return result;
});

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.username : 'Không có User';
};

const getUserEmail = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.email : 'Không có Email';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatAddress = (shippingInfo) => {
  if (!shippingInfo) return 'Không có địa chỉ được cung cấp';

  return `₫{shippingInfo.address}, ₫{shippingInfo.city}, ₫{shippingInfo.state} ₫{shippingInfo.zipCode}, ₫{shippingInfo.country}`;
};

const openOrderModal = (order) => {
  selectedOrder.value = order;
  showOrderModal.value = true;
};

const openStatusModal = (order) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
};

const updateOrderStatus = () => {
  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderIndex = allOrders.findIndex(o => o.id === selectedOrder.value.id);

  if (orderIndex !== -1) {
    allOrders[orderIndex].status = newStatus.value;
    localStorage.setItem('orders', JSON.stringify(allOrders));

    orders.value = allOrders;
    selectedOrder.value.status = newStatus.value;
  }

  showStatusModal.value = false;
};
</script>