import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
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

export function Gallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const photos = [
    {
      url: img5178,
      alt: isZh ? "山顶风景合照" : "Mountain overlook photo",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      url: img9589,
      alt: isZh ? "大峡谷自拍" : "Grand canyon selfie",
      span: "",
    },
    {
      url: img9089,
      alt: isZh ? "海边日落合影" : "Sunset pier selfie",
      span: "",
    },
    {
      url: img7189,
      alt: isZh ? "节日街头合照" : "Festival street photo",
      span: "md:col-span-2",
    },
    {
      url: gliu3296,
      alt: isZh ? "婚礼出门照" : "Wedding doorway portrait",
      span: "",
    },
    {
      url: img4087,
      alt: isZh ? "富士山日出" : "Mount Fuji at sunrise",
      span: "",
    },
    {
      url: dscf8031,
      alt: isZh ? "云雾山景" : "Cloudy mountain landscape",
      span: "",
    },
    {
      url: img96a930,
      alt: isZh ? "海边依靠" : "Couple by the sea",
      span: "md:row-span-2",
    },
    {
      url: dsf6050,
      alt: isZh ? "背影看海" : "Ocean view from behind",
      span: "",
    },
    {
      url: img0004,
      alt: isZh ? "小猫玉米" : "Cat portrait",
      span: "",
    },
    {
      url: img7197,
      alt: isZh ? "马里奥约会日" : "Mario themed date photo",
      span: "",
    },
    {
      url: gliu3382,
      alt: isZh ? "婚礼回望照" : "Wedding look-back portrait",
      span: "",
    },
  ];

  const content = {
    title: isZh ? "婚礼相册" : "Our Gallery",
    subtitle: isZh ? "珍藏的每一刻" : "Moments we cherish",
    quote: isZh ? "“爱，是一个灵魂栖息在两个身体里。”" : '"Love is composed of a single soul inhabiting two bodies."',
    shareTitle: isZh ? "分享你的照片" : "Share Your Photos",
    shareSub: isZh ? "我们也想从你的视角看见这场婚礼，欢迎在 Instagram 分享照片。" : "We'd love to see the wedding through your eyes! Share your photos with us on Instagram.",
    hashtagLabel: isZh ? "使用我们的婚礼话题" : "Use our wedding hashtag",
    comingSoonTitle: isZh ? "更多照片即将上线" : "More Photos Coming Soon",
    comingSoonSub: isZh ? "婚礼当天的专业摄影作品将在婚礼后上传，欢迎之后再来看看。" : "Professional wedding photos will be added after the big day. Check back soon!",
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
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.shareTitle}
            </h2>
            <p className="text-[#6b6256] mb-6">{content.shareSub}</p>
            <div className="inline-block bg-[#fdfbf8] px-8 py-4 border-2 border-[#b8997a]">
              <p className="text-sm text-[#8a7e70] mb-2">{content.hashtagLabel}</p>
              <p className="text-2xl text-[#b8997a]" style={{ fontFamily: "var(--font-serif)" }}>
                #SophieAndJames2026
              </p>
            </div>
          </motion.div>
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
