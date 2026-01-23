let processCount = 3; // Contatore iniziale basato sui 3 processi già presenti nell'HTML

//Aggiunta processi (massimo 10)
function addProcess() {
    const maxProcesses = 10;
    const tableBody = document.getElementById('processTableBody');

    //controllo del limite
    if (processCount < maxProcesses) {
        processCount++; // incremento processi

        //creo una riga che andrà a contenere tutti i td 
        const newRow = document.createElement('tr'); //document.createElement crea un nuovo elemento HTML

        //(`) per scrivere su più righe
        //innerHTML per inserire il contenuto HTML all'interno dell'elemento creato (newRow)
        newRow.innerHTML = `
            <td style="text-align: center; vertical-align: middle;"><b>P${processCount}</b></td>
            <td><input type="number" class="form-control table-input" min="0" value="0"></td>
            <td><input type="number" class="form-control table-input" min="0" value="0"></td>
            <td><input type="number" class="form-control table-input" min="0" value="0"></td>
        `;

        //aggiungo la nuova riga al corpo della tabella 
        // appendChild aggiunge un nodo come ultimo "figlio" di un nodo "padre" specificato
        tableBody.appendChild(newRow);
    } else {
        // avviso se si tenta di superare i 10 processi
        alert("Hai raggiunto il limite massimo di 10 processi.");
    }
    console.log("Riga aggiunta. Numero totale di processi:", processCount);
}

//Rimozione processi (minimo 3)
function removeProcess() {
    const maxProcesses = 10;
    const tableBody = document.getElementById('processTableBody');
    //querySelectorAll restituisce una lista di tutti gli elementi che corrispondono al selettore specificato
    //all'interno della const rows c'è tutta la tabella
    const rows = tableBody.querySelectorAll('tr');

    if (processCount > 3) {
        processCount--;
        //rimuovo l'ultima riga della tabella
        //removeChild rimuove un nodo figlio specificato da un nodo padre
        //rows.length - 1 indica l'ultima riga della tabella
        tableBody.removeChild(rows[rows.length - 1]);
    } else {
        alert("Non puoi rimuovere altri processi. Il numero minimo è 3.");
    }
    console.log("Riga rimossa. Numero totale di processi:", processCount);
}
//funzione di reset
function reset() {
    location.reload(); // ricarica la pagina
}

//funzione per avviare la simulazione
function startSimulation() {
    console.log("Simulazione avviata con", processCount, "processi.");
}