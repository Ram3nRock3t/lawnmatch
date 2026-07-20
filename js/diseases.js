// diseases.js — LawnMatch canonical turf disease reference database
// Sorted alphabetically by commonName.
//
// Sources: label data (SBM Life Science Corp. BTF Concentrate / BioAdvanced
// Fungus Control for Lawns, EPA Reg. No. 92564-47), university extension
// turf pathology publications (UF/IFAS, NC State, Penn State, Purdue,
// Virginia Tech, Texas A&M AgriLife), and APS (American Phytopathological
// Society) taxonomic references.
//
// IMPORTANT: Do not rename or change any id value after products.js has been
// updated to reference disease ids. Fungicide products' targetDiseases arrays
// reference these ids directly. Display names shown to users always come
// from disease.commonName — never from the raw id string.
//
// SCHEMA NOTES:
// - pathogen: analog to weeds.js's scientificName. Genus + species of the
//   causal organism where known and unambiguous; "spp." or "unspecified"
//   where the label/available sources don't resolve to a single species.
// - parentGenus: only populated where a genuinely shared-genus situation
//   exists across multiple distinct disease entries (e.g. Rhizoctonia
//   causes both Brown Patch and Large Patch as different diseases). Do not
//   populate this just because a genus name is present — it exists to link
//   entries, not to duplicate the pathogen field.
// - category: disease type (Foliar Blight, Patch Disease, Leaf Spot, Rust,
//   Smut, Root Rot, etc.) — not turf type.
// - turfAffected: which turf types are documented as susceptible/hosts.
// - favorableConditions: analog to weeds.js's seasonality — since disease
//   pressure is driven by weather/moisture conditions more than calendar
//   season, this field describes the conditions rather than a season label.
// - notes: same standard as weeds.js — genuinely useful identification or
//   practical information only. Confidence flags belong here when a
//   pathogen assignment, species-level identification, or label reading
//   is uncertain. Do not pad with bookkeeping/provenance trivia.

