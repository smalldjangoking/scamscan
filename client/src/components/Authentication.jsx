import {
  Mail,
  Key,
  X,
  ShieldUser,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "./ui/Button.jsx";
import React, { useEffect, useRef, useState, useContext } from "react";
import Input from "./ui/Input.jsx";
import { createPortal } from "react-dom";
import { Context } from "../main";
import { observer } from "mobx-react-lite";

export default observer(function Authentication({ isOpen, onClose, authVar }) {
  const [authVariant, setAuthVariant] = useState("register");
  const AuthenticationSectionRef = useRef(null);
  const { store } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    store.clearErorrs();
  }, [authVariant]);

  useEffect(() => {
    if (authVar) {
      setAuthVariant(authVar);
    }

    function handleClickOutside(event) {
      if (
        AuthenticationSectionRef.current &&
        !AuthenticationSectionRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, authVar]);

  if (!isOpen) return null;

  const isRegisterDisabled =
    !email || !password || !password2 || !nickname || password !== password2;

  const isLoginDisabled = !email || !password;

  return createPortal(
    <section className="fixed inset-0 bg-muted/70 z-50">
      <div
        className="fixed top-0 left-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-40"
        ref={AuthenticationSectionRef}
      >
        <div className="flex flex-col justify-center w-screen h-screen md:max-w-[500px] md:h-fit bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6">
          {store.errors.size > 0 && (
            Array.from(store.errors).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-red-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all"
              >
                <span>
                  <TriangleAlert className="w-6 h-6 text-white" />
                </span>
                <div>
                  <div className="text-sm font-bold opacity-90">
                    {item}
                  </div>
                </div>
              </div>
            ))
          )}

          {authVariant === "register" && (
            <>
              <div className="flex items-center justify-between mb-10">
                <h1 className="font-bold text-2xl">Register</h1>

                <Button
                  className="group"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="group-hover:rotate-255 transition-normal" />
                </Button>
              </div>

              <div className="flex flex-col gap-5">
                <Input
                  type="email"
                  placeholder="Email"
                  icon={Mail}
                  onChange={() => setEmail(event.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  icon={Key}
                  onChange={() => setPassword(event.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  icon={Key}
                  onChange={() => setPassword2(event.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Nickname"
                  icon={ShieldUser}
                  onChange={() => setNickname(event.target.value)}
                />
              </div>

              <Button
                onClick={async () => {
                  const ok = await store.registration(
                    email,
                    password,
                    password2,
                    nickname
                  );
                  if (ok) {
                    setAuthVariant("email_confirm");
                  }
                }}
                variant="default"
                size="sm"
                className="flex w-full mt-5"
                disabled={isRegisterDisabled || store.isLoading}
              >
                {store.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>

              <Button
                className="font-medium"
                variant="link"
                onClick={() => setAuthVariant("login")}
              >
                Already registred?
              </Button>
            </>
          )}

          {authVariant === "email_confirm" && (
            <>
              <div className="flex items-center justify-end mb-5">
                <Button
                  className="group"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="group-hover:rotate-255 transition-normal" />
                </Button>
              </div>

              <h1 className="font-bold text-2xl flex items-center justify-center gap-2 mb-5">
                🎉 Congratulations!
              </h1>

              <div className="flex items-start gap-4 px-6 py-4 rounded-2xl shadow-lg mb-6 animate-fade-in transition-all">
                <span className="mt-1">
                  <Mail className="w-7 h-7 drop-shadow-md" />
                </span>
                <div>
                  <div className="font-semibold text-lg">
                    Your verification email has been sent!
                  </div>
                  <p className="text-sm font-medium opacity-90 mt-1 leading-relaxed">
                    Please check your{" "}
                    <span className="font-semibold">Spam</span> or{" "}
                    <span className="font-semibold">Promotions</span> folder if
                    you don’t see it within a few minutes. If you still haven’t
                    received it, simply log in again — we’ll automatically
                    resend a new confirmation email for you.
                  </p>
                </div>
              </div>
            </>
          )}

          {authVariant === "login" && (
            <>
              <div className="flex items-center justify-between mb-10">
                <h1 className="font-bold text-2xl">Sign in</h1>

                <Button
                  className="group"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="group-hover:rotate-255 transition-normal" />
                </Button>
              </div>

              {store.verifyText && (
                <div className="flex items-center gap-3 bg-green-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all">
                  <span>
                    <Mail className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <div className="font-bold text-lg">{store.verifyText}</div>
                    <div className="text-sm font-medium opacity-90">
                      Please check your Spam or Promotions folder if you don’t
                      see it within a few minutes.
                    </div>
                  </div>
                </div>
              )}

              <div className="relative mb-5">
                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-black/55" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  onChange={() => setEmail(event.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                  <Key className="h-4 w-4 text-black/55" />
                </div>

                <Input
                  type="password"
                  placeholder="Password"
                  onChange={() => setPassword(event.target.value)}
                />
              </div>
              <div className="relative flex gap-2 mt-5 justify-between">
                <div className="flex gap-1 justify-center">
                  <input type="checkbox" placeholder="Password" className="" />
                  <span className="">Remember me</span>
                </div>

                <Button variant='link' onClick={() => setAuthVariant('reset_password')}>
                  Forgot password?
                </Button>
              </div>

              <Button
                onClick={() => store.login(email, password)}
                disabled={isLoginDisabled || store.isLoading}
                variant="default"
                size="sm"
                className="flex mt-5"
              >
                {store.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>

              <Button
                className="font-medium p-0"
                variant="link"
                onClick={() => setAuthVariant("register")}
              >
                Don't have an account yet?
              </Button>
            </>
          )}

          {authVariant === "reset_password" && (
            <>
              <div className="flex items-center justify-between mb-10">
                <h1 className="font-bold text-2xl">Reset Password</h1>

                <Button
                  className="group"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="group-hover:rotate-255 transition-normal" />
                </Button>
              </div>

              {store.verifyText && (
                <div className="flex items-center gap-3 bg-green-600/90 text-white px-5 py-3 rounded-xl shadow-lg mb-6 animate-fade-in transition-all">
                  <span>
                    <Mail className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <div className="font-bold text-lg">{store.verifyText}</div>
                    <div className="text-sm font-medium opacity-90">
                      Please check your Spam or Promotions folder if you don’t
                      see it within a few minutes.
                    </div>
                  </div>
                </div>
              )}

              {!store.verifyText && (
                <>
                  <div className="relative mb-5">
                    <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-black/55" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      onChange={() => setEmail(event.target.value)}
                    />
                  </div>

                  <Button
                    onClick={() => store.passwordTokenReq(email)}
                    disabled={!!!email || store.isLoading}
                    variant="default"
                    size="sm"
                    className="flex"
                  >
                    {store.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Restore link"
                    )}
                  </Button>
                </>
              )}

              <Button
                className="font-medium p-0"
                variant="link"
                onClick={() => setAuthVariant("login")}
              >
                Log in to your account
              </Button>
            </>
          )}
        </div>
      </div>
    </section>,
    document.body
  );
});
