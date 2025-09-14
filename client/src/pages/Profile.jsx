import React, { useState, useEffect } from "react";
import { User, Phone, AtSign, Calendar, Pencil, Check, X, KeyRound, ShieldAlert, FileWarning } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import toast, { Toaster } from 'react-hot-toast';

function Profile() {
    const [user, setUser] = useState(null);
    const [userUpdate, setUserDataUpdate] = useState(null);
    const [editField, setEditField] = useState(null);
    const [fieldDraft, setFieldDraft] = useState("");
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [pwdDraft, setPwdDraft] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const accessToken = localStorage.getItem('access_token');
    const mockReports = []; // Replace with real data fetching
    const seccessToast = (data) => toast.success(`Your ${data.charAt(0).toUpperCase()}${data.slice(1)} updated successfully`);
    const failedToast = (errorReason) => toast.error(`${errorReason}`);


    const handleLogout = async () => {
        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken ? `Bearer ${accessToken}` : ""
                }
            });

            const response_status = await response.json();

            if (response_status.status === "ok") {
                localStorage.removeItem('access_token');
                window.location.href = "/";
            }

        } catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch("/user/me", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken ? `Bearer ${accessToken}` : ""
                }
            });
            if (response.status == 401) {
                localStorage.removeItem('access_token');
                handleLogout()
                return;
            }


            const userData = await response.json();

            const newAccessToken = response.headers.get("X-New-Access-Token");
            if (newAccessToken) {
                localStorage.setItem('access_token', newAccessToken);
            }

            setUser(userData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userUpdate) {
            patchUserData();
        }


        fetchUser();



    }, [userUpdate]);

    if (!user) return null;

    const fields = [
        { key: "email", label: "Email", icon: <AtSign className="h-4 w-4" />, readonly: true },
        { key: "name", label: "Name", icon: <User className="h-4 w-4" /> },
        { key: "surname", label: "Surname", icon: <User className="h-4 w-4" /> },
        { key: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
        { key: "nickname", label: "Nickname", icon: <User className="h-4 w-4" />},
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

    const patchUserData = async() => {
        if (!userUpdate) return;

        try {
            const response = await fetch("/user/update-user-info", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken ? `Bearer ${accessToken}` : ""
                },
                body: JSON.stringify(userUpdate)
            });

            const data = await response.json();

            if (response.status === 200 && data.status === "ok") {
                seccessToast(data.field);
                setUserDataUpdate(null);

            }

            if (response.status === 400) {
                failedToast(data.detail)
            }

        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }


    const submitPasswordChange = async() => {
        if (pwdDraft.new_password !== pwdDraft.confirm_password) return;

        const response = await fetch("/user/change-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : ""
            },
            body: JSON.stringify(pwdDraft),
            credentials: 'include',
        })

        const data = await response.json()


        setPwdDraft({ old_password: "", new_password: "", confirm_password: "" })
        setPasswordOpen(false)

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
                            Hey, <span className="text-primary">{user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1) }</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl">
                            Manage personal information, security and activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleLogout} size="sm" className="w-[70px]" variant="destructive">
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
                            <div className="divide-y divide-border">
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
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full bg-input-background dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            value={pwdDraft.old_password}
                                            onChange={e => setPwdDraft({ ...pwdDraft, old_password: e.target.value })}
                                        />
                                    </div>
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
                                            onClick={submitPasswordChange}
                                            disabled={
                                                !pwdDraft.old_password ||
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
                                                setPwdDraft({ old_password: "", new_password: "", confirm_password: "" });
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
                                <Button size="sm" variant="outline">
                                    <FileWarning className="h-4 w-4 mr-2" />
                                    New Report
                                </Button>
                            </div>

                            {mockReports.length === 0 ? (
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
                                    {mockReports.map(r => (
                                        <div
                                            key={r.id}
                                            className="p-4 rounded-lg border border-border bg-accent/40 hover:bg-accent/60 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                <div>
                                                    <h3 className="font-medium">{r.title}</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(r.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-xs uppercase tracking-wide font-medium px-3 py-1 rounded-md bg-primary text-primary-foreground">
                                                    {r.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Last Activity (placeholder) */}
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Search History</h2>
                            <p className="text-sm text-muted-foreground">
                                (Optional section) You can display login history, verification events or changes here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;