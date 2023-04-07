import type { Mode } from "../types"

type Props = {
  currentMode: Mode
}

const Namebar: React.FC<Props> = ({ currentMode }) => {
  return (
    <div className="relative flex items-center border-b border-gray-300 p-3">
      <img className="h-10 w-10 rounded-full object-cover" src={currentMode.image} alt="username" />
      <span className="ml-2 block font-bold text-gray-600">{currentMode.name}</span>
    </div>
  )
}

export default Namebar
