import { useEffect, useState } from "react";
import { useMount } from "./use-mount";
import { isNumber } from "../is/is-number";

/**
 * @description 比较两个`css`单位的缩放比例
 */
export const useScale = (resize: string | number, originalSize: string | number) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const _parent = document.createElement("div");
    _parent.style.width = "0px";
    _parent.style.height = "0px";
    _parent.style.position = "fixed";
    _parent.style.overflow = "hidden";

    const _resizedElement = document.createElement("div");
    _resizedElement.style.width = isNumber(resize) ? `${resize}px` : resize;

    const _originalSizedElement = document.createElement("div");
    _originalSizedElement.style.width = isNumber(originalSize) ? `${originalSize}px` : originalSize;

    _parent.appendChild(_resizedElement);
    _parent.appendChild(_originalSizedElement);
    document.body.appendChild(_parent);

    const _resizedWidth = _resizedElement.offsetWidth;
    const _originalSizedWidth = _originalSizedElement.offsetWidth;

    if (_originalSizedWidth > 0) {
      setScale(_resizedWidth / _originalSizedWidth);
    } else {
      setScale(1);
    }

    _parent.remove();
  }, [resize, originalSize]);

  return scale;
};
