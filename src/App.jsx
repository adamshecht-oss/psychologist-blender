import { useState, useRef, useEffect, useCallback } from "react";

// ─── API calls go through /api/chat proxy (see api/chat.js) ──────────────────

// ─── LIBRARIES ────────────────────────────────────────────────────────────────

const LIBRARIES = {
  thinkers: {
    id: "thinkers",
    name: "The Library",
    subtitle: "Great Minds of Psychology & Philosophy",
    spine: "The Library",
    spineColor: "#8B6914",
    fictional: false,
    prompt_context: "historical psychologists, philosophers, and thinkers",
    theme: {
      bg:       "#F5EDD8",
      paper:    "#EDE0C4",
      ink:      "#1A1510",
      accent:   "#8B6914",
      accentDim:"rgba(139,105,20,0.13)",
      amber:    "#A0522D",
      rule:     "rgba(139,105,20,0.18)",
      muted:    "rgba(26,21,16,0.44)",
      faint:    "rgba(26,21,16,0.26)",
      btnBg:    "#1A1510",
      btnTxt:   "#F5EDD8",
      ambient:  null,
      badge:    "📖",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"jung",      name:"Carl Jung",       domain:"Analytical Psychology",  years:"1875–1961"    },
      { id:"freud",     name:"Sigmund Freud",    domain:"Psychoanalysis",         years:"1856–1939"    },
      { id:"rogers",    name:"Carl Rogers",      domain:"Person-Centered",        years:"1902–1987"    },
      { id:"frankl",    name:"Viktor Frankl",    domain:"Logotherapy",            years:"1905–1997"    },
      { id:"aurelius",  name:"Marcus Aurelius",  domain:"Stoic Philosophy",       years:"121–180 AD"   },
      { id:"adler",     name:"Alfred Adler",     domain:"Individual Psychology",  years:"1870–1937"    },
      { id:"bowlby",    name:"John Bowlby",      domain:"Attachment Theory",      years:"1907–1990"    },
      { id:"yalom",     name:"Irvin Yalom",      domain:"Existential Therapy",    years:"1931–present" },
      { id:"beck",      name:"Aaron Beck",       domain:"Cognitive Behavioral",   years:"1921–2021"    },
      { id:"fromm",     name:"Erich Fromm",      domain:"Humanistic Philosophy",  years:"1900–1980"    },
      { id:"epictetus", name:"Epictetus",        domain:"Stoic Philosophy",       years:"50–135 AD"    },
      { id:"horney",    name:"Karen Horney",     domain:"Neurotic Psychology",    years:"1885–1952"    },
      { id:"james",     name:"William James",    domain:"Pragmatic Psychology",   years:"1842–1910"    },
      { id:"weil",      name:"Simone Weil",      domain:"Moral Philosophy",       years:"1909–1943"    },
    ],
  },

  hogwarts: {
    id: "hogwarts",
    name: "Hogwarts Library",
    subtitle: "Wisdom from the Wizarding World",
    spine: "Hogwarts",
    spineColor: "#D4AF37",
    fictional: true,
    fictional_note: "Characters and story drawn from J.K. Rowling's Harry Potter series. For educational fun only.",
    prompt_context: "characters from J.K. Rowling's Harry Potter series",
    theme: {
      bg:       "#110C18",
      paper:    "#1C1428",
      ink:      "#F0E6D3",
      accent:   "#D4AF37",
      accentDim:"rgba(212,175,55,0.14)",
      amber:    "#C8956A",
      rule:     "rgba(212,175,55,0.20)",
      muted:    "rgba(240,230,211,0.44)",
      faint:    "rgba(240,230,211,0.24)",
      btnBg:    "#D4AF37",
      btnTxt:   "#110C18",
      ambient:  "radial-gradient(ellipse at 25% 20%, rgba(212,175,55,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(80,30,100,0.15) 0%, transparent 55%)",
      badge:    "🔮",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"dumbledore", name:"Albus Dumbledore",    domain:"Love, Wisdom & Sacrifice",      years:"Headmaster" },
      { id:"hermione",   name:"Hermione Granger",    domain:"Logic, Justice & Courage",       years:"Gryffindor" },
      { id:"snape",      name:"Severus Snape",       domain:"Complexity, Loyalty & Pain",     years:"Potions Master" },
      { id:"luna",       name:"Luna Lovegood",       domain:"Wonder, Acceptance & Intuition", years:"Ravenclaw" },
      { id:"mcgonagall", name:"Prof. McGonagall",    domain:"Discipline, Fairness & Duty",    years:"Transfiguration" },
      { id:"sirius",     name:"Sirius Black",        domain:"Freedom, Loyalty & Identity",    years:"Order of the Phoenix" },
      { id:"lupin",      name:"Remus Lupin",         domain:"Shame, Belonging & Kindness",    years:"Defense Teacher" },
      { id:"neville",    name:"Neville Longbottom",  domain:"Courage, Growth & Perseverance", years:"Gryffindor" },
      { id:"hagrid",     name:"Rubeus Hagrid",       domain:"Unconditional Love & Loyalty",   years:"Keeper of Keys" },
      { id:"dobby",      name:"Dobby",               domain:"Freedom, Dignity & Devotion",    years:"Free Elf" },
      { id:"fred_george",name:"Fred & George",       domain:"Joy, Resilience & Rebellion",    years:"Weasley Twins" },
      { id:"voldemort",  name:"Lord Voldemort",      domain:"Fear, Power & Emptiness",        years:"Dark Lord" },
    ],
  },

  marvel: {
    id: "marvel",
    name: "Marvel Universe",
    subtitle: "Heroes, Villains & the Human Condition",
    spine: "Marvel",
    spineColor: "#E62429",
    fictional: true,
    fictional_note: "Characters from Marvel Comics and the MCU. For educational exploration only.",
    prompt_context: "characters from Marvel Comics and the Marvel Cinematic Universe",
    theme: {
      bg:       "#0A0D14",
      paper:    "#141824",
      ink:      "#E8EDF5",
      accent:   "#E62429",
      accentDim:"rgba(230,36,41,0.13)",
      amber:    "#F0A500",
      rule:     "rgba(230,36,41,0.20)",
      muted:    "rgba(232,237,245,0.44)",
      faint:    "rgba(232,237,245,0.24)",
      btnBg:    "#E62429",
      btnTxt:   "#FFFFFF",
      ambient:  "radial-gradient(ellipse at 20% 30%, rgba(230,36,41,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(50,80,200,0.08) 0%, transparent 50%)",
      badge:    "⚡",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"stark",    name:"Tony Stark",          domain:"Ego, Genius & Redemption",       years:"Iron Man"    },
      { id:"rogers",   name:"Steve Rogers",        domain:"Integrity, Sacrifice & Duty",    years:"Captain America" },
      { id:"tchalla",  name:"T'Challa",            domain:"Leadership, Legacy & Justice",   years:"Black Panther" },
      { id:"natasha",  name:"Natasha Romanoff",    domain:"Identity, Guilt & Agency",       years:"Black Widow" },
      { id:"peter",    name:"Peter Parker",        domain:"Responsibility & Growing Up",    years:"Spider-Man"  },
      { id:"xavier",   name:"Charles Xavier",      domain:"Inclusion, Hope & Otherness",    years:"Professor X" },
      { id:"strange",  name:"Doctor Strange",      domain:"Ego, Surrender & Purpose",       years:"Sorcerer Supreme" },
      { id:"wanda",    name:"Wanda Maximoff",      domain:"Grief, Power & Reality",         years:"Scarlet Witch" },
      { id:"fury",     name:"Nick Fury",           domain:"Trust, Control & Strategy",      years:"Director, S.H.I.E.L.D." },
      { id:"thor",     name:"Thor Odinson",        domain:"Pride, Worthiness & Loss",       years:"God of Thunder" },
    ],
  },

  gilmore: {
    id: "gilmore",
    name: "Stars Hollow",
    subtitle: "Life, Love & Coffee in Connecticut",
    spine: "Stars Hollow",
    spineColor: "#8B4513",
    fictional: true,
    fictional_note: "Characters from Gilmore Girls, created by Amy Sherman-Palladino. For educational exploration only.",
    prompt_context: "characters from the TV series Gilmore Girls",
    theme: {
      bg:       "#FAF3E8",
      paper:    "#F0E6D0",
      ink:      "#2C1810",
      accent:   "#8B4513",
      accentDim:"rgba(139,69,19,0.12)",
      amber:    "#6B3A2A",
      rule:     "rgba(139,69,19,0.16)",
      muted:    "rgba(44,24,16,0.44)",
      faint:    "rgba(44,24,16,0.26)",
      btnBg:    "#2C1810",
      btnTxt:   "#FAF3E8",
      ambient:  "radial-gradient(ellipse at 30% 20%, rgba(139,69,19,0.06) 0%, transparent 55%)",
      badge:    "☕",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"lorelai",  name:"Lorelai Gilmore",   domain:"Independence, Wit & Reinvention",  years:"Inn Owner"   },
      { id:"rory",     name:"Rory Gilmore",       domain:"Ambition, Books & Identity",       years:"Journalist"  },
      { id:"emily",    name:"Emily Gilmore",      domain:"Expectation, Control & Love",      years:"Society"     },
      { id:"luke",     name:"Luke Danes",         domain:"Loyalty, Gruffness & Steadiness",  years:"Diner Owner" },
      { id:"paris",    name:"Paris Geller",       domain:"Drive, Perfectionism & Fragility", years:"Harvard"     },
      { id:"lane",     name:"Lane Kim",           domain:"Identity, Rebellion & Culture",    years:"Musician"    },
      { id:"sookie",   name:"Sookie St. James",   domain:"Warmth, Creativity & Support",     years:"Chef"        },
      { id:"michel",   name:"Michel Gerard",      domain:"Standards, Ego & Hidden Heart",    years:"Concierge"   },
      { id:"richard",  name:"Richard Gilmore",    domain:"Tradition, Pride & Quiet Love",    years:"Business"    },
      { id:"kirk",     name:"Kirk Gleason",       domain:"Earnestness, Oddity & Belonging",  years:"Stars Hollow"},
    ],
  },
  tedlasso: {
    id: "tedlasso",
    name: "Ted Lasso",
    subtitle: "Believe · Kindness · Growth",
    spine: "Ted Lasso",
    spineColor: "#2E7D32",
    fictional: true,
    fictional_note: "Characters from Ted Lasso, created by Jason Sudeikis & co. For educational exploration only.",
    prompt_context: "characters from the TV series Ted Lasso",
    theme: {
      bg:       "#F0F7F0",
      paper:    "#E3F0E4",
      ink:      "#1A2E1A",
      accent:   "#2E7D32",
      accentDim:"rgba(46,125,50,0.12)",
      amber:    "#B8860B",
      rule:     "rgba(46,125,50,0.18)",
      muted:    "rgba(26,46,26,0.44)",
      faint:    "rgba(26,46,26,0.26)",
      btnBg:    "#1A2E1A",
      btnTxt:   "#F0F7F0",
      ambient:  "radial-gradient(ellipse at 30% 20%, rgba(46,125,50,0.07) 0%, transparent 55%)",
      badge:    "⚽",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"ted",      name:"Ted Lasso",       domain:"Optimism, Kindness & Belief",       years:"AFC Richmond" },
      { id:"keeley",   name:"Keeley Jones",    domain:"Confidence, Growth & Authenticity", years:"PR & Media"   },
      { id:"rebecca",  name:"Rebecca Welton",  domain:"Betrayal, Healing & Leadership",    years:"Club Owner"   },
      { id:"roy",      name:"Roy Kent",        domain:"Anger, Passion & Vulnerability",    years:"Captain"      },
      { id:"nate",     name:"Nate Shelley",    domain:"Insecurity, Ambition & Resentment", years:"Coach"        },
      { id:"beard",    name:"Coach Beard",     domain:"Loyalty, Depth & Quiet Wisdom",     years:"Assistant"    },
      { id:"jamie",    name:"Jamie Tartt",     domain:"Ego, Abandonment & Redemption",     years:"Forward"      },
      { id:"higgins",  name:"Leslie Higgins",  domain:"Goodness, Courage & Family",        years:"Director"     },
      { id:"sam",      name:"Sam Obisanya",    domain:"Integrity, Identity & Belonging",   years:"Midfielder"   },
      { id:"trent",    name:"Trent Crimm",     domain:"Truth, Fairness & Integrity",       years:"Journalist"   },
    ],
  },

  goldengirls: {
    id: "goldengirls",
    name: "The Lanai",
    subtitle: "Wisdom, Friendship & Cheesecake in Miami",
    spine: "Golden Girls",
    spineColor: "#C4872A",
    fictional: true,
    fictional_note: "Characters from The Golden Girls, created by Susan Harris. For educational exploration only.",
    prompt_context: "characters from the TV series The Golden Girls",
    theme: {
      bg:       "#FFFBF0",
      paper:    "#FFF3D6",
      ink:      "#2C2010",
      accent:   "#C4872A",
      accentDim:"rgba(196,135,42,0.13)",
      amber:    "#9B6A1A",
      rule:     "rgba(196,135,42,0.18)",
      muted:    "rgba(44,32,16,0.44)",
      faint:    "rgba(44,32,16,0.26)",
      btnBg:    "#2C2010",
      btnTxt:   "#FFFBF0",
      ambient:  "radial-gradient(ellipse at 40% 20%, rgba(196,135,42,0.07) 0%, transparent 55%)",
      badge:    "🌴",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"dorothy", name:"Dorothy Zbornak",   domain:"Wit, Strength & Hidden Longing",      years:"Teacher"       },
      { id:"sophia",  name:"Sophia Petrillo",   domain:"Blunt Wisdom, Age & Survival",        years:"Sicily → Miami" },
      { id:"blanche", name:"Blanche Devereaux", domain:"Desire, Self-Worth & Southern Pride", years:"Museum"        },
      { id:"rose",    name:"Rose Nylund",       domain:"Innocence, Empathy & Hidden Depth",   years:"St. Olaf"      },
    ],
  },

  fullhouse: {
    id: "fullhouse",
    name: "The Tanner House",
    subtitle: "Family, Loss & How Love Gets Rebuilt",
    spine: "Full House",
    spineColor: "#4A6FA5",
    fictional: true,
    fictional_note: "Characters from Full House, created by Jeff Franklin. For educational exploration only.",
    prompt_context: "characters from the TV series Full House",
    theme: {
      bg:       "#F0F4FA",
      paper:    "#E4ECF7",
      ink:      "#1A2035",
      accent:   "#4A6FA5",
      accentDim:"rgba(74,111,165,0.12)",
      amber:    "#8B6914",
      rule:     "rgba(74,111,165,0.18)",
      muted:    "rgba(26,32,53,0.44)",
      faint:    "rgba(26,32,53,0.26)",
      btnBg:    "#1A2035",
      btnTxt:   "#F0F4FA",
      ambient:  "radial-gradient(ellipse at 25% 25%, rgba(74,111,165,0.07) 0%, transparent 55%)",
      badge:    "🏠",
      font:     "'Georgia','Times New Roman',serif",
      mono:     "'Courier New',monospace",
    },
    thinkers: [
      { id:"danny",     name:"Danny Tanner",     domain:"Grief, Order & Devoted Fatherhood",    years:"Dad"         },
      { id:"jesse",     name:"Jesse Katsopolis", domain:"Identity, Cool & Learning to Grow Up", years:"Uncle Jesse" },
      { id:"joey",      name:"Joey Gladstone",   domain:"Humor, Loyalty & Finding Purpose",     years:"Uncle Joey"  },
      { id:"dj",        name:"D.J. Tanner",      domain:"Responsibility, Growing Up & Firsts",  years:"Eldest"      },
      { id:"stephanie", name:"Stephanie Tanner", domain:"Middle Child, Belonging & Resilience", years:"Middle"      },
      { id:"michelle",  name:"Michelle Tanner",  domain:"Innocence, Wonder & Being Heard",      years:"Youngest"    },
      { id:"becky",     name:"Becky Donaldson",  domain:"Groundedness, Partnership & Ambition", years:"Aunt Becky"  },
      { id:"kimmy",     name:"Kimmy Gibbler",    domain:"Outsider, Loyalty & Unapologetic Self",years:"Next Door"   },
    ],
  },
};

