export type BBox = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export type WordBox = {
    text: string;
    bbox: BBox;
    confidence: number;
}