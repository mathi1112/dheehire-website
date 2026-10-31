
const menuButton=document.querySelector('.menu-btn');
const navLinks=document.querySelector('.links');
if(menuButton&&navLinks){menuButton.addEventListener('click',()=>navLinks.classList.toggle('open'));}
const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.links a').forEach(link=>{if(link.getAttribute('href')===current)link.classList.add('active');});
