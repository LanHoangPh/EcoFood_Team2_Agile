<template>
  <CustomerLayout>
    <!-- Hero Section -->
    <section class="relative">
      <div class="bg-green-700 h-80 rounded-xl overflow-hidden">
        <img :src="currentImage" alt="Fresh organic food" class="w-full h-full object-cover opacity-30" />
        <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 class="text-4xl md:text-5xl font-bold text-center">Thực phẩm tươi & hữu cơ</h1>
          <p class="mt-4 text-xl md:text-2xl text-center max-w-2xl">
            Dịch vụ giao hàng tận nơi
          </p>
          <router-link to="/products" class="mt-6 btn btn-primary bg-white text-green-600 hover:bg-gray-100">
            Đi mua ngay
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Mua hàng theo danh mục</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <router-link v-for="category in categories" :key="category.id" :to="`/products?category=${category.id}`"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 text-center">
          <div class="text-4xl mb-2">{{ category.icon }}</div>
          <h3 class="font-medium">{{ category.name }}</h3>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link v-for="product in featuredProducts" :key="product.id" :to="`/products/${product.id}`"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
          <div class="relative h-48">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="font-medium text-lg">{{ product.name }}</h3>
            <div class="flex items-center mt-1">
              <div class="flex">
                <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-4 w-4 text-yellow-400" />
                <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-4 w-4 text-yellow-400" />
                <StarIcon v-for="i in (5 - Math.ceil(product.rating))" :key="`empty-${i}`"
                  class="h-4 w-4 text-gray-300" />
              </div>
              <span class="text-sm text-gray-600 ml-1">{{ product.rating.toFixed(1) }}</span>
            </div>
            <div class="mt-2 flex justify-between items-center">
              <span class="font-bold text-green-600">${{ product.price.toFixed(2) }}</span>
              <button @click.prevent="addToCart(product)" class="btn btn-primary py-1 px-2 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Lý do chọn chúng tôi</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <TruckIcon class="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">Giao hàng miễn phí</h3>
          <p class="text-gray-600">Giao hàng miễn phí cho tất cả các đơn hàng trên $50</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <LeafIcon class="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">100% an toàn </h3>
          <p class="text-gray-600">Tất cả các sản phẩm của chúng tôi đều được chứng nhận an toàn</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <ClockIcon class="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">Hỗ trợ 24/7</h3>
          <p class="text-gray-600">Hỗ trợ dịch vụ cho khách hàng 24/7</p>
        </div>
      </div>
    </section>
  </CustomerLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { StarIcon, StarHalfIcon, TruckIcon, LeafIcon, ClockIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const categories = ref([]);
const featuredProducts = ref([]);
const images = [
  "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504672281656-e3e7b0f673ce?w=1200&h=600&fit=crop&q=80",
];

onMounted(() => {
  categories.value = JSON.parse(localStorage.getItem('categories')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  featuredProducts.value = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  intervalId = setInterval(changeImage, 3000);
});
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
const currentImage = ref(images[0]);
let intervalId = null;

// Hàm chuyển ảnh
const changeImage = () => {
  const currentIndex = images.indexOf(currentImage.value);
  const nextIndex = (currentIndex + 1) % images.length; // Quay vòng lại khi đến ảnh cuối
  currentImage.value = images[nextIndex];
};
const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('storage'));
};
</script>