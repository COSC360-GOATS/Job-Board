import { useState } from 'react'

const defaults = {
    name: "toggles-default",
    options: ["Option A", "Option B", "Option C"],
    selected: 1
};

function ToggleGroup({ toggle = defaults }) {
    const [selected, setSelected] = useState(toggle.selected ?? 0);

    return (
        <ul className="list-none rounded-3xl overflow-hidden border-2 divide-x-2 flex flex-wrap">
            {toggle.options.map((option, i) => {
                const id = `${toggle.name}-${option.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                    <li className="grow basis-0 min-w-fit" key={id}>
                        <input
                            id={id}
                            type="radio"
                            name={toggle.name}
                            value={option}
                            checked={i === selected}
                            onChange={() => setSelected(i)}
                            className="sr-only"
                        />
                        <label
                            className={`${i === selected ? "bg-white text-black" : ""}
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