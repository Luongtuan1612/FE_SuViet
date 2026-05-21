export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  questions: QuizQuestion[];
}

export const quizTopics: QuizTopic[] = [
  {
    id: "thoi-bac-thuoc",
    title: "Thời kỳ Bắc thuộc",
    description: "Kiểm tra kiến thức về thời kỳ Bắc thuộc và các cuộc khởi nghĩa chống ách đô hộ.",
    emoji: "⚔️",
    questions: [
      {
        id: "q1",
        question: "Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?",
        options: ["38 SCN", "40 SCN", "43 SCN", "44 SCN"],
        correctAnswer: 1,
        explanation: "Cuộc khởi nghĩa Hai Bà Trưng bắt đầu vào năm 40 SCN, khi Trưng Trắc và Trưng Nhị phát động nổi dậy chống lại ách đô hộ của nhà Đông Hán."
      },
      {
        id: "q2",
        question: "Nguyên nhân trực tiếp nào khiến Trưng Trắc phát động khởi nghĩa?",
        options: [
          "Quân Hán tăng thuế",
          "Thi Sách – chồng Trưng Trắc – bị giết",
          "Quân Hán xây thành mới",
          "Nhà Hán xâm chiếm Mê Linh"
        ],
        correctAnswer: 1,
        explanation: "Thái thú Tô Định đã giết chết Thi Sách – chồng bà Trưng Trắc – đây là nguyên nhân trực tiếp châm ngòi cho cuộc khởi nghĩa."
      },
      {
        id: "q3",
        question: "Sau khi giành thắng lợi, Trưng Trắc đặt kinh đô ở đâu?",
        options: ["Hoa Lư", "Cổ Loa", "Mê Linh", "Thăng Long"],
        correctAnswer: 2,
        explanation: "Sau khi giành độc lập, Trưng Trắc xưng vương (Trưng Vương) và đặt kinh đô tại Mê Linh (nay thuộc Hà Nội)."
      },
      {
        id: "q4",
        question: "Trận Bạch Đằng năm 938 do ai chỉ huy?",
        options: ["Lý Thường Kiệt", "Trần Hưng Đạo", "Ngô Quyền", "Đinh Bộ Lĩnh"],
        correctAnswer: 2,
        explanation: "Ngô Quyền là người tổ chức và chỉ huy trận Bạch Đằng năm 938, dùng chiến thuật cọc gỗ đánh bại thủy quân Nam Hán."
      },
      {
        id: "q5",
        question: "Chiến thuật đặc biệt của Ngô Quyền trong trận Bạch Đằng 938 là gì?",
        options: [
          "Dùng hỏa công đốt thuyền địch",
          "Đóng cọc gỗ nhọn bịt sắt xuống lòng sông",
          "Dùng voi chiến tấn công",
          "Xây thành lũy bảo vệ"
        ],
        correctAnswer: 1,
        explanation: "Ngô Quyền đóng cọc gỗ nhọn bịt sắt xuống lòng sông Bạch Đằng. Khi thủy triều xuống, thuyền địch bị cọc đâm thủng và bị tiêu diệt hoàn toàn."
      },
      {
        id: "q6",
        question: "Sau chiến thắng Bạch Đằng 938, Ngô Quyền xưng vương và đặt kinh đô ở đâu?",
        options: ["Thăng Long", "Mê Linh", "Hoa Lư", "Cổ Loa"],
        correctAnswer: 3,
        explanation: "Sau chiến thắng Bạch Đằng 938, Ngô Quyền xưng vương và đặt kinh đô tại Cổ Loa (Hà Nội ngày nay)."
      }
    ]
  },
  {
    id: "nha-tran",
    title: "Nhà Trần & Kháng chiến chống Mông – Nguyên",
    description: "Kiểm tra kiến thức về thời kỳ nhà Trần và ba cuộc kháng chiến hào hùng.",
    emoji: "🏹",
    questions: [
      {
        id: "q1",
        question: "Quân Mông – Nguyên xâm lược Đại Việt mấy lần?",
        options: ["1 lần", "2 lần", "3 lần", "4 lần"],
        correctAnswer: 2,
        explanation: "Quân Mông – Nguyên xâm lược Đại Việt 3 lần vào các năm 1258, 1285 và 1288."
      },
      {
        id: "q2",
        question: "Hội nghị Diên Hồng diễn ra vào năm nào?",
        options: ["1258", "1284", "1285", "1288"],
        correctAnswer: 1,
        explanation: "Hội nghị Diên Hồng diễn ra vào năm 1284, trước cuộc xâm lược lần 2 của quân Nguyên, nơi toàn dân đồng thanh quyết tâm 'Đánh!'."
      },
      {
        id: "q3",
        question: "Ai là Tổng chỉ huy quân đội nhà Trần trong ba cuộc kháng chiến chống Mông – Nguyên?",
        options: ["Trần Quang Khải", "Trần Nhân Tông", "Trần Hưng Đạo", "Trần Thủ Độ"],
        correctAnswer: 2,
        explanation: "Trần Hưng Đạo (Trần Quốc Tuấn) là Tổng chỉ huy quân đội nhà Trần trong các cuộc kháng chiến chống Mông – Nguyên."
      },
      {
        id: "q4",
        question: "Chiến thuật 'vườn không nhà trống' có nghĩa là gì?",
        options: [
          "Xây thêm nhiều nhà trống để địch ở lại",
          "Nhân dân sơ tán, mang theo lương thực, không để lại gì cho giặc",
          "Đào địa đạo để trốn giặc",
          "Đốt thành trước khi rút lui"
        ],
        correctAnswer: 1,
        explanation: "Chiến thuật 'vườn không nhà trống' là nhân dân sơ tán, mang theo tất cả lương thực, gia súc, không để lại gì cho quân địch sử dụng."
      },
      {
        id: "q5",
        question: "Trong trận Bạch Đằng 1288, tướng giặc nào bị bắt làm tù binh?",
        options: ["Thoát Hoan", "Ô Mã Nhi", "Ngột Lương Hợp Thai", "A Lý Hải Nha"],
        correctAnswer: 1,
        explanation: "Trong trận Bạch Đằng 1288, tướng giặc Ô Mã Nhi bị bắt làm tù binh. Thoát Hoan phải chui vào ống đồng trốn chạy."
      }
    ]
  },
  {
    id: "chong-phap",
    title: "Kháng chiến chống Pháp",
    description: "Kiểm tra kiến thức về giai đoạn kháng chiến chống thực dân Pháp (1945-1954).",
    emoji: "🌟",
    questions: [
      {
        id: "q1",
        question: "Chiến dịch Điện Biên Phủ bắt đầu vào ngày nào?",
        options: ["7/5/1954", "13/3/1954", "19/12/1946", "2/9/1945"],
        correctAnswer: 1,
        explanation: "Chiến dịch Điện Biên Phủ bắt đầu vào ngày 13/3/1954 và kết thúc thắng lợi ngày 7/5/1954."
      },
      {
        id: "q2",
        question: "Ai là Tổng chỉ huy chiến dịch Điện Biên Phủ?",
        options: ["Hồ Chí Minh", "Trường Chinh", "Võ Nguyên Giáp", "Lê Duẩn"],
        correctAnswer: 2,
        explanation: "Đại tướng Võ Nguyên Giáp là Tổng chỉ huy Chiến dịch Điện Biên Phủ."
      },
      {
        id: "q3",
        question: "Chiến dịch Điện Biên Phủ kéo dài bao nhiêu ngày đêm?",
        options: ["45 ngày", "56 ngày", "60 ngày", "30 ngày"],
        correctAnswer: 1,
        explanation: "Chiến dịch Điện Biên Phủ kéo dài 56 ngày đêm chiến đấu ác liệt (13/3 – 7/5/1954)."
      },
      {
        id: "q4",
        question: "Hiệp định Genève được ký kết vào năm nào, chấm dứt chiến tranh Đông Dương?",
        options: ["1953", "1954", "1955", "1956"],
        correctAnswer: 1,
        explanation: "Hiệp định Genève được ký kết tháng 7/1954, sau chiến thắng Điện Biên Phủ, chấm dứt chiến tranh Đông Dương và buộc Pháp rút khỏi Việt Nam."
      },
      {
        id: "q5",
        question: "Đại tướng Võ Nguyên Giáp đã thay đổi phương án tấn công Điện Biên Phủ như thế nào?",
        options: [
          "Từ 'đánh chắc tiến chắc' sang 'đánh nhanh giải quyết nhanh'",
          "Từ 'đánh nhanh giải quyết nhanh' sang 'đánh chắc tiến chắc'",
          "Từ đánh trực diện sang bao vây",
          "Từ bao vây sang đánh trực diện"
        ],
        correctAnswer: 1,
        explanation: "Đại tướng Võ Nguyên Giáp đã quyết định thay đổi phương án từ 'đánh nhanh, giải quyết nhanh' sang 'đánh chắc, tiến chắc' – một quyết định lịch sử đúng đắn, đảm bảo thắng lợi."
      }
    ]
  },
  {
    id: "tay-son",
    title: "Nhà Tây Sơn",
    description: "Kiểm tra kiến thức về phong trào Tây Sơn và vua Quang Trung.",
    emoji: "🐉",
    questions: [
      {
        id: "q1",
        question: "Vua Quang Trung tên thật là gì?",
        options: ["Nguyễn Nhạc", "Nguyễn Lữ", "Nguyễn Huệ", "Nguyễn Ánh"],
        correctAnswer: 2,
        explanation: "Vua Quang Trung tên thật là Nguyễn Huệ, là em út trong ba anh em khởi nghĩa Tây Sơn."
      },
      {
        id: "q2",
        question: "Trận Đống Đa diễn ra vào dịp Tết năm nào?",
        options: ["Tết Mậu Tuất 1778", "Tết Kỷ Dậu 1789", "Tết Canh Tuất 1790", "Tết Đinh Mùi 1787"],
        correctAnswer: 1,
        explanation: "Trận Đống Đa diễn ra vào dịp Tết Kỷ Dậu năm 1789, từ mùng 3 đến mùng 5 Tết."
      },
      {
        id: "q3",
        question: "Quân Thanh do ai chỉ huy khi sang xâm lược Đại Việt năm 1788?",
        options: ["Hứa Thế Hanh", "Tôn Sĩ Nghị", "Sầm Nghi Đống", "Trương Triều Dũng"],
        correctAnswer: 1,
        explanation: "Tôn Sĩ Nghị là Tổng đốc Lưỡng Quảng nhà Thanh, chỉ huy 29 vạn quân sang xâm lược Đại Việt năm 1788."
      },
      {
        id: "q4",
        question: "Quang Trung lên ngôi Hoàng đế tại đâu trước khi dẫn quân ra Bắc?",
        options: ["Thăng Long", "Quy Nhơn", "Phú Xuân (Huế)", "Gia Định"],
        correctAnswer: 2,
        explanation: "Quang Trung lên ngôi Hoàng đế tại Phú Xuân (nay là Huế) ngày 25/11/1788, rồi dẫn quân ra Bắc đại phá quân Thanh."
      },
      {
        id: "q5",
        question: "Quân Tây Sơn mất bao nhiêu ngày để đại phá quân Thanh tại Thăng Long?",
        options: ["3 ngày", "5 ngày", "7 ngày", "10 ngày"],
        correctAnswer: 1,
        explanation: "Chỉ trong 5 ngày (mùng 3 đến mùng 5 Tết Kỷ Dậu 1789), quân Tây Sơn đã đại phá hoàn toàn 29 vạn quân Thanh."
      }
    ]
  },
  {
    id: "hien-dai",
    title: "Lịch sử Hiện đại Việt Nam",
    description: "Kiểm tra kiến thức về giai đoạn lịch sử cận – hiện đại (1945-1975).",
    emoji: "🇻🇳",
    questions: [
      {
        id: "q1",
        question: "Ngày Tuyên ngôn Độc lập Việt Nam được đọc là ngày nào?",
        options: ["19/8/1945", "2/9/1945", "25/8/1945", "1/9/1945"],
        correctAnswer: 1,
        explanation: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội vào ngày 2/9/1945."
      },
      {
        id: "q2",
        question: "Cách mạng tháng Tám 1945 giành chính quyền trong bao nhiêu ngày?",
        options: ["5 ngày", "10 ngày", "15 ngày", "20 ngày"],
        correctAnswer: 2,
        explanation: "Cuộc Tổng khởi nghĩa Cách mạng Tháng Tám diễn ra trong vòng 15 ngày (14-28/8/1945), giành chính quyền trên toàn quốc."
      },
      {
        id: "q3",
        question: "Chiến dịch Hồ Chí Minh kết thúc thắng lợi vào ngày nào?",
        options: ["26/4/1975", "28/4/1975", "29/4/1975", "30/4/1975"],
        correctAnswer: 3,
        explanation: "Chiến dịch Hồ Chí Minh kết thúc thắng lợi vào ngày 30/4/1975, khi xe tăng húc đổ cổng Dinh Độc Lập và Dương Văn Minh tuyên bố đầu hàng."
      },
      {
        id: "q4",
        question: "Tổng thống cuối cùng của chính quyền Sài Gòn tuyên bố đầu hàng là ai?",
        options: ["Nguyễn Văn Thiệu", "Trần Văn Hương", "Dương Văn Minh", "Nguyễn Cao Kỳ"],
        correctAnswer: 2,
        explanation: "Dương Văn Minh là Tổng thống cuối cùng của chính quyền Sài Gòn, tuyên bố đầu hàng vô điều kiện vào trưa ngày 30/4/1975."
      },
      {
        id: "q5",
        question: "Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam chính thức thành lập vào năm nào?",
        options: ["1975", "1976", "1977", "1978"],
        correctAnswer: 1,
        explanation: "Ngày 2/7/1976, nước Cộng hòa Xã hội Chủ nghĩa Việt Nam chính thức được thành lập, thống nhất hoàn toàn hai miền Nam – Bắc."
      },
      {
        id: "q6",
        question: "Ngày 19/8 có ý nghĩa lịch sử gì?",
        options: [
          "Ngày Bác Hồ về nước",
          "Ngày Hà Nội khởi nghĩa thành công trong Cách mạng Tháng Tám",
          "Ngày thành lập Đảng Cộng sản",
          "Ngày quân Nhật đầu hàng"
        ],
        correctAnswer: 1,
        explanation: "Ngày 19/8/1945, nhân dân Hà Nội khởi nghĩa thành công, giành chính quyền từ tay thực dân và phát xít, là sự kiện quan trọng nhất của Cách mạng Tháng Tám."
      }
    ]
  }
];
