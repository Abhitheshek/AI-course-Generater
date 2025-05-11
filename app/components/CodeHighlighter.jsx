"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';

// Inline styles for syntax highlighting themes
const syntaxThemes = {
  dracula: {
    background: '#282a36',
    color: '#f8f8f2',
    comment: '#6272a4',
    keyword: '#ff79c6',
    string: '#50fa7b',
    number: '#bd93f9',
    function: '#8be9fd',
    operator: '#f8f8f2',
    variable: '#f1fa8c'
  },
  atom: {
    background: '#282c34',
    color: '#abb2bf',
    comment: '#5c6370',
    keyword: '#c678dd',
    string: '#98c379',
    number: '#d19a66',
    function: '#61afef',
    operator: '#56b6c2',
    variable: '#c678dd'
  },
  vscode: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    comment: '#6a9955',
    keyword: '#c586c0',
    string: '#ce9178',
    number: '#569cd6',
    function: '#dcdcaa',
    operator: '#d4d4d4',
    variable: '#9cdcfe'
  }
};

const CodeHighlighter = ({ content }) => {
  const [processedContent, setProcessedContent] = useState('');
  const [currentTheme, setCurrentTheme] = useState('dracula');
  
  // Process content to find code blocks
  useEffect(() => {
    if (typeof window !== 'undefined' && content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const preElements = doc.querySelectorAll('pre');
      
      // Replace each pre element with a highlighted version
      preElements.forEach((pre, index) => {
        const codeElement = pre.querySelector('code') || pre;
        const language = codeElement.className.replace('language-', '') || 'javascript';
        const codeContent = codeElement.textContent;
        
        // Create a styled code block
        const highlightedBlock = document.createElement('div');
        highlightedBlock.className = 'my-6 rounded-lg overflow-hidden code-block';
        highlightedBlock.dataset.index = index;
        
        // Create the header with language and theme buttons
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center bg-gray-800 px-4 py-2 text-xs text-gray-200';
        header.innerHTML = `
          <span>${language}</span>
          <div class="flex space-x-2">
            <button 
              class="theme-button px-2 py-1 rounded bg-purple-500"
              data-theme="dracula"
              data-block="${index}"
            >
              Dracula
            </button>
            <button 
              class="theme-button px-2 py-1 rounded bg-gray-700"
              data-theme="atom"
              data-block="${index}"
            >
              Atom
            </button>
            <button 
              class="theme-button px-2 py-1 rounded bg-gray-700"
              data-theme="vscode"
              data-block="${index}"
            >
              VSCode
            </button>
          </div>
        `;
        
        // Create the code container
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';
        codeContainer.dataset.theme = 'dracula';
        
        // Create the pre and code elements
        const preElement = document.createElement('pre');
        preElement.style.margin = '0';
        preElement.style.borderRadius = '0 0 0.5rem 0.5rem';
        preElement.style.fontSize = '0.9rem';
        preElement.style.backgroundColor = syntaxThemes.dracula.background;
        preElement.style.color = syntaxThemes.dracula.color;
        preElement.style.padding = '1rem';
        preElement.style.overflowX = 'auto';
        preElement.style.lineHeight = '1.5';
        
        // Add line numbers
        const lines = codeContent.split('\n');
        let numberedCode = '';
        
        lines.forEach((line, i) => {
          // Process the line to add syntax highlighting
          const processedLine = highlightSyntax(line, 'dracula');
          
          // Add line number and the processed line
          numberedCode += `<div class="code-line">
            <span class="line-number">${i + 1}</span>
            <span class="line-content">${processedLine}</span>
          </div>`;
        });
        
        preElement.innerHTML = numberedCode;
        
        // Add CSS for line numbers
        const style = document.createElement('style');
        style.textContent = `
          .code-line {
            display: flex;
            width: 100%;
          }
          .line-number {
            user-select: none;
            text-align: right;
            padding-right: 1em;
            min-width: 2.5em;
            color: #666;
            border-right: 1px solid #444;
            margin-right: 1em;
          }
          .line-content {
            flex: 1;
          }
        `;
        
        // Assemble the code block
        codeContainer.appendChild(preElement);
        highlightedBlock.appendChild(header);
        highlightedBlock.appendChild(codeContainer);
        highlightedBlock.appendChild(style);
        
        // Replace the original pre element
        pre.replaceWith(highlightedBlock);
      });
      
      setProcessedContent(doc.body.innerHTML);
    }
  }, [content]);
  
  // Function to apply basic syntax highlighting
  const highlightSyntax = (code, theme) => {
    const themeColors = syntaxThemes[theme];
    
    // Simple regex-based syntax highlighting
    // This is a simplified version - a real implementation would use a proper tokenizer
    let highlighted = code
      // Highlight strings
      .replace(/(["'`])(.*?)\1/g, `<span style="color: ${themeColors.string}">$&</span>`)
      // Highlight numbers
      .replace(/\b(\d+)\b/g, `<span style="color: ${themeColors.number}">$&</span>`)
      // Highlight keywords
      .replace(/\b(function|return|if|else|for|while|class|const|let|var|import|export|from|async|await)\b/g, 
        `<span style="color: ${themeColors.keyword}">$&</span>`)
      // Highlight comments
      .replace(/\/\/(.*)/g, `<span style="color: ${themeColors.comment}">$&</span>`);
    
    return highlighted;
  };
  
  // Add event handlers for theme buttons
  useEffect(() => {
    if (typeof window !== 'undefined' && processedContent) {
      const handleThemeChange = (e) => {
        if (e.target.classList.contains('theme-button')) {
          const theme = e.target.getAttribute('data-theme');
          const blockIndex = e.target.getAttribute('data-block');
          const codeBlock = document.querySelector(`.code-block[data-index="${blockIndex}"]`);
          
          if (!codeBlock) return;
          
          // Reset all buttons in this code block
          codeBlock.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.remove('bg-purple-500', 'bg-blue-500', 'bg-green-500');
            btn.classList.add('bg-gray-700');
          });
          
          // Highlight the selected button
          if (theme === 'dracula') {
            e.target.classList.remove('bg-gray-700');
            e.target.classList.add('bg-purple-500');
          } else if (theme === 'atom') {
            e.target.classList.remove('bg-gray-700');
            e.target.classList.add('bg-blue-500');
          } else if (theme === 'vscode') {
            e.target.classList.remove('bg-gray-700');
            e.target.classList.add('bg-green-500');
          }
          
          // Update the code container theme
          const codeContainer = codeBlock.querySelector('.code-container');
          codeContainer.dataset.theme = theme;
          
          // Update the pre element styles
          const pre = codeContainer.querySelector('pre');
          pre.style.backgroundColor = syntaxThemes[theme].background;
          pre.style.color = syntaxThemes[theme].color;
          
          // Update the syntax highlighting
          const lines = codeContainer.querySelectorAll('.line-content');
          lines.forEach(line => {
            const originalText = line.textContent;
            line.innerHTML = highlightSyntax(originalText, theme);
          });
        }
      };
      
      document.addEventListener('click', handleThemeChange);
      
      return () => {
        document.removeEventListener('click', handleThemeChange);
      };
    }
  }, [processedContent]);
  
  return (
    <>
      {processedContent ? (
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </>
  );
};

export default CodeHighlighter;