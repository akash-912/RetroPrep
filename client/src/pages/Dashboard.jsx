import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useSyllabus } from '../features/syllabus/api/useSyllabus';
import { useProgress } from '../features/syllabus/api/useProgress';
import { usePlanner } from '../features/exam-planner/api/usePlanner';

import { Card } from '../components/ui/Card.jsx';
import { CircularProgress } from '../components/ui/CircularProgress.jsx';
import { BookOpen, Trophy, Target, TrendingUp, Youtube, Brain, CalendarDays } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

// Helper to make timestamps look like "2 hours ago" or "Yesterday"
const getRelativeTime = (dateString) => {
  if (!dateString) return 'Just now';
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export function Dashboard({ userName, userBranch, userSemester, onNavigate }) {
  const { user } = useAuth();
  
  // 1. Fetch Dynamic Data
  const { syllabus, loading: loadingSyllabus } = useSyllabus(userBranch, userSemester);
  const { completedTopics } = useProgress();
  const { plannedTopics } = usePlanner('Mid-Sem 1'); // Change this if you want it to track a different exam

  const [recentActivities, setRecentActivities] = useState([]);

  // 2. Do the Math for Stats
  let totalTopicsCount = 0;
  const allTopicsMap = {}; 

  if (syllabus) {
    syllabus.forEach(subject => {
      subject.units.forEach(unit => {
        unit.topics.forEach(topic => {
          totalTopicsCount++;
          allTopicsMap[topic.id] = {
            topicName: topic.title,
            subjectName: subject.name,
            unitName: `Unit ${unit.unit_number}`
          };
        });
      });
    });
  }

  const subjectsCount = syllabus ? syllabus.length : 0;
  const completedCount = completedTopics.size;
  const overallProgress = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  // 3. Fetch Recent Activity from Database
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_progress')
        .select('topic_id, completed_at')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setRecentActivities(data);
      }
    };
    fetchRecentActivity();
  }, [user, completedTopics]);

  // 4. Generate Upcoming Topics based on Exam Planner
  const upcomingTopics = Array.from(plannedTopics)
    .filter(id => !completedTopics.has(id)) // Only show uncompleted items
    .slice(0, 3) // Match your UI's 3 items
    .map(id => allTopicsMap[id])
    .filter(Boolean); // Remove undefined if data is still loading

  if (loadingSyllabus) {
    return (
      <div className="min-h-screen flex justify-center pt-20 bg-background transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            {userBranch} - Semester {userSemester}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold text-primary mt-2">{overallProgress}%</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-full">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{subjectsCount}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-2">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                {/* Simple streak mock logic based on having any completed topics */}
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-500 mt-2">{completedCount > 0 ? '1 day' : '0 days'}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overall Progress Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Your Progress</h2>
              <div className="flex justify-center">
                <CircularProgress percentage={overallProgress} size={200} strokeWidth={12} />
              </div>
              <p className="text-center text-muted-foreground mt-4">
                Keep going! You're doing great this semester.
              </p>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const details = allTopicsMap[activity.topic_id];
                    if (!details) return null;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{details.subjectName}</p>
                          <p className="text-sm text-muted-foreground">{details.topicName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">+ Completed</p>
                          <p className="text-xs text-muted-foreground opacity-80">{getRelativeTime(activity.completed_at)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground py-4">No recent activity found. Get to studying!</div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start gap-2 hover:bg-muted text-foreground" 
                  variant="outline"
                  onClick={() => onNavigate('syllabus')}
                >
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  Browse Syllabus
                </Button>
                <Button 
                  className="w-full justify-start gap-2 hover:bg-muted text-foreground" 
                  variant="outline"
                  onClick={() => onNavigate('planner')}
                >
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  Mid-Sem Planner
                </Button>
                <Button 
                  className="w-full justify-start gap-2 hover:bg-muted text-foreground" 
                  variant="outline"
                  onClick={() => onNavigate('ai-assistant')}
                >
                  <Brain className="w-4 h-4 text-muted-foreground" />
                  AI Assistant
                </Button>
                <Button 
                  className="w-full justify-start gap-2 hover:bg-muted text-foreground" 
                  variant="outline"
                  onClick={() => onNavigate('profile')}
                >
                  <Target className="w-4 h-4 text-muted-foreground" />
                  View Progress
                </Button>
              </div>
            </Card>

            {/* Upcoming Topics */}
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">Upcoming Topics</h3>
              <div className="space-y-3">
                {upcomingTopics.length > 0 ? (
                  upcomingTopics.map((topic, index) => (
                    <div key={index} className="p-3 bg-primary/10 rounded-lg border border-border">
                      <p className="text-sm font-semibold text-foreground">{topic.subjectName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{topic.topicName}</p>
                      <p className="text-xs text-primary font-medium mt-2">{topic.unitName}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-2">No planned topics remaining for Mid-Sem 1.</div>
                )}
              </div>
            </Card>

            {/* YouTube Resources */}
            <Card className="p-6 bg-gradient-to-br from-destructive/10 to-accent border-none">
              <div className="flex items-center gap-2 mb-3">
                <Youtube className="w-5 h-5 text-destructive" />
                <h3 className="font-bold text-foreground">Video Resources</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Access curated YouTube playlists for each subject
              </p>
              <Button variant="outline" className="w-full hover:bg-background text-foreground" onClick={() => onNavigate('syllabus')}>
                View Playlists
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}