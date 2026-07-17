import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.BASE_URL || "/";
const withBase = (value = "") => {
  if (!value.startsWith("/")) {
    return value;
  }

  if (BASE_URL !== "/" && value.startsWith(BASE_URL)) {
    return value;
  }

  return `${BASE_URL}${value.slice(1)}`;
};

const prefixPaths = (value) => {
  if (typeof value === "string") {
    return withBase(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => prefixPaths(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, prefixPaths(entry)]));
  }

  return value;
};

const specIcons = {
  thickness: "/assets/generated/spec-icons/thickness.webp",
  deck: "/assets/generated/spec-icons/deck.webp",
  size: "/assets/generated/spec-icons/size.webp",
  weight: "/assets/generated/spec-icons/weight.webp",
  sort: "/assets/generated/spec-icons/grade.webp",
  material: "/assets/generated/spec-icons/material.webp",
  quality: "/assets/generated/spec-icons/quality.webp",
};

const sharedActions = {
  requestHref: "#request",
  priceHref: "#price",
};

const phoneContactsByPage = {
  new: { href: "tel:+375296974177", label: "+375 (29) 697-41-77" },
  used: { href: "tel:+375296974777", label: "+375 (29) 697-47-77" },
};

const emailContactsByPage = {
  new: "Derekon.minsk@gmail.by",
  used: "1041313@gmail.com",
};

const sharedLogistics = [
  {
    icon: "/assets/generated/detail/pin.webp",
    title: "Самовывоз со склада",
    text: "г. Минск, ул. Ванеева, 29",
  },
  {
    icon: "/assets/generated/bottom-icon-truck.webp",
    title: "Бесплатная доставка",
    text: "По Минску в пределах МКАД и до 10 км за МКАД. Дальше стоимость рассчитывается с учётом платных дорог и других расходов. Возможна экономия за счёт обратной загрузки от фабрики или производителя.",
  },
  {
    icon: "/assets/generated/bottom-icon-boxes.webp",
    title: "Собственный транспорт",
    text: "Вместительная фура объёмом 90 м³ для крупных партий.",
  },
];

const sharedPickup = "Самовывоз: г. Минск,\nул. Ванеева, 29";
const sharedDelivery = "Бесплатно по Минску, в пределах МКАД и до 10 км за МКАД";

const footerSocialLinks = [
  {
    label: "Telegram",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M21.8 4.1 18.5 20c-.2.9-.9 1.1-1.6.7l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.7 1.8 12.2c-1-.3-1-1 .2-1.5L20.3 3.6c.9-.3 1.7.2 1.5.5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Zm0 2.2A3.8 3.8 0 0 0 4.2 8v8A3.8 3.8 0 0 0 8 19.8h8a3.8 3.8 0 0 0 3.8-3.8V8A3.8 3.8 0 0 0 16 4.2H8Zm4 3.3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2.2a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Zm4.8-2.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
      </svg>
    ),
  },
];

const emptyRequestForm = {
  name: "",
  phone: "",
  email: "",
  comment: "",
  length: "",
  width: "",
  height: "",
  quantity: "",
  fileName: "",
};

const emptyRequestContext = {
  source: "",
  product: "",
  thickness: "",
  deck: "",
};

const newVariantAssetVersion = "2026-07-09-cleaned-decks-1";
const usedVariantAssetVersion = "2026-07-09-used-transparent-cutouts-1";
const compactText = (value = "") => value.replace(/\s+/g, " ").trim();
const versionAsset = (path = "", version = newVariantAssetVersion) => `${path}?v=${version}`;
const versionUsedAsset = (path = "", version = usedVariantAssetVersion) => `${path}?v=${version}`;
const makeVariantKey = (deck = "") => compactText(deck);
const deckSlugMap = {
  "5 досок": "5boards",
  "6 досок": "6boards",
  "Сплошной настил": "soliddeck",
  "Под запрос": "custom",
};
const buildNewVariantImageMap = (size, deckOptions = []) =>
  Object.fromEntries(
    deckOptions.map((deck) => [
      makeVariantKey(deck),
      versionAsset(
        `/assets/generated/variants/new-cleaned/new-${size}-22mm-${deckSlugMap[deck]}.webp`,
      ),
    ]),
  );
const buildUsedVariantImageMap = (size, deckOptions = []) =>
  Object.fromEntries(
    deckOptions.map((deck) => [
      makeVariantKey(deck),
      versionUsedAsset(`/assets/generated/used-variants/used-${size}-${deckSlugMap[deck]}.webp`),
    ]),
  );
const getVariantImageForProduct = (product, deck = "") => {
  if (!product?.variantImages) {
    return "";
  }

  return product.variantImages[makeVariantKey(deck)] || "";
};

const formatByn = (value) => {
  if (typeof value !== "number") {
    return value || "";
  }

  return `${Number.isInteger(value) ? value : value.toFixed(2).replace(".", ",")} BYN`;
};

const getCalculatedPrice = (product, thickness = "", deck = "") => {
  if (typeof product?.basePrice !== "number") {
    return product?.price || "";
  }

  const thicknessIndex = Math.max(0, product.thicknessOptions?.indexOf(thickness) ?? 0);
  const deckIndex = Math.max(0, product.deckOptions?.indexOf(deck) ?? 0);
  return formatByn(product.basePrice + (thicknessIndex + deckIndex) * 0.3);
};

const uiCopyByLanguage = {
  ru: {
    catalog: "Каталог",
    details: "Подробнее",
    price: "Цена",
    priceFrom: "Цена от",
    perPiece: "/ шт",
    request: "Оформить заявку",
    call: "Позвонить",
    boardThickness: "Толщина доски",
    topDeck: "Верхний настил",
    section: "Раздел",
    product: "Товар",
    thickness: "Толщина",
    deck: "Настил",
    name: "Ваше имя",
    namePlaceholder: "Как к вам обращаться",
    phone: "Телефон",
    email: "Email",
    quantity: "Количество, шт.",
    quantityPlaceholder: "Желаемый объём партии",
    dimensions: ["Длина, мм", "Ширина, мм", "Высота, мм"],
    drawing: "Чертёж или техническое задание",
    drawingPrompt: "Выберите PDF, изображение, DWG или DXF",
    comment: "Комментарий",
    commentPlaceholder: "Напишите размер, объём партии, срок поставки или другие детали",
    requestLead: "Оставьте имя и телефон. Мы свяжемся с вами, уточним детали и подготовим предложение.",
    send: "Отправить заявку",
    close: "Закрыть окно",
    mailReady: "Письмо подготовлено.",
    deliveryTitle: "Доставка и условия",
    deliverySubtitle: "Самовывоз, доставка и поддержка по заказу",
  },
  en: {
    catalog: "Catalog",
    details: "Details",
    price: "Price",
    priceFrom: "Price from",
    perPiece: "/ pc",
    request: "Request a quote",
    call: "Call us",
    boardThickness: "Board thickness",
    topDeck: "Top deck",
    section: "Section",
    product: "Product",
    thickness: "Thickness",
    deck: "Top deck",
    name: "Your name",
    namePlaceholder: "How should we address you?",
    phone: "Phone",
    email: "Email",
    quantity: "Quantity, pcs",
    quantityPlaceholder: "Required quantity",
    dimensions: ["Length, mm", "Width, mm", "Height, mm"],
    drawing: "Drawing or specification",
    drawingPrompt: "Choose PDF, image, DWG or DXF",
    comment: "Comment",
    commentPlaceholder: "Describe the size, quantity, delivery date or other details",
    requestLead: "Leave your name and phone number. We will contact you, confirm the details and prepare an offer.",
    send: "Send request",
    close: "Close",
    mailReady: "Email draft is ready.",
    deliveryTitle: "Delivery and terms",
    deliverySubtitle: "Pickup, delivery and order support",
  },
  de: {
    catalog: "Katalog",
    details: "Details",
    price: "Preis",
    priceFrom: "Preis ab",
    perPiece: "/ Stk.",
    request: "Angebot anfragen",
    call: "Anrufen",
    boardThickness: "Brettstärke",
    topDeck: "Oberdeck",
    section: "Bereich",
    product: "Produkt",
    thickness: "Stärke",
    deck: "Oberdeck",
    name: "Ihr Name",
    namePlaceholder: "Wie dürfen wir Sie ansprechen?",
    phone: "Telefon",
    email: "E-Mail",
    quantity: "Menge, Stk.",
    quantityPlaceholder: "Gewünschte Menge",
    dimensions: ["Länge, mm", "Breite, mm", "Höhe, mm"],
    drawing: "Zeichnung oder Spezifikation",
    drawingPrompt: "PDF, Bild, DWG oder DXF auswählen",
    comment: "Kommentar",
    commentPlaceholder: "Beschreiben Sie Maße, Menge, Liefertermin oder weitere Details",
    requestLead: "Hinterlassen Sie Ihren Namen und Ihre Telefonnummer. Wir klären die Details und erstellen ein Angebot.",
    send: "Anfrage senden",
    close: "Schließen",
    mailReady: "E-Mail-Entwurf ist fertig.",
    deliveryTitle: "Lieferung und Bedingungen",
    deliverySubtitle: "Abholung, Lieferung und Auftragsbetreuung",
  },
};

