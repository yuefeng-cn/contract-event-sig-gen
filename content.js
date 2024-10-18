function formatEvent(eventText) {
  const regex = /event\s+(\w+)\s*\((.*?)\)/;
  const match = eventText.match(regex);
  
  if (!match) return null;

  const eventName = match[1];
  const params = match[2].split(',').map(param => {
    const [type] = param.trim().split(/\s+/);
    return type === 'uint' ? 'uint256' : type;
  }).join(',');

  return `${eventName}(${params})`;
}

function createFormatButton() {
  const button = document.createElement('button');
  button.textContent = '生成签名';
  button.className = 'format-button';
  button.style.display = 'none';
  document.body.appendChild(button);
  return button;
}

const formatButton = createFormatButton();

document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection().toString().trim();
  if (selection.startsWith('event') && selection.includes('(') && selection.includes(')')) {
    formatButton.style.left = `${e.pageX}px`;
    formatButton.style.top = `${e.pageY}px`;
    formatButton.style.display = 'block';
  } else {
    formatButton.style.display = 'none';
  }
});

function createPopup(content) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  
  const popupContent = document.createElement('div');
  popupContent.className = 'popup-content';
  
  popupContent.innerHTML = `
    <h2>事件签名</h2>
    <div id="result">${content}</div>
    <button id="copyBtn">复制</button>
  `;
  
  overlay.appendChild(popupContent);
  document.body.appendChild(overlay);
  
  document.getElementById('copyBtn').addEventListener('click', function() {
    const result = document.getElementById('result').textContent;
    navigator.clipboard.writeText(result).then(function() {
      showToast('已复制到剪贴板');
      formatButton.style.display = 'none';
      document.body.removeChild(overlay);
    });
  });
  
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      formatButton.style.display = 'none';
    }
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

formatButton.addEventListener('click', function() {
  const selection = window.getSelection().toString().trim();
  const formattedEvent = formatEvent(selection);
  if (formattedEvent) {
    createPopup(formattedEvent);
  }
});

console.log('Content script loaded');
