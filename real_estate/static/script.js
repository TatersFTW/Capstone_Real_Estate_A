let userType = 'guest';
   let token = localStorage.getItem('token');
   const apiBaseUrl = 'http://127.0.0.1:8000/api/';
   let currentSlide = 0;

   function updateAuthLinks() {
       const authLinks = document.getElementById('auth-links');
       if (token) {
           authLinks.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
       } else {
           authLinks.innerHTML = `
               <a href="#" onclick="showLoginForm()">Login</a>
               <a href="#" onclick="showRegisterForm()">Register</a>`;
       }
   }

   function showLoginForm() {
       document.querySelector('.container').innerHTML = `
           <div class="login-form">
               <h2>Login</h2>
               <input id="username" placeholder="Username">
               <input id="password" type="password" placeholder="Password">
               <button onclick="login()">Login</button>
           </div>`;
   }

   function showRegisterForm() {
       document.querySelector('.container').innerHTML = `
           <div class="register-form">
               <h2>Register as Client</h2>
               <input id="reg-username" placeholder="Username">
               <input id="reg-email" placeholder="Email">
               <input id="reg-password" type="password" placeholder="Password">
               <input id="reg-phone" placeholder="Phone">
               <textarea id="reg-address" placeholder="Address"></textarea>
               <button onclick="register()">Register</button>
           </div>`;
   }

   async function register() {
       const client = {
           user: {
               username: document.getElementById('reg-username').value,
               email: document.getElementById('reg-email').value,
               password: document.getElementById('reg-password').value
           },
           phone: document.getElementById('reg-phone').value,
           address: document.getElementById('reg-address').value
       };
       const response = await fetch(apiBaseUrl + 'clients/', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(client)
       });
       if (response.ok) {
           alert('Registration successful! Please log in.');
           showLoginForm();
       } else {
           alert('Registration failed. Please try again.');
       }
   }

   async function login() {
       const username = document.getElementById('username').value;
       const password = document.getElementById('password').value;
       const response = await fetch(apiBaseUrl + 'token/', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ username, password })
       });
       const data = await response.json();
       if (data.access) {
           token = data.access;
           localStorage.setItem('token', token);
           await checkUserType();
           if (userType === 'broker') {
               window.location.href = '/admin/';
           } else {
               window.location.href = '/properties/';
           }
       } else {
           alert('Login failed');
       }
   }

   function logout() {
       localStorage.removeItem('token');
       token = null;
       userType = 'guest';
       updateAuthLinks();
       window.location.href = '/';
   }

   async function checkUserType() {
       if (!token) {
           userType = 'guest';
           return;
       }
       const response = await fetch(apiBaseUrl + 'clients/', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       if (response.ok) {
           userType = 'client';
           return;
       }
       const agentResponse = await fetch(apiBaseUrl + 'agents/', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       if (agentResponse.ok) {
           userType = 'agent';
           return;
       }
       const brokerResponse = await fetch(apiBaseUrl + 'brokers/', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       if (brokerResponse.ok) {
           userType = 'broker';
           return;
       }
   }

   async function loadContent() {
       if (window.location.pathname !== '/properties/') {
           if (window.location.pathname === '/' && document.getElementById('book-now')) {
               document.getElementById('book-now').addEventListener('click', () => {
                   if (userType === 'client') {
                       window.location.href = '/properties/';
                   } else {
                       showLoginForm();
                   }
               });
           }
           return;
       }
       const contentDiv = document.getElementById('content');
       contentDiv.innerHTML = '';

       if (userType === 'guest') {
           contentDiv.innerHTML = '<h2>Properties</h2><p>Please log in to view property details or book.</p><div class="property-list" id="property-list"></div>';
           await loadProperties();
       } else if (userType === 'client') {
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
           window.location.href = '/admin/';
       }
   }

   async function loadProperties() {
       const response = await fetch(apiBaseUrl + 'properties/', {
           headers: token ? { 'Authorization': `Bearer ${token}` } : {}
       });
       const properties = await response.json();
       const propertyList = document.getElementById('property-list');
       propertyList.innerHTML = '';
       properties.forEach(prop => {
           const div = document.createElement('div');
           div.className = 'property';
           div.innerHTML = `
               <h3>${prop.title}</h3>
               <p>Price: $${prop.price}</p>
               <p>Type: ${prop.property_type.name}</p>
               ${userType !== 'guest' ? `<button onclick="viewProperty(${prop.id})">View Details</button>` : ''}
               ${userType === 'client' ? `<button onclick="bookProperty(${prop.id})">Book</button>` : ''}
               ${userType === 'agent' ? `<button onclick="editProperty(${prop.id})">Edit</button><button onclick="deleteProperty(${prop.id})">Delete</button>` : ''}`;
           propertyList.appendChild(div);
       });
   }

   async function viewProperty(id) {
       const response = await fetch(apiBaseUrl + `properties/${id}/`, {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       const prop = await response.json();
       document.querySelector('.container').innerHTML = `
           <h2>${prop.title}</h2>
           <p>${prop.description}</p>
           <p>Price: $${prop.price}</p>
           <p>Address: ${prop.address}</p>
           <p>Type: ${prop.property_type.name}</p>
           <p>Agent: ${prop.agent.user.username}</p>
           <button onclick="loadContent()">Back to Properties</button>`;
   }

   async function loadPropertyTypes() {
       const response = await fetch(apiBaseUrl + 'property-types/', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       const types = await response.json();
       const select = document.getElementById('property-type');
       select.innerHTML = '<option value="">Select Type</option>';
       types.forEach(type => {
           select.innerHTML += `<option value="${type.id}">${type.name}</option>`;
       });
   }

   async function addProperty() {
       const property = {
           title: document.getElementById('title').value,
           description: document.getElementById('description').value,
           price: document.getElementById('price').value,
           address: document.getElementById('address').value,
           property_type: document.getElementById('property-type').value,
           agent: 1
       };
       await fetch(apiBaseUrl + 'properties/', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
           },
           body: JSON.stringify(property)
       });
       loadContent();
   }

   async function bookProperty(propertyId) {
       const booking = {
           client: 1,
           property: propertyId,
           status: 'pending'
       };
       await fetch(apiBaseUrl + 'bookings/', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
           },
           body: JSON.stringify(booking)
       });
       alert('Property booked!');
   }

   async function deleteProperty(id) {
       await fetch(apiBaseUrl + `properties/${id}/`, {
           method: 'DELETE',
           headers: { 'Authorization': `Bearer ${token}` }
       });
       loadContent();
   }

   // Carousel functionality
   function changeSlide(direction) {
       const slides = document.querySelectorAll('.carousel-item');
       const totalSlides = slides.length;
       currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
       const carouselInner = document.querySelector('.carousel-inner');
       carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
   }

   // Footer visibility on scroll
   function toggleFooterVisibility() {
       const footer = document.querySelector('.site-footer');
       const scrollPosition = window.innerHeight + window.scrollY;
       const documentHeight = document.documentElement.scrollHeight;

       if (scrollPosition >= documentHeight - 10) {
           footer.classList.add('visible');
       } else {
           footer.classList.remove('visible');
       }
   }

   // Initial setup
   updateAuthLinks();
   checkUserType().then(loadContent);
   window.addEventListener('scroll', toggleFooterVisibility);