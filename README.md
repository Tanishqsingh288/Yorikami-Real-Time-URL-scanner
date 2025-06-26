
# 🔒 Yorikami — Real-time Malicious URL Scanner Chrome Extension

![Yorikami Banner](./Frontend/graphical-assests/logo.png)

**Yorikami** is a real-time browser security extension that scans every page you visit for malicious, insecure, or suspicious links. It flags potentially harmful URLs and visually highlights them on the page to warn users — without blocking their browsing experience.

---
## 🛡️ Why Use Yorikami?

**Yorikami** is not just a browser extension — it’s your personal online safety companion. As cyber threats continue to rise, protecting yourself from phishing links, fake websites, and malicious redirects is no longer optional. **Yorikami** equips users with real-time link scanning, deep risk analysis, and visibility into the dangers hiding in plain sight.

---

### 🔥 Top 5 Reasons to Use Yorikami

---

### 1️⃣ Real-Time Link Scanning on Every Webpage  
Every time you visit a webpage, Yorikami scans all outgoing links and identifies potentially unsafe or insecure URLs. This happens automatically — no button presses, no delays.

> ✅ Immediate protection before you even click.

---

### 2️⃣ Risk Labeling + Highlighted Titles  
Yorikami doesn’t just list unsafe links — it finds their associated titles and highlights them directly on the webpage. Now, you know exactly what to avoid with bold visual cues.

> 🟡 Suspicious links are clearly marked and highlighted for your attention.

---

### 3️⃣ Powerful 10-Point Deep Analysis System  
For logged-in users, Yorikami provides a deep inspection system that performs 10 comprehensive backend security checks including:
- SSL verification  
- WHOIS data & domain age  
- Google Safe Browsing API  
- Redirect chains  
- Suspicious script detection  
- Unwanted content & tracking scripts  
- Top-level domain blacklists  
- HTTP/HTTPS integrity check  
- Domain reputation score  
- Mixed content analysis

> 🔍 Each link receives a **security score out of 10**.

---

### 4️⃣ Personal  Dashboard  
After login, users gain access to a dedicated dashboard to:
- View scan history  
- Re-analyze or delete URLs  
- Sort by date or risk  
- Manage their profile securely

> 📊 A full history of your web risks — securely stored and managed by you.

---

### 5️⃣ Built for Privacy, Always Free  
Yorikami:
- ❌ Does NOT track you  
- ❌ Does NOT sell your data  
- ❌ Does NOT require payment  
- ✅ Provides multi-factor authentication via email  
- ✅ **Offers full functionality at 0 cost**

> 💡 It’s free, private, secure — just how the internet should be.

---

## ⚠️ What Happens If You Don’t Use It?

- You might click a phishing link without realizing it  
- Insecure (HTTP) sites can steal sensitive info  
- You’ll be unaware of hidden malicious redirects  
- Your device could load spyware or keyloggers silently  
- You won’t have a record of which suspicious links you visited

> **🧨 One click is all it takes to compromise your privacy, identity, or device.**

---

### ✅ Yorikami helps you browse smarter, safer, and with full awareness.  
Start using it today. Stay informed, not infected.





## 🧭 How It Works

1. 🔍 As soon as you visit any website (e.g., news sites, blogs, shopping, etc.), **Yorikami automatically scans all the links** present on that page.
2. 🚨 It flags suspicious, insecure, or dangerous URLs and shows them in a floating scanner panel.
3. 🟡 Unsafe links are also **highlighted directly in the webpage content** using their visible anchor text or titles — so you know exactly what to avoid.
4. 👨‍💻 You remain in control — the extension **warns**, but does **not block** access to any link.
5. 🧠 If you choose, you can click **"Deep Analyse"** to:
   - Sign in / Sign up (free of cost)
   - Log unsafe URLs into your secure **dashboard**
   - Trigger a **10-point backend threat assessment system**

---

## 🚀 Features

- ✅ **Real-time Link Scanning** on any site
- 🟡 **Inline Highlighting of Unsafe Links**
- 🧠 **Intelligent Title Parsing** for clear understanding
- 🔍 **Deep Analysis with 10 Security Checks**
- 📊 **User Dashboard** for scan history & risk ratings
- 🔄 **Re-Analyse, Sort, Delete** previous links
- 🧪 **Risk Rating (0–10)** based on threat checks
- 🌈 **Theme Toggle**, Responsive Design (Bootstrap 5)
- 📬 **Email Notifications** for major user actions
- 🔐 **Multi-Factor Authentication (MFA)** with guard code
- 🛡️ **Defensive Tool, Not Restrictive** — you decide whether to visit or not
- 💬 **Feedback Form**, About Developer Section
- 🌍 **Hosted on AWS EC2** with MongoDB backend
- 🧩 Built as a **Chrome Extension (Manifest v3)**

---

## 🛠️ Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Frontend     | HTML, CSS, Bootstrap, JS, Chrome Extension APIs |
| Backend      | Node.js, Express.js                |
| Database     | MongoDB Atlas                      |
| Deployment   | AWS EC2                            |
| Auth         | JWT, Sessions, chrome.storage APIs |

