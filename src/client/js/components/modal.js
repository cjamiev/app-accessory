const closeModal = modalId => {
  return () => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
  };
};

const closeAllModals = event => {
  if (event.target.classList.contains('modal')) {
    [...document.getElementsByClassName('modal')].forEach(component => {
      component.style.display = 'none';
    });
  }
};

const createModal = (modalId, content) => {
  const modalOperations = {
    openModal() {
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
    },
    modalComponent() {
      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal';
      const innerDiv = document.createElement('div');
      innerDiv.className = 'modal-content';
      const closeSpan = document.createElement('span');
      closeSpan.id = modalId + '-close';
      closeSpan.className = 'modal-close';
      closeSpan.innerHTML = '&times;';
      closeSpan.onclick = closeModal(modalId);
      const contentParagraph = document.createElement('p');
      contentParagraph.innerHTML = content;

      innerDiv.appendChild(closeSpan);
      innerDiv.appendChild(contentParagraph);
      modal.appendChild(innerDiv);

      return modal;
    }
  };

  return modalOperations;
};
