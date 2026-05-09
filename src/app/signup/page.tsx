'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Lock, Mail, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const signupSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      const fullName = `${values.firstName} ${values.lastName}`;
      await updateProfile(user, { displayName: fullName });

      if (!firestore) return;

      const userDocRef = doc(firestore, 'users', user.uid);
      const profileData = {
        fullName,
        email: values.email,
        isVerified: false,
        createdAt: serverTimestamp(),
      };

      setDoc(userDocRef, profileData)
        .catch(async (error) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: profileData,
          }));
        });

      toast({ title: 'Account Created', description: `Welcome, ${values.firstName}! Explore TravelSphere.` });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message || "Could not create account.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) {
    return <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="space-y-1 text-center bg-primary/5 py-8">
          <CardTitle className="text-3xl font-black tracking-tight text-primary uppercase">TravelSphere</CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground">Join our explorer community</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John" className="pl-10 rounded-xl h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="name@example.com" className="pl-10 h-11 rounded-xl" {...field} />
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
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 h-11 rounded-xl pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 h-11 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full h-14 text-lg rounded-2xl mt-2 font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
                {!isLoading && <UserPlus className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center p-8 bg-secondary/10 border-t">
          <p className="text-sm text-muted-foreground font-medium">
            Already a member? <Link href="/login" className="text-primary font-bold hover:underline">Sign in here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
