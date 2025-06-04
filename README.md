
# 🔒 Yorikami — Real-time Malicious Link Scanner Chrome Extension

![Yorikami Banner](./graphicalAssets/logo.png)

**Yorikami** is a real-time browser security extension that scans every page you visit for malicious, insecure, or suspicious links. It flags potentially harmful URLs and visually highlights them on the page to warn users — without blocking their browsing experience.

---
## 🛡️ Why Use Yorikami?

**WebGuardX** is not just a browser extension — it’s your personal online safety companion. As cyber threats continue to rise, protecting yourself from phishing links, fake websites, and malicious redirects is no longer optional. WebGuardX equips users with real-time link scanning, deep risk analysis, and visibility into the dangers hiding in plain sight.

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





------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                              **日本語版**

# 🔒 よりかみ — リアルタイム あくいリンク スキャナー Chrome エクステンション

![Yorikami バナー](./graphicalAssets/logo.png)

**よりかみ** は、リアルタイムで あぶないリンクや けいかいがひつような URL を すべてチェックして、ページじょうに ハイライトでしらせてくれる、あんぜんな ブラウザ ツールです。

---

## 🛡️ なぜ「よりかみ」を つかうべき？

**よりかみ** は ただのエクステンションでは ありません。あなたの インターネット せいかつを まもる パートナーです。サイバーこうげきや フィッシングのきけんが ふえている いま、リンクチェックは かならず ひつようです。

---

### 🔥 「よりかみ」を つかうべき ５つの りゆう

---

### 1️⃣ リアルタイム リンク スキャン  
ページをひらいたときに、**すべてのリンクを じどうでスキャン**します。ボタンを おす ひつようは ありません。

> ✅ クリックまえに あんぜんを かくにん。

---

### 2️⃣ リスク ラベル ＋ ハイライト タイトル  
あやしいリンクを たんに ひょうじする だけでなく、リンクのタイトルを みつけて ページじょうに ハイライト します。

> 🟡 ちゅういすべき リンクが ひとめで わかります。

---

### 3️⃣ １０ポイント ぶかつけんさ システム  
ログインした ユーザーは、１０この ぶかつな セキュリティ チェックを じっこうできます：

- SSL しょうめい のチェック  
- WHOIS データ・ドメインねんれい  
- Google セーフ ブラウジング API  
- リダイレクト チェーン  
- スクリプト けんさ  
- トラッキング こうもく  
- TLD ブラックリスト  
- HTTP/HTTPS の チェック  
- ドメインの ひょうばん  
- コンテンツ まぜこみ チェック

> 🔍 すべてのリンクに 「セキュリティ スコア（１０てんまんてん）」を ふよ。

---

### 4️⃣ パーソナル ダッシュボード  
ログインすると、あなたようの ダッシュボードが つかえます：

- スキャン の りれき ひょうじ  
- URL を さいけんさ  
- ひづけ や リスク で ソート  
- プロフィール の せってい

> 📊 あなたの かこに アクセスした きけんなリンクを かんりできます。

---

### 5️⃣ プライバシー じゅうし ＆ ぜんきのう むりょう  
「よりかみ」 は：

- ❌ ユーザー を トラッキングしません  
- ❌ データ を はんばいしません  
- ❌ きんゆうひつよう なし  
- ✅ メール による２だんかい にんしょうあり  
- ✅ **すべて むりょうで つかえます**

> 💡 プライベートで、あんしん、しかも むりょう。

---

## ⚠️ つかわなかったら どうなる？

- フィッシング リンク を まちがってクリックするかも  
- HTTP サイト で じょうほうが ぬすまれるかも  
- かくれたリダイレクト に きづかない  
- スパイウェア や キーロガー が しらないうちに はいってくる  
- あやしいリンクの りれき を みれない

> **🧨 たった１クリックで、プライバシーや デバイスが あやうくなる！**

---

### ✅ よりかみ で、かしこく・あんぜんに・しっかり けいかいして ブラウズしよう！  
いま すぐ はじめよう。じぶんを まもろう。

---

## 🧭 はたらきかた

