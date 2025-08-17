import "./Checkbox.css"
const Checkbox = ({children, handle, checked}) =>{
    const handleClick = () =>{

    }
    return (
        <label>
            <input type="checkbox" onChange={handle} checked={checked}></input>
            {children}
        </label>
        

    )
}
export default Checkbox
