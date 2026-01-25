let processCount = 3;

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
    //raccogliere i dati dei processi dalla tabella
    // creo un array vuoto per i processi
    const processes = [];
    //querySelectorAll restituisce una lista di tutti gli elementi che corrispondono al selettore specificato (in questo caso tutte le righe della tabella)
    const rows = document.querySelectorAll('#processTableBody tr');
    
    for (let i = 0; i < rows.length; i++) {
        
        let row = rows[i];
        
        // prendo tutti gli input dentro questa riga
        let inputs = row.querySelectorAll('input');
        
        //estraggo tutti i valori necessari
        //l'indice 0 è arrival time, 1 è burst time, 2 è priority
        //gli indici si riferiscono alla posizione degli input nella riga
        let arrivalVal = inputs[0].value;
        let burstVal = inputs[1].value;
        let priorityVal = inputs[2].value;
    
        //converto i testi in numeri interi (base 10 specificata)
        let arrivalTime = parseInt(arrivalVal, 10);
        let burstTime = parseInt(burstVal, 10);
        let priority = parseInt(priorityVal, 10);
    
        //gestisco i casi in cui l'input sia vuoto o non è un numero (NaN) assegnando 0
        if (isNaN(arrivalTime)) { arrivalTime = 0; }
        if (isNaN(burstTime)) { burstTime = 0; }
        if (isNaN(priority)) { priority = 0; }
        
        //creiamo l'oggetto processo
        let nuovoProcesso = {
            id: "P" + (i + 1), //concatenazione di stringhe per creare l'ID del processo
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            originalBurstTime: burstTime,
            remainingBurst: burstTime, // tempo di burst rimanente
            priority: priority,
            completionTime: 0,
            waitingTime: 0,
            turnaroundTime: 0,
            inCoda: false, // flag per tracciare se il processo è in coda
        };
        
        //aggiungo il processo alla lista
        //push aggiunge un nuovo elementro a un array
        processes.push(nuovoProcesso);
    }
    
    
    //prendo i parametri di time slice e context switch
    //or se non sono specificati 2 (contextSwitch) o 4 (timeSlice)
    const timeSlice = parseInt(document.getElementById('timeSliceInput').value) || 4;
    const contextSwitchTime = parseInt(document.getElementById('contextSwitchInput').value) || 2;
    
    //eseguire l'algoritmo round robin
    const results = roundRobinScheduling(processes, timeSlice, contextSwitchTime);
    
    //visualizzare i risultati
    displayResults(results);
    
    console.log("Simulazione completata con", processCount, "processi.");
}

