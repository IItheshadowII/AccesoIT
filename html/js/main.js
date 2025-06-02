// main.js

document.addEventListener('DOMContentLoaded', () => {
  const whatsappButton = document.getElementById('whatsapp-button');
  const whatsappChat   = document.getElementById('whatsapp-chat');
  const closeChat      = document.getElementById('close-chat');
  const messageInput   = document.getElementById('message-input');
  const sendBtn        = document.getElementById('send-message');
  const chatMessages   = document.getElementById('chat-messages');

  // Abrir/cerrar chat
  whatsappButton.addEventListener('click', () => {
    whatsappChat.classList.toggle('active');
    messageInput.focus();
  });
  closeChat.addEventListener('click', () => {
    whatsappChat.classList.remove('active');
  });

  // Envío por click o Enter
  sendBtn.addEventListener('click', sendWhatsAppMessage);
  messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendWhatsAppMessage();
    }
  });

  async function sendWhatsAppMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let responseText = '';
    try {
      const res = await fetch('/webhook/Jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: text }),
      });

      const txt = await res.text();
      let data = {};

      if (txt) {
        try {
          data = JSON.parse(txt);
        } catch (errJSON) {
          console.warn('Respuesta no es JSON válido:', txt);
          throw new Error(`Respuesta no JSON: ${txt}`);
        }
      }

      if (res.ok && data.response) {
        responseText = data.response;
      } else if (res.ok) {
        responseText = data.message || data.text || txt || '?? Recibido, pero sin respuesta clara.';
      } else {
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

    } catch (err) {
      console.error('Error al llamar al webhook:', err);
      responseText = '? Error de conexión. Intenta de nuevo.';
      appendMessage('bot error', responseText);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return;
    }

    appendMessage('bot', responseText);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Añade un mensaje al chat.
   * `who` puede ser por ejemplo 'user', 'bot' o 'bot error'.
   */
  function appendMessage(who, text) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message');
    who.split(/\s+/).forEach(cls => {
      if (cls) wrapper.classList.add(cls);
    });

    const p = document.createElement('p');
    p.textContent = text;
    wrapper.appendChild(p);

    const ts = document.createElement('span');
    ts.classList.add('time');
    ts.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    wrapper.appendChild(ts);

    chatMessages.appendChild(wrapper);
  }
});
