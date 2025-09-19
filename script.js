document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id], .hero");
  const navLinks = document.querySelectorAll("#navbar ul li a");
  const destinationLink = document.querySelector("#navbar ul li a[href='#']");
  const header = document.getElementById("navbar");
  const submenu = document.querySelector(".submenu");
  const hotspotHeading = document.querySelector(".hotspots-left-top a");
  

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

  function getBrightness(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0,2),16);
  let g = parseInt(hex.substring(2,4),16);
  let b = parseInt(hex.substring(4,6),16);
  return (r*299 + g*587 + b*114)/1000; 
}

const bodyBg = getComputedStyle(document.body).backgroundColor;

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if(!result) return '#000000';
  return "#" + result.slice(0,3).map(x => ("0"+parseInt(x).toString(16)).slice(-2)).join('');
}

let bgHex = bodyBg.startsWith('rgb') ? rgbToHex(bodyBg) : bodyBg;
let brightness = getBrightness(bgHex);

const chatBtn = document.querySelector('.chat-button');
if(brightness < 128){
  chatBtn.style.backgroundColor = 'white';
  chatBtn.style.color = 'black';
} else {
  chatBtn.style.backgroundColor = '#3498db';
  chatBtn.style.color = 'white';
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
document.querySelectorAll('.hover-video').forEach(video => {
  video.addEventListener('mouseenter', () => {
    video.play();
  });
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});

document.querySelectorAll(".gallery-wrapper").forEach(wrapper => {
  const track = wrapper.querySelector(".gallery-track");
  const prevBtn = wrapper.querySelector(".prev");
  const nextBtn = wrapper.querySelector(".next");

  let scrollAmount = 0;
  const slideWidth = 320;

  nextBtn.addEventListener("click", () => {
    scrollAmount += slideWidth;
    track.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtn.addEventListener("click", () => {
    scrollAmount -= slideWidth;
    if (scrollAmount < 0) scrollAmount = 0;
    track.style.transform = `translateX(-${scrollAmount}px)`;
  });
});



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
