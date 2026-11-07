import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../services/api';
import { IInterviewReport } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Award, 
  BarChart3, 
  Save, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Lightbulb,
  FileCheck2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

type InterviewStage = 'setup' | 'eligibility' | 'aptitude' | 'technical' | 'hr' | 'report';

export interface TargetRoleOption {
  id: string;
  name: string;
  category: string;
  defaultSkills: string;
}

export const TARGET_ROLE_OPTIONS: TargetRoleOption[] = [
  // Software Development
  { id: 'fullstack', name: 'Full Stack Developer', category: 'Software Development', defaultSkills: 'JavaScript, TypeScript, React, Node.js, Express, MongoDB Atlas, REST API, Git' },
  { id: 'frontend', name: 'Frontend React / Next.js Engineer', category: 'Software Development', defaultSkills: 'JavaScript, TypeScript, React, Next.js, Tailwind CSS, Redux, HTML5, CSS3' },
  { id: 'backend', name: 'Backend Node.js & Cloud Engineer', category: 'Software Development', defaultSkills: 'Node.js, Express, TypeScript, PostgreSQL, MongoDB, Redis, Docker, REST API' },
  { id: 'java', name: 'Java / Spring Boot Developer', category: 'Software Development', defaultSkills: 'Java, Spring Boot, Hibernate, Microservices, MySQL, REST API, Docker, Git' },
  { id: 'python', name: 'Python / Django / FastAPI Developer', category: 'Software Development', defaultSkills: 'Python, Django, FastAPI, PostgreSQL, Redis, Docker, Celery, REST API' },
  { id: 'sde', name: 'Software Development Engineer (General SDE)', category: 'Software Development', defaultSkills: 'Data Structures, Algorithms, C++, Java, OOP, System Design, Git' },
  
  // Cloud, DevOps & Infrastructure
  { id: 'devops', name: 'Cloud & DevOps Engineer', category: 'Cloud & Infrastructure', defaultSkills: 'Docker, Kubernetes, AWS, Linux, Terraform, CI/CD, Jenkins, Prometheus' },
  { id: 'cloud', name: 'AWS Cloud Solutions Architect / Engineer', category: 'Cloud & Infrastructure', defaultSkills: 'AWS (EC2, S3, Lambda), Terraform, Cloud Architecture, Docker, Linux, Networking' },
  
  // AI, Data & Analytics
  { id: 'ai-llm', name: 'AI & Generative AI / LLM Application Engineer', category: 'AI & Data Science', defaultSkills: 'Python, OpenAI API, LangChain, Vector Databases, Prompt Engineering, RAG, FastAPI' },
  { id: 'data-scientist', name: 'Data Scientist & Machine Learning Engineer', category: 'AI & Data Science', defaultSkills: 'Python, Scikit-Learn, PyTorch, Pandas, NumPy, Machine Learning, SQL, Statistics' },
  { id: 'data-analyst', name: 'Data Analyst & Business Intelligence', category: 'AI & Data Science', defaultSkills: 'SQL, Python, Pandas, Tableau, Power BI, Excel, Data Visualization, Statistics' },
  { id: 'data-engineer', name: 'Data Engineer / Database Administrator', category: 'AI & Data Science', defaultSkills: 'SQL, Python, Apache Spark, PostgreSQL, ETL Pipelines, Kafka, Snowflake' },
  
  // Mobile, Security, QA, Product & Design
  { id: 'mobile', name: 'Mobile App Developer (React Native / Android / iOS)', category: 'Mobile & QA', defaultSkills: 'React Native, JavaScript, TypeScript, Mobile UI, Redux, REST API, iOS, Android' },
  { id: 'qa', name: 'QA Automation Test Engineer', category: 'Mobile & QA', defaultSkills: 'Selenium, Cypress, Playwright, JavaScript, Test Automation, Jest, Postman, CI/CD' },
  { id: 'security', name: 'Cybersecurity Analyst & Security Engineer', category: 'Security & Systems', defaultSkills: 'Network Security, Linux, OWASP Top 10, Cryptography, Penetration Testing, SIEM' },
  { id: 'systems', name: 'Systems & Embedded Software Engineer', category: 'Security & Systems', defaultSkills: 'C, C++, Data Structures, Linux Kernel, RTOS, Operating Systems, Memory Management' },
  { id: 'ui-ux', name: 'UI / UX & Product Designer', category: 'Product & Design', defaultSkills: 'Figma, Wireframing, Prototyping, User Research, Design Systems, Usability Testing' },
  { id: 'pm', name: 'Technical Product Manager (TPM)', category: 'Product & Design', defaultSkills: 'Product Strategy, Agile / Scrum, User Stories, Roadmapping, KPI Metrics, JIRA' }
];

