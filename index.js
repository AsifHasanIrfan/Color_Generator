const defaultColor = {
  red: 218,
  green: 225,
  blue: 245
};

let customColors = ["#DAE1F5"];

const defaultColorPreset = [
  "#606c38",
  "#283618",
  "#fefae0",
  "#dda15e",
  "#bc6c25",
  "#ccd5ae",
  "#e9edc9",
  "#fefae0",
  "#faedcd",
  "#d4a373",
  "#264653",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#e76f51",
];

// Onload Handler
window.onload = () => {
  main();
  updateColorCode(defaultColor);
  displayColorBoxes(document.getElementById('presets'), defaultColorPreset);
  const customColorsString = localStorage.getItem('customColors');
  if (customColors) {
    // customColors = JSON.parse(customColorsString);
    displayColorBoxes(
      document.getElementById("custom_color"),
      JSON.parse(customColorsString)
    );
  }
};

// Main Handler
function main() {
  const generateColor = document.getElementById("cg_btn");
  const presetParent = document.getElementById("presets");
  const colorSliderRed = document.getElementById("color_slider_red");
  const colorSliderGreen = document.getElementById("color_slider_green");
  const colorSliderBlue = document.getElementById("color_slider_blue");
  const colorModeRadio = document.getElementsByName("color_mode");
  const customColorParent = document.getElementById("custom_color");
  const copyBtn = document.getElementById("copy_btn");
  const saveBtn = document.getElementById("save_btn");
  const imageInput = document.getElementById("image");
  const uploadBtn = document.getElementById("upload_btn");
  const bgDeleteBtn = document.getElementById("delete_btn");

  colorSliderRed.addEventListener("change", handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
  colorSliderGreen.addEventListener("change", handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
  colorSliderBlue.addEventListener("change", handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));

  generateColor.addEventListener("click", function () {
    const color = generateDecimalNumber();
    updateColorCode(color);
  });

  const hexColorInput = document.getElementById("hex_input");

  hexColorInput.addEventListener("keyup", function (e) {
    const hexColor = e.target.value;
    if (hexColor && isHexValid(hexColor)) {
      const colorDecimal = convertHexToDecimal(hexColor);
      updateColorCode(colorDecimal);
    } else { }
  });

  presetParent.addEventListener("click", handleCopyColor);
  customColorParent.addEventListener("click", handleCopyColor);

  saveBtn.addEventListener("click", handleSaveCustomColor(customColorParent, hexColorInput));
  uploadBtn.addEventListener("click", function() {
    imageInput.click();
  });

  imageInput.addEventListener('change', handleImageUpload);
  bgDeleteBtn.addEventListener('click', function() {
    const bgPreview = document.getElementById("bg_preview");
    bgPreview.style.background = 'none';
    bgPreview.style.backgroundColor = "#DAE1F5";
    document.getElementById("root").style.background = 'none';
    document.getElementById("root").style.backgroundColor = "#DAE1F5";
    document.getElementById("delete_btn").style.display = "none";
    imageInput.value = null;
    document.getElementById("bg_controller").style.display = "none";
  })

  copyBtn.addEventListener("click", function () {
    const toastMsg = document.getElementById("snackbar");
    const node = getCheckedValue(colorModeRadio);

    if (node === null) {
      throw new Error("Invalid Radio Input.");
    }
    if (node.value === 'hex') {
      const hexColor = document.getElementById("hex_input").value;
      navigator.clipboard.writeText(`#${hexColor}`);
      toastMsg.className = "show";
      toastMsg.innerText = `#${hexColor} Copied`;
      setTimeout(function () {
        toastMsg.className = toastMsg.className.replace("show", "");
      }, 3000);
    } else {
      const rgbColor = document.getElementById("rgb_input").value;
      navigator.clipboard.writeText(rgbColor);
       toastMsg.className = "show";
        toastMsg.innerText = `${rgbColor} Copied`;
       setTimeout(function () {
         toastMsg.className = toastMsg.className.replace("show", "");
       }, 3000);
    }
  });

  document.getElementById("bg_size").addEventListener('change', handleBgController);
  document.getElementById("bg_repeat").addEventListener('change', handleBgController);
  document.getElementById("bg_position").addEventListener('change', handleBgController);
  document.getElementById("bg_attachment").addEventListener('change', handleBgController);
};

function handleColorSlider (colorSliderRed, colorSliderGreen, colorSliderBlue) {
  return function () {
    const color = {
      red: parseInt(colorSliderRed.value),
      green: parseInt(colorSliderGreen.value),
      blue: parseInt(colorSliderBlue.value),
    };

    updateColorCode(color);
  }
};

function handleBgController () {
  document.getElementById("root").style.backgroundSize = document.getElementById("bg_size").value;
  document.getElementById("root").style.backgroundRepeat = document.getElementById("bg_repeat").value;
  document.getElementById("root").style.backgroundPosition = document.getElementById("bg_position").value;
  document.getElementById("root").style.backgroundAttachment = document.getElementById("bg_attachment").value;
}

function handleCopyColor (e) {
  const child = e.target;
  if (child.className === "color_preset_box") {
    navigator.clipboard.writeText(child.getAttribute("preset-value"));
    child.innerText = child.getAttribute("preset-value").substring(1);
  }
};

function handleSaveCustomColor(customColorParent, hexInput) {
  return function () {
    const color = `#${hexInput.value}`;
    if (customColors.includes(color)) {
      alert('Color already exists in your list.');
      return;
    };
    customColors.unshift(color);
    if (customColors.length > 20) {
      customColors = customColors.slice(0, 25)
    }
    localStorage.setItem('customColors', JSON.stringify(customColors));
    removeChildren(customColorParent);
    displayColorBoxes(customColorParent, customColors);
  };
};

function handleImageUpload (e) {
  const bgPreview = document.getElementById("bg_preview");
  const file = e.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  bgPreview.style.background = `url(${imageUrl})`;
  document.getElementById('root').style.background = `url(${imageUrl})`;
  document.getElementById("delete_btn").style.display = "inline";
  document.getElementById('bg_controller').style.display = "block";
}

//
function getCheckedValue (nodes) {
  let checkedValue = null;
  for (let i = 0; i < nodes.length; i++) {
    const element = nodes[i];
    if (element.checked) {
      checkedValue = nodes[i];
      break;
    }
  }
  return checkedValue;
}

// Generate Random Decimal Number For Red, Green, and Blue.
function generateDecimalNumber() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return {
    red,
    green,
    blue
  }
}

