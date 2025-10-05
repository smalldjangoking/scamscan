import { Mail, Key, X, ShieldUser, MessageCircleWarning, UserRoundCheck } from "lucide-react";
import { Button } from "./ui/Button.jsx";
import { useEffect, useRef, useState } from "react";

function Authentication({ isOpen, onClose, authVar }) {
    const [authVariant, setAuthVariant] = useState('register');
    const AuthenticationSectionRef = useRef(null)

    const [emailInput, setEmailInput] = useState(null)
    const [passwordInput, setPasswordInput] = useState(null)
    const [password2Input, setPassword2Input] = useState(null)
    const [nicknameInput, setNicknameInput] = useState(null)

    const [wrongCredentials, setWrongCredentials] = useState(false)
    const [accountCreated, setAccountCreated] = useState(false)

   
    useEffect(() => {
        if (wrongCredentials && accountCreated) {
            setWrongCredentials(false)
        }

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

    if (!isOpen) return null;

    async function fetchUserCreate() {
        const data = {
            email: emailInput,
            password: passwordInput,
            password_confirmation: password2Input,
            nickname: nicknameInput
        };


        try {
            const response = await fetch("http://127.0.0.1:8000/auth/create", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            let dataIn = await response.json();
            setAccountCreated(true)
            setAuthVariant('login')
        } catch (error) {
            console.log(error)
        }
    }


    async function fetchLogin() {
        const data = {
            email: emailInput,
            password: passwordInput,
        };


        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            })

            let awaited_response = await response.json();

            if (awaited_response.detail) {
                setWrongCredentials(true);
            } else {
                localStorage.setItem("access_token", awaited_response.access_token)
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

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
            <div
                className="bg-primary text-primary-foreground w-screen h-screen md:max-w-[500px] md:max-h-[550px] p-5 md:p-10 md:rounded-2xl">

                {authVariant === 'register' && (
                    <>
                        <div className="flex items-center justify-between mb-15">
                            <h1 className="font-bold text-2xl">
                                Register
                            </h1>

                            <Button className="group" variant='ghost' size='icon' onClick={onClose}>
                                <X className="group-hover:rotate-255 transition-normal" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-10" >

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-black/55" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    onChange={() => setEmailInput(event.target.value)}
                                    className="
                                  w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                  bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                  text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                  selection:bg-primary selection:text-primary-foreground
                                  outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                                "
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                    <Key className="h-4 w-4 text-black/55" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={() => setPasswordInput(event.target.value)}
                                    className="
                                  w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                  bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                  text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                  selection:bg-primary selection:text-primary-foreground
                                  outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                                "
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                    <Key className="h-4 w-4 text-black/55" />
                                </div>
                                <input

                                    type="password"
                                    placeholder="Password"
                                    onChange={() => setPassword2Input(event.target.value)}
                                    className="
                                  w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                  bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                  text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                  selection:bg-primary selection:text-primary-foreground
                                  outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                                "
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                    <ShieldUser className="h-4 w-4 text-black/55" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nickname"
                                    onChange={() => setNicknameInput(event.target.value)}
                                    className="
                                  w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                  bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                  text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                  selection:bg-primary selection:text-primary-foreground
                                  outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                                "
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <Button onClick={() => fetchUserCreate()} variant="secondary" size="sm" className="flex w-full mt-5"
                                disabled={isRegisterDisabled}>
                                Register
                            </Button>
                        </div>

                        <div className="flex justify-center mt-5 items-center">
                            <p className='tracking-wide'>Already registred?</p>
                            <Button className="text-forgot-password font-medium"
                                variant='link' onClick={() => setAuthVariant('login')}>Sign in</Button>
                        </div>


                    </>
                )}

                {authVariant === 'login' && (
                    <>
                        <div className="flex items-center justify-between mb-15">
                            <h1 className="font-bold text-2xl">
                                Sign in
                            </h1>

                            <Button className="group" variant='ghost' size='icon' onClick={onClose}>
                                <X className="group-hover:rotate-255 transition-normal" />
                            </Button>
                        </div>

                        {wrongCredentials && (
                            <div className="flex items-center gap-3 bg-red-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all">
                                <span>
                                    <MessageCircleWarning className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <div className="font-bold text-lg">Wrong credentials!</div>
                                    <div className="text-sm font-medium opacity-90">Try again or reset your password</div>
                                </div>
                            </div>
                        )}
                            
                        {accountCreated && (
                            <div className="flex items-center gap-3 bg-green-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all">
                                <span>
                                    <UserRoundCheck className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <div className="font-bold text-lg">Account created!</div>
                                    <div className="text-sm font-medium opacity-90">You can now sign in to your profile.</div>
                                </div>
                            </div>
                        )}

                        <div className="relative mb-5">
                            <div
                                className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-black/55" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                onChange={() => setEmailInput(event.target.value)}
                                className="
                                   w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                   bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                   text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                   selection:bg-primary selection:text-primary-foreground
                                   outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                   disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                                 "
                            />

                        </div>

                        <div className="relative">
                            <div
                                className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                <Key className="h-4 w-4 text-black/55" />
                            </div>

                            <input
                                type="password"
                                placeholder="Password"
                                onChange={() => setPasswordInput(event.target.value)}
                                className="
                                 w-full h-12 flex min-w-0 items-center rounded-md border border-input
                                 bg-input-background dark:bg-input/30 px-3 py-1 pl-10
                                 text-medium md:text-sm text-black font-medium placeholder:text-sidebar-ring
                                 selection:bg-primary selection:text-primary-foreground
                                 outline-none transition-colors focus:ring-2 focus:ring-primary focus:border-primary
                                 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                               "
                            />
                        </div>
                        <div className="relative flex gap-2 mt-5 justify-between">
                            <div className="flex gap-1 justify-center">
                                <input
                                    type="checkbox"
                                    placeholder="Password"
                                    className=""
                                />
                                <span className="font-base">Remember me</span>
                            </div>

                            <a className="text-forgot-password font-medium" href="#">Forgot password?</a>


                        </div>


                        <div className="flex items-center justify-center">
                            <Button onClick={() => fetchLogin()} disabled={isLoginDisabled} variant="secondary" size="sm" className="flex w-full mt-5">
                                Login
                            </Button>
                        </div>

                        <div className="flex justify-center mt-5 items-center">
                            <p className=' tracking-wide'>Don't have an account yet?</p>
                            <Button className="text-forgot-password font-medium"
                                variant='link' onClick={() => setAuthVariant('register')}>Register</Button>
                        </div>
                    </>
                )}

            </div>
        </section>
    )
}

export default Authentication;
