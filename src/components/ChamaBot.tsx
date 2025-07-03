
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Phone, User, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  phone?: string;
}

const ChamaBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Chama Bot! 👋 I'm here to help you manage your Chama contributions. Type 'Join Chama' to get started or ask me anything about your contributions.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getEndpointUrl = () => {
    return localStorage.getItem('chamabot_endpoint') || 'http://localhost:5000';
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to send messages.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
      phone: phoneNumber
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${getEndpointUrl()}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          phone: phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I didn't understand that. Please try again.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Chama Bot. Please check your connection and try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "Join Chama",
    "Check Balance",
    "I paid 1000 for welfare",
    "Who hasn't paid?",
    "Show my contributions"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      {/* Phone Number Input */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-green-600" />
            <Input
              placeholder="Enter your phone number (e.g., +254700000000)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-green-600" />
            <span>Chat with Chama Bot</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-green-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!message.isUser && <Bot className="h-4 w-4 mt-1 text-green-600" />}
                    {message.isUser && <User className="h-4 w-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-green-600" />
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMessage(action)}
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[44px] max-h-32 resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !currentMessage.trim() || !phoneNumber.trim()}
                className="self-end"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChamaBot;
