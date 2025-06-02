class NeighborhoodQuestion {
  constructor(surveyQuestionDiv) {
    this.outerDiv = surveyQuestionDiv;
    this.rowCount = null;
    this.columnCount = null;
    this.optionsData = null;
    this.centerLabelText = null;
    this.isExperimental = null;
    this.experimentalTraits = null;
    this.experimentalScenarios = null;
    this.traitArray = null;
    this.scenarioName = null;
    // TODO maybe store scenario weight as a probability instead of a raw weight
    this.scenarioWeight = null;
    this.scenarioProportions = null;
  }

  //add question div with question text
  addQuestionText(questionText) {
    this.outerDiv.innerHTML = "";
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = questionText;
    this.outerDiv.appendChild(questionDiv);
  }

  // start building the gridWrapper and gridContainer
  startGridContainer(columnCount, rowCount) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;

    const gridWrapper = document.createElement("div");
    gridWrapper.className = "grid-wrapper";

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";
    gridContainer.id = "grid-id";
    // qualtrics breaks string templating with dollar and brace signs
    gridContainer.style.gridTemplateColumns =
      "repeat(" + columnCount + ", 100px)";
    gridContainer.style.gridTemplateRows = "repeat(" + rowCount + ", 110px)";

    gridWrapper.appendChild(gridContainer);
    this.outerDiv.appendChild(gridWrapper);
    return gridContainer;
  }

  selectWeightedScenario() {
    const scenarios = this.experimentalScenarios;
    const totalWeight = scenarios.reduce(
      (sum, scenario) => sum + scenario.weight,
      0,
    );

    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (const scenario of scenarios) {
      cumulativeWeight += scenario.weight;
      if (random < cumulativeWeight) {
        return scenario;
      }
    }
  }

  // randomize traits for experimental scenario
  randomizeExperimentalTraits() {
    const houseCount = this.rowCount * this.columnCount - 1;

    // randomly select a scenario
    const scenario = this.selectWeightedScenario();
    const scenarioProportions = scenario.proportions;
    this.scenarioProportions = scenarioProportions;
    this.scenarioName = scenario.name;
    this.scenarioWeight = scenario.weight;

    const total = scenarioProportions.reduce((a, b) => a + b, 0);
    const cumulativeProportion = [];
    let proportionSum = 0;
    for (let p of scenarioProportions)
      cumulativeProportion.push((proportionSum += p / total));

    const traitArray = [];
    for (let i = 0; i < houseCount; i++) {
      const r = Math.random();
      traitArray.push(
        this.experimentalTraits[cumulativeProportion.findIndex((c) => r <= c)],
      );
    }

    const centerHouseIndex =
      this.calculateCenterHouseRow() * this.columnCount +
      this.calculateCenterHouseColumn();
    traitArray.splice(centerHouseIndex, 0, "your house");
    this.traitArray = traitArray;
  }

  //build center house for grid
  buildCenterHouse(houseContainer) {
    const houseDiv = document.createElement("div");
    houseDiv.className = "house center-house";
    houseDiv.id = "center-house-id";

    const centerLabel = document.createElement("div");
    centerLabel.className = "center-house-label";
    if (this.centerLabelText) {
      centerLabel.innerHTML = this.centerLabelText;
    } else {
      centerLabel.innerHTML = "Your<br>House";
    }

    houseDiv.appendChild(centerLabel);
    houseContainer.appendChild(houseDiv);
  }

  //add image to house container
  addHouseImage(houseContainer) {
    // TODO maybe make svg configurable/uploadable
    const wrapper = document.createElement("div");
    wrapper.classList.add("house-image-wrapper");
    wrapper.innerHTML = `
    <svg viewBox="0 0 485 522" xmlns="http://www.w3.org/2000/svg" overflow="hidden"
         width="100" height="120" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(-666 -99)">
        <path d="M909 105.5 1036.86 237.4 1036.86 136.697 1084.85 136.697 1084.85 286.906 1145.5 349.473 1084.85 349.473 1084.85 615.5 733.151 615.5 733.151 349.473 672.5 349.473Z"
              stroke="#000000" stroke-width="11" stroke-linejoin="round" stroke-miterlimit="10"
              fill="none" fill-rule="evenodd" />
      </g>
    </svg>
  `;
    houseContainer.appendChild(wrapper);
  }

  addExperimentalLabel(houseContainer) {
    if (!this.isExperimental) {
      return;
    }
    const contentContainer =
      houseContainer.getElementsByClassName("content-container")[0];
    const i = parseFloat(
      contentContainer
        .getElementsByClassName("select-menu")[0]
        .querySelector("select").dataset.houseIndex,
    );
    const assignedLabel = document.createElement("div");
    assignedLabel.classList.add("pre-assigned-label");
    assignedLabel.textContent = this.traitArray[i];
    contentContainer.prepend(assignedLabel);
  }

  addDropdownAndLabel(houseContainer, rowIndex, columnIndex) {
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("select-menu");

    const selectElement = document.createElement("select");
    const i = rowIndex * this.columnCount + columnIndex;
    selectElement.setAttribute("data-house-index", i);
    selectElement.setAttribute(
      "aria-label",
      "Select attribute for house " + (i + 1),
    );

    const initialOption = document.createElement("option");
    initialOption.value = "";
    initialOption.disabled = true;
    initialOption.selected = true;
    initialOption.textContent = "Select";
    selectElement.appendChild(initialOption);

    this.optionsData.forEach((optionText) => {
      const optionElement = document.createElement("option");
      optionElement.value = optionText;
      optionElement.text = optionText;
      selectElement.appendChild(optionElement);
    });
    selectContainer.appendChild(selectElement);
    contentContainer.appendChild(selectContainer);
    const selectedLabel = document.createElement("div");
    selectedLabel.className = "selected-label";
    selectedLabel.style.display = "none";
    contentContainer.appendChild(selectedLabel);

    houseContainer.appendChild(contentContainer);

    selectElement.addEventListener("change", function () {
      selectedLabel.innerText = selectElement.value;
      selectedLabel.style.display = "block";
      selectContainer.style.display = "none";
    });

    houseContainer.addEventListener("click", function (event) {
      if (event.target.tagName.toLowerCase() !== "select") {
        selectContainer.style.display = "block";
        selectElement.focus();
        selectedLabel.style.display = "none";
      }
    });
  }

  //build neighbor house for grid
  buildNeighborHouse(houseContainer, rowIndex, columnIndex) {
    this.addHouseImage(houseContainer);

    this.addDropdownAndLabel(houseContainer, rowIndex, columnIndex);

    this.addExperimentalLabel(houseContainer);
  }

  calculateCenterHouseRow() {
    return Math.ceil(this.rowCount / 2) - 1;
  }

  calculateCenterHouseColumn() {
    return Math.ceil(this.columnCount / 2) - 1;
  }

  // fill grid with houses
  populateGrid(gridContainer) {
    // loop through rows
    for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
      // loop through columns
      for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
        const houseContainer = document.createElement("div");
        houseContainer.classList.add("house-container");

        if (
          rowIndex === this.calculateCenterHouseRow() &&
          columnIndex === this.calculateCenterHouseColumn()
        ) {
          this.buildCenterHouse(houseContainer);
        } else {
          this.buildNeighborHouse(houseContainer, rowIndex, columnIndex);
        }

        gridContainer.appendChild(houseContainer);
      }
    }
  }

  // add next button to submit data to qualtrics
  addNextButton(qualtricsQuestionObject) {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.style.textAlign = "center";

    const customNextButton = document.createElement("button");
    customNextButton.textContent = "Next";
    customNextButton.style.marginTop = "20px";
    customNextButton.style.padding = "10px 20px";
    customNextButton.style.fontSize = "16px";
    customNextButton.style.display = "inline-block";

    buttonWrapper.appendChild(customNextButton);
    this.outerDiv.appendChild(buttonWrapper);

    customNextButton.addEventListener(
      "click",
      function () {
        this.buttonEventListener(qualtricsQuestionObject);
      }.bind(this),
    );
  }

  // prepare data for submission
  makeLabelArray() {
    const houses = this.outerDiv.querySelectorAll(
      ".grid-container .house-container",
    );
    const labels = [];

    for (let i = 0; i < houses.length; i++) {
      const house = houses[i];
      const centerLabel = house.querySelector(".center-house-label");

      if (centerLabel) {
        // your house
        labels.push(centerLabel.textContent); // this ends up converting "Your<br>House" to "YourHouse" but that's probably fine
      } else {
        //other house
        labels.push(house.querySelector("select").value || "");
      }
    }
    return labels;
  }

  // event listener for next button, submits data to qualtrics
  buttonEventListener(qualtricsQuestionObject) {
    const houses = this.outerDiv.querySelectorAll(
      ".grid-container .house-container",
    );
    let unfilled = false;

    //check if grid is filled
    for (let i = 0; i < houses.length; i++) {
      //could replace this check with looking for the center label or unify with the check that happens elsewhere building the label array
      if (
        i ===
        this.calculateCenterHouseRow() * this.columnCount +
          this.calculateCenterHouseColumn()
      )
        continue; // skip center house
      const selectElement = houses[i].querySelector("select");
      if (!selectElement.value) {
        unfilled = true;
        break;
      }
    }

    let userConfirmed = false;
    if (unfilled) {
      // TODO consider using a custom modal rather than browser builtin.
      userConfirmed = window.confirm(
        "Some houses are unfilled. You may need to scroll to see all houses.\n\n Click Cancel to finish filling in houses or OK to submit partly empty.",
      );
    }
    if (!unfilled || userConfirmed) {
      // if filled, click the qualtrics next button
      if (qualtricsQuestionObject) {
        qualtricsQuestionObject.clickNextButton();
        const labels = this.makeLabelArray();
        Qualtrics.SurveyEngine.setEmbeddedData(
          "neighborhood_question_chosen_labels",
          labels.join("|"),
        );
        console.log("Selected labels submitted to Qualtrics");
        if (this.isExperimental) {
          Qualtrics.SurveyEngine.setEmbeddedData(
            "neighborhood_question_experimental_scenario_name",
            this.scenarioName,
          );
          Qualtrics.SurveyEngine.setEmbeddedData(
            "neighborhood_question_experimental_scenario_weight",
            this.scenarioWeight,
          );
          Qualtrics.SurveyEngine.setEmbeddedData(
            "neighborhood_question_experimental_proportions",
            this.scenarioProportions.join("|"),
          );
          Qualtrics.SurveyEngine.setEmbeddedData(
            "neighborhood_question_experimental_labels",
            this.traitArray.join("|"),
          );
          console.log("Experimental labels submitted to Qualtrics");
        }
      } else {
        console.log("User submitted answers");
      }
    }
  }

  // Function to render the survey question as a live, interactive grid
  renderQuestion(
    questionText,
    columnCount,
    rowCount,
    dropdownOptionsInput,
    centerLabelText = null,
    isExperimental = false,
    experimentalTraits = null,
    experimentalScenarios = null,
    qualtricsQuestionObject = null,
  ) {
    //the qualtricsQuestionObject should only be defined when we're actually in qualtrics, and lets us do things like click next and submit data to qualtrics
    if (qualtricsQuestionObject !== null) {
      // hide qualtrics's internal next button to later replace with our own
      qualtricsQuestionObject.hideNextButton();
    }

    this.addQuestionText(questionText);

    const gridContainer = this.startGridContainer(columnCount, rowCount);

    this.optionsData = dropdownOptionsInput;
    this.optionsData.sort(() => Math.random() - 0.5);

    this.centerLabelText = centerLabelText;

    this.isExperimental = isExperimental;
    this.experimentalTraits = experimentalTraits;
    this.experimentalScenarios = experimentalScenarios;

    if (isExperimental) {
      this.randomizeExperimentalTraits();
    }

    this.populateGrid(gridContainer);

    this.centerGrid();

    this.addNextButton(qualtricsQuestionObject);
  }

  // default example rendering
  renderDefault(isExperimental = false) {
    let questionText;
    if (isExperimental) {
      questionText = "Who has which ice cream? Fill in the grid:";
    } else {
      questionText = "Who lives where? Fill in the grid:";
    }
    this.renderQuestion(
      questionText,
      5,
      3,
      ["Dwarves", "Elves", "Hobbits"],
      null,
      isExperimental,
      ["Chocolate", "Vanilla", "Mint Chip"],
      [
        {
          name: "All chocolate",
          proportions: [1, 0, 0],
          weight: 30,
        },
        {
          name: "Even mix",
          proportions: [1, 1, 1],
          weight: 30,
        },
        {
          name: "No chocolate",
          proportions: [0, 60, 40],
          weight: 40,
        },
      ],
    );
  }

  centerGrid() {
    // could think about moving this out of the class
    // TODO more testing in qualtrics, since layout and centering seems particularly sensitive to how the page is set up
    const grid = document.getElementById("grid-id");

    // TODO: sometimes a bit of the bottom row gets cut off and this is off by a bit
    grid.scrollLeft = (grid.scrollWidth - grid.clientWidth) / 2;
    grid.scrollTop = (grid.scrollHeight - grid.clientHeight) / 2;
  }
}

