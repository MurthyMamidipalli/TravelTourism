
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Globe, FileUp, Fingerprint, CreditCard, Info } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(3, { message: 'Please specify your operational city/region.' }),
  languages: z.string().min(2, { message: 'Specify at least one language.' }),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Aadhar number must be exactly 12 digits.' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card format (e.g., ABCDE1234F).' }),
  bio: z.string().min(50, { message: 'Bio should be at least 50 characters to attract tourists.' }),
  aadharFile: z.any().refine((files) => files?.length > 0, 'Aadhar softcopy is required.'),
  panFile: z.any().refine((files) => files?.length > 0, 'PAN card softcopy is required.'),
});

export default function GuideRegistrationPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      location: '',
      languages: '',
      aadharNumber: '',
      panNumber: '',
      bio: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Registration Submitted!",
      description: "Our verification team will review your ID documents and softcopies within 48 hours. Your identity details will be visible to tourists once verified.",
    });
    form.reset();
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
              To ensure the highest level of trust, your registered Aadhar and PAN numbers, along with their softcopies, will be visible to tourists on your public profile page. Please ensure you upload clear, legible copies.
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
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
                               <FileUp className="w-4 h-4" /> Aadhar Softcopy (Visible to Tourists)
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
                               <FileUp className="w-4 h-4" /> PAN Softcopy (Visible to Tourists)
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
                <Button type="submit" className="w-full h-12 text-lg bg-accent text-white hover:bg-accent/90 rounded-xl shadow-lg shadow-accent/20">
                  Register as Guide
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
