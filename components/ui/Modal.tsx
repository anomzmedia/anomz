import { MouseEventHandler } from "react";
import Button from "./Button";

interface ModalProps{
    open:boolean,
    onClose:MouseEventHandler<HTMLButtonElement>,
    closable?: boolean;
    title?: string;
}

export default function Modal({children,open,onClose,title = "Modal",closable = true,...props}: ModalProps & React.HTMLAttributes<HTMLDivElement>){
    return(
        <div className={`overflow-hidden w-screen h-screen fixed top-0 left-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className={`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-900 border-2 border-gray-800 rounded-lg flex flex-col items-start duration-300 ${open ? 'scale-100' : 'scale-0'}`}>
                <div className="flex flex-row items-center justify-between w-full border-b-2 border-gray-800 py-2 px-4">
                    <span className="text-lg font-semibold">{title}</span>
                    {closable ? (<Button onClick={onClose} className="font-semibold" style="red">X</Button>) : (<></>)}
                </div>
                <div className="flex-1 min-h-0 overflow-auto w-full py-2 px-4 flex flex-col items-center gap-3" {...props}>
                    {children}
                </div>
            </div>
        </div>
    )
}
