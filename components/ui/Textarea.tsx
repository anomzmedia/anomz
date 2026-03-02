import { FieldError } from "react-hook-form";

type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?:FieldError|undefined
};

export default function Textarea({error,children,...props}: InputProps) {
    return(
        <>
            <textarea {...props} className={`py-2 px-4 bg-gray-700 rounded duration-300 border-2 border-gray-600 ${error ? "border-2 border-red-400" : ''} ${props.className}`}>{children}</textarea>
            {error?.message ? <p className="text-red-400 text-xs">{error?.message}</p> : <></>}
        </>
        
    )
};