class FormInputs {
  constructor() {
    this.questionTextInput = document.getElementById("questionTextInput");
    this.columnInput = document.getElementById("columnInput");
    this.rowInput = document.getElementById("rowInput");
    this.dropdownOptionsInput = document.getElementById("dropdownOptionsInput");
    this.centerLabelInput = document.getElementById("centerHouseTextInput");

    this.experimentalRadioInput = document.getElementById(
      "experimentalDesignSelector",
    );
    this.blankNeighborhoodRadio = document.getElementById(
      "blankNeighborhoodDesignSelector",
    );

    this.experimentalTraitsInput =
      document.getElementById("experimentalTraits");
    this.experimentalProportionsInput = document.getElementById(
      "experimentalProportions",
    );
  }

  allInputs() {
    return [
      this.questionTextInput,
      this.columnInput,
      this.rowInput,
      this.dropdownOptionsInput,
      this.centerLabelInput,
      this.experimentalRadioInput,
      this.blankNeighborhoodRadio,
      this.experimentalTraitsInput,
      this.experimentalProportionsInput,
    ];
  }
}

// Update live preview whenever the user types something
function handleInputChange(
  formInputs,
  neighborhoodQuestion,
  surveyQuestionDiv,
) {
  let rowData = formInputs.rowInput.value;
  let columnData = formInputs.columnInput.value;
  let questionText = formInputs.questionTextInput.value;
  let optionsData = makeDropdownOptionList(formInputs.dropdownOptionsInput);
  let centerLabelText = formInputs.centerLabelInput.value;
  let isExperimental = formInputs.experimentalRadioInput.checked;
  let experimentalTraits = makeDropdownOptionList(
    formInputs.experimentalTraitsInput,
  );
  let experimentalScenarios = parseExperimentalScenarios(
    formInputs.experimentalProportionsInput,
  );

  if (!rowData && !columnData && !questionText && optionsData.length === 0) {
    neighborhoodQuestion.renderDefault(isExperimental);
  } else if (
    parseFloat(rowData) > 0 &&
    parseFloat(columnData) > 0 &&
    optionsData.length > 0
  ) {
    if (isExperimental) {
      if (
        experimentalTraits.length === 0 ||
        experimentalScenarios.length === 0
      ) {
        // TODO better experimentalProportions check
        surveyQuestionDiv.innerHTML =
          "<p>Please enter experimental traits and proportions or switch back to blank neighborhood design to see the live preview.</p>";
        return;
      }
    }

    neighborhoodQuestion.renderQuestion(
      questionText,
      parseFloat(columnData),
      parseFloat(rowData),
      optionsData,
      centerLabelText,
      isExperimental,
      experimentalTraits,
      experimentalScenarios,
    );
  } else {
    surveyQuestionDiv.innerHTML =
      "<p>Please enter a row count, a column count, and dropdown options to see the live preview.</p>";
  }
}

