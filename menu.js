document.addEventListener("DOMContentLoaded", () => {
  // Sidebar menu
  const menuHTML = `
    <div class="logo-container">
      <img src="main.png" alt="Rolex Logo" />
      <h1>Rolex Transportation Pvt Ltd</h1>
    </div>

    

    <ul class="menu">
      <li><a href="home.html">🏠<i class="fas fa-home"></i> Home</a></li>
      <li><a href="customer-interface.html">📦<i class="fas fa-box"></i>Customer interface</a></li>
      <li><a href="Driver-interface.html">🚚<i class="fas fa-truck"></i> Drivers interface </a></li>
      <li><a href="Owener interface.html">🚚<i class="fas fa-truck"></i> Owner interface</a></li>
      <li><a href="Reduce Empty trips .html">📖<i class="fas fa-address-book"></i> Reduce Empty trips </a></li>

      <li>
        <input type="checkbox" id="services-toggle" class="toggle-submenu">
        <label for="services-toggle">
          🛠️ EMERGENCY
          <span class="arrow">▶</span>
        </label>
        <ul class="submenu">
          <li><a href="customer.html">📖<i class="fas fa-address-book"></i> Customers Emergency</a></li>
          <li><a href="Drivers.html">📖<i class="fas fa-address-book"></i> Emergency Assets</a></li>
        </ul>
      </li>

      
    </ul>
  `;
  document.querySelector(".left").innerHTML = menuHTML;

  // Submenu that shows on right when Post is clicked
  const postSubmenu = document.createElement("div");
  postSubmenu.className = "post-submenu hidden";
  postSubmenu.innerHTML = `
    <ul>
      <li><a href="create-post.html">➕  Post a load </a></li>
      <li><a href="manage-posts.html">➕ Attach a lorry</a></li>
    </ul>
  `;
  document.querySelector(".right").appendChild(postSubmenu);

  // Toggle logic
  document.addEventListener("click", (e) => {
    const isPostBtn = e.target.closest(".post-btn");
    const isInsideSubmenu = e.target.closest(".post-submenu");

    if (isPostBtn) {
      e.preventDefault(); // prevent navigation
      postSubmenu.classList.toggle("hidden");
    } else if (!isInsideSubmenu) {
      postSubmenu.classList.add("hidden");
    }
  });
});
