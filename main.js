
function getArrowConfig() {
    const ua = navigator.userAgent;

     if (/Android.*Mobile|iPhone|iPod/i.test(ua)) {
        return null;
    }

    const configs = [
        {
            match: () => ua.includes('Chrome') && !ua.includes('Edg') && parseInt(ua.match(/Chrome\/(\d+)/)[1]) >= 109,
            result: { position: 'top-right', image: 'arrow-up.png' }
        },
        {
            match: () => ua.includes('Chrome') && !ua.includes('Edg'),
            result: { position: 'bottom-left', image: 'arrow-down.png' }
        },
        {
            match: () => ua.includes('Edg') && parseInt(ua.match(/Edg\/(\d+)/)[1]) >= 98,
            result: { position: 'top-right', image: 'arrow-up.png' }
        },
        {
            match: () => ua.includes('Edg'),
            result: { position: 'bottom-left', image: 'arrow-down.png' }
        },
        {
            match: () => ua.includes('Firefox') || (ua.includes('Safari') && !ua.includes('Chrome')),
            result: { position: 'top-right', image: 'arrow-up.png' }
        },
    ];

    return configs.find(c => c.match())?.result ?? { position: 'bottom-right', image: 'arrow-down.png' };
}

async function loadProducts() {
    try {
        const response = await fetch('https://veryfast.io/t/front_test_api.php');
        const data = await response.json();
        const items = data.result.elements;
        const container = document.querySelector('.products');

        items.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            const period = item.license_name.includes('Monthly') ? '/mo' : '/per year';
            let badgeHTML = '';
            let saleHTML = '';

            if (item.is_best) {
                badgeHTML = `<span class="product-card__badge">Best Value</span>`;
            }

            if (item.amount_html) {
                const oldPrice = item.amount_html.split('</strike>')[0].replace('$', '');
                saleHTML = `
                    <img class="product-card__sale" alt="sale" src="images/sale.png"/>
                    <span class="product-card__full-price">$${oldPrice}</span>
                `;
            }

            card.innerHTML = `
                <div class="product-card__price-box">
                    ${badgeHTML}
                    <div class="product-card__price">
                        <h3 class="product-card__amount">
                            $${item.amount}<span class="product-card__period">${period}</span>
                        </h3>
                    </div>
                    ${saleHTML}
                </div>
                <div class="product-card__info">
                    <div class="product-card__text">
                        <p class="product-card__name">${item.name_prod}</p>
                        <p class="product-card__plan">${item.license_name}</p>
                    </div>
                    <a href="${item.link}" class="product-card__link">
                        <div class="product-card__link-text">download</div>
                        <img class="product-card__img" alt="download" src="images/download.svg"/>
                    </a>
                </div>
            `;

            container.appendChild(card);

            const button = card.querySelector('.product-card__link');

            button.addEventListener('click', () => {
                setTimeout(() => {
                    const config = getArrowConfig();
                    if (!config) return;
                    const { position, image } = config;
                    const arrow = document.createElement('div');
                    arrow.classList.add('download-arrow', `download-arrow--${position}`);
                    arrow.innerHTML = `<img src="images/${image}" alt="arrow"/>`;
                    document.body.appendChild(arrow);

                    setTimeout(() => arrow.remove(), 5000);
                }, 1500);
            });
        });

    } catch (error) {
        console.log('Error', error);
    }
}

loadProducts();