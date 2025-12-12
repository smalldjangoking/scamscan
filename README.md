<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/smalldjangoking/FishMarket">
    <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" 
         alt="Logo" width="100"/>
  </a>
  <h3 align="center">scamscan.io report & observ</h3>
</div>

## 🧠 Technology Stack & Key Features

### ⚙️ Backend (API & Core Logic)
- ⚡ **FastAPI** — high-performance async Python API
- 🧰 **SQLAlchemy 2.0 (async)** — modern ORM with full async support
- 🔍 **Pydantic v2** — strict data validation & API schemas
- 💾 **PostgreSQL** — primary relational database
- 🔑 **JWT authentication** — access & refresh tokens, remember-me logic
- 🔒 **Secure password hashing** (bcrypt)
- 📫 **Email verification & password recovery and password recovery**
- 🛡 **Rate limiting** (SlowAPI) for abuse protection
- 🧾 **Well-structured domain models**  
  (users, reports, addresses, comments, votes, whois)
- 🧠 **Clean architecture** (routers / services / schemas)

---

### 🚀 Frontend (UI & UX)
- ⚛️ **React 19 + Vite** — modern, fast frontend stack
- 🧑‍💻 **JavaScript (Axios, Tanstack)** with hooks
- 🎨 **Tailwind CSS** — utility-first styling
- 🧩 **Custom UI components**
  - Dropdowns with search & infinite scroll (CryptoDropDownMenu)
  - Nested comments system (CommentCard, CreateComment)
  - Rich text editor & viewer (TipTapEditor, TipTapOutput)
  - Interactive report cards & descriptions
  - Voting system (Like / Dislike)
  - Modals, pagination, loaders, alerts
  - Theme toggle (dark / light mode)
- 🌗 **Dark mode support**
- ♾ **Infinite scroll & pagination**
- 💬 **Nested comments & interactions**
- 🔎 **Search & filters** with debouncing
- 🧠 **SEO-optimized pages**  
  (meta tags, OpenGraph, canonical URLs)
- 🔌 **API client integration** with auth & token refresh logic

### 🧩 Product Features
- 🚨 **Scam reports** for crypto addresses & websites
- 🧾 **User-generated content** with moderation-ready structure
- 👍 **Community voting system**
- 📊 **View counters & engagement metrics**
- 🔗 **SEO-friendly slugs & URLs**
- ⚖️ **Privacy-aware design**

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project
![Main Page](https://github.com/smalldjangoking/DRF_practice_META/blob/master/LittleLemonAPI/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-15%20011734.png?raw=true)

This project was inspired by the well-known Steam community site steamrep.com which helps fight scammers in Steam trading, adapted for the crypto community. The goal of the project is to provide a platform where users can report, discuss, and share information about scammers, helping others avoid falling victim to fraudulent activities.
The site collects data contributed by users, creating a community-driven database of reports. Anyone can check a cryptocurrency address, website, or profile to verify its trustworthiness before engaging with it. By centralizing this information, the platform helps prevent scams and raises awareness about ongoing fraudulent schemes.
Users can easily submit reports through a simple form, providing details about the scam, categorizing the type of fraud, and even attaching screenshots or other proof. Each report is stored in a structured way, allowing the community to search, filter, and analyze the data. Over time, this creates a valuable resource that benefits both new and experienced users in the crypto space.
Ultimately, the project aims to build a safer environment for everyone by empowering users to share knowledge, report suspicious activity, and help others navigate the risks of online scams.


### Key Features of Functionality

- **Account**  
  - Save your search history and manage reports.
  - Ability to leave comments
  - Green Border.
 
- **Profile**
  - Change Password
  - Update Information
  - Сheck Нistory
  - Check your recent reports
  - Delete an Account (It also deletes all Reports)

- **Report Form**  
  - Report an address or website  
  - Add screenshots  
  - Write beautiful descriptions using Tiptap
 
- **View Reports**  
  - Explore community reports using flexible search filters.  
  - Find detailed records about suspicious websites and crypto addresses.

- **Scan URLs & Addresses**  
  - Instantly check any website or crypto address for existing reports.  
  - Get insights and trust indicators from community data.

 
**................ in a progress**  
