<template>
    <CustomerLayout>
      <div v-if="product" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <!-- Product Image -->
          <div>
            <img :src="product.image" :alt="product.name" class="w-full h-80 object-cover rounded-lg" />
          </div>
          
          <!-- Product Info -->
          <div class="flex flex-col">
            <h1 class="text-3xl font-bold">{{ product.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center mt-2">
              <div class="flex">
                <StarIcon v-for="i in Math.floor(product.rating)" :key="i" class="h-5 w-5 text-yellow-400" />
                <StarHalfIcon v-if="product.rating % 1 >= 0.5" class="h-5 w-5 text-yellow-400" />
                <StarIcon 
                  v-for="i in (5 - Math.ceil(product.rating))" 
                  :key="`empty-${i}`" 
                  class="h-5 w-5 text-gray-300" 
                />
              </div>
              <span class="ml-2 text-sm text-gray-600">
                {{ product.rating.toFixed(1) }} ({{ product.reviews.length }} reviews)
              </span>
            </div>
            
            <!-- Category -->
            <div class="mt-2 text-sm text-gray-600">
              Category: {{ getCategoryName(product.categoryId) }}
            </div>
            
            <!-- Price -->
            <div class="mt-4 text-2xl font-bold text-green-600">
              ${{ product.price.toFixed(2) }}
            </div>
            
            <!-- Stock -->
            <div class="mt-1 text-sm">
              <span v-if="product.stock > 10" class="text-green-600">In Stock ({{ product.stock }} available)</span>
              <span v-else-if="product.stock > 0" class="text-yellow-600">Only {{ product.stock }} left in stock!</span>
              <span v-else class="text-red-600">Out of Stock</span>
            </div>
            
            <!-- Description -->
            <p class="mt-4 text-gray-700">{{ product.description }}</p>
            
            <!-- Quantity Selector -->
            <div class="mt-6 flex items-center">
              <label for="quantity" class="mr-4 text-sm font-medium">Quantity:</label>
              <div class="flex items-center border border-gray-300 rounded-md">
                <button 
                  @click="quantity > 1 ? quantity-- : null" 
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  :disabled="quantity <= 1"
                >
                  -
                </button>
                <input 
                  id="quantity" 
                  v-model.number="quantity" 
                  type="number" 
                  min="1" 
                  :max="product.stock" 
                  class="w-12 text-center border-none focus:ring-0"
                />
                <button 
                  @click="quantity < product.stock ? quantity++ : null" 
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  :disabled="quantity >= product.stock"
                >
                  +
                </button>
              </div>
            </div>
            
            <!-- Add to Cart Button -->
            <button 
              @click="addToCart" 
              class="mt-6 btn btn-primary"
              :disabled="product.stock === 0"
            >
              <ShoppingCartIcon class="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
        
        <!-- Tabs Section -->
        <div class="border-t mt-8">
          <div class="flex border-b">
            <button 
              @click="activeTab = 'description'" 
              class="px-4 py-3 font-medium text-sm"
              :class="activeTab === 'description' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-green-600'"
            >
              Description
            </button>
            <button 
              @click="activeTab = 'reviews'" 
              class="px-4 py-3 font-medium text-sm"
              :class="activeTab === 'reviews' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-green-600'"
            >
              Reviews ({{ product.reviews.length }})
            </button>
          </div>
          
          <!-- Tab Content -->
          <div class="p-6">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'">
              <p class="text-gray-700">{{ product.description }}</p>
            </div>
            
            <!-- Reviews Tab -->
            <div v-if="activeTab === 'reviews'">
              <!-- Review Form -->
              <div v-if="isLoggedIn" class="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 class="text-lg font-medium mb-4">Write a Review</h3>
                <div class="mb-4">
                  <label class="form-label">Rating</label>
                  <div class="flex">
                    <button 
                      v-for="star in 5" 
                      :key="star"
                      @click="newReview.rating = star"
                      class="focus:outline-none"
                    >
                      <StarIcon 
                        class="h-6 w-6" 
                        :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'" 
                      />
                    </button>
                  </div>
                </div>
                <div class="mb-4">
                  <label for="review-comment" class="form-label">Comment</label>
                  <textarea 
                    id="review-comment" 
                    v-model="newReview.comment" 
                    rows="3" 
                    class="form-input"
                    placeholder="Write your review here..."
                  ></textarea>
                </div>
                <button @click="submitReview" class="btn btn-primary">Submit Review</button>
              </div>
              
              <!-- Reviews List -->
              <div v-if="product.reviews.length > 0" class="space-y-4">
                <div 
                  v-for="(review, index) in product.reviews" 
                  :key="index" 
                  class="border-b pb-4 last:border-b-0"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="flex items-center">
                        <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
                        <span class="font-medium">{{ review.username }}</span>
                      </div>
                      <div class="flex mt-1">
                        <StarIcon 
                          v-for="star in 5" 
                          :key="star"
                          class="h-4 w-4" 
                          :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'" 
                        />
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">
                      {{ new Date(review.date).toLocaleDateString() }}
                    </span>
                  </div>
                  <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                  
                  <!-- Delete Button (if user's own review) -->
                  <button 
                    v-if="review.userId === currentUser?.id" 
                    @click="deleteReview(index)" 
                    class="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Delete review
                  </button>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else class="text-center py-8">
                <MessageCircleIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-else class="flex justify-center items-center h-64">
        <LoaderIcon class="h-8 w-8 text-green-600 animate-spin" />
        <span class="ml-2">Loading product...</span>
      </div>
    </CustomerLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { 
    StarIcon, StarHalfIcon, ShoppingCartIcon, UserIcon, 
    MessageCircleIcon, LoaderIcon 
  } from 'lucide-vue-next';
  import CustomerLayout from '../../components/customer/CustomerLayout.vue';
  
  const route = useRoute();
  const router = useRouter();
  const product = ref(null);
  const categories = ref([]);
  const quantity = ref(1);
  const activeTab = ref('description');
  const newReview = ref({
    rating: 5,
    comment: ''
  });
  
  const currentUser = computed(() => {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  });
  
  const isLoggedIn = computed(() => {
    return !!currentUser.value;
  });
  
  onMounted(() => {
    // Load product by ID
    const productId = parseInt(route.params.id);
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      product.value = foundProduct;
    } else {
      router.push('/products');
    }
    
    // Load categories
    categories.value = JSON.parse(localStorage.getItem('categories')) || [];
  });
  
  const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === product.value.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += quantity.value;
    } else {
      // Add new item to cart
      cart.push({
        productId: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.image,
        quantity: quantity.value
      });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger storage event for navbar to update cart count
    window.dispatchEvent(new Event('storage'));
    
    // Navigate to cart
    router.push('/cart');
  };
  
  const submitReview = () => {
    if (!isLoggedIn.value) {
      alert('You must be logged in to submit a review');
      return;
    }
    
    if (newReview.value.rating === 0 || !newReview.value.comment.trim()) {
      alert('Please provide both a rating and comment');
      return;
    }
    
    // Add review to product
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === product.value.id);
    
    if (productIndex !== -1) {
      const review = {
        userId: currentUser.value.id,
        username: currentUser.value.username,
        rating: newReview.value.rating,
        comment: newReview.value.comment,
        date: new Date().toISOString()
      };
      
      products[productIndex].reviews.push(review);
      
      // Recalculate average rating
      const ratings = products[productIndex].reviews.map(r => r.rating);
      const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      products[productIndex].rating = averageRating;
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(products));
      
      // Update current product
      product.value = products[productIndex];
      
      // Reset form
      newReview.value = {
        rating: 5,
        comment: ''
      };
    }
  };
  
  const deleteReview = (index) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === product.value.id);
    
    if (productIndex !== -1) {
      // Remove the review
      products[productIndex].reviews.splice(index, 1);
      
      // Recalculate average rating
      const ratings = products[productIndex].reviews.map(r => r.rating);
      let averageRating = 0;
      if (ratings.length > 0) {
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      }
      products[productIndex].rating = averageRating;
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(products));
      
      // Update current product
      product.value = products[productIndex];
    }
  };
  </script>