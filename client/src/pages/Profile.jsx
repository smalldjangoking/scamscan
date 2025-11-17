import React, { useState, useEffect, useContext, useMemo } from "react";
import {
    User, AtSign, Calendar, Pencil,
    Check, X, KeyRound, FileWarning, Wrench
} from "lucide-react";
import LoadingSpinner from "../components/ui/Loading"
import { Button } from "../components/ui/Button.jsx";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { useReports, useUserUpdate, useUserPasswordChange } from "../utils/hook.js"
import Pagination from "../components/ui/Paginator.jsx";
import { jwtDecode } from "jwt-decode";




function Profile() {
    const { store } = useContext(Context)
    const [user, setUser] = useState(null);
    const [userUpdate, setUserDataUpdate] = useState(null);
    const [editField, setEditField] = useState(null);
    const [fieldDraft, setFieldDraft] = useState("");
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [pwdDraft, setPwdDraft] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const successToast = (data) => toast.success(data);
    const failedToast = (errorReason) => toast.error(`${errorReason}`);
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const pageSize = 4


    const user_id = useMemo(() => {
        if (!store.accessToken) return null;
        try {
            const payload = jwtDecode(store.accessToken);
            return payload?.sub ?? null;
        } catch (e) {
            console.error("Failed to decode token", e);
            return null;
        }
    }, [store.accessToken]);


    const { data, isLoading } = useReports({
        page,
        pageSize,
        userOnly: true,
        user_id
    })

    const { mutate: updateUserDataFunc, isPending: isLoadingUserUpdate } = useUserUpdate(
        {
            setUser,
            successToast,
            failedToast,
        }
    );

    const { mutate: updateUserPasswordFunc, isPending: isLoadingUserPasUpdate } = useUserPasswordChange(
        {
            setPasswordOpen,
            setPwdDraft,
            successToast,
            failedToast,
        }
    );

    const fetchUser = async () => {
        const res = await store.me();
        setUser(res?.data)
    }


    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        if (userUpdate) {
            updateUserDataFunc(userUpdate);
        }
    }, [userUpdate])

    if (!user) return null;

    const fields = [
        { key: "email", label: "Email", icon: <AtSign className="h-4 w-4" />, readonly: true },
        { key: "name", label: "Name", icon: <User className="h-4 w-4" /> },
        { key: "surname", label: "Surname", icon: <User className="h-4 w-4" /> },
        { key: "nickname", label: "Nickname", icon: <User className="h-4 w-4" /> },
        { key: "created_at", label: "Created At", icon: <Calendar className="h-4 w-4" />, readonly: true }
    ];

    function startEdit(key, value) {
        if (fields.find(f => f.key === key)?.readonly) return;
        setEditField(key);
        setFieldDraft(value || "");
    }

    function cancelEdit() {
        setEditField(null);
        setFieldDraft("");
    }

    function saveField() {
        if (fieldDraft === user[editField]) return;

        setUserDataUpdate(prev => ({ ...prev, [editField]: fieldDraft }));
        cancelEdit();
    }

    return (
        <section className="relative">
            <Toaster />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="container mx-auto px-4 py-20 md:py-28 relative">
                {/* Header */}
                <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div>

                        <h1 className="text-4xl md:text-6xl tracking-tight mb-4">
                            Hey, <span className="text-primary">{user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1)}</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl">
                            Manage personal information, security and activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" className="w-[70px]" variant="destructive">
                            Quit
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">

                    {/* User Fields + Password */}
                    <div className="lg:col-span-5 space-y-10">

                        {/* User Info Card */}
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
                            <div className="relative divide-y divide-border">
                                {fields.map(f => (
                                    <div key={f.key} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-accent-foreground border border-border">
                                                {f.icon}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                                    {f.label}
                                                </div>
                                                {editField === f.key ? (
                                                    <input
                                                        autoFocus
                                                        value={fieldDraft}
                                                        onChange={(e) => setFieldDraft(e.target.value)}
                                                        className="mt-1 w-full bg-input-background dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                        disabled={f.readonly}
                                                    />
                                                ) : (
                                                    <div className="font-medium truncate">
                                                        {f.key === "created_at"
                                                            ? new Date(user[f.key]).toLocaleString()
                                                            : (user[f.key] || <span className="italic text-muted-foreground">empty</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 justify-end">
                                            {editField === f.key ? (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8"
                                                        onClick={saveField}
                                                        disabled={f.readonly || (fieldDraft === user[f.key])}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                !f.readonly && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => startEdit(f.key, user[f.key])}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isLoadingUserUpdate && (
                                <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </div>

                        {/* Password Change */}
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Password & Security</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPasswordOpen(o => !o)}
                                    className="text-sm"
                                >
                                    {passwordOpen ? "Close" : "Change"}
                                </Button>
                            </div>

                            {passwordOpen ? (
                                <div className="relative space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full bg-input-background dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            value={pwdDraft.new_password}
                                            onChange={e => setPwdDraft({ ...pwdDraft, new_password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full bg-input-background dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            value={pwdDraft.confirm_password}
                                            onChange={e => setPwdDraft({ ...pwdDraft, confirm_password: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => updateUserPasswordFunc(pwdDraft.new_password)}
                                            disabled={
                                                !pwdDraft.new_password ||
                                                pwdDraft.new_password !== pwdDraft.confirm_password
                                            }
                                        >
                                            <KeyRound className="h-4 w-4 mr-2" />
                                            Update Password
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setPwdDraft({ new_password: "", confirm_password: "" });
                                                setPasswordOpen(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    {pwdDraft.new_password &&
                                        pwdDraft.confirm_password &&
                                        pwdDraft.new_password !== pwdDraft.confirm_password && (
                                            <p className="text-xs text-destructive mt-1">Passwords do not match.</p>
                                        )}


                                    {isLoadingUserPasUpdate && (
                                        <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <KeyRound className="h-4 w-4" />
                                    <span>Keep your account secure. Use a strong password.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity / Reports */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6 min-h-[340px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">Your Reports</h2>
                                <Button
                                    size="sm" variant="outline"
                                    onClick={() => navigate('/report')}>
                                    <FileWarning className="h-4 w-4 mr-2" />
                                    Create a Report
                                </Button>
                            </div>

                            {isLoading ? (
                                <>
                                    <div className="col-span-full flex justify-center items-center py-20">
                                        <LoadingSpinner />
                                    </div>
                                </>
                            )
                                : (
                                    data?.reports?.length === 0 ? (
                                        <div className="flex flex-1 items-center justify-center">
                                            <div className="text-center">
                                                <div
                                                    className="mx-auto mb-4 h-14 w-14 rounded-full border border-dashed border-muted flex items-center justify-center">
                                                    <FileWarning className="h-7 w-7 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground">
                                                    You have no reports yet. Start contributing by submitting the first one.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {data.reports.map(r => (
                                                <div
                                                    key={r.id}
                                                    className="p-4 rounded-lg border border-border bg-accent/40 hover:bg-accent/60 transition-colors">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div>
                                                            <h3 className="font-medium">{r.report_title}</h3>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(r.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <Button variant="ghost">
                                                            <Wrench />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <Pagination
                                                page={page}
                                                totalPages={data?.totalPages}
                                                isFetching={isLoading}
                                                onPageChange={setPage}
                                            />
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default observer(Profile);