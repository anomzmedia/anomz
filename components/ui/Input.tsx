import { FC } from "react";
import { FieldError } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?:FieldError|undefined
};

export default function Input({error,...props}: InputProps) {
    return(
        <>
            <input {...props} className={`py-2 px-4 bg-gray-700 rounded duration-300 border-2 border-gray-600 ${error ? "border-2 border-red-400" : ''} ${props.className}`} />
            {error?.message ? <p className="text-red-400 text-xs">{error?.message}</p> : <></>}
        </>
        
    )
};
