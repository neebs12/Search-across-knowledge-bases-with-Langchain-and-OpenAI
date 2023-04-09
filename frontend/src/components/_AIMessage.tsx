const AIMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-start">
      <div className="relative max-w-xl rounded-xl px-4 py-2 bg-gray-50 text-gray-700 shadow-md">
        <span className="block">{message}</span>
      </div>
    </li>
  );
}

export default AIMessage;
