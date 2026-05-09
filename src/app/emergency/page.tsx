
'use client';

import { motion } from 'framer-motion';
import { Shield, Activity, Phone, LifeBuoy, MapPin, ExternalLink, Siren, HeartPulse, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const emergencyContacts = [
  {
    category: 'National Helplines',
    icon: Siren,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    contacts: [
      { label: 'Police', number: '100', desc: 'Direct access to local police' },
      { label: 'Ambulance', number: '108', desc: 'Medical emergency services' },
      { label: 'Women Helpline', number: '1091', desc: 'Dedicated support for women' },
      { label: 'Child Helpline', number: '1098', desc: 'Child protection services' },
    ]
  },
  {
    category: 'Tourism Helplines',
    icon: LifeBuoy,
    color: 'text-primary',
    bg: 'bg-primary/10',
    contacts: [
      { label: 'National Tourism', number: '1363', desc: 'Ministry of Tourism India' },
      { label: 'AP Tourism', number: '1800-425-4545', desc: 'Andhra Pradesh Helpdesk' },
      { label: 'TS Tourism', number: '1800-425-4646', desc: 'Telangana Tourism Support' },
    ]
  }
];

export default function EmergencyPage() {
  const findNearbyHospitals = () => {
    window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-red-500/10 text-red-500 border-none mb-4 px-4 py-1">Safety First</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline">Emergency Support</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Stay safe during your journey. Quick access to essential helplines and medical support.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((group, idx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="premium-card h-full border border-secondary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`${group.bg} p-3 rounded-2xl`}>
                        <group.icon className={`w-6 h-6 ${group.color}`} />
                      </div>
                      <CardTitle className="text-xl font-bold">{group.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.contacts.map((contact) => (
                      <div key={contact.label} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl group hover:bg-secondary/50 transition-colors">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{contact.label}</p>
                          <p className="text-xl font-black text-primary">{contact.number}</p>
                          <p className="text-xs text-muted-foreground">{contact.desc}</p>
                        </div>
                        <Button size="icon" className="rounded-full h-12 w-12 bg-primary shadow-lg" asChild>
                          <a href={`tel:${contact.number}`}>
                            <Phone className="w-5 h-5" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="premium-card border-2 border-dashed border-primary/20 bg-primary/5">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-xl">
                <HeartPulse className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              <div className="flex-grow text-center md:text-left space-y-2">
                <h3 className="text-2xl font-black font-headline">Medical Emergency?</h3>
                <p className="text-muted-foreground">Quickly locate the nearest verified hospitals and trauma centers in your current area.</p>
              </div>
              <Button onClick={findNearbyHospitals} size="lg" className="rounded-2xl h-14 px-8 font-bold gap-2 shrink-0 shadow-xl shadow-primary/20">
                <MapPin className="w-5 h-5" /> Find Hospitals <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="premium-card bg-zinc-900 text-white p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">Safety Tips</h3>
            </div>
            <ul className="space-y-4 text-sm text-zinc-400 font-body">
              <li className="flex gap-3">
                <span className="text-primary font-black">•</span>
                <span>Keep your Aadhar and PAN soft copies accessible in your app profile.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-black">•</span>
                <span>Always book verified guides with the "Shield" badge.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-black">•</span>
                <span>Share your live location with family using Google Maps during treks.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-black">•</span>
                <span>Avoid isolated spots after sunset without a local expert.</span>
              </li>
            </ul>
          </Card>

          <Card className="premium-card border-secondary p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h4 className="font-bold">About 1363</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              The 24x7 Multi-Lingual Tourist Infoline (1363) provides information in 12 languages including Hindi, English, Arabic, French, German, Italian, Japanese, Korean, Chinese, Portuguese, Russian and Spanish.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
