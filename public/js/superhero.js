const superheroData = new DataFetch('/api/member/superheroes', 'GET', {
    id: new URLSearchParams(window.location.href.split('?')[1]).get('id')
});

document.addEventListener('DOMContentLoaded', () => {
    superheroData.fetch().then(() => {
        superheroData.loadFillHTML();
    });
});