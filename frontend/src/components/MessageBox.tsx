import { useState, useEffect } from 'react'
import AIMessage from './_AIMessage';
import UserMessage from './_UserMessage';
import SystemMessage from './_SystemMessage';
import type { History } from '../types';

type Props = {
  history: History
}

const MessageBox: React.FC<Props> = ({ history }) => {
  return (
    <div className="relative h-[40rem] w-full overflow-y-auto p-6">
      <ul className="space-y-2">
        {history.map((message, ind) => {
          const msg = message.message
          const keyVal = msg + ind.toString()
          if (message.sender === "system") {
            return <SystemMessage message={msg} key={keyVal} />
          } else if (message.sender === "ai") {
            return <AIMessage message={msg} key={keyVal} />
          } else if (message.sender === "user") {
            return <UserMessage message={msg} key={keyVal} />
          }
        })}
      </ul>
    </div>
  );
}

export default MessageBox