// Hex Color Generate Handler
function generateHexColor(color) {
  const {red, green, blue} = color;

  const getTwoCode = (code) => {
    const hex = code.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
};

// RGB Color Generate Handler
function generateRGBColor(color) {
  const {red, green, blue} = color;

  return `rgb(${red}, ${green}, ${blue})`;
};

// Convert Hex Color To RGB Color
function convertHexToDecimal (hex) {
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4), 16);

  return {
    red,
    green,
    blue
  };
}

// update color all the place
function updateColorCode(color) {
   const hexColor = generateHexColor(color);
   const rgbColor = generateRGBColor(color);

  document.getElementById("display").style.backgroundColor = hexColor;
  document.getElementById("hex_input").value = hexColor.substring(1);
  document.getElementById("rgb_input").value = rgbColor;
  document.getElementById("slider_label_red").innerText = color.red;
  document.getElementById("slider_label_green").innerText = color.green;
  document.getElementById("slider_label_blue").innerText = color.blue;
  document.getElementById("color_slider_red").value = color.red;
  document.getElementById("color_slider_green").value = color.green;
  document.getElementById("color_slider_blue").value = color.blue;
};

// Generate Color Presets 
function generateColorPreset (color) {
  const presetBox = document.createElement("div");
  presetBox.className = "color_preset_box";
  presetBox.style.backgroundColor = color;
  presetBox.setAttribute('preset-value', color);

  return presetBox;
}

function displayColorBoxes (parent, colors) {
  colors.forEach((color) => {
    if (isHexValid(color.substring(1))) {
      const colorBox = generateColorPreset(color);
      parent.appendChild(colorBox);
    }
  }); 
};

// remove children from parent
function removeChildren(parent) {
  let children = parent.lastElementChild;
  while (children) {
    parent.removeChild(children);
    children = parent.lastElementChild;
  }
}

// Check Hex Code Valid
function isHexValid(color) {
  if (color.length !== 6) return false;

  return /^[0-9A-Fa-f]{6}$/i.test(color)
}