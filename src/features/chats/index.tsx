import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import http from '@/lib/http'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import DashboardHeader from '@/components/dashboard-header'
import { Main } from '@/components/layout/main'
import Markdown from '@/components/mark-down'

interface HistoryRow {
  id: string
  query: string
  answer: string
  created_at: number
}

export function Chats() {
  const [history, setHistory] = useState<HistoryRow[]>([])

  useEffect(() => {
    http.get<HistoryRow[]>('/dify/messages?limit=100').then(res => {
      setHistory(res.reverse())
    })

    // http.post('/dify/chat-messages', {
    //   inputs: {},
    //   query: 'What are the specs of the iPhone 13 Pro Max?',
    //   response_mode: 'streaming',
    //   conversation_id: '',
    //   user: 'Sufu.Wang',
    // })
  }, [])

  return (
    <>
      <DashboardHeader />
      <Main className='flex-1 p-0'>
        <section className='flex h-full gap-6'>
          <div
            className={cn(
              'bg-background inset-0 start-full z-50 w-full flex-1 flex-col sm:static sm:z-auto sm:flex sm:rounded-md'
            )}
          >
            <div className='flex h-full flex-1 flex-col gap-2 rounded-md px-2 pt-0 pb-2 lg:px-40'>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4'>
                    {history.length &&
                      history.map(row => <Fragment key={row.id}>
                        {/* answer */}
                        <div
                          className={cn(
                            'chat-box max-w-142 px-3 py-2 break-words shadow-lg dark:shadow-gray-600/60 bg-muted self-start rounded-[16px_16px_16px_0]',
                          )}
                        >
                          {/* {row.answer} */}
                          <Markdown>{row.answer}</Markdown>{' '}
                          <span
                            className={cn(
                              'text-foreground/75 mt-1 block text-xs font-light italic'
                            )}
                          >
                            {format(row.created_at*1000, 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                        </div>
                        {/* query */}
                        <div
                          className={cn(
                            'chat-box max-w-142 px-3 py-2 break-words bg-primary/90 text-primary-foreground/95 self-end rounded-[16px_16px_0_16px]',
                          )}
                        >
                          {row.query}{' '}
                          <span
                            className={cn(
                              'mt-1 block text-xs font-light italic text-primary-foreground/85 text-end',
                            )}
                          >
                            {format(row.created_at*1000, 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                        </div>
                      </Fragment>)
                      
                    }
                  </div>
                </div>
              </div>
              <div className='border-input bg-card focus-within:ring-ring flex flex-none items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4'>
                <label className='flex-1'>
                  <input
                    type='text'
                    placeholder='输入'
                    className='h-8 w-full bg-inherit focus-visible:outline-hidden'
                  />
                </label>
                <Button variant='ghost' size='icon'>
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
