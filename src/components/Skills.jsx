import { useState } from 'react';

const defaults = [
    "React",
    "TypeScript",
    "MySQL",
    "NodeJS",
    "Express",
    "NextJS",
    "MongoDB"
];

function skillColor(name) {
    const hue = hash(name) % 360;

    const color = `hsl(${hue}, 90%, 65%)`;
    const bg = `hsl(${hue}, 25%, 15%)`;

    return {
        backgroundColor: bg,
        borderColor: color,
        color: color

    };

    function hash(value) {
        let hash = 0;

        for (let i = 0; i < value.length; i += 1) {
            hash = (hash << 5) - hash + value.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash);
    }
}

function Skill(props) {
    return (
        <li
            className={`inline-block px-3 py-0.5 mx-0.75 my-0.5 rounded-full border cursor-default ${props.className}`}
            style={props.style}
        >
            {props.children}
            <button
                type="button"
                onClick={props.onClick}
                title={`Remove ${props.children}`}
                className="ml-3 font-bold leading-none cursor-pointer bg-transparent border-0 p-0"
            >
                ×
            </button>
        </li>
    );
}


function Skills({ skills = defaults }) {
    const [skillList, setSkillList] = useState(skills);

    const [isCreatingSkill, setIsCreatingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const addSkill = (skill) => {
        setSkillList([skill, ...skillList]);
    };

    const removeSkill = (indexToRemove) => {
        setSkillList(skillList.filter((_, i) => i !== indexToRemove));
    };

    return (
        <fieldset className="border rounded-lg">
            <legend className="ml-4 px-1.5">Skills</legend>
            <ul className="mb-2 px-4 flex justify-start items-start flex-wrap">
                <button
                    title="Add a New Skill"
                    className="inline-flex rounded-full border bg-[#404040] cursor-pointer px-3 py-0.5 mx-0.75 my-0.5"
                    onClick={() => setIsCreatingSkill(true)}>
                    {isCreatingSkill ? <input
                        type="text"
                        value={newSkill}
                        className="bg-transparent border-0 p-0 outline-none w-20.5"
                        onChange={(e) => {
                            setNewSkill(e.target.value);

                            // Reset the width to 1px every time to allow for shrinking
                            // (If the input is already wide, the value of scrollWidth won't reduce so the width must collapse first)
                            e.target.style.width = '1px';
                            e.target.style.width = `${Math.max(82, e.target.scrollWidth + 2)}px`;
                        }}
                        onBlur={() => {
                            if (newSkill.trim() !== '') {
                                addSkill(newSkill.trim());
                            }
                            setNewSkill('');
                            setIsCreatingSkill(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSkill.trim() !== '') {
                                addSkill(newSkill.trim());
                                setNewSkill('');
                                setIsCreatingSkill(false);
                            } else if (e.key === 'Escape') {
                                setNewSkill('');
                                setIsCreatingSkill(false);
                            }
                        }}
                        autoFocus
                    /> : 'Add Skill +'}
                </button>
                {skillList.map((skill, i) => (
                    <Skill
                        key={i}
                        style={skillColor(skill)}
                        onClick={() => removeSkill(i)}
                    >
                        {skill}
                    </Skill>
                ))}
            </ul>
        </fieldset>
    );
}

export default Skills;