import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { auth } from "./firebase-config";

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
});