<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Tạo tài khoản mới
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Hoặc
        <router-link to="/auth/login" class="font-medium text-green-600 hover:text-green-500">
          Đăng nhập vào tài khoản đã có của bạn
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            {{ error }}
          </div>

          <div>
            <label for="username" class="form-label">Username</label>
            <input id="username" name="username" type="text" v-model="form.username" required class="form-input" />
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
            <label for="role" class="form-label">Role</label>
            <select id="role" name="role" v-model="form.role" required class="form-input">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <button type="submit" class="w-full btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Creating account...' : 'Create account' }}
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
import { registerUser, loginUser } from '../../utils/auth';

const router = useRouter();
const isLoading = ref(false);
const error = ref('');
const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'customer'
});

const handleRegister = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const result = await registerUser(form.value);

    if (result.success) {
      const loginResult = await loginUser({
        email: form.value.email,
        password: form.value.password
      });

      if (loginResult.success) {
        if (loginResult.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    } else {
      error.value = result.message;
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>