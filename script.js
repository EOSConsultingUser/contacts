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
      <div class="background-photo">
        <img src="${person.photo}" alt="${person.name}" />
      </div>
      <div class="overlay"></div>

      <section class="content">
        <img src="/assets/logo.jpg" alt="EOS Construction & Consulting" class="logo" />

        <h1 class="name">${person.name}</h1>
        <div class="short-line"></div>
        <h2 class="title">${person.title}</h2>

        <section class="contact-list">
          <div class="contact-row">
            <div class="icon">☎</div>
            <div class="value">${person.displayPhone}</div>
          </div>
          <div class="contact-row">
            <div class="icon">✉</div>
            <div class="value">${person.email}</div>
          </div>
          <div class="contact-row">
            <div class="icon">◎</div>
            <div class="value">${person.website}</div>
          </div>
          <div class="contact-row">
            <div class="icon">in</div>
            <div class="value">${person.linkedinDisplay}</div>
          </div>
        </section>

        <section class="actions">
          <a class="btn primary" href="#" id="saveContact">SAVE CONTACT</a>
          <a class="btn" href="tel:${person.phone}">CALL</a>
          <a class="btn" href="mailto:${person.email}">EMAIL</a>
          <a class="btn" href="${person.linkedin}" target="_blank" rel="noopener">LINKEDIN</a>
        </section>

        <footer class="footer">${person.company}</footer>
      </section>
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
