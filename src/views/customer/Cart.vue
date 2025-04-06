<template>
  <CustomerLayout>
    <h1 class="text-2xl font-bold mb-6">Giỏ hàng</h1>

    <div v-if="cartItems.length > 0">
      <!-- Cart Items -->
      <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in cartItems" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-16 w-16 flex-shrink-0">
                    <img class="h-16 w-16 object-cover" :src="item.image" :alt="item.name" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ item.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <button @click="updateQuantity(index, -1)" class="p-1 text-gray-600 hover:text-green-600"
                    :disabled="item.quantity <= 1">
                    <MinusIcon class="h-4 w-4" />
                  </button>
                  <span class="mx-2 w-8 text-center">{{ item.quantity }}</span>
                  <button @click="updateQuantity(index, 1)" class="p-1 text-gray-600 hover:text-green-600">
                    <PlusIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="removeItem(index)" class="text-red-600 hover:text-red-900">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary and Checkout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Ghi chú cho việc giao hàng</h2>
            <textarea v-model="instructions"
              placeholder="Thêm bất kỳ hướng dẫn đặc biệt nào về việc giao hàng theo ý bạn ..."
              class="form-input h-24 w-full"></textarea>
          </div>
        </div>
        <div>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Order Summary</h2>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span>${{ shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="border-t pt-2 mt-2">
                <div class="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${{ orderTotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <button @click="checkout" class="btn btn-primary w-full mt-4">
              Proceed to Checkout
            </button>
            <div class="mt-4">
              <router-link to="/products" class="text-green-600 hover:text-green-700 flex items-center justify-center">
                <ArrowLeftIcon class="h-4 w-4 mr-1" />
                Continue Shopping
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty cart -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <ShoppingCartIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-medium mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
      <router-link to="/products" class="btn btn-primary">
        Start Shopping
      </router-link>
    </div>
  </CustomerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon, ArrowLeftIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const router = useRouter();
const cartItems = ref([]);
const instructions = ref('');

// Shipping and tax calculations
const taxRate = 0.08; // 8% tax
const shipping = computed(() => cartTotal.value >= 50 ? 0 : 5.99);

// Calculate totals
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const tax = computed(() => {
  return cartTotal.value * taxRate;
});

const orderTotal = computed(() => {
  return cartTotal.value + shipping.value + tax.value;
});

onMounted(() => {
  loadCart();
});

const loadCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
};

const updateQuantity = (index, change) => {
  const newQuantity = cartItems.value[index].quantity + change;
  if (newQuantity <= 0) return;

  cartItems.value[index].quantity = newQuantity;
  saveCart();
};

const removeItem = (index) => {
  cartItems.value.splice(index, 1);
  saveCart();
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));

  // Trigger storage event for navbar to update cart count
  window.dispatchEvent(new Event('storage'));
};

const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  router.push('/checkout');
};
</script>