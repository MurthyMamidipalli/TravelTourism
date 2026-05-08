
'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, MessageSquare, ShieldCheck, Zap, Info, Calendar, MessageCircle, Fingerprint, CreditCard, FileText, Loader2, Phone, Mail, User as UserIcon, Briefcase } from 'lucide-react';
import AIItineraryPanel from '@/components/AIItineraryPanel';
import GuideReviews from '@/components/GuideReviews';
import ReviewForm from '@/components/ReviewForm';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();

  const guideRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'guides', id);
  }, [firestore, id]);

  const { data: guide, loading } = useDoc(guideRef);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading local expert profile...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
        <p className="text-muted-foreground">The guide profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
            <div className="relative h-80">
              <Image 
                src={guide.imageUrl || `https://picsum.photos/seed/${guide.id}/400/400`} 
                alt={guide.fullName || 'Guide'} 
                fill 
                className="object-cover" 
              />
              <div className="absolute bottom-4 left-4">
                 <Badge className="bg-accent text-white border-none flex items-center gap-1.5 py-1.5 px-3">
                   <ShieldCheck className="w-4 h-4" /> Identity Verified
                 </Badge>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl font-bold">{guide.fullName}</h1>
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              
              <div className="space-y-2">
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-accent" /> {guide.location || 'Location not specified'}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-accent" /> {guide.email || 'Email hidden'}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-accent" /> {guide.mobileNumber || 'Contact hidden'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-bold">{guide.rating || 'New'}</span>
                <span className="text-muted-foreground">({guide.reviewCount || 0} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {guide.languages?.split(',').map((l: string) => (
                  <Badge key={l} variant="secondary" className="text-[10px]">{l.trim()}</Badge>
                ))}
              </div>
              <Button className="w-full bg-primary h-12 rounded-xl text-lg mt-4 shadow-lg shadow-primary/20">
                <MessageSquare className="w-5 h-5 mr-2" /> Send Inquiry
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h3 className="font-headline font-semibold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-accent" /> Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Age</p>
                <p className="font-bold">{guide.age || 'N/A'} Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Gender</p>
                <p className="font-bold">{guide.gender || 'Not specified'}</p>
              </div>
            </div>
          </Card>

          <ReviewForm guideId={id} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="bg-secondary/30 p-1 rounded-xl mb-6 flex flex-wrap h-auto">
              <TabsTrigger value="itinerary" className="rounded-lg flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2 py-3">
                <Zap className="w-4 h-4 text-accent" /> AI Itinerary
              </TabsTrigger>
              <TabsTrigger value="verification" className="rounded-lg flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2 py-3">
                <ShieldCheck className="w-4 h-4 text-accent" /> Verified Identity
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2 py-3">
                <MessageCircle className="w-4 h-4 text-accent" /> Reviews
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-lg flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2 py-3">
                <Calendar className="w-4 h-4 text-accent" /> Services
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="mt-0">
              <AIItineraryPanel location={guide.location || 'Andhra Pradesh'} />
            </TabsContent>

            <TabsContent value="verification" className="mt-0 space-y-6">
              <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-accent" /> Trust & Verification
                  </h3>
                  <p className="text-muted-foreground">Verification details as registered with government authorities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-2xl border border-secondary">
                      <Fingerprint className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Aadhar Number</p>
                        <p className="text-lg font-bold">XXXX-XXXX-{guide.aadharNumber?.slice(-4) || 'XXXX'}</p>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/30">
                      <Image 
                        src={`https://picsum.photos/seed/aadhar-${guide.id}/600/400`} 
                        alt="Aadhar Softcopy" 
                        fill 
                        className="object-cover blur-[4px] hover:blur-0 transition-all duration-500" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-transparent transition-colors">
                        <Badge className="bg-white text-black font-bold flex gap-2">
                          <FileText className="w-3 h-3" /> Softcopy Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-2xl border border-secondary">
                      <CreditCard className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PAN Number</p>
                        <p className="text-lg font-bold">XXXXX{guide.panNumber?.slice(-4) || 'XXXXX'}</p>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/30">
                      <Image 
                        src={`https://picsum.photos/seed/pan-${guide.id}/600/400`} 
                        alt="PAN Softcopy" 
                        fill 
                        className="object-cover blur-[4px] hover:blur-0 transition-all duration-500" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-transparent transition-colors">
                        <Badge className="bg-white text-black font-bold flex gap-2">
                          <FileText className="w-3 h-3" /> Softcopy Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20">
                  <p className="text-sm text-muted-foreground italic flex gap-2">
                    <Info className="w-4 h-4 text-accent flex-shrink-0" />
                    Sensitive information like full ID numbers are partially masked to protect guide privacy while ensuring tourist safety.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <GuideReviews guideId={id} />
            </TabsContent>

            <TabsContent value="services">
              <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-8 space-y-6">
                <h3 className="font-headline text-2xl font-bold">Guiding Services</h3>
                <div className="grid gap-4">
                  {[
                    { name: 'Full Day Heritage Tour', price: '₹3500', duration: '8 Hours' },
                    { name: 'Half Day Scenic Tour', price: '₹2000', duration: '4 Hours' },
                    { name: 'Cultural Walk & Food Intro', price: '₹1500', duration: '3 Hours' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group">
                      <div>
                        <p className="font-semibold text-lg">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary group-hover:text-accent">{s.price}</p>
                        <Button size="sm" className="mt-2 bg-accent text-white rounded-lg">Pay & Book</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" /> About Me
              </h3>
              <p className="text-muted-foreground leading-relaxed">{guide.bio || 'This guide hasn\'t added a bio yet.'}</p>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" /> Places Explored & Shown
              </h3>
              <p className="text-muted-foreground leading-relaxed">{guide.experience || 'Experience details not shared.'}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
