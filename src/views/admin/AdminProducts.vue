<template>
  <AdminLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button @click="openProductModal()" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-1" />
        Add Product
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 flex items-center">
          <div class="relative flex-1">
            <input type="text" v-model="filters.search" placeholder="Search products..."
              class="form-input pl-10 pr-4 py-2" />
            <SearchIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select v-model="filters.category" class="form-input ml-4 w-40">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filters.sort" class="form-input w-48">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img class="h-10 w-10 rounded-full object-cover" :src="product.image" :alt="product.name" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ getCategoryName(product.categoryId) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${{ product.price.toFixed(2) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm" :class="{
                'text-red-600': product.stock < 10,
                'text-yellow-600': product.stock >= 10 && product.stock < 20,
                'text-green-600': product.stock >= 20
              }">
                {{ product.stock }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex">
                  <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-4 w-4 text-yellow-400" />
                  <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-4 w-4 text-yellow-400" />
                  <StarIcon v-for="i in (5 - Math.ceil(product.rating))" :key="`empty-${i}`"
                    class="h-4 w-4 text-gray-300" />
                </div>
                <span class="ml-1 text-sm text-gray-500">({{ product.reviews.length }})</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openProductModal(product)" class="text-green-600 hover:text-green-900 mr-3">
                Edit
              </button>
              <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="p-6 text-center">
        <PackageIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <h3 class="text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-gray-500">
          Try adjusting your search or filters, or add a new product.
        </p>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showProductModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingProduct.id ? 'Edit Product' : 'Add Product' }}
              </h3>
            </div>
            <form class="space-y-4">
              <div>
                <label for="name" class="form-label">Name</label>
                <input id="name" type="text" v-model="editingProduct.name" class="form-input" required />
              </div>

              <div>
                <label for="category" class="form-label">Category</label>
                <select id="category" v-model="editingProduct.categoryId" class="form-input" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="price" class="form-label">Price</label>
                <input id="price" type="number" v-model="editingProduct.price" step="0.01" min="0" class="form-input"
                  required />
              </div>

              <div>
                <label for="stock" class="form-label">Stock</label>
                <input id="stock" type="number" v-model="editingProduct.stock" min="0" class="form-input" required />
              </div>

              <div>
                <label for="image" class="form-label">Image URL</label>
                <input id="image" type="text" v-model="editingProduct.image" class="form-input" required />
              </div>

              <div>
                <label for="description" class="form-label">Description</label>
                <textarea id="description" v-model="editingProduct.description" rows="3" class="form-input"
                  required></textarea>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="saveProduct" class="btn btn-primary sm:ml-3">
              {{ editingProduct.id ? 'Update' : 'Add' }} Product
            </button>
            <button type="button" @click="showProductModal = false" class="btn btn-secondary mt-3 sm:mt-0">
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
import { PlusIcon, SearchIcon, StarIcon, StarHalfIcon, PackageIcon } from 'lucide-vue-next';
import AdminLayout from '../../components/admin/AdminLayout.vue';
import { generateId } from '../../utils/mockData';

const products = ref([]);
const categories = ref([]);
const showProductModal = ref(false);

const filters = ref({
  search: '',
  category: '',
  sort: 'name-asc'
});

const editingProduct = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  image: '',
  categoryId: 1,
  rating: 0,
  reviews: [],
  stock: 0
});

onMounted(() => {
  // Load products and categories
  products.value = JSON.parse(localStorage.getItem('products')) || [];
  categories.value = JSON.parse(localStorage.getItem('categories')) || [];
});

const filteredProducts = computed(() => {
  let result = [...products.value];

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Apply category filter
  if (filters.value.category) {
    result = result.filter(p => p.categoryId === parseInt(filters.value.category));
  }

  // Apply sorting
  const [sortField, sortDirection] = filters.value.sort.split('-');
  result.sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'price') {
      comparison = a.price - b.price;
    } else if (sortField === 'stock') {
      comparison = a.stock - b.stock;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return result;
});

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const openProductModal = (product = null) => {
  if (product) {
    // Edit existing product
    editingProduct.value = { ...product };
  } else {
    // Add new product
    editingProduct.value = {
      id: null,
      name: '',
      description: '',
      price: 0,
      image: 'https://source.unsplash.com/random/800x600/?food',
      categoryId: categories.value.length > 0 ? categories.value[0].id : 1,
      rating: 0,
      reviews: [],
      stock: 0
    };
  }

  showProductModal.value = true;
};

const saveProduct = () => {
  // Validate form
  if (!editingProduct.value.name || !editingProduct.value.description ||
    !editingProduct.value.image || editingProduct.value.price <= 0) {
    alert('Please fill out all required fields');
    return;
  }

  const allProducts = JSON.parse(localStorage.getItem('products')) || [];

  if (editingProduct.value.id) {
    // Update existing product
    const index = allProducts.findIndex(p => p.id === editingProduct.value.id);
    if (index !== -1) {
      allProducts[index] = { ...editingProduct.value };
    }
  } else {
    // Add new product
    const newProduct = {
      ...editingProduct.value,
      id: generateId('products')
    };
    allProducts.push(newProduct);
  }

  // Save to localStorage and update local state
  localStorage.setItem('products', JSON.stringify(allProducts));
  products.value = allProducts;

  // Close modal
  showProductModal.value = false;
};

const deleteProduct = (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) return;

  const allProducts = JSON.parse(localStorage.getItem('products')) || [];
  const updatedProducts = allProducts.filter(p => p.id !== productId);

  // Save to localStorage and update local state
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  products.value = updatedProducts;
};
</script>