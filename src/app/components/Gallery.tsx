import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, ImageUp, LoaderCircle } from "lucide-react";
import { getUrl, uploadData } from "aws-amplify/storage";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import { amplifyConfigured, client } from "../../lib/amplify";
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
  url: string;
  uploaderName?: string | null;
  originalFileName: string;
  createdAt?: string | null;
};

export function Gallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoCard[]>([]);
  const [loadingGuestPhotos, setLoadingGuestPhotos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const photos = [
    { url: img5178, alt: isZh ? "山顶风景合照" : "Mountain overlook photo", span: "md:col-span-2 md:row-span-2" },
    { url: img9589, alt: isZh ? "大场景自拍" : "Grand canyon selfie", span: "" },
    { url: img9089, alt: isZh ? "海边日落合影" : "Sunset pier selfie", span: "" },
    { url: img7189, alt: isZh ? "节日街头合照" : "Festival street photo", span: "md:col-span-2" },
    { url: gliu3296, alt: isZh ? "婚礼出门照" : "Wedding doorway portrait", span: "" },
    { url: img4087, alt: isZh ? "富士山日出" : "Mount Fuji at sunrise", span: "" },
    { url: dscf8031, alt: isZh ? "云雾山景" : "Cloudy mountain landscape", span: "" },
    { url: img96a930, alt: isZh ? "海边依靠" : "Couple by the sea", span: "md:row-span-2" },
    { url: dsf6050, alt: isZh ? "背影看海" : "Ocean view from behind", span: "" },
    { url: img0004, alt: isZh ? "小猫玉米" : "Cat portrait", span: "" },
    { url: img7197, alt: isZh ? "马里奥约会日" : "Mario themed date photo", span: "" },
    { url: gliu3382, alt: isZh ? "婚礼回望照" : "Wedding look-back portrait", span: "" },
  ];

  const content = {
    title: isZh ? "婚礼相册" : "Our Gallery",
    subtitle: isZh ? "珍藏的每一刻" : "Moments we cherish",
    quote: isZh ? "“爱，是一个灵魂栖息在两个身体里。”" : '"Love is composed of a single soul inhabiting two bodies."',
    shareTitle: isZh ? "上传你的照片" : "Upload Your Photos",
    shareSub: isZh ? "欢迎把你拍到的婚礼瞬间上传到这里，我们也想从你的视角看看这一天。" : "Upload the moments you captured so we can see the wedding through your eyes too.",
    uploaderName: isZh ? "你的名字" : "Your name",
    uploaderNamePlaceholder: isZh ? "可选" : "Optional",
    choosePhotos: isZh ? "选择照片" : "Choose photos",
    uploadPhotos: isZh ? "上传照片" : "Upload Photos",
    uploading: isZh ? "上传中..." : "Uploading...",
    uploadHint: isZh ? "支持一次上传多张照片，图片会保存到 S3 并显示在下方。" : "You can upload multiple photos at once. They will be stored in S3 and shown below.",
    uploadMissingConfig: isZh ? "图片上传功能还没有连接到 Amplify 后端。请先启动 sandbox 或部署后端。" : "Photo upload is not connected to the Amplify backend yet. Start sandbox or deploy the backend first.",
    uploadMissingFiles: isZh ? "请先选择至少一张照片。" : "Choose at least one photo first.",
    uploadSuccess: isZh ? "照片上传成功。" : "Photos uploaded successfully.",
    uploadFailed: isZh ? "照片上传失败，请稍后重试。" : "Photo upload failed. Please try again.",
    uploadedPhotosTitle: isZh ? "宾客上传的照片" : "Guest Uploaded Photos",
    uploadedPhotosSub: isZh ? "你们上传的照片会出现在这里。" : "Photos uploaded by guests will appear here.",
    uploadedEmpty: isZh ? "还没有宾客上传照片，等你来第一张。" : "No guest photos yet. Be the first to upload one.",
    uploadedBy: isZh ? "上传者" : "Uploaded by",
    noValue: isZh ? "未填写" : "Not provided",
    loadingUploads: isZh ? "正在加载宾客照片..." : "Loading guest photos...",
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
        const { data, errors } = await client.models.GuestPhoto.list(
          {
            limit: 100,
            selectionSet: ["id", "storagePath", "originalFileName", "uploaderName", "createdAt"],
          },
          { authMode: "apiKey" },
        );

        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        const resolvedPhotos = await Promise.all(
          (data ?? []).map(async (photo) => {
            const { url } = await getUrl({
              path: photo.storagePath,
            });

            return {
              id: photo.id,
              url: url.toString(),
              uploaderName: photo.uploaderName,
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

    if (!selectedFiles?.length) {
      setUploadError(content.uploadMissingFiles);
      return;
    }

    setUploading(true);

    try {
      const uploadedCards = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          const storagePath = `guest-photos/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

          await uploadData({
            path: storagePath,
            data: file,
            options: {
              contentType: file.type || undefined,
            },
          }).result;

          const { data, errors } = await client.models.GuestPhoto.create(
            {
              storagePath,
              originalFileName: file.name,
              uploaderName: uploaderName.trim() || undefined,
            },
            {
              authMode: "apiKey",
              selectionSet: ["id", "storagePath", "originalFileName", "uploaderName", "createdAt"],
            },
          );

          if (errors?.length || !data) {
            throw new Error(errors?.[0]?.message || content.uploadFailed);
          }

          const { url } = await getUrl({ path: storagePath });

          return {
            id: data.id,
            url: url.toString(),
            uploaderName: data.uploaderName,
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
          <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.url}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden group ${photo.span}`}
              >
                <ImageWithFallback
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
              </div>
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="overflow-hidden border border-[#eadccd] bg-white"
                  >
                    <ImageWithFallback src={photo.url} alt={photo.originalFileName} className="h-72 w-full object-cover" />
                    <div className="p-4">
                      <p className="text-[#4a4238] break-words">{photo.originalFileName}</p>
                      <p className="mt-2 text-sm text-[#8a7e70]">
                        {content.uploadedBy}: {photo.uploaderName || content.noValue}
                      </p>
                    </div>
                  </motion.div>
                ))}
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
