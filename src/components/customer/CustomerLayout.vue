<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot></slot>
    </main>
    <footer class="bg-green-600 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">🥗 EcoFood</h3>
            <p class="text-green-100">
              Cung cấp thực phẩm tươi, hữu cơ trực tiếp đến tận nhà bạn
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-green-100 hover:text-white">Home</router-link></li>
              <li><router-link to="/products" class="text-green-100 hover:text-white">Products</router-link></li>
              <li><router-link to="/help" class="text-green-100 hover:text-white">Help Center</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Liên hệ:</h3>
            <p class="text-green-100">Email: lanlhph50918@gmail.com</p>
            <p class="text-green-100">Phone: (+84) 123-456-789</p>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-green-500 text-center text-green-100">
          <p>&copy; {{ new Date().getFullYear() }} EcoFood. Bản quyền thuộc về Lân Hoàng.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../shared/Navbar.vue';
</script>