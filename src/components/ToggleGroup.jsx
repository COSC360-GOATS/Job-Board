import { useState } from 'react'

const defaults = {
    name: "toggles-default",
    options: ["Option A", "Option B", "Option C"],
};

function ToggleGroup({ name = defaults.name, options = defaults.options, selected }) {
    const [selectedIndex, setSelectedIndex] = useState(selected ?? 0);

    return (
        <ul className="list-none rounded-3xl overflow-hidden border-2 divide-x-2 flex flex-wrap">
            {options.map((option, i) => {
                const id = `${name}-${option.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                    <li className="grow basis-0 min-w-fit" key={id}>
                        <input
                            id={id}
                            type="radio"
                            name={name}
                            value={option}
                            checked={i === selectedIndex}
                            onChange={() => setSelectedIndex(i)}
                            className="sr-only"
                        />
                        <label
                            className={`${i === selectedIndex ? "bg-white text-black" : ""}
                                block cursor-pointer px-6 py-2 text-center`}
                            htmlFor={id}>
                            {option}
                        </label>
                    </li>
                )
            })}
        </ul>
    )
}

export default ToggleGroup;