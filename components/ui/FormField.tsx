import { FC } from "react";

type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;

export default function FormField({children,...props}: FormFieldProps) {
    return(
        <div {...props} className={`flex flex-col items-start ${props.className}`}>
            {children}
        </div>
    )
};
