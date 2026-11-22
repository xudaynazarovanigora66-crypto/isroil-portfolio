const translations = {
  uz: {
    navHome:"Bosh sahifa", navAbout:"Men haqimda", navProjects:"Loyihalar", navContact:"Aloqa",
    talk:"Bog‘lanish", heroEyebrow:"Salom, men", heroLine1:"Web dasturchiman", heroLine2:"ISROIL.",
    heroCopy:"G‘oyalarni zamonaviy, tez va chiroyli raqamli mahsulotlarga aylantiraman.",
    heroSide:"Dizayn va kod orasidagi mukammal garmoniya.", viewWork:"Ishlarni ko‘rish",
    aboutTitle:"Toza kod. Kuchli taqdimot. Unutilmas tajriba.",
    aboutText:"Men responsiv, tezkor va interaktiv web-saytlar yarataman. Har bir detallga ishonchli, har bir harakat maqsadga ega bo‘lishi uchun e’tibor beraman.",
    aboutLink:"Men bilan ishlang", statYears:"Yillik tajriba", statProjects:"Yakunlangan loyiha", statPassion:"Ijodiy yondashuv",
    projectsTitle:"Tanlangan ishlar", projectsCopy:"Bu joyga o‘zingizning loyihalaringizni qo‘shing.",
    contactEyebrow:"Loyihangiz bormi?", contactTitle:"Keling, biror narsa ajoyib yarataylik.", rights:"Barcha huquqlar himoyalangan."
  },
  en: {
    navHome:"Home", navAbout:"About me", navProjects:"Projects", navContact:"Contact",
    talk:"Get in touch", heroEyebrow:"Hello, I'm", heroLine1:"Web Developer", heroLine2:"ISROIL.",
    heroCopy:"I turn ideas into modern, fast and beautiful digital products.",
    heroSide:"The perfect harmony between design and code.", viewWork:"View my work",
    aboutTitle:"Clean code. Strong presentation. Memorable experience.",
    aboutText:"I create responsive, fast and interactive websites. I pay attention so every detail and every movement has a purpose.",
    aboutLink:"Work with me", statYears:"Years of experience", statProjects:"Completed projects", statPassion:"Creative approach",
    projectsTitle:"Selected work", projectsCopy:"You can add your own projects here.",
    contactEyebrow:"Have a project?", contactTitle:"Let's create something amazing.", rights:"All rights reserved."
  },
  ru: {
    navHome:"Главная", navAbout:"Обо мне", navProjects:"Проекты", navContact:"Контакты",
    talk:"Связаться", heroEyebrow:"Привет, я", heroLine1:"Веб-разработчик", heroLine2:"ИСРОИЛ.",
    heroCopy:"Превращаю идеи в современные, быстрые и красивые цифровые продукты.",
    heroSide:"Идеальная гармония дизайна и кода.", viewWork:"Смотреть работы",
    aboutTitle:"Чистый код. Сильная подача. Незабываемый опыт.",
    aboutText:"Я создаю адаптивные, быстрые и интерактивные сайты. Каждая деталь и каждое движение имеют свой смысл.",
    aboutLink:"Начать проект", statYears:"Лет опыта", statProjects:"Завершенных проектов", statPassion:"Творческий подход",
    projectsTitle:"Избранные работы", projectsCopy:"Здесь вы можете добавить свои проекты.",
    contactEyebrow:"Есть проект?", contactTitle:"Давайте создадим что-то потрясающее.", rights:"Все права защищены."
  }
};

const languageSelect = document.querySelector("#language-select");
function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  localStorage.setItem("isroil-language", lang);
}
languageSelect.addEventListener("change", event => setLanguage(event.target.value));
const savedLanguage = localStorage.getItem("isroil-language");
if (savedLanguage && translations[savedLanguage]) {
  languageSelect.value = savedLanguage;
  setLanguage(savedLanguage);
}

const header = document.querySelector("#header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const portraits = [...document.querySelectorAll(".portrait")];
const smoothstep = (edge0, edge1, value) => {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};
function updateHero() {
  const y = window.scrollY;
  const heroHeight = document.querySelector(".hero").offsetHeight;
  const progress = Math.min(Math.max(y / heroHeight, 0), 1);

  header.classList.toggle("scrolled", y > 20);
  portraits.forEach((portrait, index) => {
    let opacity = 0;
    if (index === 0) opacity = 1 - smoothstep(.08, .36, progress);
    if (index === 1) opacity = smoothstep(.12, .34, progress) * (1 - smoothstep(.64, .86, progress));
    if (index === 2) opacity = smoothstep(.66, .92, progress);
    portrait.style.opacity = String(opacity);
  });

  const stage = document.querySelector(".portrait-stage");
  stage.style.transform = `scale(${1 + progress * .035})`;
  document.querySelector(".hero-content").style.transform = `translateY(${-progress * 70}px)`;
  document.querySelector(".hero-content").style.opacity = String(1 - progress * .72);

  const sections = ["home","about","projects","contact"];
  let active = "home";
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top < innerHeight * .45) active = id;
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
  });
}

window.addEventListener("scroll", updateHero, { passive:true });
window.addEventListener("resize", updateHero);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold:.12 });
document.querySelectorAll(".section-label,.about-grid,.stats article,.projects-heading,.project-card,.contact-inner").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    if (element.dataset.counted) return;
    element.dataset.counted = "true";
    const target = Number(element.dataset.target);
    const suffix = element.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(element);
  });
}, { threshold:.6 });

document.querySelectorAll(".stats strong").forEach((counter, index) => {
  const values = [[3,"+"],[25,"+"],[100,"%"]];
  counter.dataset.target = values[index][0];
  counter.dataset.suffix = values[index][1];
  counter.textContent = `1${values[index][1]}`;
  counterObserver.observe(counter);
});

document.querySelector("#year").textContent = new Date().getFullYear();
updateHero();
