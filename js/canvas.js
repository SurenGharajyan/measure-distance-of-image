import Calculations from "./calculations.js";

let context, canvasElement;
let IMAGE_WIDTH, IMAGE_HEIGHT;
let points = [], lines = [];
let RED = '#FF0000';
let ONE_PIXEL_MILLIMETER = 0.2645833333;
let image;
let isMeasuring = false;
let round = 5;
let inputElement;
let resetMeasureBtn;
let selectImageSize;
let measureContent;
let startPoint;
let isRectCreating, isCircleCreating;
let calculations;

export default function initContext(canvas, imageSrc) {
    canvasElement = canvas;
    context = canvasElement.getContext('2d');

    initElements();
    calculations = new Calculations();
    setImageToCanvas(imageSrc);
    initEvent(canvasElement);
}

function initElements() {
    resetMeasureBtn = document.getElementById('resetMeasureBtn');
    inputElement = document.getElementById('measureValueInput');
    selectImageSize = document.getElementById('selectSize');
    measureContent = document.getElementById('measureContent');
}

function setImageToCanvas(src) {
    image = new Image();
    image.src = src;
    image.onload = () => {
        // if (!IMAGE_WIDTH) {
        // [IMAGE_WIDTH, IMAGE_HEIGHT] =
        // [24 / ONE_PIXEL_MILLIMETER, 24 / ONE_PIXEL_MILLIMETER]
        // [image.width, image.height];
        // }
        imageBackgroundDraw();
    }
}

function initEvent(canvas) {
    resetMeasureBtn.addEventListener('click', handleOnResetMeasureValue);
    canvas.addEventListener('click', handleCanvasClicked);
    canvas.addEventListener('mousemove', handleCanvasMouseOver);

    selectImageSize.addEventListener('change', (event) => {
        if (selectImageSize.value) {
            handleOnResetMeasureValue();
            const values = selectImageSize.value.split('-');
            [IMAGE_WIDTH, IMAGE_HEIGHT] =
                [values[0] / ONE_PIXEL_MILLIMETER, values[1] / ONE_PIXEL_MILLIMETER];
            measureContent.classList.add('show');
        }
    });

}

function imageBackgroundDraw() {
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
}


function createDot(point) {
    context.beginPath();
    context.arc(point.x, point.y, round, 0, 2 * Math.PI);
    context.strokeStyle = RED;
    context.stroke();
    context.fillStyle = RED;
    context.fill();
}

function createLine(startPoint, point) {
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
}

function createText(point, index) {
    context.font = "20px Arial";
    context.fillText(String.fromCharCode((65 + index)), point.x - 5, point.y - 10);
}

function createSquare(start, move) {
    context.beginPath();
    context.rect(start.x, start.y, move.x - start.x, move.y - start.y);
    context.strokeStyle = RED;
    context.stroke();
}

function createCircle(start, move) {
    context.beginPath();
    context.arc(start.x, start.y, calculations.lineLengthMeasure([start, move]), 0, 2 * Math.PI);
    context.strokeStyle = RED;
    context.stroke();
}

function isFirstNearToLastPoint(points) {
    if (points.length < 2) return;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const xNear = Math.abs(lastPoint.x - firstPoint.x) < round;
    const yNear = Math.abs(lastPoint.y - firstPoint.y) < round;
    return xNear && yNear;
}

function handleCanvasClicked(event) {
    let point = {x: event.layerX, y: event.layerY};
    const canvas = event.target;
    const ratioBtwImageAndCanvas = {x: IMAGE_WIDTH / canvas.width, y: IMAGE_HEIGHT / canvas.height};
    switch (window.state) {
        case "AREA":
        case "HORIZONTAL":
            isRectCreating = false;
            isCircleCreating = false;
            let isNearFirstAndLastPoints;

            if (!points.length) {
                isMeasuring = true;
            }
            if (isMeasuring) {
                points.push(point);
                if (points.length > 1) {
                    lines.push({
                        startX: points[points.length - 2].x,
                        startY: points[points.length - 2].y,
                        endX: points[points.length - 1].x,
                        endY: points[points.length - 1].y
                    })
                }
                isNearFirstAndLastPoints = isFirstNearToLastPoint(points);
                if (isNearFirstAndLastPoints) {
                    [points[points.length - 1].x, points[points.length - 1].y] = [points[0].x, points[0].y];
                }
                createDot(point);
                if (!isNearFirstAndLastPoints) {
                    createText(point, points.length - 1);
                }
            }
            if (window.state === 'HORIZONTAL' && points.length === 2) {
                isMeasuring = false;
                points = points.map((point) => ({
                        x: point.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                        y: point.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                    })
                );
                inputElement.value = calculations.lineLengthMeasure(points) + 'mm';
                window.state = '';
            }

            if (window.state === 'AREA' && isNearFirstAndLastPoints) {
                isMeasuring = false;
                points = points.map((point) => ({
                    x: point.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                    y: point.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                }));
                inputElement.value = calculations.calculatePolygonArea(points) + 'mm';
                window.state = '';
            }

            break;
        case "SQUARE":
            if (startPoint) {
                if (isMeasuring) {
                    isMeasuring = false;
                    startPoint = {
                        x: startPoint.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                        y: startPoint.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                    };
                    point = {
                        x: point.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                        y: point.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                    };

                    inputElement.value = calculations.rectangleMeasure(startPoint, point) + 'mm2';
                }
            } else {
                isMeasuring = true;
                startPoint = point;
            }
            break;
        case "CIRCLE":
            if (startPoint) {

                if (isMeasuring) {
                    isMeasuring = false;
                    startPoint = {
                        x: startPoint.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                        y: startPoint.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                    };
                    point = {
                        x: point.x * ratioBtwImageAndCanvas.x * ONE_PIXEL_MILLIMETER,
                        y: point.y * ratioBtwImageAndCanvas.y * ONE_PIXEL_MILLIMETER
                    };
                    console.log(startPoint, point)
                    inputElement.value = calculations.circleMeasure(startPoint, point) + 'mm2';
                }
            } else {
                isMeasuring = true;
                startPoint = point;
            }
            break;
    }
}


export const handleCanvasMouseOver = (event) => {
    if (isMeasuring) {
        const move = {x: event.layerX, y: event.layerY};
        clearCanvasAddImage();
        switch (window.state) {
            case "AREA":
            case "HORIZONTAL":
                points.forEach((point, index) => {
                    createDot(point);
                    createText(
                        point,
                        index
                    );
                });
                if (points.length) {
                    createLine(
                        {x: points[points.length - 1].x, y: points[points.length - 1].y},
                        move
                    );
                }
                lines.forEach((line) => {
                    createLine(
                        {x: line.startX, y: line.startY},
                        {x: line.endX, y: line.endY}
                    );
                });
                break;
            case "SQUARE":
                createSquare(startPoint, move);
                break;
            case "CIRCLE":
                createCircle(startPoint, move);
                break;
        }
    }
};

function clearCanvasAddImage() {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    imageBackgroundDraw()
}


function handleOnResetMeasureValue() {
    console.log('reset clicked');
    window.state = '';
    startPoint = null;
    points = [];
    lines = [];
    clearCanvasAddImage();
    canvasElement.style.cursor = 'unset';
    inputElement.value = '';
}
