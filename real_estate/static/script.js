let userType = 'client';
      const apiBaseUrl = 'http://127.0.0.1:8000/api/';

      function setUserType(type) {
          userType = type;
          loadContent();
      }

      async function loadContent() {
          const contentDiv = document.getElementById('content');
          contentDiv.innerHTML = '';

          if (userType === 'client') {
              contentDiv.innerHTML = '<h2>Properties</h2><div class="property-list" id="property-list"></div>';
              await loadProperties();
          } else if (userType === 'agent') {
              contentDiv.innerHTML = `
                  <h2>Manage Properties</h2>
                  <div class="property-list" id="property-list"></div>
                  <div class="form-container">
                      <h3>Add Property</h3>
                      <input id="title" placeholder="Title">
                      <textarea id="description" placeholder="Description"></textarea>
                      <input id="price" type="number" placeholder="Price">
                      <input id="address" placeholder="Address">
                      <select id="property-type"></select>
                      <button onclick="addProperty()">Add Property</button>
                  </div>`;
              await loadProperties();
              await loadPropertyTypes();
          } else if (userType === 'broker') {
              contentDiv.innerHTML = `
                  <h2>Manage Clients</h2><div class="profile-list" id="client-list"></div>
                  <h2>Manage Agents</h2><div class="profile-list" id="agent-list"></div>
                  <h2>Manage Properties</h2><div class="property-list" id="property-list"></div>`;
              await loadClients();
              await loadAgents();
              await loadProperties();
          }
      }

      async function loadProperties() {
          const response = await fetch(apiBaseUrl + 'properties/');
          const properties = await response.json();
          const propertyList = document.getElementById('property-list');
          propertyList.innerHTML = '';
          properties.forEach(prop => {
              const div = document.createElement('div');
              div.className = 'property';
              div.innerHTML = `
                  <h3>${prop.title}</h3>
                  <p>${prop.description}</p>
                  <p>Price: $${prop.price}</p>
                  <p>Type: ${prop.property_type.name}</p>
                  <p>Agent: ${prop.agent.user.username}</p>
                  ${userType === 'client' ? `<button onclick="bookProperty(${prop.id})">Book</button>` : ''}
                  ${userType !== 'client' ? `<button onclick="editProperty(${prop.id})">Edit</button><button onclick="deleteProperty(${prop.id})">Delete</button>` : ''}`;
              propertyList.appendChild(div);
          });
      }

      async function loadPropertyTypes() {
          const response = await fetch(apiBaseUrl + 'property-types/');
          const types = await response.json();
          const select = document.getElementById('property-type');
          select.innerHTML = '<option value="">Select Type</option>';
          types.forEach(type => {
              select.innerHTML += `<option value="${type.id}">${type.name}</option>`;
          });
      }

      async function loadClients() {
          const response = await fetch(apiBaseUrl + 'clients/');
          const clients = await response.json();
          const clientList = document.getElementById('client-list');
          clientList.innerHTML = '';
          clients.forEach(client => {
              const div = document.createElement('div');
              div.className = 'profile';
              div.innerHTML = `
                  <h3>${client.user.username}</h3>
                  <p>Email: ${client.user.email}</p>
                  <p>Phone: ${client.phone}</p>
                  <button onclick="deleteClient(${client.id})">Delete</button>`;
              clientList.appendChild(div);
          });
      }

      async function loadAgents() {
          const response = await fetch(apiBaseUrl + 'agents/');
          const agents = await response.json();
          const agentList = document.getElementById('agent-list');
          agentList.innerHTML = '';
          agents.forEach(agent => {
              const div = document.createElement('div');
              div.className = 'profile';
              div.innerHTML = `
                  <h3>${agent.user.username}</h3>
                  <p>Email: ${agent.user.email}</p>
                  <p>Phone: ${agent.phone}</p>
                  <button onclick="deleteAgent(${agent.id})">Delete</button>`;
              agentList.appendChild(div);
          });
      }

      async function addProperty() {
          const property = {
              title: document.getElementById('title').value,
              description: document.getElementById('description').value,
              price: document.getElementById('price').value,
              address: document.getElementById('address').value,
              property_type: document.getElementById('property-type').value,
              agent: 1 // Replace with authenticated agent ID
          };
          await fetch(apiBaseUrl + 'properties/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(property)
          });
          loadContent();
      }

      async function bookProperty(propertyId) {
          const booking = {
              client: 1, // Replace with authenticated client ID
              property: propertyId,
              status: 'pending'
          };
          await fetch(apiBaseUrl + 'bookings/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(booking)
          });
          alert('Property booked!');
      }

      async function deleteProperty(id) {
          await fetch(apiBaseUrl + `properties/${id}/`, { method: 'DELETE' });
          loadContent();
      }

      async function deleteClient(id) {
          await fetch(apiBaseUrl + `clients/${id}/`, { method: 'DELETE' });
          loadContent();
      }

      async function deleteAgent(id) {
          await fetch(apiBaseUrl + `agents/${id}/`, { method: 'DELETE' });
          loadContent();
      }

      // Initial load
      loadContent();