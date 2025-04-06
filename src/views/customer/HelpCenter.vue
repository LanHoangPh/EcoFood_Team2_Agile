<template>
    <CustomerLayout>
      <h1 class="text-2xl font-bold mb-6">Help Center</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- FAQ Section -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Frequently Asked Questions</h2>
            </div>
            <div class="p-6">
              <div v-for="(faq, index) in faqs" :key="index" class="mb-6 last:mb-0">
                <button 
                  @click="toggleFaq(index)"
                  class="flex justify-between items-center text-left w-full font-medium text-gray-900 focus:outline-none"
                >
                  <span>{{ faq.question }}</span>
                  <ChevronDownIcon 
                    class="h-5 w-5 text-gray-500 transition-transform duration-200"
                    :class="{ 'transform rotate-180': faq.open }"
                  />
                </button>
                <div v-if="faq.open" class="mt-2 text-gray-600">
                  <p>{{ faq.answer }}</p>
                </div>
                <div class="mt-3 border-b"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Form -->
        <div>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Contact Us</h2>
            </div>
            <form @submit.prevent="submitContactForm" class="p-6 space-y-4">
              <div v-if="message.text" class="p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <div>
                <label for="name" class="form-label">Name</label>
                <input 
                  id="name" 
                  type="text" 
                  v-model="contactForm.name" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="email" class="form-label">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="contactForm.email" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="subject" class="form-label">Subject</label>
                <input 
                  id="subject" 
                  type="text" 
                  v-model="contactForm.subject" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div>
                <label for="message" class="form-label">Message</label>
                <textarea 
                  id="message" 
                  v-model="contactForm.message" 
                  rows="5" 
                  class="form-input" 
                  required 
                ></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
          
          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium">Get in Touch</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start">
                <MapPinIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <div class="font-medium">Address</div>
                  <div class="text-gray-600">123 Eco Street, Green City, EC 12345</div>
                </div>
              </div>
              <div class="flex items-start">
                <PhoneIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <div class="font-medium">Phone</div>
                  <div class="text-gray-600">(555) 123-4567</div>
                </div>
              </div>
              <div class="flex items-start">
                <MailIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <div class="font-medium">Email</div>
                  <div class="text-gray-600">support@ecofood.com</div>
                </div>
              </div>
              <div class="flex items-start">
                <ClockIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <div class="font-medium">Hours</div>
                  <div class="text-gray-600">
                    Monday-Friday: 9am - 6pm<br>
                    Saturday: 10am - 4pm<br>
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ChevronDownIcon, MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-vue-next';
  import { generateId } from '../../utils/mockData';
  import CustomerLayout from '../../components/customer/CustomerLayout.vue';
  
  const faqs = ref([
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. Follow the steps to enter your shipping and payment information, then confirm your order.',
      open: true
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
      open: false
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.',
      open: false
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order as long as it has not been shipped yet. Visit your order details page to cancel an order.',
      open: false
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within the United States.',
      open: false
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery for a full refund. Items must be unopened and in their original packaging.',
      open: false
    },
    {
      question: 'Are all your products organic?',
      answer: 'Yes, all our products are certified organic and sourced from local farms whenever possible.',
      open: false
    }
  ]);
  
  const contactForm = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const isSubmitting = ref(false);
  const message = ref({
    text: '',
    type: 'success'
  });
  
  const toggleFaq = (index) => {
    faqs.value[index].open = !faqs.value[index].open;
  };
  
  const submitContactForm = () => {
    isSubmitting.value = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const supportMessages = JSON.parse(localStorage.getItem('supportMessages')) || [];
      
      supportMessages.push({
        id: generateId('supportMessages'),
        userId: currentUser?.id,
        ...contactForm.value,
        status: 'Pending',
        date: new Date().toISOString()
      });
      
      localStorage.setItem('supportMessages', JSON.stringify(supportMessages));
      
      // Show success message
      message.value = {
        text: 'Your message has been sent successfully. We will get back to you soon.',
        type: 'success'
      };
      
      // Reset form
      contactForm.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      isSubmitting.value = false;
    }, 1000);
  };
  </script>