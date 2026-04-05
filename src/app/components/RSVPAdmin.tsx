import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Image as ImageIcon,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { confirmSignIn, fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { getUrl, remove } from "aws-amplify/storage";
import { client } from "../../lib/amplify";
import { useLanguage } from "../i18n";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

type RSVPDraft = {
  fullName: string;
  email: string;
  phone: string;
  guestCount: number;
  attending: boolean;
  arrivalInfo: string;
  songRequest: string;
  message: string;
  language: string;
};

type AdminUser = {
  username: string;
  groups: string[];
};

type GuestPhotoRecord = {
  id: string;
  url?: string | null;
  storagePath?: string | null;
  originalFileName?: string | null;
  uploaderName?: string | null;
  message?: string | null;
  createdAt?: string | null;
};

type AuthStep = "signIn" | "newPassword";

function createDraft(record: RSVPRecord): RSVPDraft {
  return {
    fullName: record.fullName,
    email: record.email ?? "",
    phone: record.phone ?? "",
    guestCount: record.guestCount,
    attending: record.attending,
    arrivalInfo: record.arrivalInfo ?? "",
    songRequest: record.songRequest ?? "",
    message: record.message ?? "",
    language: record.language ?? "",
  };
}

function normalizeDraft(draft: RSVPDraft): RSVPDraft {
  const attending = draft.attending;

  return {
    fullName: draft.fullName.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    guestCount: attending ? Math.max(1, Number(draft.guestCount) || 1) : 0,
    attending,
    arrivalInfo: draft.arrivalInfo.trim(),
    songRequest: draft.songRequest.trim(),
    message: draft.message.trim(),
    language: draft.language.trim(),
  };
}

function draftsEqual(left: RSVPDraft, right: RSVPDraft) {
  return JSON.stringify(normalizeDraft(left)) === JSON.stringify(normalizeDraft(right));
}

export function RSVPAdmin() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RSVPDraft>>({});
  const [editingById, setEditingById] = useState<Record<string, boolean>>({});
  const [savingById, setSavingById] = useState<Record<string, boolean>>({});
  const [deletingById, setDeletingById] = useState<Record<string, boolean>>({});
  const [saveErrorById, setSaveErrorById] = useState<Record<string, string>>({});
  const [saveSuccessById, setSaveSuccessById] = useState<Record<string, string>>({});
  const [deleteErrorById, setDeleteErrorById] = useState<Record<string, string>>({});
  const [deleteSuccessById, setDeleteSuccessById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authStep, setAuthStep] = useState<AuthStep>("signIn");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoRecord[]>([]);
  const [loadingGuestPhotos, setLoadingGuestPhotos] = useState(false);
  const [guestPhotoError, setGuestPhotoError] = useState("");
  const [selectedGuestPhotoIds, setSelectedGuestPhotoIds] = useState<string[]>([]);
  const [deletingGuestPhotos, setDeletingGuestPhotos] = useState(false);
  const [deleteGuestPhotoError, setDeleteGuestPhotoError] = useState("");
  const [deleteGuestPhotoSuccess, setDeleteGuestPhotoSuccess] = useState("");

  const content = {
    title: isZh ? "RSVP 管理" : "RSVP Admin",
    subtitle: isZh ? "查看回复，并按需进入编辑" : "Review responses and edit only when needed",
    refresh: isZh ? "刷新" : "Refresh",
    loading: isZh ? "正在加载 RSVP 记录..." : "Loading RSVP records...",
    error: isZh ? "读取 RSVP 失败。" : "Failed to load RSVP records.",
    empty: isZh ? "还没有收到任何 RSVP。" : "No RSVP submissions yet.",
    total: isZh ? "总提交数" : "Total submissions",
    uploadedPhotos: isZh ? "宾客上传照片" : "Guest Uploaded Photos",
    uploadedPhotosHint: isZh ? "可勾选多张照片后批量删除。" : "Select one or more uploaded photos to delete them.",
    uploadedPhotosEmpty: isZh ? "还没有宾客上传照片。" : "No guest-uploaded photos yet.",
    uploadedPhotosLoading: isZh ? "正在加载宾客上传照片..." : "Loading uploaded photos...",
    uploadedPhotosFailed: isZh ? "读取宾客上传照片失败。" : "Failed to load guest-uploaded photos.",
    selectPhoto: isZh ? "选择照片" : "Select photo",
    deleteSelectedPhotos: isZh ? "删除所选照片" : "Delete Selected Photos",
    deletingPhotos: isZh ? "删除中..." : "Deleting...",
    deletePhotosSuccess: isZh ? "所选照片已删除。" : "Selected photos deleted.",
    deletePhotosFailed: isZh ? "删除照片失败。" : "Failed to delete selected photos.",
    noPhotosSelected: isZh ? "请先选择至少一张照片。" : "Select at least one photo first.",
    uploadedBy: isZh ? "上传者" : "Uploaded by",
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
    signInBody: isZh
      ? "请使用 Cognito 管理员账号登录后查看和编辑 RSVP 数据。"
      : "Sign in with your Cognito admin account to view and edit RSVP data.",
    emailLabel: isZh ? "邮箱" : "Email",
    passwordLabel: isZh ? "密码" : "Password",
    signIn: isZh ? "登录" : "Sign In",
    signingIn: isZh ? "登录中..." : "Signing In...",
    signOut: isZh ? "退出登录" : "Sign Out",
    forbidden: isZh ? "当前账号不在 ADMINS 组，无法查看 RSVP 数据。" : "This account is not in the ADMINS group and cannot view RSVP data.",
    challengeUnsupported: isZh
      ? "当前账号需要额外的 Cognito 登录步骤，当前页面暂不支持该挑战类型。"
      : "This account requires an additional Cognito sign-in step that this page does not support.",
    newPasswordTitle: isZh ? "设置新密码" : "Set a New Password",
    newPasswordBody: isZh
      ? "这是你的首次登录。请先设置一个新密码，然后继续进入 RSVP 管理页。"
      : "This is your first sign-in. Set a new password to continue to the RSVP admin page.",
    newPasswordLabel: isZh ? "新密码" : "New password",
    confirmNewPassword: isZh ? "提交新密码" : "Submit New Password",
    confirmingNewPassword: isZh ? "提交中..." : "Submitting...",
    fullName: isZh ? "姓名" : "Full name",
    attendance: isZh ? "是否出席" : "Attendance",
    attendeeInfo: isZh ? "宾客信息" : "Guest details",
    responseInfo: isZh ? "回复内容" : "Response details",
    guestCountHint: isZh ? "缺席时人数会自动设为 0。" : "Guest count becomes 0 when not attending.",
    edit: isZh ? "编辑" : "Edit",
    cancel: isZh ? "取消" : "Cancel",
    save: isZh ? "保存" : "Save",
    saving: isZh ? "保存中..." : "Saving...",
    saved: isZh ? "已保存" : "Saved",
    saveFailed: isZh ? "保存失败。" : "Failed to save changes.",
    requiredName: isZh ? "姓名不能为空。" : "Full name is required.",
  };

  const deleteLabel = isZh ? "删除" : "Delete";
  const deletingLabel = isZh ? "删除中..." : "Deleting...";
  const deleteFailedMessage = isZh ? "删除失败。" : "Failed to delete record.";
  const deleteSuccessMessage = isZh ? "记录已删除。" : "Record deleted.";
  const deleteConfirmMessage = isZh
    ? "确定要删除这条 RSVP 记录吗？此操作无法撤销。"
    : "Delete this RSVP record? This action cannot be undone.";

  const loadRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, errors } = await client.models.RSVP.list({ limit: 1000 }, { authMode: "userPool" });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const sorted = ([...(data ?? [])] as RSVPRecord[]).sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setRecords(sorted);
      setDrafts(
        sorted.reduce<Record<string, RSVPDraft>>((accumulator, record) => {
          accumulator[record.id] = createDraft(record);
          return accumulator;
        }, {}),
      );
      setEditingById({});
      setDeletingById({});
      setSaveErrorById({});
      setSaveSuccessById({});
      setDeleteErrorById({});
      setDeleteSuccessById({});
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : content.error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestPhotos = async () => {
    setLoadingGuestPhotos(true);
    setGuestPhotoError("");

    try {
      const { data, errors } = await client.models.GuestPhoto.list(
        {
          limit: 1000,
          selectionSet: ["id", "storagePath", "originalFileName", "uploaderName", "message", "createdAt"],
        },
        { authMode: "userPool" },
      );

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const resolvedPhotos = await Promise.all(
        (data ?? []).map(async (photo) => {
          let url: string | null = null;

          if (photo.storagePath) {
            try {
              url = (await getUrl({ path: photo.storagePath })).url.toString();
            } catch {
              url = null;
            }
          }

          return {
            id: photo.id,
            url,
            storagePath: photo.storagePath,
            originalFileName: photo.originalFileName,
            uploaderName: photo.uploaderName,
            message: photo.message,
            createdAt: photo.createdAt,
          } satisfies GuestPhotoRecord;
        }),
      );

      resolvedPhotos.sort((left, right) => {
        const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
        return rightTime - leftTime;
      });

      setGuestPhotos(resolvedPhotos);
      setSelectedGuestPhotoIds((current) => current.filter((id) => resolvedPhotos.some((photo) => photo.id === id)));
    } catch (err) {
      setGuestPhotoError(err instanceof Error && err.message ? err.message : content.uploadedPhotosFailed);
    } finally {
      setLoadingGuestPhotos(false);
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

    void Promise.all([loadRecords(), loadGuestPhotos()]);
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
    setDrafts({});
    setEditingById({});
    setDeletingById({});
    setError("");
    setAuthError("");
    setAuthStep("signIn");
    setPassword("");
    setNewPassword("");
    setSaveErrorById({});
    setSaveSuccessById({});
    setDeleteErrorById({});
    setDeleteSuccessById({});
    setGuestPhotos([]);
    setSelectedGuestPhotoIds([]);
    setGuestPhotoError("");
    setDeleteGuestPhotoError("");
    setDeleteGuestPhotoSuccess("");
  };

  const handleRefresh = async () => {
    await Promise.all([loadRecords(), loadGuestPhotos()]);
  };

  const updateDraft = (recordId: string, updater: (current: RSVPDraft) => RSVPDraft) => {
    setDrafts((current) => {
      const draft = current[recordId];
      if (!draft) {
        return current;
      }

      return {
        ...current,
        [recordId]: updater(draft),
      };
    });

    setSaveErrorById((current) => ({ ...current, [recordId]: "" }));
    setSaveSuccessById((current) => ({ ...current, [recordId]: "" }));
    setDeleteErrorById((current) => ({ ...current, [recordId]: "" }));
    setDeleteSuccessById((current) => ({ ...current, [recordId]: "" }));
  };

  const openEditor = (record: RSVPRecord) => {
    setDrafts((current) => ({
      ...current,
      [record.id]: createDraft(record),
    }));
    setEditingById((current) => ({
      ...current,
      [record.id]: true,
    }));
    setSaveErrorById((current) => ({ ...current, [record.id]: "" }));
    setSaveSuccessById((current) => ({ ...current, [record.id]: "" }));
    setDeleteErrorById((current) => ({ ...current, [record.id]: "" }));
    setDeleteSuccessById((current) => ({ ...current, [record.id]: "" }));
  };

  const handleCancel = (record: RSVPRecord) => {
    setDrafts((current) => ({
      ...current,
      [record.id]: createDraft(record),
    }));
    setEditingById((current) => ({ ...current, [record.id]: false }));
    setSaveErrorById((current) => ({ ...current, [record.id]: "" }));
    setSaveSuccessById((current) => ({ ...current, [record.id]: "" }));
    setDeleteErrorById((current) => ({ ...current, [record.id]: "" }));
    setDeleteSuccessById((current) => ({ ...current, [record.id]: "" }));
  };

  const handleSave = async (record: RSVPRecord) => {
    const currentDraft = drafts[record.id];
    if (!currentDraft) {
      return;
    }

    const normalizedDraft = normalizeDraft(currentDraft);
    const baselineDraft = createDraft(record);

    if (!normalizedDraft.fullName) {
      setSaveErrorById((current) => ({
        ...current,
        [record.id]: content.requiredName,
      }));
      return;
    }

    const updateInput: {
      id: string;
      fullName?: string;
      email?: string | null;
      phone?: string | null;
      guestCount?: number;
      attending?: boolean;
      arrivalInfo?: string | null;
      songRequest?: string | null;
      message?: string | null;
      language?: string | null;
    } = { id: record.id };

    if (normalizedDraft.fullName !== baselineDraft.fullName) updateInput.fullName = normalizedDraft.fullName;
    if (normalizedDraft.email !== baselineDraft.email) updateInput.email = normalizedDraft.email || null;
    if (normalizedDraft.phone !== baselineDraft.phone) updateInput.phone = normalizedDraft.phone || null;
    if (normalizedDraft.guestCount !== baselineDraft.guestCount) updateInput.guestCount = normalizedDraft.guestCount;
    if (normalizedDraft.attending !== baselineDraft.attending) updateInput.attending = normalizedDraft.attending;
    if (normalizedDraft.arrivalInfo !== baselineDraft.arrivalInfo) updateInput.arrivalInfo = normalizedDraft.arrivalInfo || null;
    if (normalizedDraft.songRequest !== baselineDraft.songRequest) updateInput.songRequest = normalizedDraft.songRequest || null;
    if (normalizedDraft.message !== baselineDraft.message) updateInput.message = normalizedDraft.message || null;
    if (normalizedDraft.language !== baselineDraft.language) updateInput.language = normalizedDraft.language || null;

    setSavingById((current) => ({ ...current, [record.id]: true }));
    setSaveErrorById((current) => ({ ...current, [record.id]: "" }));
    setSaveSuccessById((current) => ({ ...current, [record.id]: "" }));

    try {
      const { errors } = await client.models.RSVP.update(updateInput, {
        authMode: "userPool",
        selectionSet: ["id", "fullName", "guestCount", "attending", "language", "createdAt"],
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const updatedRecord: RSVPRecord = {
        ...record,
        ...normalizedDraft,
      };

      setRecords((current) => current.map((item) => (item.id === record.id ? updatedRecord : item)));
      setDrafts((current) => ({
        ...current,
        [record.id]: createDraft(updatedRecord),
      }));
      setEditingById((current) => ({ ...current, [record.id]: false }));
      setSaveSuccessById((current) => ({
        ...current,
        [record.id]: content.saved,
      }));
      setDeleteErrorById((current) => ({ ...current, [record.id]: "" }));
      setDeleteSuccessById((current) => ({ ...current, [record.id]: "" }));
    } catch (err) {
      setSaveErrorById((current) => ({
        ...current,
        [record.id]: err instanceof Error && err.message ? err.message : content.saveFailed,
      }));
    } finally {
      setSavingById((current) => ({ ...current, [record.id]: false }));
    }
  };

  const handleDeleteRecord = async (record: RSVPRecord) => {
    if (deletingById[record.id]) {
      return;
    }

    if (!window.confirm(deleteConfirmMessage)) {
      return;
    }

    setDeletingById((current) => ({ ...current, [record.id]: true }));
    setSaveErrorById((current) => ({ ...current, [record.id]: "" }));
    setSaveSuccessById((current) => ({ ...current, [record.id]: "" }));
    setDeleteErrorById((current) => ({ ...current, [record.id]: "" }));
    setDeleteSuccessById((current) => ({ ...current, [record.id]: "" }));

    try {
      const { errors } = await client.models.RSVP.delete({ id: record.id }, { authMode: "userPool" });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      setRecords((current) => current.filter((item) => item.id !== record.id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setEditingById((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setSavingById((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setDeleteErrorById((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setDeleteSuccessById((current) => ({
        ...current,
        [record.id]: deleteSuccessMessage,
      }));
    } catch (err) {
      setDeleteErrorById((current) => ({
        ...current,
        [record.id]: err instanceof Error && err.message ? err.message : deleteFailedMessage,
      }));
    } finally {
      setDeletingById((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
    }
  };

  const toggleGuestPhotoSelection = (photoId: string) => {
    setSelectedGuestPhotoIds((current) =>
      current.includes(photoId) ? current.filter((id) => id !== photoId) : [...current, photoId],
    );
    setDeleteGuestPhotoError("");
    setDeleteGuestPhotoSuccess("");
  };

  const handleDeleteSelectedGuestPhotos = async () => {
    if (!selectedGuestPhotoIds.length) {
      setDeleteGuestPhotoError(content.noPhotosSelected);
      setDeleteGuestPhotoSuccess("");
      return;
    }

    const photosToDelete = guestPhotos.filter((photo) => selectedGuestPhotoIds.includes(photo.id));
    if (!photosToDelete.length) {
      setDeleteGuestPhotoError(content.noPhotosSelected);
      setDeleteGuestPhotoSuccess("");
      return;
    }

    setDeletingGuestPhotos(true);
    setDeleteGuestPhotoError("");
    setDeleteGuestPhotoSuccess("");

    try {
      await Promise.all(
        photosToDelete.map(async (photo) => {
          if (photo.storagePath) {
            await remove({ path: photo.storagePath });
          }

          const { errors } = await client.models.GuestPhoto.delete({ id: photo.id }, { authMode: "userPool" });

          if (errors?.length) {
            throw new Error(errors[0].message);
          }
        }),
      );

      setGuestPhotos((current) => current.filter((photo) => !selectedGuestPhotoIds.includes(photo.id)));
      setSelectedGuestPhotoIds([]);
      setDeleteGuestPhotoSuccess(content.deletePhotosSuccess);
    } catch (err) {
      setDeleteGuestPhotoError(err instanceof Error && err.message ? err.message : content.deletePhotosFailed);
    } finally {
      setDeletingGuestPhotos(false);
    }
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
              onClick={() => void handleRefresh()}
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

        <div className="bg-white border border-[#eadccd] p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 text-[#4a4238]">
                <ImageIcon className="w-5 h-5 text-[#b8997a]" />
                <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
                  {content.uploadedPhotos}
                </h2>
              </div>
              <p className="text-[#6b6256] mt-2">{content.uploadedPhotosHint}</p>
            </div>
            <button
              type="button"
              disabled={deletingGuestPhotos || loadingGuestPhotos}
              onClick={() => void handleDeleteSelectedGuestPhotos()}
              className="inline-flex items-center gap-2 self-start px-4 py-2 bg-[#b85c5c] text-white hover:bg-[#9f4d4d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {deletingGuestPhotos ? content.deletingPhotos : content.deleteSelectedPhotos}
            </button>
          </div>

          {loadingGuestPhotos ? <p className="text-[#6b6256]">{content.uploadedPhotosLoading}</p> : null}
          {!loadingGuestPhotos && guestPhotoError ? <p className="text-[#b85c5c]">{guestPhotoError}</p> : null}
          {!loadingGuestPhotos && !guestPhotoError && guestPhotos.length === 0 ? (
            <p className="text-[#6b6256]">{content.uploadedPhotosEmpty}</p>
          ) : null}
          {deleteGuestPhotoError ? <p className="mt-4 text-sm text-[#b85c5c]">{deleteGuestPhotoError}</p> : null}
          {!deleteGuestPhotoError && deleteGuestPhotoSuccess ? (
            <p className="mt-4 text-sm text-[#61805a]">{deleteGuestPhotoSuccess}</p>
          ) : null}

          {!loadingGuestPhotos && !guestPhotoError && guestPhotos.length ? (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {guestPhotos.map((photo) => {
                const isSelected = selectedGuestPhotoIds.includes(photo.id);

                return (
                  <label
                    key={photo.id}
                    className={`block cursor-pointer overflow-hidden border transition-colors ${
                      isSelected ? "border-[#b85c5c] bg-[#fdf4f4]" : "border-[#eadccd] bg-[#fdfbf8]"
                    }`}
                  >
                    <div className="relative">
                      {photo.url ? (
                        <ImageWithFallback
                          src={photo.url}
                          alt={photo.message || content.message}
                          className="h-40 w-full object-cover sm:h-48"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-[#f8f2ea] p-4 text-center text-sm text-[#6b6256] sm:h-48">
                          {photo.message || content.noValue}
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs text-[#4a4238]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGuestPhotoSelection(photo.id)}
                          className="mr-2 align-middle"
                          aria-label={`${content.selectPhoto}: ${photo.message || photo.uploaderName || photo.id}`}
                        />
                        {content.selectPhoto}
                      </div>
                    </div>
                    <div className="p-3 text-sm text-[#6b6256]">
                      <p>
                        {content.uploadedBy}: {photo.uploaderName || content.noValue}
                      </p>
                      <p className="mt-1 break-words">
                        {content.message}: {photo.message || content.noValue}
                      </p>
                      <p className="mt-1 text-xs text-[#8a7e70]">
                        {content.submittedAt}: {photo.createdAt ? new Date(photo.createdAt).toLocaleString() : content.noValue}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>

        {loading ? <p className="text-[#6b6256]">{content.loading}</p> : null}
        {error ? <p className="text-[#b85c5c]">{error}</p> : null}
        {!loading && !error && records.length === 0 ? <p className="text-[#6b6256]">{content.empty}</p> : null}

        <div className="grid gap-6">
          {records.map((record, index) => {
            const draft = drafts[record.id] ?? createDraft(record);
            const isEditing = editingById[record.id] ?? false;
            const isSaving = savingById[record.id] ?? false;
            const isDeleting = deletingById[record.id] ?? false;
            const saveError = saveErrorById[record.id];
            const saveSuccess = saveSuccessById[record.id];
            const deleteError = deleteErrorById[record.id];
            const deleteSuccess = deleteSuccessById[record.id];
            const isDirty = !draftsEqual(draft, createDraft(record));

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="bg-white border border-[#eadccd] p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
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

                {isEditing ? (
                  <div className="grid gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-3">{content.attendeeInfo}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-[#6b6256]">
                        <div>
                          <label htmlFor={`fullName-${record.id}`} className="block mb-2 text-[#4a4238]">{content.fullName}</label>
                          <input
                            id={`fullName-${record.id}`}
                            type="text"
                            value={draft.fullName}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, fullName: event.target.value }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor={`language-${record.id}`} className="block mb-2 text-[#4a4238]">{content.language}</label>
                          <input
                            id={`language-${record.id}`}
                            type="text"
                            value={draft.language}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, language: event.target.value }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor={`email-${record.id}`} className="block mb-2 text-[#4a4238]">{content.emailLabel}</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8997a]" />
                            <input
                              id={`email-${record.id}`}
                              type="email"
                              value={draft.email}
                              onChange={(event) => updateDraft(record.id, (current) => ({ ...current, email: event.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`phone-${record.id}`} className="block mb-2 text-[#4a4238]">{content.phone}</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8997a]" />
                            <input
                              id={`phone-${record.id}`}
                              type="text"
                              value={draft.phone}
                              onChange={(event) => updateDraft(record.id, (current) => ({ ...current, phone: event.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-3">{content.responseInfo}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-[#6b6256]">
                        <div>
                          <label htmlFor={`attending-${record.id}`} className="block mb-2 text-[#4a4238]">{content.attendance}</label>
                          <select
                            id={`attending-${record.id}`}
                            value={draft.attending ? "yes" : "no"}
                            onChange={(event) => updateDraft(record.id, (current) => {
                              const attending = event.target.value === "yes";
                              return { ...current, attending, guestCount: attending ? Math.max(1, current.guestCount || 1) : 0 };
                            })}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                          >
                            <option value="yes">{content.yes}</option>
                            <option value="no">{content.no}</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`guestCount-${record.id}`} className="block mb-2 text-[#4a4238]">{content.guests}</label>
                          <input
                            id={`guestCount-${record.id}`}
                            type="number"
                            min={draft.attending ? 1 : 0}
                            value={draft.guestCount}
                            disabled={!draft.attending}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, guestCount: Number(event.target.value) }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors disabled:opacity-60"
                          />
                          <p className="text-xs text-[#8a7e70] mt-2">{content.guestCountHint}</p>
                        </div>
                        <div>
                          <label htmlFor={`arrivalInfo-${record.id}`} className="block mb-2 text-[#4a4238]">{content.arrivalInfo}</label>
                          <textarea
                            id={`arrivalInfo-${record.id}`}
                            rows={3}
                            value={draft.arrivalInfo}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, arrivalInfo: event.target.value }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors resize-y"
                          />
                        </div>
                        <div>
                          <label htmlFor={`songRequest-${record.id}`} className="block mb-2 text-[#4a4238]">{content.songRequest}</label>
                          <textarea
                            id={`songRequest-${record.id}`}
                            rows={3}
                            value={draft.songRequest}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, songRequest: event.target.value }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors resize-y"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor={`message-${record.id}`} className="block mb-2 text-[#4a4238]">{content.message}</label>
                          <textarea
                            id={`message-${record.id}`}
                            rows={4}
                            value={draft.message}
                            onChange={(event) => updateDraft(record.id, (current) => ({ ...current, message: event.target.value }))}
                            className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors resize-y"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#f0e5d9] pt-4">
                      <div className="min-h-6">
                        {saveError ? <p className="text-sm text-[#b85c5c]">{saveError}</p> : null}
                        {!saveError && saveSuccess ? <p className="text-sm text-[#61805a]">{saveSuccess}</p> : null}
                        {!saveError && !saveSuccess && deleteError ? <p className="text-sm text-[#b85c5c]">{deleteError}</p> : null}
                        {!saveError && !saveSuccess && !deleteError && deleteSuccess ? <p className="text-sm text-[#61805a]">{deleteSuccess}</p> : null}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          disabled={isSaving || isDeleting}
                          onClick={() => void handleDeleteRecord(record)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#b85c5c] text-[#b85c5c] hover:bg-[#b85c5c] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isDeleting ? deletingLabel : deleteLabel}
                        </button>
                        <button
                          type="button"
                          disabled={isSaving || isDeleting}
                          onClick={() => handleCancel(record)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#d8c9b8] text-[#6b6256] hover:bg-[#eee5dc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <X className="w-4 h-4" />
                          {content.cancel}
                        </button>
                        <button
                          type="button"
                          disabled={!isDirty || isSaving || isDeleting}
                          onClick={() => void handleSave(record)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8997a] text-white hover:bg-[#a07d5f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? content.saving : content.save}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-3">{content.attendeeInfo}</p>
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
                          <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-1">{content.language}</p>
                          <p>{record.language || content.noValue}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.15em] text-[#8a7e70] mb-3">{content.responseInfo}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-[#6b6256]">
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
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#f0e5d9] pt-4">
                      <div className="min-h-6">
                        {saveError ? <p className="text-sm text-[#b85c5c]">{saveError}</p> : null}
                        {!saveError && saveSuccess ? <p className="text-sm text-[#61805a]">{saveSuccess}</p> : null}
                        {!saveError && !saveSuccess && deleteError ? <p className="text-sm text-[#b85c5c]">{deleteError}</p> : null}
                        {!saveError && !saveSuccess && !deleteError && deleteSuccess ? <p className="text-sm text-[#61805a]">{deleteSuccess}</p> : null}
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => void handleDeleteRecord(record)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#b85c5c] text-[#b85c5c] hover:bg-[#b85c5c] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isDeleting ? deletingLabel : deleteLabel}
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => openEditor(record)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#b8997a] text-[#b8997a] hover:bg-[#b8997a] hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          {content.edit}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
