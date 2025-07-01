import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Phone, MoreVertical, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface Member {
  name: string;
  monthlyGoal: number;
  currentMonthContributions: number;
  totalContributions: number;
  joinDate: Date;
}

const ChamaBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load member data from localStorage on component mount
  useEffect(() => {
    const savedMember = localStorage.getItem('chamaMember');
    if (savedMember) {
      setMember(JSON.parse(savedMember));
    }
    
    // Add initial welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "👋 Hello! I'm Chama Bot, your friendly contribution assistant! Type 'Join Chama' to get started, or try commands like 'Balance', 'Paid [amount]', or just say hello!",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Save member data to localStorage
  useEffect(() => {
    if (member) {
      localStorage.setItem('chamaMember', JSON.stringify(member));
    }
  }, [member]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const botTyping = async (responseText: string) => {
    setIsTyping(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    addMessage(responseText, 'bot');
  };

  const processUserMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase().trim();

    // Join Chama Flow
    if (lowerMessage === 'join chama') {
      await botTyping("🎉 Welcome to Chama Bot! \n\nI'm here to help you manage your contributions. Please reply with your full name and monthly contribution amount.\n\nExample: Monicah Mwanzia, 1000");
      return;
    }

    // Handle registration (name, amount format)
    if (lowerMessage.includes(',') && !member) {
      const parts = message.split(',');
      if (parts.length === 2) {
        const name = parts[0].trim();
        const amount = parseFloat(parts[1].trim());
        
        if (name && !isNaN(amount) && amount > 0) {
          const newMember: Member = {
            name,
            monthlyGoal: amount,
            currentMonthContributions: 0,
            totalContributions: 0,
            joinDate: new Date()
          };
          setMember(newMember);
          await botTyping(`🎊 Thanks ${name}! You've been registered successfully.\n\nYour monthly contribution goal is KES ${amount.toLocaleString()}.\n\nYou can now use commands like:\n• "Paid [amount]" to log contributions\n• "Balance" to check your progress\n• Just chat with me anytime! 😊`);
          return;
        }
      }
      await botTyping("❌ Please use the format: Full Name, Amount\nExample: Monicah Mwanzia, 1000");
      return;
    }

    // Balance Check Flow
    if (lowerMessage === 'balance') {
      if (!member) {
        await botTyping("👆 Please join the Chama first by typing 'Join Chama'");
        return;
      }
      
      const remaining = member.monthlyGoal - member.currentMonthContributions;
      const percentage = Math.round((member.currentMonthContributions / member.monthlyGoal) * 100);
      
      await botTyping(`📊 Hi ${member.name}!\n\n💰 This month's progress:\n• Contributed: KES ${member.currentMonthContributions.toLocaleString()}\n• Monthly goal: KES ${member.monthlyGoal.toLocaleString()}\n• Remaining: KES ${remaining.toLocaleString()}\n• Progress: ${percentage}%\n\n${percentage >= 100 ? '🎉 Congratulations! Goal achieved!' : '💪 Keep it up!'}`);
      return;
    }

    // Contribution Logging Flow
    if (lowerMessage.startsWith('paid ')) {
      if (!member) {
        await botTyping("👆 Please join the Chama first by typing 'Join Chama'");
        return;
      }
      
      const amountStr = message.substring(5).trim();
      const amount = parseFloat(amountStr);
      
      if (isNaN(amount) || amount <= 0) {
        await botTyping("❌ Please enter a valid amount. Example: Paid 500");
        return;
      }
      
      const updatedMember = {
        ...member,
        currentMonthContributions: member.currentMonthContributions + amount,
        totalContributions: member.totalContributions + amount
      };
      setMember(updatedMember);
      
      const today = new Date().toLocaleDateString('en-GB');
      await botTyping(`✅ Thanks ${member.name}! KES ${amount.toLocaleString()} received on ${today}.\n\n💰 Your updated balance this month is KES ${updatedMember.currentMonthContributions.toLocaleString()}.\n\n${updatedMember.currentMonthContributions >= member.monthlyGoal ? '🎉 Congratulations! You\'ve reached your monthly goal!' : '👍 Great progress!'}`);
      return;
    }

    // Help/General responses
    if (lowerMessage.includes('help') || lowerMessage === '?') {
      await botTyping(`🤝 I'm here to help! Here's what I can do:\n\n📝 Commands:\n• "Join Chama" - Register as a member\n• "Balance" - Check your contribution status\n• "Paid [amount]" - Log a contribution\n\n💡 Examples:\n• Join Chama\n• Paid 1000\n• Balance\n\nJust type naturally - I understand! 😊`);
      return;
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greeting = member 
        ? `👋 Hello ${member.name}! How can I help you today?`
        : "👋 Hello! I'm Chama Bot. Type 'Join Chama' to get started!";
      await botTyping(greeting);
      return;
    }

    // Default response
    await botTyping(`🤔 I didn't quite understand that. Try:\n\n• "Join Chama" to register\n• "Balance" to check your progress\n• "Paid [amount]" to log contributions\n• "Help" for more commands\n\nI'm here to help! 😊`);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const messageText = inputText.trim();
    setInputText('');
    addMessage(messageText, 'user');
    
    // Process the message
    await processUserMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simulate scheduled messages (for demo purposes)
  const triggerMonthlyReminder = () => {
    if (member) {
      addMessage(`📅 Hi ${member.name}, just a reminder to send your KES ${member.monthlyGoal.toLocaleString()} contribution by the 5th of this month. 💰`, 'bot');
      toast.success('Monthly reminder sent!');
    } else {
      toast.error('Please join the Chama first');
    }
  };

  const triggerWeeklySummary = () => {
    const sampleSummary = `📊 Weekly Chama Update:\n\n👥 Member Progress:\n• ${member?.name || 'You'}: KES ${member?.currentMonthContributions.toLocaleString() || '0'}\n• James Kiprotich: KES 1,500\n• Esther Wanjiku: KES 800\n• Peter Mwangi: KES 2,000\n\n🎯 Keep up the great work everyone!`;
    addMessage(sampleSummary, 'bot');
    toast.success('Weekly summary sent!');
  };

  const triggerWeeklyReminder = () => {
    if (member) {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekFormatted = nextWeek.toLocaleDateString('en-GB');
      
      addMessage(`🗓️ Happy Friday ${member.name}! 💚\n\nWeekend reminder: Don't forget about your Chama contribution goal this month.\n\n📊 Current progress: KES ${member.currentMonthContributions.toLocaleString()} / KES ${member.monthlyGoal.toLocaleString()}\n\nHave a wonderful weekend! 🌟`, 'bot');
      toast.success('Weekly Friday reminder sent!');
    } else {
      toast.error('Please join the Chama first');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <ArrowLeft className="w-6 h-6" />
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <div>
              <h1 className="font-semibold text-lg">Chama Bot</h1>
              <p className="text-green-100 text-sm">Online • Your contribution assistant</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Phone className="w-6 h-6" />
            <MoreVertical className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-yellow-50 border-b border-yellow-200 p-2">
        <div className="max-w-md mx-auto flex gap-2 flex-wrap">
          <Button 
            onClick={triggerMonthlyReminder} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            📅 Monthly Reminder
          </Button>
          <Button 
            onClick={triggerWeeklySummary} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            📊 Weekly Summary
          </Button>
          <Button 
            onClick={triggerWeeklyReminder} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            🗓️ Friday Reminder
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                message.sender === 'user'
                  ? 'bg-green-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none border px-4 py-2 shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-md mx-auto flex items-center space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="rounded-full bg-green-500 hover:bg-green-600 p-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Member Status */}
      {member && (
        <div className="bg-green-50 border-t border-green-200 p-2">
          <div className="max-w-md mx-auto text-center text-sm text-green-700">
            👤 {member.name} • Goal: KES {member.monthlyGoal.toLocaleString()} • 
            Progress: KES {member.currentMonthContributions.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamaBot;
