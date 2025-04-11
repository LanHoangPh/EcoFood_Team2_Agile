<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Đăng nhập vào tài khoản của bạn
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Hoặc
        <router-link to="/auth/register" class="font-medium text-green-600 hover:text-green-500">
          Tạo tài khoản mới
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            {{ error }}
          </div>

          <div>
            <label for="email" class="form-label">Email</label>
            <input id="email" name="email" type="email" v-model="form.email" required class="form-input" />
          </div>

          <div>
            <label for="password" class="form-label">Password</label>
            <input id="password" name="password" type="password" v-model="form.password" required class="form-input" />
          </div>

          <div>
            <button type="submit" class="w-full btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../../utils/auth';

const router = useRouter();
const isLoading = ref(false);
const error = ref('');
const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const result = await loginUser(form.value);

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      error.value = result.message;
    }
  } catch (err) {
    error.value = 'Đã xảy ra lỗi. Vui lòng thử lại.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>