'use client'

import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}) {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 p-0"
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="pl-10 pr-10 py-4"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button 
          size="icon" 
          className="h-8 w-8 p-0"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
