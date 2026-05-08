
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, MessageSquare, ShieldCheck, Zap, Info, Calendar, MessageCircle } from 'lucide-react';
import AIItineraryPanel from '@/components/AIItineraryPanel';
import GuideReviews from '@/components/GuideReviews';
import ReviewForm from '@/components/ReviewForm';

const mockGuides = [
  { 
    id: '1', 
    name: 'Ravi Teja', 
    location: 'Amalapuram, Andhra Pradesh', 
    bio: "Passionate about the rich history and beautiful backwaters of the Konaseema region. I've been guiding for over 10 years and love showing tourists the hidden culinary gems and traditional temples near Amalapuram.",
    rating: 4.9, 
    reviews: 124, 
    languages: ['Telugu', 'English', 'Hindi'],
    img: 'https://picsum.photos/seed/guide1/400/400',
    specialty: 'History & Culture',
    operationalRegion: 'Amalapuram, Andhra Pradesh'
  },
  { 
    id: '4', 
    name: 'Anjali Devi', 
    location: 'Amalapuram, Andhra Pradesh', 
    bio: "Specialist in the ecological wonders of Konaseema. I lead tours through the mangrove forests and scenic boat rides along the Godavari.",
    rating: 4.7, 
    reviews: 56, 
    languages: ['Telugu', 'English'],
    img: 'https://picsum.photos/seed/guide4/400/400',
    specialty: 'Nature & Backwaters',
    operationalRegion: 'Amalapuram, Andhra Pradesh'
  },
  { 
    id: '5', 
    name: 'Srinivas Rao', 
    location: 'Tirupati, Andhra Pradesh', 
    bio: "Experienced spiritual guide in the holy city of Tirupati. Helping devotees experience the divine essence of the 7 hills.",
    rating: 5.0, 
    reviews: 210, 
    languages: ['Telugu', 'English', 'Tamil'],
    img: 'https://picsum.photos/seed/guide5/400/400',
    specialty: 'Spiritual Tours',
    operationalRegion: 'Tirupati, Andhra Pradesh'
  }
];

export default async function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = mockGuides.find(g => g.id === id);

  if (!guide) return notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
            <div className="relative h-80">
              <Image src={guide.img} alt={guide.name} fill className="object-cover" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl font-bold">{guide.name}</h1>
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-accent" /> {guide.location}
              </p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-bold">{guide.rating}</span>
                <span className="text-muted-foreground">({guide.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {guide.languages.map(l => (
                  <Badge key={l} variant="secondary">{l}</Badge>
                ))}
              </div>
              <Button className="w-full bg-primary h-12 rounded-xl text-lg mt-4">
                <MessageSquare className="w-5 h-5 mr-2" /> Send Inquiry
              </Button>
            </CardContent>
          </Card>

          <ReviewForm guideId={id} />

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" /> About Me
            </h3>
            <p className="text-muted-foreground leading-relaxed">{guide.bio}</p>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="bg-secondary/30 p-1 rounded-xl mb-6">
              <TabsTrigger value="itinerary" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" /> AI Recommended Itinerary
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-accent" /> Tourist Reviews
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> Services & Pricing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="mt-0">
              <AIItineraryPanel location={guide.operationalRegion} />
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
        </div>
      </div>
    </div>
  );
}
