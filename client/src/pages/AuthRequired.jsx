import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../main"
import { observer } from "mobx-react-lite";

export default observer(function PrivateRoute({ children }) {
    const { store } = useContext(Context)
    const user = store.userId

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
})
