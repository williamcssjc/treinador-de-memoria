//Cores disponíveis
const cores = ['vermelho', 'azul', 'verde', 'amarelo'];

//sequência do jogo e jogada do usuário
let sequenciaJogo = [];
let sequenciaUsuario = [];

// Configuração de dificuldade
let tempoPiscar = 1000; //padrão
let dificuldade = 'medio' //default

// Score e recorde
let score = 0;
let recorde = localStorage.getItem('recorde')  || 0;
document.getElementById('recorde').innerText = recorde;

//Elementos DOM
const blocos = {
    vermelho: document.getElementById('vermelho'),
    azul: document.getElementById('azul'),
    verde: document.getElementById('verde'),
    amarelo: document.getElementById('amarelo'),
}

//evento de clique nas cores 
const botaoStart = document.getElementById('start');
Object.keys(blocos).forEach(cor => {
    blocos[cor].addEventListener('click', () =>{
        if (bloqueado) return; //evita clique fora do tempo
        tocarSomCor(cor); // toca som pela cor
        cliqueUsuario(cor); //processa jogada
    })
})
const scoreEl = document.getElementById('score');

//Estado de controle
let bloqueado = true; //bloqueia cliques fora da vez do usuário

//Eventos de dificuldade
const botoesDificuldade = document.querySelectorAll('.dificuldade button')
botoesDificuldade.forEach(botao => {
    botao.addEventListener('click', () => {
        //remove a classe ativo de todos
        botoesDificuldade.forEach(b => b.classList.remove('ativo'));

        //adiciona classe ao botao clicado
        botao.classList.add('ativo');

        //ajusta tempo com base no id
        const nivel = botao.id;
        dificuldade = nivel;

        if (nivel === 'facil') tempoPiscar = 1000;
        if (nivel === ' medio') tempoPiscar = 700;
        if (nivel === ' dificil') tempoPiscar = 400;
    });
});

//Evento do botão START
botaoStart.addEventListener('click', iniciarJogo);

function iniciarJogo() {
    const somIniciar = new Audio('sons/som_iniciar.mp3')
    somIniciar.play();
    score = 0;
    sequenciaJogo = [];
    scoreEl.innerText = score;
    proximaRodada();
   
}

function proximaRodada () {
    bloqueado = true;
    sequenciaUsuario = [];


    //Sorteia uma nova cor 
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    sequenciaJogo.push(corAleatoria);

    //Mostra a sequência ao jogador
    mostrarSequencia();
}

function mostrarSequencia () {
    let i = 0;

    const intervalo = setInterval(() => {
        const cor = sequenciaJogo[i];
        piscarCor(cor);
        i++;

        if (i >= sequenciaJogo.length){
            clearInterval(intervalo);
            bloqueado = false;
        }
    }, tempoPiscar + 200); //espaço entre piscadas
}

function piscarCor (cor) {
    const bloco = blocos[cor];
    bloco.classList.add('piscar');

    setTimeout(() => {
        bloco.classList.remove ('piscar');
    }, 400);
}


function cliqueUsuario(cor) {
    if (bloqueado) return; //ignora cliqeus fora da vez

    sequenciaUsuario.push(cor)
    piscarCor(cor); //feedback visual do clique

    const pos = sequenciaUsuario.length - 1;

    if (sequenciaUsuario[pos] !== sequenciaJogo[pos])  {
        const somErro = new Audio('sons/som_erro.mp3');
        somErro.play();

        setTimeout(() => {
         alert('errou! 😵');
        finalizarJogo();    
        }, 300);
        return;
    }
    if (sequenciaUsuario.length === sequenciaJogo.length) {
        score++;
        scoreEl.innerText = score;
        setTimeout(() => {
            proximaRodada();
        }, 1000)
    }
}

function finalizarJogo(){
    bloqueado = true;
    if (score > recorde){
        recorde = score;
        localStorage.setItem('recorde', recorde);
        document.getElementById('recorde').innerText = recorde;

        const somRecorde = new Audio('sons/som_recorde.mp3');
        somRecorde.play();

        alert('Novo recorde!  🏆')
    }
}
function tocarSomCor(cor) {
    const som = new Audio(`sons/som_${cor}.mp3`);
    som.play();
}
