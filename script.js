const skillIcons = {
  Python: 'fa-brands fa-python',
  Bash: 'fa-solid fa-terminal',
  Automation: 'fa-solid fa-robot',
  Scripting: 'fa-solid fa-code',
  SIEM: 'fa-solid fa-eye',
  RMM: 'fa-solid fa-screwdriver-wrench',
  'IDS/IPS': 'fa-solid fa-shield-halved',
  'EDR/XDR': 'fa-solid fa-shield-halved',
  'Computer Vision': 'fa-solid fa-eye',
  'R&D': 'fa-solid fa-flask',
  'Artificial Intelligence': 'fa-solid fa-brain',
  LLMs: 'fa-solid fa-brain',
  'Deep Learning': 'fa-solid fa-layer-group',
  'Machine Learning': 'fa-solid fa-gears',
  'Network Security': 'fa-solid fa-network-wired',
  Cybersecurity: 'fa-solid fa-user-shield',
  'Data Analytics': 'fa-solid fa-chart-line',
  Blockchain: 'fa-brands fa-bitcoin',
  Crypto: 'fa-solid fa-coins'
};

const roleIcons = {
  'Cybersecurity Specialist': 'fa-solid fa-user-shield',
  'Senior Software Engineer': 'fa-solid fa-code',
  'Network and Security Researcher': 'fa-solid fa-flask',
  'Forensics Analyst': 'fa-solid fa-magnifying-glass',
  'Lab Assistant': 'fa-solid fa-vials'
};

const profileIcons = {
  GitHub: 'fa-brands fa-github',
  LinkedIn: 'fa-brands fa-linkedin',
  TryHackMe: 'fa-solid fa-user-secret'
};

function getSkillIcon(skill) {
  return skillIcons[skill] || 'fa-solid fa-circle';
}

function getRoleIcon(title) {
  for (const [key, icon] of Object.entries(roleIcons)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return 'fa-solid fa-briefcase';
}

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

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

    fetch('CV_info.json')
      .then(res => res.json())
      .then(data => populate(data));

    const contactToggle = document.getElementById('contact-toggle');
    const contactContent = document.getElementById('contact-content');
    if (contactToggle && contactContent) {
      contactToggle.addEventListener('click', () => {
        const isOpen = contactContent.classList.toggle('open');
        contactToggle.classList.toggle('open', isOpen);
        contactToggle.setAttribute('aria-expanded', isOpen);
        contactContent.style.maxHeight = isOpen ? contactContent.scrollHeight + 'px' : 0;
      });
    }

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
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  window.dispatchEvent(new Event('scroll'));
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const copyrightIcon = document.querySelector('.copyright-icon');
  if (copyrightIcon) {
    copyrightIcon.addEventListener('click', () => {
      copyrightIcon.classList.toggle('active');
    });
  }

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

  initMatrix('matrix-left');
  initMatrix('matrix-right');
  initCodeBackground();
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
    <p>
      <a href="tel:${data.contact.phone}" class="contact-link" aria-label="Phone">
        <i class="fa-solid fa-phone"></i>${data.contact.phone}
      </a>
      <button class="copy-btn" data-copy="${data.contact.phone}" aria-label="Copy phone"><i class="fa-solid fa-copy"></i></button>
    </p>
    <p>
      <a href="mailto:${data.contact.email}" class="contact-link" aria-label="Email">
        <i class="fa-solid fa-envelope"></i>${data.contact.email}
      </a>
      <button class="copy-btn" data-copy="${data.contact.email}" aria-label="Copy email"><i class="fa-solid fa-copy"></i></button>
    </p>
    <p>
      <i class="fa-solid fa-location-dot"></i>${data.contact.location}
    </p>
  `;
  data.contact.profiles.forEach(p => {
    const iconClass = profileIcons[p.site] || 'fa-solid fa-link';
    contact.innerHTML += `<p><a href="${p.url}" class="contact-link" target="_blank" rel="noopener" aria-label="${p.site}"><i class="${iconClass}"></i>${p.site}</a></p>`;
  });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-copy');
        const icon = btn.querySelector('i');
        const original = icon.className;
        navigator.clipboard.writeText(value).then(() => {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = original;
          }, 2000);
        });
      });
    });

    if (contact.classList.contains('open')) {
      contact.style.maxHeight = contact.scrollHeight + 'px';
    }

    const skills = document.getElementById('skills-list');
  data.skills.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="${getSkillIcon(s)}"></i> ${s}`;
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

    let html = `<h3><i class="fa-solid fa-graduation-cap"></i> ${item.degree}</h3>`;
    html += `<p>${item.institution} (${item.start_date} – ${item.end_date})</p>`;
    if (item.gpa) {
      html += `<p>GPA: ${item.gpa}</p>`;
    }
    div.innerHTML = html;

    if (item.notes && item.notes.length) {
      const ul = document.createElement('ul');
      item.notes.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
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

  const publications = document.getElementById('publications-list');
  data.publications.forEach(pub => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${pub.title}</strong>, <em>${pub.venue}</em> (${pub.date})`;
    publications.appendChild(li);
  });

  const certs = document.getElementById('certifications-list');
  data.certifications_training.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    certs.appendChild(li);
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
  div.innerHTML = `<h3><i class="${getRoleIcon(role.title)}"></i> ${role.title} — ${company}</h3><p class="period">${formatPeriod(role.start_date, role.end_date)}</p>`;
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
  const formattedEnd = end && end.toLowerCase() !== 'present' ? end : 'Present';
  return `${start} – ${formattedEnd}`;
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

function initMatrix(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const fontSize = 16;
  let columns = 0;
  let drops = [];

  function resize() {
    canvas.height = window.innerHeight;
    canvas.width = canvas.offsetWidth;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0);
  }

  function randomChar() {
    return String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0f0';

    for (let i = 0; i < drops.length; i++) {
      const text = randomChar();
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = '#0f0';
      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

function initCodeBackground() {
  const snippets = [
    'const x = 42;',
    'console.log("Hello, world!");',
    'for (let i = 0; i < 10; i++) { }',
    'if (value) {\n  doSomething();\n}',
    'let sum = (a, b) => a + b;'
  ];
  document.querySelectorAll('.section').forEach(section => {
    const bg = document.createElement('div');
    bg.className = 'code-bg';
    section.appendChild(bg);

    function cycle() {
      const snippet = snippets[Math.floor(Math.random() * snippets.length)];
      bg.textContent = '';
      bg.style.opacity = 0.2;
      bg.style.top = `${Math.random() * 80 + 10}%`;
      bg.style.left = `${Math.random() * 80 + 10}%`;
      typeWriter(snippet, bg, 0, () => {
        setTimeout(() => {
          bg.style.opacity = 0;
          setTimeout(cycle, 1000);
        }, 2000);
      });
    }

    cycle();
  });
}
