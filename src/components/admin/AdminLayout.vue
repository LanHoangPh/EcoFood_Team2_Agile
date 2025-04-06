<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar />
        <div class="flex">
            <div class="hidden md:flex md:w-64 md:flex-col fixed h-screen bg-white shadow">
                <div class="flex-1 flex flex-col overflow-y-auto">
                    <nav class="flex-1 px-2 py-4 space-y-1">
                        <router-link v-for="item in navItems" :key="item.to" :to="item.to"
                            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md" :class="[
                                isActivePath(item.to)
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-green-50 hover:text-green-900'
                            ]">
                            <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6" :class="[
                                isActivePath(item.to)
                                    ? 'text-white'
                                    : 'text-gray-400 group-hover:text-green-600'
                            ]" />
                            {{ item.name }}
                        </router-link>
                    </nav>
                </div>
            </div>

            <div class="md:pl-64 flex flex-col flex-1">
                <main class="flex-1 p-6">
                    <slot></slot>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboardIcon, PackageIcon, TagsIcon, ShoppingCartIcon, UsersIcon, BarChart4Icon } from 'lucide-vue-next';
import Navbar from '../shared/Navbar.vue';

const route = useRoute();

const navItems = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboardIcon },
    { name: 'Products', to: '/admin/products', icon: PackageIcon },
    { name: 'Categories', to: '/admin/categories', icon: TagsIcon },
    { name: 'Orders', to: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Users', to: '/admin/users', icon: UsersIcon },
    { name: 'Reports', to: '/admin/reports', icon: BarChart4Icon }
];

const isActivePath = (path) => {
    return route.path === path || route.path.startsWith(`${path}/`);
};
</script>