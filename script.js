/**
 * clicker on project
 */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const inner = card.querySelector('.project-card-inner');
        const iframe = card.querySelector('.project-card-back iframe');

        inner.classList.toggle('flipped');

        // drop src
        if (!inner.classList.contains('flipped') && iframe) {
            iframe.src = iframe.src;
        }
    });
});

const button = document.querySelector('#toggleButton');
const image1 = document.querySelector('#image1');
const image2 = document.querySelector('#image2');
const skills = document.querySelector('#skills');
const facts = document.querySelector('#facts');

/**
 * switcher info and photo
 */
button.addEventListener('click', () => {
    button.classList.toggle('active');

    if (button.classList.contains('active')) {
        //Skills
        image2.style.opacity = '0';
        image2.style.clipPath = 'inset(0 0 0 100%)';
        image1.style.opacity = '1';
        image1.style.clipPath = 'inset(0 0 0 0)';

        skills.style.visibility = 'hidden';
        skills.style.opacity = '0';
        facts.style.visibility = 'visible';
        facts.style.opacity = '1';
    } else {
        //Facts
        image1.style.opacity = '0';
        image1.style.clipPath = 'inset(0 100% 0 0)';
        image2.style.opacity = '1';
        image2.style.clipPath = 'inset(0 0 0 0)';

        skills.style.visibility = 'visible';
        skills.style.opacity = '1';
        facts.style.visibility = 'hidden';
        facts.style.opacity = '0';
    }
});




