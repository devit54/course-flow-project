
export const coursesData = [
  {
    id: 1,
    title: "React Cơ Bản đến Nâng Cao",
    description: "Học React từ những kiến thức cơ bản nhất đến các kỹ thuật nâng cao",
    category: "Công nghệ",
    level: "Cơ bản",
    instructor: "Nguyễn Văn A",
    duration: "40 giờ",
    rating: 4.8,
    reviews: 156,
    price: 1500000,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    lessons: [
      { id: 1, title: "Giới thiệu về React", duration: "30 phút", completed: false },
      { id: 2, title: "Components và Props", duration: "45 phút", completed: false },
      { id: 3, title: "State và Lifecycle", duration: "60 phút", completed: false },
      { id: 4, title: "Event Handling", duration: "40 phút", completed: false },
      { id: 5, title: "Hooks cơ bản", duration: "90 phút", completed: false }
    ]
  },
  {
    id: 2,
    title: "JavaScript ES6+ Complete Guide",
    description: "Nắm vững JavaScript hiện đại với ES6, ES7, ES8 và các tính năng mới nhất",
    category: "Công nghệ",
    level: "Trung bình",
    instructor: "Trần Thị B",
    duration: "35 giờ",
    rating: 4.9,
    reviews: 203,
    price: 1200000,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
    lessons: [
      { id: 1, title: "Let, Const và Arrow Functions", duration: "25 phút", completed: false },
      { id: 2, title: "Destructuring và Spread Operator", duration: "35 phút", completed: false },
      { id: 3, title: "Promises và Async/Await", duration: "50 phút", completed: false },
      { id: 4, title: "Classes và Modules", duration: "40 phút", completed: false }
    ]
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    description: "Xây dựng ứng dụng backend mạnh mẽ với Node.js và Express",
    category: "Công nghệ",
    level: "Nâng cao",
    instructor: "Lê Văn C",
    duration: "50 giờ",
    rating: 4.7,
    reviews: 89,
    price: 2000000,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500",
    lessons: [
      { id: 1, title: "Thiết lập môi trường Node.js", duration: "20 phút", completed: false },
      { id: 2, title: "Express.js Framework", duration: "60 phút", completed: false },
      { id: 3, title: "Database Integration", duration: "75 phút", completed: false },
      { id: 4, title: "Authentication & Authorization", duration: "90 phút", completed: false }
    ]
  },
  {
    id: 4,
    title: "Tiếng Anh Giao Tiếp Cơ Bản",
    description: "Học tiếng Anh giao tiếp hàng ngày một cách hiệu quả",
    category: "Ngôn ngữ",
    level: "Cơ bản",
    instructor: "Ms. Sarah Johnson",
    duration: "30 giờ",
    rating: 4.6,
    reviews: 312,
    price: 800000,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
    lessons: [
      { id: 1, title: "Greeting và Self Introduction", duration: "25 phút", completed: false },
      { id: 2, title: "Daily Conversations", duration: "30 phút", completed: false },
      { id: 3, title: "Shopping và Ordering Food", duration: "35 phút", completed: false },
      { id: 4, title: "Asking for Directions", duration: "20 phút", completed: false }
    ]
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    description: "Chiến lược marketing số hiệu quả cho doanh nghiệp hiện đại",
    category: "Kinh doanh",
    level: "Trung bình",
    instructor: "Phạm Văn D",
    duration: "25 giờ",
    rating: 4.5,
    reviews: 167,
    price: 1000000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
    lessons: [
      { id: 1, title: "Tổng quan Digital Marketing", duration: "40 phút", completed: false },
      { id: 2, title: "Social Media Marketing", duration: "55 phút", completed: false },
      { id: 3, title: "Email Marketing", duration: "45 phút", completed: false },
      { id: 4, title: "SEO & Content Marketing", duration: "70 phút", completed: false }
    ]
  },
  {
    id: 6,
    title: "Photoshop cho Người Mới Bắt Đầu",
    description: "Học Adobe Photoshop từ cơ bản đến thành thạo",
    category: "Thiết kế",
    level: "Cơ bản",
    instructor: "Ngô Thị E",
    duration: "20 giờ",
    rating: 4.4,
    reviews: 198,
    price: 700000,
    image: "https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?w=500",
    lessons: [
      { id: 1, title: "Giao diện và công cụ cơ bản", duration: "30 phút", completed: false },
      { id: 2, title: "Layers và Selections", duration: "45 phút", completed: false },
      { id: 3, title: "Color Correction", duration: "40 phút", completed: false },
      { id: 4, title: "Retouching và Effects", duration: "60 phút", completed: false }
    ]
  }
];

export const quizData = {
  1: [
    {
      id: 1,
      question: "React là gì?",
      options: [
        "Một thư viện JavaScript để xây dựng giao diện người dùng",
        "Một framework backend",
        "Một cơ sở dữ liệu",
        "Một ngôn ngữ lập trình"
      ],
      correct: 0,
      explanation: "React là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng."
    },
    {
      id: 2,
      question: "JSX là viết tắt của gì?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JSON XML",
        "JavaScript Extension"
      ],
      correct: 0,
      explanation: "JSX là viết tắt của JavaScript XML, cho phép viết HTML trong JavaScript."
    },
    {
      id: 3,
      question: "Component trong React có thể được định nghĩa bằng cách nào?",
      options: [
        "Function hoặc Class",
        "Chỉ Function",
        "Chỉ Class",
        "Chỉ Arrow Function"
      ],
      correct: 0,
      explanation: "Component trong React có thể được định nghĩa bằng Function hoặc Class."
    }
  ]
};

export const categories = ["Tất cả", "Công nghệ", "Ngôn ngữ", "Kinh doanh", "Thiết kế"];
export const levels = ["Tất cả", "Cơ bản", "Trung bình", "Nâng cao"];
