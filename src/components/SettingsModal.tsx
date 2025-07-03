
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [endpointUrl, setEndpointUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const savedUrl = localStorage.getItem('chamabot_endpoint') || 'http://localhost:5000';
      setEndpointUrl(savedUrl);
    }
  }, [open]);

  const handleSave = () => {
    if (!endpointUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid endpoint URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(endpointUrl);
      localStorage.setItem('chamabot_endpoint', endpointUrl.trim());
      toast({
        title: "Settings saved",
        description: "Endpoint URL has been updated successfully."
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL format (e.g., http://localhost:5000).",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Chama Bot backend connection settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Backend URL
            </Label>
            <Input
              id="endpoint"
              placeholder="http://localhost:5000"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
