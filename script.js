document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id], .hero");
  const navLinks = document.querySelectorAll("#navbar ul li a");
  const destinationLink = document.querySelector("#navbar ul li a[href='#destination']");
  const header = document.getElementById("navbar");
  const submenu = document.querySelector(".submenu");
  const hotspotHeading = document.querySelector(".hotspots-left-top h3");

  const spotGalleryMap = {
    "spot-1": "gallery-1",
    "gallery-1": "spot-1",
    "spot-2": "gallery-2",
    "gallery-2": "spot-2",
    "spot-3": "gallery-3",
    "gallery-3": "spot-3",
    "spot-4": "gallery-4",
    "gallery-4": "spot-4",
    "spot-5": "gallery-5",
    "gallery-5": "spot-5",
    "spot-6": "gallery-6",
    "gallery-6": "spot-6"
  };

  const destinationIds = ["spot-1","gallery-1","spot-2","gallery-2","spot-3","gallery-3","spot-4","gallery-4","spot-5","gallery-5","spot-6","gallery-6"];

  const hoverStyle = document.createElement("style");
  document.head.appendChild(hoverStyle);

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055)/1.055, 2.4);
    });
    return a[0]*0.2126 + a[1]*0.7152 + a[2]*0.0722;
  }

  function updateNavColors() {
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 80 && rect.bottom >= 80){
        const bg = window.getComputedStyle(sec).backgroundColor;
        const rgb = bg.match(/\d+/g).map(Number);
        const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);

        let textColor, submenuBg, hoverBg, hoverText;
        if(luminance > 0.5){
          textColor = "#000";
          submenuBg = "rgba(255, 255, 255, 0.6)";
          hoverBg = "black";
          hoverText = "white";
        } else {
          textColor = "#fff";
          submenuBg = "rgba(0, 0, 0, 0.6)";
          hoverBg = "white";
          hoverText = "black";
        }

        navLinks.forEach(link => link.style.color = textColor);

        if(submenu) submenu.style.backgroundColor = submenuBg;

        if(hotspotHeading){
          hotspotHeading.style.color = textColor;
          hotspotHeading.style.opacity = luminance > 0.5 ? "0.8" : "1";
        }

        hoverStyle.innerHTML = `
          header li a:hover,
          header li a.active,
          .submenu li a:hover,
          .submenu li a.active {
            background-color: ${hoverBg} !important;
            color: ${hoverText} !important;
          }
        `;
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("show");
        navLinks.forEach(link => link.classList.remove("active"));

        const id = entry.target.id;
        navLinks.forEach(link => {
          const targetId = link.getAttribute("href").substring(1);
          if(targetId === id || (spotGalleryMap[id] && targetId === spotGalleryMap[id])){
            link.classList.add("active");
          }
        });

        if(destinationIds.includes(id)){
          if(destinationLink) destinationLink.classList.add("active");
        }

        updateNavColors();
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));

  const updateHeaderBg = () => {
    const scrollY = window.pageYOffset;
    let current = "home";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if(scrollY >= sectionTop && scrollY < sectionTop + sectionHeight){
        current = section.id;
      }
    });

    let headerBg;
    if(current === "home") headerBg = "rgba(16, 17, 17, 0.2)";
    else if(current === "about") headerBg = "rgba(255, 255, 255, 0.2)";
    else if(current === "contact") headerBg = "rgba(0, 0, 0, 0.4)";
    else headerBg = "rgba(16, 17, 17, 0.3)";

    header.style.backgroundColor = headerBg;

    if(hotspotHeading) hotspotHeading.style.backgroundColor = headerBg;
  };

  window.addEventListener("scroll", () => {
    updateHeaderBg();
    updateNavColors();
  });

  updateHeaderBg();
  updateNavColors();

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if(targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
    });
  });
});