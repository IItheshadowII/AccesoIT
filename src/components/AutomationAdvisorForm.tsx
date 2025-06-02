
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { automationAdvisor, type AutomationAdvisorOutput, type AutomationAdvisorInput } from '@/ai/flows/automation-advisor';
import type { Locale } from '@/lib/i18n-config';

interface AdvisorFormDictionary {
  inputLabel: string;
  inputPlaceholder: string;
  submit: string;
  recommendationTitle: string;
  reasoningTitle: string;
  loading: string;
  error: string;
  googleApiKeyError: string;
  googleApiKeyInfo: string;
}

interface AutomationAdvisorFormProps {
  dictionary: AdvisorFormDictionary;
  currentLang: Locale;
}

const advisorSchema = z.object({
  businessRequirements: z.string().min(20, { message: 'Please provide more details about your business requirements (min 20 characters).' }),
});

type AdvisorFormValues = z.infer<typeof advisorSchema>;

// Helper function to clean text
const cleanAIResponseText = (text: string | undefined): string => {
  if (!text) return '';
  // Replace specific problematic sequences that look like encoding issues or odd model outputs
  let cleanedText = text
    .replace(/a\)"/g, 'á')
    .replace(/e\)"/g, 'é')
    .replace(/i\)"/g, 'í')
    .replace(/o\)"/g, 'ó')
    .replace(/u\)"/g, 'ú')
    .replace(/A\)"/g, 'Á')
    .replace(/E\)"/g, 'É')
    .replace(/I\)"/g, 'Í')
    .replace(/O\)"/g, 'Ó')
    .replace(/U\)"/g, 'Ú')
    .replace(/n\)"/g, 'ñ') // For cases like "año"
    .replace(/N\)"/g, 'Ñ');

  // Replace tabs with a single space
  // Replace multiple newlines (and any whitespace between them) with a single newline
  cleanedText = cleanedText.replace(/\t/g, ' ').replace(/\n\s*\n/g, '\n');
  return cleanedText;
};


export default function AutomationAdvisorForm({ dictionary, currentLang }: AutomationAdvisorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AutomationAdvisorOutput | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdvisorFormValues>({
    resolver: zodResolver(advisorSchema),
  });

  const onSubmit: SubmitHandler<AdvisorFormValues> = async (data) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const inputForAI: AutomationAdvisorInput = {
        businessRequirements: data.businessRequirements,
        language: currentLang,
      };
      const result = await automationAdvisor(inputForAI);
      setRecommendation(result);
      reset();
    } catch (error: any) {
      console.error('Error getting AI recommendation:', error);
      let errorMessage = dictionary.error;
      // Check for specific error messages related to API key problems.
      // This check is now more generic as the flow handles API key source details.
      if (error.message && (error.message.includes("API key") || error.message.includes("API_KEY"))) {
        errorMessage = dictionary.googleApiKeyError || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 10000, // Show for longer
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="businessRequirements" className="text-lg font-medium">
            {dictionary.inputLabel}
          </Label>
          <Textarea
            id="businessRequirements"
            placeholder={dictionary.inputPlaceholder}
            {...register('businessRequirements')}
            className={`mt-2 min-h-[150px] resize-y ${errors.businessRequirements ? 'border-destructive' : ''}`}
            rows={6}
          />
          {errors.businessRequirements && (
            <p className="mt-1 text-sm text-destructive">{errors.businessRequirements.message}</p>
          )}
           <p className="mt-2 text-xs text-muted-foreground">{dictionary.googleApiKeyInfo}</p>
        </div>
        <Button type="submit" className="w-full py-3 text-base" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {dictionary.loading}
            </div>
          ) : (
            dictionary.submit
          )}
        </Button>
      </form>

      {recommendation && (
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-accent">{dictionary.recommendationTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-card-foreground">
                {cleanAIResponseText(recommendation.recommendation)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-accent">{dictionary.reasoningTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-card-foreground">
                {cleanAIResponseText(recommendation.reasoning)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
