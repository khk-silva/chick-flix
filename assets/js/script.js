document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");
    const uploadedImage = document.getElementById("uploadedImage");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const breedResult = document.getElementById("breedResult");
    const breedName = document.getElementById("breedName");
    const detailsBtn = document.getElementById("detailsBtn");
    const detailsModal = document.getElementById("detailsModal");
    const closeModal = document.getElementById("closeModal");

    // Handle image upload button click
    uploadBtn.addEventListener("click", () => {
        imageInput.click(); // Trigger the file input
    });

    // Handle image input change (when a file is selected)
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Update the preview image with the uploaded one
                uploadedImage.src = reader.result;
                imagePreview.style.display = "block"; // Show the image preview
                analyzeBtn.style.display = "block"; // Show the "Analyze" button
                clearBtn.style.display = "block"; // Show the "Clear" button
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    });

    // Handle "Analyze" button click
    analyzeBtn.addEventListener("click", () => {
        // For demonstration, we'll just use a mock breed.
        // Replace this part with your breed classification logic.
        const mockBreed = "Rhode Island Red"; // Example breed name
        breedName.textContent = mockBreed; // Display the breed name
        breedResult.style.display = "block"; // Show the breed result
        analyzeBtn.style.display = "none"; // Hide the "Analyze" button after clicking
        detailsBtn.style.display = "block"; // Show the "View Additional Details" button
    });

    // Handle the Clear button click
    clearBtn.addEventListener("click", () => {
        // Reset to initial state
        imagePreview.innerHTML = `<img src="assets/images/breed-classifications-model/img10.jpg" alt="Default Image">`;
        imagePreview.style.display = "block";

        // Reset buttons visibility
        analyzeBtn.style.display = "none";
        clearBtn.style.display = "none";
        detailsBtn.style.display = "none";

        // Reset breed result display
        breedResult.style.display = "none";
        breedName.textContent = "";  // Clear breed name
    });

    // Handle "View Additional Details" button click
    detailsBtn.addEventListener("click", () => {
        detailsModal.style.display = "block"; // Show the details modal
    });

    // Close modal when clicking on the close button
    closeModal.addEventListener("click", () => {
        detailsModal.style.display = "none"; // Hide the modal
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener("click", (event) => {
        if (event.target === detailsModal) {
            detailsModal.style.display = "none"; // Hide the modal when clicking outside
        }
    });
});
