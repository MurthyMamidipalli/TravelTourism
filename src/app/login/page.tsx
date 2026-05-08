'use client';

import { useState } from 'react';
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
import { Eye, EyeOff, LogIn, Mail, Lock, UserRound, AlertCircle, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getFriendlyErrorMessage = (error: any) => {
    console.error('Auth Error Details:', error.code, error.message);
    switch (error.code) {
      case 'auth/operation-not-allowed':
        return {
          title: 'Provider Not Enabled',
          message: 'The sign-in method you tried (Google, Email, or Guest) is not enabled in your Firebase Console. Go to Authentication > Sign-in method and enable it.'
        };
      case 'auth/unauthorized-domain':
        return {
          title: 'Domain Not Authorized',
          message: 'This domain is not in your authorized list. Go to Authentication > Settings > Authorized domains and add the current URL domain.'
        };
      case 'auth/popup-closed-by-user':
        return {
          title: 'Login Cancelled',
          message: 'The login popup was closed before completion.'
        };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          title: 'Login Failed',
          message: 'Invalid email or password.'
        };
      default:
        return {
          title: 'Authentication Issue',
          message: error.message || 'An unexpected error occurred.'
        };
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
      const err = getFriendlyErrorMessage(error);
      setAuthError(err);
      toast({
        variant: 'destructive',
        title: err.title,
        description: err.message,
      });
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
      toast({ title: 'Welcome Guest!', description: 'You are now logged in as a guest.' });
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
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-primary/5 py-8">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Access your Voyage Compass account</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">{authError.title}</AlertTitle>
              <AlertDescription className="text-sm">
                {authError.message}
                {authError.title === 'Domain Not Authorized' && (
                  <div className="mt-2 p-2 bg-white/10 rounded flex items-center gap-2 text-xs">
                    <Globe className="w-3 h-3" />
                    <span>Copy this domain and add it to Firebase Console</span>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="name@example.com" className="pl-10 h-11" {...field} />
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
                          className="pl-10 h-11"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={isLoading || isGuestLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Alternative Options</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl" onClick={handleGoogleLogin} disabled={isLoading || isGuestLoading}>
              Google
            </Button>
            <Button variant="secondary" className="h-12 rounded-xl" onClick={handleGuestLogin} disabled={isLoading || isGuestLoading}>
              <UserRound className="mr-2 h-4 w-4" />
              {isGuestLoading ? '...' : 'Guest'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center p-8 bg-secondary/10 border-t">
          <p className="text-sm text-muted-foreground">
            No account? <Link href="/signup" className="text-primary font-bold hover:underline">Join here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
