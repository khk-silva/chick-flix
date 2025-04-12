
$(document).ready(function () {
  
  var uploadedImageSrc = "";


  $("#uploadBtn").on("click", function () {
    $("#imageUpload").click(); 
  });

  // Show the "Analyze" button after the image is uploaded
  $("#imageUpload").on("change", function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        uploadedImageSrc = e.target.result; 
        $("#uploadedImage").attr("src", uploadedImageSrc); // Update image preview
        $("#analyzeBtn").show(); 
      };
      reader.readAsDataURL(file);
    }
  });

 
  $("#analyzeBtn").on("click", function () {
    var formData = new FormData();
    var fileInput = $("#imageUpload")[0];
    formData.append("file", fileInput.files[0]);

    
    $(this).prop("disabled", true);

   
    $("#uploadBtn").hide();
    $("#clearBtn").show();
    $("#analyzeBtn").hide();

    // Send the image to the Flask backend for breed classification
    $.ajax({
      url: "http://127.0.0.1:5000/predict", 
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        
        const pureBreeds = [
          "Leghorn", "Australorp", "PlymouthRock", "Rhode Island Red", "Wyandotte", "Brahma"
        ];
        const crossBreeds = [
          "Black star", "Blue Plymouth Rock", "Golden chicken", "Lohman"
        ];

        let breedCategory = "";
        if (pureBreeds.includes(response.breed)) {
          breedCategory = "Pure Breed Chicken";
        } else if (crossBreeds.includes(response.breed)) {
          breedCategory = "Cross Breed Chicken";
        }

        
        $("#breedCategory").text(breedCategory);
        $("#breedName").text(response.breed);
        $("#breedResultCategory").show();
        $("#breedResultName").show();
        $("#detailsBtn").show(); 
        
      },
      error: function (xhr, status, error) {
        $("#analyzeBtn").prop("disabled", false);
        if (xhr.responseJSON && xhr.responseJSON.error) {
          alert(xhr.responseJSON.error); // Display the error message from backend
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    });
   });


  
  $("#clearBtn").on("click", function () {
    $("#imageUpload").val(""); // Clear the input field
    $("#uploadedImage").attr("src", "assets/images/breed-classifications-model/img10.jpg"); // Reset image
    //$("#breedResult").hide(); // Hide breed result
    $("#breedResultCategory").hide();
    $("#breedResultName").hide();
    $("#analyzeBtn").hide(); 
    $("#clearBtn").hide();
    $("#detailsBtn").hide();
    $("#uploadBtn").show();

    $("#analyzeBtn").prop("disabled", false);

  });

  
  const breed_names = [
    "Australorp", "Black star", "Blue Plymouth Rock", "Brahma",
    "Golden chicken", "Leghorn", "Lohman", "PlymouthRock", "Rhode Island Red",
    "Wyandotte"
  ];

// Breed details data
const breed_details = {
  "Australorp": {
    origin: "Australia",
    size: "Large",
    weight: "Hens: 2.5 - 3.1 kg, Roosters: 3.2 - 4.1 kg",
    colorVarieties: "Black (most common), blue, and white",
    eggColor: "Light brown",
    eggsPerYear: "250-300 eggs per year",
    eggSize: "Large",
    breedPurpose: "Dual-purpose (eggs & meat)",
    temperament: "Friendly, calm, good with children",
    climateTolerance: "All climates, heat and cold hardy"
  },
  "Black star": {
    origin: "USA",
    size: "Medium",
    weight: "Hens: 2.7 - 3.2 kg, Roosters: 3.4 - 4.0 kg",
    colorVarieties: "Black with gold (hens), solid black (roosters)",
    eggColor: "Brown",
    eggsPerYear: "280-300 eggs per year",
    eggSize: "Large",
    breedPurpose: "Egg-laying",
    temperament: "Hardy, docile, active",
    climateTolerance: "All climates"
  },
  "Blue Plymouth Rock": {
    origin: "USA",
    size: "Large",
    weight: "Hens: 2.8 - 3.4 kg, Roosters: 3.6 - 4.3 kg",
    colorVarieties: "Blue, barred, black, buff, columbian",
    eggColor: "Brown",
    eggsPerYear: "200-250 eggs per year",
    eggSize: "Large",
    breedPurpose: "Dual-purpose",
    temperament: "Friendly, docile",
    climateTolerance: "Cold and moderate climates",
    image:"assets/images/breed-classifications-model/black-australorp-chicken.png"
  },
  "Brahma": {
    origin: "USA",
    size: "Large",
    weight: "Hens: 3.0 - 4.0 kg, Roosters: 4.5 - 5.5 kg",
    colorVarieties: "Light, dark, buff",
    eggColor: "Brown",
    eggsPerYear: "150-200 eggs per year",
    eggSize: "Medium to large",
    breedPurpose: "Meat production",
    temperament: "Gentle, calm",
    climateTolerance: "Cold hardy"
  },
  "Golden chicken": {
    origin: "USA",
    size: "Medium",
    weight: "Hens: 2.5 - 3.0 kg, Roosters: 3.5 - 4.0 kg",
    colorVarieties: "Golden brown",
    eggColor: "Brown",
    eggsPerYear: "250-280 eggs per year",
    eggSize: "Medium to large",
    breedPurpose: "Egg-laying",
    temperament: "Calm, friendly",
    climateTolerance: "All climates"
  },
  "Leghorn": {
    origin: "Italy",
    size: "Medium",
    weight: "Hens: 1.8 - 2.2 kg, Roosters: 2.3 - 3.0 kg",
    colorVarieties: "White, brown, black, buff",
    eggColor: "White",
    eggsPerYear: "280-320 eggs per year",
    eggSize: "Large",
    breedPurpose: "Egg-laying",
    temperament: "Active, independent",
    climateTolerance: "Heat tolerant"
  },
  "Lohman": {
    origin: "Germany",
    size: "Medium",
    weight: "Hens: 2.0 - 2.5 kg, Roosters: 2.5 - 3.2 kg",
    colorVarieties: "Brown, white",
    eggColor: "Brown",
    eggsPerYear: "290-320 eggs per year",
    eggSize: "Large",
    breedPurpose: "Egg-laying",
    temperament: "Docile, easy to manage",
    climateTolerance: "All climates"
  },
  "PlymouthRock": {
    origin: "USA",
    size: "Large",
    weight: "Hens: 2.7 - 3.6 kg, Roosters: 3.6 - 4.5 kg",
    colorVarieties: "Barred, buff, blue, black, columbian, white, silver",
    eggColor: "Light brown",
    eggsPerYear: "200-250 eggs per year",
    eggSize: "Large",
    breedPurpose: "Dual-purpose",
    temperament: "Friendly, calm",
    climateTolerance: "All climates"
  },
  "Rhode Island Red": {
    origin: "USA",
    size: "Large",
    weight: "Hens: 2.7 - 3.4 kg, Roosters: 3.5 - 4.2 kg",
    colorVarieties: "Dark red",
    eggColor: "Brown",
    eggsPerYear: "250-300 eggs per year",
    eggSize: "Large",
    breedPurpose: "Dual-purpose",
    temperament: "Hardy, adaptable",
    climateTolerance: "All climates"
  },
  "Wyandotte": {
    origin: "USA",
    size: "Medium",
    weight: "Hens: 2.5 - 3.2 kg, Roosters: 3.2 - 3.8 kg",
    colorVarieties: "Gold, silver, black, white, blue",
    eggColor: "Brown",
    eggsPerYear: "200-250 eggs per year",
    eggSize: "Large",
    breedPurpose: "Dual-purpose",
    temperament: "Calm, friendly",
    climateTolerance: "Cold hardy"
  }
};


  function openBreedDetails(breed) {
    const details = breed_details[breed];
    if (details) {
        let detailsHtml = `
            <div class="breed-container">
                <ul class="breed-details">
                    <li><strong>Origin:</strong> ${details.origin}</li>
                    <li><strong>Size:</strong> ${details.size}</li>
                    <li><strong>Weight:</strong> ${details.weight}</li>
                    <li><strong>Color Varieties:</strong> ${details.colorVarieties}</li>
                    <li><strong>Egg Color:</strong> ${details.eggColor}</li>
                    <li><strong>Eggs Per Year:</strong> ${details.eggsPerYear}</li>
                    <li><strong>Egg Size:</strong> ${details.eggSize}</li>
                    <li><strong>Breed Purpose:</strong> ${details.breedPurpose}</li>
                    <li><strong>Temperament:</strong> ${details.temperament}</li>
                    <li><strong>Climate Tolerance:</strong> ${details.climateTolerance}</li>
                </ul>
                
                 <img id="modalImage" src="${uploadedImageSrc}" alt="Uploaded Image" class="breed-modal-image">
            </div>
        `;

        $("#breedDetailsList").html(detailsHtml); 
        $("#detailsModal").fadeIn(); 
    }
}


  // Handle 'View Additional Details' button click
  $("#detailsBtn").on("click", function () {
    var selectedBreed = $("#breedName").text();
    openBreedDetails(selectedBreed); 
  });

  
  $("#closeModal").on("click", function () {
    $("#detailsModal").hide();
  });
});