---

## 🔐 10-Check Security System Includes:

1. **SSL Certificate Validation**
2. **HTTP vs HTTPS Protocol Detection**
3. **Mixed Content Check**
4. **WHOIS Age Verification**
5. **Suspicious Top-Level Domains**
6. **Redirection Chain Safety**
7. **Google Safe Browsing Blacklist**
8. **Suspicious Content Detection**
9. **Third-Party Script Audit**
10. **Unwanted Keyword/Spam Signature Check**



## 📂 Folder Structure

Yorikami/
├── Frontend/
│ ├── Real-timeUI/ # content.js, ui.js, manifest.json
│ ├── webpages/ # HTML views (auth, dashboard, etc.)
│ ├── scripts/ # JavaScript logic for auth, logout, update
│ ├── styling/ # All CSS files
├── Backend/
│ ├── checks/ # All 10 security checks
│ ├── routes/ # Express API routes
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── middlewares/ # Auth/session verification
│ ├── server.js # Main server
└── README.md (this file)




## 📜 How to Test

1. **Load the Extension** in Chrome
2. **Visit a known unsafe or HTTP-only site**
3. See links get scanned and flagged
4. Click "Deep Analyse"
5. Login/Signup
6. View your **dashboard with analysis reports**
7. Use re-analyze, sort by time/risk, or delete entries

---

## 📫 Feedback & Support

Found a bug? Want a new feature?

> Open an issue or use the in-app **Send Feedback** button to reach the developer.

---

## 👨‍💻 About the Developer

This tool was built by Tanishq Singh, a full-stack developer passionate about cybersecurity and browser technologies.

