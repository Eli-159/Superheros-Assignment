const data = [];

function findData(tableId) {
    const rows = document.getElementById(tableId).getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        data.push(`    {"id": ${parseInt(cells[0].textContent)}, "name": "${cells[1].textContent}"}`);
    }
}

findData('table1');
findData('table2');
findData('table3');

console.log(`[\n${data.join(',\n')}\n]`);