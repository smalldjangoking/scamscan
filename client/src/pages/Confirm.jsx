import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { MailCheck, MailWarning, LockKeyhole } from "lucide-react";
import { Button } from "../components/ui/Button";
import Authentication from "../components/Authentication";
import { useChangePassword, useTokenCheck } from "../utils/hook"
import LoadingSpinner from "../components/ui/Loading"
import { Input } from "../components/ui/Input"
import SeoHead from "../components/Seo";

export default observer(function Confirm() {
  const navigate = useNavigate()
  const { option, token } = useParams();
  const { store } = useContext(Context);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("login");
  const toggleAuth = () => setIsAuthOpen((prev) => !prev);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { mutate: tokenCheckFunc, isLoading, isError } = useTokenCheck({
    onSuccess: () => {
      store.setNewMemberAlert(false);
    },
  });
  const { mutate: passwordChangeFunc, isLoading: isloadingPassword, isSuccess: isSuccessPassword } = useChangePassword();

  useEffect(() => {

    tokenCheckFunc({ option, token })
  }, [option, token]);

  useEffect(() => {
    if (store.accessToken) {
      navigate('/')
    }
  }, [store.accessToken]);

  return (
    <section className="relative">
      <Authentication
        isOpen={isAuthOpen}
        onClose={toggleAuth}
        authVar={authVariant}
      />

      <SeoHead
        title={
          option === "email"
            ? "Email Confirmation | ScamScan"
            : option === "password"
              ? "Reset Your Password | ScamScan"
              : "Account Confirmation | ScamScan"
        }
        description={
          option === "email"
            ? "Confirm your email to activate your ScamScan account."
            : option === "password"
              ? "Set a new password for your ScamScan account."
              : "ScamScan account confirmation page."
        }
        canonicalUrl={`https://scamscan.io/confirm/${option}/${token}`}
        robots="noindex,nofollow"
        ogType="website"
        ogImage="https://scamscan.io/static/logo.svg"
        twitterCard="summary_large_image"
        twitterImage="https://scamscan.io/static/logo.svg"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative container mx-auto px-4 py-20 md:py-28 min-h-screen">

        {isLoading && (
          <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}


        {option == "email" && !isLoading && (
          <>
            {isError ? (
              <div className="bg-card/80 flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md text-center">
                <MailWarning className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  Email is not confirmed!
                </h2>
                <p>This link has expired or is no longer valid. Please sign in to request a new token</p>
                <Button onClick={() => setIsAuthOpen(true)}>Login</Button>
              </div>
            ) : (
              <div className="bg-card/80 flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md text-center">
                <MailCheck className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  Email confirmed 🎉
                </h2>
                <p className="text-muted-foreground">
                  Your email address has been successfully verified.
                </p>
                <Button onClick={() => setIsAuthOpen(true)}>Login</Button>
              </div>
            )}
          </>
        )}

        {option == "password" && !isLoading && (
          <>
            {isError ? (
              <div className="bg-card/80 flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md text-center">
                <LockKeyhole className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  Password Change failed!
                </h2>
                <p>This link has expired or is no longer valid. Please request a new password reset link</p>
                <Button onClick={() => setIsAuthOpen(true)}>Login</Button>
              </div>
            ) : (
              <div className=" flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md text-center">
                <div className="relative bg-card/90 w-full flex flex-col items-center justify-center gap-4 rounded-2xl p-3 shadow-lg border text-center max-w-md">
                  {!isSuccessPassword && (
                    <>
                      <h2 className="text-xl font-semibold text-foreground">Set a New Password</h2>
                      <div className="w-full flex flex-col gap-3">
                        <Input
                          type="password"
                          value={password}
                          callBack={setPassword}
                          placeholder="New Password"
                          className="h-11"
                        />
                        <Input
                          value={password2}
                          callBack={setPassword2}
                          type="password"
                          placeholder="Repeat Password"
                          className="h-11"
                        />
                      </div>

                      <Button
                        onClick={() => passwordChangeFunc({ token, password })}
                        disabled={!password || !password2 || password !== password2 || password.length < 8 || password2.length < 8}
                        className="w-full h-11 text-base mt-2">
                        Change Password
                      </Button>

                      <p className="text-xs text-muted-foreground leading-tight mt-2">
                        <span className="font-medium text-foreground">Note:</span>
                        &nbsp;Your password should be strong — at least 8 characters,
                        with a mix of letters, numbers, or symbols.
                      </p>

                      {isloadingPassword && (
                        <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
                          <LoadingSpinner />
                        </div>
                      )}
                    </>
                  )}

                  {isSuccessPassword && (
                    <>
                      <LockKeyhole className="h-12 w-12 text-green-500" />
                      <h2 className="text-xl font-semibold text-foreground flex flex-row">
                        Your Password Has Been Changed! 🎉
                      </h2>
                      <p className="text-muted-foreground">
                        You can now log in to your account
                      </p>
                      <Button onClick={() => setIsAuthOpen(true)}>Login</Button>
                    </>
                  )}

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
});