- 💼 [LinkedIn](https://www.linkedin.com/in/tanishq-singh-3249b135b/)
- 🐙 [GitHub](https://github.com/Tanishqsingh288)
- 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦🅾 [Instagram] (https://www.instagram.com/tanishqsingh6.9/)

---

## 📃 License
This project is **closed source**.

**You can not:**

Use the code for personal, educational, or commercial purposes.

Copy, modify, or redistribute any part of the codebase.

Host or make this code publicly available.

If you wish to use or contribute to this project, please contact the author directly at [singhtanishq288@gmail.com].

© Tanishq singh 2025. All rights reserved.

---

> Yorikami is a **non-invasive**, **privacy-friendly**, and **defensive utility** built to empower the modern internet user — because **you deserve to browse safely**.





------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------🔒 よりかみ — リアルタイム あくいＵＲＬ スキャナー Ｃｈｒｏｍｅ エクステンション


よりかみ は、あなたが けんさくする すべてのページで、リンクをリアルタイムで すきゃん して、あぶない ＵＲＬ を みつけて、ページのうえで ちゅういを あたえてくれる ブラウザ つーる です。アクセスを ブロックすることなく、リンクを ハイライトして あんぜんに つたえます。

🛡️ なぜ よりかみ を つかうの？
よりかみ は、たんなる つーる では ありません。あなたの せーふてぃー を まもる パートナーです。いま サイバーの きけん が ふえているため、フィッシング や にせもの サイト から みを まもることは ひつよう です。よりかみ は、リアルタイムでのリンク スキャン と きけんの けんしゅつ を おこなって、あなたに あんしんを あたえます。

🔥 よりかみ を つかう ５つの りゆう
1️⃣ ページをひらくと すぐに リアルタイムスキャン
ページを ひらくと、よりかみ は そのなかの すべてのリンク を すぐに チェック します。ボタンを おす ひつよう は ありません。

✅ クリックまえに よりかみ が まもってくれます。

2️⃣ あやしい リンク を ハイライト
ただ あぶないリンク を ならべるだけでなく、その タイトル も みつけて、ページのなかで ハイライトして しめします。

🟡 きけんなリンクが、はっきり わかります。

3️⃣ １０ポイントの ぶかつけんさシステム
ログイン すると、つぎのような１０のチェック を じっこうできます：

ＳＳＬしょうめい の けんさ

ドメインねんれい の ちぇっく

Ｇｏｏｇｌｅ セーフ ブラウジング ちぇっく

リダイレクトの ながれ を けんさ

あやしい スクリプト の はんだん

こじんてき な そしき が つかう くっきー の けんさ

きけんな ドメイン の ちぇっく

ＨＴＴＰ／ＨＴＴＰＳ の せいど

ひょうばん の てんけい

コンテンツ が まざっているか の けんさ

🔍 リンクごとに ０〜１０ の スコア を つけます。

4️⃣ あなただけの ダッシュボード
ログイン すると、じぶんの ダッシュボード が つかえます：

スキャンの りれき を かくにん

ＵＲＬ を ふたたび けんさ

ひづけ や きけんど で しゅうじゅん

じぶんの プロフィール を せってい

📊 あなたが かこに ひらいた あやしいページ を かくにん できます。

5️⃣ プライバシーを まもって、ぜんぶ むりょう
よりかみ は：

❌ ユーザー を とうろく しません

❌ データ を うりません

❌ おかね を とりません

✅ メールで ２だんかい にんしょう を します

✅ ぜんきのう が むりょうで つかえます

💡 プライベート で あんしん、しかも むりょう。

⚠️ つかわなかったら？
フィッシングリンク を クリックしてしまうかも

ＨＴＴＰ の サイト で じょうほう が ぬすまれる

かくれた リダイレクト に きづかない

スパイウェア や キーロガー が うごくかも

あやしい リンクの りれき を みれない

🧨 １クリック で、プライバシー と でんしきき が きけん に！

✅ よりかみ で あんぜんに ブラウズ しよう
いま すぐ はじめよう！

🧭 はたらきかた
🔍 どのサイトでも ページをひらくと、よりかみ がリンク を スキャンします

🚨 あやしいリンク は フローティングパネル に ひょうじ

🟡 ページのなか の テキスト に ハイライト を つけます

👨‍💻 アクセス は ブロック されず、けいこく のみ

🧠 「ディープ アナライズ」 を おすと：

サインイン／サインアップ（むりょう）

あやしいリンク を ダッシュボード に きろく

１０けんさ を じっこう

🚀 きのう
✅ リアルタイムリンクスキャン

🟡 あやしいリンク の ハイライト

🧠 タイトル を みやすく ひょうじ

🔍 １０ポイント チェックシステム

📊 ダッシュボード で かんり

🔄 さいけんさ、ソート、さくじょ

🧪 スコア（０〜１０）

🌈 テーマ きりかえ、スマホたいおう

📬 メールつうち

🔐 ２だんかい にんしょう

🛡️ けいこく のみ、ブロックなし

💬 フィードバックフォーム

🌍 ＡＷＳ ＥＣ２ に ホスト

🧩 Ｃｈｒｏｍｅ エクステンション（Ｍａｎｉｆｅｓｔ ｖ３）

🛠️ テックスタック
レイヤー	つかったもの
フロントエンド	ＨＴＭＬ, ＣＳＳ, Ｂｏｏｔｓｔｒａｐ, ＪＳ, Ｃｈｒｏｍｅ ＡＰＩ
バックエンド	Ｎｏｄｅ．ｊｓ, Ｅｘｐｒｅｓｓ．ｊｓ
データベース	ＭｏｎｇｏＤＢ Ａｔｌａｓ
デプロイ	ＡＷＳ ＥＣ２
にんしょう	ＪＷＴ, Ｓｅｓｓｉｏｎｓ, ｃｈｒｏｍｅ．ｓｔｏｒａｇｅ

🔐 １０の セキュリティ チェック
ＳＳＬ の しょうめい けんさ

ＨＴＴＰ と ＨＴＴＰＳ の くべつ

コンテンツ が まざっているか どうか

ＷＨＯＩＳ で ねんれい を ちぇっく

あやしい ドメインレベル

リダイレクト の ながれ の ちぇっく

Ｇｏｏｇｌｅ セーフブラウジング ブラックリスト

きけんな コンテンツ

サードパーティ の スクリプト ちぇっく

スパム ことば の けんさ

📂 フォルダーこうぞう
pgsql
Copy
Edit
よりかみ/
├── Frontend/
│   ├── Real-timeUI/
│   ├── webpages/
│   ├── scripts/
│   ├── styling/
├── Backend/
│   ├── checks/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   └── server.js
└── README.md
📜 テストの しかた
Ｃｈｒｏｍｅ で エクステンション を よみこむ

ＨＴＴＰ サイト など を ひらく

リンク が スキャン され、ハイライト を かくにん

「ディープ アナライズ」 を おす

サインイン／サインアップ

ダッシュボード を みる

リンク の ソート や さくじょ を ためす

📫 フィードバック と サポート
バグ が あった？ きのう を ふやしたい？

アプリの「フィードバックそうしん」 ボタン または ＧｉｔＨｕｂ で れんらくしてね！

👨‍💻 かいはつしゃ
この つーる は、Ｔａｎｉｓｈｑ Ｓｉｎｇｈ に よって つくられました。サイバー セキュリティ と ブラウザ テクノロジー が だいすき な フルスタック デベロッパー です。

💼 ＬｉｎｋｅｄＩｎ

🐙 ＧｉｔＨｕｂ

📷 Ｉｎｓｔａｇｒａｍ

📃 ライセンス
この プロジェクト は クローズドソース です。

できません：

こーど の つかいまわし（べんきょう・じっけん・しょうぎょう）

こーど の へんこう、てんぷ

こうかい、ホスティング

つかいたいばあい は
📧 singhtanishq288@gmail.com に ごれんらく ください。

© Ｔａｎｉｓｈｑ Ｓｉｎｇｈ ２０２５

よりかみ は、けいこく を あたえる プライバシー に やさしい つーる です。
あなたには、もっと あんぜんな ブラウジング が ひつよう です。