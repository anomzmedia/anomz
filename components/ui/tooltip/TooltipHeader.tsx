import { FC } from "react";
import Button from "../Button";
import { useTooltip } from "./Tooltip";

type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;

export default function TooltipHeader({children, ...props}: FormFieldProps) {
      const { isClicked, clickText } = useTooltip();

        return(
            <>
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black/70 z-10 py-1 px-2 rounded text-xs duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible select-none w-auto text-nowrap">
                    {isClicked && clickText ? clickText : children}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 block z-10 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-black/70 duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible select-none"></div>
            </>
        )
};
