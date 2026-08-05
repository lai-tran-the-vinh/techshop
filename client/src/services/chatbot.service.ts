import type { ChatbotInterface } from '@/interfaces/chatbot.interface';
import axiosInstance from '@/configs/axios.config';

class ChatbotServices {
    static sendMessage(data: ChatbotInterface) {
        return axiosInstance.post(`/chat`, data);
    }

}

export default ChatbotServices;