const pageCopyByLanguage = {
  en: {
    new: {
      title: "New pallets",
      lead: "Quality new softwood pallets.\nIdeal for storage and freight handling.",
      features: [
        ["High quality", "and reliability"],
        ["Made from", "fresh timber"],
        ["Compliant", "with standards"],
      ],
      service: ["Additional service", "Phytosanitary treatment", "We prepare pallets for export shipments and provide the agreed marking.", "Request treatment"],
    },
    used: {
      title: "Used pallets",
      lead: "Inspected pallets in good working condition at a competitive price.\nSuitable for warehouses, logistics and transport.",
      features: [
        ["Inspected", "condition"],
        ["Competitive", "price"],
        ["Ready", "for work"],
      ],
      service: ["Separate service", "Pallets with phytosanitary stamp", "We select used pallets with the required marking for export and warehouse operations. Contact us for availability.", "Check availability"],
    },
    logistics: [
      ["Warehouse pickup", "Minsk, 29 Vaneeva Street"],
      ["Free delivery", "Free within Minsk Ring Road and up to 10 km beyond it. Longer routes are calculated separately, with possible savings through a return load."],
      ["Own transport", "A spacious 90 m³ truck for large shipments."],
    ],
  },
  de: {
    new: {
      title: "Neue Paletten",
      lead: "Hochwertige neue Paletten aus Nadelholz.\nIdeal für Lagerung und Transport.",
      features: [
        ["Hohe Qualität", "und Zuverlässigkeit"],
        ["Gefertigt aus", "frischem Holz"],
        ["Entsprechen", "den Standards"],
      ],
      service: ["Zusatzleistung", "Phytosanitäre Behandlung", "Wir bereiten Paletten für Exportsendungen vor und liefern die vereinbarte Kennzeichnung.", "Behandlung anfragen"],
    },
    used: {
      title: "Gebrauchte Paletten",
      lead: "Geprüfte Paletten in gutem Zustand zu einem günstigen Preis.\nFür Lager, Logistik und Transport.",
      features: [
        ["Geprüfter", "Zustand"],
        ["Günstiger", "Preis"],
        ["Sofort", "einsatzbereit"],
      ],
      service: ["Separate Leistung", "Paletten mit phytosanitärem Stempel", "Wir wählen gebrauchte Paletten mit passender Kennzeichnung für Export und Lager aus. Verfügbarkeit auf Anfrage.", "Verfügbarkeit prüfen"],
    },
    logistics: [
      ["Abholung am Lager", "Minsk, Vaneeva-Straße 29"],
      ["Kostenlose Lieferung", "Kostenlos innerhalb des Minsker Autobahnrings und bis 10 km darüber hinaus. Weitere Strecken werden separat berechnet; Rückladung kann Kosten sparen."],
      ["Eigener Transport", "Geräumiger 90-m³-Lkw für große Lieferungen."],
    ],
  },
};

const productCopyByLanguage = {
  en: {
    "winter-pallet": ["Winter pallets", "Reinforced design\nfor cold storage"],
    "new-plastic-1200x800": ["Plastic 1200x800", "New plastic pallet\nfor clean production"],
    "new-plastic-1200x1000": ["Plastic 1200x1000", "New large-format\nplastic pallet"],
    "custom-size-order": ["Custom size pallet", "We manufacture pallets\nto your specification"],
    "used-reinforced": ["Stamped Euro pallets", "Grade 1 and 2,\nEUR / EPAL / UIC"],
    "used-plastic-1200x800": ["Plastic 1200x800", "Inspected used\nplastic pallet"],
    "used-plastic-1200x1000": ["Plastic 1200x1000", "Large-format used\nplastic pallet"],
    "used-eurocube": ["IBC tank 1000 L", "Used IBC tank\nin a steel cage"],
    "used-big-bag": ["Used Big Bag", "Flexible container\nfor bulk materials"],
    "wood-offcuts": ["Wood offcuts", "Dry production offcuts\nfor heating"],
  },
  de: {
    "winter-pallet": ["Winterpaletten", "Verstärkte Ausführung\nfür kalte Lager"],
    "new-plastic-1200x800": ["Kunststoff 1200x800", "Neue Kunststoffpalette\nfür hygienische Bereiche"],
    "new-plastic-1200x1000": ["Kunststoff 1200x1000", "Neue großformatige\nKunststoffpalette"],
    "custom-size-order": ["Sondermaß bestellen", "Wir fertigen Paletten\nnach Ihrer Vorgabe"],
    "used-reinforced": ["Gestempelte Europaletten", "Klasse 1 und 2,\nEUR / EPAL / UIC"],
    "used-plastic-1200x800": ["Kunststoff 1200x800", "Geprüfte gebrauchte\nKunststoffpalette"],
    "used-plastic-1200x1000": ["Kunststoff 1200x1000", "Gebrauchte großformatige\nKunststoffpalette"],
    "used-eurocube": ["IBC-Container 1000 L", "Gebrauchter IBC-Container\nim Stahlkäfig"],
    "used-big-bag": ["Gebrauchter Big Bag", "Flexibler Behälter\nfür Schüttgut"],
    "wood-offcuts": ["Holzreste", "Trockene Produktionsreste\nzum Heizen"],
  },
};

const localizeProduct = (item, language, pageKey) => {
  if (!item || language === "ru") {
    return item;
  }

  const [translatedTitle, translatedSummary] = productCopyByLanguage[language]?.[item.id] || [];
  const isUsed = pageKey === "used";
  const numericTitle = /^\d/.test(item.title);
  const genericSummary = isUsed
    ? language === "de"
      ? "Geprüfte gebrauchte Palette\nfür Lager und Logistik"
      : "Inspected used pallet\nfor warehouse and logistics"
    : language === "de"
      ? "Neue Holzpalette\nfür Lager und Logistik"
      : "New wooden pallet\nfor warehouse and logistics";
  const genericLead = isUsed
    ? language === "de"
      ? `Gebrauchte Palette in der Größe ${item.title} mm. Zustand und Ausführung werden vor der Lieferung geprüft.`
      : `Used pallet size ${item.title} mm. Condition and configuration are checked before shipment.`
    : language === "de"
      ? `Neue Palette in der Größe ${item.title} mm. Für Lagerung, Logistik und Transport.`
      : `New pallet size ${item.title} mm. Suitable for storage, logistics and transport.`;

  return {
    ...item,
    title: translatedTitle || item.title,
    detailTitle: translatedTitle || item.detailTitle,
    summary: translatedSummary || (numericTitle ? genericSummary : item.summary),
    detailLead: numericTitle ? genericLead : translatedSummary?.replace("\n", " ") || item.detailLead,
  };
};

const getLocalizedPriceNote = (product, language) => {
  if (!product || language === "ru") {
    return product?.priceNote || "";
  }

  if (typeof product.basePrice === "number") {
    return language === "de"
      ? "Preis ohne MwSt. Jeder nächste Wert bei Brettstärke oder Oberdeck erhöht den Preis um 0,30 BYN. Der Endpreis hängt von Menge und Zustand ab."
      : "Price excludes VAT. Each next board thickness or top-deck option adds 0.30 BYN. The final price depends on quantity and condition.";
  }

  return language === "de"
    ? "Preis und Verfügbarkeit bitte telefonisch oder per Anfrage klären."
    : "Please contact us to check price and availability.";
};

const translateSpecLabel = (label, language) => {
  if (language === "ru") {
    return label;
  }

  const exactPhrases = language === "de"
    ? {
        "В наличии": "Auf Lager",
        "Под заказ": "Auf Bestellung",
        "Уточнить наличие": "Verfügbarkeit anfragen",
        "Готовы к отгрузке": "Versandbereit",
        "По запросу": "Auf Anfrage",
      }
    : {
        "В наличии": "In stock",
        "Под заказ": "Made to order",
        "Уточнить наличие": "Check availability",
        "Готовы к отгрузке": "Ready to ship",
        "По запросу": "On request",
      };

  if (exactPhrases[label]) {
    return exactPhrases[label];
  }

  const replacements = language === "de"
    ? [
        ["Толщина доски", "Brettstärke"], ["Верхний настил", "Oberdeck"], ["Настил", "Oberdeck"],
        ["Нагрузка", "Traglast"], ["Материал", "Material"], ["Размер", "Maße"], ["Сорт", "Klasse"],
        ["Состояние", "Zustand"], ["Маркировка", "Kennzeichnung"], ["Объём", "Volumen"],
        ["Грузоподъёмность", "Tragfähigkeit"], ["хвойные породы", "Nadelholz"], ["досок", "Bretter"],
        ["сплошной", "geschlossen"], ["до ", "bis "], ["по запросу", "auf Anfrage"],
      ]
    : [
        ["Толщина доски", "Board thickness"], ["Верхний настил", "Top deck"], ["Настил", "Top deck"],
        ["Нагрузка", "Load capacity"], ["Материал", "Material"], ["Размер", "Size"], ["Сорт", "Grade"],
        ["Состояние", "Condition"], ["Маркировка", "Marking"], ["Объём", "Volume"],
        ["Грузоподъёмность", "Load capacity"], ["хвойные породы", "softwood"], ["досок", "boards"],
        ["сплошной", "solid"], ["до ", "up to "], ["по запросу", "on request"],
      ];

  return replacements.reduce((value, [from, to]) => value.replaceAll(from, to), label);
};

