import { ReactNode, useState, useEffect } from "react";
import "./Select.css"
const tuple = <T extends string[]>(...args: T) => args;
function Select<T extends string>({options, placeholder, onSelect, selected} : {options: (T | "")[], placeholder: string, onSelect: (selectedOption: T|"")=> void, selected?: T}) {
    const [isActive, setIsActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState<T | "">(selected || "");
    useEffect(()=>{
        onSelect(selectedOption);
    },[selectedOption])
    return (
        <div className="custom-select" style={{borderRadius: !isActive? 5 : undefined}}>
            {selectedOption? <p onClick={()=> setIsActive(prev => !prev)}>{selectedOption}</p> : <p className="placeholder" onClick={()=> setIsActive(true)}>{placeholder}</p>}
            <div className="options-wrapper">

           
            <div className={["options", isActive? "active" : null].join(" ")}>
            {
                options.map(option=>{
                    return (
                    <div className="option" key={option} onClick={()=>{
                        setIsActive(false)
                        setSelectedOption(option)
                    }}>
                        <p className="">{option}</p>
                    </div>)
                })
            }
            </div>
            </div>
        </div>)
}
export default Select