// ─── Surprise prompts ─────────────────────────────────────────────────────────
const SURPRISE_PROMPTS = {
  thinkers: [
    "Why do we self-sabotage when things are going well?",
    "What would they say about modern loneliness?",
    "How do you find meaning when life feels purposeless?",
    "Why do humans go to war with each other?",
    "What is the relationship between money and happiness?",
    "Why is it so hard to change, even when we want to?",
    "What would they make of social media and identity?",
    "How do we grieve someone we had a complicated relationship with?",
  ],
  hogwarts: [
    "Why is it so hard to ask for help when we need it most?",
    "What would they say about feeling like you don't belong?",
    "How do you find courage when you're terrified?",
    "What would they make of someone who chose power over love?",
    "How do you carry grief without letting it define you?",
    "What would they say about the pressure to live up to expectations?",
  ],
  marvel: [
    "What would they say about carrying guilt for past mistakes?",
    "How do you lead when you don't feel worthy of it?",
    "What would they make of the cost of always being strong?",
    "How do you hold onto your identity when the world tries to define you?",
    "What would they say about sacrificing yourself for others?",
    "How do you trust again after being deeply betrayed?",
  ],
  gilmore: [
    "What would they say about the complicated love between mothers and daughters?",
    "How do you figure out who you are outside your family's expectations?",
    "What would they make of choosing ambition over relationships?",
    "How do you let someone love you when you're used to doing everything alone?",
    "What would they say about small-town life vs big-city dreams?",
    "How do you repair a relationship that's been broken for years?",
  ],
  tedlasso: [
    "How do you stay kind when the world keeps punishing you for it?",
    "What would they say about failing publicly and getting back up?",
    "How do you lead a team that doesn't believe in itself?",
    "What would they make of someone who mistakes cruelty for strength?",
    "How do you forgive someone who genuinely hurt you?",
    "What would they say about choosing people over winning?",
  ],
  goldengirls: [
    "What would they say about growing old in a culture that worships youth?",
    "How do you start over when you thought your best years were behind you?",
    "What would they make of loneliness in later life?",
    "How do you maintain dignity when the world stops taking you seriously?",
    "What would they say about friendship being the great sustainer?",
    "How do you find humor in the hardest parts of life?",
  ],
  fullhouse: [
    "How do you raise children while grieving someone you love?",
    "What would they say about the complicated dynamics of a non-traditional family?",
    "How do you figure out who you are when you're the middle child?",
    "What would they make of growing up too fast?",
    "How do you let people help you when you're used to doing it all alone?",
    "What would they say about the way humor holds families together?",
  ],
};


