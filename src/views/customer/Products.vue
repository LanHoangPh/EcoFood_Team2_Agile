<template>
  <CustomerLayout>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-64 shrink-0">
        <div class="bg-white rounded-lg shadow p-4 sticky top-4">
          <h2 class="text-lg font-medium mb-4">Bộ lọc</h2>
          <!-- tìm kiếm -->
          <div class="mb-4">
            <label for="search" class="form-label">Tìm kiếm</label>
            <div class="relative">
              <input id="search" v-model="filters.search" type="text" placeholder="Search products..."
                class="form-input pr-10" />
              <SearchIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <!-- danh mục -->
          <div class="mb-4">
            <h3 class="form-label">Danh mục món ăn</h3>
            <div class="space-y-2 mt-2">
              <label v-for="category in categories" :key="category.id" class="flex items-center">
                <input type="checkbox" :value="category.id" v-model="filters.categories"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span class="ml-2 text-sm">{{ category.name }}</span>
              </label>
            </div>
          </div>
          <!-- khoản giá -->
          <div class="mb-4">
            <h3 class="form-label">Tìm khoảng giá</h3>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="min-price" class="sr-only">Giá nhỏ nhất</label>
                <input id="min-price" v-model.number="filters.minPrice" type="number" min="0" placeholder="Min"
                  class="form-input" />
              </div>
              <div>
                <label for="max-price" class="sr-only">Giá lớn nhất</label>
                <input id="max-price" v-model.number="filters.maxPrice" type="number" min="0" placeholder="Max"
                  class="form-input" />
              </div>
            </div>
          </div>
          <button @click="clearFilters" class="btn btn-secondary w-full">
            Clear bộ lọc
          </button>
        </div>
      </div>
      <!-- Main content -->
      <div class="flex-1">
        <!-- Products -->
        <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="product in filteredProducts" :key="product.id"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <router-link :to="`/products/₫{product.id}`">
              <div class="relative h-48">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
              </div>
            </router-link>
            <div class="p-4">
              <router-link :to="`/products/${product.id}`">
                <h3 class="font-medium text-lg hover:text-green-600">{{ product.name }}</h3>
              </router-link>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-4 w-4 text-yellow-400" />
                  <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-4 w-4 text-yellow-400" />
                  <StarIcon v-for="i in (5 - Math.ceil(product.rating))" :key="`empty-₫{i}`"
                    class="h-4 w-4 text-gray-300" />
                </div>
                <span class="text-sm text-gray-600 ml-1">{{ product.rating.toFixed(1) }}</span>
              </div>
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
              <div class="mt-3 flex justify-between items-center">
                <span class="font-bold text-green-600">₫{{ product.price.toFixed(2) }}</span>
                <button @click="addToCart(product)" class="btn btn-primary py-1 px-3 text-sm">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-8 text-center">
          <ShoppingBasketIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
          <p class="mt-2 text-gray-600">
            Hãy thử điều chỉnh lại tiêu chí tìm kiếm hoặc lọc của bạn
          </p>
          <button @click="clearFilters" class="mt-4 btn btn-primary">
            Clear bộ lọc
          </button>
        </div>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SearchIcon, StarIcon, StarHalfIcon, ShoppingBasketIcon } from 'lucide-vue-next';
import CustomerLayout from '../../components/customer/CustomerLayout.vue';

const route = useRoute();
const products = ref([]);
const categories = ref([]);

const filters = ref({
  search: '',
  categories: [],
  minPrice: null,
  maxPrice: null
});

watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    filters.value.categories = [parseInt(newQuery.category)];
  }
}, { immediate: true });

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    if (filters.value.search && !product.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }

    if (filters.value.categories.length > 0 && !filters.value.categories.includes(product.categoryId)) {
      return false;
    }

    if (filters.value.minPrice !== null && product.price < filters.value.minPrice) {
      return false;
    }

    if (filters.value.maxPrice !== null && product.price > filters.value.maxPrice) {
      return false;
    }

    return true;
  });
});

onMounted(() => {
  products.value = JSON.parse(localStorage.getItem('products')) || [];
  categories.value = JSON.parse(localStorage.getItem('categories')) || [];

  if (route.query.category) {
    filters.value.categories = [parseInt(route.query.category)];
  }
});

const clearFilters = () => {
  filters.value = {
    search: '',
    categories: [],
    minPrice: null,
    maxPrice: null
  };
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