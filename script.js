function getSlug() {
  const path = window.location.pathname.replace("/", "").toLowerCase();
  return path || "fausto";
}

function createVCard(person) {
  return `BEGIN:VCARD
VERSION:3.0
N:${person.name};;;;
FN:${person.name}
ORG:${person.company}
TITLE:${person.title}
TEL;TYPE=CELL:${person.phone}
EMAIL:${person.email}
URL:${person.website}
END:VCARD`;
}

function downloadVCard(person) {
  const vcard = createVCard(person);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = person.name.toLowerCase().replaceAll(" ", "-").replaceAll(",", "") + ".vcf";

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderCard(person) {
  document.title = `${person.name} | EOS Consulting Inc.`;

  document.getElementById("app").innerHTML = `
    <section class="card">
      <div class="logo">EOS</div>
      <h1 class="name">${person.name}</h1>
      <p class="title">${person.title}</p>
      <p class="company">${person.company}</p>
      <p class="services">${person.services}</p>

      <a class="btn primary" href="#" id="saveContact">Save Contact</a>
      <a class="btn" href="tel:${person.phone}">Call</a>
      <a class="btn" href="mailto:${person.email}">Email</a>
      <a class="btn" href="${person.website}" target="_blank">Website</a>

      <div class="footer">Building Tomorrow. Proudly Canadian.</div>
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
      <h1>EOS Contact Not Found</h1>
      <p>This digital business card does not exist.</p>
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
