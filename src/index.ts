import { createWorker, type Word } from 'tesseract.js';
import { parseString, Builder } from 'xml2js';
import * as fs from 'fs';
import type { BBox, WordBox } from './types.js';

const buildSvgFromBoxes = (boxes: WordBox[]) => {
	const svgObj = {
		svg: {
			$: {
				xmlns: 'http://www.w3.org/2000/svg',
				width: '600', //TODO: make dynamic from input img
				height: '300'
			},
			text: [
				{
					tspan: [
						{ $: { x: '10', y: '20' }, _: '' } //for some reason this has to be here to start the array. cant push later otherwise
					]
				}
			]
		}
	}

	for(const box of boxes) {
		svgObj.svg.text[0]?.tspan.push({
			$: {x: box.bbox.x0.toString(), y: box.bbox.y0.toString()},
			_: box.text
		});
	}
	let builder = new Builder();
	let xml = builder.buildObject(svgObj);
	console.log(xml);
}

(async () => {
	const imageBuffer = fs.readFileSync('example_template.png'); //TODO: allow input 

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
				for(const lines of paragraphs.lines || []) {
					let wordBox: WordBox = {text: '', bbox: {x0: 0, y0: 0, x1: 0, y1: 0}, confidence: 0};
					wordBox.bbox = lines.bbox as BBox;
					wordBox.text = lines.text;
					wordBox.confidence = lines.confidence;
					boxResults.push(wordBox);
				}
			}
		}

		buildSvgFromBoxes(boxResults);
	} catch (e) {
		console.error('Error processing OCR data:', e);
	}
	await worker.terminate();
})();

