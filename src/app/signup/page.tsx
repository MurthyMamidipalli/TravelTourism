
'use client';

import { useState } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Fingerprint, Phone, Calendar, ShieldCheck, Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  age: z.coerce.number().min(1, { message: 'Age is required.' }).max(120),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Aadhar must be exactly 12 digits.' }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile must be exactly 10 digits.' }),
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      age: 0,
      aadharNumber: '',
      mobileNumber: '',
    },
  });

  const aadharNumber = form.watch('aadharNumber');

  async function handleSendOtp() {
    if (aadharNumber.length !== 12) {
      toast({
        title: "Invalid Aadhar",
        description: "Please enter a valid 12-digit Aadhar number first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingOtp(true);
    // Optimized delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSendingOtp(false);
    setIsOtpSent(true);
    toast({
      title: "OTP Sent",
      description: "Verification code sent to your linked mobile.",
    });
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    
    setIsVerifyingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsVerifyingOtp(false);
    
    if (otpValue === '123456') {
      setIsAadharVerified(true);
      toast({
        title: "Aadhar Verified",
        description: "Identity authenticated successfully.",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP (Test: 123456).",
        variant: "destructive"
      });
    }
  }

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!isAadharVerified) {
      toast({
        title: "Aadhar Not Verified",
        description: "Please complete OTP verification.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      const fullName = `${values.firstName} ${values.lastName}`;
      await updateProfile(user, {
        displayName: fullName,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      const profileData = {
        fullName,
        email: values.email,
        age: values.age,
        aadharNumber: values.aadharNumber,
        mobileNumber: values.mobileNumber,
        isVerified: true,
        createdAt: serverTimestamp(),
      };

      // Optimistic save
      setDoc(userDocRef, profileData)
        .catch(async (error) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: profileData,
          }));
        });

      toast({ 
        title: 'Account Created', 
        description: `Welcome, ${values.firstName}!` 
      });
      
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

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-lg border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="space-y-1 text-center bg-primary/5 py-8">
          <CardTitle className="text-3xl font-bold tracking-tight">Join Voyage Compass</CardTitle>
          <CardDescription>Start your journey across Andhra Pradesh today</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="John" className="pl-10 h-11 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="25" className="pl-10 h-11 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="10-digit number" maxLength={10} className="pl-10 h-11 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 bg-secondary/20 p-6 rounded-2xl border border-secondary shadow-inner">
                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-primary" /> Aadhar Number
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="relative flex-grow">
                            <Input 
                              placeholder="12-digit numeric ID" 
                              maxLength={12} 
                              className="h-11 rounded-xl" 
                              disabled={isAadharVerified}
                              {...field} 
                            />
                            {isAadharVerified && (
                              <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                            )}
                          </div>
                        </FormControl>
                        {!isAadharVerified && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || aadharNumber.length !== 12 || isOtpSent}
                            className="rounded-xl h-11"
                          >
                            {isSendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : (isOtpSent ? 'Sent' : 'Get OTP')}
                          </Button>
                        )}
                      </div>
                      <FormDescription className="text-[10px]">Verify via Aadhaar OTP (Test: 123456).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isOtpSent && !isAadharVerified && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="XXXXXX" 
                        maxLength={6} 
                        className="h-11 rounded-xl text-center font-bold tracking-widest"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={handleVerifyOtp} 
                        disabled={isVerifyingOtp || otpValue.length !== 6}
                        className="rounded-xl h-11 bg-accent text-white"
                      >
                        {isVerifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="name@example.com" className="pl-10 h-11 rounded-xl" {...field} />
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
                          className="pl-10 h-11 rounded-xl"
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

              <Button 
                type="submit" 
                className="w-full h-12 text-lg rounded-xl mt-4 font-bold shadow-xl shadow-primary/20" 
                disabled={isLoading || !isAadharVerified}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
              {!isAadharVerified && (
                <p className="text-[10px] text-center text-muted-foreground italic">
                  * Aadhar verification required to enable account creation.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center p-8 bg-secondary/10 border-t">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
