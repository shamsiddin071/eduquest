// Knowledge base & reasoning engine for EduQuest AI Mentor
export async function queryAiMentor(userMessage, currentLang = 'en') {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const cleanInput = userMessage.trim();

  // 1. If Gemini API Key is configured in .env, call live Gemini API
  if (geminiApiKey && !geminiApiKey.includes('placeholder')) {
    try {
      const systemInstruction = currentLang === 'uz'
        ? `Siz EduQuest platformasining shaxsiy sun'iy intellekt repetitori (AI Mentor)siz. Siz talabalarga EduQuest platformasidan foydalanish (60s Sprint, Mistake-to-Mission adaptiv qayta tiklash, XP, darajalar) va ta'lim fanlari (Matematika, SAT Math, Fizika, IELTS Academic, Kompyuter Ilmlari va AI, Kriptografiya) bo'yicha professional, do'stona va aniq yordam berasiz. Javoblarni qisqa, tushunarli va chiroyli formatda bering.`
        : `You are EduQuest's AI Mentor and Study Coach. You assist learners with both EduQuest platform mechanics (60s Sprint, Mistake-to-Mission adaptive recovery, XP system, levels, streaks) and academic tutoring across all subjects (Mathematics, SAT Math, Physics, IELTS Academic, Computer Science & AI, Cryptocurrency & DeFi). Keep answers structured, encouraging, concise, and clear.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${cleanInput}` }]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) return generatedText;
      }
    } catch (apiError) {
      console.warn('Live AI API fallback:', apiError);
    }
  }

  // 2. Autonomous Offline Semantic Knowledge Engine
  return generateAutonomousResponse(cleanInput, currentLang);
}

