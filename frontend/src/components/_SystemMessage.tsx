const SystemMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-center">
      <div className="relative max-w-xl rounded-full px-4 py-2 bg-slate-800 text-zinc-200 italic">
        <span className="block">{message}</span>
      </div>
    </li>
  )
}

export default SystemMessage
