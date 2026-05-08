
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
import { ShieldCheck, Globe, Fingerprint, CreditCard, Info, Loader2, Phone, MapPin, Briefcase } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'Valid email is required.' }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: '10-digit mobile number is mandatory.' }),
  age: z.coerce.number().min(18, { message: 'Must be 18 or older.' }).max(100),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
  location: z.string().min(3, { message: 'Operational city/region is mandatory.' }),
  languages: z.string().min(2, { message: 'Specify at least one language.' }),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: '12-digit Aadhar number is mandatory.' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card format.' }),
  bio: z.string().min(50, { message: 'Bio is mandatory (min 50 chars).' }),
  experience: z.string().min(10, { message: 'Experience details are mandatory.' }),
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
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: guidesRef.path,
          operation: 'create',
          requestResourceData: guideData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({
      title: "Registration Success!",
      description: "You are now listed as a local expert.",
    });
    
    router.push('/guides');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-8 bg-primary rounded-3xl p-8 text-white">
          <h1 className="font-headline text-3xl font-bold text-white">Local Ambassador Registration</h1>
          <p className="text-white/80 leading-relaxed">
            All fields are mandatory. This information helps us verify your identity and build trust with tourists.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <ShieldCheck className="w-10 h-10 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold text-lg">Identity Verification</p>
                <p className="text-sm text-white/70">Aadhar and PAN details are required to confirm your status as a trusted expert.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Globe className="w-10 h-10 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold text-lg">Places Shown</p>
                <p className="text-sm text-white/70">List the specific places you have explored or shown to tourists in our Sunrise State.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-2xl mt-8">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-accent">
              <Info className="w-4 h-4" /> Safety First
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Verified identity data is visible to tourists to ensure they are booking with a legitimate and safe local guide.
            </p>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="bg-secondary/20 border-b p-8">
            <CardTitle className="font-headline text-2xl text-primary">Complete Your Profile</CardTitle>
            <CardDescription>All fields are required for your profile to be active.</CardDescription>
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
                        <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
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
                        <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
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
                          <Phone className="w-4 h-4" /> Mobile <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="10-digit mobile" maxLength={10} {...field} />
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
                        <FormLabel>Age <span className="text-destructive">*</span></FormLabel>
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
                        <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
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
                  <p className="text-sm font-bold flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-4 h-4" /> Verification IDs (Mandatory)
                  </p>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="aadharNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                             <Fingerprint className="w-4 h-4" /> Aadhar Number <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12-digit numeric ID" 
                              type="text"
                              inputMode="numeric"
                              maxLength={12}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[10px]">Must be exactly 12 digits.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                             <CreditCard className="w-4 h-4" /> PAN Card Number <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="ABCDE1234F" {...field} className="uppercase" maxLength={10} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Operational City <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Tirupati" {...field} />
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
                        <FormLabel>Languages <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Telugu, English, etc." {...field} />
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
                        <Briefcase className="w-4 h-4" /> Guiding Experience (Column Format) <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tirumala Temple - 20 times&#10;Araku Valley - 5 times" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-[10px]">Enter 'Place Name - Frequency' on each new line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Introduce yourself and your expertise to travelers." 
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
                  className="w-full h-12 text-lg bg-accent text-white hover:bg-accent/90 rounded-xl"
                >
                  {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Finalizing Profile...</> : 'Complete Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
