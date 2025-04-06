<template>
    <CustomerLayout>
      <h1 class="text-2xl font-bold mb-6">My Profile</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="md:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Personal Information</h2>
            </div>
            <form @submit.prevent="updateProfile" class="p-6 space-y-4">
              <div v-if="message.text" class="p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <div>
                <label for="username" class="form-label">Username</label>
                <input 
                  id="username" 
                  type="text" 
                  v-model="profileData.username" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="email" class="form-label">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="profileData.email" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="address" class="form-label">Address</label>
                <input 
                  id="address" 
                  type="text" 
                  v-model="profileData.address" 
                  class="form-input" 
                />
              </div>
              
              <div>
                <label for="phone" class="form-label">Phone Number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  v-model="profileData.phone" 
                  class="form-input" 
                />
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                {{ isUpdating ? 'Updating...' : 'Update Profile' }}
              </button>
            </form>
          </div>
          
          <!-- Change Password -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Change Password</h2>
            </div>
            <form @submit.prevent="changePassword" class="p-6 space-y-4">
              <div v-if="passwordMessage.text" class="p-4 rounded-md" :class="passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ passwordMessage.text }}
              </div>
              
              <div>
                <label for="currentPassword" class="form-label">Current Password</label>
                <input 
                  id="currentPassword" 
                  type="password" 
                  v-model="passwordData.currentPassword" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="newPassword" class="form-label">New Password</label>
                <input 
                  id="newPassword" 
                  type="password" 
                  v-model="passwordData.newPassword" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <input 
                  id="confirmPassword" 
                  type="password" 
                  v-model="passwordData.confirmPassword" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="isChangingPassword">
                {{ isChangingPassword ? 'Updating...' : 'Change Password' }}
              </button>
            </form>
          </div>
        </div>
        
        <!-- Account Summary -->
        <div>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Account Summary</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <div class="text-sm text-gray-600">Username</div>
                  <div class="font-medium">{{ currentUser.username }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Email</div>
                  <div class="font-medium">{{ currentUser.email }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Account Type</div>
                  <div class="font-medium capitalize">{{ currentUser.role }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Total Orders</div>
                  <div class="font-medium">{{ orderCount }}</div>
                </div>
              </div>
              
              <div class="mt-6 space-y-3">
                <router-link to="/orders" class="btn btn-secondary w-full flex justify-center items-center">
                  <PackageIcon class="h-4 w-4 mr-2" />
                  View Orders
                </router-link>
                <button @click="logout" class="btn btn-danger w-full flex justify-center items-center">
                  <LogOutIcon class="h-4 w-4 mr-2" />
                  Logout
                </button>
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
  import { PackageIcon, LogOutIcon } from 'lucide-vue-next';
  import CustomerLayout from '../../components/customer/CustomerLayout.vue';
  import { updateUserProfile, logoutUser } from '../../utils/auth';
  
  const router = useRouter();
  const currentUser = ref({});
  const orderCount = ref(0);
  const isUpdating = ref(false);
  const isChangingPassword = ref(false);
  
  const message = ref({
    text: '',
    type: 'success'
  });
  
  const passwordMessage = ref({
    text: '',
    type: 'success'
  });
  
  const profileData = ref({
    username: '',
    email: '',
    address: '',
    phone: ''
  });
  
  const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  onMounted(() => {
    // Load user data
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      currentUser.value = user;
      
      // Initialize profile form
      profileData.value = {
        username: user.username || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || ''
      };
      
      // Count user orders
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orderCount.value = orders.filter(order => order.userId === user.id).length;
    } else {
      router.push('/auth/login');
    }
  });
  
  const updateProfile = async () => {
    isUpdating.value = true;
    message.value = { text: '', type: 'success' };
    
    try {
      // Get all users to find the current user's password
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUserFromStorage = users.find(u => u.id === currentUser.value.id);
      
      // Update user profile
      const result = await updateUserProfile({
        ...profileData.value,
        id: currentUser.value.id,
        password: currentUserFromStorage.password,
        role: currentUser.value.role
      });
      
      if (result.success) {
        currentUser.value = result.user;
        message.value = {
          text: 'Profile updated successfully',
          type: 'success'
        };
      } else {
        message.value = {
          text: result.message || 'Failed to update profile',
          type: 'error'
        };
      }
    } catch (err) {
      message.value = {
        text: 'An error occurred. Please try again.',
        type: 'error'
      };
      console.error(err);
    } finally {
      isUpdating.value = false;
    }
  };
  
  const changePassword = async () => {
    isChangingPassword.value = true;
    passwordMessage.value = { text: '', type: 'success' };
    
    try {
      // Validate passwords
      if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        passwordMessage.value = {
          text: 'New passwords do not match',
          type: 'error'
        };
        isChangingPassword.value = false;
        return;
      }
      
      // Get all users to verify current password
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.id === currentUser.value.id);
      
      if (userIndex === -1) {
        passwordMessage.value = {
          text: 'User not found',
          type: 'error'
        };
        isChangingPassword.value = false;
        return;
      }
      
      // Verify current password
      if (users[userIndex].password !== passwordData.value.currentPassword) {
        passwordMessage.value = {
          text: 'Current password is incorrect',
          type: 'error'
        };
        isChangingPassword.value = false;
        return;
      }
      
      // Update password
      users[userIndex].password = passwordData.value.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Reset form
      passwordData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      passwordMessage.value = {
        text: 'Password changed successfully',
        type: 'success'
      };
    } catch (err) {
      passwordMessage.value = {
        text: 'An error occurred. Please try again.',
        type: 'error'
      };
      console.error(err);
    } finally {
      isChangingPassword.value = false;
    }
  };
  
  const logout = () => {
    logoutUser();
    router.push('/auth/login');
  };
  </script>