import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Textarea } from '../../../components/ui/TextArea.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tab.jsx';
import {
  Brain,
  FileText,
  CheckSquare,
  HelpCircle,
  Send,
  Download,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select.jsx';
import { useState } from 'react';
import { useQuestionGenerator } from '../../../hooks/useQuestionGenerator.jsx';
import { useAnswerEvaluator } from '../../../hooks/useAnswerEvaluator.jsx';
import { useDoubtSolver } from '../../../hooks/useDoubtSolver.jsx';

export function AIAssistant() {
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [questionPaperType, setQuestionPaperType] = useState('mid-term');
  const [numQuestions, setNumQuestions] = useState('10');
  const [userAnswer, setUserAnswer] = useState('');
  const [doubt, setDoubt] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [doubtResponse, setDoubtResponse] = useState('');
  const [evalQuestion, setEvalQuestion] = useState('Explain the difference between Array and Linked List data structures. Discuss their advantages and disadvantages with time complexity analysis.');

  const { generateQuestions, isLoading: isGenerating, error: generationError } = useQuestionGenerator();
  const { evaluateAnswer, isLoading: isEvaluating, error: evaluationError } = useAnswerEvaluator();
  const { solveDoubt, isLoading: isSolvingDoubt, error: doubtError } = useDoubtSolver();

  const subjects = [
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Web Technologies',
  ];

  const handleGenerateQuestions = async () => {
    const questions = await generateQuestions(selectedSubject, questionPaperType, parseInt(numQuestions));
    if (questions) {
      setGeneratedQuestions(questions);
    }
  };

  const handleEvaluateAnswer = async () => {
    const result = await evaluateAnswer(evalQuestion, userAnswer);
    if (result) {
      setEvaluation(result);
    }
  };

  const handleAskDoubt = async () => {
    const answer = await solveDoubt(selectedSubject, doubt);
    if (answer) {
      setDoubtResponse(answer);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-muted-foreground">Generate questions, evaluate answers, and get help with doubts</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted text-muted-foreground">
            <TabsTrigger value="questions" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
              <FileText className="w-4 h-4" />
              Question Paper
            </TabsTrigger>
            <TabsTrigger value="evaluate" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
              <CheckSquare className="w-4 h-4" />
              Evaluate Answer
            </TabsTrigger>
            <TabsTrigger value="doubt" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
              <HelpCircle className="w-4 h-4" />
              Ask Doubt
            </TabsTrigger>
          </TabsList>

          {/* Question Paper Generator */}
          <TabsContent value="questions">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Generate Question Paper
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Subject
                    </label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border-border">
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject} className="focus:bg-muted focus:text-foreground">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Exam Type
                    </label>
                    <Select value={questionPaperType} onValueChange={setQuestionPaperType}>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border-border">
                        <SelectItem value="mid-term" className="focus:bg-muted focus:text-foreground">Mid-Term Exam</SelectItem>
                        <SelectItem value="end-term" className="focus:bg-muted focus:text-foreground">End-Term Exam</SelectItem>
                        <SelectItem value="quiz" className="focus:bg-muted focus:text-foreground">Quiz</SelectItem>
                        <SelectItem value="practice" className="focus:bg-muted focus:text-foreground">Practice Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Questions
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(e.target.value)}
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateQuestions}
                    className="w-full gap-2"
                    disabled={isGenerating}
                  >
                    <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate Questions'}
                  </Button>
                  {generationError && (
                    <p className="text-sm text-red-500 mt-2">{generationError}</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Generated Questions</h3>
                  {generatedQuestions.length > 0 && (
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-muted text-foreground border-border">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  )}
                </div>
                {generatedQuestions.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {generatedQuestions.map((q, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                        <p className="text-foreground font-semibold mb-2">{index + 1}. {q.questionText}</p>
                        <div className="pl-4 border-l-2 border-primary/50">
                          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Answer/Explanation:</span> {q.correctAnswer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-foreground font-medium">No questions generated yet</p>
                    <p className="text-sm mt-1">Configure settings and click generate</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Answer Evaluation */}
          <TabsContent value="evaluate">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  Submit Your Answer
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Question
                    </label>
                    <Textarea
                      rows={4}
                      value={evalQuestion}
                      onChange={(e) => setEvalQuestion(e.target.value)}
                      placeholder="Type or paste the question here..."
                      className="resize-none bg-background text-foreground border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Answer
                    </label>
                    <Textarea
                      placeholder="Type your answer here..."
                      rows={10}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="resize-none bg-background text-foreground border-border"
                    />
                  </div>

                  <Button onClick={handleEvaluateAnswer} className="w-full gap-2" disabled={isEvaluating}>
                    <CheckSquare className={`w-4 h-4 ${isEvaluating ? 'animate-pulse' : ''}`} />
                    {isEvaluating ? 'Evaluating...' : 'Evaluate Answer'}
                  </Button>
                  {evaluationError && (
                    <p className="text-sm text-red-500 mt-2">{evaluationError}</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">AI Evaluation</h3>
                {evaluation ? (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                      <p className="text-5xl font-bold text-green-600 dark:text-green-400">{evaluation.score}/100</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 mt-0.5 border-none">+</Badge>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-orange-600 dark:text-orange-400">!</span> Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-400 mt-0.5 border-none">→</Badge>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Detailed Feedback</h4>
                      <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <CheckSquare className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-foreground font-medium">No evaluation yet</p>
                    <p className="text-sm mt-1">Submit your answer to get AI feedback</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Doubt Solver */}
          <TabsContent value="doubt">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  Ask Your Doubt
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Subject
                    </label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border-border">
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject} className="focus:bg-muted focus:text-foreground">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Question
                    </label>
                    <Textarea
                      placeholder="What would you like to know? Be as specific as possible..."
                      rows={8}
                      value={doubt}
                      onChange={(e) => setDoubt(e.target.value)}
                      className="resize-none bg-background text-foreground border-border"
                    />
                  </div>

                  <Button onClick={handleAskDoubt} className="w-full gap-2" disabled={isSolvingDoubt}>
                    <Send className={`w-4 h-4 ${isSolvingDoubt ? 'animate-pulse' : ''}`} />
                    {isSolvingDoubt ? 'Getting Answer...' : 'Get Answer'}
                  </Button>
                  {doubtError && (
                    <p className="text-sm text-red-500 mt-2">{doubtError}</p>
                  )}

                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Pro Tip
                        </p>
                        <p className="text-xs text-muted-foreground">
                          For better results, include context about what you've already tried
                          and specific concepts you're struggling with.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">AI Response</h3>
                {doubtResponse ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                        {doubtResponse}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 hover:bg-muted text-foreground border-border">
                        Follow-up Question
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 hover:bg-muted text-foreground border-border">
                        View Related Topics
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <HelpCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-foreground font-medium">No response yet</p>
                    <p className="text-sm mt-1">Ask a question to get AI assistance</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}