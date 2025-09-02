import {Mail, Key, X, ShieldUser} from "lucide-react";
import {Button} from "./ui/Button.jsx";
import {useEffect, useRef, useState} from "react";

function Authentication({isOpen, onClose}) {
    const [authVariant, setAuthVariant] = useState('register');
    const AuthenticationSectionRef = useRef(null)

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const password2Ref = useRef(null)
    const nicknameRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (AuthenticationSectionRef.current && !AuthenticationSectionRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }


    }, [isOpen, onClose])

    if (!isOpen) return null;

    async function fetchUserCreate(){
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            nickname: nicknameRef.current.value,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/create", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            })

            let dataIn = await response.json();
            console.log(dataIn)
        } catch (error) {
            console.log(error)
        }
    }

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
                                <X className="group-hover:rotate-255 transition-normal"/>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-10" >

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-black/55"/>
                                </div>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Email"
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
                                    <Key className="h-4 w-4 text-black/55"/>
                                </div>
                                <input
                                    ref={passwordRef}
                                    type="password"
                                    placeholder="Password"
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
                                    <Key className="h-4 w-4 text-black/55"/>
                                </div>
                                <input
                                    ref={password2Ref}
                                    type="password"
                                    placeholder="Password"
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
                                    <ShieldUser className="h-4 w-4 text-black/55"/>
                                </div>
                                <input
                                    ref={nicknameRef}
                                    type="text"
                                    placeholder="Nickname"
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
                            <Button onClick={() => fetchUserCreate()} variant="secondary" size="sm" className="flex w-full mt-5">
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
                                <X className="group-hover:rotate-255 transition-normal"/>
                            </Button>
                        </div>

                        <div className="relative mb-5">
                            <div
                                className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-black/55"/>
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
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
                                <Key className="h-4 w-4 text-black/55"/>
                            </div>

                            <input
                                type="password"
                                placeholder="Password"
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
                            <Button variant="secondary" size="sm" className="flex w-full mt-5">
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