1. 🔍 どの ウェブサイトでも、ページをひらくと **すべてのリンクを じどうスキャン**  
2. 🚨 あやしいリンクを フローティングパネルに ひょうじ  
3. 🟡 ページじょうの リンク テキストを ハイライト  
4. 👨‍💻 アクセスを ブロックせず、けいこく のみ  
5. 🧠 「ディープ アナライズ」ボタンで：

   - サインイン／サインアップ（むりょう）  
   - リンクを ダッシュボードに ほぞん  
   - １０ポイントけんさ を しどう

---

## 🚀 とくちょう

- ✅ じっこうちゅうのリンク スキャン  
- 🟡 ページじょうの リンク ハイライト  
- 🧠 リンク タイトル を かんたんに りかい  
- 🔍 １０ポイント けんさ  
- 📊 ダッシュボード で けんさりれき を かんり  
- 🔄 さいけんさ、じかんやリスクで ソート、さくじょ  
- 🧪 ０〜１０ の リスク スコア  
- 🌈 テーマ きりかえ、レスポンシブ デザイン  
- 📬 メールで おしらせ  
- 🔐 メールコード による ２だんかい にんしょう  
- 🛡️ しらせるだけ・ブロックなし  
- 💬 フィードバック フォーム、開発者しょうかい  
- 🌍 AWS EC2 にホスト、MongoDB つかってます  
- 🧩 Chrome エクステンション（Manifest v3）

---

## 🛠️ テック スタック

| レイヤー        | つかったもの                    |
|------------------|-------------------------------|
| フロントエンド     | HTML, CSS, Bootstrap, JS, Chrome API |
| バックエンド       | Node.js, Express.js          |
| データベース       | MongoDB Atlas                |
| デプロイ         | AWS EC2                      |
| にんしょう         | JWT, Sessions, chrome.storage |

---

## 🔐 １０チェック セキュリティ システム：

1. SSL しょうめいチェック  
2. HTTP vs HTTPS しきべつ  
3. コンテンツ まぜこみ チェック  
4. WHOIS ねんれい  
5. あやしい ドメインレベル  
6. リダイレクトチェーン  
7. Google ブラックリスト  
8. ふしんリンク コンテンツ  
9. サードパーティ スクリプト  
10. スパム・きんしワード チェック

---

## 📂 フォルダー こうぞう

Yorikami/
├── Frontend/
│ ├── Real-timeUI/
│ ├── webpages/
│ ├── scripts/
│ ├── styling/
├── Backend/
│ ├── checks/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middlewares/
│ └── server.js
└── README.md



---

## 📜 テスト ほうほう

1. Chrome に エクステンションを ロード  
2. HTTP サイトや あんぜんでないサイトを ひらく  
3. リンクが スキャンされ ハイライトされるのを かくにん  
4. 「ディープ アナライズ」をクリック  
5. サインイン／サインアップ  
6. ダッシュボードで スキャン けっかを チェック  
7. ソートや さくじょ を ためす

---

## 📫 フィードバック・サポート

バグを みつけた？ きのう ついかの ようぼうがある？

> GitHub の イシュー か、アプリの 「Send Feedback」ボタンで おしえてね！

---

## 👨‍💻 かいはつしゃについて

この ツールは、**Tanishq Singh** によって つくられました。フルスタック デベロッパーで、サイバー セキュリティと ブラウザ テクノロジーに きょうみを もっています。