const homeHighlights = [
  {
    icon: "/assets/generated/bottom-icon-factory.webp",
    title: "Собственное производство",
    text: "Стабильное качество и точная геометрия каждой партии",
  },
  {
    icon: "/assets/generated/bottom-icon-shield.webp",
    title: "Проверенный материал",
    text: "Новые и б/у поддоны с контролем состояния и сортировки",
  },
  {
    icon: "/assets/generated/bottom-icon-boxes.webp",
    title: "Любые объёмы",
    text: "Быстро комплектуем поставки от малого заказа до опта",
  },
  {
    icon: "/assets/generated/bottom-icon-truck.webp",
    title: "Доставка по Беларуси",
    text: "Организуем отгрузку, самовывоз и доставку под ваш график",
  },
];

const pageConfigs = {
  new: {
    pageClassName: "page--new",
    heroClassName: "hero-banner--new",
    showCatalogSpecs: true,
    hero: {
      title: "Новые поддоны",
      lead:
        "Качественные новые поддоны из хвойных пород дерева.\nИдеальны для хранения и транспортировки грузов.",
      image: "/assets/generated/new-pallets-hero.webp",
      imageAlt: "Стопка новых деревянных поддонов",
      primaryAction: "Оформить заявку",
      secondaryAction: "Позвонить",
      features: [
        {
          icon: "/assets/generated/icon-shield.webp",
          title: "Высокое качество",
          text: "и надежность",
        },
        {
          icon: "/assets/generated/icon-tree.webp",
          title: "Изготовлены",
          text: "из свежей древесины",
        },
        {
          icon: "/assets/generated/icon-badge.webp",
          title: "Соответствуют",
          text: "всем стандартам",
        },
      ],
    },
    catalogTitle: "Каталог",
    catalogItems: [
      {
        id: "euro-1200x800",
        title: "1200x800",
        detailTitle: "1200x800",
        summary: "Новый поддон\nдля склада и логистики",
        detailLead:
          "Новый поддон размера 1200×800 мм.\nПодходит для складских, транспортных\nи производственных задач.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x80-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x80-22mm-5boards.webp")],
        basePrice: 11,
        cardPrice: "11 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок"],
        defaultDeck: "5 досок",
        variantImages: buildNewVariantImageMap("120x80", ["5 досок", "6 досок"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19 / 20 / 22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 или 6 досок" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.sort, label: "Сорт: 1" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Соответствие ГОСТ / EPAL" },
        ],
      },
      {
        id: "finnish-1200x1000",
        title: "1140x1140",
        detailTitle: "1140x1140",
        summary: "Новый поддон\nдля хранения и отгрузки",
        detailLead:
          "Новый поддон размера 1140×1140 мм.\nУдобен для хранения, комплектации\nи отгрузки продукции.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-114x114-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-114x114-22mm-5boards.webp")],
        basePrice: 11,
        cardPrice: "11 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок"],
        defaultDeck: "5 досок",
        variantImages: buildNewVariantImageMap("114x114", ["5 досок", "6 досок"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19 / 20 / 22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 или 6 досок" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1140×1140 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.sort, label: "Сорт: 1" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Изготовление по стандартам качества" },
        ],
      },
      {
        id: "lightweight-1200x800",
        title: "1200x1000",
        detailTitle: "1200x1000",
        summary: "Новый поддон\nдля складской логистики",
        detailLead:
          "Новый поддон размера 1200×1000 мм.\nПодходит для склада, логистики\nи комплектации грузов.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x100-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x100-22mm-5boards.webp")],
        basePrice: 11,
        cardPrice: "11 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил"],
        defaultDeck: "5 досок",
        variantImages: buildNewVariantImageMap("120x100", ["5 досок", "6 досок", "Сплошной настил"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19 / 20 / 22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 / 6 / сплошной" },
          { icon: specIcons.weight, label: "Нагрузка: до 1200 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1200 кг" },
          { icon: specIcons.sort, label: "Сорт: 1" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Соответствие внутренним стандартам" },
        ],
      },
      {
        id: "reinforced-1200x800",
        title: "1200x1200",
        detailTitle: "1200x1200",
        summary: "Новый поддон\nдля крупного формата груза",
        detailLead:
          "Новый поддон размера 1200×1200 мм.\nПодходит для крупного формата груза,\nсклада и отгрузки.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x120-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x120-22mm-5boards.webp")],
        basePrice: 11,
        cardPrice: "11 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил"],
        defaultDeck: "5 досок",
        variantImages: buildNewVariantImageMap("120x120", ["5 досок", "6 досок", "Сплошной настил"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19 / 20 / 22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 / 6 / сплошной" },
          { icon: specIcons.weight, label: "Нагрузка: до 2000 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1200 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 2000 кг" },
          { icon: specIcons.sort, label: "Сорт: 1" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Соответствие стандартам качества" },
        ],
      },
      {
        id: "winter-pallet",
        title: "Зимние поддоны",
        detailTitle: "Зимние поддоны",
        summary: "Усиленная конструкция\nдля хранения на холоде",
        detailLead:
          "Поддоны из сухой хвойной древесины для холодных складов и зимней эксплуатации.\nКонструкцию и размер подбираем под нагрузку.",
        image: "/assets/generated/product-additions/winter-pallet.webp",
        gallery: ["/assets/generated/product-additions/winter-pallet.webp"],
        basePrice: 11,
        cardPrice: "11 BYN",
        priceNote: "Цена указана без учёта НДС и зависит от размера, настила и объёма партии.",
        availability: "Под заказ",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил"],
        defaultDeck: "5 досок",
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19 / 20 / 22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 / 6 / сплошной" },
          { icon: specIcons.quality, label: "Для холодных складов и улицы" },
          { icon: specIcons.material, label: "Материал: сухие хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: по задаче клиента" },
          { icon: specIcons.weight, label: "Нагрузка: рассчитывается под груз" },
          { icon: specIcons.material, label: "Материал: сухие хвойные породы" },
          { icon: specIcons.quality, label: "Усиленные узлы для зимней эксплуатации" },
        ],
      },
      {
        id: "new-plastic-1200x800",
        title: "Пластиковый 1200x800",
        detailTitle: "Пластиковый\n1200x800",
        summary: "Новый пластиковый поддон\nдля чистых производств",
        detailLead:
          "Новый пластиковый поддон размером 1200×800 мм.\nНе впитывает влагу, легко очищается и подходит для многократного использования.",
        image: "/assets/generated/product-additions/new-plastic-1200x800.webp",
        gallery: ["/assets/generated/product-additions/new-plastic-1200x800.webp"],
        price: "По запросу",
        priceNote: "Стоимость и наличие уточняются по телефону.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Моющийся и влагостойкий" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Для многократного использования" },
        ],
      },
      {
        id: "new-plastic-1200x1000",
        title: "Пластиковый 1200x1000",
        detailTitle: "Пластиковый\n1200x1000",
        summary: "Новый пластиковый поддон\nувеличенного формата",
        detailLead:
          "Новый пластиковый поддон размером 1200×1000 мм.\nУстойчив к влаге и подходит для склада, пищевых и производственных задач.",
        image: "/assets/generated/product-additions/new-plastic-1200x1000.webp",
        gallery: ["/assets/generated/product-additions/new-plastic-1200x1000.webp"],
        price: "По запросу",
        priceNote: "Стоимость и наличие уточняются по телефону.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Моющийся и влагостойкий" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Для многократного использования" },
        ],
      },
      {
        id: "custom-size-order",
        title: "Заказать другой размер",
        detailTitle: "Заказать\nдругой размер",
        summary: "Изготовим поддон\nпод ваш запрос",
        detailLead:
          "Изготовим новые поддоны под нужный размер,\nтолщину доски и задачу.\nПодберём решение под ваш груз.",
        image: versionAsset("/assets/generated/variants/new-cropped/new-custom-size.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cropped/new-custom-size.webp")],
        price: "По запросу",
        priceNote: "Стоимость зависит от размера, толщины доски и объёма партии",
        availability: "Под заказ",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        requestOnly: true,
        actionLabel: "Описать заказ",
        thicknessOptions: ["22 мм", "25 мм", "Под запрос"],
        defaultThickness: "Под запрос",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил", "Под запрос"],
        defaultDeck: "Под запрос",
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: под запрос" },
          { icon: specIcons.deck, label: "Настил: под запрос" },
          { icon: specIcons.weight, label: "Размер: по вашему ТЗ" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: по вашему ТЗ" },
          { icon: specIcons.weight, label: "Нагрузка: под задачу клиента" },
          { icon: specIcons.quality, label: "Изготовление: от 1 партии" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Согласуем размеры и конструкцию перед запуском" },
        ],
      },
    ],
    highlights: [
      {
        icon: "/assets/generated/bottom-icon-factory.webp",
        title: "Собственное производство",
        text: "Полный контроль качества\nна всех этапах производства",
      },
      {
        icon: "/assets/generated/bottom-icon-shield.webp",
        title: "Стандарт качества",
        text: "Соответствие ГОСТ,\nконтроль на каждом этапе",
      },
      {
        icon: "/assets/generated/bottom-icon-boxes.webp",
        title: "Любые объёмы",
        text: "Возможность поставок\nот малых до крупных партий",
      },
      {
        icon: "/assets/generated/bottom-icon-truck.webp",
        title: "Доставка по РБ",
        text: "Быстрая и надёжная доставка\nв любую точку страны",
      },
    ],
    serviceFeature: {
      eyebrow: "Дополнительная услуга",
      title: "Фитосанитарная обработка",
      text: "Подготовим поддоны для экспортных поставок и предоставим необходимую маркировку по согласованию.",
      primaryLabel: "Заказать обработку",
      requestProduct: "Фитосанитарная обработка новых поддонов",
    },
    logistics: sharedLogistics,
    detailBenefits: [
      {
        icon: "/assets/generated/bottom-icon-shield.webp",
        title: "Высокое качество",
        text: "Изготовлены из отборной\nдревесины, без трещин\nи дефектов.",
      },
      {
        icon: "/assets/generated/icon-tree.webp",
        title: "Свежая древесина",
        text: "Используем только свежую\nдревесину хвойных пород\nс естественной влажностью.",
      },
      {
        icon: "/assets/generated/icon-badge.webp",
        title: "Соответствие стандартам",
        text: "Производство по ГОСТ\nи стандартам EPAL.\nГарантия надёжности.",
      },
      {
        icon: "/assets/generated/bottom-icon-truck.webp",
        title: "Быстрая доставка",
        text: "Оперативная доставка\nпо Минску и всей\nБеларуси.",
      },
    ],
    reviewsTitle: "Отзывы наших клиентов",
    reviews: [
      {
        logo: "/assets/generated/review-logo-vector.webp",
        name: "Иван Петров",
        company: "Логистическая компания «ТрансВектор»",
        text: "Работаем с ПАЛЛЕТ СЕРВИС уже\nболее года. Всегда стабильное качество,\nточные сроки и отличное отношение\nк клиентам.",
      },
      {
        logo: "/assets/generated/review-logo-systems.webp",
        name: "Ольга Смирнова",
        company: "ООО «Складские системы»",
        text: "Заказываем новые поддоны партиями.\nКачество на высоте, поддоны крепкие,\nсоответствуют ГОСТ. Рекомендуем\nкак надёжного поставщика.",
      },
      {
        logo: "/assets/generated/review-logo-metal.webp",
        name: "Алексей Кузнецов",
        company: "Завод «МеталлПром»",
        text: "Нужны были усиленные поддоны\nдля тяжёлых грузов. Всё сделали быстро,\nдоставили в срок. Будем сотрудничать\nи дальше.",
      },
    ],
    legalDetails: {
      display: "footer",
      title: "Реквизиты компании",
      company: 'ООО "ДЕРЕКОН"',
      items: [
        {
          label: "Адрес",
          value: "БЕЛАРУСЬ, Г. МИНСК, УЛ. ОЛЕШЕВА, ДОМ 9, ОФ. 5, ПОМ., 220090",
        },
        {
          label: "УНП",
          value: "194009703",
        },
        {
          label: "Карт-счет",
          value: "BY08ALFA30122K03300010270000 в BYN",
        },
        {
          label: "Банк",
          value: 'ЗАО "Альфа-Банк"',
        },
        {
          label: "БИК",
          value: "ALFABY2X",
        },
        {
          label: "Телефон",
          value: "+375 (29) 697-41-77",
        },
        {
          label: "Email",
          value: "Derekon.minsk@gmail.by",
        },
      ],
    },
  },
  used: {
    pageClassName: "page--used",
    heroClassName: "hero-banner--used",
    showCatalogSpecs: true,
    hero: {
      title: "Б/у поддоны",
      lead:
        "Проверенные поддоны в хорошем состоянии\nпо выгодной цене. Подходят для склада, логистики\nи перевозок.",
      image: "/assets/pallet-used.webp",
      imageAlt: "Стопка б/у поддонов на складе",
      primaryAction: "Оформить заявку",
      secondaryAction: "Позвонить",
      features: [
        {
          icon: "/assets/generated/bottom-icon-shield.webp",
          title: "Проверенное",
          text: "состояние",
        },
        {
          icon: "/assets/generated/catalog-icon-tag.webp",
          title: "Выгодная",
          text: "цена",
        },
        {
          icon: "/assets/generated/detail/status-check.webp",
          title: "Готовы",
          text: "к работе",
        },
      ],
    },
    catalogTitle: "Каталог",
    catalogItems: [
      {
        id: "used-euro-1200x800",
        title: "1200x800",
        detailTitle: "1200x800",
        summary: "5 или 6 досок\nверхнего настила",
        detailLead:
          "Б/у поддон размера 1200×800 мм.\nВарианты исполнения: верхний настил 5 или 6 досок,\nтолщина доски 19, 20 или 22 мм.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x800-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x800-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x800-6boards.webp"),
        ],
        basePrice: 6.5,
        cardPrice: "6,50 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "Готовы к отгрузке",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок"],
        defaultDeck: "5 досок",
        variantImages: buildUsedVariantImageMap("120x800", ["5 досок", "6 досок"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19/20/22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 или 6 досок" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: "/assets/generated/bottom-icon-shield.webp", label: "Состояние: сортировка и проверка перед отгрузкой" },
        ],
      },
      {
        id: "used-finnish-1200x1000",
        title: "1200x1000",
        detailTitle: "1200x1000",
        summary: "5, 6 досок или\nсплошной настил",
        detailLead:
          "Б/у поддон размера 1200×1000 мм.\nВарианты исполнения: верхний настил 5 досок,\n6 досок или сплошной настил без промежутков.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x100-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x100-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x100-6boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x100-soliddeck.webp"),
        ],
        basePrice: 6.5,
        cardPrice: "6,50 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил"],
        defaultDeck: "5 досок",
        variantImages: buildUsedVariantImageMap("120x100", ["5 досок", "6 досок", "Сплошной настил"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19/20/22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 / 6 / сплошной" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1500 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: "/assets/generated/bottom-icon-shield.webp", label: "Состояние: отобранные, пригодные к эксплуатации" },
        ],
      },
      {
        id: "used-sort-2",
        title: "1200x1200",
        detailTitle: "1200x1200",
        summary: "5, 6 досок или\nсплошной настил",
        detailLead:
          "Б/у поддон размера 1200×1200 мм.\nВарианты исполнения: верхний настил 5 досок,\n6 досок или сплошной настил без промежутков.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x120-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x120-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x120-6boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x120-soliddeck.webp"),
        ],
        basePrice: 6.5,
        cardPrice: "6,50 BYN",
        priceNote: "Цена указана без учёта НДС. Каждый следующий вариант толщины или настила добавляет 0,30 BYN.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "19 мм",
        deckOptions: ["5 досок", "6 досок", "Сплошной настил"],
        defaultDeck: "5 досок",
        variantImages: buildUsedVariantImageMap("120x120", ["5 досок", "6 досок", "Сплошной настил"]),
        specs: [
          { icon: specIcons.thickness, label: "Толщина доски: 19/20/22 мм" },
          { icon: specIcons.deck, label: "Настил: 5 / 6 / сплошной" },
          { icon: specIcons.weight, label: "Нагрузка: до 1800 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1200 мм" },
          { icon: specIcons.weight, label: "Нагрузка: до 1800 кг" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: "/assets/generated/bottom-icon-shield.webp", label: "Состояние: рабочее, после сортировки" },
        ],
      },
      {
        id: "used-reinforced",
        title: "Европоддоны с клеймом",
        detailTitle: "Европоддоны\nс клеймом",
        summary: "1 сорт и 2 сорт,\nEUR / EPAL / UIC",
        detailLead:
          "Б/у европоддоны с клеймом размером 1200×800 мм.\nЕсть 1 сорт и 2 сорт: светлый и тёмный.\nМаркировка EUR, EPAL, UIC.",
        image: versionUsedAsset("/assets/generated/used-variants/used-euro-stack.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-euro-stack.webp"),
        ],
        basePrice: 6.5,
        cardPrice: "6,50 BYN",
        priceNote: "Цена указана без учёта НДС и зависит от сорта и состояния партии.",
        availability: "В наличии",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.thickness, label: "Толщина доски: 22 мм" },
          { icon: specIcons.sort, label: "Сорт: 1 и 2" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.thickness, label: "Толщина доски: 22 мм" },
          { icon: specIcons.sort, label: "1 сорт: один раз использовался" },
          { icon: specIcons.sort, label: "2 сорт: светлый, слегка пожелтевший" },
          { icon: specIcons.sort, label: "2 сорт: тёмный, серый слегка" },
          { icon: specIcons.material, label: "Материал: хвойные породы" },
          { icon: specIcons.quality, label: "Маркировка: EUR, EPAL, UIC" },
          { icon: "/assets/generated/bottom-icon-shield.webp", label: "Срезаны углы, снята фаска для заезда тележки" },
        ],
      },
      {
        id: "used-plastic-1200x800",
        title: "Пластиковый 1200x800",
        detailTitle: "Пластиковый\n1200x800",
        summary: "Б/у пластиковый поддон\nв рабочем состоянии",
        detailLead:
          "Б/у пластиковый поддон размером 1200×800 мм.\nПроходит осмотр и подходит для повторной эксплуатации.",
        image: "/assets/generated/product-additions/used-plastic-1200x800.webp",
        gallery: ["/assets/generated/product-additions/used-plastic-1200x800.webp"],
        price: "По запросу",
        priceNote: "Позвоните, чтобы уточнить наличие и состояние партии.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×800 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Состояние: после проверки" },
        ],
      },
      {
        id: "used-plastic-1200x1000",
        title: "Пластиковый 1200x1000",
        detailTitle: "Пластиковый\n1200x1000",
        summary: "Б/у пластиковый поддон\nувеличенного формата",
        detailLead:
          "Б/у пластиковый поддон размером 1200×1000 мм.\nПодходит для склада и повторного использования.",
        image: "/assets/generated/product-additions/used-plastic-1200x1000.webp",
        gallery: ["/assets/generated/product-additions/used-plastic-1200x1000.webp"],
        price: "По запросу",
        priceNote: "Позвоните, чтобы уточнить наличие и состояние партии.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: 1200×1000 мм" },
          { icon: specIcons.material, label: "Материал: HDPE-пластик" },
          { icon: specIcons.quality, label: "Состояние: после проверки" },
        ],
      },
      {
        id: "used-eurocube",
        title: "Еврокуб 1000 л",
        detailTitle: "Еврокуб\n1000 л",
        summary: "Б/у еврокуб\nв металлической обрешётке",
        detailLead:
          "Б/у еврокуб объёмом 1000 литров.\nНаличие, состояние ёмкости и тип поддона уточняйте перед заказом.",
        image: "/assets/generated/product-additions/used-eurocube.webp",
        gallery: ["/assets/generated/product-additions/used-eurocube.webp"],
        price: "По запросу",
        priceNote: "Цена и наличие зависят от состояния конкретной ёмкости.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.weight, label: "Объём: 1000 л" },
          { icon: specIcons.quality, label: "Состояние: б/у" },
        ],
        detailSpecs: [
          { icon: specIcons.weight, label: "Номинальный объём: 1000 л" },
          { icon: specIcons.material, label: "Пластиковая ёмкость в стальной обрешётке" },
          { icon: specIcons.quality, label: "Состояние и герметичность уточняются" },
        ],
      },
      {
        id: "used-big-bag",
        title: "Биг-бэг б/у",
        detailTitle: "Биг-бэг б/у",
        summary: "Мягкий контейнер\nдля сыпучих грузов",
        detailLead:
          "Б/у мягкие контейнеры Big Bag для хранения и перевозки сыпучих грузов.\nРазмер и наличие нужного варианта уточняйте перед заказом.",
        image: "/assets/generated/product-additions/used-big-bag.webp",
        gallery: ["/assets/generated/product-additions/used-big-bag.webp"],
        basePrice: 5.5,
        cardPrice: "5,50 BYN",
        priceNote: "Цена от 5,50 BYN без учёта НДС. Наличие нужного размера уточняйте по телефону.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.weight, label: "Для сыпучих грузов" },
          { icon: specIcons.size, label: "Размеры: в ассортименте" },
        ],
        detailSpecs: [
          { icon: specIcons.size, label: "Размер: уточняется по наличию" },
          { icon: specIcons.weight, label: "Грузоподъёмность: зависит от модели" },
          { icon: specIcons.quality, label: "Состояние: проверенное б/у" },
        ],
      },
      {
        id: "wood-offcuts",
        title: "Отходы древесины",
        detailTitle: "Отходы\nдревесины",
        summary: "Сухие обрезки производства\nдля отопления",
        detailLead:
          "Сухие обрезки хвойной древесины от производства поддонов.\nПодходят для отопления; объём партии и наличие уточняйте по телефону.",
        image: "/assets/generated/product-additions/wood-offcuts.webp",
        gallery: ["/assets/generated/product-additions/wood-offcuts.webp"],
        price: "По запросу",
        priceNote: "Стоимость зависит от объёма и способа отгрузки.",
        availability: "Уточнить наличие",
        pickup: sharedPickup,
        delivery: sharedDelivery,
        specs: [
          { icon: specIcons.material, label: "Сухая хвойная древесина" },
          { icon: specIcons.weight, label: "Объём: по наличию" },
        ],
        detailSpecs: [
          { icon: specIcons.material, label: "Материал: сухая хвойная древесина" },
          { icon: specIcons.quality, label: "Без окраски и химических покрытий" },
          { icon: specIcons.weight, label: "Объём партии: по согласованию" },
        ],
      },
    ],
    highlights: [
      {
        icon: "/assets/generated/bottom-icon-factory.webp",
        title: "Собственная сортировка",
        text: "Поддоны проходят сортировку\nи отбраковку на нашем складе",
      },
      {
        icon: "/assets/generated/bottom-icon-shield.webp",
        title: "Контроль качества",
        text: "Проверяем поддоны\nна прочность и пригодность\nк эксплуатации",
      },
      {
        icon: "/assets/generated/bottom-icon-boxes.webp",
        title: "Любые объёмы",
        text: "От небольших партий\nдо крупных оптовых поставок",
      },
      {
        icon: "/assets/generated/bottom-icon-truck.webp",
        title: "Доставка по Беларуси",
        text: "Быстрая и надёжная доставка\nв любой регион страны",
      },
    ],
    serviceFeature: {
      eyebrow: "Отдельная услуга",
      title: "Поддоны с фитосанитарным клеймом",
      text: "Подберём б/у поддоны с подходящей маркировкой для экспортных и складских задач. Стоимость и наличие уточняются по телефону.",
      primaryLabel: "Уточнить наличие",
      requestProduct: "Б/у поддоны с фитосанитарным клеймом",
    },
    logistics: sharedLogistics,
    qualitySection: null,
    detailBenefits: [
      {
        icon: "/assets/generated/bottom-icon-shield.webp",
        title: "Проверенное состояние",
        text: "Каждая партия проходит\nсортировку и визуальный\nконтроль перед продажей.",
      },
      {
        icon: "/assets/generated/catalog-icon-tag.webp",
        title: "Экономия бюджета",
        text: "Б/у поддоны помогают\nснизить затраты без потери\nрабочего функционала.",
      },
      {
        icon: "/assets/generated/icon-badge.webp",
        title: "Готовы к работе",
        text: "Поддоны отбираются\nдля повторной эксплуатации\nна складе и в логистике.",
      },
      {
        icon: "/assets/generated/bottom-icon-truck.webp",
        title: "Быстрая доставка",
        text: "Организуем отгрузку\nи доставку по Минску\nи всей Беларуси.",
      },
    ],
    reviewsTitle: "Отзывы наших клиентов",
    reviews: [
      {
        avatar: "ИП",
        name: "Иван Петров",
        company: "Логистическая компания",
        text: "Покупаем поддоны здесь регулярно.\nКачество стабильно хорошее, цены\nдоступные, доставка всегда вовремя.\nРекомендуем!",
      },
      {
        avatar: "ОС",
        name: "Ольга Смирнова",
        company: "ООО Складские решения",
        text: "Отличный сервис и большой выбор\nб/у поддонов. Менеджеры помогают\nподобрать оптимальный вариант\nпод наши задачи.",
      },
      {
        avatar: "АК",
        name: "Алексей Кузнецов",
        company: "Завод МеталлПром",
        text: "Работаем уже не первый год. Удобные\nусловия, гибкий подход и качественные\nподдоны. Спасибо за сотрудничество!",
      },
    ],
    legalDetails: {
      display: "footer",
      title: "Реквизиты компании",
      company: "ИП ГУСЕВ АЛЕКСЕЙ АЛЕКСАНДРОВИЧ",
      items: [
        {
          label: "Адрес",
          value: "БЕЛАРУСЬ, Г. МИНСК, УЛ. КОРЖЕНЕВСКОГО, ДОМ 10, КОРПУС 2, ОФ. 45, 220108",
        },
        {
          label: "УНП",
          value: "193429209",
        },
        {
          label: "Текущий (расчетный) счет",
          value: "BY58ALFA30132652320010270000 в BYN",
        },
        {
          label: "Банк",
          value: 'ЗАО "Альфа-Банк"',
        },
        {
          label: "БИК",
          value: "ALFABY2X",
        },
        {
          label: "Телефон",
          value: "+375 (29) 697-47-77",
        },
        {
          label: "Email",
          value: "1041313@gmail.com",
        },
      ],
    },
  },
};

