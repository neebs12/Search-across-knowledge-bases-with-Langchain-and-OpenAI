const SourcesMessage = ({ message }: { message: string }) => {
  // debugger
  const messageArray = message.split(",")
  return (
    <li className="flex justify-start items-center">
      <div className="relative max-w-xl rounded-xl px-4 py-2 -my-2 text-gray-500 text-xs font-medium">
        {/* <span className="block">{message}</span> */}
        {messageArray.map(m => <span key={m} className="block"><a href={m} className="font-medium underline dark:text-gray-500 hover:no-underline" target="_blank">{m}</a></span>)}
      </div>
      <hr className="my-2 border-t border-gray-200 w-1/2" />
    </li>

  );
}

export default SourcesMessage;