// ─── Thinker bios ─────────────────────────────────────────────────────────────
const THINKER_BIOS = {
  jung:       { bio:"Explored the unconscious through archetypes, dreams, and the collective unconscious.", idea:"Individuation — becoming who you truly are." },
  freud:      { bio:"Founded psychoanalysis; mapped the unconscious, ego, and the role of repression in human behavior.", idea:"The unconscious shapes everything." },
  rogers:     { bio:"Believed people grow best when unconditionally accepted. Created client-centered therapy.", idea:"Unconditional positive regard." },
  frankl:     { bio:"Holocaust survivor who argued meaning — not pleasure — is what humans need most to survive.", idea:"Life always has meaning, even in suffering." },
  aurelius:   { bio:"Roman emperor and Stoic philosopher. Wrote Meditations as private notes to himself.", idea:"You control your response, not events." },
  adler:      { bio:"Pioneered the idea that feelings of inferiority drive human striving and social behavior.", idea:"We are driven by the desire to belong." },
  bowlby:     { bio:"Showed that early attachments to caregivers shape emotional life for decades.", idea:"Secure attachment is the root of resilience." },
  yalom:      { bio:"Existential therapist who wrote about death, freedom, isolation, and meaninglessness as life's core tensions.", idea:"Confronting mortality makes life richer." },
  beck:       { bio:"Developed CBT — the idea that changing thought patterns can change how we feel and behave.", idea:"Thoughts are not facts." },
  fromm:      { bio:"Argued that modern society makes people lonely by prizing having over being.", idea:"Love is an art, not a feeling." },
  epictetus:  { bio:"Born a slave, became one of the great Stoic teachers. The Enchiridion is his handbook for life.", idea:"Freedom lies in what you choose to care about." },
  horney:     { bio:"Challenged Freud and mapped how anxiety shapes personality through idealized self-images.", idea:"We flee our real self to chase an ideal." },
  james:      { bio:"Father of American psychology and pragmatist philosopher. Studied consciousness and habit.", idea:"Act as if what you do matters — it does." },
  weil:       { bio:"French mystic and philosopher who wrote on affliction, justice, and attention as a moral act.", idea:"Real attention is a form of love." },
  dumbledore: { bio:"Headmaster of Hogwarts. Guided Harry with cryptic wisdom rooted in love over power.", idea:"It is our choices that show what we truly are." },
  hermione:   { bio:"Brilliant, justice-driven witch who believes preparation and principle will always win.", idea:"Logic and empathy are not opposites." },
  snape:      { bio:"The most complex character in the series — driven by love, guilt, and an unreachable ideal.", idea:"Love can survive anything, even hatred of the self." },
  luna:       { bio:"Radically accepting and other-worldly. Sees what others overlook and is unbothered by judgment.", idea:"The things we can't see matter most." },
  mcgonagall: { bio:"Deputy Headmistress. Strict, fair, and quietly fierce in her protection of those she loves.", idea:"Duty and care are not in conflict." },
  sirius:     { bio:"Harry's godfather. Spent years unjustly imprisoned but never lost his sense of self.", idea:"We are more than what is done to us." },
  lupin:      { bio:"Defense teacher haunted by his own nature. Compassionate, self-doubting, and deeply kind.", idea:"Shame does not have to define you." },
  neville:    { bio:"Overlooked and underestimated, grew into one of the story's bravest characters.", idea:"Courage is grown, not born." },
  hagrid:     { bio:"Keeper of the grounds. Loves unconditionally, especially what others fear or dismiss.", idea:"Every creature deserves kindness." },
  dobby:      { bio:"House elf who chose freedom and devoted himself to those who treated him with dignity.", idea:"No one should be owned." },
  fred_george:{ bio:"Weasley twins who used humor as both armor and resistance against cruelty.", idea:"Joy is a revolutionary act." },
  voldemort:  { bio:"Chose power over love and became incapable of either. The story's darkest mirror.", idea:"Fear of death destroys what makes life worth living." },
  stark:      { bio:"Genius billionaire who learned that armor doesn't protect you from yourself.", idea:"The best part of the best of us." },
  rogers:     { bio:"Super soldier who never stopped believing that goodness was worth fighting for.", idea:"Integrity doesn't take a day off." },
  tchalla:    { bio:"King and warrior who carried the weight of ancestors and the future simultaneously.", idea:"A nation's strength is in how it treats the vulnerable." },
  natasha:    { bio:"Former assassin who spent her life trying to balance the ledger of her past.", idea:"We don't get to write our origins — only our choices." },
  peter:      { bio:"Teenager learning that great power means you can't look away.", idea:"With great power comes great responsibility." },
  xavier:     { bio:"Dreamer who built a school for the feared and different, insisting coexistence was possible.", idea:"The X-Men are proof we can choose our family." },
  strange:    { bio:"Brilliant surgeon humbled by injury who found that ego was the real wound.", idea:"Surrender is sometimes the only path forward." },
  wanda:      { bio:"Grief made manifest. Her power grew from loss and nearly destroyed everything she loved.", idea:"Grief is just love with nowhere to go." },
  fury:       { bio:"The man who holds the world together by never fully trusting anyone — including himself.", idea:"Trust is a liability. But so is not trusting." },
  thor:       { bio:"A god who had to lose everything — hammer, throne, father — to become worthy of any of it.", idea:"Worthiness is not inherited." },
  lorelai:    { bio:"Raised Rory alone, built an inn, and survived her family's expectations on her own terms.", idea:"Independence is not the absence of love." },
  rory:       { bio:"Bookish, ambitious, and shaped by two very different grandmothers and one extraordinary mother.", idea:"Every book is a conversation across time." },
  emily:      { bio:"Matriarch who controlled through expectation and loved imperfectly but fiercely.", idea:"Love expressed as standard-setting is still love." },
  luke:       { bio:"Gruff diner owner whose steadiness was the quiet center of Stars Hollow.", idea:"Showing up is its own kind of love." },
  paris:      { bio:"Overachiever driven by fear of failure and a desperate need to be the best.", idea:"Excellence can be armor for a tender heart." },
  lane:       { bio:"Navigated between her mother's world and the music she loved without abandoning either.", idea:"Identity is not a betrayal of your roots." },
  sookie:     { bio:"Chef and best friend. Warm, creative, occasionally chaotic, always devoted.", idea:"Pour yourself into what you love." },
  michel:     { bio:"Concierge with standards and a sharp tongue who cared more than he'd ever admit.", idea:"High expectations are a form of respect." },
  richard:    { bio:"Patriarch who expressed love through ambition and provision, learning too late to say it plainly.", idea:"Men often speak in deeds when they should use words." },
  kirk:       { bio:"Stars Hollow's most earnest citizen. Tried every job, failed often, never stopped trying.", idea:"Earnestness without shame is its own kind of freedom." },
  ted:        { bio:"American football coach who brought radical kindness and curiosity to an English soccer club.", idea:"Be curious, not judgmental." },
  keeley:     { bio:"Grew from being defined by others' attention to building confidence entirely her own.", idea:"You can choose who you become." },
  rebecca:    { bio:"Club owner who used AFC Richmond to reclaim herself after a devastating betrayal.", idea:"Rebuilding yourself is the hardest and most necessary work." },
  roy:        { bio:"Legend whose career ended before he was ready. Found a new way to matter.", idea:"There's life after the thing you built your identity around." },
  nate:       { bio:"Assistant kit man whose craving for respect led him somewhere he didn't recognize himself.", idea:"Insecurity is most dangerous when it finds power." },
  beard:      { bio:"Ted's quiet, fiercely loyal assistant coach. Depth that rarely surfaces.", idea:"Presence is its own form of wisdom." },
  jamie:      { bio:"Talented, arrogant, and shaped by a father who used him. Grew into someone worth admiring.", idea:"The people who hurt us don't get to decide who we become." },
  higgins:    { bio:"Leslie Higgins — loyal, warm, and braver than anyone expected when it counted.", idea:"Goodness is not weakness." },
  sam:        { bio:"Principled midfielder who stood up for justice at significant personal cost.", idea:"Integrity has to be worth something when it's expensive." },
  trent:      { bio:"Journalist who chose truth over access, and eventually found something worth writing about.", idea:"The story that matters is the one that's true." },
  dorothy:    { bio:"Sharp-tongued, sharp-minded teacher who masked longing with wit.", idea:"Intelligence and vulnerability share a wall." },
  sophia:     { bio:"Blunt, Sicilian, 80-something and completely unbothered. Wisdom without filter.", idea:"At a certain age, you've earned the right to say it plainly." },
  blanche:    { bio:"Southern belle who staked her worth on desirability and slowly discovered she was more.", idea:"Self-worth built on others' gaze is fragile." },
  rose:       { bio:"Sweet, apparently simple, and surprisingly the emotional anchor of the house.", idea:"Kindness is not the same as naivety." },
  danny:      { bio:"Father of three who raised his daughters while learning to grieve, with help.", idea:"Asking for help is what good parents do." },
  jesse:      { bio:"The cool uncle who had to grow up alongside the children he was helping raise.", idea:"You can find your family after you've found yourself." },
  joey:       { bio:"Comedian who never quite made it big but showed up every single day.", idea:"Loyalty matters more than success." },
  dj:         { bio:"Eldest Tanner daughter who carried responsibility well beyond her years.", idea:"Taking care of others is easier than taking care of yourself." },
  stephanie:  { bio:"Middle child who wanted to matter and learned she already did.", idea:"The middle is not the forgotten place." },
  michelle:   { bio:"Youngest Tanner. Spoiled by love, occasionally insufferable, genuinely joyful.", idea:"Being the youngest means everyone teaches you something." },
  becky:      { bio:"Career woman who married into the Tanner chaos and became its steadying force.", idea:"You can build the life you want inside the life you have." },
  kimmy:      { bio:"Next-door best friend. Weird, loyal, underestimated, completely herself.", idea:"Being unapologetically yourself is a gift to the people who need permission to do the same." },
};

