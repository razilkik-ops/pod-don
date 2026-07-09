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

const emptyRequestForm = {
  name: "",
  phone: "",
  comment: "",
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
        title: "120x80",
        detailTitle: "120x80",
        summary: "Новый поддон\nдля склада и логистики",
        detailLead:
          "Новый поддон размера 120×80 см.\nПодходит для складских, транспортных\nи производственных задач.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x80-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x80-22mm-5boards.webp")],
        price: "32 BYN",
        priceNote: "Точная стоимость уточняется по телефону",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        title: "114x114",
        detailTitle: "114x114",
        summary: "Новый поддон\nдля хранения и отгрузки",
        detailLead:
          "Новый поддон размера 114×114 см.\nУдобен для хранения, комплектации\nи отгрузки продукции.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-114x114-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-114x114-22mm-5boards.webp")],
        price: "36 BYN",
        priceNote: "Точная стоимость зависит от объёма партии",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        title: "120x100",
        detailTitle: "120x100",
        summary: "Новый поддон\nдля складской логистики",
        detailLead:
          "Новый поддон размера 120×100 см.\nПодходит для склада, логистики\nи комплектации грузов.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x100-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x100-22mm-5boards.webp")],
        price: "27 BYN",
        priceNote: "Точная стоимость зависит от объёма партии",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        title: "120x120",
        detailTitle: "120x120",
        summary: "Новый поддон\nдля крупного формата груза",
        detailLead:
          "Новый поддон размера 120×120 см.\nПодходит для крупного формата груза,\nсклада и отгрузки.",
        image: versionAsset("/assets/generated/variants/new-cleaned/new-120x120-22mm-5boards.webp"),
        gallery: [versionAsset("/assets/generated/variants/new-cleaned/new-120x120-22mm-5boards.webp")],
        price: "41 BYN",
        priceNote: "Точная стоимость зависит от объёма партии",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
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
      ],
    },
  },
  used: {
    pageClassName: "page--used",
    heroClassName: "hero-banner--used",
    showCatalogSpecs: false,
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
        title: "120x800",
        detailTitle: "120x800",
        summary: "5 или 6 досок\nверхнего настила",
        detailLead:
          "Б/у поддон размера 120x800 мм.\nВарианты исполнения: верхний настил 5 или 6 досок,\nтолщина доски 19, 20 или 22 мм.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x800-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x800-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x800-6boards.webp"),
        ],
        cardPrice: "24 BYN",
        price: "24 BYN",
        priceNote: "Точная стоимость зависит от состояния и объёма партии",
        availability: "Готовы к отгрузке",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        title: "120x100",
        detailTitle: "120x100",
        summary: "5, 6 досок или\nсплошной настил",
        detailLead:
          "Б/у поддон размера 120x1000 мм.\nВарианты исполнения: верхний настил 5 досок,\n6 досок или сплошной настил без промежутков.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x100-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x100-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x100-6boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x100-soliddeck.webp"),
        ],
        cardPrice: "28 BYN",
        price: "28 BYN",
        priceNote: "Цена зависит от состояния партии и объёма заказа",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
        title: "120x120",
        detailTitle: "120x120",
        summary: "5, 6 досок или\nсплошной настил",
        detailLead:
          "Б/у поддон размера 120x1200 мм.\nВарианты исполнения: верхний настил 5 досок,\n6 досок или сплошной настил без промежутков.",
        image: versionUsedAsset("/assets/generated/used-variants/used-120x120-5boards.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-120x120-5boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x120-6boards.webp"),
          versionUsedAsset("/assets/generated/used-variants/used-120x120-soliddeck.webp"),
        ],
        cardPrice: "30 BYN",
        price: "30 BYN",
        priceNote: "Финальная цена зависит от варианта настила и объёма партии",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        thicknessOptions: ["19 мм", "20 мм", "22 мм"],
        defaultThickness: "22 мм",
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
          "Б/у европоддоны с клеймом размером 120x80.\nЕсть 1 сорт и 2 сорт: светлый и тёмный.\nМаркировка EUR, EPAL, UIC.",
        image: versionUsedAsset("/assets/generated/used-variants/used-euro-stack.webp"),
        gallery: [
          versionUsedAsset("/assets/generated/used-variants/used-euro-stack.webp"),
        ],
        cardPrice: "32 BYN",
        price: "32 BYN",
        priceNote: "Стоимость зависит от сорта и состояния партии",
        availability: "В наличии",
        pickup: "Самовывоз: г. Минск,\nул. Промышленная, 14",
        delivery: "Доставка\nпо всей Беларуси",
        specs: [
          { icon: specIcons.size, label: "Размер: 120x80" },
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
      ],
    },
  },
};

