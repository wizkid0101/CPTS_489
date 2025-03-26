document.getElementById('petitionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim().toUpperCase();
  
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        alert('Please enter a valid email address.');
        return;
    }
  
    try {
        const response = await fetch('http://localhost:3000/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, city, state })
        });
  
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to sign the petition');
        }
  
        // Append new signer to table
        addSignatureToTable(data);
  
        // Reset form
        document.getElementById('petitionForm').reset();
        alert('Thank you for signing the petition!');
    } catch (error) {
        alert(error.message);
    }
  });
  
  // Function to add a signature to the table
  function addSignatureToTable({ name, city, state }) {
    const table = document.getElementById('signaturesTable').querySelector('tbody');
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = city;
    newRow.insertCell(2).textContent = state;
  }
  
  // Load existing signatures on page load
  document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('http://localhost:3000/signatures');
        const signatures = await response.json();
  
        const table = document.getElementById('signaturesTable').querySelector('tbody');
        table.innerHTML = ''; // Clear existing entries
        signatures.forEach(addSignatureToTable);
    } catch (error) {
        console.error('Error fetching signatures:', error);
    }
  });
  