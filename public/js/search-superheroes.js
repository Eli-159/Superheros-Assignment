// Create the DataFetch class with the request details
const superheroData = new DataFetch('/api/member/superheroes/search', 'GET');

// Wait for the document to load
document.addEventListener('DOMContentLoaded', () => {
    // Sets the searchTable function to be called every time the search bar value is changed
    document.getElementById('searchbar').addEventListener('input', () => {
        const searchTerm = document.getElementById('searchbar').value;
        if (!searchTerm) {
            superheroData.reqId = 0;
            return superheroData.resetLoopSection(document.getElementById('templateCard'));
        }
        superheroData.body.term = searchTerm;
        superheroData.fetch().then(() => {
            console.log(superheroData);
            console.log(superheroData.response.request.id, superheroData.reqId, superheroData.response.request.id == superheroData.reqId);
            if (superheroData.response.request.id == superheroData.reqId) superheroData.loadFillHTML(true);
        });
    });
});