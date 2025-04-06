<template>
    <CustomerLayout>
      <h1 class="text-2xl font-bold mb-6">Checkout</h1>
      
      <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Shipping Information -->
        <div>
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-medium mb-4">Shipping Information</h2>
            
            <form class="space-y-4">
              <div>
                <label for="fullName" class="form-label">Full Name</label>
                <input 
                  id="fullName" 
                  type="text" 
                  v-model="shippingInfo.fullName" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="address" class="form-label">Street Address</label>
                <input 
                  id="address" 
                  type="text" 
                  v-model="shippingInfo.address" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="city" class="form-label">City</label>
                  <input 
                    id="city" 
                    type="text" 
                    v-model="shippingInfo.city" 
                    class="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label for="state" class="form-label">State</label>
                  <input 
                    id="state" 
                    type="text" 
                    v-model="shippingInfo.state" 
                    class="form-input" 
                    required 
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="zipCode" class="form-label">Zip Code</label>
                  <input 
                    id="zipCode" 
                    type="text" 
                    v-model="shippingInfo.zipCode" 
                    class="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label for="country" class="form-label">Country</label>
                  <input 
                    id="country" 
                    type="text" 
                    v-model="shippingInfo.country" 
                    class="form-input" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label for="phone" class="form-label">Phone Number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  v-model="shippingInfo.phone" 
                  class="form-input" 
                  required 
                />
              </div>
            </form>
          </div>
          
          <!-- Payment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Payment Information</h2>
            
            <form class="space-y-4">
              <div>
                <label for="cardNumber" class="form-label">Card Number</label>
                <input 
                  id="cardNumber" 
                  type="text" 
                  v-model="paymentInfo.cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2">
                  <label for="expiryDate" class="form-label">Expiry Date</label>
                  <input 
                    id="expiryDate" 
                    type="text" 
                    v-model="paymentInfo.expiryDate" 
                    placeholder="MM/YY" 
                    class="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label for="cvv" class="form-label">CVV</label>
                  <input 
                    id="cvv" 
                    type="text" 
                    v-model="paymentInfo.cvv" 
                    placeholder="123" 
                    class="form-input" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label for="nameOnCard" class="form-label">Name on Card</label>
                <input 
                  id="nameOnCard" 
                  type="text" 
                  v-model="paymentInfo.nameOnCard" 
                  class="form-input" 
                  required 
                />
              </div>
            </form>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Order Summary</h2>
            
            <!-- Items -->
            <div class="space-y-4 mb-6">
              <div v-for="(item, index) in cartItems" :key="index" class="flex items-center border-b pb-4">
                <img :src="item.image" :alt="item.name" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4 flex-1">
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-gray-600">Qty: {{ item.quantity }}</div>
                </div>
                <div class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
            </div>
            
            <!-- Costs -->
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
            
            <!-- Checkout Button -->
            <button 
              @click="placeOrder" 
              class="btn btn-primary w-full mt-6" 
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
            
            <div class="mt-4">
              <router-link to="/cart" class="text-green-600 hover:text-green-700 flex items-center justify-center">
                <ArrowLeftIcon class="h-4 w-4 mr-1" />
                Return to Cart
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <ShoppingCartIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-xl font-medium mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-6">You can't proceed to checkout with an empty cart.</p>
        <router-link to="/products" class="btn btn-primary">
          Start Shopping
        </router-link>
      </div>
    </CustomerLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ShoppingCartIcon, ArrowLeftIcon } from 'lucide-vue-next';
  import CustomerLayout from '../../components/customer/CustomerLayout.vue';
  import { generateId } from '../../utils/mockData';
  
  const router = useRouter();
  const cartItems = ref([]);
  const isProcessing = ref(false);
  
  const currentUser = computed(() => {
    return JSON.parse(localStorage.getItem('currentUser')) || {};
  });
  
  // Customer details prefilled from user profile if available
  const shippingInfo = ref({
    fullName: currentUser.value.username || '',
    address: currentUser.value.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: currentUser.value.phone || ''
  });
  
  const paymentInfo = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
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
    // Load cart
    cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Redirect if cart is empty
    if (cartItems.value.length === 0) {
      router.push('/cart');
    }
  });
  
  const placeOrder = () => {
    // Validate form
    if (!validateForm()) {
      alert('Please fill out all required fields');
      return;
    }
    
    isProcessing.value = true;
    
    // Simulate processing delay
    setTimeout(() => {
      // Create order
      const order = {
        id: generateId('orders'),
        userId: currentUser.value.id,
        items: [...cartItems.value],
        shippingInfo: { ...shippingInfo.value },
        subtotal: cartTotal.value,
        shipping: shipping.value,
        tax: tax.value,
        total: orderTotal.value,
        status: 'Pending',
        orderDate: new Date().toISOString()
      };
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Trigger storage event for navbar to update cart count
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to confirmation
      router.push(`/orders/${order.id}`);
      
      isProcessing.value = false;
    }, 1500);
  };
  
  const validateForm = () => {
    // Check shipping info
    for (const key in shippingInfo.value) {
      if (!shippingInfo.value[key]) return false;
    }
    
    // Check payment info
    for (const key in paymentInfo.value) {
      if (!paymentInfo.value[key]) return false;
    }
    
    return true;
  };
  </script>