const UserMessage = ({ message }: { message: string }) => {
  const start = "[#2870ea]"
  const end = "[#1b4aef]"
  return (
    <li className="flex justify-end">
      <div className={`relative max-w-xl rounded-xl bg-gray-500 px-4 py-2 text-gray-50 shadow-lg`}>
        {/* <div className={`relative max-w-xl rounded-lg bg-gradient-to-tr from-[#2870ea] to-[#1b4aef] px-4 py-2 text-blue-50 shadow`}> */}
        <span className="block">{message}</span>
      </div>
    </li>
  )
}

export default UserMessage
