        const buttons = document.querySelectorAll('nav button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const section = document.getElementById(targetId);
                section.scrollIntoView({ behavior: 'smooth' });
            });
        });
        window.addEventListener('scroll', () => {
            let scrollPos = window.scrollY + window.innerHeight / 2;
            buttons.forEach(btn => {
                const targetId = btn.getAttribute('data-target');
                const section = document.getElementById(targetId);
                if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        const gallery = document.querySelector('.gallery');
        const btnLeft = document.getElementById('scrollLeft');
        const btnRight = document.getElementById('scrollRight');

        const scrollAmount = 240; // كمية التمرير لكل ضغطة (بالبكسل)

        btnLeft.addEventListener('click', () => {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        btnRight.addEventListener('click', () => {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });