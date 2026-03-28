import { useState, useEffect } from 'react';

const defaults = [
    "React",
    "TypeScript",
    "MySQL",
    "NodeJS",
    "Express",
    "NextJS",
    "MongoDB",
    "Java",
    "C++",
    "Python",
    "Go",
    "Rust",
    "Docker",
    "AWS",
    "Azure"
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

export function Skill({ name, children, style, className = '' }) {
    return (
        <li
            className={`inline-block px-3 py-0.5 mx-0.75 my-0.5 rounded-full border cursor-default ${className}`}
            title={name}
            style={{ ...skillColor(name), ...style }}
        >
            {name}
            {children}
        </li>
    );
}

function RemoveSkillButton({ name, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={`Remove "${name}"`}
            className="ml-3 font-bold leading-none cursor-pointer bg-transparent border-0 p-0"
        >
            ×
        </button>
    );
}


function Skills({ skills = defaults, id, onChange }) {
    const [skillList, setSkillList] = useState(skills);

    const [isCreatingSkill, setIsCreatingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const addToSkillList = (skill) => { setSkillList([skill, ...skillList]); };

    const removeFromSkillList = (indexToRemove) => { setSkillList(skillList.filter((_, i) => i !== indexToRemove)); };

    const resetCreateSkill = () => {
        setNewSkill('');
        setIsCreatingSkill(false);
    };

    useEffect(() => {
        if (onChange) {
            onChange({ target: { value: skillList } });
        }
    }, [skillList, onChange]);

    const createNewSkillInput = () => {
        const example = defaults[Math.floor(Math.random() * defaults.length)];
        const placeholder = `e.g., ${example}`;

        return (
            <input
                type="text"
                value={newSkill}
                title="Type a skill and press Enter to add it or Escape to cancel"
                placeholder={placeholder}
                className="bg-transparent border-0 p-0 outline-none w-32"
                style={{ fieldSizing: 'content' }}
                onChange={(e) => { setNewSkill(e.target.value); }}
                onBlur={resetCreateSkill}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkill.trim() !== '') {
                        e.preventDefault();
                        const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');
                        const formattedSkill = newSkill.split(' ').map(capitalize).join(' ');
                        addToSkillList(formattedSkill);
                        resetCreateSkill();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        resetCreateSkill();
                    }
                }}
                autoFocus
            />
        )
    };

    const addSkillButton = () => {
        return (
            <button
                type="button"
                title="Add a New Skill"
                className="inline-flex rounded-full border bg-[#404040] cursor-pointer px-3 py-0.5 mx-0.75 my-0.5"
                onClick={() => setIsCreatingSkill(true)}
            >
                {isCreatingSkill ? createNewSkillInput() : 'Add Skill +'}
            </button>
        );
    };

    return (
        <fieldset id={id} className="border rounded-lg">
            <legend className="ml-4 px-1.5">Skills</legend>
            <ul className="mb-2 px-4 flex justify-start items-start flex-wrap">
                {addSkillButton()}
                {skillList.map((skill, i) => (
                    <Skill
                        key={i}
                        name={skill}
                    >
                        <RemoveSkillButton name={skill} onClick={() => removeFromSkillList(i)} />
                    </Skill>
                ))}
            </ul>
        </fieldset>
    );
}

export default Skills;