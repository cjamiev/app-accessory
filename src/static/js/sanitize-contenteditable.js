const editableElements = document.querySelectorAll('[contenteditable]');
editableElements.forEach(el => {
  el.addEventListener('paste', () => {
    setTimeout(() => {
      const currentContent = el.innerHTML;
      const sanitizedContent = currentContent.replace(/(<([^>]+)>)/ig, '');

      el.innerHTML = sanitizedContent;
    }, 50);
  });
});