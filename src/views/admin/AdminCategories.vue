<template>
  <AdminLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Danh mục đồ ăn</h1>
      <button @click="openCategoryModal()" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-1" />
        Thêm danh mục
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="category in categories" :key="category.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="text-center mb-4">
          <div class="text-5xl mb-3">{{ category.icon }}</div>
          <h3 class="text-xl font-medium">{{ category.name }}</h3>
        </div>

        <div class="flex items-center justify-center mt-6 space-x-2">
          <button @click="openCategoryModal(category)" class="text-green-600 hover:text-green-800 flex items-center">
            <PencilIcon class="h-4 w-4 mr-1" />
            Edit
          </button>
          <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800 flex items-center">
            <TrashIcon class="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      <div v-if="categories.length === 0" class="col-span-full bg-white rounded-lg shadow p-12 text-center">
        <TagsIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Không tìm thấy danh mục</h3>
        <p class="mt-1 text-gray-500 mb-6">
          Bắt đầu viccj tạo mới danh mục
        </p>
        <button @click="openCategoryModal()" class="btn btn-primary">
          Thêm danh mục
        </button>
      </div>
    </div>
    <div v-if="showCategoryModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showCategoryModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingCategory.id ? 'Edit Category' : 'Add Category' }}
              </h3>
            </div>
            <form class="space-y-4">
              <div>
                <label for="name" class="form-label">Name</label>
                <input id="name" type="text" v-model="editingCategory.name" class="form-input" required />
              </div>
              <div>
                <label for="icon" class="form-label">Icon (Emoji)</label>
                <input id="icon" type="text" v-model="editingCategory.icon" class="form-input" required />
              </div>

              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-2">Biểu tượng cảm xúc có sẵn:</p>
                <div class="grid grid-cols-8 gap-2">
                  <button v-for="(emoji, index) in availableEmojis" :key="index" type="button"
                    @click="editingCategory.icon = emoji" class="text-2xl p-2 rounded hover:bg-gray-100">
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="saveCategory" class="btn btn-primary sm:ml-3">
              {{ editingCategory.id ? 'Update' : 'Add' }} Category
            </button>
            <button type="button" @click="showCategoryModal = false" class="btn btn-secondary mt-3 sm:mt-0">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusIcon, PencilIcon, TrashIcon, TagsIcon } from 'lucide-vue-next';
import AdminLayout from '../../components/admin/AdminLayout.vue';
import { generateId } from '../../utils/mockData';

const categories = ref([]);
const showCategoryModal = ref(false);

const editingCategory = ref({
  id: null,
  name: '',
  icon: '🍎'
});

const availableEmojis = [
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
  '🍒', '🍑', '🍍', '🥝', '🥑', '🍅', '🍆', '🥕',
  '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🥔',
  '🍞', '🥐', '🥖', '🥨', '🥯', '🧀', '🥚', '🥩',
  '🍗', '🍖', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮',
  '🌯', '🥙', '🍝', '🥘', '🥫', '🍜', '🍲', '🍛'
];

onMounted(() => {
  categories.value = JSON.parse(localStorage.getItem('categories')) || [];
});

const openCategoryModal = (category = null) => {
  if (category) {
    editingCategory.value = { ...category };
  } else {
    editingCategory.value = {
      id: null,
      name: '',
      icon: '🍎'
    };
  }

  showCategoryModal.value = true;
};

const saveCategory = () => {
  if (!editingCategory.value.name || !editingCategory.value.icon) {
    alert('Vui lòng điền vào tất cả các trường bắt buộc');
    return;
  }

  const allCategories = JSON.parse(localStorage.getItem('categories')) || [];

  if (editingCategory.value.id) {
    const index = allCategories.findIndex(c => c.id === editingCategory.value.id);
    if (index !== -1) {
      allCategories[index] = { ...editingCategory.value };
    }
  } else {
    const newCategory = {
      ...editingCategory.value,
      id: generateId('categories')
    };
    allCategories.push(newCategory);
  }
  localStorage.setItem('categories', JSON.stringify(allCategories));
  categories.value = allCategories;

  showCategoryModal.value = false;
};

const deleteCategory = (categoryId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa danh mục này không? Thao tác này sẽ không xóa các sản phẩm liên quan tới danh mục.')) return;

  const allCategories = JSON.parse(localStorage.getItem('categories')) || [];
  const updatedCategories = allCategories.filter(c => c.id !== categoryId)

  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  categories.value = updatedCategories;
};
</script>