export interface GeneratedContent {
  headlines: string[];
  ads: string[];
  emails: { subject: string; body: string }[];
  landingPage: { hero: string; features: string[]; cta: string };
  whatsapp: { title: string; message: string }[];
  socialMedia: { platform: string; icon: string; post: string; hashtags: string[] }[];
}

export interface MarketingFormData {
  productName: string;
  description: string;
  audience: string;
  tone: string;
  goal: string;
}

const toneMap: Record<string, { adj: string; verb: string; cta: string }> = {
  professional: { adj: "Transform", verb: "Elevate", cta: "Get Started Today" },
  casual: { adj: "Level Up", verb: "Try Out", cta: "Jump In – It's Free!" },
  friendly: { adj: "Discover", verb: "Explore", cta: "Come See What's New!" },
  urgent: { adj: "Act Now –", verb: "Don't Wait –", cta: "Claim Your Spot Before It's Gone!" },
};

const goalMap: Record<string, string> = {
  awareness: "spreading the word about",
  leads: "capturing leads for",
  sales: "driving sales of",
  engagement: "boosting engagement with",
};

export function generateContent(data: MarketingFormData): GeneratedContent {
  const { productName, description, audience, tone, goal } = data;
  const name = productName || "Your Product";
  const desc = description || "an innovative solution";
  const aud = audience || "your target audience";

  const t = toneMap[tone] || toneMap.professional;
  const goalPhrase = goalMap[goal] || "promoting";

  return {
    headlines: [
      `${t.adj} Your Experience with ${name}`,
      `Why ${aud} Are Choosing ${name}`,
      `${t.verb} the Way You Work – Powered by ${name}`,
    ],
    ads: [
      `🚀 ${name} – ${desc}. Built for ${aud} who want results. ${t.cta}`,
      `💡 Stop settling for less. ${name} helps ${aud} achieve more with ${desc}. Try it free today!`,
      `⚡ ${t.verb} your workflow with ${name}. Perfect for ${goalPhrase} ${name.toLowerCase()}. Get started in 2 minutes.`,
    ],
    emails: [
      {
        subject: `${aud} – here's how ${name} can help you`,
        body: `Hi there,\n\nWe built ${name} specifically for ${aud}.\n\n${name} is ${desc}.\n\nHere's what you'll get:\n• Tailored solutions for ${aud}\n• Designed for ${goalPhrase} your business\n• Easy to start, powerful to scale\n\n${t.cta}\n\nBest,\nThe ${name} Team`,
      },
      {
        subject: `Quick question about ${goalPhrase} your business...`,
        body: `Hi,\n\nAre you spending too much time on ${goalPhrase} your products?\n\nWith ${name}, ${aud} can:\n• Save time with automation\n• Get better results faster\n• Focus on what matters most\n\n${desc} – and it's ready for you today.\n\nCheers,\nThe ${name} Team`,
      },
      {
        subject: `${t.adj} your results this week`,
        body: `Hey there,\n\nTime is your most valuable asset.\n\n${name} was designed for ${aud} who need:\n✓ ${desc}\n✓ Tools focused on ${goalPhrase} your business\n✓ Results you can measure\n\n${t.cta}\n\nBest,\nThe ${name} Team`,
      },
    ],
    landingPage: {
      hero: `${t.adj} Your Business with ${name}. ${desc.charAt(0).toUpperCase() + desc.slice(1)} – built specifically for ${aud}.`,
      features: [
        `Tailored for ${aud} – solutions designed around your needs`,
        `${name} delivers ${desc} with ease`,
        `Optimized for ${goalPhrase} your business at every stage`,
      ],
      cta: t.cta,
    },
    whatsapp: [
      {
        title: "Welcome / First Contact",
        message: `Hi there! 👋\n\nThanks for reaching out to ${name}.\n\nWe help ${aud} with ${desc}.\n\nWould you like to learn how we can help your business grow? I'm happy to share more details! 😊`,
      },
      {
        title: "Product Introduction",
        message: `Hello! 🌟\n\nI wanted to introduce you to ${name}.\n\n${desc.charAt(0).toUpperCase() + desc.slice(1)} – designed specifically for ${aud}.\n\nHere's what makes us different:\n✅ Easy to get started\n✅ Built for ${goalPhrase} your business\n✅ Affordable plans that grow with you\n\nWant me to send you more info? Just reply YES! 👍`,
      },
      {
        title: "Follow-Up / Re-engagement",
        message: `Hi again! 👋\n\nJust checking in – we spoke about ${name} recently.\n\nMany ${aud} are already seeing results:\n📈 Better ${goalPhrase.replace("for ", "").replace("your ", "")} outcomes\n💰 Save time and money\n🎯 Focus on what matters\n\nShall I set up a quick demo for you? No pressure at all! 😊`,
      },
      {
        title: "Special Offer / Promo",
        message: `🔥 SPECIAL OFFER for ${aud}!\n\n${name} is running a limited-time promotion.\n\n🎁 Get started today and enjoy:\n• Free setup assistance\n• 7-day free trial\n• Priority support\n\n${t.cta}\n\n📲 Reply NOW to claim your spot!\n\n_Offer valid while slots last._`,
      },
      {
        title: "Customer Testimonial Share",
        message: `Hi! Quick story for you 📖\n\nOne of our customers (also in ${aud}) said:\n\n"${name} completely changed how I do business. ${desc.charAt(0).toUpperCase() + desc.slice(1)} – I wish I started sooner!"\n\nWant the same results? Let's chat! 💬\n\nReply INTERESTED and I'll share how to get started.`,
      },
    ],
    socialMedia: [
      {
        platform: "Instagram",
        icon: "📸",
        post: `${t.adj} your business game! 🚀\n\n${name} is here to help ${aud} achieve more.\n\n${desc.charAt(0).toUpperCase() + desc.slice(1)} – and it's easier than you think.\n\n✅ Simple to start\n✅ Powerful results\n✅ Built for YOU\n\n${t.cta} 👉 Link in bio`,
        hashtags: ["SmallBusiness", "BusinessGrowth", "Entrepreneur", name.replace(/\s+/g, ""), "StartupLife"],
      },
      {
        platform: "Facebook",
        icon: "📘",
        post: `Attention ${aud}! 👀\n\nTired of struggling with ${goalPhrase.replace("for ", "").replace("your ", "")} your business?\n\n${name} is ${desc}.\n\nHere's why hundreds of business owners are making the switch:\n\n🎯 Tailored for ${aud}\n💡 Smart tools that save you time\n📊 Track your progress in real-time\n\n${t.cta}\n\nDrop a 🔥 in the comments if you want to learn more!`,
        hashtags: ["BusinessTips", "GrowYourBusiness", name.replace(/\s+/g, ""), "DigitalMarketing"],
      },
      {
        platform: "Twitter / X",
        icon: "🐦",
        post: `${t.adj} your business with ${name} 🚀\n\n${desc.charAt(0).toUpperCase() + desc.slice(1)}\n\nBuilt for ${aud} who want results, not headaches.\n\n${t.cta} ⬇️`,
        hashtags: ["BizTips", name.replace(/\s+/g, ""), "Growth", "SmallBiz"],
      },
      {
        platform: "LinkedIn",
        icon: "💼",
        post: `I'm excited to share something we've been working on.\n\n${name} was built because ${aud} deserve better tools for ${goalPhrase} their businesses.\n\n${desc.charAt(0).toUpperCase() + desc.slice(1)}.\n\nWhat we've learned from working with ${aud}:\n→ They need solutions that are simple, not complex\n→ Time is their most valuable resource\n→ Results matter more than features\n\nIf you're in this space, I'd love to hear your thoughts. What's your biggest challenge with ${goalPhrase.replace("for ", "").replace("your ", "")} your business?\n\n${t.cta}`,
        hashtags: ["BusinessStrategy", "Innovation", name.replace(/\s+/g, ""), "Leadership"],
      },
      {
        platform: "TikTok",
        icon: "🎵",
        post: `POV: You finally found a tool that actually works for your business 🤯\n\n${name} = ${desc}\n\nPerfect for ${aud} who are done wasting time ⏰\n\n${t.cta} 🔥\n\nSave this for later! 📌`,
        hashtags: ["SmallBusinessTikTok", "BusinessHack", "EntrepreneurLife", name.replace(/\s+/g, ""), "FYP"],
      },
    ],
  };
}
