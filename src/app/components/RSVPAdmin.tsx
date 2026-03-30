import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Users, Mail, Phone, CalendarDays, LogOut, ShieldCheck, KeyRound } from "lucide-react";
import { confirmSignIn, fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { client } from "../../lib/amplify";
import { useLanguage } from "../i18n";

type RSVPRecord = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  guestCount: number;
  attending: boolean;
  arrivalInfo?: string | null;
  songRequest?: string | null;
  message?: string | null;
  language?: string | null;
  createdAt?: string | null;
};

type AdminUser = {
  username: string;
  groups: string[];
};

type AuthStep = "signIn" | "newPassword";

export function RSVPAdmin() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authStep, setAuthStep] = useState<AuthStep>("signIn");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const content = {
    title: isZh ? "RSVP 管理" : "RSVP Admin",
    subtitle: isZh ? "查看已提交的回复记录" : "Review submitted responses",
    refresh: isZh ? "刷新" : "Refresh",
    loading: isZh ? "正在加载 RSVP 记录..." : "Loading RSVP records...",
    error: isZh ? "读取 RSVP 失败。" : "Failed to load RSVP records.",
    empty: isZh ? "还没有收到任何 RSVP。" : "No RSVP submissions yet.",
    total: isZh ? "总提交数" : "Total submissions",
    yes: isZh ? "出席" : "Attending",
    no: isZh ? "缺席" : "Not attending",
    guests: isZh ? "人数" : "Guests",
    arrivalInfo: isZh ? "到达信息" : "Arrival info",
    songRequest: isZh ? "点歌" : "Song request",
    message: isZh ? "留言" : "Message",
    language: isZh ? "语言" : "Language",
    submittedAt: isZh ? "提交时间" : "Submitted at",
    noValue: isZh ? "未填写" : "Not provided",
    groups: isZh ? "用户组" : "Groups",
    signInTitle: isZh ? "管理员登录" : "Admin Sign In",
    signInBody: isZh ? "请使用 Cognito 管理员账号登录后查看 RSVP 数据。" : "Sign in with your Cognito admin account to view RSVP data.",
    emailLabel: isZh ? "邮箱" : "Email",
    passwordLabel: isZh ? "密码" : "Password",
    signIn: isZh ? "登录" : "Sign In",
    signingIn: isZh ? "登录中..." : "Signing In...",
    signOut: isZh ? "退出登录" : "Sign Out",
    forbidden: isZh ? "当前账号不在 ADMINS 组，无法查看 RSVP 数据。" : "This account is not in the ADMINS group and cannot view RSVP data.",
    challengeUnsupported: isZh ? "当前账号需要额外 Cognito 登录步骤，当前页面暂不支持该挑战类型。" : "This account requires an additional Cognito sign-in step that this page does not support.",
    newPasswordTitle: isZh ? "设置新密码" : "Set a New Password",
    newPasswordBody: isZh ? "这是你的首次登录。请先设置一个新密码，然后继续进入 RSVP 管理页。" : "This is your first sign-in. Set a new password to continue to the RSVP admin page.",
    newPasswordLabel: isZh ? "新密码" : "New password",
    confirmNewPassword: isZh ? "提交新密码" : "Submit New Password",
    confirmingNewPassword: isZh ? "提交中..." : "Submitting...",
  };

  const loadRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, errors } = await client.models.RSVP.list(
        { limit: 1000 },
        { authMode: "userPool" },
      );

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const sorted = ([...(data ?? [])] as RSVPRecord[]).sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setRecords(sorted);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : content.error);
    } finally {
      setLoading(false);
    }
  };

  const hydrateAdminSession = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken.payload["cognito:groups"] as string[] | undefined) ?? [];

      if (!groups.includes("ADMINS")) {
        setAdminUser(null);
        setAuthError(content.forbidden);
        return;
      }

      setAdminUser({
        username: user.signInDetails?.loginId ?? user.username,
        groups,
      });
      setAuthError("");
      setAuthStep("signIn");
    } catch {
      setAdminUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    void hydrateAdminSession();
  }, []);

  useEffect(() => {
    if (!adminUser) {
      return;
    }

    void loadRecords();
  }, [adminUser]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await signIn({
        username: email.trim(),
        password,
      });

      if (result.isSignedIn) {
        setPassword("");
        await hydrateAdminSession();
        return;
      }

      if (result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setAuthStep("newPassword");
        setPassword("");
        setAuthLoading(false);
        return;
      }

      setAuthError(content.challengeUnsupported);
      setAuthLoading(false);
    } catch (err) {
      setAuthError(err instanceof Error && err.message ? err.message : content.challengeUnsupported);
      setAuthLoading(false);
    }
  };

  const handleConfirmNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (result.isSignedIn) {
        setNewPassword("");
        await hydrateAdminSession();
        return;
      }

      setAuthError(content.challengeUnsupported);
      setAuthLoading(false);
    } catch (err) {
      setAuthError(err instanceof Error && err.message ? err.message : content.challengeUnsupported);
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAdminUser(null);
    setRecords([]);
    setError("");
    setAuthError("");
    setAuthStep("signIn");
    setPassword("");
    setNewPassword("");
  };

  if (authLoading && !adminUser) {
    return (
      <div className="min-h-screen bg-[#fdfbf8] py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-[#eadccd] p-8">
          <p className="text-[#6b6256]">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#fdfbf8] py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-[#eadccd] p-8">
          <div className="flex items-center gap-3 mb-4 text-[#4a4238]">
            {authStep === "newPassword" ? (
              <KeyRound className="w-5 h-5 text-[#b8997a]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#b8997a]" />
            )}
            <h1 className="text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
              {authStep === "newPassword" ? content.newPasswordTitle : content.signInTitle}
            </h1>
          </div>
          <p className="text-[#6b6256] mb-6">
            {authStep === "newPassword" ? content.newPasswordBody : content.signInBody}
          </p>

          {authStep === "newPassword" ? (
            <form onSubmit={handleConfirmNewPassword} className="space-y-4">
              <div>
                <label htmlFor="admin-new-password" className="block mb-2 text-[#4a4238]">
                  {content.newPasswordLabel}
                </label>
                <input
                  id="admin-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                />
              </div>
              {authError ? <p className="text-sm text-[#b85c5c]">{authError}</p> : null}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#b8997a] text-white hover:bg-[#a07d5f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wider uppercase"
              >
                {authLoading ? content.confirmingNewPassword : content.confirmNewPassword}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block mb-2 text-[#4a4238]">
                  {content.emailLabel}
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block mb-2 text-[#4a4238]">
                  {content.passwordLabel}
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                />
              </div>
              {authError ? <p className="text-sm text-[#b85c5c]">{authError}</p> : null}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#b8997a] text-white hover:bg-[#a07d5f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wider uppercase"
              >
                {authLoading ? content.signingIn : content.signIn}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf8] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl text-[#4a4238] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              {content.title}
            </h1>
            <p className="text-[#6b6256]">{content.subtitle}</p>
            <p className="text-sm text-[#8a7e70] mt-2">{adminUser.username}</p>
            <p className="text-sm text-[#8a7e70] mt-1">
              {content.groups}: {adminUser.groups.length ? adminUser.groups.join(", ") : content.noValue}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadRecords()}
              className="inline-flex items-center gap-2 self-start px-5 py-3 border border-[#b8997a] text-[#b8997a] hover:bg-[#b8997a] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {content.refresh}
            </button>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="inline-flex items-center gap-2 self-start px-5 py-3 border border-[#d8c9b8] text-[#6b6256] hover:bg-[#eee5dc] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {content.signOut}
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#eadccd] p-6 mb-8">
          <div className="flex items-center gap-3 text-[#4a4238]">
            <Users className="w-5 h-5 text-[#b8997a]" />
            <span className="text-sm uppercase tracking-[0.2em]">{content.total}</span>
          </div>
          <p className="text-4xl mt-3 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
            {records.length}
          </p>
        </div>

        {loading ? <p className="text-[#6b6256]">{content.loading}</p> : null}
        {error ? <p className="text-[#b85c5c]">{error}</p> : null}
        {!loading && !error && records.length === 0 ? <p className="text-[#6b6256]">{content.empty}</p> : null}

        <div className="grid gap-6">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="bg-white border border-[#eadccd] p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                    {record.fullName}
                  </h2>
                  <p className="text-[#b8997a] mt-1">
                    {record.attending ? content.yes : content.no} · {content.guests}: {record.guestCount}
                  </p>
                </div>
                <div className="text-sm text-[#8a7e70] flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {content.submittedAt}: {record.createdAt ? new Date(record.createdAt).toLocaleString() : content.noValue}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-[#6b6256]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-1 text-[#b8997a]" />
                  <span>{record.email || content.noValue}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-1 text-[#b8997a]" />
                  <span>{record.phone || content.noValue}</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-1">{content.arrivalInfo}</p>
                  <p>{record.arrivalInfo || content.noValue}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-1">{content.songRequest}</p>
                  <p>{record.songRequest || content.noValue}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-1">{content.message}</p>
                  <p>{record.message || content.noValue}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-1">{content.language}</p>
                  <p>{record.language || content.noValue}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
