import type { Mode, ModesTypes } from "../types"

type Props = {
  modes: Mode[],
  currentModeName: Mode["name"],
  handleSetMode: (mode: ModesTypes) => void
}

const Sidebar: React.FC<Props> = ({ modes, currentModeName, handleSetMode }) => {
  return (
    <div className="border-r border-gray-300 lg:col-span-1">
      <div className="mx-3 my-3">
        <div className="relative text-gray-600">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            {/* <!-- leave this here or css breaks --> */}
          </span>
        </div>
      </div>

      <ul className="h-[32rem] overflow-auto">
        <h2 className="my-2 mb-4 ml-2 text-lg text-gray-600">🤖 Skynet Fellas 🤖</h2>
        {modes.map((mode, ind) => {
          let anchorClassName = `flex cursor-pointer items-center border-b border-gray-300 px-3 py-2 text-sm transition duration-150 ease-in-out focus:outline-none`

          // border at top
          anchorClassName = anchorClassName + " " + (ind === 0 ? "border-t" : "")

          // hover or not based on if it is the "current" mode
          anchorClassName = anchorClassName + " " + (currentModeName === mode.name ? "" : "hover:") + "bg-gray-100"

          return (
            // hover:bg-gray-100
            <li key={mode.name}>
              <a className={anchorClassName} onClick={() => {
                handleSetMode(mode.name)
              }}>
                <img className="h-10 w-10 rounded-full object-cover" src={mode.image} alt="username" />
                <div className="w-full pb-2">
                  <div className="flex justify-between">
                    <span className="ml-2 block font-semibold text-gray-600">{mode.name}</span>
                  </div>
                  {/* <!-- <span className="block ml-2 text-sm text-gray-600">minor text</span> --> */}
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default Sidebar
