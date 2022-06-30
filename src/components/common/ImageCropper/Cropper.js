function getMinPositions(imgSize, zoom) {
  return [
    (imgSize.width * zoom) / 2 - imgSize.width / 2,
    (imgSize.height * zoom) / 2 - imgSize.height / 2,
  ];
}
function getMaxPositions(imgSize, zoom, cropperSize) {
  return [
    cropperSize.width - (imgSize.width * zoom) / 2 - imgSize.width / 2,
    cropperSize.height - (imgSize.height * zoom) / 2 - imgSize.height / 2,
  ];
}

function getSafePosition(position, imgSize, cropperSize, zoom, offset = 0) {
  const [minX, minY] = getMinPositions(imgSize, zoom);
  const [maxX, maxY] = getMaxPositions(imgSize, zoom, cropperSize);
  return [
    Math.max(Math.min(position.x, minX + offset), maxX - offset),
    Math.max(Math.min(position.y, minY + offset), maxY - offset),
  ];
}

export class Cropper {
  #img;
  #cropper;
  #aspectRatio;
  #isMouseDown = false;
  #isMoving = false;
  #isMoved = false;
  #zoom = 1;
  #offsets;
  #boundHandleMouseDown;
  #boundHandleMouseMove;
  #boundHandleMouseUp;
  #externalListeners;
  #cropperSize = { width: 0, height: 0 };

  constructor(img, cropper, aspectRatio, savedData, listeners) {
    this.#img = img;
    this.#cropper = cropper;
    this.#aspectRatio = aspectRatio;
    this.#externalListeners = listeners;

    if (savedData) {
      this.#isMoved = false;
      this.#zoom = savedData.zoom;
    }

    this.#updateCropperSize();

    this.#img.onload = () => {
      this.#resizeImageAfterChange();
      if (!this.#isMoved) this.#centerImage();
      if (savedData) {
        this.#tempDisableTransitions();
        this.#img.style.left = savedData.x + 'px';
        this.#img.style.top = savedData.y + 'px';
        this.#img.style.transform = `scale(${savedData.zoom})`;
      }
    };

    this.#boundHandleMouseDown = this.#handleMouseDown.bind(this);
    cropper.addEventListener('mousedown', this.#boundHandleMouseDown);
  }

  #tempDisableTransitions() {
    this.#img.style.transition = 'none';

    setTimeout(() => {
      this.#img.style.transition = null;
    }, 50);
  }

