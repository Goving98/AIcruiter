const navbar = document.getElementById('navbar');
let hideTimeout = null;

window.addEventListener('mousemove', (e) => {
  if (e.clientY < 50) {
    clearTimeout(hideTimeout);
    navbar.classList.add('visible');
  } else {
    hideTimeout = setTimeout(() => {
      navbar.classList.remove('visible');
    }, 1000);
  }
});

