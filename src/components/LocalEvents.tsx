
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, PartyPopper, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const mockEvents = [
  { title: 'Spiritual Chanting Festival', location: 'Tirupati', date: 'Oct 15 - 20', type: 'Festival' },
  { title: 'Ancient Architecture Walk', location: 'Warangal', date: 'Nov 02', type: 'Cultural' },
  { title: 'Beachside Food Expo', location: 'Vizag', date: 'Dec 10 - 12', type: 'Exhibition' },
  { title: 'Handicraft Mela', location: 'Hyderabad', date: 'Ongoing', type: 'Fair' },
];

export default function LocalEvents({ location }: { location: string }) {
  const filteredEvents = mockEvents.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PartyPopper className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-black font-headline">Nearby Events</h3>
      </div>
      
      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-5 border-none shadow-sm bg-accent/5 hover:bg-accent/10 transition-colors rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/20 p-3 rounded-xl">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{event.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="w-3 h-3" /> {event.date} • <MapPin className="w-3 h-3" /> {event.location}
                    </p>
                  </div>
                </div>
                <Badge className="bg-accent text-white border-none">{event.type}</Badge>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="py-12 bg-secondary/10 rounded-3xl border border-dashed text-center">
            <p className="text-muted-foreground italic">No major events scheduled for this week in {location}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
