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

  constructor(img, cropper, aspectRatio, savedData, listeners) {
    this.#img = img;
    this.#cropper = cropper;
    this.#aspectRatio = aspectRatio;

    if (savedData) {
      this.#isMoved = false;
      this.#zoom = savedData.zoom;
    }

    this.#externalListeners = listeners;

    this.#img.onload = () => {
      this.#resizeImageAfterChange();
      if (!this.#isMoved) this.#centerImage();
      if (savedData) {
        this.#img.style.transition = 'none';
        this.#img.style.left = savedData.x + 'px';
        this.#img.style.top = savedData.y + 'px';
        this.#img.style.transform = `scale(${savedData.zoom})`;
        setTimeout(() => {
          this.#img.style.transition = null;
        }, 10);
      }
    };

    this.#boundHandleMouseDown = this.#handleMouseDown.bind(this);
    cropper.addEventListener('mousedown', this.#boundHandleMouseDown);
  }

  destroy() {
    // Clear listeners
    removeEventListener('mousedown', this.#boundHandleMouseDown);
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
            width: this.#cropper.offsetWidth,
            height: this.#cropper.offsetHeight,
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
    this.#img.style.left = this.#cropper.offsetWidth / 2 - this.#img.offsetWidth / 2 + 'px';
    this.#img.style.top = this.#cropper.offsetHeight / 2 - this.#img.offsetHeight / 2 + 'px';
  }

  #resizeImageAfterChange() {
    if (this.#aspectRatio > 1) {
      this.#img.style.width = this.#img.naturalHeight < this.#img.naturalWidth ? '100%' : 'auto';
      this.#img.style.height = this.#img.naturalWidth < this.#img.naturalHeight ? '100%' : 'auto';
    } else {
      this.#img.style.width = this.#img.naturalHeight > this.#img.naturalWidth ? '100%' : 'auto';
      this.#img.style.height = this.#img.naturalWidth > this.#img.naturalHeight ? '100%' : 'auto';
    }
  }

  #adjustImage() {
    const [x, y] = getSafePosition(
      { x: this.#img.offsetLeft, y: this.#img.offsetTop },
      { width: this.#img.offsetWidth, height: this.#img.offsetHeight },
      {
        width: this.#cropper.offsetWidth,
        height: this.#cropper.offsetHeight,
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
    this.#resizeImageAfterChange();
    setTimeout(() => {
      this.#adjustImage();
    }, 200);
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
      cropHeight: this.#cropper.offsetHeight,
      cropWidth: this.#cropper.offsetWidth,
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
