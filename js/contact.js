// contact.js

document.addEventListener('DOMContentLoaded', function () {

  emailjs.init('rqMIhtVzj3qylTlUr');

  var submitBtn = document.getElementById('contact-submit-btn');
  var statusEl  = document.getElementById('contact-status');

  submitBtn.addEventListener('click', function () {

    var name     = document.getElementById('contact-name').value.trim();
    var email    = document.getElementById('contact-email').value.trim();
    var category = document.getElementById('contact-category').value;
    var message  = document.getElementById('contact-message').value.trim();

    if (!name || !email || !category || !message) {
      showStatus('Please fill in all fields before submitting.', 'error');
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    emailjs.send('service_mj4b69u', 'template_7nyrt7o', {
      from_name:  name,
      from_email: email,
      subject:    category,
      message:    message
    }).then(function () {
      showStatus('Message sent — thank you!', 'success');
      document.getElementById('contact-name').value     = '';
      document.getElementById('contact-email').value    = '';
      document.getElementById('contact-category').value = '';
      document.getElementById('contact-message').value  = '';
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }, function () {
      showStatus('Something went wrong. Please try again.', 'error');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    });

  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className   = type === 'success' ? 'contact-status-success' : 'contact-status-error';
  }

});