
import React, { useState } from 'react';
import ChamaBot from '../components/ChamaBot';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { MessageSquare, LayoutDashboard } from 'lucide-react';

type ViewMode = 'chat' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-green-800">Chama Bot</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={currentView === 'chat' ? 'default' : 'outline'}
                onClick={() => setCurrentView('chat')}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </Button>
              
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        {currentView === 'chat' ? <ChamaBot /> : <Dashboard />}
      </div>
    </div>
  );
};

export default Index;
