import { hash } from "../crypto/hash";

type Options = {
  color?: string;
  margin?: number;
  size?: number;
};

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * @description
 * random avatar
 */
export const random = async ({
  color = "rgba(240, 240, 240, 255)",
  margin = 0.1,
  size = 32,
}: Options = {}) => {
  const _hash = await hash();
  const _size = Math.floor((size - size * margin * 2) / 5);
  const _margin = Math.floor((size - 5 * _size) / 2);

  const rectangles = Array.from({ length: 15 }).reduce<Rectangle[]>((prev, _, at) => {
    const isRender = !!(parseInt(_hash.charAt(at), 16) % 2);
    if (!isRender) return prev;

    const columns = at < 5 ? [2] : at < 10 ? [1, 3] : [0, 4];
    const row = at - (at < 5 ? 0 : at < 10 ? 5 : 10);

    prev.push(
      ...columns.map((column) => ({
        x: _margin + column * _size,
        y: _margin + row * _size,
        width: _size,
        height: _size,
      })),
    );

    return prev;
  }, []);

  const images = [
    "<svg xmlns='http://www.w3.org/2000/svg'",
    ` width='${size}'`,
    ` height='${size}'`,
    ` viewBox='0 0 ${size} ${size}'`,
    ">",
    ...rectangles.map(({ height, width, x, y }) =>
      [
        "<rect",
        ` x='${x}'`,
        ` y='${y}'`,
        ` width='${width}'`,
        ` height='${height}'`,
        ` fill='${color}'`,
        "/>",
      ].join(""),
    ),
    "</svg>",
  ];

  return `data:image/svg+xml;base64,${btoa(images.join(""))}`;
};
