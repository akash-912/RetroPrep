import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Adjust path if needed
import { supabase } from '../../../lib/supabase'; // Adjust path to your supabase client
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/Select.jsx';
import { useBranches } from '../../syllabus/hooks/useBranches'; // Adjust path

export function LoginPage() {
  // Modes: 'login' | 'signup' | 'forgot'
  const location = useLocation();
  const [mode, setMode] = useState('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up Extras
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('1');
  
  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const { logIn, signUp } = useAuth();
  const { branches } = useBranches();
  const navigate = useNavigate();

  // --- 1. Handle Forgot Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password', // Where they land after clicking email link
      });

      if (error) throw error;

      setSuccessMsg('Check your email for the password reset link!');
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Handle Login / Signup ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await logIn(email, password);
      } else {
        await signUp(email, password, name, branch, semester);
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 z-0"></div>
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Branding (Hidden on mobile) */}
        <div className="hidden md:block">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              Track Your Academic Progress
            </h1>
            <p className="text-xl text-muted-foreground">
              Access syllabus, track your progress, and get AI-powered assistance for your studies.
            </p>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <Card className="p-8 shadow-xl border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Get Started'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {mode === 'login' && 'Login to your account'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Messages */}
            {errorMsg && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-md text-sm text-center font-medium">
                {successMsg}
              </div>
            )}

            {/* --- FORGOT PASSWORD FORM --- */}
            {mode === 'forgot' ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setSuccessMsg(''); setErrorMsg(''); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground mt-4"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              
              /* --- LOGIN / SIGNUP FORM --- */
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Akash"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    {/* Branch & Semester Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Branch</Label>
                        <Select value={branch} onValueChange={setBranch} required>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b.id} value={b.name}>
                                {b.short_code || b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select value={semester} onValueChange={setSemester} required>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Sem" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                              <SelectItem key={s} value={s.toString()}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="^[0-9]+@nitkkr\.ac\.in$"
                    title="Please enter a valid NIT Kurukshetra student email"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>

                <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                </Button>
              </form>
            )}

            {/* Toggle Login/Signup */}
            {mode !== 'forgot' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setErrorMsg('');
                  }}
                  className="text-primary hover:underline text-sm font-medium transition-colors"
                >
                  {mode === 'login'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Login'}
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}