const handleAccordions = () => {
  [...document.getElementsByClassName('accordion')].forEach(component => {
    component.addEventListener('click', function () {
      this.classList.toggle('accordion-active');
      const panel = this.nextElementSibling;
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });
  });
};

const createAccordion = (accordionId, label, content) => {
  const parentDiv = document.createElement('div');
  parentDiv.id = accordionId;
  const collapsibleButton = document.createElement('button');
  collapsibleButton.className = 'accordion';
  collapsibleButton.innerHTML = label;
  const innerPanel = document.createElement('div');
  innerPanel.className = 'accordion-panel';
  const text = document.createElement('p');
  text.innerHTML = content;

  innerPanel.appendChild(text);
  parentDiv.appendChild(collapsibleButton);
  parentDiv.appendChild(innerPanel);

  return parentDiv;
};
