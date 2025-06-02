// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply saved theme
  body.classList.add(savedTheme + '-theme');
  
  themeToggle.addEventListener('click', function() {
    if (body.classList.contains('light-theme')) {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Sort Dropdown Functionality
  const sortDropdown = document.getElementById('sortDropdown');
  sortDropdown.addEventListener('change', function() {
    // This would be implemented based on your actual data sorting needs
    console.log('Sorting by:', this.value);
    // You would typically call a function here to sort and re-render the table
  });
  
  // Quick Action Button
  const quickActionBtn = document.getElementById('quickActionBtn');
  quickActionBtn.addEventListener('click', function() {
    // This could open a modal or perform another quick action
    alert('Quick action triggered! This could open a form or perform another action.');
  });
  
  // Table row click handler (for demonstration)
  const tableRows = document.querySelectorAll('#historyTableBody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
      if (!e.target.closest('button')) {
        // Only trigger if not clicking a button inside the row
        console.log('Row clicked:', this);
        // You might show more details in a modal or navigate somewhere
      }
    });
  });
  
  // Animate elements on scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.glass-card, .table-container');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial state for animation
  const animatedElements = document.querySelectorAll('.glass-card, .table-container');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Run once on load
  animateOnScroll();
  
  // Then run on scroll
  window.addEventListener('scroll', animateOnScroll);
});