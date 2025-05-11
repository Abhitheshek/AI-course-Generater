// Initialize syntax highlighting
document.addEventListener('DOMContentLoaded', function() {
  // Apply syntax highlighting to all code blocks
  const codeBlocks = document.querySelectorAll('.syntax-highlighter');
  
  codeBlocks.forEach(block => {
    const theme = block.getAttribute('data-theme');
    const language = block.getAttribute('data-language');
    const code = decodeURIComponent(block.getAttribute('data-code'));
    
    // Apply appropriate styling based on theme
    const pre = block.querySelector('pre');
    if (pre) {
      if (theme === 'atom') {
        pre.style.backgroundColor = '#282c34';
        pre.style.color = '#abb2bf';
      } else if (theme === 'vscode') {
        pre.style.backgroundColor = '#1e1e1e';
        pre.style.color = '#d4d4d4';
      } else {
        // Default to dracula
        pre.style.backgroundColor = '#282a36';
        pre.style.color = '#f8f8f2';
      }
    }
  });
  
  // Add event listeners for theme buttons
  document.querySelectorAll('[id^="theme-"]').forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.id.split('-')[1]; // Extract theme name from button id
      
      // Update all code blocks with the selected theme
      document.querySelectorAll('.syntax-highlighter').forEach(block => {
        block.setAttribute('data-theme', theme);
        
        const pre = block.querySelector('pre');
        if (pre) {
          if (theme === 'atom') {
            pre.style.backgroundColor = '#282c34';
            pre.style.color = '#abb2bf';
          } else if (theme === 'vscode') {
            pre.style.backgroundColor = '#1e1e1e';
            pre.style.color = '#d4d4d4';
          } else {
            // Default to dracula
            pre.style.backgroundColor = '#282a36';
            pre.style.color = '#f8f8f2';
          }
        }
      });
    });
  });
});