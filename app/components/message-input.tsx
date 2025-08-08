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
      <div className="absolute left-3 top-3 flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="pl-14 pr-16 py-5"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
      />
      <div className="absolute right-3 top-3">
        <Button 
          size="icon" 
          className="h-8 w-8"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
