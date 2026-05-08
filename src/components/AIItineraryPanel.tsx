
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Loader2, Compass, MapPin } from 'lucide-react';
import { aiRecommendedItinerary, AIRecommendedItineraryOutput } from '@/ai/flows/ai-recommended-itinerary-flow';

export default function AIItineraryPanel({ location }: { location: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendedItineraryOutput | null>(null);

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const output = await aiRecommendedItinerary({ location });
      setResult(output);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <div className="bg-accent/10 p-6 flex items-center justify-between border-b border-accent/20">
        <div>
          <h3 className="font-headline text-xl font-bold text-primary flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent fill-accent" /> AI Travel Assistant
          </h3>
          <p className="text-muted-foreground text-sm">Personalized plan for {location}</p>
        </div>
        {!result && !loading && (
          <Button onClick={generateItinerary} className="bg-accent text-white rounded-full shadow-lg shadow-accent/20">
            Generate Plan
          </Button>
        )}
      </div>

      <CardContent className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground animate-pulse font-medium">Crafting your perfect itinerary...</p>
          </div>
        ) : result ? (
          <div className="space-y-10">
            <div className="space-y-4">
              <h4 className="font-headline text-lg font-bold flex items-center gap-2 border-b pb-2">
                <Compass className="w-5 h-5 text-primary" /> Must-Visit Attractions
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {result.suggestedAttractions.map((attraction, i) => (
                  <div key={i} className="bg-secondary/20 p-4 rounded-xl space-y-1">
                    <p className="font-bold text-primary">{attraction.name}</p>
                    <p className="text-sm text-muted-foreground">{attraction.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-headline text-lg font-bold flex items-center gap-2 border-b pb-2">
                <MapPin className="w-5 h-5 text-primary" /> Suggested Daily Itinerary
              </h4>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">
                {result.suggestedItinerary}
              </div>
            </div>
            
            <div className="pt-4 text-center">
               <Button variant="outline" onClick={() => setResult(null)} className="text-xs text-muted-foreground hover:text-accent border-none underline">
                 Re-generate Plan
               </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-10 h-10 text-accent/50" />
            </div>
            <div className="space-y-2">
              <h4 className="font-headline text-xl font-bold">Unlock Local Insights</h4>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Use our AI tool to instantly generate a suggested day-by-day plan for exploring {location}.
              </p>
            </div>
            <Button onClick={generateItinerary} size="lg" className="bg-accent text-white rounded-full h-12 px-8 mt-4">
              Generate AI Itinerary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
