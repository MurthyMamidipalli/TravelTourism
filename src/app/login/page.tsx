
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
import { Eye, EyeOff, LogIn, Mail, Lock, UserRound, AlertCircle } from 'lucide-react';
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
    const code = error?.code || 'unknown';
    switch (code) {
      case 'auth/admin-restricted-operation':
        return {
          title: 'Admin Restricted',
          message: 'This operation is restricted. Please go to the Firebase Console and ensure "Anonymous" authentication is enabled in the Auth settings.'
        };
      case 'auth/operation-not-allowed':
        return {
          title: 'Provider Disabled',
          message: 'This login method is not enabled in the Firebase Console.'
        };
      case 'auth/unauthorized-domain':
        return {
          title: 'Unauthorized Domain',
          message: 'This domain is not authorized for Firebase Authentication.'
        };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          title: 'Login Failed',
          message: 'Invalid email or password.'
        };
      case 'auth/network-request-failed':
        return {
          title: 'Network Error',
          message: 'Please check your internet connection.'
        };
      default:
        return {
          title: 'Authentication Error',
          message: error?.message || 'An unexpected error occurred.'
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
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="text-center bg-primary/5 py-10">
          <CardTitle className="text-3xl font-black tracking-tight text-primary">Voyage Compass</CardTitle>
          <CardDescription>Explore the heart of Andhra Pradesh</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{authError.title}</AlertTitle>
              <AlertDescription className="text-xs">{authError.message}</AlertDescription>
            </Alert>
          )}

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
                        <Input placeholder="name@example.com" className="pl-10 h-12 rounded-xl" {...field} />
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
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
            </form>
          </Form>

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
