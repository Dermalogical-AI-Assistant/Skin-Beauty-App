// src/components/Input.tsx
import React, { useState } from 'react';
import isEmpty from "lodash/isEmpty";
import { PiEyeClosedDuotone } from "react-icons/pi";
import { LiaEye } from "react-icons/lia";
import { BiErrorCircle } from "react-icons/bi";

interface InputProps {
  id?: string,
  name?: string,
  type?: string,
  label?: string,
  placeholder?: string,
  required?: boolean,
  className?: string,
  trim?: boolean,
  error?: string, // Thêm prop error
  value?: string, // Thêm prop value để control từ bên ngoài
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,

}

/**
 * Input component with error handling and validation
 */
const Input: React.FC<InputProps> = (props) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Sử dụng value từ props nếu có, không thì dùng internal state
  const currentValue = props.value !== undefined ? props.value : internalValue;
  const hasError = !isEmpty(props.error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = props.trim ? e.target.value.trim() : e.target.value;

    // Chỉ update internal state nếu không có controlled value
    if (props.value === undefined) {
      setInternalValue(newValue);
    }

    if (props.onChange) {
      props.onChange(e);
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  }

  return (
    <div className={`${props.className}`}>
      <div className={`relative flex flex-col mb-1 bg-white/50 backdrop-blur-sm px-3 py-3 rounded-2xl mt-1 
                ${hasError ? 'outline outline-2 outline-red-400' : 'outline-orange-100 focus-within:outline-4'}
            `}>
        <label
          htmlFor={inputId}
          className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none
                        ${isFocused || !isEmpty(currentValue)
            ? `top-1 text-xs ${hasError ? 'text-red-500' : 'text-orange-500'}`
            : "top-1/2 cursor-text transform -translate-y-1/2 text-slate-500 text-sm"
          }
                    `}
        >
          {props.label}{props.required ? <sup className={`text-red-500`}>*</sup> : ""}
        </label>

        <div className={`flex items-center`}>
          <input
            className={`w-full pl-3 py-2 placeholder-slate-600 text-slate-700 bg-transparent focus:outline-none
                            ${hasError ? 'text-red-600' : 'text-slate-700'}
                        `}
            id={inputId}
            name={props.name}
            placeholder={isFocused && props.type !== 'date' ? props.placeholder : ''}
            value={currentValue}
            autoComplete="off"
            type={props.type === "password" ? (showPassword ? "text" : "password") : props.type}
            required={props.required || false}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />

          {/* Error icon */}
          {hasError && (
            <div className="text-red-500 text-xl mr-2">
              <BiErrorCircle />
            </div>
          )}

          {/* Password toggle */}
          {props.type === "password" && (
            <div className={`pl-2 pr-2 text-2xl text-slate-500 cursor-pointer`}>
              {showPassword
                ? <LiaEye onClick={() => setShowPassword(false)}/>
                : <PiEyeClosedDuotone onClick={() => setShowPassword(true)}/>
              }
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {hasError && (
        <div className="text-red-500 text-sm mb-2 px-2 flex items-center">
          <BiErrorCircle className="mr-1 text-base" />
          {props.error}
        </div>
      )}
    </div>
  );
};

export default Input;