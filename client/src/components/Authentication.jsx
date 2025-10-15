import {Mail, Key, X, ShieldUser, UserRoundCheck} from "lucide-react";
import {Button} from "./ui/Button.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useLogin, useRegister} from "../utils/hook.js";
import toast, {Toaster} from 'react-hot-toast';
import Input from "./ui/Input.jsx";


function Authentication({isOpen, onClose, authVar}) {
    const [authVariant, setAuthVariant] = useState('register');
    const AuthenticationSectionRef = useRef(null)
    const failedToast = (errorReason) => toast.error(`${errorReason}`);

    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [password2Input, setPassword2Input] = useState('')
    const [nicknameInput, setNicknameInput] = useState('')
    const [accountCreated, setAccountCreated] = useState(false)


    const {mutate: login, isLoading: isLoginLoading} = useLogin({
        onSuccess: () => {

        },
        onError: (error) => {
            if (error.status === 401) {
                failedToast('Passwords do not match. Try again or reset your password');
            }

            if (error.status === 422) {
                failedToast('fields do not match the expected format.');
            }

            if (error.status === 500) {
                failedToast('Something went wrong. Please try again later.');
            }


        }
    });

    const {mutate: register, isLoading: isRegisterLoading} = useRegister({
        onSuccess: () => {
            setAccountCreated(true)
            setAuthVariant('login');
        },

        onError: (error) => {
            if (error) {
                if (error.status === 500) {
                    failedToast('Something went wrong. Please try again later.');
                } else {
                    failedToast(error.message);
                }

            }
        }
    })


    useEffect(() => {
        if (authVar) {
            setAuthVariant(authVar)
        }

        function handleClickOutside(event) {
            if (AuthenticationSectionRef.current && !AuthenticationSectionRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }


    }, [isOpen, onClose, authVar])

    if (!isOpen) return null

    const isRegisterDisabled =
        !emailInput ||
        !passwordInput ||
        !password2Input ||
        !nicknameInput ||
        passwordInput !== password2Input;


    const isLoginDisabled = !emailInput || !passwordInput;

    return (
        <section ref={AuthenticationSectionRef}
                 className="fixed top-0 left-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50">
            <Toaster/>
            <div
                className="flex flex-col justify-center w-screen h-screen md:max-w-[500px] md:h-fit bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6">

                {authVariant === 'register' && (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="font-bold text-2xl">
                                Register
                            </h1>

                            <Button className="group" variant='ghost' size='icon' onClick={onClose}>
                                <X className="group-hover:rotate-255 transition-normal"/>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-5">


                            <Input
                                type="email"
                                placeholder="Email"
                                icon={Mail}
                                onChange={() => setEmailInput(event.target.value)}
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                icon={Key}
                                onChange={() => setPasswordInput(event.target.value)}
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                icon={Key}
                                onChange={() => setPassword2Input(event.target.value)}
                            />

                            <Input
                                type="text"
                                placeholder="Nickname"
                                icon={ShieldUser}
                                onChange={() => setNicknameInput(event.target.value)}
                            />
                        </div>

                        <Button onClick={() => register({emailInput, passwordInput, password2Input, nicknameInput})}
                                variant="default" size="sm"
                                className="flex w-full mt-5"
                                disabled={isRegisterDisabled}>
                            {isRegisterLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Login'}
                        </Button>

                        <Button className="font-medium"
                                variant='link' onClick={() => setAuthVariant('login')}>Already registred?
                        </Button>
                    </>
                )}

                {authVariant === 'login' && (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="font-bold text-2xl">
                                Sign in
                            </h1>

                            <Button className="group" variant='ghost' size='icon' onClick={onClose}>
                                <X className="group-hover:rotate-255 transition-normal"/>
                            </Button>
                        </div>

                        {accountCreated && (
                            <div
                                className="flex items-center gap-3 bg-green-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all">
                                <span>
                                    <UserRoundCheck className="w-6 h-6 text-white"/>
                                </span>
                                <div>
                                    <div className="font-bold text-lg">Account created!</div>
                                    <div className="text-sm font-medium opacity-90">You can now sign in to your
                                        profile.
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="relative mb-5">
                            <div
                                className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-black/55"/>
                            </div>
                            <Input
                                type="email"
                                placeholder="Email"
                                onChange={() => setEmailInput(event.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div
                                className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                <Key className="h-4 w-4 text-black/55"/>
                            </div>

                            <Input
                                type="password"
                                placeholder="Password"
                                onChange={() => setPasswordInput(event.target.value)}
                            />
                        </div>
                        <div className="relative flex gap-2 mt-5 justify-between">
                            <div className="flex gap-1 justify-center">
                                <input
                                    type="checkbox"
                                    placeholder="Password"
                                    className=""
                                />
                                <span className="">Remember me</span>
                            </div>

                            <a className="" href="#">Forgot password?</a>
                        </div>


                        <Button onClick={() => login({email: emailInput, password: passwordInput})}
                                disabled={isLoginDisabled} variant="default" size="sm"
                                className="flex mt-5">
                            {isLoginLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Login'}
                        </Button>

                        <Button className="font-medium p-0"
                                variant='link' onClick={() => setAuthVariant('register')}>
                            Don't have an accountyet?
                        </Button>
                    </>
                )}

            </div>
        </section>
    )
}

export default Authentication;
