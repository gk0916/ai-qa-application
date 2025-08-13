'use client'

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './components/sidebar'
import { MessageInput } from './components/message-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bot, User, Mic, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(100).max(4000),
})

type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

type Conversation = {
  id: string
  messages: Message[]
  title?: string
  preview?: string
  updatedAt: Date
  unread?: boolean
  firstUserMessage?: string
}

function parseConversations(data: any): Record<string, Conversation> {
  const result: Record<string, Conversation> = {};
  for (const key in data) {
    const conv = data[key];
    result[key] = {
      ...conv,
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  }
  return result;
}


export default function ChatPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Record<string, Conversation>>({})
  const [activeConversationId, setActiveConversationId] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const scrollAreaRootRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const saved = localStorage.getItem('conversations')
    if (saved) {
      setConversations(parseConversations(JSON.parse(saved)))
    }
    const savedActiveId = localStorage.getItem('activeConversationId')
    if (savedActiveId) {
      setActiveConversationId(savedActiveId)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('activeConversationId', activeConversationId)
    }
  }, [activeConversationId])

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    },
  })

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `${activeConversationId}-${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setConversations(prev => {
      const conv = prev[activeConversationId] || {
        id: activeConversationId,
        title: input.slice(0, 20),
        preview: input.slice(0, 50),
        updatedAt: new Date(),
        messages: [],
        firstUserMessage: input
      }

      // 如果没有 firstUserMessage，设置它和标题预览
      const firstUserMessage = conv.firstUserMessage || input
      const title = conv.firstUserMessage ? conv.title : input.slice(0, 20)
      const preview = conv.firstUserMessage ? conv.preview : input.slice(0, 50)

      return {
        ...prev,
        [activeConversationId]: {
          ...conv,
          messages: [...conv.messages, userMessage], // 创建新数组
          updatedAt: new Date(),
          firstUserMessage,
          title,
          preview,
        }
      }
    })

    setInput('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse: Message = {
        id: `${activeConversationId}-${Date.now() + 1}`,
        content: `I received: "${input}". This is a simulated response.`,
        role: 'assistant',
        timestamp: new Date()
      }

      setConversations(prev => {
        const conv = prev[activeConversationId]
        if (!conv) return prev
        return {
          ...prev,
          [activeConversationId]: {
            ...conv,
            messages: [...conv.messages, aiResponse], // 创建新数组
            updatedAt: new Date()
          }
        }
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    const newId = Date.now().toString()
    setActiveConversationId(newId)
    setConversations(prev => ({
      ...prev,
      [newId]: {
        id: newId,
        title: 'New Conversation',
        preview: 'Start typing your message...',
        updatedAt: new Date(),
        messages: [],
        unread: true
      }
    }))
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    // Mark as read when selected
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        unread: false
      }
    }))
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(/\//g, '-')
  }

  const activeMessages = conversations[activeConversationId]?.messages || []
  const showWelcomePage = activeMessages.length === 0
  
  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

    if (isNearBottom) {
      // requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: 'smooth',
        });
      // });
    }
  }, [activeMessages]);
  
  if (!isHydrated) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
    // return null
  }

  const sidebarConversations = Object.values(conversations).map(conv => ({
    id: conv.id,
    title: conv.title || 'New Conversation',
    preview: conv.preview || 'Start typing...',
    updatedAt: conv.updatedAt,
    unread: conv.unread || false,
    firstUserMessage: conv.firstUserMessage
  }))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        conversations={sidebarConversations}
      />

      <div className="flex-1 flex flex-col">
        {showWelcomePage ? (
          <div className="flex-1 flex flex-col">
            {/* Brand Content (Top 1/3) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-h-[33vh]">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-center">AI Assistant</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Your intelligent companion for productive conversations
                </p>
              </div>
            </div>

            {/* Config Form (Middle) */}
            <ScrollArea className="flex-1 p-6 min-h-0">
              <Form {...form}>
                <form className="space-y-6 max-w-md mx-auto">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="1" 
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Tokens</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="100" 
                            max="4000"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea viewportRef={viewportRef} className="flex-1 p-4 min-h-0">
            <div className="space-y-6 max-w-3xl mx-auto">
              {activeMessages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "rounded-lg px-4 py-2",
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary'
                    )}>
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-80">
                        {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Input Area (Bottom) */}
        <div className="p-4">
          <div className="relative max-w-3xl mx-auto">
            <MessageInput
              value={input}
              onChange={setInput}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
