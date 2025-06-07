import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.ts';
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import BrandLogo from "../../components/BrandLogo";
import { FcGoogle } from "react-icons/fc";
import { BiLoaderAlt, BiErrorCircle } from "react-icons/bi";
import { FORGOT_PASSWORD, LOGIN } from "../../constants/routes.ts";
import { toast } from "react-toastify";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<"MALE" | "FEMALE" | ''>('');
  const [dob, setDob] = useState('');

  const [inputError, setInputError] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    dob: '',
  });

  const { onSubmitRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateGender = (gender: string): string => {
    if (!gender) return 'Please select your gender';
    return '';
  };

  const validateDob = (dob: string): string => {
    if (!dob) return 'Date of birth is required';
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) return 'You must be at least 13 years old';
    if (birthDate > today) return 'Please enter a valid date of birth';
    return '';
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
      name: validateName(name),
      gender: validateGender(gender),
      dob: validateDob(dob),
    };

    setInputError(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  // Handle individual field validation on blur
  const handleFieldBlur = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        // Also revalidate confirm password if it exists
        if (confirmPassword) {
          setInputError(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, password);
        break;
      case 'name':
        error = validateName(value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      case 'dob':
        error = validateDob(value);
        break;
    }

    setInputError(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare signup data
    const signupData = {
      "user": {
        "name": name.trim(),
        "email": email.trim(),
        "dob": dob,
        "gender": gender as "MALE" | "FEMALE",
        "password": password.trim()
      },
      "deviceId": "hihi"
    }

    onSubmitRegister(
      signupData,
      (error) => {
        setIsLoading(false);
        toast.error('Signup failed:', error);
        // Handle specific errors from the API
        if (error.message?.includes('email')) {
          setInputError(prev => ({ ...prev, email: 'This email is already registered' }));
        }
      }
    );
  };

  return (
    <BackgroundWrapper>
      <div className={`flex flex-col items-center`}>
        <BrandLogo/>

        {/* Image */}
        <div className={`relative w-full mb-5 select-none`}>
          <div className={``}>
            <img
              src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1748838573/uploads/TDCosmetic/vpbrcohil2otzqaeyoir.png`}
              alt="logo"
              className={`w-50 h-50 mx-auto`}
            />
          </div>
        </div>

        {/* Signup header */}
        <div className={`mb-3 flex flex-col items-center select-none`}>
          <h1 className={`font-butler font-bold text-2xl text-custom-red text-slate-700`}>
            Sign up!
          </h1>
          <p className={`text-slate-500 mb-3 select-none`}>
            Empower your experience
          </p>
        </div>

        {/* Signup Form */}
        <div className={`w-96 px-5`}>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className={`flex flex-col items-center justify-center`}
          >
            {/* Name */}
            <Input
              className={`w-full drop-shadow-md`}
              label={`Full Name`}
              name={`name`}
              type={`text`}
              placeholder={`Enter your full name`}
              required
              trim
              value={name}
              error={inputError.name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleFieldBlur('name', name)}
            />

            {/* Email */}
            <Input
              className={`w-full drop-shadow-md`}
              label={`Email`}
              name={`email`}
              type={`email`}
              placeholder={`Enter your email address`}
              required
              trim
              value={email}
              error={inputError.email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleFieldBlur('email', email)}
            />

            {/* Password */}
            <Input
              className={`w-full drop-shadow-md`}
              label={`Password`}
              name={`password`}
              type={`password`}
              placeholder={`Create a strong password`}
              required
              value={password}
              error={inputError.password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleFieldBlur('password', password)}
            />

            {/* Confirm Password */}
            <Input
              className={`w-full drop-shadow-md`}
              label={`Confirm Password`}
              name={`confirm-password`}
              type={`password`}
              placeholder={`Confirm your password`}
              required
              value={confirmPassword}
              error={inputError.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
            />

            {/* Date of Birth */}
            <div className={`w-full drop-shadow-md mb-3`}>
              <div className={`relative flex flex-col bg-white/50 backdrop-blur-sm px-3 py-3 rounded-2xl mt-1 
                ${inputError.dob ? 'outline outline-2 outline-red-400' : 'outline-orange-100 focus-within:outline-4'}
              `}>
                <label className={`text-xs text-orange-500 mb-2`}>
                  Date of Birth<sup className={`text-red-500`}>*</sup>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={dob}
                  required
                  onChange={(e) => setDob(e.target.value)}
                  onBlur={() => handleFieldBlur('dob', dob)}
                  className={`w-full py-2 bg-transparent focus:outline-none text-slate-700 
                    ${inputError.dob ? 'text-red-600' : 'text-slate-700'}
                  `}
                  max={new Date().toISOString().split('T')[0]} // Không cho chọn ngày tương lai
                />
              </div>
              {inputError.dob && (
                <div className="text-red-500 text-sm mb-2 px-2 flex items-center">
                  <BiErrorCircle className="mr-1 text-base" />
                  {inputError.dob}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className={`w-full drop-shadow-md mb-3`}>
              <div className={`relative flex flex-col bg-white/50 backdrop-blur-sm px-3 py-3 rounded-2xl mt-1 
                ${inputError.gender ? 'outline outline-2 outline-red-400' : 'outline-orange-100 focus-within:outline-4'}
              `}>
                <label className={`text-xs text-orange-500 mb-2`}>
                  Gender<sup className={`text-red-500`}>*</sup>
                </label>
                <div className={`flex gap-4`}>
                  <label className={`flex items-center cursor-pointer`}>
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={gender === 'MALE'}
                      onChange={(e) => setGender(e.target.value as 'MALE')}
                      onBlur={() => handleFieldBlur('gender', gender)}
                      className={`mr-2 text-orange-500`}
                    />
                    <span className={`text-slate-700`}>Male</span>
                  </label>
                  <label className={`flex items-center cursor-pointer`}>
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={gender === 'FEMALE'}
                      onChange={(e) => setGender(e.target.value as 'FEMALE')}
                      onBlur={() => handleFieldBlur('gender', gender)}
                      className={`mr-2 text-orange-500`}
                    />
                    <span className={`text-slate-700`}>Female</span>
                  </label>
                </div>
              </div>
              {inputError.gender && (
                <div className="text-red-500 text-sm mb-2 px-2 flex items-center">
                  <BiErrorCircle className="mr-1 text-base" />
                  {inputError.gender}
                </div>
              )}
            </div>

            {/* SUBMIT Form */}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center ${
                !isLoading
                  ? "cursor-pointer bg-[#F2907E]/95 hover:drop-shadow-md"
                  : "cursor-wait bg-[#F2907E]/60"
              } w-full font-bold text-white px-3 py-4 rounded-2xl mt-3 select-none`}
            >
              {!isLoading ? (
                "Create Account"
              ) : (
                <BiLoaderAlt className="text-2xl animate-spin text-white"/>
              )}
            </button>

            <div className={`my-3 select-none`}>
              <span className={`text-slate-500`}>Already have an account? </span>
              <Link to={LOGIN} className={`text-purple-900 hover:drop-shadow-md`}>
                Sign in
              </Link>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 select-none">
              <div className="border-t border-slate-400 h-0"></div>
              <span className="text-slate-500 whitespace-nowrap text-center">Or better yet...</span>
              <div className="border-t border-slate-400 h-0"></div>
            </div>

            <Link
              className={`cursor-pointer hover:drop-shadow-md bg-white w-full flex flex-row items-center justify-center px-3 py-4 rounded-2xl mt-3 select-none`}
              to="/"
            >
              <div className={`text-2xl`}><FcGoogle/></div>
              <p className={`mx-2 font-bold text-slate-600`}>Continue with Google</p>
            </Link>
          </form>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default SignUpPage;