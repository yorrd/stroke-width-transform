import { Image } from 'image-js';
import strokeWidthTransform from '..';

describe('test Stroke Width Transform', () => {
  test('main test', async () => {
    var images = [Image.load('example/sample.jpg'), Image.load('example/sample-output.jpg')];
    await Promise.all(images).then(function (images) {
      var rois = strokeWidthTransform(images[0], {
        scaleInvariant: true,
      });
      var paintedImage = drawRois(images[0], rois);

      expect(paintedImage.getRGBAData()).toEqual(images[1].getRGBAData());
    });
  });
});

function drawRois(image, rois) {
  rois.forEach(function (roi) {
    var small = roi.getMask();
    roi.data = Array.from(small.data);

    // draw bounding boxes
    var mask = roi.getMask();
    var mbr = mask.minimalBoundingRectangle();

    mbr = mbr.map((point) =>
      [
        point[0] + mask.position[0],
        point[1] + mask.position[1]
      ]
    );
    image.paintPolyline(mbr, { color: [255, 0, 0] });
  });

  return image;
}