function generateAutonomousResponse(query, lang) {
  const q = query.toLowerCase();

  // --- PLATFORM QUERIES ---
  if (q.includes('mistake') || q.includes('xato') || q.includes('mission') || q.includes('missiya')) {
    return lang === 'uz'
      ? `🛡️ **"Mistake-to-Mission" (Xatodan-Missiyaga) qanday ishlaydi?**\n\nBu EduQuest-ning asosiy adaptiv o'rganish mexanizmi:\n1. **Avtomatik To'xtash:** 60 soniyalik sprintda xato javob bersangiz, vaqt taymeri bir zumda to'xtatiladi.\n2. **Taktik Tahlil:** Nega bu javob xato ekanligi va to'g'ri formulani tushuntiruvchi tahlil ochiladi.\n3. **Qutqaruv Missiyasi:** Sizga shu mavzuni mustahkamlovchi soddalashtirilgan savol (Fallback Question) beriladi.\n4. **Mukofot:** Soddalashtirilgan savolga to'g'ri javob berganingizda, sizga **+5 Qayta Tiklash XP** beriladi, taymer qayta ishga tushadi va seriyangiz davom etadi!`
      : `🛡️ **How does "Mistake-to-Mission" work?**\n\nIt is EduQuest's signature adaptive learning engine:\n1. **Immediate Pause:** If you miss an answer during a 60s Sprint, the clock automatically freezes.\n2. **Tactical Debrief:** You receive an instant breakdown explaining the correct concept.\n3. **Redemption Mission:** You are given a simpler fallback question to ensure concept mastery.\n4. **Recovery Reward:** Solving the fallback awards **+5 Recovery XP**, unfreezes your timer, and preserves your study momentum!`;
  }

  if (q.includes('sprint') || q.includes('speed') || q.includes('timer') || q.includes('vaqt') || q.includes('qanday o\'ynash')) {
    return lang === 'uz'
      ? `⚡ **60 Soniyalik Sprint Qoidalari:**\n\n- **Davomiyligi:** 60 soniya.\n- **Asosiy Ball:** Har bir to'g'ri javob uchun **+10 XP**.\n- **Kombinatsiya:** 3 ta ketma-ket to'g'ri javobdan so'ng **+5 Combo Bonus** qo'shiladi.\n- **Mavzular:** Xohlagan fanni va kichik mavzuni tanlab yoki barcha fanlarni aralash holda mashq qilishingiz mumkin.`
      : `⚡ **60-Second Sprint Rules:**\n\n- **Duration:** 60 seconds of rapid-fire problem solving.\n- **Base Reward:** **+10 XP** per correct answer.\n- **Streak Multiplier:** Scoring 3+ correct answers consecutively activates **+5 Combo XP** bonuses.\n- **Custom Tracks:** You can pick a specific subject and topic, or tackle the mixed arena!`;
  }

  if (q.includes('xp') || q.includes('level') || q.includes('daraja') || q.includes('streak') || q.includes('seriya') || q.includes('ball')) {
    return lang === 'uz'
      ? `🏆 **Darajalar va Ketma-ketlik (Streak) Tizimi:**\n\n- **Level Up:** Har 200 XP to'plaganingizda yangi darajaga (Level) ko'tarilasiz.\n- **Kunlik Seriya (Streak):** Har kuni kamida 1 marta sprint mashqini bajarsangiz, olovingiz o'chmaydi!\n- **Reyting:** To'plagan jami XP ballaringiz sizni Global Leaderboard (Yetakchilar jadvali)da yuqoriga olib chiqadi.`
      : `🏆 **XP, Levels & Streak System:**\n\n- **Level Progression:** You gain a new rank for every 200 XP earned ($Level = \\lfloor XP / 200 \\rfloor + 1$).\n- **Daily Streak:** Complete at least one Sprint daily to fuel your flame multiplier.\n- **Leaderboard:** Your total XP determines your standing on the Global Champions Ladder.`;
  }

  // --- ACADEMIC & SUBJECT TUTORING ---

  // PHYSICS
  if (q.includes('physics') || q.includes('fizika') || q.includes('newton') || q.includes('force') || q.includes('kuch') || q.includes('photon') || q.includes('foton') || q.includes('thermodynamic')) {
    return lang === 'uz'
      ? `⚛️ **Fizika bo'yicha qo'llanma:**\n\n- **Nyutonning II Qonuni:** $F = m \\cdot a$ (Kuch = Massa × Tezlanish). Masalan: 1,500 kg avtomobil $6\\text{ m/s}^2$ tezlanish olsa: $F = 9,000\\text{ N}$.\n- **Foton Energiyasi (Plank tenglamasi):** $E = h \\cdot f = \\frac{h \\cdot c}{\\lambda}$, bunda $h \\approx 6.63 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$.\n- **Karno Tsikli Foydali Ish Koeffitsiyenti:** $\\eta = 1 - \\frac{T_c}{T_h}$.\n\nQaysi formula yoki tushuncha bo'yicha batafsil misol ko'rishni xohlaysiz?`
      : `⚛️ **Physics Study Guide & Key Formulas:**\n\n- **Newton's Second Law:** $F = m \\cdot a$ (Force equals mass times acceleration). Example: A 1,500 kg vehicle accelerating at $6\\text{ m/s}^2$ requires $F = 1500 \\times 6 = 9,000\\text{ N}$.\n- **Photon Energy (Planck-Einstein):** $E = h \\cdot f = \\frac{h \\cdot c}{\\lambda}$, where $h \\approx 6.63 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$.\n- **Carnot Thermal Efficiency:** $\\eta = 1 - \\frac{T_c}{T_h}$.\n\nWhich specific physics topic would you like to practice or break down?`;
  }

  // IELTS ACADEMIC
  if (q.includes('ielts') || q.includes('english') || q.includes('ingliz') || q.includes('vocab') || q.includes('paraphrase') || q.includes('reading') || q.includes('writing')) {
    return lang === 'uz'
      ? `📖 **IELTS Academic Tayyorgarlik Maslahatlari:**\n\n1. **Paraphrasing (Qayta ifodalash):** Asl ma'noni buzmasdan sinonimlar va grammatik tuzilmani o'zgartirish (masalan: *Despite emission caps* $\\rightarrow$ *Even though emission thresholds were enforced*).\n2. **Academic Collocations:** Kundalik so'zlar o'rniga yuqori darajadagi akademik fe'llardan foydalaning (masalan: *confirm* o'rniga *corroborate*, *substantiate*).\n3. **Inversion Structures:** Murakkab sintaksis uchun: *“Had the data been reviewed, the error would have been prevented.”*\n\nIELTS Reading, Writing yoki Lug'at bo'yicha savolingiz bormi?`
      : `📖 **IELTS Academic Mastery Tips:**\n\n1. **Precise Paraphrasing:** Alter sentence syntax and lexical items without semantic drift (e.g., *“Despite strict caps”* $\\rightarrow$ *“Even though stringent thresholds were enforced”*).\n2. **High-Band Academic Collocations:** Upgrade standard terms to scholarly verbs (e.g., replace *prove/support* with *corroborate*, *substantiate*, or *validate*).\n3. **Grammatical Inversion:** Use elevated conditionals: *“Had the researchers noticed the discrepancy, the anomaly would have been resolved.”*\n\nWould you like a sample IELTS reading breakdown or vocabulary quiz?`;
  }

  // MATHEMATICS & CALCULUS
  if (q.includes('math') || q.includes('matematika') || q.includes('calculus') || q.includes('integral') || q.includes('derivative') || q.includes('hosila') || q.includes('probability') || q.includes('ehtimollik')) {
    return lang === 'uz'
      ? `📐 **Matematika & Hisob Asoslari:**\n\n- **Daraja Qoidasi (Hosila):** $\\frac{d}{dx}[a \\cdot x^n] = n \\cdot a \\cdot x^{n-1}$. Masalan: $f(x) = 3x^2 \\rightarrow f'(x) = 6x$.\n- **Funksiya Ekstremumi (Minimum/Maksimum):** Parabola cho'qqisi $x = -\\frac{b}{2a}$ yoki $f'(x) = 0$.\n- **Mustaqil Ehtimolliklar:** $P(A \\text{ va } B) = P(A) \\times P(B)$. Agar $P(A)=0.9$ va $P(B)=0.9$ bo'lsa, birgalikdagi ehtimollik $0.81$ (81%).\n- **Vektorlar Skalyar Ko'paytmasi:** $u \\cdot v = u_x v_x + u_y v_y$. Agar natija 0 bo'lsa, vektorlar perpendikulyar (ortogonal)!`
      : `📐 **Mathematics & Calculus Reference:**\n\n- **Power Rule for Derivatives:** $\\frac{d}{dx}[a \\cdot x^n] = n \\cdot a \\cdot x^{n-1}$. E.g., $\\frac{d}{dx}[3x^2] = 6x$.\n- **Optimization & Extrema:** Quadratic vertex occurs at $x = -\\frac{b}{2a}$ or where first derivative $f'(x) = 0$.\n- **Independent Probability:** $P(A \\cap B) = P(A) \\times P(B)$. Two 90% scans yielding success: $0.9 \\times 0.9 = 81\\%$.\n- **Orthogonal Dot Product:** If $u \\cdot v = u_1 v_1 + u_2 v_2 = 0$, the angle between the vectors is exactly $90^\\circ$.`;
  }

  // COMPUTER SCIENCE & AI
  if (q.includes('cs') || q.includes('computer') || q.includes('algorithm') || q.includes('neural') || q.includes('ai') || q.includes('hash') || q.includes('transformer') || q.includes('dijkstra')) {
    return lang === 'uz'
      ? `💻 **Kompyuter Ilmlari & AI Konspekti:**\n\n- **Transformer Self-Attention:** $Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$. $(512, 64) \\times (64, 512) \\rightarrow (512, 512)$ o'lchamli diqqat matritsasini hosil qiladi.\n- **Hash Table Kolliziyalari:** O'rtacha qidirish $O(1)$, lekin barcha kalitlar bitta qatorga to'plansa (worst-case) linked list tufayli $O(N)$ bo'ladi.\n- **Dijkstra Algoritmi:** Manfiy bo'lmagan og'irliklarga ega grafda eng qisqa yo'lni min-heap bilan $O((V+E)\\log V)$ da topadi.`
      : `💻 **Computer Science & AI Quick Guide:**\n\n- **Transformer Self-Attention:** Attention score matrix dimensions: $(M, K) \\times (K, N) \\rightarrow (M, N)$. Multiplying Query $(512, 64)$ with transposed Key $(64, 512)$ yields shape $(512, 512)$.\n- **Hash Table Complexity:** Average lookup is $O(1)$; worst-case collision into an unindexed linked list degrades to $O(N)$.\n- **Dijkstra's Algorithm:** Finds single-source shortest paths on non-negative weighted graphs in $O((V+E)\\log V)$ using a priority queue.`;
  }

  // CRYPTOCURRENCY & DEFI
  if (q.includes('crypto') || q.includes('kripto') || q.includes('bitcoin') || q.includes('halving') || q.includes('amm') || q.includes('defi') || q.includes('uniswap')) {
    return lang === 'uz'
      ? `🪙 **Kriptovalyuta & DeFi Matematikasi:**\n\n- **Bitcoin Halving:** Har 210,000 blokda mukofot 50% ga kamayadi: 50 BTC $\\rightarrow$ 25 $\\rightarrow$ 12.5 $\\rightarrow$ 6.25 BTC.\n- **AMM Doimiy Ko'paytma Formulasi (Uniswap):** $x \\cdot y = k$. Agar ETH miqdori oshsa, USDC miqdori $y = \\frac{k}{x}$ formula bo'yicha kamayadi.\n- **Asimmetrik Kriptografiya (ECDSA):** Shaxsiy kalit (Private Key) tranzaksiyani imzolash uchun, ochiq kalit (Public Key) esa uni tekshirish uchun xizmat qiladi.`
      : `🪙 **Cryptocurrency & DeFi Mechanics:**\n\n- **Bitcoin Halving:** Block subsidies cut by 50% every 210,000 blocks: $50 \\rightarrow 25 \\rightarrow 12.5 \\rightarrow 6.25\\text{ BTC}$.\n- **Constant Product AMM ($x \\cdot y = k$):** In liquidity pools, token balances trade inversely to maintain invariant constant $k$.\n- **ECDSA Signatures:** Elliptic curve cryptography generates one-way digital signatures verifiable with public keys without exposing private keys.`;
  }

  // GENERAL STUDY TIPS
  return lang === 'uz'
    ? `🎓 **Salom! Men EduQuest AI Mentoriman.**\n\nMen sizga quyidagilarda yordam bera olaman:\n- 🎯 **Platforma bo'yicha:** 60s Sprint qoidalari, Mistake-to-Mission tizimi, XP va seriyalar.\n- 📚 **Fanlar bo'yicha:** Matematika, Fizika, IELTS Academic, SAT Math, Dasturlash va Kriptografiya.\n- 💡 **O'rganish strategiyasi:** Qanday qilib samarali takrorlash va testlarda yuqori natija olish.\n\nNimani tushunishni xohlaysiz? Qiziqtirgan savolingizni yozing!`
    : `🎓 **Hello! I am your EduQuest AI Mentor & Study Coach.**\n\nI can assist you with:\n- 🎯 **Platform Mechanics:** 60s Sprint rules, the Mistake-to-Mission recovery engine, and XP/streak ladders.\n- 📚 **Subject Knowledge:** Mathematics, Physics, IELTS Academic, SAT Math, Computer Science, and DeFi.\n- 💡 **Study Strategy:** Memorization techniques, problem solving, and test preparation.\n\nFeel free to ask any question or pick one of the study prompts above!`;
}
