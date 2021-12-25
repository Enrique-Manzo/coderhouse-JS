alert("Hola! Hoy vamos a calcular el índice de masa corporal de tu mascota.");

kilograms = prompt("¿Cuánto pesa tu perro? (en kg)");

height = prompt("¿Qué altura tiene tu perro en cuatro patas? (en cm)");

sex = prompt("¿Cuál es el sexo de tu perro? (M / F)");

bmi = Math.round((Number(kilograms) / Number(height)) * 400);

if (sex.toUpperCase() == "M") {
    if (bmi < 109) {
        alert(`Tu perro podría estar bajo de peso. BMI: ${bmi}`);
    }
    
    else if (bmi >= 109 && bmi <= 121) {
        alert(`Tu perro está bien de peso. BMI: ${bmi}`);
    }

    else {
        alert(`Tu perro podría tener sobrepeso. BMI: ${bmi}`);
    }
} else {
    if (bmi < 105) {
        alert(`Tu perra podría estar baja de peso. BMI: ${bmi}`);
    } else if (bmi >= 105 && bmi < 133) {
        alert(`Tu perra está bien de peso. BMI: ${bmi}`);
    }

    else {
        alert(`Tu perra podría tener sobrepeso. BMI: ${bmi}`);
    }
};