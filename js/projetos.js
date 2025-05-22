// ====== Firebase Imports ======
import { auth, db, storage } from './firebase-config.js';
import {
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

let projetosPorCategoria = {};
let todosProjetosLista = [];
let categoriaAtiva = 'all';
let searchTerm = '';


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


  // Botão de logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).then(() => {
        window.location.href = "login.html";
      });
    });
  }

  // Setup de filtros e busca
  setupFiltersAndSearch();

  // Iniciar carregamento de projetos
  listarProjetos();
});

// ====== Setup filtros e busca ======
function setupFiltersAndSearch() {
  // Event listeners para botões de categoria
  document.querySelectorAll('.category-filter').forEach(button => {
    button.addEventListener('click', function() {
      // Remove classe 'active' de todos os botões
      document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Adiciona classe 'active' ao botão clicado
      this.classList.add('active');
      
      // Filtra projetos por categoria
      categoriaAtiva = this.getAttribute('data-category');
      atualizarListaProjetos();
    });
  });

  // Event listener para busca
  const searchInput = document.getElementById('projectSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchTerm = this.value.toLowerCase().trim();
      atualizarListaProjetos();
    });
  }
}

// paginação 

function scrollPaginacaoInicio() {
  const paginacao = document.getElementById('paginacaoProjetos');
  if (paginacao) paginacao.scrollLeft = 0;
}

// Exemplo: ao buscar
document.getElementById('projectSearch').addEventListener('input', function() {
  searchTerm = this.value.toLowerCase().trim();
  paginaAtual = 1;
  atualizarListaProjetosComPaginacao();
  scrollPaginacaoInicio(); // <-- adicione aqui
});

// Exemplo: ao clicar numa categoria
document.querySelectorAll('.category-filter').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    categoriaAtiva = this.getAttribute('data-category');
    paginaAtual = 1;
    atualizarListaProjetosComPaginacao();
    scrollPaginacaoInicio(); // <-- adicione aqui também
  });
});


// ====== Atualizar botões de filtro ======
function atualizarBotoesFiltro() {
  const categorias = Object.keys(projetosPorCategoria);
  const filterContainer = document.querySelector('.filter-container');

  function scrollPaginacaoInicio() {
  const paginacao = document.getElementById('paginacaoProjetos');
  if (paginacao) paginacao.scrollLeft = 0;
}

  
  if (!filterContainer) return;
  
  // Limpar botões existentes exceto o 'Todos'
  const todosBtn = filterContainer.querySelector('[data-category="all"]');
  filterContainer.innerHTML = '';
  
  // Adicionar o botão "Todos" de volta
  if (todosBtn) {
    filterContainer.appendChild(todosBtn);
  } else {
    const novoTodosBtn = document.createElement('button');
    novoTodosBtn.className = 'category-filter active';
    novoTodosBtn.setAttribute('data-category', 'all');
    novoTodosBtn.textContent = 'Todos';
    filterContainer.appendChild(novoTodosBtn);
  }
  
  // Adicionar botões para cada categoria encontrada no Firebase
  categorias.forEach(categoria => {
    // Verificar se já existe um botão para esta categoria
    const existingBtn = filterContainer.querySelector(`[data-category="${categoria}"]`);
    if (!existingBtn) {
      const btn = document.createElement('button');
      btn.className = 'category-filter';
      btn.setAttribute('data-category', categoria);
      btn.textContent = categoria;
      filterContainer.appendChild(btn);
    }
  });
  
  // Reconfigurar event listeners
  setupFiltersAndSearch();
}

// ====== Atualizar lista de projetos com base nos filtros ======
function atualizarListaProjetos() {
  // Encontrar ou criar o container para os cards
  let listaProjetos = document.getElementById('listaProjetos');
  const listaContainer = document.querySelector('.projetos-lista');
  
  if (!listaContainer) return;
  
  if (!listaProjetos) {
    listaProjetos = document.createElement('div');
    listaProjetos.id = 'listaProjetos';
    listaProjetos.className = 'cards-container';
    listaContainer.appendChild(listaProjetos);
  }
  
  // Limpar lista atual
  listaProjetos.innerHTML = '';
  
  // Filtrar projetos
  let projetosFiltrados = [];
  
  // Primeiro filtrar por categoria
  if (categoriaAtiva === 'all') {
    projetosFiltrados = [...todosProjetosLista];
  } else {
    projetosFiltrados = projetosPorCategoria[categoriaAtiva] || [];
  }
  
  // Depois filtrar por termo de busca
  if (searchTerm) {
    projetosFiltrados = projetosFiltrados.filter(projeto => 
      projeto.nome?.toLowerCase().includes(searchTerm) || 
      projeto.descricao?.toLowerCase().includes(searchTerm) ||
      projeto.categoria?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Exibir projetos filtrados
  if (projetosFiltrados.length === 0) {
    listaProjetos.innerHTML = `<p class='no-projects'>Nenhum projeto encontrado ${searchTerm ? 'com o termo "' + searchTerm + '"' : 'nesta categoria'}.</p>`;
    return;
  }
  
  projetosFiltrados.forEach(projeto => {
    const card = criarCardProjeto(projeto);
    listaProjetos.appendChild(card);
  });
}

// ====== Criar card de projeto ======
function criarCardProjeto(projeto) {
  const card = document.createElement('div');
  card.className = 'projeto-card';
  
  card.innerHTML = `
    <img src="${projeto.imagens?.[0] || 'img/sem-imagem.jpg'}" alt="${projeto.nome}" class="projeto-img" onclick="verDetalhes('${projeto.id}')">
    <div class="projeto-info">
      <h3 style="cursor:pointer" onclick="verDetalhes('${projeto.id}')">${projeto.nome}</h3>
      <p>${projeto.descricao || 'Sem descrição'}</p>
      <div class="categoria-tag">${projeto.categoria || 'Outros'}</div>
      <div class="projeto-actions">
        <button class="btn-ver" onclick="verDetalhes('${projeto.id}')">Ver Detalhes</button>
        <button class="btn-solicitar" onclick="solicitarOrcamento('${projeto.id}')">Solicitar Projeto</button>
      </div>
    </div>
  `;
  
  return card;
}

// ======= MENU RESPONSIVO =======
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (toggle && nav) {
  toggle.addEventListener("click", function () {
    nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
  });
}


