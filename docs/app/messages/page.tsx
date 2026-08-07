'use client'

import { Search } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { currentUser } from '@/lib/mock-data'

const conversations = [
  {
    id: '1',
    name: 'Emily Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastMessage: 'Thank you for sharing that beautiful memory of Robert. It meant so much to our family.',
    timestamp: '2h ago',
    unread: true,
  },
  {
    id: '2',
    name: 'Darius Ellis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'The memorial mixtape night is confirmed for July 12th. Would love to have you there.',
    timestamp: '1d ago',
    unread: false,
  },
  {
    id: '3',
    name: 'Shandon Coffman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    lastMessage: 'I found some more photos from the garden! Will upload them this weekend.',
    timestamp: '3d ago',
    unread: false,
  },
]

export default function MessagesPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Connect with others who share your memories
          </p>
        </header>

        {/* Search */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border mb-6">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Conversations */}
        <div className="space-y-2">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              className="w-full flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors text-left"
            >
              <div className="relative">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`font-medium truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {conversation.name}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {conversation.timestamp}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No messages yet. Connect with others through memorial pages.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
