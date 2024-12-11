document.getElementById('image1').addEventListener('change', function (event) {
    previewImage(event.target, 'preview1', 'remove1');
});

document.getElementById('image2').addEventListener('change', function (event) {
    previewImage(event.target, 'preview2', 'remove2');
});

document.querySelectorAll('.remove-button').forEach((button) => {
    button.addEventListener('click', function () {
        const previewId = this.getAttribute('data-preview');
        const inputId = this.getAttribute('data-input');
        const removeId = this.id;
        resetPreview(previewId, inputId, this.id);
    });
});

document.getElementById('face-verification-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const image1Input = document.getElementById('image1');
    const image2Input = document.getElementById('image2');
    formData.append('image1', document.getElementById('image1').files[0]);
    formData.append('image2', document.getElementById('image2').files[0]);

    const result = document.getElementById('result');
    const imagePreview1 = document.getElementById('image-preview-1');
    const imagePreview2 = document.getElementById('image-preview-2');
    const removeButton1 = document.getElementById('remove-button-1');
    const removeButton2 = document.getElementById('remove-button-2');

    try {
        const response = await fetch('http://127.0.0.1:5000/verify', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        const result = document.getElementById('result');
        if (response.ok) {
            result.textContent = data.match
                ? 'The images match!'
                : 'The images do not match!';
            result.style.color = data.match ? 'teal' : 'salmon';
        } else {
            result.textContent = data.error || 'Error occurred!';
            result.style.color = 'salmon'
        }
    } catch (err) {
        console.error(err);
        document.getElementById('result').textContent = 'Connection error!';
        document.getElementById('result').style.color = 'salmon'
    }

    function resetImagesAndResult() {
        // Clear image previews and reset their content
        imagePreview1.style.backgroundImage = '';
        imagePreview1.textContent = 'No Image';
        imagePreview2.style.backgroundImage = '';
        imagePreview2.textContent = 'No Image';

        // Hide remove buttons
        removeButton1.classList.add('hidden');
        removeButton2.classList.add('hidden');

        // Reset the file inputs
        image1Input.value = '';
        image2Input.value = '';

        // Clear result message
        result.textContent = '';
    }
});

function previewImage(input, previewId, removeId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    const removeButton = document.getElementById(removeId)

    if (file){
        const reader = new FileReader();
        reader.onload = function (e){
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.textContent = '';
            removeButton.classList.remove('hidden')
        };
        reader.readAsDataURL(file);
    } else {
        resetPreview(previewId, input.id, removeId)
    }
}

function resetPreview(previewId, inputId, removeId) {
    const preview = document.getElementById(previewId);
    const input = document.getElementById(inputId);
    const removeButton = document.getElementById(removeId)

    preview.style.backgroundImage = '';
    preview.textContent = 'No Image';
    input.value = ''; // Clear the file input
    removeButton.classList.add('hidden')
}