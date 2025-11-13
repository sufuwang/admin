import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { type Convo } from './data/chat-types'
import { conversations } from './data/convo.json'
import DashboardHeader from '@/components/dashboard-header'


export function Chats() {
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(''.trim().toLowerCase())
  )
  const currentMessage = filteredChatList[0]?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)

      return acc
    },
    {}
  )

  return (
    <>
      <DashboardHeader />
      <Main className='p-0 flex-1'>
        <section className='flex h-full gap-6'>
          <div
            className={cn(
              'bg-background inset-0 start-full z-50 w-full flex-1 flex-col sm:static sm:z-auto sm:flex sm:rounded-md',
            )}
          >
            <div className='h-full flex flex-1 flex-col gap-2 rounded-md px-2 lg:px-40 pt-0 pb-2'>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4'>
                    {currentMessage &&
                      Object.keys(currentMessage).map((key) => (
                        <Fragment key={key}>
                          {currentMessage[key].map((msg, index) => (
                            <div
                              key={`${msg.sender}-${msg.timestamp}-${index}`}
                              className={cn(
                                'chat-box max-w-72 px-3 py-2 break-words shadow-lg',
                                msg.sender === 'You'
                                  ? 'bg-primary/90 text-primary-foreground/95 self-end rounded-[16px_16px_0_16px]'
                                  : 'bg-muted self-start rounded-[16px_16px_16px_0]'
                              )}
                            >
                              {msg.message}{' '}
                              <span
                                className={cn(
                                  'text-foreground/75 mt-1 block text-xs font-light italic',
                                  msg.sender === 'You' &&
                                    'text-primary-foreground/85 text-end'
                                )}
                              >
                                {format(msg.timestamp, 'h:mm a')}
                              </span>
                            </div>
                          ))}
                          <div className='text-center text-xs'>{key}</div>
                        </Fragment>
                      ))}
                  </div>
                </div>
              </div>
              <div className=' flex-none border-input bg-card focus-within:ring-ring flex items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4'>
                <label className='flex-1'>
                  <input
                    type='text'
                    placeholder='输入'
                    className='h-8 w-full bg-inherit focus-visible:outline-hidden'
                  />
                </label>
                <Button
                  variant='ghost'
                  size='icon'
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </>
  )
}
