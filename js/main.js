import initContext from './canvas.js';

let canvasElement,
    horizontalMeasureBtn,
    areaMeasureBtn,
    circleMeasureBtn,
    squareMeasureBtn;

window.onload = init;

function init() {
    initElements();

    canvasIntegrateAndImageSet();
}

function initElements() {
    canvasElement = document.getElementById('measureImageCanvas');
    horizontalMeasureBtn = document.getElementById('horizontalMeasureBtn');
    areaMeasureBtn = document.getElementById('areaMeasureBtn');
    circleMeasureBtn = document.getElementById('circleMeasureBtn');
    squareMeasureBtn = document.getElementById('squareMeasureBtn');
    initEvents();
}

function canvasIntegrateAndImageSet() {
    initContext(canvasElement, '../images/sec-image.jpg')
}

function initEvents() {
    horizontalMeasureBtn.addEventListener('click', handleHorizontalDistanceMeasurementClicked);
    areaMeasureBtn.addEventListener('click', handleAreaMeasurementClicked);

    circleMeasureBtn.addEventListener('click', handleCircleMeasureClicked);
    squareMeasureBtn.addEventListener('click', handleSquareMeasurementClicked);
}


function handleHorizontalDistanceMeasurementClicked() {
    console.log('horizontal measure');
    window.state = 'HORIZONTAL';
    canvasElement.style.cursor = 'crosshair'
}

function handleAreaMeasurementClicked() {
    console.log('hey there area measuring');
    window.state = 'AREA';
    canvasElement.style.cursor = 'crosshair'
}

function handleCircleMeasureClicked() {
    console.log('hey there circle measuring');
    window.state = 'CIRCLE';
    canvasElement.style.cursor = 'crosshair'
}

function handleSquareMeasurementClicked() {
    console.log('hey there square measuring');
    window.state = 'SQUARE';
    canvasElement.style.cursor = 'crosshair'
}