function makeDropdownOptionList(dropdownOptionsInput) {
  return dropdownOptionsInput.value
    .split(",")
    .map((option) => option.trim())
    .filter((option) => option);
}

function parseExperimentalScenarios() {
  const scenarios = document.querySelectorAll("#scenarios-container .scenario");
  const parsedScenarios = [];

  scenarios.forEach((scenario) => {
    const proportionsInput = scenario.querySelector(
      'input[name="proportions"]',
    ).value;
    const weightInput = scenario.querySelector('input[name="weight"]').value;

    // Check if proportions are entered correctly and are in the right format
    const proportionArray = proportionsInput.split(",").map(Number);

    if (
      proportionArray.length > 0 &&
      proportionArray.every((num) => !isNaN(num))
    ) {
      parsedScenarios.push({
        name: scenario.querySelector('input[name="scenarioName"]').value,
        proportions: proportionArray,
        weight: parseFloat(weightInput) || 1, // default to 1 if no frequency is entered
        // TODO consider if default weight is good idea
      });
    }
  });
  return parsedScenarios;
}

function addExperimentVisibilityListeners() {
  const radios = document.getElementsByName("experiment_design");
  const experimentalDiv = document.getElementById(
    "experimentalScenariosContent",
  );
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "experimental_scenarios" && radio.checked) {
        experimentalDiv.style.display = "block";
      } else {
        experimentalDiv.style.display = "none";
      }
    });
  });
}

