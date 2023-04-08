import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/SideBar'
import Inputbar from './components/Inputbar'
import MessageBox from './components/MessageBox'
import Namebar from './components/NameBar'

import { URL, MODES, DEFAULT_MODE } from './constants'

import type { History } from './types'

const ChatInterface: React.FC = () => {

  const [history, setHistory] = useState<History>([{
    sender: "system",
    message: "Loading..."
  }])
  const [question, setQuestion] = useState("");
  const [modeName, setModeName] = useState<string>(DEFAULT_MODE.name)

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const reponse = await axios.get(`${URL}/health`)
        setHistory(_ => [{
          sender: "system",
          message: `Ready to receve messages from: ${DEFAULT_MODE.name}`
        }])

      } catch (e) {
        console.log({ e })
        setHistory(_ => [{
          sender: "system",
          message: "Unfortunately, the server doesnt seem to be responding 😔... refresh?"
        }]
        )
      }
    }
    healthCheck();
  }, [])

  useEffect(() => {
    if (!question) {
      return () => { }
    }

    const extension = question.includes("health") ? "health/sse" : "question/sse"
    const source = new EventSource(`${URL}/${extension}?question=${question}&namespace=${(MODES.find(m => m.name === modeName) ?? DEFAULT_MODE).namespace}`);

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
          message: "Unfortunately, there has been an error... \n Refresh the page to try again"
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
    <div className="container mx-auto">
      <div className="min-w-full rounded border lg:grid lg:grid-cols-3">
        <Sidebar modes={MODES} currentModeName={modeName} handleSetMode={(newModeName: string) => {
          setHistory(currentHistory => {
            const mostRecentMessage = currentHistory[currentHistory.length - 1]
            if (mostRecentMessage.message.includes(newModeName)) {
              return currentHistory
            } else {
              const newMessage = {
                sender: "system",
                message: `Changed systems to receive from: ${newModeName}`
              }
              return (mostRecentMessage.sender === "system"
                ? [...currentHistory.slice(0, currentHistory.length - 1), newMessage]
                : [...currentHistory, newMessage]) as History
            }
          })
          setModeName(newModeName)
        }} />
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <Namebar currentMode={MODES.find(m => m.name === modeName) ?? DEFAULT_MODE} />
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
