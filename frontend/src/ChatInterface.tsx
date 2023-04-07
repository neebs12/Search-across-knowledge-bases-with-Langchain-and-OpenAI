import { useState, useEffect } from 'react'
import Sidebar from './components/SideBar'
import Inputbar from './components/Inputbar'
import MessageBox from './components/MessageBox'
import Namebar from './components/NameBar'

import { URL, MODES, DEFAULT_MODE } from './constants'

import type { History, Modes, ModesTypes } from './types'

const ChatInterface: React.FC = () => {

  const [history, setHistory] = useState<History>([{
    sender: "system",
    message: `Ready to receve messages from: ${DEFAULT_MODE.name}`
  }])
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<ModesTypes>(DEFAULT_MODE.name)

  useEffect(() => {
    if (!question) {
      return () => { }
    }

    const extension = question.includes("health") ? "health-check-sse" : "question-sse"
    const source = new EventSource(`${URL}/${extension}?question=${question}&namespace=${(MODES.find(m => m.name === mode) ?? DEFAULT_MODE).namespace}`);

    source.addEventListener('message', (event) => {
      const eventData = event.data as string;
      if (eventData === "[END]") {
        console.log('End stream')
        setQuestion('')
        source.close();
      } else if (eventData.includes("[CONTEXT]")) {
        // TODO: placeholder for context streaming
      } else {
        setHistory(currentHistory => {
          const newHistory = JSON.parse(JSON.stringify(currentHistory)) as History;
          const latestHistory = newHistory[newHistory.length - 1]

          if (latestHistory.sender !== "ai") {
            newHistory.push({
              sender: "ai",
              message: eventData
            })
          } else {
            latestHistory.message = latestHistory.message + eventData
          }
          return newHistory;
        })
      }
    });

    // Listen for error events
    source.addEventListener('error', (event) => {
      console.log('Got error:', event);
      setHistory(currentHistory => {
        return [...currentHistory, {
          sender: "system",
          message: "Unfortunately, there has been an error."
        }]
      })
      source.close()
    });

    return () => {
      source.close();
      setQuestion('');
    }
  }, [question, URL])


  return (
    // <div className="container mx-auto">
    <div className="container mx-auto">
      <div className="min-w-full rounded border lg:grid lg:grid-cols-3">
        <Sidebar modes={MODES} currentMode={mode} handleSetMode={(mode: ModesTypes) => {
          setHistory(currentHistory => {
            if (currentHistory[currentHistory.length - 1].message.includes(mode)) {
              return currentHistory
            } else {
              return [...currentHistory, {
                sender: "system",
                message: `Changed systems to receive from: ${mode}`
              }]
            }
          })
          setMode(mode)
        }} />
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <Namebar currentMode={MODES.find(m => m.name === mode) ?? MODES[0]} />
            <MessageBox history={history} />
            <Inputbar handleSubmit={(question: string) => {
              setQuestion(question)
              setHistory([...history, {
                sender: "user",
                message: question
              }])
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
