document.addEventListener('DOMContentLoaded', function() {
    const checkBMI = document.getElementById('checkBMI');
    const checkBMR = document.getElementById('checkBMR');
    const checkHydration = document.getElementById('checkHydration');
    const checkProtein = document.getElementById('checkProtein');
    const checkIBW = document.getElementById('checkIBW');
    const checkBFP = document.getElementById('checkBFP');

    const heightGroup = document.getElementById('height-input-group');
    const weightGroup = document.getElementById('weight-input-group');
    const ageGroup = document.getElementById('age-input-group');
    const genderGroup = document.getElementById('gender-input-group');
    
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');
    const genderInput = document.getElementById('gender');

    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    function updateInputVisibility() {
        const needsAgeAndGender = checkBMR.checked || checkBFP.checked;
        const needsOnlyGender = checkIBW.checked;

        if (needsAgeAndGender) {
            ageGroup.classList.remove('hidden');
            genderGroup.classList.remove('hidden');
        } else if (needsOnlyGender) {
            ageGroup.classList.add('hidden');
            genderGroup.classList.remove('hidden');
        } else {
            ageGroup.classList.add('hidden');
            genderGroup.classList.add('hidden');
        }
    }

    function calculate() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const age = parseFloat(ageInput.value);
        const gender = genderInput.value;

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            resultDisplay.textContent = 'Please enter valid height and weight.';
            return;
        }

        let resultsOutput = [];

        if (checkBMI.checked) {
            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            
            let bmiCategory = "";
            if (bmi < 18.5) {
                bmiCategory = "Underweight";
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                bmiCategory = "Normal (Healthy Weight)";
            } else if (bmi >= 25 && bmi <= 29.9) {
                bmiCategory = "Overweight";
            } else {
                bmiCategory = "Obese";
            }
            
            resultsOutput.push(`BMI: ${bmi.toFixed(2)} (${bmiCategory})`);
        }

        if (checkBMR.checked) {
            if (isNaN(age) || age <= 0) {
                resultDisplay.textContent = 'Please enter a valid age for BMR.';
                return;
            }
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            resultsOutput.push(`BMR: ${bmr.toFixed(2)} calories/day`);
        }

        if (checkHydration.checked) {
            const hydration = weight * 35;
            resultsOutput.push(`Water Intake: ${hydration} ml`);
        }

        if (checkProtein.checked) {
            const proteinMin = weight * 1.2;
            const proteinMax = weight * 2.0;
            resultsOutput.push(`Protein Goal: ${proteinMin.toFixed(0)}g - ${proteinMax.toFixed(0)}g/day`);
        }

        if (checkIBW.checked) {
            let ibw = 0;
            if (gender === 'male') {
                ibw = 52 + 1.9 * ((height / 2.54) - 60);
            } else {
                ibw = 49 + 1.7 * ((height / 2.54) - 60);
            }
            resultsOutput.push(`Ideal Body Weight: ${ibw.toFixed(2)} kg`);
        }

        if (checkBFP.checked) {
            if (isNaN(age) || age <= 0) {
                resultDisplay.textContent = 'Please enter a valid age for BFP.';
                return;
            }
            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            const genderValue = gender === 'male' ? 1 : 0;
            const bfp = (1.20 * bmi) + (0.23 * age) - (10.8 * genderValue) - 5.4;
            resultsOutput.push(`Body Fat Percentage: ${bfp.toFixed(2)}%`);
        }

        if (resultsOutput.length === 0) {
            resultDisplay.textContent = 'Select at least one metric to calculate!';
            return;
        }

        const finalStr = resultsOutput.join('\n');
        resultDisplay.textContent = finalStr;
        saveToHistory(finalStr);
    }

    function saveToHistory(resultValue) {
        const history = JSON.parse(localStorage.getItem('healthHistory')) || [];
        const newEntry = {
            result: resultValue,
            date: new Date().toLocaleString()
        };

        history.unshift(newEntry);
        if (history.length > 10) history.pop();

        localStorage.setItem('healthHistory', JSON.stringify(history));
        displayHistory();
    }

    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('healthHistory')) || [];
        historyList.innerHTML = '';

        if (history.length === 0) {
            clearHistoryBtn.classList.add('hidden');
        } else {
            clearHistoryBtn.classList.remove('hidden');
        }

        for (let i = 0; i < history.length; i++) {
            const entry = history[i];
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.date} \n ${entry.result}`;
            historyList.appendChild(listItem);
        }
    }

    clearHistoryBtn.addEventListener('click', function() {
        localStorage.removeItem('healthHistory');
        displayHistory();
    });

    [checkBMI, checkBMR, checkHydration, checkProtein, checkIBW, checkBFP].forEach(checkbox => {
        checkbox.addEventListener('change', updateInputVisibility);
    });
    calculateBtn.addEventListener('click', calculate);

    updateInputVisibility();
    displayHistory();
});

window.openModal = function(type) {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');

    if (type === 'about') {
        title.textContent = "About Us";
        text.textContent = "Welcome to WellxFit! It's a simple, easy-to-use health dashboard designed to help you keep track of your daily fitness and nutrition goals in one place.";
    } else if (type === 'contact') {
        title.textContent = "Contact Us";
        text.textContent = "If you have any questions or feedback about the project, feel free to reach out to the developer directly at sussanjosee26@gmail.com.";
    } else if (type === 'privacy') {
        title.textContent = "Privacy Policy";
        text.textContent = "Your data stays with you. Everything you calculate is saved only on your own device's browser. We don't collect, see, or share any of your personal information.";
    } else if (type === 'images') {
        title.textContent = "Image Sources";
        text.textContent = "The background image used in this dashboard was created using generative AI with detailed prompts, making it completely original.";
    }

    modal.classList.remove('hidden');
}

window.closeModal = function() {
    const modal = document.getElementById('info-modal');
    modal.classList.add('hidden');
}