'use client'

import { useState, useEffect } from 'react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Conversation = {
  id: string
  title: string
  preview: string
  updatedAt: Date
  unread: boolean
  firstUserMessage?: string
}

export function Sidebar({
  isCollapsed,
  toggleCollapse,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  conversations = []
}: {
  isCollapsed: boolean
  toggleCollapse: () => void
  activeConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  conversations?: Conversation[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isForcedOpen, setIsForcedOpen] = useState(false)

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      preview: 'Start typing your message...',
      updatedAt: new Date(),
      unread: true,
      firstUserMessage: ''
    }
    onNewConversation()
    onSelectConversation(newConversation.id)
  }

  const filteredConversations = conversations
    .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(date).replace(/\//g, '-')
    } catch (error) {
      return null
    }
  }

  const getConversationTitle = (conv: Conversation) => {
    if (conv.firstUserMessage) {
      return conv.firstUserMessage.slice(0, 20) + (conv.firstUserMessage.length > 20 ? '...' : '')
    }
    return conv.title
  }

  const getConversationPreview = (conv: Conversation) => {
    if (conv.firstUserMessage) {
      return conv.firstUserMessage.slice(0, 50) + (conv.firstUserMessage.length > 50 ? '...' : '')
    }
    return conv.preview
  }

  const handleItemClick = (id: string) => {
    if (isCollapsed && !isForcedOpen) {
      setIsForcedOpen(true)
    }
    onSelectConversation(id)
  }

  return (
    <div 
      className={cn(
        "flex flex-col border-r bg-background h-full transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-64",
        isHovered && isCollapsed && "w-64"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!isForcedOpen) {
          setIsHovered(false)
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {(!isCollapsed || isHovered || isForcedOpen) ? (
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Bot className="h-6 w-6 text-primary" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            toggleCollapse()
            setIsForcedOpen(false)
          }}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            (isCollapsed && !isHovered && !isForcedOpen) && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-2 space-y-2">
        {(!isCollapsed || isHovered || isForcedOpen) ? (
          <Button 
            onClick={handleNewConversation}
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
        ) : (
          <Button 
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            className="w-full"
            title="New Conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <div className="relative">
          {(!isCollapsed || isHovered || isForcedOpen) ? (
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
              <Tooltip key={conv.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeConversationId === conv.id ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full justify-start gap-2 h-auto py-2 px-3",
                      (isCollapsed && !isHovered && !isForcedOpen) && "justify-center"
                    )}
                    onClick={() => handleItemClick(conv.id)}
                  >
                    {(!isCollapsed || isHovered || isForcedOpen) ? (
                      <>
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="truncate font-medium">
                            {getConversationTitle(conv)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(conv.updatedAt)}
                          </p>
                        </div>
                        {conv.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </>
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                {(isCollapsed && !isHovered && !isForcedOpen) && (
                  <TooltipContent side="right">
                    <p>{getConversationTitle(conv)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(conv.updatedAt)}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
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
