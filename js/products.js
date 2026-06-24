const PRODUCTS = [
  {
    id: "barricade-65wg",
    fullName: "Barricade 65WG Herbicide, Syngenta",
    brand: "Syngenta",
    type: "pre-emergent",
    formulation: "granule",
    activeIngredients: [
      "Prodiamine 65%"
    ],
    genericAlternatives: [
        {
        fullName: "Prodiamine 65 WDG Herbicide, Quali-Pro", // Quali-Pro is a brand of Control Solutions, Inc.
        activeIngredient: "Prodiamine 65%",
        note: "Same active ingredient and concentration. Generic alternative. Typically lowest cost option."
        },
        {
        fullName: "Resolute 65 WG Herbicide, Syngenta",
        activeIngredient: "Prodiamine 65%",
        note: "Same product as Barricade 65WG under a different Syngenta brand name"
        },
        {
        fullName: "Prodiamine 65 WG Herbicide, Alligare",
        activeIngredient: "Prodiamine 65%",
        note: "Same active ingredient and concentration. Generic alternative."
        }
    ],
    mixUnit: "oz",
    perUnit: 1000,
    rateMin: 0.185,                  // fall/spring split app (low end)
    rateMax: 0.83,                  // single app (high end)
    rateDefault: 0.36,
    turfRates: [
        {
            turfGroup: [
            "Bahiagrass", "Bermudagrass", "Centipedegrass", "Kikuyugrass",
            "Seashore Paspalum", "St. Augustinegrass", "Tall Fescue", "Zoysiagrass"
            ],
            rateMin: 0.36,
            rateMax: 0.83
        },
        {
            turfGroup: ["Buffalograss", "Kentucky Bluegrass", "Perennial Ryegrass"],
            rateMin: 0.185,
            rateMax: 0.55
        },
        {
            turfGroup: ["Fine Fescue"],
            rateMin: 0.185,
            rateMax: 0.42
        },
        {
            turfGroup: ["Creeping Bentgrass"],
            rateMin: 0.185,
            rateMax: 0.37,
            notes: "Must be mowed at 0.5 inches or more in height"
        }
    ],
    waterPerUnit: 0.5,
    turfTypes: [
        "Bahiagrass",
        "Bermudagrass",
        "Buffalograss",
        "Centipedegrass",
        "Creeping Bentgrass",
        "Fine Fescue",
        "Kentucky Bluegrass",
        "Kikuyugrass",
        "Perennial Ryegrass",
        "Seashore Paspalum",
        "St. Augustinegrass",
        "Tall Fescue",
        "Zoysiagrass"
    ],
    notSafeTurf: [
        "Dichondra (do not apply where desirable)",
        "Colonial Bentgrass (do not apply where desirable)",
        "Velvet Bentgrass (do not apply where desirable)",
        "Newly seeded areas (wait 60 days after germination)",
        "Newly set sod (wait until rooted and edges filled in)"
    ],
    targetWeeds: [
        "Annual Bluegrass (Poa annua)",
        "Annual Foxtail",
        "Barnyardgrass (Echinochloa crus-galli)",
        "Broadleaf Signalgrass (Urochloa platyphylla)",
        "Browntop Panicum",
        "Carpetweed (Mollugo verticillata)",
        "Common Chickweed (Stellaria media)",
        "Common Lambsquarters (Chenopodium album)",
        "Common Purslane (Portulaca oleracea)",
        "Crowfootgrass (Dactyloctenium aegyptium)",
        "Fall Panicum (Panicum dichotomiflorum)",
        "Florida Pusley (Richardia scabra)",
        "Goosegrass (Eleusine indica)",
        "Henbit (Lamium amplexicaule)",
        "Itchgrass (Rottboellia cochinchinensis)",
        "Johnsongrass (Sorghum halepense)",
        "Junglerice (Echinochloa colona)",
        "Knotweed (Polygonum aviculare)",
        "Kochia (Bassia scoparia)",
        "Large Crabgrass (Digitaria sanguinalis)",
        "Lovegrass",
        "Mouseear Chickweed (Cerastium fontanum)",
        "Persian Speedwell (Veronica persica)",
        "Pigweed",
        "Prostrate Spurge",
        "Rescuegrass (Bromus catharticus)",
        "Shepherd's-purse (Capsella bursa-pastoris)",
        "Smooth Crabgrass (Digitaria ischaemum)",
        "Sprangletop",
        "Texas Panicum (Urochloa texana)",
        "Witchgrass (Panicum capillare)",
        "Woolly Cupgrass (Eriochloa villosa)",
        "Yellow Woodsorrel (Oxalis stricta)"
    ],
    containerSizes: [
      { label: "5 lb jug", oz: 80 },
    ],
    EPAtoxicityLevel: "CAUTION",
    reentryInterval: "Until dry",
    applicationNotes: [
        "Apply before target weeds germinate — this product will not control weeds that have already emerged",
        "Activate with at least 0.5 inch of rainfall or irrigation within 14 days of application",
        "For spring crabgrass control in cool-season grasses: apply in fall after soil temperature drops below 50°F but before ground freezes",
        "For summer annual weeds: apply in early spring before soil temperature reaches germination threshold for your region",
        "Do not disturb soil after application — cultivation breaks the herbicide barrier and reduces weed control"
    ],
    restrictions: [
        "Do not apply to golf course putting greens",
        "Do not apply where dichondra, colonial bentgrass, or velvet bentgrass are desirable",
        "Do not harvest sod within 90 days of application",
        "Do not apply to stressed turf (drought, low fertility, pest damage)",
        "Do not apply to newly set sod until rooted and edges filled in",
        "Wait 60 days after seeding or until after second mowing (whichever is longer) before applying to overseeded areas"
    ],
    labelUrl: "https://www3.epa.gov/pesticides/chem_search/ppls/000100-00834-20040521.pdf"
  },
  {
    id: "celsius-wg",
    fullName: "Celsius WG Herbicide, Envu",
    brand: "Envu",
    type: "post-emergent",
    formulation: "granule",          // "granule" or "liquid"
    activeIngredients: [
        "Thiencarbazone-methyl 8.7%",
        "Iodosulfuron-methyl-sodium 1.9%",
        "Dicamba 57.4%"
    ],
    genericAlternatives: [],
    mixUnit: "oz",                   // unit the label uses for mixing
    perUnit: 1000,                   // per how many sq ft
    rateMin: 0.057,                  // oz per 1000 sq ft
    rateMax: 0.113,                  // oz per 1000 sq ft
    rateDefault: 0.057,
    rateTiers: [
      { label: "Low",    ozPer1k: 0.057 },
      { label: "Medium", ozPer1k: 0.085 },
      { label: "High",   ozPer1k: 0.113 }
    ],
    annualMaxPer1k: 0.17,
    waterPerUnit: 1,   // gal per 1,000 sq ft (zone/spot)
    turfTypes: [
        "Bermudagrass",
        "Centipedegrass",
        "St. Augustinegrass",
        "Zoysiagrass"
    ],
    notSafeTurf: [
        "Bahiagrass",
        "Creeping Bentgrass",
        "Fine Fescue",
        "Kentucky Bluegrass",
        "Perennial Ryegrass",
        "Seashore Paspalum",
        "Tall Fescue"
    ],
    targetWeeds: [
        { name: "Annual Lespedeza",                           rateRequired: "High"   },
        { name: "Barnyardgrass (Echinochloa crus-galli)",     rateRequired: "Low"    },
        { name: "Black Medic (Medicago lupulina)",            rateRequired: "High"   },
        { name: "Broadleaf Signalgrass (Urochloa platyphylla)", rateRequired: "Medium" },
        { name: "Browntop Millet (Urochloa ramosa)",          rateRequired: "Medium" },
        { name: "Carolina Geranium (Geranium carolinianum)",  rateRequired: "Medium" },
        { name: "Carpetgrass (Axonopus fissifolius)",         rateRequired: "Medium" },
        { name: "Chamberbitter (Phyllanthus urinaria)",       rateRequired: "Medium" },
        { name: "Common Ragweed (Ambrosia artemisiifolia)",   rateRequired: "Low"    },
        { name: "Curly Dock (Rumex crispus)",                 rateRequired: "Low"    },
        { name: "Dallisgrass (Paspalum dilatatum)",            rateRequired: "Medium" },
        { name: "Dandelion (Taraxacum officinale)",           rateRequired: "Low"    },
        { name: "Dogfennel (Eupatorium capillifolium)",       rateRequired: "Medium" },
        { name: "Dollarweed / Pennywort",                     rateRequired: "Medium" },
        { name: "Doveweed (Murdannia nudiflora)",             rateRequired: "High"   },
        { name: "Field Sandbur",                               rateRequired: "Medium" },
        { name: "Fleabane",                                    rateRequired: "Medium" },
        { name: "Florida Betony (Stachys floridana)",         rateRequired: "Medium" },
        { name: "Florida Pusley (Richardia scabra)",          rateRequired: "High"   },
        { name: "Ground Ivy (Glechoma hederacea)",            rateRequired: "Low"    },
        { name: "Henbit (Lamium amplexicaule)",               rateRequired: "Low"    },
        { name: "Johnsongrass (Sorghum halepense)",           rateRequired: "Low"    },
        { name: "Large Crabgrass (Digitaria sanguinalis)",    rateRequired: "High"   },
        { name: "Lawn Burweed (Soliva sessilis)",             rateRequired: "Low"    },
        { name: "Oxalis",                                      rateRequired: "Medium" },
        { name: "Prostrate Spurge",                            rateRequired: "High"   },
        { name: "Sicklepod (Senna obtusifolia)",              rateRequired: "Medium" },
        { name: "Virginia Buttonweed (Diodia virginiana)",    rateRequired: "High"   },
        { name: "White Clover (Trifolium repens)",            rateRequired: "Low"    },
        { name: "Wild Garlic (Allium vineale)",               rateRequired: "Medium" }
    ],
    containerSizes: [
      { label: "Single-dose pack", oz: 0.226 },
      { label: "10 oz bottle", oz: 10 },
    ],
    EPAtoxicityLevel: "CAUTION",
    reentryInterval: "Until spray has dried (sod farms: 24 hours)",
    applicationNotes: [
        "Apply to actively growing weeds — mature or hardened-off weeds may not be controlled",
        "Weed control is faster when soil temperatures are above 65°F and soil moisture is adequate",
        "Expect weed yellowing within hours; full control takes 1–4 weeks depending on weed and conditions",
        "Apply mixed spray solution within 5 days of mixing to avoid product degradation",
        "Irrigate before application if turf is under drought stress — do not irrigate until spray has dried",
        "Rainfall before spray dries may reduce control and require retreatment",
        "Spot treatments on St. Augustinegrass above 90°F may cause temporary growth regulation — turf recovers after mowing",
        "For high weed pressure, add non-ionic surfactant (NIS) at 0.25% v/v to spray solution",
        "For difficult-to-control weeds, methylated seed oil (MSO) at 0.25–0.5% v/v may improve control"    
    ],
    restrictions: [
        "Do not apply if frost/freeze expected within 48 hours",
        "Do not use surfactant above 90°F",
        "Do not apply to stressed turf with adjuvant",
        "Do not apply to golf course greens or collars",
        "Do not apply by air or through any irrigation system",
        "Do not apply to turf exhibiting injury from previous pesticide applications",
        "Do not mow until spray has dried after application — do not transfer clippings to non-target areas",
        "Do not plant ornamentals or bedding plants in treated bare areas for at least 30 days after last application",
        "Allow minimum 14 days between broadcast application and overseeding with ryegrass",
        "Max single app: 0.113 oz per 1,000 sq ft",
        "Max annual: 0.17 oz per 1,000 sq ft"
    ],
    labelUrl: "https://bynder.envu.com/m/65d25e1e68990f59/original/Digital_TO_Celsius-WG_label_NA_US_EN.pdf"
  },

  {
    id: "certainty-turf",
    fullName: "Certainty Turf Herbicide, Valent",
    brand: "Valent",
    type: "post-emergent",
    formulation: "granule",
    activeIngredients: [
        "Sulfosulfuron 75.0%"
    ],
    genericAlternatives: [
        {
            fullName: "Sertay Herbicide, Atticus",
            activeIngredient: "Sulfosulfuron 75%",
            note: "Same active ingredient and concentration. Typically available at lower cost."
        }
    ],
    mixUnit: "oz",
    perUnit: 1000,
    rateMin: 0.0172,    // 0.75 oz/acre — low end (rescuegrass)
    rateMax: 0.0459,    // 2.0 oz/acre — max single application
    rateDefault: 0.0287, // 1.25 oz/acre — standard sedge/kyllinga rate
    rateTiers: [
        { label: "Low",     ozPer1k: 0.0172 },
        { label: "Medium",  ozPer1k: 0.0287 },
        { label: "High",    ozPer1k: 0.0459 }
    ],
    annualMaxPer1k: 0.0611,   // 2.66 oz/acre
    waterPerUnit: 2,           // fixed — 2 gal per 1,000 sq ft
    surfactant: "NIS at 0.25–0.5% v/v (required)",
    rainfastHours: 2,
    turfTypes: [
        "Bahiagrass",
        "Bermudagrass",
        "Big Bluestem",
        "Buffalograss",
        "Centipedegrass",
        "Indiangrass",
        "Kikuyugrass",
        "Little Bluestem",
        "Seashore Paspalum",
        "St. Augustinegrass",
        "Switchgrass",
        "Zoysiagrass"
    ],
    turfNotes: [
        "St. Augustinegrass and Seashore Paspalum are more sensitive — test on small area before wide-scale use",
        "May cause temporary chlorosis on all listed warm-season grasses"
    ],
    notSafeTurf: [
        "Annual Bluegrass / Poa annua (actively removed)",
        "Kentucky Bluegrass (not listed as safe)",
        "Perennial Ryegrass (actively removed)",
        "Tall Fescue (this product actively removes it)"
    ],
    targetWeeds: [
        "Annual Bluegrass (Poa annua)",
        "Annual Sedges",
        "Common Chickweed (Stellaria media)",
        "Crowfootgrass (Dactyloctenium aegyptium)",
        "Dallisgrass (Paspalum dilatatum)",
        "Dandelion (Taraxacum officinale)",
        "Dollarweed / Pennywort",
        "False Green Kyllinga",
        "Fragrant Kyllinga (Kyllinga odorata)",
        "Globe Sedge",
        "Green Kyllinga (Kyllinga brevifolia)",
        "Henbit (Lamium amplexicaule)",
        "Johnsongrass (Sorghum halepense)",
        "Perennial Ryegrass (Lolium perenne)",
        "Purple Nutsedge (Cyperus rotundus)",
        "Rescuegrass (Bromus catharticus)",
        "Shepherd's-purse (Capsella bursa-pastoris)",
        "Tall Fescue (Festuca arundinacea)",
        "Virginia Buttonweed (Diodia virginiana)",
        "White Clover (Trifolium repens)",
        "Yellow Nutsedge (Cyperus esculentus)"
    ],
    containerSizes: [
        { label: "1.25 oz bottle", oz: 1.25 }
    ],
    EPAtoxicityLevel: "CAUTION",
    reentryInterval: "Until spray has dried (agricultural use: 12 hours)",
    applicationNotes: [
        "Apply when target weeds are actively growing — do not mow for at least 2 days before and 2 days after application",
        "Weed growth stops within 24 hours; visible yellowing or browning typically appears within 2–3 weeks",
        "Warm, moist conditions after application accelerate control — cold or dry conditions delay it",
        "Weeds under drought stress are less susceptible — irrigate before application if needed",
        "Nonionic surfactant (NIS) required at 0.25–0.5% v/v — use only NIS with at least 90% active ingredient",
        "May cause temporary chlorosis on all listed turf types — more pronounced on St. Augustinegrass and Seashore Paspalum",
        "On cool-season turf, apply only when actively growing and mowing is still required"    
    ],
    restrictions: [
        "Do not apply through air or any irrigation system",
        "Do not apply directly to or within 4 feet of golf course putting greens",
        "Do not use nonionic surfactants that lower spray solution pH below 5",
        "Sequential applications must be at least 3 weeks apart (4+ weeks for sedge control)",
        "Rainfastness: 2 hours — repeat if rainfall within 2 hours of application",
        "Max single application: 2.0 oz/acre (0.0459 oz/1,000 sq ft)",
        "Max annual: 2.66 oz/acre (0.0611 oz/1,000 sq ft)",
        "Test on St. Augustinegrass and Seashore Paspalum before wide-scale use"
    ],
    labelUrl: "https://www.cdms.net/ldat/ldDIQ000.pdf"
  },

  {
    id: "drive-xlr8",
    fullName: "Drive XLR8 Herbicide, BASF",
    brand: "BASF",
    type: "post-emergent",
    formulation: "liquid",
    activeIngredients: [
      "Dimethylamine salt of quinclorac 18.92%"
    ],
    genericAlternatives: [],
    mixUnit: "fl oz",
    perUnit: 1000,
    rateMin: 0.5,     // fl oz per 1000 sq ft — creeping bentgrass split app low end
    rateMax: 1.45,    // fl oz per 1000 sq ft — standard broadcast rate per label Table 3
    rateDefault: 1.45,
    turfRates: [
      {
        turfGroup: [
          "Annual Bluegrass", "Annual Ryegrass", "Bermudagrass",
          "Buffalograss", "Chewing's Fescue", "Fine Fescue",
          "Hard Fescue", "Kentucky Bluegrass", "Perennial Ryegrass",
          "Red Fescue", "Rough Bluegrass", "Tall Fescue", "Zoysiagrass"
        ],
        rateMin: 1.45,
        rateMax: 1.45   // single application rate per label; no low/high range for standard turf
      },
      {
        turfGroup: ["Creeping Bentgrass"],
        rateMin: 0.5,
        rateMax: 1.0,
        notes: "Apply in 2–3 split applications 14–21 days apart; minimum 0.65 fl oz in California"
      }
    ],
    annualMaxPer1k: 2.9,   // fl oz per 1000 sq ft (128 fl oz per acre per label)
    waterPerUnit: 0.5,      // gal per 1000 sq ft — label minimum (20 gal/acre = 0.46 gal/1000; label rounds to 0.5)
    turfTypes: [
      "Annual Bluegrass",
      "Annual Ryegrass",
      "Bermudagrass",
      "Buffalograss",
      "Chewing's Fescue",
      "Creeping Bentgrass",
      "Fine Fescue",
      "Hard Fescue",
      "Kentucky Bluegrass",
      "Perennial Ryegrass",
      "Red Fescue",
      "Rough Bluegrass",
      "Tall Fescue",
      "Zoysiagrass"
    ],
    notSafeTurf: [
      "Bahiagrass",
      "Carpetgrass",
      "Centipedegrass",
      "Colonial Bentgrass",
      "Dichondra",
      "Seashore Paspalum",
      "Seaside Bentgrass",
      "St. Augustinegrass"
    ],
    targetWeeds: [
      "Barnyardgrass (Echinochloa crus-galli)",
      "Black Medic (Medicago lupulina)",
      "Broadleaf Signalgrass (Brachiaria platyphylla)",
      "Carolina Geranium (Geranium carolinianum)",
      "Common Dandelion (Taraxacum officinale)",
      "Common Speedwell (Veronica officinalis)",
      "Dollarweed (Hydrocotyle umbellata)",
      "English Daisy (Bellis perenne)",
      "Field Bindweed (Convolvulus arvensis)",
      "Giant Foxtail (Setaria faberi)",
      "Green Foxtail (Setaria viridis)",
      "Hop Clover (Trifolium aureum)",
      "Horseweed (Conyza canadensis)",
      "Kikuyugrass (Pennisetum clandestinum)",
      "Large Crabgrass (Digitaria sanguinalis)",
      "Morningglory (Ipomoea sp.)",
      "Red Clover (Trifolium pratense)",
      "Slender Speedwell (Veronica filiformis)",
      "Smooth Crabgrass (Digitaria ischaemum)",
      "Thymeleaf Speedwell (Veronica serpyllifolia)",
      "Torpedograss (Panicum repens)",
      "White Clover (Trifolium repens)",
      "Wild Violet (Viola sp.)",
      "Yellow Foxtail (Setaria glauca)"
    ],
    containerSizes: [
      { label: "64 fl oz bottle", oz: 64 },
      { label: "2.5 gal jug", oz: 320 }

    ],
    EPAtoxicityLevel: "CAUTION",
    reentryInterval: "Until spray has dried (agricultural use: 12 hours)",
    applicationNotes: [
      "Apply to actively growing weeds — do not apply when weeds are under stress from drought, heat, recent mowing, or prior herbicide applications",
      "Methylated seed oil (MSO) at 0.55 fl oz per 1000 sq ft is required in the spray mix for consistent control; crop oil concentrate (COC) or a quality surfactant may be substituted if MSO is unavailable",
      "Do not mow 2 days before or after application; leave clippings from the first three mowings on the treated area",
      "Do not water or irrigate for 24 hours after application; if no rainfall occurs within 2–7 days, irrigate at least 0.5 inch",
      "For creeping bentgrass: use 2–3 split applications at 0.5–1.0 fl oz per 1000 sq ft, 14–21 days apart (minimum 0.65 fl oz in California)",
      "For kikuyugrass and torpedograss: make 2 sequential applications at 1.0 fl oz per 1000 sq ft, then a third application at up to 0.90 fl oz, all 14–21 days apart",
      "Apply as medium or coarser spray at 20–40 psi; do not release spray above 30 inches from the ground",
      "Chelated iron or sprayable soluble nitrogen fertilizer added to the mix may reduce slight yellowing that can occur on bermudagrass and zoysiagrass"
    ],
    restrictions: [
      "Do not apply to Bahiagrass, carpetgrass, centipedegrass, colonial bentgrass, seaside bentgrass, dichondra, or St. Augustinegrass",
      "Do not apply to fine fescue unless it is part of a seed blend",
      "Do not apply to golf course collars or greens",
      "Do not apply to drought-stressed turfgrass or drought-stressed weeds",
      "Do not apply to lawns where desirable clovers are present",
      "Do not apply within 4 weeks after seedling emergence of creeping bentgrass, fine fescue blends, Kentucky bluegrass, or perennial ryegrass",
      "Do not apply within 2 weeks before or after seeding or sprigging seashore paspalum",
      "Do not apply in New York except as a spot application",
      "Do not apply by air or through any irrigation system",
      "Do not plant eggplants or tobacco within 12 months in treated areas",
      "Do not plant tomatoes or carrots within 24 months in treated areas",
      "Do not use clippings as mulch or compost around flowers, ornamentals, trees, or in vegetable gardens",
      "Do not apply when wind speeds exceed 10 mph",
      "Max single application: 1.45 fl oz per 1000 sq ft (64 fl oz per acre)",
      "Max annual: 2.9 fl oz per 1000 sq ft (128 fl oz per acre)"
    ],
    labelUrl: "https://www.cdms.net/ldat/ld8LD004.pdf"
  },

  {
    id: "fahrenheit-herbicide",
    fullName: "Fahrenheit Herbicide, Quali-Pro",
    brand: "Quali-Pro",
    type: "post-emergent",
    formulation: "granule",
    activeIngredients: [
      "Potassium salt of Dicamba 33.00%",
      "Metsulfuron-methyl 5.00%"
    ],
    genericAlternatives: [],
    mixUnit: "oz",
    perUnit: 1000,
    rateMin: 0.069,
    rateMax: 0.275,
    rateDefault: 0.138,
    turfRates: [
      {
        turfGroup: ["Bermudagrass", "St. Augustinegrass", "Zoysiagrass"],
        rateMin: 0.069,
        rateMax: 0.275
      },
      {
        turfGroup: ["Centipedegrass"],
        rateMin: 0.069,
        rateMax: 0.138
      }
    ],
    rateTiers: [
      { label: "Low",    ozPer1k: 0.069 },
      { label: "Medium", ozPer1k: 0.138 },
      { label: "High",   ozPer1k: 0.275 }
    ],
    annualMaxPer1k: 0.275,
    waterPerUnit: 1,
    turfTypes: [
      "Bermudagrass",
      "Centipedegrass",
      "St. Augustinegrass",
      "Zoysiagrass"
    ],
    notSafeTurf: [
      "Bahiagrass (this product selectively removes it — not a safe turf type)"
    ],
    targetWeeds: [
      { name: "Annual Fleabane",                                  rateRequired: "Low"    },
      { name: "Annual Sowthistle",                                rateRequired: "Medium" },
      { name: "Bahiagrass",                                       rateRequired: "Medium" }, // selective removal in Bermudagrass only; 3–9 oz/acre
      { name: "Bitter Sneezeweed",                                rateRequired: "Medium" },
      { name: "Bittercress",                                      rateRequired: "Low"    },
      { name: "Black Medic (Medicago lupulina)",                  rateRequired: "Low"    },
      { name: "Black Nightshade",                                 rateRequired: "High"   },
      { name: "Blue Mustard",                                     rateRequired: "Low"    },
      { name: "Bracken Fern",                                     rateRequired: "High"   },
      { name: "Bracted Plantain",                                 rateRequired: "Medium" },
      { name: "Brazil Pusley",                                    rateRequired: "High"   },
      { name: "Bristly Mallow",                                   rateRequired: "Low"    },
      { name: "Broadleaf Dock",                                   rateRequired: "Medium" },
      { name: "Buckhorn Plantain",                                rateRequired: "High"   },
      { name: "Buffalobur",                                       rateRequired: "Medium" },
      { name: "Bull Thistle",                                     rateRequired: "Medium" },
      { name: "Burclover",                                        rateRequired: "Medium" },
      { name: "Burcucumber",                                      rateRequired: "Medium" },
      { name: "Buttercup",                                        rateRequired: "Low"    },
      { name: "Canada Thistle",                                   rateRequired: "High"   }, // repeat application may be required
      { name: "Carpetweed (Mollugo verticillata)",                rateRequired: "Low"    },
      { name: "Carolina Geranium (Geranium carolinianum)",        rateRequired: "Low"    },
      { name: "Catchweed Bedstraw",                               rateRequired: "Low"    },
      { name: "Chicory",                                          rateRequired: "Low"    },
      { name: "Common Burdock",                                   rateRequired: "Medium" },
      { name: "Common Chickweed (Stellaria media)",               rateRequired: "Low"    },
      { name: "Common Cocklebur",                                 rateRequired: "Medium" },
      { name: "Common Dandelion (Taraxacum officinale)",          rateRequired: "Low"    },
      { name: "Common Evening Primrose",                          rateRequired: "Medium" },
      { name: "Common Groundsel",                                 rateRequired: "High"   },
      { name: "Common Lambsquarters (Chenopodium album)",         rateRequired: "Medium" },
      { name: "Common Mallow",                                    rateRequired: "Medium" },
      { name: "Common Purslane (Portulaca oleracea)",             rateRequired: "High"   }, // listed at both 4–6 and 6–12 oz/acre
      { name: "Common Ragweed (Ambrosia artemisiifolia)",         rateRequired: "Medium" },
      { name: "Common Sunflower",                                 rateRequired: "High"   },
      { name: "Common Wormwood",                                  rateRequired: "High"   },
      { name: "Common Yarrow",                                    rateRequired: "Medium" },
      { name: "Corn Chamomile",                                   rateRequired: "Low"    },
      { name: "Corn Cockle",                                      rateRequired: "Low"    },
      { name: "Cow Cockle",                                       rateRequired: "Low"    },
      { name: "Creeping Beggarweed",                              rateRequired: "Low"    },
      { name: "Creeping Woodsorrel",                              rateRequired: "High"   }, // repeat application may be required
      { name: "Crown Vetch",                                      rateRequired: "Medium" },
      { name: "Curly Dock (Rumex crispus)",                       rateRequired: "Medium" },
      { name: "Cutleaf Evening Primrose",                         rateRequired: "Medium" },
      { name: "Dogfennel (Eupatorium capillifolium)",             rateRequired: "High"   }, // listed at both 4–6 and 6–12 oz/acre
      { name: "Dwarf Mallow",                                     rateRequired: "Low"    },
      { name: "English Daisy",                                    rateRequired: "Medium" },
      { name: "Field Bindweed",                                   rateRequired: "High"   },
      { name: "Field Chickweed",                                  rateRequired: "Medium" },
      { name: "Field Pennycress",                                 rateRequired: "Low"    },
      { name: "Florida Beggarweed",                               rateRequired: "Low"    },
      { name: "Florida Betony (Stachys floridana)",               rateRequired: "Medium" },
      { name: "Foxtail",                                          rateRequired: "High"   },
      { name: "Giant Ragweed",                                    rateRequired: "Medium" },
      { name: "Goldenrod",                                        rateRequired: "Medium" },
      { name: "Gromwell",                                         rateRequired: "Medium" },
      { name: "Ground Ivy (Glechoma hederacea)",                  rateRequired: "Medium" }, // repeat application may be required
      { name: "Hawkweed",                                         rateRequired: "Medium" },
      { name: "Hemp Sesbania",                                    rateRequired: "Medium" },
      { name: "Henbit (Lamium amplexicaule)",                     rateRequired: "Medium" },
      { name: "Hoary Cress",                                      rateRequired: "High"   },
      { name: "Horsenettle",                                      rateRequired: "High"   },
      { name: "Horseweed",                                        rateRequired: "High"   },
      { name: "Ironweed",                                         rateRequired: "High"   },
      { name: "Jerusalem Artichoke",                              rateRequired: "High"   },
      { name: "Jimsonweed",                                       rateRequired: "Medium" },
      { name: "Knotweed",                                         rateRequired: "Medium" },
      { name: "Kochia (Bassia scoparia)",                         rateRequired: "High"   },
      { name: "Lawn Burweed (Soliva sessilis)",                   rateRequired: "Medium" },
      { name: "Leafy Spurge",                                     rateRequired: "High"   },
      { name: "Lespedeza",                                        rateRequired: "Medium" },
      { name: "Louisiana Wormwood",                               rateRequired: "High"   },
      { name: "Mayweed",                                          rateRequired: "Medium" },
      { name: "Milk Thistle",                                     rateRequired: "Medium" },
      { name: "Milkweed",                                         rateRequired: "Medium" },
      { name: "Miners Lettuce",                                   rateRequired: "Medium" },
      { name: "Morningglory",                                     rateRequired: "Medium" },
      { name: "Mouseear Chickweed (Cerastium fontanum)",          rateRequired: "Medium" },
      { name: "Musk Thistle",                                     rateRequired: "Medium" },
      { name: "Parsley-Piert",                                    rateRequired: "Low"    },
      { name: "Pennsylvania Smartweed",                           rateRequired: "High"   }, // listed at both 4–6 and 6–12 oz/acre
      { name: "Perennial Sowthistle",                             rateRequired: "High"   },
      { name: "Pigweed",                                          rateRequired: "Medium" },
      { name: "Plantain",                                         rateRequired: "Medium" },
      { name: "Pokeweed",                                         rateRequired: "High"   },
      { name: "Poorjoe",                                          rateRequired: "High"   },
      { name: "Prickly Sida",                                     rateRequired: "Medium" },
      { name: "Prostrate Knotweed",                               rateRequired: "High"   },
      { name: "Prostrate Spurge",                                 rateRequired: "Low"    },
      { name: "Purple Vetch",                                     rateRequired: "Medium" },
      { name: "Redroot Pigweed",                                  rateRequired: "Medium" },
      { name: "Redstem Filaree",                                  rateRequired: "Low"    },
      { name: "Russian Thistle",                                  rateRequired: "High"   },
      { name: "Ryegrass",                                         rateRequired: "Medium" }, // listed at both 3 oz and 4–6 oz/acre
      { name: "Sheep Sorrel",                                     rateRequired: "Medium" },
      { name: "Sicklepod",                                        rateRequired: "High"   },
      { name: "Silverleaf Nightshade",                            rateRequired: "Medium" },
      { name: "Slender Aster",                                    rateRequired: "Medium" },
      { name: "Smallseed Falseflax",                              rateRequired: "Medium" },
      { name: "Smooth Pigweed",                                   rateRequired: "Medium" },
      { name: "Smoothweed Bedstraw",                              rateRequired: "Low"    },
      { name: "Southern Sida",                                    rateRequired: "High"   },
      { name: "Spiny Amaranth",                                   rateRequired: "Medium" },
      { name: "Spiny Aster",                                      rateRequired: "Medium" },
      { name: "Spotted Knapweed",                                 rateRequired: "Medium" },
      { name: "Stinging Nettle",                                  rateRequired: "Medium" },
      { name: "Sweet Clover",                                     rateRequired: "Medium" },
      { name: "Tansy Mustard",                                    rateRequired: "Medium" },
      { name: "Teasel",                                           rateRequired: "Medium" },
      { name: "Treacle Mustard",                                  rateRequired: "Medium" },
      { name: "Tropic Croton",                                    rateRequired: "Medium" },
      { name: "Tropical Soda Apple",                              rateRequired: "High"   },
      { name: "Trumpetcreeper",                                   rateRequired: "High"   },
      { name: "Tumble Mustard",                                   rateRequired: "Medium" },
      { name: "Velvetleaf",                                       rateRequired: "Medium" },
      { name: "Virginia Buttonweed (Diodia virginiana)",          rateRequired: "High"   }, // repeat application may be required
      { name: "Virginia Pepperweed",                              rateRequired: "Low"    },
      { name: "Waterhemlock",                                     rateRequired: "Medium" },
      { name: "Waterhemp",                                        rateRequired: "High"   },
      { name: "White Clover (Trifolium repens)",                  rateRequired: "Low"    },
      { name: "Wild Buckwheat",                                   rateRequired: "Low"    },
      { name: "Wild Carrot",                                      rateRequired: "Low"    },
      { name: "Wild Celery",                                      rateRequired: "Medium" },
      { name: "Wild Garlic",                                      rateRequired: "Medium" },
      { name: "Wild Lettuce",                                     rateRequired: "Medium" },
      { name: "Wild Mustard",                                     rateRequired: "High"   },
      { name: "Wild Onion",                                       rateRequired: "Medium" },
      { name: "Wild Radish",                                      rateRequired: "Medium" },
      { name: "Woodsorrel",                                       rateRequired: "Medium" },
      { name: "Yankeeweed",                                       rateRequired: "High"   }
    ],
    containerSizes: [
      { label: "6 oz bottle", oz: 6 }
    ],
    EPAtoxicityLevel: "WARNING",
    reentryInterval: "Until spray has dried (agricultural use: 24 hours)",
    applicationNotes: [
      "Apply to actively growing weeds — weed control is faster when soil temperatures are above 60°F and weeds are not under moisture stress",
      "For spot applications with a backpack or hand-held sprayer, add 0.2 oz per 1 gallon of water and apply uniformly over 1,000 sq ft",
      "For broadcast applications, use 20–80 gallons of water per acre at 30–40 psi; use higher volumes for dense weed populations",
      "A non-ionic surfactant (NIS) with at least 80% active content at 0.25% v/v (1 qt per 100 gal) may be added for improved control — use with caution above 85°F or when turf is stressed",
      "Spray solution pH near 7.0 is ideal; acidic sprays below pH 6.0 must be used within 24 hours or a suitable buffer added",
      "Maintain continuous agitation in spray tank — settling will occur if agitation stops; re-agitate thoroughly before resuming",
      "Some temporary chlorosis or growth reduction may occur on listed turf types; more pronounced on St. Augustinegrass above 85°F",
      "For Bermudagrass overseeded with ryegrass, allow at least 60 days between broadcast application and overseeding"
    ],
    restrictions: [
      "Do not apply more than 12 oz per acre per calendar year",
      "Do not apply to turfgrass less than one year old",
      "Do not apply to turfgrass under stress from high temperatures (above 85°F), drought, poor fertility, disease, or insects",
      "Do not use on grasses other than St. Augustinegrass, Bermudagrass, Centipedegrass, and Zoysiagrass — injury may occur on unlisted grasses",
      "Do not apply to Dichondra lawns or where desirable clovers are present",
      "Do not apply to golf course greens or collars",
      "Do not apply through any type of irrigation system or by aircraft",
      "Do not mow immediately after application; do not transfer clippings to non-target areas",
      "Do not plant ornamental shrubs or trees in treated areas for at least 1 year, or bedding plants for at least 2 years after last application",
      "Apply in wind of 10 mph or less; maintain 25-foot buffer from sensitive areas and desirable vegetation",
      "Rainfall or irrigation before spray dries may reduce efficacy and require retreatment"
    ],
    labelUrl: "https://www.controlsolutionsinc.com/hubfs/Specimen%20Labels/Specimen-Fahrenheit-53883-387.pdf?hsLang=en"
  },

  {
    id: "msma-target-6-plus",
    fullName: "MSMA Target 6 Plus, Luxembourg-Pamol",
    brand: "Luxembourg-Pamol",
    type: "post-emergent",
    formulation: "liquid",
    activeIngredients: [
      "Monosodium Acid Methanearsonate (MSMA) 48.30%"
    ],
    genericAlternatives: [],
    mixUnit: "fl oz",
    perUnit: 1000,
    rateMin: 1.0,    // fl oz per 1000 sq ft — standard rate for all listed turf
    rateMax: 2.0,    // fl oz per 1000 sq ft — upper range for Bermudagrass and Zoysiagrass
    rateDefault: 1.0,
    turfRates: [
      {
        turfGroup: ["Bermudagrass", "Zoysiagrass"],
        rateMin: 1.0,
        rateMax: 2.0
      },
      {
        turfGroup: ["Kentucky Bluegrass"],
        rateMin: 1.0,
        rateMax: 1.0
      }
    ],
    waterPerUnit: 1.0,   // gal per 1000 sq ft — label minimum (label range: 1 to 2.5 gal per 1000 sq ft)
    turfTypes: [
      "Bermudagrass",
      "Kentucky Bluegrass",
      "Zoysiagrass"
    ],
    notSafeTurf: [
      "Bahiagrass (this product removes it — do not use on bahiagrass lawns)",
      "Carpetgrass",
      "Centipedegrass",
      "Creeping Bentgrass (injury may result)",
      "Dichondra",
      "Fine Fescue (injury may result)",
      "St. Augustinegrass",
      "Tall Fescue (injury may result)"
    ],
    targetWeeds: [
      "Bahiagrass",
      "Barnyardgrass (Echinochloa crus-galli)",
      "Cocklebur",
      "Common Chickweed (Stellaria media)",
      "Dallisgrass (Paspalum dilatatum)",
      "Goosegrass (Eleusine indica)",
      "Johnsongrass (Sorghum halepense)",
      "Large Crabgrass (Digitaria sanguinalis)",
      "Nutsedge",
      "Pigweed",
      "Puncture Vine (Tribulus terrestris)",
      "Sandbur",
      "Smooth Crabgrass (Digitaria ischaemum)",
      "Wood Sorrel"
    ],
    containerSizes: [
      { label: "2.5 gal jug", oz: 320 }
    ],
    EPAtoxicityLevel: "CAUTION",
    reentryInterval: "Until product has been washed into the soil (agricultural use: 12 hours)",
    applicationNotes: [
      "⚠️ Only approved for cotton fields, golf courses, sod farms, and highway rights-of-way.",
      "Mow turfgrass to a height of 1 to 1½ inches before treatment to improve spray coverage of weeds",
      "This product contains a built-in surfactant — do not add additional surfactant to the spray tank",
      "Apply during warm weather when temperatures are between 80–90°F and weeds are actively growing",
      "Mix in 1 to 2.5 gallons of water per 1000 sq ft; apply uniformly and thoroughly to wet all undesirable plants",
      "Two or more repeat treatments at 14-day intervals may be necessary for full control; do not repeat prior to 10 days after previous treatment",
      "Do not water treated turf for at least 24 hours after application",
      "Turfgrass may be temporarily discolored after application — bermudagrass, Kentucky bluegrass, and zoysiagrass have shown tolerance and recovery with proper application",
    ],
    restrictions: [
      "⚠️ Not for residential use",
      "Do not apply to St. Augustinegrass, carpetgrass, centipedegrass, or dichondra",
      "Do not apply to bentgrasses or fescues — injury may result",
      "Do not apply through any irrigation system",
      "Do not water turf for at least 24 hours after application",
      "Do not reseed treated areas until 2 weeks after the last application",
      "Do not repeat applications prior to 10 days after the previous treatment",
      "Do not make more than 1 broadcast application per year — all additional applications must be spot treatments only",
      "Do not make more than 4 total applications of MSMA (or DSMA, or a combination) per year",
      "Keep children and domestic animals off treated areas until the product has been washed into the soil",
    ],
    labelUrl: "https://www.cdms.net/ldat/ldULB000.pdf"
  },

];