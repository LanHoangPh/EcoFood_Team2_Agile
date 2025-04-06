<template>
  <AdminLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <button @click="openUserModal()" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-1" />
        Add User
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 flex items-center">
          <div class="relative flex-1">
            <input type="text" v-model="filters.search" placeholder="Search users..."
              class="form-input pl-10 pr-4 py-2" />
            <SearchIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select v-model="filters.role" class="form-input ml-4 w-40">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filters.sort" class="form-input w-48">
            <option value="username-asc">Username (A-Z)</option>
            <option value="username-desc">Username (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon class="h-6 w-6 text-gray-500" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                  <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                'bg-purple-100 text-purple-800': user.role === 'admin',
                'bg-green-100 text-green-800': user.role === 'customer'
              }">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.phone || 'N/A' }}</div>
              <div class="text-sm text-gray-500">{{ user.address ? (user.address.substring(0, 20) + '...') :
                'No address' }}

              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ getUserOrderCount(user.id) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openUserModal(user)" class="text-green-600 hover:text-green-900 mr-3">
                Edit
              </button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900"
                :disabled="user.id === currentUser.id"
                :class="{ 'opacity-50 cursor-not-allowed': user.id === currentUser.id }">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredUsers.length === 0" class="p-6 text-center">
        <UserIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <h3 class="text-lg font-medium text-gray-900">No users found</h3>
        <p class="mt-1 text-gray-500">
          Try adjusting your search or filters, or add a new user.
        </p>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showUserModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingUser.id ? 'Edit User' : 'Add User' }}
              </h3>
            </div>
            <form class="space-y-4">
              <div>
                <label for="username" class="form-label">Username</label>
                <input id="username" type="text" v-model="editingUser.username" class="form-input" required />
              </div>

              <div>
                <label for="email" class="form-label">Email</label>
                <input id="email" type="email" v-model="editingUser.email" class="form-input" required />
              </div>

              <div>
                <label for="role" class="form-label">Role</label>
                <select id="role" v-model="editingUser.role" class="form-input" required>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div>
                <label for="password" class="form-label">
                  {{ editingUser.id ? 'Password (leave blank to keep current)' : 'Password' }}
                </label>
                <input id="password" type="password" v-model="editingUser.password" class="form-input"
                  :required="!editingUser.id" />
              </div>

              <div>
                <label for="phone" class="form-label">Phone</label>
                <input id="phone" type="tel" v-model="editingUser.phone" class="form-input" />
              </div>

              <div>
                <label for="address" class="form-label">Address</label>
                <input id="address" type="text" v-model="editingUser.address" class="form-input" />
              </div>
            </form>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="saveUser" class="btn btn-primary sm:ml-3">
              {{ editingUser.id ? 'Update' : 'Add' }} User
            </button>
            <button type="button" @click="showUserModal = false" class="btn btn-secondary mt-3 sm:mt-0">
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
import { PlusIcon, SearchIcon, UserIcon } from 'lucide-vue-next';
import AdminLayout from '../../components/admin/AdminLayout.vue';
import { generateId } from '../../utils/mockData';

const users = ref([]);
const orders = ref([]);
const showUserModal = ref(false);
const currentUser = ref({});

const filters = ref({
  search: '',
  role: '',
  sort: 'username-asc'
});

const editingUser = ref({
  id: null,
  username: '',
  email: '',
  password: '',
  role: 'customer',
  phone: '',
  address: ''
});

onMounted(() => {
  // Load users and orders
  users.value = JSON.parse(localStorage.getItem('users')) || [];
  orders.value = JSON.parse(localStorage.getItem('orders')) || [];
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {};
});

const filteredUsers = computed(() => {
  let result = [...users.value];

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(user =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Apply role filter
  if (filters.value.role) {
    result = result.filter(user => user.role === filters.value.role);
  }

  // Apply sorting
  const [sortField, sortDirection] = filters.value.sort.split('-');
  result.sort((a, b) => {
    let comparison = 0;

    if (sortField === 'username') {
      comparison = a.username.localeCompare(b.username);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return result;
});

const getUserOrderCount = (userId) => {
  return orders.value.filter(order => order.userId === userId).length;
};

const openUserModal = (user = null) => {
  if (user) {
    // Edit existing user (without password)
    editingUser.value = { ...user, password: '' };
  } else {
    // Add new user
    editingUser.value = {
      id: null,
      username: '',
      email: '',
      password: '',
      role: 'customer',
      phone: '',
      address: ''
    };
  }

  showUserModal.value = true;
};

const saveUser = () => {
  // Validate form
  if (!editingUser.value.username || !editingUser.value.email ||
    (!editingUser.value.id && !editingUser.value.password)) {
    alert('Please fill out all required fields');
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem('users')) || [];

  if (editingUser.value.id) {
    // Update existing user
    const index = allUsers.findIndex(u => u.id === editingUser.value.id);
    if (index !== -1) {
      // If password is empty, keep the existing password
      if (!editingUser.value.password) {
        editingUser.value.password = allUsers[index].password;
      }

      allUsers[index] = { ...editingUser.value };

      // If updating current user, update currentUser in localStorage
      if (editingUser.value.id === currentUser.value.id) {
        const updatedCurrentUser = { ...editingUser.value };
        delete updatedCurrentUser.password;
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      }
    }
  } else {
    // Add new user
    const newUser = {
      ...editingUser.value,
      id: generateId('users')
    };
    allUsers.push(newUser);
  }

  // Save to localStorage and update local state
  localStorage.setItem('users', JSON.stringify(allUsers));
  users.value = allUsers;

  // Close modal
  showUserModal.value = false;
};

const deleteUser = (userId) => {
  // Prevent deleting current user
  if (userId === currentUser.value.id) {
    alert('You cannot delete your own account');
    return;
  }

  if (!confirm('Are you sure you want to delete this user? This will not delete their orders.')) return;

  const allUsers = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = allUsers.filter(u => u.id !== userId);

  // Save to localStorage and update local state
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  users.value = updatedUsers;
};
</script>