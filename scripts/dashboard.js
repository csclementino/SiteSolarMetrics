// Variáveis globais para armazenar os valores atuais
let currentConsumption = 0; // Consumo atual
let currentGeneration = 0; // Geração atual

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');

function updateIcon() {
    if (sidebar.classList.contains('hidden')) {
        menuOpenIcon.style.display = 'block';
        menuCloseIcon.style.display = 'none';
         // Define margem à esquerda para o ícone aberto
    } else {
        menuOpenIcon.style.display = 'none';
        menuCloseIcon.style.display = 'block';
    }
}

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden'); // Alterna a visibilidade da sidebar
    updateIcon(); // Atualiza o ícone
});

// Atualiza o ícone inicial baseado no estado da sidebar
updateIcon();

document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = {
        overview: document.getElementById("mainContent"),
        notifications: document.getElementById("notificationsSection"),
        settings: document.getElementById("settingsSection"),
    };

            const initialMenuItem = document.getElementById("overview");
            initialMenuItem.classList.add("ativo");
            const initialIcon = initialMenuItem.querySelector("img");
            if (initialIcon) {
                initialIcon.src = initialIcon.dataset.activeIcon; // Ícone ativo (preto) ao carregar
            }

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            const target = item.id;

            // Alterna a seção visível
            menuItems.forEach((el) => {
                el.classList.remove("ativo");
                const icon = el.querySelector("img");
                if (icon) {
                    // Restaura o ícone padrão
                    icon.src = icon.dataset.defaultIcon;
                }
            });

            // Adiciona a classe 'ativo' no item clicado
            item.classList.add("ativo");

            // Altera o ícone do item ativo
            const activeIcon = item.querySelector("img");
            if (activeIcon) {
                activeIcon.style.transform = "none";
                activeIcon.src = activeIcon.dataset.activeIcon;
            }
            for (const section in sections) {
                if (section === target) {
                    sections[section].classList.add("active");
                    sections[section].style.display = "block";
                } else {
                    sections[section].classList.remove("active");
                    sections[section].style.display = "none";
                }
            }
            // Atualiza a navegação ativa
            menuItems.forEach((el) => el.classList.remove("ativo"));
            item.classList.add("ativo");
        });
    });

    // Funcionalidade para alternar abas na seção de alertas
    const allTab = document.getElementById("allTab");
    const unreadTab = document.getElementById("unreadTab");
    const alerts = document.querySelectorAll(".alert");

    allTab.addEventListener("click", () => {
        allTab.classList.add("active");
        unreadTab.classList.remove("active");
        alerts.forEach((alert) => (alert.style.display = "flex"));
    });

    unreadTab.addEventListener("click", () => {
        unreadTab.classList.add("active");
        allTab.classList.remove("active");
        alerts.forEach((alert) => {
            if (alert.classList.contains("unread")) {
                alert.style.display = "flex";
            } else {
                alert.style.display = "none";
            }
        });
    });
});

// Inicializa o gráfico de Medição em Tempo Real
const realTimeCtx = document.getElementById("realTimeChart").getContext("2d");
const realTimeChart = new Chart(realTimeCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Consumo (W)",
                data: [],
                borderColor: "orange",               
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: "Geração (W)",
                data: [],
                borderColor: "yellow",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.4)',

                },
                
                
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Desativa a grade do eixo x
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)', // Opacidade de 50% para as labels do eixo X
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    lineWidth: 1,  // Espessura das linhas da grade do eixo y
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                },
                min: 0, // Valor mínimo do eixo Y
                suggestedMin: 0, // Sugere um valor mínimo para o eixo Y
                suggestedMax: 100, // Sugere um valor máximo inicial para o eixo Y
                maxTicksLimit: 6, // Limita o número de ticks no eixo Y a 6
                afterBuildTicks: (axis) => {
                    const ticks = axis.ticks;
                    if (ticks.length > 6) {
                        // Ajusta os ticks para manter exatamente 6 divisões
                        const step = Math.ceil(ticks.length / 6);
                        axis.ticks = ticks.filter((_, index) => index % step === 0);
                    }
                },
            },
        },
        backgroundColor: 'rgba(0, 0, 0, 0)', // Define o fundo do gráfico como transparente
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
    },
});


