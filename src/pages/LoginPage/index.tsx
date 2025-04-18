import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.ts';
import { Link } from "react-router-dom";
import avatar from "../../assets/—Pngtree—world beauty day face skincare_4041122.png";
import Input from "../../components/Input";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import BrandLogo from "../../components/BrandLogo";
import { FcGoogle } from "react-icons/fc";
import {BiLoaderAlt} from "react-icons/bi";
import {FORGOT_PASSWORD, REGISTER} from "../../constants/routes.ts";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onSubmitAccountForm, handleLoginPassword} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    // const  historyLocation = location.state?.historyLocation || "/";
    // Get the redirect path from location state or default to home

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmitAccountForm(
            { email, password, deviceId: 'hihi' },
            (error) => {
                setIsLoading(false);
                console.error('Login failed:', error);
            }
        );
    };

    return (
            <BackgroundWrapper>
                <div className={`flex flex-col items-center`}>

                    <BrandLogo/>

                    {/* image */}
                    <div className={`relative w-full mb-5 select-none`}>
                        <div className={``}>
                                <img
                                    src={avatar}
                                    alt="logo"
                                    className={`w-50 h-50 mx-auto`}
                                />
                            </div>
                        </div>


                        {/*Login header*/}
                        <div className={`mb-3 flex flex-col items-center select-none`}>
                            <h1 className={`font-butler font-bold text-2xl text-custom-red text-slate-700`}>
                            {/*<h1 className={`font-bold text-2xl`}>*/}
                            Welcome back!
                        </h1>
                        <p className={`text-slate-500 mb-3 select-none`}>
                            Enter your credentials to continue
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className={`w-96 px-5`}>
                        <form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                            className={`flex flex-col items-center justify-center`}
                        >
                            <Input
                                className={`w-full  drop-shadow-md`}
                                label={`Email`}
                                name={`email`}
                                type={`text`}
                                placeholder={`Your email`}
                                required
                                trim
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {/* Password */}
                            <Input
                                className={`w-full drop-shadow-md`}
                                label={`Password`}
                                name={`password`}
                                type={`password`}
                                placeholder={`Your password`}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Forgot password */}
                            <div className={`flex w-full justify-end text-slate-500 px-3 mb-2 hover:drop-shadow-md select-none`}>
                                <Link to={FORGOT_PASSWORD}>
                                    Forgot password?
                                </Link>
                            </div>

                            {/* SUBMIT Form*/}
                            <button
                                type="submit"
                                disabled={isLoading}
                                // className={`bg-red-200 w-full px-3 py-4 rounded-2xl mt-3`}
                                className={`flex items-center justify-center ${!isLoading?"cursor-pointer bg-[#F2907E]/95 hover:drop-shadow-md":"cursor-wait bg-[#F2907E]/60"}    b w-full font-bold text-white px-3 py-4 rounded-2xl mt-3 select-none`}
                                // loading={handleLoginPassword.isLoading}
                            >
                                {/*Sign in*/}
                                {!isLoading ?
                                    "Sign in" :
                                    <BiLoaderAlt className="text-2xl animate-spin text-white"/>
                                }
                            </button>

                            <div className={`my-3 select-none`}>
                                <span className={`text-slate-500`}>Don't have an account? </span><Link to={REGISTER}  className={`text-purple-900 hover:drop-shadow-md`}>Sign up</Link>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4 select-none">
                                <div className="border-t border-slate-400 h-0"></div>
                                <span className="text-slate-500 whitespace-nowrap text-center">Or better yet...</span>
                                <div className="border-t border-slate-400 h-0"></div>
                            </div>

                            <Link
                                className={`cursor-pointer hover:drop-shadow-md bg-white w-full flex flex-row items-center justify-center px-3 py-4 rounded-2xl mt-3 select-none`}
                                // className={`bg-slate-100 w-full px-3 py-4 rounded-2xl mt-3`}
                                // loading={handleLoginPassword.isLoading}
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

export default LoginPage;