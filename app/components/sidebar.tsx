'use client'

import { useState } from 'react'
import { 
  Search, 
  Settings, 
  Plus, 
  ChevronLeft, 
  MessageSquare,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type Conversation = {
  id: string
  title: string
  preview: string
  updatedAt: Date
  unread: boolean
}

export function Sidebar({
  isCollapsed,
  toggleCollapse,
  activeConversationId,
  onNewConversation
}: {
  isCollapsed: boolean
  toggleCollapse: () => void
  activeConversationId: string | null
  onNewConversation: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Getting Started',
      preview: 'Welcome to the AI assistant...',
      updatedAt: new Date(),
      unread: false
    },
    // More sample conversations...
  ])

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn(
      "flex flex-col border-r bg-background h-full transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[70px]" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <Bot className="h-6 w-6 text-primary" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-2 space-y-2">
        {!isCollapsed && (
          <Button 
            onClick={onNewConversation}
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
        )}
        {isCollapsed && (
          <Button 
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            className="w-full"
            title="New Conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <div className="relative">
          {!isCollapsed ? (
            <>
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          ) : (
            <Button 
              variant="ghost"
              size="icon"
              className="w-full"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredConversations.map((conv) => (
              <Button
                key={conv.id}
                variant={activeConversationId === conv.id ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-2 h-auto py-2 px-3",
                  isCollapsed && "justify-center"
                )}
              >
                {!isCollapsed && (
                  <>
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate font-medium">{conv.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.preview}
                      </p>
                    </div>
                    {conv.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </>
                )}
                {isCollapsed && (
                  <MessageSquare className="h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-2 border-t">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Settings className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
