document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    body.classList.add('dark');
  }
  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const theme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });

  fetch('CV_info.json')
    .then(res => res.json())
    .then(data => populate(data));

  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  const navLinks = document.querySelectorAll('.nav-links a');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('show');
  });
  navLinks.forEach(link =>
    link.addEventListener('click', () => navLinksContainer.classList.remove('show'))
  );

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(section => sectionObserver.observe(section));

  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    sections.forEach(sec => {
      sec.style.setProperty('--tiltX', `${x}deg`);
      sec.style.setProperty('--tiltY', `${-y}deg`);
    });
  });

  document.addEventListener('mouseleave', () => {
    sections.forEach(sec => {
      sec.style.setProperty('--tiltX', '0deg');
      sec.style.setProperty('--tiltY', '0deg');
    });
  });
});

function populate(data) {
  document.getElementById('name').textContent = data.name;
  const headlineEl = document.getElementById('headline');
  const summaryEl = document.getElementById('summary');
  typeWriter(data.headline, headlineEl, 0, () => {
    headlineEl.classList.remove('tagline');
    summaryEl.classList.add('tagline');
    typeWriter(data.summary, summaryEl, 0, () => summaryEl.classList.remove('tagline'));
  });

  const contact = document.getElementById('contact-content');
  contact.innerHTML = `
    <p>Phone: <a href="tel:${data.contact.phone}">${data.contact.phone}</a></p>
    <p>Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
    <p>Location: ${data.contact.location}</p>
  `;
  data.contact.profiles.forEach(p => {
    contact.innerHTML += `<p>${p.site}: <a href="${p.url}">${p.url}</a></p>`;
  });

  const skills = document.getElementById('skills-list');
  data.skills.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    skills.appendChild(li);
  });

  const languages = document.getElementById('languages-list');
  data.languages.forEach(lang => {
    const li = document.createElement('li');
    li.textContent = `${lang.language} (${lang.proficiency})`;
    languages.appendChild(li);
  });

  const edu = document.getElementById('education-content');
  data.education.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('entry');
    div.innerHTML = `<h3>${item.degree}</h3><p>${item.institution} (${item.start_date} – ${item.end_date})</p>`;
    edu.appendChild(div);
  });

  const exp = document.getElementById('experience-content');
  data.work_experience.forEach(job => {
    if (job.roles) {
      job.roles.forEach(role => exp.appendChild(buildJob(role, job.company)));
    } else {
      exp.appendChild(buildJob(job, job.company));
    }
  });

  const projects = document.getElementById('projects-content');
  Object.entries(data.projects).forEach(([cat, items]) => {
    const h3 = document.createElement('h3');
    h3.textContent = titleCase(cat.replace(/_/g, ' '));
    projects.appendChild(h3);
    const ul = document.createElement('ul');
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    });
    projects.appendChild(ul);
  });

  const achievements = document.getElementById('achievements-list');
  data.achievements.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    achievements.appendChild(li);
  });
}

function buildJob(role, company) {
  const div = document.createElement('div');
  div.classList.add('entry');
  div.innerHTML = `<h3>${role.title} — ${company}</h3><p class="period">${formatPeriod(role.start_date, role.end_date)}</p>`;
  const ul = document.createElement('ul');
  role.highlights.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    ul.appendChild(li);
  });
  div.appendChild(ul);
  return div;
}

function formatPeriod(start, end) {
  return `${start} – ${end}`;
}

function titleCase(str) {
  return str.replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1));
}

function typeWriter(text, el, i = 0, done) {
  if (i < text.length) {
    el.textContent += text.charAt(i);
    setTimeout(() => typeWriter(text, el, i + 1, done), 100);
  } else if (typeof done === 'function') {
    done();
  }
}