// Atualiza o gráfico de Medição em Tempo Real a cada 5 segundos
setInterval(() => {


    fetch('http://192.168.15.31:1880/consumo')
        .then(response => response.json())
        .then(data => {
            currentConsumption = data.consumo; // Atualiza a umidade
        })
        .catch(error => console.error('Erro ao obter umidade:', error));

    fetch('http://192.168.15.31:1880/geracao')
        .then(response => response.json())
        .then(data => {
            currentGeneration = data.geracao; // Atualiza a pressão
        })
        .catch(error => console.error('Erro ao obter pressão:', error));

// Adiciona novos dados ao gráfico
realTimeChart.data.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
realTimeChart.data.datasets[0].data.push(500);
realTimeChart.data.datasets[1].data.push(200);

// Sobrescreve o primeiro valor quando o gráfico ultrapassa 10 pontos
if (realTimeChart.data.labels.length > 5) {
    // Substitui o primeiro valor (índice 0) pelos novos dados
    realTimeChart.data.labels[0] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    realTimeChart.data.datasets[0].data[0] = currentConsumption;
    realTimeChart.data.datasets[1].data[0] = currentGeneration;
    
    // Move todos os outros valores para a esquerda
    for (let i = 1; i < realTimeChart.data.labels.length; i++) {
        realTimeChart.data.labels[i - 1] = realTimeChart.data.labels[i];
        realTimeChart.data.datasets[0].data[i - 1] = realTimeChart.data.datasets[0].data[i];
        realTimeChart.data.datasets[1].data[i - 1] = realTimeChart.data.datasets[1].data[i];
    }
}

// Atualiza o gráfico após a modificação
realTimeChart.update({
    duration: 0 // Desativa a animação
});

    // Atualiza o gráfico de Aproveitamento do Sistema
    updateGaugeChart(currentGeneration, currentConsumption);
}, 1000);

// Inicializa o gráfico de Aproveitamento do Sistema
const gaugeChart = new Chart(document.getElementById("gaugeChart"), {
    type: "doughnut",
    data: {
        labels: ["Aproveitamento", "Resto"],
        datasets: [
            {
                data: [50, 50], // Valores iniciais
                backgroundColor: ["#e1e417", "#000000"], // Cores iniciais
                borderWidth: 0,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90, // Começa no topo e mostra apenas metade
        circumference: 180, // Mostra apenas 180 graus (meia pizza)
        cutout: "80%", // Define o espaço interno
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    },
});



// Menu Ativo
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");

    // Configuração inicial para abrir o overview
    document.getElementById("overview").classList.add("ativo");
    document.getElementById("mainContent").classList.add("active");

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            menuItems.forEach((el) => el.classList.remove("ativo"));
            item.classList.add("ativo");
        });
    });

    document.getElementById("overview").addEventListener("click", () => {
        document.getElementById("settingsSection").classList.remove("active");
        document.getElementById("alertsSection").classList.remove("active");
        document.getElementById("mainContent").classList.add("active");
    });

    document.getElementById("settings").addEventListener("click", () => {
        document.getElementById("mainContent").classList.remove("active");
        document.getElementById("alertsSection").classList.remove("active");
        document.getElementById("settingsSection").classList.add("active");
    });

    document.getElementById("notifications").addEventListener("click", () => {
        document.getElementById("mainContent").classList.remove("active");
        document.getElementById("settingsSection").classList.remove("active");
        document.getElementById("alertsSection").classList.add("active");
    });

    document.getElementById("returnToOverview").addEventListener("click", () => {
        document.getElementById("settingsSection").classList.remove("active");
        document.getElementById("mainContent").classList.add("active");
    });
});


// Função para calcular e atualizar o gráfico de Aproveitamento
function updateGaugeChart() {
    currentPorcentagem = 60;
    fetch('http://192.168.15.31:1880/porcentagem')
        .then(response => response.json())
        .then(data => {
            currentPorcentagem = data.porcentagem; // Atualiza a pressão
        })
        .catch(error => console.error('Erro ao obter pressão:', error));
    const remainder = 100 - currentPorcentagem; // O restante é o complemento de 100%

    // Atualiza os dados do gráfico com a porcentagem de aproveitamento
    gaugeChart.data.datasets[0].data = [
        Math.min(currentPorcentagem, 100), // Limita o aproveitamento a 100%
        Math.max(remainder, 0), // Garante que o restante não seja negativo
    ];

    // Atualiza a cor do gráfico
    gaugeChart.data.datasets[0].backgroundColor = [
        "#e1e417", // Parte amarela (aproveitamento)
        "#000000", // Parte cinza (resto)
    ];

    // Atualiza o gráfico
    gaugeChart.update();

    // Exibe o percentual no centro do gráfico
    document.getElementById("gaugePercentage").textContent = `${Math.round(currentPorcentagem)}%`;
}
