function toggleAnswer(index) {
    const answer = document.getElementById(`answer-${index}`);
    const questionBox = document.querySelectorAll('.faq-item')[index]; 
    const toggleSymbol = questionBox.querySelector('.toggle-symbol');

    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        questionBox.style.backgroundColor = '#404040';
        questionBox.style.boxShadow = 'none';
        questionBox.style.border = '3px solid #000';
        toggleSymbol.textContent = '+';
        questionBox.style.color = '#FFFFFF';
    } else {
        answer.style.display = 'block';
        questionBox.style.backgroundColor = '#fbff00da';
        questionBox.style.border = 'none'; 
        toggleSymbol.textContent = '-';
        questionBox.style.color = '#000';
        answer.style.cursor = 'pointer';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const usernameField = document.getElementById("uname");
    const passwordField = document.getElementById("psw");
    const rememberCheckbox = document.getElementById("remember-checkbox");

    // Carrega dados armazenados, se houver
    if (localStorage.getItem("username")) {
        usernameField.value = localStorage.getItem("username");
        passwordField.value = localStorage.getItem("password");
        rememberCheckbox.checked = true; // Marca a checkbox se os dados estiverem salvos
    }

    // Salva dados no Local Storage apenas se a checkbox estiver marcada
    const form = document.getElementById("login-form");
    form.addEventListener("submit", function () {
        if (rememberCheckbox.checked) {
            localStorage.setItem("username", usernameField.value);
            localStorage.setItem("password", passwordField.value);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const cadastroTab = document.getElementById("cadastroTab");
    const loginForm = document.getElementById("loginForm");
    const cadastroForm = document.getElementById("cadastroForm");

    // Função para alternar entre os formulários
    const alternarFormularios = (ativarLogin) => {
        if (ativarLogin) {
            loginForm.style.display = "block";
            loginForm.style.opacity = "1"; // Para transição suave
            cadastroForm.style.display = "none";
            cadastroForm.style.opacity = "0";
        } else {
            cadastroForm.style.display = "block";
            cadastroForm.style.opacity = "1"; // Para transição suave
            loginForm.style.display = "none";
            loginForm.style.opacity = "0";
        }
    };

    // Evento para exibir o formulário de login
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("ativo");
        cadastroTab.classList.remove("ativo");
        alternarFormularios(true); // Ativar login
    });

    // Evento para exibir o formulário de cadastro
    cadastroTab.addEventListener("click", () => {
        cadastroTab.classList.add("ativo");
        loginTab.classList.remove("ativo");
        alternarFormularios(false); // Ativar cadastro
    });

    // Exibe o formulário inicial
    alternarFormularios(true);
});