import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const humanizeContent = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some AI content to humanize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Making request to humanize API...');
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: inputText.trim()
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.humanizedText || '';
      
      setHumanizedText(result);
      toast({
        title: "Content humanized!",
        description: "Your AI content has been successfully humanized.",
      });
    } catch (error) {
      console.error('Error humanizing content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to humanize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!humanizedText) return;
    
    try {
      await navigator.clipboard.writeText(humanizedText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Humanized content copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Humanizer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Transform robotic AI-generated content into natural, human-like text that connects with your audience
          </p>
          
          {/* Attribution and Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Created by{' '}
              <a 
                href="https://linkedin.com/in/salickr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-purple-700 transition-colors"
              >
                Salik Riyaz
              </a>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>For more tools, visit</span>
              <a 
                href="https://salikriyaz.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors inline-flex items-center gap-1"
              >
                salikriyaz.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Natural Language
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Human Touch
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Engaging Content
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                AI Content Input
                <Badge variant="outline" className="text-xs">Original</Badge>
              </CardTitle>
              <CardDescription>
                Paste your AI-generated content here to make it more human-like
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your AI-generated content here... 

Example: 'Artificial intelligence represents a significant technological advancement that enables machines to perform complex tasks typically requiring human intelligence, including pattern recognition, decision-making, and problem-solving capabilities.'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] resize-none border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {inputText.length} characters
                </span>
                <Button 
                  onClick={humanizeContent}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Humanizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Humanize Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                Humanized Content
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Humanized
                </Badge>
              </CardTitle>
              <CardDescription>
                Your AI content transformed into natural, human-like text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={humanizedText}
                  readOnly
                  placeholder="Your humanized content will appear here..."
                  className="min-h-[300px] resize-none border-gray-200 bg-gray-50/50"
                />
                {humanizedText && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {humanizedText.length} characters
                </span>
                {humanizedText && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Ready to use!
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Natural Flow</h3>
              <p className="text-gray-600">
                Transforms robotic AI text into natural, conversational content that reads authentically human
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Copy className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Preserve Meaning</h3>
              <p className="text-gray-600">
                Maintains all key information and facts while making the content more engaging and relatable
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Results</h3>
              <p className="text-gray-600">
                Get humanized content in seconds with powerful OpenAI technology and smart prompting
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
