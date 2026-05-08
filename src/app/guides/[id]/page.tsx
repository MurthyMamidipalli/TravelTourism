import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, MessageSquare, ShieldCheck, Zap, Info, Calendar } from 'lucide-react';
import AIItineraryPanel from '@/components/AIItineraryPanel';

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
    id: '2', 
    name: 'Sarah Chen', 
    location: 'Tokyo, Japan', 
    bio: "Tokyo is a city of contrasts, and I'm here to help you navigate both its neon futuristic side and its serene traditional shrines. Specialty in local street food and hidden bars.",
    rating: 4.8, 
    reviews: 89, 
    languages: ['Japanese', 'English', 'Mandarin'],
    img: 'https://picsum.photos/seed/guide2/400/400',
    specialty: 'Food & Nightlife',
    operationalRegion: 'Tokyo, Japan'
  }
];

export default async function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = mockGuides.find(g => g.id === id);

  if (!guide) return notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <div className="relative h-80">
              <Image src={guide.img} alt={guide.name} fill className="object-cover" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl font-bold">{guide.name}</h1>
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4" /> {guide.location}
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

          <Card className="border-none shadow-sm bg-white p-6">
            <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" /> About Me
            </h3>
            <p className="text-muted-foreground leading-relaxed">{guide.bio}</p>
          </Card>
        </div>

        {/* Right Column: Experience and AI Tool */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="bg-secondary/30 p-1 rounded-xl mb-6">
              <TabsTrigger value="itinerary" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary flex items-center gap-2">
                <Zap className="w-4 h-4" /> AI Recommended Itinerary
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Services & Pricing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="mt-0">
              <AIItineraryPanel location={guide.operationalRegion} />
            </TabsContent>

            <TabsContent value="services">
              <Card className="border-none shadow-sm bg-white p-8 space-y-6">
                <h3 className="font-headline text-2xl font-bold">Guiding Services</h3>
                <div className="grid gap-4">
                  {[
                    { name: 'Full Day Walking Tour', price: '$80', duration: '8 Hours' },
                    { name: 'Half Day Quick Sightseeing', price: '$50', duration: '4 Hours' },
                    { name: 'Airport Pick-up & First Day Intro', price: '$40', duration: '3 Hours' }
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