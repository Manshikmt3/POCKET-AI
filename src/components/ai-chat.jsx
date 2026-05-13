"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { chatWithAi } from "@/actions/gemini";

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your AI financial assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const res = await chatWithAi([...messages, userMessage]);
    if (res.success) {
      setMessages(prev => [...prev, { role: "ai", text: res.data }]);
    } else {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting right now." }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl flex flex-col z-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-2 rounded-lg max-w-[80%] text-sm ${
                  msg.role === "user" ? "bg-green-600 text-white" : "bg-muted"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="pt-2">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "AI is thinking..." : "Ask me anything..."}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? "..." : "Send"}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
