import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, ImageUp, LoaderCircle, MessageSquareQuote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import { amplifyConfigured, publicClient } from "../../lib/amplify";
import outputs from "../../../amplify_outputs.json";
import img5178 from "../../assets/gallery/IMG_5178.JPEG";
import img9589 from "../../assets/gallery/IMG_9589.JPEG";
import img9089 from "../../assets/gallery/IMG_9089.JPEG";
import img7189 from "../../assets/gallery/IMG_7189.JPEG";
import gliu3296 from "../../assets/gallery/GLIU3296.JPEG";
import img4087 from "../../assets/gallery/IMG_4087.JPEG";
import dscf8031 from "../../assets/gallery/DSCF8031.JPEG";
import img96a930 from "../../assets/gallery/96a930344a805c0cbd56695c91edfee6.JPEG";
import dsf6050 from "../../assets/gallery/_DSF6050.JPEG";
import img0004 from "../../assets/gallery/IMG_0004.JPEG";
import img7197 from "../../assets/gallery/IMG_7197.JPEG";
import gliu3382 from "../../assets/gallery/GLIU3382.JPEG";

type GuestPhotoCard = {
  id: string;
  url?: string | null;
  uploaderName?: string | null;
  message?: string | null;
  originalFileName?: string | null;
  createdAt?: string | null;
};