// ─── Prompt builder ───────────────────────────────────────────────────────────
function buildPrompt(question, thinkerNames, isBlend, library) {
  const lib = LIBRARIES[library];
  const isFictional = lib.fictional;

  return `You are a warm, knowledgeable guide drawing on the wisdom of ${lib.prompt_context}.

Someone has asked: "${question}"

${isBlend
  ? `Respond from the perspectives of ${thinkerNames.join(", ")} — genuinely synthesizing their views, showing where they converge, where they differ, and what they illuminate together.`
  : `Respond from the perspective of ${thinkerNames[0]}, drawing authentically on their ${isFictional ? "characterization, values, stated beliefs, and memorable moments from the story" : "published ideas, concepts, and actual work"}.`
}

${isFictional
  ? `This is a fun, educational exploration using fictional characters as lenses for understanding real human experiences. Draw on specific scenes, quotes, and character moments where relevant. The characters should feel authentic to their stories.`
  : `This is an educational library tool — like pulling a book from a shelf. Not therapy, not advice.`}

Speak in third person when attributing ideas (e.g. "${thinkerNames[0]} would likely...").
All questions — personal, historical, political, philosophical — deserve serious and thoughtful engagement.
${isFictional ? "Occasionally reference specific moments, relationships, or growth arcs from the story to ground the perspective." : ""}

Return ONLY valid JSON, no markdown:
{
  "title": "Short evocative headline, 5-10 words.",
  "perspectives": [
    {
      "thinker": "Full name",
      "stance": "One sentence on their core position on this question.",
      "body": "3-5 sentences expanding their view. ${isFictional ? "Reference specific story moments or character relationships. Show how their experiences inform this perspective." : "Reference their actual concepts and works. Be honest about limitations."}"
    }
  ],
  "convergence": ${isBlend ? '"2-3 sentences on what these voices see similarly, or how their differences illuminate the question together."' : "null"},
  "openQuestion": "One genuinely interesting question for the reader to sit with — curious, not leading."
}`;
}

// ─── useWindowWidth / isMobile ───────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 600 : false);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 600);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

