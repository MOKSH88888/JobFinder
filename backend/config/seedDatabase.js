const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const Job = require('../models/Job');
const Admin = require('../models/Admin');

// Sample users with complete data
const sampleUsers = [
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@techmail.com',
    password: 'User@1234',
    phone: '+91-9823456710',
    gender: 'Male',
    experience: 5,
    description: 'Full-stack developer with 5 years of experience building scalable web applications. Passionate about clean code and modern architecture patterns.',
    skills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'MongoDB', 'Express.js', 'REST API', 'Git', 'Docker', 'AWS', 'Redux', 'Jest']
  },
  {
    name: 'Priya Krishnan',
    email: 'priya.krishnan@devmail.com',
    password: 'User@1234',
    phone: '+91-9823456711',
    gender: 'Female',
    experience: 4,
    description: 'Data Engineer specializing in Python and cloud technologies. Experienced in building ETL pipelines and data analytics solutions.',
    skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'AWS', 'Data Analysis', 'Machine Learning', 'Pandas', 'NumPy', 'Apache Spark', 'SQL', 'ETL']
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@codemail.com',
    password: 'User@1234',
    phone: '+91-9823456712',
    gender: 'Male',
    experience: 7,
    description: 'Senior Backend Engineer with expertise in microservices architecture and cloud-native applications. Led multiple teams in Agile environments.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'Docker', 'Jenkins', 'MySQL', 'Redis', 'Kafka', 'AWS', 'CI/CD', 'Design Patterns']
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@designmail.com',
    password: 'User@1234',
    phone: '+91-9823456713',
    gender: 'Female',
    experience: 3,
    description: 'Frontend Developer and UI/UX enthusiast with a strong eye for design. Creating beautiful, accessible, and performant user interfaces.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'UI/UX Design', 'Figma', 'Adobe XD', 'Responsive Design', 'Accessibility', 'Tailwind CSS', 'SASS']
  },
  {
    name: 'Aditya Sharma',
    email: 'aditya.sharma@webmail.com',
    password: 'User@1234',
    phone: '+91-9823456714',
    gender: 'Male',
    experience: 4,
    description: 'Backend Developer proficient in PHP and modern web frameworks. Strong understanding of MVC architecture and database optimization.',
    skills: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'REST API', 'Redis', 'jQuery', 'Composer', 'PHPUnit', 'Git', 'Linux']
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@freshmail.com',
    password: 'User@1234',
    phone: '+91-9823456715',
    gender: 'Female',
    experience: 0,
    description: 'Recent Computer Science graduate from IIT Delhi. Strong foundation in algorithms and data structures. Eager to contribute to innovative projects.',
    skills: ['C++', 'Java', 'Python', 'Data Structures', 'Algorithms', 'OOP', 'Problem Solving', 'Git', 'MySQL', 'HTML', 'CSS']
  },
  {
    name: 'Vikram Rao',
    email: 'vikram.rao@cloudmail.com',
    password: 'User@1234',
    phone: '+91-9823456716',
    gender: 'Male',
    experience: 6,
    description: 'DevOps Engineer with extensive experience in cloud infrastructure and automation. Certified AWS Solutions Architect and Kubernetes Administrator.',
    skills: ['DevOps', 'AWS', 'Azure', 'Terraform', 'Ansible', 'CI/CD', 'Kubernetes', 'Docker', 'Jenkins', 'GitLab CI', 'Prometheus', 'Grafana', 'Linux']
  },
  {
    name: 'Divya Menon',
    email: 'divya.menon@mobilemail.com',
    password: 'User@1234',
    phone: '+91-9823456717',
    gender: 'Female',
    experience: 2,
    description: 'Mobile Developer passionate about creating seamless cross-platform experiences. Published 3+ apps with 100K+ downloads on Play Store.',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile Development', 'Firebase', 'Redux', 'iOS', 'Android', 'REST API', 'Git', 'App Store Optimization']
  },
  {
    name: 'Rohan Chatterjee',
    email: 'rohan.chatterjee@qamail.com',
    password: 'User@1234',
    phone: '+91-9823456718',
    gender: 'Male',
    experience: 3,
    description: 'QA Engineer specialized in automation testing and ensuring software quality. ISTQB certified with strong analytical skills.',
    skills: ['Selenium', 'Java', 'TestNG', 'Cucumber', 'API Testing', 'Postman', 'JMeter', 'Manual Testing', 'Agile', 'JIRA', 'SQL', 'Git']
  },
  {
    name: 'Kavya Pillai',
    email: 'kavya.pillai@datamail.com',
    password: 'User@1234',
    phone: '+91-9823456719',
    gender: 'Female',
    experience: 5,
    description: 'Data Scientist with expertise in machine learning and predictive analytics. Published research papers on deep learning applications.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'SQL', 'R', 'Statistics', 'NLP', 'Computer Vision', 'Scikit-learn']
  }
];

