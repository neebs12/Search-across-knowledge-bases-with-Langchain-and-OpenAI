import { useState, useEffect } from 'react'
import Sidebar from './components/SideBar'
import Inputbar from './components/Inputbar'
import MessageBox from './components/MessageBox'
import Namebar from './components/NameBar'

type History = {
  sender: "system" | "ai" | "user",
  message: string
}[]

type ModesTypes = "Tax Resources" | "Freelancer Resources" | "Multi Resources"

// CONSTANTS
const URL = import.meta.env.VITE_BASE_URL as string
// debugger
const MODES = [{
  name: "Tax Resources",
  namespace: "hnry-co-nz-tax-resources",
  image: "https://cdn.pixabay.com/photo/2023/03/21/09/53/willow-catkin-7866866_960_720.jpg"
}, {
  name: "Freelancer Resources",
  namespace: "hnry-co-nz-freelancer-resources",
  image: "https://cdn.pixabay.com/photo/2016/11/18/12/14/owl-1834152_960_720.jpg"
}, {
  name: "Multi Resources",
  namespace: "hnry-co-nz-multi-resources",
  image: "https://cdn.pixabay.com/photo/2014/05/20/21/20/bird-349026_960_720.jpg"
}] as { name: ModesTypes, namespace: string, image: string }[]

const ChatInterface: React.FC = () => {
  // Use state to store the question, the submitted question, and the answer
  const [history, setHistory] = useState<History>([{
    sender: "system",
    message: "Ready to receve messages..."
  }])
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<ModesTypes>(MODES[0].name)

  useEffect(() => {
    if (!question) {
      return () => { }
    }

    const extension = question.includes("health") ? "health-check-sse" : "question-sse"
    const source = new EventSource(`${URL}/${extension}?question=${question}&namespace=${"hnry-co-nz-tax-resources"}`);

    source.addEventListener('message', (event) => {
      const eventData = event.data as string;
      if (eventData === "[END]") {
        console.log('End stream')
        setQuestion('')
        source.close();
      } else if (eventData.includes("[CONTEXT]")) {
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
