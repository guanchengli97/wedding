import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import ourStoryHeroImage from "../../assets/our-story-hero.jpeg";
import ourStoryCatImage from "../../assets/our-story-new-left.JPEG";
import ourStoryCoupleImage from "../../assets/our-story-new-right.JPEG";

export function OurStory() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const timeline = isZh
    ? [
        // {
        //   year: "2023",
        //   title: "初次相遇",
        //   description: "我们在莱斯大学的一家露天酒吧里第一次见面。那天的风很轻，夜色也刚刚好，一次很自然的聊天，让原本陌生的两个人慢慢放松下来。没有刻意安排，却让我们都对彼此留下了格外深刻的印象。",
        // },
        {
          year: "2023",
          title: "第一次约会",
          description: "我们的第一次正式约会，一起散步。一路上我们聊了很多，从日常生活到未来计划，从喜欢的食物到各自的小习惯。原本以为只是一次简单的见面，却在不知不觉中走了很久，也更确定了彼此相处时那份轻松和默契。",
        },
        {
          year: "2024",
          title: "求婚",
          description: "2024 年，我们在西雅图迎来了属于我们的求婚时刻。没有复杂的布置，也没有刻意铺陈的桥段，但正因为简单真诚，才显得格外珍贵。那一刻的惊喜、感动和坚定，让我们更加确信，未来想要一直并肩走下去的人就是彼此。",
        },
        {
          year: "2025",
          title: "宠物",
          description: "2025 年，我们迎来了家里的新成员，一只可爱的猫咪，名字叫玉米。它的到来让我们的生活多了许多热闹和温暖，也让平凡的日子变得更加柔软有趣。一起照顾它、陪它玩闹、看它在家里自在地跑来跑去，也成了我们生活中最幸福的日常之一。",
        },
        {
          year: "2026",
          title: "婚礼",
          description: "现在，我们即将在 2026 年迎来婚礼，也准备在人生中最重要的家人和朋友见证下，开启关于爱与未来的新篇章。一路走来，我们收获了陪伴、理解与成长，也更加珍惜能够牵着彼此的手，一起走进未来的这份幸运。",
        },
      ]
    : [
        {
          year: "2023",
          title: "First Meeting",
          description: "We first met at an open-air bar at Rice University. The evening breeze was soft, the atmosphere felt easy, and a simple conversation turned into something unexpectedly memorable. There was no grand setup, just a very natural first meeting that left a lasting impression on both of us.",
        },
        {
          year: "2023",
          title: "First Date",
          description: "Our first official date was a walk around campus. We talked for a long time about everyday life, future plans, favorite foods, and all the little details that make a person who they are. What we expected to be a simple date became a moment when we both realized how easy, comfortable, and natural it felt to be together.",
        },
        {
          year: "2024",
          title: "The Proposal",
          description: "In 2024, we had our proposal moment in Seattle. There were no elaborate decorations and no carefully staged surprises, but that was exactly what made it so meaningful. It was simple, sincere, and full of emotion, a moment that made us even more certain that we wanted to keep walking through life side by side.",
        },
        {
          year: "2025",
          title: "Our Cat",
          description: "In 2025, we welcomed a new member into our home, our beloved cat, Yumi. Life immediately became warmer, livelier, and a little more playful. Caring for her, playing with her, and watching her make herself completely at home quickly became one of the happiest parts of our everyday life together.",
        },
        {
          year: "2026",
          title: "Our Wedding",
          description: "Now, in 2026, we are preparing for our wedding and getting ready to begin a new chapter surrounded by the family and friends who matter most to us. Along the way, we have learned so much about love, patience, and growing together, and we feel incredibly lucky to step into the future hand in hand.",
        },
      ];

  const content = {
    heroAlt: isZh ? "Sophie 和 James 一起散步" : "Sophie and James walking together",
    title: isZh ? "我们的故事" : "Our Story",
    subtitle: isZh ? "从相遇到今天" : "How it all began",
    quote: isZh
      ? "“这世界上，没有一颗心比你的心更适合我；这世界上，也没有一份爱比我对你的爱更属于你。”"
      : '"In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."',
    together: isZh ? "未来同路" : "Together Forever",
    togetherSub: isZh ? "期待与你一同庆祝" : "We can't wait to celebrate with you",
    bouquetAlt: isZh ? "猫咪玉米" : "Our cat Yumi",
    ringsAlt: isZh ? "我们的合照" : "A photo of us together",
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={ourStoryHeroImage}
            alt={content.heroAlt}
            className="w-full h-full object-cover object-[50%_78%] md:object-[50%_60%]"
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
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto mb-6 text-[#b8997a]" />
            <p className="text-xl md:text-2xl text-[#4a4238] leading-relaxed mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              {content.quote}
            </p>
            <p className="text-sm text-[#8a7e70] italic">- Maya Angelou</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#fdfbf8]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {timeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-[#b8997a] flex items-center justify-center">
                    <span className="text-2xl text-white" style={{ fontFamily: "var(--font-serif)" }}>
                      {event.year}
                    </span>
                  </div>
                </div>

                <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"} text-center`}>
                  <h3 className="text-3xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                    {event.title}
                  </h3>
                  <p className="text-[#6b6256] leading-relaxed">{event.description}</p>
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
              {content.together}
            </h2>
            <p className="text-[#6b6256]">{content.togetherSub}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-96 overflow-hidden"
            >
              <ImageWithFallback
                src={ourStoryCatImage}
                alt={content.bouquetAlt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-96 overflow-hidden"
            >
              <ImageWithFallback
                src={ourStoryCoupleImage}
                alt={content.ringsAlt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
