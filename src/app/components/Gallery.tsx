import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";

export function Gallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const photos = [
    {
      url: "https://images.unsplash.com/photo-1768900044120-650653953a6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGNvdXBsZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDUzMTc4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "Sophie 和 James 的合照" : "Sophie and James portrait",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      url: "https://images.unsplash.com/photo-1757589227072-0dd17af42433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBjZXJlbW9ueSUyMGZsb3dlcnN8ZW58MXx8fHwxNzc0NTgxNTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "婚礼场地" : "Wedding venue",
      span: "",
    },
    {
      url: "https://images.unsplash.com/photo-1567022936601-6f279a36e5e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYm91cXVldCUyMGZsb3dlcnMlMjBpdm9yeXxlbnwxfHx8fDE3NzQ1ODE1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "婚礼花束" : "Wedding bouquet",
      span: "",
    },
    {
      url: "https://images.unsplash.com/photo-1773845596855-ede4d0499206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHdhbGtpbmclMjBzdW5zZXR8ZW58MXx8fHwxNzc0NTgxNTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "浪漫散步" : "Romantic walk",
      span: "md:col-span-2",
    },
    {
      url: "https://images.unsplash.com/photo-1738694242379-ef21044985bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBnb2xkJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzQ1MTk2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "婚戒" : "Wedding rings",
      span: "",
    },
    {
      url: "https://images.unsplash.com/photo-1768777270882-9f74939fee50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc3NDU4MTU3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: isZh ? "宴会布置" : "Reception table",
      span: "",
    },
  ];

  const content = {
    title: isZh ? "婚礼相册" : "Our Gallery",
    subtitle: isZh ? "珍藏的每一刻" : "Moments we cherish",
    quote: isZh ? "“爱，是一个灵魂栖居在两个身体里。”" : '"Love is composed of a single soul inhabiting two bodies."',
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
