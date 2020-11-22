let linkInput = document.querySelector('.link-input');
let shortButton = document.querySelector('.shorten-btn');
let menuBurger = document.querySelector('.menu-burger');
// let spinner = document.querySelector('.spinner');

shortButton.addEventListener('click', () => {
    let resultsBlock = document.querySelector('.results');
    let longLink = linkInput.value;

    if (longLink.trim() === '') {
        linkInput.style.border = '3px solid rgb(199, 66, 66)';
        let errorMessage = document.querySelector('.error');
        errorMessage.style.display = 'block';
        setTimeout(() => {
            linkInput.style.border = 'none';
            errorMessage.style.display = 'none';
        }, 2500);
        longLink = '';
        return false;
    }

    fetch(`/api/?url=${longLink}`)
        .then((response) => {
            console.log(response);
            if (response.ok) {
                return response.json();
            } else {
                alert('Ошибка HTTP: ' + response.status);
            }
        })
        .then((data) => {
            resultsBlock.innerHTML += `<div class="result-block">
                    <p class="original-link"></p>
                    <div class="block">
                        <a href=${data} class="shortened-link">${data}</a>
                        <button class="copy-btn">Copy</button>
                    </div>
                </div>`;
            linkInput.value = '';

            let copyButton = document.querySelectorAll('.copy-btn');
            console.log(copyButton);
            copyButton.forEach( el => {
                el.addEventListener('click', () => {
                    let shortenedLink = document.querySelectorAll('.shortened-link');
                    shortenedLink.forEach( elem => {
                        window.navigator.clipboard.writeText(elem.textContent);
                    });
                    el.classList.add('copied');
                    el.textContent = 'Copied!';
                });
            })
        });
});

menuBurger.addEventListener('click', () => {
    menuBurger.classList.toggle('active-burger');
    let menu = document.querySelector('.header-menu');
    menu.classList.toggle('header-menu-active');
});
