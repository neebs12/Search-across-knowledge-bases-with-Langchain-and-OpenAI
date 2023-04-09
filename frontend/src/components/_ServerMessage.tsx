const ServerMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-start items-center">
      <div className="relative max-w-xl rounded-xl px-4 py-2 -my-2 text-gray-500 text-xs italic font-medium">
        <span className="block">{message}</span>
      </div>
      <hr className="my-2 border-t border-gray-200 w-1/2" />
    </li>

  );
}

export default ServerMessage;
