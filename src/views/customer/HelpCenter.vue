<template>
  <CustomerLayout>
    <h1 class="text-2xl font-bold mb-6">Trung tâm trợ giúp</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Câu hỏi -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Những câu hỏi thường gặp</h2>
          </div>
          <div class="p-6">
            <div v-for="(faq, index) in faqs" :key="index" class="mb-6 last:mb-0">
              <button @click="toggleFaq(index)"
                class="flex justify-between items-center text-left w-full font-medium text-gray-900 focus:outline-none">
                <span>{{ faq.question }}</span>
                <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform duration-200"
                  :class="{ 'transform rotate-180': faq.open }" />
              </button>
              <div v-if="faq.open" class="mt-2 text-gray-600">
                <p>{{ faq.answer }}</p>
              </div>
              <div class="mt-3 border-b"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- From liên hệ -->
      <div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Liên hệ với chúng tôi</h2>
          </div>
          <form @submit.prevent="submitContactForm" class="p-6 space-y-4">
            <div v-if="message.text" class="p-4 rounded-md"
              :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ message.text }}
            </div>

            <div>
              <label for="name" class="form-label">Name</label>
              <input id="name" type="text" v-model="contactForm.name" class="form-input" required />
            </div>

            <div>
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" v-model="contactForm.email" class="form-input" required />
            </div>

            <div>
              <label for="subject" class="form-label">Chủ đề</label>
              <input id="subject" type="text" v-model="contactForm.subject" class="form-input" required />
            </div>

            <div>
              <label for="message" class="form-label">Tín nhắn</label>
              <textarea id="message" v-model="contactForm.message" rows="5" class="form-input" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
              {{ isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
            </button>
          </form>
        </div>

        <!-- Thông tin liên lạc -->
        <div class="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium">Liên hệ qua</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-start">
              <MapPinIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <div class="font-medium">Địa chỉ cụ thể</div>
                <div class="text-gray-600">59 ngõ Mễ Trì, phường Mễ Trì, Quận Nam Từ Liêm</div>
              </div>
            </div>
            <div class="flex items-start">
              <PhoneIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <div class="font-medium">Phone</div>
                <div class="text-gray-600">(+84) 123-456-789</div>
              </div>
            </div>
            <div class="flex items-start">
              <MailIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <div class="font-medium">Email</div>
                <div class="text-gray-600">support@lanhoang.com</div>
              </div>
            </div>
            <div class="flex items-start">
              <ClockIcon class="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <div class="font-medium">Thời gian hoạt động</div>
                <div class="text-gray-600">
                  Thứ Hai-Thứ Sáu: 9am - 6pm<br>
                  Thứ Bẩy: 10am - 4pm<br>
                  Chủ Nhật: Closed
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
    question: "Tôi đặt hàng bằng cách nào?",
    answer: "Xem các sản phẩm của chúng tôi, thêm các mặt hàng vào giỏ hàng của bạn và tiến hành thanh toán. Thực hiện theo các bước để nhập thông tin giao hàng và thanh toán của bạn, sau đó xác nhận đơn hàng.",
    open: true
  },
  {
    question: "Các phương thức thanh toán nào chúng tôi chấp nhận?",
    answer: "Chúng tôi chấp nhận tất cả các thẻ tín dụng lớn, PayPal, MoMo và VnPay.",
    open: false
  },
  {
    question: "Thời gian giao hàng mất bao lâu?",
    answer: "Vận chuyển tiêu chuẩn mất 3-5 ngày làm việc. Vận chuyển nhanh có sẵn để giao hàng trong 1-2 ngày làm việc.",
    open: false
  },
  {
    question: "Tôi có thể hủy đơn hàng của mình không?",
    answer: "Có, bạn có thể hủy đơn hàng của mình miễn là đơn hàng đó chưa được vận chuyển. Truy cập trang chi tiết đơn hàng của bạn để hủy đơn hàng.",
    open: false
  },
  {
    question: "Bạn có cung cấp dịch vụ vận chuyển quốc tế không?",
    answer: "Hiện tại, chúng tôi chỉ giao hàng trong phạm vi Việt Nam.",
    open: false
  },
  {
    question: "Chính sách hoàn trả của bạn là gì?",
    answer: "Chúng tôi chấp nhận trả hàng trong vòng 30 ngày kể từ ngày giao hàng để được hoàn tiền đầy đủ. Các mặt hàng phải chưa mở và còn trong bao bì gốc.",
    open: false
  },
  {
    question: "Tất cả sản phẩm của bạn có phải là hữu cơ không?",
    answer: "Có, tất cả các sản phẩm của chúng tôi đều được chứng nhận hữu cơ và có nguồn gốc từ các trang trại địa phương bất cứ khi nào có thể.",
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
  setTimeout(() => {
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

    message.value = {
      text: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ sớm phản hồi lại bạn.',
      type: 'success'
    };

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