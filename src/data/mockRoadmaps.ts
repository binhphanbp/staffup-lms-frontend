/**
 * Mock data cho Lộ trình phát triển (Roadmaps)
 * Dựa trên các khóa học có sẵn trong hệ thống
 */

export interface MockRoadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetPosition: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  isActive: boolean;
  estimatedMonths: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  courses: Array<{
    courseSlug: string;
    courseTitle: string;
    orderIndex: number;
    isRequired: boolean;
    estimatedWeeks: number;
  }>;
  skills: string[];
  outcomes: string[];
}

export const mockRoadmaps: MockRoadmap[] = [
  // 1. Frontend Developer Roadmap
  {
    id: 'roadmap-frontend-dev',
    title: 'Lộ trình Frontend Developer',
    slug: 'frontend-developer',
    description: 'Lộ trình học toàn diện để trở thành Frontend Developer chuyên nghiệp. Từ HTML/CSS cơ bản đến các framework hiện đại như React, Vue.js, và Next.js.',
    targetPosition: 'Frontend Developer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 6,
    difficulty: 'intermediate',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'vuejs-framework',
        courseTitle: 'Vue.js 3 - Progressive JavaScript Framework',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 4,
      },
      {
        courseSlug: 'nextjs-typescript',
        courseTitle: 'Next.js 14 với TypeScript',
        orderIndex: 3,
        isRequired: true,
        estimatedWeeks: 5,
      },
      {
        courseSlug: 'angular-framework',
        courseTitle: 'Angular Framework - Từ Cơ Bản Đến Nâng Cao',
        orderIndex: 4,
        isRequired: false,
        estimatedWeeks: 4,
      },
    ],
    skills: [
      'HTML5 & CSS3',
      'JavaScript ES6+',
      'TypeScript',
      'React.js',
      'Vue.js',
      'Next.js',
      'Responsive Design',
      'Git & GitHub',
      'RESTful API',
      'State Management',
    ],
    outcomes: [
      'Xây dựng giao diện web responsive và hiện đại',
      'Làm việc với các framework phổ biến (React, Vue, Angular)',
      'Tối ưu hiệu suất và SEO cho ứng dụng web',
      'Quản lý state và routing trong SPA',
      'Làm việc nhóm với Git và GitHub',
    ],
  },

  // 2. Backend Developer Roadmap
  {
    id: 'roadmap-backend-dev',
    title: 'Lộ trình Backend Developer',
    slug: 'backend-developer',
    description: 'Lộ trình học để trở thành Backend Developer. Học các ngôn ngữ lập trình, database, API design, và cloud services.',
    targetPosition: 'Backend Developer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 7,
    difficulty: 'intermediate',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 6,
      },
      {
        courseSlug: 'php-mysql',
        courseTitle: 'PHP & MySQL - Web Development',
        orderIndex: 3,
        isRequired: true,
        estimatedWeeks: 5,
      },
      {
        courseSlug: 'cpp-programming',
        courseTitle: 'C++ Programming - From Basics to Advanced',
        orderIndex: 4,
        isRequired: false,
        estimatedWeeks: 6,
      },
    ],
    skills: [
      'Python',
      'PHP',
      'C++',
      'MySQL',
      'RESTful API Design',
      'Authentication & Authorization',
      'Database Design',
      'Git & GitHub',
      'Server Management',
      'Security Best Practices',
    ],
    outcomes: [
      'Xây dựng RESTful API với Python/PHP',
      'Thiết kế và quản lý database hiệu quả',
      'Implement authentication và authorization',
      'Xử lý business logic phức tạp',
      'Deploy và maintain backend services',
    ],
  },

  // 3. Full Stack Developer Roadmap
  {
    id: 'roadmap-fullstack-dev',
    title: 'Lộ trình Full Stack Developer',
    slug: 'fullstack-developer',
    description: 'Lộ trình toàn diện để trở thành Full Stack Developer. Kết hợp kiến thức Frontend và Backend để xây dựng ứng dụng web hoàn chỉnh.',
    targetPosition: 'Full Stack Developer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 10,
    difficulty: 'advanced',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 6,
      },
      {
        courseSlug: 'php-mysql',
        courseTitle: 'PHP & MySQL - Web Development',
        orderIndex: 3,
        isRequired: true,
        estimatedWeeks: 5,
      },
      {
        courseSlug: 'vuejs-framework',
        courseTitle: 'Vue.js 3 - Progressive JavaScript Framework',
        orderIndex: 4,
        isRequired: true,
        estimatedWeeks: 4,
      },
      {
        courseSlug: 'nextjs-typescript',
        courseTitle: 'Next.js 14 với TypeScript',
        orderIndex: 5,
        isRequired: true,
        estimatedWeeks: 5,
      },
      {
        courseSlug: 'aws-solutions-architect',
        courseTitle: 'AWS Solutions Architect - Associate',
        orderIndex: 6,
        isRequired: false,
        estimatedWeeks: 8,
      },
    ],
    skills: [
      'Frontend Development',
      'Backend Development',
      'Database Design',
      'API Development',
      'Cloud Services (AWS)',
      'DevOps Basics',
      'Git & GitHub',
      'TypeScript',
      'Python',
      'Next.js',
    ],
    outcomes: [
      'Xây dựng ứng dụng web full stack hoàn chỉnh',
      'Thiết kế và implement cả frontend lẫn backend',
      'Deploy ứng dụng lên cloud (AWS)',
      'Làm việc với database và API',
      'Quản lý dự án từ đầu đến cuối',
    ],
  },

  // 4. Cloud Engineer Roadmap
  {
    id: 'roadmap-cloud-engineer',
    title: 'Lộ trình Cloud Engineer (AWS)',
    slug: 'cloud-engineer-aws',
    description: 'Lộ trình để trở thành Cloud Engineer chuyên về AWS. Học cách thiết kế, deploy và quản lý infrastructure trên AWS cloud.',
    targetPosition: 'Cloud Engineer',
    categoryId: '2',
    categoryName: 'Cloud & DevOps',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 5,
    difficulty: 'advanced',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 6,
      },
      {
        courseSlug: 'aws-solutions-architect',
        courseTitle: 'AWS Solutions Architect - Associate',
        orderIndex: 3,
        isRequired: true,
        estimatedWeeks: 8,
      },
    ],
    skills: [
      'AWS Services (EC2, S3, RDS, Lambda)',
      'Infrastructure as Code',
      'CloudFormation',
      'Networking (VPC, Security Groups)',
      'Python Scripting',
      'Git & GitHub',
      'CI/CD',
      'Monitoring & Logging',
      'Security Best Practices',
      'Cost Optimization',
    ],
    outcomes: [
      'Thiết kế và deploy infrastructure trên AWS',
      'Quản lý và tối ưu chi phí cloud',
      'Implement security và compliance',
      'Automate deployment với IaC',
      'Monitor và troubleshoot cloud services',
    ],
  },

  // 5. DevOps Engineer Roadmap
  {
    id: 'roadmap-devops-engineer',
    title: 'Lộ trình DevOps Engineer',
    slug: 'devops-engineer',
    description: 'Lộ trình để trở thành DevOps Engineer. Học automation, CI/CD, containerization, và cloud infrastructure.',
    targetPosition: 'DevOps Engineer',
    categoryId: '2',
    categoryName: 'Cloud & DevOps',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 6,
    difficulty: 'advanced',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 6,
      },
      {
        courseSlug: 'php-mysql',
        courseTitle: 'PHP & MySQL - Web Development',
        orderIndex: 3,
        isRequired: false,
        estimatedWeeks: 5,
      },
      {
        courseSlug: 'aws-solutions-architect',
        courseTitle: 'AWS Solutions Architect - Associate',
        orderIndex: 4,
        isRequired: true,
        estimatedWeeks: 8,
      },
    ],
    skills: [
      'Linux Administration',
      'Git & GitHub Actions',
      'CI/CD Pipelines',
      'Docker & Kubernetes',
      'AWS Cloud Services',
      'Python Scripting',
      'Infrastructure as Code',
      'Monitoring & Logging',
      'Security & Compliance',
      'Automation',
    ],
    outcomes: [
      'Xây dựng và quản lý CI/CD pipelines',
      'Automate deployment và infrastructure',
      'Containerize applications với Docker',
      'Deploy và manage Kubernetes clusters',
      'Monitor và optimize system performance',
    ],
  },

  // 6. Software Engineer (C++) Roadmap
  {
    id: 'roadmap-cpp-engineer',
    title: 'Lộ trình Software Engineer (C++)',
    slug: 'cpp-software-engineer',
    description: 'Lộ trình để trở thành Software Engineer chuyên về C++. Phù hợp cho system programming, game development, và embedded systems.',
    targetPosition: 'C++ Software Engineer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 5,
    difficulty: 'advanced',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'cpp-programming',
        courseTitle: 'C++ Programming - From Basics to Advanced',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 8,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 3,
        isRequired: false,
        estimatedWeeks: 6,
      },
    ],
    skills: [
      'C++ Programming',
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Memory Management',
      'STL (Standard Template Library)',
      'Multithreading',
      'Design Patterns',
      'Git & GitHub',
      'Debugging & Profiling',
      'Performance Optimization',
    ],
    outcomes: [
      'Viết code C++ hiệu suất cao và maintainable',
      'Implement complex data structures và algorithms',
      'Quản lý memory và resources hiệu quả',
      'Develop multithreaded applications',
      'Debug và optimize performance',
    ],
  },

  // 7. Digital Marketing Specialist Roadmap
  {
    id: 'roadmap-digital-marketing',
    title: 'Lộ trình Digital Marketing Specialist',
    slug: 'digital-marketing-specialist',
    description: 'Lộ trình toàn diện để trở thành Digital Marketing Specialist. Từ SEO, SEM, Social Media đến Content Marketing và Analytics.',
    targetPosition: 'Digital Marketing Specialist',
    categoryId: '4',
    categoryName: 'Marketing',
    departmentId: '2',
    departmentName: 'Phòng Marketing',
    isActive: true,
    estimatedMonths: 4,
    difficulty: 'beginner',
    courses: [
      {
        courseSlug: 'digital-marketing',
        courseTitle: 'Digital Marketing - Complete Guide',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 8,
      },
    ],
    skills: [
      'SEO (Search Engine Optimization)',
      'SEM (Search Engine Marketing)',
      'Social Media Marketing',
      'Content Marketing',
      'Email Marketing',
      'Google Analytics',
      'Facebook Ads',
      'Google Ads',
      'Marketing Strategy',
      'Data Analysis',
    ],
    outcomes: [
      'Xây dựng và thực thi chiến lược marketing online',
      'Tối ưu SEO và chạy quảng cáo hiệu quả',
      'Quản lý social media và content marketing',
      'Phân tích data và đo lường ROI',
      'Tăng traffic và conversion cho website',
    ],
  },

  // 8. Web Developer (PHP) Roadmap
  {
    id: 'roadmap-php-developer',
    title: 'Lộ trình PHP Web Developer',
    slug: 'php-web-developer',
    description: 'Lộ trình để trở thành PHP Web Developer. Học PHP, MySQL, và các framework phổ biến để xây dựng website động.',
    targetPosition: 'PHP Web Developer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 4,
    difficulty: 'beginner',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'php-mysql',
        courseTitle: 'PHP & MySQL - Web Development',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 6,
      },
      {
        courseSlug: 'vuejs-framework',
        courseTitle: 'Vue.js 3 - Progressive JavaScript Framework',
        orderIndex: 3,
        isRequired: false,
        estimatedWeeks: 4,
      },
    ],
    skills: [
      'PHP Programming',
      'MySQL Database',
      'HTML & CSS',
      'JavaScript',
      'CRUD Operations',
      'Authentication & Sessions',
      'Git & GitHub',
      'RESTful API',
      'Security Best Practices',
      'MVC Pattern',
    ],
    outcomes: [
      'Xây dựng website động với PHP và MySQL',
      'Implement authentication và authorization',
      'Thiết kế và quản lý database',
      'Develop RESTful API',
      'Deploy và maintain PHP applications',
    ],
  },

  // 9. Python Developer Roadmap
  {
    id: 'roadmap-python-developer',
    title: 'Lộ trình Python Developer',
    slug: 'python-developer',
    description: 'Lộ trình để trở thành Python Developer. Từ cơ bản đến nâng cao, bao gồm web development, data analysis, và automation.',
    targetPosition: 'Python Developer',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 5,
    difficulty: 'intermediate',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'python-programming',
        courseTitle: 'Python Programming - Complete Course',
        orderIndex: 2,
        isRequired: true,
        estimatedWeeks: 8,
      },
      {
        courseSlug: 'php-mysql',
        courseTitle: 'PHP & MySQL - Web Development',
        orderIndex: 3,
        isRequired: false,
        estimatedWeeks: 5,
      },
    ],
    skills: [
      'Python Programming',
      'Object-Oriented Programming',
      'Web Development (Django/Flask)',
      'Data Analysis (Pandas, NumPy)',
      'Web Scraping',
      'Automation',
      'Git & GitHub',
      'RESTful API',
      'Testing',
      'Database (SQL)',
    ],
    outcomes: [
      'Xây dựng web applications với Python',
      'Phân tích và xử lý data với Pandas',
      'Automate tasks và workflows',
      'Develop RESTful API',
      'Write clean và maintainable code',
    ],
  },

  // 10. Modern Frontend Specialist (Next.js) Roadmap
  {
    id: 'roadmap-nextjs-specialist',
    title: 'Lộ trình Next.js Specialist',
    slug: 'nextjs-specialist',
    description: 'Lộ trình chuyên sâu về Next.js và React ecosystem. Phù hợp cho những ai muốn chuyên về modern frontend development.',
    targetPosition: 'Next.js/React Specialist',
    categoryId: '1',
    categoryName: 'Lập trình',
    departmentId: '1',
    departmentName: 'Phòng Công nghệ',
    isActive: true,
    estimatedMonths: 4,
    difficulty: 'intermediate',
    courses: [
      {
        courseSlug: 'git-github',
        courseTitle: 'Git & GitHub - Version Control Mastery',
        orderIndex: 1,
        isRequired: true,
        estimatedWeeks: 2,
      },
      {
        courseSlug: 'vuejs-framework',
        courseTitle: 'Vue.js 3 - Progressive JavaScript Framework',
        orderIndex: 2,
        isRequired: false,
        estimatedWeeks: 4,
      },
      {
        courseSlug: 'nextjs-typescript',
        courseTitle: 'Next.js 14 với TypeScript',
        orderIndex: 3,
        isRequired: true,
        estimatedWeeks: 6,
      },
    ],
    skills: [
      'Next.js 14',
      'React.js',
      'TypeScript',
      'Server Components',
      'App Router',
      'SEO Optimization',
      'Performance Optimization',
      'Git & GitHub',
      'Tailwind CSS',
      'API Routes',
    ],
    outcomes: [
      'Xây dựng ứng dụng web với Next.js 14',
      'Implement Server Components và SSR',
      'Tối ưu SEO và performance',
      'Deploy production-ready applications',
      'Work with modern React patterns',
    ],
  },
];

// Helper function to get roadmap by slug
export function getRoadmapBySlug(slug: string): MockRoadmap | undefined {
  return mockRoadmaps.find(r => r.slug === slug);
}

// Helper function to get roadmaps by category
export function getRoadmapsByCategory(categoryId: string): MockRoadmap[] {
  return mockRoadmaps.filter(r => r.categoryId === categoryId && r.isActive);
}

// Helper function to get roadmaps by difficulty
export function getRoadmapsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): MockRoadmap[] {
  return mockRoadmaps.filter(r => r.difficulty === difficulty && r.isActive);
}
