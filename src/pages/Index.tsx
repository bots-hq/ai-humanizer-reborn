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
  const [apiKey, setApiKey] = useState('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');
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

    if (!apiKey.trim()) {
      toast({
        title: "API Key required",
        description: "Please enter your OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert content humanizer. Your task is to transform AI-generated text into natural, human-like content while preserving the original meaning and key information. 

Guidelines:
- Add natural conversational elements and human touches
- Vary sentence structure and length
- Include subtle imperfections that humans naturally have
- Use more casual, relatable language where appropriate
- Add personal touches like "I think", "in my experience", etc.
- Make the tone warmer and more engaging
- Use more easy english words
- Ensure the content sounds like it was written by a real person
- Maintain the core message and facts
- Don't make it overly casual if the original was formal - just more human`
            },
            {
              role: 'user',
              content: `Please humanize this AI-generated content:\n\n${inputText}`
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content || '';
      
      setHumanizedText(result);
      toast({
        title: "Content humanized!",
        description: "Your AI content has been successfully humanized.",
      });
    } catch (error) {
      console.error('Error humanizing content:', error);
      toast({
        title: "Error",
        description: "Failed to humanize content. Please check your API key and try again.",
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

        {/* API Key Input */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">OpenAI API Key</CardTitle>
            <CardDescription>
              Enter your OpenAI API key to get started. Your key is stored locally and never sent to our servers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

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
                  disabled={isLoading || !inputText.trim() || !apiKey.trim()}
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
