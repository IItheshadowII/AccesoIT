import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingWhatsAppButtonProps {
  dictionary: {
    tooltip: string;
  };
}

export default function FloatingWhatsAppButton({ dictionary }: FloatingWhatsAppButtonProps) {
  // Replace with your actual WhatsApp number or N8N WebSocket logic trigger
  const whatsappLink = "https://wa.me/1234567890"; // Example number

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            aria-label={dictionary.tooltip}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-7 w-7" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{dictionary.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
