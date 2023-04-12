import { useState } from 'react'

const SourcesMessage = ({ message }: { message: string }) => {
  const [visible, setvisible] = useState<boolean>(false)
  // debugger
  const messageArray = message.split(",")
  return (
    <>
      <li className="flex justify-start items-center">
        {/* <div className={visible ? "" : "hidden"}> */}
        <div className="relative max-w-xl rounded-xl px-4 py-2 -my-2 text-gray-400 text-xs italic font-medium ">
          {/* <span className="block">{message}</span> */}
          {messageArray.map(m => <span key={m} className=""><a href={m} className="font-medium underline no-underline hover:underline hover:text-gray-500" target="_blank">{m}</a>{" "}</span>)}
          {/* </div> */}
        </div>
        {/* <div className={visible ? "hidden" : ""}>
          <div className="relative max-w-xl rounded-xl px-4 py-2 -my-2 text-gray-400 text-xs italic font-medium ">
            <span className="block"><button className="rounded-full text-white py-1.5 px-2 rounded-xl" onClick={() => { setvisible(true) }}>see sources</button></span>
          </div>
        </div> */}
        <hr className="my-2 border-t border-gray-200 w-1/2" />
      </li>
    </>
  );
}

export default SourcesMessage;
