import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { MailCheck, MailWarning } from "lucide-react";
import { Button } from "../components/ui/Button";
import Authentication from '../components/Authentication'

export default observer(function Confirm() {
  const { option, token } = useParams();
  const { store } = useContext(Context);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("login");
  const toggleAuth = () => setIsAuthOpen((prev) => !prev);

  useEffect(() => {
    const confirm = async () => {
      return await store.confirm(option, token);
    };

    confirm();
  }, [option, token, store]);

  return (
    <>
      <section className="relative">
        <Authentication
          isOpen={isAuthOpen}
          onClose={toggleAuth}
          authVar={authVariant}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative container mx-auto px-4 py-20 md:py-28 min-h-screen">
          {store.isLoading && <>loading...</>}

          {option == "email" && !store.isLoading && (
            <>
              {!confirm && (
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

              {confirm && (
                <div className="bg-card/80 flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md text-center">
                  <MailWarning className="h-12 w-12 text-red-500" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Email is not confirmed!
                  </h2>
                  <p className="text-muted-foreground">
                    {store.errorText}. Please log in to request a new confirmation email.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
});
