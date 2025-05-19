
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Challenge } from '@/services/api';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose, challenge }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Writing Hints</DialogTitle>
          <DialogDescription>
            Here are some tips to help with this challenge.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-gray-700">
            For this {challenge.type} challenge, consider the specific audience and purpose. 
            What action do you want the reader to take?
          </p>
          
          <p className="text-gray-700">
            Some possible approaches:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Focus on benefits, not just features</li>
            <li>Use clear, concise language</li>
            <li>Create emotional connection</li>
            <li>Include a call to action</li>
          </ul>
          
          {challenge.example_prompt && (
            <p className="text-gray-700 italic">
              "{challenge.example_prompt}"
            </p>
          )}
        </div>
        
        <Button onClick={onClose}>Got it</Button>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