const resolvedHomeHighlights = prefixPaths(homeHighlights);
const resolvedPageConfigs = prefixPaths(pageConfigs);

function CatalogCard({ item, onOpen, related = false, showSpecs = true }) {
  return (
    <article
      className={`catalog-card${related ? " catalog-card--related" : ""}${item.id === "custom-size-order" ? " catalog-card--custom" : ""}`}
    >
      <div className="catalog-card__image-wrap">
        <img alt={item.title} className="catalog-card__image" decoding="async" loading="lazy" src={item.image} />
      </div>

      <div className="catalog-card__body">
        <h3>{item.title}</h3>
        {item.summary ? <p>{item.summary}</p> : null}

        {showSpecs ? (
          <ul className="catalog-card__specs">
            {item.specs.map(({ icon, label }) => (
              <li key={label}>
                <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={icon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.cardPrice ? (
          <div className="catalog-card__price-line">
            <span>Цена от</span>
            <strong>{item.cardPrice}</strong>
          </div>
        ) : null}

        <button className="catalog-card__button" onClick={() => onOpen(item.id)} type="button">
          <span>Подробнее</span>
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

export function App({ pageKey = "home" }) {
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
  const pagePhone = phoneContactsByPage[pageKey] ?? phoneContactsByPage.new;
  const requestSectionLabel = pageKey === "used" ? "Б/у" : pageKey === "new" ? "Новые" : "";
  const selectedProduct = page.catalogItems.find((item) => item.id === selectedProductId) ?? null;
  const activeThickness =
    selectedThickness || selectedProduct?.defaultThickness || selectedProduct?.thicknessOptions?.[0] || "";
  const activeDeck = selectedDeck || selectedProduct?.defaultDeck || selectedProduct?.deckOptions?.[0] || "";
  const activeVariantImage = getVariantImageForProduct(selectedProduct, activeDeck);
  const selectedGallery = activeVariantImage ? [activeVariantImage] : selectedProduct?.gallery ?? [];
  const activeGalleryImage = selectedGallery[activeGalleryIndex] ?? selectedGallery[0] ?? "";

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

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    setRequestStatus("success");
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
    requestContext.source ? { label: "Раздел", value: requestContext.source } : null,
    requestContext.product ? { label: "Товар", value: requestContext.product } : null,
    requestContext.thickness ? { label: "Толщина", value: requestContext.thickness } : null,
    requestContext.deck ? { label: "Настил", value: requestContext.deck } : null,
  ].filter(Boolean);

  return (
    <main className={`page ${page.pageClassName}`}>
      <section className={`hero-banner ${page.heroClassName}`}>
        <div className="hero-banner__overlay" aria-hidden="true" />

        <div className="hero-banner__inner">
          <div className="hero-banner__content">
            <h1>{page.hero.title}</h1>
            <span className="hero-banner__accent" aria-hidden="true" />

            <p className="hero-banner__lead">{page.hero.lead}</p>

            <div className="hero-banner__actions">
              <button
                className="hero-button hero-button--primary"
                onClick={() => openRequestModal()}
                type="button"
              >
                <span>{page.hero.primaryAction}</span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
              </button>

              <a className="hero-button hero-button--ghost" href={pagePhone.href}>
                <span>{page.hero.secondaryAction}</span>
                <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
              </a>
            </div>

            <div className="hero-features" aria-label={`Преимущества страницы ${page.hero.title}`}>
              {page.hero.features.map(({ icon, text, title }) => (
                <article className="hero-feature" key={title}>
                  <img alt="" aria-hidden="true" className="hero-feature__icon" src={icon} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
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
            <h2>{page.catalogTitle}</h2>
            <span aria-hidden="true" className="catalog-section__accent" />
          </div>

          <div className="catalog-grid">
            {page.catalogItems.map((item) => (
              <CatalogCard
                item={item}
                key={item.id}
                onOpen={openProductDetail}
                showSpecs={page.showCatalogSpecs !== false}
              />
            ))}
          </div>
        </div>
      </section>

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
                    alt={selectedProduct.title}
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
                  <h2 id="product-detail-title">{selectedProduct.detailTitle}</h2>

                  <div className="product-detail-card__availability">
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/status-check.webp")} />
                    <span>{selectedProduct.availability}</span>
                  </div>
                </div>

                <p className="product-detail-card__lead">{selectedProduct.detailLead}</p>

                {selectedProduct.thicknessOptions?.length ? (
                  <div className="product-detail-card__option-group">
                    <span className="product-detail-card__option-label">Толщина доски</span>

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
                    <span className="product-detail-card__option-label">Верхний настил</span>

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
                      <span>{`Толщина доски: ${activeThickness}`}</span>
                    </li>
                  ) : null}

                  {activeDeck ? (
                    <li>
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={specIcons.deck} />
                      <span>{`Верхний настил: ${activeDeck}`}</span>
                    </li>
                  ) : null}

                  {selectedProduct.detailSpecs.map(({ icon, label }) => (
                    <li key={label}>
                      <img alt="" aria-hidden="true" decoding="async" loading="lazy" src={icon} />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>

                <div className="product-detail-card__price">
                  <span>Цена от</span>
                  <strong>{selectedProduct.price}</strong>
                  <em>/ шт</em>
                </div>

                <p className="product-detail-card__price-note">{selectedProduct.priceNote}</p>

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
                    <span>Оформить заявку</span>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                  </button>

                  <a className="product-detail-card__action product-detail-card__action--ghost" href={pagePhone.href}>
                    <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
                    <span>Позвонить</span>
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

              <h2 id="request-modal-title">Оформить заявку</h2>
              <p className="request-modal__lead">
                Оставьте имя и телефон. Мы свяжемся с вами, уточним детали и подготовим предложение.
              </p>

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
                  <strong>Заявка готова.</strong>
                  <p>Контакты заполнены. Следующим шагом можно подключить реальную отправку в Telegram, почту или CRM.</p>

                  <div className="request-modal__footer">
                    <button className="request-modal__submit" onClick={closeRequestModal} type="button">
                      <span>Закрыть окно</span>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                    </button>
                  </div>
                </div>
              ) : (
                <form className="request-modal__form" onSubmit={handleRequestSubmit}>
                  <label className="request-modal__field">
                    <span>Ваше имя</span>
                    <input
                      autoComplete="name"
                      className="request-modal__input"
                      name="name"
                      onChange={handleRequestFieldChange}
                      placeholder="Как к вам обращаться"
                      required
                      type="text"
                      value={requestForm.name}
                    />
                  </label>

                  <label className="request-modal__field">
                    <span>Телефон</span>
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
                    <span>Комментарий</span>
                    <textarea
                      className="request-modal__textarea"
                      name="comment"
                      onChange={handleRequestFieldChange}
                      placeholder="Напишите размер, объём партии, срок поставки или другие детали"
                      rows="5"
                      value={requestForm.comment}
                    />
                  </label>

                  <div className="request-modal__footer">
                    <button className="request-modal__submit" type="submit">
                      <span>Отправить заявку</span>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/icon-arrow-right.webp")} />
                    </button>

                    <a className="request-modal__ghost" href={pagePhone.href}>
                      <img alt="" aria-hidden="true" src={withBase("/assets/generated/detail/phone.webp")} />
                      <span>Позвонить</span>
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
                      <span>{label}:</span> {value}
                    </p>
                  ))}
                </div>
              </div>
            </footer>
          ) : null}
      </>
    </main>
  );
}