// Sample jobs with complete data
const sampleJobs = [
  {
    title: 'Senior Full Stack Developer (MERN Stack)',
    companyName: 'Infosys Limited',
    location: 'Bengaluru, Karnataka',
    salary: 2000000,
    experienceRequired: 5,
    jobType: 'Full-time',
    description: 'Infosys is seeking an experienced Full Stack Developer to join our digital transformation team. You will work on enterprise-grade applications serving millions of users globally. This role offers excellent growth opportunities and exposure to cutting-edge technologies in a collaborative environment.',
    requirements: [
      '5+ years of hands-on experience in MERN stack development',
      'Strong proficiency in React.js, Node.js, Express.js, and MongoDB',
      'Experience building and consuming RESTful APIs',
      'Knowledge of modern front-end build pipelines and tools',
      'Experience with cloud platforms (AWS/Azure) preferred',
      'Strong understanding of Agile/Scrum methodologies',
      'Excellent problem-solving and communication skills',
      'B.Tech/M.Tech in Computer Science or equivalent'
    ]
  },
  {
    title: 'Python Backend Developer',
    companyName: 'Tata Consultancy Services (TCS)',
    location: 'Hyderabad, Telangana',
    salary: 1400000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'TCS Digital is looking for talented Python developers to build scalable backend systems and microservices. Work with Fortune 500 clients on innovative projects while enjoying excellent work-life balance and continuous learning opportunities.',
    requirements: [
      '3+ years of Python development experience',
      'Strong expertise in Django or Flask framework',
      'Experience with PostgreSQL/MySQL databases',
      'Understanding of RESTful API design principles',
      'Knowledge of Docker and containerization',
      'Experience with version control (Git)',
      'Familiarity with CI/CD pipelines',
      'Good analytical and debugging skills'
    ]
  },
  {
    title: 'Lead Java Architect',
    companyName: 'Wipro Digital',
    location: 'Pune, Maharashtra',
    salary: 2800000,
    experienceRequired: 8,
    jobType: 'Full-time',
    description: 'Join Wipro Digital as a Lead Java Architect to design and implement enterprise-level microservices architecture. Lead technical teams, mentor developers, and drive architectural decisions for large-scale distributed systems. This is a leadership role with significant impact on product direction.',
    requirements: [
      '8+ years of Java enterprise application development',
      'Expert-level knowledge of Spring Boot and microservices',
      'Hands-on experience with Kubernetes and Docker orchestration',
      'Strong understanding of distributed systems and cloud architecture',
      'Experience with event-driven architecture (Kafka, RabbitMQ)',
      'Proven leadership and team mentoring abilities',
      'Excellent communication and stakeholder management skills',
      'AWS/Azure certification preferred'
    ]
  },
  {
    title: 'Frontend Developer (React)',
    companyName: 'Flipkart Internet Pvt Ltd',
    location: 'Bengaluru, Karnataka',
    salary: 1600000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Flipkart is looking for passionate Frontend Developers to build world-class e-commerce experiences. Work on high-traffic applications serving millions of Indian users daily. Enjoy a fast-paced startup culture within a leading Indian unicorn.',
    requirements: [
      '3+ years of modern frontend development experience',
      'Strong proficiency in React.js and JavaScript ES6+',
      'Experience with state management (Redux, Context API)',
      'Solid understanding of HTML5, CSS3, and responsive design',
      'Performance optimization and web vitals knowledge',
      'Experience with modern build tools (Webpack, Vite)',
      'Understanding of SEO and accessibility best practices',
      'Portfolio showcasing previous projects'
    ]
  },
  {
    title: 'PHP Laravel Developer',
    companyName: 'Tech Mahindra',
    location: 'Noida, Uttar Pradesh',
    salary: 1100000,
    experienceRequired: 4,
    jobType: 'Full-time',
    description: 'Tech Mahindra seeks experienced Laravel developers to maintain and enhance enterprise web applications for global clients. Work in a supportive environment with continuous upskilling opportunities and international exposure.',
    requirements: [
      '4+ years of PHP development experience',
      'Strong expertise in Laravel framework (v8+)',
      'Proficiency in MySQL database design and optimization',
      'Experience building secure RESTful APIs',
      'Knowledge of front-end technologies (Vue.js/React)',
      'Understanding of MVC architecture patterns',
      'Experience with version control systems (Git)',
      'Good understanding of OWASP security principles'
    ]
  },
  {
    title: 'Software Development Engineer - Trainee',
    companyName: 'Accenture Solutions Pvt Ltd',
    location: 'Mumbai, Maharashtra',
    salary: 450000,
    experienceRequired: 0,
    jobType: 'Internship',
    description: 'Accenture invites fresh graduates to join our comprehensive training program. Gain hands-on experience in software development, work on real projects, and build your career with one of the world\'s leading professional services companies. Excellent conversion opportunities for high performers.',
    requirements: [
      'B.Tech/B.E. in Computer Science or related field (2023/2024 batch)',
      'Strong programming fundamentals in any language (C++/Java/Python)',
      'Good understanding of data structures and algorithms',
      'Knowledge of object-oriented programming concepts',
      'Excellent problem-solving and analytical skills',
      'Eagerness to learn new technologies',
      'Good communication skills in English',
      'Minimum 60% marks in 10th, 12th, and graduation'
    ]
  },
  {
    title: 'Senior DevOps Engineer',
    companyName: 'Amazon Development Centre India',
    location: 'Gurugram, Haryana',
    salary: 2500000,
    experienceRequired: 6,
    jobType: 'Full-time',
    description: 'Amazon India is seeking experienced DevOps Engineers to manage and scale cloud infrastructure supporting Amazon\'s operations in India. Work with cutting-edge AWS technologies, automate everything, and ensure 99.99% uptime for critical services. Competitive compensation with Amazon stock options.',
    requirements: [
      '6+ years of DevOps/Site Reliability Engineering experience',
      'Expert-level knowledge of AWS services and architecture',
      'Strong experience with Infrastructure as Code (Terraform/CloudFormation)',
      'Proficiency in scripting languages (Python, Bash, Shell)',
      'Hands-on experience with Kubernetes and container orchestration',
      'Experience implementing CI/CD pipelines (Jenkins, GitLab CI)',
      'Knowledge of monitoring tools (Prometheus, Grafana, CloudWatch)',
      'AWS certifications (Solutions Architect/DevOps Engineer) required'
    ]
  },
  {
    title: 'React Native Mobile Developer',
    companyName: 'Paytm (One97 Communications)',
    location: 'Noida, Uttar Pradesh',
    salary: 1800000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Paytm is looking for talented React Native developers to build features for India\'s leading digital payments platform. Work on applications used by 350+ million users. Fast-paced fintech environment with excellent learning opportunities and competitive benefits.',
    requirements: [
      '3+ years of mobile app development experience',
      'Strong proficiency in React Native framework',
      'Experience with native iOS/Android development is a plus',
      'Knowledge of JavaScript/TypeScript and modern ES6+ features',
      'Experience integrating RESTful APIs and third-party libraries',
      'Published apps on Google Play Store and Apple App Store',
      'Understanding of mobile UI/UX best practices',
      'Experience with payment gateway integration preferred'
    ]
  },
  {
    title: 'QA Automation Engineer',
    companyName: 'HCL Technologies',
    location: 'Chennai, Tamil Nadu',
    salary: 1200000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'HCL is hiring QA Automation Engineers to ensure the quality and reliability of software products for global clients. Build automation frameworks, perform API testing, and work closely with development teams. ISTQB certification training provided.',
    requirements: [
      '3+ years of QA automation experience',
      'Strong knowledge of Selenium WebDriver and Java',
      'Experience with testing frameworks (TestNG, JUnit, Cucumber)',
      'Proficiency in API testing using Postman/RestAssured',
      'Knowledge of CI/CD integration for automated tests',
      'Experience with performance testing tools (JMeter) is a plus',
      'Strong analytical and problem-solving skills',
      'ISTQB certification preferred'
    ]
  },
  {
    title: 'Machine Learning Engineer',
    companyName: 'Microsoft India Development Center',
    location: 'Bengaluru, Karnataka',
    salary: 2200000,
    experienceRequired: 4,
    jobType: 'Full-time',
    description: 'Microsoft India R&D is seeking Machine Learning Engineers to build AI-powered features for Microsoft products. Work on cutting-edge ML projects, collaborate with global teams, and contribute to products used by billions. Excellent growth opportunities and world-class benefits.',
    requirements: [
      '4+ years of machine learning engineering experience',
      'Strong programming skills in Python and ML libraries',
      'Hands-on experience with TensorFlow, PyTorch, or scikit-learn',
      'Deep understanding of ML algorithms and neural networks',
      'Experience deploying ML models in production environments',
      'Knowledge of cloud ML platforms (Azure ML, AWS SageMaker)',
      'Strong mathematical foundation (Statistics, Linear Algebra)',
      'M.Tech/PhD in Computer Science or related field preferred'
    ]
  },
  {
    title: 'UI/UX Designer',
    companyName: 'Swiggy',
    location: 'Bengaluru, Karnataka',
    salary: 1500000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Swiggy is looking for creative UI/UX Designers to craft delightful user experiences for India\'s leading food delivery platform. Design intuitive interfaces, conduct user research, and iterate based on data. Work in a design-first culture with significant product impact.',
    requirements: [
      '3+ years of UI/UX design experience for mobile/web',
      'Expert proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating user-centered design process',
      'Experience conducting user research and usability testing',
      'Knowledge of design systems and component libraries',
      'Understanding of iOS/Android design guidelines',
      'Excellent visual design and typography skills',
      'Bachelor\'s degree in Design or related field'
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    companyName: 'ICICI Bank',
    location: 'Mumbai, Maharashtra',
    salary: 1600000,
    experienceRequired: 4,
    jobType: 'Full-time',
    description: 'ICICI Bank is hiring Cybersecurity Analysts to protect critical financial infrastructure and customer data. Monitor security threats, conduct vulnerability assessments, and implement security best practices. Work in India\'s leading private sector bank with excellent stability and benefits.',
    requirements: [
      '4+ years of information security experience',
      'Knowledge of security frameworks (ISO 27001, NIST)',
      'Experience with SIEM tools and security monitoring',
      'Understanding of network security and firewall management',
      'Familiarity with penetration testing and ethical hacking',
      'Knowledge of banking regulations and compliance (RBI guidelines)',
      'Certifications like CEH, CISSP, or CompTIA Security+ preferred',
      'B.Tech in Computer Science or related field'
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Admin.deleteMany({ isDefault: { $ne: true } }); // Keep default admin
    console.log('✅ Existing data cleared\n');

    // Create default admin if not exists
    console.log('👨‍💼 Creating default admin...');
    const existingAdmin = await Admin.findOne({ isDefault: true });
    let adminId;
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, salt);
      const defaultAdmin = new Admin({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        isDefault: true,
      });
      const savedAdmin = await defaultAdmin.save();
      adminId = savedAdmin._id;
      console.log(`✅ Default admin created: ${process.env.DEFAULT_ADMIN_USERNAME}\n`);
    } else {
      adminId = existingAdmin._id;
      console.log(`✅ Default admin already exists: ${existingAdmin.username}\n`);
    }

    // Create users
    console.log('👥 Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, salt)
      }))
    );
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create jobs
    console.log('💼 Creating sample jobs...');
    const jobsToInsert = sampleJobs.map(job => ({
      ...job,
      postedBy: adminId
    }));
    const createdJobs = await Job.insertMany(jobsToInsert);
    console.log(`✅ Created ${createdJobs.length} jobs\n`);

    // Apply some users to some jobs
    console.log('📝 Creating sample applications...');
    let applicationCount = 0;
    
    // User 0 applies to jobs 0, 1, 2
    for (let i = 0; i < 3; i++) {
      await Job.findByIdAndUpdate(createdJobs[i]._id, {
        $push: {
          applicants: {
            userId: createdUsers[0]._id,
            status: i === 0 ? 'Accepted' : i === 1 ? 'Pending' : 'Rejected'
          }
        }
      });
      await User.findByIdAndUpdate(createdUsers[0]._id, {
        $push: {
          appliedJobs: {
            jobId: createdJobs[i]._id
          }
        }
      });
      applicationCount++;
    }

    // User 1 applies to jobs 1, 3
    for (let i of [1, 3]) {
      await Job.findByIdAndUpdate(createdJobs[i]._id, {
        $push: {
          applicants: {
            userId: createdUsers[1]._id,
            status: 'Pending'
          }
        }
      });
      await User.findByIdAndUpdate(createdUsers[1]._id, {
        $push: {
          appliedJobs: {
            jobId: createdJobs[i]._id
          }
        }
      });
      applicationCount++;
    }

    // User 5 (fresher) applies to job 5 (internship)
    await Job.findByIdAndUpdate(createdJobs[5]._id, {
      $push: {
        applicants: {
          userId: createdUsers[5]._id,
          status: 'Pending'
        }
      }
    });
    await User.findByIdAndUpdate(createdUsers[5]._id, {
      $push: {
        appliedJobs: {
          jobId: createdJobs[5]._id
        }
      }
    });
    applicationCount++;

    console.log(`✅ Created ${applicationCount} sample applications\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Jobs: ${createdJobs.length}`);
    console.log(`   - Applications: ${applicationCount}`);
    console.log(`   - Admin: ${process.env.DEFAULT_ADMIN_USERNAME}`);
    console.log('\n💡 Test Credentials:');
    console.log(`   User: arjun.mehta@techmail.com / User@1234`);
    console.log(`   Admin: ${process.env.DEFAULT_ADMIN_USERNAME} / ${process.env.DEFAULT_ADMIN_PASSWORD}\n`);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
