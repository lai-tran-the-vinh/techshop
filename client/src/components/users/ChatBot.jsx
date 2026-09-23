import React, { useState, useRef, useEffect } from 'react';
import SpeechToTextButton from './SpeechToTextButton';
import { Send, X, RefreshCw, Loader, Maximize2, Minimize2 } from 'lucide-react';
import axiosInstance, { callFreshToken } from '@/services/apis';
import { Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useAppContext } from '@/contexts';

const Chatbot = () => {
  const { user } = useAppContext();
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const wasRecordingRef = useRef(false);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const quickReplies = [
    'Cho tôi điện thoại giá rẻ',
    'Máy bị lỗi màn hình xanh',
    'Chính sách bảo hành',
    'Shop bán những hãng nào?',
  ];

  // --- Lưu và load lịch sử chat ---
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem('chat_history');
      if (savedChat) {
        setChatHistory(JSON.parse(savedChat));
      } else {
        const initialChat = [
          {
            sender: 'bot',
            text: `Chào bạn, mình là trợ lý AI của TechShop!`,
            quickReplies,
          },
        ];
        setChatHistory(initialChat);
        localStorage.setItem('chat_history', JSON.stringify(initialChat));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (wasRecordingRef.current && !isRecording) {
      inputRef.current?.focus();
    }
    wasRecordingRef.current = isRecording;
  }, [isRecording]);

  // --- Kiểm tra và refresh token nếu cần ---
  const ensureValidToken = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Nếu token còn hạn > 2 phút thì dùng luôn
      if (decoded.exp - currentTime > 120) {
        return token;
      }

      // Nếu sắp hết hạn hoặc đã hết hạn -> Refresh
      const res = await callFreshToken();
      const newToken = res.data?.data?.access_token;

      if (newToken) {
        localStorage.setItem('access_token', newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        return newToken;
      }

      return null; // Refresh thất bại
    } catch (error) {
      console.error('Chatbot: Lỗi kiểm tra token:', error);
      return null;
    }
  };

  // --- Gửi tin nhắn hoặc payload đến Rasa ---
  const handleSend = async (textToSend = null, isPayload = false) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;
    if (!isPayload) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'user', text: messageText },
        { sender: 'bot', loading: true },
      ]);
    } else {
      setChatHistory((prev) => [...prev, { sender: 'bot', loading: true }]);
    }

    setInput('');
    setLoading(true);

    try {
      // Kiểm tra token trước khi gửi
      const validToken = await ensureValidToken();

      // Nếu user đang đăng nhập mà không lấy được token hợp lệ -> Báo lỗi session
      if (user && !validToken) {
        setChatHistory((prev) => [
          ...prev.slice(0, -1), // Xóa loading
          {
            sender: 'bot',
            text: '⚠️ Phiên đăng nhập đã hết hạn. Vui lòng <a href="/login" style="color: #d32f2f; font-weight: bold; text-decoration: underline;">đăng nhập lại</a> để tiếp tục.',
          },
        ]);
        setLoading(false);
        return;
      }

      const payload = {
        sender: user?._id || 'guest_user',
        message: messageText, // có thể là text hoặc payload "/order"
        metadata: {
          accessToken: validToken, // ✅ Gửi token đã được làm mới
        },
      };

      const response = await axiosInstance.post(
        import.meta.env.VITE_RASA_URL,
        payload,
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const rasaResponses = response.data;
        const newMessages = rasaResponses.map((res) => ({
          sender: 'bot',
          text:
            res.text ||
            res.custom ||
            'Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn.',
          buttons: res.buttons || [],
        }));

        setChatHistory((prev) => [
          ...prev.slice(0, -1), // xóa trạng thái "Đang trả lời..."
          ...newMessages,
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin:', error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        {
          sender: 'bot',
          text: 'Xin lỗi, hiện không thể kết nối với máy chủ. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setLoading(false);
      // Auto-focus vào input sau khi gửi tin
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  const handleQuickReply = (text) => {
    handleSend(text);
  };

  // --- Khi bấm nút từ bot (dùng payload thật) ---
  const handleButtonPress = (title, payload) => {
    setChatHistory((prev) => [...prev, { sender: 'user', text: title }]);
    handleSend(payload, true); // gửi payload, không gửi title
  };

  const handleTranscript = (text) => {
    setInput(text);
    handleSend(text);
  };

  const handleListeningChange = (isListening) => {
    setIsRecording(isListening);
  };

  const handleClearChat = async () => {
    try {
      localStorage.removeItem('chat_history');
      const initialChat = [
        {
          sender: 'bot',
          text: `Chào bạn, mình là trợ lý AI của TechShop!`,
          quickReplies,
        },
      ];
      setChatHistory(initialChat);

      await axiosInstance.post(import.meta.env.VITE_RASA_URL, {
        message: '/restart_slot',
        sender: user?._id || 'guest_user',
      });

      localStorage.setItem('chat_history', JSON.stringify(initialChat));
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const toggleChat = () => {
    setVisible(!visible);
    setIsFullScreen(false);
  };
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  return (
    <>
      {visible && (
        <div
          className={`fixed z-[1000] bg-white flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${
            isFullScreen
              ? 'top-[80px] left-0 right-0 bottom-0 w-full rounded-none border-t border-gray-300'
              : 'bottom-20 right-4 md:right-6 w-[calc(100vw-32px)] md:w-[550px] h-[75vh] md:h-[650px] rounded-2xl'
          }`}
        >
          <div
            className={`bg-gradient-primary-to-secondary px-6 py-6 ${
              isFullScreen ? '' : 'rounded-t-2xl'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <Typography.Title level={3} className="text-white! m-0!">
                  TechShop AI
                </Typography.Title>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition"
                  title={isFullScreen ? 'Thu nhỏ' : 'Phóng to'}
                >
                  {isFullScreen ? (
                    <Minimize2 size={19} className="text-white" />
                  ) : (
                    <Maximize2 size={19} className="text-white" />
                  )}
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition"
                  title="Làm mới đoạn chat"
                >
                  <RefreshCw size={19} className="text-white" />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition"
                  title="Đóng"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto p-[15px] space-y-4 bg-white"
          >
            {chatHistory.map((msg, index) => (
              <div key={index}>
                {msg.sender === 'bot' ? (
                  <div className="flex justify-start mb-8">
                    <div className="max-w-[450px] bg-white text-gray-800 p-7 rounded-xl border border-gray-200 shadow-sm">
                      {msg.loading ? (
                        <div className="flex items-center gap-2">
                          <Loader
                            size={16}
                            className="animate-spin text-gray-500"
                          />
                          <span className="text-sm text-gray-500">
                            Đang trả lời...
                          </span>
                        </div>
                      ) : (
                        <div
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end mb-4">
                    <div className="max-w-xs bg-primary text-white p-7 rounded-xl shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}

                {/* --- Các nút từ bot --- */}
                {msg.sender === 'bot' && msg.buttons?.length > 0 && (
                  <div className="flex flex-wrap gap-4 justify-start mt-2 mb-4">
                    {msg.buttons.map((button, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleButtonPress(button.title, button.payload)
                        }
                        disabled={loading}
                        className="text-sm bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 text-blue-800 px-4 py-2 rounded-full transition border border-blue-300"
                      >
                        {button.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* --- Gợi ý nhanh ban đầu --- */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-4 justify-start mt-3 mb-4">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        disabled={loading}
                        className="text-sm bg-pink-100 hover:bg-pink-200 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition border border-pink-300"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-2 bg-white border-t border-gray-200 rounded-b-2xl shrink-0">
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl pl-2 pr-1 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#cb1c22]/20 focus-within:border-[#cb1c22]/50 transition-all shadow-inner">
              <SpeechToTextButton
                onTranscript={handleTranscript}
                onListeningChange={handleListeningChange}
                className="flex items-center justify-center rounded-lg bg-transparent border-none text-gray-500 hover:text-[#cb1c22] transition-colors w-9 h-9 flex-shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
                disabled={loading || isRecording}
                className="flex-1 bg-transparent focus:outline-none text-[14px] text-gray-800 placeholder-gray-500 px-2 py-1.5"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim() || isRecording}
                className="flex-shrink-0 ml-1 transition-all"
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  backgroundColor:
                    loading || !input.trim() || isRecording
                      ? '#e5e7eb'
                      : '#cb1c22',
                  color:
                    loading || !input.trim() || isRecording
                      ? '#9ca3af'
                      : 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor:
                    loading || !input.trim() || isRecording
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!visible && (
        <button
          onClick={toggleChat}
          className="fixed bottom-24 right-10 w-[45px] h-[45px] bg-transparent text-white rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center z-[999] animate-bounce print:hidden"
        >
          <img
            src="/chatbot.png"
            alt="Chatbot"
            className="w-full h-full object-contain rounded-full"
          />
        </button>
      )}

      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 2px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </>
  );
};

export default Chatbot;
