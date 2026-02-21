'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Mic } from 'lucide-react';

interface FileUploadProps {
  onFileProcessed: () => void;
  isLoading: boolean;
}

export default function FileUpload({ onFileProcessed, isLoading }: FileUploadProps) {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        localStorage.setItem('analysisResult', await response.text());
        onFileProcessed();
      }
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Study Material
        </CardTitle>
        <CardDescription>
          Paste your lecture notes, transcripts, or study materials below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Text Content</Label>
          <Textarea
            id="text-input"
            placeholder="Paste your lecture notes, transcripts, or study materials here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit} 
            disabled={!text.trim() || isProcessing || isLoading}
            className="flex-1"
          >
            {isProcessing || isLoading ? 'Processing...' : 'Analyze Text'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Text analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <Mic className="h-4 w-4" />
            <span>AI-powered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