// ─── Library discovery strip ──────────────────────────────────────────────────
function LibraryStrip({ current, onSelect, T }) {
  const libs = Object.values(LIBRARIES);
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:T.muted, marginBottom:10, fontFamily:T.mono }}>Choose your library</div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
        {libs.map(lib => {
          const active = lib.id === current;
          return (
            <button
              key={lib.id}
              onClick={() => onSelect(lib.id)}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0,
                background: active ? lib.theme.accentDim : "transparent",
                border:`1px solid ${active ? lib.spineColor+"60" : T.rule}`,
                borderRadius:8, padding:"10px 14px",
                cursor:"pointer", transition:"all 0.18s",
                WebkitTapHighlightColor:"transparent",
                minWidth:80,
              }}
            >
              <span style={{ fontSize:18 }}>{lib.theme.badge}</span>
              <span style={{ fontSize:11, color: active ? lib.spineColor : T.muted, fontFamily:T.font, textAlign:"center", lineHeight:1.3 }}>{lib.spine || lib.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── useAutoGrow ──────────────────────────────────────────────────────────────
function useAutoGrow(ref, value) {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value, ref]);
}

// ─── Welcome screen ───────────────────────────────────────────────────────────
function Welcome({ onEnter }) {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ minHeight:"100vh", background:"#0D0A06", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Georgia',serif" }}>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:9, letterSpacing:"0.5em", textTransform:"uppercase", color:"#C9A84C", marginBottom:14, fontFamily:"'Courier New',monospace" }}>
            The Psychologist Blender
          </div>
          <div style={{ fontSize:28, color:"#F5EDD8", lineHeight:1.38, fontStyle:"italic", marginBottom:14 }}>
            What would the great minds say?
          </div>
          <div style={{ fontSize:13.5, color:"rgba(245,237,216,0.46)", lineHeight:1.82 }}>
            Ask anything — personal, historical, philosophical — and hear what great thinkers, beloved characters, and iconic minds might say about it.
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(245,237,216,0.08)", borderBottom:"1px solid rgba(245,237,216,0.08)", padding:"22px 0", marginBottom:28 }}>
          {[
            ["📖", "A library, not a clinic", "This explores ideas through real thinkers and beloved fictional characters. Not therapy, not diagnosis, not advice."],
            ["🔒", "Your session, your device", "Nothing you write is stored by us. Your question travels to an AI to generate a response, then disappears when you close this tab."],
            ["🌍", "Ask anything", "Personal struggles, world events, history, pop culture — all questions welcome across all libraries."],
          ].map(([icon, title, body]) => (
            <div key={title} style={{ display:"flex", gap:13, marginBottom:18 }}>
              <span style={{ fontSize:17, flexShrink:0, lineHeight:1.4 }}>{icon}</span>
              <div>
                <div style={{ fontSize:12, color:"#C9A84C", marginBottom:3 }}>{title}</div>
                <div style={{ fontSize:12.5, color:"rgba(245,237,216,0.44)", lineHeight:1.65 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
        <div onClick={() => setChecked(c => !c)} style={{ display:"flex", alignItems:"flex-start", gap:11, cursor:"pointer", marginBottom:22, WebkitTapHighlightColor:"transparent" }}>
          <div style={{ width:20, height:20, borderRadius:3, flexShrink:0, marginTop:2, border:`1px solid ${checked ? "#C9A84C80" : "rgba(245,237,216,0.18)"}`, background:checked ? "rgba(201,168,76,0.14)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
            {checked && <span style={{ color:"#C9A84C", fontSize:12 }}>✓</span>}
          </div>
          <span style={{ fontSize:12.5, color:"rgba(245,237,216,0.54)", lineHeight:1.7 }}>
            I understand this is educational exploration, not professional advice. I'll seek qualified support if I need real help.
          </span>
        </div>
        <button disabled={!checked} onClick={onEnter} style={{ width:"100%", padding:"14px", background:checked ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)", border:`1px solid ${checked ? "#C9A84C50" : "rgba(245,237,216,0.09)"}`, borderRadius:6, color:checked ? "#C9A84C" : "rgba(245,237,216,0.2)", fontSize:12.5, letterSpacing:"0.14em", textTransform:"uppercase", cursor:checked ? "pointer" : "not-allowed", fontFamily:"'Georgia',serif", transition:"all 0.22s" }}>
          Open the Library
        </button>
        <div style={{ marginTop:16, textAlign:"center", fontSize:11, color:"rgba(245,237,216,0.18)", lineHeight:1.7 }}>
          Crisis support: <span style={{color:"rgba(212,149,106,0.6)"}}>988</span> (call or text) · text <span style={{color:"rgba(212,149,106,0.6)"}}>HOME</span> to <span style={{color:"rgba(212,149,106,0.6)"}}>741741</span>
        </div>
      </div>
    </div>
  );
}

// ─── Library shelf picker ─────────────────────────────────────────────────────
function LibraryShelf({ current, onSelect, T }) {
  const [open, setOpen] = useState(false);
  const libs = Object.values(LIBRARIES);

  return (
    <div style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:8, background:T.accentDim, border:`1px solid ${T.accent}40`, borderRadius:5, padding:"7px 14px", color:T.accent, fontSize:12, cursor:"pointer", fontFamily:T.mono, letterSpacing:"0.08em", transition:"all 0.18s", WebkitTapHighlightColor:"transparent" }}
      >
        <span>{LIBRARIES[current].theme.badge}</span>
        <span>{LIBRARIES[current].name}</span>
        <span style={{ opacity:.6, fontSize:10, marginLeft:2 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:50 }}/>
          <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:100, background:T.bg === "#F5EDD8" || T.bg === "#FAF3E8" ? "#fff" : "#1C1812", border:`1px solid ${T.rule}`, borderRadius:10, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.3)", minWidth:260 }}>
            {/* Real thinkers */}
            <div style={{ padding:"10px 14px 6px", fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:T.muted, fontFamily:T.mono }}>Real Minds</div>
            {libs.filter(l => !l.fictional).map(lib => (
              <LibShelfItem key={lib.id} lib={lib} current={current} onSelect={id => { onSelect(id); setOpen(false); }}/>
            ))}
            {/* Fictional */}
            <div style={{ padding:"10px 14px 6px", fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:T.muted, fontFamily:T.mono, borderTop:`1px solid ${T.rule}`, marginTop:4 }}>Fictional Universes</div>
            {libs.filter(l => l.fictional).map(lib => (
              <LibShelfItem key={lib.id} lib={lib} current={current} onSelect={id => { onSelect(id); setOpen(false); }}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LibShelfItem({ lib, current, onSelect }) {
  const active = lib.id === current;
  return (
    <button
      onClick={() => onSelect(lib.id)}
      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:active ? lib.theme.accentDim : "transparent", border:"none", cursor:"pointer", textAlign:"left", transition:"background 0.15s", WebkitTapHighlightColor:"transparent" }}
    >
      <div style={{ width:4, height:36, borderRadius:2, background:lib.spineColor, flexShrink:0, opacity:active?1:.5 }}/>
      <div>
        <div style={{ fontSize:13, color:active ? lib.spineColor : "#888", fontStyle:"italic", fontFamily:"'Georgia',serif" }}>{lib.theme.badge} {lib.name}</div>
        <div style={{ fontSize:10.5, color:"rgba(100,100,100,0.7)", marginTop:2, fontFamily:"'Courier New',monospace" }}>{lib.subtitle}</div>
      </div>
      {active && <span style={{ marginLeft:"auto", color:lib.spineColor, fontSize:12 }}>✓</span>}
    </button>
  );
}

// ─── Thinker chip with bio card ──────────────────────────────────────────────
function ThinkerChip({ thinker, active, onClick, T, isMobile }) {
  const [showBio, setShowBio] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bio = THINKER_BIOS[thinker.id];
  const bioVisible = isMobile ? showBio : hovered;

  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:0 }}>
        <button
          onClick={onClick}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
          style={{ display:"inline-flex", alignItems:"center", background:active ? T.btnBg : "transparent", border:`1px solid ${active ? T.btnBg : T.rule}`, borderRadius: isMobile && bio ? "4px 0 0 4px" : "4px", borderRight: isMobile && bio ? "none" : undefined, padding:"6px 13px", color:active ? T.btnTxt : T.muted, fontSize:12.5, cursor:"pointer", transition:"all 0.18s", fontFamily:T.font, whiteSpace:"nowrap", WebkitTapHighlightColor:"transparent", transform:active ? "scale(1.02)" : "scale(1)" }}
        >
          {thinker.name}
        </button>
        {isMobile && bio && (
          <button
            onClick={() => setShowBio(s => !s)}
            style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", background: showBio ? T.accentDim : "transparent", border:`1px solid ${active ? T.btnBg : T.rule}`, borderLeft:`1px solid ${T.rule}`, borderRadius:"0 4px 4px 0", padding:"6px 8px", color: showBio ? T.accent : T.muted, fontSize:11, cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all 0.15s" }}
            aria-label={`About ${thinker.name}`}
          >ⓘ</button>
        )}
      </div>
      {bio && bioVisible && (
        <div style={{ position:"absolute", bottom:"calc(100% + 6px)", left:0, zIndex:200, background: T.bg === "#F5EDD8" || T.bg === "#FAF3E8" || T.bg === "#F0F7F0" || T.bg === "#FFFBF0" || T.bg === "#F0F4FA" ? "#fff" : "#1C1428", border:`1px solid ${T.rule}`, borderRadius:8, padding:"12px 14px", width:220, boxShadow:"0 8px 24px rgba(0,0,0,0.18)", pointerEvents:"none" }}>
          <div style={{ fontSize:11, color: T.accent, marginBottom:5, fontFamily: T.mono, letterSpacing:"0.06em" }}>{thinker.domain}</div>
          <div style={{ fontSize:12.5, lineHeight:1.65, color: T.bg === "#F5EDD8" || T.bg === "#FAF3E8" || T.bg === "#F0F7F0" || T.bg === "#FFFBF0" || T.bg === "#F0F4FA" ? "#1A1510" : "#F0E6D3", marginBottom:8 }}>{bio.bio}</div>
          <div style={{ fontSize:11, color: T.amber, fontStyle:"italic", lineHeight:1.5, borderTop:`1px solid ${T.rule}`, paddingTop:7, marginTop:4 }}>"{bio.idea}"</div>
          <div style={{ fontSize:10, color: T.bg === "#F5EDD8" || T.bg === "#FAF3E8" || T.bg === "#F0F7F0" || T.bg === "#FFFBF0" || T.bg === "#F0F4FA" ? "rgba(26,21,16,0.35)" : "rgba(240,230,211,0.35)", marginTop:6, fontFamily: T.mono }}>{thinker.years}</div>
        </div>
      )}
    </div>
  );
}

// ─── Blend banner ─────────────────────────────────────────────────────────────
function BlendBanner({ count, T, lib }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    if (count > 1) { const t = setTimeout(() => setShow(true), 30); return () => clearTimeout(t); }
  }, [count]);
  if (count <= 1) return null;
  return (
    <div style={{ overflow:"hidden", maxHeight:show?"60px":"0px", opacity:show?1:0, transition:"max-height 0.35s ease, opacity 0.3s ease", marginBottom:show?8:0 }}>
      <div style={{ background:T.accentDim, border:`1px solid ${T.accent}35`, borderRadius:4, padding:"8px 14px", fontSize:12, color:T.accent, display:"flex", alignItems:"center", gap:8 }}>
        <span>⚗</span>
        <span>{count} {lib.fictional ? "voices" : "perspectives"} will be blended into a unified response</span>
      </div>
    </div>
  );
}

// ─── Perspective block ────────────────────────────────────────────────────────
function PerspectiveBlock({ p, index, isLast, T, visible }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ borderBottom:isLast?"none":`1px solid ${T.rule}`, padding:"22px 0", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(12px)", transition:`opacity 0.4s ease ${index*0.15}s, transform 0.4s ease ${index*0.15}s` }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:T.accent, marginBottom:5, letterSpacing:"0.04em", fontFamily:T.mono }}>{p.thinker}</div>
          <div style={{ fontSize:15.5, color:T.ink, fontStyle:"italic", lineHeight:1.5 }}>{p.stance}</div>
        </div>
        <span style={{ color:T.faint, fontSize:12, flexShrink:0, marginTop:4, display:"inline-block", transform:expanded?"rotate(0)":"rotate(180deg)", transition:"transform 0.2s" }}>▲</span>
      </div>
      <div style={{ overflow:"hidden", maxHeight:expanded?"500px":"0px", transition:"max-height 0.35s ease" }}>
        <div style={{ marginTop:12, fontSize:14, lineHeight:1.92, color:T.ink, paddingLeft:16, borderLeft:`2px solid ${T.rule}`, opacity:.82 }}>{p.body}</div>
      </div>
    </div>
  );
}

