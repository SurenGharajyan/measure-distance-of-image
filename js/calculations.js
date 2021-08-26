export default class Calculations {

    calculatePolygonArea(vertices) {
        let total = 0;

        for (let i = 0, l = vertices.length; i < l; i++) {
            let addX = vertices[i].x;
            let addY = vertices[i === vertices.length - 1 ? 0 : i + 1].y;
            let subX = vertices[i === vertices.length - 1 ? 0 : i + 1].x;
            let subY = vertices[i].y;

            total += (addX * addY * 0.5);
            total -= (subX * subY * 0.5);
        }

        return Math.abs(total);
    }

    lineLengthMeasure(points) {
        return Math.sqrt(
            Math.pow(Math.abs(points[1].y - points[0].y), 2) +
            Math.pow(Math.abs(points[1].x - points[0].x), 2)
        );
    }

    rectangleMeasure(firstPoint, lastPoint) {
        const length = Math.abs(lastPoint.x - firstPoint.x);
        const height = Math.abs(lastPoint.y - firstPoint.y);
        return length * height;
    }

    circleMeasure(startPoint, point) {
        const radius = this.lineLengthMeasure([startPoint, point]);
        return Math.PI * Math.pow(radius, 2);
    }

}
