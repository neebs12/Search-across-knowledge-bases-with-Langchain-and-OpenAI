const UserMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-end">
      <div className="relative max-w-xl rounded bg-gray-100 px-4 py-2 text-gray-700 shadow">
        <span className="block">{message}</span>
      </div>
    </li>
  )
}

export default UserMessage
