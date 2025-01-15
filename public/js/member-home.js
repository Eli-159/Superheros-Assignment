const superheroData = new DataFetch('/api/member/superheroes/top-24', 'GET');

document.addEventListener('DOMContentLoaded', () => {
    superheroData.fetch().then(() => {
        superheroData.loadFillHTML();
    });
});