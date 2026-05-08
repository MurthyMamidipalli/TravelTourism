
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Globe, FileUp, Fingerprint, CreditCard, Info, Loader2, Phone, User as UserIcon, Briefcase } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits.' }),
  age: z.coerce.number().min(18, { message: 'You must be at least 18 years old.' }).max(100),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
  location: z.string().min(3, { message: 'Please specify your operational city/region.' }),
  languages: z.string().min(2, { message: 'Specify at least one language.' }),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Aadhar number must be exactly 12 digits.' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card format (e.g., ABCDE1234F).' }),
  bio: z.string().min(50, { message: 'Bio should be at least 50 characters to attract tourists.' }),
  experience: z.string().min(20, { message: 'Please describe the places you have explored or shown to tourists.' }),
  aadharFile: z.any().optional(),
  panFile: z.any().optional(),
});

export default function GuideRegistrationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      age: 25,
      gender: 'Male',
      location: '',
      languages: '',
      aadharNumber: '',
      panNumber: '',
      bio: '',
      experience: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Sign-in Required",
        description: "Please log in to register as a guide.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const guidesRef = collection(firestore!, 'guides');
    const guideData = {
      ...values,
      userId: user.uid,
      rating: 0,
      reviewCount: 0,
      isVerified: true,
      createdAt: serverTimestamp(),
      imageUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/400/400`,
    };

    addDoc(guidesRef, guideData)
      .then(() => {
        toast({
          title: "Registration Successful!",
          description: "You are now a certified local guide. Your profile is live!",
        });
        router.push('/guides');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: guidesRef.path,
          operation: 'create',
          requestResourceData: guideData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-8 bg-primary rounded-3xl p-8 text-white">
          <h1 className="font-headline text-3xl font-bold text-white">Become a Local Ambassador</h1>
          <p className="text-white/80 leading-relaxed">
            Share your passion for Andhra Pradesh and earn while showcasing the beauty of your home.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <ShieldCheck className="w-10 h-10 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold">Mandatory Verification</p>
                <p className="text-sm text-white/70">Aadhar/PAN verification is mandatory for tourist safety. Tourists can view your verification status on your profile.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Globe className="w-10 h-10 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold">Global Reach</p>
                <p className="text-sm text-white/70">Access to thousands of international travelers visiting AP.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-2xl mt-8">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-accent" /> Tourist Safety Policy
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              To ensure the highest level of trust, your registered identity details and document softcopies will be visible to tourists on your profile page.
            </p>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="bg-secondary/20 border-b p-8">
            <CardTitle className="font-headline text-2xl">Create Your Guide Profile</CardTitle>
            <CardDescription>Enter your details and upload identity documents to register.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Mobile
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="10-digit number" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-secondary/10 p-6 rounded-2xl space-y-6 border border-secondary">
                  <div className="space-y-1">
                    <p className="text-sm font-bold flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-4 h-4" /> Identity Verification
                    </p>
                    <p className="text-[10px] text-muted-foreground">Verified ID details will be shared on your public profile.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="aadharNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                               <Fingerprint className="w-4 h-4" /> Aadhar Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="12-digit number" 
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={12}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-[10px]">Must be exactly 12 numeric digits.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="aadharFile"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                               <FileUp className="w-4 h-4" /> Aadhar Softcopy
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                {...fieldProps} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="h-px bg-secondary/50" />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                               <CreditCard className="w-4 h-4" /> PAN Card Number
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="ABCDE1234F" {...field} className="uppercase" maxLength={10} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="panFile"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                               <FileUp className="w-4 h-4" /> PAN Softcopy
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                {...fieldProps} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational City/District</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Tirupati, AP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages (Comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="Telugu, English, Hindi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Places Explored or Shown to Tourists
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the specific tourist spots, cities, or landmarks you have experience with." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>What places have you explored or shown to tourists?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell travelers why they should book with you." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-12 text-lg bg-accent text-white hover:bg-accent/90 rounded-xl shadow-lg shadow-accent/20"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registering...</>
                  ) : (
                    'Register as Guide'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
