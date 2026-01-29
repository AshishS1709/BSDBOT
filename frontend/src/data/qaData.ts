export interface QAPair {
  keywords: string[];
  question: string;
  answer: string;
}

export const qaData: QAPair[] = [
  {
    keywords: ["services", "offer", "provide", "do"],
    question: "What services do you offer?",
    answer: "At Brandsetu Digital, we offer a comprehensive range of digital marketing services including:\n\n• Social Media Marketing\n• Search Engine Optimization (SEO)\n• Pay-Per-Click Advertising (PPC)\n• Content Marketing\n• Brand Strategy & Design\n• Website Development\n• Video Production\n• Influencer Marketing\n\nWe're your one-stop solution for all digital growth needs!"
  },
  {
    keywords: ["pricing", "cost", "price", "charge", "fee", "expensive"],
    question: "What are your pricing plans?",
    answer: "Our pricing is customized based on your specific needs and goals. We offer flexible packages starting from:\n\n• Starter Package: ₹15,000/month\n• Growth Package: ₹35,000/month\n• Enterprise Package: Custom pricing\n\nContact us for a free consultation and detailed quote tailored to your business!"
  },
  {
    keywords: ["contact", "reach", "call", "email", "phone"],
    question: "How can I contact you?",
    answer: "You can reach us through multiple channels:\n\n📧 Email: hello@brandsetudigital.com\n📱 Phone: +91 98765 43210\n💬 WhatsApp: +91 98765 43210\n🌐 Website: brandsetudigital.com\n\nOur team typically responds within 2-4 hours during business hours!"
  },
  {
    keywords: ["location", "office", "address", "where", "based"],
    question: "Where is your office located?",
    answer: "We're headquartered in the heart of the digital hub:\n\n📍 123 Digital Tower, Tech Park\nBangalore, Karnataka 560001\nIndia\n\nWe also work with clients globally through our virtual collaboration setup!"
  },
  {
    keywords: ["time", "long", "duration", "results", "expect"],
    question: "How long does it take to see results?",
    answer: "Results timeline varies by service:\n\n⚡ PPC Ads: Immediate to 1-2 weeks\n📈 SEO: 3-6 months for significant results\n📱 Social Media: 1-3 months for engagement growth\n🎨 Branding: 4-8 weeks for complete brand identity\n\nWe provide monthly reports so you can track progress every step of the way!"
  },
  {
    keywords: ["portfolio", "work", "examples", "clients", "case"],
    question: "Can I see your portfolio?",
    answer: "Absolutely! We've worked with 200+ brands across industries:\n\n🏆 Award-winning campaigns for leading startups\n📊 50M+ social media impressions delivered\n💰 300% average ROI for our clients\n⭐ 4.5+ rating from our clients\n\nVisit our website's Work section or ask for a detailed case study!"
  },
  {
    keywords: ["start", "begin", "process", "onboard", "how"],
    question: "How do I get started?",
    answer: "Getting started is easy! Here's our simple process:\n\n1️⃣ Schedule a free discovery call\n2️⃣ We analyze your current digital presence\n3️⃣ Receive a customized strategy proposal\n4️⃣ Approve and kick off your campaign\n\nClick 'Let's Talk' on our website or just say 'I want to get started' here!"
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    question: "Hello!",
    answer: "Hey there! 👋 Welcome to Brandsetu Digital!\n\nI'm here to help you with any questions about our services, pricing, or how we can help grow your brand.\n\nWhat would you like to know?"
  }
];

export const defaultAnswer = "Thanks for your question! While I may not have a specific answer for that, our team would love to help you directly.\n\n📞 Contact us at: +91 98765 43210\n📧 Email: hello@brandsetudigital.com\n\nOr try asking about our services, pricing, or how to get started!";

export const quickQuestions = [
  "What services do you offer?",
  "How much do you charge?",
  "How do I get started?",
  "Show me your portfolio"
];

export function findAnswer(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const qa of qaData) {
    const matchFound = qa.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    if (matchFound) {
      return qa.answer;
    }
  }
  
  return defaultAnswer;
}
