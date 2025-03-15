// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import isEmpty from "lodash/isEmpty";
import { PiEyeClosedDuotone } from "react-icons/pi";
import { LiaEye } from "react-icons/lia";
interface InputProps {
    id?: string,
    name?: string,
    type?: string,
    label?: string,
    placeholder?: string,
    required?: boolean,
    className?: string,
    trim?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Login page component that handles user authentication
 */
const Input: React.FC<InputProps> = (props) => {
    const [value, setValue] = useState('');

    const [isFocused, setIsFocused] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(props.trim ? e.target.value.trim() : e.target.value);
        if (props.onChange) {
            props.onChange(e);
        }

    }
    return (
        <div className={`${props.className}`}>
            <div className={`relative flex flex-col mb-3 bg-white/50  backdrop-blur-sm px-3 py-3 rounded-2xl mt-1 outline-orange-100 focus:outline-4`}>
                    <label
                        htmlFor={inputId}
                        className={`absolute left-4 transition-all duration-300 ease-in-out text-slate-500 
                            ${isFocused || !isEmpty(value) ? "top-1 text-xs text-orange-500" : "top-1/2 cursor-text  transform -translate-y-1/2 text-slate-500  text-sm text-slate-600"}
                        `}
                    >
                        {props.label}{props.required ? <sup className={`text-red-500`}>*</sup> : ""}
                    </label>
                <div className={`flex items-center`}>
                    <input
                        className={`w-full pl-3 py-2 placeholder-slate-600 text-slate-500 focus:outline-hidden`}
                        id={inputId}
                        name={props.name}
                        // placeholder={props.placeholder}
                        value={value}
                        autoComplete="none"
                        type={props.type==="password"? showPassword ? "text" : "password" : props.type}
                        required={props.required || false}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <div className={`pl-4 pr-2 ${props.type === "password" ? "text-2xl text-slate-500" : "hidden"}`}>
                        {
                            showPassword ? <LiaEye onClick={() => setShowPassword(false)}/> : <PiEyeClosedDuotone onClick={() => setShowPassword(true)}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Input;