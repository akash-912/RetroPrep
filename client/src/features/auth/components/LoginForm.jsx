import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Adjust this path if needed
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New states for Supabase Auth
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { logIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await logIn(email, password);
      } else {
        // Now we pass the name along with email and password!
        await signUp(email, password, name); 
      }
      navigate('/dashboard'); 
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 flex items-center justify-center p-4">
      {/* Background gradients that adapt to theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 z-0"></div>
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left side - Image and description */}
        <div className="hidden md:block">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              Track Your Academic Progress
            </h1>
            <p className="text-xl text-muted-foreground">
              Access syllabus, track your progress, and get AI-powered assistance for your studies.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">500+</div>
                <div className="text-sm text-muted-foreground">Topics Covered</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-500">4</div>
                <div className="text-sm text-muted-foreground">Branches Available</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="text-3xl font-bold text-green-600 dark:text-green-500">8</div>
                <div className="text-sm text-muted-foreground">Semesters</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">AI</div>
                <div className="text-sm text-muted-foreground">Powered Help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="p-8 shadow-xl border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isLogin ? 'Login to your account' : 'Create your account'}
              </p>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="bg-background text-foreground border-border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="123456242@nitkkr.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background text-foreground border-border"
                  pattern="^[0-9]+@nitkkr\.ac\.in$"
                  title="Please enter a valid NIT Kurukshetra student email (e.g., 123456@nitkkr.ac.in)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background text-foreground border-border"
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg(''); // Clear errors when switching modes
                }}
                className="text-primary hover:underline text-sm font-medium transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}