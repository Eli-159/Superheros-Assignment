const superheroData = new DataFetch('/api/superheroes/top-3', 'GET');

document.addEventListener('DOMContentLoaded', () => {
    superheroData.fetch().then(() => {
        superheroData.loadFillHTML();
    });
});