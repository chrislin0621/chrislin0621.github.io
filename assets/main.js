(() => {
  "use strict";

  const data = window.SITE_DATA;
  if (!data) {
    document.querySelector("#main-content").innerHTML = '<section class="configuration-error" role="alert" lang="zh-CN"><h1>主页内容暂未加载</h1><p>请确认仓库根目录中有 <code>site-data.js</code>，并检查最近修改是否遗漏了英文引号、逗号或括号。</p><p>修正后重新提交，等待 GitHub Pages 部署完成，再刷新页面即可。</p></section>';
    return;
  }
  const page = document.body.dataset.page;
  const isNewsArchive = page === "news";
  const isArchive = isNewsArchive || page === "publications";
  const draftMode = data.site.draftMode;
  const sectionDefinitions = [
    { key: "news", id: "news", title: "News" },
    { key: "experiences", id: "experiences", title: "Experiences" },
    { key: "publications", id: "publications", title: "Publications", qualifier: "selected" },
    { key: "education", id: "education", title: "Education" },
    { key: "awards", id: "awards", title: "Awards and Honors", qualifier: "selected" },
    { key: "services", id: "services", title: "Academic Services" },
  ];
  const enabledSections = sectionDefinitions.filter((section) =>
    data.sections[section.key] !== false && data[section.key]?.length > 0,
  );
  const icons = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    scholar: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/>',
    github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a5 5 0 0 0-1.3-3.5A4.5 4.5 0 0 0 18.6 2S17.3 1.7 15 3a12 12 0 0 0-6 0C6.7 1.7 5.4 2 5.4 2a4.5 4.5 0 0 0-.1 3.5A5 5 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h5"/>',
    location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    photo: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
    book: '<path d="M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
    diagram: '<rect x="1" y="8" width="6" height="8" rx="1"/><rect x="17" y="2" width="6" height="6" rx="1"/><rect x="17" y="16" width="6" height="6" rx="1"/><path d="M7 12h5m0 0V5h5m-5 7v7h5"/>',
  };

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character]);
  }

  function safeUrl(value, allowMail = true) {
    const url = String(value || "").trim();
    if (!url || /[\u0000-\u0020\\]/.test(url) || url.startsWith("//")) return "";
    if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^https?:/i.test(url) && !(allowMail && /^mailto:/i.test(url))) return "";
    return url;
  }

  function link(label, value, className = "", fallback = "text") {
    const url = safeUrl(value);
    if (!url) {
      return fallback === "disabled"
        ? `<span class="${className} unconfigured" aria-disabled="true" title="待填写链接">${label}<span class="sr-only">（待填写链接）</span></span>`
        : `<span class="${className}">${label}</span>`;
    }
    const external = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="${className}" href="${escapeHtml(url)}"${external}>${label}</a>`;
  }

  function richText(value = "") {
    const expression = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
    let result = "";
    let position = 0;
    for (const match of String(value).matchAll(expression)) {
      result += escapeHtml(String(value).slice(position, match.index));
      result += match[1]
        ? `<strong>${escapeHtml(match[1])}</strong>`
        : link(escapeHtml(match[2]), match[3]);
      position = match.index + match[0].length;
    }
    return result + escapeHtml(String(value).slice(position));
  }

  function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
  }

  function placeholderBadge(item) {
    return item.placeholder ? '<span class="placeholder-badge" lang="zh-CN">待填写</span>' : "";
  }

  function guide(text) {
    return draftMode ? `<p class="edit-guide" lang="zh-CN">${text}</p>` : "";
  }

  function heading(section, extra = "") {
    return `<div class="section-heading"><h2 id="${section.id}-heading">${section.title}${section.qualifier ? ` <span class="heading-qualifier">(${section.qualifier})</span>` : ""}</h2>${extra}</div>`;
  }

  function imageWithFallback(source, alt, className, fallback) {
    const url = safeUrl(source, false);
    const loading = className === "portrait" ? "eager" : "lazy";
    return `<div class="${className}">${url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="${loading}">` : ""}<div class="image-fallback"${url ? " hidden" : ""}>${fallback}</div></div>`;
  }

  function organizationLogo(item) {
    return imageWithFallback(item.logo, `${item.organization || item.institution} logo`, "organization-logo", escapeHtml(item.initials || "ORG"));
  }

  function renderHeader() {
    const homePrefix = isArchive ? "index.html" : "";
    const navigation = [{ id: "about", title: "About" }, ...enabledSections];
    document.querySelector("#site-header").innerHTML = `
      <div class="header-inner">
        <a class="wordmark" href="${homePrefix}#about">${icon("book")}<span>${escapeHtml(data.profile.name)}</span></a>
        <button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false" aria-label="Open navigation">${icon("menu")}</button>
        <nav class="navigation" id="navigation" aria-label="Main navigation">
          ${navigation.map((section) => `<a href="${homePrefix}#${section.id}" data-section="${section.id}"${isArchive && section.id === page ? ' aria-current="page"' : ""}>${section.title}${section.qualifier ? ` (${section.qualifier})` : ""}</a>`).join("")}
        </nav>
      </div>`;
  }

  function renderProfile() {
    const profile = data.profile;
    document.querySelector("#profile").innerHTML = `
      ${imageWithFallback(profile.photo, profile.photoAlt || profile.name, "portrait", `${icon("photo")}<span>YOUR PHOTO</span><small lang="zh-CN">在这里放一张你的照片</small>`)}
      <div class="profile-identity">
        <p class="profile-name">${escapeHtml(profile.name)}</p>
        ${profile.nameNative ? `<p class="profile-native" lang="zh-CN">${escapeHtml(profile.nameNative)}</p>` : ""}
        <p class="profile-role">${escapeHtml(profile.role)}</p>
        <p class="profile-affiliation">${link(escapeHtml(profile.affiliation), profile.affiliationUrl)}</p>
      </div>
      <div class="profile-details">
        ${profile.shortBio ? `<p class="profile-bio">${richText(profile.shortBio)}</p>` : ""}
        ${profile.location ? `<p class="profile-location">${icon("location")}${escapeHtml(profile.location)}</p>` : ""}
        <div class="profile-links">${profile.links.map((item) => link(`${icon(item.icon)}<span>${escapeHtml(item.label)}</span>${icon("arrow")}`, item.url, "profile-link", "disabled")).join("")}</div>
        ${draftMode ? '<div class="draft-label"><span></span> HOMEPAGE DRAFT</div>' : ""}
      </div>`;
  }

  function renderAbout() {
    return `<section class="content-section about-section" id="about" aria-labelledby="about-heading">
      <div class="section-heading"><h1 id="about-heading">About</h1></div>
      <div class="about-copy">${data.about.paragraphs.map((paragraph) => `<p>${richText(paragraph)}</p>`).join("")}</div>
      ${data.about.interests?.length ? `<div class="research-interests"><span class="interest-label">Research interests</span><div class="interest-tags">${data.about.interests.map((interest) => `<span>${escapeHtml(interest)}</span>`).join("")}</div></div>` : ""}
      ${data.about.notice ? `<div class="personal-notice">${richText(data.about.notice)}</div>` : ""}
      ${draftMode ? '<div class="draft-note" lang="zh-CN"><span class="note-mark">i</span><p>这是一份可逐步填写的主页草稿，所有条目均为占位示例。<br><span>从 <code>site-data.js</code> 开始，把这里变成你的学术主页。</span></p></div>' : ""}
    </section>`;
  }

  function sortedNews() {
    return [...data.news].sort((left, right) => right.date.localeCompare(left.date));
  }

  function newsList(items) {
    return `<ul class="news-list">${items.map((item) => `<li class="news-item">
      <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date.slice(0, 7).replace("-", "."))}</time>
      <div class="news-text">${placeholderBadge(item)}${richText(item.text)}</div>
    </li>`).join("")}</ul>`;
  }

  function renderNews(section) {
    return `${heading(section, `<a class="text-link all-news" href="news.html">All news ${icon("arrow")}</a>`)}${newsList(sortedNews().slice(0, 4))}`;
  }

  function renderPublications(section) {
    const papers = (data.publications || []).filter((paper) => paper.selected !== false);
    return `${heading(section, `<a class="text-link full-publications" href="publications.html">Full publication list ${icon("arrow")}</a>`)}${guide('在 <code>site-data.js → publications</code> 中填写；设为 <code>selected: false</code> 的论文仅在完整列表显示。')}
      ${papers.length ? publicationList(papers) : '<p class="empty-state">No selected publications yet. View the full publication list for all papers.</p>'}`;
  }

  function publicationImage(paper) {
    const image = imageWithFallback(paper.image, paper.imageAlt || paper.title, "paper-image", `${icon("diagram")}<span>RESEARCH OVERVIEW</span><small lang="zh-CN">论文配图 · 待添加</small>`);
    const url = safeUrl(paper.imageLink || paper.links?.find((item) => safeUrl(item.url))?.url);
    if (!url) return image;
    const external = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="paper-image-link" href="${escapeHtml(url)}" aria-label="View ${escapeHtml(paper.title)}"${external}>${image}</a>`;
  }

  function publicationAuthors(authors) {
    const name = escapeHtml(data.profile.name);
    return richText(authors).replaceAll(`<strong>${name}</strong>`, () => `<strong class="author-self">${name}</strong>`);
  }

  function publicationStars(paper) {
    if (paper.githubStars === false) return "";
    const code = (paper.links || []).find((item) => /^code$/i.test(String(item.label || "").trim()));
    const codeUrl = safeUrl(code?.url, false);
    const repository = /^https?:\/\/(?:www\.)?github\.com\/([a-z\d-]+)\/([a-z\d._-]+)(?=[/?#]|$)/i.exec(codeUrl);
    if (!repository) return "";
    const owner = repository[1];
    const name = repository[2].replace(/\.git$/i, "");
    if (!name || name === "." || name === "..") return "";
    const badgeUrl = `https://img.shields.io/github/stars/${owner}/${name}?style=social&label=Code+Stars`;
    const badge = imageWithFallback(badgeUrl, `GitHub Code Stars for ${owner}/${name}`, "paper-stars-badge", `${icon("github")}<span>Code Stars</span>`);
    return link(badge, codeUrl, "paper-stars");
  }

  function publicationList(papers) {
    return `<div class="paper-list">${papers.map((paper) => `<article class="paper">
        <div class="paper-visual">
          ${publicationImage(paper)}
          ${paper.badge ? `<span class="paper-badge">${escapeHtml(paper.badge)}</span>` : ""}
        </div>
        <div class="paper-details">
          <h3>${link(escapeHtml(paper.title), paper.links?.find((item) => safeUrl(item.url))?.url)}</h3>
          <p class="paper-authors">${publicationAuthors(paper.authors)}</p>
          <p class="paper-venue">${escapeHtml(paper.venue)}${paper.note ? `<span class="paper-note">${escapeHtml(paper.note)}</span>` : ""}</p>
          ${paper.description ? `<p class="paper-description">${richText(paper.description)}</p>` : ""}
          <div class="paper-links">${(paper.links || []).map((item) => link(`${escapeHtml(item.label)} ${icon("arrow")}`, item.url, "paper-link", "disabled")).join("")}${publicationStars(paper)}${placeholderBadge(paper)}</div>
        </div>
      </article>`).join("")}</div>`;
  }

  function renderEducation(section) {
    return `${heading(section)}<div class="education-list">${data.education.map((item) => `<article class="education-item">
      ${organizationLogo(item)}
      <div class="education-details"><h3>${link(escapeHtml(item.institution), item.url)}</h3><p>${escapeHtml(item.degree)}</p>${item.description ? `<p class="education-description">${richText(item.description)}</p>` : ""}</div>
      <div class="education-meta"><span>${escapeHtml(item.period)}</span>${placeholderBadge(item)}</div>
    </article>`).join("")}</div>`;
  }

  function renderExperiences(section) {
    return `${heading(section)}${guide('按时间从近到远填写 <code>experiences</code>，可添加机构 Logo、职位、研究方向与导师。')}
      <div class="timeline">${data.experiences.map((item) => `<article class="timeline-item">
        <div class="timeline-meta">${organizationLogo(item)}<span>${escapeHtml(item.period)}</span></div>
        <h3>${escapeHtml(item.role)} <span class="at-sign">@</span> ${link(escapeHtml(item.organization), item.url, "organization-name")}</h3>
        ${item.description ? `<p class="timeline-description">${richText(item.description)}</p>` : ""}
        ${item.mentors ? `<p class="timeline-mentors">Mentor(s): ${richText(item.mentors)}</p>` : ""}
        ${placeholderBadge(item)}
      </article>`).join("")}</div>`;
  }

  function renderAwards(section) {
    return `${heading(section)}<ul class="awards-list">${data.awards.map((item) => `<li>${item.year ? `${escapeHtml(item.year)}: ` : ""}${richText(item.title)}${placeholderBadge(item)}</li>`).join("")}</ul>`;
  }

  function renderServices(section) {
    return `${heading(section)}<ul class="service-list">${data.services.map((item) => `<li>${escapeHtml(item.title)} ${richText(item.description)}${placeholderBadge(item)}</li>`).join("")}</ul>`;
  }

  function renderHome() {
    const renderers = { news: renderNews, education: renderEducation, experiences: renderExperiences, awards: renderAwards, services: renderServices };
    return renderAbout() + enabledSections.map((section) => `<section class="content-section" id="${section.id}" aria-labelledby="${section.id}-heading">${(renderers[section.key] || renderPublications)(section)}</section>`).join("");
  }

  function renderArchive() {
    const items = sortedNews();
    const years = [...new Set(items.map((item) => item.date.slice(0, 4)))];
    return `<section class="archive-intro"><a class="text-link back-link" href="index.html#news">${icon("back")} Back to homepage</a>
      <p class="eyebrow">Notes along the way</p><h1>All news<span class="heading-period">.</span></h1>
      <p class="archive-summary">${items.length} update${items.length === 1 ? "" : "s"}<span>·</span>Newest first</p>
      ${guide('这里保留所有历史动态，按年份自动归档。带“待填写”标记的内容和日期均为示例。')}</section>
      ${years.map((year) => `<section class="archive-year" aria-labelledby="year-${escapeHtml(year)}"><div class="section-heading"><h2 id="year-${escapeHtml(year)}">${escapeHtml(year)}</h2><span class="year-count">${items.filter((item) => item.date.startsWith(year)).length} updates</span></div>${newsList(items.filter((item) => item.date.startsWith(year)))}</section>`).join("")}
      ${!items.length ? '<p class="empty-state">No updates yet. Check back soon.</p>' : ""}`;
  }

  function renderPublicationArchive() {
    const papers = data.publications || [];
    return `<section class="archive-intro" aria-labelledby="publication-list-heading">
      <a class="text-link back-link" href="index.html#publications">${icon("back")} Back to homepage</a>
      <p class="eyebrow">Research &amp; publications</p>
      <h1 id="publication-list-heading">Full publication list<span class="heading-period">.</span></h1>
      <p class="archive-summary">${papers.length} publication${papers.length === 1 ? "" : "s"}</p>
      ${guide('这里展示 <code>publications</code> 中的全部论文，包含未入选主页的条目；按数据中的顺序排列。')}
    </section>${papers.length ? publicationList(papers) : '<p class="empty-state">No publications yet. Check back soon.</p>'}`;
  }

  function renderFooter() {
    document.querySelector("#site-footer").innerHTML = `<div class="footer-inner"><span>© ${new Date().getFullYear()} ${escapeHtml(data.profile.name)}<span class="footer-divider">/</span>Academic homepage</span><span>${data.site.lastUpdated ? `Last updated ${escapeHtml(data.site.lastUpdated.replaceAll("-", "."))}` : ""}</span><a href="${isArchive ? "index.html#about" : "#about"}" class="text-link">${isArchive ? "Homepage" : "Back to top"} ↑</a></div>`;
  }

  function setupNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#navigation");
    function setMenu(open) {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      navigation.classList.toggle("is-open", open);
    }
    menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".header-inner")) setMenu(false);
    });
    const mobileViewport = window.matchMedia("(max-width: 1100px)");
    mobileViewport.addEventListener("change", () => setMenu(false));
    if (isArchive) return;

    const sections = [...document.querySelectorAll(".content-section")];
    const navigationLinks = [...navigation.querySelectorAll("a")];
    function updateCurrentSection() {
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 150) current = section;
      }
      const canScroll = document.documentElement.scrollHeight > window.innerHeight + 2;
      if (canScroll && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
      navigationLinks.forEach((item) => {
        if (item.dataset.section === current.id) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
    }
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => { updateCurrentSection(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", updateCurrentSection);
    updateCurrentSection();
  }

  function setupImageFallbacks() {
    document.querySelectorAll("img").forEach((image) => {
      const showFallback = () => { image.hidden = true; image.nextElementSibling.hidden = false; };
      image.addEventListener("error", showFallback);
      if (image.complete && image.naturalWidth === 0) showFallback();
    });
  }

  document.documentElement.lang = data.site.language || "en";
  document.title = data.site.title;
  document.querySelector('meta[name="description"]').content = data.site.description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = data.site.description;
  renderHeader();
  renderProfile();
  const pageRenderers = { home: renderHome, news: renderArchive, publications: renderPublicationArchive };
  document.querySelector("#main-content").innerHTML = (pageRenderers[page] || renderHome)();
  renderFooter();
  setupNavigation();
  setupImageFallbacks();
  function scrollToInitialSection() {
    const section = document.getElementById(window.location.hash.slice(1));
    if (section) section.scrollIntoView({ behavior: "instant" });
  }

  window.addEventListener("pageshow", scrollToInitialSection, { once: true });
  if (document.readyState === "complete") scrollToInitialSection();
})();
