import { useState, useEffect } from "react"

export const useDebounce = (value, millis) =>{
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(()=>{
        const debTime = setTimeout(()=>{
            setDebounceValue(value)
        },millis)
        return ()=> clearTimeout(debTime) 
    },[value, millis]);

    return debounceValue;
}
