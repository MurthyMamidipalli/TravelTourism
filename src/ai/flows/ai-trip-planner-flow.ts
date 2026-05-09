'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a highly personalized 
 * travel itinerary based on user budget, duration, and interests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITripPlannerInputSchema = z.object({
  budget: z.string().describe("The user's budget range (e.g., 'Budget', 'Moderate', 'Luxury')."),
  days: z.coerce.number().min(1).max(30).describe("Number of days for the trip."),
  interests: z.string().describe("User interests (e.g., 'adventure, temples, photography')."),
  location: z.string().optional().describe("Specific location if preferred, otherwise general South India."),
});
export type AITripPlannerInput = z.infer<typeof AITripPlannerInputSchema>;

const AITripPlannerOutputSchema = z.object({
  title: z.string().describe("A catchy title for the trip."),
  estimatedCost: z.string().describe("An estimated cost breakdown."),
  dailyItinerary: z.array(z.object({
    day: z.number(),
    activities: z.array(z.string()),
    description: z.string()
  })).describe("Day-by-day activities."),
  proTips: z.array(z.string()).describe("Travel tips for the user."),
});
export type AITripPlannerOutput = z.infer<typeof AITripPlannerOutputSchema>;

export async function aiTripPlanner(input: AITripPlannerInput): Promise<AITripPlannerOutput> {
  return aiTripPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTripPlannerPrompt',
  input: {schema: AITripPlannerInputSchema},
  output: {schema: AITripPlannerOutputSchema},
  prompt: `You are an elite AI Travel Concierge. 
Generate a comprehensive travel itinerary based on:
- Budget: {{{budget}}}
- Duration: {{{days}}} Days
- Interests: {{{interests}}}
{{#if location}}- Location: {{{location}}}{{/if}}

Ensure the itinerary is realistic, includes travel times between spots, and suggests local food specialties matching the budget level.`,
});

const aiTripPlannerFlow = ai.defineFlow(
  {
    name: 'aiTripPlannerFlow',
    inputSchema: AITripPlannerInputSchema,
    outputSchema: AITripPlannerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