  #updateCropperSize() {
    if (this.#aspectRatio < 1) {
      this.#cropperSize.height = this.#cropper.parentNode.offsetWidth;
      this.#cropperSize.width = this.#cropperSize.height * this.#aspectRatio;
    } else {
      this.#cropperSize.width = this.#cropper.parentNode.offsetWidth;
      this.#cropperSize.height = this.#cropperSize.width / this.#aspectRatio;
    }
  }
  destroy() {
    // Clear listeners
    this.#cropper.removeEventListener('mousedown', this.#boundHandleMouseDown);
    this.#cropper.removeEventListener('mousemove', this.#boundHandleMouseMove);
    document.removeEventListener('mouseup', this.#boundHandleMouseUp);
  }

  #handleMouseDown(e) {
    if (this.#isMouseDown) return;
    this.#isMouseDown = true;
    this.#offsets = [this.#img.offsetLeft - e.clientX, this.#img.offsetTop - e.clientY];

    this.#boundHandleMouseMove = this.#handleMouseMove.bind(this);
    this.#cropper.addEventListener('mousemove', this.#boundHandleMouseMove);

    this.#boundHandleMouseUp = this.#handleMouseUp.bind(this);
    document.addEventListener('mouseup', this.#boundHandleMouseUp);
    this.#externalListeners?.onCropStart();
  }

  #handleMouseUp() {
    if (!this.#isMouseDown) return;

    this.#isMouseDown = false;
    this.#cropper.removeEventListener('mousemove', this.#boundHandleMouseMove);
    document.removeEventListener('mouseup', this.#boundHandleMouseUp);

    requestAnimationFrame(() => {
      const data = this.getCropData();
      this.#externalListeners?.onCropEnd(data);
    });
  }

  #handleMouseMove(e) {
    if (this.#isMouseDown && !this.#isMoving) {
      this.#isMoving = true;
      requestAnimationFrame(() => {
        this.#isMoved = true;
        const [offsetX, offsetY] = this.#offsets;
        const [x, y] = getSafePosition(
          { x: e.clientX + offsetX, y: e.clientY + offsetY },
          { width: this.#img.offsetWidth, height: this.#img.offsetHeight },
          {
            width: this.#cropperSize.width,
            height: this.#cropperSize.height,
          },
          this.#zoom,

          60
        );
        this.#img.style.left = x + 'px';
        this.#img.style.top = y + 'px';
        this.#isMoving = false;
      });
    }
  }

  #centerImage() {
    this.#img.style.left = this.#cropperSize.width / 2 - this.#img.offsetWidth / 2 + 'px';
    this.#img.style.top = this.#cropperSize.height / 2 - this.#img.offsetHeight / 2 + 'px';
  }

  #resizeImageAfterChange() {
    const { width, height } = getObjectCoverSize(
      this.#cropperSize.width,
      this.#cropperSize.height,
      this.#img.naturalWidth,
      this.#img.naturalHeight
    );

    this.#img.style.width = width + 'px';
    this.#img.style.height = height + 'px';
  }

  #adjustImage() {
    const [x, y] = getSafePosition(
      { x: this.#img.offsetLeft, y: this.#img.offsetTop },
      { width: this.#img.offsetWidth, height: this.#img.offsetHeight },
      {
        width: this.#cropperSize.width,
        height: this.#cropperSize.height,
      },
      this.#zoom
    );
    this.#img.style.left = x + 'px';
    this.#img.style.top = y + 'px';
    return [x, y];
  }

  setZoom(zoom) {
    if (zoom === this.#zoom) return;

    this.#zoom = zoom;
    this.#img.style.transform = `scale(${this.#zoom})`;
    const request = requestAnimationFrame(() => this.#adjustImage());
    return request;
  }

  setAspectRatio(aspectRatio) {
    if (aspectRatio === this.#aspectRatio) return;

    this.#aspectRatio = aspectRatio;

    this.#updateCropperSize();
    this.#resizeImageAfterChange();
    this.#adjustImage();
  }

  getCropData() {
    // Adjust image, prevent it from going outside the cropper
    const [x, y] = this.#adjustImage();
    const [minX, minY] = getMinPositions(
      {
        width: this.#img.offsetWidth,
        height: this.#img.offsetHeight,
      },
      this.#zoom
    );

    const data = {
      realX: minX + x * -1,
      realY: minY + y * -1,
      x: x,
      y: y,
      zoom: this.#zoom,
      cropHeight: this.#cropperSize.height,
      cropWidth: this.#cropperSize.width,
      imgWidth: this.#img.offsetWidth,
      imgHeight: this.#img.offsetHeight,
    };
    return data;
  }

  getCroppedImage() {
    const cropData = this.getCropData();
    const canvas = document.createElement('canvas');
    canvas.width = this.#img.naturalWidth;
    canvas.height = this.#img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.#img, 0, 0);
    const width = Math.round(
      (this.#img.naturalWidth * cropData.cropWidth) / (cropData.imgWidth * cropData.zoom)
    );
    const height = Math.round(
      (this.#img.naturalHeight * cropData.cropHeight) / (cropData.imgHeight * cropData.zoom)
    );

    const x = (this.#img.naturalWidth / cropData.imgWidth / this.#zoom) * cropData.realX;
    const y = (this.#img.naturalHeight / cropData.imgHeight / this.#zoom) * cropData.realY;
    const data = ctx.getImageData(x, y, width, height);

    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((file) => resolve(file), 'image/jpeg');
    });
  }
}

function getObjectCoverSize(containerWidth, containerHeight, width, height) {
  const objectRatio = width / height;
  const containerRatio = containerWidth / containerHeight;
  let targetWidth = 0;
  let targetHeight = 0;

  if (objectRatio < containerRatio) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / objectRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * objectRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
  };
}
