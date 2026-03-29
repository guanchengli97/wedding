import { motion } from "motion/react";
import { MapPin, Clock, Calendar, Music, Camera, Gift, Shirt, Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";

export function WeddingDetails() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const schedule = isZh
    ? [
        { time: "10:00", event: "宾客入场", description: "请提前到场并找到座位" },
        { time: "11:00", event: "仪式开始", description: "婚礼庆典正式开始" },
        { time: "12:00", event: "宴席开始", description: "饮品与小食" },
      ]
    : [
        { time: "10:00 AM", event: "Guest Arrival", description: "Please arrive early to find your seats" },
        { time: "11:00 AM", event: "Ceremony Begins", description: "The wedding celebration officially begins" },
        { time: "12:00 PM", event: "Banquet Begins", description: "Drinks and light refreshments" },
      ];

  const faq = isZh
    ? [
        {
          question: "穿什么比较合适？",
          answer: "穿得舒适即可，怎么自在怎么来。",
        },
        {
          question: "会安排接驳车吗？",
          answer: "会。推荐酒店将提供接驳服务，具体信息会在 RSVP 确认后发送。",
        },
        {
          question: "可以带同行宾客吗？",
          answer: "如需携伴参加，请提前和我们说一声，方便我们安排。",
        },
        {
          question: "适合带小朋友参加吗？",
          answer: "我们很爱小朋友，但这次婚礼将以成人宾客为主，希望大家能放松享受当晚时光。",
        },
        {
          question: "现场有停车位吗？",
          answer: "有，场地提供免费的代客泊车服务。",
        },
      ]
    : [
        {
          question: "What should I wear?",
          answer: "Wear whatever feels comfortable and easy for you.",
        },
        {
          question: "Will transportation be provided?",
          answer: "Yes! Shuttle service will be available from recommended hotels. Details will be sent with your RSVP confirmation.",
        },
        {
          question: "Can I bring a plus one?",
          answer: "If you would like to bring a guest, please let us know in advance so we can make arrangements.",
        },
        {
          question: "Is the wedding kid-friendly?",
          answer: "We love your little ones, but we've planned an adults-only celebration so you can relax and enjoy the evening.",
        },
        {
          question: "Will there be parking?",
          answer: "Yes, complimentary valet parking will be available at the venue.",
        },
      ];

  const content = {
    heroAlt: isZh ? "婚礼场地" : "Wedding venue",
    title: isZh ? "婚礼信息" : "Wedding Details",
    subtitle: isZh ? "你需要知道的一切" : "Everything you need to know",
    ceremony: isZh ? "仪式" : "Ceremony",
    reception: isZh ? "宴席" : "Reception",
    ceremonyDate: isZh ? "2026年5月2号，星期六" : "Saturday, May 2, 2026",
    ceremonyTime: isZh ? "11:00 大约" : "Around 11:00 AM",
    receptionTime: isZh ? "12:00 大约" : "Around 12:00 PM",
    sameVenue: isZh ? "与仪式场地相同" : "Same venue as ceremony",
    celebration: isZh ? "用餐与庆祝时光" : "Dining and celebration",
    getDirections: isZh ? "获取路线" : "Get Directions",
    viewMenu: isZh ? "查看菜单" : "View Menu",
    scheduleTitle: isZh ? "流程安排" : "Schedule",
    scheduleSub: isZh ? "婚礼当天时间线" : "Timeline for our special day",
    goodToKnow: isZh ? "贴心提示" : "Good to Know",
    dressCode: isZh ? "着装要求" : "Dress Code",
    dressCodeValue: isZh ? "舒适即可" : "Come as you feel comfortable",
    photography: isZh ? "摄影提示" : "Photography",
    photographyValue: isZh ? "欢迎拍照，记得把我们拍得好看一点" : "Photos are welcome, and we would love a flattering angle",
    registry: isZh ? "礼物心意" : "Registry",
    registryValue: isZh ? "你的到来就是礼物" : "Your presence is enough",
    faqTitle: isZh ? "常见问题" : "Frequently Asked Questions",
    contactTitle: isZh ? "还有疑问？" : "Have Questions?",
    contactSub: isZh ? "欢迎直接联系我们或婚礼统筹" : "Feel free to reach out to us or our wedding coordinator",
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1757589227072-0dd17af42433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBjZXJlbW9ueSUyMGZsb3dlcnN8ZW58MXx8fHwxNzc0NTgxNTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt={content.heroAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            {content.title}
          </h1>
          <p className="text-xl tracking-wider">{content.subtitle}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#fdfbf8] p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-[#b8997a]" />
                <h2 className="text-3xl text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                  {content.ceremony}
                </h2>
              </div>
              <div className="space-y-4 text-[#6b6256]">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0 text-[#b8997a]" />
                  <div>
                    <p className="font-medium">{content.ceremonyDate}</p>
                    <p>{content.ceremonyTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-[#b8997a]" />
                  <div>
                    <p className="font-medium">{isZh ? "华景粤海酒店" : "Huajing Yuehai Hotel"}</p>
                    <p>{isZh ? "河南省商丘市柘城县北关大街湖南路1号" : "No. 1 Hunan Road, Beiguan Street, Zhecheng County, Shangqiu, Henan, China"}</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 bg-[#b8997a] text-white hover:bg-[#a07d5f] transition-colors tracking-wider uppercase text-sm">
                {content.getDirections}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#fdfbf8] p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Music className="w-8 h-8 text-[#b8997a]" />
                <h2 className="text-3xl text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                  {content.reception}
                </h2>
              </div>
              <div className="space-y-4 text-[#6b6256]">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0 text-[#b8997a]" />
                  <div>
                    <p className="font-medium">{content.ceremonyDate}</p>
                    <p>{content.receptionTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-[#b8997a]" />
                  <div>
                    <p className="font-medium">{isZh ? "华景粤海酒店" : "Huajing Yuehai Hotel"}</p>
                    {/* <p>{content.sameVenue}</p> */}
                    <p>{content.celebration}</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 bg-[#b8997a] text-white hover:bg-[#a07d5f] transition-colors tracking-wider uppercase text-sm">
                {content.viewMenu}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#fdfbf8]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.scheduleTitle}
            </h2>
            <p className="text-[#6b6256]">{content.scheduleSub}</p>
          </motion.div>

          <div className="space-y-6">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 bg-white p-6 shadow-sm"
              >
                <div className="flex-shrink-0 w-24 text-[#b8997a] font-medium">{item.time}</div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                    {item.event}
                  </h3>
                  <p className="text-[#6b6256]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.goodToKnow}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#fdfbf8] flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-[#b8997a]" />
              </div>
              <h3 className="text-xl mb-2 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                {content.dressCode}
              </h3>
              <p className="text-[#6b6256]">{content.dressCodeValue}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#fdfbf8] flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#b8997a]" />
              </div>
              <h3 className="text-xl mb-2 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                {content.photography}
              </h3>
              <p className="text-[#6b6256]">{content.photographyValue}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#fdfbf8] flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-[#b8997a]" />
              </div>
              <h3 className="text-xl mb-2 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                {content.registry}
              </h3>
              <p className="text-[#6b6256]">{content.registryValue}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#fdfbf8]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.faqTitle}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl mb-3 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                  {item.question}
                </h3>
                <p className="text-[#6b6256]">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.contactTitle}
            </h2>
            <p className="text-[#6b6256] mb-8">{content.contactSub}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="tel:+8618272618781"
                className="flex items-center gap-2 text-[#b8997a] hover:text-[#a07d5f] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+86 18272618781</span>
              </a>
              <a
                href="mailto:1135962690@qq.com"
                className="flex items-center gap-2 text-[#b8997a] hover:text-[#a07d5f] transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>1135962690@qq.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
