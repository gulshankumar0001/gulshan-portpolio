/**
 * Gulshan Kumar - Portfolio Interactive Scripts
 * - Neural Network particle canvas
 * - Navigation & Smooth scroll
 * - Skills & Achievements filtering
 * - Interactive Project Details Modal
 * - Copy email to clipboard & toast notifications
 * - Contact form handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1. Navigation Scroll Effect
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('glass-nav', 'py-1', 'shadow-2xl');
      navbar.classList.remove('py-2');
    } else {
      navbar.classList.remove('glass-nav', 'py-1', 'shadow-2xl');
      navbar.classList.add('py-2');
    }
  };
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  // 4. Toast Notification Utility
  const showToast = (message) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  };

  // 5. Copy Email Action Buttons
  const copyEmail = (email) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  };

  const fallbackCopy = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Email copied: ${text}`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(tempInput);
  };

  const heroCopyBtn = document.getElementById('copy-email-hero-btn');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      const email = heroCopyBtn.getAttribute('data-email');
      copyEmail(email);
    });
  }

  const contactCopyBtn = document.getElementById('copy-email-contact-btn');
  if (contactCopyBtn) {
    contactCopyBtn.addEventListener('click', () => {
      const email = contactCopyBtn.getAttribute('data-email');
      copyEmail(email);
    });
  }

  // 6. Interactive Neural Particle Canvas in Hero
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(canvas.width / 18), 50);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();
  }

  // 7. Skill Filter Buttons
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach((b) => {
        b.classList.remove('bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20', 'active');
        b.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      });

      btn.classList.add('bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20', 'active');
      btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');

      const category = btn.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 8. Achievements Filter Tabs
  const achieveTabBtns = document.querySelectorAll('.achieve-tab-btn');
  const achieveItems = document.querySelectorAll('.achieve-item');

  achieveTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      achieveTabBtns.forEach((b) => {
        b.classList.remove('bg-brand-600', 'text-white', 'shadow-md', 'active');
        b.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      });

      btn.classList.add('bg-brand-600', 'text-white', 'shadow-md', 'active');
      btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');

      const tab = btn.getAttribute('data-tab');

      achieveItems.forEach((item) => {
        const itemType = item.getAttribute('data-type');
        if (tab === 'all' || itemType === tab) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 9. Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Construct mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const encodedBody = encodeURIComponent(
        `Hi Gulshan,\n\n${message}\n\nFrom:\nName: ${name}\nEmail: ${email}`
      );
      const mailtoUrl = `mailto:gulshan.26been0015@jecru.edu.in?subject=${encodedSubject}&body=${encodedBody}`;

      showToast('Opening your email client to send message...');
      window.open(mailtoUrl, '_blank');
      contactForm.reset();
    });
  }

  // 10. Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// 11. Project Details Modal Data & Handlers
const projectDetails = {
  portfolio: {
    title: 'Personal Portfolio Website',
    category: 'Modern Web Development',
    status: 'Active & Deployed',
    description:
      'A comprehensive, modern personal portfolio website built with high aesthetic standards, interactive particle animations, dark glassmorphism, responsive navigation, and accessibility best practices.',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript (ES6+)', 'Lucide Icons', 'Vercel Deployment'],
    features: [
      'Responsive design engineered for all screen sizes from mobile to wide desktop',
      'Hero section with dynamic connected-nodes neural network canvas',
      'Interactive skill tags with category filtering (Frontend, AI, Productivity)',
      '1-click instant email copy tool with animated toast feedback',
      'Direct contact form integration with automated mail client trigger',
      'Zero-configuration setup ready for 1-click Vercel deployment'
    ],
    githubUrl: 'https://github.com/gulshankumar0001',
    liveUrl: '#home'
  },
  'ai-project': {
    title: 'AI Website Project',
    category: 'Artificial Intelligence & Web App',
    status: 'Under Active Development',
    description:
      'An intelligent web application designed to integrate Generative AI capabilities into a sleek, student-friendly interface. It streamlines generative tasks, prompt management, and automated content analysis.',
    technologies: ['Python', 'Generative AI APIs', 'JavaScript', 'REST APIs', 'Tailwind CSS'],
    features: [
      'Prompt optimization assistant designed for study research and coding',
      'Automated text summaries and key concept extraction for coursework',
      'Clean streaming chat interface with markdown parsing and code syntax highlighting',
      'Integrated security measures for safe API key management and rate-limiting'
    ],
    githubUrl: 'https://github.com/gulshankumar0001',
    liveUrl: 'https://github.com/gulshankumar0001'
  },
  productivity: {
    title: 'Student Productivity Project',
    category: 'Productivity & Digital Systems',
    status: 'In Development',
    description:
      'A focused productivity dashboard customized for engineering students to organize semester tasks, track project milestones, manage revision intervals, and maintain daily study momentum.',
    technologies: ['JavaScript ES6+', 'Local Storage API', 'Tailwind CSS', 'Productivity UI'],
    features: [
      'Kanban task tracker with intuitive status stages (To-Do, In Progress, Complete)',
      'Coursework and assignment deadline countdown manager',
      'Daily habit and study session streak monitor',
      'Data persistence via Local Storage with instant zero-lag loading'
    ],
    githubUrl: 'https://github.com/gulshankumar0001',
    liveUrl: 'https://github.com/gulshankumar0001'
  }
};

window.openProjectModal = (projectId) => {
  const project = projectDetails[projectId];
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');

  const techBadges = project.technologies
    .map(
      (tech) =>
        `<span class="px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono">${tech}</span>`
    )
    .join('');

  const featureItems = project.features
    .map(
      (feat) =>
        `<li class="flex items-start gap-2.5 text-xs text-slate-300">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
          <span>${feat}</span>
        </li>`
    )
    .join('');

  modalContent.innerHTML = `
    <div>
      <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-brand-500/20 text-brand-300 mb-3 border border-brand-500/30">
        ${project.category}
      </div>
      <h3 class="text-2xl font-bold text-white tracking-tight">${project.title}</h3>
      <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span> ${project.status}
      </p>
    </div>

    <p class="text-slate-300 text-sm leading-relaxed">${project.description}</p>

    <div class="space-y-2">
      <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Technologies Stack</h4>
      <div class="flex flex-wrap gap-2">${techBadges}</div>
    </div>

    <div class="space-y-2.5 pt-2">
      <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Key Highlights & Capabilities</h4>
      <ul class="space-y-2">${featureItems}</ul>
    </div>

    <div class="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 transition border border-slate-700">
        <i data-lucide="github" class="w-4 h-4"></i>
        <span>View Source on GitHub</span>
      </a>
      <button onclick="closeProjectModal()" class="py-2.5 px-5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition">
        Close Preview
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.querySelector('.transform').classList.remove('scale-95');
    modal.querySelector('.transform').classList.add('scale-100');
  }, 10);

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

window.closeProjectModal = () => {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.add('opacity-0');
  modal.querySelector('.transform').classList.remove('scale-100');
  modal.querySelector('.transform').classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 250);
};

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (modal && !modal.classList.contains('hidden') && e.target === modal) {
    window.closeProjectModal();
  }
});
