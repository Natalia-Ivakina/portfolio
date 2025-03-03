/**
 * click on project
 */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        card.querySelector('.project-card-inner').classList.toggle('flipped');
    });
});

/**
 * change img if mouse is moving
 */
// document.querySelector('.photo').addEventListener('mousemove', function(e) {
//     const rect = this.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width * 100;
//     const y = (e.clientY - rect.top) / rect.height * 100;
//
//     this.querySelector('#image1').style.clipPath = `inset(0 ${100 - x}% 0 0)`;
// });
//
// document.querySelector('.photo').addEventListener('mouseleave', function() {
//     this.querySelector('#image1').style.clipPath = `inset(0 0 0 0)`;
// });

// document.querySelector('#toggleButton').addEventListener('click', function(e) {
//     // Меняем текст кнопки
//     const text = document.querySelector('#toggleButton');
//     if (text.textContent === 'Switch to Facts') {
//         text.textContent = 'Switch to Skills';
//     } else {
//         text.textContent = 'Switch to Facts';
//     }
//
//     const rect = this.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width * 100;
//     const y = (e.clientY - rect.top) / rect.height * 100;
//
//     this.querySelector('#image1').style.clipPath = `inset(0 ${100 - x}% 0 0)`;
// });

document.querySelector('#toggleButton').addEventListener('click', function() {
    const image1 = document.querySelector('#image1');
    const image2 = document.querySelector('#image2');
    const skills = document.querySelector('#skills');
    const facts = document.querySelector('#facts');
    const text = document.querySelector('#toggleButton');

    if (text.textContent === 'Switch to Facts') {
        text.textContent = 'Switch to Skills';

        //hide
        image2.style.opacity = '0';
        image2.style.clipPath = 'inset(0 0 0 100%)';
        //show
        image1.style.opacity = '1';
        image1.style.clipPath = 'inset(0 0 0 0)';

        skills.style.visibility = 'hidden';
        facts.style.visibility = 'visible';
    } else {
        text.textContent = 'Switch to Facts';

        //hide
        image1.style.opacity = '0';
        image1.style.clipPath = 'inset(0 100% 0 0)';
        //show
        image2.style.opacity = '1';
        image2.style.clipPath = 'inset(0 0 0 0)';

        facts.style.visibility = 'hidden';
        skills.style.visibility = 'visible';
    }
});




