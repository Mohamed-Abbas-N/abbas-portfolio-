    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", () => {
      if (mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== "0px") {
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.paddingBottom = "0";
      } else {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
        mobileMenu.style.paddingBottom = "1.5rem";
      }
    });

    // Scroll spy
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) current = section.getAttribute("id");
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
      });
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.paddingBottom = "0";
      });
    });

// Typing effect
const typingElement = document.getElementById("typing-text");
const words = [
  "Designing Websites.",
  "Designing Mobile Apps.",
  "Designing UI/UX.",
  "Designing Advertisements."
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 60; // typing speed in ms

function typeEffect() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentWord.length) {
    // Pause before deleting
    isDeleting = true;
    typingSpeed = 60;
    setTimeout(typeEffect, 1500); // wait before deleting
    return;
  } else if (isDeleting && charIndex === 0) {
    // Move to next word
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 60;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();

