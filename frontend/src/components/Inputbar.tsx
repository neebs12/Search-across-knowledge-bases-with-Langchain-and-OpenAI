import { useState, useEffect, FormEvent } from 'react'

type Props = {
  handleSubmit: (question: string) => void
}

const Inputbar: React.FC<Props> = ({ handleSubmit }) => {
  const [input, setInput] = useState('')

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.replace(/\s+/g, '').length !== 0) {
      handleSubmit(input)
      setInput('')
    }
  }

  return (
    <form className="flex w-full items-center justify-between border-t border-gray-300 p-3" onSubmit={handleFormSubmit}>
      <input type="text" placeholder="Message" className="mx-3 block w-full rounded-full bg-gray-100 py-2 pl-4 outline-none focus:text-gray-700" name="message" required value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit">
        <svg className="h-5 w-5 origin-center rotate-90 transform text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
}

export default Inputbar
