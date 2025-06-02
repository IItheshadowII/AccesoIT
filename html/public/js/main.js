document.addEventListener('DOMContentLoaded', function () {
    const whatsappButton = document.getElementById('whatsapp-button');
    const whatsappChat = document.getElementById('whatsapp-chat');
    const closeChat = document.getElementById('close-chat');

    whatsappButton.addEventListener('click', function () {
        whatsappChat.classList.toggle('active');
    });

    if (closeChat) {
        closeChat.addEventListener('click', function () {
            whatsappChat.classList.remove('active');
        });
    }
});