// Definição da porta utilizada, é necessário que seja a mesma do servidor!
const PORT = 3000;

const getAllVehicles = async () => {
    try {
        const dataResponse = await fetch(`http://localhost:${PORT}/api/vehicles`, {
            method: 'GET',
            mode: 'cors',
        });
        const data = await dataResponse.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const getVehicle = async (id) => {
    try {
        const dataResponse = await fetch(`http://localhost:${PORT}/api/vehicles/${id}`, {
            method: 'GET',
            mode: 'cors',
        });
        const data = await dataResponse.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const createVehicle = async (bodyData) => {
    try {
        const dataResponse = await fetch(`http://localhost:${PORT}/api/vehicles`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(bodyData)
        });
        const data = await dataResponse.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const editVehicle = async (id, bodyData) => {
    try {
        const dataResponse = await fetch(`http://localhost:${PORT}/api/vehicles/${id}`, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(bodyData)
        });
        const data = await dataResponse.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const deleteVehicle = async (id) => {
    try {
        const dataResponse = await fetch(`http://localhost:${PORT}/api/vehicles/${id}`, {
            method: 'DELETE',
            mode: 'cors',
        });
        const data = await dataResponse.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

class Vehicle {
    constructor(id, model, brand, type, availability) {
        this.id = id
        this.model = model;
        this.brand = brand;
        this.type = type;
        this.availability = availability;
    }
}

async function addVehicleToLibrary (model, brand, type, availability) {
    await createVehicle({ model, brand, type, availability });
}

async function editVehicleToLibrary (id, model, brand, type, availability) {
    await editVehicle(id, { model, brand, type, availability });
}

// Cria os elementos HTML de um cartão com os dados de um determinado veículo
function createCard(vehicle) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    if (!vehicle.availability) cardContainer.classList.add("unavailable");

    const vehicleId = document.createElement('p');
    const vehicleModel = document.createElement("h3");
    const vehicleBrand = document.createElement("h4");
    const vehicleType = document.createElement("p");
    const vehicleAvailabilityDiv = document.createElement("div");
    const vehicleAvailabilityText = document.createElement("p");
    const buttonsDiv = document.createElement("div");

    vehicleId.innerHTML = `id#${vehicle.id}`;
    vehicleModel.innerHTML = vehicle.model;
    vehicleBrand.innerHTML = vehicle.brand;
    vehicleType.innerHTML = `Tipo: ${vehicle.type}`;
    vehicleAvailabilityDiv.className = "vehicle-available";
    vehicleAvailabilityText.innerHTML = "Veículo disponível para locação?";
    buttonsDiv.className = "buttons-div";

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.dataset.index = vehicle.id;
    editButton.addEventListener('click', async (e) => {
        console.log("EDIT");

        document.getElementById("modalOne").style.display = "block";
        document.querySelector(".vehicle-form").dataset.index = vehicle.id;
        document.getElementById("confirm-button").innerHTML = "Editar veículo";

        document.getElementById("vehicle-model").value = vehicle.model;
        document.getElementById("vehicle-brand").value = vehicle.brand;
        document.getElementById("vehicle-type").value = vehicle.type;
        document.getElementById("isAvailable").checked = vehicle.availability;
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.dataset.index = vehicle.id;
    deleteButton.addEventListener('click', async (e) => {
        await deleteVehicle(e.target.dataset.index);
        showVehicleLibrary();
    });

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    const availableCheckbox = document.createElement("input");
    availableCheckbox.type = "checkbox";
    availableCheckbox.checked = vehicle.availability;
    availableCheckbox.dataset.index = vehicle.id;
    availableCheckbox.addEventListener("change", async (e) => {
        await editVehicle(e.target.dataset.index, {
            model: vehicle.model,
            brand: vehicle.brand,
            type: vehicle.type,
            availability: e.target.checked
        })
        showVehicleLibrary();
    });

    vehicleAvailabilityDiv.appendChild(vehicleAvailabilityText);
    vehicleAvailabilityDiv.appendChild(availableCheckbox);

    cardContainer.appendChild(vehicleId);
    cardContainer.appendChild(vehicleModel);
    cardContainer.appendChild(vehicleBrand);
    cardContainer.appendChild(vehicleType);
    cardContainer.appendChild(vehicleAvailabilityDiv);
    cardContainer.appendChild(buttonsDiv);

    return cardContainer;
};

// Limpa os campos do formulário da janela modal
function cleanInputs() {
    document.getElementById("vehicle-model").value = "";
    document.getElementById("vehicle-brand").value = "";
    document.getElementById("vehicle-type").value = "";
    document.getElementById("isAvailable").checked = false;
};

// Função ordenação de array auxiliar
function mergeSort (array) {
    if (array.length === 1) return array;
    const sortedArray = [];
    const leftArray = mergeSort(array.slice(0, array.length / 2));
    const rightArray = mergeSort(array.slice(array.length / 2));
    while (leftArray.length !== 0 && rightArray.length !== 0) {
        (leftArray[0].id <= rightArray[0].id) ? sortedArray.push(leftArray.splice(0, 1)[0]) : sortedArray.push(rightArray.splice(0, 1)[0]);
    }
    return (leftArray.length === 0) ? sortedArray.concat(rightArray) : sortedArray.concat(leftArray);
}

// Cria um cartão para cada veículo no banco de dados
async function showVehicleLibrary() {
    const myVehicleLibrary = mergeSort(await getAllVehicles());

    const container = document.querySelector(".container");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    for (let i = 0; i < myVehicleLibrary.length; i += 1) {
        container.appendChild(createCard(myVehicleLibrary[i]));
    }

};

showVehicleLibrary();

//
// Elementos da janela modal com o formulário 
//

const addVehicleBtn = document.querySelector("#add-vehicle");
addVehicleBtn.addEventListener("click", () => {
    document.getElementById("modalOne").style.display = "block";
    document.querySelector(".vehicle-form").dataset.index = "";
    document.getElementById("confirm-button").innerHTML = "Adicionar veículo";
})

let closeBtns = [...document.querySelectorAll(".close")];
closeBtns.forEach(function (btn) {
    btn.onclick = function () {
        let modal = btn.closest(".modal");
        modal.style.display = "none";
    };
});

window.onclick = function (event) {
    if (event.target.className === "modal") {
        event.target.style.display = "none";
    }
};

// Formulário que adiciona ou edita um veículo
const vehicleForm = document.querySelector(".vehicle-form");
vehicleForm.addEventListener("submit", async () => {
    const index = document.querySelector(".vehicle-form").dataset.index;
    if (index === "") {
        await addVehicleToLibrary(document.getElementById("vehicle-model").value,
        document.getElementById("vehicle-brand").value,
        document.getElementById("vehicle-type").value,
        document.getElementById("isAvailable").checked);

    } else {
        await editVehicleToLibrary(index, document.getElementById("vehicle-model").value,
        document.getElementById("vehicle-brand").value,
        document.getElementById("vehicle-type").value,
        document.getElementById("isAvailable").checked);
    }
    
    document.getElementById("modalOne").style.display = "none";
    await showVehicleLibrary();
    cleanInputs();
});