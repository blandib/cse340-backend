'use strict';

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select form and all inputs
  const form = document.querySelector('form[action="/inv/update"]');
  if (!form) return; // exit if form not found

  const invMake = document.getElementById('inv_make');
  const invModel = document.getElementById('inv_model');
  const invYear = document.getElementById('inv_year');
  const invPrice = document.getElementById('inv_price');
  const invMiles = document.getElementById('inv_miles');
  const invColor = document.getElementById('inv_color');
  const invDescription = document.getElementById('inv_description');
  const invImage = document.getElementById('inv_image');
  const invThumbnail = document.getElementById('inv_thumbnail');

  // Optional: Live validation
  const validateInput = (input, minLength = 1) => {
    if (input.value.trim().length < minLength) {
      input.classList.add('input-error');
      return false;
    } else {
      input.classList.remove('input-error');
      return true;
    }
  };

  // Example: validate on blur
  [invMake, invModel, invColor].forEach(input => {
    input.addEventListener('blur', () => validateInput(input, 2));
  });

  invDescription.addEventListener('blur', () => validateInput(invDescription, 5));

  // Optional: Image preview
  const imagePreview = document.createElement('img');
  imagePreview.style.maxWidth = '200px';
  imagePreview.style.marginTop = '10px';
  invImage.parentNode.appendChild(imagePreview);

  invImage.addEventListener('input', () => {
    if (invImage.value.trim() !== '') {
      imagePreview.src = invImage.value.trim();
    }
  });

  const thumbnailPreview = document.createElement('img');
  thumbnailPreview.style.maxWidth = '100px';
  thumbnailPreview.style.marginTop = '10px';
  invThumbnail.parentNode.appendChild(thumbnailPreview);

  invThumbnail.addEventListener('input', () => {
    if (invThumbnail.value.trim() !== '') {
      thumbnailPreview.src = invThumbnail.value.trim();
    }
  });

  // Optional: Prevent submission if basic validation fails
  form.addEventListener('submit', (e) => {
    let valid = true;
    valid &= validateInput(invMake, 2);
    valid &= validateInput(invModel, 2);
    valid &= validateInput(invColor, 3);
    valid &= validateInput(invDescription, 5);

    if (!valid) {
      e.preventDefault();
      alert('Please fix the errors in the form before submitting.');
    }
  });
});
const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});
