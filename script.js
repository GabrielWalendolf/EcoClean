/* =========================================================
   ECOCLEAN — Main Script
   Handles navigation, forms, interactions
   API calls will connect to Python backend (Flask/FastAPI)
========================================================= */

// ===================== NAVIGATION =====================

/**
 * Navigate between top-level pages (auth ↔ app)
 */
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

/**
 * Switch content panel inside the app shell
 * and update sidebar active state
 */
function switchContent(pageId, linkEl) {
  // Update content panels
  document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  return false; // prevent href navigation
}

function setAuthTab(tab) {
  // Visual tab switching handled by navigateTo
}

// ===================== AUTH =====================

 // TODO: Implementar autenticação real com backend e adicionar o admin.

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  const tipo  = document.getElementById('login-tipo').value;

  if (!email || !senha) {
    showToast('Preencha todos os campos.', 'error');
    return;
  }

  // TODO: POST /api/auth/login
  try {

    // Simulate success
    const username = email.split('@')[0];
    document.getElementById('sidebar-username').textContent = username;
    navigateTo('page-app');
    // Activate first nav item
    const firstNav = document.querySelector('.nav-item[data-page]');
    if (firstNav) switchContent(firstNav.dataset.page, firstNav);
    showToast('Bem-vindo ao EcoClean! 🌿', 'success');

  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleCadastro(e) {
  e.preventDefault();

  // TODO: POST /api/auth/cadastro
  showToast('Cadastro realizado com sucesso!', 'success');
  setTimeout(() => navigateTo('page-login'), 1200);
}

function handleLogout(e) {
  e.preventDefault();
  // TODO: POST /api/auth/logout
  // localStorage.removeItem('token');
  navigateTo('page-login');
  showToast('Você saiu da sua conta.', '');
}

// ===================== MAPA =====================

async function buscarMapa() {
  const query = document.getElementById('mapa-search').value.trim();
  if (!query) {
    showToast('Digite um endereço para pesquisar.', 'error');
    return;
  }

  showToast('Buscando pontos de coleta próximos...', '');

  // TODO: GET /api/mapa/pontos?endereco=query

  // Simulated response
  setTimeout(() => showToast('3 pontos encontrados próximo a "' + query + '"', 'success'), 600);
}

// ===================== DENÚNCIA =====================

async function handleDenuncia(e) {
  e.preventDefault();

  const form = e.target;
  const tipo_residuo = form.querySelector('select').value;
  const descricao    = form.querySelector('textarea').value;

  if (!descricao.trim()) {
    showToast('Adicione uma descrição à denúncia.', 'error');
    return;
  }

  // TODO: POST /api/denuncias

  // Simulated response
  showToast('Denúncia enviada com sucesso! ✅', 'success');
  form.reset();
  resetDropZone();
}

// ===================== COLETA =====================

async function handleColeta(e) {
  e.preventDefault();

  const form = e.target;
  const tipo_residuo = form.querySelector('select').value;
  const data_coleta  = form.querySelector('input[type="date"]').value;

  if (!data_coleta) {
    showToast('Selecione uma data para a coleta.', 'error');
    return;
  }

  // TODO: POST /api/coletas/agendar

  // Simulated response
  showToast('Coleta agendada com sucesso! 📅', 'success');
  form.reset();
}

// ===================== GUIA =====================

const guiaData = {
  eletronicos: {
    titulo: 'Eletrônicos',
    descricao: 'Equipamentos eletrônicos contêm substâncias tóxicas como chumbo, mercúrio e cádmio que podem contaminar o solo e a água. Nunca descarte no lixo comum. Procure os ecopontos credenciados ou programas de logística reversa de fabricantes.',
    itens: ['celular', 'tablet', 'notebook', 'TV', 'monitores', 'impressoras', 'carregadores'],
    locais: ['Ecoponto Central – Rua das Flores, 120', 'Shopping Center – Piso L1 (coleta voluntária)', 'Posto de Coleta Tech – Av. Brasil, 450']
  },
  quimicos: {
    titulo: 'Resíduos Químicos',
    descricao: 'Produtos químicos domésticos exigem descarte cuidadoso. Nunca despeje em ralos, rios ou no lixo comum. Mantenha nas embalagens originais e leve a um ponto especializado.',
    itens: ['tintas', 'solventes', 'óleo de cozinha', 'pilhas', 'baterias', 'agrotóxicos', 'produtos de limpeza'],
    locais: ['CQRQ – Centro de Coleta de Resíduos Químicos', 'Ecoponto Sul – Rua Ipiranga, 80', 'Postos de combustível (pilhas e óleo)']
  },
  organicos: {
    titulo: 'Resíduos Orgânicos',
    descricao: 'Resíduos orgânicos podem ser transformados em adubo através da compostagem. São coletados separadamente nas regiões com coleta seletiva e podem ser levados diretamente a composteiras comunitárias.',
    itens: ['restos de comida', 'podas de jardim', 'folhas', 'frutos', 'borra de café', 'cascas'],
    locais: ['Composteira Comunitária Parque Verde', 'Coleta Orgânica – Terças e Sextas', 'Feira Orgânica Central (entrega)']
  },
  construcao: {
    titulo: 'Resíduos de Construção',
    descricao: 'Entulho e resíduos de obras (Classe A) devem ser levados a aterros específicos para reciclagem. Volumes maiores requerem contratação de caçamba. Nunca descarte em calçadas ou terrenos baldios.',
    itens: ['tijolos', 'concreto', 'madeira', 'telhas', 'areia', 'metal', 'PVC'],
    locais: ['Aterro de Inertes – Rodovia Norte Km 12', 'Área de Transbordo – Zona Industrial', 'Serviço de Caçamba – (48) 3000-0000']
  },
  vidro: {
    titulo: 'Vidro',
    descricao: 'O vidro é 100% reciclável e pode ser reutilizado infinitas vezes sem perda de qualidade. Embrulhe vidros quebrados antes de descartar para evitar acidentes. Descarte nas lixeiras de reciclagem verdes/azuis.',
    itens: ['garrafas', 'potes', 'frascos', 'copos quebrados', 'vidros de janela', 'espelhos'],
    locais: ['Lixeiras de Reciclagem (verdes)', 'Ecoponto Central – Rua das Flores, 120', 'Cooperativa de Reciclagem VidroCoop']
  },
  papel: {
    titulo: 'Papel e Papelão',
    descricao: 'Papel e papelão são amplamente recicláveis. Mantenha secos e limpos para aumentar o valor da reciclagem. Papel engordurado ou muito sujo não pode ser reciclado – vai para o lixo orgânico.',
    itens: ['caixas', 'jornais', 'revistas', 'cadernos', 'papel de escritório', 'embalagens Tetra Pak'],
    locais: ['Coleta Seletiva – Segundas e Quintas', 'Cooperativa de Reciclagem ReciclaJá', 'Ecoponto Norte – Av. Progresso, 200']
  }
};

function filtrarGuia(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.guia-card').forEach(card => {
    const cat   = card.dataset.categoria;
    const title = card.querySelector('.guia-card-title').textContent.toLowerCase();
    const items = card.querySelector('.guia-card-items').textContent.toLowerCase();
    const match = !q || title.includes(q) || items.includes(q) || cat.includes(q);
    card.style.display = match ? '' : 'none';
  });
}

