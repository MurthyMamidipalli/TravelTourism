
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 p-8">
          <CardTitle className="text-2xl">Welcome, {user?.displayName || 'Traveler'}!</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-muted-foreground">
            This is your private dashboard. Your travel plans and guide inquiries will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
