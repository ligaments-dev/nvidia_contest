"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, ArrowUp, Menu, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@nextui-org/react";

const { Dragger } = Upload;

export function Dashboard() {
  const [showConversation, setShowConversation] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState("");
  const [rows, setRows] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false); // New state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize WebSocket connection after file upload
  const initializeWebSocket = () => {
    const websocket = new WebSocket("ws://localhost:8697/chat");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.content.replace(/\n/g, "  \n") },
      ]);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      message.error("WebSocket connection error. Please try again later.");
      setIsLoading(false);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      websocket.close();
    };
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!isFileUploaded) {
      setMessages([
        ...messages,
        { role: "assistant", content: "Please upload your file to proceed" },
      ]);
      setShowConversation(true);
      setRows(1);
      return;
    }

    if (inputMessage.trim() && ws) {
      const userMessage = {
        role: "user",
        content: inputMessage.replace(/\n/g, "  \n"),
      };
      setMessages([...messages, userMessage]);
      setInputMessage("");
      setShowConversation(true);
      setRows(1);
      setIsLoading(true);

      ws.send(JSON.stringify(userMessage));
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowConversation(false);
  };

  // File upload properties
  const uploadProps = {
    name: "files",
    multiple: true,
    action: "http://localhost:8697/upload-files",
    onChange(info: any) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setIsFileUploaded(true);
        if (!ws) {
          initializeWebSocket(); // Initialize WebSocket after file upload
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="flex flex-col -mt-16 pt-16 h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg md:text-2xl font-bold">
          Fieldtech Co-Intelligence
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={resetChat}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chats
              </Button>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-[2rem] !text-primary" />
                </p>
                <p className="ant-upload-text">Click or drag file to upload</p>
                <p className="ant-upload-hint">
                  Support for single or bulk upload.
                </p>
              </Dragger>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:w-56 lg:w-72 border-r p-6 flex-col">
          <Button variant="default" className="w-full mb-6" onClick={resetChat}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chats
          </Button>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-[2rem] !text-primary" />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
            <p className="ant-upload-hint">
              Support for single or bulk upload.
            </p>
          </Dragger>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {!showConversation ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="text-lg md:text-2xl font-bold mb-4">
                    Welcome to Fieldtech Co-Intelligence
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Start a conversation to get assistance with your fiber
                    installation and repair tasks.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <MessageSquare className="mb-4 text-lg mx-auto text-muted-foreground" />
                      <h3 className="font-semibold mb-2">AI Assistant</h3>
                      <p className="text-sm text-muted-foreground">
                        Get real-time assistance for your tasks.
                      </p>
                    </Card>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <InboxIcon className="mb-4 text-lg mx-auto text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Document Upload</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload documents for analysis.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {messages.map((message, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          message.role === "user"
                            ? "/placeholder.svg"
                            : "/placeholder-bot.svg"
                        }
                        alt={message.role}
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="rounded-lg bg-muted p-4">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: (props) => (
                              <a
                                href={props.href}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {props.children}
                              </a>
                            ),
                            h1: (props) => (
                              <h1 className="text-2xl font-bold mt-4 mb-2">
                                {props.children}
                              </h1>
                            ),
                            h2: (props) => (
                              <h2 className="text-xl font-bold mt-3 mb-2">
                                {props.children}
                              </h2>
                            ),
                            h3: (props) => (
                              <h3 className="text-lg font-bold mt-2 mb-1">
                                {props.children}
                              </h3>
                            ),
                            p: (props) => (
                              <p className="mb-3">{props.children}</p>
                            ),
                            ul: (props) => (
                              <ul className="list-disc ml-6 mb-2 space-y-2">
                                {props.children}
                              </ul>
                            ),
                            ol: (props) => (
                              <ol className="list-decimal ml-6 mb-2 space-y-2">
                                {props.children}
                              </ol>
                            ),
                            li: (props) => (
                              <li className="mb-1">{props.children}</li>
                            ),
                            table: (props) => (
                              <table className="border-collapse border rounded-xl border-gray-300 mb-2">
                                {props.children}
                              </table>
                            ),
                            th: (props) => (
                              <th className=" px-4 py-2 border-2 bg-gray-100 border-gray-300">
                                {props.children}
                              </th>
                            ),
                            td: (props) => (
                              <td className=" px-4 border-2 py-2 border-gray-300">
                                {props.children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder-bot.svg" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="space-y-3 rounded-lg bg-muted p-4">
                        <Skeleton className="w-3/5 rounded-lg">
                          <div className="h-3 w-3/5 rounded-lg bg-default-100"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                          <div className="h-3 w-4/5 rounded-lg bg-default-100"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                          <div className="h-3 w-2/5 rounded-lg bg-default-100"></div>
                        </Skeleton>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-background">
            <div className="max-w-4xl mx-auto flex gap-4">
              <textarea
                className="flex-1 text-sm p-2 border border-neutral-300 focus:border-green-600 rounded-md resize-none"
                placeholder="Fieldtech AI, Ask a question or describe an issue or search with text, images, video or voice..."
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  const lineCount = e.target.value.split("\n").length;
                  setRows(Math.min(4, lineCount));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={rows}
              />
              <Button onClick={handleSendMessage}>
                <ArrowUp />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