function mostrarInfoGuia(categoria) {
  const data = guiaData[categoria];
  if (!data) return;

  // Deselect all
  document.querySelectorAll('.guia-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.guia-card[data-categoria="${categoria}"]`).classList.add('selected');

  const panel = document.getElementById('guia-info-panel');
  panel.innerHTML = `
    <div class="guia-info-content">
      <h3 class="guia-info-title">${data.titulo}</h3>
      <p class="guia-info-desc">${data.descricao}</p>
      <p class="guia-info-subtitle">Itens aceitos</p>
      <p style="font-size:14px; color:var(--text-muted); margin-bottom:14px">
        ${data.itens.map(i => `<span style="background:rgba(255,127,80,0.12); color:var(--accent); border-radius:4px; padding:2px 8px; display:inline-block; margin:2px;">${i}</span>`).join(' ')}
      </p>
      <p class="guia-info-subtitle">Pontos de Entrega</p>
      <ul class="guia-info-locations">
        ${data.locais.map(l => `<li><i class="fi fi-rr-map-marker loc-icon"></i>${l}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Attach click listeners to guia cards
document.querySelectorAll('.guia-card').forEach(card => {
  card.addEventListener('click', () => mostrarInfoGuia(card.dataset.categoria));
});



// ===================== TOAST =====================

let toastTimer = null;

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  if (type) toast.classList.add(type);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}