function buildAndUpdatePreview() {
  const surveyQuestionDiv = document.getElementById("surveyQuestion");

  const neighborhoodQuestion = new NeighborhoodQuestion(surveyQuestionDiv);

  // Initialize live preview with default options
  neighborhoodQuestion.renderDefault();

  const formInputs = new FormInputs();

  formInputs.allInputs().forEach((input) => {
    input.addEventListener("input", () =>
      handleInputChange(formInputs, neighborhoodQuestion, surveyQuestionDiv),
    );
  });

  addExperimentVisibilityListeners();

  handleInputChange(formInputs, neighborhoodQuestion, surveyQuestionDiv);
}

document.addEventListener("DOMContentLoaded", buildAndUpdatePreview);

function copyQualtricsJS() {
  // this might need to be substantially refactored if it gets complicated enough
  let qualtricsJS = [];
  qualtricsJS.push(
    `Qualtrics.SurveyEngine.addOnload( function () {
      const surveyQuestionDiv = document.getElementById("surveyQuestion");
  
      const neighborhoodQuestion = new NeighborhoodQuestion(surveyQuestionDiv);
  
      neighborhoodQuestion.renderQuestion(`,
    JSON.stringify(document.getElementById("questionTextInput").value) + ",",
    JSON.stringify(document.getElementById("columnInput").value) + ",",
    JSON.stringify(document.getElementById("rowInput").value) + ",",

    JSON.stringify(
      makeDropdownOptionList(document.getElementById("dropdownOptionsInput")),
    ) + ",",
    JSON.stringify(document.getElementById("centerHouseTextInput").value) + ",",
    JSON.stringify(
      document.getElementById("experimentalDesignSelector").checked,
    ) + ",",
    JSON.stringify(
      makeDropdownOptionList(document.getElementById("experimentalTraits")),
    ) + ",",
    JSON.stringify(parseExperimentalScenarios()),
    `,
      this,
      );
  })`,
    NeighborhoodQuestion.toString(),
  );
  navigator.clipboard
    .writeText(qualtricsJS.join("\n"))
    .then(() => {
      console.log("Text successfully copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

function copyQualtricsHTML() {
  let styleTag = document.head.getElementsByTagName("style")[0];

  let qualtricsHTML = [
    "<style>",
    styleTag.innerHTML.toString(),
    "</style>",
    `<!-- Section for custom question content -->
  <div class="survey-question" id="surveyQuestion">`,
    document.getElementById("questionTextInput").value,
    "</div>",
  ];
  navigator.clipboard
    .writeText(qualtricsHTML.join("\n"))
    .then(() => {
      console.log("Text successfully copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

//logic for adding experimental scenarios
let scenarioCount = 0;

function addScenario() {
  const container = document.getElementById("scenarios-container");
  const template = document.getElementById("scenario-template");
  const clone = template.content.cloneNode(true);

  scenarioCount++;
  const label = clone.querySelector(".scenario-label");
  label.textContent = `Scenario ${scenarioCount}:`;

  container.appendChild(clone);
}

function removeScenario(button) {
  const scenarioDiv = button.closest(".scenario");
  scenarioDiv.remove();
}

// Add one scenario on page load
window.addEventListener("DOMContentLoaded", addScenario);

function serializeInputs() {
  const inputSection = document.querySelector(".input-section");
  const data = {};

  // Save simple inputs and textareas
  inputSection.querySelectorAll("input, textarea").forEach((el) => {
    if (el.type === "radio") {
      if (el.checked) data[el.id] = el.value;
    } else {
      data[el.id || el.name] = el.value;
    }
  });

  // Save scenarios
  const scenarios = [];
  inputSection
    .querySelectorAll("#scenarios-container .scenario")
    .forEach((el) => {
      scenarios.push({
        name: el.querySelector('input[name="scenarioName"]').value,
        proportions: el.querySelector('input[name="proportions"]').value,
        weight: el.querySelector('input[name="weight"]').value,
      });
    });

  data["scenarios"] = scenarios;
  return JSON.stringify(data);
}

function deserializeInputs(json) {
  const inputSection = document.querySelector(".input-section");
  const data = JSON.parse(json);

  for (const [key, value] of Object.entries(data)) {
    if (key === "scenarios") {
      // Clear existing scenarios
      document.getElementById("scenarios-container").innerHTML = "";

      value.forEach((scenario) => {
        addScenario(); // assumes your existing addScenario() populates DOM
        const container = document.querySelectorAll(
          "#scenarios-container .scenario",
        );
        const latest = container[container.length - 1];

        latest.querySelector('input[name="scenarioName"]').value =
          scenario.name;
        latest.querySelector('input[name="proportions"]').value =
          scenario.proportions;
        latest.querySelector('input[name="weight"]').value = scenario.weight;
      });
    } else {
      const el = inputSection.querySelector(`#${key}`);
      if (!el) continue;

      if (el.type === "radio") {
        const radio = inputSection.querySelector(
          `input[name="${el.name}"][value="${value}"]`,
        );
        if (radio) radio.checked = true;
      } else {
        el.value = value;
      }
    }
  }

  //TODO consider refactoring this visibility
  // Toggle experimentalScenariosContent visibility based on selected radio
  const experimentalDesign =
    data["experimentalDesignSelector"] ||
    data["blankNeighborhoodDesignSelector"];
  document.getElementById("experimentalScenariosContent").style.display =
    experimentalDesign === "experimental_scenarios" ? "block" : "none";

  buildAndUpdatePreview();
}

function downloadInputs() {
  // TODO add some sort of version to serialization to track when features change
  const dataStr = serializeInputs();
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "neighborhood_question_inputs.json";
  a.click();
}

function uploadInputs(file) {
  const reader = new FileReader();
  reader.onload = () => deserializeInputs(reader.result);
  reader.readAsText(file);
}

function triggerFileInput() {
  document.getElementById("file-upload").click(); // This triggers the hidden file input click
}
