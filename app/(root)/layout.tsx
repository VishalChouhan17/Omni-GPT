import { onboard } from '@/features/auth/action/onboard';
import { auth } from '@clerk/nextjs/server'
import { ChatShell } from '@/features/conversation/components/chat-shell';
import React from 'react'

const RootGrouplayout = async ({ children }: { children: React.ReactNode }) => {

    await auth.protect();
    await onboard();

    return (
        <div>
            <ChatShell>
            {children}
            </ChatShell>
        </div>
    )
}

export default RootGrouplayout