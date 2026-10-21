import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { TailoredResume } from '../models/TailoredResume';
import { JobPreference } from '../models/JobPreference';
import { SavedJob } from '../models/SavedJob';
import { Interview } from '../models/Interview';
import { InterviewReport } from '../models/InterviewReport';

export const seedDemonstrationData = async (): Promise<void> => {
  try {
    console.log('[Skill2Hire Demo Seed] Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('[Skill2Hire Demo Seed] Cleaning up existing demonstration records...');
    const demoEmail = 'student.demo@skill2hire.edu';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      await Resume.deleteMany({ userId: existingUser._id });
      await TailoredResume.deleteMany({ userId: existingUser._id });
      await JobPreference.deleteMany({ userId: existingUser._id });
      await SavedJob.deleteMany({ userId: existingUser._id });
      await Interview.deleteMany({ userId: existingUser._id });
      await InterviewReport.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    console.log('[Skill2Hire Demo Seed] Creating demonstration user...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('DemoPass@2026', salt);

    const demoUser = await User.create({
      fullName: 'Aarav Sharma',
      email: demoEmail,
      passwordHash,
      targetRole: 'Full Stack MERN Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Git']
    });

    console.log(`[Skill2Hire Demo Seed] User created with ID: ${demoUser._id}`);

    // 1. Create Sample Resume in 'resumes' collection
    console.log('[Skill2Hire Demo Seed] Seeding resumes collection...');
    const sampleResume = await Resume.create({
      userId: demoUser._id,
      title: 'Aarav Sharma - Full Stack Resume',
      templateId: 'ats-modern',
      personalInfo: {
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        linkedin: 'linkedin.com/in/aaravsharma-dev',
        github: 'github.com/aaravsharma-dev',
        portfolio: 'aaravsharma.dev'
      },
      careerTarget: {
        targetRole: 'Full Stack MERN Developer',
        specialization: 'MERN Stack & Scalable Cloud APIs'
      },
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'National Institute of Technology (NIT)',
          university: 'NIT',
          startYear: '2022',
          endYear: '2026',
          cgpaOrPercentage: '8.8 / 10.0'
        }
      ],
      skills: {
        programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
        frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
        libraries: ['Redux Toolkit', 'Tailwind CSS', 'Mongoose'],
        databases: ['MongoDB Atlas', 'PostgreSQL'],
        tools: ['Git', 'GitHub', 'Postman', 'VS Code'],
        cloud: ['AWS (S3, EC2)', 'Vercel', 'Render'],
        otherTechnologies: ['RESTful APIs', 'Microservices', 'JWT Authentication', 'Agile']
      },
      projects: [
        {
          title: 'Skill2Hire — AI-Powered Career Platform',
          description: 'Engineered a student-centric career companion with 5 independent modules: ATS resume builder, resume tailor, job search, mock interview, and tech news.',
          technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB Atlas', 'OpenAI API'],
          responsibilities: [
            'Architected modular-monolith REST backend with JWT authentication and progressive registration flow.',
            'Implemented single-column ATS templates with measurable rule-based keyword compatibility scoring (88/100).',
            'Engineered 4-round mock interview with Web Speech STT/TTS and dynamic technical evaluation.'
          ],
          liveLink: 'https://skill2hire.dev',
          githubLink: 'https://github.com/aaravsharma-dev/Skill2Hire'
        },
        {
          title: 'CampusRecruit — Placement Management Portal',
          description: 'Developed a real-time placement portal enabling student applications, interview scheduling, and eligibility tracking.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
          responsibilities: [
            'Designed scalable MongoDB Atlas schemas supporting 2,000+ active student applicants.',
            'Built responsive dashboards resulting in 40% reduction in manual recruitment coordination time.'
          ]
        }
      ],
      experience: [
        {
          company: 'TechNovation Solutions',
          role: 'Full Stack Engineering Intern',
          location: 'Bengaluru, India',
          startDate: 'Jun 2025',
          endDate: 'Aug 2025',
          current: false,
          responsibilities: [
            'Optimized REST API query throughput by 30% through MongoDB aggregation pipelines and indexing.',
            'Collaborated with senior engineers to implement secure JWT refresh-token authentication flows.'
          ]
        }
      ],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2025' },
        { name: 'Meta Full-Stack Developer Certificate', issuer: 'Coursera / Meta', issueDate: '2024' }
      ],
      achievements: [
        { title: '1st Place Winner — University Hackathon 2025', description: 'Built an offline-first emergency response app within 36 hours.' }
      ],
      softSkills: ['Analytical Problem Solving', 'Agile Collaboration', 'Technical Communication'],
      languages: ['English (Fluent)', 'Hindi (Native)'],
      professionalSummary: 'High-achieving Computer Science undergraduate and Full Stack Developer with proven expertise in building responsive React applications and performant Node.js/Express microservices backed by MongoDB Atlas. Passionate about clean architecture, ATS optimization, and AI developer tooling.',
      atsScore: 88
    });

    // 2. Create Sample in 'tailored_resumes'
    console.log('[Skill2Hire Demo Seed] Seeding tailored_resumes collection...');
    await TailoredResume.create({
      userId: demoUser._id,
      targetRole: 'Senior React / Node.js Developer',
      jobDescription: 'Seeking a skilled Full Stack Engineer proficient in React, TypeScript, Node.js, and MongoDB. Experience with AWS cloud pipelines and automated testing is preferred.',
      jobRequirements: 'React, TypeScript, Node.js, Express, MongoDB, AWS, REST APIs',
      originalResumeText: 'Experienced in MERN stack web development...',
      tailoredData: sampleResume.toObject(),
      matchScoreBefore: 74,
      matchScoreAfter: 91,
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'REST APIs'],
      missingKeywords: ['Docker Containerization', 'Kubernetes'],
      skillGaps: ['Docker Containerization', 'Kubernetes Cluster Management'],
      changesSummary: [
        'Aligned summary with high-scale React/Node.js enterprise requirements',
        'Highlighted full-stack performance metrics in project section',
        'Flagged Kubernetes as a candidate skill gap without hallucinating experience'
      ]
    });

    // 3. Create Sample in 'job_preferences'
    console.log('[Skill2Hire Demo Seed] Seeding job_preferences collection...');
    await JobPreference.create({
      userId: demoUser._id,
      targetRole: 'Full Stack MERN Developer',
      preferredLocation: 'Bengaluru / Remote',
      workMode: 'Hybrid',
      experienceLevel: 'Fresher',
      salaryMin: 600000,
      salaryMax: 1000000,
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS']
    });

    // 4. Create Sample in 'saved_jobs'
    console.log('[Skill2Hire Demo Seed] Seeding saved_jobs collection...');
    await SavedJob.create({
      userId: demoUser._id,
      jobId: 'job-101',
      title: 'Junior Full Stack Developer',
      company: 'InnovateTech Labs',
      location: 'Bengaluru, India',
      workMode: 'Hybrid',
      salary: '₹6,00,000 - ₹9,00,000',
      description: 'Looking for an enthusiastic MERN full stack developer to build high-scale customer-facing portals.',
      source: 'Skill2Hire Verified Partner',
      applicationUrl: 'https://careers.google.com',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Git'],
      matchPercentage: 94,
      matchingSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Git'],
      missingSkills: ['Docker'],
      matchReason: 'Strong alignment with your core technical skills (React, Node.js, TypeScript) and preferred work mode.'
    });

    // 5. Create Sample in 'interviews' & 'interview_reports'
    console.log('[Skill2Hire Demo Seed] Seeding interviews and interview_reports collections...');
    const demoInterview = await Interview.create({
      userId: demoUser._id,
      interviewType: 'Role-Based',
      targetRole: 'Full Stack MERN Developer',
      difficulty: 'Fresher',
      status: 'Completed',
      currentRound: 'Completed'
    });

    await InterviewReport.create({
      userId: demoUser._id,
      interviewId: demoInterview._id,
      targetRole: 'Full Stack MERN Developer',
      eligibilityResult: {
        passed: true,
        missingSkills: [],
        weakAreas: []
      },
      aptitudeScore: {
        overall: 80,
        quantitative: 85,
        logical: 80,
        verbal: 75,
        dataInterpretation: 80,
        passed: true
      },
      technicalScore: 88,
      hrScore: 90,
      overallScore: 86,
      communicationAssessment: {
        clarityScore: 90,
        relevanceScore: 88,
        structureScore: 85,
        feedback: 'Demonstrated clear technical articulation, structured STAR reasoning, and strong problem-solving composure.'
      },
      strengths: [
        'In-depth knowledge of React component lifecycle and state optimization',
        'Strong understanding of RESTful API design and MongoDB indexing',
        'Clear and confident communication during behavioral questions'
      ],
      weaknesses: [
        'Could delve deeper into distributed caching trade-offs (e.g., Redis invalidation)'
      ],
      skillGaps: ['Redis Caching', 'Docker Swarm'],
      improvementSuggestions: [
        'Practice discussing architectural bottlenecks and trade-offs in distributed systems.'
      ],
      recommendedLearningResources: [
        {
          topic: 'System Design Fundamentals',
          resourceName: 'ByteByteGo System Design Primer',
          url: 'https://github.com/donnemartin/system-design-primer',
          type: 'Open Source Guide'
        }
      ],
      overallResult: 'Passed'
    });

    console.log('\n============================================================');
    console.log('✅ DEMO SEED COMPLETED SUCCESSFULLY FOR PROJECT VIVA!');
    console.log('============================================================');
    console.log('Demonstration Credentials:');
    console.log(`Email:    ${demoEmail}`);
    console.log('Password: DemoPass@2026');
    console.log('\nMongoDB Atlas Database: skill2hire');
    console.log('Populated Collections:');
    console.log('  1. users');
    console.log('  2. resumes');
    console.log('  3. tailored_resumes');
    console.log('  4. job_preferences');
    console.log('  5. saved_jobs');
    console.log('  6. interviews');
    console.log('  7. interview_reports');
    console.log('============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedDemonstrationData();
}