export const MockInterviewPage: React.FC = () => {
  const { isAuthenticated, openAuthModal, getGuestDraft, saveGuestDraft } = useAuth();
  const navigate = useNavigate();

  // Selected Target Role from shortcuts
  const prefilledRole = getGuestDraft('interview_target_role', 'Full Stack Developer');

  // Stage & Setup State
  const [stage, setStage] = useState<InterviewStage>('setup');
  const [targetRole, setTargetRole] = useState(prefilledRole);
  const [difficulty, setDifficulty] = useState('Fresher');
  const [skillsInput, setSkillsInput] = useState(() => {
    const matched = TARGET_ROLE_OPTIONS.find(r => r.name === prefilledRole);
    return matched ? matched.defaultSkills : 'JavaScript, TypeScript, React, Node.js, Express, SQL, Git';
  });
  const [isLoading, setIsLoading] = useState(false);

  // Round 1: Eligibility Data
  const [eligibilityData, setEligibilityData] = useState<any>(null);

  // Round 2: Aptitude MCQs State
  const [aptitudeQuestions, setAptitudeQuestions] = useState<any[]>([]);
  const [currentAptitudeIndex, setCurrentAptitudeIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 mins
  const [aptitudeScoreResult, setAptitudeScoreResult] = useState<any>(null);

  // Round 3 & 4: Technical and HR Conversational AI State
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'ai' | 'user'; message: string; feedback?: string }>>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [instantFeedback, setInstantFeedback] = useState<string | null>(null);

  // Final Scorecard Report
  const [finalReport, setFinalReport] = useState<IInterviewReport | null>(null);
  const [reportSaved, setReportSaved] = useState(false);

  // Audio / Mic / Camera State
  const [isMicActive, setIsMicActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const isMicActiveRef = useRef(false);
  const baseAnswerRef = useRef('');
  const accumulatedSpeechRef = useRef('');

  // Handle switching target role with automatic skills prefill
  const handleTargetRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    const roleOpt = TARGET_ROLE_OPTIONS.find(r => r.name === newRole);
    if (roleOpt) {
      setSkillsInput(roleOpt.defaultSkills);
    }
  };

  // Safe Speech Recognition Teardown
  const stopMic = () => {
    isMicActiveRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored
      }
    }
    setIsMicActive(false);
    setInterimTranscript('');
  };

  // Toggle Mic (High-Accuracy STT without word repetition)
  const toggleMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isMicActive) {
      stopMic();
      return;
    }

    try {
      // Teardown any existing instance
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      setSpeechError(null);
      baseAnswerRef.current = candidateAnswer;
      accumulatedSpeechRef.current = '';
      setInterimTranscript('');

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        isMicActiveRef.current = true;
        setIsMicActive(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalizedNew = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const transcript = res[0]?.transcript || '';
          if (res.isFinal) {
            finalizedNew += transcript.trim() + ' ';
          } else {
            interim += transcript;
          }
        }

        if (finalizedNew) {
          accumulatedSpeechRef.current += finalizedNew;
        }

        setInterimTranscript(interim);

        // Smoothly combine base text + accumulated speech + current interim preview
        const base = baseAnswerRef.current ? baseAnswerRef.current.trim() + ' ' : '';
        const combined = (base + accumulatedSpeechRef.current + interim).trim();
        setCandidateAnswer(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
          stopMic();
        } else if (event.error === 'network') {
          setSpeechError('Voice recognition network timeout. Please check your internet connection.');
          stopMic();
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice recognition encountered an issue (${event.error}). Please try again.`);
          stopMic();
        }
      };

      recognition.onend = () => {
        // If user is still actively speaking, smoothly restart to avoid Chrome auto-silence cutoff
        if (isMicActiveRef.current) {
          try {
            baseAnswerRef.current = (baseAnswerRef.current ? baseAnswerRef.current.trim() + ' ' : '') + accumulatedSpeechRef.current;
            accumulatedSpeechRef.current = '';
            recognition.start();
          } catch {
            stopMic();
          }
        } else {
          stopMic();
        }
      };

      recognition.start();
      isMicActiveRef.current = true;
      setIsMicActive(true);
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Could not activate microphone. Please verify device permissions and try again.');
      stopMic();
    }
  };

  // Cleanup mic & camera on unmount
  useEffect(() => {
    return () => {
      stopMic();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Web Speech Audio Synthesizer
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };



  // Toggle Camera
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (e) {
        alert('Could not access camera. Please allow camera permissions.');
      }
    }
  };

  // Quick Action: Insert Answer Template Suggestion
  const insertAnswerTemplate = (templateType: 'star' | 'arch' | 'challenges') => {
    if (templateType === 'star') {
      setCandidateAnswer(prev => (prev ? prev + '\n\n' : '') + 'Situation: In my recent project...\nTask: I was responsible for...\nAction: I engineered...\nResult: As a result, performance increased by...');
    } else if (templateType === 'arch') {
      setCandidateAnswer(prev => (prev ? prev + '\n\n' : '') + 'Architectural Approach: I structured the system into modular microservices using...\nTrade-offs Considered: We chose caching over direct database reads to minimize latency.\nScalability: The system handles peak loads with 99.9% uptime.');
    } else {
      setCandidateAnswer(prev => (prev ? prev + '\n\n' : '') + 'Technical Challenge: One key bottleneck was query latency.\nResolution: Resolved by implementing indexing and asynchronous workers.\nOutcome: Reduced query execution time by 40%.');
    }
  };

  // Step 1: Start Interview -> Eligibility Check
  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const parsedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/interviews/eligibility-check', {
        targetRole,
        candidateSkills: parsedSkills
      });

      if (res.data?.success) {
        setEligibilityData(res.data.data);
        setStage('eligibility');
      }
    } catch (e: any) {
      alert(`Failed to start eligibility check: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Proceed to Round 2 (Aptitude)
  const handleProceedToAptitude = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/interviews/aptitude-questions', {
        targetRole,
        difficulty
      });

      if (res.data?.success && res.data?.data) {
        const qList = res.data.data.questions || (Array.isArray(res.data.data) ? res.data.data : []);
        setAptitudeQuestions(qList);
        setSelectedAnswers(new Array(qList.length || 10).fill(-1));
        setCurrentAptitudeIndex(0);
        setStage('aptitude');
      }
    } catch (e: any) {
      alert(`Failed to load aptitude test: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Round 2 Aptitude MCQs
  const handleSubmitAptitude = async () => {
    setIsLoading(true);
    try {
      const answersPayload = aptitudeQuestions.map((q, idx) => ({
        questionId: q.id,
        category: q.category,
        selectedOption: selectedAnswers[idx]
      }));

      const res = await api.post('/interviews/aptitude-evaluate', {
        targetRole,
        answers: answersPayload
      });

      if (res.data?.success) {
        setAptitudeScoreResult(res.data.data);
        // Start Technical Round
        handleStartTechnicalRound();
      }
    } catch (e: any) {
      alert(`Failed to evaluate aptitude round: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Start Technical Round
  const handleStartTechnicalRound = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/interviews/next-question', {
        targetRole,
        roundType: 'technical',
        questionIndex: 1,
        conversationHistory: []
      });

      if (res.data?.success) {
        setCurrentQuestionText(res.data.data.question);
        setCurrentQuestionIndex(1);
        setConversationHistory([{ role: 'ai', message: res.data.data.question }]);
        setStage('technical');
        speakText(res.data.data.question);
      }
    } catch (e: any) {
      alert(`Failed to initiate technical round: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer in Technical Round Turn
  const handleSubmitTechnicalTurn = async () => {
    if (!candidateAnswer.trim()) return;

    stopMic();

    setIsLoading(true);
    try {
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user' as const, message: candidateAnswer }
      ];

      const res = await api.post('/interviews/next-question', {
        targetRole,
        roundType: 'technical',
        questionIndex: currentQuestionIndex + 1,
        candidateAnswer,
        conversationHistory: updatedHistory
      });

      if (res.data?.success) {
        if (res.data.data.instantFeedback) {
          setInstantFeedback(res.data.data.instantFeedback);
        }

        if (res.data.data.isComplete || currentQuestionIndex >= 3) {
          // Switch to Round 4: HR Round
          handleStartHRRound();
        } else {
          const nextQ = res.data.data.question;
          setCurrentQuestionText(nextQ);
          setCurrentQuestionIndex(prev => prev + 1);
          setCandidateAnswer('');
          setConversationHistory([
            ...updatedHistory,
            { role: 'ai', message: nextQ, feedback: res.data.data.instantFeedback }
          ]);
          speakText(nextQ);
        }
      }
    } catch (e: any) {
      alert(`Error processing response: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Start HR Round
  const handleStartHRRound = async () => {
    setIsLoading(true);
    setInstantFeedback(null);
    setCandidateAnswer('');
    try {
      const res = await api.post('/interviews/next-question', {
        targetRole,
        roundType: 'hr',
        questionIndex: 1,
        conversationHistory: []
      });

      if (res.data?.success) {
        const firstHRQ = res.data.data.question;
        setCurrentQuestionText(firstHRQ);
        setCurrentQuestionIndex(1);
        setConversationHistory([{ role: 'ai', message: firstHRQ }]);
        setStage('hr');
        speakText(firstHRQ);
      }
    } catch (e: any) {
      alert(`Failed to start HR round: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer in HR Round Turn
  const handleSubmitHRTurn = async () => {
    if (!candidateAnswer.trim()) return;

    stopMic();

    setIsLoading(true);
    try {
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user' as const, message: candidateAnswer }
      ];

      const res = await api.post('/interviews/next-question', {
        targetRole,
        roundType: 'hr',
        questionIndex: currentQuestionIndex + 1,
        candidateAnswer,
        conversationHistory: updatedHistory
      });

      if (res.data?.success) {
        if (res.data.data.isComplete || currentQuestionIndex >= 2) {
          // Generate Final Scorecard Report
          handleGenerateFinalReport();
        } else {
          const nextQ = res.data.data.question;
          setCurrentQuestionText(nextQ);
          setCurrentQuestionIndex(prev => prev + 1);
          setCandidateAnswer('');
          setConversationHistory([
            ...updatedHistory,
            { role: 'ai', message: nextQ, feedback: res.data.data.instantFeedback }
          ]);
          speakText(nextQ);
        }
      }
    } catch (e: any) {
      alert(`Error submitting HR answer: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5: Final Scorecard Generation
  const handleGenerateFinalReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/interviews/generate-report', {
        targetRole,
        difficulty,
        aptitudeScore: aptitudeScoreResult,
        technicalTurns: conversationHistory.filter(h => h.role === 'user').length,
        hrTurns: 2
      });

      if (res.data?.success && res.data?.data) {
        setFinalReport(res.data.data);
        setStage('report');
      }
    } catch (e: any) {
      alert(`Failed to compile interview report: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Save Scorecard to Cloud (Auth required)
  const handleSaveReportToCloud = async () => {
    if (!isAuthenticated) {
      openAuthModal('Sign up to save your interview scorecard to your candidate dashboard.', handleSaveReportToCloud);
      return;
    }

    if (!finalReport) return;

    setIsLoading(true);
    try {
      const res = await api.post('/interviews/reports', finalReport);
      if (res.data?.success) {
        setReportSaved(true);
      }
    } catch (e: any) {
      console.error('Failed to save interview report:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">AI Interview Studio</Badge>
            <Badge variant="success" size="sm">4-Stage Simulation</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI interactive Mock Interview
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            4-Round Comprehensive Placement Simulation: Eligibility ➔ Aptitude MCQ ➔ Technical AI ➔ HR Round.
          </p>
        </div>

        {/* Stage Progress Indicator */}
        <div className="flex items-center gap-2">
          {['setup', 'eligibility', 'aptitude', 'technical', 'hr', 'report'].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                stage === s ? 'w-8 bg-brand-400 shadow-md shadow-brand-500/30' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STAGE 0: SETUP */}
      {stage === 'setup' && (
        <Card className="max-w-2xl mx-auto p-8 bg-slate-900/90 border-slate-800 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Configure Interview Parameters</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Select Target Engineering Role & Experience</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Target Role *</label>
                <span className="text-[11px] text-brand-400">18+ In-Demand Technical Roles</span>
              </div>
              <select
                value={targetRole}
                onChange={e => handleTargetRoleChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-400 font-medium"
              >
                {Array.from(new Set(TARGET_ROLE_OPTIONS.map(r => r.category))).map(category => (
                  <optgroup key={category} label={category} className="bg-slate-900 text-slate-400 font-semibold">
                    {TARGET_ROLE_OPTIONS.filter(r => r.category === category).map(roleOpt => (
                      <option key={roleOpt.id} value={roleOpt.name} className="text-white py-1">
                        {roleOpt.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Quick Role Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Popular Quick Roles:</span>
                <span className="text-[10px] text-slate-500">Auto-loads recommended skills profile</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Full Stack Developer', 'Frontend React / Next.js Engineer', 'Backend Node.js & Cloud Engineer', 'Java / Spring Boot Developer', 'Cloud & DevOps Engineer', 'AI & Generative AI / LLM Application Engineer', 'Data Scientist & Machine Learning Engineer'].map(pRole => (
                  <button
                    key={pRole}
                    type="button"
                    onClick={() => handleTargetRoleChange(pRole)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                      targetRole === pRole
                        ? 'bg-brand-500/20 border-brand-400 text-brand-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {pRole}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Candidate Experience Tier</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-400"
              >
                <option value="Fresher">Entry Level / Placement Track (0 Years)</option>
                <option value="Intermediate">Mid-Level Engineer (1 - 3 Years)</option>
                <option value="Advanced">Senior Engineer (3+ Years)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Candidate Skills Profile (for Eligibility Check) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const matched = TARGET_ROLE_OPTIONS.find(r => r.name === targetRole);
                    if (matched) setSkillsInput(matched.defaultSkills);
                  }}
                  className="text-[11px] text-brand-400 hover:text-brand-300 hover:underline"
                >
                  Reset to Role Defaults
                </button>
              </div>
              <input
                type="text"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="e.g. JavaScript, TypeScript, React, Node.js, Express, SQL, Git, Docker, AWS"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* 4 Rounds Explanation */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-200">4-Round Placement Evaluation Flow:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>1. Eligibility Prerequisites Check</div>
              <div>2. Aptitude & Reasoning MCQs</div>
              <div>3. AI Technical Interview</div>
              <div>4. Behavioral & HR Evaluation</div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartInterview}
            isLoading={isLoading}
            className="w-full mt-6 text-sm font-bold shadow-lg shadow-brand-500/25"
          >
            <Play className="w-4 h-4" />
            Begin Simulation
          </Button>
        </Card>
      )}

      {/* STAGE 1: ROUND 1 (ELIGIBILITY CHECK) */}
      {stage === 'eligibility' && eligibilityData && (
        <Card className="max-w-2xl mx-auto p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={eligibilityData.passed ? 'success' : 'danger'} size="md">
              Round 1: Eligibility Assessment
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {eligibilityData.passed ? 'Eligibility Prerequisites Satisfied' : 'Foundational Prerequisites Incomplete'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {eligibilityData.feedback}
          </p>

          {eligibilityData.missingSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 space-y-3">
              <span className="text-xs font-semibold text-amber-400 block">Areas Requiring Attention:</span>
              <div className="flex flex-wrap gap-2">
                {eligibilityData.missingSkills.map((s: string, i: number) => (
                  <Badge key={i} variant="warning" size="sm">⚠️ {s}</Badge>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-2">Recommended Learning Resources:</span>
                {eligibilityData.recommendedResources?.map((res: any, idx: number) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1.5 mb-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {res.resourceName} ({res.topic})
                  </a>
                ))}
              </div>
            </div>
          )}

          {eligibilityData.passed ? (
            <Button variant="primary" size="lg" onClick={handleProceedToAptitude} isLoading={isLoading} className="w-full font-bold shadow-lg shadow-brand-500/25">
              Proceed to Round 2 (Timed Aptitude MCQs)
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="secondary" size="md" onClick={() => setStage('setup')} className="w-full">
              Update Skills Profile & Retry
            </Button>
          )}
        </Card>
      )}

      {/* STAGE 2: ROUND 2 (APTITUDE MCQs) */}
      {stage === 'aptitude' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Round 2: Aptitude & Reasoning</Badge>
              <span className="text-xs text-slate-400 font-mono">
                Question {currentAptitudeIndex + 1} of {aptitudeQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
              <Clock className="w-4 h-4" />
              <span>10:00 Timed Round</span>
            </div>
          </div>

          {aptitudeQuestions[currentAptitudeIndex] && (
            <Card className="p-8 space-y-6 bg-slate-900/90 shadow-2xl">
              <h3 className="text-base font-bold text-white leading-relaxed">
                {aptitudeQuestions[currentAptitudeIndex].questionText || aptitudeQuestions[currentAptitudeIndex].question}
              </h3>

              <div className="space-y-3">
                {aptitudeQuestions[currentAptitudeIndex].options.map((opt: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => {
                      const updated = [...selectedAnswers];
                      updated[currentAptitudeIndex] = optIdx;
                      setSelectedAnswers(updated);
                    }}
                    className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all ${
                      selectedAnswers[currentAptitudeIndex] === optIdx
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentAptitudeIndex === 0}
                  onClick={() => setCurrentAptitudeIndex(p => p - 1)}
                >
                  Previous
                </Button>

                {currentAptitudeIndex < aptitudeQuestions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentAptitudeIndex(p => p + 1)}
                  >
                    Next Question ➔
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitAptitude}
                    isLoading={isLoading}
                    className="font-bold shadow-lg shadow-brand-500/25"
                  >
                    Submit & Proceed to Technical Round
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* STAGE 3 & 4: ROUND 3 & 4 (TECHNICAL & HR AI INTERVIEWS) */}
      {(stage === 'technical' || stage === 'hr') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: AI Interviewer Persona & Question (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between">
              <Badge variant="purple" size="md">
                {stage === 'technical' ? 'Round 3: AI Technical Interview' : 'Round 4: AI Behavioral & HR Round'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Question #{currentQuestionIndex}</span>
            </div>

            {/* AI Interlocutor Card */}
            <Card className="p-6 bg-slate-900 border-brand-500/30 shadow-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {stage === 'technical' ? 'AI Lead Technical Interviewer' : 'AI HR & Leadership Assessor'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Evaluating clarity, architectural depth, and structured communication.
                  </p>
                </div>
              </div>

              {/* Question Text Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-medium leading-relaxed">
                "{currentQuestionText}"
              </div>

              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => speakText(currentQuestionText)}
                  className="text-xs text-slate-400 hover:text-brand-400 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Replay Audio
                </button>
              </div>
            </Card>

            {/* Instant AI Feedback Box (if received) */}
            {instantFeedback && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-emerald-300 animate-fadeIn space-y-1">
                <div className="font-bold text-emerald-400">Interviewer Instant Feedback:</div>
                <p>{instantFeedback}</p>
              </div>
            )}

            {/* Candidate Answer Box */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Answer
                </label>
                <div className="flex items-center gap-2">
                  {candidateAnswer && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        stopMic();
                        setCandidateAnswer('');
                        baseAnswerRef.current = '';
                        accumulatedSpeechRef.current = '';
                        setInterimTranscript('');
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400 gap-1 px-2"
                      title="Clear text"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={isMicActive ? 'danger' : 'secondary'}
                    size="sm"
                    onClick={toggleMic}
                    className={`text-xs gap-1.5 transition-all ${isMicActive ? 'animate-pulse ring-2 ring-rose-500/50' : ''}`}
                  >
                    {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-400" />}
                    {isMicActive ? 'Stop Listening' : 'Speak Answer'}
                  </Button>
                </div>
              </div>

              {/* Speech Error Banner */}
              {speechError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{speechError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpeechError(null)}
                    className="text-xs text-rose-400 hover:text-white font-medium ml-2"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Active Dictation Live Feedback Pill */}
              {isMicActive && (
                <div className="p-3 rounded-xl bg-slate-950 border border-brand-500/40 text-xs flex flex-col gap-1.5 animate-fadeIn shadow-lg shadow-brand-500/10">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-brand-300 font-semibold">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      Microphone active — Speak your answer clearly...
                    </span>
                    <span className="text-[10px] text-slate-400">Continuous Dictation</span>
                  </div>
                  {interimTranscript ? (
                    <div className="text-slate-300 italic text-[11px] bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                      Transcribing: <span className="text-white font-medium not-italic">"{interimTranscript}"</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500">Listening for speech... You can speak in full sentences.</span>
                  )}
                </div>
              )}

              {/* Answer Structuring Suggestions Chips */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-semibold text-brand-400 block mb-1.5">
                  💡 Structure Suggestions (Click to insert template):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertAnswerTemplate('star')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    + STAR Framework (Situation, Task, Action, Result)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAnswerTemplate('arch')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    + Architecture & Scalability
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAnswerTemplate('challenges')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    + Bottleneck Resolution
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={candidateAnswer}
                onChange={e => setCandidateAnswer(e.target.value)}
                placeholder="Speak using 'Speak Answer' or type your structured technical explanation or architectural solution here..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 leading-relaxed font-sans"
              />

              <Button
                variant="primary"
                size="md"
                onClick={stage === 'technical' ? handleSubmitTechnicalTurn : handleSubmitHRTurn}
                isLoading={isLoading}
                disabled={!candidateAnswer.trim()}
                className="w-full font-bold shadow-lg shadow-brand-500/25"
              >
                Submit Answer & Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>

          </div>

          {/* Right Column: Optional Video Preview & Performance Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Optional Webcam Preview Box */}
            <Card className="p-5 bg-slate-900/90 border-slate-800 text-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-brand-400" />
                  Video Feed Preview
                </span>
                <span className="text-[10px] text-slate-500">100% Optional</span>
              </div>

              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                />
                {!isCameraActive && (
                  <div className="text-center p-4">
                    <CameraOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Camera preview is currently off</p>
                    <p className="text-[10px] text-slate-500 mt-1">Optional presentation aid</p>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCamera}
                  className="w-full text-xs"
                >
                  {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  {isCameraActive ? 'Turn Off Camera Preview' : 'Enable Camera Preview'}
                </Button>
              </div>
            </Card>

            {/* Live Metrics Card */}
            <Card className="p-5 bg-slate-900/90 text-xs space-y-3">
              <div className="font-bold text-white uppercase tracking-wider">Session Parameters:</div>
              <div className="flex justify-between text-slate-400">
                <span>Target Role:</span>
                <span className="text-white font-medium">{targetRole}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Round Progression:</span>
                <span className="text-brand-400 font-medium font-mono">{stage.toUpperCase()} ROUND</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Audio Engine:</span>
                <span className="text-emerald-400 font-medium">Browser Web Speech STT/TTS</span>
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* STAGE 5: FINAL SCORECARD REPORT */}
      {stage === 'report' && finalReport && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          
          <Card className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-brand-500/40 shadow-2xl">
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>Simulation Complete</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Candidate Placement Diagnostic Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Target Role: {finalReport.targetRole} • Difficulty: {finalReport.difficulty}
              </p>

              <div className="mt-6 inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Overall Placement Score</span>
                <span className="text-4xl font-black text-brand-400 font-mono">
                  {finalReport.overallScore}%
                </span>
                <div className="mt-1">
                  <Badge variant={finalReport.overallResult === 'Passed' ? 'success' : 'warning'} size="sm">
                    {finalReport.overallResult}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Score Grid Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Round 2: Aptitude</span>
                <span className="text-xl font-bold text-white font-mono">{finalReport.aptitudeScore?.overall || 85}%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Round 3: Technical AI</span>
                <span className="text-xl font-bold text-white font-mono">{finalReport.technicalScore}%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Round 4: HR & Behavioral</span>
                <span className="text-xl font-bold text-white font-mono">{finalReport.hrScore}%</span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {finalReport.strengths?.map((str: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Actionable Improvement Roadmap
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {finalReport.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-4 justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStage('setup')}
              >
                Practice Another Role
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveReportToCloud}
                isLoading={isLoading}
                disabled={reportSaved}
                className="font-bold shadow-lg shadow-brand-500/25"
              >
                <Save className="w-4 h-4" />
                {reportSaved ? 'Scorecard Saved to Cloud' : 'Save Scorecard to Dashboard'}
              </Button>
            </div>
          </Card>

        </div>
      )}

    </div>
  );
};
