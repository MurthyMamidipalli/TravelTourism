'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Calendar, Wallet, Heart, MapPin, CheckCircle2, Navigation, Zap } from 'lucide-react';
import { aiTripPlanner, AITripPlannerOutput } from '@/ai/flows/ai-trip-planner-flow';

export default function TripPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AITripPlannerOutput | null>(null);

  const [formData, setForm] = useState({
    budget: 'Moderate',
    days: 3,
    interests: '',
    location: ''
  });

  const generateTrip = async () => {
    setLoading(true);
    try {
      const output = await aiTripPlanner(formData);
      setResult(output);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen space-y-12">
      <header className="max-w-3xl mx-auto text-center space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-primary/10 text-primary w-fit px-4 py-1 rounded-full mx-auto font-bold text-sm mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Powered by Genkit AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-headline">AI <span className="text-primary">Trip</span> Planner</h1>
          <p className="text-xl text-muted-foreground mt-4 font-medium">
            Enter your preferences and let our AI craft the perfect itinerary for your next adventure.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
        <Card className="lg:col-span-2 premium-card shadow-2xl border-none rounded-[2rem] overflow-hidden sticky top-24">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Zap className="w-6 h-6 text-accent fill-accent" /> Plan Your Trip
            </CardTitle>
            <CardDescription className="text-white/80">Tailor your journey in seconds</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Destination (Optional)</Label>
              <Input 
                placeholder="e.g. Tirupati, Konaseema..." 
                className="h-12 rounded-xl"
                value={formData.location}
                onChange={(e) => setForm({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Budget</Label>
                <Select value={formData.budget} onValueChange={(v) => setForm({ ...formData, budget: v })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Duration</Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={30} 
                  className="h-12 rounded-xl" 
                  value={formData.days}
                  onChange={(e) => setForm({ ...formData, days: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Interests</Label>
              <Input 
                placeholder="e.g. Photography, Culture, Trekking" 
                className="h-12 rounded-xl"
                value={formData.interests}
                onChange={(e) => setForm({ ...formData, interests: e.target.value })}
              />
            </div>

            <Button 
              onClick={generateTrip} 
              disabled={loading} 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform"
            >
              {loading ? <><Loader2 className="animate-spin mr-2" /> Creating Magic...</> : 'Generate Itinerary'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-6 bg-secondary/10 rounded-[3rem] border border-dashed border-primary/20"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold font-headline">AI is Thinking...</h3>
                  <p className="text-muted-foreground animate-pulse">Browsing hidden gems and local secrets...</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <Card className="premium-card p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 border-l-8 border-l-primary">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-4xl font-black tracking-tight font-headline">{result.title}</h2>
                      <Badge className="bg-accent text-white py-1 px-4 rounded-full font-bold whitespace-nowrap">{formData.budget}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 py-4 border-y">
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <Calendar className="w-5 h-5 text-primary" /> <span className="font-bold">{formData.days} Days</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <Wallet className="w-5 h-5 text-primary" /> <span className="font-bold">{result.estimatedCost}</span>
                       </div>
                    </div>

                    <div className="space-y-8">
                      {result.dailyItinerary.map((item) => (
                        <div key={item.day} className="relative pl-12 border-l-2 border-primary/10 py-2">
                          <div className="absolute left-[-13px] top-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-primary/30">
                            {item.day}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xl font-bold text-primary font-headline">Day {item.day}</h4>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.activities.map((act, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-secondary/30 p-3 rounded-xl">
                                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                  <span className="text-sm font-medium">{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 space-y-4">
                      <h4 className="font-black text-primary flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Navigation className="w-4 h-4" /> Pro Traveler Tips
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.proTips.map((tip, i) => (
                          <li key={i} className="text-sm flex gap-3 items-start text-muted-foreground">
                            <span className="text-primary font-black">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-secondary/5 rounded-[3rem] border-2 border-dashed border-muted-foreground/10">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-primary opacity-20" />
                </div>
                <h3 className="text-2xl font-black font-headline opacity-30 uppercase tracking-tighter">Your Journey Awaits</h3>
                <p className="text-muted-foreground max-w-xs mt-2 font-medium opacity-50">Fill out the form on the left to see your personalized AI itinerary.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
