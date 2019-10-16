const copyToClipboard = text => {
  const copyText = document.createElement('textarea');
  copyText.value = text;
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  document.body.removeChild(copyText);
};