- 💼 [LinkedIn](https://www.linkedin.com/in/tanishq-singh-3249b135b/)  
- 🐙 [GitHub](https://github.com/Tanishqsingh288)

---

## 📃 ライセンス

この プロジェクトは **クローズドソース** です。

**できません：**

- コードの りよう（しどう・きょういく・しょうぎょう）  
- コードの かいぞう や てんぷ  
- パブリック に こうかい

**つかいたいばあい、または きょうりょくしたいばあいは：**  
➡️ [singhtanishq288@gmail.com](mailto:singhtanishq288@gmail.com) に ごれんらくください。

© Tanishq Singh 2025. All rights reserved.

---

> よりかみ は、**けいかいをうながす**、**プライバシーしんちょう**、**あんぜんじゅうし** のユーティリティです。あなたには、**もっと あんぜんな ブラウジング**が ひつようです。
=======
# 🔒 Yorikami — Real-time Malicious Link Scanner Chrome Extension

![Yorikami Banner](./Frontend/graphical assests/logo.png)

**Yorikami** is a real-time browser security extension that scans every page you visit for malicious, insecure, or suspicious links. It flags potentially harmful URLs and visually highlights them on the page to warn users — without blocking their browsing experience.

---
## 🛡️ Why Use Yorikami?

**Yorikami** is not just a browser extension — it’s your personal online safety companion. As cyber threats continue to rise, protecting yourself from phishing links, fake websites, and malicious redirects is no longer optional. WebGuardX equips users with real-time link scanning, deep risk analysis, and visibility into the dangers hiding in plain sight.

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





------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                                                                            **日本語版**

# 🔒 よりかみ — リアルタイム あくいリンク スキャナー Chrome エクステンション

![Yorikami バナー](./graphicalAssets/logo.png)

**よりかみ** は、リアルタイムで あぶないリンクや けいかいがひつような URL を すべてチェックして、ページじょうに ハイライトでしらせてくれる、あんぜんな ブラウザ ツールです。

---

## 🛡️ なぜ「よりかみ」を つかうべき？

**よりかみ** は ただのエクステンションでは ありません。あなたの インターネット せいかつを まもる パートナーです。サイバーこうげきや フィッシングのきけんが ふえている いま、リンクチェックは かならず ひつようです。

---

### 🔥 「よりかみ」を つかうべき ５つの りゆう

---

### 1️⃣ リアルタイム リンク スキャン  
ページをひらいたときに、**すべてのリンクを じどうでスキャン**します。ボタンを おす ひつようは ありません。

> ✅ クリックまえに あんぜんを かくにん。

---

### 2️⃣ リスク ラベル ＋ ハイライト タイトル  
あやしいリンクを たんに ひょうじする だけでなく、リンクのタイトルを みつけて ページじょうに ハイライト します。

> 🟡 ちゅういすべき リンクが ひとめで わかります。

---

### 3️⃣ １０ポイント ぶかつけんさ システム  
ログインした ユーザーは、１０この ぶかつな セキュリティ チェックを じっこうできます：

- SSL しょうめい のチェック  
- WHOIS データ・ドメインねんれい  
- Google セーフ ブラウジング API  
- リダイレクト チェーン  
- スクリプト けんさ  
- トラッキング こうもく  
- TLD ブラックリスト  
- HTTP/HTTPS の チェック  
- ドメインの ひょうばん  
- コンテンツ まぜこみ チェック

> 🔍 すべてのリンクに 「セキュリティ スコア（１０てんまんてん）」を ふよ。

---

### 4️⃣ パーソナル ダッシュボード  
ログインすると、あなたようの ダッシュボードが つかえます：

- スキャン の りれき ひょうじ  
- URL を さいけんさ  
- ひづけ や リスク で ソート  
- プロフィール の せってい

> 📊 あなたの かこに アクセスした きけんなリンクを かんりできます。

---

### 5️⃣ プライバシー じゅうし ＆ ぜんきのう むりょう  
「よりかみ」 は：

- ❌ ユーザー を トラッキングしません  
- ❌ データ を はんばいしません  
- ❌ きんゆうひつよう なし  
- ✅ メール による２だんかい にんしょうあり  
- ✅ **すべて むりょうで つかえます**

> 💡 プライベートで、あんしん、しかも むりょう。

---

## ⚠️ つかわなかったら どうなる？

- フィッシング リンク を まちがってクリックするかも  
- HTTP サイト で じょうほうが ぬすまれるかも  
- かくれたリダイレクト に きづかない  
- スパイウェア や キーロガー が しらないうちに はいってくる  
- あやしいリンクの りれき を みれない

> **🧨 たった１クリックで、プライバシーや デバイスが あやうくなる！**

---

### ✅ よりかみ で、かしこく・あんぜんに・しっかり けいかいして ブラウズしよう！  
いま すぐ はじめよう。じぶんを まもろう。

---

## 🧭 はたらきかた

1. 🔍 どの ウェブサイトでも、ページをひらくと **すべてのリンクを じどうスキャン**  
2. 🚨 あやしいリンクを フローティングパネルに ひょうじ  
3. 🟡 ページじょうの リンク テキストを ハイライト  
4. 👨‍💻 アクセスを ブロックせず、けいこく のみ  
5. 🧠 「ディープ アナライズ」ボタンで：

   - サインイン／サインアップ（むりょう）  
   - リンクを ダッシュボードに ほぞん  
   - １０ポイントけんさ を しどう

---

## 🚀 とくちょう

- ✅ じっこうちゅうのリンク スキャン  
- 🟡 ページじょうの リンク ハイライト  
- 🧠 リンク タイトル を かんたんに りかい  
- 🔍 １０ポイント けんさ  
- 📊 ダッシュボード で けんさりれき を かんり  
- 🔄 さいけんさ、じかんやリスクで ソート、さくじょ  
- 🧪 ０〜１０ の リスク スコア  
- 🌈 テーマ きりかえ、レスポンシブ デザイン  
- 📬 メールで おしらせ  
- 🔐 メールコード による ２だんかい にんしょう  
- 🛡️ しらせるだけ・ブロックなし  
- 💬 フィードバック フォーム、開発者しょうかい  
- 🌍 AWS EC2 にホスト、MongoDB つかってます  
- 🧩 Chrome エクステンション（Manifest v3）

---

## 🛠️ テック スタック

| レイヤー        | つかったもの                    |
|------------------|-------------------------------|
| フロントエンド     | HTML, CSS, Bootstrap, JS, Chrome API |
| バックエンド       | Node.js, Express.js          |
| データベース       | MongoDB Atlas                |
| デプロイ         | AWS EC2                      |
| にんしょう         | JWT, Sessions, chrome.storage |

---

## 🔐 １０チェック セキュリティ システム：

1. SSL しょうめいチェック  
2. HTTP vs HTTPS しきべつ  
3. コンテンツ まぜこみ チェック  
4. WHOIS ねんれい  
5. あやしい ドメインレベル  
6. リダイレクトチェーン  
7. Google ブラックリスト  
8. ふしんリンク コンテンツ  
9. サードパーティ スクリプト  
10. スパム・きんしワード チェック

---

## 📂 フォルダー こうぞう

Yorikami/
├── Frontend/
│ ├── Real-timeUI/
│ ├── webpages/
│ ├── scripts/
│ ├── styling/
├── Backend/
│ ├── checks/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middlewares/
│ └── server.js
└── README.md



---

## 📜 テスト ほうほう

1. Chrome に エクステンションを ロード  
2. HTTP サイトや あんぜんでないサイトを ひらく  
3. リンクが スキャンされ ハイライトされるのを かくにん  
4. 「ディープ アナライズ」をクリック  
5. サインイン／サインアップ  
6. ダッシュボードで スキャン けっかを チェック  
7. ソートや さくじょ を ためす

---

## 📫 フィードバック・サポート

バグを みつけた？ きのう ついかの ようぼうがある？

> GitHub の イシュー か、アプリの 「Send Feedback」ボタンで おしえてね！

---

## 👨‍💻 かいはつしゃについて

この ツールは、**Tanishq Singh** によって つくられました。フルスタック デベロッパーで、サイバー セキュリティと ブラウザ テクノロジーに きょうみを もっています。

- 💼 [LinkedIn](https://www.linkedin.com/in/tanishq-singh-3249b135b/)  
- 🐙 [GitHub](https://github.com/Tanishqsingh288)

---

## 📃 ライセンス

この プロジェクトは **クローズドソース** です。

**できません：**

- コードの りよう（しどう・きょういく・しょうぎょう）  
- コードの かいぞう や てんぷ  
- パブリック に こうかい

**つかいたいばあい、または きょうりょくしたいばあいは：**  
➡️ [singhtanishq288@gmail.com](mailto:singhtanishq288@gmail.com) に ごれんらくください。

© Tanishq Singh 2025. All rights reserved.

---

> よりかみ は、**けいかいをうながす**、**プライバシーしんちょう**、**あんぜんじゅうし** のユーティリティです。あなたには、**もっと あんぜんな ブラウジング**が ひつようです。
>>>>>>> 7452a5e9fc25df375193f1fa7ccc58005fbadc7a