// ─── Response ─────────────────────────────────────────────────────────────────
function Response({ entry, onClear, T }) {
  const [visible, setVisible] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const d = entry.data;
  const lib = LIBRARIES[entry.library];

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, [entry]);

  return (
    <div style={{ marginTop:44 }}>
      {showCard && <ShareCard entry={entry} onClose={() => setShowCard(false)}/>}
      <div style={{ marginBottom:28, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(8px)", transition:"opacity 0.35s, transform 0.35s" }}>
        <div style={{ fontSize:10.5, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:10, fontFamily:T.mono }}>
          {entry.thinkers.join(" · ")}
          {entry.isBlend && <span style={{ color:T.accent, marginLeft:8 }}>⚗ blended</span>}
          <span style={{ marginLeft:8 }}>{lib.theme.badge}</span>
        </div>
        <div style={{ fontSize:21, color:T.ink, fontStyle:"italic", lineHeight:1.45 }}>{d.title}</div>
      </div>

      <div style={{ borderTop:`1px solid ${T.rule}` }}>
        {d.perspectives?.map((p, i) => (
          <PerspectiveBlock key={i} p={p} index={i} isLast={i===d.perspectives.length-1} T={T} visible={visible}/>
        ))}
      </div>

      {d.convergence && d.convergence !== "null" && (
        <div style={{ margin:"24px 0", padding:"18px 22px", background:T.accentDim, borderRadius:4, borderLeft:`3px solid ${T.accent}55`, opacity:visible?1:0, transition:"opacity 0.4s ease 0.5s" }}>
          <div style={{ fontSize:9.5, letterSpacing:"0.22em", textTransform:"uppercase", color:T.accent, marginBottom:8, fontFamily:T.mono }}>Where they meet</div>
          <div style={{ fontSize:14, lineHeight:1.88, color:T.ink }}>{d.convergence}</div>
        </div>
      )}

      {d.openQuestion && (
        <div style={{ marginTop:26, paddingTop:22, borderTop:`1px solid ${T.rule}`, opacity:visible?1:0, transition:"opacity 0.4s ease 0.65s" }}>
          <div style={{ fontSize:9.5, letterSpacing:"0.22em", textTransform:"uppercase", color:T.muted, marginBottom:10, fontFamily:T.mono }}>A question worth sitting with</div>
          <div style={{ fontSize:17, fontStyle:"italic", color:T.amber, lineHeight:1.7 }}>"{d.openQuestion}"</div>
        </div>
      )}

      <div style={{ marginTop:34, paddingTop:20, borderTop:`1px solid ${T.rule}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap", opacity:visible?1:0, transition:"opacity 0.4s ease 0.8s" }}>
        <div style={{ fontSize:11, color:T.faint, lineHeight:1.7, maxWidth:380 }}>
          {lib.fictional
            ? <>{lib.fictional_note} Educational exploration only — not professional advice. </>
            : "Educational exploration only — not therapy or professional advice. "
          }
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{ color:T.faint, textDecoration:"underline" }}>Find support →</a>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => setShowCard(true)} style={{ background:T.accentDim, border:`1px solid ${T.accent}55`, borderRadius:4, padding:"9px 16px", color:T.accent, fontSize:12, cursor:"pointer", fontFamily:T.font, whiteSpace:"nowrap", transition:"all 0.2s" }}>
            Share card ↗
          </button>
          <CopyButton entry={entry} T={T}/>
          <button onClick={onClear} style={{ background:"transparent", border:`1px solid ${T.rule}`, borderRadius:4, padding:"9px 18px", color:T.muted, fontSize:12, cursor:"pointer", fontFamily:T.font, whiteSpace:"nowrap" }}>Ask another →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Share card ───────────────────────────────────────────────────────────────
const CARD_COLORS = {
  thinkers:    { bg:"#13100C", accent:"#C9A84C", text:"#F0E8D8", muted:"rgba(240,232,216,0.5)", rule:"rgba(201,168,76,0.25)" },
  hogwarts:    { bg:"#110C18", accent:"#D4AF37", text:"#F0E6D3", muted:"rgba(240,230,211,0.5)", rule:"rgba(212,175,55,0.25)" },
  marvel:      { bg:"#0A0D14", accent:"#E62429", text:"#E8EDF5", muted:"rgba(232,237,245,0.5)", rule:"rgba(230,36,41,0.25)" },
  gilmore:     { bg:"#1C100A", accent:"#C8845A", text:"#F5EAD8", muted:"rgba(245,234,216,0.5)", rule:"rgba(200,132,90,0.25)" },
  tedlasso:    { bg:"#0A140A", accent:"#4CAF50", text:"#E8F5E8", muted:"rgba(232,245,232,0.5)", rule:"rgba(76,175,80,0.25)" },
  goldengirls: { bg:"#16100A", accent:"#C4872A", text:"#F5EBDA", muted:"rgba(245,235,218,0.5)", rule:"rgba(196,135,42,0.25)" },
  fullhouse:   { bg:"#0A0E18", accent:"#6B8FD0", text:"#E4ECF7", muted:"rgba(228,236,247,0.5)", rule:"rgba(107,143,208,0.25)" },
};

function buildShareText(entry) {
  const d = entry.data;
  const lib = LIBRARIES[entry.library];
  return [
    lib.theme.badge + " " + entry.thinkers.join(" & ") + (entry.isBlend ? " (blended)" : ""),
    "",
    d.title,
    "",
    d.perspectives?.[0]?.stance || "",
    "",
    d.openQuestion ? '"' + d.openQuestion + '"' : "",
    "",
    "— The Psychologist Blender",
  ].filter(l => l !== null && l !== undefined).join("\n").trim();
}

function ShareCard({ entry, onClose, productUrl }) {
  const d = entry.data;
  const lib = LIBRARIES[entry.library];
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState(null); // null | "sharing" | "done" | "error"

  const firstPerspective = d.perspectives?.[0];
  const keySentence = firstPerspective?.body
    ? firstPerspective.body.replace(/([.!?])\s+/g, "$1|||").split("|||")[0]
    : "";

  const C = CARD_COLORS[entry.library] || CARD_COLORS.thinkers;
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // ── Download PNG via html2canvas ─────────────────────────────────────────
  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Dynamically load html2canvas from CDN
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: C.bg,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "psychologist-blender.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: let the user screenshot
      setShareStatus("error");
    }
    setDownloading(false);
  };

  // ── Native share sheet (mobile) ──────────────────────────────────────────
  const nativeShare = async () => {
    setShareStatus("sharing");
    try {
      await navigator.share({
        title: "The Psychologist Blender",
        text: buildShareText(entry),
        url: productUrl || window.location.href,
      });
      setShareStatus("done");
      setTimeout(() => setShareStatus(null), 2000);
    } catch (e) {
      if (e.name !== "AbortError") setShareStatus("error");
      else setShareStatus(null);
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
    >
      <div style={{ maxWidth:480, width:"100%", display:"flex", flexDirection:"column", gap:14 }}>

        {/* Card */}
        <div ref={cardRef} style={{
          background: C.bg, borderRadius:16, padding:"32px 28px",
          border:`1px solid ${C.rule}`, position:"relative", overflow:"hidden",
          fontFamily:"Georgia,'Times New Roman',serif",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.accent}00,${C.accent},${C.accent}00)`, opacity:.7 }}/>

          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <span style={{ fontSize:18 }}>{lib.theme.badge}</span>
            <span style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.accent, fontFamily:"'Courier New',monospace" }}>{lib.name}</span>
          </div>

          <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:C.muted, marginBottom:11, fontFamily:"'Courier New',monospace" }}>
            {entry.thinkers.join(" · ")}
            {entry.isBlend && <span style={{ color:C.accent, marginLeft:6 }}>⚗</span>}
          </div>

          <div style={{ fontSize:22, fontStyle:"italic", color:C.text, lineHeight:1.42, marginBottom:18 }}>
            {d.title}
          </div>

          {keySentence && (
            <div style={{ fontSize:13.5, lineHeight:1.82, color:C.muted, borderLeft:`2px solid ${C.accent}45`, paddingLeft:16, marginBottom:22 }}>
              {keySentence}
            </div>
          )}

          {d.openQuestion && (
            <div style={{ fontSize:13, fontStyle:"italic", color:C.accent, borderTop:`1px solid ${C.rule}`, paddingTop:16, lineHeight:1.7 }}>
              "{d.openQuestion}"
            </div>
          )}

          <div style={{ marginTop:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.muted, fontFamily:"'Courier New',monospace", opacity:.55 }}>
              The Psychologist Blender
            </div>
            <div style={{ fontSize:10, color:C.muted, opacity:.4, fontFamily:"'Courier New',monospace" }}>
              Educational · Not professional advice
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {/* Desktop: download PNG */}
          {!canNativeShare && (
            <button
              onClick={downloadImage}
              disabled={downloading}
              style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"11px 16px", color:"#fff", fontSize:13, cursor:downloading?"wait":"pointer", fontFamily:"Georgia,serif", transition:"all 0.18s", opacity:downloading?.6:1 }}
            >
              {downloading ? "Preparing…" : "⬇ Download card"}
            </button>
          )}

          {/* Mobile: native share sheet */}
          {canNativeShare && (
            <button
              onClick={nativeShare}
              disabled={shareStatus === "sharing"}
              style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"11px 16px", color:"#fff", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.18s" }}
            >
              {shareStatus === "sharing" ? "Opening…" : shareStatus === "done" ? "Shared ✓" : "Share ↗"}
            </button>
          )}

          <button
            onClick={onClose}
            style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"11px 18px", color:"rgba(255,255,255,0.55)", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif" }}
          >
            Close
          </button>
        </div>

        {shareStatus === "error" && (
          <div style={{ fontSize:12, color:"rgba(255,200,100,0.8)", textAlign:"center" }}>
            Sharing unavailable — try downloading or screenshotting the card above
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ entry, T }) {
  const [copied, setCopied] = useState(false);

  const buildText = () => {
    const d = entry.data;
    const lines = [
      `${entry.thinkers.join(" · ")}${entry.isBlend ? " ⚗ blended" : ""}`,
      "",
      d.title,
      "",
      ...(d.perspectives || []).flatMap(p => [
        "— " + p.thinker,
        p.stance,
        p.body,
        "",
      ]),
      ...(d.convergence && d.convergence !== "null" ? ["Where they meet:", d.convergence, ""] : []),
      ...(d.openQuestion ? ['A question worth sitting with: "' + d.openQuestion + '"', ""] : []),
      "— The Psychologist Blender · Educational exploration only, not professional advice",
    ];
    return lines.join("\n");
  };

  const fallbackCopy = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
    document.body.removeChild(el);
  };

  const copy = () => {
    const text = buildText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  return (
    <button onClick={copy} style={{ background: copied ? T.accentDim : "transparent", border:`1px solid ${copied ? T.accent+"60" : T.rule}`, borderRadius:4, padding:"9px 14px", color: copied ? T.accent : T.muted, fontSize:12, cursor:"pointer", fontFamily:T.font, whiteSpace:"nowrap", transition:"all 0.2s" }}>
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function Loading({ names, T }) {
  const [dots, setDots] = useState(0);
  useEffect(() => { const t = setInterval(() => setDots(d => (d+1)%4), 380); return () => clearInterval(t); }, []);
  return (
    <div style={{ marginTop:44, textAlign:"center" }}>
      <div style={{ fontSize:13, color:T.muted, fontStyle:"italic", marginBottom:14 }}>Consulting {names.join(", ")}{".".repeat(dots)}</div>
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:T.accent, animation:`pulse 1.3s ease-in-out ${i*.22}s infinite` }}/>)}
      </div>
    </div>
  );
}