function buildPublicGuestPhotoUrl(storagePath?: string | null) {
  if (!storagePath) {
    return null;
  }

  const bucketName = outputs.storage?.bucket_name;
  const region = outputs.storage?.aws_region;
  if (!bucketName || !region) {
    return null;
  }

  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedPath}`;
}

function getGuestPhotoUploadUrl() {
  const custom = (outputs as { custom?: { guestPhotoUploadUrl?: string } }).custom;
  return custom?.guestPhotoUploadUrl ?? "";
}

export function Gallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoCard[]>([]);
  const [loadingGuestPhotos, setLoadingGuestPhotos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const photos = [
    { url: img5178, alt: isZh ? "山顶风景合照" : "Mountain overlook photo" },
    { url: img9589, alt: isZh ? "大峡谷自拍" : "Grand canyon selfie" },
    { url: img9089, alt: isZh ? "海边日落合影" : "Sunset pier selfie" },
    { url: img7189, alt: isZh ? "节日街头合照" : "Festival street photo" },
    { url: gliu3296, alt: isZh ? "婚礼出门照" : "Wedding doorway portrait" },
    { url: img4087, alt: isZh ? "富士山日出" : "Mount Fuji at sunrise" },
    { url: dscf8031, alt: isZh ? "云雾山景" : "Cloudy mountain landscape" },
    { url: img96a930, alt: isZh ? "海边依靠" : "Couple by the sea" },
    { url: dsf6050, alt: isZh ? "背影看海" : "Ocean view from behind" },
    { url: img0004, alt: isZh ? "小猫玉米" : "Cat portrait" },
    { url: img7197, alt: isZh ? "马里奥约会日" : "Mario themed date photo" },
    { url: gliu3382, alt: isZh ? "婚礼回望照" : "Wedding look-back portrait" },
  ];

  const content = {
    title: isZh ? "婚礼相册" : "Our Gallery",
    subtitle: isZh ? "珍藏的每一刻" : "Moments we cherish",
    quote: isZh ? "“爱，是一个灵魂栖息在两个身体里。”" : '"Love is composed of a single soul inhabiting two bodies."',
    shareTitle: isZh ? "上传照片或留言" : "Share a Photo or Message",
    shareSub: isZh
      ? "有照片就上传照片，也可以只留一句祝福。两者任意一个有内容就可以提交。"
      : "Upload a photo, leave a note, or do both. Either one is enough to submit.",
    uploaderName: isZh ? "你的名字" : "Your name",
    uploaderNamePlaceholder: isZh ? "可选" : "Optional",
    message: isZh ? "留言" : "Message",
    messagePlaceholder: isZh ? "可选，给新人留一句祝福..." : "Optional, leave a note for the couple...",
    choosePhotos: isZh ? "选择照片" : "Choose photos",
    uploadPhotos: isZh ? "提交" : "Submit",
    uploading: isZh ? "提交中..." : "Submitting...",
    uploadHint: isZh
      ? "支持一次上传多张照片；如果不上传照片，也可以只提交留言。"
      : "You can upload multiple photos at once, or submit just a message without a photo.",
    uploadMissingConfig: isZh
      ? "图片上传功能还没有连接到 Amplify 后端。请先启动 sandbox 或部署后端。"
      : "Photo upload is not connected to the Amplify backend yet. Start sandbox or deploy the backend first.",
    uploadMissingContent: isZh ? "请至少上传一张照片或填写一条留言。" : "Add at least one photo or a message first.",
    uploadSuccess: isZh ? "内容提交成功。" : "Your upload was submitted successfully.",
    uploadFailed: isZh ? "提交失败，请稍后重试。" : "Submission failed. Please try again.",
    uploadedPhotosTitle: isZh ? "宾客分享" : "Guest Shares",
    uploadedPhotosSub: isZh ? "宾客上传的照片和留言会出现在这里。" : "Photos and notes uploaded by guests will appear here.",
    uploadedEmpty: isZh ? "还没有宾客分享，等你来第一条。" : "No guest shares yet. Be the first to post.",
    uploadedBy: isZh ? "上传者" : "Uploaded by",
    noValue: isZh ? "未填写" : "Not provided",
    loadingUploads: isZh ? "正在加载宾客内容..." : "Loading guest uploads...",
    comingSoonTitle: isZh ? "更多照片即将上线" : "More Photos Coming Soon",
    comingSoonSub: isZh ? "婚礼当天的专业摄影作品也会在婚礼后补充到这里。" : "Professional wedding photos will also be added here after the big day.",
  };

  useEffect(() => {
    if (!amplifyConfigured) {
      return;
    }

    const loadGuestPhotos = async () => {
      setLoadingGuestPhotos(true);

      try {
        const { data, errors } = await publicClient.models.GuestPhoto.list(
          {
            limit: 100,
            selectionSet: ["id", "storagePath", "originalFileName", "uploaderName", "message", "createdAt"],
          },
        );

        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        const resolvedPhotos = await Promise.all(
          (data ?? []).map(async (photo) => {
            return {
              id: photo.id,
              url: buildPublicGuestPhotoUrl(photo.storagePath),
              uploaderName: photo.uploaderName,
              message: photo.message,
              originalFileName: photo.originalFileName,
              createdAt: photo.createdAt,
            } satisfies GuestPhotoCard;
          }),
        );

        resolvedPhotos.sort((left, right) => {
          const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
          const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
          return rightTime - leftTime;
        });

        setGuestPhotos(resolvedPhotos);
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : content.uploadFailed;
        setUploadError(message);
      } finally {
        setLoadingGuestPhotos(false);
      }
    };

    void loadGuestPhotos();
  }, [content.uploadFailed]);

  const handleUpload = async () => {
    setUploadError("");
    setUploadSuccess("");

    if (!amplifyConfigured) {
      setUploadError(content.uploadMissingConfig);
      return;
    }

    const trimmedMessage = guestMessage.trim();
    const files = selectedFiles ? Array.from(selectedFiles) : [];

    if (!files.length && !trimmedMessage) {
      setUploadError(content.uploadMissingContent);
      return;
    }

    setUploading(true);

    try {
      const uploadEndpoint = getGuestPhotoUploadUrl();
      if (files.length && !uploadEndpoint) {
        throw new Error(content.uploadMissingConfig);
      }

      const uploadedCards = await Promise.all(
        (files.length ? files : [null]).map(async (file) => {
          let storagePath: string | undefined;

          if (file) {
            const uploadResponse = await fetch(uploadEndpoint, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                contentType: file.type || undefined,
                originalFileName: file.name,
              }),
            });

            if (!uploadResponse.ok) {
              const detail = await uploadResponse.text();
              throw new Error(`Upload URL request failed (${uploadResponse.status})${detail ? `: ${detail}` : ""}`);
            }

            const uploadPayload = (await uploadResponse.json()) as {
              storagePath?: string;
              uploadUrl?: string;
            };

            if (!uploadPayload.storagePath || !uploadPayload.uploadUrl) {
              throw new Error(content.uploadFailed);
            }

            storagePath = uploadPayload.storagePath;

            const putResponse = await fetch(uploadPayload.uploadUrl, {
              method: "PUT",
              headers: {
                "content-type": file.type || "application/octet-stream",
              },
              body: file,
            });

            if (!putResponse.ok) {
              const detail = await putResponse.text();
              throw new Error(`Photo upload failed (${putResponse.status})${detail ? `: ${detail}` : ""}`);
            }
          }

          const { data, errors } = await publicClient.models.GuestPhoto.create(
            {
              storagePath,
              originalFileName: file?.name,
              uploaderName: uploaderName.trim() || undefined,
              message: trimmedMessage || undefined,
            },
            {
              selectionSet: ["id", "storagePath", "originalFileName", "uploaderName", "message", "createdAt"],
            },
          );

          if (errors?.length || !data) {
            throw new Error(errors?.[0]?.message || content.uploadFailed);
          }

          return {
            id: data.id,
            url: buildPublicGuestPhotoUrl(storagePath),
            uploaderName: data.uploaderName,
            message: data.message,
            originalFileName: data.originalFileName,
            createdAt: data.createdAt,
          } satisfies GuestPhotoCard;
        }),
      );

      setGuestPhotos((current) =>
        [...uploadedCards, ...current].sort((left, right) => {
          const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
          const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
          return rightTime - leftTime;
        }),
      );
      setSelectedFiles(null);
      setUploaderName("");
      setGuestMessage("");
      setUploadSuccess(content.uploadSuccess);
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : content.uploadFailed;
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 bg-[#fdfbf8]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <Heart className="w-12 h-12 mx-auto mb-6 text-[#b8997a]" />
          <h1 className="text-5xl md:text-7xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
            {content.title}
          </h1>
          <p className="text-xl text-[#6b6256] tracking-wider">{content.subtitle}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="columns-2 gap-3 sm:columns-2 md:columns-3 md:gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.url}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative mb-3 break-inside-avoid overflow-hidden md:mb-4"
              >
                <ImageWithFallback
                  src={photo.url}
                  alt={photo.alt}
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#fdfbf8]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl md:text-3xl text-[#4a4238] leading-relaxed mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              {content.quote}
            </p>
            <p className="text-sm text-[#8a7e70] italic">- Aristotle</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.shareTitle}
            </h2>
            <p className="text-[#6b6256] mb-4">{content.shareSub}</p>
            <p className="text-sm text-[#8a7e70]">{content.uploadHint}</p>
          </motion.div>

          <div className="bg-[#fdfbf8] border border-[#eadccd] p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-4">
                <div>
                  <label htmlFor="guest-uploader-name" className="block mb-2 text-[#4a4238]">
                    {content.uploaderName}
                  </label>
                  <input
                    id="guest-uploader-name"
                    type="text"
                    value={uploaderName}
                    onChange={(event) => setUploaderName(event.target.value)}
                    placeholder={content.uploaderNamePlaceholder}
                    className="w-full px-4 py-3 border border-[#e8d5c4] bg-white focus:outline-none focus:border-[#b8997a] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="guest-photo-upload" className="block mb-2 text-[#4a4238]">
                    {content.choosePhotos}
                  </label>
                  <input
                    id="guest-photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setSelectedFiles(event.target.files)}
                    className="block w-full text-[#6b6256] file:mr-4 file:border-0 file:bg-[#b8997a] file:px-4 file:py-3 file:text-white hover:file:bg-[#a07d5f]"
                  />
                </div>
                <div>
                  <label htmlFor="guest-photo-message" className="block mb-2 text-[#4a4238]">
                    {content.message}
                  </label>
                  <textarea
                    id="guest-photo-message"
                    rows={3}
                    value={guestMessage}
                    onChange={(event) => setGuestMessage(event.target.value)}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-4 py-3 border border-[#e8d5c4] bg-white focus:outline-none focus:border-[#b8997a] transition-colors resize-y"
                  />
                </div>
              </div>
              <br />
              <button
                type="button"
                onClick={() => void handleUpload()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#b8997a] text-white hover:bg-[#a07d5f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wider uppercase text-sm"
              >
                {uploading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ImageUp className="w-4 h-4" />}
                {uploading ? content.uploading : content.uploadPhotos}
              </button>
            </div>

            {uploadError ? <p className="mt-4 text-sm text-[#b85c5c]">{uploadError}</p> : null}
            {!uploadError && uploadSuccess ? <p className="mt-4 text-sm text-[#61805a]">{uploadSuccess}</p> : null}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl mb-3 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.uploadedPhotosTitle}
            </h3>
            <p className="text-[#6b6256] mb-6">{content.uploadedPhotosSub}</p>

            {loadingGuestPhotos ? <p className="text-[#6b6256]">{content.loadingUploads}</p> : null}
            {!loadingGuestPhotos && guestPhotos.length === 0 ? <p className="text-[#6b6256]">{content.uploadedEmpty}</p> : null}

            {guestPhotos.length ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                {guestPhotos.map((photo, index) => {
                  const hasPhoto = Boolean(photo.url);

                  return (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      className="overflow-hidden border border-[#eadccd] bg-white"
                    >
                      {hasPhoto ? (
                        <ImageWithFallback
                          src={photo.url ?? ""}
                          alt={photo.message || content.uploadedPhotosTitle}
                          className="h-40 w-full object-cover sm:h-56 md:h-72"
                        />
                      ) : (
                        <div className="flex min-h-40 flex-col justify-center gap-4 bg-[#f8f2ea] p-6 text-[#4a4238] sm:min-h-56 md:min-h-72">
                          <MessageSquareQuote className="h-8 w-8 text-[#b8997a]" />
                          {photo.message ? <p className="text-lg leading-relaxed break-words">{photo.message}</p> : null}
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-sm text-[#8a7e70]">
                          {content.uploadedBy}: {photo.uploaderName || content.noValue}
                        </p>
                        {photo.message ? (
                          <p className="mt-2 text-sm text-[#6b6256] break-words">
                            {content.message}: {photo.message}
                          </p>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#fdfbf8]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto mb-4 text-[#b8997a]" />
            <h3 className="text-2xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.comingSoonTitle}
            </h3>
            <p className="text-[#6b6256]">{content.comingSoonSub}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
