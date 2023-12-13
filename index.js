document.addEventListener('DOMContentLoaded', function () {
  const dbName = 'MyDatabase';
  const dbVersion = 1;
  let db;

  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = function (event) {
    console.error('Database error: ' + event.target.errorCode);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log('Database opened successfully');

    displayParticipants();

    const form = document.getElementById('addForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const participant = document.getElementById('participant').value;
      const module = document.getElementById('module').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      const transaction = db.transaction('Participants', 'readwrite');
      const objectStore = transaction.objectStore('Participants');

      const participantData = {
        participant: participant,
        module: module,
        startDate: startDate,
        endDate: endDate,
      };

      const addRequest = objectStore.add(participantData);

      addRequest.onsuccess = function () {
        console.log('Data added successfully');
        displayParticipants();
      };
    });
  };

  function displayParticipants() {
    const transaction = db.transaction('Participants', 'readonly');
    const objectStore = transaction.objectStore('Participants');
    const request = objectStore.openCursor();

    const participantList = document.querySelector('.participantList');
    participantList.innerHTML = '';

    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const listItem = document.createElement('li');
        listItem.textContent = `
                    Participant: ${cursor.value.participant},
                    Module: ${cursor.value.module},
                    Start Date: ${cursor.value.startDate},
                    End Date: ${cursor.value.endDate}
                `;
        participantList.appendChild(listItem);
        cursor.continue();
      } else {
        console.log('No more data');
      }
    };
  }
});
