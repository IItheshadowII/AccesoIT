
'use client';

import { useState } from 'react';
import { BotMessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIChatPopup from '@/components/AIChatPopup';
import type { Locale } from '@/lib/i18n-config';

interface FloatingActionButtonProps {
  dictionary: {
    tooltip: string;
    chatPopup: {
      title: string;
      inputPlaceholder: string;
      sendButton: string;
      typing: string;
      errorMessage: string;
      greeting: string;
    };
  };
  currentLang: Locale;
}

export default function FloatingActionButton({ dictionary, currentLang }: FloatingActionButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            aria-label={dictionary.tooltip}
            onClick={() => setIsChatOpen(true)}
          >
            <BotMessageSquare className="h-7 w-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{dictionary.tooltip}</p>
        </TooltipContent>
      </Tooltip>
      <AIChatPopup
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        dictionary={dictionary.chatPopup}
        currentLang={currentLang}
      />
    </TooltipProvider>
  );
}
