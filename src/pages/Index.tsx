
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
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Chama Bot</h1>
                <p className="text-sm text-green-600">Smart Chama Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === 'chat' ? 'default' : 'outline'}
                onClick={() => setCurrentView('chat')}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
              
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto h-[calc(100vh-88px)]">
        {currentView === 'chat' ? <ChamaBot /> : <Dashboard />}
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-green-600 border border-green-200">
        Powered by Chama Bot 💬
      </div>
    </div>
  );
};

export default Index;
