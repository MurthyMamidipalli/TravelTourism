'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, Mail, Lock, UserRound, AlertCircle, Copy, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required.' }),
  password: z.string().min(6, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<{title: string, message: string, domain?: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || 'unknown';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
    
    switch (code) {
      case 'auth/unauthorized-domain':
        return { 
          title: 'Domain Not Authorized', 
          message: `This domain is not authorized for Google Sign-In. Add the hostname below in your Firebase Console > Authentication > Settings > Authorized Domains.`, 
          domain: hostname 
        };
      case 'auth/popup-blocked':
        return { title: 'Popup Blocked', message: 'The Google login popup was blocked by your browser. Please allow popups for this site.' };
      case 'auth/popup-closed-by-user':
        return { title: 'Login Cancelled', message: 'The login window was closed before completing the process.' };
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return { title: 'Invalid Credentials', message: 'The email or password you entered is incorrect.' };
      default:
        return { title: 'Authentication Error', message: error?.message || 'An unexpected error occurred during login.' };
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      router.push('/dashboard');
    } catch (error: any) {
      setAuthError(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Signed in with Google.' });
      router.push('/dashboard');
    } catch (error: any) {
      setAuthError(getFriendlyErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="text-center bg-primary/5 py-10">
          <CardTitle className="text-3xl font-black tracking-tight text-primary">TravelSphere</CardTitle>
          <CardDescription>Explore the heart of India</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">{authError.title}</AlertTitle>
              <AlertDescription className="space-y-3">
                <p className="text-xs">{authError.message}</p>
                {authError.domain && (
                  <div className="bg-white/50 dark:bg-black/50 p-2 rounded-lg border border-destructive/20 flex items-center justify-between gap-2">
                    <code className="text-[10px] font-mono break-all">{authError.domain}</code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(authError.domain!)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
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
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type={showPassword ? 'text' : 'password'} className="pl-10 h-12 rounded-xl" {...field} suppressHydrationWarning />
                      {mounted && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full h-12 text-lg rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Sign In'}
                {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-950 px-2 text-muted-foreground font-medium">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800" 
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Google'}
            </Button>
            <Button variant="secondary" className="h-12 rounded-xl" onClick={() => signInAnonymously(auth).then(() => router.push('/dashboard'))}>
              <UserRound className="mr-2 h-4 w-4" /> Guest
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
