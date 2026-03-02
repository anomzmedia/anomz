import { FC } from "react";
import Button from "../Button";
import { useTooltip } from "./Tooltip";

type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;

export default function TooltipContent({children, ...props}: FormFieldProps) {
    const { handleClick } = useTooltip();

    return(
        <div onClick={handleClick} {...props}>
            {children}
        </div>
    )
};
