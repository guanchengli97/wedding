import { motion } from "motion/react";
import { useState } from "react";
import { Heart, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import { amplifyConfigured, client } from "../../lib/amplify";
import rsvpHeroImage from "../../assets/rsvp-hero.JPEG";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  guests: "1",
  attendance: "yes",
  arrivalInfo: "",
  songRequest: "",
  message: "",
};

export function RSVP() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const content = {
    heroAlt: isZh ? "婚礼晚宴" : "Wedding reception",
    title: "RSVP",
    subtitle: isZh ? "期待与你相聚" : "We hope you can join us",
    deadline: isZh ? "请于 2026 年 5 月 1 日前回复" : "Please Respond by May 1, 2026",
    intro: isZh
      ? "我们很期待与你一起庆祝，请告诉我们你是否能够出席。"
      : "We're so excited to celebrate with you! Please let us know if you can make it.",
    thanksTitle: isZh ? "谢谢你" : "Thank You!",
    thanksBody: isZh
      ? "我们已收到你的回复，期待在婚礼上见到你。"
      : "Your RSVP has been received. We can't wait to celebrate with you!",
    fullName: isZh ? "姓名 *" : "Full Name *",
    fullNamePlaceholder: isZh ? "请输入你的姓名" : "Enter your full name",
    email: isZh ? "邮箱" : "Email Address",
    emailPlaceholder: "your@email.com",
    phone: isZh ? "电话号码" : "Phone Number",
    phonePlaceholder: isZh ? "请输入你的电话号码" : "(555) 555-5555",
    attendance: isZh ? "是否出席？*" : "Will you be attending? *",
    accept: isZh ? "欣然出席" : "Joyfully Accepts",
    decline: isZh ? "遗憾缺席" : "Regretfully Declines",
    guests: isZh ? "出席人数 *" : "Number of Guests *",
    guestOne: isZh ? "1 位宾客" : "1 Guest",
    guestTwo: isZh ? "2 位宾客" : "2 Guests",
    arrivalInfo: isZh ? "到达车站或机场及时间（可提供接机服务）" : "Arrival Station or Airport and Time (We can arrange pickup)",
    arrivalInfoPlaceholder: isZh
      ? "例如：商丘站，5 月 1 日 20:30 到达"
      : "For example: Shangqiu Station, arriving on May 1 at 8:30 PM",
    song: isZh ? "点歌" : "Song Request",
    songPlaceholder: isZh ? "有喜欢的歌曲吗？" : "Any favorite songs?",
    message: isZh ? "给新人的留言" : "Message to the Couple",
    messagePlaceholder: isZh ? "写下你的祝福..." : "Share your well wishes...",
    submit: isZh ? "提交回复" : "Submit RSVP",
    submitting: isZh ? "提交中..." : "Submitting...",
    submitError: isZh ? "提交失败，请稍后重试。" : "Submission failed. Please try again.",
    missingConfig: isZh
      ? "表单尚未连接到 AWS Amplify Data。请先运行 Amplify sandbox 或部署后端。"
      : "This form is not connected to AWS Amplify Data yet. Run Amplify sandbox or deploy the backend first.",
    updateTitle: isZh ? "想更新 RSVP？" : "Need to Update Your RSVP?",
    updateBody: isZh
      ? "如果行程有变化，请尽快联系我们，以便我们更新宾客名单。"
      : "If your plans change, please contact us as soon as possible so we can update our guest list.",
    contact: isZh ? "打开微信" : "Open WeChat",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!amplifyConfigured) {
      setSubmitError(content.missingConfig);
      return;
    }

    setIsSubmitting(true);

    try {
      const { errors } = await client.models.RSVP.create({
        fullName: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        guestCount: formData.attendance === "yes" ? Number(formData.guests) : 0,
        attending: formData.attendance === "yes",
        arrivalInfo: formData.arrivalInfo.trim() || undefined,
        songRequest: formData.songRequest.trim() || undefined,
        message: formData.message.trim() || undefined,
        language,
      }, { authMode: "apiKey" });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : content.submitError;
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={rsvpHeroImage}
            alt={content.heroAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
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
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Heart className="w-10 h-10 mx-auto mb-4 text-[#b8997a]" />
            <h2 className="text-3xl md:text-4xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.deadline}
            </h2>
            <p className="text-[#6b6256]">{content.intro}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <div className="bg-[#fdfbf8] p-12 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-[#b8997a]" />
                <h3 className="text-3xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
                  {content.thanksTitle}
                </h3>
                <p className="text-[#6b6256] text-lg">{content.thanksBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block mb-2 text-[#4a4238]">
                    {content.fullName}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                    placeholder={content.fullNamePlaceholder}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-[#4a4238]">
                      {content.email}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8997a]" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                        placeholder={content.emailPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 text-[#4a4238]">
                      {content.phone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8997a]" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                        placeholder={content.phonePlaceholder}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="attendance" className="block mb-2 text-[#4a4238]">
                    {content.attendance}
                  </label>
                  <select
                    id="attendance"
                    name="attendance"
                    required
                    value={formData.attendance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                  >
                    <option value="yes">{content.accept}</option>
                    <option value="no">{content.decline}</option>
                  </select>
                </div>

                {formData.attendance === "yes" && (
                  <>
                    <div>
                      <label htmlFor="guests" className="block mb-2 text-[#4a4238]">
                        {content.guests}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8997a]" />
                        <select
                          id="guests"
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                        >
                          <option value="1">{content.guestOne}</option>
                          <option value="2">{content.guestTwo}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="arrivalInfo" className="block mb-2 text-[#4a4238]">
                        {content.arrivalInfo}
                      </label>
                      <input
                        type="text"
                        id="arrivalInfo"
                        name="arrivalInfo"
                        value={formData.arrivalInfo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                        placeholder={content.arrivalInfoPlaceholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="songRequest" className="block mb-2 text-[#4a4238]">
                        {content.song}
                      </label>
                      <input
                        type="text"
                        id="songRequest"
                        name="songRequest"
                        value={formData.songRequest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors"
                        placeholder={content.songPlaceholder}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="message" className="block mb-2 text-[#4a4238]">
                    {content.message}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-[#b8997a]" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border border-[#e8d5c4] bg-[#fdfbf8] focus:outline-none focus:border-[#b8997a] transition-colors resize-none"
                      placeholder={content.messagePlaceholder}
                    />
                  </div>
                </div>

                {submitError ? <p className="text-sm text-[#b85c5c]">{submitError}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#b8997a] text-white hover:bg-[#a07d5f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wider uppercase"
                >
                  {isSubmitting ? content.submitting : content.submit}
                </button>
              </form>
            )}
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
            <h3 className="text-2xl mb-4 text-[#4a4238]" style={{ fontFamily: "var(--font-serif)" }}>
              {content.updateTitle}
            </h3>
            <p className="text-[#6b6256] mb-6">{content.updateBody}</p>
            <a
              href="weixin://dl/chat"
              className="inline-block px-8 py-3 border-2 border-[#b8997a] text-[#b8997a] hover:bg-[#b8997a] hover:text-white transition-all duration-300 tracking-wider uppercase text-sm"
            >
              {content.contact}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