// ─── Add thinker search (thinkers library only) ───────────────────────────────
function AddThinkerSearch({ onAdd, T }) {
  const [q, setQ] = useState(""); const [results, setResults] = useState([]); const [loading, setLoading] = useState(false); const [open, setOpen] = useState(false); const inputRef = useRef(null);
  const search = async () => {
    if (!q.trim()) return; setLoading(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400, messages:[{ role:"user", content:`Find psychologists, philosophers, or thinkers matching: "${q}". Return JSON array ≤4: [{name,domain,years,description}]. JSON only.` }] }) });
      const d = await res.json(); const raw = d.content?.map(c=>c.text||"").join("")||"[]";
      setResults(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch { setResults([{ name:q, domain:"Thinker", years:"", description:"" }]); }
    setLoading(false);
  };
  if (!open) return <button onClick={() => { setOpen(true); setTimeout(()=>inputRef.current?.focus(),60); }} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"transparent", border:`1px dashed ${T.rule}`, borderRadius:4, padding:"6px 12px", color:T.faint, fontSize:12, cursor:"pointer", fontFamily:T.font, WebkitTapHighlightColor:"transparent" }}>+ add a thinker</button>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7, maxWidth:340 }}>
      <div style={{ display:"flex", gap:6 }}>
        <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Nietzsche, Plato, bell hooks…" style={{ flex:1, background:"transparent", border:`1px solid ${T.rule}`, borderRadius:4, padding:"7px 11px", color:T.ink, fontSize:13, outline:"none", fontFamily:T.font }}/>
        <button onClick={search} disabled={loading||!q.trim()} style={{ background:T.accentDim, border:`1px solid ${T.accent}45`, borderRadius:4, padding:"7px 14px", color:T.accent, fontSize:12, cursor:q.trim()?"pointer":"not-allowed", fontFamily:T.font, opacity:loading||!q.trim()?.5:1 }}>{loading?"…":"Search"}</button>
        <button onClick={() => { setOpen(false); setQ(""); setResults([]); }} style={{ background:"transparent", border:`1px solid ${T.rule}`, borderRadius:4, padding:"7px 10px", color:T.muted, fontSize:13, cursor:"pointer" }}>×</button>
      </div>
      {results.map((r,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, background:T.accentDim, borderRadius:4, padding:"9px 12px", border:`1px solid ${T.rule}` }}>
          <div><div style={{ fontSize:13, color:T.ink, fontStyle:"italic" }}>{r.name}</div><div style={{ fontSize:10.5, color:T.muted }}>{r.domain}{r.years?` · ${r.years}`:""}</div></div>
          <button onClick={() => { onAdd(r); setResults([]); setQ(""); setOpen(false); }} style={{ background:T.accentDim, border:`1px solid ${T.accent}45`, borderRadius:4, padding:"5px 12px", color:T.accent, fontSize:12, cursor:"pointer", flexShrink:0 }}>+ Add</button>
        </div>
      ))}
    </div>
  );
}

