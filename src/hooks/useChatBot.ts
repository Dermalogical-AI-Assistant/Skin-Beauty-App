import { Message, ChatHistory } from '../types/ChatBot';

// Giả lập API call để lấy tin nhắn của một cuộc trò chuyện cụ thể
export const fetchChatMessages = async (sessionId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (sessionId === 'a27bc9b5-bb6a-4117-b11b-c9c8cddf76d0') {
        resolve([
          { id: '101', content: 'Xin chào! Tôi có thể giúp gì cho bạn?', isUser: false, timestamp: new Date('2023-10-01T10:01:00') },
          { id: '102', content: 'Tôi muốn học JavaScript, bắt đầu từ đâu là tốt nhất?', isUser: true, timestamp: new Date('2023-10-01T10:00:00') },
          { id: '103', content: 'Bạn có thể bắt đầu với các khóa học cơ bản trên Codecademy hoặc freeCodeCamp.', isUser: false, timestamp: new Date('2023-10-01T10:02:00') }
        ]);
      } else if (sessionId === 'b38cd0e6-cc7b-5228-c22c-d0d9dee87bf1') {
        resolve([
          { id: '201', content: 'Chào bạn! Tôi có thể giúp gì hôm nay?', isUser: false, timestamp: new Date('2023-10-02T14:30:00') },
          { id: '202', content: 'React hooks hoạt động như thế nào?', isUser: true, timestamp: new Date('2023-10-02T14:31:00') },
          { id: '203', content: 'React hooks cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class.', isUser: false, timestamp: new Date('2023-10-02T14:32:00') }
        ]);
      } else {
          resolve([
            { id: '102', content: 'What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?What does niacinamide serum do for the skin?', isUser: true, timestamp: new Date('2023-10-01T10:00:00') },
            { id: '103', content: '<strong>Niacinamide serum</strong> is a multi-functional skincare ingredient that provides a variety of benefits for different skin types. It’s especially loved because it’s both <strong>effective</strong> and <strong>gentle</strong>, making it suitable for even sensitive skin. Here’s what niacinamide can do for your skin:</p>\n' +
                '\n' +
                '<ol>\n' +
                '  <li><strong>Regulates oil production:</strong> If you have oily or acne-prone skin, niacinamide can help balance the amount of sebum your skin produces. This means less shine and potentially fewer breakouts.</li>\n' +
                '  <li><strong>Minimizes the appearance of pores:</strong> With consistent use, niacinamide can make your pores appear smaller by helping to keep them clear and improving skin elasticity.</li>\n' +
                '  <li><strong>Brightens and evens skin tone:</strong> It fades hyperpigmentation, acne marks, and dark spots over time, giving your skin a more even, radiant look.</li>\n' +
                '  <li><strong>Strengthens the skin barrier:</strong> A healthy skin barrier is crucial for locking in moisture and keeping irritants out. Niacinamide boosts your skin’s ability to protect itself, making it more resilient and less sensitive.</li>\n' +
                '  <li><strong>Reduces redness and irritation:</strong> If your skin is reactive or inflamed, niacinamide has calming properties that help reduce redness, making it great for conditions like rosacea.</li>\n' +
                '  <li><strong>Smooths out texture:</strong> It supports overall skin health, making your skin feel smoother, softer, and more refined with regular use.</li>\n' +
                '</ol>\n' +
                '\n' +
                '<p><strong>In summary, niacinamide is a gentle yet powerful ingredient that supports healthy, balanced, and glowing skin.</strong><br>\n' +
                'Want me to recommend a routine or show products with niacinamide in them?\n', isUser: false, timestamp: new Date('2023-10-01T10:02:00') },
            { id: '102', content: 'What does niacinamide serum do for the skin?', isUser: true, timestamp: new Date('2023-10-01T10:00:00') },
            { id: '103', content: '<strong>Niacinamide serum</strong> is a multi-functional skincare ingredient that provides a variety of benefits for different skin types. It’s especially loved because it’s both <strong>effective</strong> and <strong>gentle</strong>, making it suitable for even sensitive skin. Here’s what niacinamide can do for your skin:</p>\n' +
                '\n' +
                '<ol>\n' +
                '  <li><strong>Regulates oil production:</strong> If you have oily or acne-prone skin, niacinamide can help balance the amount of sebum your skin produces. This means less shine and potentially fewer breakouts.</li>\n' +
                '  <li><strong>Minimizes the appearance of pores:</strong> With consistent use, niacinamide can make your pores appear smaller by helping to keep them clear and improving skin elasticity.</li>\n' +
                '  <li><strong>Brightens and evens skin tone:</strong> It fades hyperpigmentation, acne marks, and dark spots over time, giving your skin a more even, radiant look.</li>\n' +
                '  <li><strong>Strengthens the skin barrier:</strong> A healthy skin barrier is crucial for locking in moisture and keeping irritants out. Niacinamide boosts your skin’s ability to protect itself, making it more resilient and less sensitive.</li>\n' +
                '  <li><strong>Reduces redness and irritation:</strong> If your skin is reactive or inflamed, niacinamide has calming properties that help reduce redness, making it great for conditions like rosacea.</li>\n' +
                '  <li><strong>Smooths out texture:</strong> It supports overall skin health, making your skin feel smoother, softer, and more refined with regular use.</li>\n' +
                '</ol>\n' +
                '\n' +
                '<p><strong>In summary, niacinamide is a gentle yet powerful ingredient that supports healthy, balanced, and glowing skin.</strong><br>\n' +
                'Want me to recommend a routine or show products with niacinamide in them?\n', isUser: false, timestamp: new Date('2023-10-01T10:02:00') },
            { id: '102', content: 'What does niacinamide serum do for the skin?', isUser: true, timestamp: new Date('2023-10-01T10:00:00') },
            { id: '103', content: '<strong>Niacinamide serum</strong> is a multi-functional skincare ingredient that provides a variety of benefits for different skin types. It’s especially loved because it’s both <strong>effective</strong> and <strong>gentle</strong>, making it suitable for even sensitive skin. Here’s what niacinamide can do for your skin:</p>\n' +
                '\n' +
                '<ol>\n' +
                '  <li><strong>Regulates oil production:</strong> If you have oily or acne-prone skin, niacinamide can help balance the amount of sebum your skin produces. This means less shine and potentially fewer breakouts.</li>\n' +
                '  <li><strong>Minimizes the appearance of pores:</strong> With consistent use, niacinamide can make your pores appear smaller by helping to keep them clear and improving skin elasticity.</li>\n' +
                '  <li><strong>Brightens and evens skin tone:</strong> It fades hyperpigmentation, acne marks, and dark spots over time, giving your skin a more even, radiant look.</li>\n' +
                '  <li><strong>Strengthens the skin barrier:</strong> A healthy skin barrier is crucial for locking in moisture and keeping irritants out. Niacinamide boosts your skin’s ability to protect itself, making it more resilient and less sensitive.</li>\n' +
                '  <li><strong>Reduces redness and irritation:</strong> If your skin is reactive or inflamed, niacinamide has calming properties that help reduce redness, making it great for conditions like rosacea.</li>\n' +
                '  <li><strong>Smooths out texture:</strong> It supports overall skin health, making your skin feel smoother, softer, and more refined with regular use.</li>\n' +
                '</ol>\n' +
                '\n' +
                '<p><strong>In summary, niacinamide is a gentle yet powerful ingredient that supports healthy, balanced, and glowing skin.</strong><br>\n' +
                'Want me to recommend a routine or show products with niacinamide in them?\n', isUser: false, timestamp: new Date('2023-10-01T10:02:00') }
          ]);
      }
    }, 800);
  });
};

// Giả lập API call để tạo cuộc trò chuyện mới
export const createNewChat = async (): Promise<ChatHistory> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tạo UUID mới kiểu như Claude dùng
      const newId = 'new-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 15);

      resolve({
        id: newId,
        title: 'Cuộc trò chuyện mới',
        createdAt: new Date(),
      });
    }, 300);
  });
};

// Giả lập API call để gửi tin nhắn mới
export const sendMessage = async (sessionId: string, content: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        content: `Đây là phản hồi từ chatbot đối với tin nhắn: "${content}"`,
        isUser: false,
        timestamp: new Date()
      });
    }, 1000);
  });
};
