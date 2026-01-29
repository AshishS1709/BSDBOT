"""
Brandsetu Digital Chatbot Backend - Fixed Version
Improved FAQ matching and response generation
"""

from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from datetime import datetime
import sqlite3
import json
import re
from typing import Dict, List, Optional, Tuple
import logging
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseManager:
    """Manage SQLite database for conversations and analytics"""
    
    def __init__(self, db_path='chatbot.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message_type TEXT NOT NULL,
                message TEXT NOT NULL,
                response TEXT,
                matched_faq TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                event_data TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message_id INTEGER,
                rating INTEGER,
                comment TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_message(self, session_id: str, message_type: str, message: str, 
                     response: str = None, matched_faq: str = None): # type: ignore
        """Save a message to database"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO conversations (session_id, message_type, message, response, matched_faq)
            VALUES (?, ?, ?, ?, ?)
        ''', (session_id, message_type, message, response, matched_faq))
        
        conn.commit()
        message_id = cursor.lastrowid
        conn.close()
        
        return message_id
    
    def get_conversation(self, session_id: str) -> List[Dict]:
        """Get conversation history"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM conversations 
            WHERE session_id = ? 
            ORDER BY timestamp ASC
        ''', (session_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def save_analytics(self, session_id: str, event_type: str, event_data: Dict = None): # type: ignore
        """Save analytics event"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO analytics (session_id, event_type, event_data)
            VALUES (?, ?, ?)
        ''', (session_id, event_type, json.dumps(event_data) if event_data else None))
        
        conn.commit()
        conn.close()
    
    def get_analytics_summary(self) -> Dict:
        """Get analytics summary"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(DISTINCT session_id) as count FROM conversations')
        total_sessions = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(*) as count FROM conversations WHERE message_type = "user"')
        total_messages = cursor.fetchone()['count']
        
        cursor.execute('''
            SELECT matched_faq, COUNT(*) as count 
            FROM conversations 
            WHERE matched_faq IS NOT NULL 
            GROUP BY matched_faq 
            ORDER BY count DESC 
            LIMIT 5
        ''')
        top_faqs = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "total_sessions": total_sessions,
            "total_messages": total_messages,
            "top_faqs": top_faqs
        }


class NLPProcessor:
    """Enhanced natural language processing"""
    
    @staticmethod
    def similarity_score(str1: str, str2: str) -> float:
        """Calculate similarity between two strings"""
        return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()
    
    @staticmethod
    def extract_intent(message: str) -> str:
        """Extract user intent from message"""
        message_lower = message.lower()
        
        intents = {
            "greeting": ["hello", "hi", "hey", "good morning", "good afternoon"],
            "seo": ["seo", "search engine", "ranking", "google", "organic"],
            "social_media": ["social media", "instagram", "facebook", "linkedin", "twitter"],
            "paid_ads": ["ads", "advertising", "google ads", "facebook ads", "paid"],
            "pricing": ["price", "cost", "how much", "budget"],
            "getting_started": ["get started", "begin", "start", "how to start"],
            "branding": ["brand", "identity", "logo", "branding"],
            "results": ["results", "roi", "timeline", "how soon"],
            "contact": ["contact", "reach", "email", "phone", "call", "talk", "speak"]
        }
        
        for intent, keywords in intents.items():
            for keyword in keywords:
                if keyword in message_lower:
                    return intent
        
        return "general_inquiry"
    
    @staticmethod
    def extract_entities(message: str) -> Dict:
        """Extract entities like budget, timeline, etc."""
        entities = {}
        
        budget_pattern = r'₹?\s*(\d+(?:,\d+)*(?:k|K|lakh|lakhs?)?)'
        budget_matches = re.findall(budget_pattern, message)
        if budget_matches:
            entities['budget'] = budget_matches[0]
        
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_matches = re.findall(email_pattern, message)
        if email_matches:
            entities['email'] = email_matches[0]
        
        phone_pattern = r'\b(?:\+91|91)?[\s-]?[6-9]\d{9}\b'
        phone_matches = re.findall(phone_pattern, message)
        if phone_matches:
            entities['phone'] = phone_matches[0]
        
        return entities


class BrandsetuChatbot:
    """Brandsetu Digital Chatbot with improved matching"""
    
    def __init__(self):
        self.db = DatabaseManager()
        self.nlp = NLPProcessor()
        self.faqs = self.load_faqs()
    
    def load_faqs(self) -> Dict:
        """Load all FAQ data"""
        return {
            # SEO SERVICES
            "seo_overview": {
                "keywords": ["seo", "seo services", "search engine optimization", "search engine", "ranking", "google ranking", "organic"],
                "response": "We help businesses improve their Google visibility and attract customers organically. What would you like to know about our SEO services?",
                "options": [
                    "Is SEO suitable for small or local businesses?",
                    "Will I get SEO reports?",
                    "What SEO services does BrandSetu Digital provide?"
                ],
                "category": "seo_services"
            },
            "seo_local": {
                "keywords": ["local seo", "small business seo", "seo for local business", "local business"],
                "response": "Yes. Local SEO is one of our strengths. We help local businesses rank on Google Maps and local search results to attract nearby customers.",
                "category": "seo_services"
            },
            "seo_reports": {
                "keywords": ["seo reports", "seo tracking", "keyword rankings", "seo report"],
                "response": "Yes. You'll receive clear SEO reports covering keyword rankings, traffic growth, and performance insights.",
                "category": "seo_services"
            },
            "seo_services_detail": {
                "keywords": ["what seo services", "seo include", "seo offer", "complete seo", "seo solutions"],
                "response": "We offer complete SEO solutions including keyword research, on-page SEO, technical SEO, content optimization, backlink building, and local SEO to improve your Google visibility.",
                "category": "seo_services"
            },

            # SOCIAL MEDIA MARKETING
            "social_overview": {
                "keywords": ["social media", "social media marketing", "smm", "social"],
                "response": "We help brands grow through social media marketing using content, strategy, and consistent engagement. What would you like to know?",
                "options": [
                    "Which platforms do you manage?",
                    "Do you create the content or do I need to provide it?",
                    "How soon will I see growth on social media?"
                ],
                "category": "social_media_marketing"
            },
            "social_platforms": {
                "keywords": ["platforms you manage", "instagram facebook linkedin", "which platforms", "what platforms"],
                "response": "We manage Instagram, Facebook, LinkedIn, and other platforms depending on where your audience is most active.",
                "category": "social_media_marketing"
            },
            "social_content": {
                "keywords": ["create content", "provide content", "content creation", "who creates content"],
                "response": "We handle everything — strategy, creatives, captions, and posting. If you have brand assets, we can incorporate them.",
                "category": "social_media_marketing"
            },
            "social_growth": {
                "keywords": ["social media growth", "how soon social media", "social media results", "growth timeline"],
                "response": "Engagement improves within weeks. Strong audience growth and lead flow usually take 1–3 months depending on consistency and strategy.",
                "category": "social_media_marketing"
            },

            # ABOUT BRANDSETU DIGITAL
            "bsd_overview": {
                "keywords": ["brandsetu", "about brandsetu", "about bsd", "brandsetu digital", "tell me about"],
                "response": "BrandSetu Digital helps businesses build strong brands and grow online using marketing, strategy, and automation. What would you like to know about us?",
                "options": [
                    "What specific services does BrandSetu Digital offer?",
                    "How does BrandSetu Digital create a strategy?",
                    "How soon will I see results from digital marketing?",
                    "Do you help businesses with branding as well as marketing?"
                ],
                "category": "about_bsd"
            },
            "bsd_services": {
                "keywords": ["services brandsetu", "what services do you offer", "your services", "services you provide", "tell me about the services"],
                "response": "We specialize in branding and identity strategy, social media marketing and management, search engine optimization, paid advertising on Google and Meta, content strategy and creation, and business growth automation support. These services work together to build your brand and grow your business online.",
                "category": "about_bsd"
            },
            "bsd_strategy": {
                "keywords": ["create strategy", "strategy process", "how do you create strategy"],
                "response": "Every business is unique. We begin with a discovery session to understand your goals, audience, and challenges, then craft a custom strategy aligned with your business needs and market realities.",
                "category": "about_bsd"
            },
            "bsd_results": {
                "keywords": ["how soon results", "marketing results timeline", "when will i see results"],
                "response": "Paid advertising can show results in days. SEO and organic growth usually take 40–60 days and build sustainability. Branding and long-term strategy improvements compound benefits over time. We focus on results that matter, not just quick numbers.",
                "category": "about_bsd"
            },
            "bsd_branding": {
                "keywords": ["branding", "brand identity", "branding help", "what about the branding", "tell me about branding"],
                "response": "Yes. We don't just run ads — we help build your brand story, identity, positioning, and long-term digital reputation so your audience connects with your business.",
                "category": "about_bsd"
            },

            # PAID ADVERTISING
            "paid_overview": {
                "keywords": ["paid ads", "advertising", "google ads", "ads", "paid advertising", "tell me about the paid ads"],
                "response": "We manage paid advertising campaigns to generate leads and sales efficiently. What would you like to know?",
                "options": [
                    "What paid advertising services do you offer?",
                    "Will I get performance reports for ads?",
                    "Do you manage ad budgets as well?"
                ],
                "category": "paid_ads"
            },
            "paid_services": {
                "keywords": ["paid advertising services", "facebook ads", "instagram ads", "what ads", "advertising services"],
                "response": "We manage Google Ads, Facebook Ads, and Instagram Ads — from strategy and setup to optimization and scaling.",
                "category": "paid_ads"
            },
            "paid_reports": {
                "keywords": ["ads reports", "performance reports", "ad reports"],
                "response": "Absolutely. You'll get detailed reports showing ad spend, leads, conversions, and ROI.",
                "category": "paid_ads"
            },
            "paid_budget": {
                "keywords": ["ad budget", "manage ad spend", "budget management"],
                "response": "Yes. We optimize your ad spend to get the best ROI and avoid unnecessary wastage.",
                "category": "paid_ads"
            },

            # GETTING STARTED
            "getting_started_overview": {
                "keywords": ["get started", "how to start", "starting", "begin"],
                "response": "Getting started with BrandSetu Digital is simple. What would you like to know?",
                "options": [
                    "How do I get started with BrandSetu Digital?",
                    "Do you offer a free consultation?",
                    "Are your plans flexible?"
                ],
                "category": "getting_started"
            },
            "get_started": {
                "keywords": ["start with brandsetu", "get started brandsetu", "how do i get started"],
                "response": "Just message us here with your business goal, and our team will guide you step by step.",
                "category": "getting_started"
            },
            "free_consultation": {
                "keywords": ["free consultation", "free strategy", "consultation"],
                "response": "Yes. We offer a free strategy discussion to understand your business and recommend the best solution.",
                "category": "getting_started"
            },
            "flexible_plans": {
                "keywords": ["flexible plans", "custom plans", "plans flexible", "are your plans flexible"],
                "response": "Yes. We offer custom and scalable plans based on your needs and growth stage.",
                "category": "getting_started"
            },

            # CONTACT INFORMATION
            "contact_info": {
                "keywords": ["contact", "reach out", "get in touch", "contact you", "contact brandsetu", "how to contact", "reach you", "talk to you", "speak with you"],
                "response": "Great! Here's how you can reach us:\n\n📧 Email: contact@brandsetudigital.com\n📱 Phone: +91 98765 43210\n🌐 Website: www.brandsetudigital.com\n\nOr simply share your contact details here, and our team will reach out within 2 hours!",
                "category": "contact"
            },
            "email_contact": {
                "keywords": ["email", "email address", "mail id", "send email"],
                "response": "You can email us at: contact@brandsetudigital.com\n\nOr share your email here, and we'll get back to you within 2 hours!",
                "category": "contact"
            },
            "phone_contact": {
                "keywords": ["phone", "phone number", "call", "mobile number", "whatsapp"],
                "response": "You can call or WhatsApp us at: +91 98765 43210\n\nOr share your number here, and we'll reach out within 2 hours!",
                "category": "contact"
            }
        }
    
    def find_best_match(self, user_message: str) -> Tuple[Optional[Dict], float, str]:
        """Find best FAQ match with improved scoring"""
        user_message_lower = user_message.lower().strip()
        
        best_match = None
        best_score = 0
        matched_key = None
        
        for faq_key, faq_data in self.faqs.items():
            score = 0
            
            for keyword in faq_data["keywords"]:
                keyword_lower = keyword.lower()
                
                # Exact match gets highest score
                if user_message_lower == keyword_lower:
                    score += 50
                
                # Contains full keyword
                elif keyword_lower in user_message_lower:
                    score += 20 + len(keyword.split()) * 5
                
                # Keyword contains user message (for short queries like "seo")
                elif user_message_lower in keyword_lower and len(user_message_lower) >= 3:
                    score += 15
                
                # Partial word match
                for word in user_message_lower.split():
                    if len(word) >= 3 and word in keyword_lower:
                        score += 8
            
            if score > best_score:
                best_score = score
                best_match = faq_data
                matched_key = faq_key
        
        # Normalize confidence score
        confidence = min(best_score / 50, 1.0)
        
        return best_match, confidence, matched_key # type: ignore
    
    def generate_response(self, user_message: str, session_id: str) -> Dict:
        """Generate contextual response"""
        
        intent = self.nlp.extract_intent(user_message)
        entities = self.nlp.extract_entities(user_message)
        
        matched_faq, confidence, faq_key = self.find_best_match(user_message)
        
        # Lower threshold for better matching
        if matched_faq and confidence > 0.08:
            response = matched_faq["response"]
            category = matched_faq.get("category", "general")
        else:
            response = self._generate_fallback_response(user_message, entities)
            faq_key = "fallback"
            category = "general"
        
        self.db.save_message(session_id, "user", user_message)
        self.db.save_message(session_id, "bot", response, response, faq_key)
        
        self.db.save_analytics(session_id, "message_processed", {
            "intent": intent,
            "entities": entities,
            "matched_faq": faq_key,
            "confidence": confidence
        })
        
        if entities.get('email') or entities.get('phone'):
            self.db.save_analytics(session_id, "contact_captured", entities)
        
        return {
            "response": response,
            "intent": intent,
            "entities": entities,
            "confidence": confidence,
            "category": category,
            "timestamp": datetime.now().isoformat()
        }
    
    def _generate_fallback_response(self, message: str, entities: Dict) -> str:
        """Generate fallback response"""
        if entities.get('email') or entities.get('phone'):
            contact = entities.get('email') or entities.get('phone')
            return (
                f"Thanks for sharing your contact details ({contact}). "
                "Our team will reach out to you within 2 hours to discuss your needs.\n\n"
                "In the meantime, feel free to ask me anything about our services."
            )
        
        return (
            "Thanks for reaching out! I'd love to help you.\n\n"
            "You can ask me about:\n\n"
            "**SEO Services:**\n"
            "• Local SEO for small businesses\n"
            "• SEO reports and tracking\n"
            "• Our complete SEO solutions\n\n"
            "**Social Media Marketing:**\n"
            "• Which platforms we manage\n"
            "• Content creation services\n"
            "• Growth timelines\n\n"
            "**Paid Advertising:**\n"
            "• Google, Facebook & Instagram Ads\n"
            "• Performance reports\n"
            "• Budget management\n\n"
            "**About BrandSetu Digital:**\n"
            "• Our services\n"
            "• Strategy creation\n"
            "• Results timeline\n"
            "• Branding services\n\n"
            "**Getting Started:**\n"
            "• How to begin\n"
            "• Free consultation\n"
            "• Flexible plans\n\n"
            "**Contact Us:**\n"
            "• Email, phone & website\n"
            "• Get in touch\n\n"
            "What would you like to know?"
        )


# Initialize chatbot
chatbot = BrandsetuChatbot()


# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.2.0"
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message'].strip()
        session_id = data.get('session_id', f"session_{datetime.now().timestamp()}")
        
        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400
        
        response_data = chatbot.generate_response(user_message, session_id)
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "data": response_data
        })
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "An error occurred processing your message"
        }), 500


@app.route('/api/conversation/<session_id>', methods=['GET'])
def get_conversation(session_id):
    """Get conversation history"""
    try:
        history = chatbot.db.get_conversation(session_id)
        return jsonify({
            "success": True,
            "data": {
                "session_id": session_id,
                "history": history,
                "message_count": len(history)
            }
        })
    except Exception as e:
        logger.error(f"Error retrieving conversation: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Error retrieving conversation"
        }), 500


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics dashboard data"""
    try:
        summary = chatbot.db.get_analytics_summary()
        return jsonify({
            "success": True,
            "data": summary
        })
    except Exception as e:
        logger.error(f"Error retrieving analytics: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Error retrieving analytics"
        }), 500


