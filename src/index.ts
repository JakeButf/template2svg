import { createWorker, type Word } from 'tesseract.js';
import * as fs from 'fs';
import type { BBox, WordBox } from './types.js';

(async () => {
	const imageBuffer = fs.readFileSync('example_template.png');

	const worker = await createWorker('eng');
	const { data } = await worker.recognize(imageBuffer, {}, {blocks: true});
	
	const boxResults: WordBox[] = []

	if (data.blocks?.[0]) {
		console.log(data.blocks[0].paragraphs);
	} else {
		console.log('No blocks found in OCR result.');
	}

	try {
		for(const blocks of data.blocks || []) {
			for(const paragraphs of blocks.paragraphs || []) {
				let wordBox: WordBox = {text: '', bbox: {x0: 0, y0: 0, x1: 0, y1: 0}, confidence: 0};
				wordBox.bbox = paragraphs.bbox as BBox;
				wordBox.text = paragraphs.text;
				wordBox.confidence = paragraphs.confidence;
				boxResults.push(wordBox);
			}
		}

		console.log(boxResults);
	} catch (e) {
		console.error('Error processing OCR data:', e);
	}
	await worker.terminate();
})();