// ─── History strip ────────────────────────────────────────────────────────────
function HistoryStrip({ history, onSelect, T }) {
  if (!history.length) return null;
  return (
    <div style={{ marginTop:32, paddingTop:18, borderTop:`1px solid ${T.rule}` }}>
      <div style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:T.faint, marginBottom:11, fontFamily:T.mono }}>This session</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {history.map((h,i) => (
          <button key={i} onClick={() => onSelect(h)} style={{ background:"transparent", border:`1px solid ${T.rule}`, borderRadius:4, padding:"5px 13px", color:T.muted, fontSize:11.5, cursor:"pointer", fontFamily:T.font, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {LIBRARIES[h.library]?.theme.badge} {h.question.slice(0,34)}{h.question.length>34?"…":""}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function PsychologistBlender() {
  const isMobile = useIsMobile();
  const [entered,   setEntered]   = useState(false);
  const [library,   setLibrary]   = useState("thinkers");
  const [extraT,    setExtraT]    = useState([]); // user-added thinkers (thinkers lib only)
  const [selected,  setSelected]  = useState([]);
  const [question,  setQuestion]  = useState("");
  const [response,  setResponse]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([]);
  const textareaRef               = useRef(null);
  const responseRef               = useRef(null);

  useAutoGrow(textareaRef, question);

  const lib = LIBRARIES[library];
  const T   = lib.theme;
  const allThinkers = library === "thinkers" ? [...lib.thinkers, ...extraT] : lib.thinkers;

  // Reset selection when switching library
  const switchLibrary = useCallback(id => {
    setLibrary(id);
    setSelected([]);
    setResponse(null);
  }, []);

  const toggleThinker = useCallback(id => setSelected(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]), []);
  const addThinker    = useCallback(t => {
    const id = t.name.toLowerCase().replace(/\s+/g,"_");
    setExtraT(p => p.find(x=>x.id===id)?p:[...p,{id,name:t.name,domain:t.domain||"",years:t.years||""}]);
  }, []);

  const surprise = () => {
    const prompts = SURPRISE_PROMPTS[library] || SURPRISE_PROMPTS.thinkers;
    const shuffled = [...allThinkers].sort(()=>Math.random()-.5);
    const pick = Math.random()>.4?2:1;
    setSelected(shuffled.slice(0,pick).map(t=>t.id));
    setQuestion(prompts[Math.floor(Math.random()*prompts.length)]);
    setTimeout(()=>textareaRef.current?.focus(),50);
  };

  const isBlend = selected.length > 1;
  const canAsk  = selected.length > 0 && question.trim().length > 3;

  const ask = async () => {
    if (!canAsk||loading) return;
    setLoading(true); setResponse(null);
    const thinkerNames = selected.map(id=>allThinkers.find(x=>x.id===id)?.name||id);
    const prompt = buildPrompt(question.trim(), thinkerNames, isBlend, library);
    try {
      const res  = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200, messages:[{role:"user",content:prompt}] }) });
      const d    = await res.json();
      const raw  = d.content?.map(c=>c.text||"").join("")||"{}";
      const data = JSON.parse(raw.replace(/```json|```/g,"").trim());
      const entry = { question:question.trim(), thinkers:thinkerNames, isBlend, library, data };
      setResponse(entry);
      setHistory(prev=>[entry,...prev.slice(0,9)]);
      setTimeout(()=>responseRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    } catch {
      const tN = selected.map(id=>allThinkers.find(x=>x.id===id)?.name||id);
      const fallback = { question:question.trim(), thinkers:tN, isBlend, library, data:{ title:"Connect the API for live responses", perspectives:tN.map(name=>({thinker:name,stance:"Preview mode — connect the API for live responses.",body:`In live mode, ${name} would offer a perspective on "${question.trim()}" drawn from their actual ideas and story.`})), convergence:isBlend?"In live mode, convergence between these voices would be surfaced here.":null, openQuestion:"What draws you to this question right now?" }};
      setResponse(fallback);
      setHistory(prev=>[fallback,...prev.slice(0,9)]);
    }
    setLoading(false);
  };

  const clear = () => { setResponse(null); setQuestion(""); setTimeout(()=>textareaRef.current?.focus(),60); };

  if (!entered) return <Welcome onEnter={()=>setEntered(true)}/>;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font, transition:"background 0.5s ease" }}>
      {T.ambient && <div style={{ position:"fixed", inset:0, pointerEvents:"none", background:T.ambient, transition:"background 0.5s ease" }}/>}

      <div style={{ maxWidth:660, margin:"0 auto", padding:"0 22px 80px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ paddingTop:40, paddingBottom:26, borderBottom:`1px solid ${T.rule}`, marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:"0.45em", textTransform:"uppercase", color:T.accent, marginBottom:7, fontFamily:T.mono, transition:"color 0.4s" }}>
                The Psychologist Blender
              </div>
              <div style={{ fontSize:19, fontStyle:"italic", color:T.ink, lineHeight:1.4, transition:"color 0.4s" }}>
                {lib.subtitle}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <LibraryShelf current={library} onSelect={switchLibrary} T={T}/>
              <button onClick={surprise} style={{ background:T.accentDim, border:`1px solid ${T.accent}40`, borderRadius:5, padding:"7px 13px", color:T.accent, fontSize:11.5, cursor:"pointer", fontFamily:T.font, letterSpacing:"0.04em", whiteSpace:"nowrap", WebkitTapHighlightColor:"transparent", transition:"all 0.2s" }}>
                ✦ Surprise me
              </button>
              <button onClick={()=>setEntered(false)} style={{ background:"transparent", border:"none", color:T.faint, fontSize:11, cursor:"pointer", fontFamily:T.mono, padding:"7px 4px" }}>about</button>
            </div>
          </div>
        </div>

        {/* Library discovery strip */}
        {!response && !loading && (
          <LibraryStrip current={library} onSelect={switchLibrary} T={T}/>
        )}

        {/* Question */}
        <div style={{ marginBottom:22 }}>
          <textarea
            ref={textareaRef}
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))ask(); }}
            placeholder={`Ask anything — ${lib.fictional ? `a question for the ${lib.name}` : "a personal struggle, world event, philosophical puzzle"}…`}
            style={{ width:"100%", background:"transparent", border:"none", borderBottom:`2px solid ${T.rule}`, borderRadius:0, padding:"10px 0 14px", color:T.ink, fontSize:17, lineHeight:1.72, resize:"none", outline:"none", overflow:"hidden", fontFamily:T.font, boxSizing:"border-box", transition:"border-color 0.22s, color 0.4s", minHeight:80 }}
            onFocus={e=>e.target.style.borderBottomColor=T.accent}
            onBlur={e=>e.target.style.borderBottomColor=T.rule}
            rows={3}
          />
          <div style={{ fontSize:10.5, color:T.faint, marginTop:6, fontFamily:T.mono }}>⌘↵ to ask · not stored after this session</div>
        </div>

        {/* Who should weigh in */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:9.5, letterSpacing:"0.24em", textTransform:"uppercase", color:T.muted, marginBottom:11, fontFamily:T.mono }}>
            Who should weigh in?
          </div>
          <BlendBanner count={selected.length} T={T} lib={lib}/>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:12 }}>
            {allThinkers.map(t => (
              <ThinkerChip key={t.id} thinker={t} active={selected.includes(t.id)} onClick={()=>toggleThinker(t.id)} T={T} isMobile={isMobile}/>
            ))}
          </div>
          {library==="thinkers" && <AddThinkerSearch onAdd={addThinker} T={T}/>}
        </div>

        {/* Ask */}
        <button onClick={ask} disabled={!canAsk||loading} style={{ background:canAsk&&!loading?T.btnBg:"transparent", border:`1px solid ${canAsk&&!loading?T.btnBg:T.rule}`, borderRadius:5, padding:"12px 34px", color:canAsk&&!loading?T.btnTxt:T.muted, fontSize:13, letterSpacing:"0.12em", textTransform:"uppercase", cursor:canAsk&&!loading?"pointer":"not-allowed", fontFamily:T.font, transition:"all 0.22s", WebkitTapHighlightColor:"transparent" }}>
          {loading?"Consulting…":isBlend?`Blend ${selected.length} ${lib.fictional?"Voices":"Minds"}`:"Ask"}
        </button>

        {/* Response */}
        <div ref={responseRef}>
          {loading && <Loading names={selected.map(id=>allThinkers.find(x=>x.id===id)?.name||id)} T={T}/>}
          {!loading && response && <Response entry={response} onClear={clear} T={T}/>}
        </div>

        {/* History */}
        {!response && !loading && <HistoryStrip history={history} onSelect={h=>{setResponse(h);setQuestion(h.question);}} T={T}/>}

        {/* Footer */}
        <div style={{ marginTop:56, paddingTop:18, borderTop:`1px solid ${T.rule}`, fontSize:11, color:T.faint, lineHeight:1.8, textAlign:"center" }}>
          If you need real support: <span style={{color:T.amber}}>988</span> (call or text) · text <span style={{color:T.amber}}>HOME</span> to <span style={{color:T.amber}}>741741</span>
          <span style={{ display:"block", marginTop:4, fontSize:10.5 }}>
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{color:T.faint}}>findahelpline.com</a> for international resources
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{transform:scale(.55);opacity:.25}50%{transform:scale(1);opacity:1}}
        textarea{caret-color:currentColor;}
        input:focus{outline:none;}
        a{color:inherit;}
        *{box-sizing:border-box;}
        @media(max-width:580px){textarea{font-size:15px!important;}button{min-height:40px;}}
      `}</style>
    </div>
  );
}
