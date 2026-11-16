/*
  SITE CONTENT
  ------------
  Edit the text on your site here. You do not need to touch index.html, style.css or script.js.
  Keep the quotes ("...") and commas exactly as they are, and change only the words inside the quotes.

  Home page: change the hero text under "hero" and the four skill boxes under "expertise".

  To add a new project: copy a whole project block { ... } inside "projects", paste it after the last one
  (put a comma between blocks) and change the text and image paths.
  To add a store or video link: fill the "url" fields. A link with an empty url ("") is hidden automatically.
  To add a YouTube gameplay video: put the video id in "video" (the part after v= in the YouTube link).
  To add Turkish later: copy the whole "en" block, name it "tr", and translate the text.
*/
window.SITE = {
  en: {
    meta: {
      title: "Emir Savaş | Product Manager and Game Designer",
      description:
        "Portfolio of Emir Savaş, a product manager and game designer working on casual and hybrid-casual mobile games."
    },

    nav: [
      { label: "Home", href: "#top" },
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "CV", href: "#cv" },
      { label: "Contact", href: "#contact" }
    ],

    person: {
      name: "Emir Savaş",
      role: "Product Manager and Game Designer",
      email: "emirsavass01@gmail.com",
      linkedin: "https://www.linkedin.com/in/emirsavas/",
      github: "" // add your GitHub profile link here, e.g. "https://github.com/yourname"
    },

    hero: {
      label: "Product Manager · Game Designer",
      headline: "I build and grow engaging game products.",
      headlineHighlight: "engaging game products",
      text:
        "Product Manager focused on mobile games, combining product strategy, game design, analytics and LiveOps to create engaging player experiences and drive sustainable growth.",
      primary: { label: "View Projects", href: "#projects" },
      secondary: { label: "View CV", href: "#cv" },
      // Screenshots from your own games: left, center, right
      art: [
        { src: "assets/projects/lift-rush/phone-2.webp", alt: "Lift Rush gameplay" },
        { src: "assets/projects/blast-defence/phone-1.webp", alt: "Blast Defence gameplay" },
        { src: "assets/projects/subway-flow/phone-1.webp", alt: "Subway Flow gameplay" }
      ]
    },

    expertise: [
      { icon: "bars", title: "Product Strategy", text: "Roadmaps, prioritization, product vision" },
      { icon: "gamepad", title: "Game Design", text: "Core loops, mechanics, progression" },
      { icon: "layers", title: "Data & Optimization", text: "KPIs, analytics, A/B testing" },
      { icon: "cycle", title: "Live Operations", text: "Events, updates, player engagement" }
    ],

    about: {
      heading: "About Me",
      steps: [
        {
          title: "Who I Am",
          text: "I’m a Product Manager in the mobile games industry with a background in Digital Game Design. I’ve been part of the industry for several years, working primarily across hyper-casual and hybrid-casual games. Along the way, I’ve also gained hands-on experience in Game Design and Level Design, which helps me bring a broader perspective to product decisions and player experience.",
          highlights: ["Product Manager", "Digital Game Design", "hyper-casual", "hybrid-casual", "Game Design", "Level Design"]
        },
        {
          title: "What I Bring",
          text: "My experience spans casual and midcore mobile games, as well as PC projects. Starting my career as a Game Developer gave me a strong technical foundation, allowing me to collaborate effectively with development and art teams. Today, my work combines product planning, prototyping, LiveOps, KPI analysis and data-informed decision-making. I’m also comfortable using AI tools to explore ideas, create content and build prototypes quickly.",
          highlights: ["casual and midcore", "PC projects", "Game Developer", "technical foundation", "product planning", "LiveOps", "KPI analysis", "AI tools"]
        },
        {
          title: "My Background",
          text: "I’ve wanted to make games since I was young, which naturally led me to study Digital Game Design at Bahçeşehir University. Gaming has always been a big part of my life. I regularly play games on both mobile and PC platforms and have followed the industry closely for years. This passion continues to influence how I approach products, understand players and evaluate new ideas.",
          highlights: ["Digital Game Design", "Bahçeşehir University", "mobile and PC", "players"]
        }
      ],
      glance: {
        heading: "At a glance",
        educationLabel: "Education",
        education: { title: "Digital Game Design", school: "Bahçeşehir University", years: "2018 – 2023" },
        toolkitLabel: "Toolkit",
        toolkit: ["Unity", "Jira", "Tiled", "Unreal Engine 4", "Google Sheets", "Google Docs", "Google Slides", "Firebase", "Google Analytics", "Machinations", "AI Tools"],
        expertiseLabel: "Areas of expertise",
        expertise: ["Product Strategy", "Game Design", "Level Design", "Prototyping", "Economy & Progression", "KPI Analysis", "A/B Testing", "LiveOps", "Production Planning", "Player Experience"]
      },
      how: {
        label: "How I work",
        items: [
          { icon: "bulb", title: "Ideate", text: "Turn opportunities and creative ideas into clear game and product concepts." },
          { icon: "bolt", title: "Prototype & Validate", text: "Make ideas tangible, build quick prototypes and test them early." },
          { icon: "layers", title: "Own the Process", text: "Follow features from initial planning through production, iteration and release." },
          { icon: "bars", title: "Measure & Improve", text: "Analyze player behavior and KPIs to identify opportunities and improve the experience." }
        ]
      }
    },

    experience: {
      eyebrow: "Career journey",
      heading: "Experience",
      text: "A path through game development, product design and building games.",
      items: [
        {
          role: "Product Manager",
          company: "Ziylan Medya (3Dinoz Games)",
          dates: "February 2026 – Present",
          current: true,
          tags: ["Game Design", "Product Planning", "Analytics", "LiveOps"],
          summary:
            "Manage casual and hybrid-casual mobile games across game design, product planning, analytics and team coordination. Present game concepts and GDDs, build AI-assisted prototypes, set up production pipelines, run sprints in Jira, track KPIs, run A/B tests and plan LiveOps."
        },
        {
          role: "Founder",
          company: "Promander Games",
          dates: "March 2025 – February 2026",
          tags: ["Studio Building", "Game Development"],
          summary: "Founded an independent studio making original PC and mobile games, and took projects from first concept to production."
        },
        {
          role: "Freelance Game Designer",
          company: "Self-employed",
          dates: "November 2023 – February 2025",
          tags: ["GDD", "Prototyping", "Core Loops"],
          summary:
            "Designed games for multiple clients: GDDs, mechanics and core loops, Unity prototypes, and original game and board game concepts."
        },
        {
          role: "Product Manager",
          company: "Perwella",
          dates: "June 2023 – November 2023",
          tags: ["Product Operations", "E-commerce"],
          summary: "Managed B2B and B2C product operations on e-commerce marketplaces, including launches, pricing, inventory and promotions."
        },
        {
          role: "Game Developer",
          company: "Midquest Games",
          dates: "May 2022 – January 2023",
          tags: ["Unity", "Gameplay Systems", "VFX"],
          summary:
            "Built levels and reusable gameplay systems in Unity for hyper-casual and hybrid-casual games, optimized mobile performance, and created shaders, VFX and animations."
        },
        {
          role: "Game Designer and Developer (internship)",
          company: "Fernvaille",
          dates: "October 2021 – January 2022",
          tags: ["Unreal Engine 4", "Game Design", "Enemy AI"],
          summary:
            "Designed content for a Battle Royale survival game and built a third-person action prototype in Unreal Engine 4, with character locomotion, animation and enemy AI using the Environment Query System."
        }
      ],
      core: {
        heading: "Core experience",
        items: [
          { icon: "bulb", title: "Game Design", text: "Mechanics, levels, systems and gameplay experience." },
          { icon: "layers", title: "Product Management", text: "Roadmaps, prioritization, analytics and team coordination." },
          { icon: "code", title: "Game Development", text: "Unity, C#, prototyping and feature development." },
          { icon: "bars", title: "Production & LiveOps", text: "Release planning, LiveOps, A/B testing and growth." }
        ]
      }
    },

    cv: {
      eyebrow: "Curriculum vitae",
      heading: "My CV",
      headingHighlight: "CV",
      text: "A closer look at my experience, skills and background in game design and product management.",
      highlights: ["game design", "product management"],
      downloadLabel: "Download CV (PDF)",
      readLabel: "View & Read Online",
      file: "assets/cv/Emir_Savas_CV.pdf", // replace this file to update the CV. Page count and size are read from it automatically.
      features: [
        { icon: "doc", title: "Always up to date", text: "The latest version of my CV, including my current experience and skills." },
        { icon: "cursor", title: "Interactive & selectable", text: "Read, select and copy text, and access clickable links directly from the document." },
        { icon: "printer", title: "Print friendly", text: "Optimized for printing, sharing and offline reading." }
      ],
      viewer: {
        label: "CV viewer",
        loading: "Loading CV…",
        error: "The CV could not be displayed here.",
        errorHelp: "You can still download it as a PDF.",
        pdf: "PDF",
        pages: "pages",
        page: "page",
        prev: "Previous page",
        next: "Next page",
        zoomOut: "Zoom out",
        zoomIn: "Zoom in",
        fitWidth: "Fit to width",
        fitPage: "Fit to page",
        fullscreen: "Full screen",
        exitFullscreen: "Exit full screen",
        download: "Download CV (PDF)",
        thumbs: "Show or hide page thumbnails",
        thumbsLabel: "Page thumbnails",
        goTo: "Go to page"
      }
    },

    projects: {
      eyebrow: "My projects",
      heading: "Projects",
      intro: "Games I helped design and ship. Select a project to see my role and the details.",
      items: [
        {
          id: "blast-defence",
          title: "Blast Defence",
          tags: ["Mobile", "Puzzle", "Hybrid-casual"],
          accent: "#35e0f2",
          bg: "assets/projects/blast-defence/bg.webp",
          logo: "assets/projects/blast-defence/logo.webp",
          phones: [
            "assets/projects/blast-defence/phone-1.webp",
            "assets/projects/blast-defence/phone-2.webp",
            "assets/projects/blast-defence/phone-3.webp"
          ],
          short: "A puzzle strategy game where color-matching shooters defeat incoming enemies.",
          // Project page
          overview: "A hybrid-casual puzzle strategy game where players use color-matching shooters to defeat incoming enemies while solving a puzzle through strategic decisions.",
          highlights: ["puzzle strategy", "color-matching", "strategic decisions"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/blast-defence/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Game Concept", text: "Created the game concept and initial prototype.", highlights: ["game concept", "initial prototype"] },
            { icon: "layers", title: "Level & Gameplay", text: "Designed all game levels and continuously developed new gameplay content.", highlights: ["all game levels", "new gameplay content"] },
            { icon: "bars", title: "LiveOps & Data", text: "Analyzed KPIs and guided QA improvements and LiveOps initiatives based on performance insights.", highlights: ["KPIs", "LiveOps"] },
            { icon: "people", title: "End-to-End Ownership", text: "Owned the project end to end, following the development process across all stages.", highlights: ["end to end"] }
          ],
          info: { platform: "Mobile (iOS / Android)", genre: "Puzzle, Strategy", model: "Hybrid-casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: ["Unity", "Jira", "Tiled", "LiveOps", "A/B Testing", "Analytics"] // the Technologies & Tools box is hidden when this is empty
        },
        {
          id: "lift-rush",
          title: "Lift Rush",
          tags: ["Mobile", "Puzzle", "Hybrid-casual"],
          accent: "#ffd23f",
          bg: "assets/projects/lift-rush/bg.webp",
          logo: "assets/projects/lift-rush/logo.webp",
          phones: [
            "assets/projects/lift-rush/phone-1.webp",
            "assets/projects/lift-rush/phone-2.webp",
            "assets/projects/lift-rush/phone-3.webp"
          ],
          short: "A color-matching puzzle where you run an elevator with limited capacity.",
          // Project page
          overview: "A color-matching puzzle game where players manage an elevator, transport characters to their matching doors, and solve puzzles while managing limited capacity.",
          highlights: ["color-matching", "elevator", "limited capacity"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/lift-rush/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Game Concept", text: "Created the game concept and used AI-generated visuals to communicate and guide the development vision.", highlights: ["game concept", "AI-generated visuals"] },
            { icon: "layers", title: "Level & Gameplay", text: "Designed all game levels, obstacles and new gameplay content.", highlights: ["all game levels"] },
            { icon: "code", title: "AI Level Tool", text: "Developed an AI-assisted level design tool to support and streamline level creation.", highlights: ["AI-assisted level design tool"] },
            { icon: "people", title: "End-to-End Ownership", text: "Took end-to-end ownership of the project, guiding the team and defining content direction.", highlights: ["end-to-end ownership"] }
          ],
          info: { platform: "Mobile", genre: "Puzzle", model: "Hybrid-casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: [] // the Technologies & Tools box is hidden when this is empty
        },
        {
          id: "subway-flow",
          title: "Subway Flow",
          tags: ["Mobile", "Idle", "Hybrid-casual"],
          accent: "#5eeab5",
          bg: "assets/projects/subway-flow/bg.webp",
          logo: "assets/projects/subway-flow/logo.webp",
          phones: [
            "assets/projects/subway-flow/phone-1.webp",
            "assets/projects/subway-flow/phone-2.webp",
            "assets/projects/subway-flow/phone-3.webp"
          ],
          short: "An idle management game about growing a metro station with color-matched passengers.",
          // Project page
          overview: "An idle management game where players grow a metro station by transporting color-matched passengers and upgrading its operations.",
          highlights: ["idle management", "color-matched passengers"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/subway-flow/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Game Concept", text: "Created the game concept and used AI-generated visuals to communicate the vision to the team.", highlights: ["game concept", "AI-generated visuals"] },
            { icon: "bars", title: "Economy & Progression", text: "Designed the in-game economy, progression, and all game levels and systems.", highlights: ["in-game economy", "progression"] },
            { icon: "people", title: "End-to-End Ownership", text: "Took end-to-end ownership of the project, leading the team and directing development from concept to completion.", highlights: ["end-to-end ownership"] }
          ],
          info: { platform: "Mobile", genre: "Idle, Management", model: "Hybrid-casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "Gameplay video", url: "" },
            { label: "CPI video", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: [] // the Technologies & Tools box is hidden when this is empty
        },
        {
          id: "royal-words",
          title: "Royal Words",
          tags: ["Mobile", "Puzzle", "Casual"],
          accent: "#ff9d7a",
          bg: "assets/projects/royal-words/bg.webp",
          logo: "assets/projects/royal-words/logo.webp",
          phones: [
            "assets/projects/royal-words/phone-1.webp",
            "assets/projects/royal-words/phone-2.webp",
            "assets/projects/royal-words/phone-3.webp"
          ],
          short: "A casual crossword game where you place matching object icons into the grid.",
          // Project page
          overview: "A casual word puzzle game where players solve crosswords by placing matching object icons into the correct positions.",
          highlights: ["word puzzle", "crosswords", "object icons"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/royal-words/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Design & Monetization", text: "Improved the overall game design and introduced new monetization features.", highlights: ["game design", "monetization"] },
            { icon: "layers", title: "Level Design", text: "Designed all game levels, shaping the puzzle progression and gameplay experience.", highlights: ["all game levels", "puzzle progression"] },
            { icon: "flask", title: "A/B Testing", text: "Managed the development of a new game version alongside the existing one to support A/B testing.", highlights: ["A/B testing"] },
            { icon: "bars", title: "LiveOps", text: "Planned and executed LiveOps activities to improve player engagement.", highlights: ["LiveOps"] }
          ],
          info: { platform: "Mobile", genre: "Puzzle, Word", model: "Casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: [] // the Technologies & Tools box is hidden when this is empty
        },
        {
          id: "move-it-all",
          title: "Move It All",
          tags: ["Mobile", "Puzzle", "Hybrid-casual"],
          accent: "#ff6fae",
          bg: "assets/projects/move-it-all/bg.webp",
          logo: "assets/projects/move-it-all/logo.webp",
          phones: [
            "assets/projects/move-it-all/phone-1.webp",
            "assets/projects/move-it-all/phone-2.webp",
            "assets/projects/move-it-all/phone-3.webp"
          ],
          short: "A puzzle about fitting everyday items into suitcases before time runs out.",
          // Project page
          overview: "A hybrid-casual puzzle game where players fit everyday items into suitcases before time runs out.",
          highlights: ["fit everyday items", "before time runs out"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/move-it-all/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Game Concept", text: "Created and developed the game concept, shaping the core gameplay experience.", highlights: ["game concept", "core gameplay"] },
            { icon: "layers", title: "AI-Assisted Vision", text: "Used AI-generated visuals and content to communicate the vision and guide the team throughout development.", highlights: ["AI-generated visuals"] },
            { icon: "people", title: "End-to-End Ownership", text: "Took end-to-end ownership of the project, providing continuous feedback and steering its overall direction.", highlights: ["end-to-end ownership"] }
          ],
          info: { platform: "Mobile", genre: "Puzzle", model: "Hybrid-casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "Gameplay video", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: [] // the Technologies & Tools box is hidden when this is empty
        },
        {
          id: "ember-born",
          title: "Ember Born",
          tags: ["Mobile", "Arcade idle", "Hybrid-casual"],
          accent: "#ffa63d",
          bg: "assets/projects/ember-born/bg.webp",
          logo: "assets/projects/ember-born/logo.webp",
          phones: [
            "assets/projects/ember-born/phone-1.webp",
            "assets/projects/ember-born/phone-2.webp",
            "assets/projects/ember-born/phone-3.webp"
          ],
          short: "An arcade idle survival game: keep the bonfire burning and defend the village at night.",
          // Project page
          overview: "An arcade idle survival game where players gather resources to keep the village bonfire burning, develop their settlement, and defend against nightly enemy waves.",
          highlights: ["arcade idle survival", "bonfire burning", "nightly enemy waves"], // words in the overview that are shown in cyan
          gallery: [], // extra screenshots, e.g. "assets/projects/ember-born/shot-4.webp". The three phone images are used when this is empty.
          video: "", // YouTube video id, optional
          contributions: [
            { icon: "bulb", title: "Game Concept", text: "Created and developed the game concept, defining the core gameplay experience.", highlights: ["game concept", "core gameplay"] },
            { icon: "code", title: "AI Prototype", text: "Used AI-generated visuals and content to guide the team and developed an AI-powered prototype to explore gameplay ideas.", highlights: ["AI-powered prototype"] },
            { icon: "people", title: "End-to-End Ownership", text: "Took end-to-end ownership of the project, providing continuous feedback and introducing new content throughout development.", highlights: ["end-to-end ownership"] }
          ],
          info: { platform: "Mobile", genre: "Arcade, Idle, Survival", model: "Hybrid-casual", role: "Game Designer, Product Manager" },
          links: [
            { label: "Gameplay video", url: "" }
          ], // a link with an empty url is hidden automatically
          tools: [] // the Technologies & Tools box is hidden when this is empty
        }
      ]
    },

    contact: {
      eyebrow: "Get in touch",
      heading: "Let’s build\nsomething great.",
      headingAccent: "something great",
      text: "Have a game idea, a project in mind, or an opportunity to discuss? I’d love to hear from you.",
      emailLabel: "Email me",
      copyLabel: "Copy email address",
      copiedLabel: "Copied!",
      copyFailedLabel: "Copy failed. Select the address instead.",
      linkedinLabel: "Connect on LinkedIn",
      linkedinBold: "LinkedIn",
      footerRight: "Designed with curiosity. Built for players.",
      footerHighlight: "Built for players."
    },

    ui: {
      close: "Close",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      skipToContent: "Skip to content",
      menu: "Menu",
      currentRole: "Current role",
      viewProject: "View Project",
      // project page
      back: "Back to Projects",
      overview: "Overview",
      whatIDid: "What I did",
      info: "Project info",
      platform: "Platform",
      genre: "Genre",
      model: "Model",
      role: "Role",
      linksTitle: "Project links",
      tools: "Technologies & tools",
      prev: "Previous",
      next: "Next",
      playVideo: "Play video",
      screenshot: "Screenshot",
      notFound: "This project could not be found."
    }
  }
};

// Analytics (Umami Cloud). Paste your Website ID between the quotes to switch tracking on; while it is empty nothing is sent.
window.SITE.analytics = {
  umamiWebsiteId: "7a082db0-1ced-40a7-b9ba-bb8e0e1c98f0",
  scriptUrl: "https://cloud.umami.is/script.js",
  domains: "emirsavas.dev"
};