const resolvedHomeHighlights = prefixPaths(homeHighlights);
const resolvedPageConfigs = prefixPaths(pageConfigs);

function CatalogCard({ item, language, onOpen, onRequest, pageKey, related = false, showSpecs = true, customGridMode = "full" }) {
  const copy = uiCopyByLanguage[language] || uiCopyByLanguage.ru;
  const displayItem = localizeProduct(item, language, pageKey);
  const isCustom = item.id === "custom-size-order";

  return (
    <article
      className={`catalog-card${related ? " catalog-card--related" : ""}${isCustom ? ` catalog-card--custom catalog-card--custom-${customGridMode}` : ""}`}
    >
      <div className="catalog-card__image-wrap">
        <img alt={displayItem.title} className="catalog-card__image" decoding="async" loading="lazy" src={item.image} />
      </div>

      <div className="catalog-card__body">
        <h3>{displayItem.title}</h3>
        {displayItem.summary ? <p>{displayItem.summary}</p> : null}

        {showSpecs ? (
          <ul className="catalog-card__specs">
            {item.specs.map(({ icon, label }) => (
              <li key={label}>
                <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={icon} />
                <span>{translateSpecLabel(label, language)}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.cardPrice ? (
          <div className="catalog-card__price-line">
            <span>{copy.priceFrom}</span>
            <strong>{item.cardPrice}</strong>
          </div>
        ) : null}

        <button
          className="catalog-card__button"
          onClick={() => (item.requestOnly ? onRequest(item) : onOpen(item.id))}
          type="button"
        >
          <span>{item.requestOnly ? copy.request : copy.details}</span>
          <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
        </button>
      </div>
    </article>
  );
}

function ReviewIdentity({ review }) {
  if (review.logo) {
    return <img alt="" aria-hidden="true" className="review-card__logo" decoding="async" loading="lazy" src={review.logo} />;
  }

  return <span className="review-card__avatar">{review.avatar}</span>;
}

function SelectionLanding() {
  return (
    <main className="page page--home">
      <section className="selection-hero">
        <h1 className="visually-hidden">Выбор поддонов</h1>

        <div className="selection-hero__inner">
          <a className="selection-hero__column selection-hero__column--new" href={withBase("/new.html")}>
            <div className="selection-hero__media selection-hero__media--new">
              <img
                alt="Стопка новых поддонов и ящик из новых поддонов"
                className="selection-hero__image selection-hero__image--new-combo"
                src={withBase("/assets/generated/home/new-pallets-with-crate.webp")}
              />
            </div>

            <div className="selection-hero__copy">
              <span className="selection-hero__accent" aria-hidden="true" />
              <h2>Новые поддоны</h2>
              <p>
                Качественные новые поддоны
                <br />
                из хвойных пород дерева.
                <br />
                Идеальны для любых задач.
              </p>
              <span className="selection-hero__button selection-hero__button--dark">
                <span className="selection-hero__button-label" data-mobile-label="Каталог">
                  Смотреть каталог
                </span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
              </span>
            </div>
          </a>

          <a className="selection-hero__column selection-hero__column--used" href={withBase("/used.html")}>
            <div className="selection-hero__copy">
              <span className="selection-hero__accent" aria-hidden="true" />
              <h2>Б/у поддоны</h2>
              <p>
                Проверенные поддоны
                <br />
                в хорошем состоянии
                <br />
                по выгодной цене.
              </p>
              <span className="selection-hero__button selection-hero__button--gold">
                <span className="selection-hero__button-label" data-mobile-label="Каталог">
                  Смотреть каталог
                </span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
              </span>
            </div>

            <img
                alt="Две стопки б/у поддонов"
                className="selection-hero__image selection-hero__image--used"
                decoding="async"
                src={withBase("/assets/generated/home/used-pallets-duo.webp")}
              />
          </a>
        </div>
      </section>

      <section className="selection-highlights" aria-label="Преимущества сотрудничества">
        <div className="selection-highlights__inner">
          {resolvedHomeHighlights.map(({ icon, text, title }) => (
            <article className="selection-highlight" key={title}>
              <img alt="" aria-hidden="true" className="selection-highlight__icon" decoding="async" loading="lazy" src={icon} />
              <div className="selection-highlight__text">
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function App({ language = "ru", pageKey = "home" }) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState("");
  const [selectedDeck, setSelectedDeck] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestContext, setRequestContext] = useState(emptyRequestContext);
  const [requestForm, setRequestForm] = useState(emptyRequestForm);
  const [requestStatus, setRequestStatus] = useState("idle");

  if (pageKey === "home") {
    return <SelectionLanding />;
  }

  const page = resolvedPageConfigs[pageKey] ?? resolvedPageConfigs.new;
  const copy = uiCopyByLanguage[language] || uiCopyByLanguage.ru;
  const localizedPage = pageCopyByLanguage[language]?.[pageKey] || null;
  const pagePhone = phoneContactsByPage[pageKey] ?? phoneContactsByPage.new;
  const pageEmail = emailContactsByPage[pageKey] ?? emailContactsByPage.new;
  const requestSectionLabel = pageKey === "used" ? "Б/у" : pageKey === "new" ? "Новые" : "";
  const selectedProduct = page.catalogItems.find((item) => item.id === selectedProductId) ?? null;
  const localizedSelectedProduct = localizeProduct(selectedProduct, language, pageKey);
  const activeThickness =
    selectedThickness || selectedProduct?.defaultThickness || selectedProduct?.thicknessOptions?.[0] || "";
  const activeDeck = selectedDeck || selectedProduct?.defaultDeck || selectedProduct?.deckOptions?.[0] || "";
  const activeVariantImage = getVariantImageForProduct(selectedProduct, activeDeck);
  const selectedGallery = activeVariantImage ? [activeVariantImage] : selectedProduct?.gallery ?? [];
  const activeGalleryImage = selectedGallery[activeGalleryIndex] ?? selectedGallery[0] ?? "";
  const activeProductPrice = getCalculatedPrice(selectedProduct, activeThickness, activeDeck);
  const localizedActiveProductPrice = translateSpecLabel(activeProductPrice, language);
  const isCustomRequest = requestContext.product === "Заказать другой размер";
  const hasServiceSection = Boolean(page.serviceFeature || page.logistics?.length);

  const openProductDetail = (productId) => {
    setSelectedProductId(productId);
    setActiveGalleryIndex(0);
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
    setActiveGalleryIndex(0);
  };

  const openRequestModal = ({ deck = "", product = "", source = "", thickness = "" } = {}) => {
    const nextContext = {
      source: compactText(source) || requestSectionLabel,
      product: compactText(product),
      thickness: compactText(thickness),
      deck: compactText(deck),
    };

    setRequestContext(nextContext);
    setRequestForm(emptyRequestForm);
    setRequestStatus("idle");
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setRequestStatus("idle");
  };

  const handleRequestFieldChange = (event) => {
    const { name, value } = event.target;
    setRequestForm((current) => ({
      ...current,
      [name]: value,
    }));
    if (requestStatus !== "idle") {
      setRequestStatus("idle");
    }
  };

  const handleRequestFileChange = (event) => {
    const file = event.target.files?.[0];
    setRequestForm((current) => ({
      ...current,
      fileName: file?.name || "",
    }));
  };

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    const requestLines = [
      `Раздел: ${requestContext.source || requestSectionLabel}`,
      requestContext.product ? `Товар: ${requestContext.product}` : "",
      requestContext.thickness ? `Толщина: ${requestContext.thickness}` : "",
      requestContext.deck ? `Настил: ${requestContext.deck}` : "",
      requestForm.length ? `Длина: ${requestForm.length} мм` : "",
      requestForm.width ? `Ширина: ${requestForm.width} мм` : "",
      requestForm.height ? `Высота: ${requestForm.height} мм` : "",
      requestForm.quantity ? `Количество: ${requestForm.quantity}` : "",
      `Имя: ${requestForm.name}`,
      `Телефон: ${requestForm.phone}`,
      requestForm.email ? `Email: ${requestForm.email}` : "",
      requestForm.comment ? `Комментарий: ${requestForm.comment}` : "",
      requestForm.fileName
        ? `Файл: ${requestForm.fileName} (пожалуйста, приложите выбранный файл к письму)`
        : "",
    ].filter(Boolean);
    const subject = `Заявка с сайта: ${requestContext.product || requestSectionLabel}`;
    window.location.href = `mailto:${pageEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestLines.join("\n"))}`;
    setRequestStatus("success");
  };

  const openCatalogRequest = (item) => {
    openRequestModal({ product: item.detailTitle || item.title });
  };

  useEffect(() => {
    setSelectedProductId(null);
    setActiveGalleryIndex(0);
    setSelectedThickness("");
    setSelectedDeck("");
    setIsRequestModalOpen(false);
    setRequestContext(emptyRequestContext);
    setRequestForm(emptyRequestForm);
    setRequestStatus("idle");
  }, [pageKey]);

  useEffect(() => {
    if (!selectedProduct) {
      setSelectedThickness("");
      setSelectedDeck("");
      return;
    }

    if (selectedProduct.thicknessOptions?.length) {
      setSelectedThickness(selectedProduct.defaultThickness ?? selectedProduct.thicknessOptions[0]);
    } else {
      setSelectedThickness("");
    }

    if (selectedProduct.deckOptions?.length) {
      setSelectedDeck(selectedProduct.defaultDeck ?? selectedProduct.deckOptions[0]);
    } else {
      setSelectedDeck("");
    }
  }, [selectedProduct]);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [activeVariantImage]);

  useEffect(() => {
    if (!selectedProduct && !isRequestModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isRequestModalOpen) {
          closeRequestModal();
          return;
        }
        closeProductDetail();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRequestModalOpen, selectedProduct]);

  const requestContextItems = [
    requestContext.source ? { label: copy.section, value: requestContext.source } : null,
    requestContext.product ? { label: copy.product, value: requestContext.product } : null,
    requestContext.thickness ? { label: copy.thickness, value: requestContext.thickness } : null,
    requestContext.deck ? { label: copy.deck, value: requestContext.deck } : null,
  ].filter(Boolean);

  return (
    <main className={`page ${page.pageClassName}`}>
      <section className={`hero-banner ${page.heroClassName}`}>
        <div className="hero-banner__overlay" aria-hidden="true" />

        <div className="hero-banner__inner">
          <div className="hero-banner__content">
            <h1>{localizedPage?.title || page.hero.title}</h1>
            <span className="hero-banner__accent" aria-hidden="true" />

            <p className="hero-banner__lead">{localizedPage?.lead || page.hero.lead}</p>

            <div className="hero-banner__actions">
              <button
                className="hero-button hero-button--primary"
                onClick={() => openRequestModal()}
                type="button"
              >
                <span>{copy.request}</span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
              </button>

              <a className="hero-button hero-button--ghost" href={pagePhone.href}>
                <span>{copy.call}</span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
              </a>
            </div>

            <div className="hero-features" aria-label={`Преимущества страницы ${page.hero.title}`}>
              {page.hero.features.map(({ icon, text, title }, index) => (
                <article className="hero-feature" key={title}>
                  <img alt="" aria-hidden="true" className="hero-feature__icon" src={icon} />
                  <div>
                    <strong>{localizedPage?.features?.[index]?.[0] || title}</strong>
                    <span>{localizedPage?.features?.[index]?.[1] || text}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-banner__media">
            <img alt={page.hero.imageAlt} className="hero-banner__pallet" src={page.hero.image} />
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="catalog-section__inner">
          <div className="catalog-section__heading">
            <h2>{copy.catalog}</h2>
            <span aria-hidden="true" className="catalog-section__accent" />
          </div>

          <div className="catalog-grid">
            {page.catalogItems.map((item, index) => (
              <CatalogCard
                item={item}
                key={item.id}
                language={language}
                onOpen={openProductDetail}
                onRequest={openCatalogRequest}
                pageKey={pageKey}
                showSpecs={page.showCatalogSpecs !== false}
                customGridMode={index % 2 === 1 ? "paired" : "full"}
              />
            ))}
          </div>
        </div>
      </section>

      {hasServiceSection ? (
        <section className="service-logistics" id="delivery">
          {!page.qualitySection ? <span aria-hidden="true" className="section-anchor" id="company" /> : null}

          <div className="service-logistics__inner">
            {page.serviceFeature ? (
              <article className="service-card">
                <span className="service-card__eyebrow">{localizedPage?.service?.[0] || page.serviceFeature.eyebrow}</span>
                <img
                  alt=""
                  aria-hidden="true"
                  className="service-card__visual"
                  src={withBase("/assets/generated/service-phytosanitary.png")}
                />
                <h2>{localizedPage?.service?.[1] || page.serviceFeature.title}</h2>
                <p>{localizedPage?.service?.[2] || page.serviceFeature.text}</p>

                <div className="service-card__actions">
                  <button
                    className="service-card__button"
                    onClick={() =>
                      openRequestModal({
                        product: page.serviceFeature.requestProduct || page.serviceFeature.title,
                        source: requestSectionLabel,
                      })
                    }
                    type="button"
                  >
                    <span>{localizedPage?.service?.[3] || page.serviceFeature.primaryLabel}</span>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                  </button>

                  <a className="service-card__phone" href={pagePhone.href}>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
                    <span>{copy.call}: {pagePhone.label}</span>
                  </a>
                </div>
              </article>
            ) : null}

            {page.logistics?.length ? (
              <aside className="logistics-card" aria-label="Доставка и условия">
                <div className="logistics-card__heading">
                  <span>{copy.deliveryTitle}</span>
                  <strong>{copy.deliverySubtitle}</strong>
                </div>

                <div className="logistics-card__list">
                  {page.logistics.map(({ icon, text, title }, index) => (
                    <article className="logistics-item" key={title}>
                      <img alt="" aria-hidden="true" className="logistics-item__icon" src={icon} />
                      <div>
                        <strong>{pageCopyByLanguage[language]?.logistics?.[index]?.[0] || title}</strong>
                        <p>{pageCopyByLanguage[language]?.logistics?.[index]?.[1] || text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="logistics-card__contacts">
                  <a href={pagePhone.href}>{pagePhone.label}</a>
                  <a href={`mailto:${pageEmail}`}>{pageEmail}</a>
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      ) : null}

      {selectedProduct ? (
        <section
          aria-labelledby="product-detail-title"
          aria-modal="true"
          className="product-detail-section product-detail-section--overlay"
          id="details"
          role="dialog"
        >
          <button
            aria-label="Закрыть карточку товара"
            className="product-detail-section__backdrop"
            onClick={closeProductDetail}
            type="button"
          />

          <div className="product-detail-section__inner">
            <div className="product-detail-card">
              <button
                aria-label="Закрыть карточку товара"
                className="product-detail-section__close"
                onClick={closeProductDetail}
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>

              <div className="product-detail-card__gallery">
                <div className="product-detail-card__main-frame">
                  <img
                    alt={localizedSelectedProduct.title}
                    className="product-detail-card__main-image"
                    decoding="async"
                    src={activeGalleryImage}
                  />
                </div>

                <div className="product-detail-card__thumbs" role="tablist" aria-label="Галерея товара">
                  {selectedGallery.map((image, index) => (
                    <button
                      aria-label={`Показать изображение ${index + 1}`}
                      aria-pressed={activeGalleryIndex === index}
                      className={`product-detail-card__thumb${activeGalleryIndex === index ? " product-detail-card__thumb--active" : ""}`}
                      key={`${selectedProduct.id}-${image}`}
                      onClick={() => setActiveGalleryIndex(index)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={image} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-detail-card__content">
                <div className="product-detail-card__topline">
                  <h2 id="product-detail-title">{localizedSelectedProduct.detailTitle}</h2>

                  <div className="product-detail-card__availability">
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/status-check.webp")} />
                    <span>{translateSpecLabel(selectedProduct.availability, language)}</span>
                  </div>
                </div>

                <p className="product-detail-card__lead">{localizedSelectedProduct.detailLead}</p>

                {selectedProduct.thicknessOptions?.length ? (
                  <div className="product-detail-card__option-group">
                    <span className="product-detail-card__option-label">{copy.boardThickness}</span>

                    <div className="product-detail-card__option-list" aria-label="Выбор толщины доски">
                      {selectedProduct.thicknessOptions.map((option) => (
                        <button
                          aria-pressed={activeThickness === option}
                          className={`product-detail-card__option-chip${activeThickness === option ? " product-detail-card__option-chip--active" : ""}`}
                          key={`${selectedProduct.id}-${option}`}
                          onClick={() => setSelectedThickness(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selectedProduct.deckOptions?.length ? (
                  <div className="product-detail-card__option-group">
                    <span className="product-detail-card__option-label">{copy.topDeck}</span>

                    <div className="product-detail-card__option-list" aria-label="Выбор верхнего настила">
                      {selectedProduct.deckOptions.map((option) => (
                        <button
                          aria-pressed={activeDeck === option}
                          className={`product-detail-card__option-chip${activeDeck === option ? " product-detail-card__option-chip--active" : ""}`}
                          key={`${selectedProduct.id}-${option}`}
                          onClick={() => setSelectedDeck(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <ul className="product-detail-card__specs">
                  {activeThickness ? (
                    <li>
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={specIcons.thickness} />
                      <span>{`${copy.boardThickness}: ${activeThickness}`}</span>
                    </li>
                  ) : null}

                  {activeDeck ? (
                    <li>
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={specIcons.deck} />
                      <span>{`${copy.topDeck}: ${activeDeck}`}</span>
                    </li>
                  ) : null}

                  {selectedProduct.detailSpecs.map(({ icon, label }) => (
                    <li key={label}>
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={icon} />
                      <span>{translateSpecLabel(label, language)}</span>
                    </li>
                  ))}
                </ul>

                {activeProductPrice ? (
                  <div className="product-detail-card__price">
                    <span>{activeProductPrice === "По запросу" ? copy.price : copy.priceFrom}</span>
                    <strong>{localizedActiveProductPrice}</strong>
                    {activeProductPrice === "По запросу" ? null : <em>{copy.perPiece}</em>}
                  </div>
                ) : null}

                <p className="product-detail-card__price-note">{getLocalizedPriceNote(selectedProduct, language)}</p>

                <div className="product-detail-card__actions">
                  <button
                    className="product-detail-card__action product-detail-card__action--primary"
                    onClick={() =>
                      openRequestModal({
                        product: selectedProduct.detailTitle,
                        thickness: activeThickness,
                        deck: activeDeck,
                      })
                    }
                    type="button"
                  >
                  <span>{copy.request}</span>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                  </button>

                  <a className="product-detail-card__action product-detail-card__action--ghost" href={pagePhone.href}>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
                    <span>{copy.call}</span>
                  </a>
                </div>

                <div className="product-detail-card__meta">
                  <article className="product-detail-card__meta-item">
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/pin.webp")} />
                    <span>{selectedProduct.pickup}</span>
                  </article>

                  <article className="product-detail-card__meta-item">
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/bottom-icon-truck.webp")} />
                    <span>{selectedProduct.delivery}</span>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isRequestModalOpen ? (
        <section
          aria-labelledby="request-modal-title"
          aria-modal="true"
          className="request-modal"
          role="dialog"
        >
          <button
            aria-label="Закрыть форму заявки"
            className="request-modal__backdrop"
            onClick={closeRequestModal}
            type="button"
          />

          <div className="request-modal__dialog">
            <div className="request-modal__panel">
              <button
                aria-label="Закрыть форму заявки"
                className="request-modal__close"
                onClick={closeRequestModal}
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>

              <h2 id="request-modal-title">{copy.request}</h2>
              <p className="request-modal__lead">{copy.requestLead}</p>

              {requestContextItems.length ? (
                <div className="request-modal__context">
                  {requestContextItems.map(({ label, value }) => (
                    <div className="request-modal__context-item" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              ) : null}

              {requestStatus === "success" ? (
                <div className="request-modal__success">
                  <strong>{copy.mailReady}</strong>
                  <p>
                    Открыто почтовое приложение с заполненной заявкой на адрес {pageEmail}.
                    {requestForm.fileName ? " Не забудьте приложить выбранный файл перед отправкой." : ""}
                  </p>

                  <div className="request-modal__footer">
                    <button className="request-modal__submit" onClick={closeRequestModal} type="button">
                      <span>{copy.close}</span>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                    </button>
                  </div>
                </div>
              ) : (
                <form className="request-modal__form" onSubmit={handleRequestSubmit}>
                  <label className="request-modal__field">
                    <span>{copy.name}</span>
                    <input
                      autoComplete="name"
                      className="request-modal__input"
                      name="name"
                      onChange={handleRequestFieldChange}
                      placeholder={copy.namePlaceholder}
                      required
                      type="text"
                      value={requestForm.name}
                    />
                  </label>

                  <label className="request-modal__field">
                    <span>{copy.phone}</span>
                    <input
                      autoComplete="tel"
                      className="request-modal__input"
                      name="phone"
                      onChange={handleRequestFieldChange}
                      placeholder={pagePhone.label}
                      required
                      type="tel"
                      value={requestForm.phone}
                    />
                  </label>

                  <label className="request-modal__field">
                    <span>{copy.email}</span>
                    <input
                      autoComplete="email"
                      className="request-modal__input"
                      name="email"
                      onChange={handleRequestFieldChange}
                      placeholder={pageEmail}
                      type="email"
                      value={requestForm.email}
                    />
                  </label>

                  {isCustomRequest ? (
                    <>
                      <div className="request-modal__dimensions" aria-label="Размеры изделия в миллиметрах">
                        {[
                          ["length", copy.dimensions[0]],
                          ["width", copy.dimensions[1]],
                          ["height", copy.dimensions[2]],
                        ].map(([name, label]) => (
                          <label className="request-modal__field" key={name}>
                            <span>{label}</span>
                            <input
                              className="request-modal__input"
                              inputMode="numeric"
                              min="1"
                              name={name}
                              onChange={handleRequestFieldChange}
                              placeholder="0"
                              type="number"
                              value={requestForm[name]}
                            />
                          </label>
                        ))}
                      </div>

                      <label className="request-modal__field">
                        <span>{copy.quantity}</span>
                        <input
                          className="request-modal__input"
                          inputMode="numeric"
                          min="1"
                          name="quantity"
                          onChange={handleRequestFieldChange}
                          placeholder={copy.quantityPlaceholder}
                          type="number"
                          value={requestForm.quantity}
                        />
                      </label>

                      <label className="request-modal__field request-modal__file-field">
                        <span>{copy.drawing}</span>
                        <input
                          accept=".pdf,.png,.jpg,.jpeg,.webp,.dwg,.dxf"
                          className="request-modal__file-input"
                          onChange={handleRequestFileChange}
                          type="file"
                        />
                        <strong>{requestForm.fileName || copy.drawingPrompt}</strong>
                      </label>
                    </>
                  ) : (
                    <label className="request-modal__field">
                      <span>{copy.quantity}</span>
                      <input
                        className="request-modal__input"
                        inputMode="numeric"
                        min="1"
                        name="quantity"
                        onChange={handleRequestFieldChange}
                        placeholder={copy.quantityPlaceholder}
                        type="number"
                        value={requestForm.quantity}
                      />
                    </label>
                  )}

                  <label className="request-modal__field">
                    <span>{copy.comment}</span>
                    <textarea
                      className="request-modal__textarea"
                      name="comment"
                      onChange={handleRequestFieldChange}
                      placeholder={copy.commentPlaceholder}
                      rows="5"
                      value={requestForm.comment}
                    />
                  </label>

                  <div className="request-modal__footer">
                    <button className="request-modal__submit" type="submit">
                      <span>{copy.send}</span>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                    </button>

                    <a className="request-modal__ghost" href={pagePhone.href}>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
                      <span>{copy.call}</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <>
          <section className="highlights-strip" aria-label="Преимущества сотрудничества">
            <div className="highlights-strip__inner">
              {page.highlights.map(({ icon, text, title }) => (
                <article className="highlight-item" key={title}>
                  <img alt="" aria-hidden="true" className="highlight-item__icon" decoding="async" loading="lazy" src={icon} />
                  <div className="highlight-item__text">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {page.qualitySection ? (
            <section className="quality-section" id="company">
              <div className="quality-section__inner">
                <div className="quality-section__heading">
                  <h2>{page.qualitySection.title}</h2>
                  <span aria-hidden="true" className="quality-section__accent" />
                </div>

                <div className="quality-grid">
                  {page.qualitySection.items.map(({ caption, image }) => (
                    <article className="quality-card" key={caption}>
                      <img alt={caption} decoding="async" loading="lazy" src={image} />
                      <span>{caption}</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {page.legalDetails && page.legalDetails.display !== "footer" ? (
            <section className="legal-section" id="contacts">
              {!page.qualitySection ? <span aria-hidden="true" className="section-anchor" id="company" /> : null}

              <div className="legal-section__inner">
                <div className="legal-section__heading">
                  <h2>{page.legalDetails.title}</h2>
                  <span aria-hidden="true" className="legal-section__accent" />
                </div>

                <article className="legal-card">
                  <div className="legal-card__company">
                    <span>Получатель</span>
                    <strong>{page.legalDetails.company}</strong>
                  </div>

                  <div className="legal-card__grid">
                    {page.legalDetails.items.map(({ label, value }) => (
                      <div className="legal-card__item" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          ) : null}

          {page.ctaBanner ? (
            <section className="cta-band" id="contacts">
              <div className="cta-band__inner">
                <div className="cta-band__lead">
                  <img alt="" aria-hidden="true" className="cta-band__icon" src={page.ctaBanner.icon} />
                  <div>
                    <h2>{page.ctaBanner.title}</h2>
                    <p>{page.ctaBanner.text}</p>

                    <div className="cta-band__meta">
                      <span>
                        <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/pin.webp")} />
                        {page.ctaBanner.pickup}
                      </span>
                      <span>
                        <img alt="" aria-hidden="true" src={withBase("/assets/generated/bottom-icon-truck.webp")} />
                        {page.ctaBanner.delivery}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="cta-band__button"
                  onClick={() => openRequestModal()}
                  type="button"
                >
                  <span>{page.ctaBanner.buttonLabel}</span>
                  <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                </button>
              </div>
            </section>
          ) : null}

          {page.legalDetails?.display === "footer" ? (
            <footer className="site-footer site-footer--legal" id="contacts">
              <div className="site-footer__inner">
                <p className="site-footer__eyebrow">{page.legalDetails.title}</p>
                <p className="site-footer__company">{page.legalDetails.company}</p>

                <div className="site-footer__lines">
                  {page.legalDetails.items.map(({ label, value }) => (
                    <p className="site-footer__line" key={label}>
                      <span>{label}:</span>{" "}
                      {label === "Телефон" ? (
                        <a href={pagePhone.href}>{value}</a>
                      ) : label === "Email" ? (
                        <a href={`mailto:${value}`}>{value}</a>
                      ) : (
                        value
                      )}
                    </p>
                  ))}
                </div>

                <div className="site-footer__socials" aria-label="Социальные сети">
                  {footerSocialLinks.map(({ icon, label }) => (
                    <span className="site-footer__social-link" key={label} aria-label={label} title={label}>
                      {icon}
                    </span>
                  ))}
                </div>
              </div>
            </footer>
          ) : null}
      </>
    </main>
  );
}
