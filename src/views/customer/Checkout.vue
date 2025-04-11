<template>
  <CustomerLayout>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Thanh toán</h1>

      <!-- các bước checkout -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            <CheckIcon class="h-5 w-5" />
          </div>
          <span class="ml-2 font-medium">Cart</span>
        </div>
        <div class="h-1 w-16 bg-gray-200 sm:w-32"></div>
        <div class="flex items-center">
          <div class="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            <CheckIcon class="h-5 w-5" />
          </div>
          <span class="ml-2 font-medium">Shipping</span>
        </div>
        <div class="h-1 w-16 bg-gray-200 sm:w-32"></div>
        <div class="flex items-center">
          <div class="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            <CreditCardIcon class="h-5 w-5" />
          </div>
          <span class="ml-2 font-medium">Phương thức</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Thông tin vận chuyển</h2>
            <form @submit.prevent="validateShippingInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label for="fullName" class="form-label">Full Name</label>
                <input id="fullName" v-model="shippingInfo.fullName" type="text" class="form-input" required />
              </div>

              <div class="md:col-span-2">
                <label for="address" class="form-label">Địa chị cụ thể</label>
                <input id="address" v-model="shippingInfo.address" type="text" class="form-input" required />
              </div>

              <div>
                <label for="city" class="form-label">Tỉnh/Thành Phố</label>
                <input id="city" v-model="shippingInfo.city" type="text" class="form-input" required />
              </div>

              <div>
                <label for="state" class="form-label">Quận/Huyện</label>
                <input id="state" v-model="shippingInfo.state" type="text" class="form-input" required />
              </div>

              <div>
                <label for="zipCode" class="form-label">ZIP/Mã bưu chính</label>
                <input id="zipCode" v-model="shippingInfo.zipCode" type="text" class="form-input" required />
              </div>

              <div>
                <label for="country" class="form-label">Quốc Gia</label>
                <input id="country" v-model="shippingInfo.country" type="text" class="form-input" required />
              </div>

              <div class="md:col-span-2">
                <label for="phone" class="form-label">Phone Number</label>
                <input id="phone" v-model="shippingInfo.phone" type="tel" class="form-input" required />
              </div>

              <div class="md:col-span-2">
                <button type="submit" class="btn btn-primary w-full" :disabled="shippingInfoComplete">
                  Tiếp tục với thanh toán
                </button>
              </div>
            </form>
          </div>

          <div v-if="shippingInfoComplete" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Phương thức thanh toán</h2>

            <div class="mb-6">
              <div class="flex items-center mb-4">
                <input id="payment-cash" type="radio" name="payment-method" value="cash" v-model="paymentMethod"
                  class="h-4 w-4 text-green-600 focus:ring-green-500" />
                <label for="payment-cash" class="ml-2 block text-sm font-medium text-gray-700">
                  Thanh toán khi nhận hàng
                </label>
              </div>

              <div v-if="paymentMethod === 'cash'" class="ml-6 p-4 bg-gray-50 rounded-md">
                <p class="text-sm text-gray-600 mb-3">Vui lòng nhập số tiền mặt mà bạn đưa:</p>
                <div class="flex items-center">
                  <span class="text-gray-500 mr-2">VND</span>
                  <input type="number" v-model="cashAmount" class="form-input" placeholder="Nhập số tiền vào đây"
                    min="0" step="0.01" />
                </div>
                <div v-if="cashAmount && parseFloat(cashAmount) < orderTotal" class="mt-2 text-red-500 text-sm">
                  Số tiền không đủ để thanh toán đơn hàng.
                </div>
                <div v-if="cashAmount && parseFloat(cashAmount) >= orderTotal" class="mt-2 text-green-500 text-sm">
                  Thối tiền: ₫{{ (parseFloat(cashAmount) - orderTotal).toFixed(2) }}
                </div>
              </div>

              <div class="flex items-center mb-4">
                <input id="payment-online" type="radio" name="payment-method" value="online" v-model="paymentMethod"
                  class="h-4 w-4 text-green-600 focus:ring-green-500" />
                <label for="payment-online" class="ml-2 block text-sm font-medium text-gray-700">
                  Thanh toán Online
                </label>
              </div>

              <div v-if="paymentMethod === 'online'" class="ml-6 p-4 bg-gray-50 rounded-md">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label for="card-number" class="form-label">Số Thẻ</label>
                    <input id="card-number" type="text" v-model="cardInfo.number" class="form-input"
                      placeholder="1234 5678 9012 3456" required />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="card-expiry" class="form-label">Ngày hết hạn</label>
                      <input id="card-expiry" type="text" v-model="cardInfo.expiry" class="form-input"
                        placeholder="MM/YY" required />
                    </div>

                    <div>
                      <label for="card-cvc" class="form-label">CVC</label>
                      <input id="card-cvc" type="text" v-model="cardInfo.cvc" class="form-input" placeholder="123"
                        required />
                    </div>
                  </div>

                  <div>
                    <label for="card-name" class="form-label">Tên Thẻ</label>
                    <input id="card-name" type="text" v-model="cardInfo.name" class="form-input" placeholder="HoàngLân"
                      required />
                  </div>
                </div>
              </div>
            </div>

            <button @click="placeOrder" class="btn btn-primary w-full" :disabled="!isPaymentValid">
              Đặt hàng
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-semibold mb-4">Thông tin chi tiết đơn hàng</h2>

            <div class="mb-4">
              <div v-for="item in cartItems" :key="item.id" class="flex py-2 border-b">
                <img :src="item.image" :alt="item.name" class="h-16 w-16 object-cover rounded-md">
                <div class="ml-4 flex-1">
                  <h3 class="text-sm font-medium">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                  <p class="text-sm font-medium">₫{{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Tổng cộng</span>
                <span class="font-medium">₫{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí ship</span>
                <span class="font-medium">₫{{ shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thuế</span>
                <span class="font-medium">₫{{ tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="text-lg font-bold">Tổng tiền</span>
                <span class="text-lg font-bold">₫{{ orderTotal.toFixed(2) }}</span>
              </div>
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
import { CheckIcon, CreditCardIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';
import { generateId } from '../../utils/mockData';

const router = useRouter();
const cartItems = ref([]);
const currentUser = ref({});
const shippingInfoComplete = ref(false);
const paymentMethod = ref('');
const cashAmount = ref('');

const shippingInfo = ref({
  fullName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: ''
});

const cardInfo = ref({
  number: '',
  expiry: '',
  cvc: '',
  name: ''
});

onMounted(() => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {};

  if (currentUser.value.address) {
    const addressParts = currentUser.value.address.split(', ');
    if (addressParts.length >= 4) {
      shippingInfo.value = {
        fullName: currentUser.value.username,
        address: addressParts[0],
        city: addressParts[1],
        state: addressParts[2].split(' ')[0],
        zipCode: addressParts[2].split(' ')[1],
        country: addressParts[3],
        phone: currentUser.value.phone || ''
      };
    }
  }
});

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 1000000 ? 0 : 20000;
});

const tax = computed(() => {
  return subtotal.value * 0.08;
});

const orderTotal = computed(() => {
  return subtotal.value + shipping.value + tax.value;
});

const isPaymentValid = computed(() => {
  if (paymentMethod.value === 'cash') {
    return cashAmount.value && parseFloat(cashAmount.value) >= orderTotal.value;
  } else if (paymentMethod.value === 'online') {
    return cardInfo.value.number &&
      cardInfo.value.expiry &&
      cardInfo.value.cvc &&
      cardInfo.value.name;
  }
  return false;
});

const validateShippingInfo = () => {
  const requiredFields = [
    'fullName', 'address', 'city', 'state', 'zipCode', 'country', 'phone'
  ];

  const allFieldsFilled = requiredFields.every(field => shippingInfo.value[field]);

  if (allFieldsFilled) {
    shippingInfoComplete.value = true;
  } else {
    alert('Vui lòng bắt buộc điền vào tất cả các trường thông tin vận chuyển.');
  }
};

const placeOrder = () => {
  if (!isPaymentValid.value) {
    if (paymentMethod.value === 'cash' && parseFloat(cashAmount.value) < orderTotal.value) {
      alert('Số tiền mặt không đủ để thanh toán toàn bộ đơn hàng.');
    } else {
      alert('Vui lòng điền đầy đủ thông tin thanh toán.');
    }
    return;
  }

  const newOrder = {
    id: generateId('orders'),
    userId: currentUser.value.id,
    items: cartItems.value,
    shippingInfo: shippingInfo.value,
    subtotal: subtotal.value,
    shipping: shipping.value,
    tax: tax.value,
    total: orderTotal.value,
    paymentMethod: paymentMethod.value,
    status: 'Pending',
    orderDate: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  localStorage.setItem('cart', JSON.stringify([]));
  router.push('/orders');
};
</script>