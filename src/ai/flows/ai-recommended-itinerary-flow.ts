'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a recommended itinerary
 * and list of local attractions based on a given location.
 *
 * - aiRecommendedItinerary - A function that generates an AI-powered itinerary.
 * - AIRecommendedItineraryInput - The input type for the aiRecommendedItinerary function.
 * - AIRecommendedItineraryOutput - The return type for the aiRecommendedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIRecommendedItineraryInputSchema = z.object({
  location: z
    .string()
    .describe("The specific location or operational region for which to generate an itinerary (e.g., 'Amalapuram, Andhra Pradesh')."),
  travelerPreferences: z
    .string()
    .optional()
    .describe(
      "Optional preferences for the itinerary, such as interests, pace, or duration. Examples: 'family-friendly activities', 'adventure and nature', 'relaxed pace for 3 days'."
    ),
});
export type AIRecommendedItineraryInput = z.infer<typeof AIRecommendedItineraryInputSchema>;

const AIRecommendedItineraryOutputSchema = z.object({
  suggestedAttractions: z.array(
    z.object({
      name: z.string().describe('The name of the attraction.'),
      description: z.string().describe('A brief description of the attraction.'),
    })
  ).describe('A list of suggested local attractions for the given location.'),
  suggestedItinerary: z
    .string()
    .describe('A brief, day-by-day suggested itinerary for the location, incorporating some of the attractions.'),
});
export type AIRecommendedItineraryOutput = z.infer<typeof AIRecommendedItineraryOutputSchema>;

export async function aiRecommendedItinerary(input: AIRecommendedItineraryInput): Promise<AIRecommendedItineraryOutput> {
  return aiRecommendedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRecommendedItineraryPrompt',
  input: {schema: AIRecommendedItineraryInputSchema},
  output: {schema: AIRecommendedItineraryOutputSchema},
  prompt: `You are an expert travel agent specializing in creating personalized itineraries and recommending local attractions.

Generate a list of suggested local attractions and a brief day-by-day itinerary for the following location.

Location: {{{location}}}
{{#if travelerPreferences}}Traveler Preferences: {{{travelerPreferences}}}{{/if}}

Focus on popular and interesting places that a tourist would enjoy. The itinerary should be concise and highlight the main activities for each day.`,
});

const aiRecommendedItineraryFlow = ai.defineFlow(
  {
    name: 'aiRecommendedItineraryFlow',
    inputSchema: AIRecommendedItineraryInputSchema,
    outputSchema: AIRecommendedItineraryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
