function getSlug() {
  const cleanPath = window.location.pathname.replace(/^\//, "").replace(/\/$/, "").toLowerCase();
  return cleanPath || "fausto";
}

function escapeText(value) {
  return String(value || "")
    .replaceAll("&", "\\&")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;")
    .replaceAll("\n", "\\n");
}

function createVCard(person) {
  const parts = person.name.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return `BEGIN:VCARD
VERSION:3.0
N:${escapeText(lastName)};${escapeText(firstName)};;;
FN:${escapeText(person.name)}
ORG:${escapeText(person.company)}
TITLE:${escapeText(person.title)}
TEL;TYPE=CELL:${person.phone}
EMAIL:${person.email}
URL:${person.website}
X-SOCIALPROFILE;TYPE=linkedin:${person.linkedin}
END:VCARD`;
}

function downloadVCard(person) {
  const vcard = createVCard(person);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = person.name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + ".vcf";

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderCard(person) {
  document.title = `${person.name} | EOS Construction & Consulting`;

  document.getElementById("app").innerHTML = `
    <section class="page">
      <article class="profile">
        <header class="logo-wrap">
          <img src="/assets/logo.jpg" alt="EOS Construction & Consulting" class="logo" />
        </header>

        <section class="hero">
          <div class="content">
            <h1 class="name">${person.name}</h1>
            <div class="short-line"></div>
            <h2 class="title">${person.title}</h2>
            <p class="company">${person.company}</p>
            <p class="bio">${person.bio}</p>
          </div>

          <div class="photo-panel">
            <img src="${person.photo}" alt="${person.name}" />
          </div>
        </section>

        <section class="contact-section">
          <div class="contact-row">
            <div class="icon">☎</div>
            <div>
              <p class="label">Phone</p>
              <p class="value">${person.displayPhone}</p>
            </div>
          </div>

          <div class="contact-row">
            <div class="icon">✉</div>
            <div>
              <p class="label">Email</p>
              <p class="value">${person.email}</p>
            </div>
          </div>

          <div class="contact-row">
            <div class="icon">◎</div>
            <div>
              <p class="label">Website</p>
              <p class="value">${person.website}</p>
            </div>
          </div>

          <div class="contact-row">
            <div class="icon">in</div>
            <div>
              <p class="label">LinkedIn</p>
              <p class="value">${person.linkedin.replace("https://www.", "")}</p>
            </div>
          </div>
        </section>

        <section class="actions">
          <a class="btn primary" href="tel:${person.phone}">Call</a>
          <a class="btn" href="mailto:${person.email}">Email</a>
          <a class="btn" href="#" id="saveContact">Save Contact</a>
          <a class="btn" href="${person.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="btn" href="${person.website}" target="_blank" rel="noopener">Website</a>
        </section>

        <footer class="footer">EOS Construction & Consulting</footer>
      </article>
    </section>
  `;

  document.getElementById("saveContact").addEventListener("click", function(event) {
    event.preventDefault();
    downloadVCard(person);
  });
}

function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <section class="not-found">
      <img src="/assets/logo.jpg" alt="EOS Construction & Consulting" class="logo" />
      <h1>Contact Not Found</h1>
      <p>This EOS digital business card does not exist.</p>
      <a href="/fausto">Go to Fausto's card</a>
    </section>
  `;
}

const slug = getSlug();
const person = contacts[slug];

if (person) {
  renderCard(person);
} else {
  renderNotFound();
}