@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Submit feedback"""
    try:
        data = request.get_json()
        
        session_id = data.get('session_id')
        rating = data.get('rating')
        comment = data.get('comment', '')
        
        if not session_id or rating is None:
            return jsonify({"error": "session_id and rating are required"}), 400
        
        conn = chatbot.db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feedback (session_id, rating, comment)
            VALUES (?, ?, ?)
        ''', (session_id, rating, comment))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully"
        })
    
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Error submitting feedback"
        }), 500


@app.route('/api/welcome', methods=['GET'])
def welcome_message():
    """Get welcome message"""
    return jsonify({
        "success": True,
        "data": {
            "message": """Hey there! 👋 Welcome to BrandSetu Digital!

I'm your digital marketing assistant. I can help you with:

✅ SEO Services - Rank higher on Google
✅ Social Media Marketing - Grow your presence
✅ Paid Advertising - Generate leads with ads
✅ Branding & Strategy - Build your brand
✅ Getting Started - Free consultation

What would you like to know about?""",
            "timestamp": datetime.now().isoformat()
        }
    })


if __name__ == '__main__':
    print("🚀 Starting BrandSetu Digital Chatbot (FIXED VERSION)...")
    print("📍 Server: http://localhost:5000")
    print("\n📚 Loaded FAQs:")
    print("   ✅ SEO Services (4 FAQs)")
    print("   ✅ Social Media Marketing (4 FAQs)")
    print("   ✅ Paid Advertising (4 FAQs)")
    print("   ✅ About BrandSetu Digital (5 FAQs)")
    print("   ✅ Getting Started (4 FAQs)")
    print("   ✅ Contact Information (3 FAQs)")
    print(f"\n   Total: {len(chatbot.faqs)} FAQ responses loaded")
    print("\n📡 API Endpoints:")
    print("   POST /api/chat - Send message")
    print("   GET  /api/conversation/<session_id> - Get history")
    print("   GET  /api/analytics - Get analytics")
    print("   POST /api/feedback - Submit feedback")
    print("   GET  /api/welcome - Welcome message")
    print("   GET  /api/health - Health check")
    print("\n✨ Improvements:")
    print("   • Better keyword matching for single-word queries")
    print("   • Lower confidence threshold (0.08)")
    print("   • Enhanced scoring system")
    print("   • Better fallback responses")
    app.run(debug=True, host='0.0.0.0', port=5000)