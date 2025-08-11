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
  conversations = [] // Add default empty array here
}: {
  isCollapsed: boolean
  toggleCollapse: () => void
  activeConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  conversations?: Conversation[] // Make prop optional
}) {
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Rest of the file remains the same...
  [Previous content continues unchanged...]
