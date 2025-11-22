import { useEffect, useRef, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { Send, Pause, LoaderCircle } from 'lucide-react'
import http from '@/lib/http'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import DashboardHeader from '@/components/dashboard-header'
import { Main } from '@/components/layout/main'
import Markdown from '@/components/mark-down'
import { toast } from 'sonner'

interface HistoryRow {
  id: string
  query: string
  answer: string
  created_at: number
}

export function Chats() {
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HistoryRow[]>([])
  const loadingRef = useRef<boolean>(false)
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [question, setQuestion] = useState('')
  const [curTaskId, setCurTaskId] = useState('')
  const [loading, setLoading] = useState(false)

  const onQuestionChange = ({ target }: { target: HTMLInputElement }) => {
    setQuestion(target.value)
  }
  const stopStream = async () => {
    await http.post(`/dify/chat-messages/${curTaskId}/stop`, {
      user: import.meta.env.VITE_DIFY_USER,
    })
    setLoading(false)
    setCurTaskId('')
  }
  const onConfirm = async (query = question) => {
    if (loadingRef.current) {
      if (curTaskId.length) {
        stopStream()
      } else {
        toast.warning('正在处理，请稍等')
      }
      return
    }
    if (query.length === 0) {
      toast.warning('请输入问题')
      return
    }
    setLoading(true)
    setQuestion('')
    const response = await fetch(`${import.meta.env.VITE_DIFY_DOMAIN}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_DIFY_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: 'streaming',
        user: import.meta.env.VITE_DIFY_USER,
        conversation_id: import.meta.env.VITE_DIFY_CONSERVATION_ID
      })
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const row = {
      id: `uuid-${Date.now()}`,
      query,
      answer: '',
      created_at: Date.now() / 1000
    }
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setLoading(false)
        break
      };
      const rows = decoder.decode(value)
        .split('\n')
        .filter(r => r && r.startsWith('data: ') && r.includes(`"event":"message"`))
        .map(r => JSON.parse(r.replace('data: ', '')))
      row.answer += rows.map(row => row.answer).join('')
      row.created_at = rows[0]?.created_at ?? row.created_at

      if (rows[0]?.task_id) {
        setCurTaskId(rows[0].task_id)
      }
      if (historyRef.current.at(0)?.id === row.id) {
        setHistory([row, ...historyRef.current.slice(1)])
      } else {
        setHistory([row, ...historyRef.current])
        setTimeout(() => {
          chatRef.current!.scroll({
            top: chatRef.current!.clientHeight + 500,
            behavior: 'smooth'
          })
        }, 500)
      }
    }
  }
  const onListener = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onConfirm((event.target as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    inputRef.current!.addEventListener('keydown', onListener);
    http.get<HistoryRow[]>('/dify/messages?limit=100').then(res => {
      setHistory(res.filter(row => row.answer).reverse())
    })
  }, [])

  useEffect(() => {
    historyRef.current = [...history]
  }, [history])
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

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
                <div className='chat-text-container relative flex flex-1 flex-col overflow-y-hidden m-0'>
                  <div ref={chatRef} className='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto p-0'>
                    {history.length ?
                      history.map(row => <Fragment key={row.id}>
                        {/* answer */}
                        {
                          row.answer && <div
                            className={cn(
                              'chat-box max-w-142 px-3 py-2 break-words shadow-lg dark:shadow-gray-600/60 bg-muted self-start rounded-[16px_16px_16px_0]',
                            )}
                          >
                            <Markdown>{row.answer}</Markdown>
                            <span
                              className={cn(
                                'text-foreground/75 mt-1 block text-xs font-light italic'
                              )}
                            >
                              {format(row.created_at*1000, 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                          </div>
                        }
                        {/* query */}
                        <div
                          className={cn(
                            'chat-box max-w-142 px-3 py-2 break-words bg-primary/90 text-primary-foreground/95 self-end rounded-[16px_16px_0_16px]',
                          )}
                        >
                          {row.query}
                          <span
                            className={cn(
                              'mt-1 block text-xs font-light italic text-primary-foreground/85 text-end',
                            )}
                          >
                            {format(row.created_at*1000, 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                        </div>
                      </Fragment>)
                      : null
                    }
                  </div>
                </div>
              </div>
              <div className='border-input bg-card focus-within:ring-ring flex flex-none items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4'>
                <label className='flex-1'>
                  <input
                    ref={inputRef}
                    type='text'
                    placeholder='请输入您的问题'
                    className='h-8 w-full bg-inherit focus-visible:outline-hidden'
                    value={question}
                    onChange={onQuestionChange}
                  />
                </label>
                <Button variant='ghost' size='icon' onClick={() => onConfirm()}>
                  {loading
                    ? curTaskId
                      ? <Pause size={20} />
                      : <LoaderCircle className='animate-spin' size={20} />
                    : <Send size={20} />}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </>
  )
}
