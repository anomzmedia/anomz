import { FC } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    style?: "default" | "green" | "blue" | "red" | "transparent";
};

export default function Button({children, loading, style, ...props}: ButtonProps) {
    let classNames = props.className;
    style = style || "default";

    let colorSetting = "bg-gray-700 hover:bg-gray-600";

    if(style == "green"){
        colorSetting = "bg-green-600 hover:bg-green-800";
    };

    if(style == "blue"){
        colorSetting = "bg-blue-600 hover:bg-blue-800";
    };

    if(style == "red"){
        colorSetting = "bg-red-600 hover:bg-red-800";
    };

    return(
        <button {...props} className={`py-2 px-4 ${loading ? 'pl-10' : 'pl-4'} ${colorSetting} rounded duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex flex-row items-center relative ${classNames}`}>
            <span className={`${loading ? 'w-4 h-4 opacity-100 visible' : 'w-0 h-0 opacity-0 invisible'} duration-300 border-2 border-gray-600 border-t-gray-500 animate-spin block rounded-full absolute z-10 left-4 top-1/2 -translate-y-1/2`}></span>
            {children}
        </button>
    )
};
