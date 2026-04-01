import { motion } from "motion/react";
import { Heart, Calendar, MapPin, ArrowDown } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import heroWeddingImage from "../../assets/hero-wedding.jpeg";

export function Home() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const englishNames = "Chen Yanying & Li Guancheng";
  const content = {
    heroAlt: isZh ? "陈燕莹和李官城" : "Chen Yanying and Li Guancheng",
    title: "陈燕莹和李官城",
    subtitle: isZh ? "我们要结婚啦" : "Are Getting Married",
    date: isZh ? "2026年5月2号" : "May 2, 2026",
    location: isZh ? "中国河南省商丘市柘城县" : "Zhecheng County, Shangqiu, Henan, China",
    rsvp: isZh ? "立即回复" : "RSVP Now",
    joinUs: isZh ? "欢迎见证" : "Join Us",
    intro: isZh
      ? "我们诚挚邀请你来见证这一天。一起在美丽的柘城度过一个充满爱、欢笑与回忆的周末。"
      : "We are thrilled to invite you to celebrate our special day. Join us for an unforgettable weekend of love, laughter, and happily ever after in Zhecheng County, Shangqiu, Henan, China.",
    viewDetails: isZh ? "查看详情" : "View Details",
    story: isZh ? "我们的故事" : "Our Story",
    weekend: isZh ? "婚礼周末" : "Wedding Weekend",
    weekendSub: isZh ? "一场值得铭记的庆典" : "A celebration to remember",
    events: isZh
      ? [
          { title: "接送服务", date: "5月1号", time: "23:59 之前", location: "提前告知或预约到达机场或车站" },
          { title: "仪式与宴席", date: "5月2号，星期六", time: "12:00", location: "华景粤海酒店" },
          { title: "告别时光", date: "5月3日，星期日", time: "10:00之后", location: "酒店" },
        ]
      : [
          { title: "Transportation Service", date: "May 1", time: "Before 11:59 PM", location: "Please let us know in advance or book your airport or station arrival" },
          { title: "Ceremony & Banquet", date: "Saturday, May 2", time: "12:00 PM", location: "Huajing Yuehai Hotel" },
          { title: "Farewell Time", date: "Sunday, May 3", time: "After 10:00 AM", location: "Hotel" },
        ],
  };

  return (
    <div className="relative">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroWeddingImage}
            alt={content.heroAlt}
            className="w-full h-full object-cover object-[42%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 -mt-35 px-4 text-center text-white md:mt-0"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6"
          >
            <Heart className="w-12 h-12 mx-auto text-white/90" />
          </motion.div>

          <h1 className="text-5xl md:text-8xl mb-6 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
            {isZh ? content.title : englishNames}
          </h1>

          {isZh && (
            <p className="mb-6 text-base md:text-xl tracking-[0.22em] uppercase text-white/90">
              {englishNames}
            </p>
          )}

          <div className="h-px w-24 bg-white/60 mx-auto mb-6" />

          <p className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-8 font-light">{content.subtitle}</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{content.date}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/40" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{content.location}</span>
            </div>
          </div>

          <Link
            to="/rsvp"
            className="inline-block bg-white text-[#4a4238] px-10 py-4 rounded-sm hover:bg-[#b8997a] hover:text-white transition-all duration-300 tracking-wider uppercase text-sm"
          >
            {content.rsvp}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-55 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 text-white" />
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl mb-6 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.joinUs}
            </h2>
            <p className="text-lg text-[#6b6256] max-w-2xl mx-auto leading-relaxed mb-8">{content.intro}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/details"
                className="px-8 py-3 border-2 border-[#b8997a] text-[#b8997a] hover:bg-[#b8997a] hover:text-white transition-all duration-300 tracking-wider uppercase text-sm"
              >
                {content.viewDetails}
              </Link>
              <Link
                to="/our-story"
                className="px-8 py-3 border-2 border-[#b8997a] text-[#b8997a] hover:bg-[#b8997a] hover:text-white transition-all duration-300 tracking-wider uppercase text-sm"
              >
                {content.story}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#fdfbf8]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.weekend}
            </h2>
            <p className="text-[#6b6256]">{content.weekendSub}</p>
          </motion.div>

          <div className="grid max-w-4xl mx-auto md:grid-cols-2 gap-8">
            {content.events.slice(0, 2).map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl mb-3 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                  {event.title}
                </h3>
                <p className="text-[#b8997a] mb-2">{event.date}</p>
                <p className="text-[#6b6256] mb-2">{event.time}</p>
                <p className="text-sm text-[#8a7e70] italic">{event.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
