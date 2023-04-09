const SystemMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-center">
      <div className="relative max-w-xl rounded-full px-4 py-2 my-2 bg-gray-800 text-zinc-200 text-xs italic">
        {/* <div className="relative max-w-xl rounded-full px-4 py-2 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-zinc-200 text-xs italic"> */}
        <span className="block">{message.toLowerCase()}</span>
      </div>
    </li>
  )
}

export default SystemMessage
