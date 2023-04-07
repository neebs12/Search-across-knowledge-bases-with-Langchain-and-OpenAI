const AIMessage = ({ message }: { message: string }) => {
  return (
    <li className="flex justify-start">
      <div className="relative max-w-xl rounded px-4 py-2 text-gray-700 shadow">
        <span className="block">{message}</span>
      </div>
    </li>
  );
}

export default AIMessage;
