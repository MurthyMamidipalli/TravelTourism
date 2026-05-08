
'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, MessageSquare, ShieldCheck, Zap, Info, Calendar, MessageCircle, Fingerprint, CreditCard, Loader2, Phone, Mail, User as UserIcon, Briefcase, FileText } from 'lucide-react';
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

  const experienceList = useMemo(() => {
    if (!guide?.experience) return [];
    return guide.experience
      .split('\n')
      .map((line: string) => {
        const parts = line.split('-').map(s => s.trim());
        const place = parts[0];
        const count = parts.length > 1 ? parts[1] : 'Guided';
        return { place, count };
      })
      .filter(item => item.place);
  }, [guide?.experience]);

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
        <h1 className="text-4xl font-bold mb-4 text-primary">Guide Not Found</h1>
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
                   <ShieldCheck className="w-4 h-4" /> Verified Guide
                 </Badge>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl font-bold">{guide.fullName}</h1>
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              
              <div className="space-y-3">
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-accent" /> {guide.location}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-accent" /> {guide.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-accent" /> {guide.mobileNumber}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-bold">{guide.rating || 'New'}</span>
                <span className="text-muted-foreground">({guide.reviewCount || 0} reviews)</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2 border-t mt-4">
                {guide.languages?.split(',').map((l: string) => (
                  <Badge key={l} variant="secondary" className="text-[10px]">{l.trim()}</Badge>
                ))}
              </div>
              
              <Button className="w-full bg-primary h-12 rounded-xl text-lg mt-4">
                <MessageSquare className="w-5 h-5 mr-2" /> Book Local Experience
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h3 className="font-headline font-semibold flex items-center gap-2 text-primary">
              <UserIcon className="w-5 h-5 text-accent" /> Expert Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Age</p>
                <p className="font-bold">{guide.age} Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Gender</p>
                <p className="font-bold">{guide.gender}</p>
              </div>
            </div>
          </Card>

          <ReviewForm guideId={id} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="bg-secondary/30 p-1 rounded-xl mb-6 flex flex-wrap h-auto">
              <TabsTrigger value="itinerary" className="rounded-lg flex-1 py-3 flex gap-2">
                <Zap className="w-4 h-4 text-accent" /> AI Plan
              </TabsTrigger>
              <TabsTrigger value="verification" className="rounded-lg flex-1 py-3 flex gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" /> Verified Identity
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg flex-1 py-3 flex gap-2">
                <MessageCircle className="w-4 h-4 text-accent" /> Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary">
              <AIItineraryPanel location={guide.location} />
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-accent" /> Government Verification
                  </h3>
                  <p className="text-muted-foreground">Identity documents verified for traveler safety and trust.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-2xl border">
                      <Fingerprint className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Aadhar Number</p>
                        <p className="text-lg font-bold">{guide.aadharNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Aadhar Softcopy</p>
                      <div className="relative aspect-video rounded-xl overflow-hidden border bg-secondary/10 flex items-center justify-center">
                         <Image src={`https://picsum.photos/seed/aadhar-${id}/600/400`} alt="Aadhar Softcopy" fill className="object-cover opacity-50 blur-[2px]" />
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
                            <FileText className="w-8 h-8 mb-2" />
                            <span className="text-sm font-bold">Verified Document</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-2xl border">
                      <CreditCard className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PAN Card Number</p>
                        <p className="text-lg font-bold uppercase">{guide.panNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PAN Softcopy</p>
                      <div className="relative aspect-video rounded-xl overflow-hidden border bg-secondary/10 flex items-center justify-center">
                         <Image src={`https://picsum.photos/seed/pan-${id}/600/400`} alt="PAN Softcopy" fill className="object-cover opacity-50 blur-[2px]" />
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
                            <FileText className="w-8 h-8 mb-2" />
                            <span className="text-sm font-bold">Verified Document</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20 flex gap-4">
                   <Info className="w-5 h-5 text-accent flex-shrink-0" />
                   <p className="text-sm text-muted-foreground">Full ID details are visible to confirmed tourists to verify the authenticity of the local expert.</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <GuideReviews guideId={id} />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-headline font-semibold mb-4 flex items-center gap-2 text-primary">
                <Info className="w-5 h-5 text-accent" /> About Me
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{guide.bio}</p>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-headline font-semibold mb-6 flex items-center gap-2 text-primary">
                <Briefcase className="w-5 h-5 text-accent" /> Guiding Experience
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">
                  <span>Places Explored / Shown</span>
                  <span className="text-right">Frequency</span>
                </div>
                <div className="divide-y divide-secondary/30">
                  {experienceList.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 py-3">
                      <span className="font-bold">{item.place}</span>
                      <span className="text-right font-medium text-primary">
                        {item.count}
                      </span>
                    </div>
                  ))}
                  {experienceList.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 italic">No specific experience details listed.</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
