import { createContext, FC, ReactNode, useContext, useState } from "react";
import Button from "../Button";

type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;

type TooltipContextType = {
    isClicked: boolean;
    clickText?: ReactNode;
    handleClick: () => void;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("useTooltip must be used within Tooltip");
  return context;
};

type TooltipProviderProps = {
  children: ReactNode;
  clickText?: ReactNode;
};

export default function Tooltip({children, clickText, ...props}: TooltipProviderProps & React.HTMLAttributes<HTMLDivElement>) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 2000);
    };

    return(
        <TooltipContext.Provider value={{ clickText, handleClick, isClicked }}>
            <div className={`group relative`}>
                {children}
            </div>
        </TooltipContext.Provider>
    )
};
