
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { chatWithAccesoBot, type ChatWithAccesoBotInput } from '@/ai/flows/customer-support-flow';
import type { Locale } from '@/lib/i18n-config';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface AIChatPopupProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dictionary: {
    title: string;
    inputPlaceholder: string;
    sendButton: string;
    typing: string;
    errorMessage: string;
    greeting: string;
  };
  currentLang: Locale;
}

export default function AIChatPopup({ isOpen, onOpenChange, dictionary, currentLang }: AIChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'greeting', sender: 'ai', text: dictionary.greeting },
      ]);
    }
  }, [isOpen, dictionary.greeting, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { id: Date.now().toString(), sender: 'user', text: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiInput: ChatWithAccesoBotInput = {
        userMessage: userInput,
        language: currentLang,
        chatHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{text: m.text}]})),
      };
      const result = await chatWithAccesoBot(aiInput);
      const aiResponse: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: result.aiResponse };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: dictionary.errorMessage,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] flex flex-col h-[70vh] max-h-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-primary" />
            {dictionary.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow p-6 pt-0" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {msg.text.split('\\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-lg px-4 py-2 text-sm bg-secondary text-secondary-foreground flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {dictionary.typing}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-2 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="userInput"
              placeholder={dictionary.inputPlaceholder}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="button" size="icon" onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">{dictionary.sendButton}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