//algoritmo Round Robin
function roundRobinScheduling(listaProcessi, timeSlice, contextSwitchTime) {
    let tempoCorrente = 0;
    let coda = []; // coda per i processi pronti
    let processiCompletati = []; // lista dei processi completati
    
    // aggiungi alla coda tutti i processi che arrivano al tempo 0
    for (let i = 0; i < listaProcessi.length; i++) {
        if (listaProcessi[i].arrivalTime === 0) {
            //push aggiunge un nuovo elementro a un array
            coda.push(listaProcessi[i]);
            listaProcessi[i].inCoda = true;
        }
    }
    
    //se nessun processo arriva al tempo 0, salta al primo arrival time
    if (coda.length === 0 && listaProcessi.length > 0) {
        // Troviamo il minimo arrival time iterando manualmente
        let minArrival = Infinity;
        for (let i = 0; i < listaProcessi.length; i++) {
            if (listaProcessi[i].arrivalTime < minArrival) {
                minArrival = listaProcessi[i].arrivalTime;
            }
        }
        
        tempoCorrente = minArrival;
        
        // Aggiungiamo alla coda tutti i processi che hanno questo arrival time minimo
        for (let i = 0; i < listaProcessi.length; i++) {
            if (listaProcessi[i].arrivalTime === minArrival) {
                coda.push(listaProcessi[i]);
                listaProcessi[i].inCoda = true;
            }
        }
    }
    
    //continua finché la coda non è vuota
    while (coda.length > 0) {
        //prende il primo processo dalla coda
        //shift rimuove il primo elemento da un array e lo restituisce
        let processoCorrente = coda.shift();
        processoCorrente.inCoda = false; // togliamo dal flag
        
        // Se il processo non è ancora arrivato, aspetta il suo arrival time
        if (tempoCorrente < processoCorrente.arrivalTime) {
            tempoCorrente = processoCorrente.arrivalTime;
        }
        
        //esegui il processo per il time slice (o meno se finisce prima)
        let tempoDaEseguire = Math.min(timeSlice, processoCorrente.remainingBurst);
        
        //aggiorna il tempo e il burst rimanente
        tempoCorrente += tempoDaEseguire;
        processoCorrente.remainingBurst -= tempoDaEseguire;
        
        //controlla se il processo è finito
        if (processoCorrente.remainingBurst === 0) {
            // processo finito
            processoCorrente.completionTime = tempoCorrente;
            processoCorrente.turnaroundTime = processoCorrente.completionTime - processoCorrente.arrivalTime;
            processoCorrente.waitingTime = processoCorrente.turnaroundTime - processoCorrente.originalBurstTime;
            processiCompletati.push(processoCorrente);
        } else {
            // processo non finito: aggiungi il context switch e rimetti in coda
            tempoCorrente = tempoCorrente + contextSwitchTime;
            coda.push(processoCorrente);
            processoCorrente.inCoda = true;
        }
        
        // Dopo l'esecuzione, controlla se ci sono processi arrivati che non sono in coda
        for (let i = 0; i < listaProcessi.length; i++) {
            let p = listaProcessi[i];
            // Se il processo è arrivato, non è completato, non è in coda e il tempo è passato
            if (p.arrivalTime <= tempoCorrente && p.remainingBurst > 0 && !p.inCoda && p.completionTime === 0) {
                coda.push(p);
                p.inCoda = true;
            }
        }
        
        //se la coda è vuota e ci sono processi non ancora completati, aspetta il prossimo
        if (coda.length === 0 && processiCompletati.length < listaProcessi.length) {
            //trova il prossimo processo che deve arrivare
            let minArrivalTime = Infinity;
            for (let i = 0; i < listaProcessi.length; i++) {
                if (listaProcessi[i].remainingBurst > 0 && listaProcessi[i].arrivalTime < minArrivalTime) {
                    minArrivalTime = listaProcessi[i].arrivalTime;
                }
            }
            
            //se esiste un processo non completato, salta al suo arrival time
            if (minArrivalTime !== Infinity) {
                tempoCorrente = minArrivalTime;
                // Aggiungi tutti i processi che arrivano in quel momento
                for (let i = 0; i < listaProcessi.length; i++) {
                    if (listaProcessi[i].arrivalTime === minArrivalTime && listaProcessi[i].remainingBurst > 0) {
                        coda.push(listaProcessi[i]);
                        listaProcessi[i].inCoda = true;
                    }
                }
            }
        }
    }
    
    //ordina i risultati per ID processo
    //algoritmo bubble sort per ordinare i processi in base all'ID
    for (let i = 0; i < processiCompletati.length; i++) {
        for (let j = 0; j < processiCompletati.length - 1; j++) {

            //prendiamo il processo attuale e quello successivo
            let attuale = processiCompletati[j];
            let successivo = processiCompletati[j + 1];

            //confrontiamo gli ID usando localeCompare per ordine alfabetico corretto
            //localeCompare restituisce un numero negativo se attuale < successivo
            //quindi se il risultato è > 0, significa che attuale > successivo e vanno scambiati
            let risultatoConfronto = attuale.id.localeCompare(successivo.id);
            
            if (risultatoConfronto > 0) {
                //scambia i due processi
                let salvataggio = processiCompletati[j];
                processiCompletati[j] = processiCompletati[j + 1];
                processiCompletati[j + 1] = salvataggio;
            }
        }
    }
    
    return processiCompletati;
}

//visualizzare i risultati nella tabella
function displayResults(results) {
    const resultTableBody = document.getElementById('resultTableBody');
    const resultTableFoot = document.getElementById('resultTableFoot');
    
    // Pulire la tabella
    resultTableBody.innerHTML = '';
    
    let totalTAT = 0;
    let totalWT = 0;
    
    // Aggiungere le righe con i risultati
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.id}</td>
            <td>${result.arrivalTime}</td>
            <td>${result.originalBurstTime}</td>
            <td>${result.completionTime}</td>
            <td>${result.turnaroundTime}</td>
            <td>${result.waitingTime}</td>
        `;
        resultTableBody.appendChild(row);
        
        totalTAT += result.turnaroundTime;
        totalWT += result.waitingTime;
    });
    
    // Calcolare le medie
    const avgTAT = (totalTAT / results.length).toFixed(2);
    const avgWT = (totalWT / results.length).toFixed(2);
    
    // Aggiornare il footer con le medie
    document.getElementById('avgTATText').textContent = avgTAT;
    document.getElementById('avgWTText').textContent = avgWT;
    
    // Mostrare il footer
    resultTableFoot.classList.remove('d-none');
}