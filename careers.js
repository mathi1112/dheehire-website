document.getElementById('applicationForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const button = document.getElementById('submitApplication');
  const file = document.getElementById('cv').files[0];
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!file) {
    status.textContent = 'Please select your CV.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    status.textContent = 'Your CV must be 5 MB or smaller.';
    return;
  }
  if (!allowedTypes.includes(file.type) || !/\.(pdf|doc|docx)$/i.test(file.name)) {
    status.textContent = 'Please upload a PDF, DOC or DOCX file.';
    return;
  }

  button.disabled = true;
  button.textContent = 'Submitting...';
  status.style.color = '';
  status.textContent = 'Uploading your application securely...';

  try {
    const response = await fetch('/api/apply', {
      method: 'POST',
      body: new FormData(form)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to submit your application.');

    status.textContent = 'Thank you! Your application and CV have been sent successfully.';
    status.style.color = '#16804a';
    form.reset();
  } catch (error) {
    status.textContent = error.message || 'Something went wrong. Please try again later.';
    status.style.color = '#b42318';
  } finally {
    button.disabled = false;
    button.textContent = 'Submit application ↗';
  }
});
