'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, Mail, Lock, UserRound, AlertCircle, Phone, Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [authError, setAuthError] = useState<{title: string, message: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  // Phone Auth State
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || 'unknown';
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    
    switch (code) {
      case 'auth/admin-restricted-operation':
        return {
          title: 'Admin Restricted',
          message: 'Anonymous authentication is disabled. Please enable it in the Firebase Console settings.'
        };
      case 'auth/operation-not-allowed':
        return {
          title: 'Provider Disabled',
          message: 'This login method is not enabled in the Firebase Console.'
        };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          title: 'Login Failed',
          message: 'Invalid email or password.'
        };
      case 'auth/invalid-phone-number':
        return { title: 'Invalid Phone', message: 'The phone number provided is incorrect.' };
      case 'auth/unauthorized-domain':
        return { 
          title: 'Domain Not Authorized', 
          message: `The domain "${currentDomain}" is not in your Firebase Authorized Domains list. Please add it in Auth > Settings.` 
        };
      default:
        return {
          title: 'Authentication Error',
          message: error?.message || 'An unexpected error occurred.'
        };
    }
  };

  const setupRecaptcha = () => {
    if (recaptchaVerifierRef.current) return;
    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha resolved');
        }
      });
    } catch (error) {
      console.error("Recaptcha error:", error);
    }
  };

  async function handleSendOtp() {
    if (phoneNumber.length !== 10) {
      toast({ title: "Invalid Number", description: "Please enter a 10-digit mobile number.", variant: "destructive" });
      return;
    }
    
    setIsSendingOtp(true);
    setupRecaptcha();
    
    const appVerifier = recaptchaVerifierRef.current;
    if (!appVerifier) {
      setIsSendingOtp(false);
      toast({ title: "Error", description: "Recaptcha failed to initialize.", variant: "destructive" });
      return;
    }

    try {
      const formattedNumber = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: "Code sent to +91 " + phoneNumber });
    } catch (error: any) {
      const err = getFriendlyErrorMessage(error);
      toast({ variant: "destructive", title: err.title, description: err.message });
      // Reset verifier on failure so it can be re-tried
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (verificationCode.length !== 6 || !confirmationResult) return;
    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast({ title: "Welcome!", description: "Log in successful." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Verification Failed", description: "Invalid code entered." });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      router.push('/dashboard');
    } catch (error: any) {
      const err = getFriendlyErrorMessage(error);
      setAuthError(err);
      toast({ variant: 'destructive', title: err.title, description: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Welcome!', description: 'Logged in with Google.' });
      router.push('/dashboard');
    } catch (error: any) {
      const err = getFriendlyErrorMessage(error);
      setAuthError(err);
      toast({ variant: 'destructive', title: err.title, description: err.message });
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      toast({ title: 'Welcome Guest!', description: 'Logged in as guest.' });
      router.push('/dashboard');
    } catch (error: any) {
      const err = getFriendlyErrorMessage(error);
      setAuthError(err);
      toast({ variant: 'destructive', title: err.title, description: err.message });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <div id="recaptcha-container-login"></div>
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="text-center bg-primary/5 py-10">
          <CardTitle className="text-3xl font-black tracking-tight text-primary">Voyage Compass</CardTitle>
          <CardDescription>Explore the heart of India</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{authError.title}</AlertTitle>
              <AlertDescription className="text-xs">{authError.message}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {loginMethod === 'email' ? (
              <motion.div
                key="email-login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="name@example.com" className="pl-10 h-12 rounded-xl" {...field} suppressHydrationWarning />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 h-12 rounded-xl"
                                {...field}
                                suppressHydrationWarning
                              />
                              {mounted && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                  suppressHydrationWarning
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12 text-lg rounded-xl font-bold mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                      <LogIn className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-xs" 
                      onClick={() => setLoginMethod('phone')}
                    >
                      <Smartphone className="w-3 h-3 mr-2" /> Sign in with Phone Number
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="phone-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {!isOtpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-bold">+91</span>
                        <Input 
                          placeholder="9876543210" 
                          className="pl-20 h-12 rounded-xl" 
                          value={phoneNumber} 
                          onChange={(e) => setPhoneNumber(e.target.value)} 
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full h-12 rounded-xl font-bold" 
                      onClick={handleSendOtp} 
                      disabled={isSendingOtp || phoneNumber.length !== 10}
                    >
                      {isSendingOtp ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 text-center">
                      <Label>Enter 6-digit Code</Label>
                      <Input 
                        placeholder="123456" 
                        className="h-14 rounded-xl text-center text-2xl font-bold tracking-widest" 
                        value={verificationCode} 
                        onChange={(e) => setVerificationCode(e.target.value)} 
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground mt-2">Code sent to +91 {phoneNumber}</p>
                    </div>
                    <Button 
                      className="w-full h-12 rounded-xl font-bold" 
                      onClick={handleVerifyOtp} 
                      disabled={isLoading || verificationCode.length !== 6}
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                    </Button>
                    <Button variant="link" className="w-full text-xs" onClick={() => setIsOtpSent(false)}>
                      Change Phone Number
                    </Button>
                  </div>
                )}
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-xs" 
                  onClick={() => {
                    setLoginMethod('email');
                    setIsOtpSent(false);
                  }}
                >
                  <ArrowLeft className="w-3 h-3 mr-2" /> Back to Email Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800" onClick={handleGoogleLogin}>
              Google
            </Button>
            <Button variant="secondary" className="h-12 rounded-xl" onClick={handleGuestLogin} disabled={isGuestLoading}>
              {isGuestLoading ? '...' : <><UserRound className="mr-2 h-4 w-4" /> Guest</>}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-8 bg-secondary/10 border-t">
          <p className="text-sm text-muted-foreground font-medium">
            New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
