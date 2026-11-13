/*
  SITE CONTENT
  ------------
  Edit the text on your site here. You do not need to touch index.html, style.css or script.js.
  Keep the quotes ("...") and commas exactly as they are, and change only the words inside the quotes.

  Home page: change the hero text under "hero", the four skill boxes under "expertise",
  and which three projects appear on the home page under "featured" > "ids".

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
      { label: "Experience", href: "#experience" },
      { label: "Projects", href: "#projects" },
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
      label: "Product Manager / Game Designer",
      headline: "I design, build and ship",
      headlineAccent: "games.",
      text:
        "Game designer and product manager with experience in mobile games. I turn ideas into playable, engaging and data-informed experiences, from initial concept to live operations.",
      primary: { label: "View Projects", href: "#featured" },
      secondary: { label: "View CV", href: "#cv" },
      // Screenshots from your own games: left, center, right
      art: [
        { src: "assets/projects/ember-born/phone-1.webp", alt: "Ember Born gameplay" },
        { src: "assets/projects/blast-defence/phone-2.webp", alt: "Blast Defence gameplay" },
        { src: "assets/projects/lift-rush/phone-2.webp", alt: "Lift Rush gameplay" }
      ]
    },

    expertise: [
      { icon: "bulb", title: "Game Design", text: "Mechanics, levels, systems" },
      { icon: "layers", title: "Product Management", text: "Roadmaps, production, LiveOps" },
      { icon: "code", title: "Prototyping", text: "Unity, C#, rapid iteration" },
      { icon: "bars", title: "Data & Optimization", text: "KPI tracking, A/B testing, growth" }
    ],

    featured: {
      heading: "Selected Projects",
      viewAll: { label: "View All Projects", href: "#projects" },
      cardLink: "See details",
      // ids of the projects below, in the order they should appear on the home page
      ids: ["blast-defence", "lift-rush", "ember-born"]
    },

    about: {
      heading: "About me",
      paragraphs: [
        "I am a product manager and game designer with a game development background. I studied Digital Game Design at Bahçeşehir University and have worked on hyper-casual and hybrid-casual mobile games since 2022, first as a developer building levels, gameplay systems and VFX in Unity, then as a designer and product manager who owns a game from concept to live operations.",
        "My work covers game ideation, gameplay and level design, economy and progression, production planning, KPI tracking, A/B testing and LiveOps. I use AI tools to build quick prototypes and visual references, so a team can see an idea before production starts.",
        "I also founded an independent studio, Promander Games, and currently work as a product manager at Ziylan Medya (3Dinoz Games)."
      ],
      facts: [
        { label: "Education", value: "Digital Game Design, Bahçeşehir University, 2018 to 2023" },
        { label: "Tools", value: "Unity, Jira, Tiled, Unreal Engine 4" },
        { label: "Skills", value: "Game ideation, prototyping, GDD creation, level design, KPI tracking, A/B testing, LiveOps, AI-assisted prototyping" }
      ]
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
      heading: "CV",
      text: "Read it here, or download it as a PDF.",
      viewLabel: "Read the CV",
      downloadLabel: "Download PDF",
      file: "assets/cv/EmirSavas_CV.pdf",
      pages: ["assets/cv/cv-page-1.webp", "assets/cv/cv-page-2.webp"]
    },

    projects: {
      heading: "Projects",
      intro: "Mobile games I helped design and ship. Select a banner to see the details.",
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
          summary: "A hybrid-casual puzzle strategy game where players use color-matching shooters to defeat incoming enemies while solving a puzzle through strategic decisions.",
          contributions: [
            "Created the game concept, developed the initial prototype and prepared visual references to communicate the vision.",
            "Designed all game levels and continuously developed new gameplay content.",
            "Owned the project end to end, following the development process across all stages.",
            "Analyzed KPIs and guided QA improvements and LiveOps initiatives based on performance insights."
          ],
          details: [], // longer paragraphs go here, one text per line
          video: "", // YouTube video id, optional
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ]
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
          summary: "A color-matching puzzle game where players manage an elevator, transport characters to their matching doors, and solve puzzles while managing limited capacity.",
          contributions: [
            "Created the game concept and used AI-generated visuals to communicate and guide the development vision.",
            "Designed all game levels, obstacles and new gameplay content.",
            "Developed an AI-assisted level design tool to support and streamline level creation.",
            "Took end-to-end ownership of the project, guiding the team and defining content direction."
          ],
          details: [],
          video: "",
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ]
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
          summary: "An idle management game where players grow a metro station by transporting color-matched passengers and upgrading its operations.",
          contributions: [
            "Created the game concept and used AI-generated visuals to communicate the vision to the team.",
            "Designed the in-game economy, progression, and all game levels and systems.",
            "Took end-to-end ownership of the project, leading the team and directing development from concept to completion."
          ],
          details: [],
          video: "",
          links: [
            { label: "Gameplay video", url: "" },
            { label: "CPI video", url: "" }
          ]
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
          summary: "A casual word puzzle game where players solve crosswords by placing matching object icons into the correct positions.",
          contributions: [
            "Improved the overall game design and introduced new monetization features.",
            "Designed all game levels, shaping the puzzle progression and gameplay experience.",
            "Managed the development of a new game version alongside the existing one to support A/B testing.",
            "Planned and executed LiveOps activities to improve player engagement."
          ],
          details: [],
          video: "",
          links: [
            { label: "App Store", url: "" },
            { label: "Google Play", url: "" }
          ]
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
          summary: "A hybrid-casual puzzle game where players fit everyday items into suitcases before time runs out.",
          contributions: [
            "Created and developed the game concept, shaping the core gameplay experience.",
            "Used AI-generated visuals and content to communicate the vision and guide the team throughout development.",
            "Took end-to-end ownership of the project, providing continuous feedback and steering its overall direction."
          ],
          details: [],
          video: "",
          links: [
            { label: "Gameplay video", url: "" }
          ]
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
          summary: "An arcade idle survival game where players gather resources to keep the village bonfire burning, develop their settlement, and defend against nightly enemy waves.",
          contributions: [
            "Created and developed the game concept, defining the core gameplay experience.",
            "Used AI-generated visuals and content to guide the team and developed an AI-powered prototype to explore gameplay ideas.",
            "Took end-to-end ownership of the project, providing continuous feedback and introducing new content throughout development."
          ],
          details: [],
          video: "",
          links: [
            { label: "Gameplay video", url: "" }
          ]
        }
      ]
    },

    contact: {
      heading: "Contact",
      text: "I am open to product manager and game designer roles. The quickest way to reach me is email."
    },

    ui: {
      close: "Close",
      role: "What I did",
      gallery: "Screenshots",
      watch: "Gameplay video",
      links: "Play or download",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      skipToContent: "Skip to content",
      expand: "See details",
      menu: "Menu",
      currentRole: "Current role",
      collapse: "Hide details",
      screens: "Screenshots"
    }
  }
};
