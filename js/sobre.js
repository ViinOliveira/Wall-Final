import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { auth } from "./firebase-config";

// ======= MENU RESPONSIVO =======
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (toggle && nav) {
  toggle.addEventListener("click", function () {
    nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
  });
}

// ====== Inicializar página ao carregar ======
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticação
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuário logado: mostra Painel, esconde Login
      document.getElementById('loginMenu').style.display = 'none';
      document.getElementById('painelMenu').style.display = 'block';
    } else {
      // Usuário deslogado: mostra Login, esconde Painel
      document.getElementById('loginMenu').style.display = 'block';
      document.getElementById('painelMenu').style.display = 'none';
    }
  });
}); // <--- Fechamento correto aqui!