const DISEASES = [
  {
    id: "anthracnose",
    commonName: "Anthracnose",
    pathogen: "Colletotrichum cereale",
    aliases: ["Colletotrichum graminicola (older name)"],
    parentGenus: "",
    category: "Foliar Blight / Basal Rot",
    turfAffected: "Annual bluegrass (Poa annua), bentgrass, and most cool-season turf; can affect warm-season turf under stress",
    favorableConditions: "Warm, humid weather combined with turf stress (drought, heat, compaction, low fertility, close mowing)",
    notes: "Reclassified from Colletotrichum graminicola to C. cereale for the turf-infecting species per current taxonomy; old name retained as alias. Has both a foliar blight phase and a more damaging basal rot/crown rot phase — the latter is harder to control and often mistaken for other patch diseases."
  },
  {
    id: "brown-patch",
    commonName: "Brown Patch",
    pathogen: "Rhizoctonia solani (AG-1-IA)",
    aliases: [],
    parentGenus: "Rhizoctonia",
    category: "Foliar Blight",
    turfAffected: "Tall fescue, bentgrass, perennial ryegrass, and other cool-season turf",
    favorableConditions: "Hot, humid summer months",
    notes: "Attacks leaf blades directly and rarely kills the root system, distinguishing it from the AG-2-2 IIIB strain (see rhizoctonia-blight) which more aggressively attacks roots and crowns."
  },
  {
    id: "copper-spot",
    commonName: "Copper Spot",
    pathogen: "Gloeocercospora sorghi",
    aliases: ["Zonate Leaf Spot"],
    parentGenus: "",
    category: "Leaf Spot",
    turfAffected: "Bentgrass, primarily; occasionally other fine-textured turf",
    favorableConditions: "Warm, humid weather; acidic, sandy soils with low fertility",
    notes: "Uncommon disease, primarily documented on close-cut bentgrass (greens/tees); low prevalence in typical residential lawn turf."
  },
  {
    id: "crown-rot",
    commonName: "Crown Rot",
    pathogen: "Unspecified — multiple fungi (Rhizoctonia, Fusarium, Pythium, and others) can cause crown rot symptoms",
    aliases: [],
    parentGenus: "",
    category: "Root Rot / Crown Rot",
    turfAffected: "Various turfgrasses",
    favorableConditions: "Varies by causal organism",
    notes: "FLAG: appears on the F-Stop label with no accompanying pathogen indication. Crown rot is a symptom description rather than a single disease, and multiple unrelated fungi can cause it. Left unresolved rather than guessed into a specific existing entry; verify against a plant pathology source if a specific causal organism needs to be assigned."
  },
  {
    id: "dollar-spot",
    commonName: "Dollar Spot",
    pathogen: "Clarireedia spp.",
    aliases: ["Sclerotinia homoeocarpa (older name)"],
    parentGenus: "",
    category: "Foliar Blight",
    turfAffected: "Nearly all cool- and warm-season turfgrasses",
    favorableConditions: "Warm days, cool nights with heavy dew, low nitrogen fertility, drought stress",
    notes: "Genus reclassified from Sclerotinia to the newly established Clarireedia in 2018 (Salgado-Salazar et al.); old name retained as alias since it still appears on many labels and in older extension literature."
  },
  {
    id: "fairy-ring",
    commonName: "Fairy Ring",
    pathogen: "Various soil-inhabiting basidiomycete fungi (multiple genera)",
    aliases: [],
    parentGenus: "",
    category: "Thatch/Soil Fungal Complex",
    turfAffected: "All turf types; often associated with buried organic matter (old tree stumps, construction debris, thatch)",
    favorableConditions: "Warm, moist conditions; thatch or buried organic debris in the soil profile",
    notes: "Genus-parent-style entry — caused by a wide range of unrelated basidiomycete fungi rather than a single species; identified by symptoms (rings or arcs of dark green or dead turf, sometimes with mushrooms) rather than a specific pathogen. Severely damaged turf may require reseeding."
  },
  {
    id: "flag-smut",
    commonName: "Flag Smut",
    pathogen: "Urocystis agropyri",
    aliases: [],
    parentGenus: "Urocystis",
    category: "Smut (Leaf/Systemic)",
    turfAffected: "Wheat and some cool-season grasses",
    favorableConditions: "Cool, wet conditions; systemic infection",
    notes: "See leaf-smut for the broader category. Distinguished from Stripe Smut (see stripe-smut) by black sori that shred and curl the leaf, rather than forming clean parallel stripes."
  },
  {
    id: "fusarium-blight",
    commonName: "Fusarium Blight",
    pathogen: "Fusarium spp.",
    aliases: [],
    parentGenus: "",
    category: "Patch Disease",
    turfAffected: "Kentucky bluegrass and other cool-season turf, historically; warm-season turf per some product labels",
    favorableConditions: "Hot, dry conditions historically associated with this name",
    notes: "Legacy diagnostic term. Much of the symptom set historically attributed to Fusarium blight is now understood in current turf pathology to be primarily caused by Magnaporthiopsis poae (Summer Patch) or Ophiosphaerella spp. (necrotic ring spot), with Fusarium spp. generally considered secondary or minor pathogens rather than the primary causal agent in most current literature. Retained here as its own entry because it appears as a separately named target on the source label alongside Summer Patch — treat the pathogen attribution with low confidence (~30%) rather than as settled."
  },
  {
    id: "gray-leaf-spot",
    commonName: "Gray Leaf Spot",
    pathogen: "Pyricularia grisea",
    aliases: ["Magnaporthe grisea (older name)"],
    parentGenus: "",
    category: "Leaf Spot",
    turfAffected: "St. Augustinegrass, perennial ryegrass, tall fescue",
    favorableConditions: "Hot, humid weather; excess nitrogen fertility; frequent light irrigation",
    notes: "Can develop and spread very rapidly under favorable conditions, sometimes causing significant turf loss within days, particularly on St. Augustinegrass and ryegrass."
  },
  {
    id: "gray-snow-mold",
    commonName: "Gray Snow Mold",
    pathogen: "Typhula incarnata / Typhula ishikariensis",
    aliases: ["Typhula Blight"],
    parentGenus: "Typhula",
    category: "Snow Mold",
    turfAffected: "Most cool-season turfgrasses",
    favorableConditions: "Prolonged snow cover over unfrozen ground; can develop without snow cover under cold, wet, overcast conditions",
    notes: "Caused by a combination of two closely related Typhula species rather than a single pathogen. Distinct from Pink Snow Mold (see pink-snow-mold), which develops at higher temperatures and does not require snow cover."
  },
  {
    id: "large-patch-zoysia",
    commonName: "Large Patch (Zoysia)",
    pathogen: "Rhizoctonia solani (AG-2-2 LP)",
    aliases: ["Zoysia Patch", "Centipede Patch", "Rhizoctonia Large Patch"],
    parentGenus: "Rhizoctonia",
    category: "Patch Disease / Root Rot",
    turfAffected: "Zoysiagrass, St. Augustinegrass, centipedegrass, bermudagrass",
    favorableConditions: "Spring and fall, during dormancy transitions",
    notes: "Causes basal rot at the lower leaf sheath, killing the entire shoot — distinguishing it from the two Brown Patch variants (AG-1-IA and AG-2-2 IIIB), which are foliar/root diseases active in summer rather than during dormancy transitions."
  },
  {
    id: "leaf-smut",
    commonName: "Leaf Smut",
    pathogen: "Ustilago spp. / Urocystis spp. — see stripe-smut and flag-smut for species-specific entries",
    aliases: [],
    parentGenus: "",
    category: "Smut (Leaf/Systemic)",
    turfAffected: "Leaves and sheaths of turfgrasses and grains",
    favorableConditions: "Systemic once infected — plants remain infected for life, becoming highly susceptible to drought and stress",
    notes: "Genus-parent-style entry for smuts causing long yellow-to-gray streaks on leaves that rupture to release a powdery cloud of black spores, distinct from Smut/Common Smut (see smut), which attacks reproductive structures instead. See stripe-smut and flag-smut for the two most common turf-specific pathogens covered by this entry."
  },
  {
    id: "leaf-spot",
    commonName: "Leafspot",
    pathogen: "Bipolaris spp. / Drechslera spp. (excluding D. poae — see melting-out)",
    aliases: [],
    parentGenus: "",
    category: "Leaf Spot",
    turfAffected: "Various cool- and warm-season turfgrasses depending on species",
    favorableConditions: "Cool to moderate temperatures with extended leaf wetness; varies by causal species",
    notes: "Genus-parent-style catch-all for the broader Bipolaris/Drechslera leaf spot complex not covered by the more specific Gray Leaf Spot (see gray-leaf-spot) or Melting Out (see melting-out) entries."
  },
  {
    id: "melting-out",
    commonName: "Melting Out",
    pathogen: "Drechslera poae",
    aliases: ["Helminthosporium vagans (older name)"],
    parentGenus: "",
    category: "Leaf Spot / Crown Rot",
    turfAffected: "Kentucky bluegrass, primarily",
    favorableConditions: "Cool, wet weather in spring and fall",
    notes: "Reclassified from Helminthosporium vagans to Drechslera poae per current taxonomy; old name retained as alias. Begins as leaf spotting but can progress to crown and root rot under prolonged favorable conditions."
  },
  {
    id: "necrotic-ring-spot",
    commonName: "Necrotic Ring Spot",
    pathogen: "Ophiosphaerella korrae",
    aliases: [],
    parentGenus: "Ophiosphaerella",
    category: "Root Rot / Patch Disease",
    turfAffected: "Kentucky bluegrass, fine fescue",
    favorableConditions: "Cool, wet spring and fall following summer heat stress; symptoms often appear during subsequent hot, dry weather",
    notes: "Classic ring or frog-eye patch symptoms; can be confused with Summer Patch (similar turf, different pathogen — Magnaporthiopsis poae). See spring-dead-spot for a related disease on warm-season turf."
  },
  {
    id: "pink-patch",
    commonName: "Pink Patch",
    pathogen: "Limonomyces roseipellis",
    aliases: [],
    parentGenus: "",
    category: "Foliar Blight",
    turfAffected: "Fine fescue, perennial ryegrass, Kentucky bluegrass",
    favorableConditions: "Cool, wet, humid conditions — similar to Red Thread",
    notes: "Closely related to and often found alongside Red Thread (see red-thread), with similar symptoms and conditions, but a distinct pathogen; difficult to distinguish visually without lab diagnosis."
  },
  {
    id: "pink-snow-mold",
    commonName: "Pink Snow Mold",
    pathogen: "Microdochium nivale",
    aliases: ["Fusarium Patch", "Fusarium nivale (older name)"],
    parentGenus: "",
    category: "Snow Mold",
    turfAffected: "Most cool-season turfgrasses, especially annual bluegrass (Poa annua) and bentgrass",
    favorableConditions: "Cool, wet weather; can develop with or without snow cover, unlike Gray Snow Mold",
    notes: "'Fusarium Patch' is an older/alternate name for this disease, reflecting the pathogen's former classification as Fusarium nivale before reclassification to Microdochium nivale — both names remain in common use."
  },
  {
    id: "powdery-mildew",
    commonName: "Powdery Mildew",
    pathogen: "Blumeria graminis",
    aliases: ["Erysiphe graminis (older name)"],
    parentGenus: "",
    category: "Foliar Blight",
    turfAffected: "Kentucky bluegrass, fine fescue; especially in shaded areas",
    favorableConditions: "Shade, poor air circulation, high humidity, cool temperatures",
    notes: "Easily identified by a distinctive white-gray powdery coating on leaf blades; heavily favored by shade, so improving light/airflow is an important cultural complement to fungicide treatment."
  },
  {
    id: "pythium-blight",
    commonName: "Pythium Blight",
    pathogen: "Pythium spp.",
    aliases: ["Cottony Blight", "Grease Spot"],
    parentGenus: "Pythium",
    category: "Foliar Blight",
    turfAffected: "Perennial ryegrass, annual bluegrass (Poa annua), and other turf under high heat/moisture stress",
    favorableConditions: "Hot, humid weather with extended leaf wetness; poor drainage",
    notes: "Distinct from Pythium Root Rot (see pythium-root-rot) — same genus, but a fast-spreading foliar blight capable of destroying turf within 24-48 hours under ideal conditions."
  },
  {
    id: "pythium-root-rot",
    commonName: "Pythium Root Rot",
    pathogen: "Pythium spp.",
    aliases: [],
    parentGenus: "Pythium",
    category: "Root Rot",
    turfAffected: "Various cool- and warm-season turfgrasses, especially under waterlogged conditions",
    favorableConditions: "Saturated or poorly drained soils; warm soil temperatures",
    notes: "Distinct from Pythium Blight (see pythium-blight) — same genus, but attacks the root system in waterlogged soil rather than causing rapid foliar collapse; symptoms are often chronic thinning rather than dramatic overnight loss."
  },
  {
    id: "red-thread",
    commonName: "Red Thread",
    pathogen: "Laetisaria fuciformis",
    aliases: [],
    parentGenus: "",
    category: "Foliar Blight",
    turfAffected: "Perennial ryegrass, fine fescue, Kentucky bluegrass",
    favorableConditions: "Cool, wet weather (60-75°F); low nitrogen fertility",
    notes: "Named for the distinctive thread-like pink to red fungal strands (sclerotia) that extend from grass blades, visible in early morning dew; primarily a cosmetic disease that rarely kills turf outright."
  },
  {
    id: "rhizoctonia-blight",
    commonName: "Rhizoctonia Blight (Root Rot)",
    pathogen: "Rhizoctonia solani (AG-2-2 IIIB)",
    aliases: ["Brown Patch (as used for this strain in some sources)"],
    parentGenus: "Rhizoctonia",
    category: "Foliar Blight / Root Rot",
    turfAffected: "Both cool-season and some warm-season grasses",
    favorableConditions: "Mid-summer",
    notes: "Unlike the AG-1-IA strain (see brown-patch), this strain can aggressively attack roots, crowns, and leaf sheaths, not just leaf blades. FLAG: the source label lists this as a separate bullet from both 'Brown Patch' and 'Large Patch' — inferred here as most likely referring to this strain given the label's three-way split, but the label itself never explicitly names AG-2-2 IIIB. Confidence in this specific strain assignment: 55%."
  },
  {
    id: "rust",
    commonName: "Rust",
    pathogen: "Puccinia spp.",
    aliases: ["Leaf Rust"],
    parentGenus: "Puccinia",
    category: "Rust",
    turfAffected: "Kentucky bluegrass, perennial ryegrass, zoysiagrass, St. Augustinegrass — specific Puccinia species vary by turf host",
    favorableConditions: "Slow turf growth, low nitrogen fertility, extended leaf wetness, moderate temperatures",
    notes: "Genus-parent-style entry — turf rust is caused by multiple Puccinia species depending on the host grass (e.g. P. graminis, P. zoysiae), and labels rarely specify which. Identifiable by orange-red powdery spores that rub off on skin, shoes, or clothing."
  },
  {
    id: "rust-stem",
    commonName: "Rust (Stem)",
    pathogen: "Puccinia graminis",
    aliases: ["Stem Rust"],
    parentGenus: "Puccinia",
    category: "Rust",
    turfAffected: "Various cool-season grasses",
    favorableConditions: "Slow turf growth, moderate temperatures, extended leaf wetness",
    notes: "Less common in maintained residential turf than the generic leaf rust presentation (see rust entry). See rust-stripe for the related but distinct Puccinia striiformis."
  },
  {
    id: "rust-stripe",
    commonName: "Rust (Stripe)",
    pathogen: "Puccinia striiformis",
    aliases: ["Stripe Rust"],
    parentGenus: "Puccinia",
    category: "Rust",
    turfAffected: "Various cool-season grasses",
    favorableConditions: "Cool, moist conditions; more cold-tolerant than most other turf rusts",
    notes: "Distinguished from other turf rusts by yellow-orange pustules arranged in narrow stripes along leaf veins, rather than scattered pustules."
  },
  {
    id: "septoria-leaf-spot",
    commonName: "Septoria Leaf Spot",
    pathogen: "Septoria spp.",
    aliases: [],
    parentGenus: "Septoria",
    category: "Leaf Spot",
    turfAffected: "Various cool-season turfgrasses",
    favorableConditions: "Cool, wet weather with extended leaf wetness",
    notes: ""
  },
  {
    id: "smut",
    commonName: "Smut",
    pathogen: "Ustilago spp. / Sporisorium spp. (head and gall smuts)",
    aliases: ["Common Smut", "Head Smut"],
    parentGenus: "",
    category: "Smut (Head/Gall)",
    turfAffected: "Ornamental and turf grasses that produce seed heads; more prevalent on grains and corn",
    favorableConditions: "Spores overwinter in soil to infect the following season's growth",
    notes: "Attacks the plant's reproductive structures (seed heads, kernels), forming large swollen galls filled with fungal spores. Infections tend to be localized rather than systemic. Distinct from Leaf Smut (see leaf-smut), which affects leaves and sheaths with a systemic, lifelong infection pattern instead."
  },
  {
    id: "southern-blight",
    commonName: "Southern Blight",
    pathogen: "Sclerotium rolfsii (Athelia rolfsii)",
    aliases: ["Athelia rolfsii (current teleomorph name)"],
    parentGenus: "",
    category: "Root Rot / Crown Rot",
    turfAffected: "St. Augustinegrass, zoysiagrass, and other warm-season turf; also common on ornamentals",
    favorableConditions: "Hot, humid weather; high soil moisture",
    notes: "Distinctive white, coarse fungal mycelium and small tan-to-brown sclerotia ('mustard seed' appearance) visible at the soil surface or thatch layer are the key field identifier."
  },
  {
    id: "spring-dead-spot",
    commonName: "Spring Dead Spot",
    pathogen: "Ophiosphaerella spp. (O. korrae, O. herpotricha, O. narmari — species varies regionally)",
    aliases: [],
    parentGenus: "Ophiosphaerella",
    category: "Root Rot / Patch Disease",
    turfAffected: "Bermudagrass, primarily",
    favorableConditions: "Root infection occurs in fall; symptoms (circular dead patches) appear the following spring as bermudagrass breaks dormancy",
    notes: "Named for when symptoms appear (spring), not when infection occurs (previous fall) — fungicide timing is typically fall-focused despite visible damage showing up in spring. See necrotic-ring-spot for a related disease on cool-season turf."
  },
  {
    id: "stripe-smut",
    commonName: "Stripe Smut",
    pathogen: "Ustilago striiformis",
    aliases: [],
    parentGenus: "Ustilago",
    category: "Smut (Leaf/Systemic)",
    turfAffected: "Kentucky bluegrass and other cool-season turfgrasses",
    favorableConditions: "Cool, wet conditions; systemic infection often worsens under summer heat stress",
    notes: "See leaf-smut for the broader category. Distinguished from Flag Smut (see flag-smut) by black longitudinal stripes on the leaf blade rather than shredding sori."
  },
  {
    id: "summer-patch",
    commonName: "Summer Patch",
    pathogen: "Magnaporthiopsis poae",
    aliases: ["Magnaporthe poae (older name)"],
    parentGenus: "",
    category: "Patch Disease / Root Rot",
    turfAffected: "Kentucky bluegrass, fine fescue, annual bluegrass (Poa annua)",
    favorableConditions: "Hot summer weather combined with soil moisture stress (either excess or deficit); compacted soils",
    notes: "Reclassified from Magnaporthe poae to Magnaporthiopsis poae per current taxonomy; old name retained as alias. Root-infecting disease that often doesn't show above-ground symptoms until root damage is already severe, making it harder to catch early than foliar diseases."
  },
   {
    id: "take-all-root-rot",
    commonName: "Take-All Root Rot",
    pathogen: "Gaeumannomyces graminis var. graminis",
    aliases: ["Take-All Patch", "Bermuda Grass Decline"],
    parentGenus: "Gaeumannomyces",
    category: "Root Rot",
    turfAffected: "Bermudagrass, St. Augustinegrass, zoysiagrass, and centipedegrass",
    favorableConditions: "Prolonged wet soil, poor drainage, low mowing height, thatch buildup, and other turf stress factors",
    notes: "'Bermuda Grass Decline' describes the physiological stress complex/symptom pattern on bermudagrass specifically, while Take-All Root Rot (or Take-All Patch) is the specific fungal disease driving that decline — the two names are used interchangeably in extension literature for the same underlying disease."
  },
  {
    id: "yellow-patch",
    commonName: "Yellow Patch",
    pathogen: "Rhizoctonia cerealis (Waitea circinata var. circinata)",
    aliases: ["Cool Weather Brown Patch"],
    parentGenus: "Rhizoctonia",
    category: "Patch Disease",
    turfAffected: "Cool-season turfgrasses, especially Kentucky bluegrass and perennial ryegrass",
    favorableConditions: "Cool, wet conditions in fall and spring — active at temperatures too low for true Brown Patch",
    notes: "Called 'Cool Weather Brown Patch' because it's a Rhizoctonia-related patch disease active in cool conditions, distinct from true Brown Patch (AG-1-IA, warm/humid — see brown-patch) and Large Patch (AG-2-2 LP, dormancy transitions — see large-patch-zoysia). Generally a minor cosmetic disease."
  }
];